Accelerometers - Hardware
==========================

Accelerometers are common sensors used to measure acceleration.

In principle, precise measurements of acceleration can be double-integrated and used to track position (similarly to how the measurement of turn rate from a gyroscope can be integrated to determine heading) - however, in practice, accelerometers that are available within the legal FRC price range are not nearly accurate for this use.  However, accelerometers are still useful for a number of tasks in FRC.

The roboRIO comes with a built-in three-axis accelerometer that all teams can use, however teams seeking more-precise measurements may purchase and use a peripheral accelerometer, as well.

Several popular FRC devices (known as "inertial measurement units," or "IMUs") combine both an accelerometer and a gyroscope.  Popular FRC example include:

  - `Analog Devices ADIS16448 and ADIS 16470 IMUs <https://www.analog.com/en/landing-pages/001/first.html>`__
  - `CTRE Pigeon IMU <http://www.ctr-electronics.com/gadgeteer-imu-module-pigeon.html>`__
  - `Kauai Labs NavX <https://pdocs.kauailabs.com/navx-mxp/>`__

Types of accelerometers
-----------------------

There are three types of accelerometers commonly-used in FRC: single-axis accelerometers, multi-axis accelerometers and IMUs.

Single-axis accelerometers
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/accelerometers-hardware/adxl-001-evaluation-board.jpg

As per their name, single-axis accelerometers measure acceleration along a single axis.  This axis is generally specified on the physical device, and mounting the device in the proper orientation so that the desired axis is measured is highly important.  Single-axis accelerometers generally output an analog voltage corresponding to the measured acceleration, and so connect to the roboRIO's :doc:`analog input <analog-inputs-hardware>` ports.

Multi-axis accelerometers
^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/accelerometers-hardware/adafruit-1413-3-axis-acclerometer.jpg

Multi-axis accelerometers measure acceleration along all multiple spacial axes.  The roboRIO's built-in accelerometer is a three-axis accelerometer.

Peripheral multi-axis accelerometers may simply output multiple analog voltages (and thus connect to the :ref:`analog input ports <docs/hardware/sensors/analog-inputs-hardware:Connecting a sensor to multiple analog input ports>`, or (more commonly) they may communicate with one of the roboRIO's :doc:`serial buses <serial-buses>`.

IMUs (Inertial Measurement Units)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/accelerometers-hardware/ctre-pigion-imu.png

IMUs, or inertial measurement units, are a type of sensor that often combines a gyroscope and accelerometer. There are a variety of IMUs available for FRC teams, such as the `Analog Devices ADIS16448 IMU MXP <https://ez.analog.com/b/engineering-mind/posts/adis16448-imu-mxp-board-for-first-robotics>`__, which has historically been available via FIRST Choice. Another option is the `CTRE Gadgeteer Pigeon IMU <https://www.ctr-electronics.com/gadgeteer-imu-module-pigeon.html>`__ which connects via the CAN bus.
