# Analog Inputs - Software

.. note:: This section covers analog inputs in software.  For a hardware guide to analog inputs, see :ref:`docs/hardware/sensors/analog-inputs-hardware:Analog Inputs - Hardware`.

The Systemcore's Smart I/O supports up to 6 analog input channels that can be used to read the value of an analog voltage from a sensor.  Analog inputs may be used for any sensor that outputs a simple voltage.

Analog inputs return a 12-bit integer proportional to the voltage, from 0 to 3.3 volts.

.. note:: Systemcore Analog Inputs are 3.3 volts, whereas the roboRIO was 5 volts.

## The AnalogInput class

.. note:: It is often more convenient to use the :doc:`Analog Potentiometers <analog-potentiometers-software>` wrapper class than to use :code:`AnalogInput` directly, as it supports scaling to meaningful units.

Support for reading the voltages on the Smart I/O ports is provided through the :code:`AnalogInput` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/org/wpilib/hardware/discrete/AnalogInput.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classwpi_1_1_analog_input.html)).

### Initializing an AnalogInput

An :code:`AnalogInput` may be initialized as follows:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-5/wpilibjExamples/src/main/java/org/wpilib/snippets/analoginput/Robot.java
      :language: java
      :lines: 15-16

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-5/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 28-29

### Reading values from an AnalogInput

Values can be read from an AnalogInput with one of two different methods:

#### getValue

The :code:`getValue` method returns the raw instantaneous measured value from the analog input, without applying any calibration.  The returned value is an integer.

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-5/wpilibjExamples/src/main/java/org/wpilib/snippets/analoginput/Robot.java
      :language: java
      :lines: 23-26

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-5/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 15-18

#### getVoltage

The :code:`getVoltage` method returns the instantaneous measured voltage from the analog input.  The value is rescaled to represent a voltage.  The returned value is a double.

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-5/wpilibjExamples/src/main/java/org/wpilib/snippets/analoginput/Robot.java
      :language: java
      :lines: 28-30

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-5/wpilibcExamples/src/main/cpp/snippets/AnalogInput/cpp/Robot.cpp
      :language: c++
      :lines: 20-22

## Differences between roboRIO and Systemcore

Systemcore does not support oversampling or averaging, nor does it have an accumulator on the Smart I/O ports (used for Analog Gyros).

## Using analog inputs in code

The :code:`AnalogInput` class can be used to write code for a wide variety of sensors (including potentiometers, accelerometers, gyroscopes, ultrasonics, and more) that return their data as an analog voltage.  However, if possible it is almost always more convenient to use one of the other existing WPILib classes that handles the lower-level code (reading the analog voltages and converting them to meaningful units) for you.  Users should only directly use :code:`AnalogInput` as a "last resort."

Accordingly, for examples of how to effectively use analog sensors in code, users should refer to the other pages of this chapter that deal with more-specific classes.
