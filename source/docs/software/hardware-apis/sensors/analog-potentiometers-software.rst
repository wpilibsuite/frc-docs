# Analog Potentiometers - Software

.. note:: This section covers analog potentiometers in software.  For a hardware guide to analog potentiometers, see :ref:`docs/hardware/sensors/analog-potentiometers-hardware:Analog Potentiometers - Hardware`.

Potentiometers are variable resistors that allow information about position to be converted into an analog voltage signal.  This signal can be read by the roboRIO to control whatever device is attached to the potentiometer.

While it is possible to read information from a potentiometer directly with an :doc:`analog-inputs-software`, WPILib provides an :code:`AnalogPotentiometer` class ([Java](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/hardware/rotation/AnalogPotentiometer.html), [C++](https://github.wpilib.org/allwpilib/docs/beta/cpp/classwpi_1_1_analog_potentiometer.html)) that handles re-scaling the values into meaningful units for the user.  It is strongly encouraged to use this class.

In fact, the :code:`AnalogPotentiometer` name is something of a misnomer - this class should be used for the vast majority of sensors that return their signal as a simple, linearly-scaled analog voltage.

## The AnalogPotentiometer class

.. note:: The "full range" or "scale" parameters in the :code:`AnalogPotentiometer` constructor are scale factors from a range of 0-1 to the actual range, *not* from 0-5.  That is, they represent a native fractional scale, rather than a voltage scale.

An AnalogPotentiometer can be initialized as follows:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-6/wpilibjExamples/src/main/java/org/wpilib/snippets/analogpotentiometer/Robot.java
      :language: java
      :lines: 16-21

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-6/wpilibcExamples/src/main/cpp/snippets/AnalogPotentiometer/cpp/Robot.cpp
      :language: c++
      :lines: 23-27


### Customizing the underlying AnalogInput

If the user would like to apply custom settings to the underlying :code:`AnalogInput` used by the :code:`AnalogPotentiometer`, an alternative constructor may be used in which the :code:`AnalogInput` is injected:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-6/wpilibjExamples/src/main/java/org/wpilib/snippets/analogpotentiometer/Robot.java
      :language: java
      :lines: 23-30

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-6/wpilibcExamples/src/main/cpp/snippets/AnalogPotentiometer/cpp/Robot.cpp
      :language: c++
      :lines: 29-35

### Reading values from the AnalogPotentiometer

The scaled value can be read by simply calling the :code:`get` method:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-6/wpilibjExamples/src/main/java/org/wpilib/snippets/analogpotentiometer/Robot.java
      :language: java
      :lines: 39-40

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-6/wpilibcExamples/src/main/cpp/snippets/AnalogPotentiometer/cpp/Robot.cpp
      :language: c++
      :lines: 18-19

## Using AnalogPotentiometers in code

Analog sensors can be used in code much in the way other sensors that measure the same thing can be.  If the analog sensor is a potentiometer measuring an arm angle, it can be used similarly to an :doc:`encoder <encoders-software>`.

It is very important to keep in mind that actual, physical potentiometers generally have a limited range of motion.  Safeguards should be present in both the physical mechanism and the code to ensure that the mechanism does not break the sensor by traveling past its maximum throw.
