Command Compositions
====================

Individual commands are capable of accomplishing a large variety of robot tasks, but the simple three-state format can quickly become cumbersome when more advanced functionality requiring extended sequences of robot tasks or coordination of multiple robot subsystems is required. In order to accomplish this, users are encouraged to use the powerful command composition functionality included in the command-based library.

As the name suggests, a command composition is a :term:`composition` of one or more commands. This allows code to be kept much cleaner and simpler, as the individual component commands may be written independently of the code that combines them, greatly reducing the amount of complexity at any given step of the process.

Most importantly, however, command compositions are themselves commands - they implement the ``Command`` interface. This allows command compositions to be further composed as a :term:`recursive composition` - that is, a command composition may contain other command compositions as components. This allows very powerful and concise inline expressions:

.. tabs::

  .. code-tab:: java

   // Will run fooCommand, and then a race between barCommand and bazCommand
   button.onTrue(fooCommand.andThen(barCommand.raceWith(bazCommand)));

  .. code-tab:: c++

   // Will run fooCommand, and then a race between barCommand and bazCommand
   button.OnTrue(std::move(fooCommand).AndThen(std::move(barCommand).RaceWith(std::move(bazCommand))));

As a rule, command compositions require all subsystems their components require, may run when disabled if all their component set ``runsWhenDisabled`` as ``true``, and are ``kCancelIncoming`` if all their components are ``kCancelIncoming`` as well.

Command instances that have been passed to a command composition cannot be independently scheduled or passed to a second command composition. Attempting to do so will throw an exception and crash the user program. This is because composition members are run through their encapsulating command composition, and errors could occur if those same command instances were independently scheduled at the same time as the group - the command would be being run from multiple places at once, and thus could end up with inconsistent internal state, causing unexpected and hard-to-diagnose behavior. The C++ command-based library uses ``CommandPtr``, a class with move-only semantics, so this type of mistake is easier to avoid.

Composition Types
-----------------

The command-based library includes various composition types. All of them can be constructed using factories that accept the member commands, and some can also be constructed using decorators: methods that can be called on a command object, which is transformed into a new object that is returned.

.. important:: After calling a decorator or being passed to a composition, the command object cannot be reused! Use only the command object returned from the decorator.

Repeating
^^^^^^^^^

The ``repeatedly()`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#repeatedly()>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#acc156a5299699110729918c3aa2b2694>`__), backed by the ``RepeatCommand`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/RepeatCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_repeat_command.html>`__) restarts the command each time it ends, so that it runs until interrupted.

.. tabs::

  .. code-tab:: java

    // Will run forever unless externally interrupted, restarting every time command.isFinished() returns true
    Command repeats = command.repeatedly();

  .. code-tab:: c++

    // Will run forever unless externally interrupted, restarting every time command.IsFinished() returns true
    frc2::CommandPtr repeats = std::move(command).Repeatedly();

Sequence
^^^^^^^^

The ``Sequence`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#sequence(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a2818c000b0b989bc66032847ecb3fed2>`__), backed by the ``SequentialCommandGroup`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/SequentialCommandGroup.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_sequential_command_group.html>`__), runs a list of commands in sequence: the first command will be executed, then the second, then the third, and so on until the list finishes. The sequential group finishes after the last command in the sequence finishes. It is therefore usually important to ensure that each command in the sequence does actually finish (if a given command does not finish, the next command will never start!).

The ``andThen()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#andThen(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a4ea952f52baf9fb157bb42801be602c0>`__) and ``beforeStarting()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#beforeStarting(edu.wpi.first.wpilibj2.command.Command)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a61e9a735d7b48dafd4b7499af8ff0c23>`__) decorators can be used to construct a sequence composition with infix syntax.

.. tabs::

   .. code-tab:: java

    fooCommand.andThen(barCommand)

   .. code-tab:: c++

    std::move(fooCommand).AndThen(std::move(barCommand))

Repeating Sequence
^^^^^^^^^^^^^^^^^^

As it's a fairly common combination, the ``RepeatingSequence`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#repeatingSequence(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#ae363301748047f753dcbe3eca0a10ced>`__) creates a `Repeating`_ `Sequence`_ that runs until interrupted, restarting from the first command each time the last command finishes.

Parallel
^^^^^^^^

There are three types of parallel compositions, differing based on when the composition finishes:

- The ``Parallel`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#parallel(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a0ea0faa5d66fbe942917844936687172>`__), backed by the ``ParallelCommandGroup`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelCommandGroup.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_command_group.html>`__), constructs a parallel composition that finishes when all members finish. The ``alongWith`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#alongWith(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a6b9700cd25277a3ac558d63301985f40>`__) does the same in infix notation.
- The ``Race`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#race(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a3455ac77f921f355edae8baeb911ef40>`__), backed by the ``ParallelRaceGroup`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelRaceGroup.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_race_group.html>`__), constructs a parallel composition that finishes as soon as any member finishes; all other members are interrupted at that point.  The ``raceWith`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#raceWith(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a4d6c1761cef10bb79a727e43e89643d0>`__) does the same in infix notation.
- The ``Deadline`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#deadline(edu.wpi.first.wpilibj2.command.Command,edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#aad22f6f92f4dbbe7b5736e0e39e00184>`__), ``ParallelDeadlineGroup`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelDeadlineGroup.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_deadline_group.html>`__) finishes when a specific command (the "deadline") ends; all other members still running at that point are interrupted.  The ``deadlineWith`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#deadlineWith(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#afafe81bf1624eb0ef78b30232087b4bf>`__) does the same in infix notation; the comand the decorator was called on is the deadline.

.. tabs::

  .. code-tab:: java

   // Will be a parallel command group that ends after three seconds with all three commands running their full duration.
   button.onTrue(Commands.parallel(twoSecCommand, oneSecCommand, threeSecCommand));

   // Will be a parallel race group that ends after one second with the two and three second commands getting interrupted.
   button.onTrue(Commands.race(twoSecCommand, oneSecCommand, threeSecCommand));

   // Will be a parallel deadline group that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
   button.onTrue(Commands.deadline(twoSecCommand, oneSecCommand, threeSecCommand));

  .. code-tab:: c++

   // Will be a parallel command group that ends after three seconds with all three commands running their full duration.
   button.OnTrue(frc2::cmd::Parallel(std::move(twoSecCommand), std::move(oneSecCommand), std::move(threeSecCommand)));

   // Will be a parallel race group that ends after one second with the two and three second commands getting interrupted.
   button.OnTrue(frc2::cmd::Race(std::move(twoSecCommand), std::move(oneSecCommand), std::move(threeSecCommand)));

   // Will be a parallel deadline group that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
   button.OnTrue(frc2::cmd::Deadline(std::move(twoSecCommand), std::move(oneSecCommand), std::move(threeSecCommand)));

Adding Command End Conditions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``until()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#until(java.util.function.BooleanSupplier)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a4ffddf195a71e71d80e62df95fffdfcf>`__) decorator composes the command with an additional end condition. Note that the command the decorator was called on will see this end condition as an interruption.

.. tabs::

  .. code-tab:: java

    // Will be interrupted if m_limitSwitch.get() returns true
    button.onTrue(command.until(m_limitSwitch::get));

  .. code-tab:: c++

    // Will be interrupted if m_limitSwitch.get() returns true
    button.OnTrue(command.Until([&m_limitSwitch] { return m_limitSwitch.Get(); }));

The ``withTimeout()`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#withTimeout(double)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#ac6b2e1e4f55ed905ec7d189b9288e3d0>`__) is a specialization of ``until`` that uses a timeout as the additional end condition.

.. tabs::

  .. code-tab:: java

    // Will time out 5 seconds after being scheduled, and be interrupted
    button.onTrue(command.withTimeout(5));

  .. code-tab:: c++

    // Will time out 5 seconds after being scheduled, and be interrupted
    button.OnTrue(command.WithTimeout(5.0_s));

Adding End Behavior
^^^^^^^^^^^^^^^^^^^

The ``finallyDo()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#finallyDo(edu.wpi.first.util.function.BooleanConsumer)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#abd0ae6c855d7cf1f1a33cda5575a7b8f>`__) decorator composes the command with an a lambda that will be called after the command's ``end()`` method, with the same boolean parameter indicating whether the command finished or was interrupted.

The ``handleInterrupt()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#handleInterrupt(java.lang.Runnable)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a2a5580e71dfe356d2b261efe213f7c67>`__) decorator composes the command with an a lambda that will be called only when the command is interrupted.

Selecting Compositions
^^^^^^^^^^^^^^^^^^^^^^

Sometimes it's desired to run a command out of a few options based on sensor feedback or other data known only at runtime. This can be useful for determining an auto routine, or running a different command based on whether a game piece is present or not, and so on.

The ``Select`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#select(java.util.Map,java.util.function.Supplier)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a56f9a9c571bd9da0a0b4612706d8db1c>`__), backed by the ``SelectCommand`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/SelectCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_select_command.html>`__), executes one command from a map, based on a selector function called when scheduled.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/selectcommand/RobotContainer.java
       :language: java
       :lines: 20-45
       :linenos:
       :lineno-start: 20

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/SelectCommand/include/RobotContainer.h
       :language: c++
       :lines: 24-43
       :linenos:
       :lineno-start: 24

The ``Either`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#either(edu.wpi.first.wpilibj2.command.Command,edu.wpi.first.wpilibj2.command.Command,java.util.function.BooleanSupplier)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a389d1d0055c3be03a852bfc88aaa2ee5>`__), backed by the ``ConditionalCommand`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ConditionalCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_conditional_command.html>`__), is a specialization accepting two commands and a boolean selector function.

.. tabs::

  .. code-tab:: java

    // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
    new ConditionalCommand(commandOnTrue, commandOnFalse, m_limitSwitch::get)

  .. code-tab:: c++

    // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
    frc2::ConditionalCommand(commandOnTrue, commandOnFalse, [&m_limitSwitch] { return m_limitSwitch.Get(); })

The ``unless()`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#unless(java.util.function.BooleanSupplier)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a2be7f65d40f68581104ab1f6a1ba5e93>`__) composes a command with a condition that will prevent it from running.

.. tabs::

  .. code-tab:: java

    // Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
    button.onTrue(command.unless(() -> !intake.isDeployed()));

  .. code-tab:: c++

    // Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
    button.OnTrue(command.Unless([&intake] { return !intake.IsDeployed(); }));

``ProxyCommand`` described below also has a constructor overload (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ProxyCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_proxy_command.html>`__) that calls a command-returning lambda at schedule-time and runs the returned command by proxy.

Scheduling Other Commands
^^^^^^^^^^^^^^^^^^^^^^^^^

By default, composition members are run through the command composition, and are never themselves seen by the scheduler. Accordingly, their requirements are added to the group's requirements. While this is usually fine, sometimes it is undesirable for the entire command group to gain the requirements of a single command. A good solution is to "fork off" from the command group and schedule that command separately. However, this requires synchronization between the composition and the individually-scheduled command.

``ProxyCommand`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ProxyCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_proxy_command.html>`__), also creatable using the ``.asProxy()`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#asProxy()>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#aa45784053431393e3277e5bc5ae7f751>`__), schedules a command "by proxy": the command is scheduled when the proxy is scheduled, and the proxy finishes when the command finishes. In the case of "forking off" from a command composition, this allows the group to track the command's progress without it being in the composition.

.. tabs::

  .. code-tab:: java

    // The sequence continues only after the proxied command ends
    Commands.waitSeconds(5.0).asProxy()
        .andThen(Commands.print("This will only be printed after the 5-second delay elapses!"))

  .. code-tab:: c++

    // The sequence continues only after the proxied command ends
    frc2::cmd::Wait(5.0_s).AsProxy()
        .AndThen(frc2::cmd::Print("This will only be printed after the 5-second delay elapses!"))

For cases that don't need to track the proxied command, ``ScheduleCommand`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ScheduleCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_schedule_command.html>`__) schedules a specified command and ends instantly.

.. tabs::

  .. code-tab:: java

    // ScheduleCommand ends immediately, so the sequence continues
    new ScheduleCommand(Commands.waitSeconds(5.0))
        .andThen(Commands.print("This will be printed immediately!"))

  .. code-tab:: c++

    // ScheduleCommand ends immediately, so the sequence continues
    frc2::ScheduleCommand(frc2::cmd::Wait(5.0_s))
        .AndThen(frc2::cmd::Print("This will be printed immediately!"))

Subclassing Compositions
------------------------

Command compositions can also be written as a constructor-only subclass of the most exterior composition type, passing the composition members to the superclass constructor. Consider the following from the Hatch Bot example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/commands/ComplexAuto.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/commands/ComplexAuto.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/commands/ComplexAuto.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

The advantages and disadvantages of this subclassing approach in comparison to others are discussed in :ref:`docs/software/commandbased/organizing-command-based:Subclassing Command Groups`.
