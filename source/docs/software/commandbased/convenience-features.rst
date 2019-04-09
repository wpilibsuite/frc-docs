Convenience features
====================

While the previously-described methodologies will work fine for writing
command-based robot code, the command-based libraries contain several
convenience features for more-advanced users that can greatly reduce the
verbosity/complexity of command-based code. It is highly recommended
that users familiarize themselves with these features to maximize the
value they get out of the command-based libraries.

.. _inlined-commands:

Inline command definitions
--------------------------

While users are able to create commands by explicitly writing command
classes (either by subclassing ``SendableCommandBase`` or implementing
``Command``), for many commands (such as those that simply call a single
subsystem method) this involves a lot of wasteful boilerplate code. To
help alleviate this, many of the prewritten commands included in the
command-based library may be *inlined* - that is, the command body can
be defined in a single line of code at command construction.

Passing subroutines as parameters
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In order to inline a command definition, users require some way to
specify what code the commands will run as constructor parameters.
Fortunately, both Java and C++ offer users the ability to pass
subroutines as parameters.

Method references (Java)
^^^^^^^^^^^^^^^^^^^^^^^^

In Java, a reference to a subroutine that can be passed as a parameter
is called a method reference. The general syntax for a method reference
is ``object::method``. Note that no method parameters are included,
since the method *itself* is the parameter. The method is not being
called - it is being passed to another piece of code (in this case, a
command) so that *that* code can call it when needed. For further
information on method references, see `the official Oracle
documentation <https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html>`__.

Lambda expressions (Java)
^^^^^^^^^^^^^^^^^^^^^^^^^

While method references work well for passing a subroutine that has
already been written, often it is inconvenient/wasteful to write a
subroutine solely for the purpose of sending as a method reference, if
that subroutine will never be used elsewhere. To avoid this, Java also
supports a feature called “lambda expressions.” A lambda expression is
an inline method definition - it allows a subroutine to be defined
*inside of a parameter list*. For specifics on how to write lambda
expressions, see `this
tutorial <http://tutorials.jenkov.com/java/lambda-expressions.html>`__

Inlined command example
~~~~~~~~~~~~~~~~~~~~~~~

So, what does an inlined command definition look like in practice?

The ``InstantCommand`` class provides an example of a type of command
that benefits greatly from inlining. Consider the following from the
HatchBotInlined example in the examples directory:

.. code-block:: java

   // Grab the hatch when the 'A' button is pressed.
   driverController.getButton(Button.kA.value)
       .whenPressed(new InstantCommand(m_hatchSubsystem::grabHatch, m_hatchSubsystem));
   // Release the hatch when the 'B' button is pressed.
   driverController.getButton(Button.kB.value)
       .whenPressed(new InstantCommand(m_hatchSubsystem::releaseHatch, m_hatchSubsystem));

Instead of wastefully writing separate ``GrabHatch`` and
``ReleaseHatch`` commands which call only one method before ending, both
can be accomplished with a simple inline definition by passing
appropriate subsystem method.

Included pre-made command classes
---------------------------------

The command-based library includes a variety of pre-written commands for
commonly-encountered use cases. Many of these commands are intended to
be used “out-of-the-box” via `inlining <inline-commands>`__,
however they may be subclassed, as well. A list of the included pre-made
commands can be found below, along with brief examples of each - for
more rigorous documentation, see the javadoc (TODO: link).

ConditionalCommand
~~~~~~~~~~~~~~~~~~

The ``ConditionalCommand`` class runs one of two commands when executed,
depending on a user-specified true-or-false condition:

.. code-block:: java

   // Runs either commandOnTrue or commandOnFalse depending on the value of m_limitSwitch.get()
   new ConditionalCommand(commandOnTrue, commandOnFalse, m_limitSwitch::get)

SelectCommand
~~~~~~~~~~~~~

The ``SelectCommand`` class is a generalization of the
``ConditionalCommand`` class, runs one of a selection of commands based
on the value of a user-specified selector:

.. code-block:: java

   // The enum used as keys for selecting the command to run.
   private enum CommandSelector {
     one, two, three
   }

   // An example selector method for the selectcommand.  Returns the selector that will select
   // which command to run.  Can base this choice on logical conditions evaluated at runtime.
   private CommandSelector select() {
     return CommandSelector.one;
   }

   // An example selectcommand.  Will select from the three commands based on the value returned
   // by the selector method at runtime.  Note that selectcommand takes a generic type, so the
   // selector does not have to be an enum; it could be any desired type (string, integer,
   // boolean, double...)
   private Command exampleSelectCommand =
       new SelectCommand<CommandSelector>(
           // Maps selector values to commands
           Map.ofEntries(
               entry(CommandSelector.one, new PrintCommand("Command one was selected!")),
               entry(CommandSelector.two, new PrintCommand("Command two was selected!")),
               entry(CommandSelector.three, new PrintCommand("Command three was selected!"))
           ),
           this::select
       );

.. _instant-command:

InstantCommand
~~~~~~~~~~~~~~

The ``InstantCommand`` class executes a single action on initialization,
and then ends immediately:

.. code-block:: java

   // Actuates the hatch subsystem to grab the hatch
   new InstantCommand(m_hatchSubsystem::grabHatch, m_hatchSubsystem)

.. _run-command:

RunCommand
~~~~~~~~~~

The ``RunCommand`` class runs a specified method repeatedly in its
``execute()`` block. It does not have end conditions by default; users
can either subclass it, or decorate it (TODO: link) to add them.

.. code-block:: java

   // A split-stick arcade command, with forward/backward controlled by the left
   // hand, and turning controlled by the right.
   new RunCommand(() -> m_robotDrive.arcadeDrive(
       driverController.getY(GenericHID.Hand.kLeft),
       driverController.getX(GenericHID.Hand.kRight)),
       m_robotDrive)

StartEndCommand
~~~~~~~~~~~~~~~

The ``StartEndCommand`` class executes an action when starting, and a
second one when ending. It does not have end conditions by default;
users can either subclass it, or decorate (TODO: link) an inlined
command to add them.

.. code-block:: java

   new StartEndCommand(
       // Start driving forward at the start of the command
       () -> m_robotDrive.arcadeDrive(kAutoDriveSpeed, 0),
       // Stop driving at the end of the command
       () -> m_robotDrive.arcadeDrive(0, 0),
       // Requires the drive subsystem
       m_robotDrive
   )

FunctionalCommand
~~~~~~~~~~~~~~~~~

The ``FunctionalCommand`` class allows all four ``Command`` methods to
be passed in as method references or lambdas:

.. code-block:: java

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

PrintCommand
~~~~~~~~~~~~

The ``PrintCommand`` class prints a given string.

.. code-block:: java

   new PrintCommand("This message will be printed!)

ScheduleCommand
~~~~~~~~~~~~~~~

The ``ScheduleCommand`` class schedules a specified command, and ends
instantly:

.. code-block:: java

   // Schedules commandToSchedule when run
   new ScheduleCommand(commandToSchedule)

It is often useful for “forking off” from command groups.

BlockingScheduleCommand
~~~~~~~~~~~~~~~~~~~~~~~

The ``BlockingScheduleCommand`` class schedules a specified command, and
does not end until that command ends:

.. code-block:: java

   // Schedules commandToSchedule when run, does not end until commandToSchedule is no longer scheduled
   new ScheduleCommand(commandToSchedule)

This is also often useful for “forking off” from commandgroups, when it
is required that the command group flow depend on the “forked off”
command.

WaitCommand
~~~~~~~~~~~

The ``WaitCommand`` class does nothing, and ends after a specified
period of time elapses after its initial scheduling:

.. code-block:: java

   // Ends 5 seconds after being scheduled
   new WaitCommand(5)

This is often useful as a component of a command group.

WaitUntilCommand
~~~~~~~~~~~~~~~~

The ``WaitUntilCommand`` class does nothing, and ends once a specified
condition becomes true, or until a specified match time passes.

.. code-block:: java

   // Ends after the 60-second mark of the current match
   new WaitUntilCommand(60)

.. code-block:: java

   // Ends after m_limitSwitch.get() returns true
   new WaitUntilCommand(m_limitSwitch::get)

PerpetualCommand
~~~~~~~~~~~~~~~~

The ``PerpetualCommand`` class runs a given command with its end
condition removed, so that it runs forever (unless externally
interrupted):

.. code-block:: java

   // Will run commandToRunForever perpetually, even if its isFinished() method returns true
   new PerpetualCommand(commandToRunForever)

Command decorator methods
-------------------------

The ``Command`` interface contains a number of defaulted “decorator”
methods which can be used to add additional functionality to existing
commands. A “decorator” method is a method that takes an object (in this
case, a command) and returns an object of the same type (i.e. a command)
with some additional functionality added to it. A list of the included
decorator methods with brief examples is included below - for rigorous
documentation, see the javadoc (TODO: link).

withTimeout
~~~~~~~~~~~

The ``withTimeout()`` decorator adds a timeout to a command. The
decorated command will be interrupted if the timeout expires:

.. code-block:: java

   // Will time out 5 seconds after being scheduled, and be interrupted
   command.withTimeout(5)

interruptOn
~~~~~~~~~~~

The ``interruptOn()`` decorator adds a condition on which the command
will be interrupted:

.. code-block:: java

   // Will be interrupted if m_limitSwitch.get() returns true
   command.interruptOn(m_limitswitch::get)

whenFinished
~~~~~~~~~~~~

The ``whenFinished()`` decorator adds a method to be executed after the
command ends:

.. code-block:: java

   // Will print "hello" after ending
   command.whenFinished(() -> System.out.println("hello"))

beforeStarting
~~~~~~~~~~~~~~

The ``beforeStarting()`` decorator adds a method to be executed before
the command starts:

.. code-block:: java

   // Will print "hello" before starting
   command.beforeStarting(() -> System.out.println("hello"))

andThen
~~~~~~~

The ``andThen()`` decorator returns a sequential command group
containing the command, followed by the list of commands passed as
arguments:

.. code-block:: java

   // Will be the sequence fooCommand -> barCommand -> bazCommand
   fooCommand.andThen(barCommand, bazCommand)

alongWith
~~~~~~~~~

The ``alongWith()`` decorator returns a parallel command group
containing the command, along with all the other commands passed in as
arguments:

.. code-block:: java

   // Will be a parallel command group containing fooCommand, barCommand, and bazCommand
   fooCommand.alongWith(barCommand, bazCommand)

raceWith
~~~~~~~~

The ``raceWith()`` decorator returns a parallel command race containing
the command, along with all the other commands passed in as arguments:

.. code-block:: java

   // Will be a parallel command race containing fooCommand, barCommand, and bazCommand
   fooCommand.raceWith(barCommand, bazCommand)

deadlineWith
~~~~~~~~~~~~

The ``deadlineWith()`` decorator returns a parallel deadline group
containing the command, along with all the other commands passed in as
arguments:

.. code-block:: java

   // Will be a parallel deadline group containing fooCommand, barCommand, and bazCommand; fooCommand is the deadline
   fooCommand.deadlineWith(barCommand, bazCommand)

perpetually
~~~~~~~~~~~

The ``perpetually()`` decorator removes the end condition of a command,
so that it runs forever.

.. code-block:: java

   // Will run forever unless externally interrupted, regardless of command.isFinished()
   command.perpetually()

Composing decorators
~~~~~~~~~~~~~~~~~~~~

Remember that decorators, like all command groups, can be composed! This
allows very powerful and concise inline expressions:

.. code-block:: java

   // Will run fooCommand, and then a race between barCommand and bazCommand
   fooCommand.andThen(barCommand.raceWith(bazCommand()))

Static factory methods for command groups
-----------------------------------------

If users do not wish to use the ``andThen``, ``alongWith``,
``raceWith``, and ``deadlineWith`` decorators for declaring command
groups, but still wish to reduce verbosity compared to calling the
constructors, the ``CommandGroupBase`` class contains several four
static factory methods for declaring command groups: ``sequence()``,
``parallel()``, ``race()``, and ``deadline()``. When used from within a
command group subclass or in combination with ``import static``, these
become extremely concise and greatly aid in command composition:

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