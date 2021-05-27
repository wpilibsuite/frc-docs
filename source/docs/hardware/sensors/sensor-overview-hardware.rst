.. include:: <isonum.txt>

Sensor Overview - Hardware
==========================

.. note:: This section covers sensor hardware, not the use of sensors in code. For a software sensor guide, see :ref:`docs/software/hardware-apis/sensors/sensor-overview-software:Sensor Overview - Software`.

In order to be effective, it is often vital for robots to be able to gather information about their surroundings.  Devices that provide feedback to the robot on the state of its environment are called "sensors."  There are a large variety of sensors available to FRC\ |reg| teams, for measuring everything from on-field positioning to robot orientation to motor/mechanism positioning.  Making use of sensors is an absolutely crucial skill for on-field success; while most FRC games do have tasks that can be accomplished by a "blind" robot, the best robots rely heavily on sensors to accomplish game tasks as quickly and reliably as possible.

Additionally, sensors can be extremely important for robot safety - many robot mechanisms are capable of breaking themselves if used incorrectly.  Sensors provide a safeguard against this, allowing robots to, for example, disable a motor if a mechanism is against a hard-stop.

Types of Sensors
----------------

Sensors used in FRC can be generally categorized in two different ways: by function, and by communication protocol.  The former categorization is relevant for robot design; the latter for wiring and programming.

Sensors by Function
^^^^^^^^^^^^^^^^^^^

Sensors can provide feedback on a variety of different aspects of the robot's state.  Sensor functions common to FRC include:

- :doc:`Proximity switches <proximity-switches>`

    * Mechanical proximity switches ("limit switches")
    * Magnetic proximity switches
    * Inductive proximity switches
    * Photoelectric proximity switches

- Distance sensors

    * :doc:`Ultrasonic sensors <ultrasonics-hardware>`
    * :doc:`Triangulating rangefinders <triangulating-rangefinders>`
    * :doc:`LIDAR <lidar>`

- Shaft rotation sensors

    * :doc:`Encoders <encoders-hardware>`
    * :doc:`Potentiometers <analog-potentiometers-hardware>`

- :doc:`Accelerometers <accelerometers-hardware>`

- :doc:`Gyroscopes <gyros-hardware>`

Sensors by Communication Protocol
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In order for a sensor to be useful, it must be able to "talk" to the roboRIO.  There are several main methods by which sensors can communicate their readings to the roboRIO:

- :doc:`Analog input <analog-inputs-hardware>`
- :doc:`Digital input <digital-inputs-hardware>`
- :doc:`Serial bus <serial-buses>`

In general, support for sensors that communicate via analog and digital inputs is straightforward, while communication over serial bus can be more complicated.
