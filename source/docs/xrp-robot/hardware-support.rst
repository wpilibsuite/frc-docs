XRP Hardware Support
====================

The XRP robot, having a different hardware architecture than a roboRIO, is compatible with a subset of commonly used FRC control system components.

Compatible Hardware
-------------------

In general, the XRP is compatible with the following:

- Hobby DC motors with built-in encoders (6-pin connector)
- Standard RC-style :term:`PWM` output devices (e.g. servos, PWM based motor controllers)
- "Ping" style ultrasonic sensors (only when connected to the RANGE port)

Incompatible Hardware
---------------------

Due to hardware limitations, the XRP is not compatible with the following:

- Encoders other than those already integrated into hobby motors
- Timing based sensors
- CAN based devices

Compatible Classes
------------------

All classes listed here are supported by the XRP. If a class is not listed here, assume that it is not supported and *will not* work.

- ``Encoder``
- ``AnalogInput``
- ``DigitalInput``
- ``DigitalOutput``
- ``BuiltInAccelerometer``

.. note:: The PWM motor controller classes (e.g. ``Spark``) and ``Servo`` are not supported. The XRP requires use of specialized ``XRPMotor`` and ``XRPServo`` classes.

The following classes are provided by the XRP Vendordep (built-in to WPILib).

- ``XRPGyro``
- ``XRPMotor``
- ``XRPServo``
- ``XRPOnBoardIO``
