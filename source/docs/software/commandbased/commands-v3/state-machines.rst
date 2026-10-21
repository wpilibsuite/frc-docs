# State Machines with Commands

The [StateMachine](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/StateMachine.html) class provides a way to define complex behavior as a series of states and transitions. Each state in a state machine runs a single ``Command``, and transitions define when the state machine should move from one state to another.

State machines are commands themselves, so they have a name and can be scheduled just like any other command. They can even be used as states in other state machines. However, state machines do **not** have any requirements of their own: the active state command owns the mechanisms it requires. This means a state machine can move between states that use different mechanisms without owning all of them for the entire lifetime of the machine, but also means that a state machine cannot be used as a default command.

## Defining a State Machine

To define a state machine, create an instance of ``StateMachine``, add all of its states, choose an initial state, and then add transitions. Defining states first makes global transitions easier to reason about because ``switchFromAny()`` without arguments only applies to states that already exist.

```java
import org.wpilib.command3.StateMachine;

StateMachine sm = new StateMachine("Example State Machine");

// 1. Define all states
var idleState = sm.addState(arm.idle());
var upState = sm.addState(arm.up());
var downState = sm.addState(arm.down());

// 2. Define transitions
idleState.switchTo(upState).when(driverController.y());
idleState.switchTo(downState).when(driverController.a());

upState.switchTo(idleState).whenComplete();
downState.switchTo(idleState).whenComplete();

// 3. Set the initial state
sm.setInitialState(idleState);
```

.. note::
  Calling [setInitialState()](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/StateMachine.html#setInitialState(org.wpilib.command3.StateMachine.State)) is **required** - otherwise the state machine wouldn't know where to start. If you forget to set an initial state, the WPILib compiler plugin will detect it and issue an error.

## State Machine States

Each state is a wrapper around a ``Command``. When the state machine enters a state, it schedules the associated command. When the state machine transitions away from a state, the command is canceled.

If an external command is scheduled that conflicts with any mechanisms owned by the currently running state command, the state machine command will be interrupted. The parent-child relationships section in :doc:`creating-commands` goes into more detail on how interruptions work.

If a state's command finishes and no completion transition is configured, the state machine exits. Use ``whenComplete()`` when a finished state should automatically move to another state. Use ``whenCompleteAnd(condition)`` when a finished state should choose a next state only if some condition is also true.

You can also add enter and exit callbacks to states:

```java
upState.onEnter(() -> System.out.println("Entering UP state"));
upState.onExit(() -> System.out.println("Exiting UP state"));
```

Enter callbacks run immediately after the state's command is scheduled. Exit callbacks run immediately before the state's command is canceled during a transition, or immediately after it completes naturally. If an enter callback schedules commands, those commands are scoped to the lifetime of the state machine, not to the lifetime of just that state.

## Transitions

Transitions define the movement between states. They are checked every loop cycle while the current state's command is running.

- [switchTo(targetState).when(condition)](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/StateMachine.TransitionNeedsConditionStage.html#when(java.util.function.BooleanSupplier)): Transitions to the target state when the condition becomes true.
- [switchTo(targetState).whenComplete()](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/StateMachine.TransitionNeedsConditionStage.html#whenComplete()): Transitions to the target state when the current state's command finishes.
- [exitStateMachine().when(condition)](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/StateMachine.State.html#exitStateMachine()): Finishes the state machine when the condition becomes true.

Conditional transitions are treated as rising-edge conditions to prevent a state from repeatedly transitioning to itself in the same scheduler cycle. If multiple transitions from the same state become true in the same loop, the first transition that was declared wins and the rest are ignored. Transitions created with ``when(condition)`` do not fire for one-shot states that complete without yielding; use ``whenComplete()`` or ``whenCompleteAnd(...)`` for those states.

You can also define transitions for multiple states at once, which can help make your code more readable.

```java
sm.switchFromAny(upState, downState).to(idleState).when(driverController.b());
```

### Global Transitions with ``switchFromAny()``

If you call [switchFromAny()](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/StateMachine.html#switchFromAny(org.wpilib.command3.StateMachine.State...)) without any arguments, it creates a transition that applies to **all** states in the state machine. This is useful for "global" transitions, such as returning to an initial or home state from anywhere in the state graph.

```java
// Any state will transition to idle if the X button is pressed
sm.switchFromAny().to(idleState).when(driverController.x());

// Any state will exit the state machine if a safety sensor is tripped
sm.switchFromAny().toExitStateMachine().when(safetySensor::get);
```

.. warning::
  ``switchFromAny()`` with no arguments only applies to the states that have **already been defined** on the state machine at the time the method is called. Any states added with [addState()](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/StateMachine.html#addState(org.wpilib.command3.Command)) *after* the call to ``switchFromAny()`` will not have this transition applied to them.

For this reason, it is recommended to add all of your states first, and then define transitions after all states have been added.
