.. include:: <isonum.txt>

# Digital Inputs - Software

.. note:: This section covers digital inputs in software.  For a hardware guide to digital inputs, see :ref:`docs/hardware/sensors/digital-inputs-hardware:Digital Inputs - Hardware`.

The roboRIO's FPGA supports up to 26 digital inputs.  10 of these are made available through the built-in DIO ports on the RIO itself, while the other 16 are available through the :term:`MXP` breakout port.

Digital inputs read one of two states - "high" or "low."  By default, the built-in ports on the RIO will read "high" due to internal pull-up resistors (for more information, see :ref:`docs/hardware/sensors/digital-inputs-hardware:Digital Inputs - Hardware`).  Accordingly, digital inputs are most-commonly used with switches of some sort.  Support for this usage is provided through the :code:`DigitalInput` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/DigitalInput.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_digital_input.html)).

## The DigitalInput class

A :code:`DigitalInput` can be initialized as follows:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/digitalinput/Robot.java
      :language: java
      :lines: 15-16

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/DigitalInput/cpp/Robot.cpp
      :language: c++
      :lines: 21-22

### Reading the value of the DigitalInput

The state of the :code:`DigitalInput` can be polled with the :code:`get` method:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/digitalinput/Robot.java
      :language: java
      :lines: 20-21

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/DigitalInput/cpp/Robot.cpp
      :language: c++
      :lines: 15-17

## Creating a DigitalInput from an AnalogInput

.. note:: An :code:`AnalogTrigger` constructed with a port number argument can share that analog port with a separate :code:`AnalogInput`, but two `AnalogInput` objects may not share the same port.

Sometimes, it is desirable to use an analog input as a digital input.  This can be easily achieved using the :code:`AnalogTrigger` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/AnalogTrigger.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_analog_trigger.html)).

An :code:`AnalogTrigger` may be initialized as follows.  As with :code:`AnalogPotentiometer`, an :code:`AnalogInput` may be passed explicitly if the user wishes to customize the sampling settings:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analogtrigger/Robot.java
      :language: java
      :lines: 16-22

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/AnalogTrigger/cpp/Robot.cpp
      :language: c++
      :lines: 27-33

### Setting the trigger points

.. note:: For details on the scaling of "raw" :code:`AnalogInput` values, see :doc:`analog-inputs-software`.

To convert the analog signal to a digital one, it is necessary to specify at what values the trigger will enable and disable.  These values may be different to avoid "dithering" around the transition point:

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/analogtrigger/Robot.java
      :language: java
      :lines: 26-31

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/AnalogTrigger/cpp/Robot.cpp
      :language: c++
      :lines: 16-23

## Using DigitalInputs in code

As almost all switches on the robot will be used through a :code:`DigitalInput`. This class is extremely important for effective robot control.

### Limiting the motion of a mechanism

Nearly all motorized mechanisms (such as arms and elevators) in FRC\ |reg| should be given some form of "limit switch" to prevent them from damaging themselves at the end of their range of motions. For an example of this, see :doc:`/docs/software/hardware-apis/sensors/limit-switch`.

### Homing a mechanism

Limit switches are very important for being able to "home" a mechanism with an encoder.  For an example of this, see :ref:`docs/software/hardware-apis/sensors/encoders-software:Homing a mechanism`.
