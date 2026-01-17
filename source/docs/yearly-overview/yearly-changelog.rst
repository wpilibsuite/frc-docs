.. include:: <isonum.txt>

# New for 2026

A number of improvements have been made to FRC\ |reg| Control System software for 2026. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various [WPILib](https://github.com/wpilibsuite/) GitHub repositories.

It's recommended to also review the list of :doc:`known issues <known-issues>`.

## Importing Projects from Previous Years

Due to internal GradleRIO changes, it is necessary to update projects from previous years. After :doc:`Installing WPILib for 2026 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2025 projects must be :doc:`imported </docs/software/vscode-overview/importing-last-years-robot-code>` to be compatible.

## Major Changes (Java/C++)

.. note:: The WPILib team is heavily working on the 2027 Systemcore control system, and thus there are less changes for 2026 then in previous years.

Supported Operating Systems and Architectures:
 * Windows 10 & 11, 64 bit only. 32 bit and Arm are not supported
 * Ubuntu 22.04 & 24.04, 64 bit. Other Linux distributions with glibc >= 2.34 may work, but are unsupported
 * macOS 13.3 or higher, both Intel and Arm.

.. warning:: The following OSes are no longer supported: macOS 12 or earlier, Ubuntu 18.04 & 20.04, Windows 7, Windows 8.1, and any 32-bit Windows.

.. note:: [Windows 10 support from Microsoft ended in October 2025](https://www.microsoft.com/en-us/windows/end-of-support). We intend to continue supporting Windows 10 through the 2026 season, but may have to drop support in 2027. Teams should start planning their upgrade path to Windows 11.

## WPILib

### General Library

- Add ``Preferences.getNetworkTable()``
- Disambiguate HID Sendable names
- Add X44 and Minion to ``DCMotor``
- Add a few method overloads that use units
- Java: Add javac plugin for detecting common error cases at compile time
- 2026.2.1: Add 2026 Apriltag maps and field images

#### Commands

- Mark CommandPtr class as ``[[nodiscard]]``
- Deprecate ``Command.schedule()``, use ``CommandScheduler.getInstance().schedule(Command...)`` instead
- Add ``Subsystem.idle()``

#### NetworkTables

- Check id ranges in control messages

#### Data Logging

- Add superclass field & method logging to Epilogue
- Use reflection to access non-public superclass fields in Epilogue
- Optimize time and memory usage of epilogue backends
- Support logging of protobuf-serializable types with Epilogue

#### Hardware interfaces

- Remove Jaguar (and other) motor controllers [not legal for 2026](https://community.firstinspires.org/2025-robot-rules-preview-for-2026)

#### Math

- Upgrade to Eigen 5.0.0
- fix null pointer when calling ``TrapezoidProfile.timeLeftUntil``
- Fix Debouncer type-changing behavior
- Fix coordinate frame docs in ``HolonomicDriveController``
- Support dynamic matrix sizes in StateSpaceUtil
- Add dynamic size support for numerical jacobian computation
- Add dynamic size support for angle statistics
- Add ``nearest()`` method to ``Pose3d`` (mirroring ``Pose2d``)
- Add ``Translation3d.nearest()``
- Add ``copyDirectionPow`` to ``MathUtil`` for joystick input shaping
- Fix ``TrapezoidProfile`` limiting velocity incorrectly
- Add vector product and squared length operations to Translation2d/3d
- Add structs for TrapezoidProfile.State and ExponentialProfile.State
- Fix units overload resolution
- Add 2D variants of ``MathUtil.applyDeadband`` and ``MathUtil.copySignPow`` for circular joystick inputs
- Scale transforms instead of twists in PoseEstimator
- C++: Fix ``ElevatorSim::GetCurrentDraw()``
- Correct mil unit
- Add miles per hour conversion methods to ``Units.java``
- Fix ``ResetTranslation`` and ``ResetRotation`` in ``PoseEstimator`` and ``PoseEstimator3d`` causing the robot to teleport
- 2026.2.1: Fix Rotation3d interpolation and document extrinsic vs intrinsic
- 2025.2.1: Add multi tap boolean stream filter and multi tap trigger modifier (double tap detector)

### Simulation

### Romi/XRP

- XRP: Add support for new Sparkfun RP2350 board

### Java units

- Add InchesPerSecondPerSecond unit
- Rename ``AngularMomentumUnit.mult`` to ``per``

### CameraServer

- Fix USB video mode handling on macOS
- Add UVC Protocol Support for USB Camera Controls on macOS
- Fix memory leak in usbviewer example
- Resolve macOS camera freeze with specific devices

### Util

- Add nested struct schemas before parent schema
- C++: Add reverse iterators to ``wpi::circular_buffer`` and ``wpi::static_circular_buffer``, make other iterators bidirectional

## Shuffleboard

.. warning:: Shuffleboard is deprecated and will be removed for 2027 due to its lack of a maintainer and resource utilization issues. Users can find :doc:`additional modern dashboard options here </docs/software/dashboards/dashboard-intro>`

- Add deprecated message

## SmartDashboard

.. important:: SmartDashboard is not supported on Apple Silicon (Arm64) Macs.

.. warning:: SmartDashboard is deprecated and will be removed for 2027 due to its usage of Network Tables v3. Users can find :doc:`additional modern dashboard options here </docs/software/dashboards/dashboard-intro>`

- Add deprecated messsage

## Glass / OutlineViewer / Simulation GUI

- Fix NT int64 value display
- Add GUI context getter hooks

## GradleRIO

- Use processstarter for launching tools

## WPILib All in One Installer

- Update to VS Code 1.05.1
- VS Code extension updates: cpptools 1.23.2, javaext 1.38
- Ignore settings sync of settings/extensions
- Use processstarter for tools
- Show deprecated message on Windows 10
- Use unique icons for tools
- Fix platform detection for multiple vscode on apple silicon
- 2026.2.1: Catch download failures and show URL
- 2026.2.1: No longer install Python VS Code extensions

## Visual Studio Code Extension

- Disable java project manager dependency notification
- Use processstarter for launching tools
- Improve display name for WPILib extension settings
- Defer building code when vendor instructions shown
- Add more context to debugJNI flag in java gradle template
- Add deprecated message to standalone utility
- Fix blank window after installing dependency from local copy
- Import Romi and XRP vendordeps
- Hide the chat sidebar by default
- Hide recommended vscode extensions to install
- Move source backup in jar to backup directory and save more build files
- Check for WPILib project before running most commands
- 2026.2.1: Improve robustness of preferences file detection

## RobotBuilder

.. warning:: RobotBuilder is deprecated and will be removed for 2027 due to its declining usage and burden of updating for the 2027 control system.

- Remove Jaguar (and other) motor controllers [not legal for 2026](https://community.firstinspires.org/2025-robot-rules-preview-for-2026)

## SysId

- Remove Phoenix5 CANcoder preset
- 2026.2.1: Fix crash on partially empty raw data

## PathWeaver

.. warning:: PathWeaver is deprecated and will be removed for 2027. Users may find :doc:`Choreo </docs/software/pathplanning/choreo/index>` or [PathPlanner](https://github.com/mjansen4857/pathplanner) more useful. They both have an intuitive user interface and swerve support.

- No updates other than build updates were made to PathWeaver

## AdvantageScope

- Update to [2026 AdvantageScope](https://docs.advantagescope.org/whats-new)

## Elastic

- Update to 2026.0.0 Elastic. [2026.0.0-beta-1 changelog](https://github.com/Gold872/elastic-dashboard/releases/tag/v2026.0.0-beta-1) [2026.0.0 changelog](https://github.com/Gold872/elastic-dashboard/releases/tag/v2026.0.0)
- 2026.2.1: Upgraded to 2026.1.1 Elastic. [2026.1.1 changelog](https://github.com/Gold872/elastic-dashboard/releases/tag/v2026.1.1) [2026.1.0 changelog](https://github.com/Gold872/elastic-dashboard/releases/tag/v2026.1.0)

## WPIcal

- No updates other than build updates were made to WPIcal
