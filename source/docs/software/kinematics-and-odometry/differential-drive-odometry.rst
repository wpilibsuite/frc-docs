Differential Drive Odometry
===========================
A user can use the differential drive kinematics classes in order to perform :ref:`odometry <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is odometry?>`. WPILib contains a ``DifferentialDriveOdometry`` class that can be used to track the position of a differential drive robot on the field.

.. note:: Because this method only uses encoders and a gyro, the estimate of the robot's position on the field will drift over time, especially as your robot comes into contact with other robots during gameplay. However, odometry is usually very accurate during the autonomous period.

Creating the Odometry Object
----------------------------
The ``DifferentialDriveOdometry`` class requires two mandatory arguments and one optional argument. The mandatory arguments are the kinematics object that represents your differential drive (in the form of a ``DifferentialDriveKinematics`` class) and the angle reported by your gyroscope (as a Rotation2d). The third optional argument is the starting pose of your robot on the field (as a ``Pose2d``). By default, the robot will start at ``x = 0, y = 0, theta = 0``.

.. note:: 0 degrees / radians represents the robot angle when the robot is facing directly toward your opponent's alliance station. As your robot turns to the left, your gyroscope angle should increase. By default, WPILib gyros exhibit the opposite behavior, so you should negate the gyro angle.

.. tabs::

   .. code-tab:: java

      // Creating my kinematics object: differential drive with track width of 27 inches.
      DifferentialDriveKinematics m_kinematics = new DifferentialDriveKinematics(Units.inchesToMeters(27));

      // Creating my odometry object from the kinematics object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      DifferentialDriveOdometry m_odometry = new DifferentialDriveOdometry(m_kinematics,
        getGyroHeading(), new Pose2d(5.0, 13.5, new Rotation2d());

   .. code-tab:: c++

      // Creating my kinematics object: differential drive with track width of 27 inches.
      frc::DifferentialDriveKinematics m_kinematics{27_in};

      // Creating my odometry object from the kinematics object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      frc::DifferentialDriveOdometry m_odometry{m_kinematics, GetGyroHeading(),
        frc::Pose2d{5_m, 13.5_m, 0_rad}};


Updating the Robot Pose
-----------------------
There are two ways to update the robot pose using the ``DifferentialDriveOdometry`` class. One involves using encoder positions whereas the other method involves using encoder velocities. The method that uses encoder positions or distances is mathematically more robust and is more advantageous for teams that are using lower CPR encoders.

Both methods use overloads of the ``update`` method, which updates the robot position on the field. This method must be called periodically, preferably in the ``periodic()`` method of a :ref:`Subsystem <docs/software/commandbased/subsystems:Subsystems>`. The ``update`` method returns the new updated pose of the robot.

Updating the Robot Pose using Encoder Positions or Distances
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This ``update`` overload takes in the gyro angle of the robot, along with the left encoder distance and right encoder distance.

.. note:: The encoder distances in Java must be in meters. In C++, the units library can be used to represent the distance using any linear distance unit. If the robot is moving forward in a straight line, **both** distances (left and right) must be positive.

.. important:: The encoder positions must be reset to zero before constructing the ``DifferentialDriveOdometry`` class.

.. tabs::

   .. code-tab:: java

      @Override
      public void periodic() {
      // Get my gyro angle. We are negating the value because gyros return positive
      // values as the robot turns clockwise. This is not standard convention that is
      // used by the WPILib classes.
      var gyroAngle = Rotation2d.fromDegrees(-m_gyro.getAngle());

      // Update the pose
      m_pose = m_odometry.update(gyroAngle, m_leftEncoder.getDistance(), m_rightEncoder.getDistance());

   .. code-tab:: c++

      void Periodic() override {
        // Get my gyro angle. We are negating the value because gyros return positive
        // values as the robot turns clockwise. This is not standard convention that is
        // used by the WPILib classes.
        frc::Rotation2d gyroAngle{units::degree_t(-m_gyro.GetAngle())};

        // Update the pose
        m_pose = m_odometry.Update(gyroAngle, m_leftEncoder.GetDistance(), m_rightEncoder.GetDistance());
      }

Updating the Robot Pose using Encoder Velocities
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This ``update`` overload takes in the gyro angle of the robot, along with a ``DifferentialDriveWheelSpeeds`` object representing the left and right wheel speeds of the robot.

.. note:: The ``DifferentialDriveWheelSpeeds`` class in Java must be constructed with the left and right wheel speeds in meters per second. In C++, the units library must be used to represent your wheel speeds. If the robot is moving forward in a straight line, **both** velocities (left and right) must be positive.

.. tabs::

   .. code-tab:: java

      @Override
      public void periodic() {
        // Get my wheel speeds
        var wheelSpeeds = new DifferentialDriveWheelSpeeds(m_leftEncoder.getRate(), m_rightEncoder.getRate());

        // Get my gyro angle. We are negating the value because gyros return positive
        // values as the robot turns clockwise. This is not standard convention that is
        // used by the WPILib classes.
        var gyroAngle = Rotation2d.fromDegrees(-m_gyro.getAngle());

        // Update the pose
        m_pose = m_odometry.update(gyroAngle, wheelSpeeds);
      }

   .. code-tab:: c++

      void Periodic() override {
         // Get my wheel speeds
         frc::DifferentialDriveWheelSpeeds wheelSpeeds{
           units::meters_per_second_t(m_leftEncoder.GetRate()),
           units::meters_per_second_t(m_rightEncoder.GetRate())};

         // Get my gyro angle. We are negating the value because gyros return positive
         // values as the robot turns clockwise. This is not standard convention that is
         // used by the WPILib classes.
         frc::Rotation2d gyroAngle{units::degree_t(-m_gyro.GetAngle())};

         // Update the pose
         m_pose = m_odometry.Update(gyroAngle, wheelSpeeds);
       }

Resetting the Robot Pose
------------------------
The robot pose can be reset via the ``resetPose`` method. This method accepts two arguments -- the new field-relative pose and the current gyro angle.

.. important:: If at any time, you decide to reset your gyroscope, the ``resetPose`` method MUST be called with the new gyro angle. Furthermore, if the encoder distances method is being used, the encoders must also be reset to zero when resetting the pose.

.. note:: A full example of a differential drive robot with odometry is available here: `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/DifferentialDriveBot>`_ / `Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/differentialdrivebot>`_.

In addition, the ``GetPose`` (C++) / ``getPoseMeters`` (Java) methods can be used to retrieve the current robot pose without an update.
