Displaying LiveWindow values
============================

Typically LiveWindows are displayed as part of the automatically generated RobotBuilder code. You may also display LiveWindow values by writing the code yourself and adding it to your robot program. LiveWindow will display values grouped in subsystems. This is a convenient method of displaying whether they are actual command based program subsystems or just a grouping that you decide to use in your program.

Adding the necessary code to your program
-----------------------------------------
.. tabs::

    .. code-tab:: java

        lw = LiveWindow.getInstance()    // (1)

        ultrasonic = new Ultrasonic(1, 2);
        lw.addSensor("Arm", "Ultrasonic", ultrasonic)

        elbow = new Jaguar(1);
        lw.addActuator("Arm", "Elbow", elbow);

        wrist = new Victor(2)
        lw.addActuator("Arm", "Wrist", wrist);

    .. code-tab:: cpp

        lw = LiveWindow::GetInstance()    // (1)

        ultrasonic = new Ultrasonic(1, 2);
        lw->AddSensor("Arm", "Ultrasonic", ultrasonic)

        elbow = new Jaguar(1);
        lw->AddActuator("Arm", "Elbow", elbow);

        wrist = new Victor(2)
        lw->AddActuator("Arm", "Wrist", wrist);


**(1)** Get a reference (in Java) or a pointer (in C++) to the LiveWindow object in your program. **(2)** Then for each sensor or actuator that is created, add it to the LiveWindow display by either calling ``AddActuator`` or ``AddSensor`` (``addActuator`` or ``addSensor`` in Java). When the SmartDashboard is put into LiveWindow mode, it will display the sensors and actuators.

Viewing the display in the SmartDashboard
-----------------------------------------
.. image:: images/displaying-LiveWindow-values/view-display.png

The sensors and actuators added to the LiveWindow will be displayed grouped by subsystem. The subsystem name is just an arbitrary grouping the helping to organize the display of the sensors. Actuators can be operated by operating the slider for the two motor controllers.
