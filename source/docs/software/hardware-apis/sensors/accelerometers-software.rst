.. include:: <isonum.txt>

# Accelerometers - Software

.. note:: This section covers accelerometers in software.  For a hardware guide to accelerometers, see :ref:`docs/hardware/sensors/accelerometers-hardware:Accelerometers - Hardware`.

An accelerometer is a device that measures acceleration.

Accelerometers generally come in two types: single-axis and 3-axis.  A single-axis accelerometer measures acceleration along one spatial dimension; a 3-axis accelerometer measures acceleration along all three spatial dimensions at once.

WPILib supports single-axis accelerometers through the `AnalogAccelerometer`_ class.

Three-axis accelerometers often require more complicated communications protocols (such as SPI or I2C) in order to send multi-dimensional data.  WPILib has native support for the following 3-axis accelerometers:

- `ADXL345_I2C`_
- `ADXL345_SPI`_
- `ADXL362`_
- `BuiltInAccelerometer`_

## AnalogAccelerometer

The :code:`AnalogAccelerometer` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/AnalogAccelerometer.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_analog_accelerometer.html)) allows users to read values from a single-axis accelerometer that is connected to one of the roboRIO's analog inputs.

.. tab-set-code::

    ```java
    // Creates an analog accelerometer on analog input 0
    AnalogAccelerometer accelerometer = new AnalogAccelerometer(0);
    // Sets the sensitivity of the accelerometer to 1 volt per G
    accelerometer.setSensitivity(1);
    // Sets the zero voltage of the accelerometer to 3 volts
    accelerometer.setZero(3);
    // Gets the current acceleration
    double accel = accelerometer.getAcceleration();
    ```

    ```c++
    // Creates an analog accelerometer on analog input 0
    frc::AnalogAccelerometer accelerometer{0};
    // Sets the sensitivity of the accelerometer to 1 volt per G
    accelerometer.SetSensitivity(1);
    // Sets the zero voltage of the accelerometer to 3 volts
    accelerometer.SetZero(3);
    // Gets the current acceleration
    double accel = accelerometer.GetAcceleration();
    ```

If users have a 3-axis analog accelerometer, they can use three instances of this class, one for each axis.

There are getters for the acceleration along each cardinal direction (x, y, and z), as well as a setter for the range of accelerations the accelerometer will measure.

.. tab-set-code::

    ```java
    // Sets the accelerometer to measure between -8 and 8 G's
    accelerometer.setRange(BuiltInAccelerometer.Range.k8G);
    ```

    ```c++
    // Sets the accelerometer to measure between -8 and 8 G's
    accelerometer.SetRange(BuiltInAccelerometer::Range::kRange_8G);
    ```

### ADXL345_I2C

The :code:`ADXL345_I2C` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/ADXL345_I2C.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_a_d_x_l345___i2_c.html)) provides support for the ADXL345 accelerometer over the I2C communications bus.

.. tab-set-code::

    ```java
    // Creates an ADXL345 accelerometer object on the MXP I2C port
    // with a measurement range from -8 to 8 G's
    ADXL345_I2C accelerometer = new ADXL345_I2C(I2C.Port.kMXP, ADXL345_I2C.Range.k8G);
    ```

    ```c++
    // Creates an ADXL345 accelerometer object on the MXP I2C port
    // with a measurement range from -8 to 8 G's
    frc::ADXL345_I2C accelerometer{I2C::Port::kMXP, frc::ADXL345_I2C::Range::kRange_8G};
    ```

### ADXL345_SPI

The :code:`ADXL345_SPI` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/ADXL345_SPI.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_a_d_x_l345___s_p_i.html)) provides support for the ADXL345 accelerometer over the SPI communications bus.

.. tab-set-code::

    ```java
    // Creates an ADXL345 accelerometer object on the MXP SPI port
    // with a measurement range from -8 to 8 G's
    ADXL345_SPI accelerometer = new ADXL345_SPI(SPI.Port.kMXP, ADXL345_SPI.Range.k8G);
    ```

    ```c++
    // Creates an ADXL345 accelerometer object on the MXP SPI port
    // with a measurement range from -8 to 8 G's
    frc::ADXL345_SPI accelerometer{SPI::Port::kMXP, frc::ADXL345_SPI::Range::kRange_8G};
    ```

### ADXL362

The :code:`ADXL362` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/ADXL362.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_a_d_x_l362.html)) provides support for the ADXL362 accelerometer over the SPI communications bus.

.. tab-set-code::

    ```java
    // Creates an ADXL362 accelerometer object on the MXP SPI port
    // with a measurement range from -8 to 8 G's
    ADXL362 accelerometer = new ADXL362(SPI.Port.kMXP, ADXL362.Range.k8G);
    ```

    ```c++
    // Creates an ADXL362 accelerometer object on the MXP SPI port
    // with a measurement range from -8 to 8 G's
    frc::ADXL362 accelerometer{SPI::Port::kMXP, frc::ADXL362::Range::kRange_8G};
    ```

### BuiltInAccelerometer

The :code:`BuiltInAccelerometer` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/BuiltInAccelerometer.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_built_in_accelerometer.html)) provides access to the roboRIO's own built-in accelerometer:

.. tab-set-code::

    ```java
    // Creates an object for the built-in accelerometer
    // Range defaults to +- 8 G's
    BuiltInAccelerometer accelerometer = new BuiltInAccelerometer();
    ```

    ```c++
    // Creates an object for the built-in accelerometer
    // Range defaults to +- 8 G's
    frc::BuiltInAccelerometer accelerometer;
    ```

## Third-party accelerometers

While WPILib provides native support for a number of accelerometers that are available in the kit of parts or through FIRST Choice, there are a few popular AHRS (Attitude and Heading Reference System) devices commonly used in FRC that include accelerometers.  These are generally controlled through vendor libraries, though if they have a simple analog output they can be used with the `AnalogAccelerometer`_ class.

## Using accelerometers in code

.. note:: Accelerometers, as their name suggests, measure acceleration.  Precise accelerometers can be used to determine position through double-integration (since acceleration is the second derivative of position), much in the way that gyroscopes are used to determine heading.  However, the accelerometers available for use in FRC are not nearly high-enough quality to be used this way.

It is recommended to use accelerometers in FRC\ |reg| for any application which needs a rough measurement of the current acceleration.  This can include detecting collisions with other robots or field elements, so that vulnerable mechanisms can be automatically retracted.  They may also be used to determine when the robot is passing over rough terrain for an autonomous routine (such as traversing the defenses in FIRST Stronghold).

For detecting collisions, it is often more robust to measure the jerk than the acceleration.  The jerk is the derivative (or rate of change) of acceleration, and indicates how rapidly the forces on the robot are changing - the sudden impulse from a collision causes a sharp spike in the jerk.  Jerk can be determined by simply taking the difference of subsequent acceleration measurements, and dividing by the time between them:

.. tab-set-code::

    ```java
    double prevXAccel = 0.0;
    double prevYAccel = 0.0;
    BuiltInAccelerometer accelerometer = new BuiltInAccelerometer();
    @Override
    public void robotPeriodic() {
        // Gets the current accelerations in the X and Y directions
        double xAccel = accelerometer.getX();
        double yAccel = accelerometer.getY();
        // Calculates the jerk in the X and Y directions
        // Divides by .02 because default loop timing is 20ms
        double xJerk = (xAccel - prevXAccel) / 0.02;
        double yJerk = (yAccel - prevYAccel) / 0.02;
        prevXAccel = xAccel;
        prevYAccel = yAccel;
    }
    ```

    ```c++
    double prevXAccel = 0.0;
    double prevYAccel = 0.0;
    frc::BuiltInAccelerometer accelerometer;
    void Robot::RobotPeriodic() {
        // Gets the current accelerations in the X and Y directions
        double xAccel = accelerometer.GetX();
        double yAccel = accelerometer.GetY();
        // Calculates the jerk in the X and Y directions
        // Divides by .02 because default loop timing is 20ms
        double xJerk = (xAccel - prevXAccel) / 0.02;
        double yJerk = (yAccel - prevYAccel) / 0.02;
        prevXAccel = xAccel;
        prevYAccel = yAccel;
    }
    ```

Most accelerometers legal for FRC use are quite noisy, and it is often a good idea to combine them with the :code:`LinearFilter` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/math/filter/LinearFilter.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_linear_filter.html)) to reduce the noise:

.. tab-set-code::

    ```java
    BuiltInAccelerometer accelerometer = new BuiltInAccelerometer();
    // Create a LinearFilter that will calculate a moving average of the measured X acceleration over the past 10 iterations of the main loop
    LinearFilter xAccelFilter = LinearFilter.movingAverage(10);
    @Override
    public void robotPeriodic() {
        // Get the filtered X acceleration
        double filteredXAccel = xAccelFilter.calculate(accelerometer.getX());
    }
    ```

    ```c++
    frc::BuiltInAccelerometer accelerometer;
    // Create a LinearFilter that will calculate a moving average of the measured X acceleration over the past 10 iterations of the main loop
    auto xAccelFilter = frc::LinearFilter::MovingAverage(10);
    void Robot::RobotPeriodic() {
        // Get the filtered X acceleration
        double filteredXAccel = xAccelFilter.Calculate(accelerometer.GetX());
    }
    ```

