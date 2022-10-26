Debouncer
=========

A debouncer is a filter used to eliminate unwanted quick on/off cycles (termed "bounces," originally from the physical vibrations of a switch as it is thrown). These cycles are usually due to a sensor error like noise or reflections and not the actual event the sensor is trying to record.

Debouncing is implemented in WPILib by the ``Debouncer`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/filter/Debouncer.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_debouncer.html>`__), which filters a boolean stream so that the output only changes if the input sustains a change for some nominal time period.

Modes
-----

The WPILib ``Debouncer`` can be configured in three different modes:

  * Rising (default): Debounces rising edges (transitions from `false` to `true`) only.
  * Falling: Debounces falling edges (transitions from `true` to `false`) only.
  * Both: Debounces all transitions.

Usage
-----

.. tabs::

  .. code-tab:: java

    // Initializes a DigitalInput on DIO 0
    DigitalInput input = new DigitalInput(0);

    // Creates a Debouncer in "both" mode.
    Debouncer m_debouncer = new Debouncer(0.1, Debouncer.DebounceType.kBoth);

    // So if currently false the signal must go true for at least .1 seconds before being read as a True signal.
    if (m_debouncer.calculate(input.get())) {
        // Do something now that the DI is True.
    }

  .. code-tab:: c++

    // Initializes a DigitalInput on DIO 0
    frc::DigitalInput input{0};

    // Creates a Debouncer in "both" mode.
    frc::Debouncer m_debouncer{100_ms, frc::Debouncer::DebounceType::kBoth};

    // So if currently false the signal must go true for at least .1 seconds before being read as a True signal.
    if (m_debouncer.calculate(input.Get())) {
        // Do something now that the DI is True.
    }
