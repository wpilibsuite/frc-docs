# Migrating from Commands v2 to v3

This guide helps teams migrate existing Commands v2 code to Commands v3. It covers the key conceptual changes, provides side-by-side code comparisons, and highlights common pitfalls.

.. warning::
   Commands v3 is **Java-only**. If you need C++ or Python support, continue using Commands v2.

## Should You Migrate?

**WPILib recommends migrating to Commands v3 for Java teams.** Commands v3 is the future direction of command-based programming with ongoing development and new features including improved telemetry, enhanced triggers, and self-canceling commands.

**Migrate to v3 if:**

- You're a Java team
- You want to use the actively developed command framework
- You prefer imperative control flow (loops, if-statements) over declarative composition
- You want improved telemetry and trigger functionality

**Stay with v2 if:**

- You need C++ or Python support
- Your team isn't ready to migrate yet
- You have significant existing v2 code and limited time to migrate

.. note::
   Commands v2 will continue to be maintained, but new features and improvements are focused on v3. Java teams should plan to migrate when they have the time and resources.

.. note::
   You **cannot mix** v2 and v3 in the same codebase. The schedulers and command types are incompatible. Plan a full migration or stay with v2.

## Prerequisites

1. **WPILib 2025+**: Ensure you have the version of WPILib that includes Commands v3
2. **Single-threaded scheduler**: v3 requires running the scheduler on a single thread (standard ``robotPeriodic()`` is fine)

## Package Changes

Commands v3 lives in a different package namespace. In 2027, Commands v2 is also moving to a new package:

.. list-table::
   :header-rows: 1
   :widths: 40 30 30

   * - Package
     - v2 (pre-2027)
     - 2027
   * - Commands v2
     - ``edu.wpi.first.wpilibj2.command.*``
     - ``org.wpilib.commands2.*``
   * - Commands v2 button
     - ``edu.wpi.first.wpilibj2.command.button.*``
     - ``org.wpilib.commands2.button.*``
   * - Commands v3
     - N/A
     - ``org.wpilib.commands3.*``
   * - Commands v3 button
     - N/A
     - ``org.wpilib.commands3.button.*``

You'll need to update all imports in your migrated files. In 2027, if you're migrating from v2 to v3, you'll be changing from ``org.wpilib.commands2`` to ``org.wpilib.commands3``.

## Core Concept Mapping

### Subsystem → Mechanism

In v3, "Subsystems" are now called "Mechanisms." They serve the same purpose: grouping robot hardware and acting as exclusive resources.

.. list-table::
   :header-rows: 1
   :widths: 50 50

   * - Commands v2
     - Commands v3
   * - Extend ``SubsystemBase``
     - Extend ``Mechanism``
   * - ``setDefaultCommand(command)``
     - ``setDefaultCommand(command)``
   * - ``getCurrentCommand()``
     - ``getRunningCommands()``

**v2 Subsystem:**

.. code-block:: java

   import org.wpilib.commands2.SubsystemBase;

   public class Drivetrain extends SubsystemBase {
     public Drivetrain() {
       setDefaultCommand(new DriveWithJoysticks(this));
     }

     public void tank(double left, double right) { /* ... */ }
   }

**v3 Mechanism:**

.. code-block:: java

   import org.wpilib.commands3.Mechanism;
   import org.wpilib.commands3.Command;

   public class Drivetrain extends Mechanism {
     public Drivetrain() {
       setDefaultCommand(
         runRepeatedly(() -> tank(0, 0))
           .withPriority(Command.LOWEST_PRIORITY)
           .named("Drive[IDLE]")
       );
     }

     private void tank(double left, double right) { /* ... */ }
   }

### CommandScheduler

The scheduler works similarly, but uses a different package:

**v2 Scheduler:**

.. code-block:: java

   import org.wpilib.commands2.CommandScheduler;

   @Override
   public void robotPeriodic() {
     CommandScheduler.getInstance().run();
   }

**v3 Scheduler:**

.. code-block:: java

   import org.wpilib.commands3.Scheduler;

   @Override
   public void robotPeriodic() {
     Scheduler.getDefault().run();
   }

## Command Patterns: v2 vs v3

### Simple Instant Command

**v2:**

.. code-block:: java

   Command resetEncoders = Commands.runOnce(
     drivetrain::resetEncoders,
     drivetrain
   ).withName("Reset Encoders");

**v3:**

.. code-block:: java

   Command resetEncoders = drivetrain
     .run(coroutine -> drivetrain.resetEncoders())
     .named("Reset Encoders");

### Command That Runs Continuously

**v2:**

.. code-block:: java

   Command intake = Commands.run(
     () -> intakeMech.setSpeed(0.8),
     intakeMech
   ).withName("Run Intake");

**v3 (runRepeatedly or run with park):**

.. code-block:: java

   // Option 1: runRepeatedly (body runs every cycle)
   Command intake = intakeMech
     .runRepeatedly(() -> intakeMech.setSpeed(0.8))
     .named("Run Intake");

   // Option 2: run with park (body runs once, parks until canceled)
   Command intake = intakeMech
     .run(coroutine -> {
       intakeMech.setSpeed(0.8);
       coroutine.park(); // Stay here until canceled
     })
     .whenCanceled(() -> intakeMech.setSpeed(0))
     .named("Run Intake");

### Start-End Command

**v2:**

.. code-block:: java

   Command runIntake = Commands.startEnd(
     () -> intake.on(),
     () -> intake.off(),
     intake
   ).withName("Intake");

**v3:**

.. code-block:: java

   Command runIntake = intake
     .run(coroutine -> {
       intake.on();
       coroutine.park(); // Run until canceled
     })
     .whenCanceled(() -> intake.off())
     .named("Intake");

### Command with End Condition

**v2:**

.. code-block:: java

   Command driveTenFeet = Commands.run(
       () -> drivetrain.tank(0.5, 0.5),
       drivetrain
     )
     .beforeStarting(drivetrain::resetEncoders)
     .until(() -> drivetrain.getDistance() >= 3.048)
     .finallyDo(interrupted -> drivetrain.stop())
     .withName("Drive 10 ft");

**v3:**

.. code-block:: java

   Command driveTenFeet = drivetrain
     .run(coroutine -> {
       drivetrain.resetEncoders();
       while (drivetrain.getDistance() < 3.048) {
         drivetrain.tank(0.5, 0.5);
         coroutine.yield(); // Critical: yield in loops!
       }
       drivetrain.stop();
     })
     .named("Drive 10 ft");

### Wait Commands

**v2:**

.. code-block:: java

   import static edu.wpi.first.units.Units.Seconds;

   Command wait = Commands.waitSeconds(2.0);
   Command waitForCondition = Commands.waitUntil(() -> sensor.isTriggered());

**v3:**

.. code-block:: java

   import static edu.wpi.first.units.Units.Seconds;

   Command wait = Command.waitFor(Seconds.of(2.0)).named("Wait 2s");
   Command waitForCondition = Command.waitUntil(() -> sensor.isTriggered())
     .named("Wait For Sensor");

### Sequential Composition

**v2:**

.. code-block:: java

   Command auto = Commands.sequence(
     drivetrain.driveToPose(pose1),
     arm.moveTo(position),
     gripper.release()
   );

**v3 (still works!):**

.. code-block:: java

   Command auto = Command.sequence(
     drivetrain.driveToPose(pose1),
     arm.moveTo(position),
     gripper.release()
   ).withAutomaticName();

**v3 (imperative alternative):**

.. code-block:: java

   Command auto = Command.noRequirements().executing(coroutine -> {
     coroutine.await(drivetrain.driveToPose(pose1));
     coroutine.await(arm.moveTo(position));
     coroutine.await(gripper.release());
   }).named("Auto Sequence");

### Parallel Composition

**v2:**

.. code-block:: java

   Command spinupAndAim = Commands.parallel(
     shooter.spinUpToRPM(3000),
     hood.moveTo(angle),
     turret.aim()
   );

**v3 (still works!):**

.. code-block:: java

   Command spinupAndAim = shooter.spinUpToRPM(3000)
     .alongWith(hood.moveTo(angle), turret.aim())
     .withAutomaticName();

**v3 (imperative alternative):**

.. code-block:: java

   Command spinupAndAim = Command.noRequirements().executing(coroutine -> {
     coroutine.awaitAll(
       shooter.spinUpToRPM(3000),
       hood.moveTo(angle),
       turret.aim()
     );
   }).named("Spinup And Aim");

### Race Composition

Race is useful when you want one command to run while another is active, and stop when the main command finishes. A common pattern is playing an LED pattern during an action.

**v2:**

.. code-block:: java

   Command intakeWithLEDs = Commands.race(
     intake.grab(),
     leds.playPattern(LEDPattern.INTAKING)
   );

**v3 (still works!):**

.. code-block:: java

   Command intakeWithLEDs = intake.grab()
     .raceWith(leds.playPattern(LEDPattern.INTAKING))
     .withAutomaticName();

**v3 (imperative alternative):**

.. code-block:: java

   Command intakeWithLEDs = Command.noRequirements().executing(coroutine -> {
     coroutine.awaitAny(
       intake.grab(),
       leds.playPattern(LEDPattern.INTAKING)
     );
   }).named("Intake With LEDs");

.. note::
   For timeouts specifically, use ``.withTimeout()`` instead of racing with a wait command:

   .. code-block:: java

      Command driveWithTimeout = drivetrain.driveToPose(pose)
        .withTimeout(Seconds.of(3.0))
        .named("Drive With Timeout");

### Conditional Commands

**v2:**

.. code-block:: java

   Command conditional = Commands.either(
     pathA,
     pathB,
     () -> sensor.getValue() > threshold
   );

**v3 (imperative):**

.. code-block:: java

   Command conditional = Command.noRequirements().executing(coroutine -> {
     if (sensor.getValue() > threshold) {
       coroutine.await(pathA);
     } else {
       coroutine.await(pathB);
     }
   }).named("Conditional Path");

## Trigger Bindings

Triggers work similarly but use the v3 package:

**v2:**

.. code-block:: java

   import org.wpilib.commands2.button.CommandXboxController;
   import org.wpilib.commands2.button.Trigger;

   CommandXboxController controller = new CommandXboxController(0);

   controller.a().onTrue(intake.runOnce(() -> intake.extend()));
   controller.b().whileTrue(intake.run(() -> intake.run()));

**v3:**

.. code-block:: java

   import org.wpilib.commands3.button.CommandXboxController;
   import org.wpilib.commands3.Trigger;

   CommandXboxController controller = new CommandXboxController(0);

   controller.a().onTrue(intake.runOnce(() -> intake.extend()));
   controller.b().whileTrue(intake.run(() -> intake.run()));

## Common Patterns and Idioms

### Default Commands

**v2:**

.. code-block:: java

   public Drivetrain() {
     setDefaultCommand(new DriveWithJoysticks(this));
   }

**v3:**

.. code-block:: java

   public Drivetrain(Supplier<Double> leftSpeed, Supplier<Double> rightSpeed) {
     setDefaultCommand(
       runRepeatedly(() -> tank(leftSpeed.get(), rightSpeed.get()))
         .withPriority(Command.LOWEST_PRIORITY)
         .named("Drive[IDLE]")
     );
   }

### Interrupt Behavior

**v2:** Commands can be interruptible or not (``withInterruptBehavior()``).

**v3:** Commands have **priority levels**. A new command only starts if it has equal or higher priority than conflicting running commands.

.. code-block:: java

   // Low priority default
   Command defaultCmd = mechanism.runRepeatedly(() -> mechanism.idle())
     .withPriority(Command.LOWEST_PRIORITY)
     .named("Idle");

   // Normal priority command
   Command normalCmd = mechanism.run(coro -> { /* ... */ })
     .withPriority(0)  // default
     .named("Normal Action");

   // High priority emergency stop
   Command eStop = mechanism.run(coro -> mechanism.stop())
     .withPriority(1000)
     .named("EMERGENCY STOP");

See :ref:`docs/software/commandbased/commands-v3/priorities-and-interrupts:Priorities and Interrupts` for details.

## Critical Differences and Gotchas

### 1. Always Yield in Loops

In v3, **you must call** ``coroutine.yield()`` inside any loop. If you don't, the scheduler can't run other commands, and your robot will freeze.

.. code-block:: java

   // ❌ BAD: Will freeze the robot!
   Command bad = mechanism.run(coroutine -> {
     while (true) {
       mechanism.doSomething();
       // No yield - infinite loop blocks scheduler!
     }
   });

   // ✅ GOOD: Yields control back to scheduler
   Command good = mechanism.run(coroutine -> {
     while (sensor.notAtGoal()) {
       mechanism.doSomething();
       coroutine.yield(); // Critical!
     }
   });

### 2. Compiler Plugin for Non-Yielding Loops

A Gradle compiler plugin is in development to detect non-yielding loops and produce compile errors, making this easier to catch during development.

### 3. Explicit Naming Required

Unlike v2, v3 commands **require explicit naming** for better debugging and telemetry.

.. code-block:: java

   // v2: Name is optional
   Command cmd = Commands.runOnce(() -> {});

   // v3: Must provide a name
   Command cmd = mechanism.run(coro -> {}).named("My Command");

   // Or use withAutomaticName() for groups
   Command group = Command.sequence(cmd1, cmd2, cmd3).withAutomaticName();

### 4. Package Imports

Don't forget to update all imports! v2 and v3 cannot be mixed.

.. code-block:: java

   // ❌ v2 import
   import org.wpilib.commands2.*;

   // ✅ v3 import
   import org.wpilib.commands3.*;

### 5. No Implicit Command Factories

In v2, ``Commands`` provides many factory methods. In v3, build commands from mechanisms or use ``Command`` static methods.

.. code-block:: java

   // v2
   Command cmd = Commands.runOnce(() -> {}, subsystem);

   // v3
   Command cmd = mechanism.run(coro -> {}).named("Action");
   // or
   Command cmd = Command.noRequirements().executing(coro -> {}).named("Action");

## Migration Strategy

1. **Start small**: Pick one subsystem/mechanism and its commands to migrate first
2. **Update imports**: Change all v2 imports to v3 in migrated files
3. **Rename Subsystem → Mechanism**: Update class names and inheritance
4. **Convert commands one by one**: Use the patterns above as templates
5. **Test thoroughly**: Verify each migrated command works as expected
6. **Add yield() calls**: Review all loops and ensure proper yielding
7. **Set priorities**: Review default commands and set appropriate priorities
8. **Name everything**: Ensure all commands have meaningful names

## When to Use Imperative vs Composition Style

Even in v3, you can still use declarative composition (``sequence()``, ``alongWith()``, ``raceWith()``). Use the imperative style when:

- You have complex conditional logic (many if/else branches)
- You need to release mechanisms between steps (``await()`` releases after each command)
- You want straightforward sequential code that's easy to read

Use composition style when:

- The structure is simple (a few steps in sequence or parallel)
- You want all mechanisms locked for the entire group duration
- You prefer the declarative "what" over imperative "how"

## Additional Resources

- :ref:`docs/software/commandbased/commands-v3/getting-started:Commands v3: Imperative Commands with Coroutines (Advanced)` - Hands-on introduction
- :ref:`docs/software/commandbased/commands-v3/mechanisms:Mechanisms` - Deep dive on Mechanisms
- :ref:`docs/software/commandbased/commands-v3/coroutines-and-async:Coroutines and Async Patterns` - Understanding coroutines
- :ref:`docs/software/commandbased/commands-v3/priorities-and-interrupts:Priorities and Interrupts` - Priority system details

## Need Help?

If you're stuck or unsure about migration:

1. Check the v3 examples in WPILib
2. Ask on the Chief Delphi forums
3. Consider staying with v2 if your current code works well
