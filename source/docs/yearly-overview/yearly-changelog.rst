.. include:: <isonum.txt>

# New for 2025

A number of improvements have been made to FRC\ |reg| Control System software for 2025. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various [WPILib](https://github.com/wpilibsuite/) GitHub repositories.

It's recommended to also review the list of :doc:`known issues <known-issues>`.

## Importing Projects from Previous Years

Due to internal GradleRIO changes, it is necessary to update projects from previous years. After :doc:`Installing WPILib for 2025 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2024 projects must be :doc:`imported </docs/software/vscode-overview/importing-last-years-robot-code>` to be compatible.

## Major Changes (Java/C++)

These changes contain *some* of the major changes to the library that it's important for the user to recognize. This does not include all of the breaking changes, see the other sections of this document for more changes.

- Added :doc:`annotation based logging (Epilogue) </docs/software/telemetry/robot-telemetry-with-annotations>` for Java
- The units library has been refactored to have unit-specific measurement classes instead of a single generic ``Measure`` class. The new measurement classes have clearer names (``Distance`` instead of ``Measure<Distance>``, or ``LinearAcceleration`` instead of ``Measure<Velocity<Velocity<Distance>>>``), and implement math operations to return the most specific result types possible instead of a wildcard ``Measure<?>``.
- Add persistent alerts API. Alerts are displayed on supported dashboards such as Shuffleboard and Elastic.

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
- C++: Add FRC_ReportWarning
- Implement ``Sendable`` for HID classes
- Remove ``RobotInit`` usage in examples. Use constructor instead. RobotInit may be deprecated in the future.
- Include sendable type information in topic metadata
- Add LED pattern API for easily animating addressable LEDs
- Deprecate AxisCamera
- Breaking: Remove deprecated ``Gyro`` and ``Accelerometer`` interface
- ``GenericHID.setRumble``: Fix Java integer overflow
- Remove deprecated ``Notifier.SetHandler`` function

#### Commands

- Add deadband trigger methods to ``CommandGenericHID``
- Deprecate ``TrapezoidProfileCommand``. Use :doc:`TrapezoidProfile Directly </docs/software/commandbased/profile-subsystems-commands>`
- Cache controller ``BooleanEvents`` / ``Triggers`` and directly construct ``Triggers``, fixing issues if ``BooleanEvents`` / ``Triggers`` are created in loops
- Make requirements private\
- Add ``setRumble`` and ``isConnected`` to ``CommandGenericHID``
- Breaking: Remove deprecated C++ method ``TransferOwnership``
- Add ``StartRun`` command factory
- Deprecate proxy supplier constructor
- Breaking: Remove deprecated ``CommandBase``
- Rename ``deadlineWith`` to ``deadlineFor``
- Remove deprecated ``TrapzoidProfileCommand`` api
- Fix double composition error message truncation

#### NetworkTables

- Deprecate setNetworkTablesFlushEnabled

#### Data Logging

- Added :doc:`annotation based logging (Epilogue) </docs/software/telemetry/robot-telemetry-with-annotations>` for Java
- logging the console can be enabled with ``DatalogManager.logConsoleOutput``
- DataLog: Add last value and change detection
- DataLogManager: Fix behavior when low on space

#### Hardware interfaces

- Fix edge cases of CAN ID validation and reporting for CTRE and REV devices
- Report Radio LED state
- Correct maximum length of DS console send
- Add ``getVoltage`` to ``PWMMotorController``
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
- Add support for Sharp IR sensors
- Rewrite ``DutyCycleEncoder`` and ``AnalogEncoder``
- Fix ``AsynchronousInterrupt``

#### Math

- Discretize ``SimpleMotorFeedForward``, ``ArmFeedForward`` and ``ElevatorFeedForward``
- ``SwerveDrivePoseEstimator``: Fix stationary module emitting error when calculating angle
- Add ``DCMotor.getCurrent()`` overload accepting torque
- Add ``cosineScale`` method to ``SwerveModuleState`` and instance optimize
- Breaking: Remove deprecated ``MatBuilder`` constructor. Use ``MatBuilder.fill`` instead
- Make trajectory constraints use ``Rectangle2d`` and ``Ellipse2d``
- Add Protobuf and Struct support to many more classes
- Add ``getAccumulatedError()`` to ``PIDController``
- Remove ``WheelPositions`` interface/concept
- Add ``kinematics.copyInto()``
- Add geometry classes for ``Rectangle2d`` and ``Ellipse2d``
- Deprecate ``RamseteController``. Use ``LTVUnicycleController`` instead
- Add reset methods to ``Odometry`` and ``PoseEstimator``
- Breaking: Remove deprecated TrapezoidProfile constructors
- Breaking: Remove deprecated MatBuilder factory
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

- Deprecate ``RuntimeDetector``
- Breaking: Remove ``RuntimeLoader``

## Branding

- WPILib has a new logo.

.. image:: /assets/wpilib-generic.svg
  :alt: WPILib Logo

## SmartDashboard

.. important:: SmartDashboard is not supported on Apple Silicon (Arm64) Macs.



## Glass / OutlineViewer / Simulation GUI



## GradleRIO



## WPILib All in One Installer

- Update to VS Code XX
- VS Code extension updates: cpptools XX, javaext XXS


## Visual Studio Code Extension



## RobotBuilder



## SysId


