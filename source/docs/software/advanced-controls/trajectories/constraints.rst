Trajectory Constraints
======================
In the :ref:`previous article <docs/software/advanced-controls/trajectories/trajectory-generation:Generating the trajectory>`, you might have noticed that no custom constraints were added when generating the trajectories. Custom constraints allow users to impose more restrictions on the velocity and acceleration at points along the trajectory based on location and curvature.

For example, a custom constraint can keep the velocity of the trajectory under a certain threshold in a certain region or slow down the robot near turns for stability purposes.

WPILib-Provided Constraints
---------------------------
WPILib includes a set of predefined constraints that users can utilize when generating trajectories. The list of WPILib-provided constraints is as follows:

 - ``CentripetalAccelerationConstraint``: Limits the centripetal acceleration of the robot as it traverses along the trajectory. This can help slow down the robot around tight turns.
 - ``DifferentialDriveKinematicsConstraint``: Limits the velocity of the robot around turns such that no wheel of a differential-drive robot goes over a specified maximum velocity.
 - ``DifferentialDriveVoltageConstraint``: Limits the acceleration of a differential drive robot such that no commanded voltage goes over a specified maximum.
 - ``EllipticalRegionConstraint``: Imposes a constraint only in an elliptical region on the field.
 - ``MaxVelocityConstraint``: Imposes a max velocity constraint. This can be composed with the ``EllipticalRegionConstraint`` or ``RectangularRegionConstraint`` to limit the velocity of the robot only in a specific region.
 - ``MecanumDriveKinematicsConstraint``: Limits the velocity of the robot around turns such that no wheel of a mecanum-drive robot goes over a specified maximum velocity.
 - ``RectangularRegionConstraint``: Imposes a constraint only in a rectangular region on the field.
 - ``SwerveDriveKinematicsConstraint``: Limits the velocity of the robot around turns such that no wheel of a swerve-drive robot goes over a specified maximum velocity.

.. note:: The ``DifferentialDriveVoltageConstraint`` only ensures that theoretical voltage commands do not go over the specified maximum using a :ref:`feedforward model <docs/software/advanced-controls/controllers/feedforward:SimpleMotorFeedforward>`. If the robot were to deviate from the reference while tracking, the commanded voltage may be higher than the specified maximum.

Creating a Custom Constraint
----------------------------
Users can create their own constraint by implementing the ``TrajectoryConstraint`` interface.

.. tabs::

   .. code-tab:: java

      @Override
      public double getMaxVelocityMetersPerSecond(Pose2d poseMeters, double curvatureRadPerMeter,
                                                  double velocityMetersPerSecond) {
        // code here
      }

      @Override
      public MinMax getMinMaxAccelerationMetersPerSecondSq(Pose2d poseMeters,
                                                           double curvatureRadPerMeter,
                                                           double velocityMetersPerSecond) {
        // code here
      }

   .. code-tab:: c++

      units::meters_per_second_t MaxVelocity(
      const Pose2d& pose, units::curvature_t curvature,
      units::meters_per_second_t velocity) override {
        // code here
      }

      MinMax MinMaxAcceleration(const Pose2d& pose, units::curvature_t curvature,
                            units::meters_per_second_t speed) override {
        // code here
      }

The ``MaxVelocity`` method should return the maximum allowed velocity for the given pose, curvature, and original velocity of the trajectory without any constraints. The ``MinMaxAcceleration`` method should return the minimum and maximum allowed acceleration for the given pose, curvature, and constrained velocity.

See the source code (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpimath/src/main/java/edu/wpi/first/math/trajectory/constraint>`_, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpimath/src/main/native/cpp/trajectory/constraint>`_) for the WPILib-provided constraints for more examples on how to write your own custom trajectory constraints.
