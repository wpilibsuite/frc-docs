# Priorities and Interrupts

Commands v3 introduces a **priority system** for managing command conflicts. Unlike Commands v2's simple "interruptible or not" model, v3 commands have integer priority levels that determine which command runs when multiple commands require the same mechanism.

## How Priorities Work

Every command has a priority level (an integer). When a new command is scheduled that requires a mechanism already in use:

1. **Compare priorities**: New command priority vs. running command priority
2. **Higher or equal wins**: If new ≥ running, the running command is interrupted
3. **Lower loses**: If new < running, the new command is rejected

.. code-block:: java

   // Default priority is 0
   Command normalAction = mechanism.run(coro -> { /* ... */ })
     .named("Normal");

   // Low priority (for defaults)
   Command idle = mechanism.runRepeatedly(() -> mechanism.stop())
     .withPriority(Command.LOWEST_PRIORITY) // Integer.MIN_VALUE
     .named("Idle");

   // High priority (for important actions)
   Command emergency = mechanism.run(coro -> mechanism.emergencyStop())
     .withPriority(1000)
     .named("Emergency Stop");

## Setting Priorities

Use ``.withPriority(int)`` when building a command:

.. code-block:: java

   Command cmd = mechanism.run(coroutine -> {
     // Command body
   }).withPriority(10).named("My Command");

### Priority Constants

The ``Command`` class provides useful constants:

.. code-block:: java

   Command.LOWEST_PRIORITY   // Integer.MIN_VALUE
   Command.DEFAULT_PRIORITY  // 0

.. list-table::
   :header-rows: 1
   :widths: 30 20 50

   * - Priority Range
     - Typical Use
     - Examples
   * - ``LOWEST_PRIORITY``
     - Default commands
     - Idle states, stopping motors
   * - ``-100`` to ``-1``
     - Low priority
     - Background tasks
   * - ``0`` (default)
     - Normal commands
     - Teleop control, autonomous routines
   * - ``1`` to ``100``
     - Important commands
     - Automated actions, safety checks
   * - ``100+``
     - Critical commands
     - Emergency stops, override controls

## Common Patterns

### Pattern 1: Low-Priority Defaults

Default commands should have ``LOWEST_PRIORITY`` so they're always interrupted by any other command.

.. code-block:: java

   public Drivetrain() {
     setDefaultCommand(
       runRepeatedly(() -> tank(0, 0))
         .withPriority(Command.LOWEST_PRIORITY)
         .named("Drive[IDLE]")
     );
   }

### Pattern 2: Normal Teleop Commands

Regular teleop commands use the default priority (0).

.. code-block:: java

   Command teleopDrive = drivetrain.runRepeatedly(() ->
     drivetrain.arcadeDrive(
       controller.getLeftY(),
       controller.getRightX()
     )
   ).named("Teleop Drive"); // Priority = 0 (default)

### Pattern 3: Automated Actions

Automated actions (like path following) can have slightly higher priority to prevent accidental driver interference.

.. code-block:: java

   Command autoAlign = drivetrain.run(coroutine -> {
     // Auto-alignment logic
   }).withPriority(10).named("Auto Align");

   // Normal drive (priority 0) won't interrupt this
   // But you can still override with a high-priority command if needed

### Pattern 4: Emergency Override

Critical safety commands should have very high priority.

.. code-block:: java

   Command emergencyStop = drivetrain.run(coroutine -> {
     drivetrain.stop();
   }).withPriority(1000).named("EMERGENCY STOP");

   // Interrupts ANY other command on drivetrain

## Interrupt Behavior

When a command is interrupted:

1. Its coroutine is stopped immediately (at the next ``yield()`` point)
2. Any ``whenInterrupted()`` or ``whenCanceled()`` decorators run
3. The new command starts

.. code-block:: java

   Command action = mechanism.run(coroutine -> {
     mechanism.start();
     coroutine.park();
   })
   .whenInterrupted(() -> System.out.println("Interrupted!"))
   .whenCanceled(() -> mechanism.stop())
   .named("Action");

Note: ``whenCanceled()`` runs for both interruptions and normal cancellations.

## Examples

### Example 1: Driver Override

Let the driver override automated actions by holding a button.

.. code-block:: java

   // RobotContainer.java
   public RobotContainer(Drivetrain drivetrain, CommandXboxController driver) {

     // Normal automated driving (priority 10)
     Command autoPath = drivetrain.followPath(path)
       .withPriority(10)
       .named("Auto Path");

     // Driver override (priority 20)
     Command manualOverride = drivetrain.runRepeatedly(() ->
       drivetrain.arcadeDrive(
         driver.getLeftY(),
         driver.getRightX()
       )
     ).withPriority(20).named("Manual Override");

     // Hold button to override
     driver.rightBumper().whileTrue(manualOverride);

     // Schedule auto path
     autoPath.schedule();
   }

When the driver presses the button, the higher-priority manual command interrupts the auto path.

### Example 2: Safety Interlocks

Prevent dangerous actions unless a safety condition is met.

.. code-block:: java

   Command shoot = shooter.run(coroutine -> {
     shooter.fire();
     coroutine.wait(Seconds.of(0.5));
   }).withPriority(0).named("Shoot");

   // Safety interlock: very high priority
   Command safetyStop = shooter.run(coroutine -> {
     while (!safetySwitch.get()) {
       shooter.stop();
       coroutine.yield();
     }
   }).withPriority(1000).named("Safety Interlock");

   // Schedule safety interlock at startup
   safetyStop.schedule();

   // Normal shoot command can't run while safety is active

### Example 3: Graduated Priorities

Different autonomous routines with different importance levels.

.. code-block:: java

   // Low priority: opportunistic scoring
   Command opportunisticScore = Command.noRequirements().executing(coroutine -> {
     if (vision.hasTarget()) {
       coroutine.await(drivetrain.alignToTarget());
       coroutine.await(shooter.shoot());
     }
   }).withPriority(5).named("Opportunistic");

   // Normal priority: planned scoring
   Command plannedScore = Command.noRequirements().executing(coroutine -> {
     coroutine.await(drivetrain.driveToPose(scorePose));
     coroutine.await(shooter.shoot());
   }).withPriority(10).named("Planned Score");

   // High priority: defensive positioning
   Command defensive = drivetrain.driveToPose(defensePose)
     .withPriority(20)
     .named("Defensive");

### Example 4: Mechanism State Protection

Prevent commands that could damage the mechanism.

.. code-block:: java

   public class Arm extends Mechanism {

     // Protected low position (high priority)
     private Command protectLowPosition() {
       return run(coroutine -> {
         while (getAngle() < MIN_SAFE_ANGLE) {
           setVoltage(2.0); // Force upward
           coroutine.yield();
         }
       }).withPriority(500).named("Arm Protection");
     }

     public void periodic() {
       // Automatically start protection if arm goes too low
       if (getAngle() < MIN_SAFE_ANGLE) {
         protectLowPosition().schedule();
       }
     }

     // Normal movement command (priority 0)
     public Command moveTo(double angle) {
       if (angle < MIN_SAFE_ANGLE) {
         System.err.println("Cannot move to unsafe angle!");
         return Command.none();
       }

       return run(coroutine -> {
         // Move logic
       }).named("Arm Move");
     }
   }

## Designing Priority Hierarchies

When designing your priority levels:

1. **Start with defaults**: All defaults should be ``LOWEST_PRIORITY``

2. **Use 0 for normal**: Most commands should use default priority (0)

3. **Reserve high values for special cases**: Safety, emergency stops, critical overrides

4. **Document your scheme**: Add comments explaining your priority levels

.. code-block:: java

   // Priority Scheme:
   // LOWEST: Default/idle commands
   // 0:      Normal teleop and auto
   // 10-20:  Automated actions (align, path following)
   // 50-100: Important overrides (driver takeover, safety checks)
   // 500+:   Emergency and protection (e-stop, limit protection)

   public class RobotContainer {
     private static final int PRIORITY_DEFAULT = 0;
     private static final int PRIORITY_AUTO_ACTION = 10;
     private static final int PRIORITY_DRIVER_OVERRIDE = 50;
     private static final int PRIORITY_EMERGENCY = 500;

     // ...
   }

## Comparing to v2

In Commands v2, commands have an ``interruptible`` flag:

- Interruptible commands can be interrupted by any new command
- Non-interruptible commands reject any new command

In Commands v3, the priority system is more flexible:

.. list-table::
   :header-rows: 1
   :widths: 30 35 35

   * - Scenario
     - Commands v2
     - Commands v3
   * - Always interruptible
     - ``.withInterruptBehavior(kCancelSelf)``
     - Low priority (e.g., default ``LOWEST_PRIORITY``)
   * - Never interruptible
     - ``.withInterruptBehavior(kCancelIncoming)``
     - Very high priority (e.g., 10000)
   * - Selective interruption
     - Not possible
     - Use priority levels (e.g., priority 10 vs 20 vs 50)

## Debugging Priority Conflicts

If commands aren't running as expected:

1. **Check priorities**: Print or log the priority of conflicting commands

.. code-block:: java

   System.out.println("Command: " + cmd.getName() + ", Priority: " + cmd.getPriority());

2. **Use mechanism queries**: Check what's currently running

.. code-block:: java

   Set<Command> running = mechanism.getRunningCommands();
   for (Command cmd : running) {
     System.out.println("Running: " + cmd.getName() + " (priority " + cmd.getPriority() + ")");
   }

3. **Test incrementally**: Start with simple priorities, add complexity gradually

4. **Name commands clearly**: Use descriptive names to identify commands in logs

## Best Practices

1. **Most commands should use default priority**: Only change priority when you have a specific reason

2. **Avoid "priority wars"**: Don't keep increasing priorities to beat other commands. Design a clear hierarchy.

3. **Document your priority scheme**: Write down your priority ranges and what they mean

4. **Use constants**: Define priority constants instead of magic numbers

.. code-block:: java

   // ✅ GOOD: Named constants
   private static final int PRIORITY_TELEOP = 0;
   private static final int PRIORITY_AUTO = 10;

   Command cmd = mechanism.run(coro -> { /* ... */ })
     .withPriority(PRIORITY_AUTO)
     .named("Auto Command");

   // ❌ BAD: Magic numbers
   Command cmd = mechanism.run(coro -> { /* ... */ })
     .withPriority(37) // What does 37 mean?
     .named("Auto Command");

5. **Test priority interactions**: Verify that commands interrupt each other as expected

## Next Steps

- :ref:`docs/software/commandbased/commands-v3/binding-commands-to-triggers-v3:Binding Commands to Triggers` - Scheduling commands from buttons
- :ref:`docs/software/commandbased/commands-v3/mechanisms:Mechanisms` - Understanding mechanism resource management
- :ref:`docs/software/commandbased/commands-v3/coroutines-and-async:Coroutines and Async Patterns` - Using coroutines effectively
