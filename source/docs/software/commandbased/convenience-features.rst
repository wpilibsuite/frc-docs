Convenience Features
====================

While the previously-described methodologies will work fine for writing command-based robot code, the command-based libraries contain several convenience features for more-advanced users that can greatly reduce the verbosity/complexity of command-based code. It is highly recommended that users familiarize themselves with these features to maximize the value they get out of the command-based libraries.

Inline Command Definitions
--------------------------

While users are able to create commands by explicitly writing command classes (either by subclassing ``CommandBase`` or implementing ``Command``), for many commands (such as those that simply call a single subsystem method) this involves a lot of wasteful boilerplate code. To help alleviate this, many of the prewritten commands included in the command-based library may be *inlined* - that is, the command body can be defined in a single line of code at command construction.

Passing Subroutines As Parameters
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In order to inline a command definition, users require some way to specify what code the commands will run as constructor parameters. Fortunately, both Java and C++ offer users the ability to pass subroutines as parameters.

Method References (Java)
~~~~~~~~~~~~~~~~~~~~~~~~

In Java, a reference to a subroutine that can be passed as a parameter is called a method reference. The general syntax for a method reference is ``object::method``. Note that no method parameters are included, since the method *itself* is the parameter. The method is not being called - it is being passed to another piece of code (in this case, a command) so that *that* code can call it when needed. For further information on method references, see `the official Oracle documentation <https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html>`__.

Lambda Expressions (Java)
~~~~~~~~~~~~~~~~~~~~~~~~~

While method references work well for passing a subroutine that has already been written, often it is inconvenient/wasteful to write a subroutine solely for the purpose of sending as a method reference, if that subroutine will never be used elsewhere. To avoid this, Java also supports a feature called “lambda expressions.” A lambda expression is an inline method definition - it allows a subroutine to be defined *inside of a parameter list*. For specifics on how to write Java lambda expressions, see `this tutorial <https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html#syntax>`__

Lambda Expressions (C++)
~~~~~~~~~~~~~~~~~~~~~~~~

C++ lacks a close equivalent to Java method references - pointers to member functions are generally not directly useable as parameters due to the presence of the implicit ``this`` parameter.  However, C++ does offer lambda expressions - in addition, the lambda expressions offered by C++ are in many ways more powerful than those in Java.  For specifics on how to write C++ lambda expressions, see `cppreference <https://en.cppreference.com/w/cpp/language/lambda>`__.

Inlined Command Example
^^^^^^^^^^^^^^^^^^^^^^^

So, what does an inlined command definition look like in practice?

The ``InstantCommand`` class provides an example of a type of command that benefits greatly from inlining. Consider the following from the HatchBotInlined example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/HatchbotInlined>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined/RobotContainer.java
      :language: java
      :lines: 99-104
      :linenos:
      :lineno-start: 99

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/include/RobotContainer.h
      :language: c++
      :lines: 63-65
      :linenos:
      :lineno-start: 63

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/RobotContainer.cpp
      :language: c++
      :lines: 39-42
      :linenos:
      :lineno-start: 39

Instead of wastefully writing separate ``GrabHatch`` and ``ReleaseHatch`` commands which call only one method before ending, both can be accomplished with a simple inline definition by passing appropriate subsystem method.

Included Command Types
----------------------

The command-based library includes a variety of pre-written commands for commonly-encountered use cases. Many of these commands are intended to be used “out-of-the-box” via `inlining <#inline-command-definitions>`_, however they may be subclassed, as well. A list of the included pre-made commands can be found below, along with brief examples of each - for more rigorous documentation, see the API docs (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/package-summary.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html>`__).

ConditionalCommand
^^^^^^^^^^^^^^^^^^

The ``ConditionalCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/ConditionalCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1ConditionalCommand.html>`__) runs one of two commands when executed, depending on a user-specified true-or-false condition:

.. tabs::

  .. code-tab:: java

    // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
    new ConditionalCommand(commandOnTrue, commandOnFalse, m_limitSwitch::get)

  .. code-tab:: c++

    // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
    frc2::ConditionalCommand(commandOnTrue, commandOnFalse, [&m_limitSwitch] { return m_limitSwitch.Get(); })

SelectCommand
^^^^^^^^^^^^^

.. note:: While the Java version of SelectCommand simply uses an ``Object`` as a key, the C++ version is templated on the key type.

.. note:: An alternate version of SelectCommand simply takes a method that supplies the command to be run - this can be very succinct, but makes inferring the command's requirements impossible, and so leaves the user responsible for manually adding the requirements to the SelectCommand.

The ``SelectCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/SelectCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1SelectCommand.html>`__) is a generalization of the ``ConditionalCommand`` class that runs one of a selection of commands based on the value of a user-specified selector.  The following example code is taken from the SelectCommand example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/selectcommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/SelectCommand>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/selectcommand/RobotContainer.java
      :language: java
      :lines: 27-51
      :linenos:
      :lineno-start: 27

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibcExamples/src/main/cpp/examples/SelectCommand/include/RobotContainer.h
      :language: c++
      :lines: 28-47
      :linenos:
      :lineno-start: 28

InstantCommand
^^^^^^^^^^^^^^

The ``InstantCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/InstantCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1InstantCommand.html>`__) executes a single action on initialization, and then ends immediately:

.. tabs::

  .. code-tab:: java

    // Actuates the hatch subsystem to grab the hatch
    new InstantCommand(m_hatchSubsystem::grabHatch, m_hatchSubsystem)

  .. code-tab:: c++

    // Actuates the hatch subsystem to grab the hatch
    frc2::InstantCommand([&m_hatchSubsystem] { m_hatchSubsystem.GrabHatch(); }, {&m_hatchSubsystem})

RunCommand
^^^^^^^^^^

The ``RunCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/RunCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1RunCommand.html>`__) runs a specified method repeatedly in its ``execute()`` block. It does not have end conditions by default; users can either subclass it, or `decorate <#command-decorator-methods>`_ it to add them.

.. tabs::

  .. code-tab:: java

    // A split-stick arcade command, with forward/backward controlled by the left
    // hand, and turning controlled by the right.
    new RunCommand(() -> m_robotDrive.arcadeDrive(
        driverController.getY(GenericHID.Hand.kLeft),
        driverController.getX(GenericHID.Hand.kRight)),
        m_robotDrive)

  .. code-tab:: c++

    // A split-stick arcade command, with forward/backward controlled by the left
    // hand, and turning controlled by the right.
    frc2::RunCommand(
      [this] {
        m_drive.ArcadeDrive(
            m_driverController.GetY(frc::GenericHID::kLeftHand),
            m_driverController.GetX(frc::GenericHID::kRightHand));
      },
      {&m_drive}))

StartEndCommand
^^^^^^^^^^^^^^^

The ``StartEndCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/StartEndCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1StartEndCommand.html>`__) executes an action when starting, and a second one when ending. It does not have end conditions by default; users can either subclass it, or `decorate <#command-decorator-methods>`_ an inlined command to add them.

.. tabs::

  .. code-tab:: java

    new StartEndCommand(
        // Start driving forward at the start of the command
        () -> m_robotDrive.arcadeDrive(kAutoDriveSpeed, 0),
        // Stop driving at the end of the command
        () -> m_robotDrive.arcadeDrive(0, 0),
        // Requires the drive subsystem
        m_robotDrive
    )

  .. code-tab:: c++

    frc2::StartEndCommand(
      // Start driving forward at the start of the command
      [this] { m_drive.ArcadeDrive(ac::kAutoDriveSpeed, 0); },
      // Stop driving at the end of the command
      [this] { m_drive.ArcadeDrive(0, 0); },
      // Requires the drive subsystem
      {&m_drive}
    )

FunctionalCommand
^^^^^^^^^^^^^^^^^

The ``FunctionalCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/FunctionalCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1FunctionalCommand.html>`__) allows all four ``Command`` methods to be passed in as method references or lambdas:

.. tabs::

  .. code-tab:: java

    new FunctionalCommand(
        // Reset encoders on command start
        m_robotDrive::resetEncoders,
        // Start driving forward at the start of the command
        () -> m_robotDrive.arcadeDrive(kAutoDriveSpeed, 0),
        // Stop driving at the end of the command
        () -> m_robotDrive.arcadeDrive(0, 0),
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
      [this] { m_drive.ArcadeDrive(0, 0); },
      // End the command when the robot's driven distance exceeds the desired value
      [this] { return m_drive.GetAverageEncoderDistance() >= kAutoDriveDistanceInches; },
      // Requires the drive subsystem
      {&m_drive}
    )

PrintCommand
^^^^^^^^^^^^

The ``PrintCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/PrintCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1PrintCommand.html>`__) prints a given string.

.. tabs::

  .. code-tab:: java

    new PrintCommand("This message will be printed!")

  .. code-tab:: c++

    frc2::PrintCommand("This message will be printed!)

ScheduleCommand
^^^^^^^^^^^^^^^

The ``ScheduleCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/ScheduleCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1ScheduleCommand.html>`__) schedules a specified command, and ends instantly:

.. tabs::

  .. code-tab:: java

    // Schedules commandToSchedule when run
    new ScheduleCommand(commandToSchedule)

  .. code-tab:: c++

    // Schedules commandToSchedule when run
    frc2::ScheduleCommand(&commandToSchedule)

This is often useful for "forking off" from command groups: by default, commands in command groups are run *through* the command group, and are never themselves seen by the scheduler.  Accordingly, their requirements are added to the group's requirements.  While this is usually fine, sometimes it is undesirable for the entire command group to gain the requirements of a single command - a good solution is to "fork off" from the command group and schedule that command separately.

ProxyScheduleCommand
^^^^^^^^^^^^^^^^^^^^

The ``ProxyScheduleCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/ProxyScheduleCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1ProxyScheduleCommand.html>`__) schedules a specified command, and does not end until that command ends:

.. tabs::

  .. code-tab:: java

    // Schedules commandToSchedule when run, does not end until commandToSchedule is no longer scheduled
    new ProxyScheduleCommand(commandToSchedule)

  .. code-tab:: c++

    // Schedules commandToSchedule when run, does not end until commandToSchedule is no longer scheduled
    frc2::ProxyScheduleCommand(&commandToSchedule)

This is often useful for "forking off" from command groups: by default, commands in command groups are run *through* the command group, and are never themselves seen by the scheduler.  Accordingly, their requirements are added to the group's requirements.  While this is usually fine, sometimes it is undesirable for the entire command group to gain the requirements of a single command - a good solution is to "fork off" from the command group and schedule the command separately.

WaitCommand
^^^^^^^^^^^

The ``WaitCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/WaitCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1WaitCommand.html>`__) does nothing, and ends after a specified period of time elapses after its initial scheduling:

.. tabs::

  .. code-tab:: java

    // Ends 5 seconds after being scheduled
    new WaitCommand(5)

  .. code-tab:: c++

    // Ends 5 seconds after being scheduled
    frc2::WaitCommand(5)

This is often useful as a component of a command group.

WaitUntilCommand
^^^^^^^^^^^^^^^^

.. warning:: The match timer used by WaitUntilCommand does *not* provide an official match time!  While it is fairly accurate, use of this timer can *not* guarantee the legality of your robot's actions.

The ``WaitUntilCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/WaitUntilCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1WaitUntilCommand.html>`__) does nothing, and ends once a specified condition becomes true, or until a specified match time passes.

.. tabs::

  .. code-tab:: java

    // Ends after the 60-second mark of the current match
    new WaitUntilCommand(60)

    // Ends after m_limitSwitch.get() returns true
    new WaitUntilCommand(m_limitSwitch::get)

  .. code-tab:: c++

    // Ends after the 60-second mark of the current match
    frc2::WaitUntilCommand(60)

    // Ends after m_limitSwitch.Get() returns true
    frc2::WaitUntilCommand([&m_limitSwitch] { return m_limitSwitch.Get(); })

PerpetualCommand
^^^^^^^^^^^^^^^^

The ``PerpetualCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/PerpetualCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1PerpetualCommand.html>`__) runs a given command with its end condition removed, so that it runs forever (unless externally interrupted):

.. tabs::

  .. code-tab:: java

    // Will run commandToRunForever perpetually, even if its isFinished() method returns true
    new PerpetualCommand(commandToRunForever)

  .. code-tab:: c++

    // Will run commandToRunForever perpetually, even if its isFinished() method returns true
    frc2::PerpetualCommand(commandToRunForever)

Command Decorator Methods
-------------------------

The ``Command`` interface contains a number of defaulted “decorator”
methods which can be used to add additional functionality to existing
commands. A “decorator” method is a method that takes an object (in this
case, a command) and returns an object of the same type (i.e. a command)
with some additional functionality added to it. A list of the included
decorator methods with brief examples is included below - for rigorous
documentation, see the API docs (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html>`__).

withTimeout
^^^^^^^^^^^

The ``withTimeout()`` decorator (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#withTimeout(double)>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html#a3a10e79038afc9bc7c98461b7dbb895b>`__) adds a timeout to a command. The
decorated command will be interrupted if the timeout expires:

.. tabs::

  .. code-tab:: java

    // Will time out 5 seconds after being scheduled, and be interrupted
    button.whenPressed(command.withTimeout(5));

  .. code-tab:: c++

    // Will time out 5 seconds after being scheduled, and be interrupted
    button.WhenPressed(command.WithTimeout(5));

interruptOn
^^^^^^^^^^^

The ``interruptOn()`` (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#interruptOn(java.util.function.BooleanSupplier)>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html#a6efa0fe6197b11036d947b2a8dfdee0b>`__) decorator adds a condition on which the command will be interrupted:

.. tabs::

  .. code-tab:: java

    // Will be interrupted if m_limitSwitch.get() returns true
    button.whenPressed(command.interruptOn(m_limitSwitch::get));

  .. code-tab:: c++

    // Will be interrupted if m_limitSwitch.get() returns true
    button.WhenPressed(command.InterruptOn([&m_limitSwitch] { return m_limitSwitch.Get(); }));

whenFinished
^^^^^^^^^^^^

The ``whenFinished()`` decorator (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#whenFinished(java.lang.Runnable)>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html#a935487276747ed668967259856b90165>`__) adds a method to be executed after the command ends:

.. tabs::

  .. code-tab:: java

    // Will print "hello" after ending
    button.whenPressed(command.whenFinished(() -> System.out.println("hello")));

  .. code-tab:: c++

    // Will print "hello" after ending
    button.WhenPressed(command.WhenFinished([] { std::cout << "hello"; }));

beforeStarting
^^^^^^^^^^^^^^

The ``beforeStarting()`` decorator (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#beforeStarting(java.lang.Runnable)>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html#a65155a6d7062deed375da196d2ba4c89>`__) adds a method to be executed before the command starts:

.. tabs::

  .. code-tab:: java

    // Will print "hello" before starting
    button.whenPressed(command.beforeStarting(() -> System.out.println("hello")));

  .. code-tab:: c++

    // Will print "hello" before starting
    button.WhenPressed(command.BeforeStarting([] { std::cout << "hello"; }));

andThen (Java only)
^^^^^^^^^^^^^^^^^^^

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a sequential command group the ordinary way instead.

The ``andThen()`` `decorator <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#andThen(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a sequential command group containing the command, followed by the list of commands passed as arguments:

.. code-block:: java

   // Will be the sequence fooCommand -> barCommand -> bazCommand
   button.whenPressed(fooCommand.andThen(barCommand, bazCommand));

alongWith (Java only)
^^^^^^^^^^^^^^^^^^^^^

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a parallel command group the ordinary way instead.

The ``alongWith()`` `decorator <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#alongWith(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a parallel command group containing the command, along with all the other commands passed in as arguments:

.. code-block:: java

   // Will be a parallel command group containing fooCommand, barCommand, and bazCommand
   button.whenPressed(fooCommand.alongWith(barCommand, bazCommand));

raceWith (Java only)
^^^^^^^^^^^^^^^^^^^^

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a parallel race group the ordinary way instead.

The ``raceWith()`` `decorator <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#raceWith(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a parallel command race containing the command, along with all the other commands passed in as arguments:

.. code-block:: java

   // Will be a parallel command race containing fooCommand, barCommand, and bazCommand
   button.whenPressed(fooCommand.raceWith(barCommand, bazCommand));

deadlineWith (Java only)
^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a parallel deadline group the ordinary way instead.

The ``deadlineWith()`` `decorator <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#deadlineWith(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a parallel deadline group containing the command, along with all the other commands passed in as arguments:

.. code-block:: java

   // Will be a parallel deadline group containing fooCommand, barCommand, and bazCommand; fooCommand is the deadline
   button.whenPressed(fooCommand.deadlineWith(barCommand, bazCommand));

perpetually
^^^^^^^^^^^

The ``perpetually()`` decorator (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/Command.html#perpetually()>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1Command.html#ae1583c73c9b953d8ff730d4809926518>`__) removes the end condition of a command, so that it runs forever.

.. tabs::

  .. code-tab:: java

    // Will run forever unless externally interrupted, regardless of command.isFinished()
    button.whenPressed(command.perpetually());

  .. code-tab:: c++

    // Will run forever unless externally interrupted, regardless of command.isFinished()
    button.WhenPressed(command.Perpetually());

Composing Decorators
^^^^^^^^^^^^^^^^^^^^

Remember that decorators, like all command groups, can be composed! This allows very powerful and concise inline expressions:

.. code-block:: java

   // Will run fooCommand, and then a race between barCommand and bazCommand
   button.whenPressed(fooCommand.andThen(barCommand.raceWith(bazCommand)));

Static Factory Methods for Command Groups (Java only)
-----------------------------------------------------

.. note:: These factory methods are not included in the C++ command library, as the reduction in verbosity would be minimal - C++ commands should be stack-allocated, removing the need for the ``new`` keyword.

If users do not wish to use the ``andThen``, ``alongWith``, ``raceWith``, and ``deadlineWith`` decorators for declaring command groups, but still wish to reduce verbosity compared to calling the constructors, the ``CommandGroupBase`` `class <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/CommandGroupBase.html>`__ contains four static factory methods for declaring command groups: ``sequence()``, ``parallel()``, ``race()``, and ``deadline()``. When used from within a command group subclass or in combination with ``import static``, these become extremely concise and greatly aid in command composition:

.. code-block:: java

   public class ExampleSequence extends SequentialCommandGroup {

     // Will run a FooCommand, and then a race between a BarCommand and a BazCommand
     public ExampleSequence() {
       addCommands(
           new FooCommand(),
           race(
               new BarCommand(),
               new BazCommand()
           )
       );
     }

   }
