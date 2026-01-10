.. include:: <isonum.txt>

# Introduction to Command Scheduling

This page introduces the command scheduler and how commands interact in the command-based framework.

## What is the Command Scheduler?

The scheduler manages which commands run and when. It:

- Runs commands that are scheduled
- Handles command requirements and conflicts
- Cancels interrupted commands
- Manages default commands for subsystems

For detailed information, see :doc:`/docs/software/commandbased/command-scheduler`.

## Command Lifecycle

Commands progress through these stages:

1. **initialize()**: Called once when command starts
2. **execute()**: Called repeatedly (~50Hz) while command runs
3. **end()**: Called once when command finishes
4. **isFinished()**: Returns true when command should end

## Scheduling Commands

Commands can be scheduled in several ways:

- **Button triggers**: Schedule when button is pressed
- **Default commands**: Run when subsystem has no other commands
- **Auto mode**: Sequential or parallel command groups
- **Inline**: Manually call ``schedule()`` method

For more details, see :doc:`/docs/software/commandbased/commands`.

## Command Groups

Commands can be combined into groups:

- **Sequential**: Run commands one after another
- **Parallel**: Run multiple commands simultaneously
- **Deadline**: Run commands until one finishes

See :doc:`/docs/software/commandbased/command-compositions` for details.

## Additional Resources

- :doc:`/docs/software/commandbased/index` - Complete command-based programming guide
- :doc:`/docs/user-manual/subsystems-commands/index` - User manual section
