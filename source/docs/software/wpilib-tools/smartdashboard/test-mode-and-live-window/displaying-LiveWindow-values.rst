Displaying LiveWindow values
============================

Typically LiveWindows are displayed as part of the automatically generated RobotBuilder code. You may also display LiveWindow values by writing the code yourself and adding it to your robot program. LiveWindow will display values grouped in subsystems. This is a convenient method of displaying whether they are actual command based program subsystems or just a grouping that you decide to use in your program.

Adding the necessary code to your program
-----------------------------------------
.. image:: images/displaying-LiveWindow-values/AddCode.png

**(1)** Get a reference (in Java) or a pointer (in C++) to the LiveWindow object in your program. **(2)** Then for each sensor or actuator that is created, add it to the LiveWindow display by either calling ``AddActuator`` or ``AddSensor`` (``addActuator`` or ``addSensor`` in Java). When the SmartDashboard is put into LiveWindow mode, it will display the sensors and actuators.

Viewing the display in the SmartDashboard
-----------------------------------------
.. image:: images/displaying-LiveWindow-values/ViewDisplay.png

The sensors and actuators added to the LiveWindow will be displayed grouped by subsystem. The subsystem name is just an arbitrary grouping the helping to organize the display of the sensors. Actuators can be operated by operating the slider for the two motor controllers.
