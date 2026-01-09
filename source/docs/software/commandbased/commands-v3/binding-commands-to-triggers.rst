# Binding Commands to Triggers

.. todo::
   This article explains how to connect commands to button inputs and other events using the trigger system. Triggers are how robot code responds to driver input and sensor events. This is essential knowledge for any team using Commands v3.

## Triggers Overview

.. todo::
   Provide an overview of the trigger system in v3. Cover:
   - What triggers are and their role in the command framework
   - How triggers differ from directly calling command.schedule()
   - When trigger bindings are evaluated by the scheduler
   - Available trigger sources (buttons, joysticks, sensors, custom)
   - High-level syntax for creating and binding triggers

## Button Bindings

.. todo::
   Explain how to bind commands to physical buttons. Cover:
   - CommandHID classes vs. regular HID classes (CommandXboxController vs. XboxController, etc.)
   - When to use each type of controller class
   - Accessing button triggers from controllers/joysticks
   - Available binding methods: onTrue(), onFalse(), whileTrue(), whileFalse(), toggleOnTrue(), etc.
   - When each binding type activates and deactivates commands
   - Multiple bindings on the same button
   - Button composition (modifier keys, button combinations)
   - Best practices for organizing button bindings in RobotContainer
   - Examples of common button binding patterns (describe what examples should show)

## Creating Custom Triggers

.. todo::
   Explain how to create custom triggers beyond simple buttons. Cover:
   - Creating triggers from boolean supplier functions
   - Sensor-based triggers (limit switches, photoelectric sensors, etc.)
   - State-based triggers (robot state, game piece detection, etc.)
   - Time-based triggers
   - Network table triggers
   - Performance considerations for trigger condition functions
   - Best practices for custom trigger implementation
   - Examples of custom trigger patterns (describe what examples should show)

## Trigger Composition

.. todo::
   Explain how to compose triggers using logical operations. Cover:
   - Available composition operations: and(), or(), negate()
   - Creating complex trigger conditions from simple ones
   - Debouncing triggers
   - Edge detection (rising/falling edges)
   - Trigger filtering and transformation
   - When composition is evaluated
   - Note: This section may need updates if https://github.com/wpilibsuite/allwpilib/pull/8366 is merged
   - Examples of trigger composition patterns (describe what examples should show)

## Inner Trigger Scopes

.. todo::
   Explain inner trigger scopes for command-local bindings. Cover:
   - What inner trigger scopes are and when to use them
   - How to create an inner scope within a command
   - Lifecycle of inner scope bindings (when they're active)
   - Use cases: responding to events during command execution
   - How inner scopes interact with command interruption
   - Cleanup of inner scope bindings
   - Differences from global trigger bindings
   - Examples of inner scope patterns (describe what examples should show)

## Practical Patterns

.. todo::
   Showcase common practical patterns for trigger usage. Cover:
   - Organizing bindings in RobotContainer
   - Driver control schemes (tank drive, arcade drive, split stick, etc.)
   - Operator control panels and button boxes
   - Mode switching and control profiles
   - Cancellation buttons and emergency stops
   - Trigger-based autonomous selection
   - Testing and debugging trigger bindings
   - Describe several real-world scenarios and recommended trigger patterns
