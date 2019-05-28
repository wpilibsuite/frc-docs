Gyros - Hardware
================

Gyroscopes (or "gyros", for short) are devices that measure rate-of-rotation.  These are particularly useful for stabilizing robot driving, or for measuring heading or tilt by integrating (adding-up) the rate measurements to get a measurement of total angular displacement.

Several popular FRC devices (known as "inertial measurement units," or "IMUs") combine both an accelerometer and a gyroscope.  Two popular examples are the `Kauai Labs NavX <https://pdocs.kauailabs.com/navx-mxp/>`__ and the `CTRE Pigeon IMU <http://www.ctr-electronics.com/gadgeteer-imu-module-pigeon.html>`__.

Types of gyros
--------------

There are two types of Gyros commonly-used in FRC: single-axis gyros, and three-axis gyros.

Single-axis gyros
^^^^^^^^^^^^^^^^^

As per their name, single-axis gyros measure rotation rate around a single axis.  This axis is generally specified on the physical device, and mounting the device in the proper orientation so that the desired axis is measured is highly important.  Single-axis gyros generally output an analog voltage corresponding to the measured rate of rotation, and so connect to the RoboRIO's :doc:`analog input <analog-inputs-hardware>` ports.

Three-axis gyros
^^^^^^^^^^^^^^^^

Three-axis gyros measure rotation rate around all three spacial axes (typically labeled x, y, and z).

Peripheral three-axis gyros may simply output three analog voltages (and thus connect to the :ref:`analog input ports <docs/hardware/analog-inputs-hardware:Connecting a sensor to multiple analog input ports>`, or (more commonly) they may communicate with one of the RoboRIO's :doc:`serial buses <serial-buses>`.
