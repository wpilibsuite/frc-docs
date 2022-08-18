roboRIO Introduction
====================

.. image:: /docs/controls-overviews/images/control-system-hardware/roborio.png
  :width: 500

The roboRIO is designed specifically with FIRST in mind. The roboRIO has a basic architecture of a Real-Time processors + FPGA (field programmable gate array) but is more powerful, lighter, and smaller than some similar systems used in industry.

The roboRIO is a reconfigurable robotics controller that includes built-in ports for inter-integrated circuits (I2C), serial peripheral interfaces (SPI), RS232, USB, Ethernet, pulse width modulation (PWM), and relays to quickly connect the common sensors and actuators used in robotics. The controller features LEDs, buttons, an onboard accelerometer, and a custom electronics port. It has an onboard dual-core ARM real-time Cortex‑A9 processor and customizable Xilinx FPGA.

Detailed information on the roboRIO can be found in the `roboRIO User Manual <https://www.ni.com/docs/en-US/bundle/roborio-20-umanual/page/umanual.html>`__ and in the `roboRIO technical specifications <https://www.ni.com/docs/en-US/bundle/roborio-frc-specs/page/specs.html>`__.

Before deploying programs to your roboRIO, you must first :ref:`image the roboRIO <docs/zero-to-robot/step-3/imaging-your-roborio:Imaging your roboRIO>` with the FRC roboRIO Imaging Tool.
