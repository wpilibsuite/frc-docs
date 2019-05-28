Sensor Overview - Hardware
==========================

.. note:: This section covers sensor hardware, not the use of sensors in code. For a software sensor guide, see :ref:`docs/software/sensors/sensor-overview-software:Sensor Overview - Software`.

In order to be effective, it is often vital for robots to be able to gather information about their surroundings.  Devices that provide feedback to the robot on the state of its environment are called "sensors."  There are a large variety of sensors available to FRC teams, for measuring everything from distance to field elements to robot orientation to motor/mechanism positioning.  Making use of sensors is an absolutely crucial skill for on-field success; while most FRC games do have tasks that can be accomplished by a "blind" robot, the best robots rely heavily on sensors to accomplish game tasks as quickly and reliably as possible.

Additionally, sensors can be exteremely important for robot safety - many robot mechanisms are capable of breaking themselves if used incorrectly.  Sensors provide a safeguard against this, allowing robots to, for example, disable a motor if a mechanism is against a hard-stop.

Types of sensors
----------------

Sensors used in FRC can be generally categorized in two different ways: by function, and by communication protocol.  The former categorization is relevant for robot design; the latter for wiring and programming.

Sensors by function
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

- :doc:`Gyroscopes <gyroscopes-hardware>`

Sensors by communication protocol
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In order for a sensor to be useful, it must be able to "talk" to the RoboRIO.  There are three main methods by which sensors can communicate their readings to the RoboRIO:

- :doc:`Analog input <analog-inputs-hardware>`
- :doc:`Digital input <digital-inputs-hardware>`
- :doc:`Serial bus <serial-buses>`

    * SPI
    * I2C
    * USB

In general, support for sensors that communicate via analog and digital inputs is straightforward, while communication over serial bus is more complicated.
