Swerve Drive Kinematics
=======================
The ``SwerveDriveKinematics`` class is a useful tool that converts between a ``ChassisSpeeds`` object and several ``SwerveModuleState`` objects, which contains velocities and angles for each swerve module of a swerve drive robot.

The swerve module state class
-----------------------------
The ``SwerveModuleState`` class contains information about the velocity and angle of a singular module of a swerve drive. The constructor for a ``SwerveModuleState`` takes in two arguments, the velocity of the wheel on the module, and the angle of the module.

.. note:: In Java, the velocity of the wheel must be in meters per second. In C++, the units library can be used to provide the velocity using any linear velocity unit.
.. note:: An angle of 0 corresponds to the modules facing forward.

Constructing the kinematics object
----------------------------------
The ``SwerveDriveKinematics`` class accepts a variable number of constructor arguments, with each argument being the location of a swerve module relative to the robot center (as a ``Translation2d``. The number of constructor arguments corresponds to the number of swerve modules.

.. note:: A swerve drive must have 2 or more modules.

.. note:: In C++, the class is templated on the number of modules. Therefore, when constructing a ``SwerveDriveKinematics`` object as a member variable of a class, the number of modules must be passed in as a template argument. For example, for a typical swerve drive with four modules, the kinematics object must be constructed as follows: ``frc::SwerveDriveKinematics<4> m_kinematics{...}``.

The locations for the modules must be relative to the center of the robot. Positive x values represent moving toward the front of the robot whereas positive y values represent moving toward the left of the robot.

.. tabs::

   .. code-tab:: java

      // Locations for the swerve drive modules relative to the robot center.
      Translation2d m_frontLeftLocation = new Translation2d(0.381, 0.381);
      Translation2d m_frontRightLocation = new Translation2d(0.381, -0.381);
      Translation2d m_backLeftLocation = new Translation2d(-0.381, 0.381);
      Translation2d m_backRightLocation = new Translation2d(-0.381, -0.381);

      // Creating my kinematics object using the module locations
      SwerveDriveKinematics m_kinematics = new SwerveDriveKinematics(
        m_frontLeftLocation, m_frontRightLocation, m_backLeftLocation, m_backRightLocation
      );

   .. code-tab:: c++

      // Locations for the swerve drive modules relative to the robot center.
      frc::Translation2d m_frontLeftLocation{0.381_m, 0.381_m};
      frc::Translation2d m_frontRightLocation{0.381_m, -0.381_m};
      frc::Translation2d m_backLeftLocation{-0.381_m, 0.381_m};
      frc::Translation2d m_backRightLocation{-0.381_m, -0.381_m};

      // Creating my kinematics object using the module locations.
      frc::SwerveDriveKinematics<4> m_kinematics{
        m_frontLeftLocation, m_frontRightLocation, m_backLeftLocation,
        m_backRightLocation};

Converting chassis speeds to module states
------------------------------------------
The ``toSwerveModuleStates(ChassisSpeeds speeds)`` (Java) / ``ToSwerveModuleStates(ChassisSpeeds speeds)`` (C++) method should be used to convert a ``ChassisSpeeds`` object to a an array of ``SwerveModuleState`` objects. This is useful in situations where you have to convert a forward velocity, sideways velocity, and an angular velocity into individual module states.

The elements in the array that is returned by this method are the same order in which the kinematics object was constructed. For example, if the kinematics object was constructed with the front left module location, front right module location, back left module location, and the back right module location in that order, the elements in the array would be the front left module state, front right module state, back left module state, and back right module state in that order.

.. tabs::

   .. code-tab:: java

      // Example chassis speeds: 1 meter per second forward, 3 meters
      // per second to the left, and rotation at 1.5 radians per second
      // counterclockwise.
      ChassisSpeeds speeds = new ChassisSpeeds(1.0, 3.0, 1.5);

      // Convert to module states
      SwerveModuleState[] moduleStates = kinematics.toSwerveModuleStates(speeds);

      // Front left module state
      SwerveModuleState frontLeft = moduleStates[0];

      // Front right module state
      SwerveModuleState frontRight = moduleStates[1];

      // Back left module state
      SwerveModuleState backLeft = moduleStates[2];

      // Back right module state
      SwerveModuleState backRight = moduleStates[3];

   .. code-tab:: c++

      // Example chassis speeds: 1 meter per second forward, 3 meters
      // per second to the left, and rotation at 1.5 radians per second
      // counterclockwise.
      frc::ChassisSpeeds speeds{1_mps, 3_mps, 1.5_rad_per_s};

      // Convert to module states. Here, we can use C++17's structured
      // bindings feature to automatically split up the array into its
      // individual SwerveModuleState components.
      auto [fl, fr, bl, br] = kinematics.ToSwerveModuleStates(speeds);

Module angle optimization
^^^^^^^^^^^^^^^^^^^^^^^^^
The ``SwerveModuleState`` class contains a static ``optimize()`` (Java) / ``Optimize()`` (C++) method that is used to "optimize" the speed and angle setpoint of a given ``SwerveModuleState`` to minimize the change in heading. For example, if the angular setpoint of a certain module from inverse kinematics is 90 degrees, but your current angle is -89 degrees, this method will automatically negate the speed of the module setpoint and make the angular setpoint -90 degrees to reduce the distance the module has to travel.

This method takes two parameters: the desired state (usually from the ``toSwerveModuleStates`` method) and the current angle. It will return the new optimized state which you can use as the setpoint in your feedback control loop.

.. tabs::
   .. code-tab:: java

      var frontLeftOptimized = SwerveModuleState.optimize(frontLeft,
         new Rotation2d(m_turningEncoder.getDistance()));

   .. code-tab:: c++

      auto flOptimized = frc::SwerveModuleState::Optimize(fl,
         units::radian_t(m_turningEncoder.GetDistance()));

Field-oriented drive
^^^^^^^^^^^^^^^^^^^^
:ref:`Recall <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:Creating a ChassisSpeeds object from field-relative speeds>` that a ``ChassisSpeeds`` object can be created from a set of desired field-oriented speeds. This feature can be used to get module states from a set of desired field-oriented speeds.

.. tabs::

   .. code-tab:: java

      // The desired field relative speed here is 2 meters per second
      // toward the opponent's alliance station wall, and 2 meters per
      // second toward the left field boundary. The desired rotation
      // is a quarter of a rotation per second counterclockwise. The current
      // robot angle is 45 degrees.
      ChassisSpeeds speeds = ChassisSpeeds.fromFieldRelativeSpeeds(
        2.0, 2.0, Math.PI / 2.0, Rotation2d.fromDegrees(45.0));

      // Now use this in our kinematics
      SwerveModuleState[] moduleStates = kinematics.toSwerveModuleStates(speeds);

   .. code-tab:: c++

      // The desired field relative speed here is 2 meters per second
      // toward the opponent's alliance station wall, and 2 meters per
      // second toward the left field boundary. The desired rotation
      // is a quarter of a rotation per second counterclockwise. The current
      // robot angle is 45 degrees.
      frc::ChassisSpeeds speeds = frc::ChassisSpeeds::FromFieldRelativeSpeeds(
        2_mps, 2_mps, units::radians_per_second_t(std::numbers::pi / 2.0), Rotation2d(45_deg));

      // Now use this in our kinematics
      auto [fl, fr, bl, br] = kinematics.ToSwerveModuleStates(speeds);

Using custom centers of rotation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Sometimes, rotating around one specific corner might be desirable for certain evasive maneuvers. This type of behavior is also supported by the WPILib classes. The same ``ToSwerveModuleStates()`` method accepts a second parameter for the center of rotation (as a ``Translation2d``). Just like the wheel locations, the ``Translation2d`` representing the center of rotation should be relative to the robot center.

.. note:: Because all robots are a rigid frame, the provided ``vx`` and ``vy`` velocities from the ``ChassisSpeeds`` object will still apply for the entirety of the robot. However, the ``omega`` from the ``ChassisSpeeds`` object will be measured from the center of rotation.

For example, one can set the center of rotation on a certain module and if the provided ``ChassisSpeeds`` object has a ``vx`` and ``vy`` of zero and a non-zero ``omega``, the robot will appear to rotate around that particular swerve module.

Converting module states to chassis speeds
------------------------------------------
One can also use the kinematics object to convert an array of ``SwerveModuleState`` objects to a singular ``ChassisSpeeds`` object. The ``toChassisSpeeds(SwerveModuleState... states)`` (Java) / ``ToChassisSpeeds(SwerveModuleState... states)`` (C++) method can be used to achieve this.

.. tabs::

   .. code-tab:: java

      // Example module states
      var frontLeftState = new SwerveModuleState(23.43, Rotation2d.fromDegrees(-140.19));
      var frontRightState = new SwerveModuleState(23.43, Rotation2d.fromDegrees(-39.81));
      var backLeftState = new SwerveModuleState(54.08, Rotation2d.fromDegrees(-109.44));
      var backRightState = new SwerveModuleState(54.08, Rotation2d.fromDegrees(-70.56));

      // Convert to chassis speeds
      ChassisSpeeds chassisSpeeds = kinematics.toChassisSpeeds(
        frontLeftState, frontRightState, backLeftState, backRightState);

      // Getting individual speeds
      double forward = chassisSpeeds.vxMetersPerSecond;
      double sideways = chassisSpeeds.vyMetersPerSecond;
      double angular = chassisSpeeds.omegaRadiansPerSecond;

   .. code-tab:: c++

      // Example module States
      frc::SwerveModuleState frontLeftState{23.43_mps, Rotation2d(-140.19_deg)};
      frc::SwerveModuleState frontRightState{23.43_mps, Rotation2d(-39.81_deg)};
      frc::SwerveModuleState backLeftState{54.08_mps, Rotation2d(-109.44_deg)};
      frc::SwerveModuleState backRightState{54.08_mps, Rotation2d(-70.56_deg)};

      // Convert to chassis speeds. Here, we can use C++17's structured bindings
      // feature to automatically break up the ChassisSpeeds struct into its
      // three components.
      auto [forward, sideways, angular] = kinematics.ToChassisSpeeds(
        frontLeftState, frontRightState, backLeftState, backRightState);
