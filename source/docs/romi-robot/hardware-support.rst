Romi Hardware Support
=====================

The Romi robot has limited hardware interfacing support. It is not compatible with the large majority of FRC based control system components. Details on the pin mapping is available in :doc:`getting-to-know-romi``

Incompatible Hardware
---------------------

The Romi Robot DIO is not compatible with the following:

- Non-integrated encoders
- Ultrasonics
- Timing based sensors

Compatible Classes
------------------

All classes listed here are supported by the Romi Robot. If a class is not listed here, assume that it is not supported and *will not* work.

- ``Encoder``
- ``RomiGyro``
- ``RomiMotor``
- ``AnalogInput``
- ``DigitalInput``
- ``DigitalOutput``
- ``Servo``
