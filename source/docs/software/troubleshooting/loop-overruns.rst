Mitigating Loop Overruns
========================

A *loop overrun* is a common occurrence when teams scale up their codebases. It occurs when a piece of code takes too long to execute, "starving" other code of the time it needs to run.

Real-Time System
----------------

Our robots are *real-time systems*. Code must execute in a way that the time between reading inputs, performing calculations, and assigning outputs is bounded and deterministic. In doing so, the code establishes the relationship of how outputs change in response to inputs.

When code runs too slowly, that input-output relationship is no longer maintained, causing complex and unexpected behaviors.

Common Symptoms
---------------

One key symptom is seeing a message like this frequently in RIOLog:

.. code-block:: text
    
        Warning  1  Loop time of 0.02s overrun
            edu.wpi.first.wpilibj.IterativeRobotBase.printLoopOverrunMessage(IterativeRobotBase.java:359) 
        Warning at edu.wpi.first.wpilibj.IterativeRobotBase.printLoopOverrunMessage(IterativeRobotBase.java:359): Loop time of 0.02s overrun 
        Warning  1  	SmartDashboard.updateValues(): 0.000361s
                        disabledInit(): 0.000475s
                        robotPeriodic(): 0.310620s
                        LiveWindow.updateValues(): 0.202739s
                        Shuffleboard.update(): 0.000896s
                        disabledPeriodic(): 0.001021s
        edu.wpi.first.wpilibj.Tracer.lambda$printEpochs$0(Tracer.java:63) 


The the bigger the numbers after each step are, the more sever the loop overrun is. For example, the main problem here is that the :code:`robotPeriodic()` method took :code:`0.31062s` to complete. This is much larger than the 0.02s (20 ms) update rate the robot is supposed to be running at.

In extreme cases, the robot may move in a "jerky" or uncontrollable manner, not responding promptly to inputs or sensor value changes.


Driving toward Root Cause
-------------------------

A common first step is to simply inspect the codebase. Misuse of :code:`for` or :code:`while` loops can increase processing time very rapidly. Using :code:`.sleep()` methods or lots of :code:`print()` statements can do similar things. Less likely but also possible, a function which calls itself can act like a loop.

If a simple code inspection does not work, execution time can be measured with a few built-in WPILib methods.

:code:`Timer.getFPGATimestamp()` will return the current number of seconds since the RIO booted, to a high decimal precision. By reading the time before and after code executes and subtracting them, you can calculate how long a certain piece of code takes to execute. By doing this in many spots, you can start to identify which pieces of code take longer than others to run.

WPILib also provides a `Tracer class <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/edu/wpi/first/wpilibj/Tracer.html>`. By creating a Tracer and adding Epochs, you can generate nice reports of how long it takes to execute through certain pieces of code.

.. tabs::
   .. group-tab:: Java

      .. code-block:: java

         import edu.wpi.first.wpilibj.Tracer;

         public class YourCode {
           private Tracer t;

           public YourCode() {
             t = new Tracer();
           }

           public void periodicUpdate() {
             t.clearEpochs();

             // Some code

             t.addEpoch("First Epoch");
             
             // Some more code

             t.addEpoch("Another Epoch");

            // Even more code

             t.addEpoch("Yet Another Epoch");

             t.printEpochs();
           }

         }

   .. group-tab:: C++ (Header)

      .. code-block:: cpp

        //coming soon!

   .. group-tab:: C++ (Source)

      .. code-block:: cpp

        //coming soon!

when :code:`printEpochs()` is called, a print statement will be generated listing out the duration that each period defined by `addEpoch()` took. By carefully placing your epochs, you can identify which pieces of code take longer than others, to know where you need to optimize your code.