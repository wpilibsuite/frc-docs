FRC Control System Hardware Overview
====================================

The goal of this document is to provide a brief overview of the hardware
components that make up the FRC Control System. Each component will
contain a brief description of the component function, a brief listing
of critical connections, and a link to more documentation if available.
Note that for complete wiring instructions/diagrams, please see the
Wiring the FRC Control System document.

National Instruments roboRIO
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

|image0|

The NI-roboRIO is the main robot controller used for FRC. The roboRIO
includes a dual-core ARM Cortex™-A9 processor and FPGA which runs both
trusted elements for control and safety as well as team-generated code.
Integrated controller I/O includes a variety of communication protocols
(Ethernet, USB, CAN, SPI, I2C, and serial) as well as PWM, servo,
digital I/O, and analog I/O channels used to connect to robot
peripherals for sensing and control.The roboRIO should connect to the
dedicated 12V port on the Power Distribution Panel for power. Wired
communication is available via USB or Ethernet. Detailed information on
the roboRIO can be found in the `roboRIO User
Manual <http://www.ni.com/pdf/manuals/374474a.pdf>`__.

Power Distribution Panel
~~~~~~~~~~~~~~~~~~~~~~~~

|image1|

The Power Distribution Panel (PDP) is designed to distribute power from
a 12VDC battery to various robot components through auto-resetting
circuit breakers and a small number of special function fused
connections. The PDP provides 8 output pairs rated for 40A continuous
current and 8 pairs rated for 30A continuous current. The PDP provides
dedicated 12V connectors for the roboRIO, as well as connectors for the
Voltage Regulator Module and Pneumatics Control Module. It also includes
a CAN interface for logging current, temperature, and battery voltage.
For more detailed information, see the[ PDP User
Manual](http://www.ctr-electronics.com/control-system/pdp.html#product_tabs_technical_resources
" PDP User Manual").

Pneumatics Control Module
~~~~~~~~~~~~~~~~~~~~~~~~~

|image2|

The PCM is a device that contains all of the inputs and outputs required
to operate 12V or 24V pneumatic solenoids and the on board compressor.
The PCM is enabled/disabled by the roboRIO over the CAN interface. The
PCM contains an input for the pressure sensor and will control the
compressor automatically when the robot is enabled and a solenoid has
been created in the code. The device also collects diagnostic
information such as solenoid states, pressure switch state, and
compressor state. The module includes diagnostic LED’s for both CAN and
the individual solenoid channels. For more information see the `PCM User
Manual <http://www.ctr-electronics.com/control-system/pcm.html#product_tabs_technical_resources>`__.

Voltage Regulator Module
~~~~~~~~~~~~~~~~~~~~~~~~

|image3|

The VRM is an independent module that is powered by 12 volts. The device
is wired to a dedicated connector on the PDP. The module has multiple
regulated 12V and 5V outputs. The purpose of the VRM is to provide
regulated power for the robot radio, custom circuits, and IP vision
cameras. **Note: The two connector pairs associated with each label have
a combined rating of what the label indicates (e.g. 5V/500mA total for
both pairs not for each pair). The 12V/2A limit is a peak rating, the
supply should not be loaded with more than 1.5A continuous current
draw.**\ For more information, see the `VRM User
Manual <http://www.ctr-electronics.com/control-system/vrm.html#product_tabs_technical_resources>`__.

Motor Controllers
~~~~~~~~~~~~~~~~~

There are a variety of different motor controllers which work with the
FRC Control System and are approved for use. These devices are used to
provide variable voltage control of the brushed DC motors used in FRC.
They are listed here in alphabetical order.

DMC-60 and DMC-60C Motor Controller
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

|image4|

The DMC-60 is a PWM motor controller from Digilent. The DMC-60 features
integrated thermal sensing and protection including current-foldback to
prevent overheating and damage, and four multi-color LEDs to indicate
speed, direction, and status for easier debugging. For more information,
see the DMC-60 reference manual:
https://reference.digilentinc.com/dmc-60/reference-manual

The DMC-60C adds CAN smart controller capabilities to the DMC-60
controller. This enables closed loop control features and other
intelligent control options. For more information see the DMC-60C
Product Page:
https://store.digilentinc.com/dmc60c-digital-motor-controller-approved-for-first-robotics/

Jaguar Motor Controller
^^^^^^^^^^^^^^^^^^^^^^^

|image5|

The Jaguar Motor Controller from VEX Robotics (formerly made by Luminary
Micro and Texas Instruments) is a variable speed motor controller for
use in FRC. For FRC, the Jaguar may only be controlled using the PWM
interface. For more information, see the Jaguar Getting Started Guide,
Jaguar Datasheet and Jaguar FAQ on `this
page <https://www.vexrobotics.com/217-3367.html>`__.

SD540B and SD540C Motor Controllers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

|image6|

The SD540 Motor Controller from Mindsensors is a variable speed motor
controller for use in FRC. The SD540B is controlled using the PWM
interface. The SD540C is controllable over CAN. Limit switches may be
wired directly to the SD540 to limit motor travel in one or both
directions. Switches on the device are used to flip the direction of
motor travel, configure the wiring polarity of limit switches, set Brake
or Coast mode, and put the device in calibration mode. For more
information see the Mindsensors FRC page:
http://www.mindsensors.com/68-frc

SPARK Motor Controller
^^^^^^^^^^^^^^^^^^^^^^

|image7|

The SPARK Motor Controller from REV Robotics is a variable speed motor
controller for use in FRC. The SPARK is controlled using the PWM
interface. Limit switches may be wired directly to the SPARK to limit
motor travel in one or both directions. The RGB status LED displays the
current state of the device including whether the device is currently in
Brake mode or Coast mode. For more information, see the REV Robotics
SPARK product page: http://www.revrobotics.com/rev-11-1200/

SPARK MAX Motor Controller
^^^^^^^^^^^^^^^^^^^^^^^^^^

|image8|

The SPARK MAX Motor Controller from REV Robotics is a variable speed
motor controller for use in FRC. The SPARK MAX is capable of controlling
either the traditional brushed DC motors commonly used in FRC or the new
brushless REV Robotics NEO Brushless Motor. The SPARK MAX can be
controlled over PWM, CAN or USB (for configuration/testing only). The
controller has a data port for sensor input and is capable of closed
loop control modes when controlled over CAN or USB. For more information
see the REV Robotics SPARK MAX product page:
http://www.revrobotics.com/rev-11-2158/

Talon Motor Controller
^^^^^^^^^^^^^^^^^^^^^^

|image9|

The Talon Motor Controller from Cross the Road Electronics is a variable
speed motor controller for use in FRC. The Talon is controlled over the
PWM interface. The Talon should be connected to a PWM output of the
roboRIO and powered from the Power Distribution Panel. For more
information see the `Talon User
Manual <http://www.crosstheroadelectronics.com/Talon_User_Manual_1_1.pdf>`__.

Talon SRX
^^^^^^^^^

|image10|

The Talon SRX motor controller is a CAN-enabled “smart motor controller”
from Cross The Road Electronics/VEX Robotics. The Talon SRX has an
electrically isolated metal housing for heat dissipation, making the use
of a fan optional. The Talon SRX can be controlled over the CAN bus or
PWM interface. When using the CAN bus control, this device can take
inputs from limit switches and potentiometers, encoders, or similar
sensors in order to perform advanced control such as limiting or PID(F)
closed loop control on the device. For more information see the `Talon
SRX User
Manual <http://www.ctr-electronics.com/talon-srx.html#product_tabs_technical_resources>`__.

**Note: CAN Talon SRX has been removed from WPILib. See
this**\ `blog <http://www.firstinspires.org/robotics/frc/blog/2017-control-system-update>`__\ **for
more info and find the CTRE Toolsuite installer here:**
http://www.ctr-electronics.com/control-system/hro.html#product_tabs_technical_resources

Victor 888 Motor Controller / Victor 884 Motor Controller
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

|image11|

The Victor 888 Motor Controller from VEX Robotics is a variable speed
motor controller for use in FRC. The Victor 888 replaces the Victor 884,
which is also usable in FRC. The Victor is controlled over the PWM
interface. The Victor should be connected to a PWM output of the roboRIO
and powered from the Power Distribution Panel. For more information, see
the `Victor 884 User
Manual <http://content.vexrobotics.com/docs/ifi-v884-users-manual-9-25-06.pdf>`__
and `Victor 888 User
Manual <http://content.vexrobotics.com/docs/217-2769-Victor888UserManual.pdf>`__.

Victor SP
^^^^^^^^^

|image12|

The Victor SP motor controller is a PWM motor controller from Cross The
Road Electronics/VEX Robotics. The Victor SP has an electrically
isolated metal housing for heat dissipation, making the use of the fan
optional. The case is sealed to prevent debris from entering the
controller. The controller is approximately half the size of previous
models. For more information, see the `Victor SP User
Manual <http://www.vexrobotics.com/vexpro/motors-electronics/217-9090.html>`__.

Victor SPX
^^^^^^^^^^

|image13|

The Victor SPX motor controller is a CAN or PWM controlled motor
controller from Cross The Road Electronics/VEX Robotics. The device is
connectorized to allow easy connection to the roboRIO PWM connectors or
a CAN bus chain. When controlled over the CAN bus, the device has a
number of the closed loop features also present in the Talon SRX. The
case is sealed to prevent debris from entering the controller. For more
information, see the `Victor SPX
Webpage <https://www.vexrobotics.com/217-9191.html>`__.

**Note: Victor SPX CAN control is not supported from WPILib.
See**\ `this
blog <http://www.firstinspires.org/robotics/frc/blog/2017-control-system-update>`__\ **for
more info and find the CTRE Toolsuite installer here:**
http://www.ctr-electronics.com/control-system/hro.html#product_tabs_technical_resources

Spike H-Bridge Relay
~~~~~~~~~~~~~~~~~~~~

|image14|

The Spike H-Bridge Relay from VEX Robotics is a device used for
controlling power to motors or other custom robot electronics. When
connected to a motor, the Spike provides On/Off control in both the
forward and reverse directions. The Spike outputs are independently
controlled so it can also be used to provide power to up to 2 custom
electronic circuits. The Spike H-Bridge Relay should be connected to a
relay output of the roboRIO and powered from the Power Distribution
Panel. For more information, see the `Spike User’s
Guide <http://content.vexrobotics.com/docs/spike-blue-guide-sep05.pdf>`__.

Servo Power Module
~~~~~~~~~~~~~~~~~~

|image15|

The Servo Power Module from Rev Robotics is capable of expanding the
power available to servos beyond what the roboRIO integrated power
supply is capable of. The Servo Power Module provides up to 90W of 6V
power across 6 channels. All control signals are passed through directly
from the roboRIO. For more information, see the `Servo Power Module
webpage <http://www.revrobotics.com/rev-11-1144/>`__.

Axis M1013/M1011/206 Ethernet Camera
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

|image16|

The Axis M1013, M1011 and Axis 206 Ethernet cameras are used for
capturing images/control-system-hardware for vision processing and/or sending video back to the
Driver Station laptop. The camera should be wired to a 5V power output
on the Voltage Regulator Module and an open ethernet port on the robot
radio. For more information, see Configuring an Axis Camera and the Axis
206, Axis M1011, Axis M1013 pages.

Microsoft Lifecam HD3000
~~~~~~~~~~~~~~~~~~~~~~~~

|image17|

The Microsoft Lifecam HD3000 is a USB webcam that can be plugged
directly into the roboRIO. The camera is capable of capturing up to
1280x720 video at 30 FPS. For more information about the camera, see the
`Microsoft product
page <http://www.microsoft.com/hardware/en-us/p/lifecam-hd-3000#support>`__.
For more information about using the camera with the roboRIO, see the
Vision Processing section if this documentation.

OpenMesh OM5P-AN or OM5P-AC Radio
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

|image18|

Either the OpenMesh OM5P-AN or OpenMesh OM5P-AC wireless radio is used
as the robot radio to provide wireless communication functionality to
the robot. The device can be configured as an Access Point for direct
connection of a laptop for use at home. It can also be configured as a
bridge for use on the field. The robot radio should be powered by one of
the 12V/2A outputs on the VRM and connected to the roboRIO controller
over Ethernet. For more information, see Programming your radio for home
use and the `Open Mesh OM5P-AC product
page <http://www.open-mesh.com/grp-om5p-ac-cloud-access-point.html>`__.

The OM5P-AN `is no longer available for
purchase <http://www.firstinspires.org/robotics/frc/blog/radio-silence>`__.
The OM5P-AC is slightly heavier, has more cooling grates, and has a
rough surface texture compared to the OM5P-AN.

120A Circuit Breaker
~~~~~~~~~~~~~~~~~~~~

|image19|

The 120A Main Circuit Breaker serves two roles on the robot: the main
robot power switch and a protection device for downstream robot wiring
and components. The 120A circuit breaker is wired to the positive
terminals of the robot battery and Power Distribution boards. For more
information, please see the `Cooper Bussmann 18X Series Datasheet (PN:
185120F) <http://www.cooperindustries.com/content/dam/public/bussmann/Transportation/Circuit%20Protection/resources/datasheets/BUS_Tns_DS_18X_CIRCUITBREAKER.pdf>`__

Snap Action Circuit Breakers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

|image20|

The Snap Action circuit breakers, MX5-A40 and VB3 series, are used with
the Power Distribution Panel to limit current to branch circuits. The
MX5-A40 40A MAXI style circuit breaker is used with the larger channels
on the Power Distribution Panel to power loads which draw current up to
40A continuous. The VB3 series are used with the smaller channels on the
PDP to power circuits drawing current of 30A or less continuous. For
more information, see the Datasheeets for the `MX5
series <http://www.snapaction.net/pdf/MX5%20Spec%20Sheet.pdf>`__ and
`VB3 Series <http://www.snapaction.net/pdf/vb3.pdf>`__.

Robot Battery
~~~~~~~~~~~~~

|image21|

The power supply for an FRC robot is a single 12V 18Ah battery. The
batteries used for FRC are sealed lead acid batteries capable of meeting
the high current demands of an FRC robot. For more information, see the
Datasheets for the `MK
ES17-12 <http://www.mkbattery.com/images/control-system-hardware/ES17-12.pdf>`__ and E\ `nersys
NP18-12 <http://www.enersys.com/WorkArea/DownloadAsset.aspx?id=488>`__.
Note that other battery part numbers may be legal, consult the FRC
Manual for a complete list.

Image Credits
~~~~~~~~~~~~~

Image of roboRIO courtesy of National Instruments. Image of DMC-60
courtesy of Digilent. Image of SD540 courtesy of Mindsensors. Images of
Jaguar Motor Controller, Talon SRX, Victor 888, Victor SP, Victor SPX,
and Spike H-Bridge Relay courtesy of VEX Robotics, Inc. Image of SPARK
MAX courtesy of REV Robotics. Lifecam, PDP, PCM, SPARK, and VRM photos
courtesy of FIRST. All other photos courtesy of AndyMark Inc.

.. |image0| image:: images/control-system-hardware/roborio.png
.. |image1| image:: images/control-system-hardware/power-distribution-panel.png
.. |image2| image:: images/control-system-hardware/pneumatics-control-module.png
.. |image3| image:: images/control-system-hardware/voltage-regulator-module.png
.. |image4| image:: images/control-system-hardware/dmc-60c-motor-controller.png
.. |image5| image:: images/control-system-hardware/jaguar-motor-controller.png
.. |image6| image:: images/control-system-hardware/sdb540-motor-controller.png
.. |image7| image:: images/control-system-hardware/spark-motor-controller.png
.. |image8| image:: images/control-system-hardware/spark-max-motor-controller.png
.. |image9| image:: images/control-system-hardware/talon-motor-controller.png
.. |image10| image:: images/control-system-hardware/talonsrx-motor-controller.png
.. |image11| image:: images/control-system-hardware/victor-888-motor-controller.png
.. |image12| image:: images/control-system-hardware/victor-sp-motor-controller.png
.. |image13| image:: images/control-system-hardware/victor-spx-motor-controller.png
.. |image14| image:: images/control-system-hardware/spike-relay.png
.. |image15| image:: images/control-system-hardware/servo-power-module.png
.. |image16| image:: images/control-system-hardware/axis-camera.png
.. |image17| image:: images/control-system-hardware/microsoft-lifecam.png
.. |image18| image:: images/control-system-hardware/openmesh-radio.png
.. |image19| image:: images/control-system-hardware/circuit-breaker.png
.. |image20| image:: images/control-system-hardware/snap-action-circuit-breaker.png
.. |image21| image:: images/control-system-hardware/robot-battery.png

