# Command Compositions

Commands v3 supports both **declarative composition** (like Commands v2) and **imperative sequencing** (using coroutines). This article covers both approaches and when to use each.

## Declarative Composition

Commands v3 retains v2's declarative composition methods. These create command groups that bundle multiple commands together.

### Sequence

Run commands one after another. The sequence finishes when the last command finishes.

.. code-block:: java

   Command auto = Command.sequence(
     drivetrain.driveToPose(pose1),
     arm.moveTo(position),
     gripper.release()
   ).withAutomaticName();

Equivalent imperative style:

.. code-block:: java

   Command auto = Command.noRequirements().executing(coroutine -> {
     coroutine.await(drivetrain.driveToPose(pose1));
     coroutine.await(arm.moveTo(position));
     coroutine.await(gripper.release());
   }).named("Auto Sequence");

### Parallel

Run commands simultaneously. Finishes when **all** commands finish.

.. code-block:: java

   Command spinup = shooter.spinUp()
     .alongWith(hood.moveTo(angle), turret.aim())
     .withAutomaticName();

Equivalent imperative style:

.. code-block:: java

   Command spinup = Command.noRequirements().executing(coroutine -> {
     coroutine.awaitAll(
       shooter.spinUp(),
       hood.moveTo(angle),
       turret.aim()
     );
   }).named("Spinup");

### Race

Run commands simultaneously. Finishes when **any** command finishes (others are canceled).

.. code-block:: java

   Command driveOrTimeout = drivetrain.driveToPose(pose)
     .raceWith(Command.waitFor(Seconds.of(3.0)).named("Timeout"))
     .withAutomaticName();

Equivalent imperative style:

.. code-block:: java

   Command driveOrTimeout = Command.noRequirements().executing(coroutine -> {
     coroutine.awaitAny(
       drivetrain.driveToPose(pose),
       Command.waitFor(Seconds.of(3.0)).named("Timeout")
     );
   }).named("Drive Or Timeout");

### Deadline

Run commands simultaneously. Finishes when the **deadline command** finishes (others are canceled).

.. code-block:: java

   Command driveWithIntake = drivetrain.driveToPose(pose)
     .deadlineWith(intake.run())
     .withAutomaticName();

## Imperative Sequencing with Coroutines

The imperative style is often clearer for complex logic. Use ``await()`` and related methods from the ``Coroutine`` object.

### Sequential with ``await()``

.. code-block:: java

   Command auto = Command.noRequirements().executing(coroutine -> {
     coroutine.await(drivetrain.driveToPose(startPose));
     coroutine.await(intake.grab());
     coroutine.await(drivetrain.driveToPose(scorePose));
     coroutine.await(arm.score());
     coroutine.await(intake.release());
   }).named("Complex Auto");

### Parallel with ``awaitAll()``

.. code-block:: java

   Command parallel = Command.noRequirements().executing(coroutine -> {
     coroutine.awaitAll(
       shooter.spinUp(),
       hood.moveTo(angle),
       turret.aim(),
       vision.trackTarget()
     );
     // All four are done
     coroutine.await(shooter.fire());
   }).named("Shoot Sequence");

### Race with ``awaitAny()``

.. code-block:: java

   Command race = Command.noRequirements().executing(coroutine -> {
     coroutine.awaitAny(
       drivetrain.driveToPose(target),
       vision.alignToTarget(),
       Command.waitFor(Seconds.of(5.0)).named("Timeout")
     );
     // One finished, others canceled
   }).named("Drive Or Align");

## When to Use Declarative vs Imperative

**Use declarative composition when:**
- The structure is simple (a few steps in sequence or parallel)
- You want to lock all mechanisms for the entire group duration
- You prefer the "what" over "how"

**Use imperative coroutines when:**
- You have complex conditional logic (if/else, switch, loops)
- You need to release mechanisms between steps
- You want straightforward sequential code that's easy to read

## Key Difference: Resource Locking

**Declarative groups** lock all required mechanisms for the entire group duration:

.. code-block:: java

   Command group = Command.sequence(
     drivetrain.driveToPose(pose1),
     arm.moveTo(position)
   ).withAutomaticName();
   // Locks BOTH drivetrain AND arm for entire sequence

**Imperative await()** only locks each mechanism while that command runs:

.. code-block:: java

   Command imperative = Command.noRequirements().executing(coroutine -> {
     coroutine.await(drivetrain.driveToPose(pose1));
     // Drivetrain released here!
     coroutine.await(arm.moveTo(position));
     // Only arm is locked now
   }).named("Sequential");

This difference matters when other commands might want to use the drivetrain between steps.

## Combining Both Styles

You can mix declarative and imperative:

.. code-block:: java

   Command hybrid = Command.noRequirements().executing(coroutine -> {
     // Declarative parallel group
     Command spinup = shooter.spinUp()
       .alongWith(hood.moveTo(angle))
       .withAutomaticName();

     coroutine.await(spinup);

     // Imperative conditional
     if (vision.hasTarget()) {
       coroutine.await(turret.aim());
       coroutine.await(shooter.fire());
     }
   }).named("Hybrid Auto");

## Additional Decorators

Commands v3 retains many v2 decorators:

### ``until(BooleanSupplier)``

End the command when a condition becomes true.

.. code-block:: java

   Command drive = drivetrain.runRepeatedly(() -> drivetrain.tank(0.5, 0.5))
     .until(() -> drivetrain.getDistance() > 10.0)
     .named("Drive Until 10m");

### ``withTimeout(Measure<Time>)``

End the command after a duration.

.. code-block:: java

   import static edu.wpi.first.units.Units.Seconds;

   Command drive = drivetrain.driveToPose(pose)
     .withTimeout(Seconds.of(3.0))
     .named("Drive With Timeout");

### ``whenStarting(Runnable)``

Run code when the command starts.

.. code-block:: java

   Command cmd = mechanism.run(coro -> { /* ... */ })
     .whenStarting(() -> System.out.println("Starting!"))
     .named("Command");

### ``whenFinished(Runnable)``

Run code when the command finishes normally.

.. code-block:: java

   Command cmd = mechanism.run(coro -> { /* ... */ })
     .whenFinished(() -> System.out.println("Finished!"))
     .named("Command");

### ``whenCanceled(Runnable)``

Run code when the command is interrupted or canceled.

.. code-block:: java

   Command intake = intake.run(coro -> {
     intake.setSpeed(0.8);
     coro.park();
   })
   .whenCanceled(() -> intake.setSpeed(0))
   .named("Run Intake");

### ``whenInterrupted(Runnable)``

Run code specifically when interrupted (not normal end).

.. code-block:: java

   Command cmd = mechanism.run(coro -> { /* ... */ })
     .whenInterrupted(() -> System.out.println("Interrupted!"))
     .named("Command");

## Naming Commands

All commands need names. Use ``.named("...")`` or ``.withAutomaticName()``:

.. code-block:: java

   // Manual naming
   Command cmd = mechanism.run(coro -> { /* ... */ }).named("My Command");

   // Automatic naming for groups
   Command group = Command.sequence(cmd1, cmd2, cmd3).withAutomaticName();
   // Name becomes "sequence(cmd1, cmd2, cmd3)"

## Examples

### Complex Auto Routine

.. code-block:: java

   Command auto = Command.noRequirements().executing(coroutine -> {
     // Start position
     coroutine.await(drivetrain.driveToPose(startPose));

     // First game piece
     coroutine.awaitAll(
       drivetrain.approachGamePiece(),
       intake.prepare()
     );
     coroutine.await(intake.grab());

     // Score
     coroutine.await(drivetrain.driveToPose(scorePose));
     coroutine.awaitAll(
       arm.moveTo(scorePosition),
       turret.aim()
     );
     coroutine.await(intake.release());

     // Second game piece (if time allows)
     coroutine.awaitAny(
       Command.sequence(
         drivetrain.driveToPose(gamePiece2),
         intake.grab(),
         drivetrain.driveToPose(scorePose),
         arm.moveTo(scorePosition),
         intake.release()
       ).withAutomaticName(),
       Command.waitFor(Seconds.of(12.0)).named("Auto Time Limit")
     );
   }).named("Two Piece Auto");

### State-Based Composition

.. code-block:: java

   Command adaptive = Command.noRequirements().executing(coroutine -> {
     if (gameData.getAlliance() == Alliance.Red) {
       coroutine.await(redSideAuto());
     } else {
       coroutine.await(blueSideAuto());
     }

     // Common scoring sequence
     coroutine.awaitAll(
       shooter.spinUp(),
       turret.aim()
     );

     for (int i = 0; i < 3; i++) {
       coroutine.await(shooter.fire());
       coroutine.wait(Seconds.of(0.5));
     }
   }).named("Adaptive Auto");

## See Also

- :ref:`docs/software/commandbased/commands-v3/coroutines-and-async:Coroutines and Async Patterns` - Deep dive on coroutines
- :ref:`docs/software/commandbased/commands-v3/priorities-and-interrupts:Priorities and Interrupts` - Managing conflicts
- :ref:`docs/software/commandbased/commands-v2/command-compositions:Command Compositions` - v2 composition reference
