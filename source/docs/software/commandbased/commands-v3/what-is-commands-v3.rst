# What is Commands v3?

.. todo:: This article introduces the conceptual foundation of Commands v3, explaining what problem it solves and its core concepts.

## Introduction

.. todo::
   - Recap the command-based pattern (commands + mechanisms for resource management)
   - Explain the imperative programming style
   - How v3 enables writing robot code that looks like simple sequential programs

## Learning Curve and On-Ramp

.. todo::
   **Imperative On-Ramp:**
   - Commands v3 allows teams to transition from basic imperative code to the command framework
   - Simple sequential code can be lifted into commands with minimal changes
   - Example: A basic drive-in-a-square routine can be wrapped in command functions
   - Changing `Thread.sleep()` to `coroutine.wait()` and direct calls to `coroutine.await()`
   - This provides a gentle learning curve for teams new to command-based programming

   **Code Readability:**
   - Write robot actions as sequential steps
   - Use familiar control flow: loops, if-statements, and function calls
   - Easy to add delays, loops, and conditions within command logic

## Core Concepts

### Commands as Imperative Functions

.. todo::
   - Commands in v3 are written as normal sequential functions
   - Use loops, if-statements, and control flow naturally
   - The ``Coroutine`` object provides pause points via ``yield()``
   - Example: Simple command that reads like pseudocode

### Coroutines and Cooperative Multitasking

.. todo::
   - What are coroutines (functions that can pause and resume)
   - Cooperative vs preemptive multitasking
   - Commands must voluntarily yield control
   - The scheduler cannot forcibly suspend commands

### Mechanisms as Exclusive Resources

.. todo::
   - Mechanisms represent hardware groupings
   - Only one command can require a mechanism at a time
   - Automatic resource conflict detection and resolution

### Command Priorities

.. todo::
   - Priority levels for controlling command interruption
   - Higher priority commands can interrupt lower priority ones
   - Enables nuanced control (e.g., LED priority ladder for different robot states)
   - Default priorities and when to override them

## Additional Features

### Mandatory Command Naming

.. todo::
   - All commands must have descriptive names
   - Improves telemetry and debugging
   - Automatic naming for compositions (e.g., "Step 1 -> Step 2 -> Step 3")

### Enhanced Telemetry

.. todo::
   - Per-instance command tracking (each execution has unique ID)
   - Clear command hierarchy visualization
   - Better dashboard integration

### Inner Trigger Scopes

.. todo::
   - Triggers defined inside command bodies are scoped to that command's lifetime
   - Cleaner code organization
   - Example: Temporary button binding during a specific command

## What v3 Doesn't Do (Non-Goals)

.. todo::
   - **Not preemptive multitasking**: Commands must yield voluntarily
   - **Not multi-threaded**: Single-threaded execution only
   - **No unrestricted coroutine usage**: Coroutines only work within command context
   - **Cannot replace periodic loops**: Still need periodic methods for continuous updates

## Next Steps

.. todo::
   - Link to Getting Started guide
   - Link to Migration guide for v2 users
   - Link to Mechanisms article for understanding hardware organization
