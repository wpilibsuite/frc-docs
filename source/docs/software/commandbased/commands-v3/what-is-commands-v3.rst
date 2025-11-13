# What is Commands v3?

.. todo:: This article introduces the conceptual foundation of Commands v3, explaining what problem it solves and its core concepts.

## Introduction

.. todo::
   - Recap the command-based pattern (commands + mechanisms for resource management)
   - Explain what's fundamentally different in v3 vs v2
   - Why imperative style was chosen over declarative composition
   - Brief history: evolution from v1 → v2 → v3

## The Problem v3 Solves

.. todo::
   **Learning Curve Issues:**
   - v2 requires understanding functional composition, decorators, and lambda chaining
   - New programmers struggle with splitting logic across initialize/execute/isFinished
   - Common mistake: writing blocking loops in execute() that stall the scheduler

   **Code Readability:**
   - Complex behaviors require deeply nested decorator chains
   - Hard to see the sequential flow of actions
   - Difficult to add conditional logic mid-sequence

   **Example comparison:** Show a complex autonomous routine in v2 (decorator chains) vs v3 (sequential imperative code) to illustrate the readability difference.

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
   - How Java's ``Continuation`` API enables this (internal implementation detail)
   - Cooperative vs preemptive multitasking
   - Commands must voluntarily yield control
   - The scheduler cannot forcibly suspend commands

### Mechanisms as Exclusive Resources

.. todo::
   - Mechanisms represent hardware groupings (like v2 Subsystems)
   - Only one command can require a mechanism at a time
   - Automatic resource conflict detection and resolution
   - Comparison to v2 Subsystems with key differences

### Command Priorities

.. todo::
   - Priority levels replace v2's binary interrupt behavior
   - Higher priority commands can interrupt lower priority ones
   - Enables nuanced control (e.g., LED priority ladder for different robot states)
   - Default priorities and when to override them

## Key Improvements Over v2

### 1. Natural Sequential Syntax

.. todo::
   - Write steps in order like a recipe
   - No need to chain decorators for sequential actions
   - Easy to add delays, loops, and conditions mid-command
   - Example: Drive to position with adjustments

### 2. Mandatory Command Naming

.. todo::
   - All commands must have descriptive names
   - Improves telemetry and debugging
   - Eliminates vague "SequentialCommandGroup" labels
   - Automatic naming for compositions (e.g., "Step 1 -> Step 2 -> Step 3")

### 3. Eliminated Uncommanded Behavior

.. todo::
   - v2 issue: nested commands finishing at different times leaves subsystems uncommanded
   - v2 solution: proxy commands (boilerplate heavy)
   - v3 solution: child commands use mechanisms without parent requiring them
   - Child commands cannot interrupt parents

### 4. Enhanced Telemetry

.. todo::
   - Per-instance command tracking (each execution has unique ID)
   - Clear command hierarchy visualization
   - Performance metrics per command execution
   - Better dashboard integration

### 5. Inner Trigger Scopes

.. todo::
   - Triggers defined inside command bodies are scoped to that command's lifetime
   - No need for global trigger libraries with conditional checks
   - Cleaner code organization
   - Example: Temporary button binding during a specific command

## What v3 Doesn't Do (Non-Goals)

.. todo::
   - **Not preemptive multitasking**: Commands must yield voluntarily
   - **Not multi-threaded**: Single-threaded execution only
   - **No unrestricted coroutine usage**: Coroutines only work within command context
   - **Cannot replace periodic loops**: Still need periodic methods for continuous updates

## Comparison: v2 vs v3

.. todo::
   **When to use v2:**
   - Need C++/Python support
   - Team comfortable with functional programming
   - Existing codebase works well

   **When to use v3:**
   - Java-only team
   - Prefer imperative style
   - Want latest features
   - Starting fresh for 2027

## Next Steps

.. todo::
   - Link to Getting Started guide
   - Link to Migration guide for v2 users
   - Link to Mechanisms article for understanding hardware organization
