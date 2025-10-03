# Commands v2 Programming

This section serves as an introduction to and reference for the WPILib Commands v2 framework.

Commands v2 is the stable, production-ready command-based framework that supports Java, C++, and Python. It uses a declarative programming style with method chaining and lambda expressions to compose robot behaviors.

For a collection of example projects using Commands v2, see :ref:`docs/software/examples-tutorials/wpilib-examples:Command-Based Examples`.

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

## Why Commands v2?

Commands v2 is recommended for:

- **Multi-language support**: Full support for Java, C++, and Python
- **Proven stability**: Battle-tested across thousands of FRC robots
- **Rich ecosystem**: Extensive examples, tutorials, and community resources
- **Team flexibility**: Works well for teams of all experience levels
- **Broad platform support**: Works on roboRIO, simulation, and coprocessors

## Key Concepts

The command-based pattern is based around two core abstractions:

**Commands** represent actions the robot can take. Commands run when scheduled, until they are interrupted or their end condition is met. Commands are recursively composable: commands can be combined to accomplish more complex tasks.

**Subsystems** represent independently-controlled collections of robot hardware (such as motor controllers, sensors, pneumatic actuators, etc.) that operate together. Subsystems back the resource-management system of command-based: only one command can use a given subsystem at the same time.

## Considering Commands v3?

If you're a Java team interested in imperative-style command writing with coroutines, see :ref:`docs/software/commandbased/commands-v3/index:Commands v3 Programming`. For migration guidance, see :ref:`docs/software/commandbased/commands-v3/migration-from-v2:Migrating from Commands v2 to v3`.
