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

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined/RobotContainer.java
      :language: java
      :lines: 90-95
      :linenos:
      :lineno-start: 90

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/include/RobotContainer.h
      :language: c++
      :lines: 66-68
      :linenos:
      :lineno-start: 66

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/RobotContainer.cpp
      :language: c++
      :lines: 35-40
      :linenos:
      :lineno-start: 35

Instead of wastefully writing separate ``GrabHatch`` and ``ReleaseHatch`` commands which call only one method before ending, both can be accomplished with a simple inline definition by passing appropriate subsystem method.

Included Command Types
----------------------

The command-based library includes a variety of pre-written commands for commonly-encountered use cases. See :ref:`docs/software/commandbased/builtins:WPILib Command classes`.

Command Decorator Methods
-------------------------

The ``Command`` interface contains a number of defaulted "decorator" methods which can be used to add additional functionality to existing commands. See :ref:`docs/software/commandbased/decorators:Command Decorator Methods`.

Static Factory Methods for Command Groups (Java only)
-----------------------------------------------------

.. note:: These factory methods are not included in the C++ command library, as the reduction in verbosity would be minimal - C++ commands should be stack-allocated, removing the need for the ``new`` keyword.

If users do not wish to use the ``andThen``, ``alongWith``, ``raceWith``, and ``deadlineWith`` decorators for declaring command groups, but still wish to reduce verbosity compared to calling the constructors, the ``CommandGroupBase`` `class <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/CommandGroupBase.html>`__ contains four static factory methods for declaring command groups: ``sequence()``, ``parallel()``, ``race()``, and ``deadline()``. When used from within a command group subclass or in combination with ``import static``, these become extremely concise and greatly aid in command composition:

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
