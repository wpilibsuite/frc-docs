Romi Hardware Support
=====================

The Romi robot, having a different hardware architecture than a roboRIO, is compatible with a subset of commonly used FRC control system components.

Compatible Hardware
------------------------

In general, the Romi is compatible with the following:

- Simple Digital Input/Output devices (e.g. bumper switches, single LEDs)
- Standard RC-style PWM output devices (e.g. servos, PWM based motor controllers)
- Analog Input sensors (e.g distance sensors that report distance as a voltage)

Incompatible Hardware
---------------------

Due to hardware limitations, the Romi Robot is not compatible with the following:

- Encoders other than the Romi-integrated encoders
- "Ping" style ultrasonic sensors (which require 2 DIO channels)
- Timing based sensors
- CAN based devices
- Romi built-in buzzer

Compatible Classes
------------------

All classes listed here are supported by the Romi Robot. If a class is not listed here, assume that it is not supported and *will not* work.

- PWM Motor Controllers (i.e. ``Spark``)
- ``Encoder``
- ``AnalogInput``
- ``DigitalInput``
- ``DigitalOutput``
- ``Servo``
- ``BuiltInAccelerometer``

The following classes are provided by the `Romi Vendordep <https://raw.githubusercontent.com/wpilibsuite/romi-vendordep/main/RomiVendordep.json>`__.

- ``RomiGyro``
- ``RomiMotor``
- ``OnboardIO``
