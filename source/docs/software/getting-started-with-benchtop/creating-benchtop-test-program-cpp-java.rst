.. _creating_benchtop_test_cpp_java:

Creating your Benchtop Test Program (C++/Java)
==============================================

This article describes the Benchtop test example program

Creating a Project
------------------

Create a new Getting Started Example project. For more info about creating projects, see :ref:`docs/software/wpilib-overview/creating-robot-program:Creating a Robot Program`.

Imports/Includes
----------------
.. tabs::

    .. code-tab:: c++

        #include <frc/Joystick.h>
        #include <frc/PWMVictorSPX.h>
        #include <frc/TimedRobot.h>
        #include <frc/Timer.h>
        #include <frc/drive/DifferentialDrive.h>
        #include <frc/livewindow/LiveWindow.h>

    .. code-tab:: java

        import edu.wpi.first.wpilibj.Joystick;
        import edu.wpi.first.wpilibj.PWMVictorSPX;
        import edu.wpi.first.wpilibj.TimedRobot;
        import edu.wpi.first.wpilibj.Timer;
        import edu.wpi.first.wpilibj.drive.DifferentialDrive;

Our code needs to reference the components of WPILib that are used. In C++ this is accomplished using ``#include`` statements, in Java it is done with ``import`` statements. The program references classes for ``Joystick`` (for driving), ``PWMVictorSPX`` (for controlling motors), ``TimedRobot`` (the base class used for the example), ``Timer`` (used for autonomous), ``DifferentialDrive`` (for connecting the joystick control to the motors), and ``LiveWindow`` (C++ only).

Defining the variables for our sample robot
-------------------------------------------

.. tabs::

    .. code-tab:: c++

        class Robot : public frc::TimedRobot 
        { 
        public:  
            Robot() {    
                m_robotDrive.SetExpiration(0.1);    
                m_timer.Start();  
            }


        private:  
        // Robot drive system  
        frc::PWMVictorSPX m_left{0};  
        frc::PWMVictorSPX m_right{1};  
        frc::DifferentialDrive m_robotDrive{m_left, m_right};
        frc::Joystick m_stick{0};  
        frc::LiveWindow& m_lw = *frc::LiveWindow::GetInstance();  
        frc::Timer m_timer;
    
    .. code-tab:: java

        public class Robot extends TimedRobot {
        private final DifferentialDrive m_robotDrive = new DifferentialDrive(new PWMVictorSPX(0), new PWMVictorSPX(1));  
        private final Joystick m_stick = new Joystick(0);  
        private final Timer m_timer = new Timer();

The sample robot in our examples will have a joystick on USB port 0 for arcade drive and two motors on PWM ports 0 and 1. Here we create objects of type DifferentialDrive (m_robotDrive), Joystick (m_stick) and time (m_timer). This section of the code does three things:

1. Defines the variables as members of our Robot class.
2. Initializes the variables.

.. note:: The variable initializations for C++ are in the ``private`` section at the bottom of the program. This means they are private to the class (``Robot``). The C++ code also sets the Motor Safety expiration to 0.1 seconds (the drive will shut off if we don't give it a command every .1 seconds and starts the ``Timer`` used for autonomous.

Robot Initialization
--------------------

.. tabs::
    .. code-tab:: c++

        void RobotInit() {}
    
    .. code-tab:: java

          @Override
          public void robotInit() {}

The ``RobotInit`` method is run when the robot program is starting up, but after the constructor. The ``RobotInit`` for our sample program gets a pointer to the ``LiveWindow`` instance (this is used in the test method discussed below). This method is omitted from the code, meaning the default version will be run (if we wanted to run something here we could provide the code above to override the default).

Simple Autonomous Example
-------------------------

.. tabs::

    .. code-tab:: c++

        void AutonomousInit() override {
            m_timer.Reset();
            m_timer.Start();
        }

        void AutonomousPeriodic() override {
            // Drive for 2 seconds
            if (m_timer.Get() < 2.0) {
                // Drive forwards half speed
                m_robotDrive.ArcadeDrive(-0.5, 0.0);
            } else {
                // Stop robot
                m_robotDrive.ArcadeDrive(0.0, 0.0);
            }
        }
    
    .. code-tab:: java

        @Override
        public void autonomousInit() {
            m_timer.reset();
            m_timer.start();
        }

        @Override
        public void autonomousPeriodic() {
            // Drive for 2 seconds
            if (m_timer.get() < 2.0) {
                m_robotDrive.arcadeDrive(0.5, 0.0); // drive forwards half speed
            } else {
                m_robotDrive.stopMotor(); // stop robot
            }
        }

The ``AutonomousInit`` method is run once each time the robot transitions to autonomous from another mode. In this program, we reset the ``Timer`` and then start it in this method.

``AutonomousPeriodic`` is run once every period while the robot is in autonomous mode. In the ``TimedRobot`` class the period is a fixed time, which defaults to 20ms. In this example, the periodic code checks if the timer is less than 2 seconds and if so, drives forward at half speed using the ``ArcadeDrive`` method of the ``DifferentialDrive`` class. The value is negative for forward motion because of the convention for joysticks where a negative Y-axis value corresponds to moving the stick away from you (forward). If more than 2 seconds has elapsed, the code stops the robot drive.

Joystick Control for teleoperation
----------------------------------

.. tabs:: 

    .. code-tab:: c++

        void TeleopInit() override {}
        void TeleopPeriodic() override {
            // Drive with arcade style (use right stick)    
            m_robotDrive.ArcadeDrive(m_stick.GetY(), m_stick.GetX());  
        }

    .. code-tab:: java

        @Override
            public void teleopInit() {
        }

        @Override
            public void teleopPeriodic() {
            m_robotDrive.arcadeDrive(m_stick.getY(), m_stick.getX());
        }

Like in Autonomous, the Teleop mode has a ``TeleopInit`` and ``TeleopPeriodic`` function. In this example we don't have anything to do in ``TeleopInit``, it is provided for illustration purposes only. In ``TeleopPeriodic``, the code uses the ``ArcadeDrive`` method to map the Y-axis of the ``Joystick`` to forward/back motion of the drive motors and the X-axis to turning motion.

Test Mode
---------

.. tabs::

    .. code-tab:: c++
        
        void TestPeriodic() override {}

    .. code-tab:: java

        @Override
        public void testPeriodic() {}

Test Mode is used for testing robot functionality. Similar to ``TeleopInit``, the ``TestPeriodic`` is provided here for example.
