# Command Triggers

Triggers are the primary way to start commands in response to external events, such as a button press, a sensor value reaching a threshold, or a specific robot state. Triggers are checked (or "polled") at the start of every ``Scheduler.run()`` method call ( :doc:`how-it-works` goes over the specific phases in more detail).

Triggers cache their signal when they are polled. Calling ``getAsBoolean()`` reads the most recently polled value, not necessarily the live value of the underlying button or sensor at that exact instant. This is what lets triggers reliably detect rising and falling edges within a scheduler cycle and have consistency in telemetry.

## Creating Triggers

A ``Trigger`` is created by providing a ``BooleanSupplier`` (a :doc:`lambda function <lambda-functions>` that returns ``true`` or ``false``) or by combining existing triggers.

```java
// A trigger for a gamepad button
Trigger button = xboxController.a();

// A trigger for a limit switch
Trigger atTop = new Trigger(topLimitSwitch::get);

// A trigger for a complex condition by combining two triggers
Trigger isReady = new Trigger(turret::isAtTarget).and(shooter::isAtSpeed);
```

## Trigger Bindings

Once you have a trigger, you can bind commands to it. There are several types of bindings that determine how the command responds to changes in the trigger's state.

### State-Based Bindings

Triggers implement the Java ``BooleanSupplier`` interface, making them compatible with any method that accepts a boolean condition, such as ``Coroutine.waitUntil``. The binding methods below schedule or cancel commands based on the trigger's cached signal and its previous cached signal.

*   ``onTrue(Command)``: Schedules the command when the trigger transitions from ``false`` to ``true`` (a *rising edge*). The command runs until it finishes or is interrupted, even if the trigger signal becomes ``false``.
*   ``onFalse(Command)``: Schedules the command when the trigger transitions from ``true`` to ``false`` (a *falling edge*). The command runs until it finishes or is interrupted, even if the trigger signal becomes ``true``.
*   ``whileTrue(Command)``: Schedules the command on a rising edge and cancels it on a falling edge. If the command stops while the trigger is still ``true``, it is **not** restarted.
*   ``whileFalse(Command)``: Schedules the command on a falling edge and cancels it on a rising edge. If the command stops while the trigger is still ``false``, it is **not** restarted.

Use ``onTrue`` and ``onFalse`` for commands that should run until they finish and use ``whileTrue`` and ``whileFalse`` for commands whose lifetime should be tied to the signal. For example, "move while the bumper is held" is a ``whileTrue`` binding, while "start an intake sequence when the bumper is pressed" is usually an ``onTrue`` binding.

.. note:: Most triggers for operator control should use ``whileTrue``. This lets drivers easily halt a command just by letting go of the button it's bound to.

### Continuous/Retry Bindings

*   ``retryWhileTrue(Command)``: Like ``whileTrue``, but if the command finishes while the trigger is still ``true``, it is immediately restarted.
*   ``retryWhileFalse(Command)``: Like ``whileFalse``, but restarts if the command finishes while the trigger is still ``false``.

Retry bindings continuously attempt to schedule their command while the signal remains in the requested state. If the command ends naturally, it will be started again. If it was interrupted by another same-priority command that requires the same mechanism, the retry binding may immediately schedule it again and interrupt the would-be interrupter. Use retry bindings when repeated attempts are intentional, not as a default replacement for ``whileTrue``.

Retry bindings are particularly useful for suspend-like behavior when combined with command priorities. Multiple retry bindings for the same mechanism can be created at once; higher priority commands will take precedence over lower priority ones. This approach can  be simpler than a :doc:`state machine <state-machines>` when states don't interact with each other.

For example, if a robot has an LED strip to indicate robot state and error conditions to the drivers or spectators, the commands for indicating more severe errors can have higher priorities than those for less severe errors. The triggers and bindings for coordinating the LED state can be configured in a single command:

```java
Command ledControl = leds.run(coroutine -> {
  // Highest severity error: continually set the comms warning while the DS is disconnected.
  new Trigger(RobotState::isDSAttached).retryWhileFalse(leds.flashCommsWarning());

  // Medium severity error: continually set the intake warning while the intake is broken.
  // If interrupted by the comms warning, it will resume when DS connection is restored.
  new Trigger(intake::isJammed).retryWhileTrue(leds.flashIntakeWarning());

  // Lowest priority, not even an error: continually indicate the alliance color.
  // NOTE: Because ledControl is the default command, we can't set a command-scoped
  // default command; it'll override the external setting and immediately cancel ledControl.
  new Trigger(() -> true).retryWhileTrue(leds.showAllianceColor());

  // All the logic is in the triggers. Park the coroutine to keep the command
  // alive, but there's nothing to do otherwise.
  coroutine.park();
}).named("LED Control");

leds.setDefaultCommand(ledControl);
```

### Toggle Bindings

*   ``toggleOnTrue(Command)``: Schedules the command on a ``false`` to ``true`` transition, and cancels it on the next ``false`` to ``true`` transition.
*   ``toggleOnFalse(Command)``: Schedules the command on a ``true`` to ``false`` transition, and cancels it on the next ``true`` to ``false`` transition.

Toggle bindings are best for operator controls where the driver explicitly switches a behavior on and off. They are usually a poor fit for safety behavior because the command's lifetime depends on remembering how many edges have occurred.

### Multi-Press Bindings

The ``multiPress(int, Time)`` modifier allows commands to be bound when a trigger signal has had a minimum number of rising edges within a specific time period.

For example, ``driverController.a().multiPress(2, Seconds.of(1.5))`` will go high when there have been **at least** two rising edges on the driver's "A" button within the last 1.5 seconds, and will go low when there are fewer. This can be used with ``onTrue`` to respond to a double-press. The multi-press trigger remains high as long as enough presses are still inside the time window; it is not only high on the final button press.

## Combining Triggers

Triggers can be combined using standard boolean operators to create more complex conditions. These operations create new trigger objects and do not modify the originals.

*   ``Trigger.and(BooleanSupplier)``: High when **both** signals are high.
*   ``Trigger.or(BooleanSupplier)``: High when **either** signal is high.
*   ``Trigger.negate()``: High when the original signal is low.

```java
Trigger bothButtons = buttonA.and(buttonB);
Trigger eitherButton = buttonA.or(buttonB);
Trigger notButton = buttonA.negate();
```

## Modifying Trigger Behavior

You can also modify how a trigger responds to the underlying condition:

*   ``debounce(Time duration)``: Creates a trigger that only becomes ``true`` if the original condition is ``true`` for at least the specified duration.
*   ``risingEdge()``: Creates a trigger that is only ``true`` for a single loop cycle when the original condition transitions from ``false`` to ``true``.
*   ``fallingEdge()``: Creates a trigger that is only ``true`` for a single loop cycle when the original condition transitions from ``true`` to ``false``.

.. warning:: Because ``risingEdge()`` and ``fallingEdge()`` are only high for a single scheduler cycle, bind commands to them with ``onTrue``. A ``whileTrue`` binding on a one-cycle edge trigger will schedule the command and then cancel it on the next cycle.

## Scopes

Trigger bindings exist in *scopes*. When a scope exits, any trigger binding that was created in that scope will be removed and the commands attached to that binding will be canceled. This is a critical safety feature of the library to prevent commands being triggered at unexpected moments.

.. warning:: A scoped trigger is only polled while its scope is active. If a scoped trigger is cached and referenced outside the scope where it was created, it will always return the value it had at the moment its scope exited.

1.  **Global Scope**: Bindings created in the ``Robot`` constructor or methods called by it. These are always active.
2.  **OpMode Scope**: Bindings created while a specific OpMode is running. These are automatically removed when the OpMode ends.
3.  **Command Scope**: Bindings created inside a running command. These are removed when the command finishes or is canceled.

.. note:: See :doc:`scopes` for more information about scopes.

```java
import first.robot.mechanisms.*;
import org.wpilib.framework.OpModeRobot;
import org.wpilib.command3.button.RobotModeTriggers;

public class Robot extends OpModeRobot {
  public final Arm arm = new Arm();
  public final Intake intake = new Intake();
  public final Drive drive = new Drive();
  public final LEDs leds = new LEDs();
  public final CommandGamepad driverController = new CommandGamepad(1);

  public Robot() {
    // GLOBAL SCOPE: This binding is always active
    driverController.a().onTrue(arm.up());
  }
}

// OPMODE SCOPE: A trigger binding made in an opmode is only active while that opmode is running.
@Autonomous
public class ExampleAuto implements OpMode {
  public ExampleAuto(Robot robot) {
    new Trigger(RobotState::isFMSAttached).whileFalse(robot.leds.flashCommsWarning());
  }
}

// COMMAND SCOPE: A trigger binding inside a command is only active while that command is running.
public Command sweepAndScore() {
  return Command.noRequirements(coroutine -> {
    // This binding only exists while the 'sweepAndScore' command is running
    intakeTrigger.onTrue(intake.intakeOnce());

    coroutine.await(drive.followPath("SweepPath"));
  }).named("Sweep and Score");
}
```

## Game Controller Triggers

The ``org.wpilib.command3.button`` package provides specialized classes for creating triggers from game controllers, such as Xbox and PS5 (DualSense) controllers. These classes provide methods that return ``Trigger`` objects for every button, d-pad direction, and trigger on the controller. Prefer these named methods over raw button numbers when possible; the resulting robot code is easier to read and easier to audit during an event.

For a full list of available controller classes and their methods, see the `org.wpilib.command3.button <https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/command3/button/package-summary.html>`__ Javadoc.

### Advanced Controller Triggers

You can also use axis values (like the analog sticks or analog triggers) to create triggers by using the ``axisGreaterThan``, ``axisLessThan``, or ``axisMagnitudeGreaterThan`` methods, or by providing a custom ``BooleanSupplier``. Axis-based triggers usually need a threshold and sometimes a debounce so small joystick noise does not repeatedly schedule and cancel commands.

```java
// Trigger when the left Y axis is pushed more than 50% forward
Trigger highThrottle = new Trigger(() -> driverController.getLeftY() > 0.5).debounce(Milliseconds.of(200));

highThrottle.onTrue(Command.noRequirements(_ -> System.out.println("High throttle!")).named("High Throttle Print"));
```
