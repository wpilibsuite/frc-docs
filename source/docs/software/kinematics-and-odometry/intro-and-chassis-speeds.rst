Introduction to Kinematics and The Chassis Speeds Class
==================================================================

What is kinematics?
-------------------
The brand new kinematics suite contains classes for differential drive, swerve drive, and mecanum drive kinematics and odometry. The kinematics classes help convert between a universal ``ChassisSpeeds`` object, containing linear and angular velocities for a robot to usable speeds for each individual type of drivetrain i.e. left and right wheel speeds for a differential drive, four wheel speeds for a mecanum drive, or individual module states (speed and angle) for a swerve drive.

What is odometry?
-----------------
Odometry involves using sensors on the robot to create an estimate of the position of the robot on the field. In FRC, these sensors are typically several encoders (the exact number depends on the drive type) and a gyroscope to measure robot angle. The odometry classes utilize the kinematics classes along with periodic user inputs about speeds (and angles in the case of swerve) to create an estimate of the robot's location on the field.

The Chassis Speeds Class
------------------------
The ``ChassisSpeeds`` object is essential to the new WPILib kinematics and odometry suite. The ``ChassisSpeeds`` object represents the speeds of a robot chassis. This struct has three components:

* ``vx``: The velocity of the robot in the x (forward) direction.
* ``vy``: The velocity of the robot in the y (sideways) direction. (Positive values mean the robot is moving to the left).
* ``omega``: The angular velocity of the robot in radians per second.

.. note:: A non-holonomic drivetrain (i.e. a drivetrain that cannot move sideways, ex: a differential drive) will have a ``vy`` component of zero because of its inability to move sideways.

Constructing a ChassisSpeeds object
-----------------------------------
The constructor for the ``ChassisSpeeds`` object is very straightforward, accepting three arguments for ``vx``, ``vy``, and ``omega``. In Java, ``vx`` and ``vy`` must be in meters per second. In C++, the units library may be used to provide a linear velocity using any linear velocity unit.

.. tabs::

   .. code-tab:: java

      // The robot is moving at 3 meters per second forward, 2 meters
      // per second to the right, and rotating at half a rotation per
      // second counterclockwise.
      var speeds = new ChassisSpeeds(3.0, -2.0, Math.PI);

   .. code-tab:: c++

      // The robot is moving at 3 meters per second forward, 2 meters
      // per second to the right, and rotating at half a rotation per
      // second counterclockwise.
      frc::ChassisSpeeds speeds{3.0_mps, -2.0_mps,
        units::radians_per_second_t(std::numbers::pi)};


Creating a ChassisSpeeds Object from Field-Relative Speeds
----------------------------------------------------------
A ``ChassisSpeeds`` object can also be created from a set of field-relative speeds when the robot angle is given. This converts a set of desired velocities relative to the field (for example, toward the opposite alliance station and toward the right field boundary) to a ``ChassisSpeeds`` object which represents speeds that are relative to the robot frame. This is useful for implementing field-oriented controls for a swerve or mecanum drive robot.

The static ``ChassisSpeeds.fromFieldRelativeSpeeds`` (Java) / ``ChassisSpeeds::FromFieldRelativeSpeeds`` (C++) method can be used to generate the ``ChassisSpeeds`` object from field-relative speeds. This method accepts the ``vx`` (relative to the field), ``vy`` (relative to the field), ``omega``, and the robot angle.

.. tabs::

   .. code-tab:: java

      // The desired field relative speed here is 2 meters per second
      // toward the opponent's alliance station wall, and 2 meters per
      // second toward the left field boundary. The desired rotation
      // is a quarter of a rotation per second counterclockwise. The current
      // robot angle is 45 degrees.
      ChassisSpeeds speeds = ChassisSpeeds.fromFieldRelativeSpeeds(
        2.0, 2.0, Math.PI / 2.0, Rotation2d.fromDegrees(45.0));

   .. code-tab:: c++

      // The desired field relative speed here is 2 meters per second
      // toward the opponent's alliance station wall, and 2 meters per
      // second toward the left field boundary. The desired rotation
      // is a quarter of a rotation per second counterclockwise. The current
      // robot angle is 45 degrees.
      frc::ChassisSpeeds speeds = frc::ChassisSpeeds::FromFieldRelativeSpeeds(
        2_mps, 2_mps, units::radians_per_second_t(std::numbers::pi / 2.0), Rotation2d(45_deg));

.. note:: The angular velocity is not explicitly stated to be "relative to the field" because the angular velocity is the same as measured from a field perspective or a robot perspective.
