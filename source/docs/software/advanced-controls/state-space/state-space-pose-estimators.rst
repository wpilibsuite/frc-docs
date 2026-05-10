# Pose Estimators

WPILib includes pose estimators for differential, swerve, and mecanum drivetrains. These estimators are designed to be drop-in replacements for the existing :ref:`odometry <docs/software/kinematics-and-odometry/index:Kinematics and Odometry>` classes that also support fusing latency-compensated robot pose estimates with encoder and gyro measurements. These estimators can account for encoder drift and noisy vision data. These estimators can behave identically to their corresponding odometry classes if only ``update`` is called on these estimators.

Pose estimators estimate robot position using a state-space system with the states :math:`\begin{bmatrix}x & y & \theta \end{bmatrix}^T`, which can represent robot position as a ``Pose2d``. WPILib includes ``DifferentialDrivePoseEstimator``, ``SwerveDrivePoseEstimator`` and ``MecanumDrivePoseEstimator`` to estimate robot position. In these, users call ``update`` periodically with encoder and gyro measurements (same as the odometry classes) to update the robot's estimated position. When the robot receives measurements of its field-relative position (encoded as a ``Pose2d``) from sensors such as computer vision or V-SLAM, the pose estimator latency-compensates the measurement to accurately estimate robot position.

Here's how to initialize a ``DifferentialDrivePoseEstimator``:

.. tab-set-code::


  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/differentialdriveposeestimator/Drivetrain.java
    :language: java
    :lines: 86-94
    :lineno-match:

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/DifferentialDrivePoseEstimator/include/Drivetrain.h
    :language: c++
    :lines: 158-165
    :lineno-match:

Add odometry measurements every loop by calling ``Update()``.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/differentialdriveposeestimator/Drivetrain.java
      :language: java
      :lines: 227-228
      :lineno-match:

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/DifferentialDrivePoseEstimator/cpp/Drivetrain.cpp
      :language: c++
      :lines: 84-86
      :lineno-match:

Add vision pose measurements occasionally by calling ``AddVisionMeasurement()``.

.. tab-set-code::

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/differentialdriveposeestimator/Drivetrain.java
    :language: java
    :lines: 236-245
    :lineno-match:

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/DifferentialDrivePoseEstimator/cpp/Drivetrain.cpp
    :language: c++
    :lines: 93-106
    :lineno-match:

.. seealso:: For detailed information about obtaining vision measurements from AprilTags, see :doc:`/docs/software/vision-processing/apriltag/apriltag-pose-estimation`.

## Tuning Pose Estimators

All pose estimators offer user-customizable standard deviations for model and measurements (defaults are used if you don't provide them). Standard deviation is a measure of how spread out the noise is for a random signal. Giving a state a smaller standard deviation means it will be trusted more during data fusion.

For example, increasing the standard deviation for measurements (as one might do for a noisy signal) would lead to the estimator trusting its state estimate more than the incoming measurements. On the field, this might mean that the filter can reject noisy vision data well, at the cost of being slow to correct for model deviations. While these values can be estimated beforehand, they very much depend on the unique setup of each robot and global measurement method.

When incorporating AprilTag poses, make the vision heading standard deviation very large, make the gyro heading standard deviation small, and scale the vision x and y standard deviation by distance from the tag.
