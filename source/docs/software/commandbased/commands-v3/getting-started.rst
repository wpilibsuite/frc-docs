# Getting Started with Commands v3

.. todo:: This article provides a hands-on tutorial for writing your first Commands v3 robot program.

## Prerequisites

.. todo::
   - WPILib 2027+ installation
   - Basic Java knowledge (variables, methods, loops)
   - No prior command-based experience required (but helpful)

## Project Setup

.. todo::
   **Creating a New Project:**
   - Use WPILib VS Code project creator
   - Select "Command Robot (v3)" template
   - Project structure overview (Robot.java, RobotContainer.java, etc.)

   **Migrating Existing Project:**
   - Point to migration guide for v2 → v3
   - Package imports change: ``org.wpilib.commands3`` not ``commands2``
   - Cannot mix v2 and v3 in same project

## Setting Up the Scheduler

.. todo::
   **Robot.java Configuration:**
   - Import ``org.wpilib.commands3.Scheduler``
   - Call ``Scheduler.getDefault().run()`` in ``robotPeriodic()``
   - Why this must run every 20ms
   - Single-threaded requirement warning

   **Example RLI:**
   - Complete Robot.java from a wpilibjExamples project
   - Show minimal setup with scheduler call

## Creating Your First Mechanism

.. todo::
   **What is a Mechanism:**
   - Hardware grouping (motors, sensors, actuators that work together)
   - Acts as exclusive resource for commands
   - Replaces v2's Subsystem concept

   **Drivetrain Example:**
   - Extend ``Mechanism`` base class
   - Constructor: initialize hardware
   - Private methods for hardware control (``tank()``, ``arcade()``, ``stop()``)
   - Public methods for sensor reading (``getDistance()``, ``getHeading()``)
   - Setting a default command for idle behavior

   **Example RLI:**
   - Simple Drivetrain mechanism from wpilibjExamples
   - Show hardware encapsulation pattern
   - Default command for stopping motors when idle

## Writing Your First Command

.. todo::
   **What is a Command:**
   - A command represents an action the robot can perform
   - Commands run on the scheduler and can be scheduled, interrupted, or composed
   - Commands can require Mechanisms (exclusive access to hardware)
   - Commands have a lifecycle: scheduled → running → completed/interrupted

   **Drive For Distance Example:**
   - Use ``mechanism.run()`` factory method
   - Command body receives ``Coroutine`` parameter
   - Sequential steps: reset encoders → loop until target → stop
   - **Critical:** ``coroutine.yield()`` inside the loop
   - Naming the command with ``.named()``

   **Understanding yield():**
   - Pauses command execution
   - Allows scheduler to run other commands
   - Command resumes on next cycle
   - What happens if you forget it (robot freeze)

   **Example RLI:**
   - Drive for distance command
   - Drive for time command
   - Turn to angle command

## Scheduling Commands

.. todo::
   **Manual Scheduling:**
   - ``Scheduler.schedule(command)``
   - When to use manual scheduling (autonomous, testing)

   **Button Bindings:**
   - Quick preview (detailed in triggers article)
   - ``CommandXboxController`` usage
   - ``button.onTrue(command)`` pattern

   **Example RLI:**
   - RobotContainer with button bindings
   - Autonomous command scheduling

## Testing Your First Command

.. todo::
   **Using Driver Station:**
   - Enable teleop mode
   - Trigger command with button
   - Observe robot behavior
   - Check console output for command status

   **Dashboard Monitoring:**
   - Glass/Shuffleboard command widgets
   - Viewing running commands
   - Command status indicators

## Next Steps

.. todo::
   - Link to Mechanisms article for deeper dive
   - Link to Commands and Coroutines for full API reference
   - Link to Async/Await Patterns for advanced orchestration
   - Link to Binding Commands to Triggers for full control setup
