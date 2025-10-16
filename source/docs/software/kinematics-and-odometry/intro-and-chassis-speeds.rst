# Introduction to Kinematics and The ChassisSpeeds Class

.. note:: Kinematics and odometry uses a common coordinate system. You may wish to reference the :doc:`/docs/software/basic-programming/coordinate-system` section for details.

## What is kinematics?

The kinematics suite contains classes for differential drive, swerve drive, and mecanum drive kinematics and odometry. The kinematics classes help convert between a universal ``ChassisSpeeds`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/math/kinematics/ChassisSpeeds.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/structfrc_1_1_chassis_speeds.html), :external:py:class:`Python <wpimath.kinematics.ChassisSpeeds>`)object, containing linear and angular velocities for a robot to usable speeds for each individual type of drivetrain i.e. left and right wheel speeds for a differential drive, four wheel speeds for a mecanum drive, or individual module states (speed and angle) for a swerve drive.

## What is odometry?
Odometry involves using sensors on the robot to create an estimate of the position of the robot on the field. In FRC, these sensors are typically several encoders (the exact number depends on the drive type) and a gyroscope to measure robot angle. The odometry classes utilize the kinematics classes along with periodic user inputs about speeds (and angles in the case of swerve) to create an estimate of the robot's location on the field.

## Why use kinematics and odometry?

Teams should use WPILib's kinematics and odometry classes for several important reasons:

### Enhanced Autonomous Performance

**Accurate path following**: Kinematics and odometry enable your robot to precisely follow complex paths during autonomous. Instead of time-based driving ("go forward for 2 seconds"), your robot can navigate to specific field coordinates and execute sophisticated multi-step autonomous routines.

**Position tracking**: Knowing where your robot is on the field allows you to:

- Drive to specific game pieces or scoring locations
- Dynamically adjust paths based on current position
- Create reliable autonomous routines that work consistently

**Self-correction**: Combined with vision systems (like AprilTag detection), odometry can be continuously updated to correct for drift and maintain accuracy throughout a match.

### Trajectory Generation and Following

Kinematics integrates with WPILib's trajectory generation to create smooth, dynamically-constrained paths:

- Generate realistic trajectories that respect your drivetrain's physical limits
- Follow paths with feedback control for disturbance rejection
- Combine with path planning tools like PathPlanner or Choreo

### Common Use Cases

**Autonomous routines**: Navigate to game pieces, score at specific locations, execute multi-step sequences

**Vision-assisted driving**: Use AprilTags or other vision targets to update odometry and drive to precise field locations

**Teleoperation enhancement**: Field-oriented control for intuitive driving of holonomic robots

**Match strategy**: Plan routes that avoid defense, optimize cycle times, coordinate with alliance partners

## Example Code

For drivetrain-specific implementation examples:

- **Differential Drive**: See the `CTRE Swerve & Swerve Drivetrain examples <https://github.com/CrossTheRoadElec/Phoenix6-Examples/tree/main/java>`__ which also include differential drive path following
- **Swerve Drive**:
  - `REV MAXSwerve Template <https://github.com/REVrobotics/MAXSwerve-Java-Template>`__ - Complete swerve template from REV Robotics
  - `YAGSL (Yet Another Generic Swerve Library) <https://github.com/BroncBotz3481/YAGSL>`__ - Vendor-agnostic swerve library
  - `CTRE Swerve examples <https://github.com/CrossTheRoadElec/Phoenix6-Examples/tree/main/java/SwerveWithPathPlanner>`__ - Swerve with PathPlanner integration
- **Mecanum Drive**: See mecanum-specific examples in vendor documentation

## Important considerations

**Odometry drift**: Position estimates accumulate error over time, especially during physical contact with other robots and field elements. This is normal and expected. Vision-based corrections (using AprilTags) help maintain accuracy.

**Sensor requirements**: All kinematics implementations require:
- Encoders for measuring wheel speeds
- Gyroscope for measuring robot angle (critical for accurate odometry)
- For swerve: absolute encoders for measuring module angles

**Mecanum odometry accuracy**: Mecanum drive odometry can be less accurate than differential or swerve due to wheel slipping. The accuracy depends on movement complexity, robot speed, and weight distribution. For improved accuracy, consider using dead wheels (omni wheels that don't provide drive power but only measure movement) or combining with vision-based corrections.

**Autonomous period accuracy**: Odometry is typically very accurate during autonomous (15 seconds) because there's less robot-to-robot contact. Estimates may drift more during the Teleoperated Period.

**Coordinate system**: WPILib uses a specific coordinate system. See :doc:`/docs/software/basic-programming/coordinate-system` for details.

## The ChassisSpeeds Class
The ``ChassisSpeeds`` object is essential to the new WPILib kinematics and odometry suite. The ``ChassisSpeeds`` object represents the speeds of a robot chassis. This struct has three components:

* ``vx``: The velocity of the robot in the x (forward) direction.
* ``vy``: The velocity of the robot in the y (sideways) direction. (Positive values mean the robot is moving to the left).
* ``omega``: The angular velocity of the robot in radians per second.

.. note:: A non-holonomic drivetrain (i.e. a drivetrain that cannot move sideways, ex: a differential drive) will have a ``vy`` component of zero because of its inability to move sideways.

## Constructing a ChassisSpeeds object
The constructor for the ``ChassisSpeeds`` object is very straightforward, accepting three arguments for ``vx``, ``vy``, and ``omega``. In Java and Python, ``vx`` and ``vy`` must be in meters per second. In C++, the units library may be used to provide a linear velocity using any linear velocity unit.

.. tab-set-code::

   ```java
   // The robot is moving at 3 meters per second forward, 2 meters
   // per second to the right, and rotating at half a rotation per
   // second counterclockwise.
   var speeds = new ChassisSpeeds(3.0, -2.0, Math.PI);
   ```

   ```c++
   // The robot is moving at 3 meters per second forward, 2 meters
   // per second to the right, and rotating at half a rotation per
   // second counterclockwise.
   frc::ChassisSpeeds speeds{3.0_mps, -2.0_mps,
     units::radians_per_second_t(std::numbers::pi)};
   ```

   ```python
   import math
   from wpimath.kinematics import ChassisSpeeds
   # The robot is moving at 3 meters per second forward, 2 meters
   # per second to the right, and rotating at half a rotation per
   # second counterclockwise.
   speeds = ChassisSpeeds(3.0, -2.0, math.pi)
      ```

## Creating a ChassisSpeeds Object from Field-Relative Speeds
A ``ChassisSpeeds`` object can also be created from a set of field-relative speeds when the robot angle is given. This converts a set of desired velocities relative to the field (for example, toward the opposite alliance station and toward the right field boundary) to a ``ChassisSpeeds`` object which represents speeds that are relative to the robot frame. This is useful for implementing field-oriented controls for a swerve or mecanum drive robot.

The static ``ChassisSpeeds.fromFieldRelativeSpeeds`` (Java / Python) / ``ChassisSpeeds::FromFieldRelativeSpeeds`` (C++) method can be used to generate the ``ChassisSpeeds`` object from field-relative speeds. This method accepts the ``vx`` (relative to the field), ``vy`` (relative to the field), ``omega``, and the robot angle.

.. tab-set-code::

   ```java
   // The desired field relative speed here is 2 meters per second
   // toward the opponent's alliance station wall, and 2 meters per
   // second toward the left field boundary. The desired rotation
   // is a quarter of a rotation per second counterclockwise. The current
   // robot angle is 45 degrees.
   ChassisSpeeds speeds = ChassisSpeeds.fromFieldRelativeSpeeds(
     2.0, 2.0, Math.PI / 2.0, Rotation2d.fromDegrees(45.0));
   ```

   ```c++
   // The desired field relative speed here is 2 meters per second
   // toward the opponent's alliance station wall, and 2 meters per
   // second toward the left field boundary. The desired rotation
   // is a quarter of a rotation per second counterclockwise. The current
   // robot angle is 45 degrees.
   frc::ChassisSpeeds speeds = frc::ChassisSpeeds::FromFieldRelativeSpeeds(
     2_mps, 2_mps, units::radians_per_second_t(std::numbers::pi / 2.0), Rotation2d(45_deg));
   ```

   ```python
   import math
   from wpimath.kinematics import ChassisSpeeds
   from wpimath.geometry  import Rotation2d
   # The desired field relative speed here is 2 meters per second
   # toward the opponent's alliance station wall, and 2 meters per
   # second toward the left field boundary. The desired rotation
   # is a quarter of a rotation per second counterclockwise. The current
   # robot angle is 45 degrees.
   speeds = ChassisSpeeds.fromFieldRelativeSpeeds(
     2.0, 2.0, math.pi / 2.0, Rotation2d.fromDegrees(45.0))
   ```

.. note:: The angular velocity is not explicitly stated to be "relative to the field" because the angular velocity is the same as measured from a field perspective or a robot perspective.
