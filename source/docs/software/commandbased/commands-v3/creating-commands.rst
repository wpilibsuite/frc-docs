# Creating Commands

Commands can be created in one of three ways:

1. Using a :term:`factory method` on a :term:`Mechanism` object. These factory methods make heavy use of :doc:`lambda functions <lambda-functions>`
2. Using a static factory method from the ``Command`` interface
3. Creating a class that implements the ``Command`` interface. This approach is only recommended for very complex logic or for programmers who are uncomfortable with :term:`lambda functions`

Most robot commands should be created by mechanism factory methods. That keeps the hardware, the helper methods that directly touch hardware, and the commands that expose safe behavior all in the same class. ``Command.noRequirements()`` is useful for commands that coordinate other commands or update software-only state. Implementing ``Command`` directly is an option when the builder style is a poor fit, but it is the easiest approach to get subtly wrong because the implementation must supply every part of the command contract itself - notably, passing all required mechanisms to the constructor.

## Where to put Commands

A key idea in the commands framework is that of requirements: every command requires some number of mechanisms, and each mechanism may only be required by a single running command at a time. This prevents conflicting or dangerous control requests being issued: for example, if an "arm up" command is started while an "arm down" command is running, the "arm down" command will stop - if these commands weren't using the requirements system, then the arm would be commanded to go both up *and* down simultaneously.

The requirement system can only protect hardware that is controlled through commands. If other classes can reach into a mechanism and set motor outputs directly, those calls bypass the scheduler entirely. It is therefore *strongly* recommended to use the following system when writing code that controls physical hardware:

1. Write a class that implements the ``Mechanism`` interface
2. Most fields in the class should be ``private`` to prevent external access. :doc:`Trigger <triggers>` fields can be ``public`` so other mechanisms or external code can check on the state of the mechanism. Constants can also be public.
3. Make all methods that use those fields to control hardware also ``private``
4. Write public ``Command``-returning methods for all control of the mechanism

Public sensor accessors and triggers are fine, and are often useful. Reading a sensor does not fight with a command that owns the mechanism, but directly commanding an actuator does. The goal is not to hide all information from the rest of the robot program; the goal is to make every hardware-changing action pass through the scheduler's ownership rules to ensure every mechanism is only trying to do one thing at a time.

```java
import org.wpilib.command3.Command;
import org.wpilib.command3.Mechanism;
import org.wpilib.hardware.motor.PWMSparkMax;
import org.wpilib.hardware.rotation.Encoder;

public class ExampleArm implements Mechanism {
  // This motor controller is declared private to guarantee that it can't be used
  // dangerously, outside of the command requirements system
  private final PWMSparkMax pivotMotor = new PWMSparkMax(1);
  private final Encoder pivotEncoder = new Encoder(1, 2);

  // Triggers can be and are encouraged to be public. They can't control the mechanism,
  // and make it easier to coordinate complex actions
  public final Trigger isUp = new Trigger(() -> pivotEncoder.getDistance() >= 90);
  public final Trigger isDown = new Trigger(() -> pivotMotor.getDistance() <= 0);

  public ExampleArm() {
    setDefaultCommand(stop());
  }

  // This method controls the motor directly.
  // It's private for the same reason the field is - to prevent dangerous usage
  private void stopMotor() {
    pivotMotor.setVoltage(0);
  }

  // This factory method returns a Command.
  // It's public because all hardware control should go through commands
  // instead of unsafe method calls.
  public Command stop() {
    // `run` and `runRepeatedly` will automatically require the mechanism
    // so we don't need to manually spell it out every time
    return runRepeatedly(this::stopMotor).named("Stop Arm");
  }

  public Command up() {
    return run(coroutine -> {
      pivotMotor.set(0.5);
      coroutine.waitUntil(isUp);
      pivotMotor.set(0);
    }).named("Arm Up");
  }

  public Command down() {
    return run(coroutine -> {
      pivotMotor.set(-0.5);
      coroutine.waitUntil(isDown);
      pivotMotor.set(0);
    }).named("Arm Down");
  }
}
```


## Looping Commands

Most commands need to run for more than a single loop cycle. This is done by using a loop (like ``while``) and calling ``coroutine.yield()`` at the end of every loop to allow other commands to run.

.. warning:: Calling ``coroutine.yield()`` is required to prevent commands from being greedy - if a command never yields, no other commands will be able to run and driver inputs will not be read until the command exits. WPILib will check ``while`` loops at compile-time to ensure that loops inside of command code will yield, and issue a compiler error if any greedy loops are found.

```java
public Command driveForward() {
  return run(coroutine -> {
    while (distance < 10) {
      drive.setSpeed(0.5);
      coroutine.yield(); // Required to allow other commands to run!
    }
    drive.setSpeed(0);
  }).named("Drive Forward");
}
```

If you have a command that only needs to run the same piece of code every loop cycle, you can use the ``runRepeatedly`` factory method on a mechanism. This method automatically handles the loop and the yield for you.

```java
public Command stop() {
  return runRepeatedly(() -> motor.set(0)).named("Stop");
}
```

Use ``runRepeatedly`` for simple "do this every scheduler cycle" behavior, such as a default command that continuously applies joystick drive output or holds a motor at zero volts. Use ``run`` when the command has a beginning, a middle, and an end: start the motor, wait for a condition, then stop the motor. If a loop appears in a ``run`` command, that loop must include a call to a yielding method; otherwise, it's a greedy loop and will lock up the robot program. WPILib will report compilation errors any any non-yielding ``while`` loops in command code.

### Waiting for Conditions

The ``Coroutine`` class provides methods to pause a command until a condition is met. The most basic of these is ``waitUntil(BooleanSupplier)``, which pauses until the given condition returns ``true``.

```java
public Command waitForButton() {
  return run(coroutine -> {
    coroutine.waitUntil(driverController.a());
    System.out.println("Button A pressed!");
  }).named("Wait for Button");
}
```

#### Timeouts and WaitResult

Sometimes, a condition might never be met (for example, if a sensor fails or a mechanism jams). To prevent your robot from getting stuck indefinitely, you can provide a timeout to ``waitUntil``. When a timeout is provided, ``waitUntil`` returns a ``WaitResult`` object that you can use to check whether the condition was met or if the command timed out.

```java
import static org.wpilib.units.Units.Seconds;
import org.wpilib.command3.Coroutine;

public Command safeElevatorUp() {
  return run(coroutine -> {
    coroutine.fork(elevator.up());

    // Wait for the elevator to reach the top, but only for 1.25 seconds at most
    Coroutine.WaitResult result = coroutine.waitUntil(elevator::atTop, Seconds.of(1.25));

    if (result.timedOut()) {
      // The elevator took too long! It might be jammed. Bail early.
      elevator.setJamAlert();
      return;
    }

    // ... do more things, confident that the elevator is in place
  }).named("Safe Elevator Up");
}
```

Timeouts are most useful around physical state changes: elevators reaching a height, arms hitting a limit, flywheels reaching speed, or drivetrains arriving at a pose. A timeout should normally lead to an explicit fallback such as stopping the mechanism, retrying a safer action, or exiting the larger routine early. It may be dangerous to ignore a timeout

## One-Shot Commands

A command that never yields is called a *one-shot* command. It will be mounted and run to completion before the scheduler will pick up the next command to execute. Long-running one-shot commands, such as ones that wait on data to be loaded from disk or run expensive vision or path planning algorithms, will stall the scheduler and the entire robot program.

One-shot commands generally do one very simple thing and immediately exit without taking much time. Good examples of one-shot commands are zeroing a sensor or assigning a new value to a variable.

```java
Command.noRequirements(_ -> gyro.reset()).named("Reset Gyro");
Command.noRequirements(_ -> someVariable = 0).named("Reset Variable");
```

One-shot commands are not bad. They are the right tool for small pieces of immediate work. The important rule is that "does not yield" also means "does not share time". If the action might take a noticeable amount of time, write it as a yielding command or move the expensive work somewhere that will not block robot control.

.. warning:: One-shot commands should **never** control motors or actuators.

### Not For Actuation

1. One-shot commands don't appear in the default :doc:`telemetry <telemetry>`, making them harder to debug.
2. If a one-shot command is awaited by a parent command, it finishes immediately and the parent may assume that the controlled mechanism has reached the state or position set by the one-shot command.

For example, if a robot has a pneumatic slap-down intake that's prone to jams if the rollers start spinning before it's fully extended, you may want a command sequence that deploys the intake (waiting for it to fully deploy), and only then start spinning the rollers. If the deploy command is a one-shot, the sequence will *immediately* start to spin the rollers instead of waiting like it's supposed to.

```java
Command startIntaking() {
  return Command.noRequirements(coroutine -> {
    coroutine.await(intakeWrist.deployIntake());
    coroutine.await(intakeRollers.run());
  }).named("Start Intaking");
}

// Bad: returns immediately, and a sequence using it immediately moves to the next command
public Command deployIntake() {
  return run(_ -> solenoid.set(FORWARD)).named("Bad Intake Deploy");
}

public Command deployIntake() {
  return run(coroutine -> {
    solenoid.set(FORWARD);

    // Good: wait until a sensor tells you the intake is down
    coroutine.waitUntil(() -> wristEncoder.getPosition() <= WRIST_DEPLOYED_ANGLE);

    // Decent: If there's no sensor, wait for about as much time as it takes to deploy
    // This can be inconsistent depending on available air pressure and load on the intake,
    // so it's not as good as using sensor feedback
    coroutine.wait(Seconds.of(0.35));
  }).nameD("Better Intake Deploy")
}
```

## Complex Command Logic

For more complex logic, you can use the various methods on the ``Coroutine`` object to coordinate multiple actions.

### Waiting

You can pause a command for a certain amount of time or until a condition is met.

```java
public Command waitAndThen() {
  return run(coroutine -> {
    System.out.println("Starting...");

    coroutine.wait(Seconds.of(2));
    System.out.println("2 seconds later!");

    coroutine.waitUntil(trigger);
    System.out.println("Triggered!");
  }).named("Wait Example");
}
```

The resolution of ``coroutine.wait()`` is the scheduler loop period. With a 20 ms robot loop, a wait for 1 ms and a wait for 19 ms both resume on a later scheduler cycle, not exactly at the requested timestamp. This is normally fine for robot actions, but it is worth remembering when writing tests or when building routines with very short delays.

### Concurrent Execution (Forking)

If you want to start multiple actions at once, you can use ``coroutine.fork()``. Forking schedules a child command and immediately returns to the parent command. The child then runs alongside the parent until it completes, is canceled, or the parent exits.

```java
public Command parallelActions() {
  return run(coroutine -> {
    coroutine.fork(arm.up());
    coroutine.fork(intake.spin());
    coroutine.await(drive.followPath("ScorePath"));
  }).named("Parallel Actions");
}
```

Note that forking a command from within a command creates a parent-child relationship with the following properties:

* If the parent command is canceled, all of its forked children are also canceled.
* If a child command is interrupted by an external command (one not part of the same composition), the entire composition - including the parent and all other forked children - will be canceled.
* If one forked child is interrupted by *another* child of the same parent (a "sibling"), only the interrupted child and its descendants are canceled. The parent and the other siblings continue to run.

Parent-child relationships exist regardless of how the child command was scheduled. Forking a command using ``coroutine.fork()``, manually scheduling it via ``Scheduler.getDefault().schedule()``, or automatically scheduling it from a ``Trigger`` will all have the same parent-child relationship.

Use ``coroutine.await()`` when the parent needs to wait for a child command before continuing. ``await`` schedules the child if needed, then yields until that child is no longer scheduled or running. This is the v3 equivalent of writing an ordered composition, but without forcing the parent command to own every mechanism used by every child for the entire duration.

#### Interruption Example

Consider an autonomous command that forks two sub-tasks: one to control the arm and one to control the intake.

```java
public Command autoScore(Robot robot) {
  return run(coroutine -> {
    // Fork two sibling commands
    coroutine.fork(robot.arm.moveUp().named("Arm Task"));
    coroutine.fork(robot.intake.spin().named("Intake Task"));

    coroutine.await(robot.drive.followPath("ScorePath"));
  }).named("Auto Score");
}
```

If an external command (like a safety trigger) interrupts the **Arm Task**, the entire **Auto Score** composition (including the **Intake Task** and the path following) will be canceled.

#### Sibling Interruption Example

In this example, the parent command forks two siblings that both require the same mechanism. The second sibling will interrupt the first one, but the parent command will continue running.

```java
public Command siblingConflict(Robot robot) {
  return run(coroutine -> {
    // Both of these require robot.arm
    coroutine.fork(robot.arm.moveUp().named("First Sibling"));
    coroutine.fork(robot.arm.moveDown().named("Second Sibling"));

    // "Second Sibling" will interrupt "First Sibling".
    // Because they are siblings, the parent command ("siblingConflict")
    // and other forked siblings will NOT be canceled.
    coroutine.park();
  }).named("Sibling Conflict");
}
```

### Forking vs. Default Commands

It is important to understand the difference between forking a command and setting a mechanism's default command.

**Forking** a command starts it immediately in the background. It will run alongside the command that forked it, and will not be rescheduled when it finishes or is interrupted.

**Setting a default command** does not start the command immediately. Instead, it tells the scheduler to run that command whenever no other command is requiring the mechanism. If you want a default command to start immediately, fork or schedule it immediately after assigning it.

```java
// Forking: runs in the background immediately
coroutine.fork(arm.holdLastPosition());

// Move the elevator up; the arm continues to hold position because it was forked
coroutine.await(elevator.up());

// Move the arm down; if an outer scope set a default command for the elevator,
// it runs; otherwise, the elevator is uncommanded
coroutine.await(arm.down());

// After the arm is down, there's no command in this scope that controls it.
// If an outer scope set a default command, it runs; otherwise, the arm is uncommanded.
```

```java
// Setting a default command: it will only start if the arm is uncommanded
arm.setDefaultCommand(arm.holdLastPosition());

// If you want the new default command to start immediately (if the arm is idle),
// you can fork its getter.
coroutine.fork(arm.getDefaultCommand());

// Move the elevator up; the arm continues to hold position
coroutine.await(elevator.up());

// Move the arm down; if an outer scope set a default command for the elevator,
// it runs; otherwise, the elevator is uncommanded
coroutine.await(arm.down());

// Once arm.down() completes, the arm is uncommanded in this scope,
// so its default command (holdLastPosition) starts automatically.
```
