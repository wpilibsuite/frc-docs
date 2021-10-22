Power Distribution Module
=========================

The CTRE Power Distribution Panel (PDP) and Rev Power Distribution Hub can use their CAN connectivity to communicate a wealth of status information regarding the robot's power use to the roboRIO, for use in user code.  This has the capability to report current temperature, the bus voltage, the total robot current draw, the total robot energy use, and the individual current draw of each device power channel.  These data can be used for a number of advanced control techniques, such as motor torque limiting and brownout avoidance.

Creating a Power Distribution Object
------------------------------------

To use the either Power Distribution module, create an instance of the :code:`PowerDistribution` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj/PowerDistribution.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_power_distribution.html>`__):

.. tabs::

    .. code-tab:: java

        PowerDistributionPanel examplePD = new PowerDistribution(0, ModuleType.kAutomatic);

    .. code-tab:: c++

        PowerDistributionPanel examplePD{0, frc::PowerDistribution::ModuleType::kAutomatic};

Note: it is not necessary to create a PowerDistribution object unless you need to read values from it. The board will work and supply power on all the channels even if the object is never created.

.. warning:: To enable voltage and current logging in the Driver Station, the CAN ID *must* be 0.

Reading the Bus Voltage
-----------------------

.. tabs::

    .. code-tab:: java

        examplePD.getVoltage();

    .. code-tab:: c++

        examplePD.GetVoltage();

Monitoring the bus voltage can be useful for (among other things) detecting when the robot is near a brownout, so that action can be taken to avoid brownout in a controlled manner. See the :doc:`roboRIO Brownouts document</docs/software/roborio-info/roborio-brownouts>` for more information.

Reading the Temperature
-----------------------

.. tabs::

    .. code-tab:: java

        examplePD.getTemperature();

    .. code-tab:: c++

        examplePD.GetTemperature();

Monitoring the temperature can be useful for detecting if the robot has been drawing too much power and needs to be shut down for a while, or if there is a short or other wiring problem.

Reading the Total Current and Energy
------------------------------------

.. tabs::

    .. code-tab:: java

        examplePD.getTotalCurrent();
        examplePD.getTotalEnergy();

    .. code-tab:: c++

        examplePD.GetTotalCurrent();
        examplePD.GetTotalEnergy();

Monitoring the total current and total energy (the total energy is simply the total current multiplied by the bus voltage) can be useful for controlling how much power is being drawn from the battery, both for preventing brownouts and ensuring that mechanisms have sufficient power available to perform the actions required.

Reading Individual Channel Currents
-----------------------------------

The PDP also allows users to monitor the current drawn by the individual device power channels.  For example, to read the current on channel 0:

.. tabs::

    .. code-tab:: java

        examplePD.getCurrent(0);

    .. code-tab:: c++

        examplePD.GetCurrent(0);

Monitoring individual device current draws can be useful for detecting shorts or stalled motors.
