# State Machines

.. todo::
   This article covers the declarative ``StateMachine`` API added in allwpilib#8297. State machines
   are intended for highly complex command sequences where coroutine-based imperative commands and
   fluent composition chains cannot easily represent the logic — specifically, cases where execution
   may need to jump back to an arbitrary previous state or skip forward to an arbitrary future state.

## When to Use a State Machine

.. todo::
   Help teams decide when the StateMachine API is the right tool. Cover:
   - The FSM API handles cases that coroutines and composition groups cannot: arbitrary transitions between states (not just sequential or parallel)
   - Scenarios that are a good fit: multi-phase autos with re-entry conditions, complex state-dependent behaviors, commands that may need to recover to a previous state after a disturbance
   - Scenarios where coroutines or compositions are simpler and preferred
   - Rough rule of thumb: if you'd naturally draw a state diagram with non-linear arrows, use StateMachine

## Creating a State Machine

.. todo::
   Walk through the StateMachine builder API from allwpilib#8297. Cover:
   - Creating a ``StateMachine`` with a name
   - Adding states with ``stateMachine.addState(command)`` — each state wraps a command
   - Setting the initial state with ``stateMachine.setInitialState(state)`` (required; omitting it causes a runtime exception; teams using the WPILib compiler plugin get a compile-time error)
   - Building a ``StateMachine`` returns a ``Command`` that can be scheduled normally
   - Example: reference the auto scoring example from allwpilib#8297 (drive to position → aim → repeatedly shoot until hopper empty → celebrate)

## Defining Transitions

.. todo::
   Explain how to define transitions between states using the staged builder DSL. Cover:
   - ``state.switchTo(otherState)`` begins a transition definition
   - Available transition triggers: ``.whenComplete()`` (on completion), ``.whenCompleteAnd(condition)`` (on completion if condition true), ``.when(condition)`` (at any time when condition becomes true, interrupts current state)
   - Transition to self: ``scoring.switchTo(scoring).whenCompleteAnd(() -> hopper.hasBall())`` for loops
   - ``stateMachine.switchFromAny(stateA, stateB, ...).to(targetState).when(condition)`` for global interruption conditions that apply regardless of which state is active
   - The ``@NoDiscard`` annotation on the builder DSL: incomplete transition definitions cause a compiler error via the WPILib javac plugin (allwpilib#8196), catching configuration mistakes early

## State Exit Actions

.. todo::
   Explain how to run cleanup or side-effect logic when leaving a state. Cover:
   - ``state.onExit(Runnable)`` for actions that run when a state is exited
   - Common use cases: forking a persistent background command (e.g., ``Scheduler.getDefault().fork(drivetrain.setX())``)
   - Ordering: onExit actions run before the next state's command starts
   - Interaction with interruption: onExit runs whether the state completes normally or is interrupted by a transition

## StateMachine vs. Coroutines vs. Compositions

.. todo::
   Provide a decision guide for choosing the right abstraction. Cover:
   - **Coroutines**: best for linear sequences with simple branching (if/else, loops); most readable for straightforward flows
   - **Composition groups** (sequence, parallel, race, deadline): best for combining independent commands declaratively
   - **StateMachine**: best when the control flow graph is non-linear — states that can transition to multiple other states, recovery paths, or loops that don't fit sequential coroutine logic
   - Present a side-by-side comparison showing the same behavior implemented as a coroutine vs. a state machine, highlighting where the state machine is clearer
