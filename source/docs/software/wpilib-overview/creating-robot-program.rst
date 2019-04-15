Creating a Robot Program
========================

Once everything is installed, we're ready to create a robot program.  WPILib comes with several templates for robot programs.  Use of these templates is highly recommended for new users; however, advanced users are free to write their own robot code from scratch.

Choosing a Base Class
---------------------

To start a project using one of the WPILib robot program templates, users must first choose a base class for their robot.  Users subclass these base classes to create their primary :code:`Robot` class, which controls the main flow of the robot program.  There are three choices available for the base class:

TimedRobot
~~~~~~~~~~

Documentation:
`Java <http://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/TimedRobot.html>`__
- `C++ <http://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1TimedRobot.html>`__

Source:
`Java <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibj/src/main/java/edu/wpi/first/wpilibj/TimedRobot.java>`__
- `C++ <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibc/src/main/native/cpp/TimedRobot.cpp>`__

The :code:`TimedRobot` class is the the base class recommended for most users.  It provides control of the robot program through a collection of :code:`init()` and :code:`periodic()` methods, which are called by WPILib during specific robot states (e.g. autonomous or teleoperated).  By default, periodic methods are called every 20ms; this can be changed by overriding the :code:`getPeriod()` method.

.. tabs::

    .. code-tab:: c++

        #include <frc/TimedRobot.h>

        class Robot : public frc::TimedRobot {
            public:
                void RobotInit() override; // This is called once when the robot code initializes
                void RobotPeriodic() override; // This is called every period regardless of mode
                void AutonomousInit() override; // This is called once when the robot first enters autonomous mode
                void AutonomousPeriodic() override; // This is called periodically while the robot is in autonomous mode
                void TeleopInit() override; // This is called once when the robot first enters teleoperated mode
                void TeleopPeriodic() override; // This is called periodically while the robot is in teleopreated mode
                void TestInit() override; // This is called once when the robot enters test mode
                void TestPeriodic() override; // This is called periodically while the robot is in test mode
        };

    .. code-tab:: java

        import edu.wpi.first.wpilibj.TimedRobot;

        public class Robot extends TimedRobot {

            @Override
            public void robotInit() {
                // This is called once when the robot code initializes
            }

            @Override
            public void robotPeriodic() {
                // This is called every period regardless of mode
            }

            @Override
            public void autonomousInit() {
                // This is called once when the robot first enters autonomous mode
            }

            @Override
            public void autonomousPeriodic() {
                // This is called periodically while the robot is in autonomous mode
            }

            @Override
            public void teleopInit() {
                // This is called once when the robot first enters teleoperated mode
            }

            @Override
            public void teleopPeriodic() {
                // This is called periodically while the robot is in teleopreated mode
            }

            @Override
            public void testInit() {
                // This is called once when the robot enters test mode
            }

            @Override
            public void testPeriodic() {
                // This is called periodically while the robot is in test mode
            }

        }

IterativeRobotBase
~~~~~~~~~~~~~~~~~~

Documentation:
`Java <http://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/IterativeRobotBase.html>`__
- `C++ <http://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1IterativeRobotBase.html>`__

Source:
`Java <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibj/src/main/java/edu/wpi/first/wpilibj/IterativeRobotBase.java>`__
- `C++ <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibc/src/main/native/cpp/IterativeRobotBase.cpp>`__

This is identical to TimedRobot, except the main robot loop is not run automatically - users are required to implement it inside of the :code:`startCompetition()` method.  This gives more freedom for advanced users to handle the loop timing in different ways, but is also less-convenient.

Rather than checking the mode and calling the various :code:`init()` and :code:`periodic()` methods themselves, user implementations can simply call the :code:`loopFunc()` method from their main loop implementation.  However, the :code:`robotInit()` method must be called manually.

RobotBase
~~~~~~~~~

Documentation:
`Java <http://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/RobotBase.html>`__
- `C++ <http://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1RobotBase.html>`__

Source:
`Java <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibj/src/main/java/edu/wpi/first/wpilibj/RobotBase.java>`__
- `C++ <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibc/src/main/native/cpp/RobotBase.cpp>`__

The :code:`RobotBase` class is the most minimal base-class offered, and is generally not recommended for direct use.  No robot control flow is handled for the user; everything must be written from scratch inside the :code:`startCompetition()` method.