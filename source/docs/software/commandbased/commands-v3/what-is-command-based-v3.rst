# What Is Commands v3?

Commands v3 is WPILib's next-generation command-based framework for Java. It introduces imperative-style command writing using coroutines, allowing you to write robot behaviors as straightforward sequential code instead of complex chains of lambda expressions and decorators.

.. warning::
   Commands v3 requires **Java 21 or later** and is **Java-only**. If you need C++, Python, or earlier Java versions, use :ref:`docs/software/commandbased/commands-v2/index:Commands v2 Programming`.

## Command-Based Programming Philosophy

Like Commands v2, Commands v3 is a :term:`design pattern` for organizing robot software. It's not the only way to write a robot program, but it's effective for creating clean, maintainable, and reusable code.

## Declarative vs Imperative: An Example

Consider a command that extends a piston when a condition becomes true.

**Trigger style:**

.. code-block:: java

   import org.wpilib.commands3.Trigger;

   new Trigger(() -> condition.get())
     .onTrue(pneumatics.run(coro -> piston.set(Value.kForward)).named("Extend"));

**Coroutine style:**

.. code-block:: java

   Command extendWhenReady = Command.noRequirements()
     .executing(coroutine -> {
       coroutine.waitUntil(condition);
       piston.set(Value.kForward);
     })
     .named("Extend When Ready");

   // Then schedule it or bind it to a trigger
   someButton.onTrue(extendWhenReady);

**Without command-based (manual state tracking):**

.. code-block:: java

   // In periodic():
   if (condition.get()) {
     if (!pressed) {
       piston.set(Value.kForward);
       pressed = true;
     }
   } else {
     pressed = false;
   }

The declarative trigger style is concise for simple actions. The imperative coroutine style shines when you have complex sequential logic, loops, or conditionals.

## Mechanisms and Commands

.. image:: ../diagrams/subsystems-and-commands.drawio.svg
   :alt: Mechanisms and commands diagram

Commands v3 is built around two core abstractions: **commands** and **mechanisms**.

### Commands

**Commands** represent actions the robot can take. In v3, you can write commands either:

1. **Declaratively** (like v2): Compose commands using ``.sequence()``, ``.alongWith()``, etc.
2. **Imperatively** (new in v3): Write sequential code with loops, conditionals, and ``coroutine.yield()``

Commands run when scheduled, until they are interrupted or their end condition is met. Commands are recursively composable: you can combine simple commands to create complex behaviors.

### Mechanisms

**Mechanisms** (called "Subsystems" in v2) represent independently-controlled collections of robot hardware. Mechanisms serve two purposes:

1. **Encapsulation**: Hide hardware implementation details from the rest of your code
2. **Resource management**: Only one command can use a mechanism at a time, preventing conflicts

For example, a ``Drivetrain`` mechanism might contain motor controllers and encoders. Commands that require the ``Drivetrain`` automatically coordinate through the scheduler to avoid conflicts.

See :ref:`docs/software/commandbased/commands-v3/mechanisms:Mechanisms` for detailed documentation.

## How Commands Are Run

Commands are run by the ``Scheduler`` singleton, which:

- Polls triggers (buttons, conditions) to schedule commands
- Prevents resource conflicts (only one command per mechanism)
- Executes scheduled commands cooperatively using coroutines

Call ``Scheduler.getDefault().run()`` from ``robotPeriodic()`` in your ``Robot`` class. This runs at 50Hz (every 20ms) by default.

.. code-block:: java

   import org.wpilib.commands3.Scheduler;
   import edu.wpi.first.wpilibj.TimedRobot;

   public class Robot extends TimedRobot {
     @Override
     public void robotPeriodic() {
       Scheduler.getDefault().run();
     }
   }

Multiple commands can run concurrently, as long as they don't require the same mechanisms. The scheduler uses priority levels to decide which command runs when there's a conflict.

## What's Different in v3?

### Coroutines and Yielding

In v3, long-running commands use **cooperative multitasking**. Your command body receives a ``Coroutine`` object that lets you pause execution:

.. code-block:: java

   Command driveDistance = drivetrain.run(coroutine -> {
     drivetrain.resetEncoders();
     while (drivetrain.getDistance() < 10.0) {
       drivetrain.tank(0.5, 0.5);
       coroutine.yield(); // Pause here, let scheduler run other commands
     }
     drivetrain.stop();
   }).named("Drive 10 units");

The ``yield()`` call is critical - it gives the scheduler a chance to run other commands and prevents your robot from freezing.

### Command Priorities

In v2, commands either interrupt each other or don't. In v3, commands have **priority levels** (integers). When a new command conflicts with a running command, it only starts if it has equal or higher priority.

.. code-block:: java

   // Low-priority idle default
   Command idle = drivetrain.runRepeatedly(() -> drivetrain.stop())
     .withPriority(Command.LOWEST_PRIORITY)
     .named("Drive[IDLE]");

   // Normal priority action (default priority is 0)
   Command normalAction = drivetrain.run(coro -> { /* ... */ })
     .named("Normal Drive");

   // High-priority emergency stop
   Command eStop = drivetrain.run(coro -> drivetrain.stop())
     .withPriority(1000)
     .named("EMERGENCY STOP");

See :ref:`docs/software/commandbased/commands-v3/priorities-and-interrupts:Priorities and Interrupts` for details.

### Explicit Naming

All v3 commands require explicit names using ``.named("...")`` or ``.withAutomaticName()``. This improves debugging, telemetry, and dashboard visibility.

.. code-block:: java

   Command cmd = mechanism.run(coro -> { /* ... */ }).named("My Action");

   Command group = Command.sequence(cmd1, cmd2, cmd3).withAutomaticName();

### Await Helpers

v3 adds async/await-style helpers for orchestrating commands imperatively:

.. code-block:: java

   Command auto = Command.noRequirements().executing(coroutine -> {
     // Wait for one command to finish before starting the next
     coroutine.await(drivetrain.driveToPose(pose1));
     coroutine.await(arm.moveTo(position));

     // Wait for multiple commands to all finish
     coroutine.awaitAll(
       shooter.spinUp(),
       hood.moveTo(angle),
       turret.aim()
     );

     // Continue when any one finishes (others are canceled)
     coroutine.awaitAny(
       drivetrain.driveToTarget(),
       vision.alignToTag()
     );
   }).named("Complex Auto");

See :ref:`docs/software/commandbased/commands-v3/coroutines-and-async:Coroutines and Async Patterns` for the full API.

## Command Compositions

Like v2, v3 supports declarative command compositions:

- **Sequence**: Run commands one after another
- **Parallel**: Run multiple commands simultaneously, finish when all complete
- **Race**: Run multiple commands simultaneously, finish when any completes

.. code-block:: java

   Command auto = Command.sequence(
     drivetrain.driveToPose(pose),
     arm.moveTo(position),
     gripper.release()
   ).withAutomaticName();

You can also write the same logic imperatively:

.. code-block:: java

   Command auto = Command.noRequirements().executing(coroutine -> {
     coroutine.await(drivetrain.driveToPose(pose));
     coroutine.await(arm.moveTo(position));
     coroutine.await(gripper.release());
   }).named("Auto Sequence");

The imperative style is often clearer when you have complex conditional logic or need to release mechanisms between steps.

See :ref:`docs/software/commandbased/commands-v3/command-compositions-v3:Command Compositions` for more details.

## When to Use v3 vs v2

**WPILib recommends Commands v3 for Java teams.** Commands v3 is the future of command-based programming with ongoing development and new features.

**Use Commands v3 if:**

- You're a Java team
- You want improved telemetry, enhanced triggers, and self-canceling commands
- You prefer writing sequential code over chaining decorators
- You want to use the actively developed command framework

**Use Commands v2 if:**

- You need C++ or Python support
- Your team isn't ready to migrate yet
- You have significant existing v2 code and limited time to migrate

.. note::
   Commands v2 will continue to be maintained, but new features and improvements are focused on v3.

See :ref:`docs/software/commandbased/commands-v3/migration-from-v2:Migrating from Commands v2 to v3` for migration guidance.

## Next Steps

- :ref:`docs/software/commandbased/commands-v3/getting-started:Commands v3: Imperative Commands with Coroutines (Advanced)` - Hands-on tutorial
- :ref:`docs/software/commandbased/commands-v3/mechanisms:Mechanisms` - Understanding mechanisms
- :ref:`docs/software/commandbased/commands-v3/coroutines-and-async:Coroutines and Async Patterns` - Deep dive on coroutines
