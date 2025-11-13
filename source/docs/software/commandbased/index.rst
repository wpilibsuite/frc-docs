# Command-Based Programming

This section serves as an introduction to and reference for the WPILib command-based framework.

WPILib offers two command-based frameworks:

- **Commands v2**: The stable, production-ready framework supporting Java, C++, and Python. Uses a declarative programming style with method chaining and lambda expressions.
- **Commands v3**: A newer Java-only framework offering an imperative programming style with coroutines. Currently in development with enhanced features.

.. note:: Most teams should use **Commands v2**, which is battle-tested and supports all WPILib languages. Java teams interested in coroutine-based imperative programming may explore Commands v3.

For a collection of example projects using the command-based framework, see :ref:`docs/software/examples-tutorials/wpilib-examples:Command-Based Examples`.

.. toctree::
   :maxdepth: 1
   :caption: Command-Based Frameworks

   commands-v2/index
   commands-v3/index

## Choosing Between v2 and v3

### Use Commands v2 if

- You need C++ or Python support
- You want the most stable and widely-used framework
- Your team is comfortable with declarative/functional programming
- You're new to command-based programming

### Use Commands v3 if

- You're a Java team
- You prefer imperative control flow (loops, if-statements) over method chaining
- You want to use the actively developed framework with new features
- You're comfortable with more advanced programming concepts
