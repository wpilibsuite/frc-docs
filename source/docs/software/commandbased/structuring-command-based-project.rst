.. _structuring:

Structuring a command-based robot project
=========================================

While users are free to use the command-based libraries however they
like (and advanced users are encouraged to do so), new users may want
some guidance on how to structure a basic command-based robot project.

A standard template for a command-based robot project is included in the
WPILib examples repository (TODO: link). This section will walk users
through the structure of this template.

The root package generally will contain four classes:

``Main.java``, which is the main robot application. New users *should
not* touch this class. ``Robot.java``, which is responsible for the main
control flow of the robot code. ``RobotContainer.java``, which holds
robot subsystems and commands, and is where most of the declarative
robot setup (e.g. button bindings) is performed. ``Constants.java``,
which holds globally-accessible constants to be used throughout the
robot.

The root directory will also contain two sub-packages: ``Subsystems``
contains all user-defined subsystem classes. ``Commands`` contains all
user-defined command classes.

Robot.java
----------

As ``Robot.java`` is responsible for the program’s control flow, and
command-based is an imperative paradigm designed to minimize the amount
of attention the user has to pay to explicit program control flow, the
``Robot.java`` class of a command-based project should be mostly empty.
However, there are a few important things that must be included (TODO:
link to class on github):

.. code-block:: java

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

Firstly, notice that an instance of ``RobotContainer`` is constructed
during the ``robotInit()`` method - this is important, as most of the
declarative robot setup will be called from the ``RobotContainer``
constructor.

.. code-block:: java

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

Secondly, the inclusion of the ``CommandScheduler.getInstance().run()``
call in the ``robotPeriodic()`` method is essential; without this call,
the scheduler will not execute any scheduled commands. Since
``TimedRobot`` runs with a default main loop frequency of 50Hz, this is
the frequency with which periodic command and subsystem methods will be
called. It is not recommended for new users to call this method from
anywhere else in their code.

.. code-block:: java

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

Thirdly, notice that the ``autonomousInit()`` method schedules an
autonomous command returned by the ``RobotContainer`` instance. The
logic for selecting which autonomous command to run can be handled
inside of ``RobotContainer``.

.. code-block:: java

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

Finally, notice that the ``teleopInit()`` method cancels any
still-running autonomous commands. This is generally good practice.

Advanced users are free to add additional code to the various init and
periodic methods as they see fit; however, it should be noted that
including large amounts of imperative robot code in ``Robot.java`` is
contrary to the declarative design philosophy of the command-based
paradigm, and can result in confusingly-structured/disorganized code.

RobotContainer.java
-------------------

This class is where most of the setup for your command-based robot will
take place. In this class, you will define your robot’s subsystems and
commands, bind those commands to triggering events (such as buttons),
and specify which command you will run in your autonomous routine. There
are a few aspects of this class new users may want explanations for
(TODO: link to class on github):

.. code-block:: java

     // An example robot subsystem.  Keeping subsystem fields private prevents you from accidentally
     // interacting with them from elsewhere in the code, which can cause unpredictable and
     // hard-to-diagnose behavior.
     private ExampleSubsystem exampleSubsystem = new ExampleSubsystem();

Notice that subsystems are declared as private fields in
``RobotContainer``. This is in stark contrast to the previous
incarnation of the command-based framework, but is much more-aligned
with agreed-upon object-oriented best-practices. If subsystems are
declared as global variables, it allows the user to access them from
anywhere in the code. While this can make certain things easier (for
example, there would be no need to pass subsystems to commands in order
for those commands to access them), it makes the control flow of the
program much harder to keep track of as it is not immediately obvious
which parts of the code can change or be changed by which other parts of
the code. This also circumvents the ability of the resource-management
system to do its job, as ease-of-access makes it easy for users to
accidentally make conflicting calls to subsystem methods outside of the
resource-managed commands.

.. code-block:: java

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

As mentioned before, the ``RobotContainer()`` constructor is where most
of the declarative setup for the robot should take place, including
button bindings, configuring autonomous selectors, etc. If the
constructor gets too “busy,” users are encouraged to migrate code into
separate subroutines (such as the ``configureButtonBindings()`` method
included by default) which are called from the constructor. Note that
one of the example autonomous commands has been
`inlined <#inline-command-definitions>`__ for convenience. Note also
that, since subsystems are declared as private fields, they must be
explicitly passed to commands.

.. code-block:: java

   /**
      * Use this to pass the autonomous command to the main {@link Robot} class.
      *
      * @return the command to run in autonomous
      */
     public Command getAutonomousCommand() {
       return m_chooser.getSelected();
     }

Finally, the ``getAutonomousCommand()`` method provides a convenient way
for users to send their selected autonomous command to the main
``Robot.java`` class (which needs access to it to schedule it when
autonomous starts).

Constants.java
--------------

The ``Constants.java`` class is where globally-accessible robot
constants (such as speeds, unit conversion factors, PID gains, and
sensor/motor ports) can be stored. It is recommended that users separate
these constants into individual inner clases corresponding to subsystems
or robot modes, to keep variable names shorter. All constants declared
in ``Constants.java`` should be declared as ``public static final`` so
that they are globally accessible and cannot be changed (TODO: link to
the class on github).

For more illustrative examples of what a ``constants`` class should look
like in practice, see the various example projects (TODO: link).

It is recommended that the constants be used from other classes by
statically importing the necessary inner class. An ``import static``
statement imports the static namespace of a class into the class in
which you are working, so that any ``static`` constants can be
referenced directly as if they had been defined in that class, e.g.:

.. code-block:: java

   import static edu.wpi.first.wpilibj.templates.commandbased.Constants.OIConstants.*;

This can be seen in many of the examples used in this ScreenSteps guide,
as well as in the command-based example projects.

.. _subsystems-1:

Subsystems
----------

User-defined subsystems should go in this package.

.. _commands-1:

Commands
--------

User-defined commands should go in this package.