Step 2: Creating a Drivetrain Model
===================================

In order to accurately determine how your physical drivetrain will respond to given motor voltage inputs, an accurate model of your drivetrain must be created. This model is usually created by measuring various physical parameters of your real robot. In WPILib, this drivetrain simulation model is represented by the ``DifferentialDrivetrainSim`` class.

Creating a ``DifferentialDrivetrainSim`` from Physical Measurements
-------------------------------------------------------------------

One way to creating a ``DifferentialDrivetrainSim`` instance is by using physical measurements of the drivetrain and robot -- either obtained through CAD software or real-world measurements (the latter will usually yield better results as it will more closely match reality). This constructor takes the following parameters:

 - The type and number of motors on one side of the drivetrain.
 - The gear ratio between the motors and the wheels as output  :term:`torque` over input  :term:`torque` (this number is usually greater than 1 for drivetrains).
 - The moment of inertia of the drivetrain (this can be obtained from a CAD model of your drivetrain. Usually, this is between 3 and 8 :math:`kg m^2`).
 - The mass of the drivetrain (it is recommended to use the mass of the entire robot itself, as it will more accurately model the acceleration characteristics of your robot for trajectory tracking).
 - The radius of the drive wheels.
 - The track width (distance between left and right wheels).
 - Standard deviations of measurement noise: this represents how much measurement noise you expect from your real sensors. The measurement noise is an array with 7 elements, with each element representing the standard deviation of measurement noise in x, y, heading, left velocity, right velocity, left position, and right position respectively. This option can be omitted in C++ or set to ``null`` in Java if measurement noise is not desirable.

You can calculate the measurement noise of your sensors by taking multiple data points of the state you are trying to measure and calculating the standard deviation using a tool like Python. For example, to calculate the standard deviation in your encoders' velocity estimate, you can move your robot at a constant velocity, take multiple measurements, and calculate their standard deviation from the known mean. If this process is too tedious, the values used in the example below should be a good representation of average noise from encoders.

.. note:: The standard deviation of the noise for a measurement has the same units as that measurement. For example, the standard deviation of the velocity noise has units of m/s.

.. note:: It is very important to use SI units (i.e. meters and radians) when passing parameters in Java. In C++, the :ref:`units library <docs/software/basic-programming/cpp-units:The C++ Units Library>` can be used to specify any unit type.

.. tabs::
   .. code-tab:: java

      // Create the simulation model of our drivetrain.
      DifferentialDrivetrainSim m_driveSim = new DifferentialDrivetrainSim(
        DCMotor.getNEO(2),       // 2 NEO motors on each side of the drivetrain.
        7.29,                    // 7.29:1 gearing reduction.
        7.5,                     // MOI of 7.5 kg m^2 (from CAD model).
        60.0,                    // The mass of the robot is 60 kg.
        Units.inchesToMeters(3), // The robot uses 3" radius wheels.
        0.7112,                  // The track width is 0.7112 meters.

        // The standard deviations for measurement noise:
        // x and y:          0.001 m
        // heading:          0.001 rad
        // l and r velocity: 0.1   m/s
        // l and r position: 0.005 m
        VecBuilder.fill(0.001, 0.001, 0.001, 0.1, 0.1, 0.005, 0.005));

   .. code-tab:: c++

      #include <frc/simulation/DifferentialDrivetrainSim.h>

      ...

      // Create the simulation model of our drivetrain.
      frc::sim::DifferentialDrivetrainSim m_driveSim{
        frc::DCMotor::GetNEO(2), // 2 NEO motors on each side of the drivetrain.
        7.29,               // 7.29:1 gearing reduction.
        7.5_kg_sq_m,        // MOI of 7.5 kg m^2 (from CAD model).
        60_kg,              // The mass of the robot is 60 kg.
        3_in,               // The robot uses 3" radius wheels.
        0.7112_m,           // The track width is 0.7112 meters.

        // The standard deviations for measurement noise:
        // x and y:          0.001 m
        // heading:          0.001 rad
        // l and r velocity: 0.1   m/s
        // l and r position: 0.005 m
        {0.001, 0.001, 0.001, 0.1, 0.1, 0.005, 0.005}};

Creating a ``DifferentialDrivetrainSim`` from SysId Gains
--------------------------------------------------------------------

You can also use the gains produced by :ref:`System Identification <docs/software/pathplanning/system-identification/introduction:Introduction to System Identification>`, which you may have performed as part of setting up the trajectory tracking workflow outlined :ref:`here <docs/software/pathplanning/trajectory-tutorial/index:Trajectory Tutorial>` to create a simulation model of your drivetrain and often yield results closer to real-world behavior than the method above.

.. important:: You must need two sets of ``Kv`` and ``Ka`` gains from the identification tool -- one from straight-line motion and the other from rotating in place. We will refer to these two sets of gains as linear and angular gains respectively.

This constructor takes the following parameters:

 - A linear system representing the drivetrain -- this can be created using the identification gains.
 - The track width (distance between the left and right wheels).
 - The type and number of motors on one side of the drivetrain.
 - The gear ratio between the motors and the wheels as output  :term:`torque` over input  :term:`torque` (this number is usually greater than 1 for drivetrains).
 - The radius of the drive wheels.
 - Standard deviations of measurement noise: this represents how much measurement noise you expect from your real sensors. The measurement noise is an array with 7 elements, with each element representing the standard deviation of measurement noise in x, y, heading, left velocity, right velocity, left position, and right position respectively. This option can be omitted in C++ or set to ``null`` in Java if measurement noise is not desirable.

You can calculate the measurement noise of your sensors by taking multiple data points of the state you are trying to measure and calculating the standard deviation using a tool like Python. For example, to calculate the standard deviation in your encoders' velocity estimate, you can move your robot at a constant velocity, take multiple measurements, and calculate their standard deviation from the known mean. If this process is too tedious, the values used in the example below should be a good representation of average noise from encoders.

.. note:: The standard deviation of the noise for a measurement has the same units as that measurement. For example, the standard deviation of the velocity noise has units of m/s.

.. note:: It is very important to use SI units (i.e. meters and radians) when passing parameters in Java. In C++, the :ref:`units library <docs/software/basic-programming/cpp-units:The C++ Units Library>` can be used to specify any unit type.

.. tabs::
   .. code-tab:: java

      // Create our feedforward gain constants (from the identification
      // tool)
      static final double KvLinear = 1.98;
      static final double KaLinear = 0.2;
      static final double KvAngular = 1.5;
      static final double KaAngular = 0.3;

      // Create the simulation model of our drivetrain.
      private DifferentialDrivetrainSim m_driveSim = new DifferentialDrivetrainSim(
        // Create a linear system from our identification gains.
        LinearSystemId.identifyDrivetrainSystem(KvLinear, KaLinear, KvAngular, KaAngular),
        DCMotor.getNEO(2),       // 2 NEO motors on each side of the drivetrain.
        7.29,                    // 7.29:1 gearing reduction.
        0.7112,                  // The track width is 0.7112 meters.
        Units.inchesToMeters(3), // The robot uses 3" radius wheels.

        // The standard deviations for measurement noise:
        // x and y:          0.001 m
        // heading:          0.001 rad
        // l and r velocity: 0.1   m/s
        // l and r position: 0.005 m
        VecBuilder.fill(0.001, 0.001, 0.001, 0.1, 0.1, 0.005, 0.005));

   .. code-tab:: c++

      #include <frc/simulation/DifferentialDrivetrainSim.h>
      #include <frc/system/plant/LinearSystemId.h>
      #include <units/acceleration.h>
      #include <units/angular_acceleration.h>
      #include <units/angular_velocity.h>
      #include <units/voltage.h>
      #include <units/velocity.h>

      ...

      // Create our feedforward gain constants (from the identification
      // tool). Note that these need to have correct units.
      static constexpr auto KvLinear = 1.98_V / 1_mps;
      static constexpr auto KaLinear = 0.2_V / 1_mps_sq;
      static constexpr auto KvAngular = 1.5_V / 1_rad_per_s;
      static constexpr auto KaAngular = 0.3_V / 1_rad_per_s_sq;
      // The track width is 0.7112 meters.
      static constexpr auto kTrackwidth = 0.7112_m;

      // Create the simulation model of our drivetrain.
      frc::sim::DifferentialDrivetrainSim m_driveSim{
        // Create a linear system from our identification gains.
        frc::LinearSystemId::IdentifyDrivetrainSystem(
          KvLinear, KaLinear, KvAngular, KaAngular, kTrackWidth),
        kTrackWidth,
        frc::DCMotor::GetNEO(2), // 2 NEO motors on each side of the drivetrain.
        7.29,               // 7.29:1 gearing reduction.
        3_in,               // The robot uses 3" radius wheels.

        // The standard deviations for measurement noise:
        // x and y:          0.001 m
        // heading:          0.001 rad
        // l and r velocity: 0.1   m/s
        // l and r position: 0.005 m
        {0.001, 0.001, 0.001, 0.1, 0.1, 0.005, 0.005}};

Creating a ``DifferentialDrivetrainSim`` of the KoP Chassis
-----------------------------------------------------------

The ``DifferentialDrivetrainSim`` class also has a static ``createKitbotSim()`` (Java) / ``CreateKitbotSim()`` (C++) method that can create an instance of the ``DifferentialDrivetrainSim`` using the standard Kit of Parts Chassis parameters. This method takes 5 arguments, two of which are optional:

 - The type and number of motors on one side of the drivetrain.
 - The gear ratio between the motors and the wheels as output  :term:`torque` over input :term:`torque` (this number is usually greater than 1 for drivetrains).
 - The diameter of the wheels installed on the drivetrain.
 - The moment of inertia of the drive base (optional).
 - Standard deviations of measurement noise: this represents how much measurement noise you expect from your real sensors. The measurement noise is an array with 7 elements, with each element representing the standard deviation of measurement noise in x, y, heading, left velocity, right velocity, left position, and right position respectively. This option can be omitted in C++ or set to ``null`` in Java if measurement noise is not desirable.

You can calculate the measurement noise of your sensors by taking multiple data points of the state you are trying to measure and calculating the standard deviation using a tool like Python. For example, to calculate the standard deviation in your encoders' velocity estimate, you can move your robot at a constant velocity, take multiple measurements, and calculate their standard deviation from the known mean. If this process is too tedious, the values used in the example below should be a good representation of average noise from encoders.

.. note:: The standard deviation of the noise for a measurement has the same units as that measurement. For example, the standard deviation of the velocity noise has units of m/s.

.. note:: It is very important to use SI units (i.e. meters and radians) when passing parameters in Java. In C++, the :ref:`units library <docs/software/basic-programming/cpp-units:The C++ Units Library>` can be used to specify any unit type.

.. tabs::
   .. code-tab:: java

      private DifferentialDrivetrainSim m_driveSim = DifferentialDrivetrainSim.createKitbotSim(
        KitbotMotor.kDualCIMPerSide, // 2 CIMs per side.
        KitbotGearing.k10p71,        // 10.71:1
        KitbotWheelSize.kSixInch,    // 6" diameter wheels.
        null                         // No measurement noise.
      );

   .. code-tab:: c++

      #include <frc/simulation/DifferentialDrivetrainSim.h>

      ...

      frc::sim::DifferentialDrivetrainSim m_driveSim =
        frc::sim::DifferentialDrivetrainSim::CreateKitbotSim(
          frc::sim::DifferentialDrivetrainSim::KitbotMotor::DualCIMPerSide, // 2 CIMs per side.
          frc::sim::DifferentialDrivetrainSim::KitbotGearing::k10p71,       // 10.71:1
          frc::sim::DifferentialDrivetrainSim::KitbotWheelSize::kSixInch    // 6" diameter wheels.
      );

.. note:: You can use the ``KitbotMotor``, ``KitbotGearing``, and ``KitbotWheelSize`` enum (Java) / struct (C++) to get commonly used configurations of the Kit of Parts Chassis.

.. important:: Constructing your ``DifferentialDrivetrainSim`` instance in this way is just an approximation and is intended to get teams quickly up and running with simulation. Using empirical values measured from your physical robot will always yield more accurate results.
