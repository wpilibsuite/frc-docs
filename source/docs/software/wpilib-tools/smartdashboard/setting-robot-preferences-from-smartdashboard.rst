Setting robot preferences from SmartDashboard
=============================================

The Robot Preferences class is used to store values in the flash memory on the roboRIO. The values might be for remembering preferences on the robot such as calibration settings for potentiometers, PID values, etc. that you would like to change without having to rebuild the program. The values can be viewed on the SmartDashboard and read and written by the robot program.

Sample program to reads and writes preference values
----------------------------------------------------

.. tabs::

    .. code-tab:: java

      public class Robot extends SampleRobot {

        Preferences prefs;

        double armUpPosition;
        double armDownPosition;

        public void robotInit() {
          prefs = Preferences.getInstance();
          armUpPosition = prefs.getDouble("ArmUpPosition", 1.0);
          armDownPosition = prefs.getDouble("ArmDownPosition", 4.);
        }
      }

    .. code-tab:: c++

      class Robot: public SampleRobot {

        Preferences *prefs;

        double armUpPosition;
        double armDownPosition;

        public void RobotInit() {
          prefs = Preferences::GetInstance();
          armUpPosition = prefs->GetDouble("ArmUpPosition", 1.0);
          armDownPosition = prefs->GetDouble("ArmDownPosition", 4.);
        }
      }

Often potentiometers are used to measure the angle of an arm or the position of some other shaft. In this case, the arm has two positions, ``ArmUpPosition`` and ``ArmDownPosition``. Usually programmers create constants in the program that are the two pot values that correspond to the positions of the arm. When the potentiometer needs to be replaced or adjusted then the program needs to be edited and reloaded onto the robot.

Rather than having "hard-coded" values in the program the potentiometer settings can be stored in the preferences file and read by the program when it starts. In this case the values are read on program startup in the ``robotInit()`` method. These values are automatically read from the preferences file stored in the roboRIO flash memory.

Displaying the Preferences widget in SmartDashboard
---------------------------------------------------

.. image:: images/setting-robot-preferences-from-smartdashboard/preferences-widget.png

In the SmartDashboard, the Preferences display can be added to the display revealing the contents of the preferences file stored in the roboRIO flash memory.

Viewing and editing the preference values
-----------------------------------------

.. image:: images/setting-robot-preferences-from-smartdashboard/view-edit-preferences-values.png

The values are shown here with the default values from the code. This was read from the robot through the NetworkTables interface built into SmartDashboard. If the values need to be adjusted they can be edited here and saved. The next time the robot program starts up the new values will be loaded in the ``robotInit()`` method. Each subsequent time the robot starts, the new values will be retrieved without having to edit and recompile/reload the robot program.
