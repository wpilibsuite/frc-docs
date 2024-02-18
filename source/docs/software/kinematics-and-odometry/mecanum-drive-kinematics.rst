Mecanum Drive Kinematics
========================
The ``MecanumDriveKinematics`` class is a useful tool that converts between a ``ChassisSpeeds`` object and a ``MecanumDriveWheelSpeeds`` object, which contains velocities for each of the four wheels on a mecanum drive.

.. note:: Mecanum kinematics uses a common coordinate system. You may wish to reference the :doc:`/docs/software/basic-programming/coordinate-system` section for details.

Constructing the Kinematics Object
----------------------------------
The ``MecanumDriveKinematics`` class accepts four constructor arguments, with each argument being the location of a wheel relative to the robot center (as a ``Translation2d``). The order for the arguments is front left, front right, back left, and back right. The locations for the wheels must be relative to the center of the robot. Positive x values represent moving toward the front of the robot whereas positive y values represent moving toward the left of the robot.

.. tab-set-code::

   .. code-block:: java

      // Locations of the wheels relative to the robot center.
      Translation2d m_frontLeftLocation = new Translation2d(0.381, 0.381);
      Translation2d m_frontRightLocation = new Translation2d(0.381, -0.381);
      Translation2d m_backLeftLocation = new Translation2d(-0.381, 0.381);
      Translation2d m_backRightLocation = new Translation2d(-0.381, -0.381);

      // Creating my kinematics object using the wheel locations.
      MecanumDriveKinematics m_kinematics = new MecanumDriveKinematics(
        m_frontLeftLocation, m_frontRightLocation, m_backLeftLocation, m_backRightLocation
      );

   .. code-block:: c++

      // Locations of the wheels relative to the robot center.
      frc::Translation2d m_frontLeftLocation{0.381_m, 0.381_m};
      frc::Translation2d m_frontRightLocation{0.381_m, -0.381_m};
      frc::Translation2d m_backLeftLocation{-0.381_m, 0.381_m};
      frc::Translation2d m_backRightLocation{-0.381_m, -0.381_m};

      // Creating my kinematics object using the wheel locations.
      frc::MecanumDriveKinematics m_kinematics{
        m_frontLeftLocation, m_frontRightLocation, m_backLeftLocation,
        m_backRightLocation};

   .. code-block:: python

      from wpimath.geometry import Translation2d
      from wpimath.kinematics import MecanumDriveKinematics

      # Locations of the wheels relative to the robot center.
      frontLeftLocation = Translation2d(0.381, 0.381)
      frontRightLocation = Translation2d(0.381, -0.381)
      backLeftLocation = Translation2d(-0.381, 0.381)
      backRightLocation = Translation2d(-0.381, -0.381)

      # Creating my kinematics object using the wheel locations.
      self.kinematics = MecanumDriveKinematics(
        frontLeftLocation, frontRightLocation, backLeftLocation, backRightLocation
      )

Converting Chassis Speeds to Wheel Speeds
-----------------------------------------
The ``toWheelSpeeds(ChassisSpeeds speeds)`` (Java / Python) / ``ToWheelSpeeds(ChassisSpeeds speeds)`` (C++) method should be used to convert a ``ChassisSpeeds`` object to a ``MecanumDriveWheelSpeeds`` object. This is useful in situations where you have to convert a forward velocity, sideways velocity, and an angular velocity into individual wheel speeds.

.. tab-set-code::

   .. code-block:: java

      // Example chassis speeds: 1 meter per second forward, 3 meters
      // per second to the left, and rotation at 1.5 radians per second
      // counterclockwise.
      ChassisSpeeds speeds = new ChassisSpeeds(1.0, 3.0, 1.5);

      // Convert to wheel speeds
      MecanumDriveWheelSpeeds wheelSpeeds = kinematics.toWheelSpeeds(speeds);

      // Get the individual wheel speeds
      double frontLeft = wheelSpeeds.frontLeftMetersPerSecond
      double frontRight = wheelSpeeds.frontRightMetersPerSecond
      double backLeft = wheelSpeeds.rearLeftMetersPerSecond
      double backRight = wheelSpeeds.rearRightMetersPerSecond

   .. code-block:: c++

      // Example chassis speeds: 1 meter per second forward, 3 meters
      // per second to the left, and rotation at 1.5 radians per second
      // counterclockwise.
      frc::ChassisSpeeds speeds{1_mps, 3_mps, 1.5_rad_per_s};

      // Convert to wheel speeds. Here, we can use C++17's structured
      // bindings feature to automatically split up the MecanumDriveWheelSpeeds
      // struct into it's individual components
      auto [fl, fr, bl, br] = kinematics.ToWheelSpeeds(speeds);

   .. code-block:: python

      from wpimath.kinematics import ChassisSpeeds

      # Example chassis speeds: 1 meter per second forward, 3 meters
      # per second to the left, and rotation at 1.5 radians per second
      # counterclockwise.
      speeds = ChassisSpeeds(1.0, 3.0, 1.5)

      # Convert to wheel speeds
      frontLeft, frontRight, backLeft, backRight = self.kinematics.toWheelSpeeds(speeds)

Field-oriented drive
~~~~~~~~~~~~~~~~~~~~
:ref:`Recall <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:Creating a ChassisSpeeds object from field-relative speeds>` that a ``ChassisSpeeds`` object can be created from a set of desired field-oriented speeds. This feature can be used to get wheel speeds from a set of desired field-oriented speeds.

.. tab-set-code::

   .. code-block:: java

      // The desired field relative speed here is 2 meters per second
      // toward the opponent's alliance station wall, and 2 meters per
      // second toward the left field boundary. The desired rotation
      // is a quarter of a rotation per second counterclockwise. The current
      // robot angle is 45 degrees.
      ChassisSpeeds speeds = ChassisSpeeds.fromFieldRelativeSpeeds(
        2.0, 2.0, Math.PI / 2.0, Rotation2d.fromDegrees(45.0));

      // Now use this in our kinematics
      MecanumDriveWheelSpeeds wheelSpeeds = kinematics.toWheelSpeeds(speeds);

   .. code-block:: c++

      // The desired field relative speed here is 2 meters per second
      // toward the opponent's alliance station wall, and 2 meters per
      // second toward the left field boundary. The desired rotation
      // is a quarter of a rotation per second counterclockwise. The current
      // robot angle is 45 degrees.
      frc::ChassisSpeeds speeds = frc::ChassisSpeeds::FromFieldRelativeSpeeds(
        2_mps, 2_mps, units::radians_per_second_t(std::numbers::pi / 2.0), Rotation2d(45_deg));

      // Now use this in our kinematics
      auto [fl, fr, bl, br] = kinematics.ToWheelSpeeds(speeds);

   .. code-block:: python

      from wpimath.kinematics import ChassisSpeeds
      import math
      from wpimath.geometry import Rotation2d

      # The desired field relative speed here is 2 meters per second
      # toward the opponent's alliance station wall, and 2 meters per
      # second toward the left field boundary. The desired rotation
      # is a quarter of a rotation per second counterclockwise. The current
      # robot angle is 45 degrees.
      speeds = ChassisSpeeds.fromFieldRelativeSpeeds(
        2.0, 2.0, math.pi / 2.0, Rotation2d.fromDegrees(45.0))

      # Now use this in our kinematics
      wheelSpeeds = self.kinematics.toWheelSpeeds(speeds)

Using custom centers of rotation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Sometimes, rotating around one specific corner might be desirable for certain evasive maneuvers. This type of behavior is also supported by the WPILib classes. The same ``ToWheelSpeeds()`` method accepts a second parameter for the center of rotation (as a ``Translation2d``). Just like the wheel locations, the ``Translation2d`` representing the center of rotation should be relative to the robot center.

.. note:: Because all robots are a rigid frame, the provided ``vx`` and ``vy`` velocities from the ``ChassisSpeeds`` object will still apply for the entirety of the robot. However, the ``omega`` from the ``ChassisSpeeds`` object will be measured from the center of rotation.

For example, one can set the center of rotation on a certain wheel and if the provided ``ChassisSpeeds`` object has a ``vx`` and ``vy`` of zero and a non-zero ``omega``, the robot will appear to rotate around that particular wheel.

Converting wheel speeds to chassis speeds
-----------------------------------------
One can also use the kinematics object to convert a ``MecanumDriveWheelSpeeds`` object to a singular ``ChassisSpeeds`` object. The ``toChassisSpeeds(MecanumDriveWheelSpeeds speeds)`` (Java / Python) / ``ToChassisSpeeds(MecanumDriveWheelSpeeds speeds)`` (C++) method can be used to achieve this.

.. tab-set-code::

   .. code-block:: java

      // Example wheel speeds
      var wheelSpeeds = new MecanumDriveWheelSpeeds(-17.67, 20.51, -13.44, 16.26);

      // Convert to chassis speeds
      ChassisSpeeds chassisSpeeds = kinematics.toChassisSpeeds(wheelSpeeds);

      // Getting individual speeds
      double forward = chassisSpeeds.vxMetersPerSecond;
      double sideways = chassisSpeeds.vyMetersPerSecond;
      double angular = chassisSpeeds.omegaRadiansPerSecond;

   .. code-block:: c++

      // Example wheel speeds
      frc::MecanumDriveWheelSpeeds wheelSpeeds{-17.67_mps, 20.51_mps, -13.44_mps, 16.26_mps};

      // Convert to chassis speeds. Here, we can use C++17's structured bindings
      // feature to automatically break up the ChassisSpeeds struct into its
      // three components.
      auto [forward, sideways, angular] = kinematics.ToChassisSpeeds(wheelSpeeds);

   .. code-block:: python

      from wpimath.kinematics import MecanumDriveWheelSpeeds

      # Example wheel speeds
      wheelSpeeds = MecanumDriveWheelSpeeds(-17.67, 20.51, -13.44, 16.26)

      # Convert to chassis speeds
      chassisSpeeds = self.kinematics.toChassisSpeeds(wheelSpeeds)

      # Getting individual speeds
      forward = chassisSpeeds.vx
      sideways = chassisSpeeds.vy
      angular = chassisSpeeds.omega
