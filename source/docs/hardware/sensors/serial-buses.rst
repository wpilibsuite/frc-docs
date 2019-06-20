Serial Buses
============

In addition to the :doc:`digital <digital-inputs-hardware>` and :doc:`analog <analog-inputs-hardware>` inputs, the RoboRIO also offers several methods of serial communication with peripheral devices.

Both the digital and analog inputs are highly limited in the amount of data that can be send over them.  Serial buses allow users to make use of far more-robust and higher-bandwidth communications protocols with sensors that collect large amounts of data, such as inertial measurement units (IMUs) or 2D LIDAR sensors.

Types of supported serial buses
-------------------------------

The RoboRIO supports three basic types of serial communications:

- `I2C`_
- `SPI`_
- `RS232`_
- `USB`_

Additionally, the RoboRIO supports communications with peripheral devices over the CAN bus.  However, as the FRC CAN protocol is quite idiosyncratic, relatively few peripheral sensors support it (though it is heavily used for motor controllers).

I2C
^^^

|RoboRIO I2C| |I2C Pinout|

To communicate to peripheral devices over I2C, each pin should be wired to its corresponding pin on the device.  I2C allows users to wire a "chain" of slave devices to a single port, so long as those devices have separate IDs set.

The I2C bus can also be used through the `MXP expansion port`_.

SPI
^^^

|RoboRIO SPI| |SPI Pinout|

To communicate to peripheral devices over SPI, each pin should be wired to its corresponding pin on the device.  The SPI port supports communications to up to four devices (corresponding to the CS 0-3 pins on the diagram above).

The SPI bus can also be used through the `MXP expansion port`_.

RS232
^^^^^

|RoboRIO RS232| |RS232 Pinout|

To communicate to peripheral devices over RS232, each pin should be wired to its corresponding pin on the device.

The RS232 bus can also be used through the `MXP expansion port`_.

USB
^^^

|RoboRIO USB|

The RoboRIO has three USB ports: 1x USB-B, and 2x USB-A.  These can be connected to devices with standard USB cables.

MXP expansion port
------------------

|RoboRIO MXP| |MXP Pinout|

Several of the serial buses are also available for use through the RoboRIO's MXP expansion port.  This port allows users to make use of many additional :doc:`digital <digital-inputs-hardware>` and :doc:`analog <analog-inputs-hardware>` inputs, as well as the various serial buses.

Many peripheral devices attach directly to the MXP port for convenience, requiring no wiring on the part of the user.

.. |RoboRIO I2C| image:: images/serial-buses/roborio-i2c.png
   :width: 40%
.. |I2C Pinout| image:: images/serial-buses/i2c-pinout.png
   :width: 40%
.. |RoboRIO SPI| image:: images/serial-buses/roborio-spi.png
   :width: 40%
.. |SPI Pinout| image:: images/serial-buses/spi-pinout.png
   :width: 40%
.. |RoboRIO RS232| image:: images/serial-buses/roborio-rs232.png
   :width: 40%
.. |RS232 Pinout| image:: images/serial-buses/rs232-pinout.png
   :width: 40%
.. |RoboRIO USB| image:: images/serial-buses/roborio-usb.png
.. |RoboRIO MXP| image:: images/serial-buses/roborio-mxp.png
   :width: 40%
.. |MXP Pinout| image:: images/serial-buses/mxp-pinout.png
   :width: 40%
