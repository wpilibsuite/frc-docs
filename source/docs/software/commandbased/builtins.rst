WPILib Command Classes
======================

The command-based library includes a variety of pre-written commands for most use cases, most of them intended to be used "out-of-the-box" via inlining. A list of the included pre-made commands with brief examples can be found below, grouped by functionality type. For more rigorous documentation about specific classes, see the API docs (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/package-summary.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_command.html>`__).

.. important:: It is recommended not to inherit from these classes and override their methods; not calling the class's version of the method may crash code in ways that are challenging to diagnose.

Running Actions
---------------

The most basic commands are actions the robot takes: setting voltage to a motor, changing a solenoid's direction, etc. For these commands, which typically consist of a method call or two, the command-based library offers several classes to be constructed inline with one or more lambdas to be executed.

InstantCommand
^^^^^^^^^^^^^^

``InstantCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/InstantCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_instant_command.html>`__) executes a single action on initialization, and then ends immediately.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined/RobotContainer.java
      :language: java
      :lines: 90-95
      :linenos:
      :lineno-start: 90

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/include/RobotContainer.h
      :language: c++
      :lines: 66-68
      :linenos:
      :lineno-start: 66

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/RobotContainer.cpp
      :language: c++
      :lines: 35-40
      :linenos:
      :lineno-start: 35

RunCommand
^^^^^^^^^^

``RunCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/RunCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_run_command.html>`__) accepts a single ``Runnable``/``std::function<void()>`` lambda that is called every scheduler loop until the command is interrupted -- the command has no natural end condition; one can be added using :ref:`docs/software/commandbased/decorators:until`.

.. tabs::

  .. code-tab:: java

    // A split-stick arcade command, with forward/backward controlled by the left
    // hand, and turning controlled by the right.
    new RunCommand(() -> m_robotDrive.arcadeDrive(
        -driverController.getLeftY(),
        driverController.getRightX()),
        m_robotDrive)

  .. code-tab:: c++

    // A split-stick arcade command, with forward/backward controlled by the left
    // hand, and turning controlled by the right.
    frc2::RunCommand(
      [this] {
        m_drive.ArcadeDrive(
            -m_driverController.GetLeftY(),
            m_driverController.GetRightX());
      },
      {&m_drive}))

StartEndCommand
^^^^^^^^^^^^^^^

``StartEndCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/StartEndCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_start_end_command.html>`__) accepts two ``Runnable``/``std::function<void()>`` lambdas, the first is executed once when the command is scheduled and the second is executed when the command is interrupted (the command has no natural end condition).

.. tabs::

  .. code-tab:: java

    new StartEndCommand(
        // Start a flywheel spinning at 50% power
        () -> m_shooter.shooterSpeed(0.5),
        // Stop the flywheel at the end of the command
        () -> m_shooter.shooterSpeed(0.0),
        // Requires the shooter subsystem
        m_shooter
    )

  .. code-tab:: c++

    frc2::StartEndCommand(
      // Start a flywheel spinning at 50% power
      [this] { m_shooter.shooterSpeed(0.5); },
      // Stop the flywheel at the end of the command
      [this] { m_shooter.shooterSpeed(0.0); },
      // Requires the shooter subsystem
      {&m_shooter}
    )

FunctionalCommand
^^^^^^^^^^^^^^^^^

``FunctionalCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/FunctionalCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_functional_command.html>`__) accepts four lambdas that constitute the four command lifecycle methods: a ``Runnable``/``std::function<void()>`` for each of ``initialize()`` and ``execute()``, a ``BooleanConsumer``/``std::function<void(bool)>`` for ``end()``, and a ``BooleanSupplier``/``std::function<bool()>`` for ``isFinished()``.

.. tabs::

  .. code-tab:: java

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

  .. code-tab:: c++

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

PrintCommand
^^^^^^^^^^^^

``PrintCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/PrintCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_print_command.html>`__) is a subclass of ``InstantCommand`` for printing a string and ending immediately.

.. tabs::

  .. code-tab:: java

     new PrintCommand("This message will be printed!")

  .. code-tab:: c++

     frc2::PrintCommand("This message will be printed!")


Determining Commands at Runtime
-------------------------------

Sometimes it's desired to run a command out of a few options based on sensor feedback or other data known only at runtime. This can be useful for determining an auto routine, or running a different command based on whether a game piece is present or not, and so on.

SelectCommand
^^^^^^^^^^^^^

For this, ``SelectCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/SelectCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_select_command.html>`__) accepts a map of commands and a generic selector, or a ``Supplier<Command>``.

.. note:: While the Java version of ``SelectCommand`` simply uses an ``Object`` as a key, the C++ version is templated on the key type.

.. note:: The ``Supplier<Command>`` overload cannot infer requirements, so the user must be responsible for manually adding the requirements to the SelectCommand.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/selectcommand/RobotContainer.java
       :language: java
       :lines: 20-45
       :linenos:
       :lineno-start: 20

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/SelectCommand/include/RobotContainer.h
       :language: c++
       :lines: 25-44
       :linenos:
       :lineno-start: 25

ConditionalCommand
^^^^^^^^^^^^^^^^^^

``ConditionalCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/ConditionalCommand.html>`__,`C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_conditional_command.html>`__) is a specialized version of ``SelectCommand`` that decides between two commands using a boolean condition.

.. tabs::

  .. code-tab:: java

    // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
    new ConditionalCommand(commandOnTrue, commandOnFalse, m_limitSwitch::get)

  .. code-tab:: c++

    // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
    frc2::ConditionalCommand(commandOnTrue, commandOnFalse, [&m_limitSwitch] { return m_limitSwitch.Get(); })


Waiting For Delays
------------------

Waiting for a certain condition to happen or adding a delay can be useful to synchronize between different commands in a command group or between other robot actions.

WaitCommand
^^^^^^^^^^^

``WaitCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/WaitCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_wait_command.html>`__) does nothing and ends after a specified period of time elapses.

.. tabs::

  .. code-tab:: java

    // Ends 5 seconds after being scheduled
    new WaitCommand(5.0)

  .. code-tab:: c++

    // Ends 5 seconds after being scheduled
    frc2::WaitCommand(5.0_s)

WaitUntilCommand
^^^^^^^^^^^^^^^^

``WaitUntilCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/WaitUntilCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_wait_until_command.html>`__) does nothing, ending once a specified condition becomes true or once a specified match time passes.

.. warning:: The match timer used by WaitUntilCommand does *not* provide an official match time! While it is fairly accurate, use of this timer can *not* guarantee the legality of your robot's actions.

.. tabs::

  .. code-tab:: java

    // Ends after the 60-second mark of the current match
    new WaitUntilCommand(60.0)

    // Ends after m_limitSwitch.get() returns true
    new WaitUntilCommand(m_limitSwitch::get)

  .. code-tab:: c++

    // Ends after the 60-second mark of the current match
    frc2::WaitUntilCommand(60.0_s)

    // Ends after m_limitSwitch.Get() returns true
    frc2::WaitUntilCommand([&m_limitSwitch] { return m_limitSwitch.Get(); })

In combination with ``ParallelRaceGroup`` or ``ParallelDeadlineGroup``, this can be used to replace a command's end condition or add another one. In fact, that is what the ``until()`` decorator does under the hood.

Scheduling Other Commands
-------------------------

By default, commands in command groups are run *through* the command group, and are never themselves seen by the scheduler. Accordingly, their requirements are added to the group's requirements. While this is usually fine, sometimes it is undesirable for the entire command group to gain the requirements of a single command. A good solution is to "fork off" from the command group and schedule that command separately.

``ScheduleCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/ScheduleCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_schedule_command.html>`__) schedules a specified command and ends instantly.

.. tabs::

  .. code-tab:: java

    // Schedules commandToSchedule when run
    new ScheduleCommand(commandToSchedule)

  .. code-tab:: c++

    // Schedules commandToSchedule when run
    frc2::ScheduleCommand(&commandToSchedule)

``ProxyScheduleCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/ProxyScheduleCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_proxy_schedule_command.html>`__) is very similar: it schedules a specified command, but does not end until that command ends. In the case of "forking off" from a command group, this allows the group to track the command's progress without it being in the group.

.. tabs::

  .. code-tab:: java

    // Schedules commandToSchedule when run, does not end until commandToSchedule is no longer scheduled
    new ProxyScheduleCommand(new WaitCommand(5.0))
        .andThen(new PrintCommand("This will only be printed after the 5-second delay elapses!"))

  .. code-tab:: c++

    // Schedules commandToSchedule when run, does not end until commandToSchedule is no longer scheduled
    frc2::ProxyScheduleCommand(frc2::WaitCommand(5.0_s))
        .AndThen(frc2::PrintCommand("This will only be printed after the 5-second delay elapses!"))

``ProxyScheduleCommand`` can also be created using the ``.asProxy()`` decorator.

Running Command Continuously
----------------------------

``RepeatCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/RepeatCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_repeat_command.html>`__) runs a command continuously by restarting the command every time it ends. For example, a common use case for this is in combination with ``SequentialCommandGroup`` to achieve a sequence of commands that returns to the first command once the last one ends.

.. tabs::
  .. code-tab:: java

    new RepeatCommand(new FunctionalCommand(
        // initialize()
        () -> System.out.println("This will be called many times!"),
        // execute
        () -> System.out.println("This will be called many times!"),
        // end
        interrupted -> System.out.println("This will be called many times!"),
        // isFinished
        () -> {
            System.out.println("This will be called many times!");
            return true;
        })
    )

  .. code-tab:: c++

    frc2::RepeatCommand(frc2::FunctionalCommand(
        // initialize()
        []{ wpi::outs() << "This will be called many times!",
        // execute
        []{ wpi::outs() << "This will be called many times!",
        // end
        [](bool interrupted){ wpi::outs() << "This will be called many times!",
        // isFinished
        []{
            wpi::outs() << "This will be called many times!";
            return true;
        })
    )

``RepeatCommand`` can also be created using the ``.repeatedly()`` decorator.

Running Multiple Commands
-------------------------

Running multiple commands in series or parallel as part of a process such as an autonomous routine is very useful. See :ref:`docs/software/commandbased/command-groups:Command Groups` for more info.

Control Algorithm Commands
--------------------------

There are commands for various control setups:

- ``PIDCommand`` uses a PID controller. For more info, see :ref:`docs/software/commandbased/pid-subsystems-commands:PIDCommand`.

- ``TrapezoidProfileCommand`` tracks a trapezoid motion profile. For more info, see :ref:`docs/software/commandbased/profile-subsystems-commands:TrapezoidProfileCommand`.

- ``ProfiledPIDCommand`` combines PID control with trapezoid motion profiles. For more info, see :ref:`docs/software/commandbased/profilepid-subsystems-commands:ProfiledPIDCommand`.

- ``MecanumControllerCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/MecanumControllerCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_mecanum_controller_command.html>`__) is useful for controlling mecanum drivetrains. See API docs and the **MecanumControllerCommand** (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mecanumcontrollercommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/MecanumControllerCommand>`__) example project for more info.

- ``SwerveControllerCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/SwerveControllerCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_swerve_controller_command.html>`__) is useful for controlling swerve drivetrains. See API docs and the **SwerveControllerCommand** (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/swervecontrollercommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/SwerveControllerCommand>`__) example project for more info.

- ``RamseteCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/RamseteCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_ramsete_command.html>`__) is useful for path following with differential drivetrains ("tank drive"). See API docs and the :ref:`Trajectory Tutorial<docs/software/pathplanning/trajectory-tutorial/creating-following-trajectory:Creating the RamseteCommand>` for more info.
