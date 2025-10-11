# Testing Commands v3 Projects

Systematic testing is crucial for identifying hardware and software issues before matches. Commands v3's imperative style makes it easy to write comprehensive test routines that verify mechanism functionality and report results.

This article covers how to build a hierarchical testing system with mechanism-level tests that report success/failure to high-level integration tests.

## Testing Philosophy

Test commands differ from regular commands in several ways:

1. **Result reporting**: Test commands return success/failure status
2. **Range verification**: Tests check that sensor readings are within normal ranges
3. **External stimulus**: Integration tests may wait for manual actions (loading game pieces, moving mechanisms)
4. **Systematic coverage**: Tests exercise full mechanism range and all sensors
5. **Test mode**: Often run in FRC Test mode with specific controller bindings

## Test Command Structure

### Mechanism-Level Tests

Mechanism tests verify individual subsystem functionality and return results:

.. code-block:: java

   package frc.robot.commands.tests;

   import org.wpilib.commands3.Command;
   import frc.robot.mechanisms.*;
   import static edu.wpi.first.units.Units.Seconds;

   public class IntakeTests {

     public static class TestResult {
       public final boolean success;
       public final String message;

       public TestResult(boolean success, String message) {
         this.success = success;
         this.message = message;
       }
     }

     // Test intake motor and sensors
     public static Command testIntake(Intake intake, TestResult[] resultOut) {
       return intake.run(coroutine -> {
         System.out.println("=== Testing Intake ===");

         // Test 1: Motor runs and draws reasonable current
         System.out.println("Test 1: Motor operation");
         intake.setSpeed(0.5);
         coroutine.wait(Seconds.of(0.5));

         double current = intake.getMotorCurrent();
         if (current < 0.1 || current > 20.0) {
           resultOut[0] = new TestResult(false, "Motor current out of range: " + current + "A");
           intake.stop();
           return;
         }
         System.out.println("✓ Motor current normal: " + current + "A");

         // Test 2: Beam break sensor responds
         System.out.println("Test 2: Waiting for game piece (beam break test)...");
         System.out.println("Please load a game piece into the intake");

         // Wait up to 10 seconds for beam break
         boolean beamBroken = false;
         for (int i = 0; i < 100; i++) {
           if (intake.hasGamePiece()) {
             beamBroken = true;
             break;
           }
           coroutine.wait(Seconds.of(0.1));
         }

         if (!beamBroken) {
           resultOut[0] = new TestResult(false, "Beam break sensor did not trigger (check sensor or wiring)");
           intake.stop();
           return;
         }
         System.out.println("✓ Beam break sensor working");

         // Test 3: Reverse works
         System.out.println("Test 3: Reverse operation");
         intake.setSpeed(-0.5);
         coroutine.wait(Seconds.of(1.0));
         intake.stop();

         System.out.println("✓ All intake tests passed");
         resultOut[0] = new TestResult(true, "Intake fully functional");
       }).named("Test Intake");
     }

     // Test intake deployment mechanism
     public static Command testIntakeDeploy(Intake intake, TestResult[] resultOut) {
       return intake.run(coroutine -> {
         System.out.println("=== Testing Intake Deployment ===");

         // Test deployment
         System.out.println("Deploying intake...");
         coroutine.await(intake.deploy());

         if (!intake.isDeployed()) {
           resultOut[0] = new TestResult(false, "Intake failed to deploy");
           return;
         }
         System.out.println("✓ Deploy successful");

         coroutine.wait(Seconds.of(0.5));

         // Test retraction
         System.out.println("Retracting intake...");
         coroutine.await(intake.retract());

         if (intake.isDeployed()) {
           resultOut[0] = new TestResult(false, "Intake failed to retract");
           return;
         }
         System.out.println("✓ Retract successful");

         System.out.println("✓ All deployment tests passed");
         resultOut[0] = new TestResult(true, "Deployment fully functional");
       }).named("Test Intake Deploy");
     }
   }

### Testing with Range Verification

Many mechanisms need to verify that sensor readings are within expected ranges:

.. code-block:: java

   public class DrivetrainTests {

     public static Command testDrivetrain(Drivetrain drivetrain, TestResult[] resultOut) {
       return drivetrain.run(coroutine -> {
         System.out.println("=== Testing Drivetrain ===");

         // Reset encoders
         drivetrain.resetEncoders();
         coroutine.wait(Seconds.of(0.1));

         // Test 1: Encoders start at zero
         double leftStart = drivetrain.getLeftDistance();
         double rightStart = drivetrain.getRightDistance();

         if (Math.abs(leftStart) > 0.01 || Math.abs(rightStart) > 0.01) {
           resultOut[0] = new TestResult(false,
             "Encoders didn't reset properly: L=" + leftStart + " R=" + rightStart);
           return;
         }
         System.out.println("✓ Encoders reset correctly");

         // Test 2: Drive forward and verify encoders increase
         System.out.println("Test 2: Forward motion");
         drivetrain.tank(0.3, 0.3);
         coroutine.wait(Seconds.of(1.0));
         drivetrain.stop();

         double leftDist = drivetrain.getLeftDistance();
         double rightDist = drivetrain.getRightDistance();

         // Expect roughly 0.5-2 meters of travel at 30% speed for 1 second
         if (leftDist < 0.1 || leftDist > 3.0) {
           resultOut[0] = new TestResult(false,
             "Left encoder reading unusual: " + leftDist + "m (expected 0.5-2m)");
           return;
         }
         if (rightDist < 0.1 || rightDist > 3.0) {
           resultOut[0] = new TestResult(false,
             "Right encoder reading unusual: " + rightDist + "m (expected 0.5-2m)");
           return;
         }

         // Check for straight driving (encoders should be similar)
         double difference = Math.abs(leftDist - rightDist);
         if (difference > 0.5) {
           resultOut[0] = new TestResult(false,
             "Drivetrain not driving straight: L=" + leftDist + "m R=" + rightDist + "m (diff=" + difference + "m)");
           return;
         }
         System.out.println("✓ Forward motion working, encoders reading: L=" + leftDist + "m R=" + rightDist + "m");

         // Test 3: Current draw is reasonable
         double leftCurrent = drivetrain.getLeftCurrent();
         double rightCurrent = drivetrain.getRightCurrent();

         if (leftCurrent < 0.5 || leftCurrent > 40.0) {
           resultOut[0] = new TestResult(false, "Left motor current out of range: " + leftCurrent + "A");
           return;
         }
         if (rightCurrent < 0.5 || rightCurrent > 40.0) {
           resultOut[0] = new TestResult(false, "Right motor current out of range: " + rightCurrent + "A");
           return;
         }
         System.out.println("✓ Motor currents normal: L=" + leftCurrent + "A R=" + rightCurrent + "A");

         // Test 4: Gyro is responding
         double heading = drivetrain.getHeading().getDegrees();
         drivetrain.tank(0.3, -0.3); // Rotate
         coroutine.wait(Seconds.of(1.0));
         drivetrain.stop();

         double newHeading = drivetrain.getHeading().getDegrees();
         double headingChange = Math.abs(newHeading - heading);

         if (headingChange < 10.0) {
           resultOut[0] = new TestResult(false,
             "Gyro not responding (heading change: " + headingChange + "°, expected >10°)");
           return;
         }
         System.out.println("✓ Gyro working, heading changed by " + headingChange + "°");

         System.out.println("✓ All drivetrain tests passed");
         resultOut[0] = new TestResult(true, "Drivetrain fully functional");
       }).named("Test Drivetrain");
     }
   }

### Testing Mechanisms with Limit Switches

Test commands should verify safety interlocks work:

.. code-block:: java

   public class ArmTests {

     public static Command testArm(Arm arm, TestResult[] resultOut) {
       return arm.run(coroutine -> {
         System.out.println("=== Testing Arm ===");

         // Test 1: Home to find lower limit
         System.out.println("Test 1: Homing to lower limit");
         coroutine.await(arm.home());

         if (!arm.atLowerLimit()) {
           resultOut[0] = new TestResult(false, "Lower limit switch not triggered after homing");
           return;
         }
         System.out.println("✓ Lower limit switch working");

         // Test 2: Move to known positions
         System.out.println("Test 2: Movement to setpoints");

         coroutine.await(arm.moveTo(Constants.ARM_MID));
         double midAngle = arm.getAngle();
         if (Math.abs(midAngle - Constants.ARM_MID) > 0.1) {
           resultOut[0] = new TestResult(false,
             "Mid position inaccurate: " + midAngle + " (expected " + Constants.ARM_MID + ")");
           return;
         }
         System.out.println("✓ Mid position accurate: " + midAngle);

         coroutine.await(arm.moveTo(Constants.ARM_HIGH));
         double highAngle = arm.getAngle();
         if (Math.abs(highAngle - Constants.ARM_HIGH) > 0.1) {
           resultOut[0] = new TestResult(false,
             "High position inaccurate: " + highAngle + " (expected " + Constants.ARM_HIGH + ")");
           return;
         }
         System.out.println("✓ High position accurate: " + highAngle);

         // Test 3: Upper limit prevents over-travel
         System.out.println("Test 3: Upper limit protection");
         // Attempt to move past upper limit (should be prevented by safety code)
         coroutine.await(arm.moveTo(Constants.ARM_HIGH + 0.5));

         if (!arm.atUpperLimit()) {
           resultOut[0] = new TestResult(false, "Arm moved past upper limit (safety interlock failed)");
           return;
         }
         System.out.println("✓ Upper limit protection working");

         System.out.println("✓ All arm tests passed");
         resultOut[0] = new TestResult(true, "Arm fully functional");
       }).named("Test Arm");
     }
   }

## Integration Testing

High-level tests run all mechanism tests and report overall system status:

.. code-block:: java

   package frc.robot.commands.tests;

   import org.wpilib.commands3.Command;
   import frc.robot.Robot;
   import edu.wpi.first.wpilibj.Telemetry;

   public class RobotTests {

     public static Command testAllSystems(Robot robot) {
       return Command.noRequirements().executing(coroutine -> {
         System.out.println("====================================");
         System.out.println("    ROBOT SYSTEM TEST");
         System.out.println("====================================");

         int passed = 0;
         int failed = 0;

         // Test each mechanism
         var driveResult = new DrivetrainTests.TestResult[1];
         var intakeResult = new IntakeTests.TestResult[1];
         var armResult = new ArmTests.TestResult[1];
         var shooterResult = new ShooterTests.TestResult[1];

         // Run drivetrain test
         System.out.println("\n--- Drivetrain ---");
         coroutine.await(DrivetrainTests.testDrivetrain(robot.drivetrain, driveResult));
         if (driveResult[0].success) {
           passed++;
           Telemetry.log("Tests/Drivetrain", "PASS");
         } else {
           failed++;
           Telemetry.log("Tests/Drivetrain", "FAIL: " + driveResult[0].message);
           System.err.println("❌ FAILED: " + driveResult[0].message);
         }

         // Run intake test
         System.out.println("\n--- Intake ---");
         coroutine.await(IntakeTests.testIntake(robot.intake, intakeResult));
         if (intakeResult[0].success) {
           passed++;
           Telemetry.log("Tests/Intake", "PASS");
         } else {
           failed++;
           Telemetry.log("Tests/Intake", "FAIL: " + intakeResult[0].message);
           System.err.println("❌ FAILED: " + intakeResult[0].message);
         }

         // Run arm test
         System.out.println("\n--- Arm ---");
         coroutine.await(ArmTests.testArm(robot.arm, armResult));
         if (armResult[0].success) {
           passed++;
           Telemetry.log("Tests/Arm", "PASS");
         } else {
           failed++;
           Telemetry.log("Tests/Arm", "FAIL: " + armResult[0].message);
           System.err.println("❌ FAILED: " + armResult[0].message);
         }

         // Run shooter test
         System.out.println("\n--- Shooter ---");
         coroutine.await(ShooterTests.testShooter(robot.shooter, shooterResult));
         if (shooterResult[0].success) {
           passed++;
           Telemetry.log("Tests/Shooter", "PASS");
         } else {
           failed++;
           Telemetry.log("Tests/Shooter", "FAIL: " + shooterResult[0].message);
           System.err.println("❌ FAILED: " + shooterResult[0].message);
         }

         // Print summary
         System.out.println("\n====================================");
         System.out.println("    TEST SUMMARY");
         System.out.println("====================================");
         System.out.println("Passed: " + passed);
         System.out.println("Failed: " + failed);

         Telemetry.log("Tests/Total Passed", passed);
         Telemetry.log("Tests/Total Failed", failed);

         if (failed == 0) {
           System.out.println("✓ ALL SYSTEMS FUNCTIONAL");
           Telemetry.log("Tests/Overall Status", "PASS - ALL SYSTEMS GO");
         } else {
           System.err.println("❌ SOME SYSTEMS FAILED - CHECK ABOVE");
           Telemetry.log("Tests/Overall Status", "FAIL - " + failed + " SYSTEMS DOWN");
         }
         System.out.println("====================================");

       }).named("Test All Systems");
     }
   }

## Using FRC Test Mode

Test commands are typically bound in Test mode:

.. code-block:: java

   package frc.robot;

   import edu.wpi.first.wpilibj.TimedRobot;
   import org.wpilib.commands3.Scheduler;

   public class Robot extends TimedRobot {
     private Robot robotContainer;

     @Override
     public void robotInit() {
       robotContainer = new RobotContainer();
     }

     @Override
     public void robotPeriodic() {
       Scheduler.getDefault().run();
     }

     @Override
     public void testInit() {
       // Run full system test when entering Test mode
       Scheduler.getDefault().cancelAll();
       Scheduler.getDefault().schedule(
         RobotTests.testAllSystems(robotContainer)
       );
     }

     @Override
     public void testPeriodic() {
       // Scheduler runs in robotPeriodic
     }
   }

Alternatively, bind tests to controller buttons in Test mode:

.. code-block:: java

   public class RobotContainer {
     private final CommandXboxController testController = new CommandXboxController(2);

     public RobotContainer() {
       configureBindings();
       configureTestBindings();
     }

     private void configureTestBindings() {
       // Only active in Test mode
       testController.a().onTrue(
         DrivetrainTests.testDrivetrain(drivetrain, new DrivetrainTests.TestResult[1])
       );

       testController.b().onTrue(
         IntakeTests.testIntake(intake, new IntakeTests.TestResult[1])
       );

       testController.x().onTrue(
         ArmTests.testArm(arm, new ArmTests.TestResult[1])
       );

       testController.y().onTrue(
         RobotTests.testAllSystems(this)
       );
     }
   }

## Best Practices

1. **Test at reduced speeds**: Use 30-50% power to avoid damage if something is wrong
2. **Verify sensor ranges**: Check that readings are physically plausible
3. **Test safety interlocks**: Ensure limit switches and safety mechanisms work
4. **Wait for external stimulus**: For sensors that need external input (beam breaks, etc.), wait for manual actions
5. **Print clear output**: Use descriptive messages so failures are easy to diagnose
6. **Log to telemetry**: Send results to dashboard for visibility
7. **Test before every match**: Run system tests during robot inspection and before matches
8. **Create quick tests**: Have fast tests for between-match checks
9. **Document expected ranges**: Comment what values are normal for each sensor

## Example: Quick Pre-Match Check

A faster test for between matches:

.. code-block:: java

   public static Command quickSystemCheck(Robot robot) {
     return Command.noRequirements().executing(coroutine -> {
       System.out.println("=== QUICK SYSTEM CHECK ===");

       boolean allGood = true;

       // Quick drive check
       robot.drivetrain.tank(0.2, 0.2);
       coroutine.wait(Seconds.of(0.3));
       robot.drivetrain.stop();
       if (robot.drivetrain.getLeftDistance() < 0.05) {
         System.err.println("❌ Left drive not responding");
         allGood = false;
       }
       if (robot.drivetrain.getRightDistance() < 0.05) {
         System.err.println("❌ Right drive not responding");
         allGood = false;
       }

       // Quick mechanism checks
       if (!robot.intake.hasGamePiece() && robot.intake.getMotorCurrent() < 0.1) {
         System.err.println("⚠ Intake may not be connected");
         allGood = false;
       }

       if (allGood) {
         System.out.println("✓ QUICK CHECK PASSED - READY TO COMPETE");
       } else {
         System.err.println("❌ ISSUES DETECTED - RUN FULL TEST");
       }
     }).named("Quick System Check");
   }

## See Also

- :ref:`docs/software/commandbased/commands-v3/structuring-v3-project:Structuring a Commands v3 Project` - Overall project organization
- :ref:`docs/software/commandbased/commands-v3/coroutines-and-async:Coroutines and Async Patterns` - Using await for sequential tests
