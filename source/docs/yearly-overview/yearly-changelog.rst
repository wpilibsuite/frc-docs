.. include:: <isonum.txt>

# New for 2027

The change from the roboRIO to Systemcore is the biggest control system update since the introduction of the cRIO. A number of improvements have been made to WPILib to take advantage of Systemcore. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various [WPILib](https://github.com/wpilibsuite/) GitHub repositories.

It's recommended to also review the list of :doc:`known issues <known-issues>`.

## Importing Projects from Previous Years

Due to internal GradleRIO changes, it is necessary to update projects from previous years. After :doc:`Installing WPILib for 2027 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2026 projects must be :doc:`imported </docs/software/vscode-overview/importing-last-years-robot-code>` to be compatible.

## Major Changes (Java/C++)

In order to more closly track C++ compiler feature support, the supported Linux distribution has changed to only the latest Ubuntu LTS. See :ref:`Supported Operating Systems and Architectures <docs/software/what-is-wpilib:Platform Support>` for more information.

.. note:: [Windows 10 support from Microsoft ended in October 2025](https://www.microsoft.com/en-us/windows/end-of-support). We intend to continue supporting Windows 10 through the 2026 season, but may have to drop support in 2027. Teams should start planning their upgrade path to Windows 11.

- Use Java 25 and C++ 23
- Add Commands v3 framework for Java. Documentation is in work. In the meantime, see the [Commands v3 Conference ](https://www.chiefdelphi.com/t/wpilib-commands-v3-championship-conference/519702), [Design Document](https://github.com/wpilibsuite/allwpilib/blob/2027/design-docs/commands-v3.md) and the port of the [Hatchbot example to Commands v3](https://github.com/wpilibsuite/allwpilib/tree/2027/wpilibjExamples/src/main/java/org/wpilib/examples/hatchbotcmdv3).
- Add OpMode framework, similar to FTC. Documentation is in progress. In the meantime, see the [OpModes Design Document](https://github.com/wpilibsuite/allwpilib/blob/2027/design-docs/opmodes.md) and the OpMode Robot template ([Java](https://github.com/wpilibsuite/allwpilib/tree/2027/wpilibjExamples/src/main/java/org/wpilib/templates/opmode) / [C++](https://github.com/wpilibsuite/allwpilib/tree/2027/wpilibcExamples/src/main/cpp/templates/opmode))
- Support for the [2027 FIRST Driver Station](https://wpilib.org/blog/the-2027-first-driver-station) bringing multi-platform support. 
- Reorganize java packages from ``edu.wpi.first`` to ``org.wpilib`` and c++ namespaces from ``frc::`` to ``wpi::``. The :doc:`VS Code importer </docs/software/vscode-overview/importing-last-years-robot-code>` will attempt to update code for these changes as part of the import process.
- Systemcore has different hardware support. Support multiple CAN buses, Smart IO, onboard IMU, Expansion Hub. Removed relay, analog output, SPI and SPI IMUs (ADIS16448, ADIS16470, ADXL345, ADXRS450), analog gyro, DMA, built-in accelerometer, Digital Glitch Filter, interrupts, counter, ultrasonic, analog trigger, Nidec Brushless, Servo, Jaguar
- Removed Network Tables v3 support
- Many of the simple examples were moved to snippets to de-clutter the VS Code examples. The snippets are available here: [Java](https://github.com/wpilibsuite/allwpilib/tree/2027/wpilibjExamples/src/main/java/org/wpilib/snippets) / [C++](https://github.com/wpilibsuite/allwpilib/tree/2027/wpilibcExamples/src/main/cpp/snippets). We're thinking of ways to make these easier to discover.

## WPILib

.. note:: As the 2026 and 2027 development happened in parallel, some of these changes are new to 2027 Alpha 5 compared to earlier alphas, but not new compared to 2026.

### General Library

- 2027 Alpha 2: Update POV to use enums
- 2027 Alpha 2: Use steady clock directly on Systemcore
- 2027 Alpha 5: Replace libprotobuf with upb for dynamic decode
- 2027 Alpha 5: Remove ``robotInit()``
- 2027 Alpha 5: Switch to use new DS available API from Mrccomm
- 2027 Alpha 5: Add a few unit overloads
- 2027 Alpha 5: Remove deprecated ``MotorControllerGroup``
- 2027 Alpha 5: Add Touchpad support
- 2027 Alpha 5: Remove ``MotorController::StopMotor()``
- 2027 Alpha 5: Switch to new game data
- 2027 Alpha 5: Make joystick unplugged warning better in cases of out of range axis/button
- 2027 Alpha 5: Preferences Listener should not depend on mutable fields
- 2027 Alpha 5: Replace Speeds with Velocities
- 2027 Alpha 5: Rename FPGA clock to monotonic clock
- 2027 Alpha 5: Rename constants to all caps style
- 2027 Alpha 5: Fix HSV to RGB conversion off-by-one error
- 2027 Alpha 5: Rename ``MotorController`` ``setDutyCycle()`` to ``setThrottle()``
- 2027 Alpha 5: Add FTC fields
- 2027 Alpha 5: Make swerve and differential kinematics functions immutable
- 2027 Alpha 5: Rename "Test" robot mode to "Utility"

#### Commands v2

- Remove RamseteCommand
- Remove control commands and subsystems
- 2027 Alpha 2: Deprecate ``Command.schedule()``
- 2027 Alpha 5: Remove ``Mecanum``/``SwerveControllerCommand``
- 2027 Alpha 5: Add ``Subsystem.idle()``
- 2027 Alpha 5: Fix ``WaitUntilCommand`` for match time counting down

#### Commands v3

- 2027 Alpha 5: Add ``CommandGamepad`` for V3 commands
- 2027 Alpha 5: Add compile-time checks for unsafe or incorrect coroutine usage

#### NetworkTables

- Remove NT3 support
- 2027 Alpha 2: Check id ranges in control messages
- 2027 Alpha 5: Handle interrupted save in NetworkServer
- 2027 Alpha 5: PubSubOption: Use record approach for Java
- 2027 Alpha 5: Prefix log levels to avoid macro conflicts

#### Data Logging

- 2027 Alpha 5: Use reflection to access non-public superclass fields
- 2027 Alpha 5: Optimize time and memory usage of epilogue backends
- 2027 Alpha 5: Support logging of protobuf-serializable types
- 2027 Alpha 5: Use full class names in static logger fields

#### Hardware interfaces

- Add SPARKmini to PWM support
- 2027 Alpha 2: Fix I2C order on Systemcore
- 2027 Alpha 2: Fix analog scaling for updated image
- 2027 Alpha 2: Add support for onboard IMU mount orientations with Euler angles
- 2027 Alpha 5: ``AddressableLED``: Restore alternative color order support
- 2027 Alpha 5: Integrate support for ExpansionHub over USB

#### Math

- Remove ``Rotation2d`` value field
- Fix ``SimpleFeedforward`` overload set
- Fix duplicate ``Rotation2d`` constructor
- Remove LUTs from LTV controllers
- Remove ``RamseteController`` and ``RamseteCommand``
- Use immutable member functions in ``ChassisSpeeds``
- Clean up arm and elevator feedforward APIs
- Remove PathWeaver support
- Fix ``SimpleMotorFeedforward`` no-accel overload returning negative voltage outputs
- 2027 Alpha 2: Fix ``TrapezoidProfile`` limiting velocity incorrectly
- 2027 Alpha 5: Remove redundant transposes on symmetric matrices
- 2027 Alpha 5: Add vector product and squared length operations to ``Translation2d``/``3d``
- 2027 Alpha 5: Remove ``Mecanum``/``SwerveControllerCommand``
- 2027 Alpha 5: Added structs for ``TrapezoidProfile.State`` and ``ExponentialProfile.State``
- 2027 Alpha 5: Replace ``Pose2``/``3d.exp(Twist2/3d)`` with ``Pose2``/``3d.plus(Twist2/3d.exp())`` to match math notation better
- 2027 Alpha 5:  Refactor ``MathUtil.interpolate()`` and ``MathUtil.inverseInterpolate()`` to handle extrapolation
- 2027 Alpha 5: Fix units overload resolution
- 2027 Alpha 5: Add 2D variants of ``MathUtil.applyDeadband`` and ``MathUtil.copySignPow`` for circular joystick inputs
- 2027 Alpha 5: Rename 1D ``copySignPow`` to match 2D ``copyDirectionPow``
- 2027 Alpha 5: Add Kraken X44 and Minion to ``DCMotor``
- 2027 Alpha 5: Scale transforms instead of twists in ``PoseEstimator``
- 2027 Alpha 5: Fix ``ElevatorSim::GetCurrentDraw()``
- 2027 Alpha 5: Add ``ChassisAccelerations`` and drivetrain accelerations classes, and add forward and inverse kinematics for accelerations to the interface
- 2027 Alpha 5: ``TrapezoidProfile.State`` implement ``StructSerializable``
- 2027 Alpha 5: Add multi-tap boolean stream filter and multi-tap trigger modifier (double-tap detector)
- 2027 Alpha 5: Speed up pose estimator correction computation
- 2027 Alpha 5: Add limit setters to ``SlewRateLimiter``
- 2027 Alpha 5: Implement ``Rotation3d`` interpolation as slerp instead of lerp
- 2027 Alpha 5: Don't clamp ``Rotation2d`` interpolation
- 2027 Alpha 5: Prevent ``CoordinateSystem`` from accepting left-handed systems
- 2027 Alpha 5: Make swerve and differential kinematics functions immutable
- 2027 Alpha 5: Mark all geometry classes as final

### Simulation

### Romi/XRP

2027 Alpha 5: Adding XRP Java and C++ examples for Timed Robot

### Java units

- 2027 Alpha 5: Make measure implementations immutable only
- 2027 Alpha 5: Rename `AngularMomentumUnit.mult` to `per`
- 2027 Alpha 5: Make RPM an alias of RotationsPerMinute
- 2027 Alpha 5: Fix incorrect magnitudes in some MutableMeasure mutations
- 2027 Alpha 5: Remove deprecated divide and negate functions

### CameraServer

- Remove Axis Camera

### Util

2027 Alpha 5: Add reverse iterators to ``wpi::circular_buffer`` and ``wpi::static_circular_buffer``, make other iterators bidirectional
2027 Alpha 5: Fix windows mDNS announcer long startup times
2027 Alpha 5: Fix ``uv_tcp_keepalive`` time
2027 Alpha 5: Remove ``CombinedRuntimeLoader``
2027 Alpha 5: Fix port having incorrect endian on Windows resolver
2027 Alpha 5: Rename ``CreateEvent`` and ``CreateSemaphore`` to Make
2027 Alpha 5: Change C++ json to jart/json.cpp
2027 Alpha 5: Change Java JSON to Avaje Jsonb
2027 Alpha 5: Use C++23 stacktrace library on WindowsS

## Glass / OutlineViewer / Simulation GUI

- 2027 Alpha 2: Fix NT int64 value display
- 2027 Alpha 5: NetworkTables: Show struct enum values
- 2027 Alpha 5: Fix handling for optionals and empty arrays
- 2027 Alpha 5: Fix color order for sim GUI LEDs
- 2027 Alpha 5: FMS: Fix reading past end of GSM buffer
- 2027 Alpha 5: Fix NT server mode
- 2027 Alpha 5: Add correct time for rebuilt
- 2027 Alpha 5: Update to SDL joystick mappings from 1-19-2026

## GradleRIO

- 2027 Alpha 5: Upgrade to Gradle 9.4.1
- 2027 Alpha 5: Add ZGC as a GC option and make it the default
- 2027 Alpha 5: Force encoding for written files to UTF-8
- 2027 Alpha 5: Add Avaje Jsonb and remove Jackson

## WPILib All in One Installer

- 2027 Alpha 2: Use unique icons for tools
- 2027 Alpha 5: Update to VS Code 1.116.0
- 2027 Alpha 5: VS Code extension updates: cpptools 1.31.4, javaext 1.54
- 2027 Alpha 5: Show deprecated message on Windows 10
- 2027 Alpha 5: Hide recommended vscode extensions to install
- 2027 Alpha 5: Hide the chat sidebar by default
- 2027 Alpha 5: Use unique strings for tool display vs executable names
- 2027 Alpha 5: Change installer to AOT, convert tools updater to AOT app
- 2027 Alpha 5: Catch download failures and show URL
- 2027 Alpha 5: Remove Python VS Code extensions
- 2027 Alpha 5: Improve error handling for 0 length downloads
- 2027 Alpha 5: Fix Windows CRLF line break in installer when creating Linux desktop files
- 2027 Alpha 5: Update to Avalonia 12

## Visual Studio Code Extension

Remove standalone utility
- 2027 Alpha 5: Improve RIOLog UI
- 2027 Alpha 5: Fix blank window after installing dependency from local copy
- 2027 Alpha 5: Remove unnecessary setting change commands
- 2027 Alpha 5: Support Commandsv3 vendordep
- 2027 Alpha 5: Move source backup in jar to backup directory
- 2027 Alpha 5: Set java project source/targetCompatibility to 25
- 2027 Alpha 5: Use shadow plugin to make shaded JARs
- 2027 Alpha 5: Port Java simulation canceling to C++
- 2027 Alpha 5: Move wpilibHome to the top of the plugin repository list

## SysId

- 2027 Alpha 5: Remove Phoenix5 CANcoder preset
- 2027 Alpha 5: Fix crash on partially empty raw data

## AdvantageScope

- 2027 Alpha 5: Use AdvantageScope 27.0.0-alpha-4

## Elastic

- 2027 Alpha 5: Use Elastic 2027.0.0-alpha7

## WPIcal

- 2027 Alpha 5: Use updated thirdparty-ceres and move resource files
- 2027 Alpha 5: Refactor to use WPILib libraries and modern C++ conventions and improve UX
- 2027 Alpha 5: Remove tag ID limit

## Shuffleboard

.. warning:: Shuffleboard has been removed for 2027 due to its lack of a maintainer and resource utilization issues. Users can find :doc:`additional modern dashboard options here </docs/software/dashboards/dashboard-intro>`


## SmartDashboard

.. warning:: SmartDashboard has been removed for 2027 due to its usage of Network Tables v3. Users can find :doc:`additional modern dashboard options here </docs/software/dashboards/dashboard-intro>`

## PathWeaver

.. warning:: PathWeaver has been removed for 2027. Users may find :doc:`Choreo </docs/software/pathplanning/choreo/index>` or [PathPlanner](https://github.com/mjansen4857/pathplanner) more useful. They both have an intuitive user interface and swerve support.


## RobotBuilder

.. warning:: RobotBuilder has been removed for 2027 due to its declining usage and burden of updating for the 2027 control system.
