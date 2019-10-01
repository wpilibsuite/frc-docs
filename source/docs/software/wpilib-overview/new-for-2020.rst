New for 2020
============

A number of changes have been made to both C++ and Java WPILib for the 2020 season. This article will describe and provide a brief overview of the new changes and features.

frc-docs/ScreenSteps
--------------------

- ScreenSteps has been replaced with `frc-docs <https://docs.wpilib.org>`__. This change has largely been inspired by growing demands by the WPILib team. We hope that this move toward a community-led model will increase the quality of tutorials and documentation moving forward.

WPILib
------

There are many changes and additions to the main WPILib library for 2020. Most notably, there is a new version of the command-based framework with several major enhancements, a new (synchronous) PIDController, and kinematics classes have been added for closed loop driving. The full change log can be read below.

.. todo:: Add links to the specific usage guides for LinearDigitalFilter, and PIDController.

- The command-based framework has been rewritten. The design rationale behind the rewrite can be found `here <https://github.com/Oblarg/docs/blob/master/CommandRewriteDesignDoc.md>`__. The new version of the framework is located in the ``frc2`` namespace (C++) and the ``edu.wpi.first.wpilibj2`` package (Java).

- LinearDigitalFilter has been renamed to LinearFilter, and now has a ``Calculate()`` method which returns the filtered value

  - Takes a double in the ``Calculate()`` method instead of a ``PIDSource`` in the constructor
  - ``PIDGet()`` was replaced with ``Calculate()``
  - Both of these changes make it easy to compose the LinearFilter class with the new PIDController class

- PIDController has been rewritten; the old PIDController along with PIDSource and PIDOutput have been deprecated. The new version of PIDController is located in the ``frc2`` namespace (C++) and the ``edu.wpi.first.wpilibj2`` package (Java).

  - The new PIDController no longer runs asynchronously in a separate thread. This eliminates a major source of bugs for teams. Instead, teams should run the controller as part of their main periodic TimedRobot loop by calling ``Calculate()`` and passing the result to the motor’s ``Set()`` function. Note this means that the controller will run at the TimedRobot periodic rate.
  - Input range was replaced with ``EnableContinuousInput()`` and output range was replaced with integrator range.  If it’s necessary to clamp inputs or outputs to a range, use ``std::clamp()`` or ``wpiutil.MathUtils.clamp()`` on either the input or output of ``Calculate()`` as appropriate. To deal with steady-state error, use ProfiledPIDController instead of reducing the output range or having an integral term.
  - ``PIDSource`` is no longer used.  Instead, pass the sensor value directly to ``Calculate()``.
  - ``PIDOutput`` is no longer used.  Instead, call ``Set()`` with the output of ``Calculate()``.
  - Percent tolerance has been removed. Absolute tolerance is provided via ``SetTolerance()``.

- Added kinematics classes for Swerve, Mecanum, and DifferentialDrive. These classes can be used to implement closed loop driving of these drive types.
- Added odometry classes for Swerve, Mecanum, and DifferentialDrive. These are needed for closed loop feedback control on global pose (as opposed to just PID on the two drivetrain sides, which can accrue error since there are multiple ending positions a robot can be in for a given set of encoder measurements)
- Add RamseteController for closed loop feedback control on global pose for unicycles (the DifferentialDriveKinematics class can convert the chassis speeds to that of a differential drive)
- Real-time trajectory generation for 2 DOF trajectories (e.g., x and y position for a drivetrain)
- Added a PortForwarding class to allow forwarding a ports from a remote, to a client. This can be used when connecting to the roboRIO from USB and needing to access Ethernet content.
- Removed SampleRobot
- Made null checks on Java parameters more descriptive
- Removed deprecated LiveWindow functions
- Deprecated frc/WPILib.h. Instead,include only what you use.
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
  - Shims for GetName, SetName, GetSubsystem, and SetSubsystem have been added
to Command and Subsystem (both old and new), and also to SendableHelper to
prevent code breakage.
- Update to GCC 7, and use C++17
- Use OS for serial port instead of the NI driver

RobotBuilder
------------

- Updated to use the new Command-based framework

Shuffleboard
------------

- Ignore whitespace and capitalization for remotely defined settings
- Components in grids can now have location specified remotely
- Upper and lower bounds on graph X and Y axis can now be manually specified

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
