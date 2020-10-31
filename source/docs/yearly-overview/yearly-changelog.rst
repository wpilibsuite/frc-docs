New for 2021
============

A number of improvements have been made to FRC Control System software for 2021. This article will describe and provide a brief overview of the new changes and features as well as a more complete changelog for C++/Java WPILib changes. This document only includes the most relevant changes for end users, the full list of changes can be viewed on the various `WPILib <https://github.com/wpilibsuite/>`__ GitHub repositories.

Major Features (All Languages)
------------------------------

- A WebSocket interface has been added to allow remote access to the robot simulator

Major Features (Java/C++)
-------------------------

- **Holonomic Drive Controller**
  - A controller that teams with holonomic drivetrains (i.e. swerve and mecanum) can use to follow trajectories. This also supports custom ``Rotation2d`` heading inputs that are separate from the trajectory because heading dynamics are decoupled from translational movement in holonomic drivetrains.

WPILib
------

New Command-Based Library
^^^^^^^^^^^^^^^^^^^^^^^^^

- Watchdog and epoch reporting has been added to the command scheduler. This will let teams know exactly which command or subsystem is responsible for a loop overrun if one occurs.

- A withName() command decorator has been added for Java teams. This lets teams set the name of a particular command using the `decorator pattern <docs/software/commandbased/convenience-features:Command Decorator Features>`.

- Added a ``NetworkButton`` class, allowing users to use a boolean ``NetworkTableEntry`` as a button to trigger commands.

- Added a ``simulationPeriodic()`` method to Subsystem. This method runs periodically during simulation, in addition to the regular ``periodic()`` method.

Scheduling Functions
^^^^^^^^^^^^^^^^^^^^

- Added support for scheduling functions more often than the robot loop via ``addPeriodic()`` in TimedRobot. Previously, teams had to make a Notifier to run feedback controllers more often than the TimedRobot loop period of 20ms (running TimedRobot more often than this is not advised). Now, users can run feedback controllers more often than the main robot loop, but synchronously with the TimedRobot periodic functions so there aren't any thread safety issues.

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Robot {
                private Joystick m_joystick = new Joystick(0);
                private Encoder m_encoder = new Encoder(1, 2);
                private Spark m_motor = new Spark(1);
                private PIDController m_controller = new PIDController(1.0, 0.0, 0.5, 0.01);

                public Robot() {
                    addPeriodic(() -> {
                        m_motor.set(m_controller.calculate(m_encoder.getRate()));
                    }, 0.01, 0.01);
                }

                @Override
                public teleopPeriodic() {
                    if (m_joystick.getRawButtonPressed(1)) {
                        if (m_controller.getSetpoint() == 0.0) {
                            m_controller.setSetpoint(30.0);
                        } else {
                            m_controller.setSetpoint(0.0);
                        }
                    }
                }

    .. group-tab:: C++ (Header)

        .. code-block:: cpp

            class Robot {
                private:
                    frc::Joystick m_joystick{0};
                    frc::Encoder m_encoder{1, 2};
                    frc::Spark m_motor{1};
                    frc2::PIDController m_controller{1.0, 0.0, 0.5, 10_ms};

                    Robot();

                    void TeleopPeriodic() override;

    .. group-tab:: C++ (Source)

        .. code-block:: cpp

            void Robot::Robot() {
                AddPeriodic([&] {
                    m_motor.Set(m_controller.Calculate(m_encoder.GetRate()));
                }, 10_ms, 10_ms);
            }

            void Robot::TeleopPeriodic() {
                if (m_joystick.GetRawButtonPressed(1)) {
                    if (m_controller.GetSetpoint() == 0.0) {
                        m_controller.SetSetpoint(30.0);
                    } else {
                        m_controller.SetSetpoint(0.0);
                    }
                }
            }

teleopPeriodic() in this example runs every 20ms, and the controller update is run every 10ms with an offset of 10ms from when TeleopPeriodic() runs so that their timeslots don't conflict.

General Library
^^^^^^^^^^^^^^^

- Added a ``toggle()`` function to Solenoid and DoubleSolenoid. For example,

.. tabs::

    .. code-tab:: java

       if (button.getRawButtonPressed(1)) {
          solenoid.set(!solenoid.get());
       }

    .. code-tab:: cpp

       if (button.GetRawButtonPressed(1)) {
          solenoid.Set(!solenoid.Get());
       }

can be replaced with

.. tabs::

   .. code-tab:: java

      if (button.getRawButtonPressed(1)) {
         solenoid.toggle();
      }

   .. code-tab:: cpp

      if (button.GetRawButtonPressed(1)) {
         solenoid.Toggle();
      }

- Added a ``SpeedControllerGroup`` constructor that takes a ``std::vector<>`` (C++) / ``SpeedController[]`` (Java), allowing the list to be constructed dynamically. (Teams shouldn't use this directly. This is only intended for bindings in languages like Python.)

- Added methods (``isOperatorControlEnabled()`` and ``isAutonomousEnabled()``) to check game and enabled state together.

- Added a ``ScopedTracer`` class for C++ teams to be able to time pieces of code. Simply instantiate the ``ScopedTracer`` at the top of a block of code and the time will be printed to the console when the instance goes out of scope.

- Added a static method ``fromHSV(int h, int s, int v)`` to create a ``Color`` instance from HSV values.

- Added RT priority constructor to ``Notifier`` in C++. This makes the thread backing the Notifier run at real-time priority, reducing timing jitter.

- Added a constructor to ``Translation2d`` that takes in a distance and angle. This is effectively converting from polar coordinates to Cartesian coordinates.

- Added ``EllipticalRegionConstraint``, ``RectangularRegionConstraint``, and ``MaxVelocityConstraint`` to allow constraining trajectory velocity in a certain region of the field.

- Added equals() operator to the ``Trajectory`` class to compare two or more trajectories.

- Added zero-arg constructor to the ``Trajectory`` class in Java that creates an empty trajectory.

- Added a special exception to catch trajectory constraint misbehavior. This notifies users when user-defined constraints are misbehaving (i.e. min acceleration is greater than max acceleration).

- Added a ``getRotation2d()`` method to the ``Gyro`` interface. This method automatically takes care of converting from gyro conventions to geometry conventions.

- Added angular acceleration units for C++ teams. These are available in the ``<units/angular_acceleration.h>`` header.

- Added X and Y component getters in ``Pose2d`` - ``getX()`` and ``getY()`` in Java, ``X()`` and ``Y()`` in C++.

- Added implicit conversion from ``degree_t`` to ``Rotation2d`` in C++. This allows teams to use a degree value (i.e. ``47_deg``) wherever a ``Rotation2d`` is required.

- Fixed some spline generation bugs for advanced users who were using control vectors directly.

- Fixed theta controller continuous input in swerve examples. This fixes the behavior where the shortest path is not used during drivetrain rotation.

- Deprecated ``units.h``, use individual units headers instead which speeds compile times.

- Added support for model-based control with Kalman filters, extended Kalman filters, unscented Kalman filters, and linear-quadratic regulators. See https://docs.wpilib.org/en/latest/docs/software/advanced-controls/state-space/state-space-intro.html for more.

Breaking Changes
^^^^^^^^^^^^^^^^

- ``curvature_t`` moved from ``frc`` to ``units`` namespace (C++)

- Trajectory constraint methods are now ``const`` in C++. Teams defining their own custom constraints should mark the ``MaxVelocity()`` and ``MinMaxAcceleration()`` methods as ``const``.

Simulation
----------

- Added joystick simulation support.
- Added Mechanism2D for simulating mechanisms.
- Added simulation physics classes for common robot mechanisms (DrivetrainSim, ElevatorSim, SingleJointedArmSim, and FlywheelSim)

Shuffleboard
------------

- Number Slider now displays the text value
- Graphing Widget now uses ChartFX, a high performance graphing library
- Fix decimal digit formatting with large numbers
- Size and position can now be set separately in the Shuffleboard API

SmartDashboard
--------------

- Host IP can be specified in configuration.

PathWeaver
----------

- Added support for reversed splines

GradleRIO
---------

- Added a ``vendordep`` task for downloading vendor JSONs or fetching them from the user `wpilib` folder
- Added a ``gradlerio.vendordep.folder.path`` property to set a non-default location for the vendor JSON folder
- Renamed the ``wpi`` task (that prints current versions of WPILib and tools) to `wpiVersions`

CSCore
------

- Now only lists streamable devices on Linux platforms.

WPILib All in One Installer
---------------------------

- Rewrote to support macOS and Linux, and to be easier to use
  - Installer is notarized on macOS, no need for Gatekeeper bypass steps.

Visual Studio Code Extension
----------------------------

- Updated Java and C++ language extensions
- Driverstation sim extension is enabled by default

RobotBuilder
------------

- Updated to be compatible with the new command based framework and PID Controller
- C++: use uniform initialization of objects in header
- C++: fix case of includes so that code compiles on case-sensitive filesystems

Robot Characterization
----------------------

- Added LQR latency compensation
