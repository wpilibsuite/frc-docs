# Priorities and Interrupts

.. todo::
   This article explains v3's priority system, one of the major new features compared to v2. The priority system provides fine-grained control over when commands can interrupt each other, enabling more sophisticated robot behaviors. Understanding priorities is crucial for teams using v3 effectively.

## Priority Levels Explained

.. todo::
   Introduce the concept of command priorities in v3. Cover:
   - What priorities are and why they were added in v3
   - Available priority levels (numeric values, named constants)
   - Default priority level for commands
   - How priorities solve common v2 pain points
   - High-level mental model: priorities as "importance" levels
   - Relationship to requirements and the scheduler

## How Priorities Work

.. todo::
   Explain the mechanics of the priority system. Cover:
   - How the scheduler uses priorities to resolve conflicts
   - What happens when commands with different priorities require the same Mechanism
   - Rules for when a higher-priority command can interrupt a lower-priority one
   - What happens when priorities are equal
   - The interruptible flag and its interaction with priorities
   - How priorities propagate through command compositions and async/await
   - Timing: when priority checks occur

## Setting Command Priorities

.. todo::
   Explain how to set priorities on commands. Cover:
   - Syntax for setting command priority (method chaining, decorators, etc.)
   - Where to set priorities: factory methods, binding sites, composition creation
   - How to choose appropriate priority levels for different commands
   - Making commands non-interruptible regardless of priority
   - Dynamic priority adjustment (if supported)
   - Best practices for consistent priority assignment across a codebase

## Common Priority Patterns

.. todo::
   Showcase common patterns for using priorities effectively. Cover:
   - Default/teleoperated commands at low priority
   - Autonomous routines at medium priority
   - Safety/override commands at high priority
   - Emergency stops at maximum priority
   - Layered control systems with multiple priority tiers
   - Mode-based priority schemes
   - Describe several real-world scenarios and recommended priority levels

## Interruption Behavior

.. todo::
   Explain what happens when commands are interrupted. Cover:
   - Command lifecycle during interruption
   - Cleanup and resource release
   - How coroutine commands handle interruption (exceptions, early exit)
   - Interruption of composed commands (what happens to child commands)
   - Interruption of awaited commands (how it propagates to parent)
   - Forked commands and interruption
   - Best practices for writing interruption-safe commands

## Debugging Priority Issues

.. todo::
   Provide guidance on troubleshooting priority-related problems. Cover:
   - Common symptoms of priority misconfiguration
   - How to diagnose why a command didn't interrupt another
   - Tools and techniques for visualizing priority conflicts
   - Dashboard/telemetry for monitoring command priorities
   - Logging priority-related events
   - Common mistakes and how to fix them
   - Testing priority behavior
