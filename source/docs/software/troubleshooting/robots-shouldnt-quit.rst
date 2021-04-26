Robots Should Not Quit, But Yours Did!
======================================

``Robots should not quit, but yours did!``

When your robot code hits an unexpected error, you will see this message show up in some console output (Driver Station or RioLog). You'll probably also notice your robot abruptly stop, or possibly never move. These unexpected errors are called *unhandled exceptions*.


When an unhandled exception occurs, it means that your code has one or more bugs which need to be fixed.

This article will explore some of the tools and techniques involved in finding and fixing those bugs.

What's a Stack Trace?
---------------------

The ``Robots should not quit`` message is a signal that a *stack trace* has been printed out. 

In C++ and Java, a `stack <https://en.wikipedia.org/wiki/Call_stack>`_ data structure is used to store information about which function or method is currently being executed.

A *stack trace* prints information about what was on this stack when the unhandled exception occurred.This points you to the lines of code which were running just before the problem happened. While it doesn't always point you to the *exact root cause* of your issue, it's usually the best place to start looking.

What's an "Unhandled Exception"?
--------------------------------

An unrecoverable error is any condition which arises where the processor cannot continue executing code. It almost always implies that, even though the code compiled and started running, it no longer makes sense for execution to continue.

In almost all cases, the root cause of an unhandled exception is code that isn't correctly implemented. It almost never implies that any hardware has malfunctioned.

So How Do I Fix My Issue?
-------------------------

Read the Stack Trace
^^^^^^^^^^^^^^^^^^^^

To start, search above the ``Robots should not quit`` for the stack trace. 

.. tabs::

   .. group-tab:: Java


      In Java, it should look something like this:

      .. code-block:: text

         Error at frc.robot.Robot.robotInit(Robot.java:24): Unhandled exception: java.lang.NullPointerException
                  at frc.robot.Robot.robotInit(Robot.java:24)
                  at edu.wpi.first.wpilibj.TimedRobot.startCompetition(TimedRobot.java:94)
                  at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:335)
                  at edu.wpi.first.wpilibj.RobotBase.lambda$startRobot$0(RobotBase.java:387)
                  at java.base/java.lang.Thread.run(Thread.java:834)

      There's a few important things to pick out of here:

      * There was an ``Error``

      * The error was due to an ``Unhandled exception``
         
      * The exception was a ``java.lang.NullPointerException``

      * The error happened while running line ``24`` inside of ``Robot.java``

         * ``robotInit`` was the name of the method executing when the error happened.

      * ``robotInit`` is a function in the ``frc.robot.Robot`` package (AKA, your team's code)

      * ``robotInit`` was called from a number of functions from the ``edu.wpi.first.wpilibj`` package (AKA, the WPILib libraries)

      The list of indented lines starting with the word ``at`` represent the state of the *stack* at the time the error happened. Each line represents one method, which was *called by* the method right below it. 

      For example, If the error happened deep inside your codebase, you might see more entries on the stack:

      .. code-block:: text

         Error at frc.robot.Robot.buggyMethod(TooManyBugs.java:1138): Unhandled exception: java.lang.NullPointerException
                  at frc.robot.Robot.buggyMethod(TooManyBugs.java:1138)
                  at frc.robot.Robot.barInit(Bar.java:21)
                  at frc.robot.Robot.fooInit(Foo.java:34)
                  at frc.robot.Robot.robotInit(Robot.java:24)
                  at edu.wpi.first.wpilibj.TimedRobot.startCompetition(TimedRobot.java:94)
                  at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:335)
                  at edu.wpi.first.wpilibj.RobotBase.lambda$startRobot$0(RobotBase.java:387)
                  at java.base/java.lang.Thread.run(Thread.java:834)

      In this case: ``robotInit`` called ``fooInit``, which in turn called ``barInit``, which in turn called ``buggyMethod``. Then, during the execution of ``buggyMethod``, the ``NullPointerException`` occurred.

   .. group-tab:: C++

      Coming Soon!


Perform Code Analysis
^^^^^^^^^^^^^^^^^^^^^

Once you've found the stack trace, and found the line of code which is triggering the unhandled exception, you can start the process of determining root cause.

Often, just looking at (or near) the problematic line of code will be fruitful. You may notice things you forgot, or lines which don't match an example you're referencing. 

.. note:: Developers who have lots of experience working with code will often have more luck looking at code than newer folks. That's ok, don't be discouraged! The experience will come with time.

A key strategy for analyzing code is to ask the following questions:

 * When was the last time the code "worked" (IE, didn't have this particular error)?
 * What has changed in the code between the last working version, and now?

Frequent testing and careful code changes help make this particular strategy more effective. 

Run the Single Step Debugger
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Sometimes, just looking at code isn't enough to spot the issue. The :ref:`single-step debugger <docs/software/vscode-overview/debugging-robot-program:Debugging a Robot Program>` is a great option in this case - it allows you to inspect the series of events *leading up to* the unhandled exception.

Search for More Information
^^^^^^^^^^^^^^^^^^^^^^^^^^^

`Google <https://google.com>`_ is a phenomenal resource for understanding the root cause of errors. Searches involving the programming language and the name of the exception will often yield good results on more explanations for what the error means, and how it often comes about.

Seeking Outside Help
^^^^^^^^^^^^^^^^^^^^

If all else fails, you can seek out advice and help from others (both in-person and online). When working with folks who aren't familiar with your codebase, it's very important to provide the following information:

 * Access to your source code, (EX: :ref:`on github.com <docs/software/basic-programming/git-getting-started:Git Version Control Introduction>`)
 * The **full text** of the error, including the full stack trace.

Common Examples & Patterns
--------------------------

There are a number of common issues which result in runtime exceptions. 

``Null``/``NULL``
^^^^^^^^^^^^^^^^^

Both C++ and Java have the concept of "null" - a reference which has not yet been initialized, and does not refer to anything meaningful.

Manipulating a "null" reference will produce a runtime error.

For example, consider the following code:

.. tabs::

   .. group-tab:: Java

      .. code-block:: Java
          :lineno-start: 19

            PWMSparkMax armMotorCtrl;

            @Override
            public void robotInit() {

                armMotorCtrl.setInverted(true);

            }

   .. group-tab:: C++

      .. code-block:: C++

         //TODO

When run, you'll see output that looks like this:

.. tabs::

   .. group-tab:: Java

      .. code-block:: text

        ********** Robot program starting **********
        Error at frc.robot.Robot.robotInit(Robot.java:24): Unhandled exception: java.lang.NullPointerException
                at frc.robot.Robot.robotInit(Robot.java:24)
                at edu.wpi.first.wpilibj.TimedRobot.startCompetition(TimedRobot.java:94)
                at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:335)
                at edu.wpi.first.wpilibj.RobotBase.lambda$startRobot$0(RobotBase.java:387)
                at java.base/java.lang.Thread.run(Thread.java:834)

        Warning at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:350): Robots should not quit, but yours did!
        Error at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:352): The startCompetition() method (or methods called by it) should have handled the exception above.

   .. group-tab:: C++

      .. code-block:: text

          TODO

Reading the stack trace, you can see that the issue happened inside of the ``robotInit()`` function, on line 24, and the exception involved "Null Pointer". 

By going to line 24, you can see there is only one thing which could be null - ``armMotorCtrl``. Looking further up, you can see that the ``armMotorCtrl`` object is declared, but never instantiated.

Alternatively, you can step through lines of code with the single step debugger, and stop when you hit line 24. Inspecting the ``armMotorCtrl`` object at that point would show that it is null. 

Fixing Null Object Issues
"""""""""""""""""""""""""

Generally, you will want to ensure each reference has been initialized before using it. In this case, there is a missing line of code to instantiate the ``armMotorCtrl`` before calling the ``setInverted()`` method. 

A functional implementation could look like this: 

.. tabs::

   .. group-tab:: Java

      .. code-block:: Java
          :lineno-start: 19

            PWMSparkMax armMotorCtrl;

            @Override
            public void robotInit() {
                
                armMotorCtrl = new PWMSparkMax(0);
                armMotorCtrl.setInverted(true);

            }

   .. group-tab:: C++

      .. code-block:: C++

         //TODO


Divide by Zero
^^^^^^^^^^^^^^

It is not generally possible to divide an integer by zero, and expect reasonable results. Most processors (including the RoboRIO) will cause an Unhandled Exception.

For example, consider the following code:

.. tabs::

   .. group-tab:: Java

      .. code-block:: Java
          :lineno-start: 18

            int armLengthRatio;
            int elbowToWrist_in = 39;
            int shoulderToElbow_in;

            @Override
            public void robotInit() {

               armLengthRatio = elbowToWrist_in / shoulderToElbow_in;

            }

   .. group-tab:: C++

      .. code-block:: C++

         //TODO

When run, you'll see output that looks like this:

.. tabs::

   .. group-tab:: Java

      .. code-block:: text

         ********** Robot program starting **********
         Error at frc.robot.Robot.robotInit(Robot.java:25): Unhandled exception: java.lang.ArithmeticException: / by zero
               at frc.robot.Robot.robotInit(Robot.java:25)
               at edu.wpi.first.wpilibj.TimedRobot.startCompetition(TimedRobot.java:94)
               at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:335)
               at edu.wpi.first.wpilibj.RobotBase.lambda$startRobot$0(RobotBase.java:387)
               at java.base/java.lang.Thread.run(Thread.java:834)

         Warning at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:350): Robots should not quit, but yours did!
         Error at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:352): The startCompetition() method (or methods called by it) should have handled the exception above.

   .. group-tab:: C++

      .. code-block:: text

          TODO

Looking at the stack trace, we can see a ``java.lang.ArithmeticException: / by zero`` exception has occurred on line 25. If you look at the two variables which are used on the right-hand side of the ``=`` operator, you might notice one of them has not been initialized. This means its value is, by default, zero. And, the zero-value variable is used in the denominator of a division operation. Hence, the divide by zero error happens.

Alternatively, by running the single-step debugger and stopping on line 25, you could inspect the value of all variables to discover ``shoulderToElbow_in`` has a value of ``0``.

Fixing Div/0 Issues
"""""""""""""""""""

Divide By Zero issues can be fixed in a number of ways. It's important to start by thinking about what a zero in the denominator of your calculation _means_. Is it plausible? Why did it happen in the particular case you saw?

Sometimes, you just need to use a different number other than 0. 

A functional implementation could look like this: 

.. tabs::

   .. group-tab:: Java

      .. code-block:: Java
          :lineno-start: 18

            int armLengthRatio;
            int elbowToWrist_in = 39;
            int shoulderToElbow_in = 3;

            @Override
            public void robotInit() {

               armLengthRatio = elbowToWrist_in / shoulderToElbow_in;

            }


   .. group-tab:: C++

      .. code-block:: C++

         //TODO

Alternatively, if zero *is* a valid value, adding ``if/else`` statements around the calculation can help you define alternate behavior to avoid making the processor perform a division by zero.

Finally, changing variable types to be ``float`` or ``double`` can help you get around the issue - floating-point numbers have special values like ``NaN`` to represent the results of a divide-by-zero operation. However, you may still have to handle this in code which consumes that calculation's value.


HAL Resource Already Allocated
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A very common FRC-specific error occurs when the code attempts to put two hardware-related on the same HAL resource (usually, roboRIO IO pin.)

For example, consider the following code:

.. tabs::

   .. group-tab:: Java

      .. code-block:: Java
          :lineno-start: 19

            PWMSparkMax leftFrontDTMotor;
            PWMSparkMax leftRearDTMotor;

            @Override
            public void robotInit() {

               leftFrontDTMotor = new PWMSparkMax(0);
               leftRearDTMotor = new PWMSparkMax(0);

            }

   .. group-tab:: C++

      .. code-block:: C++

         //TODO

When run, you'll see output that looks like this:

.. tabs::

   .. group-tab:: Java

      .. code-block:: text

         ********** Robot program starting **********
         Error at frc.robot.Robot.robotInit(Robot.java:26): Unhandled exception: edu.wpi.first.hal.util.UncleanStatusException:  Code: -1029. HAL: Resource already allocated
               at edu.wpi.first.hal.PWMJNI.initializePWMPort(Native Method)
               at edu.wpi.first.wpilibj.PWM.<init>(PWM.java:51)
               at edu.wpi.first.wpilibj.PWMSpeedController.<init>(PWMSpeedController.java:20)
               at edu.wpi.first.wpilibj.PWMSparkMax.<init>(PWMSparkMax.java:31)
               at frc.robot.Robot.robotInit(Robot.java:26)
               at edu.wpi.first.wpilibj.TimedRobot.startCompetition(TimedRobot.java:94)
               at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:335)
               at edu.wpi.first.wpilibj.RobotBase.startRobot(RobotBase.java:407)
               at frc.robot.Main.main(Main.java:23)

         Warning at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:350): Robots should not quit, but yours did!
         Error at edu.wpi.first.wpilibj.RobotBase.runRobot(RobotBase.java:352): The startCompetition() method (or methods called by it) should have handled the exception above.

   .. group-tab:: C++

      .. code-block:: text

          TODO

This stack trace shows that a``edu.wpi.first.hal.util.UncleanStatusException`` has occurred. It also gives the helpful message: ``HAL: Resource already allocated``.

Looking at our stack trace, we see that the error *actually* happened deep within some WPILib content. However, we should start by looking in our own code. Halfway through the stack trace, you can find a reference to the last line of the team's robot code that called into WPILib: ``Robot.java:26``.

Taking a peek at the code, we see line 26 is where the second motor controller is declared. We can also note that *both* motor controllers are assigned to PWM output ``0``. This doesn't make logical sense, and isn't physically possible. Therefor, the WPILib libraries purposefully generate a custom error message and exception to alert the software developers of a non-achievable hardware configuration.

Thankfully, ``HAL: Resource already allocated`` are some of the most straightforward errors to fix. Just spend a bit of time looking at the electrical wiring on the robot, and compare that to what's in code.

In the example, the left motor controllers are plugged into PWM ports ``0`` and ``1``. Therefore, corrected code would look like this:

.. tabs::

   .. group-tab:: Java

      .. code-block:: Java
          :lineno-start: 19

            PWMSparkMax leftFrontDTMotor;
            PWMSparkMax leftRearDTMotor;

            @Override
            public void robotInit() {

               leftFrontDTMotor = new PWMSparkMax(0);
               leftRearDTMotor = new PWMSparkMax(1);

            }

   .. group-tab:: C++

      .. code-block:: C++

         //TODO
