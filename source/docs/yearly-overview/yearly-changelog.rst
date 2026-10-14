.. include:: <isonum.txt>

# New for 2027

The change from the roboRIO to Systemcore is the biggest control system update since the introduction of the cRIO. A number of improvements have been made to WPILib to take advantage of Systemcore. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various [WPILib](https://github.com/wpilibsuite/) GitHub repositories. There's more information about Systemcore in the :doc:`/docs/software/systemcore-info/systemcore-introduction`.

It's recommended to also review the list of :doc:`known issues <known-issues>`.

## Importing Projects from Previous Years

Due to internal GradleRIO changes, it is necessary to update projects from previous years. After :doc:`Installing WPILib for 2027 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2026 projects must be :doc:`imported </docs/software/vscode-overview/importing-last-years-robot-code>` to be compatible.

## Major Changes (Java/C++/Python)

In order to more closly track C++ compiler feature support, the supported Linux distribution has changed to only the latest Ubuntu LTS. See :ref:`Supported Operating Systems and Architectures <docs/software/what-is-wpilib:Platform Support>` for more information.

.. warning:: [Windows 10 support from Microsoft ended in October 2025](https://www.microsoft.com/en-us/windows/end-of-support). While we will not explicitly block Windows 10 from being used, future releases may inadvertently break compatibility with Windows 10. We will not postpone these changes in order to maintain Windows 10 compatibility, and Windows 10 support may break as a result.

- Use Java 25 and C++ 23. Visual Studio 2026 on Windows and GCC 14.x on Linux are required for C++ teams for simulation.
- Alpha 5: Add Commands v3 framework for Java. Documentation is in work. In the meantime, see the [Commands v3 Conference](https://www.chiefdelphi.com/t/wpilib-commands-v3-championship-conference/519702), [Design Document](https://github.com/wpilibsuite/allwpilib/blob/main/design-docs/commands-v3.md) and the port of the [Hatchbot example to Commands v3](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/org/wpilib/examples/hatchbotcmdv3).
- Alpha 5: Add OpMode framework, similar to FTC. See :doc:`/docs/software/basic-programming/opmodes` for documentation.
- Alpha 6: Support for the [2027 FIRST Driver Station](https://wpilib.org/blog/the-2027-first-driver-station) bringing multi-platform support.
- Alpha 5: Reorganize java packages from ``edu.wpi.first`` to ``org.wpilib`` and c++ namespaces from ``frc::`` to ``wpi::`` and create new subpackages for better organization. The :doc:`VS Code importer </docs/software/vscode-overview/importing-last-years-robot-code>` will attempt to update code for these changes as part of the import process.
- Alpha 2: Systemcore has different hardware support. Support multiple CAN buses, Smart IO, onboard IMU, Expansion Hub. Removed relay, analog output, SPI and SPI IMUs (ADIS16448, ADIS16470, ADXL345, ADXRS450), analog gyro, DMA, built-in accelerometer, Digital Glitch Filter, interrupts, counter, ultrasonic, analog trigger, Nidec Brushless, Servo, Jaguar
- Alpha 2: Removed Network Tables v3 support. See the :doc:`Network Tables v4 migration guide </docs/software/networktables/nt4-migration-guide>` for details on how to update your code from Network Tables v3 to v4. Users of pynetworktables will need to update to pyntcore.
- Alpha 6: Python functions and variables have been renamed to use snake_case instead of camelCase for consistency with Python naming conventions.
- Alpha 6: Many of the simple examples were moved to snippets to de-clutter the VS Code examples. The snippets are available here: [Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/org/wpilib/snippets) / [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/snippets). We're thinking of ways to make these easier to discover.
- Alpha 7: SmartDashboard, SendableChooser, and Sendable APIs have been replaced with Telemetry and Tunables APIs.  The new version of SendableChooser is called Selectable.  While wpilib-docs has not yet been updated, API documentation and initial migration guides from the 2026 APIs are available for [telemetry](https://github.com/wpilibsuite/allwpilib/blob/main/telemetry/doc/telemetry.md#migration-from-wpilib-2026) and [tunables](https://github.com/wpilibsuite/allwpilib/blob/main/tunables/doc/tunables.md#migration-from-wpilib-2026)
- Alpha 7: All constants (including enumerated values) have been changed to ALL_CAPS style
- Alpha 7: Catch2 is now the default test framework for C++ (instead of GoogleTest)
- The WPILib AprilTag and CameraServer libraries have been moved to vendordeps. ``AprilTagFields`` is now part of an integrated ``Fields`` class

## WPILib

.. note:: As the 2026 and 2027 development happened in parallel, some of these changes are new to 2027 Alpha 5 compared to earlier alphas, but not new compared to 2026.

### General Library

- 2027 Alpha 2: Update POV to use enums
- 2027 Alpha 2: Use steady clock directly on Systemcore
- 2027 Alpha 5: Replace libprotobuf with upb for dynamic decode
- 2027 Alpha 5: Remove ``robotInit()``. Use the ``Robot()`` constructor instead.
- 2027 Alpha 5: Add a few unit overloads
- 2027 Alpha 5: Remove deprecated ``MotorControllerGroup``
- 2027 Alpha 5: Replace individual gamepad classes (e.g. ``XboxController``, ``PS4Controller``, ``PS5Controller``, ``StadiaController``) with a single ``Gamepad`` class. Alpha 7 adds back support for individual gamepad classes.
- 2027 Alpha 5: Add Touchpad support for gamepads
- 2027 Alpha 5: Remove ``MotorController::StopMotor()``. Use ``MotorController::Disable()`` instead.
- 2027 Alpha 5: Switch to new game data
- 2027 Alpha 5: Make joystick unplugged warning better in cases of out of range axis/button
- 2027 Alpha 5: Preferences Listener should not depend on mutable fields
- 2027 Alpha 5: Replace Speeds with Velocities in method signatures where appropriate
- 2027 Alpha 5: Rename FPGA clock to monotonic clock
- 2027 Alpha 5: Rename constants to all caps style
- 2027 Alpha 5: Fix HSV to RGB conversion off-by-one error
- 2027 Alpha 5: Rename ``MotorController`` ``set()`` to ``setThrottle()``
- 2027 Alpha 5: Add FTC fields
- 2027 Alpha 5: Make swerve and differential kinematics functions immutable
- 2027 Alpha 5: Rename "Test" robot mode to "Utility" to emphasize that it can be used for more than just testing
- 2027 Alpha 5: Split ``DriverStation`` into smaller classes, ``MatchState`` and ``RobotState`` primarily.
- 2027 Alpha 6: Fix crash when using OpMode robot on Systemcore.
- 2027 Alpha 7: More package moves in Java and header moves in C++.  Some geometry classes moved to shape, Preferences moved to preferences
- 2027 Alpha 7: ``DriverStationDisplay`` has been added--this is a text display integrated into the DS that supports ANSI escape codes
- 2027 Alpha 7: Integer (raw) timestamps are now nanoseconds instead of microseconds.  Datalog and NT still use microseconds in files/network comms.
- 2027 Alpha 7: Alert moved to wpiutil and has added functionality; usage reporting also moved to wpiutil. Joystick warnings are now alerts
- 2027 Alpha 7: ExpansionHub Follower Fixes
- 2027 Alpha 7: Rename gamepad face-button trigger APIs to directional names (faceUp/Down/Left/Right)
- 2027 Alpha 7: Add a default deadband to all gamepads
- 2027 Alpha 7: Cache HID wrappers
- 2027 Alpha 7: Remove OpMode UserControls
- 2027 Alpha 7: Add new generation for gamepads
- 2027 Alpha 7: Remove Axis from Gamepad Triggers
- 2027 Alpha 7: Change ``DriverStationSim`` to use ``wpi::hal::RobotMode``
- 2027 Alpha 7: Crash robot program if an exception occurs during opmode construction
- 2027 Alpha 7: Change ``DriverStationSim`` to use a C++ enum for alliance station
- 2027 Alpha 7: Fix incorrect robot name in reported error
- 2027 Alpha 7: Add ``DSGamepadChooser``
- 2027 Alpha 7: Rename ``FMSInfo`` table to ``DriverStation``
- 2027 Alpha 7: Switch robot construction back to supplier
- 2027 Alpha 7: Refactor ``ExpansionHubMotor`` to introduce ``NeutralMode`` for motor control
- 2027 Alpha 7: ``OpModeRobot`` Don't initialize classes during scan for opmodes
- 2027 Alpha 7: Fix opmode reset and callback handling
- 2027 Alpha 7: Use alerts for joystick warnings
- 2027 Alpha 7: Add Timer.createStarted() convenience factory
- 2027 Alpha 7: Put the ``OpModeRobot#addOpMode`` class/lambda arguments at the end
- 2027 Alpha 7: Add option to varargs string array for ``DSGamepadChooser``
- 2027 Alpha 7: Move Preferences from util to preferences package
- 2027 Alpha 7: Remove useless AutoCloseable implementations
- 2027 Alpha 7: Add raw rumble API
- 2027 Alpha 7: Use nanoseconds for timestamps

  .. warning:: Silent Breaking: The change to nanoseconds affects ``RobotController`` ``getTime`` and ``getMonotonicTime`` and ``wpi::Now()``, ``nt::Now()``, and the cscore timestamp functions.


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
- 2027 Alpha 6: Add rising and falling edge trigger factories
- 2027 Alpha 6: Add a declarative state machine API on top of commands v3
- 2027 Alpha 7: Mechanism is now an interface instead of a class
- 2027 Alpha 7: Make sideload functions scoped and improve docs
- 2027 Alpha 7: Add trigger multi press and continuous bindings
- 2027 Alpha 7: Add example and template projects for commands v3 and make hatchbot example idiomatic
- 2027 Alpha 7: Add Coroutine.waitUntil overload with timeout
- 2027 Alpha 7: Multiple periodic callbacks in the same scope
- 2027 Alpha 7: Fix Untils not Including "Until Condition"
- 2027 Alpha 7: Allow fork/await failures to be handled by user code

#### NetworkTables

- Remove NT3 support
- 2027 Alpha 2: Check id ranges in control messages
- 2027 Alpha 5: Handle interrupted save in NetworkServer
- 2027 Alpha 5: PubSubOption: Use record approach for Java
- 2027 Alpha 5: Prefix log levels to avoid macro conflicts
- 2027 Alpha 7: Add API to get and set user data on NT_Topic
- 2027 Alpha 7: Add PubSubOption to disable handle signaling
- 2027 Alpha 7: Split SetServerTeam and SetServerFixed, add mDNS resolver
- 2027 Alpha 7: Fix publish-triggered announcements being blocked by subscription announcements
- 2027 Alpha 7: Multiple bugfixes

#### Data Logging

- 2027 Alpha 5: Use reflection to access non-public superclass fields
- 2027 Alpha 5: Optimize time and memory usage of epilogue backends
- 2027 Alpha 5: Support logging of protobuf-serializable types
- 2027 Alpha 5: Use full class names in static logger fields
- 2027 Alpha 7: Multiple bugfixes

#### Hardware interfaces

- Add SPARKmini to PWM support
- 2027 Alpha 2: Fix I2C order on Systemcore
- 2027 Alpha 2: Fix analog scaling for updated image
- 2027 Alpha 2: Add support for onboard IMU mount orientations with Euler angles
- 2027 Alpha 5: ``AddressableLED``: Restore alternative color order support
- 2027 Alpha 5: Integrate support for ExpansionHub over USB
- 2027 Alpha 7: Updated hardware support (e.g. brownout, quadrature encoders, counters)
- 2027 Alpha 7: All CAN device classes now take a ``CANPort`` enum instead of an integer port to disambiguate Systemcore ports from Motioncore ports.
- 2027 Alpha 7: Create drivers library
- 2027 Alpha 7: Add Gobilda Pinpoint support

#### Math

.. warning:: Silent Breaking: ``Rotation2d``'s ``getRadians()``, ``getDegrees()``, and ``getRotations()`` methods now return a wrapped angle. See [PR #7490](https://github.com/wpilibsuite/allwpilib/pull/7490#issuecomment-2521599046) for the math reasons why. Those who don't want wrapping should use ``double`` or ``Angle`` instead of ``Rotation2d``.

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
- 2027 Alpha 7: Add PoundSquareInches MOI unit, and improve KilogramMetersSquaredPerSecond definition
- 2027 Alpha 7: Fix C++ Odometry ResetRotation missing a negation
- 2027 Alpha 7: Use triangular solves to compute UKF Kalman gain
- 2027 Alpha 7: Add drivetrain anti-tipping utility
- 2027 Alpha 7: Add ``BiquadFilter`` class for Second Order Section filters
- 2027 Alpha 7: Switch std::is_constant_evaluated() to consteval
- 2027 Alpha 7: Rewrite Trajectory API
- 2027 Alpha 7: ``Quaternion::Log()``: Avoid potential divide-by-zero
- 2027 Alpha 7: Make ``TrajectorySample`` only contain time
- 2027 Alpha 7: Give trajectory generator and parameterizer more specific names
- 2027 Alpha 7: Fix trapezoid profile
- 2027 Alpha 7: Add body rate integration to ``Rotation3d``
- 2027 Alpha 7: Document that transforms are intrinsic
- 2027 Alpha 7: Use "reference" instead of "setpoint" in feedforward docs
- 2027 Alpha 7: Note that gain setters are for online tuning
- 2027 Alpha 7: Fix adaptive RKDP advancing by the next step size
- 2027 Alpha 7: Remove unused full-pivoting QR
- 2027 Alpha 7: Remove epsilon check from RKDP
- 2027 Alpha 7: Move ``Ellipse`` and ``Rectangle`` to shape package
- 2027 Alpha 7: Split shape proto from geometry proto
- 2027 Alpha 7: Move generated Protobuf classes into separate proto packages
- 2027 Alpha 7: Make ``SimpleMotorFeedforward`` accept dimensionless units
- 2027 Alpha 7: Add ``atReference()`` to LinearSystemLoop
- 2027 Alpha 7: Clean up DARE solver docs and cache intermediate result
- 2027 Alpha 7: Remove ``Matrix.diag()``
- 2027 Alpha 7: Make ``Translation2d.getAngle()`` return optional
- 2027 Alpha 7: Add Matrix pseudoinverse
- 2027 Alpha 7: Add static methods for creating Rotation3d from Euler angles
- 2027 Alpha 7: Add ``TwoDeadWheelOdometry``

#### Telemetry/Tunable
- 2027 Alpha 7: Add Telemetry and Tunable APIs

#### AprilTag/Fields
- 2027 Alpha 7: [fields] Split images, change to generation, merge AprilTags content
- 2027 Alpha 7: [apriltag] Convert to vendordep

### Simulation

- 2027 Alpha 6: Don't wait on init for ``ExpansionHub`` in simulation.
- 2027 Alpha 6: Add Onboard IMU Simulation
- 2027 Alpha 6: GUI: fix game message string lifetime
- 2027 Alpha 6: Make HalSim DS extension a no-op, fixing crash when running with the real DS option. Support for the real DS simulation option will be added in a future release.

### Romi/XRP

- 2027 Alpha 5: Adding XRP Java and C++ examples for Timed Robot
- 2027 Alpha 6: Show IP and port of XRP/Romi to user on connection
- 2027 Alpha 7: Fix motor support and https://github.com/wpilibsuite/allwpilib/pull/8915

### Java units

- 2027 Alpha 5: Make measure implementations immutable only
- 2027 Alpha 5: Rename ``AngularMomentumUnit.mult`` to ``per``
- 2027 Alpha 5: Make RPM an alias of RotationsPerMinute
- 2027 Alpha 5: Fix incorrect magnitudes in some MutableMeasure mutations
- 2027 Alpha 5: Remove deprecated divide and negate functions

### CameraServer

- Remove Axis Camera

### Util

- 2027 Alpha 5: Add reverse iterators to ``wpi::circular_buffer`` and ``wpi::static_circular_buffer``, make other iterators bidirectional
- 2027 Alpha 5: Fix windows mDNS announcer long startup times
- 2027 Alpha 5: Fix ``uv_tcp_keepalive`` time
- 2027 Alpha 5: Remove ``CombinedRuntimeLoader``
- 2027 Alpha 5: Fix port having incorrect endian on Windows resolver
- 2027 Alpha 5: Rename ``CreateEvent`` and ``CreateSemaphore`` to Make
- 2027 Alpha 5: Change C++ json to jart/json.cpp
- 2027 Alpha 5: Change Java JSON to Avaje Jsonb
- 2027 Alpha 5: Use C++23 stacktrace library on Windows
- 2027 Alpha 7: ``wpi::expected`` and ``fmt::format`` have been replaced with ``std::expected`` and ``std::format``
- 2027 Alpha 7: Move Pair from wpimath to wpiutil
- 2027 Alpha 7: Add protobuf List pack/unpack for Java
- 2027 Alpha 7: Add ``Struct<char>`` support in C++
- 2027 Alpha 7: Always use steady_clock for timestamp
- 2027 Alpha 7: Accept UTF-8 struct schema identifiers
- 2027 Alpha 7: Move Alert from HAL/wpilib to wpiutil
- 2027 Alpha 7: Add usage reporting API

### Javac Plugin
- 2027 Alpha 7: Add compiler check for integer division in floating-point contexts

## Glass / OutlineViewer / Simulation GUI

- 2027 Alpha 2: Fix NT int64 value display
- 2027 Alpha 5: NetworkTables: Show struct enum values
- 2027 Alpha 5: Fix handling for optionals and empty arrays
- 2027 Alpha 5: Fix color order for sim GUI LEDs
- 2027 Alpha 5: FMS: Fix reading past end of GSM buffer
- 2027 Alpha 5: Fix NT server mode
- 2027 Alpha 5: Add correct time for rebuilt
- 2027 Alpha 5: Update to SDL joystick mappings from 1-19-2026
- 2027 Alpha 6: Fix memory corruption and incorrect POV count
- 2027 Alpha 7: The desktop GUI tools and simulation GUI now use SDL rendering and gamepad access for consistency with the 2027 Driver Station
- 2027 Alpha 7: Sim GUI: Fix buttons starting at 1 instead of 0
- 2027 Alpha 7: Add sim GUI support for DS display
- 2027 Alpha 7: Change to SDL3
- 2027 Alpha 7: [glass] Add NT button for System server, add force restart

## GradleRIO

- 2027 Alpha 5: Upgrade to Gradle 9.4.1
- 2027 Alpha 5: Add ZGC as a GC option and make it the default
- 2027 Alpha 5: Force encoding for written files to UTF-8
- 2027 Alpha 5: Add Avaje Jsonb and remove Jackson
- 2027 Alpha 7: Update avajeVersion from 3.11 to 3.14
- 2027 Alpha 7: Only use single USB IP based off of host os
- 2027 Alpha 7: Use java run task for sim, deploy using classpath
- 2027 Alpha 7: Correct gdbserver host arg
- 2027 Alpha 7: Fix tool launching on macOS
- 2027 Alpha 7: Support catch2 for C++ unit tests
- 2027 Alpha 7: Add drivers, tunables, telemetry, and fields libraries
- 2027 Alpha 7: Change install directory to XDG_DATA_HOME/wpilib on Linux

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
- 2027 Alpha 6: Fix progress bar on Linux
- 2027 Alpha 7: Native Arm64 Installers are included for Windows and Linux.
- 2027 Alpha 7: Show VS Code download size
- 2027 Alpha 7: Integrate CLI installer
- 2027 Alpha 7: Switch UI to fluent theme
- 2027 Alpha 7: Make vscode prompt to trust when opening new workspaces
- 2027 Alpha 7: Add wayland support to installer
- 2027 Alpha 7: Change install directory to XDG_DATA_HOME/wpilib on Linux
- 2027 Alpha 7: wpilibcode: fix bash scripting bugs
- 2027 Alpha 7: Add Linux docs shortcut
- 2027 Alpha 7: Remove VSCode AppArmor profile
- 2027 Alpha 7: Update to VS Code 1.134.0
- 2027 Alpha 7: VS Code extension updates: CPP extension 1.31.4 to 1.33.8 Java extension 1.54.0 to 1.55.0 Java Dependency extension 0.27.2 to 0.27.6

## Visual Studio Code Extension

- Remove standalone utility
- 2027 Alpha 5: Improve RIOLog UI
- 2027 Alpha 5: Fix blank window after installing dependency from local copy
- 2027 Alpha 5: Remove unnecessary setting change commands
- 2027 Alpha 5: Support Commandsv3 vendordep
- 2027 Alpha 5: Move source backup in jar to backup directory
- 2027 Alpha 5: Set java project source/targetCompatibility to 25
- 2027 Alpha 5: Use shadow plugin to make shaded JARs
- 2027 Alpha 5: Port Java simulation canceling to C++
- 2027 Alpha 5: Move wpilibHome to the top of the plugin repository list
- 2027 Alpha 7: Change the language in project import error to be more descriptive
- 2027 Alpha 7: locale.ts: Don't print error for missing en locale
- 2027 Alpha 7: Disable Run/Debug Java CodeLens provider
- 2027 Alpha 7: Only warn if C++ extension is missing if project requests C++ Intellisense
- 2027 Alpha 7: Fix tool launching on macOS
- 2027 Alpha 7: Remember previous selections for step 2 of project creation
- 2027 Alpha 7: Update importer for DS MatchState and RobotState split
- 2027 Alpha 7: Importer: Add replacements for test to utility, drivers, DCmotor, Color, Alert
- 2027 Alpha 7: Bring back logging to VS Code's Output panel
- 2027 Alpha 7: Don't require new main class
- 2027 Alpha 7: Fix RIOLog on Systemcore
- 2027 Alpha 7: Reload Java project config on build
- 2027 Alpha 7: Pass build.gradle path to project reload command
- 2027 Alpha 7: Fix WPILib tool detection on Linux

## SysId

- 2027 Alpha 5: Remove Phoenix5 CANcoder preset
- 2027 Alpha 5: Fix crash on partially empty raw data

## AdvantageScope

- 2027 Alpha 5: Use AdvantageScope 27.0.0-alpha-4
- 2027 Alpha 7: Use AdvantageScope 27.0.0-alpha-6

## Elastic

- 2027 Alpha 5: Use Elastic 2027.0.0-alpha7
- 2027 Alpha 6: Use Elastic 2027.0.0-alpha8
- 2027 Alpha 7: Use Elastic 2027.0.0-alpha9

## WPIcal

- 2027 Alpha 5: Use updated thirdparty-ceres and move resource files
- 2027 Alpha 5: Refactor to use WPILib libraries and modern C++ conventions and improve UX
- 2027 Alpha 5: Remove tag ID limit

## Shuffleboard

.. warning:: Shuffleboard has been removed for 2027 due to its lack of a maintainer and resource utilization issues. Users can find :doc:`additional modern dashboard options here </docs/software/dashboards/dashboard-intro>`

## SmartDashboard

.. warning:: SmartDashboard has been removed for 2027 due to its usage of Network Tables v3. Users can find :doc:`additional modern dashboard options here </docs/software/dashboards/dashboard-intro>`

## PathWeaver

.. warning:: PathWeaver has been removed for 2027 due to its lack of swerve support and lack of a maintainer. Users may find :doc:`Choreo </docs/software/pathplanning/choreo/index>`, [PathPlanner](https://pathplanner.dev), or [Bline](https://www.chiefdelphi.com/t/introducing-bline-a-new-rapid-polyline-autonomous-path-planning-suite/509778) more useful. They have an intuitive user interface and swerve support.

## RobotBuilder

.. warning:: RobotBuilder has been removed for 2027 due to its declining usage and burden of updating for the 2027 control system.
