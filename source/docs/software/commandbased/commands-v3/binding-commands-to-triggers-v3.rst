# Binding Commands to Triggers

Triggers in Commands v3 work similarly to Commands v2: they bind commands to conditions like button presses or sensor states. This article covers the v3-specific API and patterns.

## What Are Triggers?

A ``Trigger`` is an object that represents a boolean condition (like a button being pressed). You can bind commands to trigger state changes using methods like ``onTrue()``, ``whileTrue()``, and ``onFalse()``.

.. code-block:: java

   import org.wpilib.commands3.Trigger;
   import org.wpilib.commands3.button.CommandXboxController;

   // Button trigger
   CommandXboxController controller = new CommandXboxController(0);
   Trigger aButton = controller.a();

   // Custom condition trigger
   Trigger sensorTriggered = new Trigger(() -> sensor.getValue() > threshold);

## Creating Triggers

### From Controller Buttons

The ``CommandXboxController`` class provides triggers for all buttons:

.. code-block:: java

   import org.wpilib.commands3.button.CommandXboxController;

   CommandXboxController driver = new CommandXboxController(0);

   // Button triggers
   driver.a();           // A button
   driver.b();           // B button
   driver.x();           // X button
   driver.y();           // Y button
   driver.leftBumper();  // Left bumper
   driver.rightBumper(); // Right bumper
   driver.back();        // Back/select
   driver.start();       // Start
   driver.leftStick();   // Left stick click
   driver.rightStick();  // Right stick click

   // D-pad triggers
   driver.povUp();
   driver.povDown();
   driver.povLeft();
   driver.povRight();

   // Trigger axis (returns Trigger, not value)
   driver.leftTrigger();  // Left trigger > 0.5
   driver.rightTrigger(); // Right trigger > 0.5

   // Custom trigger threshold
   driver.leftTrigger(0.3); // Left trigger > 0.3

### From Custom Conditions

Create triggers from any boolean condition:

.. code-block:: java

   import org.wpilib.commands3.Trigger;

   // From a method reference
   Trigger atGoal = new Trigger(arm::atGoal);

   // From a lambda
   Trigger tooFast = new Trigger(() -> drivetrain.getSpeed() > MAX_SPEED);

   // From a field (if it's a BooleanSupplier)
   Trigger limitSwitch = new Trigger(limitSwitch::get);

### Combining Triggers

Triggers can be combined with boolean logic:

.. code-block:: java

   Trigger bothButtons = driver.a().and(driver.b());
   Trigger eitherBumper = driver.leftBumper().or(driver.rightBumper());
   Trigger notPressed = driver.x().negate();

   // Complex condition
   Trigger readyToShoot = new Trigger(() -> shooter.atSpeed())
     .and(new Trigger(() -> turret.onTarget()))
     .and(driver.rightBumper());

## Binding Methods

### ``onTrue(Command)``

Run the command when the trigger goes from false to true (rising edge).

.. code-block:: java

   driver.a().onTrue(
     intake.run(coro -> intake.extend()).named("Extend Intake")
   );

The command runs once per button press, even if you hold the button.

### ``onFalse(Command)``

Run the command when the trigger goes from true to false (falling edge).

.. code-block:: java

   driver.a().onFalse(
     intake.run(coro -> intake.retract()).named("Retract Intake")
   );

### ``whileTrue(Command)``

Run the command while the trigger is true. Cancel when it becomes false.

.. code-block:: java

   driver.rightBumper().whileTrue(
     intake.run(coro -> {
       intake.setSpeed(0.8);
       coro.park(); // Run until canceled
     })
     .whenCanceled(() -> intake.setSpeed(0))
     .named("Run Intake")
   );

This is perfect for "hold button to do action" patterns.

### ``whileFalse(Command)``

Run the command while the trigger is false. Cancel when it becomes true.

.. code-block:: java

   new Trigger(() -> sensor.beamBroken())
     .whileFalse(
       intake.runRepeatedly(() -> intake.run()).named("Run Until Beam Break")
     );

### ``toggleOnTrue(Command)``

Toggle the command on and off with each button press.

.. code-block:: java

   driver.x().toggleOnTrue(
     intake.run(coro -> {
       intake.setSpeed(0.8);
       coro.park();
     })
     .whenCanceled(() -> intake.setSpeed(0))
     .named("Toggle Intake")
   );

First press: start command. Second press: cancel command. Third press: start again.

## Common Patterns

### Pattern 1: Instant Action on Press

.. code-block:: java

   driver.a().onTrue(
     pneumatics.run(coro -> solenoid.toggle()).named("Toggle Solenoid")
   );

### Pattern 2: Hold to Run

.. code-block:: java

   driver.rightBumper().whileTrue(
     intake.run(coro -> {
       intake.on();
       coro.park();
     })
     .whenCanceled(() -> intake.off())
     .named("Hold Intake")
   );

### Pattern 3: Toggle

.. code-block:: java

   driver.x().toggleOnTrue(
     climber.run(coro -> {
       climber.extend();
       coro.park();
     })
     .whenCanceled(() -> climber.retract())
     .named("Toggle Climber")
   );

### Pattern 4: Two Buttons for Opposite Actions

.. code-block:: java

   driver.leftBumper().whileTrue(
     shooter.run(coro -> {
       shooter.spinUp();
       coro.park();
     })
     .whenCanceled(() -> shooter.stop())
     .named("Spin Up")
   );

   driver.leftTrigger().whileTrue(
     shooter.run(coro -> {
       shooter.spinReverse();
       coro.park();
     })
     .whenCanceled(() -> shooter.stop())
     .named("Spin Reverse")
   );

### Pattern 5: Conditional Binding

.. code-block:: java

   Trigger canShoot = new Trigger(() -> shooter.atSpeed())
     .and(new Trigger(() -> turret.onTarget()))
     .and(driver.rightBumper());

   canShoot.onTrue(
     shooter.run(coro -> shooter.fire()).named("Fire")
   );

### Pattern 6: Automated Triggers

.. code-block:: java

   // Auto-align when we see a target
   new Trigger(() -> vision.hasTarget())
     .and(new Trigger(() -> drivetrain.isIdle()))
     .whileTrue(
       drivetrain.run(coro -> {
         while (!drivetrain.aligned()) {
           drivetrain.alignToTarget();
           coro.yield();
         }
       })
       .withPriority(5) // Low priority, driver can override
       .named("Auto Align")
     );

## Command-Local Triggers (Nested Triggers)

Commands v3 introduces **command-local trigger bindings**. Triggers created within a running command are automatically scoped to that command's lifetime and are deleted when the command exits.

### Global vs Command-Local Bindings

- **Global bindings**: Created outside any command (e.g., in RobotContainer). Active for the entire robot program.
- **Command-local bindings**: Created inside a command body. Active only while that command runs.

.. code-block:: java

   Command autoWithLocalTriggers = Command.noRequirements().executing(coroutine -> {
     // These triggers are command-local (nested)
     // They will be automatically cleaned up when this command ends

     Trigger intakeReady = new Trigger(() -> intake.hasGamePiece());
     intakeReady.onTrue(
       arm.moveTo(SCORE_HEIGHT).named("Raise Arm")
     );

     Trigger armAtHeight = new Trigger(() -> arm.atGoal());
     armAtHeight.onTrue(
       shooter.shoot().named("Shoot")
     );

     // Wait for scoring to complete
     coroutine.waitUntil(() -> shooter.finished());

     // When this command ends, intakeReady and armAtHeight bindings are removed
   }).named("Auto Score With Local Triggers");

### Use Cases for Command-Local Triggers

Command-local triggers are useful for:

1. **Temporary automation**: Enable automatic reactions only during a specific command
2. **State-based behavior**: Different bindings for different autonomous phases
3. **Clean resource management**: No need to manually unbind triggers
4. **Modular command design**: Commands can set up their own trigger behaviors

### Example: Phase-Based Autonomous

.. code-block:: java

   Command phaseBasedAuto = Command.noRequirements().executing(coroutine -> {

     // PHASE 1: Drive to game piece with auto-intake
     Trigger seeGamePiece = new Trigger(() -> vision.hasTarget());
     seeGamePiece.whileTrue(
       intake.run(coro -> {
         intake.setSpeed(0.8);
         coro.park();
       })
       .whenCanceled(() -> intake.stop())
       .named("Auto Intake")
     );

     coroutine.await(drivetrain.driveToPose(gamePiecePose));
     coroutine.waitUntil(() -> intake.hasGamePiece());
     // seeGamePiece binding automatically removed here

     // PHASE 2: Drive to score with auto-align
     Trigger seeScoringTarget = new Trigger(() -> vision.hasTarget());
     seeScoringTarget.whileTrue(
       drivetrain.run(coro -> {
         drivetrain.alignToTarget();
         coro.yield();
       })
       .withPriority(15)  // Higher than normal drive
       .named("Auto Align to Score")
     );

     coroutine.await(drivetrain.driveToPose(scorePose));
     coroutine.await(shooter.shoot());
     // seeScoringTarget binding automatically removed here

   }).named("Phase Based Auto");

In this example, each phase has its own set of trigger bindings that are only active during that phase. This prevents the auto-intake from running during scoring, and vice versa.

### Mechanism Triggers

Mechanisms can expose public trigger fields for common conditions. These are **global** triggers (not nested) since they're created at mechanism construction time.

.. code-block:: java

   public class Arm extends Mechanism {

     // Public trigger for external binding
     public final Trigger atGoal = new Trigger(() -> Math.abs(getAngle() - targetAngle) < TOLERANCE);

     public final Trigger overheated = new Trigger(() -> getTemperature() > MAX_TEMP);

     public Arm() {
       // Mechanism can bind to its own triggers
       overheated.onTrue(
         run(coro -> {
           stop();
           System.err.println("ARM OVERHEATED!");
         })
         .withPriority(1000)
         .named("Arm Emergency Stop")
       );
     }

     // Commands can be returned
     public Command moveTo(double angle) {
       return run(coro -> {
         targetAngle = angle;
         while (!atGoal.getAsBoolean()) {
           updatePID();
           coro.yield();
         }
       }).named("Arm Move To " + angle);
     }
   }

External code can then bind to these mechanism triggers:

.. code-block:: java

   // In RobotContainer or bindings setup
   arm.atGoal.and(driver.a()).onTrue(
     shooter.shoot().named("Shoot When Ready")
   );

### Best Practices

1. **Use global bindings for persistent controls**: Button bindings in RobotContainer should be global
2. **Use command-local bindings for temporary automation**: Auto routines that need phase-specific reactions
3. **Expose common triggers from mechanisms**: Make useful triggers public for external binding
4. **Don't manually unbind**: Let command scope handle cleanup automatically

.. code-block:: java

   // ✅ GOOD: Command-local binding (automatic cleanup)
   Command auto = Command.noRequirements().executing(coro -> {
     Trigger ready = new Trigger(() -> sensor.ready());
     ready.onTrue(action());
     coro.await(doWork());
   }).named("Auto");

   // ❌ LESS GOOD: Manual trigger management (more error-prone)
   Command auto = Command.noRequirements().executing(coro -> {
     Trigger ready = new Trigger(() -> sensor.ready());
     Binding binding = ready.onTrue(action());
     coro.await(doWork());
     binding.cancel(); // Manual cleanup required
   }).named("Auto");

## Debouncing

Debouncing prevents trigger "bouncing" from noisy sensors:

.. code-block:: java

   import static edu.wpi.first.units.Units.Seconds;

   Trigger sensor = new Trigger(() -> limitSwitch.get())
     .debounce(Seconds.of(0.1)); // Must be true for 100ms

   sensor.onTrue(
     mechanism.run(coro -> mechanism.stop()).named("Hit Limit")
   );

## Example: Complete Binding Setup

.. code-block:: java

   import org.wpilib.commands3.button.CommandXboxController;
   import org.wpilib.commands3.Trigger;

   public class RobotContainer {
     private final Drivetrain drivetrain = new Drivetrain();
     private final Intake intake = new Intake();
     private final Shooter shooter = new Shooter();
     private final Arm arm = new Arm();

     private final CommandXboxController driver = new CommandXboxController(0);
     private final CommandXboxController operator = new CommandXboxController(1);

     public RobotContainer() {
       configureBindings();
     }

     private void configureBindings() {
       // Driver controls

       // Default drive command (set in Drivetrain constructor)
       // Uses axis inputs from controller

       // Right bumper: hold to intake
       driver.rightBumper().whileTrue(
         intake.run(coro -> {
           intake.setSpeed(0.8);
           coro.park();
         })
         .whenCanceled(() -> intake.setSpeed(0))
         .named("Run Intake")
       );

       // A button: toggle intake deployment
       driver.a().toggleOnTrue(
         intake.run(coro -> {
           intake.extend();
           coro.park();
         })
         .whenCanceled(() -> intake.retract())
         .named("Toggle Intake Deploy")
       );

       // Operator controls

       // Left bumper: spin up shooter
       operator.leftBumper().whileTrue(
         shooter.run(coro -> {
           shooter.spinUp();
           coro.park();
         })
         .whenCanceled(() -> shooter.stop())
         .named("Spin Up Shooter")
       );

       // Right bumper (operator): fire when ready
       Trigger readyToFire = new Trigger(() -> shooter.atSpeed())
         .and(operator.rightBumper());

       readyToFire.onTrue(
         shooter.run(coro -> shooter.fire()).named("Fire")
       );

       // Y button: move arm to high position
       operator.y().onTrue(
         arm.moveTo(ARM_HIGH_ANGLE).named("Arm High")
       );

       // B button: move arm to mid position
       operator.b().onTrue(
         arm.moveTo(ARM_MID_ANGLE).named("Arm Mid")
       );

       // A button: move arm to low position
       operator.a().onTrue(
         arm.moveTo(ARM_LOW_ANGLE).named("Arm Low")
       );

       // Automated triggers

       // Auto-stop if we're going too fast
       new Trigger(() -> drivetrain.getSpeed() > MAX_SAFE_SPEED)
         .onTrue(
           drivetrain.run(coro -> drivetrain.stop())
             .withPriority(100) // High priority
             .named("Emergency Speed Stop")
         );
     }
   }

## Differences from v2

The v3 trigger API is nearly identical to v2. Key differences:

1. **Package**: Import from ``org.wpilib.commands3.button`` (not ``edu.wpi.first.wpilibj2.command.button``)

2. **Commands must be named**: All commands need ``.named("...")``

3. **Priorities**: Consider setting priorities on commands bound to triggers

.. list-table::
   :header-rows: 1
   :widths: 30 35 35

   * - Method
     - Commands v2
     - Commands v3
   * - ``onTrue()``
     - ✅ Same
     - ✅ Same
   * - ``onFalse()``
     - ✅ Same
     - ✅ Same
   * - ``whileTrue()``
     - ✅ Same
     - ✅ Same
   * - ``whileFalse()``
     - ✅ Same
     - ✅ Same
   * - ``toggleOnTrue()``
     - ✅ Same
     - ✅ Same

## Best Practices

1. **Configure bindings in RobotContainer**: Keep all bindings in one place

2. **Use descriptive names**: Name commands clearly for debugging

.. code-block:: java

   // ✅ GOOD: Clear name
   driver.a().onTrue(intake.grab().named("Grab Game Piece"));

   // ❌ BAD: Generic name
   driver.a().onTrue(intake.grab().named("Command"));

3. **Set appropriate priorities**: Consider which commands should interrupt which

4. **Document complex bindings**: Add comments for non-obvious bindings

.. code-block:: java

   // Hold right bumper to intake, auto-stops when game piece detected
   driver.rightBumper().whileTrue(
     intake.run(coro -> {
       while (!intake.hasGamePiece()) {
         intake.setSpeed(0.8);
         coro.yield();
       }
       intake.setSpeed(0);
     }).named("Smart Intake")
   );

5. **Test bindings incrementally**: Add bindings one at a time and test

## See Also

- :ref:`docs/software/commandbased/commands-v2/binding-commands-to-triggers:Binding Commands to Triggers` - v2 trigger documentation
- :ref:`docs/software/commandbased/commands-v3/priorities-and-interrupts:Priorities and Interrupts` - Managing command priorities
- :ref:`docs/software/commandbased/commands-v3/coroutines-and-async:Coroutines and Async Patterns` - Writing command bodies
