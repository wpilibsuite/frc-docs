Counters
========

|Counters|

The :code:`Counter` class (Java, C++) is a versatile class that allows the counting of pulse edges on a digital input.  :code:`Counter` is used as a component in several more-complicated WPILib classes (such as :ref:`Encoder <encoders-software>` and :ref:`Ultrasonic <ultrasonics-software>`), but is also quite useful on its own.

.. note:: There are a total of 8 counter units in the RoboRIO FPGA, meaning no more than 8 :code:`Counter` objects may be instantiated at any one time, including those contained as resources in other WPILib objects.  For detailed information on when a :code:`Counter` may be used by another object, refer to the official API documentation.

Counter Modes
-------------

The :code:`Counter` object may be configured to operate in one of four different modes:

1. `Two-pulse mode`_: Counts up and down based on the edges of two different channels.
2. `Semi-period mode`_: Measures the duration of a pulse on a single channel.
3. `Pulse-length mode`_: Counts up and down based on the edges of one channel, with the direction determined by the duration of the pulse on that channel.
4. `External direction mode`_: Counts up and down based on the edges of one channel, with a separate channel specifying the direction.

.. note:: In all modes except semi-period mode, the counter can be configured to increment either once per edge (2X encoding), or once per pulse (1X encoding).  By default, ??? will be used (TODO: figure this out).

Two-pulse mode
~~~~~~~~~~~~~~

In two-pulse mode, the :code:`Counter` will count for every edge/pulse on the specified "up channel," and down for every edge/pulse on the specified "down channel."  A counter can be initialized in two-pulse with the following code:

.. tabs::

    .. code-tab:: c++

        // Create a new Counter object in two-pulse mode
        frc::Counter counter{frc::Counter::Mode::k2Pulse};

        void frc::Robot::RobotInit() {
            // Set up the input channels for the counter
            counter.SetUpSource(1);
            counter.SetDownSource(2);

            // Set the encoding type to 2X
            counter.SetUpSourceEdge(true, true);
            counter.SetDownSourceEdge(true, true);

    .. code-tab:: java

    // Create a new Counter object in two-pulse mode
    Counter counter = new Counter(Counter.Mode.k2Pulse);

    @Override
    public void robotInit() {
        // Set up the input channels for the counter
        counter.setUpSource(1);
        counter.setDownSource(2);

        // Set the encoding type to 2X
        counter.setUpSourceEdge(true, true);
        counter.setDownSourceEdge(true, true);
    }


.. |Counters| image:: images/counters/counters.png