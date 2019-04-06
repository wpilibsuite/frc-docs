# Command-Based Library Screensteps: Markdown Edition

- [What is "command-based" programming?](#what-is--command-based--programming-)
  * [Subsystems and commands](#subsystems-and-commands)
  * [How commands are run](#how-commands-are-run)
  * [Command groups](#command-groups)
- [Subsystems](#subsystems)
  * [Creating a subsystem](#creating-a-subsystem)
  * [Simple subsystem example](#simple-subsystem-example)
  * [Setting default commands](#setting-default-commands)
- [Commands](#commands)
  * [Creating commands](#creating-commands)
  * [The structure of a command](#the-structure-of-a-command)
    + [Initialization](#initialization)
    + [Execution](#execution)
    + [Ending](#ending)
    + [Specifying end conditions](#specifying-end-conditions)
  * [Simple command example](#simple-command-example)
- [Command groups](#command-groups-1)
  * [Types of command groups](#types-of-command-groups)
    + [SequentialCommandGroup](#sequentialcommandgroup)
    + [ParallelCommandGroup](#parallelcommandgroup)
    + [ParallelRaceGroup](#parallelracegroup)
    + [ParallelDeadlineGroup](#paralleldeadlinegroup)
  * [Creating command groups](#creating-command-groups)
  * [Recursive composition of command groups](#recursive-composition-of-command-groups)
  * [Command groups and requirements](#command-groups-and-requirements)
  * [Restrictions on command group components](#restrictions-on-command-group-components)
- [Binding commands to triggers](#binding-commands-to-triggers)
  * [Trigger/Button bindings](#trigger-button-bindings)
    + [whenActive/whenPressed](#whenactive-whenpressed)
    + [whileActiveContinuous/whileHeld](#whileactivecontinuous-whileheld)
    + [whileActiveOnce/whenHeld](#whileactiveonce-whenheld)
    + [whenInactive/whenReleased](#wheninactive-whenreleased)
    + [toggleWhenActive/toggleWhenPressed](#togglewhenactive-togglewhenpressed)
    + [cancelWhenActive/cancelWhenPressed](#cancelwhenactive-cancelwhenpressed)
  * [Binding a command to a joystick button](#binding-a-command-to-a-joystick-button)
    + [Creating a JoystickButton](#creating-a-joystickbutton)
    + [Binding a command to a JoystickButton](#binding-a-command-to-a-joystickbutton)
  * [Composing triggers](#composing-triggers)
  * [Creating your own custom trigger](#creating-your-own-custom-trigger)
- [Structuring a command-based robot project](#structuring-a-command-based-robot-project)
  * [Robot.java](#robotjava)
  * [RobotContainer.java](#robotcontainerjava)
  * [Constants.java](#constantsjava)
  * [Subsystems](#subsystems-1)
  * [Commands](#commands-1)
- [PID control through PIDSubsystems and PIDCommands](#pid-control-through-pidsubsystems-and-pidcommands)
  * [PIDSubsystems](#pidsubsystems)
    + [Creating a PIDSubsystem](#creating-a-pidsubsystem)
    + [Using a PIDSubsystem](#using-a-pidsubsystem)
  * [PIDCommands](#pidcommands)
    + [Creating a PIDCommand](#creating-a-pidcommand)
    + [Using a PIDCommand](#using-a-pidcommand)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


# What is "command-based" programming?

WPILib supports a robot programming methodology called "command-based" programming.  In general, "command-based" can refer both the general programming paradigm, and to the set of WPILib library resources included to facilitate it.

"Command-based" programming is an example of what is known as a [design pattern.](https://en.wikipedia.org/wiki/Design_pattern)  It is a general way of organizing one's robot code that is well-suited to a particular problem-space.  It is not the only way to write a robot program, but it is a very effective one;  command-based robot code tend to be clean, extensible, and (with some tricks) easy to re-use from year to year.

The command-based paradigm is also an example of what is known as [declarative](https://en.wikipedia.org/wiki/Declarative_programming) programming.  In declarative programming, the emphasis is placed on *what* the program ought to do, rather than *how* the program ought to do it.  Thus, the command-based libraries allow users to define desired robot behaviors while minimizing the amount of iteration-by-iteration robot logic that they must write.  For example, in a command-based program, a user can specify that "the robot should perform an action when a button is pressed":

```java
aButton.whenPressed(intake::run);
```

In contrast, in an ordinary [imperative](https://en.wikipedia.org/wiki/Imperative_programming) program, the user would need to check the button state every iteration, and perform the appropriate action based on the state of the button.

```java
if(aButton.get()) {
  if(!pressed) {
    intake.run();
    pressed = true;
  } else {
    pressed = false;
  }
}
```

## Subsystems and commands

![image of subsystems and commands](https://media.screensteps.com/images/Wpilib/241892/1/rendered/B035F1D9-FDC6-43E4-9DFC-0E7E1919F3DB.png?AWSAccessKeyId=AKIAJRW37ULKKSXWY73Q&Expires=1554399753&Signature=QKRJuPulad7maQXXoYfGUwLZSzs%3D)

The command-based pattern is based around two core abstractions: **commands**, and **subsystems.**

**Subsystems** are the basic unit of robot organization in the design-based paradigm.  Subsystems [encapsulate](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)) lower-level robot hardware (such as motor controllers, sensors, and/or pneumatic actuators), and define the interfaces through which that hardware can be accessed by the rest of the robot code.  Subsystems allow users to "hide" the internal complexity of their actual hardware from the rest of their code - this both simplifies the rest of the robot code, and allows changes to the internal details of a subsystem without also changing the rest of the robot code.  Subsystems implement the `Subsystem` interface.

**Commands** define high-level robot actions or behaviors that utilize the methods defined by the subsystems.  A command is a simple [state machine](https://en.wikipedia.org/wiki/Finite-state_machine) that is either initializing, executing, ending, or idle.  Users write code specifying which action should be taken in each state.  Simple commands can be composed into "command groups" to accomplish more-complicated tasks.  Commands, including command groups, implement the `Command` interface.

## How commands are run

Commands are run by the `CommandScheduler`, a singleton class that is at the core of the command-based library.  The `CommandScheduler` is in charge of polling buttons for new commands to schedule, checking the resources required by those commands to avoid conflicts, executing currently-scheduled commands, and removing commands that have finished or been interrupted.  The scheduler's `run()` method may be called from any place in the user's code; it is generally recommended to call it from the `robotPeriodic()` method of the `Robot` class, which is run at a default frequency of 50Hz (once every 20ms).

Multiple commands can run concurrently, as long as they do not require the same resources on the robot.  Resource management is handled on a per-subsystem basis: commands may specify which subsystems they interact with, and the scheduler will never schedule more than one command requiring a given subsystem at a time.  this ensures that, for example, users will not end up with two different pieces of code attempting to set the same motor controller to different output values.  If a new command is scheduled that requires a subsystem that is already in use, it will either interrupt the currently-running command that requires that subsystem (if the command has been scheduled as interruptible), or else it will not be scheduled.

Subsystems also can be associated with "default commands" that will be automatically scheduled when no other command is currently using the subsystem.  This is useful for continuous "background" actions such as controlling the robot drive, or keeping an arm held at a setpoint.

TODO: replace this graphic with one that isn't wrong

![scheduler control flow diagram](https://media.screensteps.com/images/Wpilib/241892/1/rendered/10c3a71e-3789-4c88-b60d-4bb11c517109.png?AWSAccessKeyId=AKIAJRW37ULKKSXWY73Q&Expires=1554406576&Signature=sOHzcI9Pdeh48SQImzwE6ORrE%2Fc%3D)

When a command is scheduled, its `initialize()` method is called once.  Its `execute()` method is then called once per call to `CommandScheduler.getInstance().run()`.  A command is un-scheduled and has its `end(boolean interrupted)` method called when either its `isFinished()` method returns true, or else it is interrupted (either by another command with which it shares a required subsystem, or by being canceled).

## Command groups

It is often desirable to build complex commands from simple pieces.  This is achievable by [composing](https://en.wikipedia.org/wiki/Object_composition) commands into "command groups."  A command group is a command that contains multiple commands within it, which run either in parallel or in sequence.  The command-based library provides several types of command groups for teams to use, and users are encouraged to write their own, if desired.  As command groups themselves implement the `Command` interface, they are [recursively composeable](https://en.wikipedia.org/wiki/Object_composition#Recursive_composition) - one can include command groups *within* other command groups.  This provides an extremely powerful way of building complex robot actions with a simple library.

# Subsystems

Subsystems are the basic unit of robot organization in the command-based paradigm.  A subsystem is an abstraction for a collection of robot hardware that *operates together as a unit*.  Subsystems [encapsulate](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)) this hardware, "hiding" it from the rest of the robot code (e.g. commands) and restricting access to it except through the subsystem's public methods. Restricting the access in this way provides a single convenient place for code that might otherwise be duplicated in multiple places (such as scaling motor outputs or checking limit switches) if the subsystem internals were exposed.  It also allows changes to the specific details of how the subsystem works (the "implementation") to be isolated from the rest of robot code, making it far easier to make substantial changes if/when the design constraints change.

Subsystems also serve as the backbone of the `CommandScheduler`'s resource management system.  Commands may declare resource requirements by specifying which subsystems they interact with; the scheduler will never concurrently schedule more than one command that requires a given subsystem.  An attempt to schedule a command that requires a subsystem that is already-in-use will either interrupt the currently-running command (if the command has been scheduled as interruptible), or else be ignored.

Subsystems can be associated with "default commands" that will be automatically scheduled when no other command is currently using the subsystem.  This is useful for continuous "background" actions such as controlling the robot drive, or keeping an arm held at a setpoint.  Similar functionality can be achieved in the subsystem's `periodic()` method, which is run once per run of the scheduler; teams should try to be consistent within their codebase about which functionality is achieved through either of these methods.

## Creating a subsystem

The recommended method to create a subsystem for most users is to subclass the abstract `SendableSubsystemBase` class:

```java
import edu.wpi.first.wpilibj.experimental.command.SendableSubsystemBase;

public class ExampleSubsystem extends SendableSubsystemBase {
  // Your subsystem code goes here!
}
```

This class contains a few convenience features on top of the basic `Subsystem` interface: it automatically calls the `register()` method in its constructor to register the subsystem with the scheduler (this is necessary for the `periodic()` method to be called when the scheduler runs), and also implements the `Sendable` interface so that it can be sent to the dashboard to display/log relevant status information.

This is not required, however; advanced users seeking more flexibility are able to simply create a class that implements the `Subsystem` interface:

```java
import edu.wpi.first.wpilibj.experimental.command.Subsystem;

public class ExampleSubsystem implements Subsystem {
  // Your subsystem code goes here!
  
  public ExampleSubsystem() {
    register(); // Registers this subsystem with the scheduler so that its periodic method will be called.
  }
}
```

## Simple subsystem example

What might a functional subsystem look like in practice?  Below is a simple pneumatically-actuated hatch mechanism from the HatchBot example project (TODO: link to it):

```java
package edu.wpi.first.wpilibj.examples.hatchbottraditional.subsystems;

import edu.wpi.first.wpilibj.DoubleSolenoid;
import edu.wpi.first.wpilibj.experimental.command.SendableSubsystemBase;

import static edu.wpi.first.wpilibj.DoubleSolenoid.Value.*;
import static edu.wpi.first.wpilibj.examples.hatchbottraditional.Constants.HatchConstants.*;

/**
 * A hatch mechanism actuated by a single {@link DoubleSolenoid}.
 */
public class HatchSubsystem extends SendableSubsystemBase {

  private final DoubleSolenoid m_hatchSolenoid =
      new DoubleSolenoid(kHatchSolenoidModule, kHatchSolenoidPorts[0], kHatchSolenoidPorts[1]);

  /**
   * Grabs the hatch.
   */
  public void grabHatch() {
    m_hatchSolenoid.set(kForward);
  }

  /**
   * Releases the hatch.
   */
  public void releaseHatch() {
    m_hatchSolenoid.set(kReverse);
  }
}
```

Notice that the subsystem hides the presence of the DoubleSolenoid from outside code (it is declared `private`), and instead publicly exposes two higher-level, descriptive robot actions: `grabHatch()` and `releaseHatch()`.  It is extremely important that "implementation details" such as the double solenoid be "hidden" in this manner; this ensures that code outside the subsystem will never cause the solenoid to be in an unexpected state.  It also allows the user to change the implementation (for instance, a motor could be used instead of a pneumatic) without any of the code outside of the subsystem having to change with it.

## Setting default commands

Setting a default command for a subsystem is very easy; one simply calls `Scheduler.getInstance().setDefaultCommand()`, or, more simply,  the `setDefaultCommand()` method of the `Subsystem` interface:

```java
Scheduler.getInstance().setDefaultCommand(driveSubsystem, defaultDriveCommand);
```

```java
driveSubsystem.setDefaultCommand(defaultDriveCommand);
```

# Commands

Commands are simple state machines that perform high-level robot functions with the methods defined by subsystems.  Commands can be either idle, in which they do nothing, or scheduled, in which the scheduler will execute a specific set of the command's code depending on the state of the command.  The `CommandScheduler` recognizes scheduled commands as being in one of three states: initializing, executing, or ending.  Commands specify what is done in each of these states through the `initialize()`, `execute()` and `end()` methods.

## Creating commands

Similarly to subsystems, the recommended method for most users to create a command is to subclass the abstract `SendableCommandBase` class:

```java
import edu.wpi.first.wpilibj.experimental.command.SendableCommandBase;

public class ExampleCommand extends SendableCommandBase {
  // Your command code goes here!
}
```

As before, this contains several convenience features.  It automatically overrides the `getRequirements()` method for users, returning a list of requirements that is empty by default, but can be added to with the `addRequirements()` method.  It also implements the `Sendable` interface, and so can be sent to the dashboard - this provides a handy way for scheduling commands for testing (via a button on the dashboard) without needing to bind them to buttons on a controller.

Also as before, advanced users seeking more flexibility are free to simply create their own class implementing the `Command` interface:

```java
import java.util.Collections;

import edu.wpi.first.wpilibj.experimental.command.Command;

public class ExampleCommand implements Command {
  // Your command code goes here!
  
  // Must be overridden!
  @override
  public List<Subsystem> getRequirements() {
    // What to do if you have no subsystem to require
    return Collections.emptySet();
  }
}
```

## The structure of a command

While subsystems are fairly freeform, and may generally look like whatever the user wishes them to, commands are quite a bit more constrained.  Command code must specify what the command will do in each of its possible states.  This is done by overriding the `initialize()`, `execute()`, and `end()` methods.  Additionally, a command must be able to tell the scheduler when (if ever) it has finished execution - this is done by overriding the `isFinished()` method.  All of these methods are defaulted to reduce clutter in user code: `initialize()`, `execute()`, and `end()` are defaulted to simply do nothing, while `isFinishsed()` is defaulted to return false (resulting in a command that never ends).

### Initialization

```java
@Override
public void initialize() {
  // Code here will be executed when a command initializes!
}
```

The `initialize()` method is run exactly once per time a command is scheduled, as part of the scheduler's `schedule()` method.  The scheduler's `run()` method does not need to be called for the `initialize()` method to run.  The initialize block should be used to place the command in a known starting state for execution.  It is also useful for performing tasks that only need to be performed once per time scheduled, such as setting motors to run at a constant speed or setting the state of a solenoid actuator.

### Execution

```java
@Override
public void execute() {
  // Code here will be executed every time the scheduler runs while the command is scheduled!
}
```

The `execute()` method is called repeatedly while the command is scheduled, whenever the scheduler's `run()` method is called (this is generally done in the main robot periodic method, which runs every 20ms by default).  The execute block should be used for any task that needs to be done continually while the command is scheduled, such as updating motor outputs to match joystick inputs, or using the ouput of a control loop.

### Ending

```java
@Override
public void end(boolean interrupted) {
  // Code here will be executed whenever the command ends, whether it finishes normally or is interrupted!
  if (interrupted) {
    // Using the argument of the method allows users to do different actions depending on whether the command 
    // finished normally or was interrupted!
  }
}
```

The `end()` method of the command is called once when the command ends, whether it finishes normally (i.e. `isFinished()` returned true) or it was interrupted (either by another command or by being explicitly canceled).  The method argument specifies the manner in which the command ended; users can use this to differentiate the behavior of their command end accordingly.  The end block should be used to "wrap up" command state in a neat way, such as setting motors back to zero or reverting a solenoid actuator to a "default" state.

### Specifying end conditions

```java
@Override
public boolean isFinished() {
  // This return value will specify whether the command has finished!  The default is "false," which will make the
  // command never end.
  return false;
}
```

Just like `execute()`, the `isFinished()` method of the command is called repeatedly, whenever the scheduler's `run()` method is called.  As soon as it returns true, the command's `end()` method is called and it is un-scheduled.  The `isFinished()` method is called *after* the `execute()` method, so the command *will* execute once on the same iteration that it is un-scheduled.

## Simple command example

What might a functional command look like in practice?  As before, below is a simple command from the HatchBot example project that uses the `HatchSubsystem` introduced in the previous section:

```java
package edu.wpi.first.wpilibj.examples.hatchbottraditional.commands;

import edu.wpi.first.wpilibj.examples.hatchbottraditional.subsystems.HatchSubsystem;
import edu.wpi.first.wpilibj.experimental.command.SendableCommandBase;

/**
 * A simple command that grabs a hatch with the {@link HatchSubsystem}.  Written explicitly for 
 * pedagogical purposes; actual code should inline a command this simple with 
 * {@link edu.wpi.first.wpilibj.experimental.command.InstantCommand}.
 */
public class GrabHatch extends SendableCommandBase {
  
  // The subsystem the command runs on
  private final HatchSubsystem m_hatchSubsystem;
  
  public GrabHatch(HatchSubsystem subsystem) {
    m_hatchSubsystem = subsystem;
    addRequirements(m_hatchSubsystem);
  }

  @Override
  public void initialize() {
    m_hatchSubsystem.grabHatch();
  }

  @Override
  public boolean isFinished() {
    return true;
  }
}
```

Notice that the hatch subsystem used by the command is passed into the command through the command's constructor.  This is a pattern called [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection), and allows users to avoid declaring their subsystems as global variables.  This is widely accepted as a best-practice - the reasoning behind this will be discussed in a later section (TODO: link to the section once it's written).

Notice also that the above command calls the subsystem method once from initialize, and then immediately ends (as `isFinished()` simply returns true).  This is typical for commands that toggle the states of subsystems, and in fact the command-based library includes code to make commands like this even more succinctly (TODO: link to section on this).

What about a more complicated case?  Below is a drive command, from the same example project:

```java
package edu.wpi.first.wpilibj.examples.hatchbottraditional.commands;

import java.util.function.DoubleSupplier;

import edu.wpi.first.wpilibj.examples.hatchbottraditional.subsystems.DriveSubsystem;
import edu.wpi.first.wpilibj.experimental.command.SendableCommandBase;

/**
 * A command to drive the robot with joystick input (passed in as {@link DoubleSupplier}s).
 * Written explicitly for pedagogical purposes - actual code should inline a command this simple
 * with {@link edu.wpi.first.wpilibj.experimental.command.RunCommand}.
 */
public class DefaultDrive extends SendableCommandBase {

  private final DriveSubsystem m_drive;
  private final DoubleSupplier m_forward;
  private final DoubleSupplier m_rotation;

  public DefaultDrive(DriveSubsystem subsystem, DoubleSupplier forward, DoubleSupplier rotation){
    m_drive = subsystem;
    m_forward = forward;
    m_rotation = rotation;
    addRequirements(m_drive);
  }

  @Override
  public void execute() {
    m_drive.arcadeDrive(m_forward.getAsDouble(), m_rotation.getAsDouble());
  }
}
```

Notice that this command does not override `isFinished()`, and thus will never end; this is the norm for commands that are intended to be used as default commands (and, as can be guessed, the library includes tools to make this kind of command easier to write, too!) (TODO: add link to relevant section).

# Command groups

Individual commands are capable of accomplishing a large variety of robot tasks, but the simple three-state format can quickly become cumbersome when more advanced functionality requiring extended sequences of robot tasks or coordination of multiple robot subsystems is required.  In order to accomplish this, users are encouraged to use the powerful command group functionality included in the command-based library.

As the name suggests, command groups are combinations of multiple commands.  The act of combining multiple objects (such as commands) into a bigger object is known as [composition](https://en.wikipedia.org/wiki/Object_composition).  Command groups *compose* multiple commands into a *composite* command.  This allows code to be kept much cleaner and simpler, as the individual *component* commands may be written independently of the code that combines them, greatly reducing the amount of complexity at any given step of the process.

Most importantly, however, command groups *are themselves commands* - they implement the `Command` interface.  This allows command groups to be [recursively composed](https://en.wikipedia.org/wiki/Object_composition#Recursive_composition) - that is, a command group may contain *other command groups* as components.

## Types of command groups

The command-based library supports four basic types of command groups: `SequentialCommandGroup`, `ParallelCommandGroup`, `ParallelRaceGroup`, and `ParallelDeadlineGroup`.  Each of these command groups combines multiple commands into a composite command - however, they do so in different ways:

### SequentialCommandGroup
```java
SequentialCommandGroup(Command... commands)
```

A `SequentialCommandGroup` runs a list of commands in sequence - the first command will be executed, then the second, then the third, and so on until the list finishes.  The sequential group finishes after the last command in the sequence finishes.  It is therefore usually important to ensure that each command in the sequence does actually finish (if a given command does not finish, the next command will never start!).

### ParallelCommandGroup
```
ParallelCommandGroup(Command... commands)
```

A `ParallelCommandGroup` runs a set of commands concurrently - all commands will execute at the same time.  The parallel group will end when all commands have finished.

### ParallelRaceGroup
```
ParallelRaceGroup(Command... commands)
```

A `ParallelRaceGroup` is much like a `ParallelCommandgroup`, in that it runs a set of commands concurrently.  However, the race group ends as soon as any command in the group ends - all other commands are interrupted at that point.

### ParallelDeadlineGroup
```
ParallelDeadlineGroup(Command deadline, Command... commands)
```

A `ParallelDeadlineGroup` also runs a set of commands concurrently.  However, the deadline group ends when a *specific* command (the "deadline") ends, interrupting all other commands in the group that are still running at that point.

## Creating command groups

Users have several options for creating command groups.  One way - similar to the previous incarnation of the command-based library - is to subclass one of the command group classes.  Consider the following from the Hatch Bot example project (TODO: link):

```java
package edu.wpi.first.wpilibj.examples.hatchbottraditional.commands;

import edu.wpi.first.wpilibj.examples.hatchbottraditional.subsystems.DriveSubsystem;
import edu.wpi.first.wpilibj.examples.hatchbottraditional.subsystems.HatchSubsystem;
import edu.wpi.first.wpilibj.experimental.command.SequentialCommandGroup;

import static edu.wpi.first.wpilibj.examples.hatchbottraditional.Constants.AutoConstants.*;

/**
 * A complex auto command that drives forward, releases a hatch, and then drives backward.
 */
public class ComplexAuto extends SequentialCommandGroup {

  public ComplexAuto(DriveSubsystem drive, HatchSubsystem hatch) {
    addCommands(
        // Drive forward the correct distance
        new DriveDistance(kAutoDriveDistanceInches, kAutoDriveSpeed, drive),

        // Release the hatch
        new ReleaseHatch(hatch),

        // Drive backward the specified distance
        new DriveDistance(kAutoBackupDistanceInches, -kAutoDriveSpeed, drive)
    );
  }

}
```

The `addCommands` method adds commands to the group, and is present in all four types of command group.

Equivalently, however, command groups can be used without subclassing at all: one can simply pass in the desired commands through the constructor.  Thus, the following two pieces of code are equivalent:

```java
Command complexAuto = new ComplexAuto(m_robotDrive, m_hatchSubsystem);
```

```java
Command complexAuto = new SequentialCommandGroup(
    new DriveDistance(kAutoDriveDistanceInches, kAutoDriveSpeed, m_robotDrive),
    new ReleaseHatch(m_hatchSubsystem),
    new DriveDistance(kAutoBackupDistanceInches, -kAutoDriveSpeed, m_robotDrive));
```

This is called an *inline* command definition (TODO: link to section), and is very handy for circumstances where command groups are not likely to be reused, and writing an entire class for them would be wasteful.

## Recursive composition of command groups

As mentioned earlier, command groups are [recursively composeable](https://en.wikipedia.org/wiki/Object_composition#Recursive_composition) - since command groups are themselves commands, they may be included as components of other command groups.  This is an extremely powerful feature of command groups, and allows users to build very complex robot actions from simple pieces.  For example, consider the following code:

```java
new SequentialCommandGroup(
    new DriveToGoal(m_drive),
    new ParallelCommandGroup(
        new RaiseElevator(m_elevator),
        new SetWristPosition(m_wrist)),
    new ScoreTube(m_wrist));
```

This creates a sequential command group that *contains* a parallel command group.  The resulting control flow looks something like this:

![command group with concurrency](https://media.screensteps.com/images/Wpilib/241892/1/rendered/47DD42D1-0EF3-467A-91E1-26EF7EB92618.png?AWSAccessKeyId=AKIAJRW37ULKKSXWY73Q&Expires=1554575116&Signature=2bxScjmYX6eE%2FIlxhhzHVIrzoUU%3D)

Notice how the recursive composition allows the embedding of a parallel control structure within a sequential one.  Notice also that this entire, more-complex structure, could be again embedded in another structure.  Composition is an extremely powerful tool, and one that users should be sure to use extensively.

## Command groups and requirements

As command groups are commands, they also must declare their requirements.  However, users are not required to specify requirements manually for command groups - requirements are automatically inferred from the commands included.  As a rule, *command groups include the union of all of the subsystems required by their component commands.*  Thus, the `ComplexAuto` shown previously will require both the drive subsystem and the hatch subsystem of the robot.

Additionally, requirements are enforced within all three types of parallel groups - a parallel group may not contain multiple commands that require the same subsystem.

Some advanced users may find this overly-restrictive - for said users, the library offers a `ScheduleCommand` class that can be used to independently "branch off" from command groups to provide finer granularity in requirement management (TODO: link).

## Restrictions on command group components

Since command group components are run through their encapsulating command groups, errors could occur if those same command instances were independently scheduled at the same time as the group - the command would be being run from multiple places at once, and thus could end up with inconsistent internal state, causing unexpected and hard-to-diagnose behavior.

For this reason, command instances that have been added to a command group cannot be independently scheduled or added to a second command group.  Attempting to do so will throw an `InvalidUseOfCommandException`.

Advanced users who wish to re-use a command instance and are *certain* that it is safe to do so may bypass this restriction with the `clearGroupedCommand()` method in the `CommandGroupBase` class (TODO: link).

# Binding commands to triggers

Apart from autonomous commands, which are scheduled at the start of the autonomous period, and default commands, which are automatically scheduled whenever their subsystem is not currently in-use, the most common way to run a command is by binding it to a triggering event, such as a button being pressed by a human operator.  The command-based paradigm makes this extremely easy to do.

As mentioned earlier, command-based is a [declarative](https://en.wikipedia.org/wiki/Declarative_programming) paradigm.  Accordingly, binding buttons to commands is done declaratively; the association of a button and a command is "declared" once, during robot initialization.  The library then does all the hard work of checking the button state and scheduling (or cancelling) the command as needed, behind-the-scenes.  Users only need to worry about designing their desired UI setup - not about implementing it!

Command binding is done through the `Trigger` class and its various `Button` subclasses (TODO: link).

## Trigger/Button bindings

There are a number of bindings available for the `Trigger` class.  All of these bindings will automatically schedule a command when a certain trigger activation event occurs - however, each binding has different specific behavior.  `Button` and its subclasses have bindings with identical behaviors, but slightly different names that better-match a button rather than an arbitrary triggering event.

### whenActive/whenPressed

```java
trigger.whenActive(Command command)
```

```java
button.whenPressed(Command command)
```

This binding schedules a command when a trigger changes from inactive to active (or, accordingly, when a button changes is initially pressed).  The command will be scheduled on the iteration when the state changes, and will not be scheduled again unless the trigger becomes inactive and then active again (or the button is released and then re-pressed).

### whileActiveContinuous/whileHeld

```java
trigger.whileActiveContinuous(Command command)
```

```java
button.whileHeld(Command command)
```

This binding schedules a command repeatedly while a trigger is active (or, accordingly, while a button is held), and cancels it when the trigger becomes inactive (or when the button is released).  Note that scheduling an already-running command has no effect; but if the command finishes while the trigger is still active, it will be re-scheduled.

### whileActiveOnce/whenHeld

```java
trigger.whileActiveOnce(Command command)
```

```java
button.whenHeld(Command command)
```

This binding schedules a command when a trigger changes from inactive to active (or, accordingly, when a button is initially pressed) and cancels it when the trigger becomes inactive again (or the button is released).  The command will *not* be re-scheduled if it finishes while the trigger is still active.

### whenInactive/whenReleased

```java
trigger.whenInactive(Command command)
```

```java
button.whenReleased(Command command)
```

This binding schedules a command when a trigger changes from active to inactive (or, accordingly, when a button is initially released).  The command will be scheduled on the iteration when the state changes, and will not be re-scheduled unless the trigger becomes active and then inactive again (or the button is pressed and then re-released).

### toggleWhenActive/toggleWhenPressed

```java
trigger.toggleWhenActive(Command command)
```

```java
button.toggleWhenPressed(Command command)
```

This binding toggles a command, scheduling it when a trigger changes from inactive to active (or a button is initially pressed), and cancelling it under the same condition if the command is currently running.  Note that while this functionality is supported, toggles are *not* a highly-recommended option for user control, as they require the driver to mentally keep track of the robot state.

### cancelWhenActive/cancelWhenPressed

```java
trigger.cancelWhenActive(Command command)
```

```java
button.cancelWhenPressed(Command command)
```

This binding cancels a command when a trigger changes from inactive to active (or, accordingly, when a button is initially pressed).  the command is canceled on the iteration when the state changes, and will not be canceled again unless the trigger becomes inactive and then active again (or the button is released and re-pressed).  Note that cancelling a command that is not currently running has no effect.

## Binding a command to a joystick button

The most-common way to trigger a command is to bind a command to a button on a joystick or other HID (human interface device).  To do this, users should use the `JoystickButton` class.

### Creating a JoystickButton

There are two ways to create a `JoystickButton`.  For both, one must first create an instance of one of the subclasses of `GenericHID`:

```java
Joystick leftStick = new Joystick(1); // Creates a joystick on port 1
```

```java
XboxController driverController = new XboxController(2); // Creates an XboxController on port 2.
```

After this is done, users can simply call the `getButton()` method on the HID:

```java
leftStick.getButton(Joystick.Button.kTrigger.value) // Returns the JoystickButton pbject
                                                    // corresponding to the trigger of leftStick
```

```java
driverController.getButton(XboxController.Button.kX.value) // Returns the JoystickButton object 
                                                           // corresponding to the `X` button of driverController
```

### Binding a command to a JoystickButton

Putting it all together, it is very simple to bind a button to a JoystickButton:

```java
// Binds an ExampleCommand to be scheduled when the trigger of the left joystick is pressed
leftStick.getButton(Joystick.Button.kTrigger.value).whenPressed(new ExampleCommand());
```

```java
// Binds an ExampleCommand to be scheduled when the `X` button of the driver gamepad is pressed
driverController.getButton(XboxController.Button.kX.value).whenPressed(new ExampleCommand());
```

It is useful to note that the command binding methods all return the trigger/button that they were initially called on, and thus can be chained to bind multiple commands to different states of the same button.  For example:

```java
driverController.getButton(XboxController.Button.kX.value)
    // Binds a FooCommand to be scheduled when the `X` button of the driver gamepad is pressed
    .whenPressed(new FooCommand());
    // Binds a BarCommand to be scheduled when that same button is released
    .whenReleased(new BarCommand());
```

Remember that button binding is *declarative*: bindings only need to be declared once, ideally some time during robot initialization.  The library handles everything else.

## Composing triggers

The `Trigger` class (including its `Button` subclasses) can be composed to create composite triggers through the `and()`, `or()`, and `negate()` methods.  For example:

```java
// Binds an ExampleCommand to be scheduled when both the 'X' and 'Y' buttons of the driver gamepad are pressed
driverController.getButton(XboxController.Button.kX.value)
    .and(driverController.getButton(XboxController.Button.kY.value))
    .whenActive(new ExampleCommand());
```

Note that these methods return a `Trigger`, not a `Button`, so the `Trigger` binding method names must be used even when buttons are composed.

## Creating your own custom trigger

While binding to HID buttons is by far the most common use case, advanced users may occasionally want to bind commands to arbitrary triggering events.  This can be easily done by simply writing your own subclass of trigger:

```java
public class ExampleTrigger extends Trigger {

  @Override
  public boolean get() {
    // This returns whether the trigger is active
  }
}
```

# Structuring a command-based robot project

While users are free to use the command-based libraries however they like (and advanced users are encouraged to do so), new users may want some guidance on how to structure a basic command-based robot project.

A standard template for a command-based robot project is included in the WPILib examples repository (TODO: link).  This section will walk users through the structure of this template.

The root package generally will contain four classes:

`Main.java`, which is the main robot application.  New users *should not* touch this class.
`Robot.java`, which is responsible for the main control flow of the robot code.
`RobotContainer.java`, which holds robot subsystems and commands, and is where most of the declarative robot setup (e.g. button bindings) is performed.
`Constants.java`, which holds globally-accessible constants to be used throughout the robot.

The root directory will also contain two sub-packages:
`Subsystems` contains all user-defined subsystem classes.
`Commands` contains all user-defined command classes.

## Robot.java

As `Robot.java` is responsible for the program's control flow, and command-based is an imperative paradigm designed to minimize the amount of attention the user has to pay to explicit program control flow, the `Robot.java` class of a command-based project should be mostly empty.  However, there are a few important things that must be included (TODO: link to class on github):

```java
  /**
   * This function is run when the robot is first started up and should be used for any
   * initialization code.
   */
  @Override
  public void robotInit() {
    // Instantiate our RobotContainer.  This will perform all our button bindings, and put our
    // autonomous chooser on the dashboard.
    m_robotContainer = new RobotContainer();
  }
```

Firstly, notice that an instance of `RobotContainer` is constructed during the `robotInit()` method - this is important, as most of the declarative robot setup will be called from the `RobotContainer` constructor.  

```java
  /**
   * This function is called every robot packet, no matter the mode. Use this for items like
   * diagnostics that you want ran during disabled, autonomous, teleoperated and test.
   *
   * <p>This runs after the mode specific periodic functions, but before
   * LiveWindow and SmartDashboard integrated updating.
   */
  @Override
  public void robotPeriodic() {
    // Runs the Scheduler.  This is responsible for polling buttons, adding newly-scheduled
    // commands, running already-scheduled commands, removing finished or interrupted commands,
    // and running subsystem periodic() methods.  This must be called from the robot's periodic
    // block in order for anything in the Command-based framework to work.
    CommandScheduler.getInstance().run();
  }
```

Secondly, the inclusion of the `CommandScheduler.getInstance().run()` call in the `robotPeriodic()` method is essential; without this call, the scheduler will not execute any scheduled commands.  Since `TimedRobot` runs with a default main loop frequency of 50Hz, this is the frequency with which periodic command and subsystem methods will be called.  It is not recommended for new users to call this method from anywhere else in their code.

```java
  /**
   * This autonomous runs the autonomous command selected by your {@link RobotContainer} class.
   */
  @Override
  public void autonomousInit() {
    m_autonomousCommand = m_robotContainer.getAutonomousCommand();

    // schedule the autonomous command (example)
    if (m_autonomousCommand != null) {
      m_autonomousCommand.schedule();
    }
  }
```

Thirdly, notice that the `autonomousInit()` method schedules an autonomous command returned by the `RobotContainer` instance.  The logic for selecting which autonomous command to run can be handled inside of `RobotContainer`.

```java
  @Override
  public void teleopInit() {
    // This makes sure that the autonomous stops running when
    // teleop starts running. If you want the autonomous to
    // continue until interrupted by another command, remove
    // this line or comment it out.
    if (m_autonomousCommand != null) {
      m_autonomousCommand.cancel();
    }
  }
```

Finally, notice that the `teleopInit()` method cancels any still-running autonomous commands.  This is generally good practice.

Advanced users are free to add additional code to the various init and periodic methods as they see fit; however, it should be noted that including large amounts of imperative robot code in `Robot.java` is contrary to the declarative design philosophy of the command-based paradigm, and can result in confusingly-structured/disorganized code.

## RobotContainer.java

This class is where most of the setup for your command-based robot will take place.  In this class, you will define your robot's subsystems and commands, bind those commands to triggering events (such as buttons), and specify which command you will run in your autonomous routine.  There are a few aspects of this class new users may want explanations for (TODO: link to class on github):

```java
  // An example robot subsystem.  Keeping subsystem fields private prevents you from accidentally
  // interacting with them from elsewhere in the code, which can cause unpredictable and
  // hard-to-diagnose behavior.
  private ExampleSubsystem exampleSubsystem = new ExampleSubsystem();
```

Notice that subsystems are declared as private fields in `RobotContainer`.  This is in stark contrast to the previous incarnation of the command-based framework, but is much more-aligned with agreed-upon object-oriented best-practices.  If subsystems are declared as global variables, it allows the user to access them from anywhere in the code.  While this can make certain things easier (for example, there would be no need to pass subsystems to commands in order for those commands to access them), it makes the control flow of the program much harder to keep track of as it is not immediately obvious which parts of the code can change or be changed by which other parts of the code.  This also circumvents the ability of the resource-management system to do its job, as ease-of-access makes it easy for users to accidentally make conflicting calls to subsystem methods outside of the resource-managed commands.

```java
  public RobotContainer() {
    // Configure the button bindings
    configureButtonBindings();

    // Add commands to the autonomous command chooser
    m_chooser.addOption("Example Auto 1",
        new RunCommand(exampleSubsystem::exampleMethod, exampleSubsystem).withTimeout(15));
    m_chooser.addOption("Example Auto 2", new ExampleCommand(exampleSubsystem));

    // Put the chooser on the dashboard
    Shuffleboard.getTab("Autonomous").add(m_chooser);
  }
```

As mentioned before, the `RobotContainer()` constructor is where most of the declarative setup for the robot should take place, including button bindings, configuring autonomous selectors, etc.  If the constructor gets too "busy," users are encouraged to migrate code into separate subroutines (such as the `configureButtonBindings()` method included by default) which are called from the constructor.  Note that one of the example autonomous commands has been *inlined* (TODO: link to section on inlining) for convenience.  Note also that, since subsystems are declared as private fields, they must be explicitly passed to commands.

```java
/**
   * Use this to pass the autonomous command to the main {@link Robot} class.
   *
   * @return the command to run in autonomous
   */
  public Command getAutonomousCommand() {
    return m_chooser.getSelected();
  }
```

Finally, the `getAutonomousCommand()` method provides a convenient way for users to send their selected autonomous command to the main `Robot.java` class (which needs access to it to schedule it when autonomous starts).

## Constants.java

The `Constants.java` class is where globally-accessible robot constants (such as speeds, unit conversion factors, PID gains, and sensor/motor ports) can be stored.  It is recommended that users separate these constants into individual inner clases corresponding to subsystems or robot modes, to keep variable names shorter.  All constants declared in `Constants.java` should be declared as `public static final` so that they are globally accessible and cannot be changed (TODO: link to the class on github).

For more illustrative examples of what a `constants` class should look like in practice, see the various example projects (TODO: link).

It is recommended that the constants be used from other classes by statically importing the necessary inner class.  An `import static` statement imports the static namespace of a class into the class in which you are working, so that any `static` constants can be referenced directly as if they had been defined in that class, e.g.:

```java
import static edu.wpi.first.wpilibj.templates.commandbased.Constants.OIConstants.*;
```

This can be seen in many of the examples used in this ScreenSteps guide, as well as in the command-based example projects.

## Subsystems

User-defined subsystems should go in this package.

## Commands

User-defined commands should go in this package.

# PID control through PIDSubsystems and PIDCommands

One of the most common control algorithms used in FRC is the [PID controller](https://en.wikipedia.org/wiki/PID_controller).  WPILib offers its own `PIDController` class to help teams implement this functionality on their robots (TODO: link).  To further help teams integrate PID control into a command-based robot project, the command-based library includes several convenience wrappers for the `PIDController` object.  There are two basic wrappers: PIDSubsystems, which integrate the PID controller into a subsystem, and PIDCommands, which integrate the PID controller into a command.  Morevoer, each wrapper comes in one of two varieties: synchronous, which run from the main robot loop, and asynchronous, which run in their own thread.  While the asynchronous versions offer more functionality and potentially tigher control, new/inexperienced users are encouraged to use the synchronous versions to avoid having to deal with thread safety issues.

## PIDSubsystems

```java
SynchronousPIDSubsystem(PIDController controller)
```

```java
AsynchronousPIDSubsystem(PIDController controller)
```

The PIDSubsystem classes allow users to conveniently create a subsystem with a built-in PIDController.

### Creating a PIDSubsystem

To create a PIDSubsystem, users should subclass one of the two PIDSubsystem classes:

```java
import edu.wpi.first.wpilibj.experimental.controller.PIDController;

public class ExamplePIDSubsystem extends SynchronousPIDSubsystem {
  
  public ExamplePIDSubsystem() {
    // This would set the internal controller's gains (P, I, and D) to 0.
    super(new PIDController(0, 0, 0))
  }

  @Override
  public void useOutput(double output) {
    // Code to use the output of the PID loop goes here.  Users should generally add some sort of
    // feedforward to the loop output in this method before sending it to a motor.
  }

  @Override
  public double getReference() {
    // This should return the reference (setpoint) for the PID loop
  }

  @Override
  public double getMeasurement() {
    // This should return the measurement of the process variable
  }
}
```

Additional settings can be applied to the `PIDController` (TODO: link) by calling the `getController` method from the constructor.

### Using a PIDSubsystem


What does a PIDSubsystem look like when used in practice?  The following examples are taken from the FrisbeeBot example project (TODO: link):

```java
package edu.wpi.first.wpilibj.examples.frisbeebot.subsystems;

import edu.wpi.first.wpilibj.Encoder;
import edu.wpi.first.wpilibj.Spark;
import edu.wpi.first.wpilibj.experimental.command.SynchronousPIDSubsystem;
import edu.wpi.first.wpilibj.experimental.controller.PIDController;

import static edu.wpi.first.wpilibj.examples.frisbeebot.Constants.ShooterConstants.*;

public class ShooterSubsystem extends SynchronousPIDSubsystem {

  private Spark m_shooterMotor = new Spark(kShooterMotorPort);
  private Spark m_feederMotor = new Spark(kFeederMotorPort);
  private Encoder m_shooterEncoder = new Encoder(kEncoderPorts[0], kEncoderPorts[1],
      kEncoderReversed);

  public ShooterSubsystem() {
    super(new PIDController(kP, kI, kD));
    getController().setAbsoluteTolerance(kShooterToleranceRPS);
    m_shooterEncoder.setDistancePerPulse(kEncoderDistancePerPulse);
  }

  @Override
  public void useOutput(double output) {
    // Use a feedforward of the form kS + kV * velocity
    m_shooterMotor.set(output + kSFractional + kVFractional * kShooterTargetRPS);
  }

  @Override
  public double getReference() {
    return kShooterTargetRPS;
  }

  @Override
  public double getMeasurement() {
    return m_shooterEncoder.getRate();
  }

  public boolean atReference() {
    return m_controller.atReference();
  }

  public void runFeeder() {
    m_feederMotor.set(kFeederSpeed);
  }

  public void stopFeeder() {
    m_feederMotor.set(0);
  }

  @Override
  public void disable() {
    super.disable();
    // Turn off motor when we disable, since useOutput(0) doesn't stop the motor due to our
    // feedforward
    m_shooterMotor.set(0);
  }
}
```

Notice that the `disable()` method has been overridden, even though the superclass has an implementation - this is because the default implementation (for both synchronous and asynchronous) calls `useOutput(0);`, which may not necessarily set the motor output to zero depending on the type of feedforward implemented by the user.

Using a PIDSubsystem with commands can be very simple:

```java
// Spin up the shooter when the 'A' button is pressed
driverController.getButton(Button.kA.value)
    .whenPressed(new InstantCommand(m_shooter::enable, m_shooter));

// Turn off the shooter when the 'B' button is pressed
driverController.getButton(Button.kB.value)
    .whenPressed(new InstantCommand(m_shooter::disable, m_shooter));
```

## PIDCommands

```java
SynchronousPIDCommand(PIDController controller,
                      DoubleSupplier measurementSource,
                      double reference,
                      DoubleConsumer useOutput,
                      Subsystem... requirements)
```

```java
AsynchronousPIDCommand(PIDController controller,
                       DoubleSupplier measurementSource,
                       double reference,
                       DoubleConsumer useOutput,
                       Subsystem... requirements)
```

The PIDCommand classes allow users to easily create commands with a built-in PIDController.

### Creating a PIDCommand

As with PIDSubsystem, users can create a PIDCommmand by subclassing one of the two PIDCommand classes.

```java
import edu.wpi.first.wpilibj.experimental.controller.PIDController;

public class ExamplePIDCommand extends SynchronousPIDCommand {
  
  public ExamplePIDCommand() {
    super(new PIDController(0, 0, 0), //Creates a PIDController with all gains set to 0
        () -> { /*This should return the measurement of the process variable*/ },
        () -> { /*This should return the reference (setpoint) for the controller*/ },
        (output) -> { /*Code to use the output of the PID loop goes here*/ },
        requiredSubsystem /*PIDCommands should declare their requirements*/);
  }
  
}
```

However, as with many of the other command classes in the command-based library, users may want to save code by defining a PIDCommand inline (TODO: link):

```java
new PIDCommand(new PIDController(0, 0, 0), //Creates a PIDController with all gains set to 0
    () -> { /*This should return the measurement of the process variable*/ },
    () -> { /*This should return the reference (setpoint) for the controller*/ },
    (output) -> { /*Code to use the output of the PID loop goes here*/ },
    requiredSubsystem /*PIDCommands should declare their requirements*/);
```

### Using a PIDCommand

What does a PIDCommand look like when used in practice?  The following examples are from the GyroDriveCommands example project (TODO: link):

```java
package edu.wpi.first.wpilibj.examples.gyrodrivecommands.commands;

import edu.wpi.first.wpilibj.examples.gyrodrivecommands.subsystems.DriveSubsystem;
import edu.wpi.first.wpilibj.experimental.command.SynchronousPIDCommand;
import edu.wpi.first.wpilibj.experimental.controller.PIDController;

import static edu.wpi.first.wpilibj.examples.gyrodrivecommands.Constants.DriveConstants.*;

/**
 * A command that will turn the robot to the specified angle.
 */
public class TurnToAngle extends SynchronousPIDCommand {

  public TurnToAngle(double targetAngleDegrees, DriveSubsystem drive) {
    super(new PIDController(kTurnP, kTurnI, kTurnD),
        // Close loop on heading
        drive::getHeading,
        // Set reference to target
        targetAngleDegrees,
        // Pipe output to turn robot
        (output) -> drive.arcadeDrive(0, output),
        // Require the drive
        drive);

    // Set the input range of the controller to match the gyro output
    getController().setInputRange(-180, 180);
    // Set the controller to be continuous (because it is an angle controller)
    getController().setContinuous();
    // Set the controller tolerance - the delta tolerance ensures the robot is stationary at the
    // setpoint before it is considered as having reached the reference
    getController().setAbsoluteTolerance(kTurnToleranceDeg, kTurnRateToleranceDegPerS);
  }

  @Override
  public boolean isFinished() {
    // End when the controller is at the reference.
    return getController().atReference();
  }
}
```

And, for an inlined example (TODO: link):

```java
// Stabilize robot to drive straight with gyro when left bumper is held
driverController.getButton(Button.kBumperLeft.value).whenHeld(
    new SynchronousPIDCommand(
        new PIDController(kStabilizationP, kStabilizationI, kStabilizationD),
        // Close the loop on the turn rate
        m_robotDrive::getTurnRate,
        // Setpoint is 0
        0,
        // Pipe the output to the turning controls
        (output) ->
            m_robotDrive.arcadeDrive(driverController.getY(GenericHID.Hand.kLeft), output),
        // Require the robot drive
        m_robotDrive
    )
);
```
