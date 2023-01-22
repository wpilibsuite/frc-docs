.. include:: <isonum.txt>

New for 2023
============

A number of improvements have been made to FRC\ |reg| Control System software for 2023. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various `WPILib <https://github.com/wpilibsuite/>`__ GitHub repositories.

It's recommended to also review the list of :doc:`known issues <known-issues>`.

Importing Projects from Previous Years
--------------------------------------

Due to internal GradleRIO changes, it is necessary to update projects from previous years. After :doc:`Installing WPILib for 2023 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2022 projects must be :doc:`imported </docs/software/vscode-overview/importing-gradle-project>` to be compatible.

Major Changes (Java/C++)
------------------------

These changes contain *some* of the major changes to the library that it's important for the user to recognize. This does not include all of the breaking changes, see the other sections of this document for more changes.

- :doc:`NetworkTables </docs/software/networktables/networktables-intro>` has been completely rewritten as version 4.0. This introduces pub/sub semantics to NetworkTables and adds a number of new features, including timestamped updates. Its wire protocol is also now WebSockets-based for easier use by browser applications. While most of the changes should be transparent to users who don't use the new features, there are several breaking changes.
- Added support for :doc:`on-robot telemetry recording into data logs </docs/software/telemetry/datalog>`
- ``LiveWindow`` telemetry is now disabled by default. This has been observed as a consistent source of loop overruns. Use ``LiveWindow.enableAllTelemetry`` to restore the previous behavior
- :doc:`AprilTag </docs/software/vision-processing/apriltag/apriltag-intro>` library has been added
- Bundled Java version has been bumped to 17 from 11
- GCC 12.1 with C++ 20 support. Visual Studio 2022 is required for running C++ Simulation on Windows
- CameraServer now supports USB cameras on Mac operating systems

Supported Operating Systems and Architectures:
 * Windows 10 & 11, 64 bit. 32 bit and Arm are not supported
 * Ubuntu 22.04, 64 bit. Other Linux distributions with glibc >= 2.32 may work, but are unsupported
 * macOS 11 or later, Intel and Arm.

.. warning:: The following OSes are no longer supported: macOS 10.15, Ubuntu 18.04 & 20.04, Windows 7, Windows 8.1, and any 32-bit Windows.

WPILib
------

General Library
^^^^^^^^^^^^^^^

- Deprecated ``PerpetualCommand``/``perpetually()``, use ``RepeatCommand``/``repeatedly()`` instead
- Renamed ``withInterrupt(BooleanSupplier)`` to ``until()``
- Added ``InterpolatedTreeMap``
- Added ``RepeatCommand`` and matching ``repeatedly`` decorator
- Added ``unless(BooleanSupplier)`` decorator
- Added ``ignoringDisable(boolean)`` decorator to set the ``runsWhenDisabled`` property of a command
- Added ``finallyDo(BooleanConsumer)`` and ``handleInterrupt(Runnable)`` decorators
- Added static command factories in Commands
- Added ``ComputerVisionUtil``
- Added ``EventLoop`` and ``BooleanEvent``, an expansion of the existing Trigger framework encompassing non-commandbased
- Added ``BooleanEvent``-returning factory methods to the HID classes
- Added command-based versions of HID classes (``CommandXboxController`` etc.) with ``Trigger``-returning factory methods
- Added LTV unicycle controllers
- Added ``Rotation2d`` factory method that uses rotations and radians; ``fromRotations()`` and ``fromRadians()``
- ``HolonomicDriveController`` now uses continuous input on heading PID
- Added various 3d geometry classes

  - ``Pose3d``
  - ``Quaternion``
  - ``Rotation3d``
  - ``Transform3d``
  - ``Translation3d``
  - ``Twist3d``
  - ``CoordinateAxis``
  - ``CoordinateSystem``

- Added various pneumatic sim classes

  - ``CTREPCMSim``
  - ``DoubleSolenoidSim``
  - ``REVPHSim``
  - ``SolenoidSim``

- Added ``getAngle()`` to ``Translation2d``
- Deprecated ``Compressor.enable()``. Use ``isEnabled`` instead
- Add missing ``PS4Controller`` triangle methods
- Add method to disable LW actuator control in test mode

- Enhanced ``Sendable`` representation of commands
- Deprecated ``CommandGroupBase``; the static factories have been moved to ``Commands``
- Refactor SelectCommand's `Supplier<Command>` constructor and ProxyScheduleCommand into ProxyCommand
- Remove `isFinished` check for default commands
- Add method to remove default commands

- ``Trigger`` and ``Button`` methods were renamed to be consistent and ``Button`` class deprecated.

  - ``Trigger``'s bindings are changed to use ``True``/``False`` terminology, as it should be unambiguous. Each binding type has both ``True`` and ``False`` variants; for brevity, only the ``True`` variants are listed here:

    - ``onTrue`` (replaces ``whenActive`` and ``whenPressed``): schedule on rising edge.
    - ``whileTrue`` (replaces ``whileActiveOnce``): schedule on rising edge, cancel on falling edge.
    - ``toggleOnTrue`` (replaces ``toggleWhenActive``): on rising edge, schedule if unscheduled and cancel if scheduled.

  - Two binding types are completely deprecated:

    - ``cancelWhenActive``: this is a fairly niche use case which is better described as having the trigger's rising edge (``Trigger.rising()``) as an end condition for the command (using ``Command.until()``).
    - ``whileActiveContinuously``: however common, this relied on the no-op behavior of scheduling an already-scheduled command. The more correct way to repeat the command if it ends before the falling edge is using ``Command.repeatedly``/``RepeatCommand`` or a ``RunCommand`` -- the only difference is if the command is interrupted, but that is more likely to result in two commands perpetually canceling each other than achieve the desired behavior. Manually implementing a blindly-scheduling binding like ``whileActiveContinuously`` is still possible, though might not be intuitive.

- Precompile common template instantiations to improve C++ compile times.

Breaking Changes
^^^^^^^^^^^^^^^^

.. important:: The 2023 release no longer includes the old command-based framework. Users must refactor existing code to use the new :doc:`command-based framework </docs/software/commandbased/index>`

.. danger:: Updated ``DifferentialDrive`` and ``MecanumDrive`` classes to use North-West-Up axis conventions to match the rest of WPILib. The Z-axis (i.e. turning) will need to be inverted to restore the old behavior.

- NetworkTables 4.0 (NT4) introduced several breaking changes. Shuffleboard classes now return ``GenericEntry`` instead of ``NetworkTableEntry``; as ``GenericEntry`` provides nearly all the same methods, a simple textual replacement of the class name should suffice. Also, the ``force`` setters have been removed. See the :doc:`NT4 migration guide </docs/software/networktables/nt4-migration-guide>` for more information.
- Removed deprecated ``MakeMatrix()`` from ``StateSpaceUtil``
- Removed deprecated ``KilloughDrive`` class
- Removed ``Vector2d``, which was an implementation detail of MecanumDrive and KilloughDrive. In Java, use ``Vector<N2>`` (``edu.wpi.first.math.Vector``) or ``Translation2d`` (``edu.wpi.first.math.geometry.Translation2d``) instead. In C++, use ``Eigen::Vector2d`` from ``<Eigen/Core>`` or ``Translation2d`` from ``<frc/geometry/Translation2d.h>`` instead.
- Removed deprecated ``SpeedController`` and ``SpeedControllerGroup`` classes. Use MotorController and MotorControllerGroup instead
- Removed deprecated ``MatrixUtils`` class
- Removed various deprecated overloads that used above mentioned classes
- Removed various deprecated ``getInstance()`` functions. Static functions are available instead
- Removed various deprecated functions in ``SimDevice``
- Refactored command ``interruptible`` to be an enum property (``getInterruptionBehavior()``) of the command object rather than a boolean flag when scheduling; the ``withInterruptBehavior(InterruptBehavior)`` decorator can be used to set this property
- Command lifecycle methods of command groups cannot be overridden
- [C++ only] Command Decorators changed to return ``CommandPtr`` -- a new move-only value type for holding commands
- ``SwerveDriveOdometry`` and ``SwerveDrivePoseEstimator`` now use wheel distances instead of wheel speeds; Use ``SwerveModulePosition`` to represent a swerve module's angle and distance driven.
- ``SwerveDriveOdometry`` and ``SwerveDrivePoseEstimator`` now take in the wheel distances in an array rather than as a variadic parameter.
- ``MecanumDriveOdometry`` and ``MecanumDrivePoseEstimator`` now use wheel distances instead of wheel speeds; Use ``MecanumDriveWheelPositions`` to represent the wheel distances.
- Constructors and ``resetPosition`` methods on all odometry and pose estimation classes now have mandatory wheel distance parameters.
- Odometry and pose estimator constructor and function arguments have been rearranged to be consistent between implementations. Users should consult the API documentation for the particular class they're using and update the method calls accordingly.
- Removed wpi versions of C++20 methods

   - Use ``std::numbers`` instead of ``wpi::numbers`` (include ``<numbers>``)
   - Use ``std::span`` instead of ``wpi::span`` (include ``<span>``)

- Removed template argument from ``ElevatorFeedforward`` in C++.

Simulation
----------

- Added precision setting for NetworkTables decimal values
- Added docking support for GUI elements
- Save secondary Y axis in plots

Shuffleboard
------------

- Added vertical orientation option to number bar widget
- Fixed Field2d widget not auto populating
- Update PowerDistribution Widget to support 24 channels
- Added 2023 Charged Up field image
- Update PID widget to remove features no longer supported by PIDController (kF and enable)

SmartDashboard
--------------

.. important:: SmartDashboard is not supported on Apple Silicon (Arm64) Macs.

- Update PowerDistribution Widget to support 24 channels
- Add option to clear all plots
- Update PID widget to remove features no longer supported by PIDController (kF and enable)

Glass
-----

- Added precision setting for NetworkTables decimal values
- Added docking support for GUI elements
- Save secondary Y axis in plots

PathWeaver
----------

- Added 2023 Charged Up field image

GradleRIO
---------

- Upgrade to Gradle 7.5.1
- Fixed issue where start-up scripts could get damaged if roboRIO powered off during deploy

cscore
------

- Update to opencv 4.6.0
- Added ArUco module

OutlineViewer
-------------

- Added precision setting for NetworkTables decimal values

WPILib All in One Installer
---------------------------

- Apple Silicon (Arm64) Macs are now supported
- Update to VS Code 1.74
- Update to use .NET 7
- Add links to changelog and known issues

Visual Studio Code Extension
----------------------------

- Update templates to JUnit 5.8.2
- Add copy button from project versions dialog
- Allow importing Romi projects

RobotBuilder
------------

.. important:: With the removal of old command-based, the legacy RobotBuilder install has been removed.

.. warning:: Due to project file changes, Robotbuilder will not import yaml save files from 2022 or earlier.

- Add support for ``DoubleSupplier`` and ``std::function<double>`` parameters
- Add option to put commands tied to Joystick Buttons to SmartDashboard
- Add PS4 Controller
- Validate Team Number

SysID
-----

- Added Pigeon 2 support
- User can now specify a measurement delay of 0
- Fixed ``Override Units`` option not overriding units per rotations

Romi
----

- No major changes
