Command-Based Programming
=========================

.. note:: Old (pre-2020) command-based is no longer available in 2023. Users should migrate to the new command-based framework below. Documentation for old command-based is available `here <https://docs.wpilib.org/en/2021/docs/software/old-commandbased/index.html>`_.

This sequence of articles serves as an introduction to and reference for the WPILib command-based framework.

For a collection of example projects using the command-based framework, see :ref:`docs/software/examples-tutorials/wpilib-examples:Command-Based Examples`.

.. toctree::
   :maxdepth: 1

   what-is-command-based
   commands
   command-compositions
   subsystems
   binding-commands-to-triggers
   structuring-command-based-project
   organizing-command-based
   command-scheduler
   cpp-command-discussion
   pid-subsystems-commands
   profile-subsystems-commands
   profilepid-subsystems-commands
   command-based-changes

Passing Functions As Parameters
-------------------------------

In order to provide a concise inline syntax, the command-based library often accepts functions as parameters of constructors, factories, and decorators. Fortunately, both Java and C++ offer users the ability to :ref:`pass functions as objects <docs/software/basic-programming/functions-as-data:Treating Functions as Data>`:

Method References (Java)
^^^^^^^^^^^^^^^^^^^^^^^^

In Java, a reference to a function that can be passed as a parameter is called a method reference. The general syntax for a method reference is ``object::method``. Note that no method parameters are included, since the method *itself* is passed. The method is not being called - it is being passed to another piece of code (in this case, a command) so that *that* code can call it when needed. For further information on method references, see :ref:`docs/software/basic-programming/functions-as-data:Method References`.

Lambda Expressions (Java)
^^^^^^^^^^^^^^^^^^^^^^^^^

While method references work well for passing a function that has already been written, often it is inconvenient/wasteful to write a function solely for the purpose of sending as a method reference, if that function will never be used elsewhere. To avoid this, Java also supports a feature called "lambda expressions." A lambda expression is an inline method definition - it allows a function to be defined *inside of a parameter list*. For specifics on how to write Java lambda expressions, see :ref:`docs/software/basic-programming/functions-as-data:Lambda Expressions in Java`.

Lambda Expressions (C++)
^^^^^^^^^^^^^^^^^^^^^^^^

.. warning:: Due to complications in C++ semantics, capturing ``this`` in a C++ lambda can cause a null pointer exception if done from a component command of a command composition.  Whenever possible, C++ users should capture relevant command members explicitly and by value.  For more details, see `here <https://github.com/wpilibsuite/allwpilib/issues/3109>`__.

C++ lacks a close equivalent to Java method references - pointers to member functions are generally not directly useable as parameters due to the presence of the implicit ``this`` parameter.  However, C++ does offer lambda expressions - in addition, the lambda expressions offered by C++ are in many ways more powerful than those in Java.  For specifics on how to write C++ lambda expressions, see :ref:`docs/software/basic-programming/functions-as-data:Lambda Expressions in C++`.
