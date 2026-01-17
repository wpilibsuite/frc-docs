# Power Distribution Module

The CTRE Power Distribution Panel (:term:`PDP`) and Rev Power Distribution Hub (:term:`PDH`) can use their :term:`CAN` connectivity to communicate a wealth of status information regarding the robot's power use to the roboRIO, for use in user code.  This has the capability to report current temperature, the bus voltage, the total robot current draw, the total robot energy use, and the individual current draw of each device power channel.  This data can be used for a number of advanced control techniques, such as motor  :term:`torque` limiting and brownout avoidance.

## Creating a Power Distribution Object

To use the either Power Distribution module, create an instance of the :code:`PowerDistribution` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/PowerDistribution.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_power_distribution.html), :external:py:class:`Python <wpilib.PowerDistribution>`). With no arguments, the Power Distribution object will be detected, and must use CAN ID of 0 for CTRE or 1 for REV. If the CAN ID is non-default, additional constructors are available to specify the CAN ID and type.

.. tab-set-code::

    ```java
    PowerDistribution examplePD = new PowerDistribution();
    PowerDistribution examplePD = new PowerDistribution(0, ModuleType.kCTRE);
    PowerDistribution examplePD = new PowerDistribution(1, ModuleType.kRev);
    ```

    ```c++
    PowerDistribution examplePD{};
    PowerDistribution examplePD{0, frc::PowerDistribution::ModuleType::kCTRE};
    PowerDistribution examplePD{1, frc::PowerDistribution::ModuleType::kRev};
    ```

    ```python
    from wpilib import PowerDistribution
    examplePD = PowerDistribution()
    examplePD = PowerDistribution(0, PowerDistribution.ModuleType.kCTRE)
    examplePD = PowerDistribution(1, PowerDistribution.ModuleType.kRev)
    ```

Note: it is not necessary to create a PowerDistribution object unless you need to read values from it. The board will work and supply power on all the channels even if the object is never created.

## Reading the Bus Voltage

.. tab-set-code::


      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/canpdp/Robot.java
         :language: java
         :lines: 31-34

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/CANPDP/cpp/Robot.cpp
         :language: c++
         :lines: 28-31

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/CANPDP/robot.py
         :language: python
         :lines: 34-37


Monitoring the bus voltage can be useful for (among other things) detecting when the robot is near a brownout, so that action can be taken to avoid brownout in a controlled manner. See the :doc:`roboRIO Brownouts document</docs/software/roborio-info/roborio-brownouts>` for more information.

## Reading the Temperature

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/canpdp/Robot.java
      :language: java
      :lines: 36-38

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/CANPDP/cpp/Robot.cpp
      :language: c++
      :lines: 33-35

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/CANPDP/robot.py
      :language: python
      :lines: 39-41


Monitoring the temperature can be useful for detecting if the robot has been drawing too much power and needs to be shut down for a while, or if there is a short or other wiring problem.

## Reading the Total Current, Power, and Energy

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/canpdp/Robot.java
      :language: java
      :lines: 40-52

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/CANPDP/cpp/Robot.cpp
      :language: c++
      :lines: 37-49

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/CANPDP/robot.py
         :language: python
         :lines: 43-55


Monitoring the total current, power, and energy can be useful for controlling how much power is being drawn from the battery, both for preventing brownouts and ensuring that mechanisms have sufficient power available to perform the actions required. Power is the bus voltage multiplied by the current with the units Watts. Energy is the power summed over time with units Joules.

## Reading Individual Channel Currents

The PDP/PDH also allows users to monitor the current drawn by the individual device power channels.  You can read the current on any of the 16 PDP channels (0-15) or 24 PDH channels (0-23).

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/canpdp/Robot.java
      :language: java
      :lines: 25-29

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/CANPDP/cpp/Robot.cpp
      :language: c++
      :lines: 22-26

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/CANPDP/robot.py
      :language: python
      :lines: 28-32


Monitoring individual device current draws can be useful for detecting shorts or stalled motors.

## Using the Switchable Channel (PDH)

The REV PDH has one channel that can be switched on or off to control custom circuits.

.. tab-set-code::

    ```java
    examplePD.setSwitchableChannel(true);
    examplePD.setSwitchableChannel(false);
    ```

    ```c++
    examplePD.SetSwitchableChannel(true);
    examplePD.SetSwitchableChannel(false);
    ```

    ```python
    examplePD.setSwitchableChannel(True)
    examplePD.setSwitchableChannel(False)
    ```

