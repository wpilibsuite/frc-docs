Commands and Subsystems
=======================

When using the Command-based framework Shuffleboard makes it easier to understand what the robot is doing by displaying the state of various commands and subsystems in real-time. 

Displaying Subsystems
---------------------

To see the status of a subsystem while the robot is operating in either automous or telop modes, that is what it's default command is and what command is currently using that subsystem send a subsystem instance to Shuffleboard:

.. tabs::

   .. code-tab:: java

      SmartDashboard.putData(subsystem-reference);

   .. code-tab:: cpp

      SmartDashboard::PutData(subsystem-pointer);

Shuffleboard will display the subsystem name, the default command associated with this subsystem, and the currently running command. In this example the default command for the Elevator subsystem is called "AutonomousCommand" and it is also the current command that is using the Elevator subsystem.

.. image:: images/commands-subsystems-1.png

Subsystems in Test Mode
-----------------------

In Test mode (Test/Enabled in the driver station) subsystems maybe displayed in the LiveWindow tab with the sensors and actuators of the subsystem. This is ideal for verifying of sensors are working and seeing the values that they are returning. In addition the actuators can be operated, for example motors can be operated using sliders to set the speed and direction. For PIDSubsystems the P, I, D, and F constants are displayed along with the setpoint and an enable control. This is useful for tuning PIDSubsystems by adjusting the constants, putting in a setpoint, and enabling the embedded PIDController. The the mechanisms response can be observed. Then the parameters can be changed, the PIDController re-enabled until a reasonable set of parameters is found.

.. image:: images/commands-subsystems-2.png

More information on tuning PIDSubsystems can be found here: Testing and tuning PID loops. Using RobotBuilder will automatically generate the code to get the subsystem displayed in Test mode. The code that is necessary to have subsystems displayed is shown below where subsystem-name is a string containing the name of the subsystem:

.. code-block: none

   setName(subsystem-name);

Displaying Commands
-------------------

Using commands and subsystems makes very modular robot programs that can easily be tested and modified. Part of this is because commands can be written completely independently of other commands and can therefor be easily run from Shuffleboard. To write a command to Shuffleboard use the ``SmartDashboard.putData`` method as shown here:

.. tabs::

   .. code-tab:: java

      SmartDashboard.putData("ElevatorMove: up", new ElevatorMove(2.7);

   .. code-tab:: cpp

      SmartDashboard::PutData("ElevatorMove: up", new ElevatorMove(2.7);

Shuffleboard will display the command name and a button to execute the command. In this way individual commands and command groups can easily be tested without needing special test code in a robot program. In the image below there are a number of commands contained in a Shuffleboard list. Pressing the button once runs the command and pressing it again stops the command. To use this feature the robot must be enabled in teleop mode.

.. image:: images/commands-subsystems-3.png
