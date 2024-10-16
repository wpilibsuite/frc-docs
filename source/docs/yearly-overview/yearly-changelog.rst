.. include:: <isonum.txt>

# New for 2025

A number of improvements have been made to FRC\ |reg| Control System software for 2025. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various [WPILib](https://github.com/wpilibsuite/) GitHub repositories.

It's recommended to also review the list of :doc:`known issues <known-issues>`.

## Importing Projects from Previous Years

Due to internal GradleRIO changes, it is necessary to update projects from previous years. After :doc:`Installing WPILib for 2025 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2024 projects must be :doc:`imported </docs/software/vscode-overview/importing-last-years-robot-code>` to be compatible.

## Major Changes (Java/C++)

These changes contain *some* of the major changes to the library that it's important for the user to recognize. This does not include all of the breaking changes, see the other sections of this document for more changes.

- Added :doc:`annotation based logging (Epilogue) </docs/software/telemetry/robot-telemetry-with-annotations>` for Java
- The :doc:`Java units library </docs/software/basic-programming/java-units>` has been refactored to have unit-specific measurement classes instead of a single generic ``Measure`` class. The new measurement classes have clearer names (``Distance`` instead of ``Measure<Distance>``, or ``LinearAcceleration`` instead of ``Measure<Velocity<Velocity<Distance>>>``), and implement math operations to return the most specific result types possible instead of a wildcard ``Measure<?>``.
- Add :doc:`persistent alerts API </docs/software/telemetry/persistent-alerts>`. Alerts are displayed on supported dashboards such as Shuffleboard and Elastic.
- Add LED pattern API for easily animating addressable LEDs
- Java 17 must be used as Java Source and Target compatibility have been bumped to Java 17. Java 17 has been used since 2023.

Supported Operating Systems and Architectures:
 * Windows 10 & 11, 64 bit only. 32 bit and Arm are not supported
 * Ubuntu 22.04 & 24.04, 64 bit. Other Linux distributions with glibc >= 2.34 may work, but are unsupported
 * macOS 13.3 or higher, both Intel and Arm.

.. warning:: The following OSes are no longer supported: macOS 12 or earlier, Ubuntu 18.04 & 20.04, Windows 7, Windows 8.1, and any 32-bit Windows.

.. note:: [Windows 10 support from Microsoft will end in October 2025](https://www.microsoft.com/en-us/windows/end-of-support). We intend to continue supporting Windows 10 through the 2026 season, but may have to drop support in 2027. Teams should start planning their upgrade path to Windows 11.

## WPILib

### General Library

- The units library has been refactored to have unit-specific measurement classes instead of a single generic ``Measure`` class. The new measurement classes have clearer names (``Distance`` instead of ``Measure<Distance>``, or ``LinearAcceleration`` instead of ``Measure<Velocity<Velocity<Distance>>>``), and implement math operations to return the most specific result types possible instead of a wildcard ``Measure<?>``.
- Add persistent alerts API. Alerts are displayed on supported dashboards such as Shuffleboard and Elastic.
- Add LED pattern API for easily animating addressable LEDs
- Breaking: Remove deprecated ``Gyro`` and ``Accelerometer`` interface
- Breaking: Remove deprecated ``Notifier.SetHandler`` function
- Remove ``RobotInit`` usage in examples. Use constructor instead. RobotInit may be deprecated in the future.
- Deprecate ``AxisCamera``
- C++: Add ``FRC_ReportWarning``
- Implement ``Sendable`` for HID classes
- Include sendable type information in topic metadata
- ``GenericHID.setRumble``: Fix Java integer overflow

#### Commands

- Breaking: Remove deprecated ``CommandBase``
- Remove deprecated ``TrapzoidProfileCommand`` API
- Breaking: Remove deprecated C++ method ``TransferOwnership``
- Deprecate ``PIDCommand``, ``PIDSubsystem``, ``ProfiledPIDCommand``, ``ProfiledPIDSubsystem``, ``TrapezoidProfileSubsystem``
- Deprecate ``TrapezoidProfileCommand``. Use :doc:`TrapezoidProfile Directly </docs/software/commandbased/profile-subsystems-commands>`
- Deprecate proxy supplier constructor
- Cache controller ``BooleanEvents`` / ``Triggers`` and directly construct ``Triggers``, fixing issues if ``BooleanEvents`` / ``Triggers`` are created in loops
- Add deadband trigger methods to ``CommandGenericHID``
- Make requirements private
- Add ``setRumble`` and ``isConnected`` to ``CommandGenericHID``
- Add ``StartRun`` command factory
- Rename ``deadlineWith`` to ``deadlineFor``
- Fix double composition error message truncation

#### NetworkTables

- Server round robin message processing
- Client: only connect to IPv4 addresses
- Deprecate setNetworkTablesFlushEnabled

#### Data Logging

- Added :doc:`annotation based logging (Epilogue) </docs/software/telemetry/robot-telemetry-with-annotations>` for Java
- Logging the console can be enabled with ``DatalogManager.logConsoleOutput``
- DataLog: Add last value and change detection
- DataLogManager: Fix behavior when low on space

#### Hardware interfaces

- Add ``getVoltage`` to ``PWMMotorController``
- Add support for Sharp IR sensors
- Fix edge cases of CAN ID validation and reporting for CTRE and REV devices
- Report Radio LED state
- Correct maximum length of DS console send
- C++: Refactor AnalogTrigger to use shared_ptr
- Add ``RobotController.GetCommsDisableCount()``
- Expose sticky hardware and firmware faults in PDH and PH
- Fix potential race in CANAPI
- Fix REV PH disabled solenoid list
- remove CANDeviceInterface
- Refactor and clean up ADIS IMU classes
- Propagate ``PWMMotorController`` ``stopMotor()`` and ``disable()`` to followers
- ``Compressor``: Add more Sendable data
- Fix ``PowerDistribution.GetAllCurrents()``
- Rewrite ``DutyCycleEncoder`` and ``AnalogEncoder``
- Fix ``AsynchronousInterrupt``

#### Math

- Breaking: Remove deprecated TrapezoidProfile constructors
- Breaking: Remove deprecated MatBuilder factory
- Deprecate ``RamseteController``. Use ``LTVUnicycleController`` instead
- Breaking: Remove deprecated ``MatBuilder`` constructor. Use ``MatBuilder.fill`` instead
- Discretize ``SimpleMotorFeedForward``, ``ArmFeedForward`` and ``ElevatorFeedForward``
- ``SwerveDrivePoseEstimator``: Fix stationary module emitting error when calculating angle
- Add ``DCMotor.getCurrent()`` overload accepting torque
- Add ``cosineScale`` method to ``SwerveModuleState`` and instance optimize
- Make trajectory constraints use ``Rectangle2d`` and ``Ellipse2d``
- Add Protobuf and Struct support to many more classes
- Add ``getAccumulatedError()`` to ``PIDController``
- Remove ``WheelPositions`` interface/concept
- Add ``kinematics.copyInto()``
- Add geometry classes for ``Rectangle2d`` and ``Ellipse2d``
- Add reset methods to ``Odometry`` and ``PoseEstimator``
- Add ArmFeedforward calculate() overload that takes current and next velocity instead of acceleration

### Simulation

- Breaking: Remove gearing input from ``FlywheelSim`` and ``DCMotorSim`` and calculate from the LinearSystem and DCMotor inputs
- Add ``SendableChooserSim``
- Fix Java sim timing on Windows
- Fix interrupt edges being flipped in sim
- Don't send joystick data during auto
- Initialize DIO to true in sim

### Romi/XRP

- XRP: Add ``GetRotation2d`` to ``Gyro``
- XRP: Add Support for Encoder Period

### Util

- Breaking: Remove ``RuntimeLoader``
- Deprecate ``RuntimeDetector``

## Branding

- WPILib has a new logo.

.. image:: /assets/wpilib-generic.svg
  :alt: WPILib Logo

## Shuffleboard

- The live network table preview has been removed due to the high frequency of node redraws. Spot checking data will now need to be done by dragging a data widget into a tab. Generic table data should still be displayable with the generic tree table widget. The NT source preview now displays the data type of a topic instead of its current value.
- The subscribe-to-all-NT-data behavior has been changed to only subscribe to topic information. This should cut down on bandwidth and some CPU usage
- The widget gallery has been removed with no replacement. Drawing the large number of dummy widgets took a surprising CPU load and occasionally caused problems at startup when third party widgets from plugins would crash
- Fix widgets getting permanently disabled after network disconnects
- Expose orientation property for NumberSlider
- Add :doc:`persistent alerts widget </docs/software/telemetry/persistent-alerts>`
- Correct FieldData de/serialization

## SmartDashboard

.. important:: SmartDashboard is not supported on Apple Silicon (Arm64) Macs.

- No changes other than build updates were made to SmartDashboard

## Glass / OutlineViewer / Simulation GUI

- Save input after clicking away
- Check for struct descriptor size 0

## GradleRIO

- Use Gradle 8.10.2
- Use shell scripts for launching tools on Linux / macOS, since macOS doesn't ship Python any more

## WPILib All in One Installer

- Update to VS Code 1.94.2
- VS Code extension updates: cpptools 1.22, javaext 1.36
- Use shell scripts for launching tools on Linux / macOS, since macOS doesn't ship Python any more
- Only install scripts if they are used by a specific platform
- Make shortcuts use the app icon
- Add AppArmor file for electron apps for Ubuntu 24.04
- Fix icon in dock on Ubuntu 24.04

## Visual Studio Code Extension

- Add dependency view extension for easier finding and updating of 3rd party libraries
- Add gradle clean command
- Use shell scripts for launching tools on Linux / macOS, since macOS doesn't ship Python any more

## RobotBuilder

- Remove robotInit in favor of Robot constructor

## SysId

- Fix crash when all data is filtered out during analysis
- Remove obsolete WPILib & CTRE presets, rename CTRE presets

## PathWeaver

- No changes other than build updates were made to PathWeaver

## AdvantageScope

- Update to [2025 AdvantageScope](https://docs.advantagescope.org/whats-new)

## Choreo

Choreo is bundled in the installer! Choreo is an application for creating time optimal autonomous trajectories. [Read more here](https://sleipnirgroup.github.io/Choreo/).
