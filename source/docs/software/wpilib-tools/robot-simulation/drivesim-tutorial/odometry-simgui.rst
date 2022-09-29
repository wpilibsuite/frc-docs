Step 4: Updating Odometry and Visualizing Robot Position
========================================================
Now that the simulated encoder positions, velocities, and gyro angles are being updated with accurate information periodically, this data can be used to update the pose of the robot in a periodic loop (such as the ``periodic()`` method in a ``Subsystem``). In simulation, the periodic loop will use simulated encoder and gyro readings to update odometry whereas on the real robot, the same code will use real readings from physical hardware.

.. note:: For more information on using odometry, see :ref:`this document <docs/software/kinematics-and-odometry/differential-drive-odometry:Differential Drive Odometry>`.

Robot Pose Visualization
------------------------
The robot pose can be visualized on the Simulator GUI (during simulation) or on a dashboard such as Glass (on a real robot) by sending the odometry pose over a ``Field2d`` object. A ``Field2d`` can be trivially constructed without any constructor arguments:

.. tabs::
   .. code-tab:: java

      private Field2d m_field = new Field2d();

   .. code-tab:: c++

      #include <frc/smartdashboard/Field2d.h>

      ..

      frc::Field2d m_field;

This ``Field2d`` instance must then be sent over NetworkTables. The best place to do this is in the constructor of your subsystem.

.. tabs::
   .. code-tab:: java

      public Drivetrain() {
        ...
        SmartDashboard.putData("Field", m_field);
      }

   .. code-tab:: c++

      #include <frc/smartdashboard/SmartDashboard.h>

      Drivetrain() {
        ...
        frc::SmartDashboard::PutData("Field", &m_field);
      }

.. note:: The ``Field2d`` instance can also be sent using a lower-level NetworkTables API or using the :ref:`Shuffleboard API <docs/software/dashboards/shuffleboard/getting-started/shuffleboard-displaying-data:Displaying data from your robot>`.

Finally, the pose from your odometry must be updated periodically into the ``Field2d`` object. Remember that this should be in a general ``periodic()`` method i.e. one that runs both during simulation and during real robot operation.

.. tabs::
   .. code-tab:: java

      public void periodic() {
        ...
        // This will get the simulated sensor readings that we set
        // in the previous article while in simulation, but will use
        // real values on the robot itself.
        m_odometry.update(m_gyro.getRotation2d(),
                          m_leftEncoder.getDistance(),
                          m_rightEncoder.getDistance());
        m_field.setRobotPose(m_odometry.getPoseMeters());
      }

   .. code-tab:: c++

      void Periodic() {
        ...
        // This will get the simulated sensor readings that we set
        // in the previous article while in simulation, but will use
        // real values on the robot itself.
        m_odometry.Update(m_gyro.GetRotation2d(),
                          units::meter_t(m_leftEncoder.GetDistance()),
                          units::meter_t(m_rightEncoder.GetDistance()));
        m_field.SetRobotPose(m_odometry.GetPose());
      }

.. important:: It is important that this code is placed in a regular ``periodic()`` method -- one that is called periodically regardless of mode of operation. If you are using the command-based library, this method already exists. If not, you are responsible for calling this method periodically from the main ``Robot`` class.

.. note:: At this point we have covered all of the code changes required to run your code.  You should head to the :ref:`Simulation User Interface page <docs/software/wpilib-tools/robot-simulation/simulation-gui:Simulation Specific User Interface Elements>` for more info on how to run the simulation and the :ref:`Field2d Widget page <docs/software/dashboards/glass/field2d-widget:Viewing Trajectories with Glass>` to add the field that your simulated robot will run on to the GUI.
