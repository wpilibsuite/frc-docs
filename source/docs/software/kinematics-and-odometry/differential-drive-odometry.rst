Differential Drive Odometry
===========================
A user can use the differential drive kinematics classes in order to perform :ref:`odometry <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is odometry?>`. WPILib contains a ``DifferentialDriveOdometry`` class that can be used to track the position of a differential drive robot on the field.

.. note:: Because this method only uses encoders and a gyro, the estimate of the robot's position on the field will drift over time, especially as your robot comes into contact with other robots during gameplay. However, odometry is usually very accurate during the autonomous period.

Creating the Odometry Object
----------------------------
The ``DifferentialDriveOdometry`` class constructor requires three mandatory arguments and one optional argument. The mandatory arguments are:

* The angle reported by your gyroscope (as a ``Rotation2d``)
* The initial left and right encoder readings. In Java, these are each a ``double``, and must represent the distance traveled by each side in meters.  In C++, the :doc:`units library </docs/software/basic-programming/cpp-units>` must be used to represent your wheel positions.

The optional argument is the starting pose of your robot on the field (as a ``Pose2d``). By default, the robot will start at ``x = 0, y = 0, theta = 0``.

.. note:: 0 degrees / radians represents the robot angle when the robot is facing directly toward your opponent's alliance station. As your robot turns to the left, your gyroscope angle should increase. The ``Gyro`` interface supplies ``getRotation2d``/``GetRotation2d`` that you can use for this purpose. See :ref:`Field Coordinate System <docs/software/advanced-controls/geometry/coordinate-systems:Field Coordinate System>` for more information about the coordinate system.

.. tabs::

   .. code-tab:: java

      // Creating my odometry object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      DifferentialDriveOdometry m_odometry = new DifferentialDriveOdometry(
        m_gyro.getRotation2d(),
        m_leftEncoder.getDistance(), m_rightEncoder.getDistance(),
        new Pose2d(5.0, 13.5, new Rotation2d()));

   .. code-tab:: c++

      // Creating my odometry object. Here,
      // our starting pose is 5 meters along the long end of the field and in the
      // center of the field along the short end, facing forward.
      frc::DifferentialDriveOdometry m_odometry{
        m_gyro.GetRotation2d(),
        units::meter_t{m_leftEncoder.GetDistance()},
        units::meter_t{m_rightEncoder.GetDistance()},
        frc::Pose2d{5_m, 13.5_m, 0_rad}};


Updating the Robot Pose
-----------------------
The ``update`` method can be used to update the robot's position on the field. This method must be called periodically, preferably in the ``periodic()`` method of a :ref:`Subsystem <docs/software/commandbased/subsystems:Subsystems>`. The ``update`` method returns the new updated pose of the robot. This method takes in the gyro angle of the robot, along with the left encoder distance and right encoder distance.

.. note:: If the robot is moving forward in a straight line, **both** distances (left and right) must be increasing positively -- the rate of change must be positive.

.. tabs::

   .. code-tab:: java

      @Override
      public void periodic() {
        // Get the rotation of the robot from the gyro.
        var gyroAngle = m_gyro.getRotation2d();

        // Update the pose
        m_pose = m_odometry.update(gyroAngle,
          m_leftEncoder.getDistance(),
          m_rightEncoder.getDistance());
      }

   .. code-tab:: c++

      void Periodic() override {
        // Get the rotation of the robot from the gyro.
        frc::Rotation2d gyroAngle = m_gyro.GetRotation2d();

        // Update the pose
        m_pose = m_odometry.Update(gyroAngle,
          units::meter_t{m_leftEncoder.GetDistance()},
          units::meter_t{m_rightEncoder.GetDistance()});
      }

Resetting the Robot Pose
------------------------
The robot pose can be reset via the ``resetPosition`` method. This method accepts four arguments: the current gyro angle, the left and right wheel positions, and the new field-relative pose.

.. important:: If at any time, you decide to reset your gyroscope or encoders, the ``resetPosition`` method MUST be called with the new gyro angle and wheel distances.

.. note:: A full example of a differential drive robot with odometry is available here: `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/DifferentialDriveBot>`_ / `Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/differentialdrivebot>`_.

In addition, the ``GetPose`` (C++) / ``getPoseMeters`` (Java) methods can be used to retrieve the current robot pose without an update.
