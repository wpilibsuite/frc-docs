Differential Drive Kinematics
=============================
The ``DifferentialDriveKinematics`` class is a useful tool that converts between a ``ChassisSpeeds`` object and a ``DifferentialDriveWheelSpeeds`` object, which contains velocities for the left and right sides of a differential drive robot.

Constructing the Kinematics Object
----------------------------------
The ``DifferentialDriveKinematics`` object accepts one constructor argument, which is the track width of the robot. This represents the distance between the two sets of wheels on a differential drive.

.. note:: In Java, the track width must be in meters. In C++, the units library can be used to pass in the track width using any length unit.

Converting Chassis Speeds to Wheel Speeds
-----------------------------------------
The ``toWheelSpeeds(ChassisSpeeds speeds)`` (Java) / ``ToWheelSpeeds(ChassisSpeeds speeds)`` (C++) method should be used to convert a ``ChassisSpeeds`` object to a ``DifferentialDriveWheelSpeeds`` object. This is useful in situations where you have to convert a linear velocity (``vx``) and an angular velocity (``omega``) to left and right wheel velocities.

.. tabs::

   .. code-tab:: java

      // Creating my kinematics object: track width of 27 inches
      DifferentialDriveKinematics kinematics =
        new DifferentialDriveKinematics(Units.inchesToMeters(27.0));

      // Example chassis speeds: 2 meters per second linear velocity,
      // 1 radian per second angular velocity.
      var chassisSpeeds = new ChassisSpeeds(2.0, 0, 1.0);

      // Convert to wheel speeds
      DifferentialDriveWheelSpeeds wheelSpeeds = kinematics.toWheelSpeeds(chassisSpeeds);

      // Left velocity
      double leftVelocity = wheelSpeeds.leftMetersPerSecond;

      // Right velocity
      double rightVelocity = wheelSpeeds.rightMetersPerSecond;

   .. code-tab:: c++

      // Creating my kinematics object: track width of 27 inches
      frc::DifferentialDriveKinematics kinematics{27_in};

      // Example chassis speeds: 2 meters per second linear velocity,
      // 1 radian per second angular velocity.
      frc::ChassisSpeeds chassisSpeeds{2_mps, 0_mps, 1_rad_per_s};

      // Convert to wheel speeds. Here, we can use C++17's structured bindings
      // feature to automatically split the DifferentialDriveWheelSpeeds
      // struct into left and right velocities.
      auto [left, right] = kinematics.ToWheelSpeeds(chassisSpeeds);

Converting Wheel Speeds to Chassis Speeds
-----------------------------------------
One can also use the kinematics object to convert individual wheel speeds (left and right) to a singular ``ChassisSpeeds`` object. The ``toChassisSpeeds(DifferentialDriveWheelSpeeds speeds)`` (Java) / ``ToChassisSpeeds(DifferentialDriveWheelSpeeds speeds)`` (C++) method should be used to achieve this.

.. tabs::

   .. code-tab:: java

      // Creating my kinematics object: track width of 27 inches
      DifferentialDriveKinematics kinematics =
        new DifferentialDriveKinematics(Units.inchesToMeters(27.0));

      // Example differential drive wheel speeds: 2 meters per second
      // for the left side, 3 meters per second for the right side.
      var wheelSpeeds = new DifferentialDriveWheelSpeeds(2.0, 3.0);

      // Convert to chassis speeds.
      ChassisSpeeds chassisSpeeds = kinematics.toChassisSpeeds(wheelSpeeds);

      // Linear velocity
      double linearVelocity = chassisSpeeds.vxMetersPerSecond;

      // Angular velocity
      double angularVelocity = chassisSpeeds.omegaRadiansPerSecond;

   .. code-tab:: c++

      // Creating my kinematics object: track width of 27 inches
      frc::DifferentialDriveKinematics kinematics{27_in};

      // Example differential drive wheel speeds: 2 meters per second
      // for the left side, 3 meters per second for the right side.
      frc::DifferentialDriveWheelSpeeds wheelSpeeds{2_mps, 3_mps};

      // Convert to chassis speeds. Here we can use C++17's structured bindings
      // feature to automatically split the ChassisSpeeds struct into its 3 components.
      // Note that because a differential drive is non-holonomic, the vy variable
      // will be equal to zero.
      auto [linearVelocity, vy, angularVelocity] = kinematics.ToChassisSpeeds(wheelSpeeds);
