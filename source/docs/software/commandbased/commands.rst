Commands
========

Commands are simple state machines that perform high-level robot
functions using the methods defined by subsystems. Commands can be
either idle, in which they do nothing, or scheduled, in which the
scheduler will execute a specific set of the command’s code depending on
the state of the command. The ``CommandScheduler`` recognizes scheduled
commands as being in one of three states: initializing, executing, or
ending. Commands specify what is done in each of these states through
the ``initialize()``, ``execute()`` and ``end()`` methods.

Creating commands
-----------------

Similarly to subsystems, the recommended method for most users to create
a command is to subclass the abstract ``SendableCommandBase`` class:

.. code-block:: java

   import edu.wpi.first.wpilibj.experimental.command.SendableCommandBase;

   public class ExampleCommand extends SendableCommandBase {
     // Your command code goes here!
   }

As before, this contains several convenience features. It automatically
overrides the ``getRequirements()`` method for users, returning a list
of requirements that is empty by default, but can be added to with the
``addRequirements()`` method. It also implements the ``Sendable``
interface, and so can be sent to the dashboard - this provides a handy
way for scheduling commands for testing (via a button on the dashboard)
without needing to bind them to buttons on a controller.

Also as before, advanced users seeking more flexibility are free to
simply create their own class implementing the ``Command`` interface:

.. code-block:: java

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

The structure of a command
--------------------------

While subsystems are fairly freeform, and may generally look like
whatever the user wishes them to, commands are quite a bit more
constrained. Command code must specify what the command will do in each
of its possible states. This is done by overriding the ``initialize()``,
``execute()``, and ``end()`` methods. Additionally, a command must be
able to tell the scheduler when (if ever) it has finished execution -
this is done by overriding the ``isFinished()`` method. All of these
methods are defaulted to reduce clutter in user code: ``initialize()``,
``execute()``, and ``end()`` are defaulted to simply do nothing, while
``isFinishsed()`` is defaulted to return false (resulting in a command
that never ends).

Initialization
~~~~~~~~~~~~~~

.. code-block:: java

   @Override
   public void initialize() {
     // Code here will be executed when a command initializes!
   }

The ``initialize()`` method is run exactly once per time a command is
scheduled, as part of the scheduler’s ``schedule()`` method. The
scheduler’s ``run()`` method does not need to be called for the
``initialize()`` method to run. The initialize block should be used to
place the command in a known starting state for execution. It is also
useful for performing tasks that only need to be performed once per time
scheduled, such as setting motors to run at a constant speed or setting
the state of a solenoid actuator.

Execution
~~~~~~~~~

.. code-block:: java

   @Override
   public void execute() {
     // Code here will be executed every time the scheduler runs while the command is scheduled!
   }

The ``execute()`` method is called repeatedly while the command is
scheduled, whenever the scheduler’s ``run()`` method is called (this is
generally done in the main robot periodic method, which runs every 20ms
by default). The execute block should be used for any task that needs to
be done continually while the command is scheduled, such as updating
motor outputs to match joystick inputs, or using the ouput of a control
loop.

Ending
~~~~~~

.. code-block:: java

   @Override
   public void end(boolean interrupted) {
     // Code here will be executed whenever the command ends, whether it finishes normally or is interrupted!
     if (interrupted) {
       // Using the argument of the method allows users to do different actions depending on whether the command 
       // finished normally or was interrupted!
     }
   }

The ``end()`` method of the command is called once when the command
ends, whether it finishes normally (i.e. ``isFinished()`` returned true)
or it was interrupted (either by another command or by being explicitly
canceled). The method argument specifies the manner in which the command
ended; users can use this to differentiate the behavior of their command
end accordingly. The end block should be used to “wrap up” command state
in a neat way, such as setting motors back to zero or reverting a
solenoid actuator to a “default” state.

Specifying end conditions
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: java

   @Override
   public boolean isFinished() {
     // This return value will specify whether the command has finished!  The default is "false," which will make the
     // command never end.
     return false;
   }

Just like ``execute()``, the ``isFinished()`` method of the command is
called repeatedly, whenever the scheduler’s ``run()`` method is called.
As soon as it returns true, the command’s ``end()`` method is called and
it is un-scheduled. The ``isFinished()`` method is called *after* the
``execute()`` method, so the command *will* execute once on the same
iteration that it is un-scheduled.

Simple command example
----------------------

What might a functional command look like in practice? As before, below
is a simple command from the HatchBot example project that uses the
``HatchSubsystem`` introduced in the previous section:

.. code-block:: java

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

Notice that the hatch subsystem used by the command is passed into the
command through the command’s constructor. This is a pattern called
`dependency
injection <https://en.wikipedia.org/wiki/Dependency_injection>`__, and
allows users to avoid declaring their subsystems as global variables.
This is widely accepted as a best-practice - the reasoning behind this
is discussed in a `later
section <structuring>`__.

Notice also that the above command calls the subsystem method once from
initialize, and then immediately ends (as ``isFinished()`` simply
returns true). This is typical for commands that toggle the states of
subsystems, and in fact the command-based library includes code to make
`commands like this <instant-command>`__ even more succinctly.

What about a more complicated case? Below is a drive command, from the
same example project:

.. code-block:: java

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

Notice that this command does not override ``isFinished()``, and thus
will never end; this is the norm for commands that are intended to be
used as default commands (and, as can be guessed, the library includes
tools to make `this kind of command <run-command>`__ easier to write,
too!).