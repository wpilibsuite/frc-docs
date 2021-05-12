Retrieving data
===============
Unlike ``SmartDashboard.getNumber`` and friends, retrieving data from Shuffleboard is also done through the NetworkTableEntries, which we covered in the previous article.

.. tabs::

   .. code-tab:: java

       class DriveBase extends Subsystem {
          private ShuffleboardTab tab = Shuffleboard.getTab("Drive");
          private NetworkTableEntry maxSpeed =
              tab.add("Max Speed", 1)
                 .getEntry();

          private DifferentialDrive robotDrive = ...;

          public void drive(double left, double right) {
            // Retrieve the maximum speed from the dashboard
            double max = maxSpeed.getDouble(1.0);
            robotDrive.tankDrive(left * max, right * max);
          }
       }

This basic example has a glaring flaw: the maximum speed can be set on the dashboard to a value outside [0, 1] - which could cause the inputs to be saturated (always at maximum speed), or even reversed! Fortunately, there is a way to avoid this problem - covered in the next article.
