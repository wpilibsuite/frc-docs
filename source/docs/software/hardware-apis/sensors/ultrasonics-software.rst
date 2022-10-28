Ultrasonics - Software
======================

.. note:: This section covers ultrasonics in software.  For a hardware guide to ultrasonics, see :ref:`docs/hardware/sensors/ultrasonics-hardware:Ultrasonics - Hardware`.

An ultrasonic sensor is commonly used to measure distance to an object using high-frequency sound.  Generally, ultrasonics measure the distance to the closest object within their "field of view."

There are two primary types of ultrasonics supported natively by WPILib:

- `Ping-response ultrasonics`_
- `Analog ultrasonics`_

Ping-response ultrasonics
-------------------------

The :code:`Ultrasonic` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/Ultrasonic.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_ultrasonic.html>`__) provides support for ping-response ultrasonics.  As ping-response ultrasonics (per the name) require separate pins for both sending the ping and measuring the response, users must specify DIO pin numbers for both output and input when constructing an :code:`Ultrasonic` instance:

.. tabs::

    .. code-tab:: java

        // Creates a ping-response Ultrasonic object on DIO 1 and 2.
        Ultrasonic ultrasonic = new Ultrasonic(1, 2);

    .. code-tab:: c++

        // Creates a ping-response Ultrasonic object on DIO 1 and 2.
        frc::Ultrasonic ultrasonic{1, 2};

It is highly recommended to use ping-response ultrasonics in "automatic mode," as this will allow WPILib to ensure that multiple sensors do not interfere with each other:

.. tabs::

    .. code-tab:: java

        // Starts the ultrasonic sensor running in automatic mode
        Ultrasonic.setAutomaticMode(true);

    .. code-tab:: c++

        // Starts the ultrasonic sensor running in automatic mode
        ultrasonic.SetAutomaticMode(true);

Analog ultrasonics
------------------

Some ultrasonic sensors simply return an analog voltage corresponding to the measured distance.  These sensors can may simply be used with the :doc:`AnalogPotentiometer <analog-potentiometers-software>` class.

Third-party ultrasonics
-----------------------

Other ultrasonic sensors offered by third-parties may use more complicated communications protocols (such as I2C or SPI).  WPILib does not provide native support for any such ultrasonics; they will typically be controlled with vendor libraries.

Using ultrasonics in code
-------------------------

Ultrasonic sensors are very useful for determining spacing during autonomous routines.  For example, the following code will drive the robot forward until the ultrasonic measures a distance of 12 inches (~30 cm) to the nearest object, and then stop:

.. tabs::

    .. code-tab:: java

        // Creates a ping-response Ultrasonic object on DIO 1 and 2.
        Ultrasonic ultrasonic = new Ultrasonic(1, 2);

        // Initialize motor controllers and drive
        Spark left1 new Spark(0);
        Spark left2 = new Spark(1);

        Spark right1 = new Spark(2);
        Spark right2 = new Spark(3);

        MotorControllerGroup leftMotors = new MotorControllerGroup(left1, left2);
        MotorControllerGroup rightMotors = new MotorControllerGroup(right1, right2);

        DifferentialDrive drive = new DifferentialDrive(leftMotors, rightMotors);

        @Override
        public void robotInit() {
            // Start the ultrasonic in automatic mode
            Ultrasonic.setAutomaticMode(true);
        }

        @Override
        public void autonomousPeriodic() {
            if(ultrasonic.GetRangeInches() > 12) {
                drive.tankDrive(.5, .5);
            }
            else {
                drive.tankDrive(0, 0);
            }
        }

    .. code-tab:: c++

        // Creates a ping-response Ultrasonic object on DIO 1 and 2.
        frc::Ultrasonic ultrasonic{1, 2};

        // Initialize motor controllers and drive
        frc::Spark left1{0};
        frc::Spark left2{1};
        frc::Spark right1{2};
        frc::Spark right2{3};

        frc::MotorControllerGroup leftMotors{left1, left2};
        frc::MotorControllerGroup rightMotors{right1, right2};

        frc::DifferentialDrive drive{leftMotors, rightMotors};

        void Robot::RobotInit() {
            // Start the ultrasonic in automatic mode
            ultrasonic.SetAutomaticMode(true);
        }

        void Robot:AutonomousPeriodic() {
            if(ultrasonic.GetRangeInches() > 12) {
                drive.TankDrive(.5, .5);
            }
            else {
                drive.TankDrive(0, 0);
            }
        }

Additionally, ping-response ultrasonics can be sent to :ref:`Shuffleboard <docs/software/dashboards/shuffleboard/getting-started/shuffleboard-tour:Tour of Shuffleboard>`, where they will be displayed with their own widgets:

.. tabs::

    .. code-tab:: java

        // Creates a ping-response Ultrasonic object on DIO 1 and 2.
        Ultrasonic ultrasonic = new Ultrasonic(1, 2);

        public void robotInit() {
            // Places a the ultrasonic on the dashboard
            Shuffleboard.getTab("Example tab").add(ultrasonic);
        }

    .. code-tab:: c++

        // Creates a ping-response Ultrasonic object on DIO 1 and 2.
        frc::Ultrasonic ultrasonic{1, 2};

        void Robot::RobotInit() {
            // Places the ultrasonic on the dashboard
            frc::Shuffleboard.GetTab("Example tab").Add(ultrasonic);
        }
