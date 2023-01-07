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

    Command runIntake = Commands.startEnd(() -> intake.set(1), () -> intake.set(0), intake);

  .. code-tab:: c++

    frc2::CommandPtr runIntake = frc2::cmd::StartEnd([&intake] { intake.Set(1.0); }, [&intake] { intake.Set(0); }, {&intake});

This is sufficient for commands that are only used once. However, for a command like this that might get used in many different autonomous routines and button bindings, inline commands everywhere means a lot of repetitive code:

.. tabs::

  .. code-tab:: java

    // RobotContainer.java
    intakeButton.whileTrue(Commands.startEnd(() -> intake.set(1.0), () -> intake.set(0), intake));

    Command intakeAndShoot = Commands.startEnd(() -> intake.set(1.0), () -> intake.set(0), intake)
        .alongWith(new RunShooter(shooter));

    Command autonomousCommand = Commands.sequence(
        Commands.startEnd(() -> intake.set(1.0), () -> intake.set(0.0), intake).withTimeout(5.0),
        Commands.waitSeconds(3.0),
        Commands.startEnd(() -> intake.set(1.0), () -> intake.set(0.0), intake).withTimeout(5.0)
    );

  .. code-tab:: c++

    intakeButton.WhileTrue(frc2::cmd::StartEnd([&intake] { intake.Set(1.0); }, [&intake] { intake.Set(0); }, {&intake}));

    frc2::CommandPtr intakeAndShoot = frc2::cmd::StartEnd([&intake] { intake.Set(1.0); }, [&intake] { intake.Set(0); }, {&intake})
        .AlongWith(RunShooter(&shooter).ToPtr());

    frc2::CommandPtr autonomousCommand = frc2::cmd::Sequence(
      frc2::cmd::StartEnd([&intake] { intake.Set(1.0); }, [&intake] { intake.Set(0); }, {&intake}).WithTimeout(5.0_s),
      frc2::cmd::Wait(3.0_s),
      frc2::cmd::StartEnd([&intake] { intake.Set(1.0); }, [&intake] { intake.Set(0); }, {&intake}).WithTimeout(5.0_s)
    );

Creating one ``StartEndCommand`` instance and putting it in a variable won't work here, since once an instance of a command is added to a command group it is effectively "owned" by that command group and cannot be used in any other context.

Instance Command Factory Methods
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

One way to solve this quandary is using the "factory method" design pattern: a function that returns a new object every invocation, according to some specification. Using :ref:`command composition <docs/software/commandbased/command-compositions:Command Compositions>`, a factory method can construct a complex command object with merely a few lines of code.

For example, a command like the intake-running command is conceptually related to exactly one subsystem: the ``Intake``. As such, it makes sense to put a ``runIntakeCommand`` method as an instance method of the ``Intake`` class:

.. note:: In this document we will name factory methods as ``lowerCamelCaseCommand``, but teams may decide on other conventions.  In general, it is recommended to end the method name with ``Command`` if it might otherwise be confused with an ordinary method (e.g. ``intake.run`` might be the name of a method that simply turns on the intake).

.. tabs::

  .. code-tab:: java

    public class Intake extends SubsystemBase {
        // [code for motor controllers, configuration, etc.]
        // ...

        public Command runIntakeCommand() {
          // implicitly requires `this`
          return this.startEnd(() -> this.set(1.0), () -> this.set(0.0));
        }
    }

  .. code-tab:: c++

    frc2::CommandPtr Intake::RunIntakeCommand() {
      // implicitly requires `this`
      return this->StartEnd([this] { this->Set(1.0); }, [this] { this->Set(0); });
    }

Notice how since we are in the ``Intake`` class, we no longer refer to ``intake``; instead, we use the ``this`` keyword to refer to the current instance.

Since we are inside the ``Intake`` class, technically we can access ``private`` variables and methods directly from within the ``runIntakeCommand`` method, thus not needing intermediary methods. (For example, the ``runIntakeCommand`` method can directly interface with the motor controller objects instead of calling ``set()``.) On the other hand, these intermediary methods can reduce code duplication and increase encaspulation. Like many other choices outlined in this document, this tradeoff is a matter of personal preference on a case-by-case basis.

Using this new factory method in command groups and button bindings is highly expressive:

.. tabs::

  .. code-tab:: java

    intakeButton.whileTrue(intake.runIntakeCommand());

    Command intakeAndShoot = intake.runIntakeCommand().alongWith(new RunShooter(shooter));

    Command autonomousCommand = Commands.sequence(
        intake.runIntakeCommand().withTimeout(5.0),
        Commands.waitSeconds(3.0),
        intake.runIntakeCommand().withTimeout(5.0)
    );

  .. code-tab:: c++

    intakeButton.WhileTrue(intake.RunIntakeCommand());

    frc2::CommandPtr intakeAndShoot = intake.RunIntakeCommand().AlongWith(RunShooter(&shooter).ToPtr());

    frc2::CommandPtr autonomousCommand = frc2::cmd::Sequence(
      intake.RunIntakeCommand().WithTimeout(5.0_s),
      frc2::cmd::Wait(3.0_s),
      intake.RunIntakeCommand().WithTimeout(5.0_s)
    );

Adding a parameter to the ``runIntakeCommand`` method to provide the exact percentage to run the intake is easy and allows for even more flexibility.

.. tabs::

  .. code-tab:: java

    public Command runIntakeCommand(double percent) {
        return new StartEndCommand(() -> this.set(percent), () -> this.set(0.0), this);
    }

  .. code-tab:: c++

    frc2::CommandPtr Intake::RunIntakeCommand() {
      // implicitly requires `this`
      return this->StartEnd([this, percent] { this->Set(percent); }, [this] { this->Set(0); });
    }

For instance, this code creates a command group that runs the intake forwards for two seconds, waits for two seconds, and then runs the intake backwards for five seconds.

.. tabs::

  .. code-tab:: java

    Command intakeRunSequence = intake.runIntakeCommand(1.0).withTimeout(2.0)
        .andThen(Commands.waitSeconds(2.0))
        .andThen(intake.runIntakeCommand(-1.0).withTimeout(5.0));

  .. code-tab:: c++

    frc2::CommandPtr intakeRunSequence = intake.RunIntakeCommand(1.0).WithTimeout(2.0_s)
        .AndThen(frc2::cmd::Wait(2.0_s))
        .AndThen(intake.RunIntakeCommand(-1.0).WithTimeout(5.0_s));


This approach is recommended for commands that are conceptually related to only a single subsystem, and is very concise. However, it doesn't fare well with commands related to more than one subsystem: passing in other subsystem objects is unintuitive and can cause race conditions and circular dependencies, and thus should be avoided. Therefore, this approach is best suited for single-subsystem commands, and should be used only for those cases.

Static Command Factories
~~~~~~~~~~~~~~~~~~~~~~~~

Instance factory methods work great for single-subsystem commands.  However, complicated robot actions (like the ones often required during the autonomous period) typically need to coordinate multiple subsystems at once.  When we want to define an inline command that uses multiple subsystems, it doesn't make sense for the command factory to live in any single one of those subsystems.  Instead, it can be cleaner to define the command factory methods statically in some external class:

.. note:: The ``sequence`` and ``parallel`` static factories construct sequential and parallel command groups: this is equivalent to the ``andThen`` and ``alongWith`` decorators, but can be more readable. Their use is a matter of personal preference.

.. tabs::

  .. code-tab:: java

    public class AutoRoutines {

        public static Command driveAndIntake(Drivetrain drivetrain, Intake intake) {
            return Commands.sequence(
                Commands.parallel(
                    drivetrain.driveCommand(0.5, 0.5),
                    intake.runIntakeCommand(1.0)
                ).withTimeout(5.0),
                Commands.parallel(
                  drivetrain.stopCommand();
                  intake.stopCommand();
                )
            );
        }
    }

  .. code-tab:: c++

    // TODO

If we want to avoid the verbosity of adding required subsystems as parameters to our factory methods, we can instead construct an instance of our `AutoRoutines` class and inject our subsystems through the constructor:

.. tabs::

  .. code-tab:: java

    public class AutoRoutines {

        private Drivetrain drivetrain;

        private Intake intake;

        public AutoRoutines(Drivetrain drivetrain, Intake intake) {
          this.drivetrain = drivetrain;
          this.intake = intake;
        }

        public Command driveAndIntake() {
            return Commands.sequence(
                Commands.parallel(
                    drivetrain.driveCommand(0.5, 0.5),
                    intake.runIntakeCommand(1.0)
                ).withTimeout(5.0),
                Commands.parallel(
                  drivetrain.stopCommand();
                  intake.stopCommand();
                )
            );
        }
    }

  .. code-tab:: c++

    // TODO

Capturing State in Inline Commands
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Inline commands are extremely concise and expressive, but do not offer explicit support for commands that have their own internal state (such as a drivetrain trajectory following command, which may encapsulate an entire controller).  This is often accomplished by instead writing a Command class, which will be covered later in this article.

However, it is still possible to ergonomically write a stateful command composition using inline syntax, so long as we are working within a factory method.  To do so, we declare the state as a method local and "capture" it in our inline definition.  For example, consider the following instance command factory to turn a drivetrain to a specific angle with a PID controller:

.. note:: The ``Subsystem.run`` and ``Subsystem.runOnce`` factory methods sugar the creation of a ``RunCommand`` and an ``InstantCommand`` requiring ``this`` subsystem.

.. tabs::

  .. code-tab:: java

    public Command turnToAngle(double targetDegrees) {
        // Create a controller for the inline command to capture
        PIDController controller = new PIDController(Constants.kTurnToAngleP, 0, 0);
        // We can do whatever configuration we want on the created state before returning from the factory
        controller.setPositionTolerance(Constants.kTurnToAngleTolerance);

        // Try to turn at a rate proportional to the heading error until we're at the setpoint, then stop
        return run(() -> arcadeDrive(0,-controller.calculate(gyro.getHeading(), targetDegrees)))
            .until(controller::atSetpoint)
            .andThen(runOnce(() -> arcadeDrive(0, 0)));
    }

  .. code-tab:: c++

    // TODO

This pattern works very well in Java so long as the captured state is "effectively final" - i.e., it is never reassigned.  This means that we cannot directly define and capture primitive types (e.g. `int`, `double`, `boolean`) - to circumvent this, we need to wrap any state primitives in a mutable container type (the same way `PIDController` wraps its internal `kP`, `kI`, and `kD` values).

Writing Command Classes
^^^^^^^^^^^^^^^^^^^^^^^

Another possible way to define reusable commands is to write a class that represents the command.  This is typically done by subclassing either ``CommandBase`` or one of the ``CommandGroup`` classes.

Subclassing CommandBase
~~~~~~~~~~~~~~~~~~~~~~~

Returning to our simple intake command from earlier, we could do this by creating a new subclass of ``CommandBase`` that implements the necessary ``initialize`` and ``end`` methods.

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


Subclassing Command Groups
~~~~~~~~~~~~~~~~~~~~~~~~~~

If we wish to write composite commands as their own classes, we may write a constructor-only subclass of the most exterior group type. For example, an intake-then-outtake sequence (with single-subsystem commands defined as instance factory methods) can look like this:

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

As with factory methods, state can be defined and captured within the command group subclass constructor, if necessary.

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
     - Yes, but must obey capture rules
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
     - Yes, but must obey capture rules
     - Yes
   * - Subclassing Command Groups
     - Multi-subsystem command groups
     - Yes
     - Yes
     - Yes, but must obey capture rules
     - Yes

