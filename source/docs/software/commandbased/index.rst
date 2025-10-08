# Command-Based Programming

This section serves as an introduction to and reference for the WPILib command-based framework.

WPILib provides two versions of the command-based framework:

.. grid:: 1 2 2 2
   :gutter: 3

   .. grid-item-card::
      :class-header: sd-bg-success sd-text-white

      **Commands v3** (Recommended for Java Teams)

      ^^^

      The next-generation command framework with imperative-style command writing using coroutines. Features improved telemetry, enhanced trigger system, and self-canceling commands. This is the future of WPILib command-based programming.

      **Best for:** Java teams

      +++

      .. button-ref:: commands-v3/index
         :color: success
         :shadow:
         :align: center
         :expand:

         Commands v3 Documentation

   .. grid-item-card::
      :class-header: sd-bg-primary sd-text-white

      **Commands v2** (Maintained)

      ^^^

      The stable, production-ready command-based framework. Supports Java, C++, and Python. Uses a declarative composition style with method chaining and lambda expressions. Will continue to be maintained.

      **Best for:** C++/Python teams, teams not ready to migrate

      +++

      .. button-ref:: commands-v2/index
         :color: primary
         :shadow:
         :align: center
         :expand:

         Commands v2 Documentation

.. note::
   **WPILib recommends Commands v3 for Java teams.** Commands v3 is the future direction of command-based programming in WPILib, with ongoing development and enhancements including improved telemetry, better trigger functionality, and self-canceling commands. Java teams should migrate to v3 when ready. Commands v2 will continue to be maintained for teams using C++/Python or those not ready to migrate.

## Migrating Between Versions

If you're considering migrating from v2 to v3, see :ref:`docs/software/commandbased/commands-v3/migration-from-v2:Migrating from Commands v2 to v3`.

## Passing Functions As Parameters

Both command-based frameworks often accept functions as parameters of constructors, factories, and decorators. Fortunately, Java, C++, and Python offer users the ability to :ref:`pass functions as objects <docs/software/basic-programming/functions-as-data:Treating Functions as Data>`:

### Method References (Java)

In Java, a reference to a function that can be passed as a parameter is called a method reference. The general syntax for a method reference is ``object::method`` or ``Class::staticMethod``. Note that no method parameters are included, since the method *itself* is passed. The method is not being called - it is being passed to another piece of code (in this case, a command) so that *that* code can call it when needed. For further information on method references, see :ref:`docs/software/basic-programming/functions-as-data:Method References`.

### Lambda Expressions (Java)

While method references work well for passing a function that has already been written, often it is inconvenient/wasteful to write a function solely for the purpose of sending as a method reference, if that function will never be used elsewhere. To avoid this, Java also supports a feature called "lambda expressions." A lambda expression is an inline method definition - it allows a function to be defined *inside of a parameter list*. For specifics on how to write Java lambda expressions, see :ref:`docs/software/basic-programming/functions-as-data:Lambda Expressions in Java`.

### Lambda Expressions (C++)

.. warning:: Due to complications in C++ semantics, capturing ``this`` in a C++ lambda can cause a null pointer exception if done from a component command of a command composition. Whenever possible, C++ users should capture relevant command members explicitly and by value. For more details, see [here](https://github.com/wpilibsuite/allwpilib/issues/3109).

C++ lacks a close equivalent to Java method references - pointers to member functions are generally not directly usable as parameters due to the presence of the implicit ``this`` parameter. However, C++ does offer lambda expressions - in addition, the lambda expressions offered by C++ are in many ways more powerful than those in Java. For specifics on how to write C++ lambda expressions, see :ref:`docs/software/basic-programming/functions-as-data:Lambda Expressions in C++`.

## Example Projects

For a collection of example projects using the command-based frameworks, see :ref:`docs/software/examples-tutorials/wpilib-examples:Command-Based Examples`.

.. toctree::
   :maxdepth: 1
   :hidden:

   commands-v2/index
   commands-v3/index
