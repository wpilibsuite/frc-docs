# Analog Inputs - Software

.. note:: This section covers analog inputs in software.  For a hardware guide to analog inputs, see :ref:`docs/hardware/sensors/analog-inputs-hardware:Analog Inputs - Hardware`.

The Systemcore's Smart I/O supports up to 6 analog input channels that can be used to read the value of an analog voltage from a sensor.  Analog inputs may be used for any sensor that outputs a simple voltage.

Analog inputs return a 12-bit integer proportional to the voltage, from 0 to 3.3 volts.

.. note:: Systemcore Analog Inputs are 3.3 volts, whereas the roboRIO was 5 volts.

## The AnalogInput class

.. note:: It is often more convenient to use the :doc:`Analog Potentiometers <analog-potentiometers-software>` wrapper class than to use :code:`AnalogInput` directly, as it supports scaling to meaningful units.

Support for reading the voltages on the Smart I/O ports is provided through the :code:`AnalogInput` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/wpilibj/AnalogInput.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classfrc_1_1_analog_input.html)).

### Initializing an AnalogInput

An :code:`AnalogInput` may be initialized as follows:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analoginput/Robot.java
      :language: java
      :lines: 15-16

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 46-47

### Oversampling and Averaging

.. image:: images/analog-inputs-software/oversampling-averaging.png
   :alt: The Analog to Digital converter reads the signal and passes it to oversampling, averaging, and an accumulator.

The Smart I/O analog input supports both oversampling and averaging.  These behaviors are highly similar, but differ in a few important ways.  Both may be used at the same time.

#### Oversampling

When oversampling is enabled, the Smart I/O procesor will add multiple consecutive samples together, and return the accumulated value.  Users may specify the number of *bits* of oversampling - for :math:`n` bits of oversampling, the number of samples added together is :math:`2^{n}`:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analoginput/Robot.java
      :language: java
      :lines: 20-23

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 15-19

#### Averaging

Averaging behaves much like oversampling, except the accumulated values are divided by the number of samples so that the scaling of the returned values does not change.  This is often more-convenient, but occasionally the additional roundoff error introduced by the rounding is undesirable.

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analoginput/Robot.java
      :language: java
      :lines: 25-27

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 21-23

.. note:: When oversampling and averaging are used at the same time, the oversampling is applied *first,* and then the oversampled values are averaged.  Thus, 2-bit oversampling and 2-bit averaging used at the same time will increase the scale of the returned values by approximately a factor of 2, and decrease the update rate by approximately a factor of 4.

### Reading values from an AnalogInput

Values can be read from an AnalogInput with one of four different methods:

#### getValue

The :code:`getValue` method returns the raw instantaneous measured value from the analog input, without applying any calibration and ignoring oversampling and averaging settings.  The returned value is an integer.

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analoginput/Robot.java
      :language: java
      :lines: 32-35

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 25-28

#### getVoltage

The :code:`getVoltage` method returns the instantaneous measured voltage from the analog input.  Oversampling and averaging settings are ignored, but the value is rescaled to represent a voltage.  The returned value is a double.

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analoginput/Robot.java
      :language: java
      :lines: 37-39

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 30-32

#### getAverageValue

The :code:`getAverageValue` method returns the averaged value from the analog input.  The value is not rescaled, but oversampling and averaging are both applied.  The returned value is an integer.

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analoginput/Robot.java
      :language: java
      :lines: 41-43

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 34-36

#### getAverageVoltage

The :code:`getAverageVoltage` method returns the averaged voltage from the analog input.  Rescaling, oversampling, and averaging are all applied.  The returned value is a double.

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analoginput/Robot.java
      :language: java
      :lines: 45-47

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 38-40

### Accumulator

.. note:: Analog Input Accumulators are not supported on Systemcore.

## Using analog inputs in code

The :code:`AnalogInput` class can be used to write code for a wide variety of sensors (including potentiometers, accelerometers, gyroscopes, ultrasonics, and more) that return their data as an analog voltage.  However, if possible it is almost always more convenient to use one of the other existing WPILib classes that handles the lower-level code (reading the analog voltages and converting them to meaningful units) for you.  Users should only directly use :code:`AnalogInput` as a "last resort."

Accordingly, for examples of how to effectively use analog sensors in code, users should refer to the other pages of this chapter that deal with more-specific classes.
