Holonomic Drive Controller
==========================
The holonomic drive controller is a trajectory tracker for robots with holonomic drivetrains (e.g. swerve, mecanum, etc.). This can be used to accurately track trajectories with correction for minor disturbances.

Constructing a Holonomic Drive Controller
-----------------------------------------
The holonomic drive controller should be instantiated with 2 PID controllers and 1 profiled PID controller.

.. note:: For more information on PID control, see :ref:`docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib`.

The 2 PID controllers are controllers that should correct for error in the field-relative x and y directions respectively. For example, if the first 2 arguments are ``PIDController(1, 0, 0)`` and ``PIDController(1.2, 0, 0)`` respectively, the holonomic drive controller will add an additional meter per second in the x direction for every meter of error in the x direction and will add an additional 1.2 meters per second in the y direction for every meter of error in the y direction.

The final parameter is a ``ProfiledPIDController`` for the rotation of the robot. Because the rotation dynamics of a holonomic drivetrain are decoupled from movement in the x and y directions, users can set custom heading references while following a trajectory. These heading references are profiled according to the parameters set in the ``ProfiledPIDController``.

.. tabs::
   .. code-tab:: java

      var controller = new HolonomicDriveController(
        new PIDController(1, 0, 0), new PIDController(1, 0, 0),
        new ProfiledPIDController(1, 0, 0,
          new TrapezoidProfile.Constraints(6.28, 3.14)));
      // Here, our rotation profile constraints were a max velocity
      // of 1 rotation per second and a max acceleration of 180 degrees
      // per second squared.

   .. code-tab:: c++

      frc::HolonomicDriveController controller{
        frc2::PIDController{1, 0, 0}, frc2::PIDController{1, 0, 0},
        frc::ProfiledPIDController<units::radian>{
          1, 0, 0, frc::TrapezoidProfile<units::radian>::Constraints{
            6.28_rad_per_s, 3.14_rad_per_s / 1_s}}};
      // Here, our rotation profile constraints were a max velocity
      // of 1 rotation per second and a max acceleration of 180 degrees
      // per second squared.

Getting Adjusted Velocities
---------------------------
The holonomic drive controller returns "adjusted velocities" such that when the robot tracks these velocities, it accurately reaches the goal point. The controller should be updated periodically with the new goal. The goal is comprised of a desired pose, linear velocity, and heading.

.. note:: The "goal pose" represents the position that the robot should be at a particular timestamp when tracking the trajectory. It does NOT represent the trajectory's endpoint.

The controller can be updated using the ``Calculate`` (C++) / ``calculate`` (Java) method. There are two overloads for this method. Both of these overloads accept the current robot position as the first parameter and the desired heading as the last parameter. For the middle parameters, one overload accepts the desired pose and the linear velocity reference while the other accepts a ``Trajectory.State`` object, which contains information about the goal pose. The latter method is preferred for tracking trajectories.

.. tabs::
   .. code-tab:: java

      // Sample the trajectory at 3.4 seconds from the beginning.
      Trajectory.State goal = trajectory.sample(3.4);

      // Get the adjusted speeds. Here, we want the robot to be facing
      // 70 degrees (in the field-relative coordinate system).
      ChassisSpeeds adjustedSpeeds = controller.calculate(
        currentRobotPose, goal, Rotation2d.fromDegrees(70.0));

   .. code-tab:: c++

      // Sample the trajectoty at 3.4 seconds from the beginning.
      const auto goal = trajectory.Sample(3.4_s);

      // Get the adjusted speeds. Here, we want the robot to be facing
      // 70 degrees (in the field-relative coordinate system).
      const auto adjustedSpeeds = controller.Calculate(
        currentRobotPose, goal, 70_deg);

Using the Adjusted Velocities
-----------------------------
The adjusted velocities are of type ``ChassisSpeeds``, which contains a ``vx`` (linear velocity in the forward direction), a ``vy`` (linear velocity in the sideways direction), and an ``omega`` (angular velocity around the center of the robot frame).

The returned adjusted speeds can be converted into usable speeds using the kinematics classes for your drivetrain type. In the example code below, we will assume a swerve drive robot; however, the kinematics code is exactly the same for a mecanum drive robot except using ``MecanumDriveKinematics``.

.. tabs::
   .. code-tab:: java

      SwerveModuleState[] moduleStates = kinematics.toSwerveModuleStates(adjustedSpeeds);

      SwerveModuleState frontLeft = moduleStates[0];
      SwerveModuleState frontRight = moduleStates[1];
      SwerveModuleState backLeft = moduleStates[2];
      SwerveModuleState backRight = moduleStates[3];

   .. code-tab:: c++

      auto [fl, fr, bl, br] = kinematics.ToSwerveModuleStates(adjustedSpeeds);

Because these swerve module states are still speeds and angles, you will need to use PID controllers to set these speeds and angles.
