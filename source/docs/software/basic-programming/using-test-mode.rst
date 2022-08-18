Using Test Mode
===============

Test mode is designed to enable programmers to have a place to put code to verify that all systems on the robot are functioning. In each of the robot program templates there is a place to add test code to the robot.

Enabling Test Mode
------------------

.. image:: /docs/software/dashboards/smartdashboard/test-mode-and-live-window/images/enabling-test-mode/setting-test-mode-driver-station.png
   :alt: Selecting the "Test" button on the Driver Station and then "Enable".

Test mode on the robot can be enabled from the Driver Station just like autonomous or teleop. To enable test mode in the Driver Station, select the "Test" button and enable the robot. The test mode code will then run.

LiveWindow in Test Mode
-----------------------

With LiveWindow, all actuator outputs can be controlled on the Dashboard and all sensor values can be seen. PID Controllers can also be tuned. The sensors and actuators are added automatically, no code is necessary. See :doc:`/docs/software/dashboards/smartdashboard/test-mode-and-live-window/index` for more details.

Adding Test mode code to your robot code
----------------------------------------

When in test mode, the ``testInit`` method is run once, and the ``testPeriodic`` method is run once per tick, in addition to ``robotPeriodic``, similar to teleop and autonomous control modes.

Adding test mode can be as painless as calling your already written Teleop methods from Test. Or you can write special code to try out a new feature that is only run in Test mode, before integrating it into your teleop or autonomous code. You could even write code to move all motors and check all sensors to help the pit crew!

.. warning:: If you write your own test code, it may interfere with the LiveWindow code that can control actuators and is enabled automatically. You may need to call ``LiveWindow.setEnabled(false)`` in your testInit method to avoid this.
