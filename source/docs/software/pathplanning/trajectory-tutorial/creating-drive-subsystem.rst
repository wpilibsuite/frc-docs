Step 3: Creating a Drive Subsystem
==================================

Now that our drive is characterized, it is time to start writing our robot code *proper*.  As mentioned before, we will use the :ref:`command-based <docs/software/commandbased/what-is-command-based:What Is "Command-Based" Programming?>` framework for our robot code.  Accordingly, our first step is to write a suitable drive :ref:`subsystem <docs/software/commandbased/subsystems:Subsystems>` class.

The full drive class from the RamseteCommand Example Project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/RamseteCommand>`__) can be seen below.  The rest of the article will describe the steps involved in writing this class.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/subsystems/DriveSubsystem.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

Configuring the Drive Encoders
------------------------------

The drive encoders measure the rotation of the wheels on each side of the drive.  To properly configure the encoders, we need to specify two things: the ports the encoders are plugged into, and the distance per encoder pulse.  Then, we need to write methods allowing access to the encoder values from code that uses the subsystem.

Encoder Ports
^^^^^^^^^^^^^

The encoder ports are specified in the encoder's constructor, like so:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 35-47
      :linenos:
      :lineno-start: 35

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 17-18
      :linenos:
      :lineno-start: 17

Encoder Distance per Pulse
^^^^^^^^^^^^^^^^^^^^^^^^^^

The distance per pulse is specified by calling the encoder's ``setDistancePerPulse`` method.  Note that for the WPILib Encoder class, "pulse" refers to a full encoder cycle (i.e. four edges), and thus will be 1/4 the value that was specified in the SysId config.  Remember, as well, that the distance should be measured in meters!

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 63-64
      :linenos:
      :lineno-start: 63

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 26-27
      :linenos:
      :lineno-start: 26

Encoder Accessor Method
^^^^^^^^^^^^^^^^^^^^^^^

To access the values measured by the encoders, we include the following method:

.. important:: The returned velocities **must** be in meters! Because we configured the distance per pulse on the encoders above, calling ``getRate()`` will automatically apply the conversion factor from encoder units to meters. If you are not using WPILib's ``Encoder`` class, you must perform this conversion either through the respective vendor's API or by manually multiplying by a conversion factor.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 88-95
      :linenos:
      :lineno-start: 88

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 82-85
      :linenos:
      :lineno-start: 82

We wrap the measured encoder values in a ``DifferentialDriveWheelSpeeds`` object for easier integration with the ``RamseteCommand`` class later on.

Configuring the Gyroscope
-------------------------

The gyroscope measures the rate of change of the robot's heading (which can then be integrated to provide a measurement of the robot's heading relative to when it first turned on).  In our example, we use the `Analog Devices ADXRS450 FRC Gyro Board <https://www.analog.com/en/landing-pages/001/first.html>`__, which has been included in the kit of parts for several years:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 50-51
      :linenos:
      :lineno-start: 50

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/subsystems/DriveSubsystem.h
      :language: c++
      :lines: 140-141
      :linenos:
      :lineno-start: 140

Gyroscope Accessor Method
^^^^^^^^^^^^^^^^^^^^^^^^^

To access the current heading measured by the gyroscope, we include the following method:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 177-184
      :linenos:
      :lineno-start: 177

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 70-72
      :linenos:
      :lineno-start: 70

Configuring the Odometry
------------------------

Now that we have our encoders and gyroscope configured, it is time to set up our drive subsystem to automatically compute its position from the encoder and gyroscope readings.

First, we create a member instance of the ``DifferentialDriveOdometry`` class:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 52-53
      :linenos:
      :lineno-start: 53

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/subsystems/DriveSubsystem.h
      :language: c++
      :lines: 143-144
      :linenos:
      :lineno-start: 143

Updating the Odometry
^^^^^^^^^^^^^^^^^^^^^

The odometry class must be regularly updated to incorporate new readings from the encoder and gyroscope.  We accomplish this inside the subsystem's ``periodic`` method, which is automatically called once per main loop iteration:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 72-77
      :linenos:
      :lineno-start: 70

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 32-37
      :linenos:
      :lineno-start: 32

Odometry Accessor Method
^^^^^^^^^^^^^^^^^^^^^^^^

To access the robot's current computed pose, we include the following method:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 79-86
      :linenos:
      :lineno-start: 79

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 78-80
      :linenos:
      :lineno-start: 78

Voltage-Based Drive Method
--------------------------

Finally, we must include one additional method - a method that allows us to set the voltage to each side of the drive using the ``setVoltage()`` method of the ``MotorController`` interface.  The default WPILib drive class does not include this functionality, so we must write it ourselves:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 118-128
      :linenos:
      :lineno-start: 118

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 43-47
      :linenos:
      :lineno-start: 43

It is very important to use the ``setVoltage()`` method rather than the ordinary ``set()`` method, as this will automatically compensate for battery "voltage sag" during operation.  Since our feedforward voltages are physically-meaningful (as they are based on measured identification data), this is essential to ensuring their accuracy.
