Mecanum Drive Odometry
===========================
A user can use the mecanum drive kinematics classes in order to perform :ref:`odometry <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is odometry?>`. WPILib contains a ``MecanumDriveOdometry`` class that can be used to track the position of a mecanum drive robot on the field.

.. note:: Because this method only uses encoders and a gyro, the estimate of the robot's position on the field will drift over time, especially as your robot comes into contact with other robots during gameplay. However, odometry is usually very accurate during the autonomous period.

Creating the odometry object
----------------------------
The ``MecanumDriveOdometry`` class constructor requires three mandatory arguments and one optional argument.

The mandatory arguments are:

* The kinematics object that represents your mecanum drive (as a ``MecanumDriveKinematics`` instance)
* The angle reported by your gyroscope (as a ``Rotation2d``)
* The initial positions of the wheels (as ``MecanumDriveWheelPositions``). In Java / Python, this must be constructed with each wheel position in meters. In C++, the :doc:`units library </docs/software/basic-programming/cpp-units>` must be used to represent your wheel positions.

The fourth optional argument is the starting pose of your robot on the field (as a ``Pose2d``). By default, the robot will start at ``x = 0, y = 0, theta = 0``.

.. note:: 0 degrees / radians represents the robot angle when the robot is facing directly toward your opponent's alliance station. As your robot turns to the left, your gyroscope angle should increase.  The ``Gyro`` interface supplies ``getRotation2d``/``GetRotation2d`` that you can use for this purpose. See :doc:`/docs/software/basic-programming/coordinate-system` for more information about the coordinate system.

.. tab-set-code::

   .. code-block:: java

      // Locations of the wheels relative to the robot center.
      Translation2d m_frontLeftLocation = new Translation2d(0.381, 0.381);
      Translation2d m_frontRightLocation = new Translation2d(0.381, -0.381);
      Translation2d m_backLeftLocation = new Translation2d(-0.381, 0.381);
      Translation2d m_backRightLocation = new Translation2d(-0.381, -0.381);

      // Creating my kinematics object using the wheel locations.
      MecanumDriveKinematics m_kinematics = new MecanumDriveKinematics(
        m_frontLeftLocation, m_frontRightLocation, m_backLeftLocation, m_backRightLocation
      );

      // Creating my odometry object from the kinematics object and the initial wheel positions.
      // Here, our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing the opposing alliance wall.
      MecanumDriveOdometry m_odometry = new MecanumDriveOdometry(
        m_kinematics,
        m_gyro.getRotation2d(),
        new MecanumDriveWheelPositions(
          m_frontLeftEncoder.getDistance(), m_frontRightEncoder.getDistance(),
          m_backLeftEncoder.getDistance(), m_backRightEncoder.getDistance()
        ),
        new Pose2d(5.0, 13.5, new Rotation2d())
      );

   .. code-block:: c++

      // Locations of the wheels relative to the robot center.
      frc::Translation2d m_frontLeftLocation{0.381_m, 0.381_m};
      frc::Translation2d m_frontRightLocation{0.381_m, -0.381_m};
      frc::Translation2d m_backLeftLocation{-0.381_m, 0.381_m};
      frc::Translation2d m_backRightLocation{-0.381_m, -0.381_m};

      // Creating my kinematics object using the wheel locations.
      frc::MecanumDriveKinematics m_kinematics{
        m_frontLeftLocation, m_frontRightLocation,
        m_backLeftLocation, m_backRightLocation
      };

      // Creating my odometry object from the kinematics object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      frc::MecanumDriveOdometry m_odometry{
        m_kinematics,
        m_gyro.GetRotation2d(),
        frc::MecanumDriveWheelPositions{
          units::meter_t{m_frontLeftEncoder.GetDistance()},
          units::meter_t{m_frontRightEncoder.GetDistance()},
          units::meter_t{m_backLeftEncoder.GetDistance()},
          units::meter_t{m_backRightEncoder.GetDistance()}
        },
        frc::Pose2d{5_m, 13.5_m, 0_rad}};

   .. code-block:: python

      from wpimath.geometry import Translation2d
      from wpimath.kinematics import MecanumDriveKinematics
      from wpimath.kinematics import MecanumDriveOdometry
      from wpimath.kinematics import MecanumDriveWheelPositions
      from wpimath.geometry import Pose2d
      from wpimath.geometry import Rotation2d

      # Locations of the wheels relative to the robot center.
      frontLeftLocation = Translation2d(0.381, 0.381)
      frontRightLocation = Translation2d(0.381, -0.381)
      backLeftLocation = Translation2d(-0.381, 0.381)
      backRightLocation = Translation2d(-0.381, -0.381)

      # Creating my kinematics object using the wheel locations.
      self.kinematics = MecanumDriveKinematics(
        frontLeftLocation, frontRightLocation, backLeftLocation, backRightLocation
      )

      # Creating my odometry object from the kinematics object and the initial wheel positions.
      # Here, our starting pose is 5 meters along the long end of the field and in the
      # center of the field along the short end, facing the opposing alliance wall.
      self.odometry = MecanumDriveOdometry(
        self.kinematics,
        self.gyro.getRotation2d(),
        MecanumDriveWheelPositions(
          self.frontLeftEncoder.getDistance(), self.frontRightEncoder.getDistance(),
          self.backLeftEncoder.getDistance(), self.backRightEncoder.getDistance()
        ),
        Pose2d(5.0, 13.5, Rotation2d())
      )

Updating the robot pose
-----------------------
The ``update`` method of the odometry class updates the robot position on the field. The update method takes in the gyro angle of the robot, along with a ``MecanumDriveWheelPositions`` object representing the position of each of the 4 wheels on the robot. This ``update`` method must be called periodically, preferably in the ``periodic()`` method of a :ref:`Subsystem <docs/software/commandbased/subsystems:Subsystems>`. The ``update`` method returns the new updated pose of the robot.

.. tab-set-code::

   .. code-block:: java

      @Override
      public void periodic() {
        // Get my wheel positions
        var wheelPositions = new MecanumDriveWheelPositions(
          m_frontLeftEncoder.getDistance(), m_frontRightEncoder.getDistance(),
          m_backLeftEncoder.getDistance(), m_backRightEncoder.getDistance());

        // Get the rotation of the robot from the gyro.
        var gyroAngle = m_gyro.getRotation2d();

        // Update the pose
        m_pose = m_odometry.update(gyroAngle, wheelPositions);
      }

   .. code-block:: c++

      void Periodic() override {
        // Get my wheel positions
        frc::MecanumDriveWheelPositions wheelPositions{
          units::meter_t{m_frontLeftEncoder.GetDistance()},
          units::meter_t{m_frontRightEncoder.GetDistance()},
          units::meter_t{m_backLeftEncoder.GetDistance()},
          units::meter_t{m_backRightEncoder.GetDistance()}};

        // Get the rotation of the robot from the gyro.
        frc::Rotation2d gyroAngle = m_gyro.GetRotation2d();

        // Update the pose
        m_pose = m_odometry.Update(gyroAngle, wheelPositions);
      }

   .. code-block:: python

      from wpimath.kinematics import MecanumDriveWheelPositions

      def periodic(self):
        # Get my wheel positions
        wheelPositions = MecanumDriveWheelPositions(
          self.frontLeftEncoder.getDistance(), self.frontRightEncoder.getDistance(),
          self.backLeftEncoder.getDistance(), self.backRightEncoder.getDistance())

        # Get the rotation of the robot from the gyro.
        gyroAngle = gyro.getRotation2d()

        # Update the pose
        self.pose = odometry.update(gyroAngle, wheelPositions)

Resetting the Robot Pose
------------------------
The robot pose can be reset via the ``resetPosition`` method. This method accepts three arguments: the current gyro angle, the current wheel positions, and the new field-relative pose.

.. important:: If at any time, you decide to reset your gyroscope or encoders, the ``resetPosition`` method MUST be called with the new gyro angle and wheel positions.

.. note:: A full example of a mecanum drive robot with odometry is available here: [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/MecanumBot) / [Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mecanumbot) / [Python](https://github.com/robotpy/examples/tree/main/MecanumBot)

In addition, the ``GetPose`` (C++) / ``getPoseMeters`` (Java / Python) methods can be used to retrieve the current robot pose without an update.
