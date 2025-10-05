# Commands v3: Imperative Commands with Coroutines (Advanced)

This article introduces the new Commands v3 framework, which lets you write command bodies in an imperative style using coroutines. Instead of building long chains of small lambdas, you can write the steps of an action in order, use simple loops and if-statements, and pause with a single call to yield control back to the scheduler. The result is code that’s easier to read, easier to maintain, and often closer to the way you think about the robot’s behavior.

.. note::
   Commands v3 currently targets Java and requires the commands scheduler to run on a single thread. You still use the normal WPILib project structure and call the scheduler from ``robotPeriodic()``.

## What’s New at a Glance

- Imperative command bodies that can pause and resume using a ``Coroutine``.
- A new base class, ``Mechanism``, replaces the v2 notion of a “subsystem” in this framework. Mechanisms still act as exclusive resources for commands.
- Command composition remains (sequences, parallels, races), plus coroutine helpers like ``await()``, ``awaitAll()``, ``awaitAny()``, and ``fork()`` for fine-grained orchestration.
- Explicit command naming is part of the builder pattern for better debugging and dashboards.
- Command priorities allow interrupt rules stronger than simple “interrupt or reject”.

If you’re familiar with v2, you can keep composing commands the same way. The main difference is that you can now write the body of a command like normal code and use ``coroutine.yield()`` inside loops to let other commands run.

## Quick Primer: Async/Await and Coroutines

Async/await is a programming style where long tasks can “pause” so other things keep running. In Commands v3, the ``Coroutine`` passed into your command body provides that pause point via ``yield()`` and convenient helpers:

- ``yield()``: Pause this command so the scheduler can run others. Call this inside loops.
- ``await(command)``: Schedule another command and wait until it finishes before continuing.
- ``awaitAll(commands)``: Schedule several commands and wait until they all finish.
- ``awaitAny(commands)``: Schedule several commands and continue when the first one finishes (the rest are canceled).
- ``wait(time)`` and ``waitUntil(condition)``: Delay or block until a condition is true.
- ``park()``: Pause forever until this command is canceled or interrupted.

Important: There is no special ``async`` keyword in Java here. Commands are naturally asynchronous because they yield control back to the scheduler.

.. warning::
   - Always call ``coroutine.yield()`` in any loop. If you don’t, your robot program can stall in an unrecoverable infinite loop.
   - Don’t call ``yield()`` inside ``synchronized`` blocks or methods. Prefer using locks or, better, structuring code to avoid locks.
   - The command scheduler must run on a single thread. Do not use it from virtual threads or other threads.

## Setting Up the Scheduler

Call the v3 scheduler every loop in ``robotPeriodic()``:

.. tab-set-code::

  ```java
  import org.wpilib.commands3.Scheduler;
  import edu.wpi.first.wpilibj.TimedRobot;

  public class Robot extends TimedRobot {
    @Override
    public void robotPeriodic() {
      Scheduler.getDefault().run();
    }
  }
  ```

.. note::
   v3 lives in the ``org.wpilib.commands3`` package, while v2 lives in ``org.wpilib.commands2``. You cannot mix schedulers or command types across versions. Migrate commands and the scheduler together.

## Mechanisms (Like v2 Subsystems)

Mechanisms represent robot hardware groupings and act as exclusive resources. Only one running command may require a given mechanism at a time. Set an idle default (like v2 default commands) and build commands from mechanisms:

.. tab-set-code::

  ```java
  import org.wpilib.commands3.Mechanism;
  import org.wpilib.commands3.Command;
  import org.wpilib.commands3.Coroutine;
  import static edu.wpi.first.units.Units.Seconds;

  public class Drivetrain extends Mechanism {
    public Drivetrain() {
      // Default: stop motors every loop when nothing else owns the drivetrain
      setDefaultCommand(runRepeatedly(this::stop).withPriority(Command.LOWEST_PRIORITY)
                       .named("Drive[IDLE]"));
    }

    // Private hardware control
    private void tank(double left, double right) { /* set motor outputs */ }
    private void stop() { tank(0, 0); }
    private void resetEncoders() { /* ... */ }

    // Public sensor reading
    public double getDistanceMeters() { return 0.0; }

    // Public command factory
    public Command driveForTime() {
      return run(coroutine -> {
        tank(0.5, 0.5);
        coroutine.wait(Seconds.of(2));
        stop();
      }).named("Drive 2s");
    }
  }
  ```

.. note::
   ``Mechanism`` provides ``run(Consumer<Coroutine>)`` to build a command for that mechanism and ``runRepeatedly(Runnable)`` for simple periodic loops where the body runs every cycle.

## Writing Imperative Commands

Here’s a classic “drive a distance” example side-by-side. v3 lets you write the steps in-order with a loop and a yield.

.. rubric:: v3 (coroutines)

.. code-block:: java

  Command driveTenFeet = drivetrain
    .run(coroutine -> {
      drivetrain.resetEncoders();
      while (drivetrain.getDistanceMeters() < 3.048) { // ~10 ft
        drivetrain.tank(0.5, 0.5);
        coroutine.yield(); // let the scheduler run others
      }
      drivetrain.stop();
    })
    .named("Drive 10 ft");

.. rubric:: v2 (equivalent)

.. code-block:: java

  Command driveTenFeet =
    Commands.runOnce(drivetrain::resetEncoders, drivetrain)
      .andThen(new RunCommand(() -> drivetrain.tank(0.5, 0.5), drivetrain)
        .until(() -> drivetrain.getDistanceMeters() >= 3.048))
      .finallyDo(drivetrain::stop)
      .withName("Drive 10 ft");

Both versions do the same thing. The v3 version reads like the steps you’d write on a whiteboard, and the ``yield()`` keeps the program responsive.

## Useful Coroutine Helpers

.. tab-set-code::

  ```java
  // Wait for time
  command = Command.waitFor(Seconds.of(0.25)).named("Delay 250ms");

  // Wait until a condition is true
  command = Command.waitUntil(() -> arm.atGoal()).named("Wait For Arm");

  // Await another command (schedule it if needed)
  Command score = Command.noRequirements().executing(coroutine -> {
    coroutine.await(drivetrain.driveToPose(...));
    coroutine.await(arm.moveTo(...));
    coroutine.await(gripper.release());
  }).named("Score Piece");

  // Run several, continue when any one finishes (others are canceled)
  Command pickAny = Command.noRequirements().executing(coroutine -> {
    coroutine.awaitAny(drivetrain.driveToPose(...), vision.alignToTag(...));
  }).named("Drive Or Align");

  // Keep running until canceled (great for “hold while button pressed”)
  Command holdIntake = intake.run(coroutine -> {
    intake.on();
    coroutine.park(); // never exits on its own
  }).whenCanceled(intake::off).named("Hold Intake");

  // Drive repeatedly, but stop automatically when a condition trips
  Command driveUntilBeamBreak = drivetrain
    .runRepeatedly(() -> drivetrain.tank(0.4, 0.4))
    .until(() -> sensors.beamBroken())
    .named("Drive Until Beam");
  ```

## Composing Commands (v3 and v2 Parallels)

You can still build sequences and parallels, and also combine them with coroutine helpers when you need finer control.

- Sequence (then, then, then)

  .. tab-set-code::

    ```java
    Command auto = Command
      .sequence(
        drivetrain.driveToPose(...),
        arm.moveTo(...),
        gripper.release())
      .withAutomaticName();
    ```

- Parallel (all run together, finishes when all are done)

  .. tab-set-code::

    ```java
    Command spinupAndAim = shooter.spinUpToRPM(...)
      .alongWith(hood.moveTo(...), turret.aim(...))
      .withAutomaticName();
    ```

- Race (run together, finish when any finishes; others are canceled)

  .. tab-set-code::

    ```java
    Command driveOrTimeout = drivetrain.driveToPose(...)
      .raceWith(Command.waitFor(Seconds.of(2)).named("Timeout"))
      .withAutomaticName();
    ```

.. note::
   Composition groups require all mechanisms that any inner command needs for the entire lifetime of the group. If you want to release mechanisms between steps, write the flow imperatively and use ``await(...)`` so each step only owns what it needs while it runs.

## Priorities and Naming

- ``withPriority(int)`` sets a command’s priority. A new command that conflicts with a running command only starts if it has equal or higher priority. Defaults to ``0``; idle defaults use ``LOWEST_PRIORITY``.
- Naming is required when you build a command (``.named("...")``) or you can auto-name groups (``withAutomaticName()``). Good names make debugging and dashboards much clearer.

.. tab-set-code::

  ```java
  // High-priority stop that interrupts anything lower
  Command eStop = drivetrain
    .run(coro -> { drivetrain.stop(); })
    .withPriority(1000)
    .named("E-STOP");
  ```

## Triggers and Controller Bindings

Triggers work the same conceptually as v2: bind conditions or controller buttons to schedule commands.

.. tab-set-code::

  ```java
  import org.wpilib.commands3.Trigger;
  import org.wpilib.commands3.Command;
  import org.wpilib.commands3.button.CommandXboxController;

  public class RobotContainer {
    private final CommandXboxController driver = new CommandXboxController(0);

    public RobotContainer(Drivetrain drivetrain, Intake intake) {
      // on press: start; on release: cancel
      driver.rightBumper().whileTrue(
        intake.run(coroutine -> { intake.on(); coroutine.park(); })
              .whenCanceled(intake::off)
              .named("Hold Intake"));

      // Simple on-press action
      driver.a().onTrue(drivetrain.driveForTime());
    }
  }
  ```

See also: :ref:`docs/software/commandbased/commands-v2/binding-commands-to-triggers:Binding Commands to Triggers`.

## Safety and Gotchas

- Always ``yield()`` inside loops; otherwise the scheduler can’t run other commands.
- Don’t call ``yield()`` inside ``synchronized`` code. Consider alternatives to locks in command code.
- Keep the scheduler single-threaded. Call ``Scheduler.getDefault().run()`` from ``robotPeriodic()``.
- Child commands can’t outlive their parent. Use ``fork()`` and ``await()`` for structured concurrency inside a command.

## Mapping v2 to v3

- Subsystem → Mechanism (exclusive resource that can have a default command).
- ``RunCommand(() -> ...)`` → ``mechanism.runRepeatedly(() -> ...)`` or ``mechanism.run(coro -> { ...; coro.park(); })`` if it should only stop on cancel.
- ``StartEndCommand(start, end)`` → ``mechanism.run(coro -> { start.run(); coro.park(); }).whenCanceled(end)``.
- ``Commands.waitSeconds(t)`` → ``Command.waitFor(Seconds.of(t))``.
- ``command.until(cond)`` (decorator) → ``command.until(cond)`` (builder) or write the condition with a loop and ``yield()``.
- Scheduling other commands mid-flow → use ``coroutine.await(otherCommand)`` (no v2 analog except nested groups).

If you prefer the v2 composition style, you can keep using sequences and parallels in v3. The imperative coroutine style is most helpful when logic is easier to read as a straightforward series of steps.

## Debugging and Telemetry

- Give commands clear names with ``.named("...")``; group builders also support ``withAutomaticName()``.
- ``Mechanism.getRunningCommands()`` helps you inspect what currently owns a mechanism.
- The scheduler tracks all queued and running commands and can emit lifecycle events; see :ref:`docs/software/commandbased/commands-v2/command-scheduler:The Command Scheduler` for details.

## Further Reading

- :ref:`docs/software/commandbased/commands-v2/what-is-command-based:What Is "Command-Based" Programming?`
- :ref:`docs/software/commandbased/commands-v2/commands:Commands`
- :ref:`docs/software/commandbased/commands-v2/command-compositions:Command Compositions`
- :ref:`docs/software/commandbased/commands-v2/binding-commands-to-triggers:Binding Commands to Triggers`
- :ref:`docs/software/commandbased/commands-v2/command-scheduler:The Command Scheduler`
