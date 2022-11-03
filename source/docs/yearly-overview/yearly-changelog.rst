.. include:: <isonum.txt>

New for 2023
============

A number of improvements have been made to FRC\ |reg| Control System software for 2023. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various `WPILib <https://github.com/wpilibsuite/>`__ GitHub repositories.

Due to internal GradleRIO changes, it is necessary to update previous years projects. After :doc:`Installing WPILib for 2023 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2022 projects must be :doc:`imported </docs/software/vscode-overview/importing-gradle-project>` to be compatible.

It's recommended to also review the list of :doc:`known issues <known-issues>`.

Major Changes (Java/C++)
------------------------

These changes contain *some* of the major changes to the library that it's important for the user to recognize. This does not include all of the breaking changes, see the other sections of this document for more changes.

- ``LiveWindow`` telemetry is now disabled by default. This has been observed as a consistent source of loop overruns. Use ``LiveWindow.enableAllTelemetry`` to restore the previous behavior
- Bundled Java version has been bumped to 17 from 11
- GCC 12.1 with C++ 20 support. Visual Studio 2022 is required for running C++ Simulation on Windows

Supported Operating Systems and Architectures:
 * Windows 10 & 11, 64 bit. 32 bit and Arm are not supported
 * Ubuntu 22.04, 64 bit. Other Linux distributions with glibc >= 2.32 may work, but are unsupported
 * macOS 11 & 12, Intel and Arm.

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
- Added static factory methods for Command
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

- ``Trigger`` and ``Button`` methods were renamed to be consistent and ``Button`` class deprecated.

  - ``Trigger``'s bindings are changed to use ``True``/``False`` terminology, as it should be unambiguous. Each binding type has both ``True`` and ``False`` variants; for brevity, only the ``True`` variants are listed here:

    - ``onTrue`` (replaces ``whenActive`` and ``whenPressed``): schedule on rising edge.
    - ``whileTrue`` (replaces ``whileActiveOnce``): schedule on rising edge, cancel on falling edge.
    - ``toggleOnTrue`` (replaces ``toggleWhenActive``): on rising edge, schedule if unscheduled and cancel if scheduled.

  - Two binding types are completely deprecated:

    - ``cancelWhenActive``: this is a fairly niche use case which is better described as having the trigger's rising edge (``Trigger.rising()``) as an end condition for the command (using ``Command.until()``).
    - ``whileActiveContinuously``: however common, this relied on the no-op behavior of scheduling an already-scheduled command. The more correct way to repeat the command if it ends before the falling edge is using ``Command.repeatedly``/``RepeatCommand`` or a ``RunCommand`` -- the only difference is if the command is interrupted, but that is more likely to result in two commands perpetually canceling each other than achieve the desired behavior. Manually implementing a blindly-scheduling binding like ``whileActiveContinuously`` is still possible, though might not be intuitive.

Breaking Changes
^^^^^^^^^^^^^^^^

.. important:: The 2023 release no longer includes the old command-based framework. Users must refactor existing code to use the new :doc:`command-based framework </docs/software/commandbased/index>`

.. danger:: Updated ``DifferentialDrive`` and ``MecanumDrive`` classes to use North-West-Up axis conventions to match the rest of WPILib. The Z-axis (i.e. turning) will need to be inverted to restore the old behavior.

- Removed deprecated ``MakeMatrix()`` from ``StateSpaceUtil``
- Removed deprecated ``CameraServer`` class
- Removed deprecated ``KilloughDrive`` class
- Removed deprecated ``SpeedController`` and ``SpeedControllerGroup`` classes. Use MotorController and MotorControllerGroup instead
- Removed deprecated ``MatrixUtils`` class
- Removed various deprecated overloads that used above mentioned classes
- Removed various deprecated ``getInstance()`` functions. Static functions are available instead
- Removed various deprecated functions in ``SimDevice``
- Refactored command ``interruptible`` to be an enum property (``getInterruptionBehavior()``) of the command object rather than a boolean flag when scheduling; the ``withInterruptBehavior(InterruptBehavior)`` decorator can be used to set this property
- Command lifecycle methods of command groups cannot be overridden
- [C++ only] Command Decorators changed to return ``CommandPtr`` -- a new move-only value type for holding commands

Simulation
----------

- Added precision setting for NetworkTables decimal values
- Added docking support for GUI elements

Shuffleboard
------------

- Added vertical orientation option to number bar widget
- Fixed Field2d widget not auto populating

SmartDashboard
--------------

.. important:: SmartDashboard is not supported on M1 macOS.

- No new changes

Glass
-----

- Added precision setting for NetworkTables decimal values
- Added docking support for GUI elements

PathWeaver
----------

- No new changes

GradleRIO
---------

- Upgrade to Gradle 7.5.1

cscore
------

- Update to opencv 4.6.0

OutlineViewer
-------------

- Added precision setting for NetworkTables decimal values

WPILib All in One Installer
---------------------------

- M1 macOS is now supported
- Update to VS Code 1.72

Visual Studio Code Extension
----------------------------

RobotBuilder
------------

.. important:: With the removal of old command-based, the legacy RobotBuilder install has been removed.

- Add support for ``DoubleSupplier`` and ``std::function<double>`` parameters
- Add option to put commands tied to Joystick Buttons to SmartDashboard

SysID
-----

.. important:: SysID is not included with Beta 1. It is planned for future betas.

- Added Pigeon 2 support
- User can now specify a measurement delay of 0
- Fixed ``Override Units`` option not overriding units per rotations

Romi
----

- No major changes
