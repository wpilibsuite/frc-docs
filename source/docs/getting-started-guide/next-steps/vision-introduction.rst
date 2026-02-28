.. include:: <isonum.txt>

# Vision Introduction

Robot vision enables autonomous targeting, object detection, and field localization. This page introduces vision concepts for beginners.

## What is Robot Vision?

Vision processing uses cameras to:

- Detect AprilTags for localization
- Track retroreflective targets
- Identify game pieces
- Enable accurate autonomous operation

## Getting Started with Vision

For beginners, we recommend:

- **Limelight** or **PhotonVision** for ease of use
- Start with retroreflective targeting
- Progress to AprilTag detection
- Eventually explore custom vision

See :doc:`/docs/getting-started-guide/building-your-robot/vision-options` for hardware options.

## Vision Processing Pipeline

1. Capture camera image
2. Apply filters and thresholds
3. Detect targets or tags
4. Calculate distance/angle
5. Send data to robot code via NetworkTables

## AprilTags

AprilTags are fiducial markers (like QR codes) that provide:

- Robot position on field
- Precise 3D pose estimation
- Reliable detection
- Multiple tag tracking

AprilTags are commonly used in FRC for field localization.

## Retroreflective Targeting

Retroreflective tape reflects light back to the camera:

- Illuminated by LEDs on camera
- Easy to detect with proper filtering
- Used for targeting game elements
- Distance/angle calculations

## Integration with Robot Code

Vision data is typically accessed via:

- **NetworkTables**: Communication between vision processor and robot
- **Pose Estimation**: Use vision data to know robot position
- **Targeting**: Aim at game elements or goals

For comprehensive vision documentation, see :doc:`/docs/software/vision-processing/index`.

## Next Steps

- Choose a vision solution (Limelight, PhotonVision, or custom)
- Set up camera and configure pipeline
- Test targeting in simulation
- Integrate vision data into autonomous code

## Additional Resources

- :doc:`/docs/software/vision-processing/index` - Complete vision processing guide
- :doc:`/docs/getting-started-guide/building-your-robot/vision-options` - Vision hardware options
- `PhotonVision Documentation <https://docs.photonvision.org/>`_
- `Limelight Documentation <https://docs.limelightvision.io/>`_
