Sensor Overview - Software
==========================

.. note:: This section covers using sensors in software.  For a guide to sensor hardware, see :ref:`docs/hardware/sensors/sensor-overview-hardware:Sensor Overview - Hardware`.

.. note:: While cameras may definitely be considered "sensors", vision processing is a sufficiently-complicated subject that it is covered in :ref:`its own section <docs/software/vision-processing/introduction/strategies-for-vision-programming:Strategies for Vision Programming>`, rather than here.

In order to be effective, it is often vital for robots to be able to gather information about their surroundings.  Devices that provide feedback to the robot on the state of its environment are called "sensors."  WPILib innately supports a large variety of sensors through classes included in the library.  This section will provide a guide to both using common sensor types through WPILib, as well as writing code for sensors without official support.

What sensors does WPILIB support?
---------------------------------

The roboRIO includes a `FPGA <https://en.wikipedia.org/wiki/Field-programmable_gate_array>`__ which allows accurate real-time measuring of a variety of sensor input.  WPILib, in turn, provides a number of classes for accessing this functionality.

.. graphviz::

    graph {
        splines=ortho;
        Sensors [shape=box]
        {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 [width=0, shape=point, style=invis];}
        {rank=same; 1 -- 2 -- 3 -- 4 -- 5 -- 6;}
        Sensors -- 3
        node [shape=box]
        Accelerometer [shape=plaintext, label=<

         <table border='0' cellborder='1' cellspacing='0'>
           <tr><td><b>Accelerometer</b></td></tr>
           <tr><td>ADXL345_SPI</td></tr>
           <tr><td>ADXL345_I2C</td></tr>
           <tr><td>ADXL362</td></tr>
           <tr><td>BuiltInAccelerometer</td></tr>
         </table>
        >];
        Gyro [shape=plaintext, label=<

         <table border='0' cellborder='1' cellspacing='0'>
           <tr><td><b>Gyro</b></td></tr>
           <tr><td>AnalogGyro</td></tr>
           <tr><td>ADXRS450_GyroC</td></tr>
         </table>
        >];
        1 -- Ultrasonic
        1 -- Encoder
        2 -- Accelerometer
        3 -- AnalogInput
        4 -- DigitalInput
        6 -- AnalogPotentiometer
        6 -- Gyro
    }

WPILib provides native support for:

- :ref:`Accelerometers <docs/software/sensors/accelerometers-software:Accelerometers - Software>`
- :ref:`Gyroscopes <docs/software/sensors/gyros-software:Gyroscopes - Software>`
- :ref:`Ultrasonic rangefinders <docs/software/sensors/ultrasonics-software:Ultrasonics - Software>`
- :ref:`Potentiometers <docs/software/sensors/analog-potentiometers-software:Analog Potentiometers - Software>`
- :ref:`Counters <docs/software/sensors/counters:Counters>`
- :ref:`Quadrature encoders <docs/software/sensors/encoders-software:Encoders - Software>`
- :ref:`Limit switches <docs/software/sensors/digital-inputs-software:Digital Inputs - Software>`

Additionally, WPILib includes lower-level classes for interfacing directly with the FPGA's digital and analog inputs and outputs.
