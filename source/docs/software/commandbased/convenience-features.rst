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

While method references work well for passing a subroutine that has already been written, often it is inconvenient/wasteful to write a subroutine solely for the purpose of sending as a method reference, if that subroutine will never be used elsewhere. To avoid this, Java also supports a feature called "lambda expressions." A lambda expression is an inline method definition - it allows a subroutine to be defined *inside of a parameter list*. For specifics on how to write Java lambda expressions, see `this tutorial <https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html#syntax>`__.

Lambda Expressions (C++)
~~~~~~~~~~~~~~~~~~~~~~~~

.. warning:: Due to complications in C++ semantics, capturing ``this`` in a C++ lambda can cause a null pointer exception if done from a component command of a command group.  Whenever possible, C++ users should capture relevant command members explicitly and by value.  For more details, see `here <https://github.com/wpilibsuite/allwpilib/issues/3109>`__.

C++ lacks a close equivalent to Java method references - pointers to member functions are generally not directly useable as parameters due to the presence of the implicit ``this`` parameter.  However, C++ does offer lambda expressions - in addition, the lambda expressions offered by C++ are in many ways more powerful than those in Java.  For specifics on how to write C++ lambda expressions, see `cppreference <https://en.cppreference.com/w/cpp/language/lambda>`__.

Inlined Command Example
^^^^^^^^^^^^^^^^^^^^^^^

So, what does an inlined command definition look like in practice?

The ``InstantCommand`` class provides an example of a type of command that benefits greatly from inlining. Consider the following from the HatchBotInlined example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotInlined>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.4.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined/RobotContainer.java
      :language: java
      :lines: 90-95
      :linenos:
      :lineno-start: 90

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.4.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/include/RobotContainer.h
      :language: c++
      :lines: 66-68
      :linenos:
      :lineno-start: 66

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.4.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/RobotContainer.cpp
      :language: c++
      :lines: 35-40
      :linenos:
      :lineno-start: 35

Instead of wastefully writing separate ``GrabHatch`` and ``ReleaseHatch`` commands which call only one method before ending, both can be accomplished with a simple inline definition by passing appropriate subsystem method.

Included Command Types
----------------------

The command-based library includes a variety of pre-written commands for commonly-encountered use cases. Many of these commands are intended to be used "out-of-the-box" via `inlining <#inline-command-definitions>`_, however they may be subclassed, as well. A list of the included pre-made commands can be found below, along with brief examples of each - for more rigorous documentation, see the API docs (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/package-summary.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_command.html>`__).

ConditionalCommand
^^^^^^^^^^^^^^^^^^

The ``ConditionalCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ConditionalCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_conditional_command.html>`__) runs one of two commands when executed, depending on a user-specified true-or-false condition:

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

The ``SelectCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/SelectCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_select_command.html>`__) is a generalization of the ``ConditionalCommand`` class that runs one of a selection of commands based on the value of a user-specified selector.  The following example code is taken from the SelectCommand example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/selectcommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/SelectCommand>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.4.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/selectcommand/RobotContainer.java
      :language: java
      :lines: 20-45
      :linenos:
      :lineno-start: 20

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.4.1/wpilibcExamples/src/main/cpp/examples/SelectCommand/include/RobotContainer.h
      :language: c++
      :lines: 25-44
      :linenos:
      :lineno-start: 25

InstantCommand
^^^^^^^^^^^^^^

The ``InstantCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/InstantCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_instant_command.html>`__) executes a single action on initialization, and then ends immediately:

.. tabs::

  .. code-tab:: java

    // Actuates the hatch subsystem to grab the hatch
    new InstantCommand(m_hatchSubsystem::grabHatch, m_hatchSubsystem)

  .. code-tab:: c++

    // Actuates the hatch subsystem to grab the hatch
    frc2::InstantCommand([&m_hatchSubsystem] { m_hatchSubsystem.GrabHatch(); }, {&m_hatchSubsystem})

RunCommand
^^^^^^^^^^

The ``RunCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/RunCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_run_command.html>`__) runs a specified method repeatedly in its ``execute()`` block. It does not have end conditions by default; users can either subclass it, or `decorate <#command-decorator-methods>`_ it to add them.

.. tabs::

  .. code-tab:: java

    // A split-stick arcade command, with forward/backward controlled by the left
    // hand, and turning controlled by the right.
    new RunCommand(() -> m_robotDrive.arcadeDrive(
        -driverController.getY(GenericHID.Hand.kLeft),
        driverController.getX(GenericHID.Hand.kRight)),
        m_robotDrive)

  .. code-tab:: c++

    // A split-stick arcade command, with forward/backward controlled by the left
    // hand, and turning controlled by the right.
    frc2::RunCommand(
      [this] {
        m_drive.ArcadeDrive(
            -m_driverController.GetY(frc::GenericHID::kLeftHand),
            m_driverController.GetX(frc::GenericHID::kRightHand));
      },
      {&m_drive}))

StartEndCommand
^^^^^^^^^^^^^^^

The ``StartEndCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/StartEndCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_start_end_command.html>`__) executes an action when starting, and a second one when ending. It does not have end conditions by default; users can either subclass it, or `decorate <#command-decorator-methods>`_ an inlined command to add them.

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

The ``FunctionalCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/FunctionalCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_functional_command.html>`__) allows all four ``Command`` methods to be passed in as method references or lambdas:

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

The ``PrintCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/PrintCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_print_command.html>`__) prints a given string.

.. tabs::

  .. code-tab:: java

    new PrintCommand("This message will be printed!")

  .. code-tab:: c++

    frc2::PrintCommand("This message will be printed!")

ScheduleCommand
^^^^^^^^^^^^^^^

The ``ScheduleCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ScheduleCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_schedule_command.html>`__) schedules a specified command, and ends instantly:

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

The ``ProxyScheduleCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ProxyScheduleCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_proxy_schedule_command.html>`__) schedules a specified command, and does not end until that command ends:

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

The ``WaitCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/WaitCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_wait_command.html>`__) does nothing, and ends after a specified period of time elapses after its initial scheduling:

.. tabs::

  .. code-tab:: java

    // Ends 5 seconds after being scheduled
    new WaitCommand(5)

  .. code-tab:: c++

    // Ends 5 seconds after being scheduled
    frc2::WaitCommand(5.0_s)

This is often useful as a component of a command group.

``WaitCommand`` can also be subclassed to create a more complicated command that runs for a period of time. If ``WaitCommand`` is used in this method, the user must ensure that the ``WaitCommand``'s ``Initialize``, ``End``, and ``IsFinished`` methods are still called in order for the WaitCommand's timer to work.

WaitUntilCommand
^^^^^^^^^^^^^^^^

.. warning:: The match timer used by WaitUntilCommand does *not* provide an official match time!  While it is fairly accurate, use of this timer can *not* guarantee the legality of your robot's actions.

The ``WaitUntilCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/WaitUntilCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_wait_until_command.html>`__) does nothing, and ends once a specified condition becomes true, or until a specified match time passes.

.. tabs::

  .. code-tab:: java

    // Ends after the 60-second mark of the current match
    new WaitUntilCommand(60)

    // Ends after m_limitSwitch.get() returns true
    new WaitUntilCommand(m_limitSwitch::get)

  .. code-tab:: c++

    // Ends after the 60-second mark of the current match
    frc2::WaitUntilCommand(60.0_s)

    // Ends after m_limitSwitch.Get() returns true
    frc2::WaitUntilCommand([&m_limitSwitch] { return m_limitSwitch.Get(); })

PerpetualCommand
^^^^^^^^^^^^^^^^

The ``PerpetualCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/PerpetualCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_perpetual_command.html>`__) runs a given command with its end condition removed, so that it runs forever (unless externally interrupted):

.. tabs::

  .. code-tab:: java

    // Will run commandToRunForever perpetually, even if its isFinished() method returns true
    new PerpetualCommand(commandToRunForever)

  .. code-tab:: c++

    // Will run commandToRunForever perpetually, even if its isFinished() method returns true
    frc2::PerpetualCommand(commandToRunForever)

Command Decorator Methods
-------------------------

The ``Command`` interface contains a number of defaulted "decorator"
methods which can be used to add additional functionality to existing
commands. A "decorator" method is a method that takes an object (in this
case, a command) and returns an object of the same type (i.e. a command)
with some additional functionality added to it. A list of the included
decorator methods with brief examples is included below - for rigorous
documentation, see the API docs (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_command.html>`__).

withTimeout
^^^^^^^^^^^

The ``withTimeout()`` decorator (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#withTimeout(double)>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#a7d1ba6905ebca2f7e000942b318b59ae>`__) adds a timeout to a command. The
decorated command will be interrupted if the timeout expires:

.. tabs::

  .. code-tab:: java

    // Will time out 5 seconds after being scheduled, and be interrupted
    button.whenPressed(command.withTimeout(5));

  .. code-tab:: c++

    // Will time out 5 seconds after being scheduled, and be interrupted
    button.WhenPressed(command.WithTimeout(5.0_s));

until/withInterrupt
^^^^^^^^^^^^^^^^^^^

The ``until()`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#until(java.util.function.BooleanSupplier)>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#a1617d60548cc8a75c12f5ddfe8e3c38c>`__) decorator adds a condition on which the command will be interrupted:

.. tabs::

  .. code-tab:: java

    // Will be interrupted if m_limitSwitch.get() returns true
    button.whenPressed(command.until(m_limitSwitch::get));

  .. code-tab:: c++

    // Will be interrupted if m_limitSwitch.get() returns true
    button.WhenPressed(command.Until([&m_limitSwitch] { return m_limitSwitch.Get(); }));

``withInterrupt()`` is an alias for ``until()``.

andThen
^^^^^^^

The ``andThen()`` decorator (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#andThen(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#ab0cc63118f578b328222ab2e9f1b7b65>`__) adds a method to be executed after the command ends:

.. tabs::

  .. code-tab:: java

    // Will print "hello" after ending
    button.whenPressed(command.andThen(() -> System.out.println("hello")));

  .. code-tab:: c++

    // Will print "hello" after ending
    button.WhenPressed(command.AndThen([] { std::cout << "hello"; }));

beforeStarting
^^^^^^^^^^^^^^

The ``beforeStarting()`` decorator (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#beforeStarting(edu.wpi.first.wpilibj2.command.Command)>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#ab8d1d6ccf24f90ffa9be270544dd7162>`__) adds a method to be executed before the command starts:

.. tabs::

  .. code-tab:: java

    // Will print "hello" before starting
    button.whenPressed(command.beforeStarting(() -> System.out.println("hello")));

  .. code-tab:: c++

    // Will print "hello" before starting
    button.WhenPressed(command.BeforeStarting([] { std::cout << "hello"; }));

alongWith (Java only)
^^^^^^^^^^^^^^^^^^^^^

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a parallel command group the ordinary way instead.

The ``alongWith()`` `decorator <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#alongWith(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a :ref:`parallel command group <docs/software/commandbased/command-groups:ParallelCommandGroup>`. All commands will execute at the same time and each will end independently of each other:

.. code-block:: java

   // Will be a parallel command group that ends after three seconds with all three commands running their full duration.
   button.whenPressed(oneSecCommand.alongWith(twoSecCommand, threeSecCommand));

raceWith (Java only)
^^^^^^^^^^^^^^^^^^^^

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a parallel race group the ordinary way instead.

The ``raceWith()`` `decorator <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#raceWith(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a :ref:`parallel race group <docs/software/commandbased/command-groups:ParallelRaceGroup>` that ends as soon as the first command ends.  At this point all others are interrupted.  It doesn't matter which command is the calling command:

.. code-block:: java

   // Will be a parallel race group that ends after one second with the two and three second commands getting interrupted.
   button.whenPressed(twoSecCommand.raceWith(oneSecCommand, threeSecCommand));

deadlineWith (Java only)
^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a parallel deadline group the ordinary way instead.

The ``deadlineWith()`` `decorator <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#deadlineWith(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a :ref:`parallel deadline group <docs/software/commandbased/command-groups:ParallelDeadlineGroup>` with the calling command being the deadline.  When this deadline command ends it will interrupt any others that are not finished:

.. code-block:: java

   // Will be a parallel deadline group that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
   button.whenPressed(twoSecCommand.deadlineWith(oneSecCommand, threeSecCommand));

withName (Java only)
^^^^^^^^^^^^^^^^^^^^

.. note:: This decorator is not supported in C++ due to technical constraints - users should set the name of the command inside their command class instead.

The ``withName()`` `decorator <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandBase.html#withName(java.lang.String)>`__ adds a name to a command. This name will appear on a dashboard when the command is sent via the `sendable interface <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandBase.html#initSendable(edu.wpi.first.util.sendable.SendableBuilder)>`__.

.. code-block:: java

   // This command will be called "My Command".
   var command = new PrintCommand("Hello robot!").withName("My Command");

perpetually
^^^^^^^^^^^

The ``perpetually()`` decorator (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Command.html#perpetually()>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/classfrc2_1_1_command.html#a4e72c5be424accbf416cf35be061c918>`__) removes the end condition of a command, so that it runs forever.

.. tabs::

  .. code-tab:: java

    // Will run forever unless externally interrupted, regardless of command.isFinished()
    button.whenPressed(command.perpetually());

  .. code-tab:: c++

    // Will run forever unless externally interrupted, regardless of command.isFinished()
    button.WhenPressed(command.Perpetually());

unless
^^^^^^
The ``unless()`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/Command.html#unless(java.util.function.BooleanSupplier)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc2_1_1_command.html#a61630f22b45df20ede2e14f14cfd2708>`__) creates a conditional command that stops the command from starting if the supplier returns true. The command will not stop if the supplier changes while running. The new conditional command will use the requirements of the decorated command so even if the condition to run the command is not met, any commands using the requirements will be canceled.

.. tabs::

  .. code-tab:: java

    // Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
    button.whenPressed(command.unless(() -> !intake.isDeployed()));

  .. code-tab:: c++

    // Command will only run if the intake is deployed. If the intake gets deployed while the command is running, the command will not stop running
    button.WhenPressed(command.Unless([&intake] { return !intake.IsDeployed(); }));

Composing Decorators
^^^^^^^^^^^^^^^^^^^^

Remember that decorators, like all command groups, can be composed! This allows very powerful and concise inline expressions:

.. code-block:: java

   // Will run fooCommand, and then a race between barCommand and bazCommand
   button.whenPressed(fooCommand.andThen(barCommand.raceWith(bazCommand)));

Static Factory Methods for Command Groups (Java only)
-----------------------------------------------------

.. note:: These factory methods are not included in the C++ command library, as the reduction in verbosity would be minimal - C++ commands should be stack-allocated, removing the need for the ``new`` keyword.

If users do not wish to use the ``andThen``, ``alongWith``, ``raceWith``, and ``deadlineWith`` decorators for declaring command groups, but still wish to reduce verbosity compared to calling the constructors, the ``CommandGroupBase`` `class <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandGroupBase.html>`__ contains four static factory methods for declaring command groups: ``sequence()``, ``parallel()``, ``race()``, and ``deadline()``. When used from within a command group subclass or in combination with ``import static``, these become extremely concise and greatly aid in command composition:

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
