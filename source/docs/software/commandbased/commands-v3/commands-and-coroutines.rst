# Commands and Coroutines

.. todo::
   This article covers the core of Commands v3: creating commands using the coroutine API. It explains the fundamental building blocks of command creation, the coroutine control flow primitives, and how command lifecycle works. This should be one of the first articles teams read when learning v3.

## Command Creation Patterns

.. todo::
   Describe the different ways to create commands in v3. Cover:
   - Basic command creation using coroutine functions
   - Inline vs. named command functions
   - Commands as methods on Mechanism classes (factories)
   - Commands as standalone functions in command files
   - Lambda/anonymous command functions
   - When to use each pattern
   - Code examples showing syntax for each approach (structure only, not full implementations)

## The Coroutine API

.. todo::
   Provide an overview of what coroutines are and how v3 uses them. Cover:
   - High-level explanation of coroutines for teams unfamiliar with the concept
   - How coroutines enable sequential command logic without state machines
   - The yield paradigm
   - How the scheduler executes coroutine commands
   - Benefits of the coroutine approach

## yield()

.. todo::
   Explain the yield() primitive in detail. Cover:
   - What yield() does: pause execution and resume next cycle
   - When to use yield() vs. other control flow primitives
   - How yield() relates to the scheduler loop timing
   - Common patterns using yield() (e.g., running for multiple cycles)
   - Note: The compiler plugin checks for `yield` in while-loops (this check does not apply to other loop types)
   - Performance implications
   - Examples of yield() usage patterns (describe what examples should show)

## park()

.. todo::
   Explain the park() primitive in detail. Cover:
   - What park() does: pause indefinitely until command is interrupted
   - When to use park() (e.g., commands that should run until interrupted)
   - How park() differs from yield() in a loop
   - Note: The compiler plugin checks for unreachable code after a `park()` call
   - Interaction with command interruption and priorities
   - Common use cases for park()
   - Examples of park() usage patterns (describe what examples should show)

## wait()/waitUntil()

.. todo::
   Explain the wait() and waitUntil() primitives. Cover:
   - wait(duration): pause for a specific time period
   - waitUntil(condition): pause until a condition becomes true
   - How these differ from yield() loops
   - Timeout behavior and edge cases
   - Best practices for conditions in waitUntil()
   - Performance and timing accuracy considerations
   - Examples of wait/waitUntil patterns (describe what examples should show)

## Command Lifecycle

.. todo::
   Describe the lifecycle of a command from creation to completion. Cover:
   - When a command is created vs. when it starts executing
   - The execution cycle: initialization, periodic execution, ending
   - How coroutines map to the lifecycle phases
   - What happens when a command completes normally
   - What happens when a command is interrupted
   - Cleanup and resource management

## Command Properties

.. todo::
   Explain the various properties that can be set on commands. Cover:
   - Available properties: name, priority, interruptible, runsWhenDisabled, etc.
   - How to set command properties (method chaining, decorators, etc.)
   - When properties are evaluated vs. applied
   - How properties affect scheduler behavior
   - Best practices for setting properties
