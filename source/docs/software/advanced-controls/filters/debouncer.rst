Debouncer
=========

The ``Debouncer`` class is used to filter out unwanted quick on/off cycles.  These cycles are usually due to a sensor error like noise or reflections and not the actual event the sensor is trying to record.  The ``Debouncer`` works by only recording a change in signal after that change has persisted for a specified period of time.

.. tabs::

  .. code-tab:: java

    // Initializes a DigitalInput on DIO 0
    DigitalInput input = new DigitalInput(0);

    // Creates a Debouncer.
    Debouncer m_debouncer = new Debouncer(0.1);

    // So if currently false the signal must go true for at least .1 seconds before being read as a True signal.
    if (m_debouncer.calculate(input.get())) {
        // Do something now that the DI is True.
    }

  .. code-tab:: c++

    // Initializes a DigitalInput on DIO 0
    frc::DigitalInput input{0};

    // Creates a Debouncer.
    frc::Debouncer m_debouncer{100_ms};

    // So if currently false the signal must go true for at least .1 seconds before being read as a True signal.
    if (m_debouncer.calculate(input.Get())) {
        // Do something now that the DI is True.
    }
