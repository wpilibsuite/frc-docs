New for 2020
============

WPILib developers have done a number of changes to the control system for the 2020 season. This article will describe and provide a brief overview of the new changes and features.

frc-docs/ScreenSteps
--------------------

- ScreenSteps has been replaced with `frc-docs <https://docs.wpilib.org>`__. This change has largely been inspired by growing demands by the WPILib team. We hope that this move toward a community-led model will increase the quality of tutorials and documentation moving forward.
- Code examples are testable again WPILib releases, ensuring they are working and accurate.
- Link Checking. Every link in frc-docs gets the link tested to ensure validity.

WPILib
------

The core WPILib library has received many changes. These include rewrites to major part of the core library, as well as a suite of kinematics to improve closed loop driving. The full change log can be read below.

.. todo:: Add links to the specific usage guides for LinearDigitalFilter, and PIDController.

- CommandBased has been rewritten from the ground up. The explanation on why can be found `here <https://github.com/Oblarg/docs/blob/master/CommandRewriteDesignDoc.md>`__.
- LinearDigitalFilter has been renamed to LinearFilter, and now has a ``Calculate()`` method which returns the filtered value.
  - Takes a double in the ``Calculate()`` method instead of a ``PIDSource`` in the constructor.
  - ``PIDGet()`` was replaced with ``Calculate()``.
- PIDController has been rewritten from the ground up.

  - No longer runs asynchronously. Async has been a footgun for a large majority of teams, and a more robust method of synchronization (e.g., message passing) will be investigated for 2021.
  - Input range was replaced with ``EnableContinuousInput()`` and output range was replaced with integrator range. The user can use ``std::clamp()`` or ``wpiutil.MathUtils.clamp()`` to clamp inputs and outputs. (Users should use ProfiledPIDController instead of reducing the output range or having an integral sterm to deal with steady-state error.
  - Takes a double in ``Calculate`` instead of ``PIDSource``.
  - ``PIDOutput`` is now redundant because users can call ``Set()`` themselves with the output of ``Calculate()``.
  - PercentTolerance has been removed. Teams should use absolute tolerance instead via ``SetTolerance()``.

- Added kinematics classes for Swerve, Mecanum, and DifferentialDrive. This allows for more complete closed loop driving of these drive types.
- Added odometry classes for Swerve, Mecanum, and DifferentialDrive. These are needed for closed loop feedback control on global pose (as opposed to just PID on the two drivetrain sides, which can accrue error since there are multiple ending positions a robot can be in for a given set of encoder measurements)
- [**NOT YET MERGED**] Add RamseteController for closed loop feedback control on global pose for unicycles (the DifferentialDriveKinematics class can convert the chassis speeds to that of a differential drive)
- [**NOT YET MERGED**] Real-time trajectory generation for 2 DOF trajectories (e.g., x and y position for a drivetrain)
- Sample Robot has been removed.
- Descriptive null checking for Java parameters.
- Remove deprecated live window functions.
- frc/WPILib.h has been deprecated. Teams should instead directly include what they use.
- Removed deprecated shim header files for wpilibc and llvm.
- Introduce geometry classes: Pose2d, Rotation2d, Transform2d, Translation2d
- Units (C++) and Units utility classes (Java) have been added to safely convert between functions that take different types of units.
- Add TrapezoidProfile class for 1 DOF trajectories (one degree of freedom like x position)
- Add ProfiledPIDController class. Given a goal, it constrains the setpoint movement over time to a max velocity and acceleration.
- CircularBuffer/circular_buffer was moved from wpilib to wpiutil
- Uses ``wpilib\2020\`` instead of ``frc2020\``.
- GearTooth class has been deprecated as no teams can be recorded using this sensor. If usage is needed, teams can use the Counter class directly.
- Filter class has been deprecated. Since PIDSource is deprecated, it serves no purpose. Teams should use any derived classes of Filter directly rather than using polymorphism.

.. note:: IterativeRobot has not been removed as the WPILib team observes that having packet based robot control can be useful in certain instances. IterativeRobot may receive a rewrite in the feature to better expand on these capabilities.

RobotBuilder
------------

- Various dependency updates.
- Exports using the new CommandBased rewrite.

Shuffleboard
------------

- Ignore whitespace and capitalization for remotely defined settings.
- Components in grids can have location specified remotely.
- Users can manually specify upper and lower bounds on graph X and Y axis.

OutlineViewer
-------------

- Fix for JavaFX alert dialog being too small.
- Fix bug preventing array edits.
- Update dependencies.

GradleRIO
---------

- Fix JRE slowdown when using ``concat()`` on Strings.
- Fix JRE slowdown on garbage collection.

CScore
------

- Fix CScore build with OpenCV 4.
