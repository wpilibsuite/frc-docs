.. include:: <isonum.txt>

Accelerometers - Software
=========================

.. note:: This section covers accelerometers in software.  For a hardware guide to accelerometers, see :ref:`docs/hardware/sensors/accelerometers-hardware:Accelerometers - Hardware`.

An accelerometer is a device that measures acceleration.

Accelerometers generally come in two types: single-axis and 3-axis.  A single-axis accelerometer measures acceleration along one spatial dimension; a 3-axis accelerometer measures acceleration along all three spatial dimensions at once.

WPILib supports single-axis accelerometers through the `AnalogAccelerometer`_ class.

Three-axis accelerometers often require more complicated communications protocols (such as SPI or I2C) in order to send multi-dimensional data.  WPILib has native support for the following 3-axis accelerometers:

- `ADXL345_I2C`_
- `ADXL345_SPI`_
- `ADXL362`_
- `BuiltInAccelerometer`_

AnalogAccelerometer
-------------------

The :code:`AnalogAccelerometer` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/AnalogAccelerometer.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_analog_accelerometer.html>`__) allows users to read values from a single-axis accelerometer that is connected to one of the roboRIO's analog inputs.

.. tabs::

    .. code-tab:: java

        // Creates an analog accelerometer on analog input 0
        AnalogAccelerometer accelerometer = new AnalogAccelerometer(0);

        // Sets the sensitivity of the accelerometer to 1 volt per G
        accelerometer.setSensitivity(1);

        // Sets the zero voltage of the accelerometer to 3 volts
        accelerometer.setZero(3);

        // Gets the current acceleration
        double accel = accelerometer.getAcceleration();

    .. code-tab:: c++

        // Creates an analog accelerometer on analog input 0
        frc::AnalogAccelerometer accelerometer{0};

        // Sets the sensitivity of the accelerometer to 1 volt per G
        accelerometer.SetSensitivity(1);

        // Sets the zero voltage of the accelerometer to 3 volts
        accelerometer.SetZero(3);

        // Gets the current acceleration
        double accel = accelerometer.GetAcceleration();

If users have a 3-axis analog accelerometer, they can use three instances of this class, one for each axis.


The Accelerometer interface
---------------------------

All 3-axis accelerometers in WPILib implement the :code:`Accelerometer` interface (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/interfaces/Accelerometer.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_accelerometer.html>`__).  This interface defines functionality and settings common to all supported 3-axis accelerometers.

The :code:`Accelerometer` interface contains getters for the acceleration along each cardinal direction (x, y, and z), as well as a setter for the range of accelerations the accelerometer will measure.

.. warning:: Not all accelerometers are capable of measuring all ranges.

.. tabs::

    .. code-tab:: java

        // Sets the accelerometer to measure between -8 and 8 G's
        accelerometer.setRange(Accelerometer.Range.k8G);

    .. code-tab:: c++

        // Sets the accelerometer to measure between -8 and 8 G's
        accelerometer.SetRange(Accelerometer::Range::kRange_8G);

ADXL345_I2C
^^^^^^^^^^^

The :code:`ADXL345_I2C` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/ADXL345_I2C.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_a_d_x_l345___i2_c.html>`__) provides support for the ADXL345 accelerometer over the I2C communications bus.

.. tabs::

    .. code-tab:: java

        // Creates an ADXL345 accelerometer object on the MXP I2C port
        // with a measurement range from -8 to 8 G's
        Accelerometer accelerometer = new ADXL345_I2C(I2C.Port.kMXP, Accelerometer.Range.k8G);

    .. code-tab:: c++

        // Creates an ADXL345 accelerometer object on the MXP I2C port
        // with a measurement range from -8 to 8 G's
        frc::ADXL345_I2C accelerometer{I2C::Port::kMXP, Accelerometer::Range::kRange_8G};

ADXL345_SPI
^^^^^^^^^^^

The :code:`ADXL345_SPI` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/ADXL345_SPI.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_a_d_x_l345___s_p_i.html>`__) provides support for the ADXL345 accelerometer over the SPI communications bus.

.. tabs::

    .. code-tab:: java

        // Creates an ADXL345 accelerometer object on the MXP SPI port
        // with a measurement range from -8 to 8 G's
        Accelerometer accelerometer = new ADXL345_SPI(SPI.Port.kMXP, Accelerometer.Range.k8G);

    .. code-tab:: c++

        // Creates an ADXL345 accelerometer object on the MXP SPI port
        // with a measurement range from -8 to 8 G's
        frc::ADXL345_SPI accelerometer{SPI::Port::kMXP, Accelerometer::Range::kRange_8G};

ADXL362
^^^^^^^

The :code:`ADXL362` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/ADXL362.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_a_d_x_l362.html>`__) provides support for the ADXL362 accelerometer over the SPI communications bus.

.. tabs::

    .. code-tab:: java

        // Creates an ADXL362 accelerometer object on the MXP SPI port
        // with a measurement range from -8 to 8 G's
        Accelerometer accelerometer = new ADXL362(SPI.Port.kMXP, Accelerometer.Range.k8G);

    .. code-tab:: c++

        // Creates an ADXL362 accelerometer object on the MXP SPI port
        // with a measurement range from -8 to 8 G's
        frc::ADXL362 accelerometer{SPI::Port::kMXP, Accelerometer::Range::kRange_8G};

BuiltInAccelerometer
^^^^^^^^^^^^^^^^^^^^

The :code:`BuiltInAccelerometer` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/BuiltInAccelerometer.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_built_in_accelerometer.html>`__) provides access to the roboRIO's own built-in accelerometer:

.. tabs::

    .. code-tab:: java

        // Creates an object for the built-in accelerometer
        // Range defaults to +- 8 G's
        Accelerometer accelerometer = new BuiltInAccelerometer();

    .. code-tab:: c++

        // Creates an object for the built-in accelerometer
        // Range defaults to +- 8 G's
        frc::BuiltInAccelerometer accelerometer{};

Third-party accelerometers
--------------------------

While WPILib provides native support for a number of accelerometers that are available in the kit of parts or through FIRST Choice, there are a few popular AHRS (Attitude and Heading Reference System) devices commonly used in FRC that include accelerometers.  These are generally controlled through vendor libraries, though if they have a simple analog output they can be used with the `AnalogAccelerometer`_ class.

Using accelerometers in code
----------------------------

.. note:: Accelerometers, as their name suggests, measure acceleration.  Precise accelerometers can be used to determine position through double-integration (since acceleration is the second derivative of position), much in the way that gyroscopes are used to determine heading.  However, the accelerometers available for use in FRC are not nearly high-enough quality to be used this way.

It is recommended to use accelerometers in FRC\ |reg| for any application which needs a rough measurement of the current acceleration.  This can include detecting collisions with other robots or field elements, so that vulnerable mechanisms can be automatically retracted.  They may also be used to determine when the robot is passing over rough terrain for an autonomous routine (such as traversing the defenses in FIRST Stronghold).

For detecting collisions, it is often more robust to measure the jerk than the acceleration.  The jerk is the derivative (or rate of change) of acceleration, and indicates how rapidly the forces on the robot are changing - the sudden impulse from a collision causes a sharp spike in the jerk.  Jerk can be determined by simply taking the difference of subsequent acceleration measurements, and dividing by the time between them:

.. tabs::

    .. code-tab:: java

        double prevXAccel = 0;
        double prevYAccel = 0;

        Accelerometer accelerometer = new BuiltInAccelerometer();

        @Override
        public void robotPeriodic() {
            // Gets the current accelerations in the X and Y directions
            double xAccel = accelerometer.getX();
            double yAccel = accelerometer.getY();

            // Calculates the jerk in the X and Y directions
            // Divides by .02 because default loop timing is 20ms
            double xJerk = (xAccel - prevXAccel)/.02;
            double yJerk = (yAccel - prevYAccel)/.02;

            prevXAccel = xAccel;
            prevYAccel = yAccel;
        }

    .. code-tab:: c++

        double prevXAccel = 0;
        double prevYAccel = 0;

        frc::BuiltInAccelerometer accelerometer{};

        void Robot::RobotPeriodic() {
            // Gets the current accelerations in the X and Y directions
            double xAccel = accelerometer.GetX();
            double yAccel = accelerometer.GetY();

            // Calculates the jerk in the X and Y directions
            // Divides by .02 because default loop timing is 20ms
            double xJerk = (xAccel - prevXAccel)/.02;
            double yJerk = (yAccel - prevYAccel)/.02;

            prevXAccel = xAccel;
            prevYAccel = yAccel;
        }

Most accelerometers legal for FRC use are quite noisy, and it is often a good idea to combine them with the :code:`LinearFilter` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/filter/LinearFilter.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_linear_filter.html>`__) to reduce the noise:

.. tabs::

    .. code-tab:: java

        Accelerometer accelerometer = new BuiltInAccelerometer();

        // Create a LinearDigitalFilter that will calculate a moving average of the measured X acceleration over the past 10 iterations of the main loop

        LinearDigitalFilter xAccelFilter = LinearDigitalFilter.movingAverage(10);

        @Override
        public void robotPeriodic() {
            // Get the filtered X acceleration
            double filteredXAccel = xAccelFilter.calculate(accelerometer.getX());
        }

    .. code-tab:: c++

        frc::BuiltInAccelerometer accelerometer;

        // Create a LinearDigitalFilter that will calculate a moving average of the measured X acceleration over the past 10 iterations of the main loop
        auto xAccelFilter = frc::LinearDigitalFilter::MovingAverage(10);

        void Robot::RobotPeriodic() {
            // Get the filtered X acceleration
            double filteredXAccel = xAccelFilter.Calculate(accelerometer.GetX());
        }
