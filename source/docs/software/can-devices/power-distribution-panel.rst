Power Distribution Panel
========================

The Power Distribution Panel (PDP) can use its CAN connectivity to communicate a wealth of status information regarding the robot's power use to the roboRIO, for use in user code.  The PDP has the capability to report its current temperature, the bus voltage, the total robot current draw, the total robot energy use, and the individual current draw of each device power channel.  These data can be used for a number of advanced control techniques, such as motor torque limiting and brownout avoidance.

Creating a PDP Object
---------------------

To use the PDP, create an instance of the :code:`PowerDistributionPanel` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/PowerDistributionPanel.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1PowerDistributionPanel.html>`__):

.. tabs::

    .. code-tab:: c++

        PowerDistributionPanel examplePDP{0};

    .. code-tab:: java

        PowerDistributionPanel examplePDP = new PowerDistributionPanel(0);

Note: it is not necessary to create a PowerDistributionPanel object unless you need to read values from it. The board will work and supply power on all the channels even if the object is never created.

.. warning:: To enable voltage and current logging in the Driver Station, the CAN ID for the PDP *must* be 0.

Reading the Bus Voltage
-----------------------

.. tabs::

    .. code-tab:: java

        examplePDP.getVoltage();

    .. code-tab:: c++

        examplePDP.GetVoltage();

.. todo:: link to page on brownout protection after it's ported

Monitoring the bus voltage can be useful for (among other things) detecting when the robot is near a brownout, so that action can be taken to avoid brownout in a controlled manner.

Reading the Temperature
-----------------------

.. tabs::

    .. code-tab:: java

        examplePDP.getTemperature();

    .. code-tab:: c++

        examplePDP.GetTemperature();

Monitoring the temperature can be useful for detecting if the robot has been drawing too much power and needs to be shut down for a while, or if there is a short or other wiring problem.

Reading the Total Current and Energy
------------------------------------

.. tabs::

    .. code-tab:: java

        examplePDP.getTotalCurrent();
        examplePDP.getTotalEnergy();

    .. code-tab:: c++

        examplePDP.GetTotalCurrent();
        examplePDP.GetTotalEnergy();

Monitoring the total current and total energy (the total energy is simply the total current multiplied by the bus voltage) can be useful for controlling how much power is being drawn from the battery, both for preventing brownouts and ensuring that mechanisms have sufficient power available to perform the actions required.

Reading Individual Channel Currents
-----------------------------------

The PDP also allows users to monitor the current drawn by the individual device power channels.  For example, to read the current on channel 0:

.. tabs::

    .. code-tab:: java

        examplePDP.getCurrent(0);

    .. code-tab:: c++

        examplePDP.GetCurrent(0);

Monitoring individual device current draws can be useful for detecting shorts or stalled motors.
