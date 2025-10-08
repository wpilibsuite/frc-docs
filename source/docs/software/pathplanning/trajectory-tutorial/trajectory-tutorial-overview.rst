.. include:: <isonum.txt>

# Trajectory Tutorial Overview

.. warning:: The Ramsete Controller and RamseteCommand have been :term:`deprecated` and removed from WPILib. **Teams are strongly recommended to use third-party path planning tools** like `PathPlanner <https://pathplanner.dev/home.html>`__ or `Choreo <https://choreo.autos/>`__ instead of the built-in WPILib trajectory following.

This tutorial focuses on the **WPILib prerequisites** needed before using modern path planning tools. By following this tutorial, readers will learn how to:

1. Accurately characterize their robot's drivetrain to obtain accurate feedforward calculations.
2. Configure a drive subsystem to track the robot's pose using WPILib's odometry library.
3. Understand what robot capabilities are needed for path following.

Once you've completed the setup steps in this tutorial, you'll be ready to use a path planning tool for autonomous routines.

## Recommended Path Planning Tools

Modern FRC teams typically use one of these third-party tools for autonomous path planning:

**PathPlanner** (`pathplanner.dev <https://pathplanner.dev/home.html>`__)
  - Graphical path editor with Bézier curves
  - Built-in automatic pathfinding (AD* algorithm)
  - Event markers for triggering actions along paths
  - Hot-reload paths without redeploying code
  - Supports both differential and holonomic drivetrains
  - Uses PPLTVController (differential) or PPHolonomicDriveController (swerve)
  - See `PathPlanner Documentation <https://pathplanner.dev/pplib-getting-started.html>`__

**Choreo** (`choreo.autos <https://choreo.autos/>`__)
  - Time-optimized trajectory planning
  - Designed to maximize drivetrain performance
  - Graphical interface with real-time playback
  - Supports waypoints, constraints, and obstacles
  - Cross-platform (Windows, macOS, Linux)
  - Open source (BSD-3-Clause license)
  - See `Choreo Documentation <https://choreo.autos/>`__

Both tools handle trajectory generation and path following, allowing teams to focus on designing effective autonomous routines rather than implementing low-level control algorithms.

## Why Trajectory Following?

FRC\ |reg| games often feature autonomous tasks that require a robot to effectively and accurately move from a known starting location to a known scoring location.  Historically, the most common solution for this sort of task in FRC has been a "drive-turn-drive" approach - that is, drive forward by a known distance, turn by a known angle, and drive forward by another known distance.

While the "drive-turn-drive" approach is certainly functional, in recent years teams have begun tracking smooth trajectories which require the robot to drive and turn at the same time.  While this is a fundamentally more-complicated technical task, it offers significant benefits: in particular, since the robot no longer has to stop to change directions, the paths can be driven much faster, allowing a robot to score more game pieces during the autonomous period.

Beginning in 2020, WPILib now supplies teams with working, advanced code solutions for trajectory generation and tracking, significantly lowering the "barrier-to-entry" for this kind of advanced and effective autonomous motion.

## Prerequisites for Path Planning

To follow this tutorial and prepare your robot for path planning tools, you will need:

**Robot Hardware:**

1. A differential-drive robot (such as the [AndyMark AM14U5](https://www.andymark.com/products/am14u5-6-wheel-drop-center-robot-drive-base-first-kit-of-parts-chassis)), equipped with:

   * Quadrature encoders for measuring the wheel rotation of each side of the drive
   * A gyroscope for measuring robot heading (required for pose estimation)

**Software:**

2. A driver-station computer configured with:

   * :ref:`FRC Driver Station <docs/zero-to-robot/step-2/frc-game-tools:Installing the FRC Game Tools>`
   * :ref:`WPILib <docs/zero-to-robot/step-2/wpilib-setup:WPILib Installation Guide>`
   * :ref:`The System Identification Toolsuite <docs/software/advanced-controls/system-identification/introduction:Installing SysId>`

3. Your chosen path planning tool:

   * `PathPlanner <https://pathplanner.dev/home.html>`__ (available on Microsoft Store or GitHub)
   * `Choreo <https://choreo.autos/>`__ (cross-platform desktop application)

**Robot Code Requirements:**

After completing this tutorial, your drive subsystem will need these capabilities for PathPlanner/Choreo:

* ``getPose()`` - Returns current robot pose (x, y, heading)
* ``resetPose()`` - Resets odometry to a given pose
* ``getRobotRelativeSpeeds()`` or equivalent - Returns current chassis speeds
* ``driveRobotRelative()`` or equivalent - Drives using robot-relative chassis speeds

These methods are standard for any pose-tracking drive subsystem and will be covered in this tutorial.
