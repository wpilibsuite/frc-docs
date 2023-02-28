Pneumatics APIs
===============

.. toctree::
   :maxdepth: 1

   solenoids
   pressure

Using the FRC Control System to Control Pneumatics
--------------------------------------------------

There are two options for operating solenoids to control pneumatic cylinders, the CTRE Pneumatics Control Module and the REV Robotics Pneumatics Hub.

.. image:: /docs/controls-overviews/images/control-system-hardware/pneumatics-control-module.png
    :alt: The Pneumatics Control Module (PCM)
    :width: 400

The CTRE Pneumatics Control Module (PCM) is a CAN-based device that provides control over the compressor and up to 8 solenoids per module.

.. image:: /docs/controls-overviews/images/control-system-hardware/pneumatic-hub.png
    :alt: The Pneumatic Hub (PH)
    :width: 400

The REV Pneumatic Hub (PH) is a CAN-based device that provides control over the compressor and up to 16 solenoids per module.

These devices are integrated into WPILib through a series of classes that make them simple to use. The closed loop control of the Compressor and Pressure switch is handled by the PCM hardware and the Solenoids are handled by the ``Solenoid`` class that controls the solenoid channels.

These modules are responsible for regulating the robot's pressure using a pressure switch and a compressor and switching solenoids on and off. They communicate with the roboRIO over CAN. For more information, see :doc:`/docs/controls-overviews/control-system-hardware`.

Module Numbers
--------------

CAN Devices are identified by their CAN ID. The default CAN ID for PCMs is 0. The default CAN ID for PHs is 1. If using a single module on the bus it is recommended to leave it at the default CAN ID. Additional modules can be used where the modules corresponding solenoids are differentiated by the module number in the constructors of the ``Solenoid``, ``DoubleSolenoid`` and ``Compressor`` classes.
