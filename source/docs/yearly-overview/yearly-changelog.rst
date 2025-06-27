.. include:: <isonum.txt>

# New for 2025

A number of improvements have been made to FRC\ |reg| Control System software for 2025. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various [WPILib](https://github.com/wpilibsuite/) GitHub repositories.

It's recommended to also review the list of :doc:`known issues <known-issues>`.

## Importing Projects from Previous Years

Due to internal GradleRIO changes, it is necessary to update projects from previous years. After :doc:`Installing WPILib for 2025 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2024 projects must be :doc:`imported </docs/software/vscode-overview/importing-last-years-robot-code>` to be compatible.

## Major Changes (Java/C++)

These changes contain *some* of the major changes to the library that it's important for the user to recognize. This does not include all of the breaking changes, see the other sections of this document for more changes.

- The Dependency Manager in VS Code will help teams :doc:`discover and install vendordeps </docs/software/vscode-overview/3rd-party-libraries>`.
- Added :doc:`Elastic Dashboard </docs/software/dashboards/elastic>` a driver focused dashboard.
- Added :doc:`annotation based logging (Epilogue) </docs/software/telemetry/robot-telemetry-with-annotations>` for Java
- Added :doc:`WPIcal </docs/software/wpilib-tools/wpical/index>` tool for calibrating FRC Apriltags to correct for field setup error
- The :doc:`Java units library </docs/software/basic-programming/java-units>` has been refactored to have unit-specific measurement classes instead of a single generic ``Measure`` class. The new measurement classes have clearer names (``Distance`` instead of ``Measure<Distance>``, or ``LinearAcceleration`` instead of ``Measure<Velocity<Velocity<Distance>>>``), and implement math operations to return the most specific result types possible instead of a wildcard ``Measure<?>``.
- Add :doc:`persistent alerts API </docs/software/telemetry/persistent-alerts>`. Alerts are displayed on supported dashboards such as Shuffleboard and Elastic.
- Add :ref:`LED pattern API <docs/software/hardware-apis/misc/addressable-leds:LED Patterns>` for easily animating addressable LEDs
- Java 17 must be used as Java Source and Target compatibility have been bumped to Java 17. Java 17 has been used since 2023.

Supported Operating Systems and Architectures:
 * Windows 10 & 11, 64 bit only. 32 bit and Arm are not supported
 * Ubuntu 22.04 & 24.04, 64 bit. Other Linux distributions with glibc >= 2.34 may work, but are unsupported
 * macOS 13.3 or higher, both Intel and Arm.

.. warning:: The following OSes are no longer supported: macOS 12 or earlier, Ubuntu 18.04 & 20.04, Windows 7, Windows 8.1, and any 32-bit Windows.

.. note:: [Windows 10 support from Microsoft will end in October 2025](https://www.microsoft.com/en-us/windows/end-of-support). We intend to continue supporting Windows 10 through the 2026 season, but may have to drop support in 2027. Teams should start planning their upgrade path to Windows 11.

## WPILib

### General Library

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
- Rename SysId example to SysIdRoutine
- Add ``Timer.isRunning`` method
- Add Java unit support for RobotController
- Add a functional interface for MecanumDriveMotorVoltages and deprecate old interface
- Add ``Koors40`` Motor Controller
- 2025.2.1: Add 2025 field image and april tag map
- 2025.3.1: Add april tag map for AndyMark field. See [Team Update 12](https://firstfrc.blob.core.windows.net/frc2025/Manual/TeamUpdates/TeamUpdate12.pdf) for more information.

#### Commands

- Breaking: Remove deprecated ``CommandBase``
- Remove deprecated ``TrapzoidProfileCommand`` API
- Breaking: Remove deprecated C++ method ``TransferOwnership``
- Deprecate ``PIDCommand``, ``PIDSubsystem``, ``ProfiledPIDCommand``, ``ProfiledPIDSubsystem``, ``TrapezoidProfileSubsystem``
- Deprecate ``TrapezoidProfileCommand``. Use :doc:`TrapezoidProfile Directly </docs/software/commandbased/profile-subsystems-commands>`
- Cache controller ``BooleanEvents`` / ``Triggers`` and directly construct ``Triggers``, fixing issues if ``BooleanEvents`` / ``Triggers`` are created in loops
- Add deadband trigger methods to ``CommandGenericHID``
- Make requirements private
- Add ``setRumble`` and ``isConnected`` to ``CommandGenericHID``
- Add ``StartRun`` command factory
- Rename ``deadlineWith`` to ``deadlineFor``
- Fix double composition error message truncation
- Add ``withDeadline`` modifier

#### NetworkTables

- Server round robin message processing
- Client: only connect to IPv4 addresses
- Deprecate setNetworkTablesFlushEnabled
- Set NetworkTables 3 client network identity

#### Data Logging

- Added :doc:`annotation based logging (Epilogue) </docs/software/telemetry/robot-telemetry-with-annotations>` for Java
- Logging the console can be enabled with ``DatalogManager.logConsoleOutput``
- DataLog: Add last value and change detection
- DataLogManager: Fix behavior when low on space
- Epilogue: Autogenerate nicer data names by default, not just raw element names
- 2025.3.2: Epilogue: Make nonloggable type warnings configurable

#### Hardware interfaces

- Breaking: Rewrite ``DutyCycleEncoder`` and ``AnalogEncoder`` to simplify and remove rollover detection that was broken
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
- Fix ``AsynchronousInterrupt``
- 2025.3.1: AddressableLED: add support for other color orders

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
- Fix C++ pose estimator poseEstimate initialization
- Fix PIDController error tolerance getters
- Add time-varying RKDP
- Add 2D to 3D geometry constructors
- 2025.2.1: Implement Translation3d.RotateAround
- 2025.3.1: Add Pose2d and Pose3d RotateAround
- 2025.3.1: Fix infinite loop in ArmFeedforward::Calculate(xₖ, vₖ, vₖ₊₁)
- 2025.3.1: Add setters for Feedforward gains
- 2025.3.2: Make LinearSystemSim setState() update output
- 2025.3.2: Fix another infinite loop in ArmFeedforward
- 2025.3.2: Add Translation2d/Translation3d slew rate limiter
- 2025.3.2: Fix feedforward returning NaN when kᵥ = 0
- 2025.3.2: Add Debouncer type and time setters
- 2025.3.2: Fix singularities in Ellipse2d::Nearest()
- 2025.3.2: Fix UnscentedKalmanFilter and improve math docs

### Simulation

- Breaking: Remove gearing input from ``FlywheelSim`` and ``DCMotorSim`` and calculate from the LinearSystem and DCMotor inputs
- Add ``SendableChooserSim``
- Fix Java sim timing on Windows
- Fix interrupt edges being flipped in sim
- Don't send joystick data during auto
- Initialize DIO to true in sim
- Clamp battery voltage to 0
- Fix: Update FMS widget when real DS is connected
- Fix DS GUI System Joysticks window auto-hiding

### Romi/XRP

- XRP: Add ``GetRotation2d`` to ``Gyro``
- XRP: Add Support for Encoder Period
- XRP: Add ``GetLED`` to ``OnBoardIO``
- XRP & Romi: Changed applicable C++ methods to use units library

### Java units

- The units library has been refactored to have unit-specific measurement classes instead of a single generic ``Measure`` class. The new measurement classes have clearer names (``Distance`` instead of ``Measure<Distance>``, or ``LinearAcceleration`` instead of ``Measure<Velocity<Velocity<Distance>>>``), and implement math operations to return the most specific result types possible instead of a wildcard ``Measure<?>``.
- Add resistance units
- Use div instead of divide
- Add absolute value and copy sign functionality
- 2025.3.1: Add Measure.per overloads for all known unit types

### CameraServer

- Update to OpenCV 4.10.0
- Wake up even if no frames received
- Fix wakeup on sink destruction
- HttpCamera: Send width/height/fps stream settings
- HttpCamera: Auto-detect mode from stream if not set
- Sink: add ability to get most recent frame instead of waiting
- 2025.2.1: Use frame time in Linux UsbCameraImpl

### Util

- Breaking: Remove ``RuntimeLoader``
- Deprecate ``RuntimeDetector``
- Add a simple web server for serving files. Example: ``WebServer.start(5800, Filesystem.getDeployDirectory());``

## Branding

- WPILib has a new logo.

.. image:: /assets/wpilib-generic.svg
  :alt: WPILib Logo

## Shuffleboard

.. warning:: Shuffleboard is deprecated and will be removed for 2027 due to its lack of a maintainer and resource utilization issues. Users can find :doc:`additional modern dashboard options here </docs/software/dashboards/dashboard-intro>`

- Expose orientation property for NumberSlider
- Add :doc:`persistent alerts widget </docs/software/telemetry/persistent-alerts>`
- Correct FieldData de/serialization
- 2025.2.1: Add 2025 field image
- 2025.3.1: After many reports of a variety of issues, many of the resource optimations have been reverted. Performance should be similar to 2024 Shuffleboard.

## SmartDashboard

.. important:: SmartDashboard is not supported on Apple Silicon (Arm64) Macs.

.. warning:: SmartDashboard is deprecated and will be removed for 2027 due to its usage of Network Tables v3. Users can find :doc:`additional modern dashboard options here </docs/software/dashboards/dashboard-intro>`

- No changes other than build updates were made to SmartDashboard

## Glass / OutlineViewer / Simulation GUI

- Save input after clicking away
- Check for struct descriptor size 0
- Align Field2d border and image padding for custom images
- Add Alerts widget
- Fix minimum widget width
- 2025.2.1: Add 2025 field image
- 2025.2.1: Make picking a Field2d field JSON more obvious
- 2025.3.2: Update default field to 2025 for Field2D

## GradleRIO

- Use Gradle 8.11
- Use shell scripts for launching tools on Linux / macOS, since macOS doesn't ship Python any more
- Add method to delete files on roboRIO that have been deleted in the deploy directory. :ref:`Set deleteOldFiles to true <docs/software/basic-programming/deploy-directory:Deleting Unused Deploy Files>` in the frcStaticFileDeploy block
- Gradle now consolidates Java compile errors at the bottom of the terminal to aid discoverability https://docs.gradle.org/8.11/release-notes.html#error-warning
- 2025.3.1: Warn if multiple versions of the same vendordep is found
- 2025.3.2: Disable code reboot while killing robot process, which was causing high CPU usage every other code reboot for some teams

## WPILib All in One Installer

- Update to VS Code 1.96.2
- VS Code extension updates: cpptools 1.23.2, javaext 1.38
- Use shell scripts for launching tools on Linux / macOS, since macOS doesn't ship Python any more
- Only install scripts if they are used by a specific platform
- Make shortcuts use the app icon
- Add AppArmor file for electron apps for Ubuntu 24.04, which must be :ref:`manually installed <docs/zero-to-robot/step-2/wpilib-setup:Post-Installation>`

## Visual Studio Code Extension

- Add :doc:`Dependency Manager extension </docs/software/vscode-overview/3rd-party-libraries>` for easier finding and updating of 3rd party libraries
- Add gradle clean command
- Use shell scripts for launching tools on Linux / macOS, since macOS doesn't ship Python any more
- Add option to importer to import XRP project
- Importer: Update for Java Units changes
- Extract WPILib Utility on mac
- Define java.configuration.runtimes in settings.json to ensure WPILib JDK is used
- Improve intellisense by hiding items not likely to be used in Robot Programs

## RobotBuilder

.. warning:: RobotBuilder is deprecated and will be removed for 2027 due to its declining usage and burden of updating for the 2027 control system.

- Remove robotInit in favor of Robot constructor

## SysId

- Fix crash when all data is filtered out during analysis
- Remove obsolete WPILib & CTRE presets, rename CTRE presets
- Clamp feedback measurement delay to zero or higher
- 2025.3.2: Refactor feedback analysis

## PathWeaver

.. warning:: PathWeaver is deprecated and will be removed for 2027. Users may find :doc:`Choreo </docs/software/pathplanning/choreo/index>` or [PathPlanner](https://github.com/mjansen4857/pathplanner) more useful. They both have an intuitive user interface and swerve support.

- Fix finding deploy directory when outputdir blank
- 2025.2.1: Add 2025 field image

## AdvantageScope

- Update to [2025 AdvantageScope](https://www.chiefdelphi.com/t/advantagescope-2025-swift-simple-smart/471922)

## Elastic

Elastic is bundled in the installer! Elastic is a simple and modern dashboard. :doc:`Read more here </docs/software/dashboards/elastic>`.

## WPIcal

WPIcal is new WPILib tool for calibrating FRC Apriltags to correct for field setup error. :doc:`Read more here </docs/software/wpilib-tools/wpical/index>`.

- 2025.2.1: Add JSON combiner which allows users to combine multiple AprilTag layouts
