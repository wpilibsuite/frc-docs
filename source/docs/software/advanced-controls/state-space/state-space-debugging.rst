Debugging State-Space Models and Controllers
============================================

Checking Signs
--------------

One of the most common causes of bugs with state-space controllers is signs being flipped. For example, models included in WPILib expect positive voltage to result in a positive acceleration, and vice versa. If applying a positive voltage does not make the mechanism accelerate forwards, or if moving "forwards" makes encoder (or other sensor readings) decrease, they should be inverted so that positive voltage input results in a positive encoder reading. For example, if I apply an :term:`input` of :math:`[12, 12]^T` (full forwards for the left and right motors) to my differential drivetrain, my wheels should propel my robot "forwards" (along the +X axis locally), and for my encoders to read a positive velocity.

.. important::
    The WPILib DifferentialDrive by default inverts the right motors. This behavior can be changed by calling ``setRightSideInverted(false)``/``SetRightSideInverted(false)`` (Java/C++) on the DifferentialDrive object.

The Importance of Graphs
------------------------

Reliable data of the :term:`system's <system>` :term:`state`\s, :term:`input`\s and :term:`output`\s over time is important when debugging state-space controllers and observers. One common approach is to send this data over NetworkTables and use tools such as :ref:`Shuffleboard <docs/software/wpilib-tools/shuffleboard/index:Shuffleboard>`, which allow us to both graph the data in real-time as well as save it to a CSV file for plotting later with tools such as Google Sheets, Excel or Python.

.. note:: By default, NetworkTables is limited to a 10hz update rate. For testing and debugging state-space systems, this can be bypassed with the following code snippet to submit data at up to 100hz:

.. tabs::

    .. code-tab:: java

        NetworkTableInstance.getDefault().flush();

    .. code-tab:: c++

        NetworkTableInstance::GetDefault().Flush();

This will send extra data (at up to 100hz) over NetworkTables, which can cause lag with both user code and robot dashboards. It is often a good idea to disable this during competitions.

