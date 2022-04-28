WPILib Command classes
======================

Running Actions
---------------

While users are able to create commands by explicitly writing command classes (either by subclassing ``CommandBase`` or implementing ``Command``), for many commands (such as those that simply call a single subsystem method) this involves a lot of wasteful boilerplate code. To help alleviate this, many of the prewritten commands included in the command-based library may be *inlined* - that is, the command body can be defined in a single line of code at command construction.

The ``InstantCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/InstantCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_instant_command.html>`__) executes a single action on initialization, and then ends immediately) provides an example of a type of command that benefits greatly from inlining. Consider the following from the HatchBotInlined example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotInlined>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined/RobotContainer.java
      :language: java
      :lines: 90-95
      :linenos:
      :lineno-start: 90

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/include/RobotContainer.h
      :language: c++
      :lines: 66-68
      :linenos:
      :lineno-start: 66

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/RobotContainer.cpp
      :language: c++
      :lines: 35-40
      :linenos:
      :lineno-start: 35

Instead of wastefully writing separate ``GrabHatch`` and ``ReleaseHatch`` commands which call only one method before ending, both can be accomplished with a simple inline definition by passing appropriate subsystem method.

In addition to ``InstantCommand`` shown above, there are multiple more command classes that can be constructed inline and accept one or more lambdas to be executed:

``RunCommand`` (Java, C++) accepts a single ``Runnable``/``std::function<void()>`` lambda that is executed repeatedly in ``execute()`` until the command is interrupted--the command has no natural end condition; one can be added using the ``until()`` decorator.

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

``StartEndCommand`` (Java, C++) accepts two ``Runnable``/``std::function<void()>`` lambdas, the first is executed once in ``initialize()`` when the command is scheduled and the second is executed in ``end()`` when the command is interrupted (the command has no natural end condition).

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

``FunctionalCommand`` (Java, C++) accepts four lambdas that constitute the four command lifecycle methods: a ``Runnable``/``std::function<void()>`` for each of ``initialize()`` and ``execute()``, a ``BooleanConsumer``/``std::function<void(bool)>`` for ``end()``, and a ``BooleanSupplier``/``std::function<bool()>`` for ``isFinished()``.

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

``PrintCommand`` (Java, C++) is a subclass of ``InstantCommand`` for printing a string and ending immediately.

.. tabs::

  .. code-tab:: java

    new PrintCommand("This message will be printed!")

  .. code-tab:: c++

    frc2::PrintCommand("This message will be printed!")


Dynamically Deciding What Command To Run
----------------------------------------

Sometimes it's desired to run a command out of a few options based on sensor feedback or other data known only at runtime.

For this, ``SelectCommand`` (Java, C++) accepts a map of commands and a generic selector.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/selectcommand/RobotContainer.java
      :language: java
      :lines: 20-45
      :linenos:
      :lineno-start: 20

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1/wpilibcExamples/src/main/cpp/examples/SelectCommand/include/RobotContainer.h
      :language: c++
      :lines: 25-44
      :linenos:
      :lineno-start: 25

``ConditionalCommand`` (Java, C++) is a specialized version of this that decides between two commands using a boolean condition.

.. tabs::

  .. code-tab:: java

    // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
    new ConditionalCommand(commandOnTrue, commandOnFalse, m_limitSwitch::get)

  .. code-tab:: c++

    // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
    frc2::ConditionalCommand(commandOnTrue, commandOnFalse, [&m_limitSwitch] { return m_limitSwitch.Get(); })


``SuppliedCommand`` (Java, C++) accepts a ``Supplier<Command>``/``std::function<Command*()>`` lambda that is polled at ``initialize()`` and the returned command is executed. Useful for creating commands on-the-fly.

TODO: add example code here

Waiting For Delays
------------------

Wait for a certain condition to happen or adding a delay can be useful to synchronize between different commands in a command group or between other robot actions.

``WaitCommand`` (Java, C++) does nothing and ends after a specified period of time elapses.

.. tabs::

  .. code-tab:: java

    // Ends 5 seconds after being scheduled
    new WaitCommand(5.0)

  .. code-tab:: c++

    // Ends 5 seconds after being scheduled
    frc2::WaitCommand(5.0_s)

.. warning:: The match timer used by WaitUntilCommand does *not* provide an official match time! While it is fairly accurate, use of this timer can *not* guarantee the legality of your robot's actions.

``WaitUntilCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/WaitUntilCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_wait_until_command.html>`__) does nothing, ending once a specified condition becomes true or once a specified match time passes.

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









In combination with ``ParallelRaceGroup`` or ``ParallelDeadlineGroup``, this can be used to replace a command's end condition or add another one - in fact, that is what the ``until()`` decorator does under the hood.















Scheduling Other Commands
-------------------------

By default, commands in command groups are run *through* the command group, and are never themselves seen by the scheduler. Accordingly, their requirements are added to the group's requirements. While this is usually fine, sometimes it is undesirable for the entire command group to gain the requirements of a single command - a good solution is to "fork off" from the command group and schedule that command separately.

``ScheduleCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ScheduleCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_schedule_command.html>`__) schedules a specified command and ends instantly.

.. tabs::

  .. code-tab:: java

    // Schedules commandToSchedule when run
    new ScheduleCommand(commandToSchedule)

  .. code-tab:: c++

    // Schedules commandToSchedule when run
    frc2::ScheduleCommand(&commandToSchedule)

``ProxyScheduleCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ProxyScheduleCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_proxy_schedule_command.html>`__) is very similar: it schedules a specified command, but does not end until that command ends. In the case of "forking off" from a command group, this allows the group to track the command's progress without it being in the group.

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

Both ``RepeatCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/RepeatCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_repeat_command.html>`__) and ``EndlessCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/EndlessCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_endless_command.html>`__) run a command continuously, with one key difference: ``RepeatCommand`` restarts the command every time it ends, while ``EndlessCommand`` ignores the command's end condition. This has important ramifications, for example: ``InstantCommand`` will run multiple times if repeated, but not if made endless.

.. tabs::

  .. code-tab:: java

    new PerpetualCommand(new FunctionalCommand(
        // initialize()
        () -> System.out.println("This will be called only once!"),
        // execute
        () -> System.out.println("This will be called many times!"),
        // end
        interrupted -> System.out.println("This won't be called at all!"),
        // isFinished
        () -> {
            System.out.println("This won't be called either!");
            return true;
        })
    )

    // TODO: maybe a better way of indicating when each method will be called?
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

    frc2::PerpetualCommand(frc2::FunctionalCommand(
        // initialize()
        []{ wpi::outs() << "This will be called only once!"; },
        // execute
        []{ wpi::outs() << "This will be called many times!"; },
        // end
        [](bool interrupted){ wpi::outs() << "This won't be called at all!",
        // isFinished
        []{
            wpi::outs() << "This won't be called either!");
            return true;
        })
    )

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

``RepeatCommand`` and ``EndlessCommand`` can also be created using the ``.repeat()`` and ``.endlessly()`` decorators respectively.

Running Commands In Parallel
----------------------------

Running multiple commands in parallel as part of a process such as an autonomous routine is very useful. There are three types of parallel command groups:

- ``ParallelCommandGroup`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelCommandGroup.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_command_group.html>`__) runs multiple commands concurrently - all commands will execute at the same time. The parallel group will end when all commands have finished.
    - The ``.alongWith()`` decorator can be used to create a ``ParallelCommandGroup`` inline.

- ``ParallelRaceGroup`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelRaceGroup.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_race_group.html>`__) is similar to ``ParallelCommandGroup`` in that it runs a set of commands concurrently, with the difference of interrupting all other commands and ending as soon as any command in the group ends - all other commands in the group are interrupted at that point.
    - The ``.raceWith()`` decorator can be used to create a ``ParallelRaceGroup`` inline.

- ``ParallelDeadlineGroup`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelDeadlineGroup.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_deadline_group.html>`__) is similar to ``ParallelCommandGroup`` and ``ParallelRaceGroup`` in that it runs a set of commands concurrently, with the difference of ending when a *specific* command (the "deadline") ends, interrupting all other commands in the group that are still running at that point.
    - The ``.deadlineWith()`` decorator can be used to create a ``ParallelDeadlineGroup`` inline.

TODO: add diagrams here




Full List Of Command Classes
============================

(probably also have a full separate list of decorators?)

``ConditionalCommand`` (Java, C++) accepts two commands as well as a ``BooleanSupplier``/``std::function<bool()>`` lambda to decide which of them is executed.

- ``SelectCommand`` (Java, C++) is a version of ``ConditionalCommand`` for selcting between more than two commands with a map of commands and a generic selector.

- ``SuppliedCommand`` (Java, C++) accepts a ``Supplier<Command>``/``std::function<Command*()>`` lambda that is polled at ``initialize()`` and the returned command is executed. Useful for creating commands on-the-fly.

- ``ScheduleCommand`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ScheduleCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_schedule_command.html>`__) schedules a specified command and ends instantly.


- ``WaitCommand`` (Java, C++) does nothing and ends after a specified period of time elapses. Useful to introduce a delay in a command group.

- ``WaitUntilCommand`` (Java, C++) accepts a ``BooleanSupplier``/``std::function<bool()>`` condition and does nothing, ending when the condition returns ``true``. Useful to introduce a delay in a command group, or can be used in combination with ``ParallelRaceGroup`` or ``ParallelDeadlineGroup`` to replace a command's end condition or add another one - in fact, that is what the ``until()`` decorator does under the hood.

- ``RepeatCommand`` (Java, C++) executes a command repeatedly, restarting it if it ends.
    - The ``.repeatedly()`` decorator can also be used to create a ``RepeatCommand`` inline.

- ``EndlessCommand`` (Java, C++) executes a command endlessly, ignoring its end condition.
    - The ``.endlessly()`` decorator can also be used to create an ``EndlessCommand`` inline.

- ``SequentialCommandGroup`` (Java, C++) executes multiple commands in a sequence, one after another.
    - The ``.andThen()`` and ``.beforeStarting()`` decorators can also be used to create a ``SequentialCommandGroup`` inline.

- ``ParallelCommandGroup`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelCommandGroup.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_command_group.html>`__) runs multiple commands concurrently - all commands will execute at the same time. The parallel group will end when all commands have finished.
    - The ``.alongWith()`` decorator can be used to create a ``ParallelCommandGroup`` inline.

- ``ParallelRaceGroup`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelRaceGroup.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_race_group.html>`__) is similar to ``ParallelCommandGroup`` in that it runs a set of commands concurrently, with the difference of interrupting all other commands and ending as soon as any command in the group ends - all other commands in the group are interrupted at that point.
    - The ``.raceWith()`` decorator can be used to create a ``ParallelRaceGroup`` inline.

- ``ParallelDeadlineGroup`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelDeadlineGroup.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_deadline_group.html>`__) is similar to ``ParallelCommandGroup`` and ``ParallelRaceGroup`` in that it runs a set of commands concurrently, with the difference of ending when a *specific* command (the "deadline") ends, interrupting all other commands in the group that are still running at that point.
    - The ``.deadlineWith()`` decorator can be used to create a ``ParallelDeadlineGroup`` inline.