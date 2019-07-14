Operating pneumatic cylinders
=============================

Solenoid control
----------------

FRC teams use solenoids to preform a variety of tasks, from shifting
gearboxes to operating robot mechanisms. There are two types of solenoids
legal in FRC; electrical (the wattage of which is limited by each years
game manual); and pneumatic using compressed air. A solenoid is a valve
used to electronically switch either an electromagnet or pressurised air
line "on" or "off". This article focuses on pneumatic solenoids.
For more information on solenoids, see `this wikipedia
article <https://en.wikipedia.org/wiki/Solenoid_valve>`__. Pneumatic
Solenoids are controlled by a robot's Pneumatics Control Module, or PCM,
which is in turn connected to the robot's roboRIO via CAN. The easiest
way to see a solenoid's state is via the small red LED (which indicates
if the valve is "on" or not). Some pneumatic solenoids can be actuated
by a small button on the solenoid itself.

There are two types of pneumatic solenoids; Single and Double acting.
One difference between the two is what happens in their unpowered state.
Single acting solenoids return to their default state, while double
acting solenoids will maintain their most recently commanded state.
Another difference between the two is that single acting solenoids only
connect to a single PCM channel, where as double acting solenoids have
two electrical inputs which connect back to two separate channels
on the PCM.

PCM Modules are identified by their CAN Device ID. The default CAN ID
for PCMs is 0. If using a single PCM on the bus it is recommended to
leave it at the default CAN ID. This ID can be changed with the Phoenix
Tuner application, in addition to other debug information. (TODO Link
Phoenix tuner atricle) TODO FIX THIS LINK: For more information about
setting PCM Node IDs see Updating and Configuring Pneumatics Control
Module and Power Distribution Panel.

Single Solenoids in WPILib
--------------------------

Using a single acting solenoid
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Single solenoids in WPILib are controlled using the Solenoid class. To
construct a Solenoid object, simply pass the desired port number
(assumes Node ID 0) or Node ID and port number to the constructor. To
set the value of the solenoid call ``set(true)`` to enable or ``set(false)`` to
disable the solenoid output.

.. tabs::

    .. code-tab:: java

        Solenoid exampleSolenoid = new Solenoid(1);

        exampleSolenoid.set(true);
        exampleSolenoid.set(false);

    .. code-tab:: c++

        frc::Solenoid exampleSolenoid {1};

        exampleSolenoid.Set(true);
        exampleSolenoid.Set(false);

Double Solenoids in WPILib
~~~~~~~~~~~~~~~~~~~~~~~~~~

Double solenoids are controlled by the DoubleSolenoid class in WPILib.
These are constructed similarly to the single solenoid but there are now
two port numbers to pass to the constructor, a forward channel (first)
and a reverse channel (second). The state of the valve can then be set
to kOff (neither output activated), kForward (forward channel enabled)
or kReverse (reverse channel enabled). Additionally, the PCM CAN ID can
be passed to the DoubleSolenoid if teams have a non-standard PCM CAN ID

.. tabs::

   .. code-tab:: java

        DoubleSolenoid exampleDouble = new DoubleSolenoid(1, 2);
        DoubleSolenoid anotherDoubleSolenoid = new DoubleSolenoid(/* The PCM CAN ID */ 9, 4, 5);

        exampleDouble.set(DoubleSolenoid.Value.kOff);
        exampleDouble.set(DoubleSolenoid.Value.kForward);
        exampleDouble.set(DoubleSolenoid.Value.kReverse);

   .. code-tab:: c++

        frc::DoubleSolenoid exampleDouble {1, 2};
        frc::DoubleSolenoid exampleDouble {/* The PCM CAN ID */ 9, 1, 2};

        exampleDouble.Set(frc::DoubleSolenoid::Value::kOff);
        exampleDouble.Set(frc::DoubleSolenoid::Value::kForward);
        exampleDouble.Set(frc::DoubleSolenoid::Value::kReverse);
