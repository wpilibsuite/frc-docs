# Command Compositions

Individual commands are capable of accomplishing a large variety of robot tasks, but the simple three-state format can quickly become cumbersome when more advanced functionality requiring extended sequences of robot tasks or coordination of multiple robot subsystems is required. In order to accomplish this, users are encouraged to use the powerful command composition functionality included in the command-based library.

As the name suggests, a command composition is a :term:`composition` of one or more commands. This allows code to be kept much cleaner and simpler, as the individual component commands may be written independently of the code that combines them, greatly reducing the amount of complexity at any given step of the process.

Most importantly, however, command compositions are themselves commands - they extend the ``Command`` class. This allows command compositions to be further composed as a :term:`recursive composition` - that is, a command composition may contain other command compositions as components. This allows very powerful and concise inline expressions:

.. tab-set-code::

   ```java
   // Will run fooCommand, and then a race between barCommand and bazCommand
   button.onTrue(fooCommand.andThen(barCommand.raceWith(bazCommand)));
   ```

   ```c++
   // Will run fooCommand, and then a race between barCommand and bazCommand
   button.OnTrue(std::move(fooCommand).AndThen(std::move(barCommand).RaceWith(std::move(bazCommand))));
   ```

   ```python
   # Will run fooCommand, and then a race between barCommand and bazCommand
   button.onTrue(fooCommand.andThen(barCommand.raceWith(bazCommand)))
   ```

As a rule, command compositions require all subsystems their components require, may run when disabled if all their component set ``runsWhenDisabled`` as ``true``, and are ``kCancelIncoming`` if all their components are ``kCancelIncoming`` as well.

Command instances that have been passed to a command composition cannot be independently scheduled or passed to a second command composition. Attempting to do so will throw an exception and crash the user program. This is because composition members are run through their encapsulating command composition, and errors could occur if those same command instances were independently scheduled at the same time as the composition - the command would be being run from multiple places at once, and thus could end up with inconsistent internal state, causing unexpected and hard-to-diagnose behavior. The C++ command-based library uses ``CommandPtr``, a class with move-only semantics, so this type of mistake is easier to avoid.

## Composition Types

The command-based library includes various composition types. All of them can be constructed using factories that accept the member commands, and some can also be constructed using decorators: methods that can be called on a command object, which is transformed into a new object that is returned.

.. important:: After calling a decorator or being passed to a composition, the command object cannot be reused! Use only the command object returned from the decorator.

### Repeating

The ``repeatedly()`` decorator ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#repeatedly()), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command_ptr.html#a51e7a716b7678df237ddda60a24a03e6), :external:py:meth:`Python <commands2.Command.repeatedly>`), backed by the ``RepeatCommand`` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/RepeatCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_repeat_command.html), :external:py:class:`Python <commands2.RepeatCommand>`) restarts the command each time it ends, so that it runs until interrupted.

.. tab-set-code::

   ```java
   // Will run forever unless externally interrupted, restarting every time command.isFinished() returns true
   Command repeats = command.repeatedly();
   ```

   ```c++
   // Will run forever unless externally interrupted, restarting every time command.IsFinished() returns true
   wpi::cmd::CommandPtr repeats = std::move(command).Repeatedly();
   ```

   ```python
   # Will run forever unless externally interrupted, restarting every time command.IsFinished() returns true
   repeats = command.repeatedly()
   ```

### Sequence

The ``Sequence`` factory ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Commands.html#sequence(org.wpilib.command2.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/namespacewpi_1_1cmd_1_1cmd.html#a26ee0b28521282913f65e1741e503105), :external:py:func:`Python <commands2.cmd.sequence>`), backed by the ``SequentialCommandGroup`` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/SequentialCommandGroup.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_sequential_command_group.html), :external:py:class:`Python <commands2.SequentialCommandGroup>`), runs a list of commands in sequence: the first command will be executed, then the second, then the third, and so on until the list finishes. The sequential group finishes after the last command in the sequence finishes. It is therefore usually important to ensure that each command in the sequence does actually finish (if a given command does not finish, the next command will never start!).

The ``andThen()`` ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#andThen(org.wpilib.command2.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command_ptr.html#a9e08d40e9b3a3c7036bf79d5bd61cd52), :external:py:meth:`Python <commands2.Command.andThen>`) and ``beforeStarting()`` ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#beforeStarting(org.wpilib.command2.Command)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command.html#ab60802674589d9136e19d28fda67f527), :external:py:meth:`Python <commands2.Command.beforeStarting>`) decorators can be used to construct a sequence composition with infix syntax.

.. tab-set-code::

   ```java
   fooCommand.andThen(barCommand)
   ```

   ```c++
   std::move(fooCommand).AndThen(std::move(barCommand))
   ```

   ```python
   fooCommand.andThen(barCommand)
   ```

### Repeating Sequence

As it's a fairly common combination, the ``RepeatingSequence`` factory ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Commands.html#repeatingSequence(org.wpilib.command2.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/namespacewpi_1_1cmd_1_1cmd.html#a019fa2bacaa678e7a5a4a53dc0c9228a), :external:py:func:`Python <commands2.cmd.repeatingSequence>`) creates a `Repeating`_ `Sequence`_ that runs until interrupted, restarting from the first command each time the last command finishes.

### Parallel

There are three types of parallel compositions, differing based on when the composition finishes:

- The ``Parallel`` factory ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Commands.html#parallel(org.wpilib.command2.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/namespacewpi_1_1cmd_1_1cmd.html#a5e7b6ab1a1fdc8b034c7a8b2059fb764), :external:py:func:`Python <commands2.cmd.parallel>`), backed by the ``ParallelCommandGroup`` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/ParallelCommandGroup.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_parallel_command_group.html), :external:py:class:`Python <commands2.ParallelCommandGroup>`), constructs a parallel composition that finishes when all members finish. The ``alongWith`` decorator ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#alongWith(org.wpilib.command2.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command_ptr.html#a431044d88953a37d3d9ce2d062c7eb24), :external:py:meth:`Python <commands2.Command.alongWith>`) does the same in infix notation.
- The ``Race`` factory ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Commands.html#race(org.wpilib.command2.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/namespacewpi_1_1cmd_1_1cmd.html#af42251e6ad50e2531ad87bd86e46c4ec), :external:py:func:`Python <commands2.cmd.race>`), backed by the ``ParallelRaceGroup`` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/ParallelRaceGroup.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_parallel_race_group.html), :external:py:class:`Python <commands2.ParallelRaceGroup>`), constructs a parallel composition that finishes as soon as any member finishes; all other members are interrupted at that point.  The ``raceWith`` decorator ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#raceWith(org.wpilib.command2.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command_ptr.html#ac61c5473f928abc8f11175c6ea06a185), :external:py:meth:`Python <commands2.Command.raceWith>`) does the same in infix notation.
- The ``Deadline`` factory ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Commands.html#deadline(org.wpilib.command2.Command,org.wpilib.command2.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/namespacewpi_1_1cmd_1_1cmd.html#a6bab3d8ea6181819a36eec10a371d1d7), :external:py:func:`Python <commands2.cmd.deadline>`), ``ParallelDeadlineGroup`` ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/ParallelDeadlineGroup.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_parallel_deadline_group.html), :external:py:class:`Python <commands2.ParallelDeadlineGroup>`) finishes when a specific command (the "deadline") ends; all other members still running at that point are interrupted.  The ``deadlineWith`` decorator ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#deadlineWith(org.wpilib.command2.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command_ptr.html#ac907fbf8cd1bbddc97d9ec6f74ffb822), :external:py:meth:`Python <commands2.Command.deadlineWith>`) does the same in infix notation; the command the decorator was called on is the deadline.

.. tab-set-code::

   ```java
   // Will be a parallel command composition that ends after three seconds with all three commands running their full duration.
   button.onTrue(Commands.parallel(twoSecCommand, oneSecCommand, threeSecCommand));
   // Will be a parallel race composition that ends after one second with the two and three second commands getting interrupted.
   button.onTrue(Commands.race(twoSecCommand, oneSecCommand, threeSecCommand));
   // Will be a parallel deadline composition that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
   button.onTrue(Commands.deadline(twoSecCommand, oneSecCommand, threeSecCommand));
   ```

   ```c++
   // Will be a parallel command composition that ends after three seconds with all three commands running their full duration.
   button.OnTrue(wpi::cmd::cmd::Parallel(std::move(twoSecCommand), std::move(oneSecCommand), std::move(threeSecCommand)));
   // Will be a parallel race composition that ends after one second with the two and three second commands getting interrupted.
   button.OnTrue(wpi::cmd::cmd::Race(std::move(twoSecCommand), std::move(oneSecCommand), std::move(threeSecCommand)));
   // Will be a parallel deadline composition that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
   button.OnTrue(wpi::cmd::cmd::Deadline(std::move(twoSecCommand), std::move(oneSecCommand), std::move(threeSecCommand)));
   ```

   ```python
   # Will be a parallel command composition that ends after three seconds with all three commands running their full duration.
   button.onTrue(commands2.cmd.parallel(twoSecCommand, oneSecCommand, threeSecCommand))
   # Will be a parallel race composition that ends after one second with the two and three second commands getting interrupted.
   button.onTrue(commands2.cmd.race(twoSecCommand, oneSecCommand, threeSecCommand))
   # Will be a parallel deadline composition that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
   button.onTrue(commands2.cmd.deadline(twoSecCommand, oneSecCommand, threeSecCommand))
   ```

### Adding Command End Conditions

The ``until()`` ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#until(java.util.function.BooleanSupplier)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command.html#af00349300c4cbec1ff75ba8e47b04621), :external:py:meth:`Python <commands2.Command.until>`) decorator composes the command with an additional end condition. Note that the command the decorator was called on will see this end condition as an interruption.

.. tab-set-code::

   ```java
   // Will be interrupted if m_limitSwitch.get() returns true
   button.onTrue(command.until(m_limitSwitch::get));
   ```

   ```c++
   // Will be interrupted if m_limitSwitch.get() returns true
   button.OnTrue(command.Until([&m_limitSwitch] { return m_limitSwitch.Get(); }));
   ```

   ```python
   # Will be interrupted if limitSwitch.get() returns true
   button.onTrue(commands2.cmd.until(limitSwitch.get))
   ```

The ``withTimeout()`` decorator ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#withTimeout(double)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command.html#a2f928d0d7416756110d6fb0d796f542c), :external:py:meth:`Python <commands2.Command.withTimeout>`) is a specialization of ``until`` that uses a timeout as the additional end condition.

.. tab-set-code::

   ```java
   // Will time out 5 seconds after being scheduled, and be interrupted
   button.onTrue(command.withTimeout(5));
   ```

   ```c++
   // Will time out 5 seconds after being scheduled, and be interrupted
   button.OnTrue(command.WithTimeout(5.0_s));
   ```

   ```python
   # Will time out 5 seconds after being scheduled, and be interrupted
   button.onTrue(commands2.cmd.withTimeout(5.0))
   ```

### Adding End Behavior

The ``finallyDo()`` ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#finallyDo(org.wpilib.util.function.BooleanConsumer)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command_ptr.html#a1c73a893d7040fc9088e8828ae6ef22c), :external:py:meth:`Python <commands2.Command.finallyDo>`) decorator composes the command with an a lambda that will be called after the command's ``end()`` method, with the same boolean parameter indicating whether the command finished or was interrupted.

The ``handleInterrupt()`` ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#handleInterrupt(java.lang.Runnable)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command_ptr.html#aa8efbc41dcdaa60ba14874c4694236fc), :external:py:meth:`Python <commands2.Command.handleInterrupt>`) decorator composes the command with an a lambda that will be called only when the command is interrupted.

### Selecting Compositions

Sometimes it's desired to run a command out of a few options based on sensor feedback or other data known only at runtime. This can be useful for determining an auto routine, or running a different command based on whether a game piece is present or not, and so on.

The ``Select`` factory ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Commands.html#select(java.util.Map,java.util.function.Supplier)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/namespacewpi_1_1cmd_1_1cmd.html#a4825ef1f564dac57a7f64cc46af46082), :external:py:func:`Python <commands2.cmd.select>`), backed by the ``SelectCommand`` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/SelectCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_select_command.html), :external:py:class:`Python <commands2.SelectCommand>`), executes one command from a map, based on a selector function called when scheduled.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-4/wpilibjExamples/src/main/java/org/wpilib/examples/selectcommand/RobotContainer.java
         :language: java
         :lines: 20-45
         :lineno-match:

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-4/wpilibcExamples/src/main/cpp/examples/SelectCommand/include/RobotContainer.hpp
         :language: c++
         :lines: 26-43
         :lineno-match:

The ``Either`` factory ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Commands.html#either(org.wpilib.command2.Command,org.wpilib.command2.Command,java.util.function.BooleanSupplier)), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/namespacewpi_1_1cmd_1_1cmd.html#a90716904e99acba961cc385a7add42b8), :external:py:func:`Python <commands2.cmd.either>`), backed by the ``ConditionalCommand`` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/ConditionalCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_conditional_command.html), :external:py:class:`Python <commands2.ConditionalCommand>`), is a specialization accepting two commands and a boolean selector function.

.. tab-set-code::

   ```java
   // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
   new ConditionalCommand(commandOnTrue, commandOnFalse, m_limitSwitch::get)
   ```

   ```c++
   // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
   wpi::cmd::ConditionalCommand(commandOnTrue, commandOnFalse, [&m_limitSwitch] { return m_limitSwitch.Get(); })
   ```

   ```python
   # Runs either commandOnTrue or commandOnFalse depending on the value of limitSwitch.get()
   ConditionalCommand(commandOnTrue, commandOnFalse, limitSwitch.get)
   ```

The ``unless()`` decorator ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#unless(java.util.function.BooleanSupplier)), [C++](hhttps://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command_ptr.html#af3176fe33861c7da7cb73db6165b2611), :external:py:meth:`Python <commands2.Command.unless>`) composes a command with a condition that will prevent it from running.

.. tab-set-code::

   ```java
   // Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
   button.onTrue(command.unless(() -> !intake.isDeployed()));
   ```

   ```c++
   // Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
   button.OnTrue(command.Unless([&intake] { return !intake.IsDeployed(); }));
   ```

   ```python
   # Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
   button.onTrue(command.unless(lambda: not intake.isDeployed()))
   ```

``ProxyCommand`` described below also has a constructor overload ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/ProxyCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_proxy_command.html), :external:py:class:`Python <commands2.ProxyCommand>`) that calls a command-returning lambda at schedule-time and runs the returned command by proxy.

### Scheduling Other Commands

By default, composition members are run through the command composition, and are never themselves seen by the scheduler. Accordingly, their requirements are added to the composition's requirements. While this is usually fine, sometimes it is undesirable for the entire command composition to gain the requirements of a single command. A good solution is to "fork off" from the command composition and schedule that command separately. However, this requires synchronization between the composition and the individually-scheduled command.

``ProxyCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/ProxyCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_proxy_command.html), :external:py:class:`Python <commands2.ProxyCommand>`), also creatable using the ``.asProxy()`` decorator ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/Command.html#asProxy()), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_command_ptr.html#a5c260e48f08e75008ec9cff701edcd34), :external:py:meth:`Python <commands2.Command.asProxy>`), schedules a command "by proxy": the command is scheduled when the proxy is scheduled, and the proxy finishes when the command finishes. In the case of "forking off" from a command composition, this allows the composition to track the command's progress without it being in the composition.


Command compositions inherit the union of their compoments' requirements and requirements are immutable. Therefore, a ``SequentialCommandGroup`` ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/SequentialCommandGroup.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_sequential_command_group.html), :external:py:class:`Python <commands2.SequentialCommandGroup>`) that intakes a game piece, indexes it, aims a shooter, and shoots it would reserve all three subsystems (the intake, indexer, and shooter), precluding any of those subsystems from performing other operations in their "downtime". If this is not desired, the subsystems that should only be reserved for the composition while they are actively being used by it should have their commands proxied.

.. warning:: Do not use ``ProxyCommand`` unless you are sure of what you are doing and there is no other way to accomplish your need! Proxying is only intended for use as an escape hatch from command composition requirement unions.

.. note:: Because proxied commands still require their subsystem, despite not leaking that requirement to the composition, all of the commands that require a given subsystem must be proxied if one of them is. Otherwise, when the proxied command is scheduled its requirement will conflict with that of the composition, canceling the composition.

.. tab-set-code::

   ```java
   // composition requirements are indexer and shooter, intake still reserved during its command but not afterwards
   Commands.sequence(
      intake.intakeGamePiece().asProxy(), // we want to let the intake intake another game piece while we are processing this one
      indexer.processGamePiece(),
      shooter.aimAndShoot()
   );
   ```

   ```c++
   // composition requirements are indexer and shooter, intake still reserved during its command but not afterwards
   wpi::cmd::cmd::Sequence(
      intake.IntakeGamePiece().AsProxy(), // we want to let the intake intake another game piece while we are processing this one
      indexer.ProcessGamePiece(),
      shooter.AimAndShoot()
   );
   ```

   ```python
   # composition requirements are indexer and shooter, intake still reserved during its command but not afterwards
   commands2.cmd.sequence(
      intake.intakeGamePiece().asProxy(), # we want to let the intake intake another game piece while we are processing this one
      indexer.processGamePiece(),
      shooter.aimAndShoot()
   )
   ```

For cases that don't need to track the proxied command, ``ScheduleCommand`` ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/command2/ScheduleCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1cmd_1_1_schedule_command.html), :external:py:class:`Python <commands2.ScheduleCommand>`) schedules a specified command and ends instantly.

.. tab-set-code::

   ```java
   // ScheduleCommand ends immediately, so the sequence continues
   new ScheduleCommand(Commands.waitSeconds(5.0))
      .andThen(Commands.print("This will be printed immediately!"))
   ```

   ```c++
   // ScheduleCommand ends immediately, so the sequence continues
   wpi::cmd::ScheduleCommand(wpi::cmd::cmd::Wait(5.0_s))
      .AndThen(wpi::cmd::cmd::Print("This will be printed immediately!"))
   ```

   ```python
   # ScheduleCommand ends immediately, so the sequence continues
   ScheduleCommand(commands2.cmd.waitSeconds(5.0))
      .andThen(commands2.cmd.print("This will be printed immediately!"))
   ```

## Subclassing Compositions

Command compositions can also be written as a constructor-only subclass of the most exterior composition type, passing the composition members to the superclass constructor. Consider the following from the Hatch Bot example project ([Java](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-4/wpilibjExamples/src/main/java/org/wpilib/examples/hatchbottraditional), [C++](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-4/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional)):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-4/wpilibjExamples/src/main/java/org/wpilib/examples/hatchbottraditional/commands/ComplexAuto.java
         :language: java
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-4/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/commands/ComplexAuto.hpp
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-4/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/commands/ComplexAuto.cpp
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: Python
      :sync: Python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/HatchbotTraditional/commands/complexauto.py
         :language: python
         :lines: 7-
         :lineno-match:

The advantages and disadvantages of this subclassing approach in comparison to others are discussed in :ref:`docs/software/commandbased/commands-v2/organizing-command-based:Subclassing Command Groups`.
