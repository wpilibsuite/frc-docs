.. include:: <isonum.txt>

# Hardware APIs

This section discusses the control of motors and pneumatics through motor controllers, solenoids, and pneumatics, and their interface with Java and C++ WPILib.

.. toctree::
   :maxdepth: 1

   motors/index
   pneumatics/index
   sensors/index
   misc/index

## Motor Controllers

A motor controller is responsible on your robot for making motors move. For brushed DC motors such as the :term:`CIM` or 775, the motor controller regulates the voltage that the motor receives, much like a light bulb. For brushless motor controllers such as the Spark MAX, the controller regulates the power delivered to each "phase" of the motor.

.. note:: Another name for a motor controller is a speed controller.

.. warning:: Connecting a BRUSHLESS motor controller straight to power, such as to a conventional brushed motor controller, will destroy the motor!

### FRC Legal Motor Controllers

Motor controllers come in lots of shapes, sizes, and feature sets. This is the full list of FRC\ |reg| Legal motor controllers as of 2026:

- Koors40 Motor Controller (P/N am-5600)
- Spark Flex Motor Controller (P/N REV-11-2159, am-5276)
- Spark Motor Controller (P/N: REV-11-1200, am-4260)
- Spark MAX Motor Controller (P/N: REV-11-2158, am-4261)
- Talon FX Motor Controller (P/N 217-6515, 19-708850, am-6515, am-6515_Short, WCP-0940) for controlling integral Falcon 500, Kraken X60, or Kraken X44 only
- Talon FXS Motor Controller (P/N 24-708883, WCP-1692)
- Talon Motor Controller (P/N: CTRE_Talon, CTRE_Talon_SR, and am-2195)
- Talon SRX Motor Controller (P/N: 217-8080, am-2854, 14-838288)
- Thrifty Nova (P/N TTB-0100)
- Venom Motor with Controller (P/N BDC-10001) for controlling integral motor only​
- Victor SP Motor Controller (P/N: 217-9090, am-2855, 14-868380)
- Victor SPX Motor Controller (P/N: 217-9191, 17-868388, am-3748)


## Pneumatics

Pneumatics are a quick and easy way to make something that's in one state or another using compressed air. For information on operating pneumatics, see :doc:`pneumatics/index`.

### FRC Legal Pneumatics controllers

- Pneumatics Control Module (P/N: am-2858, 217-4243)
- Pneumatic Hub (P/N REV-11-1852)

## Relays

A relay controls power to a motor or custom electronics in an On/Off fashion.

### FRC Legal Relay Modules
- Spike H-Bridge Relay (P/N: 217-0220 and SPIKE-RELAY-H)
- Automation Direct Relay (P/N: AD-SSR6M12-DC200D, AD-SSR6M25-DC200D, AD-SSR6M40-DC200D)
- Power Distribution Hub (PDH) switched channel (P/N REV-11-1850)
