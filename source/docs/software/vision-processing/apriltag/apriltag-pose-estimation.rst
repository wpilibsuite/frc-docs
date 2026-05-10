# Using AprilTags for Pose Estimation

AprilTag detection is most commonly used to help your robot determine its position on the field. This article explains how to obtain vision measurements from AprilTags and use them with WPILib's pose estimators.

## Overview

The process of using AprilTags for pose estimation involves:

1. **Detect AprilTags**: Use a vision solution to detect AprilTags on the field
2. **Get Tag Pose**: Look up the known field position of the detected tag from the ``AprilTagFieldLayout``
3. **Calculate Robot Pose**: Use the camera-to-tag transform and camera-to-robot transform to calculate where the robot is on the field
4. **Apply Measurement**: Pass the calculated pose to your pose estimator using ``AddVisionMeasurement()``

## Using Vision Libraries

Most teams use existing vision processing libraries that handle the complex mathematics for you. Before using these libraries in your robot code, you'll need to configure the vision coprocessor to detect AprilTags. See the `PhotonVision AprilTag documentation <https://docs.photonvision.org/en/latest/docs/apriltag-pipelines/index.html>`__ or `Limelight AprilTag documentation <https://docs.limelightvision.io/docs/docs-limelight/pipeline-apriltag/apriltag-introduction>`__ for setup instructions.

### PhotonVision

PhotonVision provides the ``PhotonPoseEstimator`` class which simplifies the entire process:

.. tab-set-code::

   ```java
   import org.photonvision.PhotonPoseEstimator;
   import org.photonvision.PhotonPoseEstimator.PoseStrategy;

   // Create the pose estimator
   PhotonPoseEstimator photonPoseEstimator = new PhotonPoseEstimator(
      fieldLayout,  // AprilTagFieldLayout
      PoseStrategy.MULTI_TAG_PNP_ON_COPROCESSOR,
      camera,       // PhotonCamera
      robotToCam    // Transform3d from robot to camera
   );

   // In your periodic method
   var result = photonPoseEstimator.update();
   if (result.isPresent()) {
      var estimatedPose = result.get();
      poseEstimator.addVisionMeasurement(
         estimatedPose.estimatedPose.toPose2d(),
         estimatedPose.timestampSeconds
      );
   }
   ```

   ```c++
   #include <photon/PhotonPoseEstimator.h>

   // Create the pose estimator
   photon::PhotonPoseEstimator photonPoseEstimator{
      fieldLayout,  // frc::AprilTagFieldLayout
      photon::PoseStrategy::MULTI_TAG_PNP_ON_COPROCESSOR,
      camera,       // photon::PhotonCamera
      robotToCam    // frc::Transform3d from robot to camera
   };

   // In your periodic method
   auto result = photonPoseEstimator.Update();
   if (result) {
      poseEstimator.AddVisionMeasurement(
         result->estimatedPose.ToPose2d(),
         result->timestamp
      );
   }
   ```

   ```python
   from photonlibpy.photonPoseEstimator import PhotonPoseEstimator, PoseStrategy

   # Create the pose estimator
   photon_pose_estimator = PhotonPoseEstimator(
      field_layout,  # AprilTagFieldLayout
      PoseStrategy.MULTI_TAG_PNP_ON_COPROCESSOR,
      camera,        # PhotonCamera
      robot_to_cam   # Transform3d from robot to camera
   )

   # In your periodic method
   result = photon_pose_estimator.update()
   if result is not None:
      pose_estimator.addVisionMeasurement(
         result.estimatedPose.toPose2d(),
         result.timestamp
      )
   ```

See the `PhotonVision documentation <https://docs.photonvision.org/en/latest/docs/programming/photonlib/robot-pose-estimator.html>`_ for complete details.

### Limelight

Limelight cameras with MegaTag provide robot poses directly through NetworkTables:

.. tab-set-code::

   ```java
   import edu.wpi.first.networktables.NetworkTable;
   import edu.wpi.first.networktables.NetworkTableInstance;

   NetworkTable limelightTable = NetworkTableInstance.getDefault().getTable("limelight");

   // In your periodic method
   double[] botpose = limelightTable.getEntry("botpose_wpiblue").getDoubleArray(new double[6]);
   if (botpose.length > 0 && botpose[0] != 0.0) {
      Pose2d visionPose = new Pose2d(botpose[0], botpose[1], Rotation2d.fromDegrees(botpose[5]));
      double latency = limelightTable.getEntry("tl").getDouble(0) + limelightTable.getEntry("cl").getDouble(0);
      double timestamp = Timer.getFPGATimestamp() - (latency / 1000.0);

      poseEstimator.addVisionMeasurement(visionPose, timestamp);
   }
   ```

   ```c++
   #include <networktables/NetworkTable.h>
   #include <networktables/NetworkTableInstance.h>

   auto limelightTable = nt::NetworkTableInstance::GetDefault().GetTable("limelight");

   // In your periodic method
   auto botpose = limelightTable->GetEntry("botpose_wpiblue").GetDoubleArray({});
   if (!botpose.empty() && botpose[0] != 0.0) {
      frc::Pose2d visionPose{units::meter_t{botpose[0]}, units::meter_t{botpose[1]},
                             frc::Rotation2d{units::degree_t{botpose[5]}}};
      auto latency = limelightTable->GetEntry("tl").GetDouble(0) + limelightTable->GetEntry("cl").GetDouble(0);
      auto timestamp = frc::Timer::GetFPGATimestamp() - units::millisecond_t{latency};

      poseEstimator.AddVisionMeasurement(visionPose, timestamp);
   }
   ```

   ```python
   from ntcore import NetworkTableInstance
   from wpilib import Timer
   from wpimath.geometry import Pose2d, Rotation2d

   limelight_table = NetworkTableInstance.getDefault().getTable("limelight")

   # In your periodic method
   botpose = limelight_table.getEntry("botpose_wpiblue").getDoubleArray([])
   if len(botpose) > 0 and botpose[0] != 0.0:
      vision_pose = Pose2d(botpose[0], botpose[1], Rotation2d.fromDegrees(botpose[5]))
      latency = limelight_table.getEntry("tl").getDouble(0) + limelight_table.getEntry("cl").getDouble(0)
      timestamp = Timer.getFPGATimestamp() - (latency / 1000.0)

      pose_estimator.addVisionMeasurement(vision_pose, timestamp)
   ```

.. note:: Use ``botpose_wpiblue`` or ``botpose_wpired`` based on your alliance color. These provide poses in the correct field coordinate system.

See the `Limelight documentation <https://docs.limelightvision.io/docs/docs-limelight/apis/complete-networktables-api#apriltag-and-3d-data>`_ for the complete NetworkTables API.

## Important Considerations

### Timestamps

It's critical to use the **timestamp from when the image was captured**, not when it was processed. Vision processing introduces latency (typically 20-100ms), and the pose estimator needs the actual capture time to properly fuse the measurement with odometry data.

Most vision libraries provide this timestamp:

- PhotonVision: ``result.timestampSeconds``
- Limelight: Calculate from ``tl`` (targeting latency) + ``cl`` (capture latency)

### Standard Deviations

The accuracy of vision measurements varies based on several factors:

- **Distance from tags**: Measurements are less accurate when far from tags
- **Number of tags**: Seeing multiple tags improves accuracy
- **Tag ambiguity**: Low-resolution or angled views reduce accuracy
- **Camera quality**: Higher resolution cameras provide better accuracy

You should scale the standard deviations passed to ``AddVisionMeasurement()`` based on these factors. A common approach is to use a small baseline standard deviation and scale it by the square of distance divided by tag count. The specific baseline values will depend on your camera setup and testing.

.. tab-set-code::

   ```java
   // Example: Scale standard deviations based on distance and tag count
   double avgDistance = /* calculate average distance to tags in meters */;
   int tagCount = /* number of tags seen */;

   // Baseline standard deviations (for 1 tag at 1 meter)
   // Tune these based on your specific camera setup
   double xyStdDevBaseline = 0.02;  // meters
   double thetaStdDevBaseline = 0.06;  // radians

   // Scale based on distance squared and number of tags
   double stdDevFactor = Math.pow(avgDistance, 2) / tagCount;
   double xyStdDev = xyStdDevBaseline * stdDevFactor;
   // Only trust rotation with multiple tags; single tag rotation is ambiguous
   double thetaStdDev = tagCount > 1 ? thetaStdDevBaseline * stdDevFactor : Double.MAX_VALUE;

   poseEstimator.addVisionMeasurement(
      visionPose,
      timestamp,
      VecBuilder.fill(xyStdDev, xyStdDev, thetaStdDev)
   );
   ```

   ```c++
   // Example: Scale standard deviations based on distance and tag count
   double avgDistance = /* calculate average distance to tags in meters */;
   int tagCount = /* number of tags seen */;

   // Baseline standard deviations (for 1 tag at 1 meter)
   // Tune these based on your specific camera setup
   double xyStdDevBaseline = 0.02;  // meters
   double thetaStdDevBaseline = 0.06;  // radians

   // Scale based on distance squared and number of tags
   double stdDevFactor = std::pow(avgDistance, 2) / tagCount;
   double xyStdDev = xyStdDevBaseline * stdDevFactor;
   // Only trust rotation with multiple tags; single tag rotation is ambiguous
   double thetaStdDev = tagCount > 1 ? thetaStdDevBaseline * stdDevFactor
                                     : std::numeric_limits<double>::max();

   poseEstimator.AddVisionMeasurement(
      visionPose,
      timestamp,
      {xyStdDev, xyStdDev, thetaStdDev}
   );
   ```

   ```python
   # Example: Scale standard deviations based on distance and tag count
   avg_distance = # calculate average distance to tags in meters
   tag_count = # number of tags seen

   # Baseline standard deviations (for 1 tag at 1 meter)
   # Tune these based on your specific camera setup
   xy_std_dev_baseline = 0.02  # meters
   theta_std_dev_baseline = 0.06  # radians

   # Scale based on distance squared and number of tags
   std_dev_factor = (avg_distance ** 2) / tag_count
   xy_std_dev = xy_std_dev_baseline * std_dev_factor
   # Only trust rotation with multiple tags; single tag rotation is ambiguous
   theta_std_dev = theta_std_dev_baseline * std_dev_factor if tag_count > 1 else float('inf')

   pose_estimator.addVisionMeasurement(
      vision_pose,
      timestamp,
      (xy_std_dev, xy_std_dev, theta_std_dev)
   )
   ```

See :doc:`/docs/software/advanced-controls/state-space/state-space-pose-estimators` for more information about tuning standard deviations.

### Rejecting Bad Measurements

You should reject vision measurements in certain situations:

- **No tags detected**: Only use measurements when tags are visible
- **High ambiguity**: Reject measurements with low confidence (check tag ambiguity values)
- **Unrealistic poses**: Reject measurements that are far outside the field boundaries or far from your current estimate
- **During rapid motion**: Vision measurements may be less reliable during fast turns or acceleration

The following example demonstrates rejecting poses outside field boundaries with a small tolerance to allow for measurement noise near field edges. Other rejection criteria (ambiguity checks, distance from current estimate, etc.) will depend on your specific vision library and requirements.

.. tab-set-code::

   ```java
   var result = photonPoseEstimator.update();
   if (result.isPresent()) {
      var estimatedPose = result.get();

      // Check if pose is reasonable (within field boundaries with tolerance)
      double margin = 0.5;  // meters of tolerance for edge measurements
      if (estimatedPose.estimatedPose.getX() >= -margin &&
          estimatedPose.estimatedPose.getX() <= fieldLayout.getFieldLength() + margin &&
          estimatedPose.estimatedPose.getY() >= -margin &&
          estimatedPose.estimatedPose.getY() <= fieldLayout.getFieldWidth() + margin) {

         poseEstimator.addVisionMeasurement(
            estimatedPose.estimatedPose.toPose2d(),
            estimatedPose.timestampSeconds
         );
      }
   }
   ```

   ```c++
   auto result = photonPoseEstimator.Update();
   if (result) {
      // Check if pose is reasonable (within field boundaries with tolerance)
      units::meter_t margin = 0.5_m;  // tolerance for edge measurements
      if (result->estimatedPose.X() >= -margin &&
          result->estimatedPose.X() <= fieldLayout.GetFieldLength() + margin &&
          result->estimatedPose.Y() >= -margin &&
          result->estimatedPose.Y() <= fieldLayout.GetFieldWidth() + margin) {

         poseEstimator.AddVisionMeasurement(
            result->estimatedPose.ToPose2d(),
            result->timestamp
         );
      }
   }
   ```

   ```python
   result = photon_pose_estimator.update()
   if result is not None:
      # Check if pose is reasonable (within field boundaries with tolerance)
      margin = 0.5  # meters of tolerance for edge measurements
      if (-margin <= result.estimatedPose.X() <= field_layout.getFieldLength() + margin and
          -margin <= result.estimatedPose.Y() <= field_layout.getFieldWidth() + margin):

         pose_estimator.addVisionMeasurement(
            result.estimatedPose.toPose2d(),
            result.timestamp
         )
   ```

## Custom Vision Solutions

If you're implementing your own vision processing, you'll need to:

1. **Detect tags and get camera-to-tag transforms**: Use a library like OpenCV's ``solvePnP`` to calculate the transformation from your camera to each detected tag
2. **Transform to robot pose**: Apply your camera-to-robot transform (determined by camera mounting position)
3. **Transform to field pose**: Use the tag's known field position from ``AprilTagFieldLayout`` to calculate the robot's field position
4. **Handle latency**: Capture and use the image timestamp, accounting for processing delay

This approach requires solid understanding of 3D geometry and coordinate transformations. Most teams are better served using existing vision libraries that handle these details.

## See Also

- :doc:`/docs/software/advanced-controls/state-space/state-space-pose-estimators` - Using pose estimators with vision measurements
- :doc:`/docs/software/basic-programming/coordinate-system` - Understanding the FRC coordinate system
- `PhotonVision Documentation <https://docs.photonvision.org/>`__ - Complete PhotonVision documentation
- `Limelight Documentation <https://docs.limelightvision.io/>`__ - Complete Limelight documentation
