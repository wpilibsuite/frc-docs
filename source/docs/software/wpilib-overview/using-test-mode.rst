Using Test Mode
===============

Test mode is designed to enable programmers to have a place to put code to verify that all systems on the robot are functioning. In each of the robot program templates there is a place to add test code to the robot. If you use the TimedRobot template, or use command-based programming you can easily see the operation of all the motors and sensors through the LiveWindow.

Enabling Test Mode
------------------

Test mode on the robot can be enabled from the Driver Station just like autonomous or teleop. When in test mode, the ``testInit`` method is run once, and the testPeriodic method is run once per tick, in addition to ``robotPeriodic``, the same as teleop and autonomous control modes. To enable test mode in the Driver Station, select the "Test" button and enable the robot. The test mode code will then run.

Adding Test mode code to your robot code
----------------------------------------

Adding test mode can be as painless as calling your already written Teleop methods from Test. This will allow you to use the LiveWindow tuning features for classes such as PIDBase and PIDController, as well as PIDSubsystems and PIDCommands, to change PID constants and setpoints. Make sure to add your subsystems to SmartDashboard with the ``putData(subsystem)`` or ``PutData(subsystem)`` method.

.. tabs::

  .. code-tab:: java

      public class Robot extends TimedRobot {

          @Override
          public void robotInit() {
              SmartDashboard.putData(m_aSubsystem);
          }

          @Override
          public void testInit() {
              teleopInit();
          }

          @Override
          public void testPeriodic() {
              teleopPeriodic();
          }
      }

    .. code-tab:: c++

        void Robot::RobotInit() {
            SmartDashboard::PutData(m_aSubsystem);
        }

        void Robot::TestInit() {
            TestInit();
        }

        void Robot::TestPeriodic() {
            TeleopPeriodic();
        }

Test Mode in SmartDashboard
-------------------------------

The above sample code produces the following output when the Driver Station is put into Test mode then enabled. You can operate the motors by moving the sliders and read the values of sensors such as the wrist potentiometer.

Notice that the values are grouped by the subsystem names to group related actuators and sensors for easy testing. The subsystem names are suppled in the AddActuator() and AddSensor() method calls as shown in the code examples. This grouping, while not required, makes it much easier to test one subsystem at a time and have all the values next to each other on the screen.

Using Test Mode with the TimedRobot Template
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The TimedRobot template lends itself quite nicely to testing since it will periodically call the testPeriodic() method (or TestPeriodic() in C++) in your robot program. The testPeriodic() method will be called every 20ms and it is a good place to test commands or have LiveWindow update. The LiveWindow updating is built into the TimedRobot template so there is very little work to use LiveWindow.

.. note:: This works even if you are using the TimedRobot template and not doing Command-based programming.

In this example the sensors are registered with the LiveWindow and during the testPeriodic method, simply update all the values by calling the LiveWindow ``run()`` method. If your program is causing too much network traffic you can call the run method less frequently by, for example, only calling it every 5 updates for a 100ms update rate.

PID Tuning in Test Mode
-----------------------

Tuning PID loops is often a challenging prospect with frequent recompiles of the program to get the correct values. When using the command based programming model, subclassing PIDSubsystem or PIDCommand in your PID commands allows the adjustment of PID constants with immediate feedback of the results.
