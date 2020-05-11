Actuator Overview
==================
This section discusses the control of motors and pneumatics through speed controllers, solenoids and pneumatics, and their interface with C++ and Java WPILib.

Speed controllers
-----------------
A speed controller is responsible on your robot for making motors move. For brushed DC motors such as CIMs or 775s, the speed controller regulates the voltage that the motor receives, much like a light bulb. For brushless speed controllers such as the Spark MAX, the controller regulates the power delivered to each "phase" of the motor.

.. .. hint::
..     One can make a quick, non-competition-legal speed controller by removing the motor from a cordless BRUSHED drill and attaching PowerPoles or equivalents to the motor's leads. Make sure that the voltage supplied by the drill will not damage the motor, but note that the 775 is fine at up to 24 volts.

.. warning:: Connecting a BRUSHLESS motor controller straight to power, such as to a conventional brushed motor controller, will destroy the motor!

FRC Legal Motor Controllers
^^^^^^^^^^^^^^^^^^^^^^^^^^^
Speed controllers come in lots of shapes, sizes and feature sets. This is the full list of FRC Legal speed controllers as of January 2020:

- DMC 60/DMC 60c Motor Controller (P/N: 410-334-1, 410-334-2)
- Jaguar Motor Controller (P/N: MDL-BDC, MDL-BDC24, and 217-3367) connected to PWM only
- Nidec Dynamo BLDC Motor with Controller to control integral actuator only (P/N 840205-000, am-3740)
- SD540 Motor Controller (P/N: SD540x1, SD540x2, SD540x4, SD540Bx1, SD540Bx2, SD540Bx4, SD540C)
- Spark Motor Controller (P/N: REV-11-1200)
- Spark MAX Motor Controller (P/N: REV-11-2158)
- Talon FX Motor Controller (P/N: 217-6515, 19-708850, am-6515, am-6515_Short) for controlling integral Falcon 500 only
- Talon Motor Controller (P/N: CTRE_Talon, CTRE_Talon_SR, and am-2195)
- Talon SRX Motor Controller (P/N: 217-8080, am-2854, 14-838288)
- Victor 884 Motor Controller (P/N: VICTOR-884-12/12)
- Victor 888 Motor Controller (P/N: 217-2769)
- Victor SP Motor Controller (P/N: 217-9090, am-2855, 14-868380)
- Victor SPX Motor Controller (P/N: 217-9191, 17-868388, am-3748)
- Venom Motor with Controller (P/N BDC-10001) for controlling integral motor only​

Pneumatics
----------
Pneumatics are a quick and easy way to make something that's in one state or another using compressed air. For information on operating pneumatics, see :doc:`pneumatics`.

FRC Legal Pneumatics controllers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
- Pneumatics Control Module (P/N: am-2858, 217-4243)

FRC Legal Relay Modules
-----------------------
- Spike H-Bridge Relay (P/N: 217-0220 and SPIKE-RELAY-H)
- Automation Direct Relay (P/N: AD-SSR6M12-DC200D, AD-SSR6M25-DC200D, AD-SSR6M40-DC200D)
