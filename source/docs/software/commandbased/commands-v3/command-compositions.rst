# Command Compositions

.. todo::
   This article covers the traditional command composition groups that allow combining multiple commands into more complex behaviors. While v3 emphasizes async/await patterns, composition groups are still important and useful in many scenarios. This article should help teams understand when to use compositions vs. async/await.

## Composition Overview

.. todo::
   Provide an overview of command composition in v3. Cover:
   - What command compositions are and why they exist
   - How compositions differ from async/await patterns
   - When to use compositions vs. async/await
   - Available composition types in v3
   - General syntax and usage patterns

## Sequence Groups

.. todo::
   Explain sequence command groups in detail. Cover:
   - What sequence groups do: run commands one after another
   - How to create a sequence group
   - When commands transition in the sequence
   - What happens if a command in the sequence is interrupted
   - Requirements aggregation across sequence members
   - Common use cases for sequences
   - Comparison to using await() in a coroutine
   - Examples of sequence group patterns (describe what examples should show)

## Parallel Groups

.. todo::
   Explain parallel command groups in detail. Cover:
   - What parallel groups do: run multiple commands simultaneously
   - How to create a parallel group
   - Note: All composition groups (parallel, race, deadline) are implemented as parallel groups with different configurations: Parallel groups have _n_ required commands and _m_ optional commands. The group exits once all _n_ required commands have exited. "Traditional" parallel groups: _m_ = 0 (every command is required). Race groups: _n_ = 0 (every command is optional, exits when any finishes). Deadline groups: both _n_ and _m_ are nonzero (mix of required and optional). Note: v2 deadlines were special case where _n_ = 1 and _m_ ≥ 1; v3 deadlines are generalized.
   - Requirements handling with overlapping requirements
   - What happens if one command is interrupted
   - Common use cases for parallel groups
   - Comparison to using awaitAll() in a coroutine
   - Examples of parallel group patterns (describe what examples should show)

## Race Groups

.. todo::
   Explain race command groups in detail. Cover:
   - What race groups do: run commands in parallel until one finishes
   - How to create a race group
   - When the race group completes (first command finishes)
   - What happens to other commands when one finishes
   - Common use cases for race groups (timeouts, alternatives)
   - Comparison to using awaitAny() in a coroutine
   - Examples of race group patterns (describe what examples should show)

## Deadline Groups

.. todo::
   Explain deadline command groups in detail. Cover:
   - What deadline groups do: run commands with one as a "deadline"
   - How to create a deadline group and specify the deadline command
   - When the deadline group completes
   - Differences between deadline command and other commands
   - Common use cases for deadline groups
   - How to achieve similar behavior with async/await
   - Examples of deadline group patterns (describe what examples should show)

## Repeating and Looping

.. todo::
   Explain repeating and looping command patterns. Cover:
   - Available repeat/loop composition functions
   - Infinite repeats vs. counted repeats
   - When the loop terminates
   - How interruption affects repeated commands
   - Performance implications of repeated compositions
   - Common use cases for repeating commands
   - Comparison to using yield() loops in coroutines
   - Examples of repeat patterns (describe what examples should show)

## Conditional Groups

.. todo::
   Explain conditional command execution patterns. Cover:
   - Available conditional composition functions (if/else-style branching)
   - How conditions are evaluated
   - When condition evaluation happens (command creation vs. execution)
   - Proxy commands and deferred command selection
   - Common use cases for conditional groups
   - Comparison to using if/else in coroutines
   - Examples of conditional patterns (describe what examples should show)
