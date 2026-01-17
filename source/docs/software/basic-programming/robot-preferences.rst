# Setting Robot Preferences

The Robot Preferences ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/Preferences.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_preferences.html)) class is used to store values in the flash memory on the roboRIO. The values might be for remembering preferences on the robot such as calibration settings for potentiometers, PID values, setpoints, etc. that you would like to change without having to rebuild the program. The values can be viewed on SmartDashboard or Shuffleboard and read and written by the robot program.

This example shows how to utilize Preferences to change the setpoint of a PID controller and the P constant. The code examples are adapted from the Arm Simulation example ([Java](https://github.com/wpilibsuite/allwpilib/blob/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armsimulation/Robot.java), [C++](https://github.com/wpilibsuite/allwpilib/blob/main/wpilibcExamples/src/main/cpp/examples/ArmSimulation/cpp/Robot.cpp)). You can run the Arm Simulation example in the Robot Simulator to see how to use the preference class and interact with it using the dashboards without needing a robot.


## Initializing Preferences

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armsimulation/Constants.java
         :language: java
         :lines: 15-20

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armsimulation/subsystems/Arm.java
         :language: java
         :lines: 27-29, 73-74, 80-83

   .. tab-item:: C++
      :sync: C++

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/ArmSimulation/include/Constants.h
         :language: c++
         :lines: 30-34

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/ArmSimulation/cpp/subsystems/Arm.cpp
         :language: c++
         :lines: 12, 18-22

   .. tab-item:: Python
      :sync: Python

      .. rli:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/ArmSimulation/constants.py
         :language: python
         :lines: 18-23

      .. rli:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/ArmSimulation/subsytems/arm.py
         :language: python
         :lines: 20-23,37-41

Preferences are stored using a name, the key. It's helpful to store the key in a constant, like ``kArmPositionKey`` and ``kArmPKey`` in the code above to avoid typing it multiple times and avoid typos. We also declare variables, ``kArmKp`` and ``armPositionDeg`` to hold the data retrieved from preferences.

In ``Arm`` constructor, each key is checked to see if it already exists in the Preferences database. The ``containsKey`` method takes one parameter, the key to check if data for that key already exists in the preferences database. If it doesn't exist, a default value is written. The ``setDouble`` method takes two parameters, the key to write and the data to write. There are similar methods for other data types like booleans, ints, and strings.

If using the Command Framework, this type of code could be placed in the constructor of a Subsystem or Command.

## Reading Preferences

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armsimulation/subsystems/Arm.java
         :language: java
         :lines: 105-112

   .. tab-item:: C++
      :sync: C++

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/ArmSimulation/cpp/subsystems/Arm.cpp
         :language: c++
         :lines: 44-52

   .. tab-item:: Python
      :sync: Python

      .. rli:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/ArmSimulation/subsytems/arm.py
         :language: python
         :lines: 43-50

Reading a preference is easy. The ``getDouble`` method takes two parameters, the key to read, and a default value to use in case the preference doesn't exist. There are similar methods for other data types like booleans, ints, and strings.

Depending on the data that is stored in preferences, you can use it when you read it, such as the proportional constant above. Or you can store it in a variable and use it later, such as the setpoint, which is used in ``telopPeriodic`` below.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armsimulation/Robot.java
         :language: java
         :lines: 28-37
      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armsimulation/subsystems/Arm.java
         :language: java
         :lines: 114-120

   .. tab-item:: C++
      :sync: C++

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/ArmSimulation/cpp/Robot.cpp
         :language: c++
         :lines: 15-24
      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/ArmSimulation/cpp/subsystems/Arm.cpp
         :language: c++
         :lines: 54-60

   .. tab-item:: Python
      :sync: Python

      .. rli:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/ArmSimulation/robot.py
         :language: python
         :lines: 22-28
      .. rli:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/ArmSimulation/subsytems/arm.py
         :language: python
         :lines: 52-57

## Using Preferences in SmartDashboard

### Displaying Preferences in SmartDashboard

.. image:: images/robot-preferences/preferences-widget-smartdashboard.png
  :alt: Adding preferences from the Smartdashboard menu

In the SmartDashboard, the Preferences display can be added to the display by selecting :guilabel:`View` then :guilabel:`Add...` then :guilabel:`Robot Preferences`. This reveals the contents of the preferences file stored in the roboRIO flash memory.

### Editing Preferences in SmartDashboard

.. image:: images/robot-preferences/view-edit-preferences-values-smartdashboard.png
  :alt: Editing the robot preferences via the SmartDashboard widget.

The values are shown here with the default values from the code. If the values need to be adjusted they can be edited here and saved.

## Using Preferences in Shuffleboard

### Displaying Preferences in Shuffleboard

.. image:: images/robot-preferences/preferences-widget-shuffleboard.png
  :alt: Adding preferences from the sources window in Shuffleboard

In Shuffleboard, the Preferences display can be added to the display by dragging the preferences field from the sources window. This reveals the contents of the preferences file stored in the roboRIO flash memory.

### Editing Preferences in Shuffleboard

.. image:: images/robot-preferences/view-edit-preferences-values-shuffleboard.png
  :alt: Editing the robot preferences via the Shuffleboard widget.

The values are shown here with the default values from the code. If the values need to be adjusted they can be edited here.
