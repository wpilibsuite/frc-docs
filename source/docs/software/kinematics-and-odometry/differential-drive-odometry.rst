Differential Drive Odometry
===========================
A user can use the differential drive kinematics classes in order to perform odometry. Odometry is a way to figure out the position of the robot on the field using measurements from encoders and a gyroscope. WPILib contains a ``DifferentialDriveOdometry`` class that can be used to track the position of a differential drive robot on the field.

.. note:: Because this method only uses encoders and a gyro, the estimate of the robot's position on the field will drift over time, especially as your robot comes into contact with other robots during gameplay. However, odometry is usually very accurate during the autonomous period.

Creating the odometry object
----------------------------
The ``DifferentialDriveOdometry`` class requires one mandatory argument and one optional argument. The mandatory argument is the kinematics object that represents your differential drive (in the form of a ``DifferentialDriveKinematics`` class). The second optional argument is the starting pose of your robot on the field (as a ``Pose2d``). By default, the robot will start at ``x = 0, y = 0, theta = 0``. 

.. note:: 0 degrees / radians represents the robot angle when the robot is facing directly toward your opponent's alliance station.

.. tabs::

   .. code-tab:: java
   
      // Creating my kinematics object: differential drive with track width of 27 inches.
      DifferentialDriveKinematics m_kinematics = new DifferentialDriveKinematics(Units.inchesToMeters(27));
      
      // Creating my odometry object from the kinematics object. Here, 
      // our starting pose is 5 meters along the long end of the field and in the 
      // center of the field along the short end, facing forward.
      DifferentialDriveOdometry m_odometry = new DifferentialDriveOdometry(m_kinematics, 
        new Pose2d(5.0, 13.5, new Rotation2d());
      
   .. code-tab:: c++
   
      // Creating my kinematics object: differential drive with track width of 27 inches.
      frc::DifferentialDriveKinematics m_kinematics{27_in};
      
      // Creating my odometry object from the kinematics object. Here, 
      // our starting pose is 5 meters along the long end of the field and in the 
      // center of the field along the short end, facing forward.
      frc::DifferentialDriveOdometry m_odometry{m_kinematics, frc::Pose2d{5_m, 13.5_m, 0_rad}};
      
      
Updating the robot pose
-----------------------
The ``update`` method of the odometry class updates the robot position on the field. The update method takes in the current angle of the robot, along with a ``DifferentialDriveWheelSpeeds`` object representing the left and right wheel speeds of the robot. This ``update`` method must be called periodically, preferably in the ``periodic()`` method of a `Subsystem <docs/software/commandbased/subsystems>`_. The ``update`` method returns the new updated pose of the robot.

.. note:: The ``DifferentialDriveWheelSpeeds`` class in Java must be constructed with the left and right wheel speeds in meters per second. In C++, the units library must be used to represent your wheel speeds.

.. tabs::

   .. code-tab:: java
   
      @Override
      public void periodic() {
        // Get my wheel speeds
        var wheelSpeeds = new DifferentialDriveWheelSpeeds(m_leftEncoder.getRate(), m_rightEncoder.getRate());
        
        // Get my gyro angle. We are negating the value because gyros return positive 
        // values as the robot turns clockwise. This is not standard convention that is
        // used by the WPILib classes.
        var angle = Rotation2d.fromDegrees(-m_gyro.getAngle());
        
        // Update the pose
        m_pose = m_odometry.update(angle, wheelSpeeds);
      }
  
   .. code-tab:: c++
   
      void Periodic() override {
         // Get my wheel speeds
         frc::DifferentialDriveWheelSpeeds wheelSpeeds{
           units::meters_per_second_t(m_leftEncoder.GetRate()),
           units::meters_per_second_t(m_rightEncoder.GetRate())};
      
         // Get my gyro angle. We are negating the value because gyros return positive 
         // values as the robot turns clockwise. This is not standard convention that is
         // used by the WPILib classes.
         frc::Rotation2d angle{units::degree_t(-m_gyro.GetAngle())};
         
         // Update the pose
         m_pose = m_odometry.Update(angle, wheelSpeeds);
       }

.. note:: A full example of a differential drive robot with odometry is available here: `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/DifferentialDriveBot>`_ / `Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/differentialdrivebot>`_.
         
In addition, the ``GetPose`` (C++) / ``getPoseMeters`` (Java) methods can be used to retrieve the current robot pose without an update.
