Retrieving data
===============
Unlike ``SmartDashboard.getNumber`` and friends, retrieving data from Shuffleboard is also done through the NetworkTableEntries, which we covered in the previous article.

.. tab-set-code::

   .. code-block:: java

      class DriveBase extends Subsystem {
         private ShuffleboardTab tab = Shuffleboard.getTab("Drive");
         private GenericEntry maxSpeed =
            tab.add("Max Speed", 1)
               .getEntry();

         private DifferentialDrive robotDrive = ...;

         public void drive(double left, double right) {
         // Retrieve the maximum speed from the dashboard
         double max = maxSpeed.getDouble(1.0);
         robotDrive.tankDrive(left * max, right * max);
         }
      }

   .. code-block:: python

      import commands2
      import wpilib.drive
      from wpilib.shuffleboard import Shuffleboard

      class DriveSubsystem(commands2.SubsystemBase):
         def __init__(self) -> None:
            super().__init__()

            tab = Shuffleboard.getTab("Drive")
            self.maxSpeed = tab.add("Max Speed", 1).getEntry()

            this.robotDrive = ...

         def drive(self, left: float, right: float):
            # Retrieve the maximum speed from the dashboard
            max = self.maxSpeed.getDouble(1.0)
            self.robotDrive.tankDrive(left * max, right * max)

This basic example has a glaring flaw: the maximum speed can be set on the dashboard to a value outside [0, 1] - which could cause the inputs to be saturated (always at maximum speed), or even reversed! Fortunately, there is a way to avoid this problem - covered in the next article.
