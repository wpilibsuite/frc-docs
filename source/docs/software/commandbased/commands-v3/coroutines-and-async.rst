# Coroutines and Async Patterns

Commands v3 uses **coroutines** to enable imperative-style command writing. This article explains how coroutines work, the async/await-style helpers available, and best practices for using them effectively.

## What Are Coroutines?

A coroutine is a function that can pause execution and resume later. In Commands v3, command bodies receive a ``Coroutine`` object that provides pause points via ``yield()`` and async helpers like ``await()``.

.. code-block:: java

   Command example = mechanism.run(coroutine -> {
     // Setup
     mechanism.initialize();

     // Loop with yield
     while (!mechanism.atGoal()) {
       mechanism.update();
       coroutine.yield(); // Pause here, resume next cycle
     }

     // Cleanup
     mechanism.stop();
   }).named("Example");

When the command reaches ``yield()``, it pauses and gives control back to the scheduler. The scheduler runs other commands, then resumes this command on the next cycle.

## The Coroutine API

The ``Coroutine`` object passed to your command body provides these methods:

### Core Methods

#### ``yield()``

Pauses the command until the next scheduler cycle.

.. code-block:: java

   Command drive = drivetrain.run(coroutine -> {
     while (!drivetrain.atTarget()) {
       drivetrain.drive();
       coroutine.yield(); // Critical! Prevents infinite loop
     }
   }).named("Drive");

.. warning::
   **Always call** ``yield()`` **inside loops**. If you don't, your command will run forever in a single cycle and freeze the robot.

#### ``park()``

Pauses forever (until the command is canceled or interrupted). Use this for commands that should run continuously until stopped.

.. code-block:: java

   Command runIntake = intake.run(coroutine -> {
     intake.setSpeed(0.8);
     coroutine.park(); // Stay here until canceled
   }).whenCanceled(() -> intake.setSpeed(0)).named("Run Intake");

### Async/Await Helpers

#### ``await(Command)``

Schedules another command and waits for it to finish before continuing.

.. code-block:: java

   Command sequence = Command.noRequirements().executing(coroutine -> {
     coroutine.await(drivetrain.driveToPose(pose1));
     coroutine.await(arm.moveTo(position));
     coroutine.await(gripper.release());
   }).named("Sequence");

Key benefits of ``await()`` over composition groups:
- Each command's requirements are only locked while that command runs
- More readable sequential flow
- Easy to add conditional logic between steps

#### ``awaitAll(Command...)``

Schedules multiple commands and waits for **all** to finish (equivalent to ``parallel()``).

.. code-block:: java

   Command spinupAndAim = Command.noRequirements().executing(coroutine -> {
     coroutine.awaitAll(
       shooter.spinUp(),
       hood.moveTo(angle),
       turret.aim()
     );
     // All three are done now
   }).named("Spinup And Aim");

#### ``awaitAny(Command...)``

Schedules multiple commands and continues when **any one** finishes. The rest are canceled (equivalent to ``race()``).

.. code-block:: java

   Command driveOrTimeout = Command.noRequirements().executing(coroutine -> {
     coroutine.awaitAny(
       drivetrain.driveToPose(target),
       Command.waitFor(Seconds.of(3.0)).named("Timeout")
     );
     // Either arrived or timed out
   }).named("Drive Or Timeout");

### Wait and Delay Methods

#### ``wait(Measure<Time>)``

Pauses for a specified duration.

.. code-block:: java

   import static edu.wpi.first.units.Units.Seconds;

   Command auto = mechanism.run(coroutine -> {
     mechanism.doAction();
     coroutine.wait(Seconds.of(1.5)); // Wait 1.5 seconds
     mechanism.doNextAction();
   }).named("Auto");

#### ``waitUntil(BooleanSupplier)``

Pauses until a condition becomes true.

.. code-block:: java

   Command waitForSensor = Command.noRequirements().executing(coroutine -> {
     mechanism.startMoving();
     coroutine.waitUntil(() -> sensor.isTriggered());
     mechanism.stop();
   }).named("Wait For Sensor");

### Advanced: Fork

#### ``fork(Command)``

Starts a command in the background without waiting for it to finish. Returns a ``CoroutineFuture`` you can ``await()`` later.

.. code-block:: java

   Command parallel = Command.noRequirements().executing(coroutine -> {
     // Start two actions in background
     var intake = coroutine.fork(intake.grab());
     var drive = coroutine.fork(drivetrain.driveToPose(pose));

     // Do something else
     arm.moveTo(position);
     coroutine.yield();

     // Wait for both background tasks
     coroutine.await(intake);
     coroutine.await(drive);
   }).named("Fork Example");

Use ``fork()`` when you need fine-grained control over when to wait for background tasks.

## Patterns and Examples

### Simple Sequential Actions

.. code-block:: java

   Command auto = Command.noRequirements().executing(coroutine -> {
     coroutine.await(drivetrain.driveToPose(startPose));
     coroutine.await(intake.grab());
     coroutine.await(drivetrain.driveToPose(scorePose));
     coroutine.await(arm.score());
     coroutine.await(intake.release());
   }).named("Simple Auto");

### Conditional Logic

.. code-block:: java

   Command conditional = Command.noRequirements().executing(coroutine -> {
     coroutine.await(drivetrain.driveToPose(checkpoint));

     if (vision.hasTarget()) {
       coroutine.await(drivetrain.alignToTarget());
       coroutine.await(shooter.shoot());
     } else {
       coroutine.await(drivetrain.driveToPose(fallbackPose));
     }
   }).named("Conditional Auto");

### Looping Until Condition

.. code-block:: java

   Command collectUntilFull = intake.run(coroutine -> {
     while (!intake.isFull()) {
       intake.setSpeed(0.8);
       coroutine.yield(); // Critical!
     }
     intake.setSpeed(0);
   }).named("Collect Until Full");

### Parallel Actions with Timeout

.. code-block:: java

   import static edu.wpi.first.units.Units.Seconds;

   Command parallelWithTimeout = Command.noRequirements().executing(coroutine -> {
     coroutine.awaitAny(
       // Main action
       Command.noRequirements().executing(c -> {
         c.awaitAll(
           shooter.spinUp(),
           hood.moveTo(angle),
           turret.aim()
         );
       }).named("Spinup Group"),
       // Timeout
       Command.waitFor(Seconds.of(2.0)).named("Timeout")
     );
   }).named("Parallel With Timeout");

### State Machine Pattern

.. code-block:: java

   enum State { SEARCH, APPROACH, GRAB, RETURN }

   Command stateMachine = Command.noRequirements().executing(coroutine -> {
     State state = State.SEARCH;

     while (state != State.RETURN) {
       switch (state) {
         case SEARCH:
           coroutine.await(vision.searchForTarget());
           if (vision.hasTarget()) {
             state = State.APPROACH;
           }
           break;

         case APPROACH:
           coroutine.await(drivetrain.approachTarget());
           state = State.GRAB;
           break;

         case GRAB:
           coroutine.await(intake.grab());
           if (intake.hasGamePiece()) {
             state = State.RETURN;
           } else {
             state = State.SEARCH; // Try again
           }
           break;

         case RETURN:
           break;
       }
       coroutine.yield();
     }

     coroutine.await(drivetrain.returnToStart());
   }).named("State Machine");

### Retry Logic

.. code-block:: java

   import static edu.wpi.first.units.Units.Seconds;

   Command retryAction = Command.noRequirements().executing(coroutine -> {
     int attempts = 0;
     int maxAttempts = 3;

     while (attempts < maxAttempts) {
       attempts++;

       coroutine.await(mechanism.tryAction());

       if (mechanism.succeeded()) {
         break; // Success!
       }

       if (attempts < maxAttempts) {
         coroutine.wait(Seconds.of(0.5)); // Wait before retry
       }
     }

     if (!mechanism.succeeded()) {
       System.err.println("Action failed after " + maxAttempts + " attempts");
     }
   }).named("Retry Action");

## Critical Rules and Gotchas

### 1. Always Yield in Loops

.. code-block:: java

   // ❌ BAD: Will freeze robot!
   Command bad = mechanism.run(coroutine -> {
     while (true) {
       mechanism.update();
       // No yield - infinite loop!
     }
   });

   // ✅ GOOD: Yields control
   Command good = mechanism.run(coroutine -> {
     while (!mechanism.done()) {
       mechanism.update();
       coroutine.yield();
     }
   });

### 2. Don't Yield Inside Synchronized Blocks

Yielding inside a ``synchronized`` block can cause deadlocks. Restructure to avoid this.

.. code-block:: java

   // ❌ BAD: Don't yield inside synchronized
   synchronized (lock) {
     coroutine.yield(); // Dangerous!
   }

   // ✅ GOOD: Yield outside synchronized
   synchronized (lock) {
     // Quick critical section
     sharedData.update();
   }
   coroutine.yield();

### 3. Single-Threaded Requirement

The scheduler must run on a single thread. Commands v3 coroutines are not thread-safe.

.. code-block:: java

   // ✅ GOOD: Standard robotPeriodic (single-threaded)
   @Override
   public void robotPeriodic() {
     Scheduler.getDefault().run();
   }

   // ❌ BAD: Don't run scheduler from multiple threads
   executor.submit(() -> Scheduler.getDefault().run()); // Don't do this!

### 4. Parent and Child Commands

Commands started with ``await()`` or ``fork()`` within a command body become "child commands" of the parent command that started them. This creates a **command hierarchy** with important lifecycle and interruption rules.

#### Automatic Cancellation

If the parent is canceled, all children are automatically canceled.

.. code-block:: java

   Command parent = Command.noRequirements().executing(coroutine -> {
     var child = coroutine.fork(longRunningCommand);
     coroutine.wait(Seconds.of(1.0));
     // If parent is canceled here, child is also canceled
   }).named("Parent");

This ensures that child commands don't outlive their parents, preventing "orphaned" commands.

#### Sibling Interruption Rules

Child commands started by the same parent are called "siblings." Siblings can interrupt each other based on priority, but they **cannot interrupt their parent**.

.. code-block:: java

   Command parent = Command.noRequirements().executing(coroutine -> {
     // Start two sibling commands
     var child1 = coroutine.fork(
       mechanism.run(coro -> { /* ... */ })
         .withPriority(0)
         .named("Child 1")
     );

     var child2 = coroutine.fork(
       mechanism.run(coro -> { /* ... */ })
         .withPriority(10)  // Higher priority
         .named("Child 2")
     );

     // Child 2 can interrupt Child 1 (same mechanism, higher priority)
     // But neither can interrupt Parent

     coroutine.await(child1);
     coroutine.await(child2);
   }).named("Parent");

#### Conflict Resolution with Ancestors

When a child command requires a mechanism, the scheduler checks for conflicts. **Child commands skip conflict checks with their direct ancestors** (parent, grandparent, etc.), but conflicts with non-ancestors are checked normally using priority levels.

This means:

- A child can use the same mechanisms as its parent without conflict
- A child still respects priorities when conflicting with unrelated commands
- Higher-priority commands are protected from interruption by lower-priority nested commands

.. code-block:: java

   Command outer = drivetrain.run(coroutine -> {
     // This command requires drivetrain

     // Child can also use drivetrain without conflict
     coroutine.await(
       drivetrain.run(coro -> {
         drivetrain.tank(0.5, 0.5);
         coro.yield();
       }).named("Child Movement")
     );

   }).named("Outer Movement");

#### Use Cases for Parent/Child Hierarchies

Parent/child commands are useful for:

1. **Structured concurrency**: Ensure all subtasks finish when a complex command ends
2. **Resource scoping**: Child commands inherit access to parent's mechanisms
3. **Error propagation**: If a child encounters an error, the parent can handle it
4. **Cancellation safety**: Canceling a complex operation automatically cancels all its parts

.. code-block:: java

   Command complexAuto = Command.noRequirements().executing(coroutine -> {
     try {
       // All these children will be canceled if complexAuto is canceled
       coroutine.await(drivetrain.driveToPose(pose1));

       // Run multiple actions in parallel
       var intake = coroutine.fork(intake.grab());
       var arm = coroutine.fork(arm.moveTo(position));
       coroutine.await(intake);
       coroutine.await(arm);

       // Score
       coroutine.await(shooter.shoot());

     } catch (Exception e) {
       // Handle errors from any child command
       System.err.println("Auto failed: " + e);
     }
   }).named("Complex Auto");

### 5. Don't Block the Scheduler

Avoid long-running operations without yielding. Break them into chunks.

.. code-block:: java

   // ❌ BAD: Blocks scheduler for entire calculation
   Command bad = mechanism.run(coroutine -> {
     double result = expensiveCalculation(); // Takes 100ms
     mechanism.useResult(result);
   });

   // ✅ GOOD: Yield between chunks
   Command good = mechanism.run(coroutine -> {
     double result = 0;
     for (int i = 0; i < 10; i++) {
       result += calculationChunk(i); // Each chunk is fast
       coroutine.yield();
     }
     mechanism.useResult(result);
   });

## Performance Considerations

- **Yield overhead is minimal**: Yielding is fast (~microseconds). Don't worry about yielding too often.
- **Prefer yield over complex scheduling**: If you're tempted to schedule commands from within commands, use ``await()`` instead.
- **Use composition for simple cases**: For simple sequences/parallels, declarative composition (``.sequence()``, ``.alongWith()``) may be clearer.

## Comparing to Other Async Models

If you're familiar with async/await in other languages:

.. list-table::
   :header-rows: 1
   :widths: 30 35 35

   * - Concept
     - Other Languages
     - Commands v3
   * - Async function
     - ``async def`` (Python), ``async`` (C#)
     - Command body receives ``Coroutine``
   * - Pause
     - ``await task``
     - ``coroutine.yield()``
   * - Wait for task
     - ``await task``
     - ``coroutine.await(command)``
   * - Wait for all
     - ``await asyncio.gather(...)``
     - ``coroutine.awaitAll(...)``
   * - Wait for any
     - ``await asyncio.wait(..., return_when=FIRST)``
     - ``coroutine.awaitAny(...)``
   * - Fork task
     - ``asyncio.create_task(...)``
     - ``coroutine.fork(command)``

Key difference: Commands v3 doesn't have an explicit ``async`` keyword. All command bodies are implicitly async when you use the ``Coroutine`` parameter.

## Next Steps

- :ref:`docs/software/commandbased/commands-v3/command-compositions-v3:Command Compositions` - Declarative composition patterns
- :ref:`docs/software/commandbased/commands-v3/priorities-and-interrupts:Priorities and Interrupts` - Managing command conflicts
- :ref:`docs/software/commandbased/commands-v3/migration-from-v2:Migrating from Commands v2 to v3` - Converting v2 patterns to v3
