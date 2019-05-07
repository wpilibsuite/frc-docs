Pneumatics Control Module
=========================

The Pneumatics Control Module (PCM) is a CAN-based device that provides complete control over the compressor and up to 8 solenoids per module. The PCM is integrated into WPILib through a series of classes that make it simple to use.

The closed loop control of the Compressor and Pressure switch is handled by the :code:`Compressor` class (`Java <http://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/Compressor.html>`__, `C++ <http://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1Compressor.html>`__), and the Solenoids are handled by the :code:`Solenoid` (`Java <http://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/Solenoid.html>`__, `C++ <http://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1Solenoid.html>`__) and :code:`DoubleSolenoid` (`Java <http://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/DoubleSolenoid.html>`__, `C++ <http://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1DoubleSolenoid.html>`__) classes.

An additional PCM module can be used where the modules corresponding solenoids are differentiated by the module number in the constructors of the Solenoid and Compressor classes.

For more information on controlling the compressor, see Operating a Compressor for Pneumatics (TODO: link!).

For more information on controlling solenoids, see :ref:`Operating Pneumatic Cylinders <operating-pneumatic-cylinders>`.

