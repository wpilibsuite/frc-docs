Step 1: Creating Simulated Instances of Hardware
================================================
The WPILib simulation framework contains several ``XXXSim`` classes, where ``XXX`` represents physical hardware such as encoders or gyroscopes. These simulation classes can be used to set positions and velocities (for encoders) and angles (for gyroscopes) from a model of your drivetrain. See :ref:`the Device Simulation article<docs/software/wpilib-tools/robot-simulation/device-sim:Device Simulation>` for more info about these simulation hardware classes and simulation of vendor devices.

.. note:: Simulation objects associated with a particular subsystem should live in that subsystem. An example of this is in the ``StateSpaceDriveSimulation`` (`Java <https://github.com/wpilibsuite/allwpilib/blob/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/statespacedifferentialdrivesimulation/subsystems/DriveSubsystem.java>`__, `C++ <https://github.com/wpilibsuite/allwpilib/blob/main/wpilibcExamples/src/main/cpp/examples/StateSpaceDifferentialDriveSimulation/cpp/subsystems/DriveSubsystem.cpp>`__) example.

Simulating Encoders
-------------------
The ``EncoderSim`` class allows users to set encoder positions and velocities on a given ``Encoder`` object. When running on real hardware, the ``Encoder`` class interacts with real sensors to count revolutions (and convert them to distance units automatically if configured to do so); however, in simulation there are no such measurements to make. The ``EncoderSim`` class can accept these simulated readings from a model of your drivetrain.

.. note:: It is not possible to simulate encoders that are directly connected to CAN motor controllers using WPILib classes. For more information about your specific motor controller, please read your vendor's documentation.

.. tabs::
   .. code-tab:: java

      // These represent our regular encoder objects, which we would
      // create to use on a real robot.
      private Encoder m_leftEncoder = new Encoder(0, 1);
      private Encoder m_rightEncoder = new Encoder(2, 3);

      // These are our EncoderSim objects, which we will only use in
      // simulation. However, you do not need to comment out these
      // declarations when you are deploying code to the roboRIO.
      private EncoderSim m_leftEncoderSim = new EncoderSim(m_leftEncoder);
      private EncoderSim m_rightEncoderSim = new EncoderSim(m_rightEncoder);

   .. code-tab:: c++

      #include <frc/Encoder.h>
      #include <frc/simulation/EncoderSim.h>

      ...

      // These represent our regular encoder objects, which we would
      // create to use on a real robot.
      frc::Encoder m_leftEncoder{0, 1};
      frc::Encoder m_rightEncoder{2, 3};

      // These are our EncoderSim objects, which we will only use in
      // simulation. However, you do not need to comment out these
      // declarations when you are deploying code to the roboRIO.
      frc::sim::EncoderSim m_leftEncoderSim{m_leftEncoder};
      frc::sim::EncoderSim m_rightEncoderSim{m_rightEncoder};

Simulating Gyroscopes
---------------------
Similar to the ``EncoderSim`` class, simulated gyroscope classes also exist for commonly used WPILib gyros -- ``AnalogGyroSim`` and ``ADXRS450_GyroSim``. These are also constructed in the same manner.

.. note:: It is not possible to simulate certain vendor gyros (i.e. Pigeon IMU and NavX) using WPILib classes. Please read the respective vendors' documentation for information on their simulation support.

.. tabs::
   .. code-tab:: java

      // Create our gyro object like we would on a real robot.
      private AnalogGyro m_gyro = new AnalogGyro(1);

      // Create the simulated gyro object, used for setting the gyro
      // angle. Like EncoderSim, this does not need to be commented out
      // when deploying code to the roboRIO.
      private AnalogGyroSim m_gyroSim = new AnalogGyroSim(m_gyro);

   .. code-tab:: c++

      #include <frc/AnalogGyro.h>
      #include <frc/simulation/AnalogGyroSim.h>

      ...

      // Create our gyro objectl ike we would on a real robot.
      frc::AnalogGyro m_gyro{1};

      // Create the simulated gyro object, used for setting the gyro
      // angle. Like EncoderSim, this does not need to be commented out
      // when deploying code to the roboRIO.
      frc::sim::AnalogGyroSim m_gyroSim{m_gyro};
