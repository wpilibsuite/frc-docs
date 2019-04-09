Command groups
==============

Individual commands are capable of accomplishing a large variety of
robot tasks, but the simple three-state format can quickly become
cumbersome when more advanced functionality requiring extended sequences
of robot tasks or coordination of multiple robot subsystems is required.
In order to accomplish this, users are encouraged to use the powerful
command group functionality included in the command-based library.

As the name suggests, command groups are combinations of multiple
commands. The act of combining multiple objects (such as commands) into
a bigger object is known as
`composition <https://en.wikipedia.org/wiki/Object_composition>`__.
Command groups *compose* multiple commands into a *composite* command.
This allows code to be kept much cleaner and simpler, as the individual
*component* commands may be written independently of the code that
combines them, greatly reducing the amount of complexity at any given
step of the process.

Most importantly, however, command groups *are themselves commands* -
they implement the ``Command`` interface. This allows command groups to
be `recursively
composed <https://en.wikipedia.org/wiki/Object_composition#Recursive_composition>`__
- that is, a command group may contain *other command groups* as
components.

Types of command groups
-----------------------

The command-based library supports four basic types of command groups:
``SequentialCommandGroup``, ``ParallelCommandGroup``,
``ParallelRaceGroup``, and ``ParallelDeadlineGroup``. Each of these
command groups combines multiple commands into a composite command -
however, they do so in different ways:

SequentialCommandGroup
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: java

   SequentialCommandGroup(Command... commands)

A ``SequentialCommandGroup`` runs a list of commands in sequence - the
first command will be executed, then the second, then the third, and so
on until the list finishes. The sequential group finishes after the last
command in the sequence finishes. It is therefore usually important to
ensure that each command in the sequence does actually finish (if a
given command does not finish, the next command will never start!).

ParallelCommandGroup
~~~~~~~~~~~~~~~~~~~~

::

   ParallelCommandGroup(Command... commands)

A ``ParallelCommandGroup`` runs a set of commands concurrently - all
commands will execute at the same time. The parallel group will end when
all commands have finished.

ParallelRaceGroup
~~~~~~~~~~~~~~~~~

::

   ParallelRaceGroup(Command... commands)

A ``ParallelRaceGroup`` is much like a ``ParallelCommandgroup``, in that
it runs a set of commands concurrently. However, the race group ends as
soon as any command in the group ends - all other commands are
interrupted at that point.

ParallelDeadlineGroup
~~~~~~~~~~~~~~~~~~~~~

::

   ParallelDeadlineGroup(Command deadline, Command... commands)

A ``ParallelDeadlineGroup`` also runs a set of commands concurrently.
However, the deadline group ends when a *specific* command (the
“deadline”) ends, interrupting all other commands in the group that are
still running at that point.

Creating command groups
-----------------------

Users have several options for creating command groups. One way -
similar to the previous incarnation of the command-based library - is to
subclass one of the command group classes. Consider the following from
the Hatch Bot example project (TODO: link):

.. code-block:: java

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

The ``addCommands`` method adds commands to the group, and is present in
all four types of command group.

Equivalently, however, command groups can be used without subclassing at
all: one can simply pass in the desired commands through the
constructor. Thus, the following two pieces of code are equivalent:

.. code-block:: java

   Command complexAuto = new ComplexAuto(m_robotDrive, m_hatchSubsystem);

.. code-block:: java

   Command complexAuto = new SequentialCommandGroup(
       new DriveDistance(kAutoDriveDistanceInches, kAutoDriveSpeed, m_robotDrive),
       new ReleaseHatch(m_hatchSubsystem),
       new DriveDistance(kAutoBackupDistanceInches, -kAutoDriveSpeed, m_robotDrive));

This is called an :ref:`inline <inlined-commands>` command
definition, and is very handy for circumstances where command groups are
not likely to be reused, and writing an entire class for them would be
wasteful.

Recursive composition of command groups
---------------------------------------

As mentioned earlier, command groups are `recursively
composeable <https://en.wikipedia.org/wiki/Object_composition#Recursive_composition>`__
- since command groups are themselves commands, they may be included as
components of other command groups. This is an extremely powerful
feature of command groups, and allows users to build very complex robot
actions from simple pieces. For example, consider the following code:

.. code-block:: java

   new SequentialCommandGroup(
       new DriveToGoal(m_drive),
       new ParallelCommandGroup(
           new RaiseElevator(m_elevator),
           new SetWristPosition(m_wrist)),
       new ScoreTube(m_wrist));

This creates a sequential command group that *contains* a parallel
command group. The resulting control flow looks something like this:

.. figure:: images/commandgroupchart.png
   :alt: command group with concurrency

   command group with concurrency

Notice how the recursive composition allows the embedding of a parallel
control structure within a sequential one. Notice also that this entire,
more-complex structure, could be again embedded in another structure.
Composition is an extremely powerful tool, and one that users should be
sure to use extensively.

Command groups and requirements
-------------------------------

As command groups are commands, they also must declare their
requirements. However, users are not required to specify requirements
manually for command groups - requirements are automatically inferred
from the commands included. As a rule, *command groups include the union
of all of the subsystems required by their component commands.* Thus,
the ``ComplexAuto`` shown previously will require both the drive
subsystem and the hatch subsystem of the robot.

Additionally, requirements are enforced within all three types of
parallel groups - a parallel group may not contain multiple commands
that require the same subsystem.

Some advanced users may find this overly-restrictive - for said users,
the library offers a ``ScheduleCommand`` class that can be used to
independently “branch off” from command groups to provide finer
granularity in requirement management (TODO: link).

Restrictions on command group components
----------------------------------------

Since command group components are run through their encapsulating
command groups, errors could occur if those same command instances were
independently scheduled at the same time as the group - the command
would be being run from multiple places at once, and thus could end up
with inconsistent internal state, causing unexpected and
hard-to-diagnose behavior.

For this reason, command instances that have been added to a command
group cannot be independently scheduled or added to a second command
group. Attempting to do so will throw an
``InvalidUseOfCommandException``.

Advanced users who wish to re-use a command instance and are *certain*
that it is safe to do so may bypass this restriction with the
``clearGroupedCommand()`` method in the ``CommandGroupBase`` class
(TODO: link).