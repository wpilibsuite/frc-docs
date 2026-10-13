# Scopes

Scopes are how the commands library tracks the lifetime of commands, trigger bindings, default commands, and other scheduler resources. A scope represents a period during which certain actions are valid and safe. When a scope exits or becomes inactive, the scheduler automatically cleans up the resources associated with it.

This automatic cleanup is a critical safety feature. It ensures that commands and bindings do not leak from one part of the robot program to another. A teleop-only binding should not keep scheduling commands in autonomous, and a trigger created by a command should not keep controlling hardware after the command that created it is gone.

Scopes are used to manage several resources:

*   **Commands**: A command scheduled in a scope will be canceled when the scope exits.
*   **Triggers** A trigger created in a scope will stop being polled when the scope exits.
*   **Trigger Bindings**: Trigger bindings created in a scope will be deactivated when the scope exits, and any running commands bound to the trigger will be canceled.
*   **Default Commands**: Setting a mechanism's default command in a scope will only be applied during that scope.

When the library needs to create a scope, it chooses the narrowest one available: code running inside a command gets the command scope, code running inside an OpMode, but not inside a command, gets the OpMode scope, and code running outside a command and with no OpMode selected

The framework has three hierarchical scopes, from narrowest to widest:

## The Command Scope

The command scope is tied to the lifetime of a specific running command. Any resources created *inside* a command's logic are automatically scoped to that command.

*   **Child Commands**: If a command schedules another command (a "child"), the child is automatically canceled if the parent command finishes or is canceled.
*   **Trigger Bindings**: If you create a trigger binding (e.g., ``trigger.onTrue(anotherCommand)``) inside a command, that binding is only active while the parent command is running.
*   **Default Commands**: If a command sets a mechanism's default command, the previous default command will be restored when the command exits. The parent command also inherits ownership of that mechanism, even when the default command isn't running. Normal interruption rules apply, so the parent will be interrupted if an external command of the same or higher priority is scheduled that requires the mechanism.

Command scope is useful for temporary controls. For example, an aiming command can create a binding that fires only while the robot is actively aimed at the target. Once the aiming command completes or is canceled, the binding disappears and any command it started is canceled.

```java
public Command sweepAndScore(Robot robot) {
  return Command.noRequirements(coroutine -> {
    // This binding only exists while sweepAndScore is running
    intakeTrigger.onTrue(robot.intake.intake());

    coroutine.await(robot.drive.followPath("SweepPath"));
  }).named("Sweep and Score");
}
```

## The OpMode Scope

The OpMode scope is tied to the current robot mode (e.g., Autonomous, Teleop, Utility). Resources created while an OpMode is active are scoped to that mode.

When the robot transitions to a different mode, all commands and bindings scoped to the previous OpMode are automatically canceled and removed. This prevents an autonomous command from continuing to run into teleop, for example.

OpMode scope is where mode-specific setup belongs. Autonomous path commands, autonomous-only safety bindings, and autonomous default commands can be created in an autonomous OpMode without needing manual cleanup in teleop.

```java
import org.wpilib.command3.Command;
import org.wpilib.command3.Trigger;
import org.wpilib.command3.button.RobotModeTriggers;

@Autonomous
public class SweepAuto implements OpMode {
  public SweepAuto(Robot robot) {
    // Start the intake stowed
    robot.intake.setDefaultCommand(robot.intake.stow());

    // Once the robot is enabled, start following a sweep path through the
    // left trench, into the neutral zone, then back over the bump.
    // When we return to the alliance zone, aim at the hub and start shooting.
    RobotModeTriggers.enabled().onTrue(sweepAndScore(robot));
  }
}
```

## The Global Scope

The global scope is the widest scope and is active for the entire duration of the robot program.

.. warning::

    The global scope is used only when code is running outside of a command and when the robot program hasn't received an OpMode selection from the driverstation. WPILib only guarantees the latter condition in the main robot class constructor and field initialization, and any code called by it (often Mechanism class constructions). Any code called in robot mode methods such as ``robotPeriodic()`` may be in either the global or OpMode scope depending on when the robot connects to the driverstation and when an OpMode selection is made there.

Global resources are never automatically cleaned up by the scheduler. Use the global scope for things that should always be available, such as default commands for mechanisms, driver controls, and basic safety bindings. Avoid putting mode-specific behavior in global scope unless it explicitly checks the current mode or enable state.

```java
import org.wpilib.command3.Command;
import org.wpilib.command3.Trigger;
import org.wpilib.framework.TimedRobot;

public class Robot extends TimedRobot {
  public Robot() {
    // GLOBAL SCOPE: These are always active
    arm.setDefaultCommand(arm.holdPosition());
    driverController.a().onTrue(arm.up());
  }
}
```
