Accelerometers - Hardware
==========================

Accelerometers are common sensors used to measure acceleration.

In principle, precise measurements of acceleration can be double-integrated and used to track position (similarly to how the measurement of turn rate from a gyroscope can be integrated to determine heading) - however, in practice, accelerometers that are available within the legal FRC price range are not nearly accurate for this use.  However, accelerometers are still useful for a number of tasks in FRC.

The RoboRIO comes with a built-in three-axis accelerometer that all teams can use, however teams seeking more-precise measurements may purchase and use a peripheral accelerometer, as well.

Several popular FRC devices (known as "inertial measurement units," or "IMUs") combine both an accelerometer and a gyroscope.  Two popular examples are the `Kauai Labs NavX <https://pdocs.kauailabs.com/navx-mxp/>`__ and the `CTRE Pigeon IMU <http://www.ctr-electronics.com/gadgeteer-imu-module-pigeon.html>`__.

Types of accelerometers
-----------------------

There are two types of accelerometers commonly-used in FRC: single-axis accelerometers, and three-axis accelerometers.

Single-axis accelerometers
^^^^^^^^^^^^^^^^^^^^^^^^^^

As per their name, single-axis accelerometers measure acceleration along a single axis.  This axis is generally specified on the physical device, and mounting the device in the proper orientation so that the desired axis is measured is highly important.  Single-axis accelerometers generally output an analog voltage corresponding to the measured acceleration, and so connect to the RoboRIO's :doc:`analog input <analog-inputs-hardware>` ports.

Three-axis accelerometers
^^^^^^^^^^^^^^^^^^^^^^^^^

Three-axis accelerometers measure acceleration along all three spacial axes (typically labeled x, y, and z).  The RoboRIO's built-in accelerometer is a three-axis accelerometer.

Peripheral three-axis accelerometers may simply output three analog voltages (and thus connect to the :ref:`analog input ports <docs/hardware/analog-inputs-hardware:Connecting a sensor to multiple analog input ports>`, or (more commonly) they may communicate with one of the RoboRIO's :doc:`serial buses <serial-buses>`.
