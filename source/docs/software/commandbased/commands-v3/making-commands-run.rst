# Making Commands Run

There are three ways to make a command run: using a ``Trigger`` to set up a command to automatically run when some event occurs in the future; running a command from inside another command via ``Coroutine.fork(Command)`` or ``Coroutine.await(Command)``; and configuring a :term:`Mechanism` with a default command to execute when it would otherwise be idle.

Each approach describes a different kind of intent. Triggers say "when this signal changes, run this command." Forking says "this command should start now, and the parent should keep going." Awaiting says "this command should start now, and the parent should wait for it." Default commands say "when nobody else owns this mechanism, keep it in this safe or useful state."

## Triggers

Triggers allow you to set up automated behavior that runs in response to external events, such as a button press or a sensor reaching a threshold. They are the primary way to start commands outside of compositions. A trigger is checked when its event loop is polled; for the default event loop, this happens during ``Scheduler.run()``.

```java
import org.wpilib.command3.Command;
import org.wpilib.command3.Trigger;
import org.wpilib.hardware.discrete.DigitalInput;

public class Robot extends OpModeRobot {
  private final DigitalInput lowerLimitSwitch = new DigitalInput(1);

  // This trigger will be checked every time the scheduler runs.
  public final Trigger atMinLimit = new Trigger(() -> lowerLimitSwitch.get());

  public Robot() {
    // Bind a command to execute whenever the minimum limit is reached.
    atMinLimit.onTrue(
      Command.noRequirements(_ -> System.out.println("Min limit reached!")).named("Limit Message"));
  }
}
```

For more detailed information on trigger types, combining triggers, and advanced behavior, see the :doc:`triggers` page.

## Manually running a command

While triggers are the most common way to start commands in response to external events, you often need to start a command directly from within another command or when an OpMode starts. This is done using the ``Coroutine.fork()`` or ``Coroutine.await()`` methods, or rarely a direct call to ``Scheduler.getDefault().schedule()``. Regardless of the method used, the scheduler will ensure that the command does not outlive the :doc:`scope <scopes>` that scheduled it.

### Forking (Asynchronous)

``Coroutine.fork(Command)`` starts a command and returns immediately. The forked command runs concurrently with the command that started it. If the parent command is canceled, all of its forked commands are also canceled. Forking a command that conflicts with a higher-priority running command will fail; the higher-priority command continues to run and the parent command immediately continues to the next statement.

```java
public Command exampleFork() {
  return run(coroutine -> {
    // Start this command in the background.
    coroutine.fork(arm.up());

    // This code runs immediately after forking, without waiting for the arm
    System.out.println("Arm is moving up in the background...");

    // The arm will continue to move to its "up" position while the intake is extending.
    coroutine.await(intake.extend());
  }).named("Example Fork");
}
```

### Awaiting (Synchronous)

``Coroutine.await(Command)`` starts a command and pauses the current command until the child command completes. Awaiting is useful for step-by-step routines because the code reads in the same order the robot should act.

```java
public Command exampleAwait() {
  return run(coroutine -> {
    // Start the command and wait for it to finish
    coroutine.await(arm.up());

    // This code only runs after the arm has finished moving up
    System.out.println("Arm is now up!");
  }).named("Example Await");
}
```

## Scheduling Already Running Commands

If a command is already running, attempting to schedule it again will have no effect. The command will simply continue to run from its current point of execution; it will **not** be restarted or interrupted. ``fork`` and ``await`` can be combined to start running a command in the background and then wait for it to complete at a later point (assuming that it hadn't finished by then - otherwise ``await`` would start it over again).

```java
public Command duplicateScheduling() {
  return run(coroutine -> {
    Command armUp = arm.up();

    // Start the arm moving up
    coroutine.fork(armUp);

    // Attempting to schedule the same instance again while it's running does nothing.
    // The arm continues its original 'up' movement uninterrupted.
    coroutine.fork(armUp);

    // Perform another action while the arm is moving
    coroutine.await(intake.spin());

    // Similarly, awaiting a running command will wait for the existing instance to finish.
    // However, if the armUp command has exited by the time spin() finished,
    // this await call would actually start the armUp command from the beginning
    coroutine.await(armUp);
  }).named("Duplicate Scheduling");
}
```

This applies only to command *objects*. If two identical commands are scheduled - even if they both implement Java's ``equals()`` method - the scheduler still treats them as different commands, and the second command will interrupt and cancel the first:

```java
public Command createNewCommand() { return ... }

Command command1 = createNewCommand();
Command command2 = createNewCommand();

Scheduler.getDefault().schedule(command1);

// command1 is interrupted by command2, even though they're identical
Scheduler.getDefault().schedule(command2);
```

## Default Commands

Every mechanism can have a **default command** that runs whenever no other command is requiring it. This is useful for ensuring that hardware is always in a safe state. A drivetrain default command might read joysticks, an elevator default command might hold position, and an intake default command might stop the motor.

Default commands are scheduled during the scheduler's normal scheduling phase. Setting a default command changes what the scheduler will choose next time the mechanism is idle; it is not an immediate call to start the command's logic. See the :doc:`mechanisms` page for more details.
