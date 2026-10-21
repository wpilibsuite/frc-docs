# How the Scheduler Works

The ``Scheduler`` is the heart of the commands library. It manages the lifecycle of commands, processes triggers, tracks scopes, and ensures that mechanisms are only used by one command at a time. The scheduler runs periodically, typically every 20 ms from ``robotPeriodic()``, and follows a specific sequence of phases.

The scheduler does not run commands on separate operating-system threads. Each command runs until it finishes or reaches a coroutine yield point. This keeps command behavior deterministic, but it also means command code must yield regularly so other commands, triggers, and periodic robot logic can run.

.. warning:: The commands framework is designed for single-threaded use. Commands should be scheduled and canceled from the same thread that runs the scheduler, and commands should not be run in virtual threads. Normal concurrency tools such as locks and atomics do not make coroutine commands safe to use from multiple threads.

## Scheduler Phases

### Phase 1: Cleanup

In the cleanup phase, the scheduler removes any trigger bindings or custom periodic functions that are no longer active. This happens when the :doc:`scopes` in which they were created (such as a command or an opmode) has finished or exited.

Cleanup is what prevents old bindings from continuing to affect the robot after the context that created them is gone. When a scoped trigger binding is removed, the command attached to that binding is canceled as well.

### Phase 2: Sideloads

Sideloads are custom periodic functions that are registered with the scheduler but are not commands. These functions are run once every scheduler cycle. They are useful for tasks that need to happen regardless of which commands are running, such as updating telemetry or processing sensor data.

Because sideloads are not commands, they do not own mechanisms and should not be used as a back door for actuator control. Hardware-changing behavior belongs in commands so the requirement system can reason about conflicts.

### Phase 3: Scheduling

The scheduling phase is where most of the decision making happens:

1.  **Poll Triggers**: The scheduler polls all active trigger bindings. Depending on the trigger state and the binding type (e.g., ``onTrue``, ``whileTrue``), commands may be added to the pending set or running commands may be canceled.
2.  **Schedule Default Commands**: For every mechanism that does not have a command currently requiring it, the scheduler adds its default command to the pending set.
3.  **Promote Scheduled Commands**: The scheduler looks at all commands in the pending set and decides which ones should start running. If a pending command requires a mechanism currently owned by a running command, the scheduler compares their priorities:

    *   If the pending command has **higher priority**, the running command is interrupted and the pending command starts.
    *   If they have the **same priority**, the pending command interrupts the running one; newly scheduled commands win ties.
    *   If the pending command has **lower priority**, it is discarded and does not start.

Commands in the pending set have been requested, but they have not necessarily started. A command can be scheduled by a trigger and still fail to run if it loses a priority conflict. This distinction is useful when reading telemetry: "scheduled" means "queued for consideration", while "mounted" means "started running".

### Phase 4: Execution

In the final phase, the scheduler iterates through all running commands and gives each one a chance to execute.

1.  **Mounting**: Before a command runs, its coroutine is mounted. This sets up the execution context and unthaws the coroutine's stack and register data.
2.  **Running**: The command's logic executes until it either finishes or calls a yielding method (like ``coroutine.yield()`` or ``await()``).
3.  **Completion**: If the command finishes, it is removed from the running set and its requirements are released.
4.  **Yielding**: If the command yields, it remains in the running set and will resume from the yield point in the next scheduler cycle.

Commands are run in reverse order of their scheduling (from newest to oldest). This allows parent commands to resume in the same loop cycle that an awaited child command completes, minimizing latency in nested command structures.

If a command completes naturally, its requirements are released and a ``Completed`` event is emitted. If it is canceled because a conflicting command took over a mechanism, an ``Interrupted`` event is emitted before the ``Canceled`` event. If command code throws an exception, the scheduler emits ``CompletedWithError`` and the exception still propagates; event listeners can log the failure, but they cannot suppress it, and the robot program will crash.
