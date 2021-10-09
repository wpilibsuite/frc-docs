Displaying LiveWindow Values
============================

.. note:: LiveWindow will automatically add your sensors for you. There is no need to do it manually.

LiveWindow values may also be displayed by writing the code yourself and adding it to your robot program. LiveWindow will display values grouped in subsystems. This is a convenient method of displaying whether they are actual command based program subsystems or just a grouping that you decide to use in your program.

Adding the Necessary Code to your Program
-----------------------------------------

For each sensor or actuator that is created, set the subsystem name and display name by calling ``setName`` (``SetName`` in C++). When the SmartDashboard is put into LiveWindow mode, it will display the sensors and actuators.

.. tabs::

    .. code-tab:: java

        Ultrasonic ultrasonic = new Ultrasonic(1, 2);
        ultrasonic.setName("Arm", "Ultrasonic");

        Jaguar elbow = new Jaguar(1);
        elbow.setName("Arm", "Elbow");

        Victor wrist = new Victor(2);
        wrist.setName("Arm", "Wrist");

    .. code-tab:: cpp

        frc::Ultrasonic ultrasonic{1, 2};
        ultrasonic.SetName("Arm", "Ultrasonic");

        frc::Jaguar elbow{1};
        elbow.SetName("Arm", "Elbow");

        frc::Victor wrist{2};
        wrist.SetName("Arm", "Wrist");

Viewing the Display in SmartDashboard
-----------------------------------------

.. image:: images/displaying-LiveWindow-values/view-display.png
    :alt: Modifying the components of a subsystem in SmartDashboard.

The sensors and actuators added to the LiveWindow will be displayed grouped by subsystem. The subsystem name is just an arbitrary grouping the helping to organize the display of the sensors. Actuators can be operated by operating the slider for the two motor controllers.
