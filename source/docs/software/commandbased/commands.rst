# Commands

**Commands** represent actions the robot can take. Commands run when scheduled, until they are interrupted or their end condition is met.  Commands are represented in the command-based library by the ``Command`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html)) or the ``Command`` class in ``commands2`` library (:external:py:class:`Python <commands2.Command>`).

## The Structure of a Command

Commands specify what the command will do in each of its possible states. This is done by overriding the ``initialize()``, ``execute()``, and ``end()`` methods. Additionally, a command must be able to tell the scheduler when (if ever) it has finished execution - this is done by overriding the ``isFinished()`` method. All of these methods are defaulted to reduce clutter in user code: ``initialize()``, ``execute()``, and ``end()`` are defaulted to simply do nothing, while ``isFinished()`` is defaulted to return false (resulting in a command that never finishes naturally, and will run until interrupted).

### Initialization

The ``initialize()`` method ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#initialize()), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#ad3f1971a1b44ecdd4683d766f831bccd), :external:py:meth:`Python <commands2.Command.initialize>`) marks the command start, and is called exactly once per time a command is scheduled. The ``initialize()`` method should be used to place the command in a known starting state for execution. Command objects may be reused and scheduled multiple times, so any state or resources needed for the command's functionality should be initialized or opened in ``initialize`` (which will be called at the start of each use) rather than the constructor (which is invoked only once on object allocation). It is also useful for performing tasks that only need to be performed once per time scheduled, such as setting motors to run at a constant speed or setting the state of a solenoid actuator.

### Execution

The ``execute()`` method ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#execute()), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#a7d7ea1271f7dcc65c0ba3221d179b510), :external:py:meth:`Python <commands2.Command.execute>`) is called repeatedly while the command is scheduled; this is when the scheduler’s ``run()`` method is called (this is generally done in the main robot periodic method, which runs every 20ms by default). The execute block should be used for any task that needs to be done continually while the command is scheduled, such as updating motor outputs to match joystick inputs, or using the output of a control loop.

### Ending

The ``end(bool interrupted)`` method ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#end(boolean)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#a134eda3756f00c667bb5415b23ee920c), :external:py:meth:`Python <commands2.Command.end>`) is called once when the command ends, whether it finishes normally (i.e. ``isFinished()`` returned true) or it was interrupted (either by another command or by being explicitly canceled). The method argument specifies the manner in which the command ended; users can use this to differentiate the behavior of their command end accordingly. The end block should be used to "wrap up" command state in a neat way, such as setting motors back to zero or reverting a solenoid actuator to a "default" state. Any state or resources initialized in ``initialize()`` should be closed in ``end()``.

### Specifying end conditions

The ``isFinished()`` method ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#end(boolean)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#af5e8c12152d195a4f3c06789366aac88), :external:py:meth:`Python <commands2.Command.isFinished>`) is called repeatedly while the command is scheduled, whenever the scheduler’s ``run()`` method is called. As soon as it returns true, the command’s ``end()`` method is called and it ends. The ``isFinished()`` method is called after the ``execute()`` method, so the command will execute once on the same iteration that it ends.

## Command Properties

In addition to the four lifecycle methods described above, each ``Command`` also has three properties, defined by getter methods that should always return the same value with no side affects.

### getRequirements

Each command should declare any subsystems it controls as requirements. This backs the scheduler's resource management mechanism, ensuring that no more than one command requires a given subsystem at the same time. This prevents situations such as two different pieces of code attempting to set the same motor controller to different output values.

Declaring requirements is done by overriding the ``getRequirements()`` method in the relevant command class, by calling ``addRequirements()``, or by using the ``requirements`` vararg (Java) / ``Requirements`` struct (C++) parameter / ``requirements`` argument (Python) at the end of the parameter list of most command constructors and factories in the library:

.. tab-set-code::

  ```java
  Commands.run(intake::activate, intake);
  ```

  ```c++
  frc2::cmd::Run([&intake] { intake.Activate(); }, {&intake});
  ```

  ```python
  commands2.cmd.run(intake.activate, intake)
  ```

As a rule, command compositions require all subsystems their components require.

### runsWhenDisabled

The ``runsWhenDisabled()`` method ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#runsWhenDisabled()), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#a5113cbf3655ce8679dd48bf22700b2f4), :external:py:meth:`Python <commands2.Command.runsWhenDisabled>`) returns a ``boolean``/``bool`` specifying whether the command may run when the robot is disabled. With the default of returning ``false``, the command will be canceled when the robot is disabled and attempts to schedule it will do nothing. Returning ``true`` will allow the command to run and be scheduled when the robot is disabled.

.. important::  When the robot is disabled, :term:`PWM` outputs are disabled and CAN motor controllers may not apply voltage, regardless of ``runsWhenDisabled``!

This property can be set either by overriding the ``runsWhenDisabled()`` method in the relevant command class, or by using the ``ignoringDisable`` decorator ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#ignoringDisable(boolean)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#acc67b15e71a66aafb7523ccdd0a7a834), :external:py:meth:`Python <commands2.Command.ignoringDisable>`):

.. tab-set-code::

  ```java
  Command mayRunDuringDisabled = Commands.run(() -> updateTelemetry()).ignoringDisable(true);
  ```

  ```c++
  frc2::CommandPtr mayRunDuringDisabled = frc2::cmd::Run([] { UpdateTelemetry(); }).IgnoringDisable(true);
  ```

  ```python
  may_run_during_disabled = commands2.cmd.run(lambda: update_telemetry()).ignoring_disable(True)
  ```

As a rule, command compositions may run when disabled if all their component commands set ``runsWhenDisabled`` as ``true``.

### getInterruptionBehavior

The ``getInterruptionBehavior()`` method ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#getInterruptionBehavior()), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#ab1e027e86fc5c9132914ca566a9845a8), :external:py:meth:`Python <commands2.Command.getInterruptionBehavior>`) defines what happens if another command sharing a requirement is scheduled while this one is running. In the default behavior, ``kCancelSelf``, the current command will be canceled and the incoming command will be scheduled successfully. If ``kCancelIncoming`` is returned, the incoming command's scheduling will be aborted and this command will continue running. Note that ``getInterruptionBehavior`` only affects resolution of requirement conflicts: all commands can be canceled, regardless of ``getInterruptionBehavior``.

.. note:: This was previously controlled by the ``interruptible`` parameter passed when scheduling a command, and is now a property of the command object.

This property can be set either by overriding the ``getInterruptionBehavior`` method in the relevant command class, or by using the `withInterruptBehavior()` decorator ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#withInterruptBehavior(edu.wpi.first.wpilibj2.command.Command.InterruptionBehavior)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#a6583f966509478a29e7764a72c4bf177), :external:py:meth:`Python <commands2.Command.withInterruptBehavior>`)

.. tab-set-code::

  ```java
  Command noninteruptible = Commands.run(intake::activate, intake).withInterruptBehavior(Command.InterruptBehavior.kCancelIncoming);
  ```

  ```c++
  frc2::CommandPtr noninterruptible = frc2::cmd::Run([&intake] { intake.Activate(); }, {&intake}).WithInterruptBehavior(Command::InterruptBehavior::kCancelIncoming);
  ```

  ```python
  non_interruptible = commands2.cmd.run(intake.activate, intake).with_interrupt_behavior(Command.InterruptBehavior.kCancelIncoming)
  ```

As a rule, command compositions are ``kCancelIncoming`` if all their components are ``kCancelIncoming`` as well.

## Included Command Types

The command-based library includes many pre-written command types. Through the use of :ref:`lambdas <docs/software/commandbased/index:Lambda Expressions (Java)>`, these commands can cover almost all use cases and teams should rarely need to write custom command classes. Many of these commands are provided via static factory functions in the ``Commands`` utility class (Java), in the ``frc2::cmd`` namespace defined in the ``Commands.h`` header (C++), or in the ``commands2.cmd`` namespace (Python). In Java and C++, classes inheriting from ``Subsystem`` also have instance methods that implicitly require ``this``.

### Running Actions

The most basic commands are actions the robot takes: setting voltage to a motor, changing a solenoid's direction, etc. For these commands, which typically consist of a method call or two, the command-based library offers several factories to be construct commands inline with one or more lambdas to be executed.

The ``runOnce`` factory, backed by the ``InstantCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/InstantCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_instant_command.html), :external:py:class:`Python <commands2.InstantCommand>`) class, creates a command that calls a lambda once, and then finishes.

.. tab-set::

  .. tab-item:: Java
      :sync: tabcode-java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined/subsystems/HatchSubsystem.java
        :language: java
        :lines: 25-35
        :lineno-match:

  .. tab-item:: C++ (Header)
      :sync: tabcode-c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/include/subsystems/HatchSubsystem.h
        :language: c++
        :lines: 20-28
        :lineno-match:

  .. tab-item:: C++ (Source)
      :sync: tabcode-c++-source

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/subsystems/HatchSubsystem.cpp
        :language: c++
        :lines: 15-25
        :lineno-match:

  .. tab-item:: Python
      :sync: tabcode-python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/HatchbotInlined/subsystems/hatchsubsystem.py
        :language: python
        :lines: 24-34
        :lineno-match:

The ``run`` factory, backed by the ``RunCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/RunCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_run_command.html), :external:py:class:`Python <commands2.RunCommand>`) class, creates a command that calls a lambda repeatedly, until interrupted.

.. tab-set-code::

  ```java
  // A split-stick arcade command, with forward/backward controlled by the left
  // hand, and turning controlled by the right.
  new RunCommand(() -> m_robotDrive.arcadeDrive(
      -driverController.getLeftY(),
      driverController.getRightX()),
      m_robotDrive)
  ```

  ```c++
  // A split-stick arcade command, with forward/backward controlled by the left
  // hand, and turning controlled by the right.
  frc2::RunCommand(
    [this] {
      m_drive.ArcadeDrive(
          -m_driverController.GetLeftY(),
          m_driverController.GetRightX());
    },
    {&m_drive})
  ```

  ```python
  # A split-stick arcade command, with forward/backward controlled by the left
  # hand, and turning controlled by the right.
  commands2.cmd.run(lambda: robot_drive.arcade_drive(
      -driver_controller.get_left_y(),
      driver_controller.get_right_x()),
      robot_drive)
      ```

The ``startEnd`` factory, backed by the ``StartEndCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/StartEndCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_start_end_command.html), :external:py:class:`Python <commands2.StartEndCommand>`) class, calls one lambda when scheduled, and then a second lambda when interrupted.

.. tab-set-code::

  ```java
  Commands.startEnd(
      // Start a flywheel spinning at 50% power
      () -> m_shooter.shooterSpeed(0.5),
      // Stop the flywheel at the end of the command
      () -> m_shooter.shooterSpeed(0.0),
      // Requires the shooter subsystem
      m_shooter
  )
  ```

  ```c++
  frc2::cmd::StartEnd(
    // Start a flywheel spinning at 50% power
    [this] { m_shooter.shooterSpeed(0.5); },
    // Stop the flywheel at the end of the command
    [this] { m_shooter.shooterSpeed(0.0); },
    // Requires the shooter subsystem
    {&m_shooter}
  )
  ```

  ```python
  commands2.cmd.start_end(
     # Start a flywheel spinning at 50% power
     lambda: shooter.shooter_speed(0.5),
     # Stop the flywheel at the end of the command
     lambda: shooter.shooter_speed(0.0),
     # Requires the shooter subsystem
     shooter)
  ```

``FunctionalCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/FunctionalCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_functional_command.html), :external:py:class:`Python <commands2.FunctionalCommand>`) accepts four lambdas that constitute the four command lifecycle methods: a ``Runnable``/``std::function<void()>/Callable`` for each of ``initialize()`` and ``execute()``, a ``BooleanConsumer``/``std::function<void(bool)>/Callable[bool,[]]`` for ``end()``, and a ``BooleanSupplier``/``std::function<bool()>/Callable[[],bool]`` for ``isFinished()``.

.. tab-set-code::

  ```java
  new FunctionalCommand(
      // Reset encoders on command start
      m_robotDrive::resetEncoders,
      // Start driving forward at the start of the command
      () -> m_robotDrive.arcadeDrive(kAutoDriveSpeed, 0),
      // Stop driving at the end of the command
      interrupted -> m_robotDrive.arcadeDrive(0, 0),
      // End the command when the robot's driven distance exceeds the desired value
      () -> m_robotDrive.getAverageEncoderDistance() >= kAutoDriveDistanceInches,
      // Require the drive subsystem
      m_robotDrive
  )
  ```

  ```c++
  frc2::FunctionalCommand(
    // Reset encoders on command start
    [this] { m_drive.ResetEncoders(); },
    // Start driving forward at the start of the command
    [this] { m_drive.ArcadeDrive(ac::kAutoDriveSpeed, 0); },
    // Stop driving at the end of the command
    [this] (bool interrupted) { m_drive.ArcadeDrive(0, 0); },
    // End the command when the robot's driven distance exceeds the desired value
    [this] { return m_drive.GetAverageEncoderDistance() >= kAutoDriveDistanceInches; },
    // Requires the drive subsystem
    {&m_drive}
  )
  ```

  ```python
    commands2.cmd.functional_command(
      # Reset encoders on command start
      lambda: robot_drive.reset_encoders(),
      # Start driving forward at the start of the command
      lambda: robot_drive.arcade_drive(ac.kAutoDriveSpeed, 0),
      # Stop driving at the end of the command
      lambda interrupted: robot_drive.arcade_drive(0, 0),
      # End the command when the robot's driven distance exceeds the desired value
      lambda: robot_drive.get_average_encoder_distance() >= ac.kAutoDriveDistanceInches,
      # Require the drive subsystem
      robot_drive)
  ```

To print a string and ending immediately, the library offers the ``Commands.print(String)``/``frc2::cmd::Print(std::string_view)``/``commands2.cmd.print(String)`` factory, backed by the ``PrintCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/PrintCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_print_command.html), :external:py:class:`Python <commands2.PrintCommand>`) subclass of ``InstantCommand``.

### Waiting

Waiting for a certain condition to happen or adding a delay can be useful to synchronize between different commands in a command composition or between other robot actions.

To wait and end after a specified period of time elapses, the library offers the ``Commands.waitSeconds(double)``/``frc2::cmd::Wait(units::second_t)``/``commands2.cmd.wait(float)`` factory, backed by the ``WaitCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/WaitCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_wait_command.html), :external:py:class:`Python <commands2.WaitCommand>`) class.

.. tab-set-code::

  ```java
  // Ends 5 seconds after being scheduled
  new WaitCommand(5.0)
  ```

  ```c++
  // Ends 5 seconds after being scheduled
  frc2::WaitCommand(5.0_s)
  ```

  ```python
  # Ends 5 seconds after being scheduled
  commands2.cmd.wait(5.0)
  ```

To wait until a certain condition becomes ``true``, the library offers the ``Commands.waitUntil(BooleanSupplier)``/``frc2::cmd::WaitUntil(std::function<bool()>)`` factory, backed by the ``WaitUntilCommand`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/WaitUntilCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_wait_until_command.html), :external:py:class:`Python <commands2.WaitUntilCommand>`).

.. tab-set-code::

  ```java
  // Ends after m_limitSwitch.get() returns true
  new WaitUntilCommand(m_limitSwitch::get)
  ```

  ```c++
  // Ends after m_limitSwitch.Get() returns true
  frc2::WaitUntilCommand([&m_limitSwitch] { return m_limitSwitch.Get(); })
  ```

  ```python
  # Ends after limit_switch.get() returns True
  commands2.cmd.wait_until(limit_switch.get)
  ```

### Control Algorithm Commands

There are commands for various control setups:

- ``TrapezoidProfile`` tracks a trapezoid motion profile. For more info, see :doc:`/docs/software/commandbased/profile-subsystems-commands`.

- ``MecanumControllerCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/MecanumControllerCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_mecanum_controller_command.html)) is useful for controlling mecanum drivetrains. See API docs and the **MecanumControllerCommand** ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mecanumcontrollercommand), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/MecanumControllerCommand)) example project for more info.

- ``SwerveControllerCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/SwerveControllerCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_swerve_controller_command.html)) is useful for controlling swerve drivetrains. See API docs and the **SwerveControllerCommand** ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/swervecontrollercommand), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/SwerveControllerCommand)) example project for more info.

- ``RamseteCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/RamseteCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_ramsete_command.html)) is useful for path following with differential drivetrains ("tank drive"). See API docs and the :ref:`Trajectory Tutorial<docs/software/pathplanning/trajectory-tutorial/creating-following-trajectory:Creating the RamseteCommand>` for more info.

## Custom Command Classes

Users may also write custom command classes. As this is significantly more verbose, it's recommended to use the more concise factories mentioned above.

.. note:: In the C++ API, a :term:`CRTP` is used to allow certain Command methods to work with the object ownership model.  Users should always extend the ``CommandHelper`` [class](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_helper.html) when defining their own command classes, as is shown below.

To write a custom command class, subclass the abstract ``Command`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html)) or ``CommandHelper`` ([C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command.html)), as seen in the command-based template ([Java](https://github.com/wpilibsuite/allwpilib/blob/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/commandbased/commands/ExampleCommand.java), [C++](https://github.com/wpilibsuite/allwpilib/blob/main/wpilibcExamples/src/main/cpp/templates/commandbased/include/commands/ExampleCommand.h)):

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/commandbased/commands/ExampleCommand.java
      :language: java
      :lines: 7-24
      :lineno-match:

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/templates/commandbased/include/commands/ExampleCommand.h
      :language: c++
      :lines: 5-31
      :lineno-match:

## Simple Command Example

What might a functional command look like in practice? As before, below is a simple command from the HatchBot example project ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional)) that uses the ``HatchSubsystem``:

.. tab-set::

  .. tab-item:: Java
    :sync: tabcode-java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/commands/GrabHatch.java
      :language: java
      :lines: 5-
      :lineno-match:

  .. tab-item:: C++ (Header)
    :sync: tabcode-c++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/commands/GrabHatch.h
      :language: c++
      :lines: 5-
      :lineno-match:

  .. tab-item:: C++ (Source)
    :sync: tabcode-c++-source

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/commands/GrabHatch.cpp
      :language: c++
      :lines: 5-
      :lineno-match:

  .. tab-item:: Python
    :sync: tabcode-python

    .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/HatchbotTraditional/commands/grabhatch.py
      :language: python
      :lines: 7-
      :lineno-match:

Notice that the hatch subsystem used by the command is passed into the command through the command’s constructor. This is a pattern called :term:`dependency injection`, and allows users to avoid declaring their subsystems as global variables. This is widely accepted as a best-practice - the reasoning behind this is discussed in a :doc:`later section <structuring-command-based-project>`.

Notice also that the above command calls the subsystem method once from initialize, and then immediately ends (as ``isFinished()`` simply returns true). This is typical for commands that toggle the states of subsystems, and as such it would be more succinct to write this command using the factories described above.

What about a more complicated case? Below is a drive command, from the same example project:

.. tab-set::

  .. tab-item:: Java
    :sync: tabcode-java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/commands/DefaultDrive.java
      :language: java
      :lines: 5-
      :lineno-match:

  .. tab-item:: C++ (Header)
    :sync: tabcode-c++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/commands/DefaultDrive.h
      :language: c++
      :lines: 5-
      :lineno-match:

  .. tab-item:: C++ (Source)
    :sync: tabcode-c++-source

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/commands/DefaultDrive.cpp
      :language: c++
      :lines: 5-
      :lineno-match:

  .. tab-item:: Python
    :sync: tabcode-python

    .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/HatchbotTraditional/commands/defaultdrive.py
      :language: python
      :lines: 7-
      :lineno-match:

And then usage:

.. tab-set-code::

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/RobotContainer.java
    :language: java
    :lines: 59-67
    :lineno-match:

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/RobotContainer.cpp
    :language: c++
    :lines: 57-60
    :lineno-match:

  .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/HatchbotTraditional/robotcontainer.py
    :language: python
    :lines: 65-72
    :lineno-match:

Notice that this command does not override ``isFinished()``, and thus will never end; this is the norm for commands that are intended to be used as default commands. Once more, this command is rather simple and calls the subsystem method only from one place, and as such, could be more concisely written using factories:

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined/RobotContainer.java
      :language: java
      :lines: 51-60
      :lineno-match:

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/RobotContainer.cpp
      :language: c++
      :lines: 52-58
      :lineno-match:

    .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/HatchbotInlined/robotcontainer.py
      :language: python
      :lines: 53-65
      :lineno-match:
