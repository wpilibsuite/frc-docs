.. include:: <isonum.txt>

New for 2024
============

A number of improvements have been made to FRC\ |reg| Control System software for 2024. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various `WPILib <https://github.com/wpilibsuite/>`__ GitHub repositories.

It's recommended to also review the list of :doc:`known issues <known-issues>`.

Importing Projects from Previous Years
--------------------------------------

Due to internal GradleRIO changes, it is necessary to update projects from previous years. After :doc:`Installing WPILib for 2024 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2023 projects must be :doc:`imported </docs/software/vscode-overview/importing-last-years-robot-code>` to be compatible.

Major Changes (Java/C++)
------------------------

These changes contain *some* of the major changes to the library that it's important for the user to recognize. This does not include all of the breaking changes, see the other sections of this document for more changes.

- Added support for :doc:`XRP robots </docs/xrp-robot/index>`
- Projects now default to supporting Java 17 features
- Multiple NetworkTables networking improvements for improved reliability and robustness and structured data support using protobuf
- Java now uses the Serial GC by default on the roboRIO; this should improve performance and reduce memory usage for most robot programs
- Performance improvements and reduced worst-case memory usage throughout libraries
- Added a typesafe unit system for Java (not used by the main part of WPILib yet)
- Disabled LiveWindow in Test Mode by default. See See :ref:`docs/software/dashboards/smartdashboard/test-mode-and-live-window/enabling-test-mode:Enabling LiveWindow in Test Mode` to enable it.
- SysId has been rewritten to remove project generation; Replaced with data logging within team robot program

Supported Operating Systems and Architectures:
 * Windows 10 & 11, 64 bit. 32 bit and Arm are not supported
 * Ubuntu 22.04, 64 bit. Other Linux distributions with glibc >= 2.32 may work, but are unsupported
 * macOS 12 or later, Intel and Arm.

.. warning:: The following OSes are no longer supported: macOS 11, Ubuntu 18.04 & 20.04, Windows 7, Windows 8.1, and any 32-bit Windows.

WPILib
------

General Library
^^^^^^^^^^^^^^^

- Commands:

    - Added proxy factory to ``Commands``
    - Added ``IdleCommand``
    - Fixed ``RepeatCommand`` calling ``end()`` twice
    - Added ``onlyWhile()`` and ``onlyIf()`` decorators
    - Implemented ``ConditionalCommand.getInterruptBehavior()``
    - Added interruptor parameter to ``onCommandInterrupt`` callbacks
    - Added ``DeferredCommand``, ``Commands.defer()``, and ``Subsystem.defer()``
    - Add requirements parameter to ``Commands.idle()``
    - Fix Java ``CommandXboxController.leftTrigger()`` parameter order
    - Make Java ``SelectCommand`` generic
    - Add finallyDo with zero-arg lambda

- NetworkTables:

    - Networking improvements for improved reliability and robustness
    - Added subprotocol to improve web-based dashboard connection aliveness checking
    - Bugfixes and stability improvements (reduced worst case memory usage)
    - Improved update behavior for values continuously updated from robot code (improves command button behavior)

- Data Logging:

    - Improved handling of low free space conditions (now stops logging if less than 5 MB free)
    - Added warning about logging to built-in storage on RoboRIO 1
    - Reduced worst case memory usage
    - Improved file rename functionality to only use system time after it is updated by DS
    - NT publishers created before the log is started are now captured
    - Add delete without download functionality to DataLogTool
    - Changed default log location to logs subdirectory for better organization

- Hardware interfaces:

    - Getting timestamps is now ~10x faster
    - Exposed power rail disable and CPU temperature functionality
    - Exposed CAN timestamp base clock
    - Fixed and documented addressable LED timings
    - Fixed ``DutyCycleEncoder`` reset behavior
    - Added function to read the :term:`RSL` state
    - Raw :term:`PWM` now uses microseconds units
    - Fixed REVPH faults bitfield
    - C++: Fix ``Counter`` default distance per pulse to match Java

- Math:

    - Refactored kinematics, odometry, and pose estimator internals to have less code duplication; you can implement custom drivetrains via the ``Kinematics`` and ``Odometry`` interfaces and the ``PoseEstimator`` class.
    - LTV controllers use a faster DARE solver for faster construction (from 2.33 ms per solve on a roboRIO to 0.432 ms in Java and 0.188 ms in C++ on a roboRIO)
    - (Java) ``Rotation3d.rotateBy()`` got a 100x speed improvement by using doubles in Quaternion instead of EJML vectors
    - (Java) ``Pose3d.exp()`` and ``Pose3d.log()`` got a speed improvement by calling the C++ version through JNI instead of using EJML matrices
    - Improved accuracy of Rotation3d Euler angle calculations (``getX()``, ``getY()``, ``getZ()``, aka roll-pitch-yaw) near gimbal lock
    - Fixed ``CoordinateSystem.convert()`` Transform3d overload
    - Modified ``TrapezoidProfile`` API to not require creating new instances for ``ProfiledPIDController``-like use cases
    - Added Exponential motion profile support
    - Add constructor overloads for easier Transform2d and Transform3d creation from X, Y, Z coordinates
    - Add ``ChassisSpeeds`` ``fromRobotRelativeSpeeds`` to convert from robot relative to field relative
    - Add method to create a LinearSystem from kA and kV, for example from a characterized mechanism
    - Add ``SimulatedAnnealing`` class
    - Fixed MecanumDriveWheelSpeeds desaturate()

- Added ``RobotController`` function to get the assigned team number
- Updated ``GetMatchTime`` docs and units
- Added function to wait for DS connection
- Added reflection based cleanup helper
- Added Java class preloader (no preloading is actually performed yet)
- Deprecated ``Accelerometer`` and ``Gyro`` interfaces (no replacement is planned)
- Updated to OpenCV 4.8.0 and EJML 0.43.1 and C++ JSON to 3.11.2
- Add ``PS5Controller`` class
- Add accessors for ``AprilTagFieldLayout`` origin and field dimensions
- ArcadeDrive: Fix max output handling
- Add ``PWMSparkFlex`` Motor Controller
- ADIS16470: allow accessing all three axes
- Deprecated ``MotorControllerGroup``. Use ``PWMMotorController`` ``addFollower()`` method or if using CAN motor controllers use their method of following.
- Added functional inteface to ``DifferentialDrive`` and ``MecanumDrive``. The ``MotorController`` interface may be removed in the future to reduce coupling with vendor libraries. Instead of passing ``MotorController`` objects, the following method references or lambda expressions can be used:

    - Java: ``DifferentialDrive drive = new DifferentialDrive(m_leftMotor::set, m_rightMotor::set);``
    - C++: ``frc::DifferentialDrive m_drive{[&](double output) { m_leftMotor.Set(output); }, [&](double output) { m_rightMotor.Set(output); }};``

Breaking Changes
^^^^^^^^^^^^^^^^

- Changed ``DriverStation.getAllianceStation()`` to return optional value.  See :doc:`example usage </docs/software/basic-programming/alliancecolor>`
- Merged CommandBase into Command (Command is now a base class instead of an interface)
- Potentially breaking: made command scheduling order consistent
- Removed various deprecated command classes and functions:

    - ``PerpetualCommand`` and ``Command.perpetually()`` (use ``RepeatCommand``/``repeatedly()`` instead)
    - ``CommandGroupBase``, ``Command.IsGrouped()`` (C++ only), and ``Command.SetGrouped()`` (C++ only); the static factories have been moved to ``Commands``
    - ``Command.withInterrupt()``
    - ``ProxyScheduleCommand``
    - ``Button`` (use ``Trigger`` instead)
    - Old-style Trigger functions: ``whenActive()``, ``whileActiveOnce()``, ``whileActiveContinuous()``, ``whenInactive()``, ``toggleWhenActive()``, ``cancelWhenActive()``. Each binding type has both ``True`` and ``False`` variants; for brevity, only the ``True`` variants are listed here:
        - ``onTrue()`` (replaces ``whenActive()`` and ``whenPressed()``): schedule on rising edge.
        - ``whileTrue()`` (replaces ``whileActiveOnce()``): schedule on rising edge, cancel on falling edge.
        - ``toggleOnTrue()`` (replaces ``toggleWhenActive()``): on rising edge, schedule if unscheduled and cancel if scheduled.
        - ``cancelWhenActive()``: this is a fairly niche use case which is better described as having the trigger's rising edge (``Trigger.rising()``) as an end condition for the command (using ``Command.until()``).
        - ``whileActiveContinuously()``: however common, this relied on the :term:`no-op` behavior of scheduling an already-scheduled command. The more correct way to repeat the command if it ends before the falling edge is using ``Command.repeatedly()``/``RepeatCommand`` or a ``RunCommand`` -- the only difference is if the command is interrupted, but that is more likely to result in two commands perpetually canceling each other than achieve the desired behavior. Manually implementing a blindly-scheduling binding like ``whileActiveContinuously()`` is still possible, though might not be intuitive.
    - ``CommandScheduler.clearButtons()``
    - ``CommandScheduler.addButtons()`` (Java only)
    - Command supplier constructor of ``SelectCommand`` (use ``ProxyCommand`` instead)

- Removed ``Compressor.enabled()`` function (use ``isEnabled()`` instead)
- Removed ``CameraServer.setSize()`` function (use ``setResolution()`` on the camera object instead)
- Removed deprecated and broken SPI methods
- Removed 2-argument constructor to ``SlewRateLimiter``
- Removed ``frc2::PIDController`` alias (``frc::PIDController`` already existed)
- For ease of use, ``loadAprilTagFieldLayout()`` now throws an unchecked exception instead of a checked exception
- Add new parameter for ``ElevatorSim`` constructor for starting height
- Report error on negative PID gains

Simulation
----------

- Unified PWM simulation Speed, Position, and Raw values to be consistent with robot behavior
- Expanded DutyCycleEncoderSim API
- Added ability to set starting state of mechanism sims
- Added mechanism-specific SetState overloads to physics sims

SmartDashboard
--------------

.. important:: SmartDashboard is not supported on Apple Silicon (Arm64) Macs.

- Connection to the robot now always occurs after processing the save file. Fixes the problem that Choosers don't show up if connection to the robot happens before a chooser in the save file is processed
- Added LiveWindow widgets to containing subsystem widget when creating them from the save file
- Now properly handles putting the Scheduler on SmartDashboard with ``SmartDashboard.putData()``

Glass / OutlineViewer / Simulation GUI
--------------------------------------

- Include standard field images for Field2D background
- Enhanced array support in NetworkTables views
- Added background color selector to glass plots
- Added tooltips for NT settings
- Improved title bar message
- Fixed loading a maximized window on second monitor
- Fixed crash when clearing existing workspace
- Fixed file dialogs not closing after window closes
- add ProfiledPIDController support

GradleRIO
---------

- Use Java Serial GC by default
- Remove AlwaysPreTouch from Java arguments (reduces startup memory usage)
- Added support for XRP
- Enforces that vendor dependencies set correct frcYear (prevents using prior year vendor dependencies)
- Upgraded to Gradle 8.4
- Check that project isn't in OneDrive, as that causes issues

WPILib All in One Installer
---------------------------

- Update to VS Code 1.85.1
- VS Code extension updates: cpptools 1.19.1, javaext 1.26.0
- Use separate zip files for VS Code download/install
- Update to use .NET 8
- AdvantageScope is now bundlled by the installer

Visual Studio Code Extension
----------------------------

- Java source code is now bundled into the deployed jar file. This makes it possible to recover source code from a deployed robot program.
- Added XRP support
- Check that project isn't created in OneDrive, as that causes issues

RobotBuilder
------------

- Add POVButton
- Fixed constants aliasing
- Updated PCM references and wiring export for addition of REV PH

SysId
-----

- Removed project generation; Replaced with data logging within team robot program
