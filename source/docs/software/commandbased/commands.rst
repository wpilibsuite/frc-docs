Commands
========

Commands are simple state machines that perform high-level robot functions using the methods defined by subsystems. Commands can be either idle, in which they do nothing, or scheduled, in which the scheduler will execute a specific set of the command’s code depending on the state of the command. The ``CommandScheduler`` recognizes scheduled commands as being in one of three states: initializing, executing, or ending. Commands specify what is done in each of these states through the ``initialize()``, ``execute()`` and ``end()`` methods.  Commands are represented in the command-based library by the Command interface (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html>`__).

Creating Commands
-----------------

.. note:: In the C++ API, a `CRTP <https://en.wikipedia.org/wiki/Curiously_recurring_template_pattern>`__ is used to allow certain Command methods to work with the object ownership model.  Users should *always* extend the ``CommandHelper`` `class <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibNewCommands/src/main/native/include/frc2/command/CommandHelper.h>`__ when defining their own command classes, as is shown below.

Similarly to subsystems, the recommended method for most users to create a command is to subclass the abstract ``CommandBase`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/CommandBase.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1CommandBase.html>`__), as seen in the command-based template (`Java <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/commandbased/commands/ExampleCommand.java>`__, `C++ <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibcExamples/src/main/cpp/templates/commandbased/include/commands/ExampleCommand.h>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/commandbased/commands/ExampleCommand.java
      :language: java
      :lines: 10-29
      :linenos:
      :lineno-start: 10

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibcExamples/src/main/cpp/templates/commandbased/include/commands/ExampleCommand.h
      :language: c++
      :lines: 8-34
      :linenos:
      :lineno-start: 8

As before, this contains several convenience features. It automatically overrides the ``getRequirements()`` method for users, returning a list
of requirements that is empty by default, but can be added to with the ``addRequirements()`` method. It also implements the ``Sendable`` interface, and so can be sent to the dashboard - this provides a handy way for scheduling commands for testing (via a button on the dashboard) without needing to bind them to buttons on a controller.

Also as before, advanced users seeking more flexibility are free to simply create their own class implementing the ``Command`` interface.

The Structure of a Command
--------------------------

While subsystems are fairly freeform, and may generally look like whatever the user wishes them to, commands are quite a bit more constrained. Command code must specify what the command will do in each of its possible states. This is done by overriding the ``initialize()``, ``execute()``, and ``end()`` methods. Additionally, a command must be able to tell the scheduler when (if ever) it has finished execution - this is done by overriding the ``isFinished()`` method. All of these methods are defaulted to reduce clutter in user code: ``initialize()``, ``execute()``, and ``end()`` are defaulted to simply do nothing, while ``isFinished()`` is defaulted to return false (resulting in a command that never ends).

Initialization
^^^^^^^^^^^^^^

The ``initialize()`` method (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#initialize()>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html#ad3f1971a1b44ecdd4683d766f831bccd>`__) is run exactly once per time a command is scheduled, as part of the scheduler’s ``schedule()`` method. The scheduler’s ``run()`` method does not need to be called for the ``initialize()`` method to run. The initialize block should be used to place the command in a known starting state for execution. It is also useful for performing tasks that only need to be performed once per time scheduled, such as setting motors to run at a constant speed or setting the state of a solenoid actuator.

Execution
^^^^^^^^^

The ``execute()`` method (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#execute()>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html#a7d7ea1271f7dcc65c0ba3221d179b510>`__) is called repeatedly while the command is scheduled, whenever the scheduler’s ``run()`` method is called (this is generally done in the main robot periodic method, which runs every 20ms by default). The execute block should be used for any task that needs to be done continually while the command is scheduled, such as updating motor outputs to match joystick inputs, or using the output of a control loop.

Ending
^^^^^^

The ``end()`` method (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#end(boolean)>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html#a134eda3756f00c667bb5415b23ee920c>`__) is called once when the command ends, whether it finishes normally (i.e. ``isFinished()`` returned true) or it was interrupted (either by another command or by being explicitly canceled). The method argument specifies the manner in which the command ended; users can use this to differentiate the behavior of their command end accordingly. The end block should be used to “wrap up” command state in a neat way, such as setting motors back to zero or reverting a solenoid actuator to a “default” state.

Specifying end conditions
^^^^^^^^^^^^^^^^^^^^^^^^^

The ``isFinished()`` method (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#end(boolean)>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html#af5e8c12152d195a4f3c06789366aac88>`__) is called repeatedly while the command is scheduled, whenever the scheduler’s ``run()`` method is called. As soon as it returns true, the command’s ``end()`` method is called and it is un-scheduled. The ``isFinished()`` method is called *after* the ``execute()`` method, so the command *will* execute once on the same iteration that it is un-scheduled.

Simple Command Example
----------------------

What might a functional command look like in practice? As before, below is a simple command from the HatchBot example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional>`__) that uses the ``HatchSubsystem`` introduced in the previous section:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/commands/GrabHatch.java
      :language: java
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/commands/GrabHatch.h
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/commands/GrabHatch.cpp
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

Notice that the hatch subsystem used by the command is passed into the command through the command’s constructor. This is a pattern called `dependency injection <https://en.wikipedia.org/wiki/Dependency_injection>`__, and allows users to avoid declaring their subsystems as global variables. This is widely accepted as a best-practice - the reasoning behind this is discussed in a :doc:`later section <structuring-command-based-project>`.

Notice also that the above command calls the subsystem method once from initialize, and then immediately ends (as ``isFinished()`` simply returns true). This is typical for commands that toggle the states of subsystems, and in fact the command-based library includes code to make :ref:`commands like this <docs/software/commandbased/convenience-features:InstantCommand>` even more succinctly.

What about a more complicated case? Below is a drive command, from the same example project:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/commands/DefaultDrive.java
      :language: java
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/commands/DefaultDrive.h
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/commands/DefaultDrive.cpp
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

Notice that this command does not override ``isFinished()``, and thus will never end; this is the norm for commands that are intended to be used as default commands (and, as can be guessed, the library includes tools to make :ref:`this kind of command <docs/software/commandbased/convenience-features:RunCommand>` easier to write, too!).
