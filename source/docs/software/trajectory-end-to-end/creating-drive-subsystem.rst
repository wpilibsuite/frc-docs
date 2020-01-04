Step 3: Creating a Drive Subsystem
==================================

Now that our drive is characterized, it is time to start writing our robot code *proper*.  As mentioned before, we will use the :ref:`command-based <docs/software/commandbased/what-is-command-based:What Is "Command-Based" Programming?>` framework for our robot code.  Accordingly, our first step is to write a suitable drive :ref:`subsystem <docs/software/commandbased/subsystems:Subsystems>` class.

The full drive class from the RamseteCommand Example Project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand>`__) can be seen below.  The rest of the article will describe the steps involved in writing this class.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/subsystems/DriveSubsystem.h
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

Configuring the Drive Encoders
------------------------------

The drive encoders measure the rotation of the wheels on each side of the drive.  To properly configure the encoders, we need to specify two things: the ports the encoders are plugged into, and the distance per encoder pulse.  Then, we need to write methods allowing access to the encoder values from code that uses the subsystem.

Encoder Ports
^^^^^^^^^^^^^

The encoder ports are specified in the encoder's constructor, like so:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 38-46
      :linenos:
      :lineno-start: 38

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 20-21
      :linenos:
      :lineno-start: 20

Encoder Distance per Pulse
^^^^^^^^^^^^^^^^^^^^^^^^^^

The distance per pulse is specified by calling the encoder's ``setDistancePerPulse`` method.  Note that for the WPILib Encoder class, "pulse" refers to a full encoder cycle (i.e. four edges), and thus will be 1/4 the value that was specified in the FRC-Characterization config.  Remember, as well, that the distance should be measured in meters!

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 58-60
      :linenos:
      :lineno-start: 58

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 23-25
      :linenos:
      :lineno-start: 23

Encoder Accessor Method
^^^^^^^^^^^^^^^^^^^^^^^

To access the values measured by the encoders, we include the following method:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 82-89
      :linenos:
      :lineno-start: 82

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 73-76
      :linenos:
      :lineno-start: 73

We wrap the measured encoder values in a ``DifferentialDriveWheelSpeeds`` object for easier integration with the ``RamseteCommand`` class later on.

Configuring the Gyroscope
-------------------------

The gyroscope measures the rate of change of the robot's heading (which can then be integrated to provide a measurement of the robot's heading relative to when it first turned on).  In our example, we use the `Analog Devices ADXRS450 FRC Gyro Board <https://www.analog.com/en/landing-pages/001/first.html>`__, which has been included in the kit of parts for several years:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 48-49
      :linenos:
      :lineno-start: 48

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/subsystems/DriveSubsystem.h
      :language: c++
      :lines: 143-144
      :linenos:
      :lineno-start: 143

Gyroscope Accessor Method
^^^^^^^^^^^^^^^^^^^^^^^^^

To access the current heading measured by the gyroscope, we include the following method:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 173-180
      :linenos:
      :lineno-start: 173

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 63-65
      :linenos:
      :lineno-start: 63

Configuring the Odometry
------------------------

Now that we have our encoders and gyroscope configured, it is time to set up our drive subsystem to automatically compute its position from the encoder and gyroscope readings.

First, we create a member instance of the ``DifferentialDriveOdometry`` class:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 51-52
      :linenos:
      :lineno-start: 51

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/subsystems/DriveSubsystem.h
      :language: c++
      :lines: 146-147
      :linenos:
      :lineno-start: 146

Updating the Odometry
^^^^^^^^^^^^^^^^^^^^^

The odometry class must be regularly updated to incorporate new readings from the encoder and gyroscope.  We accomplish this inside the subsystem's ``periodic`` method, which is automatically called once per main loop iteration:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 66-71
      :linenos:
      :lineno-start: 66

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 30-35
      :linenos:
      :lineno-start: 30

Odometry Accessor Method
^^^^^^^^^^^^^^^^^^^^^^^^

To access the robot's current computed pose, we include the following method:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 72-78
      :linenos:
      :lineno-start: 72

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 71-71
      :linenos:
      :lineno-start: 71

Voltage-Based Drive Method
--------------------------

Finally, we must include one additional method - a method that allows us to set the voltage to each side of the drive using the ``setVoltage()`` method of the ``SpeedController`` interface.  The default WPILib drive class does not include this functionality, so we must write it ourselves:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/subsystems/DriveSubsystem.java
      :language: java
      :lines: 111-120
      :linenos:
      :lineno-start: 111

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/subsystems/DriveSubsystem.cpp
      :language: c++
      :lines: 41-44
      :linenos:
      :lineno-start: 41

It is very important to use the ``setVoltage()`` method rather than the ordinary ``set()`` method, as this will automatically compensate for battery "voltage sag" during operation.  Since our feedforward voltages are physically-meaningful (as they are based on measured characterization data), this is essential to ensuring their accuracy.
