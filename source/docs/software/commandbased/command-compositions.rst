Command Compositions
====================

Individual commands are capable of accomplishing a large variety of robot tasks, but the simple three-state format can quickly become cumbersome when more advanced functionality requiring extended sequences of robot tasks or coordination of multiple robot subsystems is required. In order to accomplish this, users are encouraged to use the powerful command composition functionality included in the command-based library.

As the name suggests, a command composition is a :term:`composition` of one or more commands. This allows code to be kept much cleaner and simpler, as the individual component commands may be written independently of the code that combines them, greatly reducing the amount of complexity at any given step of the process.

Most importantly, however, command compositions are themselves commands - they extend the ``Command`` class. This allows command compositions to be further composed as a :term:`recursive composition` - that is, a command composition may contain other command compositions as components. This allows very powerful and concise inline expressions:

.. tab-set-code::

   .. code-block:: java

      // Will run fooCommand, and then a race between barCommand and bazCommand
      button.onTrue(fooCommand.andThen(barCommand.raceWith(bazCommand)));

   .. code-block:: c++

      // Will run fooCommand, and then a race between barCommand and bazCommand
      button.OnTrue(std::move(fooCommand).AndThen(std::move(barCommand).RaceWith(std::move(bazCommand))));

   .. code-block:: python

      # Will run fooCommand, and then a race between barCommand and bazCommand
      button.onTrue(fooCommand.andThen(barCommand.raceWith(bazCommand)))

As a rule, command compositions require all subsystems their components require, may run when disabled if all their component set ``runsWhenDisabled`` as ``true``, and are ``kCancelIncoming`` if all their components are ``kCancelIncoming`` as well.

Command instances that have been passed to a command composition cannot be independently scheduled or passed to a second command composition. Attempting to do so will throw an exception and crash the user program. This is because composition members are run through their encapsulating command composition, and errors could occur if those same command instances were independently scheduled at the same time as the composition - the command would be being run from multiple places at once, and thus could end up with inconsistent internal state, causing unexpected and hard-to-diagnose behavior. The C++ command-based library uses ``CommandPtr``, a class with move-only semantics, so this type of mistake is easier to avoid.

Composition Types
-----------------

The command-based library includes various composition types. All of them can be constructed using factories that accept the member commands, and some can also be constructed using decorators: methods that can be called on a command object, which is transformed into a new object that is returned.

.. important:: After calling a decorator or being passed to a composition, the command object cannot be reused! Use only the command object returned from the decorator.

Repeating
^^^^^^^^^

The ``repeatedly()`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#repeatedly()>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#acc156a5299699110729918c3aa2b2694>`__, :external:py:meth:`Python <commands2.Command.repeatedly>`), backed by the ``RepeatCommand`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/RepeatCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_repeat_command.html>`__, :external:py:class:`Python <commands2.RepeatCommand>`) restarts the command each time it ends, so that it runs until interrupted.

.. tab-set-code::

   .. code-block:: java

      // Will run forever unless externally interrupted, restarting every time command.isFinished() returns true
      Command repeats = command.repeatedly();

   .. code-block:: c++

      // Will run forever unless externally interrupted, restarting every time command.IsFinished() returns true
      frc2::CommandPtr repeats = std::move(command).Repeatedly();

   .. code-block:: python

      # Will run forever unless externally interrupted, restarting every time command.IsFinished() returns true
      repeats = commands2.cmd.repeatedly()

Sequence
^^^^^^^^

The ``Sequence`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#sequence(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a2818c000b0b989bc66032847ecb3fed2>`__, :external:py:func:`Python <commands2.cmd.sequence>`), backed by the ``SequentialCommandGroup`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/SequentialCommandGroup.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_sequential_command_group.html>`__, :external:py:class:`Python <commands2.SequentialCommandGroup>`), runs a list of commands in sequence: the first command will be executed, then the second, then the third, and so on until the list finishes. The sequential group finishes after the last command in the sequence finishes. It is therefore usually important to ensure that each command in the sequence does actually finish (if a given command does not finish, the next command will never start!).

The ``andThen()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#andThen(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a4ea952f52baf9fb157bb42801be602c0>`__, :external:py:meth:`Python <commands2.Command.andThen>`) and ``beforeStarting()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#beforeStarting(edu.wpi.first.wpilibj2.command.Command)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a61e9a735d7b48dafd4b7499af8ff0c23>`__, :external:py:meth:`Python <commands2.Command.beforeStarting>`) decorators can be used to construct a sequence composition with infix syntax.

.. tab-set-code::

   .. code-block:: java

      fooCommand.andThen(barCommand)

   .. code-block:: c++

      std::move(fooCommand).AndThen(std::move(barCommand))

   .. code-block:: python

      fooCommand.andThen(barCommand)


Repeating Sequence
^^^^^^^^^^^^^^^^^^

As it's a fairly common combination, the ``RepeatingSequence`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#repeatingSequence(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#ae363301748047f753dcbe3eca0a10ced>`__, :external:py:func:`Python <commands2.cmd.repeatingSequence>`) creates a `Repeating`_ `Sequence`_ that runs until interrupted, restarting from the first command each time the last command finishes.

Parallel
^^^^^^^^

There are three types of parallel compositions, differing based on when the composition finishes:

- The ``Parallel`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#parallel(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a0ea0faa5d66fbe942917844936687172>`__, :external:py:func:`Python <commands2.cmd.parallel>`), backed by the ``ParallelCommandGroup`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelCommandGroup.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_command_group.html>`__, :external:py:class:`Python <commands2.ParallelCommandGroup>`), constructs a parallel composition that finishes when all members finish. The ``alongWith`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#alongWith(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a6b9700cd25277a3ac558d63301985f40>`__, :external:py:meth:`Python <commands2.Command.alongWith>`) does the same in infix notation.
- The ``Race`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#race(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a3455ac77f921f355edae8baeb911ef40>`__, :external:py:func:`Python <commands2.cmd.race>`), backed by the ``ParallelRaceGroup`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelRaceGroup.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_race_group.html>`__, :external:py:class:`Python <commands2.ParallelRaceGroup>`), constructs a parallel composition that finishes as soon as any member finishes; all other members are interrupted at that point.  The ``raceWith`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#raceWith(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a4d6c1761cef10bb79a727e43e89643d0>`__, :external:py:meth:`Python <commands2.Command.raceWith>`) does the same in infix notation.
- The ``Deadline`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#deadline(edu.wpi.first.wpilibj2.command.Command,edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#aad22f6f92f4dbbe7b5736e0e39e00184>`__, :external:py:func:`Python <commands2.cmd.deadline>`), ``ParallelDeadlineGroup`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ParallelDeadlineGroup.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_parallel_deadline_group.html>`__, :external:py:class:`Python <commands2.ParallelDeadlineGroup>`) finishes when a specific command (the "deadline") ends; all other members still running at that point are interrupted.  The ``deadlineWith`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#deadlineWith(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#afafe81bf1624eb0ef78b30232087b4bf>`__, :external:py:meth:`Python <commands2.Command.deadlineWith>`) does the same in infix notation; the comand the decorator was called on is the deadline.

.. tab-set-code::

   .. code-block:: java

      // Will be a parallel command composition that ends after three seconds with all three commands running their full duration.
      button.onTrue(Commands.parallel(twoSecCommand, oneSecCommand, threeSecCommand));

      // Will be a parallel race composition that ends after one second with the two and three second commands getting interrupted.
      button.onTrue(Commands.race(twoSecCommand, oneSecCommand, threeSecCommand));

      // Will be a parallel deadline composition that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
      button.onTrue(Commands.deadline(twoSecCommand, oneSecCommand, threeSecCommand));

   .. code-block:: c++

      // Will be a parallel command composition that ends after three seconds with all three commands running their full duration.
      button.OnTrue(frc2::cmd::Parallel(std::move(twoSecCommand), std::move(oneSecCommand), std::move(threeSecCommand)));

      // Will be a parallel race composition that ends after one second with the two and three second commands getting interrupted.
      button.OnTrue(frc2::cmd::Race(std::move(twoSecCommand), std::move(oneSecCommand), std::move(threeSecCommand)));

      // Will be a parallel deadline composition that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
      button.OnTrue(frc2::cmd::Deadline(std::move(twoSecCommand), std::move(oneSecCommand), std::move(threeSecCommand)));

   .. code-block:: python

      # Will be a parallel command composition that ends after three seconds with all three commands running their full duration.
      button.onTrue(commands2.cmd.parallel(twoSecCommand, oneSecCommand, threeSecCommand))

      # Will be a parallel race composition that ends after one second with the two and three second commands getting interrupted.
      button.onTrue(commands2.cmd.race(twoSecCommand, oneSecCommand, threeSecCommand))

      # Will be a parallel deadline composition that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
      button.onTrue(commands2.cmd.deadline(twoSecCommand, oneSecCommand, threeSecCommand))

Adding Command End Conditions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``until()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#until(java.util.function.BooleanSupplier)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a4ffddf195a71e71d80e62df95fffdfcf>`__, :external:py:meth:`Python <commands2.Command.until>`) decorator composes the command with an additional end condition. Note that the command the decorator was called on will see this end condition as an interruption.

.. tab-set-code::

   .. code-block:: java

      // Will be interrupted if m_limitSwitch.get() returns true
      button.onTrue(command.until(m_limitSwitch::get));

   .. code-block:: c++

      // Will be interrupted if m_limitSwitch.get() returns true
      button.OnTrue(command.Until([&m_limitSwitch] { return m_limitSwitch.Get(); }));

   .. code-block:: python

      # Will be interrupted if limitSwitch.get() returns true
      button.onTrue(commands2.cmd.until(limitSwitch.get))

The ``withTimeout()`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#withTimeout(double)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#ac6b2e1e4f55ed905ec7d189b9288e3d0>`__, :external:py:meth:`Python <commands2.Command.withTimeout>`) is a specialization of ``until`` that uses a timeout as the additional end condition.

.. tab-set-code::

   .. code-block:: java

      // Will time out 5 seconds after being scheduled, and be interrupted
      button.onTrue(command.withTimeout(5));

   .. code-block:: c++

      // Will time out 5 seconds after being scheduled, and be interrupted
      button.OnTrue(command.WithTimeout(5.0_s));

   .. code-block:: python

      # Will time out 5 seconds after being scheduled, and be interrupted
      button.onTrue(commands2.cmd.withTimeout(5.0))

Adding End Behavior
^^^^^^^^^^^^^^^^^^^

The ``finallyDo()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#finallyDo(edu.wpi.first.util.function.BooleanConsumer)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#abd0ae6c855d7cf1f1a33cda5575a7b8f>`__, :external:py:meth:`Python <commands2.Command.finallyDo>`) decorator composes the command with an a lambda that will be called after the command's ``end()`` method, with the same boolean parameter indicating whether the command finished or was interrupted.

The ``handleInterrupt()`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#handleInterrupt(java.lang.Runnable)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a2a5580e71dfe356d2b261efe213f7c67>`__, :external:py:meth:`Python <commands2.Command.handleInterrupt>`) decorator composes the command with an a lambda that will be called only when the command is interrupted.

Selecting Compositions
^^^^^^^^^^^^^^^^^^^^^^

Sometimes it's desired to run a command out of a few options based on sensor feedback or other data known only at runtime. This can be useful for determining an auto routine, or running a different command based on whether a game piece is present or not, and so on.

The ``Select`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#select(java.util.Map,java.util.function.Supplier)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a56f9a9c571bd9da0a0b4612706d8db1c>`__, :external:py:func:`Python <commands2.cmd.select>`), backed by the ``SelectCommand`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/SelectCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_select_command.html>`__, :external:py:class:`Python <commands2.SelectCommand>`), executes one command from a map, based on a selector function called when scheduled.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/selectcommand/RobotContainer.java
         :language: java
         :lines: 20-45
         :linenos:
         :lineno-start: 20

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/SelectCommand/include/RobotContainer.h
         :language: c++
         :lines: 26-43
         :linenos:
         :lineno-start: 26

The ``Either`` factory (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Commands.html#either(edu.wpi.first.wpilibj2.command.Command,edu.wpi.first.wpilibj2.command.Command,java.util.function.BooleanSupplier)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/namespacefrc2_1_1cmd.html#a389d1d0055c3be03a852bfc88aaa2ee5>`__, :external:py:func:`Python <commands2.cmd.either>`), backed by the ``ConditionalCommand`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ConditionalCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_conditional_command.html>`__, :external:py:class:`Python <commands2.ConditionalCommand>`), is a specialization accepting two commands and a boolean selector function.

.. tab-set-code::

   .. code-block:: java

      // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
      new ConditionalCommand(commandOnTrue, commandOnFalse, m_limitSwitch::get)

   .. code-block:: c++

      // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
      frc2::ConditionalCommand(commandOnTrue, commandOnFalse, [&m_limitSwitch] { return m_limitSwitch.Get(); })

   .. code-block:: python

      # Runs either commandOnTrue or commandOnFalse depending on the value of limitSwitch.get()
      ConditionalCommand(commandOnTrue, commandOnFalse, limitSwitch.get)

The ``unless()`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#unless(java.util.function.BooleanSupplier)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#a2be7f65d40f68581104ab1f6a1ba5e93>`__, :external:py:meth:`Python <commands2.Command.unless>`) composes a command with a condition that will prevent it from running.

.. tab-set-code::

   .. code-block:: java

      // Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
      button.onTrue(command.unless(() -> !intake.isDeployed()));

   .. code-block:: c++

      // Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
      button.OnTrue(command.Unless([&intake] { return !intake.IsDeployed(); }));

   .. code-block:: python

      # Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
      button.onTrue(command.unless(lambda: not intake.isDeployed()))

``ProxyCommand`` described below also has a constructor overload (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ProxyCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_proxy_command.html>`__, :external:py:class:`Python <commands2.ProxyCommand>`) that calls a command-returning lambda at schedule-time and runs the returned command by proxy.

Scheduling Other Commands
^^^^^^^^^^^^^^^^^^^^^^^^^

By default, composition members are run through the command composition, and are never themselves seen by the scheduler. Accordingly, their requirements are added to the composition's requirements. While this is usually fine, sometimes it is undesirable for the entire command composition to gain the requirements of a single command. A good solution is to "fork off" from the command composition and schedule that command separately. However, this requires synchronization between the composition and the individually-scheduled command.

``ProxyCommand`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ProxyCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_proxy_command.html>`__, :external:py:class:`Python <commands2.ProxyCommand>`), also creatable using the ``.asProxy()`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#asProxy()>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_ptr.html#aa45784053431393e3277e5bc5ae7f751>`__, :external:py:meth:`Python <commands2.Command.asProxy>`), schedules a command "by proxy": the command is scheduled when the proxy is scheduled, and the proxy finishes when the command finishes. In the case of "forking off" from a command composition, this allows the composition to track the command's progress without it being in the composition.


Command compositions inherit the union of their compoments' requirements and requirements are immutable. Therefore, a ``SequentialCommandGroup`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/SequentialCommandGroup.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_sequential_command_group.html>`__, :external:py:class:`Python <commands2.SequentialCommandGroup>`) that intakes a game piece, indexes it, aims a shooter, and shoots it would reserve all three subsystems (the intake, indexer, and shooter), precluding any of those subsystems from performing other operations in their "downtime". If this is not desired, the subsystems that should only be reserved for the composition while they are actively being used by it should have their commands proxied.

.. warning:: Do not use ``ProxyCommand`` unless you are sure of what you are doing and there is no other way to accomplish your need! Proxying is only intended for use as an escape hatch from command composition requirement unions.

.. note:: Because proxied commands still require their subsystem, despite not leaking that requirement to the composition, all of the commands that require a given subsystem must be proxied if one of them is. Otherwise, when the proxied command is scheduled its requirement will conflict with that of the composition, canceling the composition.

.. tab-set-code::

   .. code-block:: java

      // composition requirements are indexer and shooter, intake still reserved during its command but not afterwards
      Commands.sequence(
         intake.intakeGamePiece().asProxy(), // we want to let the intake intake another game piece while we are processing this one
         indexer.processGamePiece(),
         shooter.aimAndShoot()
      );

   .. code-block:: c++

      // composition requirements are indexer and shooter, intake still reserved during its command but not afterwards
      frc2::cmd::Sequence(
         intake.IntakeGamePiece().AsProxy(), // we want to let the intake intake another game piece while we are processing this one
         indexer.ProcessGamePiece(),
         shooter.AimAndShoot()
      );

   .. code-block:: python

      # composition requirements are indexer and shooter, intake still reserved during its command but not afterwards
      commands2.cmd.sequence(
         intake.intakeGamePiece().asProxy(), # we want to let the intake intake another game piece while we are processing this one
         indexer.processGamePiece(),
         shooter.aimAndShoot()
      )

For cases that don't need to track the proxied command, ``ScheduleCommand`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ScheduleCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_schedule_command.html>`__, :external:py:class:`Python <commands2.ScheduleCommand>`) schedules a specified command and ends instantly.

.. tab-set-code::

   .. code-block:: java

      // ScheduleCommand ends immediately, so the sequence continues
      new ScheduleCommand(Commands.waitSeconds(5.0))
         .andThen(Commands.print("This will be printed immediately!"))

   .. code-block:: c++

      // ScheduleCommand ends immediately, so the sequence continues
      frc2::ScheduleCommand(frc2::cmd::Wait(5.0_s))
         .AndThen(frc2::cmd::Print("This will be printed immediately!"))

   .. code-block:: python

      # ScheduleCommand ends immediately, so the sequence continues
      ScheduleCommand(commands2.cmd.waitSeconds(5.0))
         .andThen(commands2.cmd.print("This will be printed immediately!"))

Subclassing Compositions
------------------------

Command compositions can also be written as a constructor-only subclass of the most exterior composition type, passing the composition members to the superclass constructor. Consider the following from the Hatch Bot example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional>`__):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/commands/ComplexAuto.java
         :language: java
         :lines: 5-
         :linenos:
         :lineno-start: 5

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/commands/ComplexAuto.h
         :language: c++
         :lines: 5-
         :linenos:
         :lineno-start: 5

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/commands/ComplexAuto.cpp
         :language: c++
         :lines: 5-
         :linenos:
         :lineno-start: 5

   .. tab-item:: Python
      :sync: Python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/HatchbotTraditional/commands/complexauto.py
         :language: python
         :lines: 7-
         :linenos:
         :lineno-start: 5

The advantages and disadvantages of this subclassing approach in comparison to others are discussed in :ref:`docs/software/commandbased/organizing-command-based:Subclassing Command Groups`.
