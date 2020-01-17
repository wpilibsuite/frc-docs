New for 2020
============

A number of improvements have been made to FRC Control System software for 2020. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for C++/Java WPILib changes.

.. important:: Due to internal GradleRIO changes, it is necessary to update previous years projects. After :doc:`Installing WPILib for 2020 </docs/getting-started/getting-started-frc-control-system/wpilib-setup>`, any 2019 projects must be :doc:`imported </docs/software/wpilib-overview/importing-gradle-project>` to be compatible.

Major Features - All Languages
------------------------------

- **Addressable LEDs** - The roboRIO FPGA has been enhanced to be able to control individually addressable LEDs (WS2812 or compatible protocol) from the roboRIO PWM ports (non-MXP). Teams can connect the signal line of these LEDs directly to the roboRIO PWM signal line and control them from APIs in all three languages. Depending on the length of the LED string and whether any servos are also being powered from the PWM ports, teams may be able to power the string directly from the PWM port or may need to use an external supply.
- **Duty Cycle Encoder** - The roboRIO FPGA has been enhanced to be able to decode the signals from Duty Cycle encoders (this includes devices like the US Digital MA3, CTRE Mag Encoder, and REV Robotics Through Bore Encoder). Teams can connect these devices to the DIO ports on the roboRIO and access the encoder data via APIs in all three languages.
- **CAN Bus Internal Restructure** - The internal implementation of the CAN bus has changed to reduce the latency incurred by CAN bus calls from robot programs. Team programs, particularly those with many CAN calls, should see reduced and more consistent loop timing with the new implementation. No team action is needed to take advantage of this change, the changes are limited to internal implementation. Users may notice changes in how some tools like the CTRE Phoenix Tuner work as a consequence of the restructure.
- **Control Packet Caching** - A change has been made to the internals of how control packet data (such as Joystick data, current mode, etc.) is retrieved, resulting in reduced latency in these calls. The user-facing API has not changed, users will see this benefit without making any changes to their programs.
- **Documentation** - If you're on this page, you're likely aware that the software documentation has moved from Screensteps to this new FRC-Docs page. This open source documentation, hosted on Read the Docs, allows for a greater number of contributors (including community contribution) as well as new features such as testable example code (to ensure example code remains correct as library changes are made), better support for localization, and more. For the 2020 season, KOP part documentation can still be found on `Screensteps <https://wpilib.screenstepslive.com/s/4485>`__

Major Features - C++/Java
-------------------------
More complete details on all of these changes can be found in the changelog below (under **WPILib**).

- **Command Based Framework Rewrite** - A new version of the Command Based framework has been written from the ground up based on the years of experience with the previous framework. Both frameworks will be available as options in 2020 and have been split out as "vendor libraries" (though they are still included in the WPILib installer) in order to reduce the chances of mixing the two which will not work correctly.
- **PID Controller Rewrite** - A new synchronous PID controller class has been written that is structured in a way that makes it simpler to compose with other higher level classes such as filters, motion profiles, kinematics and more. The new PID Controller is located in a new package to maintain separation from the existing implementation.
- **High level controls & Trajectory generation** - A number of new classes have been added to assist teams with higher level controls including kinematics, odometry, and trajectory generation. In addition to the characterization GUI mentioned below this should allow teams a much easier entry to high level control of mechanisms included drivetrains (with smooth trajectories), arms, and elevators.
- **Robot Characterization Tool** - This new tool helps teams characterize their mechanical systems (currently supports drivetrains, elevators, and arms) to help tune control loops. Combined with the new controls classes this should enable teams to follow an end-to-end solution for autonomous trajectory following.
- **Simulation GUI** - A basic simulation GUI has been implemented allowing teams to visualize outputs and control basic inputs when simulating code on their desktop. While vendor support at Kickoff is expected to be limited, we hope this will expand in the future.


WPILib
------

There are many changes and additions to the main WPILib library for 2020. Most notably, there is a new version of the command-based framework with several major enhancements, a new (synchronous) PIDController, a GUI simulator, and kinematics classes have been added for closed loop driving. The full change log can be read below.

.. todo:: Add links to the specific usage guides for LinearDigitalFilter, and PIDController.

- The command-based framework has been rewritten. The design rationale behind the rewrite can be found `here <https://github.com/wpilibsuite/design-docs/blob/master/CommandRewriteDesignDoc.md>`__. The new version of the framework is located in the ``frc2`` namespace (C++) and the ``edu.wpi.first.wpilibj2`` package (Java).
- The command-based frameworks are now separate vendor libraries, rather then built into WPILib itself.

- LinearDigitalFilter has been renamed to LinearFilter, and now has a ``Calculate()`` method which returns the filtered value

  - Takes a double in the ``Calculate()`` method instead of a ``PIDSource`` in the constructor
  - ``PIDGet()`` was replaced with ``Calculate()``
  - Both of these changes make it easy to compose the LinearFilter class with the new PIDController class

- PIDController has been rewritten; the old PIDController along with PIDSource and PIDOutput have been deprecated. The new version of PIDController is located in the ``frc2`` namespace (C++) and the ``edu.wpi.first.wpilibj2`` package (Java) while the deprecated version remains in the old namespace and package.

  - The new PIDController no longer runs asynchronously in a separate thread. This eliminates a major source of bugs for teams. Instead, teams should run the controller as part of their main periodic TimedRobot loop by calling ``Calculate()`` and passing the result to the motor’s ``Set()`` function. Note this means that the controller will run at the TimedRobot periodic rate.
  - Input range was replaced with ``EnableContinuousInput()`` and output range was replaced with integrator range.  If it’s necessary to clamp inputs or outputs to a range, use ``std::clamp()`` or ``wpiutil.MathUtils.clamp()`` on either the input or output of ``Calculate()`` as appropriate. To deal with steady-state error, use ProfiledPIDController instead of reducing the output range or having an integral term.
  - ``PIDSource`` is no longer used.  Instead, pass the sensor value directly to ``Calculate()``.
  - ``PIDOutput`` is no longer used.  Instead, call ``Set()`` with the output of ``Calculate()``.
  - Percent tolerance has been removed. Absolute tolerance is provided via ``SetTolerance()``.

- Added kinematics classes for Swerve, Mecanum, and DifferentialDrive. These classes can be used to implement closed loop driving of these drive types.
- Added odometry classes for Swerve, Mecanum, and DifferentialDrive. These are needed for closed loop feedback control on global pose (as opposed to just PID on the two drivetrain sides, which can accrue error since there are multiple ending positions a robot can be in for a given set of encoder measurements)
- Add RamseteController for closed loop feedback control on global pose for unicycles (the DifferentialDriveKinematics class can convert the chassis speeds to that of a differential drive)
- (C++) Add frc2::Timer which is unit safe
- Real-time trajectory generation for 2 DOF trajectories (e.g., x and y position for a drivetrain)
- Added a PortForwarding class to allow forwarding ports from a remote, to a client. This can be used when connecting to the roboRIO from USB and needing to access Ethernet content.
- Added an interactive GUI for desktop simulation of robot code.  The GUI provides DS-like controls for operating mode and joystick input and provides live display/control of virtual hardware inputs and outputs.
- Removed SampleRobot
- Made null checks on Java parameters more descriptive
- Removed deprecated LiveWindow functions
- Deprecated frc/WPILib.h. Instead, include only what you use.
- Removed deprecated shim header files for wpilibc and llvm.
- Added low-level geometry classes: Pose2d, Rotation2d, Transform2d, Translation2d
- Added C++ units library. This library provides type safety, which makes it impossible to mix up units (e.g. pass seconds as meters) and also provides automatic unit conversion. The units can be specified in literals using a suffix, e.g. ``1.0_s`` for 1 second.
- Added Java units utility functions for unit conversions. This provides a set of common unit conversions (e.g. feet to meters). Unlike C++, the Java library does not provide type safety; this was done for performance reasons.
- Added TrapezoidProfile class for 1 degree-of-freedom (DOF) trajectories
- Added ProfiledPIDController class. Given a goal, this class constrains the setpoint movement over time to a max velocity and acceleration.
- Moved the CircularBuffer/circular_buffer classes from wpilib to wpiutil
- Deprecated the GearTooth class. Based on usage reporting, no teams have used this class in the last several years. The Counter class can be used directly instead.
- Deprecated the Filter class. Since PIDSource is deprecated, it no longer serves a purpose. Teams should use the derived classes of Filter directly rather than using polymorphism.
- Added the PWMSparkMax class for PWM control of the REV Robotics SPARK MAX Motor Controller
- Simplified the Sendable interface and deprecated SendableBase. The name and subsystem have been removed from individual objects, and instead this data is stored in a new singleton class, SendableRegistry. Much of LiveWindow has been refactored into SendableRegistry.

  - In C++, a new CRTP helper class, SendableHelper, has been added to provide move and destruction functionality.
  - Shims for GetName, SetName, GetSubsystem, and SetSubsystem have been added to Command and Subsystem (both old and new), and also to SendableHelper to prevent code breakage.

- Update to GCC 7, and use C++17
- Use OS for serial port instead of the NI driver
- IterativeRobot template has been removed
- Add support for Addressable LEDs, such as WS2812's and NeoPixels
- Add support for DutyCycle inputs, such as the absolute output on many FRC encoders
- Eigen has been added to C++, and EJML has been added to Java to support linear algebra and matrix calculations. These are included by default, with no need to add anything to your robot project to use them.
- Jackson has been added to Java for JSON support. C++ support already existed with json library in the wpi header root. These can be used with no need to add anything to your robot project.
- The location that maven artifacts are published has changed to: https://frcmaven.wpi.edu/artifactory/release/

Shuffleboard
------------

- Ignore whitespace and capitalization for remotely defined settings
- Components in grids can now have location specified remotely
- Upper and lower bounds on graph X and Y axis can now be manually specified
- Small numbers will properly be shown in number fields using scientific notation.
- Allow widget titles to be hidden
- Added a documentation link in the about dropdown

FRC Raspberry Pi Image
----------------------

- Updated to work on Raspberry Pi 4
- Updated to use Raspbian Buster
- Added CPU temperature to system status screen

SmartDashboard
--------------

- Properly parses special characters in MJPEG urls

PathWeaver
----------

- Updated to output WPILib splines
- Now shows an error alert when configuration screen is invalid

OutlineViewer
-------------

- Fixed the initial settings dialog (it was too small on some platforms)
- Fixed array editor

GradleRIO
---------

- Fixed JRE slowdown when using ``concat()`` on Strings.
- Fixed JRE slowdown on garbage collection.

CScore
------

- Fixed cscore compatibility with OpenCV 4 (mainly useful for coprocessors)
- Fixed setting exposure on PS3eye cameras

WPILib All in One Installer
---------------------------

- Use ``wpilib\2020\`` instead of ``frc2020\``. This prevents cluttering the user’s home directory when installing alongside previous years’ installation.
- Fixed an issue where shortcuts would get created for installed tools, even if it was unchecked.
- Installing for **All Users** will now create shortcuts for all users, instead of only the current one.
- Update to latest Visual Studio Code and C++/Java extensions

Visual Studio Code Extension
----------------------------

- Added a 2019 to 2020 project importer
- Add a window for a simple way to grab all project information
- Add built in way to open and display API docs

RobotBuilder
------------

- Use individual includes instead of wpilib.h for C++
- Add export of PWMSparkMax, PWMTalonFX, PWMVenom
- Extensions are now stored in ~/wpilib/2020/Robotbuilder/extensions
- GUI for defining Command Groups was removed for maintainability reasons. Commands can be added in VS Code.

Robot Characterization
----------------------

- Introduced the robot characterization toolsuite.
