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

## Obtaining Vision Measurements

To use ``AddVisionMeasurement()``, you need to obtain a robot pose estimate from your vision system. The most common approach is using AprilTags detected by vision coprocessors. The general process is:

1. **Detect AprilTags**: Use a vision solution like PhotonVision or Limelight to detect AprilTags on the field
2. **Get Tag Pose**: Look up the known field position of the detected tag from the ``AprilTagFieldLayout``
3. **Calculate Robot Pose**: Use the camera-to-tag transform and camera-to-robot transform to calculate where the robot is on the field
4. **Apply Measurement**: Pass the calculated pose, timestamp, and standard deviations to ``AddVisionMeasurement()``

Most vision libraries provide utilities to simplify this process:

- **PhotonVision**: The PhotonLib library includes ``PhotonPoseEstimator`` which handles the transforms and provides robot poses directly. See the `PhotonVision documentation <https://docs.photonvision.org/en/latest/docs/programming/photonlib/robot-pose-estimator.html>`_ for details.
- **Limelight**: Limelight provides MegaTag which outputs robot poses through NetworkTables. See the `Limelight documentation <https://docs.limelightvision.io/docs/docs-limelight/apis/complete-networktables-api#apriltag-and-3d-data>`_ for the ``botpose`` fields.

.. important:: When using vision measurements, it's critical to:

   - Use the **timestamp** from when the image was captured, not when it was processed
   - Scale the **standard deviations** based on factors like distance from tags, number of tags seen, and tag ambiguity
   - Reject measurements with high ambiguity or when no tags are detected

For teams implementing their own vision solution, you'll need to:

1. Obtain the camera-to-tag transform using methods like ``cv::solvePnP`` (OpenCV) or similar
2. Apply the camera-to-robot transform (fixed based on camera mounting)
3. Transform from the tag's field position to get the robot's field position
4. Handle latency by using the image capture timestamp

## Tuning Pose Estimators

All pose estimators offer user-customizable standard deviations for model and measurements (defaults are used if you don't provide them). Standard deviation is a measure of how spread out the noise is for a random signal. Giving a state a smaller standard deviation means it will be trusted more during data fusion.

For example, increasing the standard deviation for measurements (as one might do for a noisy signal) would lead to the estimator trusting its state estimate more than the incoming measurements. On the field, this might mean that the filter can reject noisy vision data well, at the cost of being slow to correct for model deviations. While these values can be estimated beforehand, they very much depend on the unique setup of each robot and global measurement method.

When incorporating AprilTag poses, make the vision heading standard deviation very large, make the gyro heading standard deviation small, and scale the vision x and y standard deviation by distance from the tag.
