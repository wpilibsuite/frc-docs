Serial Buses
============

In addition to the :doc:`digital <digital-inputs-hardware>` and :doc:`analog <analog-inputs-hardware>` inputs, the roboRIO also offers several methods of serial communication with peripheral devices.

Both the digital and analog inputs are highly limited in the amount of data that can be send over them.  Serial buses allow users to make use of far more-robust and higher-bandwidth communications protocols with sensors that collect large amounts of data, such as inertial measurement units (IMUs) or 2D LIDAR sensors.

Types of supported serial buses
-------------------------------

The roboRIO supports four basic types of serial communications:

- `I2C`_
- `SPI`_
- `RS-232`_
- `USB`_

Additionally, the roboRIO supports communications with peripheral devices over the CAN bus.  However, as the FRC CAN protocol is quite idiosyncratic, relatively few peripheral sensors support it (though it is heavily used for motor controllers).

I2C
^^^

|roboRIO I2C| |I2C Pinout|

To communicate to peripheral devices over I2C, each pin should be wired to its corresponding pin on the device.  I2C allows users to wire a "chain" of slave devices to a single port, so long as those devices have separate IDs set.

The I2C bus can also be used through the `MXP expansion port`_. The I2C bus on the MXP is independent. For example, a device on the main bus can have the same ID as a device on the MXP bus.

SPI
^^^

|roboRIO SPI| |SPI Pinout|

To communicate to peripheral devices over SPI, each pin should be wired to its corresponding pin on the device.  The SPI port supports communications to up to four devices (corresponding to the Chip Select (CS) 0-3 pins on the diagram above).

The SPI bus can also be used through the `MXP expansion port`_. The MXP port provides independent clock, and input/output lines and an additional CS.

RS-232
^^^^^^

|roboRIO RS-232| |RS-232 Pinout|

To communicate to peripheral devices over RS-232, each pin should be wired to its corresponding pin on the device.

The RS-232 bus can also be used through the `MXP expansion port`_.

The RoboRIO RS-232 serial port uses RS-232 signaling levels (+/- 15v). The MXP serial port uses CMOS signaling levels (+/- 3.3v).

.. note:: By default, the onboard RS-232 port is utilized by the roboRIO's serial console. In order to use it for an external device, the serial console must be disabled using the :ref:`Imaging Tool <docs/getting-started/getting-started-frc-control-system/imaging-your-roborio:Imaging your roboRIO>` or :ref:`docs/hardware/roborio-info/roborio-web-dashboard:roboRIO Web Dashboard`.

USB
^^^

|roboRIO USB|

The roboRIO has three USB ports: 1x USB-B, and 2x USB-A.  These can be connected to devices with standard USB cables.

MXP expansion port
------------------

|roboRIO MXP| |MXP Pinout|

Several of the serial buses are also available for use through the roboRIO's MXP expansion port.  This port allows users to make use of many additional :doc:`digital <digital-inputs-hardware>` and :doc:`analog <analog-inputs-hardware>` inputs, as well as the various serial buses.

Many peripheral devices attach directly to the MXP port for convenience, requiring no wiring on the part of the user.

.. |roboRIO I2C| image:: images/serial-buses/roborio-i2c.png
   :width: 40%
.. |I2C Pinout| image:: images/serial-buses/i2c-pinout.png
   :width: 40%
.. |roboRIO SPI| image:: images/serial-buses/roborio-spi.png
   :width: 40%
.. |SPI Pinout| image:: images/serial-buses/spi-pinout.png
   :width: 40%
.. |roboRIO RS-232| image:: images/serial-buses/roborio-rs232.png
   :width: 40%
.. |RS-232 Pinout| image:: images/serial-buses/rs232-pinout.png
   :width: 40%
.. |roboRIO USB| image:: images/serial-buses/roborio-usb.png
.. |roboRIO MXP| image:: images/serial-buses/roborio-mxp.png
   :width: 40%
.. |MXP Pinout| image:: images/serial-buses/mxp-pinout.png
   :width: 40%
