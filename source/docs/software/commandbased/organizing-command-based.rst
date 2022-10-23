Organizing Command-Based Robot Projects
=======================================

As robot code becomes more complicated, navigating, understanding, and maintaining the code takes up more and more time and energy. Making changes to the code often becomes more difficult, sometimes for reasons that have very little to do with the actual complexity of the underlying logic. For a simplified example: putting the logic for many unrelated robot functions into a single 1000-line file makes it difficult to find a specific piece of code within that file, particularly under stress at a competition. But spreading out closely related logic across dozens of tiny files is often just as difficult to navigate.

This is not a problem unique to FRC, and in fact, good organization only becomes more and more critical as software projects become bigger and bigger. The "best" organization system is a perennial topic of debate, much like the "best" programming language, but in the end, the choice (in both cases) comes down to the specific task at hand and the programmer (or programmers) implementing said task. Even in the relatively small space of FRC robot programming, there is no right answer. The best choice for a given team will depend on the nature of the specific robot code, team structure, and pure personal preference.

This article discusses various facets of command-based robot program design that advanced FRC programmers may want to be aware of when writing code. It is not a prescriptive tutorial, though it presents some recommended best practices. If this level of choice seems daunting, however, many teams have been highly successful while sticking closely to WPILib's example code and guidelines. However, this discussion may be of interest to intermediate and advanced programmers who want to make their code not only effective, but flexible, easily changeable, and sometimes even beautiful.

Why Care About Organization?
----------------------------
Good code organization will rarely make or break a team's competitive ability—but it does mean easier debugging, faster modifications, nicer-looking code, and happier programmers. While it's impossible to define "good" organization by way of what the code looks like from the inside, it's easier to define in terms of what the robot's software looks like from the outside.

What Good Organization Looks Like
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When code is well-designed and well-organized, the code's internal structure is intuitive and easily comprehensible. Cumbersome boilerplate is minimized, meaning that new robot functionality can often be added with just a few lines of code. When a constant value (such as the speed of the robot's intake) needs to be changed, it only needs to change in one place. If multiple programmers are working together, they can easily understand each others' work. Bugs are rare, since it is difficult to accidentally introduce unintended behavior (such as creating a command that does not require necessary subsystems). Implementing more advanced functions like unit tests is easier, since the code is abstracted away from the physical hardware. Programmers are happy (most of the time).

What Bad Organization Looks Like
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Poorly organized code often has internal structure that makes little to no sense, even to whoever wrote it. When functionality has to be added or changed, it often breaks unrelated parts of the robot: adding automatic shooter control might introduce a bug in the climbing sequence for unclear reasons. Alternatively, the organizational framework might be so strict that it's impossible to implement necessary behavior, requiring nasty hacks or workarounds. Many lines of boilerplate code are needed for simple robot logic. Constants are scattered across the codebase, and changing basic behavior often requires making the same change to many different files. Collaboration among multiple programmers is difficult or impossible.

Defining Commands
-----------------

In larger robot codebases, multiple copies of the same command need to be used in many different places. For instance, a command that runs a robot's intake might be used in teleop, bound to a certain button; as part of a complicated command group for an autonomous routine; and as part of a self-test sequence.

As an example, let's look at some ways to define a simple command that simply runs the robot's intake forward at full power until canceled.

Inline Commands
^^^^^^^^^^^^^^^

The easiest and most expressive way to do this is with a ``StartEndCommand``:

.. tabs::

  .. code-tab:: java

    Command runIntake = new StartEndCommand(() -> intake.set(1), () -> intake.set(0), intake);

  .. code-tab:: c++

    // TODO

This is sufficient for commands that are only used once. However, for a command like this that might get used in many different autonomous routines and button bindings, inline commands everywhere means a lot of repetitive code:

.. tabs::

  .. code-tab:: java

    // RobotContainer.java
    intakeButton.whileHeld(new StartEndCommand(() -> intake.set(1), () -> intake.set(0), intake));


    Command intakeAndShoot = new StartEndCommand(() -> intake.set(1), () -> intake.set(0), intake)
        .alongWith(new RunShooter(shooter));

    Command autonomousCommand = new ParallelCommandGroup(
        new StartEndCommand(() -> intake.set(1.0), () -> intake.set(0.0), intake).withTimeout(5.0),
        new WaitCommand(3.0),
        new StartEndCommand(() -> intake.set(1.0), () -> intake.set(0), intake).withTimeout(5.0)
    )

  .. code-tab:: c++

    // TODO

Creating one ``StartEndCommand`` instance and putting it in a variable won't work here, since once an instance of a command is added to a command group it is effectively "owned" by that command group and cannot be used in any other context.

Instance Command Factory Methods
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

One way to solve this quandary is using the "factory method" design pattern: a function that returns a new object every invocation, according to some specification. Using command composition and :ref:`decorators<docs/software/commandbased/convenience-features:Command Decorator Methods>`, a factory method can construct a complex command object with merely a few lines of code.

For example, a command like the intake-running command is conceptually related to exactly one subsystem: the ``Intake``. As such, it makes sense to put a ``runIntakeCommand`` method as an instance method of the ``Intake`` class:

.. note:: In this document we will name factory methods as ``lowerCamelCaseCommand``, but teams may decide on other conventions.

.. tabs::

  .. code-tab:: java

    public class Intake {
        // [code for motor controllers, configuration, etc.]
        // ...

        public Command runIntakeCommand() {
            return new StartEndCommand(() -> this.set(1.0), () -> this.set(0.0), this);
        }
    }

  .. code-tab:: c++

    // TODO

Notice how since we are in the ``Intake`` class, we no longer refer to ``intake``; instead, we use the ``this`` keyword to refer to the current instance.

Since we are inside the ``Intake`` class, technically we can access ``private`` variables and methods directly from within the ``runIntakeCommand`` method, thus not needing intermediary methods. (For example, the ``runIntakeCommand`` method can directly interface with the motor controller objects instead of calling ``set()``.) On the other hand, these intermediary methods can reduce code duplication and increase encaspulation. Like many other choices outlined in this document, this tradeoff is a matter of personal preference on a case-by-case basis.

Using this new factory method in command groups and button bindings is highly expressive:

.. tabs::

  .. code-tab:: java

    intakeButton.whileHeld(intake.runIntakeCommand());

    Command intakeAndShoot = intake.runIntakeCommand().alongWith(new RunShooter());

    Command autonomousCommand = new SequentialCommandGroup(
        intake.runIntakeCommand().withTimeout(5.0),
        new WaitCommand(3.0),
        intake.runIntakeCommand().withTimeout(5.0)
    );

  .. code-tab:: c++

    // TODO

Adding a parameter to the ``runIntakeCommand`` method to provide the exact percentage to run the intake is easy and allows for even more flexibility.

.. tabs::

  .. code-tab:: java

    public Command runIntakeCommand(double percent) {
        return new StartEndCommand(() -> this.set(percent), () -> this.set(0.0), this);
    }

  .. code-tab:: c++

    // TODO

For instance, this code creates a command group that runs the intake forwards for two seconds, waits for two seconds, and then runs the intake backwards for five seconds.

.. tabs::

  .. code-tab:: java

    Command intakeRunSequence = intake.runIntakeCommand(1.0).withTimeout(2.0)
        .andThen(new WaitCommand(2.0))
        .andThen(intake.runIntakeCommand(-1.0).withTimeout(5.0));

  .. code-tab:: c++

    // TODO


This approach is recommended for commands that are conceptually related to only a single subsystem, and is very concise. However, it doesn't fare well with commands related to more than one subsystem: passing in other subsystem objects is unintuitive and can cause race conditions and circular dependencies, and thus should be avoided. Therefore, this approach is best suited for single-subsystem commands, and should be used only for those cases.


Subclassing CommandBase
^^^^^^^^^^^^^^^^^^^^^^^

Another possible way to de-duplicate code when constructing commands is creating a new subclass of ``CommandBase`` that implements the necessary ``initialize`` and ``end`` methods.

.. tabs::

  .. code-tab:: java

    public class RunIntakeCommand extends CommandBase {
        private Intake m_intake;

        public RunIntakeCommand(Intake intake) {
            this.m_intake = intake;
            addRequirements(intake);
        }

        @Override
        public void initialize() {
            m_intake.set(1.0);
        }

        @Override
        public void end(boolean interrupted) {
            m_intake.set(0.0);
        }

        // execute() defaults to do nothing
        // isFinished() defaults to return false
    }

  .. code-tab:: c++

    // TODO

This, however, is just as cumbersome as the original repetitive code, if not more verbose. The only two lines that really matter in this entire file are the two calls to ``intake.set()``, yet there are over 20 lines of boilerplate code! Not to mention, doing this for a lot of robot actions quickly clutters up a robot project with dozens of small files. Nevertheless, this might feel more "natural," particularly for programmers who prefer to stick closely to an object-oriented model.

This approach should be used for commands with internal state (not subsystem state!), as the class can have fields to manage said state. It may also be more intuitive to write commands with complex logic as classes, especially for those less experienced with command composition. As the command is detached from any specific subsystem class and the required subsystem objects are injected through the constructor, this approach deals well with commands involving multiple subsystems.


Static Command Factories
^^^^^^^^^^^^^^^^^^^^^^^^

Similar to the instance factory methods presented above, it's possible to define command factory methods as static members of a separate class (or as free functions in C++). For example, the ``runIntakeCommand`` factory can be written as follows:

.. tabs::

  .. code-tab:: java

    public class IntakeCommands {
        public static Command runIntakeCommand(double percent, Intake intake) {
            return new StartEndCommand(() -> intake.set(percent), () -> intake.set(0.0), intake);
        }
    }

  .. code-tab:: c++

    // TODO

The disadvantage of this is more cumbersome usage code and needing intermediary methods that can be redudant if the factory is inside the subsystem class. Below is what the intake-then-outtake sequence looks like using static factory methods. Notice how ``intake.runIntakeCommand(1.0)`` has been replaced with ``IntakeCommands.runIntakeCommand(1.0, intake)``:

.. tabs::

  .. code-tab:: java

    Command intakeRunSequence = IntakeCommands.runIntakeCommand(1.0, intake).withTimeout(2.0)
        .andThen(new WaitCommand(2.0))
        .andThen(IntakeCommands.runIntakeCommand(1.0, intake).withTimeout(5.0));

  .. code-tab:: c++

    // TODO

While static factories are manageable for single-subsystem commands, they excel at multi-subsystem commands -- particularly command groups. With single-subsystem commands defined as instance factory methods, static factories can look like this:

.. tabs::

  .. code-tab:: java

    public class AutoRoutines {

        public static Command driveAndIntake(Drivetrain drivetrain, Intake intake) {
            return parallel(
                drivetrain.commandDrive(0.5,0.5),
                intake.runIntakeCommand(1.0)
            ).withTimeout(5.0);
        }

        public static Command intakeThenOuttake(Intake intake) {
            return sequence(
                intake.runIntakeCommand(1.0).withTimeout(2.0),
                new WaitCommand(3.0),
                intake.runIntakeCommand(-1).withTimeout(2.0)
            );
        }

    }
  .. code-tab:: c++

    // TODO

Also, note the use of static factories to construct sequential and parallel command groups: this is equivalent to the ``andThen`` and ``alongWith`` decorators, but can be more expressive in some cases. Their use is a matter of personal preference.


Subclassing Command Groups
^^^^^^^^^^^^^^^^^^^^^^^^^^

Alternatively to static factory methods, command groups can also be written as a constructor-only subclass of the most exterior group type. For example, the intake-then-outtake sequence (with single-subsystem commands defined as instance factory methods) can look like this:

.. tabs::

  .. code-tab:: java

    public class IntakeThenOuttake extends SequentialCommandGroup {
        public IntakeThenOuttake(Intake intake) {
            super(
                intake.runIntakeCommand(1.0).withTimeout(2.0),
                new WaitCommand(2.0),
                intake.runIntakeCommand(-1).withTimeout(5.0)
            );
        }
    }
  .. code-tab:: c++

    // TODO

This is relatively short and minimizes boilerplate. It is also comfortable to use in a purely object-oriented paradigm and may be more acceptable to novice programmers. However, it has some downsides. For one, it is not immediately clear exactly what type of command group this is from the constructor definition: it is better to define this in a more inline and expressive way, particularly when nested command groups start showing up. Additionally, it requires a new file for every single command group, even when the groups are conceptually related.


Summary
^^^^^^^

.. list-table::
   :header-rows: 1

   * - Approach
     - Primary Use Case
     - Single-subsystem Commands
     - Multi-subsystem Commands
     - Stateful Commands
     - Complex Logic Commands
   * - Instance Factory Methods
     - Single-subsystem commands
     - Excels at them
     - No
     - No, unless the state can be moved to the subsystem.
     - Yes
   * - Subclassing CommandBase
     - Stateful commands
     - Very verbose
     - Relatively verbose
     - Excels at them
     - Yes; may be more natural than other approaches
   * - Static Factory Methods
     - Multi-subsystem commands
     - Yes
     - Yes
     - No
     - Yes
   * - Subclassing Command Groups
     - Multi-subsystem command groups
     - Yes
     - Yes
     - No
     - Yes

