Debugging State-Space Models and Controllers
============================================

Checking Signs
--------------

One of the most common causes of bugs with state-space controllers is signs being flipped. For example, models included in WPILib expect positive voltage to result in a positive acceleration, and vice versa. If applying a positive voltage does not make the mechanism accelerate forwards, or if moving "forwards" makes encoder (or other sensor readings) decrease, they should be inverted so that positive voltage input results in a positive encoder reading. For example, if I apply an :term:`input` of :math:`[12, 12]^T` (full forwards for the left and right motors) to my differential drivetrain, my wheels should propel my robot "forwards" (along the +X axis locally), and for my encoders to read a positive velocity.

.. important::
    The WPILib ``DifferentialDrive``, by default, does not invert any motors. You may need to call the ``setInverted(true)`` method on the motor controller object to invert so that positive input creates forward motion.

The Importance of Graphs
------------------------

Reliable data of the :term:`system's <system>` :term:`state`\s, :term:`input`\s and :term:`output`\s over time is important when debugging state-space controllers and observers. One common approach is to send this data over NetworkTables and use tools such as :ref:`Shuffleboard <docs/software/dashboards/shuffleboard/index:Shuffleboard>`, which allow us to both graph the data in real-time as well as save it to a CSV file for plotting later with tools such as Google Sheets, Excel or Python.

.. note:: By default, NetworkTables is limited to a 10hz update rate. For testing, this can be bypassed with the following code snippet to submit data at up to 100hz. This code should be run periodically to forcibly publish new data.

.. danger:: This will send extra data (at up to 100hz) over NetworkTables, which can cause lag with both user code and robot dashboards. This will also increase network utilization. It is often a good idea to disable this during competitions.

.. tabs::

   .. code-tab:: java

      @Override
      public void robotPeriodic() {
         NetworkTableInstance.getDefault().flush();
      }

   .. code-tab:: c++

      void RobotPeriodic() {
         NetworkTableInstance::GetDefault().Flush();
      }

Compensating for Input Lag
--------------------------
Often times, some sensor input data (i.e. velocity readings) may be delayed due to onboard filtering that smart motor controllers tend to perform. By default, LQR's K gain assumes no input delay, so introducing significant delay on the order of tens of milliseconds can cause instability. To combat this, the LQR's K gain can be reduced, trading off performance for stability. A code example for how to compensate for this latency in a mathematically rigorous manner is available :ref:`here <docs/software/advanced-controls/state-space/state-space-intro:LQR and Measurement Latency Compensation>`.
