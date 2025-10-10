# AprilTag Field Layouts

The ``AprilTagFieldLayout`` class helps robots understand where AprilTags are located on the field. This is essential for using vision measurements with :doc:`pose estimators </docs/software/advanced-controls/state-space/state-space-pose-estimators>` to determine your robot's position.

## What is AprilTagFieldLayout?

``AprilTagFieldLayout`` stores the 3D positions of all AprilTags for a specific game year. Each tag has:

- A unique **ID number** (e.g., tag 1, tag 2, etc.)
- A **3D pose** (position and rotation) on the field
- The tag's physical **size**

When your vision system detects a tag, you can look up its field position using the tag's ID, then calculate where your robot must be to see that tag from that angle.

## Loading a Field Layout

WPILib provides official field layouts for each game year as JSON files. The easiest way to load a layout is:

.. tab-set-code::

   ```java
   import edu.wpi.first.apriltag.AprilTagFieldLayout;
   import edu.wpi.first.apriltag.AprilTagFields;

   // Load the official field layout for the current year
   AprilTagFieldLayout fieldLayout = AprilTagFieldLayout.loadField(AprilTagFields.k2024Crescendo);
   ```

   ```c++
   #include <frc/apriltag/AprilTagFieldLayout.h>
   #include <frc/apriltag/AprilTagFields.h>

   // Load the official field layout for the current year
   frc::AprilTagFieldLayout fieldLayout = frc::LoadAprilTagLayoutField(frc::AprilTagField::k2024Crescendo);
   ```

   ```python
   from wpilib import AprilTagFieldLayout
   from wpilib import AprilTagField

   # Load the official field layout for the current year
   field_layout = AprilTagFieldLayout.loadField(AprilTagField.k2024Crescendo)
   ```

## Setting the Origin

One of the most common sources of confusion is the **origin location**. FRC fields have tag layouts for both alliances. Some years the field has rotational symmetry (where the field can be rotated 180 degrees and tags are in the same positions), while other years have mirror symmetry. The field layout needs to know which alliance you're on to give you correct positions.

.. important:: Always call ``setOrigin()`` with your alliance color before using vision measurements! Forgetting this will cause pose estimates to be wildly incorrect.

.. tab-set-code::

   ```java
   import edu.wpi.first.wpilibj.DriverStation;
   import edu.wpi.first.apriltag.AprilTagFieldLayout.OriginPosition;

   // In robotInit() or robotPeriodic():
   var alliance = DriverStation.getAlliance();
   if (alliance.isPresent()) {
      fieldLayout.setOrigin(alliance.get() == DriverStation.Alliance.Blue ?
         OriginPosition.kBlueAllianceWallRightSide :
         OriginPosition.kRedAllianceWallRightSide);
   } else {
      // Default to blue alliance if not connected to FMS
      fieldLayout.setOrigin(OriginPosition.kBlueAllianceWallRightSide);
   }
   ```

   ```c++
   #include <frc/DriverStation.h>

   // In RobotInit() or RobotPeriodic():
   auto alliance = frc::DriverStation::GetAlliance();
   if (alliance) {
      fieldLayout.SetOrigin(alliance.value() == frc::DriverStation::Alliance::kBlue ?
         frc::AprilTagFieldLayout::OriginPosition::kBlueAllianceWallRightSide :
         frc::AprilTagFieldLayout::OriginPosition::kRedAllianceWallRightSide);
   } else {
      // Default to blue alliance if not connected to FMS
      fieldLayout.SetOrigin(frc::AprilTagFieldLayout::OriginPosition::kBlueAllianceWallRightSide);
   }
   ```

   ```python
   from wpilib import DriverStation
   from wpilib import AprilTagFieldLayout

   # In robotInit() or robotPeriodic():
   alliance = DriverStation.getAlliance()
   if alliance is not None:
      origin = (AprilTagFieldLayout.OriginPosition.kBlueAllianceWallRightSide
                if alliance == DriverStation.Alliance.kBlue
                else AprilTagFieldLayout.OriginPosition.kRedAllianceWallRightSide)
      field_layout.setOrigin(origin)
   else:
      # Default to blue alliance if not connected to FMS
      field_layout.setOrigin(AprilTagFieldLayout.OriginPosition.kBlueAllianceWallRightSide)
   ```

## Using the Field Layout

Once loaded and configured, you can:

### Get a Tag's Position

.. tab-set-code::

   ```java
   // Get the pose of tag 5
   Optional<Pose3d> tagPose = fieldLayout.getTagPose(5);
   if (tagPose.isPresent()) {
      Pose3d pose = tagPose.get();
      // Use the pose...
   }
   ```

   ```c++
   // Get the pose of tag 5
   std::optional<frc::Pose3d> tagPose = fieldLayout.GetTagPose(5);
   if (tagPose) {
      frc::Pose3d pose = tagPose.value();
      // Use the pose...
   }
   ```

   ```python
   # Get the pose of tag 5
   tag_pose = field_layout.getTagPose(5)
   if tag_pose is not None:
      # Use the pose...
      pass
   ```

### Pass it to Vision Libraries

Most vision processing libraries (PhotonVision, Limelight) need the field layout to calculate robot poses:

.. tab-set-code::

   ```java
   // PhotonVision example
   PhotonPoseEstimator poseEstimator = new PhotonPoseEstimator(
      fieldLayout,
      PoseStrategy.MULTI_TAG_PNP_ON_COPROCESSOR,
      camera,
      robotToCam
   );
   ```

   ```c++
   // PhotonVision example
   photon::PhotonPoseEstimator poseEstimator{
      fieldLayout,
      photon::PoseStrategy::MULTI_TAG_PNP_ON_COPROCESSOR,
      camera,
      robotToCam
   };
   ```

   ```python
   # PhotonVision example
   from photonlibpy.photonPoseEstimator import PhotonPoseEstimator, PoseStrategy

   pose_estimator = PhotonPoseEstimator(
      field_layout,
      PoseStrategy.MULTI_TAG_PNP_ON_COPROCESSOR,
      camera,
      robot_to_cam
   )
   ```

## Loading Custom Layouts

For testing or custom applications, you can load field layouts from a JSON file:

.. tab-set-code::

   ```java
   // Load from a custom JSON file
   AprilTagFieldLayout customLayout = new AprilTagFieldLayout("path/to/layout.json");
   ```

   ```c++
   // Load from a custom JSON file
   frc::AprilTagFieldLayout customLayout{"path/to/layout.json"};
   ```

   ```python
   # Load from a custom JSON file
   custom_layout = AprilTagFieldLayout("path/to/layout.json")
   ```

The JSON format matches the official field layouts. You can find examples in the `WPILib repository <https://github.com/wpilibsuite/allwpilib/tree/main/apriltag/src/main/native/resources/edu/wpi/first/apriltag>`_.

## Common Pitfalls

1. **Forgetting to set origin**: This is the #1 cause of incorrect pose estimates. Always call ``setOrigin()`` based on your alliance!
2. **Using wrong year's layout**: Make sure you're loading the layout for the current game year
3. **Not handling optional values**: Tag pose lookups return ``Optional`` / ``std::optional`` / ``None`` - always check before using!
4. **Coordinate system confusion**: The field layout uses field-relative coordinates (blue alliance origin), not robot-relative

## See Also

- :doc:`Pose Estimators </docs/software/advanced-controls/state-space/state-space-pose-estimators>` - How to use vision measurements with pose estimation
- :doc:`AprilTag Introduction <apriltag-intro>` - Understanding AprilTag detection
- `AprilTagFieldLayout API Docs (Java) <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/apriltag/AprilTagFieldLayout.html>`_
- `AprilTagFieldLayout API Docs (C++) <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_april_tag_field_layout.html>`_
