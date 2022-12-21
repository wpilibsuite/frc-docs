Swerve Drive Odometry
===========================
A user can use the swerve drive kinematics classes in order to perform :ref:`odometry <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is odometry?>`. WPILib contains a ``SwerveDriveOdometry`` class that can be used to track the position of a swerve drive robot on the field.

.. note:: Because this method only uses encoders and a gyro, the estimate of the robot's position on the field will drift over time, especially as your robot comes into contact with other robots during gameplay. However, odometry is usually very accurate during the autonomous period.

Creating the odometry object
----------------------------
The ``SwerveDriveOdometry<int NumModules>`` class constructor requires one template argument (only C++), three mandatory arguments, and one optional argument. The template argument (only C++) is an integer representing the number of swerve modules.

The mandatory arguments are:

* The kinematics object that represents your swerve drive (as a ``SwerveDriveKinematics`` instance)
* The angle reported by your gyroscope (as a ``Rotation2d``)
* The initial positions of the swerve modules (as an array of ``SwerveModulePosition``). In Java, this must be constructed with each wheel position in meters. In C++, the :doc:`units library </docs/software/basic-programming/cpp-units>` must be used to represent your wheel positions. It is important that the order in which you pass the ``SwerveModulePosition`` objects is the same as the order in which you created the kinematics object.

The fourth optional argument is the starting pose of your robot on the field (as a ``Pose2d``). By default, the robot will start at ``x = 0, y = 0, theta = 0``.

.. note:: 0 degrees / radians represents the robot angle when the robot is facing directly toward your opponent's alliance station. As your robot turns to the left, your gyroscope angle should increase. The ``Gyro`` interface supplies ``getRotation2d``/``GetRotation2d`` that you can use for this purpose. See :ref:`Field Coordinate System <docs/software/advanced-controls/geometry/coordinate-systems:Field Coordinate System>` for more information about the coordinate system.

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

      // Creating my odometry object from the kinematics object and the initial wheel positions.
      // Here, our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing the opposing alliance wall.
      SwerveDriveOdometry m_odometry = new SwerveDriveOdometry(
        m_kinematics, m_gyro.getRotation2d(),
        new SwerveModulePosition[] {
          m_frontLeftModule.getPosition(),
          m_frontRightModule.getPosition(),
          m_backLeftModule.getPosition(),
          m_backRightModule.getPosition()
        }, new Pose2d(5.0, 13.5, new Rotation2d()));

   .. code-tab:: c++

      // Locations for the swerve drive modules relative to the robot center.
      frc::Translation2d m_frontLeftLocation{0.381_m, 0.381_m};
      frc::Translation2d m_frontRightLocation{0.381_m, -0.381_m};
      frc::Translation2d m_backLeftLocation{-0.381_m, 0.381_m};
      frc::Translation2d m_backRightLocation{-0.381_m, -0.381_m};

      // Creating my kinematics object using the module locations.
      frc::SwerveDriveKinematics<4> m_kinematics{
        m_frontLeftLocation, m_frontRightLocation,
        m_backLeftLocation, m_backRightLocation
      };

      // Creating my odometry object from the kinematics object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      frc::SwerveDriveOdometry<4> m_odometry{m_kinematics, m_gyro.GetRotation2d(),
        {m_frontLeft.GetPosition(), m_frontRight.GetPosition(),
        m_backLeft.GetPosition(), m_backRight.GetPosition()},
        frc::Pose2d{5_m, 13.5_m, 0_rad}};


Updating the robot pose
-----------------------
The ``update`` method of the odometry class updates the robot position on the field. The update method takes in the gyro angle of the robot, along with an array of ``SwerveModulePosition`` objects. It is important that the order in which you pass the ``SwerveModulePosition`` objects is the same as the order in which you created the kinematics object.

This ``update`` method must be called periodically, preferably in the ``periodic()`` method of a :ref:`Subsystem <docs/software/commandbased/subsystems:Subsystems>`. The ``update`` method returns the new updated pose of the robot.

.. tabs::

   .. code-tab:: java

      @Override
      public void periodic() {
        // Get the rotation of the robot from the gyro.
        var gyroAngle = m_gyro.getRotation2d();

        // Update the pose
        m_pose = m_odometry.update(gyroAngle,
          new SwerveModulePosition[] {
            m_frontLeftModule.getPosition(), m_frontRightModule.getPosition(),
            m_backLeftModule.getPosition(), m_backRightModule.getPosition()
          });
      }

   .. code-tab:: c++

      void Periodic() override {
        // Get the rotation of the robot from the gyro.
        frc::Rotation2d gyroAngle = m_gyro.GetRotation2d();

        // Update the pose
        m_pose = m_odometry.Update(gyroAngle,
          {
            m_frontLeftModule.GetPosition(), m_frontRightModule.GetPosition(),
            m_backLeftModule.GetPosition(), m_backRightModule.GetPosition()
          };
      }

Resetting the Robot Pose
------------------------
The robot pose can be reset via the ``resetPosition`` method. This method accepts three arguments: the current gyro angle, an array of the current module positions (as in the constructor and update method), and the new field-relative pose.

.. important::  If at any time, you decide to reset your gyroscope or wheel encoders, the ``resetPosition`` method MUST be called with the new gyro angle and wheel encoder positions.

.. note:: The implementation of ``getPosition() / GetPosition()`` above is left to the user. The idea is to get the module position (distance and angle) from each module. For a full example, see here: `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/SwerveBot>`_ / `Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/swervebot>`_.

In addition, the ``GetPose`` (C++) / ``getPoseMeters`` (Java) methods can be used to retrieve the current robot pose without an update.
