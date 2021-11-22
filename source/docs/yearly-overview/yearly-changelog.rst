.. include:: <isonum.txt>

New for 2022
============

.. important:: Due to the large number of breaking and substantial changes between 2021 and 2022, it is advised that existing teams thoroughly read this document!

A number of improvements have been made to FRC\ |reg| Control System software for 2022. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for Java/C++ WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various `WPILib <https://github.com/wpilibsuite/>`__ GitHub repositories. WPILib recognizes that some of these changes may cause teams issues in the short term upgrading. We expect it to pay off over the long term as we better improve the internals of WPILib.

Due to internal GradleRIO changes, it is necessary to update previous years projects. After :doc:`Installing WPILib for 2022 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2020 or 2021 projects must be :doc:`imported </docs/software/vscode-overview/importing-gradle-project>` to be compatible.

Major Changes (Java/C++)
------------------------

These changes contain *some* of the major changes to the library that it's important for the user to recognize. This does not include all of the breaking changes, see the other sections of this document for more changes.

- Drive class functions such as ``DifferentialDrive`` **no longer invert** the right side by default. Please use ``setInverted`` on your motor controllers to invert the right side to maintain the same behavior
- Old Command-Based has been removed from the list of new templates in VS Code. Please migrate to the new Command-Based library. The Old Command Based remains available to support existing code.
- IterativeRobot has been removed. Please use the TimedRobot template instead

WPILib
------

General Library
^^^^^^^^^^^^^^^

- Rewrite :doc:`Mechanism2d </docs/software/dashboards/glass/mech2d-widget>` to utilize NetworkTables
- Improved the error message when a program crashes
- Added support for DMA to Java
- Added ``TimesliceRobot`` project template. This allows users to timeslice schedule periodic functions
- Added C++ TankDrive example
- Added ``PS4Controller`` controller class
- Added better message for when an I2C port is out of range
- Added ``Debouncer`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj/Debouncer.html>`__/ `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_debouncer.html>`__) class. This helps with filtering rising and falling edges when dealing with boolean values
- Added ``PneumaticHub`` class for use with the REV Pneumatic Hub
- GenericHID has been updated to static functions to use for non-defined controller types.
- ``XboxController`` has migrated away from taking arguments in functions and instead has functions with no arguments. An example conversion is below:
  - ``controller.getTriggerAxis(GenericHID.Hand.kLeft)`` -> ``controller.getLeftTriggerAxis()``
  - ``controller.getX(GenericHID.Hand.kLeft)`` -> ``controller.getLeftX()``

-  ``getInstance()`` functions in ``CameraServer``, ``DriverStation``, ``LiveWindow``, ``Preferences``, ``SendableRegistry``, have been deprecated and replaced with static functions
- ``Timer::HasPeriodPassed()`` and ``Timer.hasPeriodPassed()`` have been deprecated. Use ``AdvanceIfElapsed()`` instead

Breaking Changes
^^^^^^^^^^^^^^^^

- ``PDP`` is now ``PowerDistribution``
- Various ``PCM`` related classes (Solenoid, Compressor) now require a ``PneumaticsModuleType`` to support either the CTRE Pneumatics Control Module or REV Pneumatic Hub. Vendor specific methods have been moved to the ``PneumaticsControlModule`` or ``PneumaticHub`` classes
- Sendable has been broken up into NetworkTables components (called NTSendable\*, ``nt`` namespace) and non-NetworkTables components (moved to wpiutil, ``wpi`` namespace). This will make it easier for vendors and external libraries to integrate Sendable
- ``InterruptableSendableBase`` has been broken up into ``AsynchronousInterrupt`` & ``SynchronousInterrupt``. Rather then a class, like ``DigitalInput`` extending ``InterruptableSendableBase`` and all interrupt methods being accessed through the ``DigitalInput``, teams should instead construct ``AsynchronousInterrupt`` or ``SynchronousInterrupt``, and pass it the ``DigitalSource`` (e.g. ``DigitalInput``).
- C++: ``DriverStation.ReportWarning`` and ``DriverStation.ReportError`` have been removed. Use ``FRC_ReportError`` in ``frc\Errors.h`` header. Status of ``frc::err::Error`` can be used for Errors and ``frc::warn::Warning`` can be used for warnings.
- ``SpeedController`` has been renamed to ``MotorController``
  - Various portions of the API still refers to ``SpeedController`` for backwards compatibility. Users should pass ``MotorController`` instead

- Several duplicate ``SpeedController`` methods have been removed. Use ``set`` instead of ``setSpeed``. Use ``disable`` instead of ``setDisable``. Several low level methods have been removed: position, bounds, periodMultiplier, zeroLatch, and raw methods. Use the ``PWM`` class directly if this level of control is needed.
- Various DriverStation In[Mode] functions has been renamed (IE: ``InDisabled`` -> ``inDisabled``)
- Deprecated ``wpilibj.cameraserver`` has been removed. Use ``cameraserver`` instead
- Deprecated ``RobotDrive`` has been removed. Use ``DifferentialDrive`` instead
- Deprecated ``GearTooth`` has been removed. Use the ``Counter`` class instead
- C++: Deprecated ``WPILib.h`` has been removed. Please only include what you need
- C++: ``wpi::StringRef`` is replaced with ``std::string_view``. This is a drop in replacement in most cases
- C++: ``wpi::ArrayRef`` is replaced with ``wpi::span``. This is a modified backport of the C++20 ``std::span``
- C++: ``wpi::Twine`` is replaced with `fmtlib <https://fmt.dev/latest/index.html>`__. It has more features and is standard in C++20
- C++: ``wpi::sys::path`` is replaced with ``fs::path`` from ``#include <wpi/fs.h>`` which is based on ``std::filesystem``
- C++: ``frc::filesystem`` methods have been simplified to return ``std::string``, rather then using a pointer parameter
- C++: ``wpi::math`` is replaced with ``wpi::numbers`` which is based on C++20 ``std::numbers``.
- C++: Support for ``std::cout`` was removed from units because ``<iostream>`` has significant compile-time overhead. Use `fmtlib <https://fmt.dev/latest/index.html>`__ instead, an analog for C++20's ``std::format()`` (e.g., ``fmt::print("{}", 2_m)``). The units headers automatically include fmtlib. If you still want to use ``std::cout``, call ``value()`` on the variable being printed (e.g., ``std::cout << velocity.value()``).

.. dropdown:: Various C++ classes have migrated to use units. Below are a list of effected classes.

   - ``Ultrasonic``
   - ``CommandScheduler``
   - ``CommandState``
   - ``WaitUntilCommand``
   - ``MecanumControllerCommand``
   - ``RamseteCommand``
   - ``SwerveControllerCommand``
   - ``TrapezoidProfileCommand``
   - ``WaitCommand``
   - ``Command`` (Old Commands)
   - ``CommandGroup`` (Old Commands)
   - ``CommandGroupEntry`` (Old Commands)
   - ``TimedCommand`` (Old Commands)
   - ``WaitCommand`` (Old Commands)
   - ``WaitForChildren`` (Old Commands)
   - ``WaitUntilCommand`` (Old Commands)
   - ``Counter``
   - ``CounterBase``
   - ``DriverStation``
   - ``Encoder``
   - ``InterruptableSensorBase``
   - ``MotorSafety``
   - ``Notifier``
   - ``SPI``
   - ``SerialPort``
   - ``SlewRateLimiter``
   - ``Solenoid``
   - ``Timer``
   - ``Watchdog``

Package Renames
~~~~~~~~~~~~~~~

We have committed to several organizational renames that will allow us greater flexible with new classes in the future. The VS Code project importer will update existing projects to use the new packages/headers.

- Several packages moved from ``wpilibj`` to ``math``: ``controller``, ``estimator``, ``geometry``, ``kinematics``, ``math``, ``spline``, ``system``, ``trajectory``
- ``wpiutil.math`` was moved to ``math``
- ``wpiutil`` is now ``util``
- ``SlewRateLimiter``, ``LinearFilter``, and ``MedianFilter`` now live in ``math.filters``
- ``Timer`` has moved from ``frc2`` to ``frc``
- Motor controllers (``VictorSPX``, ``PWMSparkMax``, etc) have been moved to a ``motorcontrol`` package.
- ``edu.wpi.cscore`` has moved to ``edu.wpi.first.cscore``

Simulation
----------

- No new changes

Shuffleboard
------------

- Add widget for ``Field2d``
- Add icons to widget layouts
- Add titles for widgets
- Show exit save prompt only if not saved
- Use system menubar
- Add tab clear confirmation
- Save widget titles display mode preference
- Fix: CameraServer streams

SmartDashboard
--------------

- No new changes

Glass
-----

- No new changes

Axon
----

We have made a new tool for machine learning in the FIRST Robotics Competition. Axon allows users to view and create datasets, train machine learning models, test your models within the browser-based GUI, and export them for use on a Raspberry Pi. Detecting complex objects (such as hatch panels and other robots) has never been easier and an end-to-end user guide is available in the :doc:`WPILib docs </docs/software/wpilib-tools/axon/index>`. Axon provides the functionality to train machine learning models to recognize any object you want (defined in a homemade dataset), or generic objects such as cats, airplanes, and hot dogs.

Axon is a replacement for the previous AWS-based Jupyter Notebook solution released in the 2019 season. Axon has a smooth installation and user experience overall, and a much more friendly GUI for beginners and experts alike.

Running machine learning models on the WPILib Raspberry Pi image has never been easier either; the new Python script for the Pi features time-synchronous NetworkTables data streaming, as well as a better quality live inference MJPEG stream.

PathWeaver
----------

- No new changes

GradleRIO
---------

- Gradle has been updated to version 7.2
- Internals of GradleRIO have been updated to be easier to read, more maintainable and easier for advanced teams to modify.
- Deployment is more customizable

cscore
------

- The supported OpenCV version has been bumped to OpenCV4

OutlineViewer
-------------

OutlineViewer has been updated to be C++ based using the ImGui library. This makes OutlineViewer more maintainable and performant.

.. important:: The Java version of OutlineViewer is discontinued and is no longer supported!

WPILib All in One Installer
---------------------------

- Visual Studio Code has been updated to 1.62
- Updated Java and C++ language extensions
- Fix Linux desktop icon permissions

Visual Studio Code Extension
----------------------------

.. important:: The project importer will only import 2020/2021 projects!

- Project Importer has been updated for the 2022 season. The project importer will attempt update the imported code, but manual changes may still be necessary due to the complexity of the breaking changes this year.
- Remove Eclipse Project Importer
- Fix chcp not found warning during simulation on Windows
- Add additional information to the project information command display

RobotBuilder
------------

.. important:: Due to project file changes, Robotbuilder will not import yaml save files from 2021 or earlier.

- Update to compile with WPILib 2022 (remove RobotDrive and GearTooth), update PID Controllers, and pneumatics
- Improve type detection to detect changes in certain C++ types that were not previously detected as changes
- Add project setting to enable or disable desktop support
- Fix Java export of DoubleSolenoid, RobotDrive4, MecanumDrive, and Killough drive to avoid extra local copy
- Fix C++ export of ConditionalCommand
- Don’t validate timeout parameters that are less than 0

SysID
-----

:doc:`SysId </docs/software/pathplanning/robot-characterization/index>` is a fully featured system characterization utility that supersedes frc-characterization. It features an easy-to-use interface, advanced graphing analytics, Romi integration and other cool features!.

.. important:: frc-characterization is discontinued and is no longer supported!
