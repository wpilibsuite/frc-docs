# LTV Unicycle Controller
The LTV Unicycle Controller ([C++](https://github.wpilib.org/allwpilib/docs/beta/cpp/classfrc_1_1_l_t_v_unicycle_controller.html), [Java](https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/math/controller/LTVUnicycleController.html), :external:py:class:`Python <wpimath.controller.LTVUnicycleController>`) is a trajectory tracker that is built in to WPILib. This tracker can be used to accurately track trajectories with correction for minor disturbances for differential drivetrains.

.. note:: LTV has replaced RAMSETE, because it has more intuitive tuning.

## Constructing the LTV Unicycle Controller Object

The LTV Unicycle controller should be initialized with four parameters. `qelems` is a vector of the maximum desired error tolerance in the X and Y directions and heading. `relems` is a vector of the desired control effort in linear velocity and angular velocity. `dt` represents the timestep used in calculations (the default loop rate of 20 ms is a reasonable value) and `maxVelocity` should be the max velocity your robot can achieve. See :ref:`The State Space control LQR Tuning <docs/software/advanced-controls/state-space/state-space-intro:LQR: tuning>` for more information on the effect of `qelems` and `relems` on the controller.

The code example below initializes the LTV Unicycle Controller with `qelems` of 0.0625 m in X, 0.125 m in Y, and 2 radians in heading; `relems` of 1 m/s of linear velocity, and 2 rad/sec angular velocity; `dt` of 20 ms; and `maxVelocity` of 9 m/s.

.. note:: The maximum desired error of the heading is much larger then X and Y to ensure that the heading controller doesn't overpower the Y controller.

.. tab-set-code::
   ```java
   LTVUnicycleController controller = new LTVUnicycleController(VecBuilder.fill(0.0625, 0.125, 2.0), VecBuilder.fill(1.0, 2.0), 0.02, 9);
   ```

   ```c++
   frc::LTVUnicycleController controller{{0.0625, 0.125, 2.0}, {1.0, 2.0}, 0.02_s, 9_mps};
   ```

   ```python
   controller = LTVUnicycleController([0.0625, 0.125, 2.0], [1.0, 2.0], 0.02, 9)
   ```

## Getting Velocity Commands
The LTV Unicycle controller returns linear and angular velocity commands which, if followed, will make the robot accurately reach a goal state consisting of a desired pose, desired linear velocity, and desired angular velocity.

.. note:: The "reference pose" represents the position that the robot should be at a particular timestep when tracking the trajectory. It does NOT represent the final endpoint of the trajectory, which is the goal.

The controller can be updated using the ``Calculate`` (C++) / ``calculate`` (Java/Python) method. The first overload of this method accepts the current robot pose, desired robot pose, desired linear velocity, and desired angular velocity. The second overload accepts the current robot pose and desired pose, linear velocity, and angular velocity as a ``Trajectory.State`` object. This overload is ideal for those using the WPILib trajectory API.

.. tab-set-code::

   ```java
   Trajectory.State reference = trajectory.sample(3.4); // sample the trajectory at 3.4 seconds from the beginning
   ChassisSpeeds adjustedSpeeds = controller.calculate(currentRobotPose, reference);
   ```

   ```c++
   const Trajectory::State reference = trajectory.Sample(3.4_s); // sample the trajectory at 3.4 seconds from the beginning
   ChassisSpeeds adjustedSpeeds = controller.Calculate(currentRobotPose, reference);
   ```

   ```python
   reference = trajectory.sample(3.4)  # sample the trajectory at 3.4 seconds from the beginning
   adjustedSpeeds = controller.calculate(currentRobotPose, reference)
   ```

These calculations should be performed at every loop iteration, with an updated robot position and reference.

## Using the Velocity Commands
The velocity commands are of type ``ChassisSpeeds``, which contains a ``vx`` (linear velocity in the forward direction), a ``vy`` (linear velocity in the sideways direction), and an ``omega`` (angular velocity around the center of the robot frame).

The returned adjusted speeds can be converted to usable speeds using the kinematics classes for your drivetrain type. For example, the adjusted velocities can be converted to left and right velocities for a differential drive using a ``DifferentialDriveKinematics`` object.

.. tab-set-code::

   ```java
   ChassisSpeeds adjustedSpeeds = controller.calculate(currentRobotPose, reference);
   DifferentialDriveWheelSpeeds wheelSpeeds = kinematics.toWheelSpeeds(adjustedSpeeds);
   double left = wheelSpeeds.leftMetersPerSecond;
   double right = wheelSpeeds.rightMetersPerSecond;
   ```

   ```c++
   ChassisSpeeds adjustedSpeeds = controller.Calculate(currentRobotPose, reference);
   DifferentialDriveWheelSpeeds wheelSpeeds = kinematics.ToWheelSpeeds(adjustedSpeeds);
   auto [left, right] = kinematics.ToWheelSpeeds(adjustedSpeeds);
   ```

   ```python
   adjustedSpeeds = controller.calculate(currentRobotPose, reference)
   wheelSpeeds = kinematics.toWheelSpeeds(adjustedSpeeds)
   left = wheelSpeeds.left
   right = wheelSpeeds.right
   ```

These new left and right velocities are still speeds and not voltages, so two PID Controllers, one for each side, should be used to track them. You can use either the WPILib PIDController ([C++](https://github.wpilib.org/allwpilib/docs/beta/cpp/classfrc_1_1_p_i_d_controller.html), [Java](https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/math/controller/PIDController.html), :external:py:class:`Python <wpimath.controller.PIDController>`) or the Velocity PID feature on smart motor controllers such as the TalonSRX and the SPARK MAX.

