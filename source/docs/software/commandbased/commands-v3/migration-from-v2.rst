# Migrating from Commands v2 to v3

.. todo::
   This article guides teams through migrating an existing Commands v2 codebase to v3. This article should help teams plan their migration strategy, understand the key differences, and avoid common pitfalls. This is a critical resource for established teams.

## Migration Strategy

.. todo::
   Provide high-level guidance on planning a v2-to-v3 migration. Cover:
   - Should teams migrate? (pros/cons, when to migrate vs. stay on v2)
   - Migration approach: full rewrite recommended
   - What to migrate first (start with simple mechanisms/commands)
   - Testing strategy during migration
   - Timeline considerations (offseason vs. competition season)
   - Team training and learning curve
   - Recommended migration phases

## Package Changes

.. todo::
   Document package and import changes between v2 and v3. Cover:
   - New v3 package names and locations
   - Renamed classes and methods
   - Deprecated v2 APIs and their v3 equivalents
   - How to install the v3 vendordep
   - Version compatibility and requirements
   - Note: Vendor library compatibility with v3 is up to individual vendors

## History: Evolution of Command-Based Programming

.. todo::
   Provide context on how the command-based framework has evolved. Cover:
   - Brief history: v1 (original command-based) → v2 (functional composition) → v3 (coroutines)
   - Why each version was created and what problems it solved
   - How v3 addresses the learning curve issues with v2's declarative composition

## Concept Mapping

.. todo::
   Map v2 concepts to their v3 equivalents. Cover:
   - Subsystem → Mechanism (concepts and naming)
   - Command classes → Coroutine functions
   - CommandBase methods (initialize, execute, end, isFinished) → Coroutine flow
   - Command groups → Composition functions and async/await
   - Sequential/Parallel/Race groups → v3 equivalents
   - Trigger bindings (changes in API)
   - Requirements → v3 requirements system
   - Default commands → v3 default commands
   - Subsystem periodic() → Scheduler.addPeriodic() or manual calls in robotPeriodic()
   - What's new in v3 that has no v2 equivalent (priorities, fork, etc.)
   - Binary interrupt behavior in v2 → Priority levels in v3

## Common Migration Patterns

.. todo::
   Provide concrete patterns for migrating common v2 code. Cover:
   - Converting a simple Subsystem to a Mechanism
   - Converting a simple Command to a coroutine command
   - Converting a command group to a sequence/composition
   - Converting a command group to async/await
   - Converting trigger bindings
   - Converting autonomous command groups
   - Migrating default commands
   - Handling periodic() methods from v2 Subsystems
   - For each pattern, describe the v2 code structure and the equivalent v3 structure

## API Differences Reference

.. todo::
   Provide a quick reference of v2 vs. v3 API differences. Cover:
   - Side-by-side comparison of common operations
   - Method name changes
   - Parameter changes
   - Behavior changes (same API, different semantics)
   - Removed v2 features and why
   - Added v3 features not in v2
   - Present in table or comparison format for quick lookup

## Telemetry and Debugging Changes

.. todo::
   Document changes in telemetry and debugging between v2 and v3. Cover:
   - New telemetry features in v3 (scheduler events, command lifecycle events)
   - Changes in how command state is exposed
   - Migration of existing telemetry code
   - New debugging capabilities unique to v3

## Testing and Simulation Changes

.. todo::
   Document changes in testing approach between v2 and v3. Cover:
   - Differences in unit testing commands
   - Mechanisms can accept a Scheduler parameter in constructor to avoid shared state
   - Simulation approach differences
   - Migration of existing test code

## Migration Checklist

.. todo::
   Provide a checklist for teams migrating to v3. Cover:
   - Pre-migration: backup code, ensure v2 works, review v3 docs
   - Update dependencies and build files
   - Convert Subsystems to Mechanisms
   - Convert Commands to coroutines
   - Update trigger bindings
   - Update autonomous routines
   - Update RobotContainer
   - Update Robot.java
   - Test incrementally
   - Update telemetry/logging
   - Post-migration: cleanup, refactor to use v3 patterns, document changes
   - Present as a sequential checklist teams can follow
