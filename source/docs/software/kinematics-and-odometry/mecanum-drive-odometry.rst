Mecanum Drive Odometry
===========================
A user can use the mecanum drive kinematics classes in order to perform :ref:`odometry <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is odometry?>`. WPILib contains a ``MecanumDriveOdometry`` class that can be used to track the position of a mecanum drive robot on the field.

.. note:: Because this method only uses encoders and a gyro, the estimate of the robot's position on the field will drift over time, especially as your robot comes into contact with other robots during gameplay. However, odometry is usually very accurate during the autonomous period.

Creating the odometry object
----------------------------
The ``MecanumDriveOdometry`` class requires two mandatory arguments and one optional argument. The mandatory arguments are the kinematics object that represents your mecanum drive (in the form of a ``MecanumDriveKinematics`` class) and the angle reported by your gyroscope (as a Rotation2d). The third optional argument is the starting pose of your robot on the field (as a ``Pose2d``). By default, the robot will start at ``x = 0, y = 0, theta = 0``.

.. note:: 0 degrees / radians represents the robot angle when the robot is facing directly toward your opponent's alliance station. As your robot turns to the left, your gyroscope angle should increase. By default, WPILib gyros exhibit the opposite behavior, so you should negate the gyro angle.

.. tabs::

   .. code-tab:: java

      // Locations of the wheels relative to the robot center.
      Translation2d m_frontLeftLocation = new Translation2d(0.381, 0.381);
      Translation2d m_frontRightLocation = new Translation2d(0.381, -0.381);
      Translation2d m_backLeftLocation = new Translation2d(-0.381, 0.381);
      Translation2d m_backRightLocation = new Translation2d(-0.381, -0.381);

      // Creating my kinematics object using the wheel locations.
      MecanumDriveKinematics m_kinematics = new MecanumDriveKinematics(
        m_frontLeftLocation, m_frontRightLocation, m_backLeftLocation, m_backRightLocation
      );

      // Creating my odometry object from the kinematics object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      MecanumDriveOdometry m_odometry = new MecanumDriveOdometry(m_kinematics,
        getGyroHeading(), new Pose2d(5.0, 13.5, new Rotation2d());

   .. code-tab:: c++

      // Locations of the wheels relative to the robot center.
      frc::Translation2d m_frontLeftLocation{0.381_m, 0.381_m};
      frc::Translation2d m_frontRightLocation{0.381_m, -0.381_m};
      frc::Translation2d m_backLeftLocation{-0.381_m, 0.381_m};
      frc::Translation2d m_backRightLocation{-0.381_m, -0.381_m};

      // Creating my kinematics object using the wheel locations.
      frc::MecanumDriveKinematics m_kinematics{
        m_frontLeftLocation, m_frontRightLocation, m_backLeftLocation,
        m_backRightLocation};

      // Creating my odometry object from the kinematics object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      frc::MecanumDriveOdometry m_odometry{m_kinematics, GetGyroHeading(),
        frc::Pose2d{5_m, 13.5_m, 0_rad}};


Updating the robot pose
-----------------------
The ``update`` method of the odometry class updates the robot position on the field. The update method takes in the gyro angle of the robot, along with a ``MecanumDriveWheelSpeeds`` object representing the speed of each of the 4 wheels on the robot. This ``update`` method must be called periodically, preferably in the ``periodic()`` method of a :ref:`Subsystem <docs/software/commandbased/subsystems:Subsystems>`. The ``update`` method returns the new updated pose of the robot.

.. note:: The ``MecanumDriveWheelSpeeds`` class in Java must be constructed with each wheel speed in meters per second. In C++, the units library must be used to represent your wheel speeds.

.. tabs::

   .. code-tab:: java

      @Override
      public void periodic() {
        // Get my wheel speeds
        var wheelSpeeds = new MecanumDriveWheelSpeeds(
            m_frontLeftEncoder.getRate(), m_frontRightEncoder.getRate(),
            m_backLeftEncoder.getRate(), m_backRightEncoder.getRate());

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
         frc::MecanumDriveWheelSpeeds wheelSpeeds{
           units::meters_per_second_t(m_frontLeftEncoder.GetRate()),
           units::meters_per_second_t(m_frontRightEncoder.GetRate()),
           units::meters_per_second_t(m_backLeftEncoder.GetRate()),
           units::meters_per_second_t(m_backRightEncoder.GetRate())};

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

.. important:: If at any time, you decide to reset your gyroscope, the ``resetPose`` method MUST be called with the new gyro angle.

.. note:: A full example of a mecanum drive robot with odometry is available here: `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/MecanumBot>`_ / `Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mecanumbot>`_.

In addition, the ``GetPose`` (C++) / ``getPoseMeters`` (Java) methods can be used to retrieve the current robot pose without an update.
