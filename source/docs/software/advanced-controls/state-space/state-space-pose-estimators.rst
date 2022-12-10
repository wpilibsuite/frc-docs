Pose Estimators
===============

WPILib includes pose estimators for differential, swerve and mecanum drivetrains. These estimators are designed to be drop-in replacements for the existing :ref:`odometry <docs/software/kinematics-and-odometry/index:Kinematics and Odometry>` classes, with added features that utilize an Unscented :ref:`Kalman Filter <docs/software/advanced-controls/state-space/state-space-observers:Kalman Filters>` to fuse latency-compensated robot pose estimates with encoder and gyro measurements. These estimators can account for encoder drift and noisy vision data. These estimators can behave identically to their corresponding odometry classes if only ``update`` is called on these estimators.

Pose estimators estimate robot position using a state-space system with the states :math:`\begin{bmatrix}x & y & \theta \end{bmatrix}^T`, which can represent robot position as a ``Pose2d``. WPILib includes ``DifferentialDrivePoseEstimator``, ``SwerveDrivePoseEstimator`` and ``MecanumDrivePoseEstimator`` to estimate robot position. In these, users call ``update`` periodically with encoder and gyro measurements (same as the odometry classes) to update the robot's estimated position. When the robot receives measurements of its field-relative position (encoded as a ``Pose2d``) from sensors such as computer vision or V-SLAM, the pose estimator latency-compensates the measurement to accurately estimate robot position.

The pose estimators perform latency compensation by storing a list of past observer states, including estimated state :math:`\mathbf{\hat{x}}`, error covariance :math:`\mathbf{P}`, inputs and local measurements. When new measurements are applied, the state of the estimator is first rolled back to the measurement's timestamp. Then, the filter corrects its state estimate with the new measurement and applies the inputs between the measurement timestamp and the present time to incorporate the new measurement. This allows for vision solutions with framerates which might otherwise make them unusable be a viable solution for robot localization.

The following example shows the use of the ``DifferentialDrivePoseEstimator``:

.. tabs::

   .. code-tab:: java

      var estimator = new DifferentialDrivePoseEstimator(new Rotation2d(), new Pose2d(),
              new MatBuilder<>(Nat.N5(), Nat.N1()).fill(0.02, 0.02, 0.01, 0.02, 0.02), // State measurement standard deviations. X, Y, theta.
              new MatBuilder<>(Nat.N3(), Nat.N1()).fill(0.02, 0.02, 0.01), // Local measurement standard deviations. Left encoder, right encoder, gyro.
              new MatBuilder<>(Nat.N3(), Nat.N1()).fill(0.1, 0.1, 0.01)); // Global measurement standard deviations. X, Y, and theta.

   .. code-tab:: cpp

      #include "frc/estimator/DifferentialDrivePoseEstimator.h"
      #include "frc/StateSpaceUtil.h"

      frc::DifferentialDrivePoseEstimator estimator{
              frc::Rotation2d(), frc::Pose2d(),
              frc::MakeMatrix<5, 1>(0.01, 0.01, 0.01, 0.01, 0.01),
              frc::MakeMatrix<3, 1>(0.1, 0.1, 0.1),
              frc::MakeMatrix<3, 1>(0.1, 0.1, 0.1)};

Tuning Pose Estimators
----------------------

All pose estimators offer user-customizable standard deviations for model and measurements. These standard deviations determine how much the filter "trusts" each of these states. For example, increasing the standard deviation for measurements (as one might do for a noisy signal) would lead to the estimator trusting its state estimate more than the incoming measurements. On the field, this might mean that the filter can reject noisy vision data well, at the cost of being slow to correct for model deviations. While these values can be estimated beforehand, they very much depend on the unique setup of each robot and global measurement method.
