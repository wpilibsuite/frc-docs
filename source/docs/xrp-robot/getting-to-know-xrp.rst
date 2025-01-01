# Getting to know your XRP

## Booting up the XRP

Upon start up (when power is applied to the XRP either via battery or USB), the following will happen:

1. The IMU will calibrate itself. This lasts approximately 3-5 seconds, and will be indicated by the green LED blinking rapidly. Ideally, the XRP should be placed on a flat surface prior to power up, and if necessary, users can hit the reset button to restart the firmware and IMU calibration process.

2. The network will be configured, depending on the configuration settings. See the section on :doc:`the Web UI </docs/xrp-robot/web-ui>` for more information on how to configure the network settings. By default the XRP will broadcast its own WiFi Access Point.

3. After this, the XRP is ready for use.

## Hardware, Sensors and GPIO

The XRP has the following built-in hardware/peripherals:

- 2x geared drive motors with encoders
- 2x additional geared motor connectors with encoder support (marked Motor3 and Motor4)
- 2x Servo connectors (marked Servo1 and Servo2)
- 1x Inertial Measurement Unit (IMU)
- 1x LED (green)
- 1x pushbutton (marked USER)
- 1x Line following sensor (exposed as 2 Analog inputs)
- 1x Ultrasonic PING style rangefinder (uses 2 digital IO pins, exposed as an analog input)

### Motors, Wheels, and Encoders

The motors used on the XRP have a 48.75:1 gear reduction and a no-load output speed of 90 RPM at 4.5V.

The wheels have a diameter of 60mm (2.3622"). They have a trackwidth of 155mm (6.1").

The encoders are connected directly to the motor output shaft and have 12 Counts Per Revolution (CPR). With the provided gear ratio, this nets 585 counts per wheel revolution.

The motor channels are listed in the table below.

.. note:: We use "motor channels" here instead of "PWM channels" as the XRP requires the use of a special ``XRPMotor`` object in WPILib code to interact with the hardware.

+---------------+------------------------+
| Channel       | XRP Hardware Component |
+===============+========================+
| XRPMotor 0    | Left Motor             |
+---------------+------------------------+
| XRPMotor 1    | Right Motor            |
+---------------+------------------------+
| XRPMotor 2    | Motor 3                |
+---------------+------------------------+
| XRPMotor 3    | Motor 4                |
+---------------+------------------------+

.. note:: The right motor will spin in a backward direction when positive output is applied. Thus the corresponding motor controller needs to be inverted in robot code.

The servo channels are listed in the table below.

.. note:: We use "servo channels" here instead of "PWM channels" as the XRP requires the use of a special ``XRPServo`` object in WPILib code to interact with the hardware.

+---------------+------------------------+
| Channel       | XRP Hardware Component |
+===============+========================+
| XRPServo 4    | Servo 1                |
+---------------+------------------------+
| XRPServo 5    | Servo 2                |
+---------------+------------------------+

The encoder channels are listed in the table below.

+-------------+---------------------------------------+
| Channel     | XRP Hardware Component                |
+=============+=======================================+
| DIO 4       | Left Encoder Quadrature Channel A     |
+-------------+---------------------------------------+
| DIO 5       | Left Encoder Quadrature Channel B     |
+-------------+---------------------------------------+
| DIO 6       | Right Encoder Quadrature Channel A    |
+-------------+---------------------------------------+
| DIO 7       | Right Encoder Quadrature Channel B    |
+-------------+---------------------------------------+
| DIO 8       | Motor3 Encoder Quadrature Channel A   |
+-------------+---------------------------------------+
| DIO 9       | Motor3 Encoder Quadrature Channel B   |
+-------------+---------------------------------------+
| DIO 10      | Motor4 Encoder Quadrature Channel A   |
+-------------+---------------------------------------+
| DIO 11      | Motor4 Encoder Quadrature Channel B   |
+-------------+---------------------------------------+

.. note:: By default, the encoders count up when the XRP moves forward.

### Inertial Measurement Unit

The XRP includes an STMicroelectronics LSM6DSOX Inertial Measurement Unit (IMU) which contains a 3-axis gyro and a 3-axis accelerometer.

The XRP will calibrate the gyro and accelerometer upon each boot (the onboard LED will quickly flash for about 3-5 seconds at startup time).

### Onboard LED and Push Button

The XRP has a push button (labeled USER) and a green LED onboard that are exposed as Digital IO (DIO) channels to robot code.

+-------------+---------------------------+
| DIO Channel | XRP Hardware Component    |
+=============+===========================+
| DIO 0       | USER Button               |
+-------------+---------------------------+
| DIO 1       | Green LED                 |
+-------------+---------------------------+

.. note:: DIO 2 and 3 are reserved for future system use.

### Line Following (Reflectance) Sensor

When assembled according to the instructions, the XRP supports a line following sensor with 2 sensing elements. Each sensing element measures reflectance exposes these as AnalogInput channels to robot code. The returned values range from 0V (pure white) to 5V (pure black).

+---------------------+---------------------------+
| AnalogInput Channel | XRP Hardware Component    |
+=====================+===========================+
| AnalogInput 0       | Left Reflectance Sensor   |
+---------------------+---------------------------+
| AnalogInput 1       | Right Reflectance Sensor  |
+---------------------+---------------------------+

### Ultrasonic Rangefinder

When assembled according to the instructions, the XRP supports an ultrasonic, PING style, rangefinder. This is exposed as an AnalogInput channel to robot code. The returned values range from 0V (20mm) to 5V (4000mm).

+---------------------+---------------------------+
| AnalogInput Channel | XRP Hardware Component    |
+=====================+===========================+
| AnalogInput 2       | Ultrasonic Rangefinder    |
+---------------------+---------------------------+
