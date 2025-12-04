# Mechanisms

.. todo::
   This article provides a comprehensive guide to Mechanisms, the v3 replacement for Subsystems. It explains the philosophy behind Mechanisms, how to create them, best practices for encapsulation, and how they interact with the command system. The focus should be on teaching teams how to properly structure robot hardware abstractions in v3.

## Creating Mechanisms

.. todo::
   Describe how to create a Mechanism class. Cover:
   - Basic Mechanism class structure and constructor
   - When to create a Mechanism vs. other organizational patterns
   - Example of something that doesn't need a Mechanism (e.g., a vision system that provides data but doesn't need exclusive access)
   - Naming conventions for Mechanism classes
   - Where Mechanism classes should live in the project structure
   - Note: Mechanisms are automatically registered with the scheduler in the base class constructor

## Encapsulation Best Practices

.. todo::
   Explain encapsulation principles for Mechanisms. Cover:
   - What hardware and state should be encapsulated within a Mechanism
   - Public API design: what methods should be exposed vs. kept private
   - How to avoid leaking implementation details
   - Sensor data processing and filtering within Mechanisms
   - State management and validation
   - Examples of good vs. bad encapsulation patterns

## Default Commands

.. todo::
   Explain how default commands work with Mechanisms. Cover:
   - What default commands are and when to use them
   - How to set a default command for a Mechanism
   - Lifecycle of default commands (when they start/stop)
   - Common use cases (idle states, teleoperated control, etc.)
   - How default commands interact with other commands requiring the same Mechanism
   - Best practices for implementing default command behavior

## Periodic Updates

.. todo::
   Describe periodic update patterns in Mechanisms. Cover:
   - Mechanisms don't have a built-in periodic() method
   - Manual periodic functions can be plumbed if needed using `Scheduler.addPeriodic()`
   - Alternatively, call periodic functions manually in `robotPeriodic()`
   - Example patterns for sensor refresh methods
   - When to use periodic updates vs. command-based updates
   - Performance considerations for periodic operations
   - Common patterns like updating telemetry, processing sensor data, safety checks

## Command Factories

.. todo::
   Explain the command factory pattern for Mechanisms. Cover:
   - What command factories are and why they're useful
   - How to create factory methods on Mechanism classes
   - Naming conventions for factory methods
   - Benefits: encapsulation, reusability, readability
   - How factories interact with requirements management
   - Examples of simple and complex command factories
   - When to use factories vs. standalone command classes

## Requirements Management

.. todo::
   Describe how Mechanisms interact with the requirements system. Cover:
   - How commands declare they require a Mechanism
   - What happens when multiple commands require the same Mechanism
   - How the scheduler resolves requirement conflicts
   - Relationship between requirements and the priority system
   - Best practices for designing Mechanism APIs to work well with requirements
   - Common pitfalls and how to avoid them
