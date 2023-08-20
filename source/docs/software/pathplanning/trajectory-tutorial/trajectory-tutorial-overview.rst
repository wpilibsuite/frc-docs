.. include:: <isonum.txt>

Trajectory Tutorial Overview
============================

.. todo:: add pathweaver stuff once it is available

.. note:: Before following this tutorial, it is helpful (but not strictly necessary) to have a baseline familiarity with WPILib's :ref:`PID control <docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib>`, :ref:`feedforward <docs/software/advanced-controls/controllers/feedforward:Feedforward Control in WPILib>`, and :ref:`trajectory <docs/software/advanced-controls/trajectories/index:Trajectory Generation and Following with WPILib>` features.

.. note:: The robot code in this tutorial uses the :ref:`command-based <docs/software/commandbased/what-is-command-based:What Is "Command-Based" Programming?>` framework.  The command-based framework is strongly recommended for beginning and intermediate teams.

The goal of this tutorial is to provide "end-to-end" instruction on implementing a trajectory-following autonomous routine for a differential-drive robot.  By following this tutorial, readers will learn how to:

1. Accurately characterize their robot's drivetrain to obtain accurate feedforward calculations and approximate feedback gains.
2. Configure a drive subsystem to track the robot's pose using WPILib's odometry library.
3. Generate a simple trajectory through a set of waypoints using WPILib's ``TrajectoryGenerator`` class.
4. Follow the generated trajectory in an autonomous routine using WPILib's ``RamseteCommand`` class with the calculated feedforward/feedback gains and pose.

This tutorial is intended to be approachable for teams without a great deal of programming expertise.  While the WPILib library offers significant flexibility in the manner in which its trajectory-following features are implemented, closely following the implementation outlined in this tutorial should provide teams with a relatively-simple, clean, and repeatable solution for autonomous movement.

The full robot code for this tutorial can be found in the RamseteCommand Example Project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/RamseteCommand>`__).

Why Trajectory Following?
-------------------------

FRC\ |reg| games often feature autonomous tasks that require a robot to effectively and accurately move from a known starting location to a known scoring location.  Historically, the most common solution for this sort of task in FRC has been a "drive-turn-drive" approach - that is, drive forward by a known distance, turn by a known angle, and drive forward by another known distance.

While the "drive-turn-drive" approach is certainly functional, in recent years teams have begun tracking smooth trajectories which require the robot to drive and turn at the same time.  While this is a fundamentally more-complicated technical task, it offers significant benefits: in particular, since the robot no longer has to stop to change directions, the paths can be driven much faster, allowing a robot to score more game pieces during the autonomous period.

Beginning in 2020, WPILib now supplies teams with working, advanced code solutions for trajectory generation and tracking, significantly lowering the "barrier-to-entry" for this kind of advanced and effective autonomous motion.

Required Equipment
------------------

To follow this tutorial, you will need ready access to the following materials:

1. A differential-drive robot (such as the `AndyMark AM14U5 <https://www.andymark.com/products/am14u5-6-wheel-drop-center-robot-drive-base-first-kit-of-parts-chassis>`__), equipped with:

  * Quadrature encoders for measuring the wheel rotation of each side of the drive.
  * A gyroscope for measuring robot heading.

2. A driver-station computer configured with:

  * :ref:`FRC Driver Station <docs/zero-to-robot/step-2/frc-game-tools:Installing the FRC Game Tools>`.
  * :ref:`WPILib <docs/zero-to-robot/step-2/wpilib-setup:WPILib Installation Guide>`.
  * :ref:`The System Identification Toolsuite <docs/software/pathplanning/system-identification/introduction:Installing the System Identification Tool>`.
