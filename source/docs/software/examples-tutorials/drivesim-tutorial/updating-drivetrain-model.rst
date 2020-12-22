Step 3: Updating the Drivetrain Model
=====================================
Now that the drivetrain model has been made, it needs to be updated periodically with the latest motor voltage commands. It is recommended to do this step in a separate ``simulationPeriodic()`` / ``SimulationPeriodic()`` method inside your subsystem and only call this method in simulation.

.. note:: If you are using the command-based framework, every subsystem that extends ``SubsystemBase`` has a ``simulationPeriodic()`` / ``SimulationPeriodic()`` which can be overridden. This method is automatically run only during simulation. If you are not using the command-based library, make sure you call your simulation method inside the overridden ``simulationPeriodic()`` / ``SimulationPeriodic()`` of the main ``Robot`` class. These periodic methods are also automatically called only during simulation.

There are three main steps to updating the model:

 1. Set the :term:`input` of the drivetrain model. These are the motor voltages from the two sides of the drivetrain.
 2. Advance the model forward in time by the nominal periodic timestep (Usually 20 ms). This updates all of the drivetrain's states (i.e. pose, encoder positions and velocities) as if 20 ms had passed.
 3. Update simulated sensors with new positions, velocities, and angles to use in other places.

.. tabs::
   .. code-tab:: java

      public Drivetrain() {
        ...
        m_leftEncoder.setDistancePerPulse(2 * Math.PI * kWheelRadius / kEncoderResolution);
        m_rightEncoder.setDistancePerPulse(2 * Math.PI * kWheelRadius / kEncoderResolution);
      }

      public void simulationPeriodic() {
        // Set the inputs to the system. Note that we need to convert
        // the [-1, 1] PWM signal to voltage by multiplying it by the
        // robot controller voltage.
        m_driveSim.setInputs(m_leftMotor.get() * RobotController.getInputVoltage(),
                             m_rightMotor.get() * RobotController.getInputVoltage());

        // Advance the model by 20 ms. Note that if you are running this
        // subsystem in a separate thread or have changed the nominal timestep
        // of TimedRobot, this value needs to match it.
        m_driveSim.update(0.02);

        // Update all of our sensors.
        m_leftEncoderSim.setDistance(m_driveSim.getLeftPosition());
        m_leftEncoderSim.setRate(m_driveSim.getLeftVelocity());
        m_rightEncoderSim.setDistance(m_driveSim.getRightPosition());
        m_rightEncoderSim.setRate(m_driveSim.getRightVelocity());
        m_gyroSim.setAngle(-m_driveSim.getHeading().getDegrees());
      }

   .. code-tab:: c++

      Drivetrain() {
        ...
        m_leftEncoder.SetDistancePerPulse(2 * wpi::math::pi * kWheelRadius / kEncoderResolution);
        m_rightEncoder.SetDistancePerPulse(2 * wpi::math::pi * kWheelRadius / kEncoderResolution);
      }

      void SimulationPeriodic() {
        // Set the inputs to the system. Note that we need to convert
        // the [-1, 1] PWM signal to voltage by multiplying it by the
        // robot controller voltage.
        m_driveSim.SetInputs(
          units::volt_t(m_leftMotor.get()) * frc::RobotController::GetInputVoltage(),
          units::volt_t(m_rightMotor.get()) * frc::RobotController::GetInputVoltage());

        // Advance the model by 20 ms. Note that if you are running this
        // subsystem in a separate thread or have changed the nominal timestep
        // of TimedRobot, this value needs to match it.
        m_driveSim.Update(20_ms);

        // Update all of our sensors.
        m_leftEncoderSim.SetDistance(m_driveSim.GetLeftPosition().to<double>());
        m_leftEncoderSim.SetRate(m_driveSim.GetLeftVelocity().to<double>());
        m_rightEncoderSim.SetDistance(m_driveSim.GetRightPosition().to<double>());
        m_rightEncoderSim.SetRate(m_driveSim.GetRightVelocity().to<double>());
        m_gyroSim.SetAngle(-m_driveSim.GetHeading().Degrees().to<double>());
      }

.. important:: If the right side of your drivetrain is inverted, you MUST negate the right voltage in the ``SetInputs()`` call to ensure that positive voltages correspond to forward movement.

.. important:: Because the drivetrain simulator model returns positions and velocities in meters and m/s respectively, these must be converted to encoder ticks and ticks/s when calling ``SetDistance()`` and ``SetRate()``. Alternatively, you can configure ``SetDistancePerPulse`` on the encoders to have the ``Encoder`` object take care of this automatically -- this is the approach that is taken in the example above.

Now that the simulated encoder positions, velocities, and gyroscope angles have been set, you can call ``m_leftEncoder.GetDistance()``, etc. in your robot code as normal and it will behave exactly like it would on a real robot. This involves performing odometry calculations, running velocity PID feedback loops for trajectory tracking, etc.
