Ultrasonics - Software
======================

.. note:: This section covers ultrasonics in software.  For a hardware guide to ultrasonics, see :ref:`docs/hardware/sensors/ultrasonics-hardware:Ultrasonics - Hardware`.

An ultrasonic sensor is commonly used to measure distance to an object using high-frequency sound.  Generally, ultrasonics measure the distance to the closest object within their "field of view."

There are two primary types of ultrasonics supported natively by WPILib:

- `Ping-response ultrasonics`_
- `Analog ultrasonics`_

Ping-response ultrasonics
-------------------------

The :code:`Ultrasonic` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/Ultrasonic.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_ultrasonic.html>`__) provides support for ping-response ultrasonics.  As ping-response ultrasonics (per the name) require separate pins for both sending the ping and measuring the response, users must specify DIO pin numbers for both output and input when constructing an :code:`Ultrasonic` instance:

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ultrasonic/Robot.java
         :language: java
         :lines: 17-18

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibcExamples/src/main/cpp/examples/Ultrasonic/include/Robot.h
         :language: cpp
         :lines: 23-24

The measurement can then be retrieved in either inches or millimeters in Java; in C++ the :ref:`units library <docs/software/basic-programming/cpp-units:The C++ Units Library>` is used to automatically convert to any desired length unit:

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ultrasonic/Robot.java
         :language: java
         :lines: 29-32

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibcExamples/src/main/cpp/examples/Ultrasonic/cpp/Robot.cpp
         :language: cpp
         :lines: 18-22

Analog ultrasonics
------------------

Some ultrasonic sensors simply return an analog voltage corresponding to the measured distance.  These sensors can may simply be used with the :doc:`AnalogPotentiometer <analog-potentiometers-software>` class.

Third-party ultrasonics
-----------------------

Other ultrasonic sensors offered by third-parties may use more complicated communications protocols (such as I2C or SPI).  WPILib does not provide native support for any such ultrasonics; they will typically be controlled with vendor libraries.

Using ultrasonics in code
-------------------------

Ultrasonic sensors are very useful for determining spacing during autonomous routines.  For example, the following code from the UltrasonicPID example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ultrasonicpid>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/UltrasonicPID>`__)will move the robot to 1 meter away from the nearest object the sensor detects:

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ultrasonicpid/Robot.java
         :language: java
         :lines: 18-61, 71-71

   .. group-tab:: C++ (Header)

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibcExamples/src/main/cpp/examples/UltrasonicPID/include/Robot.h
         :language: cpp
         :lines: 19-51

   .. group-tab:: C++ (Source)

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibcExamples/src/main/cpp/examples/UltrasonicPID/cpp/Robot.cpp
         :language: cpp
         :lines: 7-19

Additionally, ping-response ultrasonics can be sent to :ref:`Shuffleboard <docs/software/dashboards/shuffleboard/getting-started/shuffleboard-tour:Tour of Shuffleboard>`, where they will be displayed with their own widgets:

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ultrasonic/Robot.java
         :language: java
         :lines: 22-24

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibcExamples/src/main/cpp/examples/Ultrasonic/cpp/Robot.cpp
         :language: cpp
         :lines: 12-14
