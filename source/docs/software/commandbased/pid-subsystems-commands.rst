PID control through PIDSubsystems and PIDCommands
=================================================

One of the most common control algorithms used in FRC is the `PID
controller <https://en.wikipedia.org/wiki/PID_controller>`__. WPILib
offers its own ``PIDController`` class to help teams implement this
functionality on their robots (TODO: link). To further help teams
integrate PID control into a command-based robot project, the
command-based library includes several convenience wrappers for the
``PIDController`` object. There are two basic wrappers: PIDSubsystems,
which integrate the PID controller into a subsystem, and PIDCommands,
which integrate the PID controller into a command. Morevoer, each
wrapper comes in one of two varieties: synchronous, which run from the
main robot loop, and asynchronous, which run in their own thread. While
the asynchronous versions offer more functionality and potentially
tigher control, new/inexperienced users are encouraged to use the
synchronous versions to avoid having to deal with thread safety issues.

PIDSubsystems
-------------

.. code-block:: java

   SynchronousPIDSubsystem(PIDController controller)

.. code-block:: java

   AsynchronousPIDSubsystem(PIDController controller)

The PIDSubsystem classes allow users to conveniently create a subsystem
with a built-in PIDController.

Creating a PIDSubsystem
~~~~~~~~~~~~~~~~~~~~~~~

To create a PIDSubsystem, users should subclass one of the two
PIDSubsystem classes:

.. code-block:: java

   import edu.wpi.first.wpilibj.experimental.controller.PIDController;

   public class ExamplePIDSubsystem extends SynchronousPIDSubsystem {
     
     public ExamplePIDSubsystem() {
       // This would set the internal controller's gains (P, I, and D) to 0.
       super(new PIDController(0, 0, 0))
     }

     @Override
     public void useOutput(double output) {
       // Code to use the output of the PID loop goes here.  Users should generally add some sort of
       // feedforward to the loop output in this method before sending it to a motor.
     }

     @Override
     public double getReference() {
       // This should return the reference (setpoint) for the PID loop
     }

     @Override
     public double getMeasurement() {
       // This should return the measurement of the process variable
     }
   }

Additional settings can be applied to the ``PIDController`` (TODO: link)
by calling the ``getController`` method from the constructor.

Using a PIDSubsystem
~~~~~~~~~~~~~~~~~~~~

What does a PIDSubsystem look like when used in practice? The following
examples are taken from the FrisbeeBot example project (TODO: link):

.. code-block:: java

   package edu.wpi.first.wpilibj.examples.frisbeebot.subsystems;

   import edu.wpi.first.wpilibj.Encoder;
   import edu.wpi.first.wpilibj.Spark;
   import edu.wpi.first.wpilibj.experimental.command.SynchronousPIDSubsystem;
   import edu.wpi.first.wpilibj.experimental.controller.PIDController;

   import static edu.wpi.first.wpilibj.examples.frisbeebot.Constants.ShooterConstants.*;

   public class ShooterSubsystem extends SynchronousPIDSubsystem {

     private Spark m_shooterMotor = new Spark(kShooterMotorPort);
     private Spark m_feederMotor = new Spark(kFeederMotorPort);
     private Encoder m_shooterEncoder = new Encoder(kEncoderPorts[0], kEncoderPorts[1],
         kEncoderReversed);

     public ShooterSubsystem() {
       super(new PIDController(kP, kI, kD));
       getController().setAbsoluteTolerance(kShooterToleranceRPS);
       m_shooterEncoder.setDistancePerPulse(kEncoderDistancePerPulse);
     }

     @Override
     public void useOutput(double output) {
       // Use a feedforward of the form kS + kV * velocity
       m_shooterMotor.set(output + kSFractional + kVFractional * kShooterTargetRPS);
     }

     @Override
     public double getReference() {
       return kShooterTargetRPS;
     }

     @Override
     public double getMeasurement() {
       return m_shooterEncoder.getRate();
     }

     public boolean atReference() {
       return m_controller.atReference();
     }

     public void runFeeder() {
       m_feederMotor.set(kFeederSpeed);
     }

     public void stopFeeder() {
       m_feederMotor.set(0);
     }

     @Override
     public void disable() {
       super.disable();
       // Turn off motor when we disable, since useOutput(0) doesn't stop the motor due to our
       // feedforward
       m_shooterMotor.set(0);
     }
   }

Notice that the ``disable()`` method has been overridden, even though
the superclass has an implementation - this is because the default
implementation (for both synchronous and asynchronous) calls
``useOutput(0);``, which may not necessarily set the motor output to
zero depending on the type of feedforward implemented by the user.

Using a PIDSubsystem with commands can be very simple:

.. code-block:: java

   // Spin up the shooter when the 'A' button is pressed
   driverController.getButton(Button.kA.value)
       .whenPressed(new InstantCommand(m_shooter::enable, m_shooter));

   // Turn off the shooter when the 'B' button is pressed
   driverController.getButton(Button.kB.value)
       .whenPressed(new InstantCommand(m_shooter::disable, m_shooter));

PIDCommands
-----------

.. code-block:: java

   SynchronousPIDCommand(PIDController controller,
                         DoubleSupplier measurementSource,
                         double reference,
                         DoubleConsumer useOutput,
                         Subsystem... requirements)

.. code-block:: java

   AsynchronousPIDCommand(PIDController controller,
                          DoubleSupplier measurementSource,
                          double reference,
                          DoubleConsumer useOutput,
                          Subsystem... requirements)

The PIDCommand classes allow users to easily create commands with a
built-in PIDController.

Creating a PIDCommand
~~~~~~~~~~~~~~~~~~~~~

As with PIDSubsystem, users can create a PIDCommmand by subclassing one
of the two PIDCommand classes.

.. code-block:: java

   import edu.wpi.first.wpilibj.experimental.controller.PIDController;

   public class ExamplePIDCommand extends SynchronousPIDCommand {
     
     public ExamplePIDCommand() {
       super(new PIDController(0, 0, 0), //Creates a PIDController with all gains set to 0
           () -> { /*This should return the measurement of the process variable*/ },
           () -> { /*This should return the reference (setpoint) for the controller*/ },
           (output) -> { /*Code to use the output of the PID loop goes here*/ },
           requiredSubsystem /*PIDCommands should declare their requirements*/);
     }
     
   }

However, as with many of the other command classes in the command-based
library, users may want to save code by defining a PIDCommand
`inline <inline-commands>`__:

.. code-block:: java

   new PIDCommand(new PIDController(0, 0, 0), //Creates a PIDController with all gains set to 0
       () -> { /*This should return the measurement of the process variable*/ },
       () -> { /*This should return the reference (setpoint) for the controller*/ },
       (output) -> { /*Code to use the output of the PID loop goes here*/ },
       requiredSubsystem /*PIDCommands should declare their requirements*/);

Using a PIDCommand
~~~~~~~~~~~~~~~~~~

What does a PIDCommand look like when used in practice? The following
examples are from the GyroDriveCommands example project (TODO: link):

.. code-block:: java

   package edu.wpi.first.wpilibj.examples.gyrodrivecommands.commands;

   import edu.wpi.first.wpilibj.examples.gyrodrivecommands.subsystems.DriveSubsystem;
   import edu.wpi.first.wpilibj.experimental.command.SynchronousPIDCommand;
   import edu.wpi.first.wpilibj.experimental.controller.PIDController;

   import static edu.wpi.first.wpilibj.examples.gyrodrivecommands.Constants.DriveConstants.*;

   /**
    * A command that will turn the robot to the specified angle.
    */
   public class TurnToAngle extends SynchronousPIDCommand {

     public TurnToAngle(double targetAngleDegrees, DriveSubsystem drive) {
       super(new PIDController(kTurnP, kTurnI, kTurnD),
           // Close loop on heading
           drive::getHeading,
           // Set reference to target
           targetAngleDegrees,
           // Pipe output to turn robot
           (output) -> drive.arcadeDrive(0, output),
           // Require the drive
           drive);

       // Set the input range of the controller to match the gyro output
       getController().setInputRange(-180, 180);
       // Set the controller to be continuous (because it is an angle controller)
       getController().setContinuous();
       // Set the controller tolerance - the delta tolerance ensures the robot is stationary at the
       // setpoint before it is considered as having reached the reference
       getController().setAbsoluteTolerance(kTurnToleranceDeg, kTurnRateToleranceDegPerS);
     }

     @Override
     public boolean isFinished() {
       // End when the controller is at the reference.
       return getController().atReference();
     }
   }

And, for an `inlined <inline-commands>`__ example:

.. code-block:: java

   // Stabilize robot to drive straight with gyro when left bumper is held
   driverController.getButton(Button.kBumperLeft.value).whenHeld(
       new SynchronousPIDCommand(
           new PIDController(kStabilizationP, kStabilizationI, kStabilizationD),
           // Close the loop on the turn rate
           m_robotDrive::getTurnRate,
           // Setpoint is 0
           0,
           // Pipe the output to the turning controls
           (output) ->
               m_robotDrive.arcadeDrive(driverController.getY(GenericHID.Hand.kLeft), output),
           // Require the robot drive
           m_robotDrive
       )
   );