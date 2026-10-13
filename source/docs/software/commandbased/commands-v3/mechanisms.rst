# Command Mechanisms

Mechanisms are the building blocks of a robot program. They represent physical hardware components, such as a drivetrain, an elevator, or a claw. A mechanism can also represent non-actuator hardware that still needs coordinated ownership, such as an LED strip or a vision processor whose pipeline can be changed by commands.

In the commands framework, mechanisms serve two primary purposes:

1. **Hardware Abstraction**: They encapsulate the low-level hardware control (motor controllers, sensors, etc.) and provide a high-level API for commands to use.
2. **Resource Management**: They act as locks that commands must acquire to run. Only one command can own a mechanism at a time, which prevents conflicting hardware requests.

The abstraction part and the ownership part are meant to work together. If a motor controller is public, code elsewhere can still set it directly and bypass the scheduler. If the motor controller is private and the mechanism exposes commands instead, the scheduler can see every action that controls that hardware and apply the normal conflict rules.

## Defining a Mechanism

To create a mechanism, write a class that implements the ``Mechanism`` interface. Hardware fields and low-level actuator helpers should usually be private. Public methods should either read state or return commands that perform safe actions.

```java
import org.wpilib.command3.Command;
import org.wpilib.command3.Mechanism;
import org.wpilib.command3.Trigger;
import org.wpilib.hardware.discrete.DigitalInput;
import org.wpilib.hardware.motor.PWMSparkMax;

public class Intake implements Mechanism {
  private final PWMSparkMax motor = new PWMSparkMax(1);
  private final DigitalInput beamBreak = new DigitalInput(2);

  public final Trigger hasGamePiece = new Trigger(() -> !beamBreak.get());

  public Intake() {
    setDefaultCommand(stop());
  }

  private void setSpeed(double speed) {
    motor.set(speed);
  }

  public Command intake() {
    return run(coroutine -> {
      setSpeed(0.75);
      coroutine.waitUntil(hasGamePiece);
      setSpeed(0);
    }).named("Intake");
  }

  public Command stop() {
    return runRepeatedly(() -> setSpeed(0)).named("Stop Intake");
  }
}
```

This style gives other code useful tools without giving it raw control. Other classes can bind to ``hasGamePiece`` or schedule ``intake()``, but they cannot accidentally leave the motor running outside the requirement system.

## Mechanism Commands

Mechanisms provide several factory methods to create commands that use them. Using these methods automatically adds the mechanism to the command's requirements.

- ``run(Consumer<Coroutine> body)``: Creates a command that executes the given body.
- ``runRepeatedly(Runnable body)``: Creates a command that executes the given body in an infinite loop, automatically yielding each cycle.
- ``idle()``: Creates a command that owns the mechanism, does nothing, and has the lowest priority.

``run`` is the general-purpose builder. It is best for commands with staged logic, such as "start moving, wait until the top limit is reached, then stop". ``runRepeatedly`` is for commands that should execute the same short action every scheduler cycle, such as applying arcade drive output or continuously holding zero voltage. ``idle`` is useful when you intentionally want a mechanism to be owned but uncommanded until another command interrupts it.

Commands created from these methods still need a name before they become ``Command`` objects. This is deliberate: command names appear in scheduler events, telemetry, and debugging output, so every command should have a meaningful one.

## Default Commands

Every mechanism can have a **default command**. This is the command that the scheduler will run whenever no other command is requiring the mechanism. Default commands are useful for ensuring that hardware is always in a safe or predictable state (e.g., stopping a motor or holding a position).

The default command is initially an ``idle()`` command. That means a mechanism with no configured default command is owned by a lowest-priority command that does nothing. For many mechanisms, especially mechanisms affected by gravity or motors that should be explicitly stopped, a real default command is safer than leaving the mechanism uncommanded.

Default commands also have priorities. A default command effectively sets the minimum priority needed to take over the mechanism, so defaults should usually have lower priority than ordinary user commands. A high-priority default command can accidentally prevent other low-priority behavior from ever starting.

```java
public class Elevator implements Mechanism {
  public Elevator() {
    // Set the default command to stay at the current position
    setDefaultCommand(holdPosition());
  }

  public Command holdPosition() {
    return runRepeatedly(() -> motor.setVoltage(feedforwardForCurrentHeight()))
      .withPriority(Command.LOWEST_PRIORITY + 1)
      .named("Hold Position");
  }
}
```

Setting a default command does not immediately run it. The scheduler starts the default command during its normal scheduling phase when the mechanism is otherwise idle. If a command temporarily changes a default command from inside its own logic, the previous default command is restored when that command's scope exits.
