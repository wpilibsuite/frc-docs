Mitigating Loop Overruns
========================

A *loop overrun* is a common occurrence when teams scale up their codebases. It occurs when a piece of code takes too long to execute, "starving" other code of the time it needs to run.

Real-Time System
----------------

Our robots are *real-time systems*. Code must execute in a way that the time between reading inputs, performing calculations, and assigning outputs is bounded and deterministic. In doing so, the code establishes the relationship of how outputs change in response to inputs.

When code runs too slowly, that input-output relationship is no longer maintained, causing complex and unexpected behaviors.

Common Symptoms
--------------

One key symptom is seeing this message frequently in RIOLog:

.. code-block:: text
    TODO

The the bigger the TODO number is, the more sever the loop overrun is.

In extreme cases, the robot may move in a "jerky" or uncontrollable manner, not responding promptly to inputs or sensor value changes.


Driving toward Root Cause
-------------------------

A common first step is to simply inspect the codebase. Misuse of `for` or `while` loops can increase processing time very rapidly. Using `.sleep()` methods or lots of `print()` statements can do similar things. Less likely but also possible, a function which calls itself can act like a loop.

If a simple code inspection does not work, execution time can be measured with a few built-in WPILib methods.

`Timer.getFPGATimestamp()` will return the current number of seconds since the RIO booted, to a high decimal precision. By reading the time before and after code executes and subtracting them, you can calculate how long a certain piece of code takes to execute. By doing this in many spots, you can start to identify which pieces of code take longer than others to run.

WPILib also provides a `Watchdog` class (Link me). By creating a watchdog and adding Epochs, you can generate nice reports of how long it takes to execute through certain pieces of code.

TODO Watchdog and Epochs.

