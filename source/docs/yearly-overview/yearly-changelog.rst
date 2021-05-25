.. include:: <isonum.txt>

New for 2021
============

A number of improvements have been made to FRC\ |reg| Control System software for 2021. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for C++/Java WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various `WPILib <https://github.com/wpilibsuite/>`__ GitHub repositories.

.. important:: Due to internal GradleRIO changes, it is necessary to update previous years projects. After :doc:`Installing WPILib for 2021 </docs/zero-to-robot/step-2/wpilib-setup>`, any 2020 projects must be :doc:`imported </docs/software/vscode-overview/importing-gradle-project>` to be compatible.

Major Features
--------------

- A hardware-level `WebSocket interface <https://github.com/wpilibsuite/allwpilib/blob/v2021.1.1/simulation/halsim_ws_core/doc/hardware_ws_api.md>`__ has been added to allow remote access to robot code being simulated in a desktop environment.

- Support for the :doc:`Romi </docs/romi-robot/index>` robot platform. Romi robot code runs in the desktop simulator environment and talks to the Romi via the new WebSocket interface.

- A new robot data visualizer -- :ref:`Glass <docs/software/dashboards/glass/index:Glass>` -- has been added. Glass has a similar UI to the simulator GUI and supports much of the same features; however, Glass can be used as a standalone dashboard and is not tied in to the robot program.

- The WPILib installer has been rewritten to support macOS and Linux and to improve ease of use.

  - The macOS installer is notarized, eliminating the need for Gatekeeper bypass.
  - Please see the :ref:`installation instructions <docs/zero-to-robot/step-2/wpilib-setup:WPILib Installation Guide>` as it differs from previous years.

- Added support for model-based control with Kalman filters, extended Kalman filters, unscented Kalman filters, and linear-quadratic regulators. See :ref:`Introduction to State-Space Control <docs/software/advanced-controls/state-space/state-space-intro:Introduction to State-Space Control>` for more information.

WPILib
------

Breaking Changes
^^^^^^^^^^^^^^^^

- ``curvature_t`` moved from ``frc`` to ``units`` namespace (C++)

- Trajectory constraint methods are now ``const`` in C++. Teams defining their own custom constraints should mark the ``MaxVelocity()`` and ``MinMaxAcceleration()`` methods as ``const``.

- The ``Field2d`` class (added midway through the 2020 season) was moved from the simulation package (``edu.wpi.first.wpilibj.simulation`` / ``frc/simulation/``) to the SmartDashboard package (``edu.wpi.first.wpilibj.smartdashboard`` / ``frc/SmartDashboard/``). This allows teams to send their robot position over NetworkTables to be viewed in Glass. The Field2d instance can be sent using ``SmartDashboard.putData("Field", m_field2d)`` / ``frc::SmartDashboard::PutData("Field", &m_field2d)`` or by using one of the :ref:`Shuffleboard methods <docs/software/dashboards/shuffleboard/layouts-with-code/sending-data:Sending sensors, motors, etc>`. This must be done in order to see the Field2d in the Simulator GUI.

- PWM Speed Controllers ``get()`` method has been modified to return the same value as was ``set()`` regardless of inversion. The value that still stakes into account the inversion can be retrieved with the ``getSpeed()`` method. This affects the following classes ``DMC60``, ``Jaguar``, ``PWMSparkMax``, ``PWMTalonFX``, ``PWMTalonSRX``, ``PWMVenom``, ``PWMVictorSPX``, ``SD540``, ``Spark``, ``Talon``, ``Victor``, and ``VictorSP`` classes.

New Command-Based Library
^^^^^^^^^^^^^^^^^^^^^^^^^

- Watchdog and epoch reporting has been added to the command scheduler. This will let teams know exactly which command or subsystem is responsible for a loop overrun if one occurs.

- Added a ``withName()`` command decorator for Java teams. This lets teams set the name of a particular command using the :ref:`decorator pattern <docs/software/commandbased/convenience-features:withName (Java only)>`.

- Added a ``NetworkButton`` class, allowing users to use a boolean ``NetworkTableEntry`` as a button to trigger commands.

- Added a ``simulationPeriodic()`` method to Subsystem. This method runs periodically during simulation, in addition to the regular ``periodic()`` method.

General Library
^^^^^^^^^^^^^^^

- Holonomic Drive Controller
  - A controller that teams with holonomic drivetrains (i.e. swerve and mecanum) can use to follow trajectories. This also supports custom ``Rotation2d`` heading inputs that are separate from the trajectory because heading dynamics are decoupled from translational movement in holonomic drivetrains.

- Added support for scheduling functions more often than the robot loop via ``addPeriodic()`` in TimedRobot. Previously, teams had to make a Notifier to run feedback controllers more often than the TimedRobot loop period of 20ms (running TimedRobot more often than this is not advised). Now, users can run feedback controllers more often than the main robot loop, but synchronously with the TimedRobot periodic functions so there aren't any thread safety issues. See an example :ref:`here <docs/software/convenience-features/scheduling-functions:Scheduling Functions at Custom Frequencies>`.

- Added a ``toggle()`` function to Solenoid and DoubleSolenoid.

- Added a ``SpeedControllerGroup`` constructor that takes a ``std::vector<>`` (C++) / ``SpeedController[]`` (Java), allowing the list to be constructed dynamically. (Teams shouldn't use this directly. This is only intended for bindings in languages like Python.)

- Added methods (``isOperatorControlEnabled()`` and ``isAutonomousEnabled()``) to check game and enabled state together.

- Added a ``ScopedTracer`` class for C++ teams to be able to time pieces of code. Simply instantiate the ``ScopedTracer`` at the top of a block of code and the time will be printed to the console when the instance goes out of scope.

- Added a static method ``fromHSV(int h, int s, int v)`` to create a ``Color`` instance from HSV values.

- Added RT priority constructor to ``Notifier`` in C++. This makes the thread backing the Notifier run at real-time priority, reducing timing jitter.

- Added a ``DriverStation.getInstance().isJoystickConnected(int)`` method to check if a joystick is connected to the Driver Station.

- Added a ``DriverStation.getInstance().silenceJoystickConnectionWarning(boolean)`` method to silence the warning when a joystick is not connected. This setting has no effect (i.e. warnings will continue to be printed) when the robot is connected to a real FMS.

- Added a constructor to ``Translation2d`` that takes in a distance and angle. This is effectively converting from polar coordinates to Cartesian coordinates.

- Added ``EllipticalRegionConstraint``, ``RectangularRegionConstraint``, and ``MaxVelocityConstraint`` to allow constraining trajectory velocity in a certain region of the field.

- Added equals() operator to the ``Trajectory`` class to compare two or more trajectories.

- Added zero-arg constructor to the ``Trajectory`` class in Java that creates an empty trajectory.

- Added a special exception to catch trajectory constraint misbehavior. This notifies users when user-defined constraints are misbehaving (i.e. min acceleration is greater than max acceleration).

- Added a ``getRotation2d()`` method to the ``Gyro`` interface. This method automatically takes care of converting from gyro conventions to geometry conventions.

- Added angular acceleration units for C++ teams. These are available in the ``<units/angular_acceleration.h>`` header.

- Added X and Y component getters in ``Pose2d`` - ``getX()`` and ``getY()`` in Java, ``X()`` and ``Y()`` in C++.

- Added implicit conversion from ``degree_t`` to ``Rotation2d`` in C++. This allows teams to use a degree value (i.e. ``47_deg``) wherever a ``Rotation2d`` is required.

- Fixed bug in path following examples where odometry was not being reset to the starting pose of the trajectory.

- Fixed some spline generation bugs for advanced users who were using control vectors directly.

- Fixed theta controller continuous input in swerve examples. This fixes the behavior where the shortest path is not used during drivetrain rotation.

- Deprecated ``units.h``, use individual :ref:`units headers <docs/software/basic-programming/cpp-units:Using the Units Library>` instead which speeds compile times.

Simulation
----------

- Added keyboard virtual joystick simulation support.
- Added Mechanism2D for visualizing mechanisms in simulation.
- Added simulation physics classes for common robot mechanisms (DrivetrainSim, ElevatorSim, SingleJointedArmSim, and FlywheelSim)

Shuffleboard
------------

- Number Slider now displays the text value
- Graphing Widget now uses ChartFX, a high performance graphing library
- Fixed decimal digit formatting with large numbers
- Size and position can now be set separately in the Shuffleboard API
- Analog Input can now be viewed with a Text Widget

SmartDashboard
--------------

- Host IP can be specified in configuration.

PathWeaver
----------

- Added support for reversed splines
- The coordinate system in the exported JSON has changed to be compatible with the simulator GUI. See :ref:`Importing a PathWeaver JSON <docs/software/wpilib-tools/pathweaver/integrating-robot-program:Importing a PathWeaver JSON>` for more information.

GradleRIO
---------

- Added a ``vendordep`` task for downloading vendor JSONs or fetching them from the user `wpilib` folder
- Added a ``gradlerio.vendordep.folder.path`` property to set a non-default location for the vendor JSON folder
- Renamed the ``wpi`` task (that prints current versions of WPILib and tools) to `wpiVersions`
- Added the ability to set environment variables during simulation

   - To set the environment variable ``HALSIMWS_HOST`` use:

      .. code:: groovy

         sim {
           envVar "HALSIMWS_HOST", "10.0.0.2"
         }

CSCore
------

- Now only lists streamable devices on Linux platforms.

Visual Studio Code Extension
----------------------------

- Visual Studio Code has been updated to 1.52.1
- Updated Java and C++ language extensions
- Driverstation sim extension is now enabled by default
- Project importer now retains the commands version used in the original project
- Clarified the text on the new project and project importer screens
- Fixed import corrupting binary files
- Fixed link order in C++ ``build.gradle`` projects
- Updated "Change Select Default Simulate Extension Setting" command to work with multiple sim extensions

RobotBuilder
------------

- Updated to be compatible with the new command based framework and PID Controller.

   - Due to the major changes in templates, RobotBuilder will not accept a save file from a previous year. You must regenerate the yaml save file and export to a new directory.
   - A version of RobotBuilder that still exports to the old command based framework has included with the installer and is called RobotBuilder-Old

- C++: use uniform initialization of objects in header
- C++: fixed case of includes so that code compiles on case-sensitive filesystems
- Use project name as default for save file
- Fixed export of wiring file
- Fixed line-endings for scripts so they work on MacOS/Linux
- Added XboxController

Robot Characterization
----------------------

- Added LQR latency compensation
- The tool backend was improved to be more approachable for developers. Configuration and JSON files from the old tool will no longer work with the new version.
- Deploy code in a new thread to avoid causing the GUI to hang.
