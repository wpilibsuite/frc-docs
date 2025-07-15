# Analog Inputs - Hardware

.. note:: This section covers analog input hardware.  For a software guide to analog inputs, see :ref:`docs/software/hardware-apis/sensors/analog-inputs-software:Analog Inputs - Software`.

An [analog signal](https://en.wikipedia.org/wiki/Analog_signal) is a signal whose value can lie anywhere in a continuous interval.  This lies in stark contrast to a :doc:`digital signal <digital-inputs-hardware>`, which can take only one of several discrete values.  The Systemcore's analog input ports allow the measurement of analog signals with values from 0V to 3.3V.

.. important:: Systemcore Analog Inputs are 3.3 volts, whereas the roboRIO was 5 volts.

In practice, there is no way to measure a "true" analog signal with a digital device such as a computer (like the Systemcore).  Accordingly, the analog inputs are actually measured as a 12-bit digital signal - however, this is quite a high resolution [1]_.

Analog inputs are typically used with sensors that produce continuously varying measurements. :doc:`Potentiometers <analog-potentiometers-hardware>` are a good example, as they can communicate by outputting a voltage proportional to their measurements.

## Connecting to Systemcore analog input ports

.. warning:: Always consult the technical specifications of the sensor you are using *before* wiring the sensor, to ensure that the correct wire is being connected to each pin.  Failure to do so can result in damage to the sensor or the RIO.

.. warning:: **Never** directly connect the power pin to the ground pin on any port on the Systemcore!  This will trigger protection features on the Systemcore and may result in unexpected behavior.

.. image:: images/systemcore/systemcore-smartio.png
   :alt: The Systemcore, with the location of the Smart I/O ports highlighted.

The Systemcore has 6 Smart I/O ports (numbered 0-5), as seen in the image above.  Each port has three pins - signal, power ("3.3V"), and ground ("gnd").  The "power" and "ground" pins are used to power the peripheral sensors that connect to the analog input ports - there is a constant 3.3V potential difference between the "power" and the "ground" pins [2]_.  The signal pin is the pin on which the signal is actually measured.

### Connecting a sensor to a single analog input port

.. note:: Some sensors (such as :doc:`potentiometers <analog-potentiometers-hardware>`) may have interchangeable power and ground connections.

Most analog sensors will have three wires - signal, power, and ground - corresponding precisely to the three pins of the Smart  I/O ports. They should be connected accordingly.

.. image:: images/accelerometers-hardware/adxl193-single-axis-accelerometer-to-roborio.svg
   :alt: Hooking a ADXL193 single axis accelerometer to an analog input on the roboRIO.

.. todo:: Update above image to use the Systemcore Smart I/O ports.

### Connecting a sensor to multiple analog input ports

Some sensors may need to connect to multiple analog input ports in order to function.  In general, these sensors will only ever require a single power and a single ground pin - only the signal pin of the additional port(s) will be needed. The image below is shows an analog accelerometer that requires three analog input ports, but similar wiring can be used for analog sensors requiring two analog input ports.

.. image:: images/analog-inputs-hardware/triple-axis-accelerometer-to-roborio.svg
   :alt: Hooking a triple axis accelerometer to three different analog input channels of the roboRIO.

.. todo:: Update above image to use the Systemcore Smart I/O ports.

## Footnotes

.. [1] A 12-bit resolution yields $2^{12}$, or 4096 different values.  For a 3.3V range, that's an effective resolution of approximately 0.8 mV, or .0008V.  The actual accuracy of the measurement will be less, so the discretization is not the limiting factor in the measurement accuracy.
.. [2] All power pins are actually connected to a single rail, as are all ground pins - there is no need to use the power/ground pins corresponding to a given signal pin.
