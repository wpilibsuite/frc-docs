# Async/Await Patterns

.. todo::
   This article explains the async/await helper functions that enable advanced command orchestration in v3. These functions allow commands to launch other commands and wait for them to complete, enabling powerful composition patterns. Teams should understand basic command creation before reading this article.

## Introduction to Async/Await

.. todo::
   Provide an overview of async/await in Commands v3. Cover:
   - What async/await means in the context of v3 (not OS-level async)
   - Why async/await is useful for command orchestration
   - How async/await differs from composition groups
   - When to use async/await vs. other patterns
   - High-level mental model for how it works with the scheduler
   - Relationship to coroutines and yield()

## fork()

.. todo::
   Explain the fork() function in detail. Cover:
   - What fork(command) does: launch a command without waiting for it
   - "Fire and forget" semantics
   - Lifecycle of forked commands relative to parent
   - Requirements and priority considerations
   - Common use cases (background operations, side effects, etc.)
   - Potential pitfalls and how to avoid them
   - Examples of fork() patterns (describe what examples should show)

## await()

.. todo::
   Explain the await() function in detail. Cover:
   - What await(command) does: schedule a command and wait for it to complete
   - Easier to explain as a blocking version of fork()
   - How await() blocks the calling command until the child completes
   - Requirements and priority handling with awaited commands
   - What happens if the awaited command is interrupted
   - What happens if the parent command is interrupted
   - Return values and status from awaited commands
   - When to use fork() vs. await()
   - Examples of await() patterns (describe what examples should show)

## awaitAll()

.. todo::
   Explain the awaitAll() function in detail. Cover:
   - What awaitAll(commands) does: wait for multiple commands in parallel
   - How awaitAll() differs from await() in a loop
   - When all commands must complete vs. early termination scenarios
   - Requirements management across multiple parallel commands
   - Error and interruption handling
   - Performance implications of parallel execution
   - Examples of awaitAll() patterns (describe what examples should show)

## awaitAny()

.. todo::
   Explain the awaitAny() function in detail. Cover:
   - What awaitAny(commands) does: wait until any command completes
   - Race condition semantics: which command "wins"
   - **Important**: awaitAny() cancels all other still-running commands when one completes
   - Both await functions are blocking
   - Use cases for awaitAny() (timeouts, alternative paths, etc.)
   - How interruption is handled
   - Differences from race groups in composition
   - Examples of awaitAny() patterns (describe what examples should show)

## Practical Patterns

.. todo::
   Showcase common practical patterns combining async/await functions. Cover:
   - Timeout patterns: use awaitAny() with a timeout command alongside the main command - first to complete wins
   - Sequential operations with conditional logic
   - Parallel operations with synchronization points
   - Launching background tasks with fork()
   - Complex state machines using async/await
   - Error recovery and fallback patterns
   - Describe several real-world scenarios and which async/await functions to combine
