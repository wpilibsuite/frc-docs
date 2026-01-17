# Analog Potentiometers - Software

.. note:: This section covers analog potentiometers in software.  For a hardware guide to analog potentiometers, see :ref:`docs/hardware/sensors/analog-potentiometers-hardware:Analog Potentiometers - Hardware`.

Potentiometers are variable resistors that allow information about position to be converted into an analog voltage signal.  This signal can be read by the roboRIO to control whatever device is attached to the potentiometer.

While it is possible to read information from a potentiometer directly with an :doc:`analog-inputs-software`, WPILib provides an :code:`AnalogPotentiometer` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/AnalogPotentiometer.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_analog_potentiometer.html)) that handles re-scaling the values into meaningful units for the user.  It is strongly encouraged to use this class.

In fact, the :code:`AnalogPotentiometer` name is something of a misnomer - this class should be used for the vast majority of sensors that return their signal as a simple, linearly-scaled analog voltage.

## The AnalogPotentiometer class

.. note:: The "full range" or "scale" parameters in the :code:`AnalogPotentiometer` constructor are scale factors from a range of 0-1 to the actual range, *not* from 0-5.  That is, they represent a native fractional scale, rather than a voltage scale.

An AnalogPotentiometer can be initialized as follows:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analogpotentiometer/Robot.java
      :language: java
      :lines: 16-21

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/AnalogPotentiometer/cpp/Robot.cpp
      :language: c++
      :lines: 26-30


### Customizing the underlying AnalogInput

.. note:: If the user changes the scaling of the :code:`AnalogInput` with oversampling, this must be reflected in the scale setting passed to the :code:`AnalogPotentiometer`.

If the user would like to apply custom settings to the underlying :code:`AnalogInput` used by the :code:`AnalogPotentiometer`, an alternative constructor may be used in which the :code:`AnalogInput` is injected:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analogpotentiometer/Robot.java
      :language: java
      :lines: 23-30

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/AnalogPotentiometer/cpp/Robot.cpp
      :language: c++
      :lines: 32-38

### Reading values from the AnalogPotentiometer

The scaled value can be read by simply calling the :code:`get` method:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analogpotentiometer/Robot.java
      :language: java
      :lines: 40-41

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/AnalogPotentiometer/cpp/Robot.cpp
      :language: c++
      :lines: 21-22

## Using AnalogPotentiometers in code

Analog sensors can be used in code much in the way other sensors that measure the same thing can be.  If the analog sensor is a potentiometer measuring an arm angle, it can be used similarly to an :doc:`encoder <encoders-software>`.  If it is an ultrasonic sensor, it can be used similarly to other :doc:`ultrasonics <ultrasonics-software>`.

It is very important to keep in mind that actual, physical potentiometers generally have a limited range of motion.  Safeguards should be present in both the physical mechanism and the code to ensure that the mechanism does not break the sensor by traveling past its maximum throw.
