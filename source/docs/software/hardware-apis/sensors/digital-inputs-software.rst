.. include:: <isonum.txt>

# Digital Inputs - Software

.. note:: This section covers digital inputs in software.  For a hardware guide to digital inputs, see :ref:`docs/hardware/sensors/digital-inputs-hardware:Digital Inputs - Hardware`.

The Systemcore's Smart I/O supports up to 6 digital input channels.

Digital inputs read one of two states - "high" or "low."  By default, the built-in ports on the RIO will read "low" due to internal pull-up resistors (for more information, see :ref:`docs/hardware/sensors/digital-inputs-hardware:Digital Inputs - Hardware`).  Accordingly, digital inputs are most-commonly used with switches of some sort.  Support for this usage is provided through the :code:`DigitalInput` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/wpilibj/DigitalInput.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/classfrc_1_1_digital_input.html)).

.. warning:: The roboRIO had pull-up resistors instead of pull-down resistors, so the behavior of the Smart I/O ports is different from that of the roboRIO's digital input ports.  This means that sensors designed for the roboRIO's digital input ports may different wiring for the Smart I/O ports.

## The DigitalInput class

A :code:`DigitalInput` can be initialized as follows:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/digitalinput/Robot.java
      :language: java
      :lines: 15-16

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/snippets/DigitalInput/cpp/Robot.cpp
      :language: c++
      :lines: 21-22

### Reading the value of the DigitalInput

The state of the :code:`DigitalInput` can be polled with the :code:`get` method:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/digitalinput/Robot.java
      :language: java
      :lines: 20-21

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/snippets/DigitalInput/cpp/Robot.cpp
      :language: c++
      :lines: 15-17

## Creating a DigitalInput from an AnalogInput

.. note:: Analog Triggers are not supported on Systemcore.

## Using DigitalInputs in code

As almost all switches on the robot will be used through a :code:`DigitalInput`. This class is extremely important for effective robot control.

### Limiting the motion of a mechanism

Nearly all motorized mechanisms (such as arms and elevators) in FRC\ |reg| should be given some form of "limit switch" to prevent them from damaging themselves at the end of their range of motions. For an example of this, see :doc:`/docs/software/hardware-apis/sensors/limit-switch`.

### Homing a mechanism

Limit switches are very important for being able to "home" a mechanism with an encoder.  For an example of this, see :ref:`docs/software/hardware-apis/sensors/encoders-software:Homing a mechanism`.
