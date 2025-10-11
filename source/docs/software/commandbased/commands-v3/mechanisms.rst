# Mechanisms

Mechanisms (called "Subsystems" in Commands v2) represent independently-controlled groupings of robot hardware. They serve two key purposes:

1. **Encapsulation**: Hide hardware implementation details from the rest of your code
2. **Resource Management**: Ensure only one command uses a mechanism at a time

.. note::
   If you're familiar with Commands v2 Subsystems, Mechanisms work almost identically. The main differences are the name change and a few API updates for v3's coroutine-based commands.

## Creating a Mechanism

Mechanisms extend the ``Mechanism`` base class from the ``org.wpilib.commands3`` package.

.. code-block:: java

   import org.wpilib.commands3.Mechanism;
   import org.wpilib.commands3.Command;

   public class Drivetrain extends Mechanism {
     private final WPI_TalonFX leftLeader = new WPI_TalonFX(1);
     private final WPI_TalonFX rightLeader = new WPI_TalonFX(2);
     private final DifferentialDriveOdometry odometry;
     private final Encoder leftEncoder;
     private final Encoder rightEncoder;

     public Drivetrain() {
       // Configure hardware
       leftLeader.setInverted(false);
       rightLeader.setInverted(true);

       leftEncoder = new Encoder(0, 1);
       rightEncoder = new Encoder(2, 3);

       odometry = new DifferentialDriveOdometry(
         getHeading(),
         getLeftDistance(),
         getRightDistance()
       );

       // Set a default command
       setDefaultCommand(
         runRepeatedly(() -> tank(0, 0))
           .withPriority(Command.LOWEST_PRIORITY)
           .named("Drive[IDLE]")
       );
     }

     // Private hardware control methods
     private void tank(double left, double right) {
       leftLeader.set(left);
       rightLeader.set(right);
     }

     private void stop() {
       tank(0, 0);
     }

     public void resetEncoders() {
       leftEncoder.reset();
       rightEncoder.reset();
     }

     public double getLeftDistance() {
       return leftEncoder.getDistance();
     }

     public double getRightDistance() {
       return rightEncoder.getDistance();
     }

     public Rotation2d getHeading() {
       // Implementation depends on your gyro
       return new Rotation2d();
     }

     @Override
     public void periodic() {
       // This method runs every robot loop (50Hz)
       odometry.update(getHeading(), getLeftDistance(), getRightDistance());
     }
   }

## Mechanism Lifecycle

### Construction

Mechanisms are typically instantiated once in your ``RobotContainer`` class:

.. code-block:: java

   public class RobotContainer {
     private final Drivetrain drivetrain = new Drivetrain();
     private final Arm arm = new Arm();
     private final Intake intake = new Intake();

     public RobotContainer() {
       configureBindings();
     }

     private void configureBindings() {
       // Set up button bindings here
     }
   }

### Telemetry and Periodic Updates

Mechanisms often need to run periodic updates for telemetry, odometry, or sensor processing. In Commands v3, use **periodic hooks** instead of overriding a ``periodic()`` method:

.. code-block:: java

   import org.wpilib.commands3.Scheduler;

   public Drivetrain() {
     // Add periodic hook for updates
     Scheduler.getDefault().addPeriodicHook(() -> {
       // Update odometry
       odometry.update(getHeading(), getLeftDistance(), getRightDistance());

       // Publish telemetry
       Telemetry.log("Drivetrain/Left Distance", getLeftDistance());
       Telemetry.log("Drivetrain/Right Distance", getRightDistance());
     });

     // Set up default command
     setDefaultCommand(
       runRepeatedly(() -> tank(0, 0))
         .withPriority(Command.LOWEST_PRIORITY)
         .named("Drive[IDLE]")
     );
   }

Alternatively, use **Epilogue** for automatic telemetry logging without manual hooks.

**Do not** use periodic hooks for command logic. Commands should be written as separate methods that return ``Command`` objects.

## Default Commands

Default commands run whenever no other command is using the mechanism. They're perfect for idle behavior like stopping motors or maintaining a hold position.

.. code-block:: java

   public Drivetrain() {
     setDefaultCommand(
       runRepeatedly(() -> tank(0, 0))
         .withPriority(Command.LOWEST_PRIORITY)
         .named("Drive[IDLE]")
     );
   }

.. warning::
   Default commands should have ``Command.LOWEST_PRIORITY`` so they're easily interrupted by any other command.

### Changing Default Commands

You can change a mechanism's default command at runtime:

.. code-block:: java

   // In RobotContainer or elsewhere
   drivetrain.setDefaultCommand(
     drivetrain.runRepeatedly(() ->
       drivetrain.arcadeDrive(driverController.getLeftY(), driverController.getRightX())
     )
     .withPriority(Command.LOWEST_PRIORITY)
     .named("Arcade Drive[DEFAULT]")
   );

## Building Commands from Mechanisms

Mechanisms provide factory methods for creating commands that require that mechanism:

### ``run(Consumer<Coroutine>)``

Creates a command that runs your coroutine body once. Use ``coroutine.yield()`` inside loops or ``coroutine.park()`` to run forever until canceled.

.. code-block:: java

   // Drive forward until 10 meters
   Command driveForward = drivetrain.run(coroutine -> {
     drivetrain.resetEncoders();
     while (drivetrain.getLeftDistance() < 10.0) {
       drivetrain.tank(0.5, 0.5);
       coroutine.yield();
     }
     drivetrain.stop();
   }).named("Drive 10m");

   // Run intake until canceled
   Command runIntake = intake.run(coroutine -> {
     intake.setSpeed(0.8);
     coroutine.park(); // Run forever until canceled
   }).whenCanceled(() -> intake.setSpeed(0)).named("Run Intake");

### ``runRepeatedly(Runnable)``

Creates a command where the body runs every scheduler cycle. Good for continuous control.

.. code-block:: java

   // Teleop drive
   Command teleopDrive = drivetrain.runRepeatedly(() ->
     drivetrain.arcadeDrive(
       driverController.getLeftY(),
       driverController.getRightX()
     )
   ).named("Teleop Drive");

   // Hold position
   Command holdPosition = arm.runRepeatedly(() ->
     arm.setVoltage(arm.getFeedforward().calculate(arm.getAngle(), 0))
   ).named("Hold Position");

## Resource Management

The scheduler ensures only one command can require a mechanism at a time. When a new command is scheduled that requires a mechanism already in use:

1. **If the new command has higher priority**: The old command is interrupted, the new one starts
2. **If the new command has equal priority**: The old command is interrupted, the new one starts
3. **If the new command has lower priority**: The new command is rejected, the old one continues

.. code-block:: java

   // Low priority default (priority = LOWEST_PRIORITY)
   drivetrain.setDefaultCommand(
     drivetrain.runRepeatedly(() -> drivetrain.stop())
       .withPriority(Command.LOWEST_PRIORITY)
       .named("Stop[DEFAULT]")
   );

   // Normal priority command (priority = 0, default)
   Command normalDrive = drivetrain.run(coro -> {
     // Drive logic
   }).named("Normal Drive");
   // This will interrupt the default command

   // High priority emergency stop (priority = 1000)
   Command eStop = drivetrain.run(coro -> {
     drivetrain.stop();
   }).withPriority(1000).named("EMERGENCY STOP");
   // This will interrupt anything

See :ref:`docs/software/commandbased/commands-v3/priorities-and-interrupts:Priorities and Interrupts` for details.

## Commands Without Mechanism Requirements

Sometimes you need a command that doesn't require any mechanism, or requires multiple mechanisms. Use ``Command.noRequirements()``:

.. code-block:: java

   Command complexAuto = Command.noRequirements().executing(coroutine -> {
     // This command doesn't automatically require anything,
     // but the commands we await() will require their mechanisms
     coroutine.await(drivetrain.driveToPose(pose1));
     coroutine.await(arm.moveTo(position));
     coroutine.await(intake.grab());
     coroutine.await(drivetrain.driveToPose(pose2));
     coroutine.await(arm.moveTo(scorePosition));
     coroutine.await(intake.release());
   }).named("Complex Auto");

When using ``await()``, the awaited command's requirements are active only while that command runs. This allows you to sequence commands that require different mechanisms without locking all of them for the entire sequence.

## Checking Running Commands

You can query which commands are currently using a mechanism:

.. code-block:: java

   Set<Command> runningCommands = drivetrain.getRunningCommands();

   for (Command cmd : runningCommands) {
     System.out.println("Running: " + cmd.getName());
   }

## Example: Complete Mechanism

Here's a complete example of an Arm mechanism with several commands:

.. code-block:: java

   import org.wpilib.commands3.Mechanism;
   import org.wpilib.commands3.Command;
   import edu.wpi.first.math.controller.ArmFeedforward;
   import edu.wpi.first.math.controller.PIDController;
   import static edu.wpi.first.units.Units.Seconds;

   public class Arm extends Mechanism {
     private final WPI_TalonFX motor = new WPI_TalonFX(5);
     private final Encoder encoder = new Encoder(4, 5);
     private final PIDController pid = new PIDController(1.0, 0, 0);
     private final ArmFeedforward feedforward = new ArmFeedforward(0.5, 0.3, 0.1);

     private double targetAngle = 0;

     public Arm() {
       encoder.setDistancePerPulse(2 * Math.PI / 4096); // radians per tick

       setDefaultCommand(
         runRepeatedly(() -> holdPosition())
           .withPriority(Command.LOWEST_PRIORITY)
           .named("Arm[HOLD]")
       );
     }

     // Public sensor reading methods
     public double getAngle() {
       return encoder.getDistance();
     }

     public boolean atGoal() {
       return Math.abs(getAngle() - targetAngle) < 0.05; // 0.05 radians
     }

     // Private hardware control methods
     private void setVoltage(double volts) {
       motor.setVoltage(volts);
     }

     private void holdPosition() {
       double pidOutput = pid.calculate(getAngle(), targetAngle);
       double ffOutput = feedforward.calculate(targetAngle, 0);
       setVoltage(pidOutput + ffOutput);
     }

     // Command: Move to specific angle
     public Command moveTo(double angle) {
       return run(coroutine -> {
         targetAngle = angle;
         while (!atGoal()) {
           holdPosition(); // Use PID + feedforward
           coroutine.yield();
         }
       }).named("Arm Move to " + angle);
     }

     // Command: Manual control
     public Command manualControl(DoubleSupplier speedSupplier) {
       return runRepeatedly(() -> {
         double speed = speedSupplier.getAsDouble();
         targetAngle = getAngle(); // Track current position
         setVoltage(speed * 12.0); // Direct voltage control
       }).named("Arm Manual");
     }

     // Command: Home the arm
     public Command home() {
       return run(coroutine -> {
         // Move down slowly until limit switch
         while (!limitSwitch.get()) {
           setVoltage(-2.0);
           coroutine.yield();
         }
         encoder.reset();
         targetAngle = 0;
         setVoltage(0);
       }).named("Home Arm");
     }

     public Arm() {
       // Add telemetry via periodic hook
       Scheduler.getDefault().addPeriodicHook(() -> {
         Telemetry.log("Arm/Angle", getAngle());
         Telemetry.log("Arm/Target", targetAngle);
         Telemetry.log("Arm/At Goal", atGoal());
       });

       // Set default command
       setDefaultCommand(
         runRepeatedly(() -> setVoltage(0))
           .withPriority(Command.LOWEST_PRIORITY)
           .named("Arm[IDLE]")
       );
     }
   }

## Best Practices

1. **Keep hardware private**: Expose methods, not hardware objects. This lets you change hardware without changing commands.

2. **Use descriptive method names**: ``tank(left, right)`` is clearer than ``set(l, r)``

3. **Publish telemetry with periodic hooks or Epilogue**: Don't clutter command code with dashboard calls

4. **Set default commands**: Idle behavior (like stopping motors) prevents unexpected movement

5. **Use appropriate priorities**: Defaults should be ``LOWEST_PRIORITY``

6. **Return commands from methods**: Don't schedule commands inside the mechanism

.. code-block:: java

   // ✅ GOOD: Return a command
   public Command driveToPose(Pose2d target) {
     return run(coro -> {
       // Drive logic
     }).named("Drive to " + target);
   }

   // ❌ BAD: Scheduling inside mechanism
   public void driveToPose(Pose2d target) {
     Scheduler.getDefault().schedule(run(coro -> {
       // Drive logic
     }).named("Drive to " + target));
   }

## Comparing to v2 Subsystems

If you're coming from Commands v2, here's a quick reference:

.. list-table::
   :header-rows: 1
   :widths: 40 30 30

   * - Concept
     - Commands v2
     - Commands v3
   * - Base class
     - ``SubsystemBase``
     - ``Mechanism``
   * - Package
     - ``org.wpilib.commands2``
     - ``org.wpilib.commands3``
   * - Set default
     - ``setDefaultCommand()``
     - ``setDefaultCommand()``
   * - Get current command
     - ``getCurrentCommand()``
     - ``getRunningCommands()``
   * - Create command
     - Return ``Command`` from method
     - Use ``run()`` or ``runRepeatedly()``

See :ref:`docs/software/commandbased/commands-v3/migration-from-v2:Migrating from Commands v2 to v3` for comprehensive migration guidance.
