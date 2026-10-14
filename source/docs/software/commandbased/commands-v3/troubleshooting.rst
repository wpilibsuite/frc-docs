# Troubleshooting Commands

## Common Errors

### Greedy Loops (Compile-time)

If you write a ``while`` loop in a command that is missing a ``coroutine.yield()`` call, the WPILib compiler plugin will issue an error. This is because a loop that never yields will starve the rest of the robot program, preventing other commands from running and sensor data from being updated.

The fix is not to avoid loops; loops are expected in commands v3. The fix is to make sure every loop invokes a yielding method. ``yield()``, ``wait()``, ``waitUntil()``, ``await()``, and ``park()`` all give control back to the scheduler.

**Example of an error:**

The ``while``-loop in this command will be flagged by the compiler check because there a ``Coroutine`` parameter is in scope but no yielding method is called in the loop. This will result in the error message **"Missing call to `coroutine.yield()`"** pointing to the ``while`` statement.

```java
public Command greedyCommand() {
  return run(coroutine -> {
    while (true) {
      doSomething();
    }
  });
}
```

**How to fix it:** Add a call to ``coroutine.yield()`` (or another yielding method like ``wait()`` or ``waitUntil()``) inside the loop.

```java
public Command healthyCommand() {
  return run(coroutine -> {
    while (true) {
      doSomething();
      coroutine.yield(); // Fixed!
    }
  });
}
```

### Resource Conflicts

If two commands require the same mechanism, the command with the higher priority will win. If they have the same priority, the newly scheduled command will interrupt the existing one.

If you see a command being unexpectedly canceled, check if another command that requires the same mechanism is being scheduled at the same time. You can use the scheduler's :doc:`telemetry` to see which commands are running and which mechanisms they require.

This is usually not a scheduler bug. It is the requirements system doing its job. Look for an ``Interrupted`` event in the scheduler event log; the event names both the command that was interrupted and the command that interrupted it. If the interrupter is a default command, check its priority. Default commands should normally be lower priority than ordinary commands so they do not block expected behavior.

If a command directly manipulates another mechanism's private hardware instead of scheduling one of that mechanism's commands, the scheduler cannot see the conflict. Keep actuator fields private and expose command-returning factory methods so conflicts are visible.

### Incomplete Builder Chains

The command builder uses a staged approach to ensure that all required attributes (requirements, logic, and name) are provided. If you forget one of these, you will get a compile-time error because the resulting object will not be a ``Command``.

**Example of an error:**

```java
// Error: This returns a builder stage, not a Command!
Command cmd = arm.run(coroutine -> { ... });
```

**How to fix it:** Ensure you call ``.named("...")`` at the end of your builder chain to produce a ``Command`` object.

```java
// Fixed: .named() completes the builder and returns a Command
Command cmd = arm.run(coroutine -> { ... }).named("My Command");
```

The staged builder is intentionally strict. A command without a name is hard to debug, and a command without declared requirements can bypass the ownership system. Treat the compile error as a sign that the command definition is incomplete, not as a place to add casts or change variable types until it compiles.

### Command Does Not Restart

Scheduling the same ``Command`` instance while it is already scheduled or running has no effect. The scheduler will *not* rewind the coroutine, rerun the command from the beginning, or create a new copy of the same command instance.

```java
Command armUp = arm.up();

coroutine.fork(armUp);
coroutine.fork(armUp); // No effect; armUp is already scheduled or running.
```

**How to fix it:** If you need a fresh run later, call the mechanism factory method again to create a new command instance, or wait until the existing command has completed before awaiting it again. If the behavior should restart automatically while a trigger remains true, use ``retryWhileTrue`` or ``retryWhileFalse`` intentionally.

### Trigger Binding Goes Away

Trigger bindings are scoped to the place where they were created. A binding created inside a command is removed when that command exits. A binding created inside an OpMode is removed when that OpMode exits.

This is usually exactly what you want, but it can be surprising if a binding is created inside a short-lived command:

```java
public Command temporaryBinding() {
  return Command.noRequirements(coroutine -> {
    driverController.a().onTrue(arm.up());
  }).named("Temporary Binding");
}
```

The command above finishes immediately, so the binding is cleaned up immediately.

**How to fix it:** create long-lived controls in global or OpMode setup, or keep the command alive with ``coroutine.park()`` or another yielding wait if the binding is meant to exist only while that command is running.

### Trigger Not Updating In Commands

Triggers are updated once per scheduler cycle and use a cached value for the entire cycle. If a command changes the state of something that is used in a trigger, that trigger's state won't be updated until the next scheduler cycle.

```java
double setpoint = 0;
Trigger atSetpoint = new Trigger(() -> Math.abs(getPosition() - setpoint) <= 0.01);

public Command moveToSetpoint(double setpoint) {
  return run(coroutine -> {
    this.setpoint = setpoint;

    // Instantly exits if the mechanism was already at the previous setpoint
    // because the `atSetpoint` trigger will have been queried and cached before
    // the setpoint was changed by this command.
    coroutine.waitUntil(atSetpoint);
  }).named("Move To Setpoint");
}
```

**How to fix it:** Use a normal ``BooleanSupplier`` instead of a ``Trigger``, or have the trigger use sensor-based feedback instead of referencing mutable state.

### State Machine Missing Initial State

When defining :doc:`state-machines`, you must call `setInitialState() <https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/StateMachine.html#setInitialState(org.wpilib.command3.StateMachine.State)>`__ before the state machine can be used as a command. Forgetting this call will result in a compile-time error.

**Example of an error:**

This state machine is missing an initial state, which will result in a compile-time error **"Partially-initialized object `sm` is missing a call to initializer method `setInitialState()`"**

```java
public Command stateMachineExample() {
    StateMachine sm = new StateMachine("Example");
    var stateA = sm.addState(arm.up());
    return sm;
}
```

**How to fix it:** Call ``setInitialState()`` with the state you want the machine to start in.

```java
public Command stateMachineExample() {
    StateMachine sm = new StateMachine("Example");
    var stateA = sm.addState(arm.up());
    sm.setInitialState(stateA); // Fixed!
    return sm;
}
```

### State Machine Global Transitions

If you use `switchFromAny() <https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/StateMachine.html#switchFromAny(org.wpilib.command3.StateMachine.State...)>`__ without arguments to define a global transition, it only applies to states that were added to the state machine **before** the `switchFromAny()` call.

**Example of an error:**

```java
StateMachine sm = new StateMachine("My SM");
var stateA = sm.addState(arm.up());

// This transition ONLY applies to stateA!
sm.switchFromAny().toExitStateMachine().when(driverController.b());

var stateB = sm.addState(arm.down());
// stateB will NOT transition when the B button is pressed.
```

**How to fix it:** Define your global transitions **after** all states have been added to the state machine.

```java
StateMachine sm = new StateMachine("My SM");
var stateA = sm.addState(arm.up());
var stateB = sm.addState(arm.down());

// Fixed: This transition now applies to both stateA and stateB
sm.switchFromAny().toExitStateMachine().when(driverController.b());
```

### State Machine Transition Never Fires

Transitions created with ``when(condition)`` are checked while the current state's command is running. If the state command is a one-shot command that completes immediately without yielding, there may be no loop cycle where the transition can be checked.

**How to fix it:** For one-shot states, use ``whenComplete()`` or ``whenCompleteAnd(condition)``. Use ``when(condition)`` for states whose commands yield while they are active.

### Coroutine Used Outside a Command

The ``Coroutine`` object passed to command logic is only valid while that command is mounted and running. Storing it in a field and calling it later, or trying to use it from another callback or thread, will result in the compile-time error **"Captured coroutines may not be stored in fields"** (if assigning to a field) or **"Coroutine `parentCoroutine` may not be in scope. Consider using `childCoroutine`"** (if using )

**How to fix it:** Keep coroutine calls inside the command body. If another part of the robot program needs to start behavior, expose a command factory method and schedule the returned command through a trigger or from another command.

### Using the Wrong Coroutines

If nested inline commands are used, each command can only use its own coroutine. Using the wrong coroutine will result in a compiler error.

In this example, an inner command accidentally uses a coroutine from its parent command instead of its own. The compiler will report an error **"Coroutine `coroutine1` may not be in scope. Consider using `coroutine2`"**.

```java
Command.noRequirements(coroutine1 -> {
  Command childCommand = Command.noRequirements(coroutine2 -> {
    coroutine1.await(intake.intake()); // Using the wrong coroutine
    coroutine2.await(intake.stow());
  }).named("Child Command")

  parentCoroutine.await(childCommand);
}).named("Parent Command");
```

**How to fix it:** Use the correct coroutine object as reported by the compiler message, but also consider renaming the coroutine parameters to give them more distinct names that are harder to mix up.

```java
Command.noRequirements(parentCoroutine -> {
  Command childCommand = Command.noRequirements(childCoroutine -> {
    childCoroutine.await(intake.intake()); // Using the correct coroutine parameter
    childCoroutine.await(intake.stow());
  }).named("Child Command")

  parentCoroutine.await(childCommand);
}).named("Parent Command");
```
