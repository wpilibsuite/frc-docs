Power Distribution Module
=========================

The CTRE Power Distribution Panel (:term:`PDP`) and Rev Power Distribution Hub (:term:`PDH`) can use their :term:`CAN` connectivity to communicate a wealth of status information regarding the robot's power use to the roboRIO, for use in user code.  This has the capability to report current temperature, the bus voltage, the total robot current draw, the total robot energy use, and the individual current draw of each device power channel.  This data can be used for a number of advanced control techniques, such as motor  :term:`torque` limiting and brownout avoidance.

Creating a Power Distribution Object
------------------------------------

To use the either Power Distribution module, create an instance of the :code:`PowerDistribution` class ([Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/wpilibj/PowerDistribution.html), [C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc_1_1_power_distribution.html), :external:py:class:`Python <wpilib.PowerDistribution>`). With no arguments, the Power Distribution object will be detected, and must use CAN ID of 0 for CTRE or 1 for REV. If the CAN ID is non-default, additional constructors are available to specify the CAN ID and type.

.. tab-set-code::

    .. code-block:: java

        PowerDistribution examplePD = new PowerDistribution();
        PowerDistribution examplePD = new PowerDistribution(0, ModuleType.kCTRE);
        PowerDistribution examplePD = new PowerDistribution(1, ModuleType.kRev);

    .. code-block:: c++

        PowerDistribution examplePD{};
        PowerDistribution examplePD{0, frc::PowerDistribution::ModuleType::kCTRE};
        PowerDistribution examplePD{1, frc::PowerDistribution::ModuleType::kRev};

    .. code-block:: python

        from wpilib import PowerDistribution

        examplePD = PowerDistribution()
        examplePD = PowerDistribution(0, PowerDistribution.ModuleType.kCTRE)
        examplePD = PowerDistribution(1, PowerDistribution.ModuleType.kRev)

Note: it is not necessary to create a PowerDistribution object unless you need to read values from it. The board will work and supply power on all the channels even if the object is never created.

.. warning:: To enable voltage and current logging in the Driver Station, the CAN ID for the CTRE Power Distribution Panel *must* be 0, and for the REV Power Distribution Hub it *must* be 1.

Reading the Bus Voltage
-----------------------

.. tab-set-code::


      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/canpdp/Robot.java
         :language: java
         :lines: 32-35
         :linenos:
         :lineno-start: 32


      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/CANPDP/cpp/Robot.cpp
         :language: c++
         :lines: 28-31
         :linenos:
         :lineno-start: 28


      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/d89b0587a1e1111239728140466c7dc4324d4005/CANPDP/robot.py
         :language: python
         :lines: 34-37
         :linenos:
         :lineno-start: 34


Monitoring the bus voltage can be useful for (among other things) detecting when the robot is near a brownout, so that action can be taken to avoid brownout in a controlled manner. See the :doc:`roboRIO Brownouts document</docs/software/roborio-info/roborio-brownouts>` for more information.

Reading the Temperature
-----------------------

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/canpdp/Robot.java
      :language: java
      :lines: 37-39
      :linenos:
      :lineno-start: 37

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/CANPDP/cpp/Robot.cpp
      :language: c++
      :lines: 33-35
      :linenos:
      :lineno-start: 33

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/d89b0587a1e1111239728140466c7dc4324d4005/CANPDP/robot.py
      :language: python
      :lines: 39-41
      :linenos:
      :lineno-start: 39

Monitoring the temperature can be useful for detecting if the robot has been drawing too much power and needs to be shut down for a while, or if there is a short or other wiring problem.

Reading the Total Current, Power, and Energy
--------------------------------------------

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/canpdp/Robot.java
      :language: java
      :lines: 41-53
      :linenos:
      :lineno-start: 41

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/CANPDP/cpp/Robot.cpp
      :language: c++
      :lines: 37-49
      :linenos:
      :lineno-start: 37

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/d89b0587a1e1111239728140466c7dc4324d4005/CANPDP/robot.py
         :language: python
         :lines: 43-55
         :linenos:
         :lineno-start: 43

Monitoring the total current, power and energy can be useful for controlling how much power is being drawn from the battery, both for preventing brownouts and ensuring that mechanisms have sufficient power available to perform the actions required. Power is the bus voltage multiplied by the current with the units Watts. Energy is the power summed over time with units Joules.

Reading Individual Channel Currents
-----------------------------------

The PDP/PDH also allows users to monitor the current drawn by the individual device power channels.  You can read the current on any of the 16 PDP channels (0-15) or 24 PDH channels (0-23).

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/canpdp/Robot.java
      :language: java
      :lines: 26-30
      :linenos:
      :lineno-start: 26

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/CANPDP/cpp/Robot.cpp
      :language: c++
      :lines: 22-26
      :linenos:
      :lineno-start: 22

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/d89b0587a1e1111239728140466c7dc4324d4005/CANPDP/robot.py
      :language: python
      :lines: 28-32
      :linenos:
      :lineno-start: 28

Monitoring individual device current draws can be useful for detecting shorts or stalled motors.

Using the Switchable Channel (PDH)
----------------------------------

The REV PDH has one channel that can be switched on or off to control custom circuits.

.. tab-set-code::

    .. code-block:: java

        examplePD.setSwitchableChannel(true);
        examplePD.setSwitchableChannel(false);

    .. code-block:: c++

        examplePD.SetSwitchableChannel(true);
        examplePD.SetSwitchableChannel(false);

    .. code-block:: python

        examplePD.setSwitchableChannel(True)
        examplePD.setSwitchableChannel(False)
