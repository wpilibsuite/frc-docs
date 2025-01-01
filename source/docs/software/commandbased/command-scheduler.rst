# The Command Scheduler

The ``CommandScheduler`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandScheduler.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_scheduler.html)) is the class responsible for actually running commands.  Each iteration (ordinarily once per 20ms), the scheduler polls all registered buttons, schedules commands for execution accordingly, runs the command bodies of all scheduled commands, and ends those commands that have finished or are interrupted.

The ``CommandScheduler`` also runs the ``periodic()`` method of each registered ``Subsystem``.

## Using the Command Scheduler

The ``CommandScheduler`` is a *singleton*, meaning that it is a globally-accessible class with only one instance.  Accordingly, in order to access the scheduler, users must call the ``CommandScheduler.getInstance()`` command.

For the most part, users do not have to call scheduler methods directly - almost all important scheduler methods have convenience wrappers elsewhere (e.g. in the ``Command`` and ``Subsystem`` classes).

However, there is one exception: users *must* call ``CommandScheduler.getInstance().run()`` from the ``robotPeriodic()`` method of their ``Robot`` class.  If this is not done, the scheduler will never run, and the command framework will not work.  The provided command-based project template has this call already included.

## The ``schedule()`` Method

To schedule a command, users call the ``schedule()`` method ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandScheduler.html#schedule(edu.wpi.first.wpilibj2.command.Command...)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_scheduler.html#a9f3f7bb5c1a3cf57592fe5cfadb6a57d)).  This method takes a command, and attempts to add it to list of currently-running commands, pending whether it is already running or whether its requirements are available.  If it is added, its ``initialize()`` method is called.

This method walks through the following steps:

#. Verifies that the command isn't in a composition.
#. :term:`No-op` if scheduler is disabled, command is already scheduled, or robot is disabled and command doesn't :ref:`docs/software/commandbased/commands:runsWhenDisabled`.
#. If requirements are in use:

   * If all conflicting commands are interruptible, cancel them.
   * If not, don't schedule the new command.
#. Call ``initialize()``.

.. tab-set::

   .. tab-item:: Java
      :sync: tabcode-java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/CommandScheduler.java
         :language: java
         :lines: 202-245
         :lineno-match:

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/CommandScheduler.java
         :language: java
         :lines: 181-191
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: tabcode-c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/native/cpp/frc2/command/CommandScheduler.cpp
         :language: c++
         :lines: 114-159
         :lineno-match:

## The Scheduler Run Sequence

.. note:: The ``initialize()`` method of each ``Command`` is called when the command is scheduled, which is not necessarily when the scheduler runs (unless that command is bound to a button).

What does a single iteration of the scheduler's ``run()`` method ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandScheduler.html#run()), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_scheduler.html#aa5000fa52e320da7ba72c196f34aa0f5)) actually do?  The following section walks through the logic of a scheduler iteration. For the full implementation, see the source code ([Java](https://github.com/wpilibsuite/allwpilib/blob/v2024.3.2/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/CommandScheduler.java#L252-L331), [C++](https://github.com/wpilibsuite/allwpilib/blob/v2024.3.2/wpilibNewCommands/src/main/native/cpp/frc2/command/CommandScheduler.cpp#L173-L253)).

### Step 1: Run Subsystem Periodic Methods

First, the scheduler runs the ``periodic()`` method of each registered ``Subsystem``. In simulation, each subsystem's ``simulationPeriodic()`` method is called as well.

.. tab-set::

   .. tab-item:: Java
      :sync: tabcode-java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/CommandScheduler.java
         :language: java
         :lines: 278-285
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: tabcode-c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/native/cpp/frc2/command/CommandScheduler.cpp
         :language: c++
         :lines: 183-190
         :lineno-match:

### Step 2: Poll Command Scheduling Triggers

.. note:: For more information on how trigger bindings work, see :doc:`binding-commands-to-triggers`

Secondly, the scheduler polls the state of all registered triggers to see if any new commands that have been bound to those triggers should be scheduled.  If the conditions for scheduling a bound command are met, the command is scheduled and its ``Initialize()`` method is run.

.. tab-set::

   .. tab-item:: Java
      :sync: tabcode-java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/CommandScheduler.java
         :language: java
         :lines: 290-292
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: tabcode-c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/native/cpp/frc2/command/CommandScheduler.cpp
         :language: c++
         :lines: 195-197
         :lineno-match:

### Step 3: Run/Finish Scheduled Commands

Thirdly, the scheduler calls the ``execute()`` method of each currently-scheduled command, and then checks whether the command has finished by calling the ``isFinished()`` method.  If the command has finished, the ``end()`` method is also called, and the command is de-scheduled and its required subsystems are freed.

Note that this sequence of calls is done in order for each command - thus, one command may have its ``end()`` method called before another has its ``execute()`` method called.  Commands are handled in the order they were scheduled.

.. tab-set::

   .. tab-item:: Java
      :sync: tabcode-java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/CommandScheduler.java
         :language: java
         :lines: 295-325
         :lineno-match:
         :emphasize-lines: 16,21-22

   .. tab-item:: C++ (Source)
      :sync: tabcode-c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/native/cpp/frc2/command/CommandScheduler.cpp
         :language: c++
         :lines: 201-226
         :lineno-match:
         :emphasize-lines: 7,13-14

### Step 4: Schedule Default Commands

Finally, any registered ``Subsystem`` has its default command scheduled (if it has one).  Note that the ``initialize()`` method of the default command will be called at this time.

.. tab-set::

   .. tab-item:: Java
      :sync: tabcode-java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/CommandScheduler.java
         :language: java
         :lines: 340-346
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: tabcode-c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.4.3/wpilibNewCommands/src/main/native/cpp/frc2/command/CommandScheduler.cpp
         :language: c++
         :lines: 240-246
         :lineno-match:

## Disabling the Scheduler

The scheduler can be disabled by calling ``CommandScheduler.getInstance().disable()``.  When disabled, the scheduler's ``schedule()`` and ``run()`` commands will not do anything.

The scheduler may be re-enabled by calling ``CommandScheduler.getInstance().enable()``.

## Command Event Methods

Occasionally, it is desirable to have the scheduler execute a custom action whenever a certain command event (initialization, execution, or ending) occurs.  This can be done with the following methods:

- ``onCommandInitialize`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandScheduler.html#onCommandInitialize(java.util.function.Consumer)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_scheduler.html#a5f983f0e45b0500c96eebe52780324d4)) runs a specified action whenever a command is initialized.

- ``onCommandExecute`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandScheduler.html#onCommandExecute(java.util.function.Consumer)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_scheduler.html#a58c538f4b8dd95e266e4a99167aa7f99)) runs a specified action whenever a command is executed.

- ``onCommandFinish`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandScheduler.html#onCommandFinish(java.util.function.Consumer)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_scheduler.html#a068e61446afe2341cc0651f0dfd2a55f)) runs a specified action whenever a command finishes normally (i.e. the ``isFinished()`` method returned true).

- ``onCommandInterrupt`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandScheduler.html#onCommandInterrupt(java.util.function.Consumer)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_scheduler.html#ab5ba99a542aa778a76726d7c68461bf0)) runs a specified action whenever a command is interrupted (i.e. by being explicitly canceled or by another command that shares one of its requirements).

A typical use-case for these methods is adding markers in an event log whenever a command scheduling event takes place, as demonstrated in the following code from the HatchbotInlined example project ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotInlined)):

.. tab-set::

   .. tab-item:: Java
      :sync: tabcode-java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined/RobotContainer.java
         :language: java
         :lines: 73-88
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: tabcode-c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-2/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/RobotContainer.cpp
         :language: c++
         :lines: 23-47
         :lineno-match:
