Swerve Drive Odometry
===========================
A user can use the swerve drive kinematics classes in order to perform :ref:`odometry <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is odometry?>`. WPILib contains a ``SwerveDriveOdometry`` class that can be used to track the position of a swerve drive robot on the field.

.. note:: Because this method only uses encoders and a gyro, the estimate of the robot's position on the field will drift over time, especially as your robot comes into contact with other robots during gameplay. However, odometry is usually very accurate during the autonomous period.

Creating the odometry object
----------------------------
The ``SwerveDriveOdometry<int NumModules>`` class requires one template argument (only C++), two mandatory arguments, and one optional argument. The template argument (only C++) is an integer representing the number of swerve modules. The mandatory arguments are the kinematics object that represents your swerve drive (in the form of a ``SwerveDriveKinematics`` class) and the angle reported by your gyroscope (as a Rotation2d). The third optional argument is the starting pose of your robot on the field (as a ``Pose2d``). By default, the robot will start at ``x = 0, y = 0, theta = 0``.

.. note:: 0 degrees / radians represents the robot angle when the robot is facing directly toward your opponent's alliance station. As your robot turns to the left, your gyroscope angle should increase. By default, WPILib gyros exhibit the opposite behavior, so you should negate the gyro angle.

.. tabs::

   .. code-tab:: java

      // Locations for the swerve drive modules relative to the robot center.
      Translation2d m_frontLeftLocation = new Translation2d(0.381, 0.381);
      Translation2d m_frontRightLocation = new Translation2d(0.381, -0.381);
      Translation2d m_backLeftLocation = new Translation2d(-0.381, 0.381);
      Translation2d m_backRightLocation = new Translation2d(-0.381, -0.381);

      // Creating my kinematics object using the module locations
      SwerveDriveKinematics m_kinematics = new SwerveDriveKinematics(
        m_frontLeftLocation, m_frontRightLocation, m_backLeftLocation, m_backRightLocation
      );

      // Creating my odometry object from the kinematics object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      SwerveDriveOdometry m_odometry = new SwerveDriveOdometry(m_kinematics,
        getGyroHeading(), new Pose2d(5.0, 13.5, new Rotation2d());

   .. code-tab:: c++

      // Locations for the swerve drive modules relative to the robot center.
      frc::Translation2d m_frontLeftLocation{0.381_m, 0.381_m};
      frc::Translation2d m_frontRightLocation{0.381_m, -0.381_m};
      frc::Translation2d m_backLeftLocation{-0.381_m, 0.381_m};
      frc::Translation2d m_backRightLocation{-0.381_m, -0.381_m};

      // Creating my kinematics object using the module locations.
      frc::SwerveDriveKinematics<4> m_kinematics{
        m_frontLeftLocation, m_frontRightLocation, m_backLeftLocation,
        m_backRightLocation};

      // Creating my odometry object from the kinematics object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      frc::SwerveDriveOdometry<4> m_odometry{m_kinematics, GetGyroHeading(),
        frc::Pose2d{5_m, 13.5_m, 0_rad}};


Updating the robot pose
-----------------------
The ``update`` method of the odometry class updates the robot position on the field. The update method takes in the gyro angle of the robot, along with a series of module states (speeds and angles) in the form of a ``SwerveModuleState`` each. It is important that the order in which you pass the ``SwerveModuleState`` objects is the same as the order in which you created the kinematics object.

This ``update`` method must be called periodically, preferably in the ``periodic()`` method of a :ref:`Subsystem <docs/software/commandbased/subsystems:Subsystems>`. The ``update`` method returns the new updated pose of the robot.

.. tabs::

   .. code-tab:: java

      @Override
      public void periodic() {
        // Get my gyro angle. We are negating the value because gyros return positive
        // values as the robot turns clockwise. This is not standard convention that is
        // used by the WPILib classes.
        var gyroAngle = Rotation2d.fromDegrees(-m_gyro.getAngle());

        // Update the pose
        m_pose = m_odometry.update(gyroAngle, m_frontLeftModule.getState(), m_frontRightModule.getState(),
            m_backLeftModule.getState(), m_backRightModule.getState());
      }

   .. code-tab:: c++

      void Periodic() override {
         // Get my gyro angle. We are negating the value because gyros return positive
         // values as the robot turns clockwise. This is not standard convention that is
         // used by the WPILib classes.
         frc::Rotation2d gyroAngle{units::degree_t(-m_gyro.GetAngle())};

         // Update the pose
         m_pose = m_odometry.Update(gyroAngle, m_frontLeftModule.GetState(), m_frontRightModule.GetState(),
            m_backLeftModule.GetState(), m_backRightModule.GetState());
       }

Resetting the Robot Pose
------------------------
The robot pose can be reset via the ``resetPose`` method. This method accepts two arguments -- the new field-relative pose and the current gyro angle.

.. important:: If at any time, you decide to reset your gyroscope, the ``resetPose`` method MUST be called with the new gyro angle.

.. note:: The implementation of ``getState() / GetState()`` above is left to the user. The idea is to get the module state (speed and angle) from each module. For a full example, see here: `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/SwerveBot>`_ / `Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/swervebot>`_.

In addition, the ``GetPose`` (C++) / ``getPoseMeters`` (Java) methods can be used to retrieve the current robot pose without an update.
