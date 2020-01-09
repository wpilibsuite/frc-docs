Troubleshooting
===============

.. note:: This section is mostly concerned with troubleshooting poor trajectory tracking performance, not compilation errors.

Poor trajectory tracking performance can be difficult to troubleshoot. Although the trajectory generator and follower are intended to be easy-to-use and performant out of the box, there are situations where trajectory tracking performance can be poor. This poor performance can be difficult to troubleshoot, because the trajectory generator and followers have many knobs that can be tuned and many moving parts. It can be difficult to know where to start, especially because it is difficult to locate the source of the problems from the robot's general behavior.

Because it is difficult to locate the layer of the trajectory generator and followers that is misbehaving, a systematic, layer-by-layer approach is recommended. The below steps are listed in the order that you should do them in; it is important to follow this order so that you can isolate the effects of different steps from each other.

.. note:: The below examples put diagnostic values onto Network Tables. The easiest way to graph these values is to :ref:`use Shuffleboard's graphing capabilities <docs/software/wpilib-tools/shuffleboard/getting-started/shuffleboard-graphs:Working With Graphs>`.

Verify Odometry
---------------
If your odometry is bad, then your RAMSETE controller may misbehave, because it modifies your robot's target velocities based on where your odometry thinks the robot is.

1. Set up your code to record your robot's position after each odometry update:

.. tabs::

   .. code-tab:: java

    NetworkTableEntry m_xEntry = NetworkTableInstance.getDefault().getTable("troubleshooting").getEntry("X");
    NetworkTableEntry m_yEntry = NetworkTableInstance.getDefault().getTable("troubleshooting").getEntry("Y");

    @Override
    public void periodic() {
        // Update the odometry in the periodic block
        m_odometry.update(Rotation2d.fromDegrees(getHeading()), m_leftEncoder.getDistance(),
            m_rightEncoder.getDistance());

        var translation = m_odometry.getPoseMeters().getTranslation();
        m_xEntry.setNumber(translation.getX());
        m_yEntry.setNumber(translation.getY());
    }

   .. code-tab:: c++

    NetworkTableEntry m_xEntry = nt::NetworkTableInstance::GetDefault().GetTable("troubleshooting")->GetEntry("X");
    NetworkTableEntry m_yEntry = nt::NetworkTableInstance::GetDefault().GetTable("troubleshooting")->GetEntry("Y")

    void DriveSubsystem::Periodic() {
        // Implementation of subsystem periodic method goes here.
        m_odometry.Update(frc::Rotation2d(units::degree_t(GetHeading())),
                            units::meter_t(m_leftEncoder.GetDistance()),
                            units::meter_t(m_rightEncoder.GetDistance()));

        auto translation = m_odometry.GetPose().Translation();
        m_xEntry.SetDouble(translation.X().to<double>());
        m_yEntry.SetDouble(translation.Y().to<double>());
    }

2. Lay out a tape measure parallel to your robot and push your robot out about one meter along the tape measure. Lay out a tape measure along the Y axis and start over, pushing your robot one meter along the X axis and one meter along the Y axis in a rough arc.
3. Compare X and Y reported by the robot to actual X and Y. If X is off by more than 5 centimeters in the first test then you should check that you measured your wheel diameter correctly, and that your wheels are not warn down. If the second test is off by more than 5 centimeters in either X or Y then your track width (distance from the center of the left wheel to the center of the right wheel) may be incorrect; if you're sure that you measured the track width correctly with a tape measure then your robot's wheels may be slipping in a way that is not accounted for by track width--if this is the case then you should :ref:`run the optional track width characterization <docs/software/wpilib-tools/robot-characterization/characterization-routine:Running Tests>` and use that track width instead of the one from your tape measure.

Verify Feedforward
------------------
If your feedforwards are bad then the P controllers for each side of the robot will not track as well, and your ``DifferentialDriveVoltageConstraint`` will not limit your robot's acceleration accurately. We want to turn off RAMSETE and the wheel P controllers so that we can isolate and test the feedforwards.

1. First, we must set disable the P controller for each wheel. Set the ``P`` gain to 0 for every controller. For the ``RamseteCommand`` example, you would set ``kPDriveVel`` to 0:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 135-136
      :linenos:
      :lineno-start: 136

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 80-81
      :linenos:
      :lineno-start: 80

2. Next, we must disable the RAMSETE controller. This is a bit more involved, because we can't just set the gains (b and zeta) to 0. Pass the following into your ``RamseteCommand``:

.. tabs::

   .. code-tab:: java

    RamseteController disabledRamsete = new RamseteController() {
        @Override
        public ChassisSpeeds calculate(Pose2d currentPose, Pose2d poseRef, double linearVelocityRefMeters,
                double angularVelocityRefRadiansPerSecond) {
            return new ChassisSpeeds(linearVelocityRefMeters, 0.0, angularVelocityRefRadiansPerSecond);
        }
    };

    RamseteCommand ramseteCommand = new RamseteCommand(
        exampleTrajectory,
        m_robotDrive::getPose,
        disabledRamsete,
        ...
    );

   .. code-tab:: c++

    // TODO

3. Finally, we must modify our ``tankDriveVolts`` lambda to log desired wheel voltage and actual wheel voltage (you should put actual and desired voltages on the same graph if you're using Shuffleboard, or if your graphing software has that capability). Note that if you're using the ``RamseteCommand`` constructor that takes a lambda for motor outputs in meters (instead of a motor output lambda in volts), then you should log desired wheel *velocity* vs. actual wheel *velocity*.

.. tabs::

   .. code-tab:: java

    var disabledRamsete = new RamseteController() {
        @Override
        public ChassisSpeeds calculate(Pose2d currentPose, Pose2d poseRef, double linearVelocityRefMeters,
                double angularVelocityRefRadiansPerSecond) {
            return new ChassisSpeeds(linearVelocityRefMeters, 0.0, angularVelocityRefRadiansPerSecond);
        }
    };

    var feedforward = new SimpleMotorFeedforward(ksVolts, kvVoltSecondsPerMeter, kaVoltSecondsSquaredPerMeter);

    var m_leftReference = NetworkTableInstance.getDefault().getTable("troubleshooting").getEntry("left_reference");
    var m_leftMeasurement = NetworkTableInstance.getDefault().getTable("troubleshooting").getEntry("left_measurement");
    var m_rightReference = NetworkTableInstance.getDefault().getTable("troubleshooting").getEntry("right_reference");
    var m_rightMeasurement = NetworkTableInstance.getDefault().getTable("troubleshooting").getEntry("right_measurement");

    RamseteCommand ramseteCommand = new RamseteCommand(
        exampleTrajectory,
        m_robotDrive::getPose,
        disabledRamsete, // Pass in disabledRamsete here
        feedforward,
        kDriveKinematics,
        m_robotDrive::getWheelSpeeds,
        new PIDController(kPDriveVel, 0, 0),
        new PIDController(kPDriveVel, 0, 0),
        // RamseteCommand passes volts to the callback
        (leftVolts, rightVolts) -> {
            m_robotDrive.tankDriveVolts(leftVolts, rightVolts);

            m_leftMeasurement.setNumber(feedforward.calculate(m_robotDrive.getWheelSpeeds().leftMetersPerSecond));
            m_leftReference.setNumber(leftVolts);

            m_rightMeasurement.setNumber(feedforward.calculate(m_robotDrive.getWheelSpeeds().rightMetersPerSecond));
            m_rightReference.setNumber(-rightVolts);
        },
        m_robotDrive
    );

   .. code-tab:: c++

    // TODO

4. Run the robot on a variety of trajectories, and check to see if the actual velocity/voltage tracks the desired velocity/voltage.
5. If the desired and actual are off by *a lot* then you should check if the wheel diameter and ``encoderPPR`` you used for characterization were correct. If you've verified that your units and conversions are correct, then you should try recharacterizing to see if you can get better data.

Verify P Gain
-------------
If you completed the previous step and everything looked good, or you fixed all the problems, then you should verify that your wheel P controllers are well-tuned. In this step, we want to turn off RAMSETE so that we can just view our PF controller on its own.

1. You must re-use all the code from the previous step that disables RAMSETE and logs actual vs. desired voltage/velocity, except that the P gain must be set back to its previous nonzero value.
2. Run the robot again on a variety of trajectories, and check your actual vs. desired graphs look good.
3. If the graphs do not look good then you should try tuning your P gain and rerunning your test trajectories.

 .. todo:: Add a link about PID tuning? frc-docs doesn't seem to have a section on it.

Check RAMSETE
-------------
Out of all of the layers of the WPILib's trajectory code, RAMSETE is the one that usually works best "out of the box". You can, however, still verify that it is tuned properly. In this step we will run with everything enabled, including the wheel P controllers, feedforwards, and the RAMSETE controller and observe general performance.

1. Remove the code to disable RAMSETE, but keep the all logging code.
2. Run a variety of trajectories.
3.  If RAMSETE makes things *worse* on these trajectories than without RAMSETE then you can try :ref:`tuning b and zeta <docs/software/wpilib-tools/path-planning/wpilib-trajectories/ramsete:Constructing the Ramsete Controller Object>`, which are passed into ``RamseteController``'s constructor.

Check Constraints
-----------------
 .. todo:: Add a little info about global constraints, kinematics constraint, dynamics constraint, and centripetal accel constraint. Just explain what bad values for each will cuase.

Check Trajectory Waypoints
--------------------------
It is possible that your trajectory itself is not driveable. Try moving waypoints (and headings at the waypoints, if applicable) to reduce sharp turns.
