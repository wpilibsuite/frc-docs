# Migrating from Commands v2

This page is for teams that already know the commands v2 framework and want to understand how the same ideas appear in commands v3. The goal is not to mechanically translate every class name. The goal is to preserve the intent of the robot code while using the v3 tools that express that intent directly.

Most of the familiar concepts still exist: commands, requirements, triggers, default commands, cancellation, and command composition. The major change is how command logic is written and how composed commands own mechanisms while they run.

## The Big Shift

In commands v2, command behavior is commonly split across lifecycle methods such as ``initialize()``, ``execute()``, ``isFinished()``, and ``end()``. In commands v3, command behavior is written as one :term:`coroutine`-backed function. Setup code goes before the loop, repeated work goes in the loop, finishing happens by returning from the function, and cleanup code runs at the end of the function just before it returns.

v3 commands are primarily expected to be created using builder objects, similar to the v2 fluent API where methods are chained together to configure the command object. A key change in the fluent API is that command names are now **required**; it's impossible to create a command without a name. Names are used in the v3 telemetry data (see :doc:`telemetry`) and are crucial for debugging.

The v3 command function is free-form and flexible and promotes standard Java language features instead of a custom domain-specific language (DSL). If a command needs to run something repeatedly, use a standard Java ``while`` loop; if a command needs to do just one thing and exit, then just don't use ``yield``.

.. tab-set::

  .. tab-item:: v2 Class-Based Command
    :sync: v2-class-commands

    ```java
    public class MoveArmUp extends Command {
      private final Arm arm;

      public MoveArmUp(Arm arm) {
        this.arm = arm;
        addRequirements(arm);
      }

      @Override
      public void initialize() {
        arm.setVoltage(4);
      }

      @Override
      public void execute() {
        // Optional repeated work.
      }

      @Override
      public boolean isFinished() {
        return arm.atTop();
      }

      @Override
      public void end(boolean interrupted) {
        arm.stop();
      }
    }
    ```

  .. tab-item:: v2 Fluent Command
    :sync: v2

    ```java
    public Command up() {
      return startEnd(
          () -> setVoltage(4),
          this::stop
        ).until(this::atTop)
         .withName("Arm Up");
    }
    ```

  .. tab-item:: v3 Command
    :sync: v3

    ```java
    public Command up() {
      return run(coroutine -> {
        setVoltage(4);
        coroutine.waitUntil(this::atTop);
        stop();
      }).named("Arm Up");
    }
    ```

The v3 version reads in the order the robot acts: start moving, wait until the arm is up, then stop. ``waitUntil()`` yields while it waits, so other commands and triggers continue to run.

## Subsystems Become Mechanisms

The v2 ``Subsystem`` corresponds to v3's ``Mechanism`` interface. Most of the ``Subsystem`` behaviors still apply to ``Mechanism``, such as providing command factories and acting as requirements for commands.

v3 provides the following factory methods:

- ``run(Consumer<Coroutine>)`` - starts building a coroutine-based command. Add command logic goes in the lambda function passed to this method. Does not directly correspond with any v2 factory, but acts like ``runOnce`` if the command body never yields or awaits any child commands.
- ``runRepeatedly(Runnable)`` - starts building a command that executes the same function over and over until the end condition is reached. Corresponds with v2's ``run`` factory.
- ``idle()`` - creates a command that does nothing. Users can override this to do things like explicitly turning off motors.
- ``idleFor(Time)`` - creates an idle command from ``idle()`` and gives it a timeout. It can be convenient for simple timed sequences,

However, there is no similar API to the subsystem-level ``periodic()`` function. If you need to run a periodic function outside of the commands framework, such as reading sensor inputs or updating telemetry, call that function directly in the relevant method (often  ``robotPeriodic()`` in your main robot class).

.. tab-set::

  .. tab-item:: v2 Subsystem
    :sync: v2

    ```java
    public class Elevator extends SubsystemBase {
      private final MotorController motor = ...;
      private final Encoder encoder = ...;

      private static final double MAX_HEIGHT = ...;
      private double position;

      public Elevator() {
        setDefaultCommand(holdPosition());
      }

      @Override
      public void periodic() {
        this.position = encoder.getDistance();
      }

      private void setVoltage(double volts) {
        motor.setVoltage(volts);
      }

      public boolean atTop() {
        return position >= MAX_HEIGHT;
      }

      public Command up() {
        return startEnd(
            () -> setVoltage(6),
            () -> setVoltage(0)
          ).until(this::atTop)
           .withName("Elevator Up");
      }

      public Command holdPosition() {
        return run(() -> setVoltage(feedforwardForCurrentHeight())
                .withName("Hold Elevator");
    }
    ```

  .. tab-item:: v3 Mechanism
    :sync: v3

    ```java
    public class Elevator implements Mechanism {
      private final MotorController motor = ...;
      private final Encoder encoder = ...;

      private static final double MAX_HEIGHT = ...;
      private double position;

      public Elevator() {
        setDefaultCommand(holdPosition());
      }

      public void updateInputs() {
        // Call this in robotPeriodic()
        this.position = encoder.getDistance();
      }

      private void setVoltage(double volts) {
        motor.setVoltage(volts);
      }

      public boolean atTop() {
        return position >= MAX_HEIGHT;
      }

      public Command up() {
        return run(coroutine -> {
          setVoltage(6);
          coroutine.waitUntil(this::atTop);
          setVoltage(0);
        }).named("Elevator Up");
      }

      public Command holdPosition() {
        return runRepeatedly(() -> setVoltage(feedforwardForCurrentHeight()))
          .withPriority(Command.LOWEST_PRIORITY)
          .named("Hold Elevator");
      }
    }
    ```

Reading mechanism state can still be public. Direct actuator control should usually be private. That keeps hardware-changing actions inside commands, where the scheduler can enforce requirements.

## Priorities

v2 had a simple priority system: a command can either always be interrupted by a conflicting command (via ``kCancelSelf``, which was the default setting), or could always ignore a conflicting command (via ``kCancelIncoming``). In effect, a command would either have the absolute *minimum* priority, always interruptible by other commands, or the absolute *maximum* priority, never interruptible by other commands.

Commands v3 an integer-based priority system, using the full range of integer values. The default priority is 0, but can be specified in the full 32-bit integer range of -2^31 through 2^31-1. If two commands conflict:

- A higher-priority scheduled command interrupts the lower-priority running command.
- An equal-priority scheduled command interrupts the running command.
- A lower-priority scheduled command is discarded and does not start.

Commands in a v3 composition inherit the priority of their parent if it's higher than their own. This allows for child commands to be "promoted" and take ownership of mechanisms that are owned by otherwise higher-priority commands.

.. warning:: Default commands should usually have priority below ordinary commands, and never above 0. If a default command has the same or higher priority as normal controls, it can block behavior that should be allowed to take over the mechanism.

.. tab-set::

  .. tab-item:: v2 Priorities
    :sync: v2

    ```java
    // kCancelIncoming means this command can never be interrupted.
    // It only stops if it's deliberately canceled or ends on its own.
    Command highest =
      arm.run(...)
        .withInterruptBehavior(kCancelIncoming)
        .withName("Not Interruptible");

    // The default v2 behavior means this command can always be interrupted.
    Command normal =
      arm.run(...)
        .withName("Always Interruptible");
    ```

  .. tab-item:: v3 Priorities
    :sync: v3

    ```java
    // In v3, this command is only interruptible by other commands with the highest priority.
    // There's no higher priority because this is 2^31-1, the largest value of an int
    Command highest =
      arm.run(...)
        .withPriority(Command.HIGHEST_PRIORITY)
        .named("Rarely Interruptible");

    // The default priority is 0. This command is interruptible by commands with a priority ≥ 0
    Command normal =
      arm.run(...)
        .named("Usually Interruptible");

    // This command is higher priority than "normal", but not as high as "highest".
    // It can interrupt the "normal" command but not the "highest" command.
    Command medium =
      arm.run(...)
        .withPriority(500)
        .named("Medium Priority");

    // This command has the absolute lowest priority.
    // Any other command can interrupt it, and it can only interrupt other lowest-priority commands.
    Command lowest =
      arm.run(...)
        .withPriority(Command.LOWEST_PRIORITY)
        .named("Always Interruptible");

    // The wrapper command has a priority = 1000, which the "lowest" command will inherit.
    // This will let it interrupt both "normal" and "medium" when it otherwise wouldn't be able to.
    Command wrapper =
      Command.noRequirements(coroutine -> coroutine.await(lowest))
        .withPriority(1000)
        .named("High Priority Wrapper");
    ```

## Requirements Still Matter

The requirements system is the same as v2: commands declare the mechanisms they control, and only one running command may require a mechanism at a time. If a new command is scheduled that conflicts with at least one running command, the scheduler compares priorities:

1. If the new command is the same or higher priority as every command it conflicts with, it is scheduled and the running commands are canceled.
2. If the new command is lower priority than *any* command it conflicts with, the new command is not canceled and all conflicting commands continue to run.

Like v2, a command created with a mechanism's ``run()`` or ``runRepeatedly()`` helper automatically requires that mechanism. If multiple requirements are needed, use the ``Command.requiring()`` method and pass it all the required mechanisms. Use ``Command.noRequirements(...)`` for commands that truly do not own hardware, or for parent commands that coordinate child commands without inheriting all of their requirements up front. Good use cases for no-requirement commands include sensor resets or debugging prints.

.. tab-set::

  .. tab-item:: v2
    :sync: v2

    ```java
    public Command intake() {
      // Automatically requires this Intake subsystem.
      return startEnd(
          () -> motor.set(0.8),
          () -> motor.set(0)
        ).until(hasGamePiece)
         .withName("Intake");
    }
    ```

  .. tab-item:: v3
    :sync: v3

    ```java
    public Command intake() {
      // Automatically requires this Intake mechanism.
      return run(coroutine -> {
        motor.set(0.8);
        coroutine.waitUntil(hasGamePiece);
        motor.set(0);
      }).named("Intake");
    }
    ```

## Default Commands

Default commands still describe what a mechanism should do when no other command owns it. A drivetrain default command might read joysticks, an elevator default command might hold position, and an intake default command might stop the motor.

The differences worth remembering are:

- A default command must require exactly the mechanism it is assigned to.
- Setting a default command does not immediately run it; the scheduler starts it when the mechanism is otherwise idle.
- Default command settings are scoped. A default set inside an OpMode or command is reverted when that scope exits.
- Default commands should usually have lower priority than ordinary commands. Lower-priority commands cannot interrupt higher-priority commands, so the default command's priority is effectively the minimum priority that's usable for that mechanism.

.. tab-set::

  .. tab-item:: v2
    :sync: v2

    ```java
    public class Drive extends SubsystemBase {
      public Drive(CommandGamepad controller) {
        setDefaultCommand(
          run(() -> arcadeDrive(controller.getLeftY(), controller.getRightX()))
            .withInterruptBehavior(kCancelSelf)
            .withName("Teleop Drive"));
      }
    }
    ```

  .. tab-item:: v3
    :sync: v3

    ```java
    public class Drive implements Mechanism {
      public Drive(CommandGamepad controller) {
        setDefaultCommand(
          runRepeatedly(() -> arcadeDrive(controller.getLeftY(), controller.getRightX()))
            .withPriority(Command.LOWEST_PRIORITY)
            .named("Teleop Drive"));
      }
    }
    ```

## Command Logic And Finishing

In v2, ``isFinished()`` decides when a command is done. In v3, ordinary control flow decides when a command is done. A command finishes naturally when its command body returns. If a v3 command needs to finish early, use a ``return`` statement.

For a command that runs until a condition is met, use ``waitUntil(...)``:

.. tab-set::

  .. tab-item:: v2
    :sync: v2

    ```java
    public Command shootWhenReady() {
      return runOnce(this::spinUp)
              .andThen(idle().until(this::atSpeed))
              .andThen(runOnce(this::feedNote))
              .finallyDo(interrupted -> {
                if (!interrupted) {
                  stop();
                }
              })
              .withName("Shoot When Ready");
    }
    ```

  .. tab-item:: v3
    :sync: v3

    ```java
    public Command shootWhenReady() {
      return run(coroutine -> {
        spinUp();
        coroutine.waitUntil(this::atSpeed);
        feedNote();
      }).named("Shoot When Ready");
    }
    ```

For a command that updates every scheduler cycle, use a loop and yield:

.. warning:: The yield is not optional. Commands v3 uses cooperative scheduling: a command gives other commands time to run by calling ``yield()``, ``wait()``, ``waitUntil()``, ``await()``, ``awaitAll()``, ``awaitAny``, or ``park()``. The WPILib compiler plugin detects ``while`` loops without a call to a yielding method and flags them with a compilation error.

.. tab-set::

  .. tab-item:: v2
    :sync: v2

    ```java
    public Command driveDistance(double meters) {
      return startRun(
          this::resetDistance,
          () -> setSpeed(0.5)
        ).until(() -> getDistance() >= meters)
         .finallyDo(this::stop)
         .withName("Drive Distance");
    }
    ```

  .. tab-item:: v3
    :sync: v3

    ```java
    public Command driveDistance(double meters) {
      return run(coroutine -> {
        resetDistance();
        while (getDistance() < meters) {
          setSpeed(0.5);
          coroutine.yield();
        }
        stop();
      }).named("Drive Distance");
    }
    ```

## One-Shot Commands

A v2 ``InstantCommand`` usually becomes a one-shot v3 command: a command that does a small amount of work and returns without yielding.

One-shot commands are appropriate for quick state changes: resetting a sensor, updating a flag, printing a diagnostic message, or clearing an alert. They are not appropriate for blocking I/O, expensive calculations, or anything that may take enough time to delay robot control.

.. tab-set::

  .. tab-item:: v2
    :sync: v2

    ```java
    public Command resetGyro() {
      return Commands.runOnce(gyro::reset).withName("Reset Gyro");
    }
    ```

  .. tab-item:: v3
    :sync: v3

    ```java
    public Command resetGyro() {
      return Command.noRequirements(_ -> gyro.reset()).named("Reset Gyro");
    }
    ```

## Command Groups And Coroutine Composition

Commands v3 has fluent command group builders like v2:

- ``Command.sequence(...)`` and ``commandA.andThen(commandB)``
- ``Command.parallel(...)`` and ``commandA.alongWith(commandB)``
- ``Command.race(...)`` and ``commandA.raceWith(commandB)``

These are useful for straightforward compositions, and behave much like their v2 equivalents.

v3's ``SequentialGroup`` and ``ParallelGroup`` retain the v1 and v2 behavior of owning all mechanisms used by all commands in the group, even when those inner commands are otherwise not running. This behavior is intentional, since it allows command groups to be interrupted at any point when a conflicting command is scheduled, but will result in uncommanded behavior for mechanisms owned by the group but not controlled by a running command within the group.

Complex command sequences can be built using the v3 ``StateMachine`` API (see :doc:`state-machines`)

There are some key improvements in ownership and interruption behavior in v3 to be aware of:

1. The v3 scheduler is responsible for *every* command. The v2 scheduler only handled the topmost level of commands, and compositions like ``SequentialCommandGroup`` effectively acted like mini-schedulers to run the commands inside the group.
2. v3 compositions do not have to have any requirements. Because the v3 scheduler tracks parent-child relationships, an interrupt to a child command will bubble up to its parent (and its parent, and so on). Parent commands effectively inherit all of a child's requirements *while the child is running*.
3. v3 child commands inherit the priority of their parent if it's higher than their own. See Priorities_ for details.

The coroutine API is often a better migration target for complex routines because it lets mechanisms do other things when they're not actively in use by a child command.

### Handling Fork Failures

In v2, a proxy command in a command group may fail to be scheduled without any feedback to the group; the group would just continue as if the proxy command was successful. This can be problematic if a sequence of proxied commands relies on earlier commands succeeding; for example, a sequence like ``sequence(elevator.moveToScoringHeight().asProxy(), claw.open())`` is a fairly standard pattern that allows the elevator's default command - typically holding the last setpoint - to run after the elevator gets to the scoring position. However, if an elevator command with the ``kCancelIncoming`` interrupt behavior is already running when the sequence starts, the elevator *will not move at all* and the sequence skips straight to opening the claw - which may damage the claw or something else on the robot if the elevator isn't in position where it's safe to open the claw.

There is no way in v2 to detect and recover from these types of failures.

In v3, an inner command scheduled via with a coroutine's ``fork``, ``await``, ``awaitAll``, or ``awaitAny`` method will act like a v2 proxy command (and almost always as a *deferred proxy* because the inner command is typically created only when the composition is running). These coroutine methods return a result object that can be queried to see if the commands were successfully scheduled, as well as which commands succeeded and which ones failed. However, by default, the v3 framework will detect these types of failures and automatically interrupt the composition instead of allowing it to continue in a potentially unsafe way; this behavior can be turned off via ``coroutine.setCancelOnForkFailure(false)`` in the parent command. Note that manually handling the failure is delicate and may cause unsafe operation of the robot unless the failure is properly handled.

.. tab-set::

  .. tab-item:: v2 Proxy Commands
    :sync: v2

    ```java
    Command homeElevator =
      elevator.run(() -> ...)
        .until(elevator::isHomed)
        .withInterruptBehavior(kCancelIncoming)
        .withName("Home Elevator");

    Command moveToScoringHeight =
      elevator.run(() -> ...)
        .until(elevator::isAtScoringHeight)
        .withName("Move Elevator to Scoring Height");

    SequentialCommandGroup score =
      sequence(
        moveToScoringHeight.asProxy(), // skipped if "Home Elevator" is running!
        claw.open().asProxy()
      ).withName("Score Gamepiece");

    homeElevator.schedule();
    score.schedule(); // skips moving the elevator and immediately opens the claw!
    ```

  .. tab-item:: v3 Failure Handing (Automatic Interruption)
    :sync: v3

    ```java
    Command homeElevator =
      elevator.run(coroutine -> ...)
        .withPriority(1)
        .named("Home Elevator");

    Command moveToScoringHeight =
      elevator.run(coroutine -> ...)
        .named("Move Elevator to Scoring Height");

    Command score =
      Command.noRequirements(coroutine -> {
        coroutine.await(moveToScoringHeight);
        coroutine.await(claw.close());
      }).named("Score Gamepiece");

    Scheduler.getDefault().schedule(homeElevator);
    Scheduler.getDefault().schedule(score);
    ```

  .. tab-item:: v3 Failure Handling (Manual)
    :sync: v3-manual-failure-handling

    ```java
    Command homeElevator =
      elevator.run(coroutine -> ...)
        .withPriority(1)
        .named("Home Elevator");

    Command moveToScoringHeight =
      elevator.run(coroutine -> ...)
        .named("Move Elevator to Scoring Height");

    Command score =
      Command.noRequirements(coroutine -> {
        // Disable automatic interruption on fork failures so we can handle
        // the failures ourselves.
        coroutine.setCancelOnForkFailure(false);

        var elevatorMove = coroutine.await(moveToScoringHeight);
        if (elevatorMove.failed()) {
          // The elevator is doing something with a higher priority right now.
          // Bail so we don't damage the claw.
          System.err.println("Can't move the elevator to score!");
          return;
        }

        // Because this is the last command in the composition, we don't have to
        // handle a failure result - the composition will just exit - but if this
        // were a larger composition then _every_ command that's forked or awaited
        // will need error handling for safe operation.
        coroutine.await(claw.close());
      }).named("Score Gamepiece");

    Scheduler.getDefault().schedule(homeElevator);
    Scheduler.getDefault().schedule(score);
    ```

### Sequential Work

Use ``coroutine.await(...)`` to run a child command and wait until it finishes.

.. tab-set::

  .. tab-item:: v2 Sequence
    :sync: v2

    ```java
    public Command scoreSequence() {
      return Commands.sequence(
        drive.driveToScoringLocation(),
        elevator.moveToScoringHeight(),
        gripper.release()
      ).withName("Score Sequence");
    }
    ```

  .. tab-item:: v3 Sequence (builders)

    ```java
    public Command scoreSequence() {
      return drive.driveToScoringLocation()
        .andThen(elevator.moveToScoringHeight())
        .andThen(gripper.release())
        .named("Score Sequence")
    }
    ```

  .. tab-item:: v3 Sequence (coroutines)
    :sync: v3

    ```java
    public Command scoreSequence() {
      return Command.noRequirements(coroutine -> {
        coroutine.await(drive.driveToScoringLocation());
        coroutine.await(elevator.moveToScoringHeight());
        coroutine.await(gripper.release());
      }).named("Score Sequence");
    }
    ```

The parent command above requires no mechanisms. The drivetrain, elevator, and gripper are only owned while their own commands are running, which allows other commands to control them when the scoring sequence doesn't actively control them. This can be a strength because it allows default commands to run, but it also allows other commands to run that would break the sequence (such as moving the drivebase out of the scoring location while the elevator is moving, possibly tipping the robot). Care should be taken to avoid running sequence-breaking commands, or set default commands within the command


### Parallel Work

Use ``fork(...)`` to start child commands that should run in the background, or ``await``, ``awaitAll``, or ``awaitAny`` to fork and then wait for the child commands to finish.

.. tab-set::

  .. tab-item:: v2 Parallel Group
    :sync: v2

    ```java
    public Command prepareToScore() {
      return turret.aimAtGoal().alongWith(shooter.spinUp()).withName("Prepare To Score");
    }
    ```

  .. tab-item:: v3 Parallel Group (builders)


    ```java
    public Command prepareToScore() {
      return turret.aimAtGoal().alongWith(shooter.spinUp()).named("Prepare To Score");
    }
    ```

  .. tab-item:: v3 Parallel (awaitAll)
    :sync: v3

    ```java
    public Command prepareToScore() {
      return Command.noRequirements(coroutine -> {
        coroutine.awaitAll(turret.aimAtGoal(), shooter.spinUp());
      }).named("Prepare To Score");
    }
    ```

### Race Work

Use ``awaitAny(...)`` when several child commands should start and the parent should continue after the first one finishes. The remaining commands are canceled.

.. tab-set::

  .. tab-item:: v2 Race Group
    :sync: v2

    ```java
    Command intakeUntilPieceOrTimeout() {
      return intake.intake()
        .raceWith(Commands.waitTime(Seconds.of(2))
        .withName("Intake Until Piece Or Timeout");
    }
    ```

  .. tab-item:: v3 Race (builders)

    ```java
    public Command intakeUntilPieceOrTimeout() {
      return Command.race(
        intake.intake(),
        Command.waitFor(Seconds.of(2)).named("Intake Timeout")
      ).named("Intake Until Piece Or Timeout");
    }
    ```

  .. tab-item:: v3 Race (awaitAny)
    :sync: v3

    ```java
    public Command intakeUntilPieceOrTimeout() {
      return Command.noRequirements(coroutine -> {
        coroutine.awaitAny(
          intake.intake(),
          Command.waitFor(Seconds.of(2)).named("Intake Timeout"));
      }).named("Intake Until Piece Or Timeout");
    }
    ```

For simple race groups, ``Command.race(...)`` is also available. Use explicit coroutine logic when the next step depends on which condition won or when you need additional fallback behavior.

## Proxy Commands And Smart Requirements

In v2, teams often used proxy commands or schedule-command patterns to avoid a composition inheriting requirements too early. For example, a large autonomous command might not want to require the elevator for the full routine if the elevator is only used near the end.

In v3, this pattern is built into coroutine composition. A parent command can require no mechanisms and ``await()`` child commands as needed. The child command owns its requirements while it runs, and releases them when it completes. Child commands can also share requirements with their parents; the scheduler automatically detects the parent-child relationship and won't interrupt the parent. In v2, sharing requirements between parent and child commands would result in the child interrupting its parent.

.. tab-set::

  .. tab-item:: v2
    :sync: v2

    ```java
    public Command autonomousScore() {
      return Commands.sequence(
        drive.followPath("ScorePath").asProxy(),
        elevator.moveToScoringHeight().asProxy(),
        gripper.release().asProxy()
      ).withName("Autonomous Score");
    }
    ```

  .. tab-item:: v3
    :sync: v3

    ```java
    public Command autonomousScore() {
      return Command.noRequirements(coroutine -> {
        // Owns only the drivetrain while this child runs.
        coroutine.await(drive.followPath("ScorePath"));

        // Owns only the elevator while this child runs.
        coroutine.await(elevator.moveToScoringHeight());

        // Owns only the gripper while this child runs.
        coroutine.await(gripper.release());
      }).named("Autonomous Score");
    }
    ```

This is often the cleanest replacement for v2 proxy-heavy code. The requirements are local to the actions that actually use them, but the larger routine still cancels as a unit if one of its children is externally interrupted.

## Triggers And Bindings

Most trigger bindings carry over by name or by intent: ``onTrue``, ``onFalse``, ``whileTrue``, ``whileFalse``, and toggle bindings all exist in v3. The important new idea is :doc:`scopes`: a binding created in the robot constructor is global and will always be active; a binding created while an OpMode is running is only active while that OpMode is selected on the driverstation, and will be deleted when the OpMode changes; and a binding created inside a running command is removed when that command exits, and any command attached to that binding is canceled.

```java
public Command aimAndShootWhenReady() {
  return Command.noRequirements(coroutine -> {
    // This binding only exists while aimAndShootWhenReady is running.
    shooter.atSpeed.onTrue(feeder.feedOnce());

    // shooter.spinUp() only runs while aimAndShootWhenReady is running,
    // and will be canceled when aimAndShootWhenReady exits
    coroutine.fork(shooter.spinUp());

    coroutine.await(turret.aimAtGoal());
  }).named("Aim And Shoot When Ready");
}
```

New in v3 are the ``retryWhileTrue`` and ``retryWhileFalse`` bindings. A retry binding restarts its command if the command finishes while the trigger signal is still active, unlike ``whileTrue`` or ``whileFalse`` which will not restart the the command if it finishes or is interrupted before the trigger condition changes. They act similar to a v2-style ``whileTrue(command.repeatedly())`` binding.

## Cancellation And Interruption

The same cancellation and interruption concepts carry over from v2 in v3: cancellation means the command was stopped before its natural completion; interruption is a particular kind of cancellation specifically caused by another command taking ownership of a required mechanism, rather than being canceled by a trigger binding or a manual call to the scheduler's ``cancel()`` method.

Use ``whenCanceled(...)`` for cleanup that must happen when a command is canceled. Note that this runs regardless of *why* the command was canceled.

```java
public Command runRollerUntilLoaded() {
  return run(coroutine -> {
    roller.set(0.6);
    coroutine.waitUntil(hasGamePiece);
    roller.set(0);
  }).whenCanceled(() -> roller.set(0))
    .named("Run Roller Until Loaded");
}
```

Do not put long loops in cancellation cleanup. Cancellation cleanup should be short and single-shot: stop a motor, clear a flag, or close a resource.

Scheduler telemetry reports these cases separately. A command that finishes normally emits ``Completed``. A command that is interrupted emits ``Interrupted`` followed by ``Canceled``. A command that throws emits ``CompletedWithError`` and the exception still propagates, bubbling up to the scheduler ``run()`` call and crashing the robot program; the WPILib framework will print the exception and its stacktrace to the driver station console for operators to see and debug the program.

## Common Migration Recipes

### Default Drive Command

.. tab-set::

  .. tab-item:: v2
    :sync: v2

    ```java
    public class Drive extends SubsystemBase {
      public Command teleopDrive(CommandGamepad controller) {
        return run(() -> arcadeDrive(controller.getLeftY(), controller.getRightX())
          .withName("Teleop Drive");
      }
    }
    ```

  .. tab-item:: v3
    :sync: v3

    ```java
    public class Drive implements Mechanism {
      public Command teleopDrive(CommandGamepad controller) {
        return runRepeatedly(() -> arcadeDrive(controller.getLeftY(), controller.getRightX()))
          .withPriority(Command.LOWEST_PRIORITY)
          .named("Teleop Drive");
      }
    }
    ```

### Timed Command

.. tab-set::

  .. tab-item:: v2
    :sync: v2

    ```java
    public Command outtakeFor(Time duration) {
      return startEnd(
          () -> motor.set(-0.7),
          () -> motor.set(0)
        ).withTimeout(duration)
          .withName("Timed Outtake");
    }
    ```

  .. tab-item:: v3
    :sync: v3

    ```java
    public Command outtakeFor(Time duration) {
      return run(coroutine -> {
        motor.set(-0.7);
        coroutine.wait(duration);
        motor.set(0);
      }).named("Timed Outtake");
    }
    ```

For a timeout around an existing command, use ``withTimeout(...)``:

```java
Command safeMoveToTop = elevator.up().withTimeout(Seconds.of(1.5));
  ```

### Conditional Wait With Fallback

The coroutine ``waitUntil`` method takes an optional timeout parameter so the wait doesn't last forever. For example, an elevator may be jammed if it doesn't reach a set position within the expected timeframe.

```java
public Command safeMoveToTop() {
  return run(coroutine -> {
    motor.setVoltage(6);
    WaitResult result = coroutine.waitUntil(this::atTop, Seconds.of(1.5));
    motor.setVoltage(0);

    if (result.timedOut()) {
      setJamAlert();
    } else {
      clearJamAlert();
    }
  }).named("Safe Move To Top");
}
```

## What Not To Carry Over

Avoid mechanically recreating v2 structure when migrating to v3:

- Do not write command classes by default just to preserve lifecycle-method shape. Use mechanism factory methods unless a class genuinely makes the code clearer.
- Do not expose public motor controllers or actuator helpers and call them directly from unrelated code. Put hardware-changing behavior behind commands.
- Do not use global trigger bindings for behavior that is only valid in one OpMode or during one command.
- Do not treat ``fork()`` as fire-and-forget. Forked commands are children and are canceled when their parent exits.
- Do not use command groups everywhere by habit. For complex routines, coroutine logic is often clearer and can avoid owning mechanisms before they are needed.

The best migration usually keeps the same robot behavior, but changes the shape of the code: mechanisms own hardware, command factories describe safe actions, and larger routines coordinate those actions with ``fork()``, ``await()``, ``awaitAll()``, and ``awaitAny()``.
