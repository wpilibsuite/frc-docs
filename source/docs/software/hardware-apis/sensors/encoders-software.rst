.. include:: <isonum.txt>

# Encoders - Software

.. note:: This section covers encoders in software.  For a hardware guide to encoders, see :ref:`docs/hardware/sensors/encoders-hardware:Encoders - Hardware`.

Encoders are devices used to measure motion (usually, the rotation of a shaft).

.. important:: The classes in this document are only used for encoders that are plugged directly into the roboRIO! Please reference the appropriate vendors' documentation for using encoders plugged into motor controllers.

## Quadrature Encoders - The :code:`Encoder` Class

WPILib provides support for quadrature encoders through the :code:`Encoder` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/Encoder.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_encoder.html)).  This class provides a simple API for configuring and reading data from encoders.

.. image:: images/encoders-software/encoding-direction.png
    :alt: Quadrature Encoders determine direction by observing which pulse channel (A or B) receives a pulse first.

These encoders produce square-wave signals on two channels that are a quarter-period out-of-phase (hence the term, "quadrature").  The pulses are used to measure the rotation, and the direction of motion can be determined from which channel "leads" the other.

.. image:: images/encoders-software/encoder-modules.png
    :alt: A Quadrature Decoder analyzing the A, B, and Index signals.

The FPGA handles quadrature encoders either through a counter module or an encoder module, depending on the :ref:`decoding type <docs/software/hardware-apis/sensors/encoders-software:Decoding type>` - the choice is handled automatically by WPILib.  The FPGA contains 8 encoder modules.

Examples of quadrature encoders:

- [AMT103-V](https://www.cuidevices.com/product/motion/rotary-encoders/incremental/modular/amt10-v-kit/amt103-v) available through FIRST Choice
- [CIMcoder](https://www.andymark.com/products/cimcoder-encoder-cim-motor-high-resolution)
- [CTRE Mag Encoder](https://store.ctr-electronics.com/srx-mag-encoder/)
- [Grayhill 63r](https://www.mouser.com/datasheet/2/626/grhls00779_1-2289364.pdf)
- [REV Through Bore Encoder](https://www.revrobotics.com/rev-11-1271/)
- [US Digital E4T](https://www.andymark.com/products/e4t-oem-miniature-optical-encoder-kit)

### Initializing a Quadrature Encoder

A quadrature encoder can be instantiated as follows:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoder/Robot.java
      :language: java
      :lines: 16-18

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/Encoder/cpp/Robot.cpp
      :language: c++
      :lines: 53-55

#### Decoding Type

The WPILib :code:`Encoder` class can decode encoder signals in three different modes:

- **1X Decoding**: Increments the distance for every complete period of the encoder signal (once per four edges).
- **2X Decoding**: Increments the distance for every half-period of the encoder signal (once per two edges).
- **4X Decoding**: Increments the distance for every edge of the encoder signal (four times per period).

4X decoding offers the greatest precision, but at the potential cost of increased "jitter" in rate measurements.  To use a different decoding type, use the following constructor:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoder/Robot.java
      :language: java
      :lines: 20-22

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/Encoder/cpp/Robot.cpp
      :language: c++
      :lines: 57-59

### Configuring Quadrature Encoder Parameters

.. note:: The :code:`Encoder` class does not make any assumptions about units of distance; it will return values in whatever units were used to calculate the distance-per-pulse value.  Users thus have complete control over the distance units used.  However, units of time are *always* in seconds.

.. note:: The number of pulses used in the distance-per-pulse calculation does *not* depend on the :ref:`decoding type <docs/software/hardware-apis/sensors/encoders-software:Decoding type>` - each "pulse" should always be considered to be a full cycle (four edges).

The :code:`Encoder` class offers a number of configuration methods:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoder/Robot.java
      :language: java
      :lines: 26-37

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/Encoder/cpp/Robot.cpp
      :language: c++
      :lines: 17-29

### Reading information from Quadrature Encoders

The :code:`Encoder` class provides a wealth of information to the user about the motion of the encoder.

#### Distance

.. note:: Quadrature encoders measure *relative* distance, not absolute; the distance value returned will depend on the position of the encoder when the robot was turned on or the encoder value was last :ref:`reset <docs/software/hardware-apis/sensors/encoders-software:Resetting a quadrature encoder>`.

Users can obtain the total distance traveled by the encoder with the :code:`getDistance()` method:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoder/Robot.java
      :language: java
      :lines: 44-45

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/Encoder/cpp/Robot.cpp
      :language: c++
      :lines: 33-34

#### Rate

.. note:: Units of time for the :code:`Encoder` class are *always* in seconds.

Users can obtain the current rate of change of the encoder with the :code:`getRate()` method:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoder/Robot.java
      :language: java
      :lines: 47-48

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/Encoder/cpp/Robot.cpp
      :language: c++
      :lines: 36-37

#### Stopped

Users can obtain whether the encoder is stationary with the :code:`getStopped()` method:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoder/Robot.java
      :language: java
      :lines: 50-51

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/Encoder/cpp/Robot.cpp
      :language: c++
      :lines: 39-40

#### Direction

Users can obtain the direction in which the encoder last moved with the :code:`getDirection()` method:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoder/Robot.java
      :language: java
      :lines: 53-54

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/Encoder/cpp/Robot.cpp
      :language: c++
      :lines: 42-43

#### Period

Users can obtain the period of the encoder pulses (in seconds) with the :code:`getPeriod()` method:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoder/Robot.java
      :language: java
      :lines: 56-57

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/Encoder/cpp/Robot.cpp
      :language: c++
      :lines: 45-46

### Resetting a Quadrature Encoder

To reset a quadrature encoder to a distance reading of zero, call the :code:`reset()` method.  This is useful for ensuring that the measured distance corresponds to the actual desired physical measurement, and is often called during a :ref:`homing <docs/software/hardware-apis/sensors/encoders-software:Homing a mechanism>` routine:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoder/Robot.java
      :language: java
      :lines: 59-60

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/Encoder/cpp/Robot.cpp
      :language: c++
      :lines: 48-49

## Duty Cycle Encoders - The :code:`DutyCycleEncoder` class

WPILib provides support for duty cycle (also marketed as :term:`PWM`) encoders through the :code:`DutyCycleEncoder` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/DutyCycleEncoder.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_duty_cycle_encoder.html)).  This class provides a simple API for configuring and reading data from duty cycle encoders.

The roboRIO's FPGA handles duty cycle encoders automatically.

.. warning:: In 2025 the API changed to remove rollover detection as rollover detection did not work. The :code:`get()` method returns the value within a rotation where the maximum value in a rotation is defined in the constructor (default 1).

Examples of duty cycle encoders:

- [AndyMark Mag Encoder](https://www.andymark.com/products/am-mag-encoder)
- [CTRE Mag Encoder](https://store.ctr-electronics.com/srx-mag-encoder/)
- [REV Through Bore Encoder](https://www.revrobotics.com/rev-11-1271/)
- [Team 221 Lamprey2](https://www.andymark.com/products/lamprey-absolute-encoder)
- [US Digital MA3](https://www.usdigital.com/products/encoders/absolute/shaft/ma3/)

### Initializing a Duty Cycle Encoder

A duty cycle encoder can be instantiated as follows:

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/dutycycleencoder/Robot.java
      :language: java
      :lines: 15-16

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/DutyCycleEncoder/cpp/Robot.cpp
      :language: c++
      :lines: 25-26

### Configuring Duty Cycle Encoder Range and Zero

.. note:: The :code:`DutyCycleEncoder` class does not assume specific units of rotation. It returns values in the same units used to calculate the full range of rotation, giving users complete control over the rotation units.

The :code:`DutyCycleEncoder` class provides an alternate constructor that allows control over the full range and the zero position of the encoder.

The zero position is useful for ensuring that the measured rotation corresponds to the desired physical measurement. Unlike quadrature encoders, duty cycle encoders don't need to be homed. The desired rotation can be read and stored to be set when the program starts. The :doc:`Preferences class </docs/software/basic-programming/robot-preferences>` provides methods to save and retrieve these values on the roboRIO.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/dutycycleencoder/Robot.java
      :language: java
      :lines: 18-21

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/DutyCycleEncoder/cpp/Robot.cpp
      :language: c++
      :lines: 28-31

### Reading Rotation from Duty Cycle Encoders

.. note:: Duty Cycle encoders measure absolute rotation. It does not depend on the starting position of the encoder.

Users can obtain the rotation measured by the encoder with the :code:`get()` method:

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/dutycycleencoder/Robot.java
      :language: java
      :lines: 28-29

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/DutyCycleEncoder/cpp/Robot.cpp
      :language: c++
      :lines: 17-18

### Detecting a Duty Cycle Encoder is Connected

As duty cycle encoders output a continuous set of pulses, it is possible to detect that the encoder has been unplugged.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/dutycycleencoder/Robot.java
      :language: java
      :lines: 31-32

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/DutyCycleEncoder/cpp/Robot.cpp
      :language: c++
      :lines: 20-21

## Analog Encoders - The :code:`AnalogEncoder` Class

WPILib provides support for analog absolute encoders through the :code:`AnalogEncoder` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/AnalogEncoder.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_analog_encoder.html)).  This class provides a simple API for configuring and reading data from analog encoders.

Examples of analog encoders:

- [Team 221 Lamprey2](https://www.andymark.com/products/lamprey-absolute-encoder)
- [Thrifty Absolute Magnetic Encoder](https://www.thethriftybot.com/products/thrifty-absolute-magnetic-encoder)
- [US Digital MA3](https://www.usdigital.com/products/encoders/absolute/shaft/ma3/)

### Initializing an Analog Encoder

An analog encoder can be instantiated as follows:

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analogencoder/Robot.java
      :language: java
      :lines: 15-16

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/AnalogEncoder/cpp/Robot.cpp
      :language: c++
      :lines: 22-23

### Configuring Analog Encoder Range and Zero

.. note:: The :code:`AnalogEncoder` class makes no assumptions about rotation units, returning values in the same units used to calculate the full range. This gives users complete control over the choice of rotation units.

The :code:`AnalogEncoder` class offers an alternate constructor that offers control over the full range of rotation and zero position of the encoder.

The zero position is useful for ensuring that the measured rotation corresponds to the desired physical measurement. Unlike quadrature encoders, analog encoders don't need to be homed. The desired rotation can be read and stored to be set when the program starts. The :doc:`Preferences class </docs/software/basic-programming/robot-preferences>` provides methods to save and retrieve these values on the roboRIO.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analogencoder/Robot.java
      :language: java
      :lines: 18-21

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/AnalogEncoder/cpp/Robot.cpp
      :language: c++
      :lines: 25-28

### Reading Rotation from Analog Encoders

.. note:: Analog encoders measure absolute rotation. It does not depend on the starting position of the encoder.

Users can obtain the rotation measured by the encoder with the :code:`get()` method:

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analogencoder/Robot.java
      :language: java
      :lines: 28-29

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/AnalogEncoder/cpp/Robot.cpp
      :language: c++
      :lines: 17-18

## Using Encoders in Code

Encoders are some of the most useful sensors in FRC\ |reg|; they are very nearly a requirement to make a robot capable of nontrivially-automated actuations and movement.  The potential applications of encoders in robot code are too numerous to summarize fully here, but an example is provided below:

### Driving to a Distance

Encoders can be used on a robot drive to create a simple "drive to distance" routine.  This is useful in autonomous mode, but has the disadvantage that the robot's momentum will cause it to overshoot the intended distance. Better methods include using a :doc:`PID Controller </docs/software/advanced-controls/introduction/introduction-to-pid>` or using :doc:`Path Planning </docs/software/pathplanning/index>`

.. note:: The following example uses the `Encoder` class, but is similar if other `DutyCycleEncoder` or `AnalogEncoder` is used. However, quadrature encoders are typically better suited for drivetrains since they roll over many times and don't have an absolute position.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoderdrive/Robot.java
      :language: java
      :lines: 17-47

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/EncoderDrive/cpp/Robot.cpp
      :language: c++
      :lines: 39-47, 16-36


### Homing a Mechanism

Since quadrature encoders measure *relative* distance, it is often important to ensure that their "zero-point" is in the right place.  A typical way to do this is a "homing routine," in which a mechanism is moved until it hits a known position (usually accomplished with a limit switch), or "home," and then the encoder is reset.  The following code provides a basic example:

.. note:: Homing is not necessary for absolute encoders like duty cycle encoders and analog encoders.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/encoderhoming/Robot.java
      :language: java
      :lines: 17-34

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/EncoderHoming/cpp/Robot.cpp
      :language: c++
      :lines: 28-31, 16-25

