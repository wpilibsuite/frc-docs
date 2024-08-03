Running the Identification Routine
==================================

Once the code has been deployed, we can now run the system identification routine, and record the resulting data for analysis.

.. note:: Ensure you have sufficient space around the robot before running any identification routine! The drive identification requires at least 10' of space, ideally closer to 20'. The robot drive can not be accurately characterized while on blocks.

.. warning:: Only log files with a single routine in them are usable for analysis. Multiple motors can be run in one routine, but they must be run at the same time. If you run a routine on one motor and then run a routine on another motor without extracting the log or power-cycling the roboRIO in between, analysis will fail.

Running Tests
-------------
Perform the tests using the bindings you created in the previous section.

.. warning:: Watch out for your mechanism and stop the test early if it exceeds safe limits! The routine only creates voltage commands for you to connect to your motors, it is up to you to set up hard or soft limits to prevent injury or damage.

The entire routine should look something like this:

.. note:: A drivetrain routine is shown below, but the same motions will occur on any mechanism.

.. raw:: html

  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;"> <iframe src="https://www.youtube-nocookie.com/embed/FN2xqoB1sfU" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe> </div>

After all four tests have been completed, use the ``DataLogTool`` to retrieve the log file from the roboRIO.
