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
        new StartEndCommand(() -> intake.set(1), () -> intake.set(0), intake).withTimeout(5),
        new WaitCommand(3),
        new StartEndCommand(() -> intake.set(1), () -> intake.set(0), intake).withTimeout(5)
    )

  .. code-tab:: c++

    // TODO

(Creating one ``StartEndCommand`` instance and putting it in a variable won't work here, since once an instance of a command is added to a command group it is effectively "owned" by that command group and cannot be used in any other context.)

Subclassing CommandBase
^^^^^^^^^^^^^^^^^^^^^^^

One possible solution to this problem is to create a new subclass of ``CommandBase`` that implements the necessary ``initialize`` and ``end`` routines.

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
            m_intake.setPercent(1);
        }

        @Override
        public void end(boolean interrupted) {
            m_intake.setPercent(0);
        }

        @Override
        public boolean isFinished() {
            return false;
        }
    }

  .. code-tab:: c++

    // TODO

This, however, is just as cumbersome. The only two lines that really matter in this entire file are the two calls to ``intake.setPercent``, yet there are over 20 lines of boilerplate code! Not to mention, doing this for a lot of robot actions quickly clutters up a robot project with dozens of small files. Nevertheless, this might feel more "natural," particularly for programmers who don't feel confident with Java and want to stick closely to an object-oriented model.

Factory Methods
^^^^^^^^^^^^^^^

A useful middle ground between these two extremes is using a `factory method <https://www.tutorialspoint.com/design_pattern/factory_pattern.htm>`__. A factory method is a method that, each time it is called, returns a new object according to some specification.

A command like the intake-running command is conceptually related to exactly one subsystem: the ``Intake``. As such, it makes sense to put a ``commandRun`` method as an instance method of the ``Intake`` class:

.. tabs::

  .. code-tab:: java

    public class Intake {
        // [code for motor controllers, configuration, etc.]
        // ...

        public Command commandRun() {
            return new StartEndCommand(() -> this.set(1), () -> this.set(0), this);
        }
    }

  .. code-tab:: c++

    // TODO

Notice how since we are in the ``Intake`` class, we no longer refer to ``intake``; instead, we use the ``this`` keyword to refer to the current instance.

.. warning:: To preserve encapsulation, avoid referring to ``private`` variables and methods of the ``Intake`` class from within the ``commandRun`` method, even though they are technically accessible. (For instance, the ``commandRun`` method should use the subsystem's public ``set`` method instead of interfacing directly with the motor controllers.)

Using this new factory method in command groups and button bindings is highly expressive:


.. tabs::

  .. code-tab:: java

    intakeButton.whileHeld(intake.commandRun());

    Command intakeAndShoot = intake.commandRun().alongWith(new RunShooter());

    Command autonomousCommand = new SequentialCommandGroup(
        intake.commandRun().withTimeout(5),
        new WaitCommand(3),
        intake.commandRun().withTimeout(5)
    );

  .. code-tab:: c++

    // TODO

Adding a parameter to the ``commandRun`` method to provide the exact percentage to run the intake is easy and allows for even more flexibility.

.. tabs::

  .. code-tab:: java

    public Command commandRun(double percent) {
        return new StartEndCommand(() -> this.set(percent), () -> this.set(0), this);
    }

  .. code-tab:: c++

    // TODO

For instance, this code creates a command group that runs the intake forwards for two seconds, waits for two seconds, and then runs the intake backwards for five seconds.

.. tabs::

  .. code-tab:: java

    Command intakeRunSequence = intake.commandRun(1).withTimeout(2)
        .andThen(new WaitCommand(2))
        .andThen(intake.commandRun(-1).withTimeout(5));

  .. code-tab:: c++

    // TODO

Command Groups
^^^^^^^^^^^^^^

Command groups have slightly different organizational concerns, but many of the same principles apply. Certain command groups are used in just one place, and so it's more sensible to define a command group entirely using inline decorators shortly before it is used (such as the ``intakeRunSequence`` command immediately above). However, command groups that are reused often, or large command groups such as autonomous routines, are still better when split into separate files. We'll consider command group definitions using the same example from the previous section:

.. tabs::

  .. code-tab:: java

    intake.commandRun(1).withTimeout(2)
        .andThen(new WaitCommand(2))
        .andThen(intake.commandRun(-1).withTimeout(5));

  .. code-tab:: c++

    // TODO

Subclassing
~~~~~~~~~~~

When splitting a command group into a separate file, subclassing the desired type is a natural solution. In this design, the command group is configured in the constructor.

.. tabs::

  .. code-tab:: java

    public class IntakeThenOuttake extends SequentialCommandGroup {
        public IntakeThenOuttake(Intake intake) {
            super(
                intake.commandRun(1).withTimeout(2),
                new WaitCommand(2),
                intake.commandRun(-1).withTimeout(5)
            );
        }
    }
  .. code-tab:: c++

    // TODO

This is relatively short and minimizes boilerplate. It is also comfortable to use in a purely object-oriented paradigm and may be more acceptable to novice programmers. However, it has some downsides. For one, it is not immediately clear exactly what type of command group this is from the constructor definition: it is better to define this in a more inline and expressive way, particularly when nested command groups start showing up. Additionally, it requires a new file for every single command group, even when the groups are conceptually related.

Static Factory Methods
~~~~~~~~~~~~~~~~~~~~~~

Instead, it's better to split command groups into *static* factory methods, and provide their subsystem dependencies via dependency injection.

.. tabs::

  .. code-tab:: java

    public class AutoRoutines {

        public static Command driveAndIntake(Drivetrain drivetrain, Intake intake) {
            return parallel(
                drivetrain.commandDrive(0.5,0.5),
                intake.commandRun(1)
            ).withTimeout(5);
        }

        public static Command intakeThenOuttake(Intake intake) {
            return sequence(
                intake.commandRun(1).withTimeout(2),
                new WaitCommand(3),
                intake.commandRun(-1).withTimeout(2)
            );
        }

    }
  .. code-tab:: c++

    // TODO

Using static factory methods, it's easy to have multiple smaller command groups contained within different files. Also, note the use of static methods to construct parallel and sequential command groups: this is equivalent to the ``andThen`` decorator, but is more expressive in some cases. Its use is a matter of personal preference.
