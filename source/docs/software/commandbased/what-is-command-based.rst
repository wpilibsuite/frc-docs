# What Is "Command-Based" Programming?

WPILib supports a robot programming methodology called "command-based" programming. In general, "command-based" can refer both the general programming paradigm, and to the set of WPILib library resources included to facilitate it.

"Command-based" programming is one possible :term:`design pattern` for robot software. It is not the only way to write a robot program, but it is a very effective one. Command-based robot code tends to be clean, extensible, and (with some tricks) easy to reuse from year to year.

The command-based paradigm is also an example of :term:`declarative programming`. The command-based library allow users to define desired robot behaviors while minimizing the amount of iteration-by-iteration robot logic that they must write. For example, in the command-based program, a user can specify that "the robot should perform an action when a condition is true" (note the use of a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`):

.. tab-set-code::

  ```java
  new Trigger(condition::get).onTrue(Commands.runOnce(() -> piston.set(DoubleSolenoid.Value.kForward)));
  ```

  ```c++
  Trigger([&condition] { return condition.Get()).OnTrue(frc2::cmd::RunOnce([&piston] { piston.Set(frc::DoubleSolenoid::kForward)));
  ```

  ```python
  Trigger(condition.get).onTrue(Commands.runOnce(lambda: piston.set(DoubleSolenoid.Value.kForward)))
  ```

In contrast, without using command-based, the user would need to check the button state every iteration, and perform the appropriate action based on the state of the button.

.. tab-set-code::

  ```java
  if(condition.get()) {
    if(!pressed) {
      piston.set(DoubleSolenoid.Value.kForward);
      pressed = true;
    }
  } else {
    pressed = false;
  }
  ```

  ```c++
  if(condition.Get()) {
    if(!pressed) {
      piston.Set(frc::DoubleSolenoid::kForward);
      pressed = true;
    }
  } else {
    pressed = false;
  }
  ```

  ```python
  if condition.get():
      if not pressed:
          piston.set(DoubleSolenoid.Value.kForward)
          pressed = True
      else:
          pressed = False
  ```

## Subsystems and Commands

.. image:: diagrams/subsystems-and-commands.drawio.svg
   :alt: image of subsystems and commands

The command-based pattern is based around two core abstractions: **commands**, and **subsystems.**

**Commands** represent actions the robot can take. Commands run when scheduled, until they are interrupted or their end condition is met. Commands are very recursively composable: commands can be composed to accomplish more-complicated tasks. See :ref:`docs/software/commandbased/commands:Commands` for more info.

**Subsystems** represent independently-controlled collections of robot hardware (such as motor controllers, sensors, pneumatic actuators, etc.) that operate together. Subsystems back the resource-management system of command-based: only one command can use a given subsystem at the same time. Subsystems allow users to "hide" the internal complexity of their actual hardware from the rest of their code - this both simplifies the rest of the robot code, and allows changes to the internal details of a subsystem's hardware without also changing the rest of the robot code.

## How Commands Are Run

.. note:: For a more detailed explanation, see :doc:`command-scheduler`.

Commands are run by the ``CommandScheduler`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/CommandScheduler.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_scheduler.html), :external:py:class:`Python <commands2.CommandScheduler>`) singleton, which polls triggers (such as buttons) for commands to schedule, preventing resource conflicts, and executing scheduled commands. The scheduler's ``run()`` method must be called; it is generally recommended to call it from the ``robotPeriodic()`` method of the ``Robot`` class, which is run at a default frequency of 50Hz (once every 20ms).

Multiple commands can run concurrently, as long as they do not require the same resources on the robot. Resource management is handled on a per-subsystem basis: commands specify which subsystems they interact with, and the scheduler will ensure that no more more than one command requiring a given subsystem is scheduled at a time. This ensures that, for example, users will not end up with two different pieces of code attempting to set the same motor controller to different output values.

## Command Compositions

It is often desirable to build complex commands from simple pieces. This is achievable by creating a :term:`composition` of commands. The command-based library provides several types of :doc:`command compositions <command-compositions>` for teams to use, and users may write their own. As command compositions are commands themselves, they may be used in a :term:`recursive composition`. That is to say - one can create a command compositions from multiple command compositions. This provides an extremely powerful way of building complex robot actions from simple components.
