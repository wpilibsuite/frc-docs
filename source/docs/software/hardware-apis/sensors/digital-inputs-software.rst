.. include:: <isonum.txt>

Digital Inputs - Software
=========================

.. note:: This section covers digital inputs in software.  For a hardware guide to digital inputs, see :ref:`docs/hardware/sensors/digital-inputs-hardware:Digital Inputs - Hardware`.

The roboRIO's FPGA supports up to 26 digital inputs.  10 of these are made available through the built-in DIO ports on the RIO itself, while the other 16 are available through the MXP breakout port.

Digital inputs read one of two states - "high" or "low."  By default, the built-in ports on the RIO will read "high" due to internal pull-up resistors (for more information, see :ref:`docs/hardware/sensors/digital-inputs-hardware:Digital Inputs - Hardware`).  Accordingly, digital inputs are most-commonly used with switches of some sort.  Support for this usage is provided through the :code:`DigitalInput` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/DigitalInput.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_digital_input.html>`__).

The DigitalInput class
----------------------

A :code:`DigitalInput` can be initialized as follows:

.. tabs::

    .. code-tab:: java

        // Initializes a DigitalInput on DIO 0
        DigitalInput input = new DigitalInput(0);

    .. code-tab:: c++

        // Initializes a DigitalInput on DIO 0
        frc::DigitalInput input{0};

Reading the value of the DigitalInput
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The state of the :code:`DigitalInput` can be polled with the :code:`get` method:

.. tabs::

    .. code-tab:: java

        // Gets the value of the digital input.  Returns true if the circuit is open.
        input.get();

    .. code-tab:: c++

        // Gets the value of the digital input.  Returns true if the circuit is open.
        input.Get();

Creating a DigitalInput from an AnalogInput
-------------------------------------------

.. note:: An :code:`AnalogTrigger` constructed with a port number argument can share that analog port with a separate :code:`AnalogInput`, but two `AnalogInput` objects may not share the same port.

Sometimes, it is desirable to use an analog input as a digital input.  This can be easily achieved using the :code:`AnalogTrigger` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/AnalogTrigger.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_analog_trigger.html>`__).

An :code:`AnalogTrigger` may be initialized as follows.  As with :code:`AnalogPotentiometer`, an :code:`AnalogInput` may be passed explicitly if the user wishes to customize the sampling settings:

.. tabs::

    .. code-tab:: java

        // Initializes an AnalogTrigger on port 0
        AnalogTrigger trigger0 = new AnalogTrigger(0);

        // Initializes an AnalogInput on port 1 and enables 2-bit oversampling
        AnalogInput input = new AnalogInput(1);
        input.setAverageBits(2);

        // Initializes an AnalogTrigger using the above input
        AnalogTrigger trigger1 = new AnalogTrigger(input);

    .. code-tab:: c++

        // Initializes an AnalogTrigger on port 0
        frc::AnalogTrigger trigger0{0};

        // Initializes an AnalogInput on port 1 and enables 2-bit oversampling
        frc::AnalogInput input{1};
        input.SetAverageBits(2);

        // Initializes an AnalogTrigger using the above input
        frc::AnalogTrigger trigger1{input};

Setting the trigger points
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: For details on the scaling of "raw" :code:`AnalogInput` values, see :doc:`analog-inputs-software`.

To convert the analog signal to a digital one, it is necessary to specify at what values the trigger will enable and disable.  These values may be different to avoid "dithering" around the transition point:

.. tabs::

    .. code-tab:: java

        // Sets the trigger to enable at a raw value of 3500, and disable at a value of 1000
        trigger.setLimitsRaw(1000, 3500);

        // Sets the trigger to enable at a voltage of 4 volts, and disable at a value of 1.5 volts
        trigger.setLimitsVoltage(1.5, 4);

    .. code-tab:: c++

        // Sets the trigger to enable at a raw value of 3500, and disable at a value of 1000
        trigger.SetLimitsRaw(1000, 3500);

        // Sets the trigger to enable at a voltage of 4 volts, and disable at a value of 1.5 volts
        trigger.SetLimitsVoltage(1.5, 4);

Using DigitalInputs in code
---------------------------

As almost all switches on the robot will be used through a :code:`DigitalInput`. This class is extremely important for effective robot control.

Limiting the motion of a mechanism
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nearly all motorized mechanisms (such as arms and elevators) in FRC\ |reg| should be given some form of "limit switch" to prevent them from damaging themselves at the end of their range of motions.  A short example is given below:

.. tabs::

    .. code-tab:: java

        Spark spark = new Spark(0);

        // Limit switch on DIO 2
        DigitalInput limit = new DigitalInput(2);

        public void autonomousPeriodic() {
            // Runs the motor forwards at half speed, unless the limit is pressed
            if(!limit.get()) {
                spark.set(.5);
            } else {
                spark.set(0);
            }
        }

    .. code-tab:: c++

        // Motor for the mechanism
        frc::Spark spark{0};

        // Limit switch on DIO 2
        frc::DigitalInput limit{2};

        void AutonomousPeriodic() {
            // Runs the motor forwards at half speed, unless the limit is pressed
            if(!limit.Get()) {
                spark.Set(.5);
            } else {
                spark.Set(0);
            }
        }

Homing a mechanism
^^^^^^^^^^^^^^^^^^

Limit switches are very important for being able to "home" a mechanism with an encoder.  For an example of this, see :ref:`docs/software/hardware-apis/sensors/encoders-software:Homing a mechanism`.
