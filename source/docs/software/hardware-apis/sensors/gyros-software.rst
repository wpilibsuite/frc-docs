.. include:: <isonum.txt>

Gyroscopes - Software
=====================

.. note:: This section covers gyros in software.  For a hardware guide to gyros, see :ref:`docs/hardware/sensors/gyros-hardware:Gyroscopes - Hardware`.

A gyroscope, or "gyro," is an angular rate sensor typically used in robotics to measure and/or stabilize robot headings.  WPILib natively provides specific support for the ADXRS450 gyro available in the kit of parts, as well as more general support for a wider variety of analog gyros through the `AnalogGyro`_ class. Most common 3rd party gyros inherit from the :code:`Gyro` interface making them easily usable too!

The Gyro interface
------------------

All natively-supported gyro objects in WPILib implement the :code:`Gyro` interface (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj/interfaces/Gyro.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_gyro.html>`__).  This interface provides methods for getting the current angular rate and heading, zeroing the current heading, and calibrating the gyro.

.. note:: It is crucial that the robot remain stationary while calibrating a gyro.

ADIS16448
^^^^^^^^^

The ADIS16448 uses the :code:`ADIS16448_IMU` class and implements the :code:`Gyro` interface.  See the `ADIS16448 documentation <https://wiki.analog.com/first/adis16448_imu_frc>`__ for additional information and examples.

.. tabs::

    .. code-tab:: java

        // ADIS16448 plugged into the MXP port
        ADIS16448_IMU gyro = new ADIS16448_IMU();

    .. code-tab:: c++

        // ADIS16448 plugged into the MXP port
        ADIS16448_IMU gyro;

ADIS16470
^^^^^^^^^

The ADIS16470 uses the :code:`ADIS16470_IMU` class and implements the :code:`Gyro` interface.  See the `ADIS16470 documentation <https://wiki.analog.com/first/adis16470_imu_frc>`__ for additional information and examples.

.. tabs::

    .. code-tab:: java

        // ADIS16470 plugged into the MXP port
        ADIS16470_IMU gyro = new ADIS16470_IMU();

    .. code-tab:: c++

        // ADIS16470 plugged into the MXP port
        ADIS16470_IMU gyro;

ADXRS450_Gyro
^^^^^^^^^^^^^

The :code:`ADXRS450_Gyro` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj/ADXRS450_Gyro.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_a_d_x_r_s450___gyro.html>`__) provides support for the Analog Devices ADXRS450 gyro available in the kit of parts, which connects over the SPI bus.

.. note:: ADXRS450 Gyro accumulation is handled through special circuitry in the FPGA; accordingly only a single instance of :code:`ADXRS450_Gyro` may be used.

.. tabs::

    .. code-tab:: java

        // Creates an ADXRS450_Gyro object on the onboard SPI port
        ADXRS450_Gyro gyro = new ADXRS450_Gyro();

    .. code-tab:: c++

        // Creates an ADXRS450_Gyro object on the onboard SPI port
        frc::ADXRS450_Gyro gyro;

AnalogGyro
^^^^^^^^^^

The :code:`AnalogGyro` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj/AnalogGyro.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_analog_gyro.html>`__) provides support for any single-axis gyro with an analog output.

.. note:: Gyro accumulation is handled through special circuitry in the FPGA; accordingly, :code:`AnalogGyro`\`s may only be used on analog ports 0 and 1.

.. tabs::

    .. code-tab:: java

        // Creates an AnalogGyro object on port 0
        AnalogGyro gyro = new AnalogGyro(0);

    .. code-tab:: c++

        // Creates an AnalogGyro object on port 0
        frc::AnalogGyro gyro{0};

navX
^^^^

The navX uses the :code:`AHRS` class and implements the :code:`Gyro` interface.  See the `navX documentation <https://pdocs.kauailabs.com/navx-mxp/guidance/selecting-an-interface/>`__ for additional connection types.

.. tabs::

    .. code-tab:: java

        // navX MXP using SPI
        AHRS gyro = new AHRS(SPI.Port.kMXP);

    .. code-tab:: c++

        // navX MXP using SPI
        AHRS gyro{SPI::Port::kMXP};

Pigeon
^^^^^^

The Pigeon should use the :code:`WPI_PigeonIMU` class that implements :code:`Gyro`.  The Pigeon can either be connected with CAN or by data cable to a TalonSRX.  The `Pigeon IMU User's Guide <https://store.ctr-electronics.com/content/user-manual/Pigeon%20IMU%20User's%20Guide.pdf>`__ contains full details on using the Pigeon.

.. tabs::

    .. code-tab:: java

        WPI_PigeonIMU gyro = new WPI_PigeonIMU(0); // Pigeon is on CAN Bus with device ID 0
        // OR (choose one or the other based on your connection)
        TalonSRX talon = new TalonSRX(0); // TalonSRX is on CAN Bus with device ID 0
        WPI_PigeonIMU gyro = new WPI_PigeonIMU(talon); // Pigeon uses the talon created above

    .. code-tab:: c++

        WPI_PigeonIMU gyro{0}; // Pigeon is on CAN Bus with device ID 0
        // OR (choose one or the other based on your connection)
        TalonSRX talon{0}; // TalonSRX is on CAN Bus with device ID 0
        WPI_PigeonIMU gyro{talon}; // Pigeon uses the talon created above

Using gyros in code
-------------------

.. note:: As gyros measure rate rather than position, position is inferred by integrating (adding up) the rate signal to get the total change in angle.  Thus, gyro angle measurements are always relative to some arbitrary zero angle (determined by the angle of the gyro when either the robot was turned on or a zeroing method was called), and are also subject to accumulated errors (called "drift") that increase in magnitude the longer the gyro is used.  The amount of drift varies with the type of gyro.

Gyros are extremely useful in FRC for both measuring and controlling robot heading.  Since FRC matches are generally short, total gyro drift over the course of an FRC match tends to be manageably small (on the order of a couple of degrees for a good-quality gyro).  Moreover, not all useful gyro applications require the absolute heading measurement to remain accurate over the course of the entire match.

Displaying the robot heading on the dashboard
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

:ref:`Shuffleboard <docs/software/dashboards/shuffleboard/getting-started/shuffleboard-tour:Tour of Shuffleboard>` includes a widget for displaying heading data from a :code:`Gyro` in the form of a compass.  This can be helpful for viewing the robot heading when sight lines to the robot are obscured:

.. tabs::

    .. code-tab:: java

        // Use gyro declaration from above here

        public void robotInit() {
            // Places a compass indicator for the gyro heading on the dashboard
            Shuffleboard.getTab("Example tab").add(gyro);
        }

    .. code-tab:: c++

        // Use gyro declaration from above here

        void Robot::RobotInit() {
            // Places a compass indicator for the gyro heading on the dashboard
            frc::Shuffleboard.GetTab("Example tab").Add(gyro);
        }

Stabilizing heading while driving
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A very common use for a gyro is to stabilize robot heading while driving, so that the robot drives straight.  This is especially important for holonomic drives such as mecanum and swerve, but is extremely useful for tank drives as well.

This is typically achieved by closing a PID controller on either the turn rate or the heading, and piping the output of the loop to one's turning control (for a tank drive, this would be a speed differential between the two sides of the drive).

.. warning:: Like with all control loops, users should be careful to ensure that the sensor direction and the turning direction are consistent.  If they are not, the loop will be unstable and the robot will turn wildly.

Example: Tank drive stabilization using turn rate
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following example shows how to stabilize heading using a simple P loop closed on the turn rate.  Since a robot that is not turning should have a turn rate of zero, the setpoint for the loop is implicitly zero, making this method very simple.

.. tabs::

    .. code-tab:: java

        // Use gyro declaration from above here

        // The gain for a simple P loop
        double kP = 1;

        // Initialize motor controllers and drive
        Spark left1 = new Spark(0);
        Spark left2 = new Spark(1);

        Spark right1 = new Spark(2);
        Spark right2 = new Spark(3);

        MotorControllerGroup leftMotors = new MotorControllerGroup(left1, left2);
        MotorControllerGroup rightMotors = new MotorControllerGroup(right1, right2);

        DifferentialDrive drive = new DifferentialDrive(leftMotors, rightMotors);

        @Override
        public void robotInit() {
            rightMotors.setInverted(true);
        }

        @Override
        public void autonomousPeriodic() {
            // Setpoint is implicitly 0, since we don't want the heading to change
            double error = -gyro.getRate();

            // Drives forward continuously at half speed, using the gyro to stabilize the heading
            drive.tankDrive(.5 + kP * error, .5 - kP * error);
        }

    .. code-tab:: c++

        // Use gyro declaration from above here

        // The gain for a simple P loop
        double kP = 1;

        // Initialize motor controllers and drive
        frc::Spark left1{0};
        frc::Spark left2{1};
        frc::Spark right1{2};
        frc::Spark right2{3};

        frc::MotorControllerGroup leftMotors{left1, left2};
        frc::MotorControllerGroup rightMotors{right1, right2};

        frc::DifferentialDrive drive{leftMotors, rightMotors};

        void Robot::RobotInit() {
          rightMotors.SetInverted(true);
        }

        void Robot::AutonomousPeriodic() {
            // Setpoint is implicitly 0, since we don't want the heading to change
            double error = -gyro.GetRate();

            // Drives forward continuously at half speed, using the gyro to stabilize the heading
            drive.TankDrive(.5 + kP * error, .5 - kP * error);
        }

More-advanced implementations can use a more-complicated control loop.  When closing the loop on the turn rate for heading stabilization, PI loops are particularly effective.

Example: Tank drive stabilization using heading
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following example shows how to stabilize heading using a simple P loop closed on the heading.  Unlike in the turn rate example, we will need to set the setpoint to the current heading before starting motion, making this method slightly more-complicated.

.. tabs::

    .. code-tab:: java

        // Use gyro declaration from above here

        // The gain for a simple P loop
        double kP = 1;

        // The heading of the robot when starting the motion
        double heading;

        // Initialize motor controllers and drive
        Spark left1 = new Spark(0);
        Spark left2 = new Spark(1);

        Spark right1 = new Spark(2);
        Spark right2 = new Spark(3);

        MotorControllerGroup leftMotors = new MotorControllerGroup(left1, left2);
        MotorControllerGroup rightMotors = new MotorControllerGroup(right1, right2);

        DifferentialDrive drive = new DifferentialDrive(leftMotors, rightMotors);

        @Override
        public void robotInit() {
            rightMotors.setInverted(true);
        }

        @Override
        public void autonomousInit() {
            // Set setpoint to current heading at start of auto
            heading = gyro.getAngle();
        }

        @Override
        public void autonomousPeriodic() {
            double error = heading - gyro.getAngle();

            // Drives forward continuously at half speed, using the gyro to stabilize the heading
            drive.tankDrive(.5 + kP * error, .5 - kP * error);
        }

    .. code-tab:: c++

        // Use gyro declaration from above here

        // The gain for a simple P loop
        double kP = 1;

        // The heading of the robot when starting the motion
        double heading;

        // Initialize motor controllers and drive
        frc::Spark left1{0};
        frc::Spark left2{1};
        frc::Spark right1{2};
        frc::Spark right2{3};

        frc::MotorControllerGroup leftMotors{left1, left2};
        frc::MotorControllerGroup rightMotors{right1, right2};

        frc::DifferentialDrive drive{leftMotors, rightMotors};

        void Robot::RobotInit() {
          rightMotors.SetInverted(true);
        }

        void Robot::AutonomousInit() {
            // Set setpoint to current heading at start of auto
            heading = gyro.GetAngle();
        }

        void Robot::AutonomousPeriodic() {
            double error = heading - gyro.GetAngle();

            // Drives forward continuously at half speed, using the gyro to stabilize the heading
            drive.TankDrive(.5 + kP * error, .5 - kP * error);
        }

More-advanced implementations can use a more-complicated control loop.  When closing the loop on the heading for heading stabilization, PD loops are particularly effective.

Turning to a set heading
^^^^^^^^^^^^^^^^^^^^^^^^

Another common and highly-useful application for a gyro is turning a robot to face a specified direction.  This can be a component of an autonomous driving routine, or can be used during teleoperated control to help align a robot with field elements.

Much like with heading stabilization, this is often accomplished with a PID loop - unlike with stabilization, however, the loop can only be closed on the heading.  The following example code will turn the robot to face 90 degrees with a simple P loop:

.. tabs::

    .. code-tab:: java

        // Use gyro declaration from above here

        // The gain for a simple P loop
        double kP = 0.05;

        // Initialize motor controllers and drive
        Spark left1 = new Spark(0);
        Spark left2 = new Spark(1);

        Spark right1 = new Spark(2);
        Spark right2 = new Spark(3);

        MotorControllerGroup leftMotors = new MotorControllerGroup(left1, left2);
        MotorControllerGroup rightMotors = new MotorControllerGroup(right1, right2);

        DifferentialDrive drive = new DifferentialDrive(leftMotors, rightMotors);

        @Override
        public void robotInit() {
            rightMotors.setInverted(true);
        }

        @Override
        public void autonomousPeriodic() {
            // Find the heading error; setpoint is 90
            double error = 90 - gyro.getAngle();

            // Turns the robot to face the desired direction
            drive.tankDrive(kP * error, -kP * error);
        }

    .. code-tab:: c++

        // Use gyro declaration from above here

        // The gain for a simple P loop
        double kP = 0.05;

        // Initialize motor controllers and drive
        frc::Spark left1{0};
        frc::Spark left2{1};
        frc::Spark right1{2};
        frc::Spark right2{3};

        frc::MotorControllerGroup leftMotors{left1, left2};
        frc::MotorControllerGroup rightMotors{right1, right2};

        frc::DifferentialDrive drive{leftMotors, rightMotors};

        void Robot::RobotInit() {
          rightMotors.SetInverted(true);
        }

        void Robot::AutonomousPeriodic() {
            // Find the heading error; setpoint is 90
            double error = 90 - gyro.GetAngle();

            // Turns the robot to face the desired direction
            drive.TankDrive(kP * error, -kP * error);
        }

As before, more-advanced implementations can use more-complicated control loops.

.. note:: Turn-to-angle loops can be tricky to tune correctly due to static friction in the drivetrain, especially if a simple P loop is used.  There are a number of ways to account for this; one of the most common/effective is to add a "minimum output" to the output of the control loop.  Another effective strategy is to cascade to well-tuned velocity controllers on each side of the drive.
