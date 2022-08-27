Convenience Features
====================

While the previously-described methodologies will work fine for writing command-based robot code, the command-based libraries contain several convenience features for more-advanced users that can greatly reduce the verbosity/complexity of command-based code. It is highly recommended that users familiarize themselves with these features to maximize the value they get out of the command-based libraries.

Included Command Types
----------------------

The command-based library includes a variety of pre-written commands for commonly-encountered use cases. See :ref:`docs/software/commandbased/builtins:WPILib Command classes`.

Command Decorator Methods
-------------------------

The ``Command`` interface contains a number of defaulted "decorator" methods which can be used to add additional functionality to existing commands. See :ref:`docs/software/commandbased/decorators:Command Decorator Methods`.

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
