Command Decorator Methods
=========================

The ``Command`` interface contains a number of defaulted "decorator" methods which can be used to add additional functionality to existing commands. A "decorator" method is a method that takes an object (in this case, a command) and returns an object of the same type (i.e. a command) with some additional functionality added to it. A list of the included decorator methods with brief examples is included below - for rigorous documentation, see the API docs (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Command.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_command.html>`__).

.. important:: After calling a decorator, the command object cannot be reused! Use only the command object returned from the decorator.

withTimeout
-----------

The ``withTimeout()`` decorator (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Command.html#withTimeout(double)>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_command.html#a7d1ba6905ebca2f7e000942b318b59ae>`__) adds a timeout to a command. The
decorated command will be interrupted if the timeout expires:

.. tabs::

  .. code-tab:: java

    // Will time out 5 seconds after being scheduled, and be interrupted
    button.whenPressed(command.withTimeout(5));

  .. code-tab:: c++

    // Will time out 5 seconds after being scheduled, and be interrupted
    button.WhenPressed(command.WithTimeout(5.0_s));

until
-----

The ``until()`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Command.html#until(java.util.function.BooleanSupplier)>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_command.html#a1617d60548cc8a75c12f5ddfe8e3c38c>`__) decorator adds a condition on which the command will be interrupted:

.. tabs::

  .. code-tab:: java

    // Will be interrupted if m_limitSwitch.get() returns true
    button.whenPressed(command.until(m_limitSwitch::get));

  .. code-tab:: c++

    // Will be interrupted if m_limitSwitch.get() returns true
    button.WhenPressed(command.Until([&m_limitSwitch] { return m_limitSwitch.Get(); }));

``until()`` replaces the deprecated ``withInterrupt()``.

andThen
-------

The ``andThen()`` decorator (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Command.html#andThen(edu.wpi.first.wpilibj2.command.Command...)>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_command.html#ab0cc63118f578b328222ab2e9f1b7b65>`__) adds a method to be executed after the command ends:

.. tabs::

  .. code-tab:: java

    // Will print "hello" after ending
    button.whenPressed(command.andThen(() -> System.out.println("hello")));

  .. code-tab:: c++

    // Will print "hello" after ending
    button.WhenPressed(command.AndThen([] { std::cout << "hello"; }));

beforeStarting
--------------

The ``beforeStarting()`` decorator (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Command.html#beforeStarting(edu.wpi.first.wpilibj2.command.Command)>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_command.html#ab8d1d6ccf24f90ffa9be270544dd7162>`__) adds a method to be executed before the command starts:

.. tabs::

  .. code-tab:: java

    // Will print "hello" before starting
    button.whenPressed(command.beforeStarting(() -> System.out.println("hello")));

  .. code-tab:: c++

    // Will print "hello" before starting
    button.WhenPressed(command.BeforeStarting([] { std::cout << "hello"; }));

alongWith (Java only)
---------------------

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a parallel command group the ordinary way instead.

The ``alongWith()`` `decorator <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Command.html#alongWith(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a :ref:`parallel command group <docs/software/commandbased/command-groups:ParallelCommandGroup>`. All commands will execute at the same time and each will end independently of each other:

.. code-block:: java

   // Will be a parallel command group that ends after three seconds with all three commands running their full duration.
   button.whenPressed(oneSecCommand.alongWith(twoSecCommand, threeSecCommand));

raceWith (Java only)
--------------------

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a parallel race group the ordinary way instead.

The ``raceWith()`` `decorator <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Command.html#raceWith(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a :ref:`parallel race group <docs/software/commandbased/command-groups:ParallelRaceGroup>` that ends as soon as the first command ends.  At this point all others are interrupted.  It doesn't matter which command is the calling command:

.. code-block:: java

   // Will be a parallel race group that ends after one second with the two and three second commands getting interrupted.
   button.whenPressed(twoSecCommand.raceWith(oneSecCommand, threeSecCommand));

deadlineWith (Java only)
------------------------

.. note:: This decorator is not supported in C++ due to technical constraints - users should simply construct a parallel deadline group the ordinary way instead.

The ``deadlineWith()`` `decorator <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Command.html#deadlineWith(edu.wpi.first.wpilibj2.command.Command...)>`__ returns a :ref:`parallel deadline group <docs/software/commandbased/command-groups:ParallelDeadlineGroup>` with the calling command being the deadline.  When this deadline command ends it will interrupt any others that are not finished:

.. code-block:: java

   // Will be a parallel deadline group that ends after two seconds (the deadline) with the three second command getting interrupted (one second command already finished).
   button.whenPressed(twoSecCommand.deadlineWith(oneSecCommand, threeSecCommand));

withName (Java only)
--------------------

.. note:: This decorator is not supported in C++ due to technical constraints - users should set the name of the command inside their command class instead.

The ``withName()`` `decorator <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/CommandBase.html#withName(java.lang.String)>`__ adds a name to a command. This name will appear on a dashboard when the command is sent via the `sendable interface <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/CommandBase.html#initSendable(edu.wpi.first.util.sendable.SendableBuilder)>`__.

.. code-block:: java

   // This command will be called "My Command".
   var command = new PrintCommand("Hello robot!").withName("My Command");

repeatedly
----------

The ``repeatedly()`` decorator (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Command.html#repeatedly()>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_command.html#a2f03abf3d59fcd539385e39526751512>`__) restarts the command each time it ends, so that it runs forever.

.. tabs::

  .. code-tab:: java

    // Will run forever unless externally interrupted, regardless of command.isFinished()
    button.whenPressed(command.repeatedly());

  .. code-tab:: c++

    // Will run forever unless externally interrupted, regardless of command.isFinished()
    button.WhenPressed(command.Repeatedly());

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

ignoringDisable
^^^^^^^^^^^^^^^

The ``ignoringDisable(boolean)`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/Command.html#ignoringDisable(boolean)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc2_1_1_command.html#af7f8cbee58cacc610a5200a653fd9ed2>`__) wraps the command in a new command which has the given value as its :ref:`docs/software/commandbased/commands:runsWhenDisabled` property, setting whether the command can run when the robot is disabled (defaults to ``false``).

.. important:: Hardware outputs are disabled when the robot is disabled, regardless of ``runsWhenDisabled()``!

.. tabs::

  .. code-tab:: java

    // This command can run during disabled
    Command canRunDuringDisable = command.ignoringDisable(true);

  .. code-tab:: c++

    // This command can run during disabled
    std::unique_ptr<Command*> canRunDuringDisable = command.IgnoringDisable(true);

withInterruptBehavior
^^^^^^^^^^^^^^^^^^^^^

The ``withInterruptBehavior(Command.InterruptionBehavior)`` decorator (`Java <https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/Command.html#withInterruptBehavior(edu.wpi.first.wpilibj2.command.Command.InterruptionBehavior)>`__, `C++ <https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc2_1_1_command.html#a5c82f4b2188946cbddc39ccbde6ef37a>`__) wraps the command in a new command which has the given value as its :ref:`docs/software/commandbased/commands:getInterruptionBehavior` property, setting defines what happens if another command sharing a requirement is scheduled while this one is running (defaults to ``kCancelSelf``).

.. tabs::

  .. code-tab:: java

    Command uninterruptible = command.withInterruptBehavior(Command.InterruptBehavior.kCancelIncoming);

  .. code-tab:: c++

    std::unique_ptr<frc2::Command*> uninterruptible = command.WithInterruptBehavior(frc2::Command::InterruptBehavior::kCancelIncoming);

Composing Decorators
--------------------

Remember that decorators, like all command groups, can be composed! This allows very powerful and concise inline expressions:

.. code-block:: java

   // Will run fooCommand, and then a race between barCommand and bazCommand
   button.whenPressed(fooCommand.andThen(barCommand.raceWith(bazCommand)));
