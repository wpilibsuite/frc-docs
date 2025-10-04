# Structuring a Commands v3 Project

This article provides guidance on organizing a robot project using Commands v3, including file structure, naming conventions, and best practices.

## Recommended Project Structure

A typical Commands v3 project follows this structure::

   src/main/java/frc/robot/
   ├── Robot.java                 # Main robot class
   ├── Autos.java                 # Factory for auto routines (optional)
   ├── Bindings.java              # Driver and operator controller bindings (optional)
   ├── Constants.java             # Robot-wide constants
   └── mechanisms/                # Mechanism classes
       ├── Drivetrain.java
       ├── Arm.java
       ├── Intake.java
       └── Shooter.java

## Core Classes

### ``Robot.java``

The main robot class. Keep it minimal - just call the scheduler.

.. code-block:: java

   package frc.robot;

   import edu.wpi.first.wpilibj.TimedRobot;
   import org.wpilib.commands3.Scheduler;

   public class Robot extends TimedRobot {
     private RobotContainer robotContainer;

     @Override
     public void robotInit() {
       robotContainer = new RobotContainer();
     }

     @Override
     public void robotPeriodic() {
       Scheduler.getDefault().run();
     }

     @Override
     public void autonomousInit() {
       Scheduler.getDefault().schedule(robotContainer.getAutonomousCommand());
     }

     @Override
     public void teleopInit() {
       // Cancel auto if it's still running
       Scheduler.getDefault().cancelAll();
     }
   }

### ``RobotContainer.java``

Contains all mechanisms and button bindings.

.. code-block:: java

   package frc.robot;

   import org.wpilib.commands3.Command;
   import org.wpilib.commands3.button.CommandXboxController;
   import frc.robot.mechanisms.*;

   public class RobotContainer {
     // Mechanisms
     private final Drivetrain drivetrain = new Drivetrain();
     private final Intake intake = new Intake();
     private final Shooter shooter = new Shooter();
     private final Arm arm = new Arm();

     // Controllers
     private final CommandXboxController driver = new CommandXboxController(0);
     private final CommandXboxController operator = new CommandXboxController(1);

     public RobotContainer() {
       configureBindings();
     }

     private void configureBindings() {
       // Driver bindings
       driver.rightBumper().whileTrue(
         intake.grab().named("Grab")
       );

       // Operator bindings
       operator.a().onTrue(
         arm.moveTo(Constants.ARM_LOW).named("Arm Low")
       );

       // Add more bindings...
     }

     public Command getAutonomousCommand() {
       return AutoCommands.twoGamePieceAuto(drivetrain, intake, arm, shooter);
     }
   }

### ``Constants.java``

Robot-wide constants.

.. code-block:: java

   package frc.robot;

   public final class Constants {
     // CAN IDs
     public static final int DRIVETRAIN_LEFT_LEADER_ID = 1;
     public static final int DRIVETRAIN_RIGHT_LEADER_ID = 2;
     public static final int ARM_MOTOR_ID = 5;

     // Mechanism positions
     public static final double ARM_HIGH = 1.57; // radians
     public static final double ARM_MID = 0.78;
     public static final double ARM_LOW = 0.0;

     // Speeds and timeouts
     public static final double INTAKE_SPEED = 0.8;
     public static final double MAX_SPEED = 4.0; // m/s

     // Controller ports
     public static final int DRIVER_PORT = 0;
     public static final int OPERATOR_PORT = 1;
   }

## Mechanism Classes

Mechanisms extend ``Mechanism`` and contain:
- Hardware declarations (motors, sensors, etc.)
- Public sensor-reading methods
- Command factory methods that return ``Command`` objects
- Periodic hooks (in constructor) for telemetry and state updates

.. code-block:: java

   package frc.robot.mechanisms;

   import org.wpilib.commands3.Mechanism;
   import org.wpilib.commands3.Command;
   import edu.wpi.first.wpilibj.motorcontrol.PWMSparkMax;
   import edu.wpi.first.wpilibj.DigitalInput;
   import frc.robot.Constants;
   import static edu.wpi.first.units.Units.Seconds;

   public class Intake extends Mechanism {
     private final PWMSparkMax motor = new PWMSparkMax(Constants.INTAKE_MOTOR_ID);
     private final DigitalInput beamBreak = new DigitalInput(0);

     public Intake() {
       setDefaultCommand(
         runRepeatedly(() -> stop())
           .withPriority(Command.LOWEST_PRIORITY)
           .named("Intake[IDLE]")
       );
     }

     // Private methods for hardware control
     private void setSpeed(double speed) {
       motor.set(speed);
     }

     private void stop() {
       motor.set(0);
     }

     // Public sensor methods
     public boolean hasGamePiece() {
       return !beamBreak.get(); // Beam break is inverted
     }

     // Command factories
     public Command grab() {
       return run(coroutine -> {
         while (!hasGamePiece()) {
           setSpeed(Constants.INTAKE_SPEED);
           coroutine.yield();
         }
         stop();
       }).named("Grab");
     }

     public Command eject() {
       return run(coroutine -> {
         setSpeed(-Constants.INTAKE_SPEED);
         coroutine.wait(Seconds.of(0.5));
         stop();
       }).named("Eject");
     }
   }

## Autonomous Commands

Create a separate class for autonomous command factories:

.. code-block:: java

   package frc.robot.commands;

   import org.wpilib.commands3.Command;
   import frc.robot.mechanisms.*;
   import static edu.wpi.first.units.Units.Seconds;

   public class AutoCommands {

     public static Command twoGamePieceAuto(
         Drivetrain drivetrain,
         Intake intake,
         Arm arm,
         Shooter shooter) {

       return Command.noRequirements().executing(coroutine -> {
         // Start position
         coroutine.await(drivetrain.driveToPose(Poses.START));

         // First game piece
         coroutine.await(intake.grab());
         coroutine.await(drivetrain.driveToPose(Poses.SCORE_HIGH));

         coroutine.awaitAll(
           arm.moveTo(Constants.ARM_HIGH),
           shooter.spinUp()
         );

         coroutine.await(shooter.shoot());

         // Second game piece
         coroutine.await(arm.moveTo(Constants.ARM_LOW));
         coroutine.await(drivetrain.driveToPose(Poses.GAME_PIECE_2));
         coroutine.await(intake.grab());
         coroutine.await(drivetrain.driveToPose(Poses.SCORE_HIGH));

         coroutine.awaitAll(
           arm.moveTo(Constants.ARM_HIGH),
           shooter.spinUp()
         );

         coroutine.await(shooter.shoot());
       }).named("Two Piece Auto");
     }

     public static Command simpleAuto(Drivetrain drivetrain) {
       return drivetrain.run(coroutine -> {
         drivetrain.resetEncoders();
         while (drivetrain.getDistance() < 3.0) {
           drivetrain.tank(0.5, 0.5);
           coroutine.yield();
         }
         drivetrain.stop();
       }).named("Simple Drive Auto");
     }

     private AutoCommands() {
       // Utility class, prevent instantiation
     }
   }

## Naming Conventions

### Mechanisms

- PascalCase, singular nouns: ``Drivetrain``, ``Arm``, ``Intake``
- Represent physical robot subsystems

### Commands

- Descriptive action names: ``"Grab"``, ``"Score High"``, ``"Drive to Pose"``
- Always include ``.named("...")`` when creating commands
- Use active verbs

.. code-block:: java

   // ✅ GOOD: Clear, descriptive names
   intake.grab().named("Grab")
   arm.moveTo(angle).named("Arm to " + angle)
   drivetrain.driveToPose(pose).named("Drive to " + pose)

   // ❌ BAD: Vague or missing names
   intake.grab() // Missing name!
   intake.grab().named("Command")
   intake.grab().named("Intake1")

### Methods

- camelCase
- Public methods: Actions that commands can perform (``setSpeed``, ``moveTo``)
- Private methods: Internal helpers (``updatePID``, ``calculateFeedforward``)

### Constants

- SCREAMING_SNAKE_CASE: ``ARM_HIGH_ANGLE``, ``INTAKE_SPEED``
- Group related constants in nested classes if needed

.. code-block:: java

   public final class Constants {
     public static final class Drivetrain {
       public static final int LEFT_LEADER_ID = 1;
       public static final int RIGHT_LEADER_ID = 2;
       public static final double MAX_SPEED = 4.0;
     }

     public static final class Arm {
       public static final int MOTOR_ID = 5;
       public static final double HIGH = 1.57;
       public static final double MID = 0.78;
       public static final double LOW = 0.0;
     }
   }

## Priority Scheme

Document your priority levels:

.. code-block:: java

   public final class Priorities {
     public static final int DEFAULT = 0;           // Normal commands
     public static final int AUTO_ACTION = 10;      // Automated actions
     public static final int DRIVER_OVERRIDE = 50;  // Manual overrides
     public static final int SAFETY = 500;          // Safety interlocks
     public static final int EMERGENCY = 1000;      // Emergency stops
   }

Use these constants:

.. code-block:: java

   Command eStop = drivetrain.run(coroutine -> drivetrain.stop())
     .withPriority(Priorities.EMERGENCY)
     .named("Emergency Stop");

## Telemetry

Use Epilogue for automatic telemetry, or add a periodic hook in the constructor:

.. code-block:: java

   import org.wpilib.commands3.Scheduler;

   public Intake() {
     // Set up telemetry
     Scheduler.getDefault().addPeriodicHook(() -> {
       SmartDashboard.putBoolean("Intake/Has Game Piece", hasGamePiece());
     });

     setDefaultCommand(/* ... */);
   }

Scheduler-level telemetry can show what commands are currently requiring each mechanism.

## Testing

Create test commands for individual mechanisms to verify functionality during development and at competitions. Test commands should exercise the mechanism's full range of motion and verify sensors work correctly.

.. code-block:: java

   package frc.robot.commands;

   import org.wpilib.commands3.Command;
   import frc.robot.mechanisms.*;
   import frc.robot.Constants;
   import static edu.wpi.first.units.Units.Seconds;

   public class TestCommands {

     // Test drivetrain motors and encoders
     public static Command testDrivetrain(Drivetrain drivetrain) {
       return drivetrain.run(coroutine -> {
         System.out.println("=== Testing Drivetrain ===");

         // Test forward
         System.out.println("Testing forward motion...");
         drivetrain.tank(0.3, 0.3);
         coroutine.wait(Seconds.of(1.0));
         System.out.println("Left encoder: " + drivetrain.getLeftDistance());
         System.out.println("Right encoder: " + drivetrain.getRightDistance());

         // Test backward
         System.out.println("Testing backward motion...");
         drivetrain.tank(-0.3, -0.3);
         coroutine.wait(Seconds.of(1.0));

         // Test rotation
         System.out.println("Testing rotation...");
         drivetrain.tank(0.3, -0.3);
         coroutine.wait(Seconds.of(1.0));

         drivetrain.stop();
         System.out.println("✓ Drivetrain test complete");
       }).named("Test Drivetrain");
     }

     // Test arm movement and limit switches
     public static Command testArm(Arm arm) {
       return arm.run(coroutine -> {
         System.out.println("=== Testing Arm ===");

         // Test movement to known positions
         System.out.println("Moving to mid position...");
         coroutine.await(arm.moveTo(Constants.ARM_MID));
         System.out.println("Arm angle: " + arm.getAngle() + " (target: " + Constants.ARM_MID + ")");

         coroutine.wait(Seconds.of(0.5));

         System.out.println("Moving to high position...");
         coroutine.await(arm.moveTo(Constants.ARM_HIGH));
         System.out.println("Arm angle: " + arm.getAngle() + " (target: " + Constants.ARM_HIGH + ")");

         coroutine.wait(Seconds.of(0.5));

         System.out.println("Moving to low position...");
         coroutine.await(arm.moveTo(Constants.ARM_LOW));
         System.out.println("Arm angle: " + arm.getAngle() + " (target: " + Constants.ARM_LOW + ")");

         System.out.println("✓ Arm test complete");
       }).named("Test Arm");
     }

     // Test intake sensors and motors
     public static Command testIntake(Intake intake) {
       return intake.run(coroutine -> {
         System.out.println("=== Testing Intake ===");

         System.out.println("Running intake for 2 seconds...");
         intake.setSpeed(0.5);
         coroutine.wait(Seconds.of(2.0));
         intake.stop();

         System.out.println("Beam break sensor: " + (intake.hasGamePiece() ? "BLOCKED" : "CLEAR"));

         System.out.println("Running intake reverse...");
         intake.setSpeed(-0.5);
         coroutine.wait(Seconds.of(2.0));
         intake.stop();

         System.out.println("✓ Intake test complete");
       }).named("Test Intake");
     }

     private TestCommands() {
       // Utility class - prevent instantiation
     }
   }

### Binding Test Commands

Bind test commands to controller buttons (typically D-pad or back panel buttons):

.. code-block:: java

   // In Bindings.java or RobotContainer.java
   private void configureTestBindings() {
     // Use D-pad for testing in practice mode
     driver.povUp().onTrue(TestCommands.testDrivetrain(drivetrain));
     driver.povRight().onTrue(TestCommands.testArm(arm));
     driver.povDown().onTrue(TestCommands.testIntake(intake));
     driver.povLeft().onTrue(TestCommands.testShooter(shooter));
   }

### Best Practices for Test Commands

1. **Print clear output**: Use descriptive console messages to see what's being tested
2. **Test full range**: Exercise the full range of motion and all sensors
3. **Include safety checks**: Test limit switches and safety interlocks
4. **Keep them simple**: Test one mechanism at a time
5. **Run at reduced speed**: Use lower speeds to avoid damage if something is wrong
6. **Log sensor values**: Print encoder positions, sensor states, etc.
7. **Test at competitions**: Bind test commands to verify mechanisms before matches

## Common Mistakes to Avoid

1. **Scheduling commands inside mechanisms**: Return commands from methods, don't schedule them

.. code-block:: java

   // ❌ BAD: Scheduling inside mechanism
   public void grab() {
     Scheduler.getDefault().schedule(run(coro -> { /* ... */ });
   }

   // ✅ GOOD: Return a command
   public Command grab() {
     return run(coro -> { /* ... */ }).named("Grab");
   }

2. **Forgetting to call yield()**: Always yield inside loops. A compiler plugin is in development to detect this.

.. code-block:: java

   // ❌ BAD: No yield
   while (condition) {
     doWork();
   }

   // ✅ GOOD: Yields every cycle
   while (condition) {
     doWork();
     coroutine.yield();
   }

3. **Not naming commands**: All commands need names

.. code-block:: java

   // ❌ BAD: This is a compilation error - run() returns a builder
   Command cmd = mechanism.run(coro -> { /* ... */ });

   // ✅ GOOD: Has name (and compiles)
   Command cmd = mechanism.run(coro -> { /* ... */ }).named("Action");

4. **Exposing hardware control methods**: Only commands and sensor-reading methods should be public

.. code-block:: java

   // ❌ BAD: Public hardware control methods
   public void setSpeed(double speed) {
     motor.set(speed);
   }

   // ✅ GOOD: Private hardware control, public commands
   private void setSpeed(double speed) {
     motor.set(speed);
   }

   public Command grab() {
     return run(coro -> { /* ... */ }).named("Grab");
   }

5. **Complex logic in RobotContainer**: Move complex commands to separate files. RobotContainer is not recommended in v3.

## Example: Complete Small Project

See the full example structure:

- ``Robot.java``: Minimal, calls scheduler
- ``RobotContainer.java``: Mechanisms and bindings
- ``Constants.java``: All constants
- ``mechanisms/Drivetrain.java``: Drivetrain mechanism with commands
- ``mechanisms/Intake.java``: Intake mechanism with commands
- ``commands/AutoCommands.java``: Autonomous routines

This structure scales well as your robot grows in complexity.

## See Also

- :ref:`docs/software/commandbased/commands-v2/structuring-command-based-project:Structuring a Command-Based Robot Project` - v2 structure (very similar)
- :ref:`docs/software/commandbased/commands-v2/organizing-command-based:Organizing Command-Based Robot Projects` - Additional organization tips
- :ref:`docs/software/commandbased/commands-v3/mechanisms:Mechanisms` - Detailed mechanism documentation
