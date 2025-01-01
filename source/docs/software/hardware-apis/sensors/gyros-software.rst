.. include:: <isonum.txt>

# Gyroscopes - Software

.. note:: This section covers gyros in software.  For a hardware guide to gyros, see :ref:`docs/hardware/sensors/gyros-hardware:Gyroscopes - Hardware`.

A gyroscope, or "gyro," is an angular rate sensor typically used in robotics to measure and/or stabilize robot headings.  WPILib natively provides specific support for the ADXRS450 gyro available in the kit of parts, as well as more general support for a wider variety of analog gyros through the `AnalogGyro`_ class.

There are getters the current angular rate and heading and functions for zeroing the current heading and calibrating the gyro.

.. note:: It is crucial that the robot remain stationary while calibrating a gyro.

## ADIS16448

The ADIS16448 uses the :code:`ADIS16448_IMU` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/ADIS16448_IMU.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_a_d_i_s16448___i_m_u.html), :external:py:class:`Python <wpilib.ADIS16448_IMU>`).  See the [Analog Devices ADIS16448 documentation](https://wiki.analog.com/first/adis16448_imu_frc) for additional information and examples.

.. warning:: The Analog Devices documentation linked above contains outdated instructions for software installation as the ADIS16448 is now built into WPILib.

.. tab-set-code::

    ```java
    // ADIS16448 plugged into the MXP port
    ADIS16448_IMU gyro = new ADIS16448_IMU();
    ```

    ```c++
    // ADIS16448 plugged into the MXP port
    ADIS16448_IMU gyro;
    ```

    ```python
    from wpilib import ADIS16448_IMU
    # ADIS16448 plugged into the MXP port
    self.gyro = ADIS16448_IMU()
    ```

## ADIS16470

The ADIS16470 uses the :code:`ADIS16470_IMU` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/ADIS16470_IMU.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_a_d_i_s16470___i_m_u.html), :external:py:class:`Python <wpilib.ADIS16470_IMU>`).  See the [Analog Devices ADIS16470 documentation](https://wiki.analog.com/first/adis16470_imu_frc) for additional information and examples.

.. warning:: The Analog Devices documentation linked above contains outdated instructions for software installation as the ADIS16470 is now built into WPILib.

.. tab-set-code::

    ```java
    // ADIS16470 plugged into the SPI port
    ADIS16470_IMU gyro = new ADIS16470_IMU();
    ```

    ```c++
    // ADIS16470 plugged into the SPI port
    ADIS16470_IMU gyro;
    ```

    ```python
    # ADIS16470 plugged into the SPI port
    self.gyro = ADIS16470_IMU()
    ```

## ADXRS450_Gyro

The :code:`ADXRS450_Gyro` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/ADXRS450_Gyro.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_a_d_x_r_s450___gyro.html), :external:py:class:`Python <wpilib.ADXRS450_Gyro>`) provides support for the Analog Devices ADXRS450 gyro available in the kit of parts, which connects over the SPI bus.

.. note:: ADXRS450 Gyro accumulation is handled through special circuitry in the FPGA; accordingly only a single instance of :code:`ADXRS450_Gyro` may be used.

.. tab-set-code::

    ```java
    // Creates an ADXRS450_Gyro object on the onboard SPI port
    ADXRS450_Gyro gyro = new ADXRS450_Gyro();
    ```

    ```c++
    // Creates an ADXRS450_Gyro object on the onboard SPI port
    frc::ADXRS450_Gyro gyro;
    ```

    ```python
    # Creates an ADXRS450_Gyro object on the onboard SPI port
    self.gyro = ADXRS450_Gyro()
    ```

## AnalogGyro

The :code:`AnalogGyro` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/AnalogGyro.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_analog_gyro.html), :external:py:class:`Python <wpilib.AnalogGyro>`) provides support for any single-axis gyro with an analog output.

.. note:: Gyro accumulation is handled through special circuitry in the FPGA; accordingly, :code:`AnalogGyro`\`s may only be used on analog ports 0 and 1.

.. tab-set-code::

    ```java
    // Creates an AnalogGyro object on port 0
    AnalogGyro gyro = new AnalogGyro(0);
    ```

    ```c++
    // Creates an AnalogGyro object on port 0
    frc::AnalogGyro gyro{0};
    ```

    ```python
    # Creates an AnalogGyro object on port 0
    self.gyro = AnalogGyro(0)
    ```

## navX

The navX uses the :code:`AHRS` class.  See the [navX documentation](https://pdocs.kauailabs.com/navx-mxp/guidance/selecting-an-interface/) for additional connection types.

.. tab-set-code::

    ```java
    // navX MXP using SPI
    AHRS gyro = new AHRS(SPI.Port.kMXP);
    ```

    ```c++
    // navX MXP using SPI
    AHRS gyro{SPI::Port::kMXP};
    ```

    ```python
    import navx
    # navX MXP using SPI
    self.gyro = navx.AHRS(SPI.Port.kMXP)
    ```

## Pigeon 2

The Pigeon should use the :code:`Pigeon2` class.  The Pigeon can either be connected with CAN or by data cable to a TalonSRX.  The [Pigeon IMU User's Guide](https://ctre.download/files/user-manual/Pigeon2%20User's%20Guide.pdf) contains full details on using the Pigeon.

.. tab-set-code::

    ```java
    private final Pigeon2 pidgey = new Pigeon2(1, "rio"); // Pigeon is on roboRIO CAN Bus with device ID 1
    ```

    ```c++
    ctre::phoenix6::hardware::Pigeon2 pidgey{1, "rio"}; // Pigeon is on roboRIO CAN Bus with device ID 1
    ```

    ```python
    import phoenix5
    import ctre.sensors
    self.gyro = ctre.WPI_PigeonIMU(0); # Pigeon is on CAN Bus with device ID 0
    # OR (choose one or the other based on your connection)
    talon = ctre.TalonSRX(0); # TalonSRX is on CAN Bus with device ID 0
    self.gyro = ctre.WPI_PigeonIMU(talon) # Pigeon uses the talon created above
    ```

## Using gyros in code

.. note:: As gyros measure rate rather than position, position is inferred by integrating (adding up) the rate signal to get the total change in angle.  Thus, gyro angle measurements are always relative to some arbitrary zero angle (determined by the angle of the gyro when either the robot was turned on or a zeroing method was called), and are also subject to accumulated errors (called "drift") that increase in magnitude the longer the gyro is used.  The amount of drift varies with the type of gyro.

Gyros are extremely useful in FRC for both measuring and controlling robot heading.  Since FRC matches are generally short, total gyro drift over the course of an FRC match tends to be manageably small (on the order of a couple of degrees for a good-quality gyro).  Moreover, not all useful gyro applications require the absolute heading measurement to remain accurate over the course of the entire match.

### Displaying the robot heading on the dashboard

:ref:`Shuffleboard <docs/software/dashboards/shuffleboard/getting-started/shuffleboard-tour:Tour of Shuffleboard>` includes a widget for displaying heading data from a gyro in the form of a compass.  This can be helpful for viewing the robot heading when sight lines to the robot are obscured:

.. tab-set-code::

    ```java
    // Use gyro declaration from above here
    public Robot() {
        // Places a compass indicator for the gyro heading on the dashboard
        Shuffleboard.getTab("Example tab").add(gyro);
    }
    ```

    ```c++
    // Use gyro declaration from above here
    Robot::Robot() {
        // Places a compass indicator for the gyro heading on the dashboard
        frc::Shuffleboard.GetTab("Example tab").Add(gyro);
    }
    ```

    ```python
    from wpilib.shuffleboard import Shuffleboard
    def robotInit(self):
        # Use gyro declaration from above here
        # Places a compass indicator for the gyro heading on the dashboard
        Shuffleboard.getTab("Example tab").add(self.gyro)
    ```

### Stabilizing heading while driving

A very common use for a gyro is to stabilize robot heading while driving, so that the robot drives straight.  This is especially important for holonomic drives such as mecanum and swerve, but is extremely useful for tank drives as well.

This is typically achieved by closing a PID controller on either the turn rate or the heading, and piping the output of the loop to one's turning control (for a tank drive, this would be a speed differential between the two sides of the drive).

.. warning:: Like with all control loops, users should be careful to ensure that the sensor direction and the turning direction are consistent.  If they are not, the loop will be unstable and the robot will turn wildly.

#### Example: Tank drive stabilization using turn rate

The following example shows how to stabilize heading using a simple P loop closed on the turn rate.  Since a robot that is not turning should have a turn rate of zero, the setpoint for the loop is implicitly zero, making this method very simple.

.. tab-set-code::

    ```java
    // Use gyro declaration from above here
    // The gain for a simple P loop
    double kP = 1;
    // Initialize motor controllers and drive
    Spark leftLeader = new Spark(0);
    Spark leftFollower = new Spark(1);
    Spark rightLeader = new Spark(2);
    Spark rightFollower = new Spark(3);
    DifferentialDrive drive = new DifferentialDrive(leftLeader::set, rightLeader::set);

    public Robot() {
        // Configures the encoder's distance-per-pulse
        // The robot moves forward 1 foot per encoder rotation
        // There are 256 pulses per encoder rotation
        encoder.setDistancePerPulse(1./256.);
        // Invert the right side of the drivetrain. You might have to invert the other side
        rightLeader.setInverted(true);
        // Configure the followers to follow the leaders
        leftLeader.addFollower(leftFollower);
        rightLeader.addFollower(rightFollower);
    }

    @Override
    public void autonomousPeriodic() {
        // Setpoint is implicitly 0, since we don't want the heading to change
        double error = -gyro.getRate();
        // Drives forward continuously at half speed, using the gyro to stabilize the heading
        drive.tankDrive(.5 + kP * error, .5 - kP * error);
    }
    ```

    ```c++
    // Use gyro declaration from above here
    // The gain for a simple P loop
    double kP = 1;
    // Initialize motor controllers and drive
    frc::Spark leftLeader{0};
    frc::Spark leftFollower{1};
    frc::Spark rightLeader{2};
    frc::Spark rightFollower{3};
    frc::DifferentialDrive drive{[&](double output) { leftLeader.Set(output); },
                                 [&](double output) { rightLeader.Set(output); }};
    Robot::Robot() {
        // Invert the right side of the drivetrain. You might have to invert the other side
        rightLeader.SetInverted(true);
        // Configure the followers to follow the leaders
        leftLeader.AddFollower(leftFollower);
        rightLeader.AddFollower(rightFollower);
    }
    void Robot::AutonomousPeriodic() {
        // Setpoint is implicitly 0, since we don't want the heading to change
        double error = -gyro.GetRate();
        // Drives forward continuously at half speed, using the gyro to stabilize the heading
        drive.TankDrive(.5 + kP * error, .5 - kP * error);
    }
    ```

    ```python
    from wpilib import Spark
    from wpilib import MotorControllerGroup
    from wpilib.drive import DifferentialDrive
    def robotInit(self):
        # Use gyro declaration from above here
        # The gain for a simple P loop
        self.kP = 1
        # Initialize motor controllers and drive
        left1 = Spark(0)
        left2 = Spark(1)
        right1 = Spark(2)
        right2 = Spark(3)
        leftMotors = MotorControllerGroup(left1, left2)
        rightMotors = MotorControllerGroup(right1, right2)
        self.drive = DifferentialDrive(leftMotors, rightMotors)
        rightMotors.setInverted(true)
    def autonomousPeriodic(self):
        # Setpoint is implicitly 0, since we don't want the heading to change
        error = -self.gyro.getRate()
        # Drives forward continuously at half speed, using the gyro to stabilize the heading
        self.drive.tankDrive(.5 + self.kP * error, .5 - self.kP * error)
    ```

.. note:: MotorControllerGroup is :term:`deprecated` in 2024. Can you help update the Python example?

More-advanced implementations can use a more-complicated control loop.  When closing the loop on the turn rate for heading stabilization, PI loops are particularly effective.

#### Example: Tank drive stabilization using heading

The following example shows how to stabilize heading using a simple P loop closed on the heading.  Unlike in the turn rate example, we will need to set the setpoint to the current heading before starting motion, making this method slightly more-complicated.

.. tab-set-code::

    ```java
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

    public Robot() {
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
    ```

    ```c++
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
    Robot::Robot() {
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
    ```

    ```python
    from wpilib import Spark
    from wpilib import MotorControllerGroup
    from wpilib.drive import DifferentialDrive
    def robotInit(self):
        # Use gyro declaration from above here
        # The gain for a simple P loop
        self.kP = 1
        # Initialize motor controllers and drive
        left1 = Spark(0)
        left2 = Spark(1)
        right1 = Spark(2)
        right2 = Spark(3)
        leftMotors = MotorControllerGroup(left1, left2)
        rightMotors = MotorControllerGroup(right1, right2)
        self.drive = DifferentialDrive(leftMotors, rightMotors)
        rightMotors.setInverted(true)
    def autonomousInit(self):
        # Set setpoint to current heading at start of auto
        self.heading = self.gyro.getAngle()
        def autonomousPeriodic(self):
        error = self.heading - self.gyro.getAngle()
        # Drives forward continuously at half speed, using the gyro to stabilize the heading
        self.drive.tankDrive(.5 + self.kP * error, .5 - self.kP * error)
    ```

More-advanced implementations can use a more-complicated control loop.  When closing the loop on the heading for heading stabilization, PD loops are particularly effective.

### Turning to a set heading

Another common and highly-useful application for a gyro is turning a robot to face a specified direction.  This can be a component of an autonomous driving routine, or can be used during teleoperated control to help align a robot with field elements.

Much like with heading stabilization, this is often accomplished with a PID loop - unlike with stabilization, however, the loop can only be closed on the heading.  The following example code will turn the robot to face 90 degrees with a simple P loop:

.. tab-set-code::

    ```java
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

    public Robot() {
        rightMotors.setInverted(true);
    }

    @Override
    public void autonomousPeriodic() {
        // Find the heading error; setpoint is 90
        double error = 90 - gyro.getAngle();
        // Turns the robot to face the desired direction
        drive.tankDrive(kP * error, -kP * error);
    }
    ```

    ```c++
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
    Robot::Robot() {
      rightMotors.SetInverted(true);
    }
    void Robot::AutonomousPeriodic() {
        // Find the heading error; setpoint is 90
        double error = 90 - gyro.GetAngle();
        // Turns the robot to face the desired direction
        drive.TankDrive(kP * error, -kP * error);
    }
    ```

    ```python
    from wpilib import Spark
    from wpilib import MotorControllerGroup
    from wpilib.drive import DifferentialDrive
    def robotInit(self):
        # Use gyro declaration from above here
        # The gain for a simple P loop
        self.kP = 0.05
        # Initialize motor controllers and drive
        left1 = Spark(0)
        left2 = Spark(1)
        right1 = Spark(2)
        right2 = Spark(3)
        leftMotors = MotorControllerGroup(left1, left2)
        rightMotors = MotorControllerGroup(right1, right2)
        self.drive = DifferentialDrive(leftMotors, rightMotors)
        rightMotors.setInverted(true)
    def autonomousPeriodic(self):
        # Find the heading error; setpoint is 90
        error = 90 - self.gyro.getAngle()
        # Drives forward continuously at half speed, using the gyro to stabilize the heading
        self.drive.tankDrive(self.kP * error, -self.kP * error)
    ```

As before, more-advanced implementations can use more-complicated control loops.

.. note:: Turn-to-angle loops can be tricky to tune correctly due to static friction in the drivetrain, especially if a simple P loop is used.  There are a number of ways to account for this; one of the most common/effective is to add a "minimum output" to the output of the control loop.  Another effective strategy is to cascade to well-tuned velocity controllers on each side of the drive.
