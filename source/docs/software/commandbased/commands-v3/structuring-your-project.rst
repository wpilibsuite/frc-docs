# Structuring Your Project

While WPILib and the commands v3 framework are flexible and don't force code to be written in a specific way, we recommend a standard structure to make code easier to understand (both for programmers and :term:`CSA` volunteers).

1. Write a single ``Robot`` class that owns the mechanisms and driver controls.
2. Write separate classes that implement ``Mechanism`` to represent each mechanism on the robot.
3. Use OpMode classes to define OpMode-specific behaviors.
4. Any commands that require a single mechanism should be written as ``Command`` methods in that mechanism's class.
5. Any commands that require multiple mechanisms should be written as ``Command`` methods in a related helper class.

## A Single Robot Class

WPILib needs a single entry point to start your program. Use a ``Robot`` class that extends from ``OpModeRobot``. Any behavior that should always be active - regardless of OpMode - should be defined here, such as default commands or trigger bindings.

Mechanisms should be declared as ``public final`` fields in the robot class and initialized in the field declaration or in the constructor. The former makes the code a little more concise, while the latter allows for flexibility if different mechanism implementations exist.

.. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/rebuiltcmdv3/Robot.java
  :language: java
  :lines: 22-
  :lineno-match:

## Mechanism Classes

Each physical mechanism on a robot should have a corresponding class in the codebase. These are typically in the ``first.robot.mechanisms`` package.

Mechanisms are often a combination of multiple actuators, such as a slapdown intake with one actuator or set of actuators to run intake rollers and a separate actuator that extends and retracts the intake. It's usually simpler for each independent actuator to have its own ``Mechanism`` class; if they're only used in the context of a larger mechanism, they can still be separate classes, but only used by a single encompassing mechanism.

### Mechanism-level Commands

Commands that only interact with a single mechanism should be defined as methods in that mechanism's class using the ``run`` or ``runRepeatedly`` builder methods provided by the ``Mechanism`` interface. These builder methods make the created command automatically require the mechanism so you can't forget to set the requirement.

.. warning:: Command methods are designed to create a ``Command`` object that will be run at a later point in the program. Only the code in the lambda function passed to ``run`` or ``runRepeatedly`` will execute when the command is running.

In the example of a slapdown intake, there could be three classes:

1. ``IntakeRoller``, for controlling just the rollers
2. ``IntakeWrist``, for controlling the deployment of the intake
3. ``Intake``, which combines both the rollers and the wrist

### ``IntakeRoller.java``
.. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/rebuiltcmdv3/mechanisms/IntakeRoller.java
  :language: java
  :lines: 15-
  :lineno-match:

### ``IntakeWrist.java``
.. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/rebuiltcmdv3/mechanisms/IntakeWrist.java
  :language: java
  :lines: 17-
  :lineno-match:

### ``Intake.java``
.. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/rebuiltcmdv3/mechanisms/Intake.java
  :language: java
  :lines: 12-
  :lineno-match:

## Multi-Mechanism Commands

Commands that control multiple mechanisms should coordinate smaller per-mechanism commands. From the intake example above, take note that the main ``Intake`` class has no hardware of its own; all hardware control is done in the separate roller and wrist mechanisms, while ``Intake`` is only responsible for coordinating the two.

Not every multi-mechanism control scheme needs to use a encapsulating mechanism to coordinate control. The intake example uses that setup because the wrist and roller are *part* of the intake, but control of disparate mechanisms like an intake and an arm can use a no-requirement command that forks and coordinates mechanism-specific commands.

Complex multi-mechanism control can also be done using :doc:`state machines <state-machines>`.

## OpMode Classes

OpMode classes let you group mode-specific logic together in one place without cluttering the main robot class. Because the command scheduler automatically scopes everything you do in the OpMode class to that OpMode, you don't need to worry about logic specific to that OpMode leaking out and still running when modes change. Commands that are only used in a specific OpMode can be defined in that OpMode class, too.

OpMode constructors are generally all that's needed. WPILib will automatically call them when that mode is selected on the driver station, passing in the main ``Robot`` object if the constructor accepts it.

.. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/rebuiltcmdv3/opmodes/auto/SweepAuto.java
  :language: java
  :lines: 15-
  :lineno-match:

```java
package first.robot.mechanisms;

import static org.wpilib.units.Units.*;

import module wpilib;
import module wpilib.command3;

public class Arm implements Mechanism {
  // ... hardware definitions, constructors, PID controllers and so on ...

  // Good example:
  public Command stop() {
    return runRepeatedly(() -> motor.stop()).named("Stop Arm");
  }

  public Command incorrectStop() {
    // Incorrect: This will print to console when the command is created, not when it actually runs
    System.out.println("Stopping the arm motor! (but not really)");

    return runRepeatedly(() -> motor.stop()).named("Incorrect Stop Arm");
  }
}
```

Highly complicated commands with a lot of logic can harm readability of a mechanism class, and can optionally be implemented as standalone class-based commands in the same package as the mechanism. The mechanism class should still have a method to create and return these commands.

As a rule of thumb, commands with more than 15-20 lines of code are good candidates for being moved to class-based commands. Bits of logic can be more easily split into smaller helper methods, but you will need to implement all of the required ``Command`` methods yourself.

```java
package first.robot.mechanisms;

import module wpilib.command3;
import first.robot.commands.drivetrain.VeryComplicatedCommand;

public class Drivetrain implements Mechanism {
  // ... hardware definitions, constructors, PID controllers and so on ...

  public Command veryComplicatedCommand() {
    return new VeryComplicatedCommand(this);
  }
}
```

```java
package first.robot.commands.drivetrain;

import module java.base;
import module wpilib.command3;

public class VeryComplicatedCommand implements Command {
  private final Drivetrain drivetrain;
  private final Set<Mechanism> requirements;

  public FollowPathPartsCommand(Drivetrain drivetrain) {
    this.drivetrain = drivetrain;
    this.requirements = Set.of(drivetrain);
  }

  @Override
  public void run(Coroutine coroutine) {
    // ... lots of complicated logic ...
  }

  @Override
  public Set<Mechanism> requirements() {
    return requirements;
  }

  @Override
  public String name() {
    return "VeryComplicatedCommand";
  }
}
```
