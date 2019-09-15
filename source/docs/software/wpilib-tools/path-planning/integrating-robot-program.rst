Integrating path following into a robot program
===============================================

.. warning::
   **Known Issue**

   PathWeaver currently has a known issue. The left and right paths are being swapped. This will be fixed in the next release of PathWeaver. In the meantime, this can be corrected in the follower (what this article describes).  Once this update is published, the following fix will not be needed. The fix is as follows:

   Replace:

   .. code-block:: java

      Trajectory left_trajectory = PathfinderFRC.getTrajectory(k_path_name + ".left");
      Trajectory right_trajectory = PathfinderFRC.getTrajectory(k_path_name + ".right");

   With:

   .. code-block:: java

      Trajectory left_trajectory = PathfinderFRC.getTrajectory(k_path_name + ".right");
      Trajectory right_trajectory = PathfinderFRC.getTrajectory(k_path_name + ".left");

   Depending on the orientation of your gyro, you may also need to invert the desired heading with the following fix:

   .. code-block:: java

     double desired_heading = -Pathfinder.r2d(m_left_follower.getHeading());

Overview
--------
This article describes the process of writing a program that can use a stored path and have the robot follow it. The robot for this example is based on the TimedRobot template class and has left and right driven 4" wheels connected to motors with encoders on each side. In addition the robot has an Analog Gyro that is used to help make sure the robot hardware is keeping up with each generated point. The following code is heavily taken from `Jaci's Pathfinder's wiki <https://github.com/JacisNonsense/Pathfinder/wiki/Pathfinder-for-FRC---Java>`__. This is because the paths PathWeaver generates are Pathfinder paths and Pathfinder must be added as a `vendor dependency <https://imjac.in/dev/maven/frc/7194a2d4-2860-4bcc-86c0-97879737d875>`__.

Import Directives
-----------------
Each class in WPILib requires that an import declaration to help the compiler resolve the references to WPILib libraries and Pathfinder code included as a vendor library.

.. tabs::

   .. code-tab:: java

      package frc.robot;

      import java.io.IOException;

      import edu.wpi.first.wpilibj.AnalogGyro;
      import edu.wpi.first.wpilibj.Encoder;
      import edu.wpi.first.wpilibj.Notifier;
      import edu.wpi.first.wpilibj.Spark;
      import edu.wpi.first.wpilibj.SpeedController;
      import edu.wpi.first.wpilibj.TimedRobot;
      import jaci.pathfinder.Pathfinder;
      import jaci.pathfinder.PathfinderFRC;
      import jaci.pathfinder.Trajectory;
      import jaci.pathfinder.followers.EncoderFollower;

Start of program and constant declarations
------------------------------------------
The program is based on the TimedRobot class - a class where the appropriate initialization and periodic methods for each state (disabled, autonomous, test, and teleop) that the program could be in. For example, the teleopPeriodic() method is called periodically, every 20mS by default, and the same is true for autonomous, test, and disabled.

Symbolic constants are used throughout the program to name each one to match its purpose in the program. By grouping the constants together at the start of the module it makes it easier to see the assumptions the program is making where each is reflected as some constant value.

.. tabs::

   .. code-tab:: java

      public class Robot extends TimedRobot {
        private static final int k_ticks_per_rev = 1024;
        private static final double k_wheel_diameter = 4.0 / 12.0;
        private static final double k_max_velocity = 10;

        private static final int k_left_channel = 0;
        private static final int k_right_channel = 1;

        private static final int k_left_encoder_port_a = 0;
        private static final int k_left_encoder_port_b = 1;
        private static final int k_right_encoder_port_a = 2;
        private static final int k_right_encoder_port_b = 3;

        private static final int k_gyro_port = 0;

        private static final String k_path_name = "example";

Member variables used for the Robot class
-----------------------------------------
The Robot class (inherited from TimedRobot) contains the periodic methods. It also has a number of variables required for the Robot class.

.. tabs::

   .. code-tab:: java

        private SpeedController m_left_motor;
        private SpeedController m_right_motor;

        private Encoder m_left_encoder;
        private Encoder m_right_encoder;

        private AnalogGyro m_gyro;

        private EncoderFollower m_left_follower;
        private EncoderFollower m_right_follower;

        private Notifier m_follower_notifier;



**k_ticks_per_rev** - number of encoder counts per wheel revolution

**k_wheel_diameter** - diameter of the wheels in the units that was used in PathWeaver (feet in this example)

**k_max_velocity** - maximum velocity of the robot in units/sec (feet/sec in this example)

**k_left_channel, k_right_channel** - the port numbers for the left and right speed controllers

**k_left_encoder_port_a, k_left_encoder_port_b, k_right_encoder_port_a, k_right_encoder_port_b** - the port numbers for the encoders connected to the left and right side of the drivetrain

**k_gyro_port** - the analog input for the gyro (other gyros might be connected differently)

**k_path_name** - name of this path

Initialize the robot sensors and actuators
------------------------------------------

.. tabs::

   .. code-tab:: java

         @Override
         public void robotInit() {
           m_left_motor = new Spark(k_left_channel);
           m_right_motor = new Spark(k_right_channel);
           m_left_encoder = new Encoder(k_left_encoder_port_a, k_left_encoder_port_b);
           m_right_encoder = new Encoder(k_right_encoder_port_a, k_right_encoder_port_b);
           m_gyro = new AnalogGyro(k_gyro_port);
         }

Initialize the EncoderFollower objects
--------------------------------------
At the start of the autonomous period we do the following operations:

1. Create the trajectories for the left and right sides of the drivetrain. This will look for paths in the ``/home/lvuser/deploy/paths`` folder on the roboRIO. If you choose the output directory in PathWeaver (as shown in the previous instructions), PathWeaver will automatically place the paths in the proper folder. The full filename for the path is: ``/home/lvuser/deploy/paths/PathName.left.pf1.csv`` and ``/home/lvuser/deploy/paths/PathName.right.pf1.csv`` for the left and right paths.
2. Create encoder followers from the left and right  trajectories. The encoder followers compute the motor values based on where the robot is in the path.
3. Configure the encoders used by the followers with the number of counts per wheel revolution and diameter and PID constants to tune how fast the follower reacts to changes in velocity.
4. Create the notifier that will regularly call the ``followPath()`` method that computes the motor speeds and send them to the motors.

.. tabs::

   .. code-tab:: java

           @Override
           public void autonomousInit() {
             try {
               Trajectory left_trajectory = PathfinderFRC.getTrajectory(k_path_name + ".left");
               Trajectory right_trajectory = PathfinderFRC.getTrajectory(k_path_name + ".right");

               m_left_follower = new EncoderFollower(left_trajectory);
               m_right_follower = new EncoderFollower(right_trajectory);

               m_left_follower.configureEncoder(m_left_encoder.get(), k_ticks_per_rev, k_wheel_diameter);
               // You must tune the PID values on the following line!
               m_left_follower.configurePIDVA(1.0, 0.0, 0.0, 1 / k_max_velocity, 0);

               m_right_follower.configureEncoder(m_right_encoder.get(), k_ticks_per_rev, k_wheel_diameter);
               // You must tune the PID values on the following line!
               m_right_follower.configurePIDVA(1.0, 0.0, 0.0, 1 / k_max_velocity, 0);

               m_follower_notifier = new Notifier(this::followPath);
               m_follower_notifier.startPeriodic(left_trajectory.get(0).dt);
             }
             catch (IOException e) {
               e.printStackTrace()
             }
           }

Notifier method that actually drives the motors
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Each delta time (value programmed into the notifier in the previous code segment) get the current wheel speeds for the left and the right side. Use the predicted heading at each point and the actual robot heading from the gyro sensor. The difference between the actual and predicted heading is the heading error that is factored into the motor speed setting to help ensure the robot tracks the path direction.

.. tabs::

   .. code-tab:: java

           private void followPath() {
             if (m_left_follower.isFinished() || m_right_follower.isFinished()) {
               m_follower_notifier.stop();
             } else {
               double left_speed = m_left_follower.calculate(m_left_encoder.get());
               double right_speed = m_right_follower.calculate(m_right_encoder.get());
               double heading = m_gyro.getAngle();
               double desired_heading = Pathfinder.r2d(m_left_follower.getHeading());
               double heading_difference = Pathfinder.boundHalfDegrees(desired_heading - heading);
               double turn =  0.8 * (-1.0/80.0) * heading_difference;
               m_left_motor.set(left_speed + turn);
               m_right_motor.set(right_speed - turn);
             }
           }

           /**
            * This function is called periodically during autonomous.
            */
           @Override
           public void autonomousPeriodic() {
           }

Stop the motors at the start of the Teleop period
-------------------------------------------------
After the autonomous period ends and the teleop period begins, be sure to stop the notifier from running the followPath() method (above) and stop the motors in case they were still running.

.. tabs::

   .. code-tab:: java

         @Override
         public void teleopInit() {
           m_follower_notifier.stop();
           m_left_motor.set(0);
           m_right_motor.set(0);
        }
      }
