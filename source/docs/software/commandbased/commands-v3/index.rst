# Commands v3 Programming

.. note:: Commands v3 is currently in development for the 2027 season. This documentation is a work in progress.

This section serves as an introduction to and reference for the WPILib Commands v3 framework.

Commands v3 is the next-generation command-based framework for Java that introduces imperative-style command writing using coroutines. Instead of building complex chains of lambda expressions and decorators, you can write command logic as straightforward sequential code with loops, conditionals, and explicit control flow.

**Java teams are encouraged to alpha test Commands v3 and provide feedback.** Commands v3 is actively being developed with new features including improved telemetry, enhanced trigger functionality, and priority-based interruption.

.. warning::
   Commands v3 is **Java-only** and does not support C++ or Python.

.. note::
   **Single-Threaded Requirement**: The Commands v3 scheduler must run on a single thread. Call ``Scheduler.getDefault().run()`` from ``robotPeriodic()`` as usual, but do not use the scheduler from virtual threads or other threads.

## Should You Use Commands v3?

**Use Commands v3 if:**

- You're a Java team
- You want improved telemetry, enhanced triggers, and priority-based interruption
- You prefer imperative control flow (loops, if-statements) over declarative composition
- You're starting fresh or ready to migrate for the 2027 season

**Stick with Commands v2 if:**

- You need C++ or Python support
- Your team isn't ready to migrate yet
- You have significant existing v2 code that works well

.. note::
   Commands v2 will continue to be maintained, but new features and improvements are focused on v3.

See :ref:`docs/software/commandbased/commands-v2/index:Commands v2 Programming` for the v2 documentation.

## Documentation Contents

.. toctree::
   :maxdepth: 1

   what-is-commands-v3
   getting-started
   mechanisms
   commands-and-coroutines
   async-await-patterns
   command-compositions
   binding-commands-to-triggers
   priorities-and-interrupts
   structuring-v3-project
   testing-and-simulation
   telemetry-and-debugging
   troubleshooting
   migration-from-v2
   advanced-topics

## Quick Example

Here's a simple "drive for distance" command written in Commands v3 style:

.. code-block:: java

   Command driveTenFeet = drivetrain
     .run(coroutine -> {
       drivetrain.resetEncoders();
       while (drivetrain.getDistanceMeters() < 3.048) {
         drivetrain.tank(0.5, 0.5);
         coroutine.yield(); // Let scheduler run other commands
       }
       drivetrain.stop();
     })
     .named("Drive 10 ft");

Compare this to the equivalent v2 style which requires chaining multiple decorators and command groups to achieve the same sequential logic.

## What's New in v3?

- **Imperative command bodies**: Write commands as sequential code using ``Coroutine`` objects
- **Mechanisms replace Subsystems**: Similar concept with refined API and naming
- **Command priorities**: Fine-grained interrupt control beyond simple "interrupt or reject"
- **Async/await helpers**: ``await()``, ``awaitAll()``, ``awaitAny()``, ``fork()`` for orchestrating multiple commands
- **Explicit naming**: Commands require names for better debugging and dashboard visibility
- **Cooperative yielding**: Use ``coroutine.yield()`` to pause and let the scheduler run other commands
- **Enhanced telemetry**: Per-instance command tracking with performance metrics

## Core Concepts

### Mechanisms

Mechanisms (like v2 Subsystems) represent robot hardware groupings and act as exclusive resources. Only one command can require a mechanism at a time. See :ref:`docs/software/commandbased/commands-v3/mechanisms:Mechanisms` for details.

### Coroutines

Coroutines enable cooperative multitasking. When you write a command body, you receive a ``Coroutine`` object that provides:

- ``yield()``: Pause and let the scheduler run other commands
- ``await(command)``: Schedule another command and wait for it to finish
- ``wait(time)`` and ``waitUntil(condition)``: Delay or block on conditions
- ``park()``: Pause forever until canceled or interrupted

See :ref:`docs/software/commandbased/commands-v3/commands-and-coroutines:Commands and Coroutines` for a deep dive.

### Priorities

Commands have priority levels. When a new command conflicts with a running command, it only starts if it has equal or higher priority. This provides more control than v2's simple "interrupt or reject" model. See :ref:`docs/software/commandbased/commands-v3/priorities-and-interrupts:Priorities and Interrupts`.

## Getting Started

Start with :ref:`docs/software/commandbased/commands-v3/getting-started:Getting Started with Commands v3` for a hands-on introduction.

If you're migrating from Commands v2, see :ref:`docs/software/commandbased/commands-v3/migration-from-v2:Migrating from Commands v2 to v3`.
