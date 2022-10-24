Pneumatics Control Module
=========================

.. image:: /docs/controls-overviews/images/control-system-hardware/pneumatics-control-module.png
    :alt: The Pneumatics Control Module (PCM)
    :width: 400

The Pneumatics Control Module (PCM) is a CAN-based device that provides complete control over the compressor and up to 8 solenoids per module. The PCM is integrated into WPILib through a series of classes that make it simple to use.

The closed loop control of the Compressor and Pressure switch is handled by the :code:`Compressor` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj/Compressor.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_compressor.html>`__), and the Solenoids are handled by the :code:`Solenoid` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj/Solenoid.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_solenoid.html>`__) and :code:`DoubleSolenoid` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj/DoubleSolenoid.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_double_solenoid.html>`__) classes.

An additional PCM module can be used where the module's corresponding solenoids are differentiated by the module number in the constructors of the Solenoid and Compressor classes.

For more information on controlling the compressor, see :ref:`Operating a Compressor for Pneumatics <docs/software/hardware-apis/pneumatics/pneumatics:Generating and Storing Pressure>`.

For more information on controlling solenoids, see :ref:`Operating Pneumatic Cylinders <docs/software/hardware-apis/pneumatics/pneumatics:Operating pneumatic cylinders>`.
