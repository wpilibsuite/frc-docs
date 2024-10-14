# LTV Unicycle Controller
The LTV Unicycle Controller is a trajectory tracker that is built in to WPILib. This tracker can be used to accurately track trajectories with correction for minor disturbances.

## Constructing the LTV Unicycle Controller Object
The LTV controller should be initialized with two parameters, `dt` and `maxVelocity`. `dt` represents the timestep used in calculations and `maxVelocity` should be the max velocity your robot can achieve.

.. tab-set-code::
   ```java
   LTVUnicycle controller = new LTVUnicycleController(0.2, 9);
   ```

   ```c++
   frc::LTVUnicycleController controller{0.2_s, 9_mps};
   ```

   ```python
   controller = LTVUnicycleController(0.2, 9)
   ```

## Getting Adjusted Velocities
The LTV Unicycle controller returns "adjusted velocities" so that the when the robot tracks these velocities, it accurately reaches the goal point. The controller should be updated periodically with the new goal. The goal comprises of a desired pose, desired linear velocity, and desired angular velocity. Furthermore, the current position of the robot should also be updated periodically. The controller uses these four arguments to return the adjusted linear and angular velocity. Users should command their robot to these linear and angular velocities to achieve optimal trajectory tracking.

.. note:: The "goal pose" represents the position that the robot should be at a particular timestep when tracking the trajectory. It does NOT represent the final endpoint of the trajectory.

The controller can be updated using the ``Calculate`` (C++) / ``calculate`` (Java/Python) method. There are two overloads for this method. Both of these overloads accept the current robot position as the first parameter. For the other parameters, one of these overloads takes in the goal as three separate parameters (pose, linear velocity, and angular velocity) whereas the other overload accepts a ``Trajectory.State`` object, which contains information about the goal pose. For its ease, users should use the latter method when tracking trajectories.

.. tab-set-code::

   ```java
   Trajectory.State goal = trajectory.sample(3.4); // sample the trajectory at 3.4 seconds from the beginning
   ChassisSpeeds adjustedSpeeds = controller.calculate(currentRobotPose, goal);
   ```

   ```c++
   const Trajectory::State goal = trajectory.Sample(3.4_s); // sample the trajectory at 3.4 seconds from the beginning
   ChassisSpeeds adjustedSpeeds = controller.Calculate(currentRobotPose, goal);
   ```

   ```python
   goal = trajectory.sample(3.4)  # sample the trajectory at 3.4 seconds from the beginning
   adjustedSpeeds = controller.calculate(currentRobotPose, goal)
   ```

These calculations should be performed at every loop iteration, with an updated robot position and goal.

## Using the Adjusted Velocities
The adjusted velocities are of type ``ChassisSpeeds``, which contains a ``vx`` (linear velocity in the forward direction), a ``vy`` (linear velocity in the sideways direction), and an ``omega`` (angular velocity around the center of the robot frame). Because the Ramsete controller is a controller for non-holonomic robots (robots which cannot move sideways), the adjusted speeds object has a ``vy`` of zero.

The returned adjusted speeds can be converted to usable speeds using the kinematics classes for your drivetrain type. For example, the adjusted velocities can be converted to left and right velocities for a differential drive using a ``DifferentialDriveKinematics`` object.

.. tab-set-code::

   ```java
   ChassisSpeeds adjustedSpeeds = controller.calculate(currentRobotPose, goal);
   DifferentialDriveWheelSpeeds wheelSpeeds = kinematics.toWheelSpeeds(adjustedSpeeds);
   double left = wheelSpeeds.leftMetersPerSecond;
   double right = wheelSpeeds.rightMetersPerSecond;
   ```

   ```c++
   ChassisSpeeds adjustedSpeeds = controller.Calculate(currentRobotPose, goal);
   DifferentialDriveWheelSpeeds wheelSpeeds = kinematics.ToWheelSpeeds(adjustedSpeeds);
   auto [left, right] = kinematics.ToWheelSpeeds(adjustedSpeeds);
   ```

   ```python
   adjustedSpeeds = controller.calculate(currentRobotPose, goal)
   wheelSpeeds = kinematics.toWheelSpeeds(adjustedSpeeds)
   left = wheelSpeeds.left
   right = wheelSpeeds.right
   ```

Because these new left and right velocities are still speeds and not voltages, two PID Controllers, one for each side may be used to track these velocities. Either the WPILib PIDController ([C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc_1_1_p_i_d_controller.html), [Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/math/controller/PIDController.html), :external:py:class:`Python <wpimath.controller.PIDController>`) can be used, or the Velocity PID feature on smart motor controllers such as the TalonSRX and the SPARK MAX can be used.

