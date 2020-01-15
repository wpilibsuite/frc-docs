Transforming Trajectories
=========================
Trajectories can be transformed from one coordinate system to another using the ``transformBy`` and ``relativeTo`` methods. These are useful for converting field-oriented trajectories into a robot-relative trajectories and vice versa.

.. note:: It is recommended to always generate trajectories with waypoints relative to the field as opposed to waypoints relative to the current robot pose. However, in certain cases like aligning on-the-fly with Vision, it might be easier to generate a robot-relative trajectory and then transform it into a field-relative trajectory. Field-relative trajectories are recommended because they are easier to follow, as the robot pose via odometry is defined with respect to the field.

Transforming a Robot-Relative Trajectory into a Field-Relative Trajectory
-------------------------------------------------------------------------
The ``transformBy`` method can be used to transform a robot-relative trajectory into a field-relative trajectory. Doing so requires information about the field-relative robot pose, which can be obtained via :ref:`odometry <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is odometry?>`.

The ``transformBy`` method takes one argument: the transform that maps the starting pose of the robot-relative trajectory to the desired starting location on the field (as a ``Transform2d`` object). The transform can be obtained by subtracting the initial pose of the robot-relative trajectory (often zero) from the field-relative robot pose.

.. tabs::

   .. code-tab:: java

      // Get the robot pose.
      Pose2d robotPose = getPose();

      // Transform the robot-relative trajectory to a field-relative trajectory.
      // Here, we are subtracting an empty Pose2d from the current robot pose
      // because the robot-relative trajectory starts at (x = 0, y = 0, rotation = 0).
      Trajectory fieldRelativeTrajectory = robotRelativeTrajectory.transformBy(
        robotPose.minus(new Pose2d()));

   .. code-tab:: c++

      // Get the robot pose.
      frc::Pose2d robotPose = GetPose();

      // Transform the robot-relative trajectory to a field-relative trajectory.
      // Here, we are subtracting an empty Pose2d from the current robot pose
      // because the robot-relative trajectory starts at (x = 0, y = 0, rotation = 0).
      frc::Trajectory fieldRelativeTrajectory = robotRelativeTrajectory.TransformBy(
        robotPose - Pose2d());


Transforming a Field-Relative Trajectory into a Robot-Relative Trajectory
-------------------------------------------------------------------------
The ``relativeTo`` method can be used to transform a field-relative trajectory into a robot-relative trajectory. Doing so requires information about the field-relative robot pose, which can be obtained via :ref:`odometry <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is odometry?>`.

The ``relativeTo`` method takes one argument: the field-relative pose which represents the origin of the new coordinate system that you are transforming to. In other words, this represents the field-relative pose of the robot.

.. tabs::

   .. code-tab:: java

      // Get the robot pose.
      Pose2d robotPose = getPose();

      // Transform the field-relative trajectory into the robot's coordinate system.
      Trajectory robotRelativeTrajectory = fieldRelativeTrajectory.relativeTo(robotPose);

   .. code-tab:: c++

      // Get the robot pose.
      frc::Pose2d robotPose = GetPose();

      // Transform the field-relative trajectory into the robot's coordinate system.
      frc::Trajectory robotRelativeTrajectory = fieldRelativeTrajectory.RelativeTo(robotPose);

