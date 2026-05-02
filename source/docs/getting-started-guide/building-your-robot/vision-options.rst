.. include:: <isonum.txt>

# Vision Options

Vision processing is a powerful tool for FRC\ |reg| robots, enabling them to detect and track game pieces, targets, and field elements. This page provides an overview of vision options available to teams.

## What is Robot Vision?

Robot vision uses cameras and image processing to:

- Detect and track retroreflective targets
- Identify AprilTags for localization
- Recognize game pieces (balls, cones, cubes)
- Estimate distance and angle to targets
- Enable autonomous navigation

## Vision Hardware Options

### Limelight

Limelight is a plug-and-play vision camera with:

- Built-in image processing
- Easy calibration and configuration
- Web-based interface
- NetworkTables integration
- LED ring for retroreflective targeting

**Website**: `limelightvision.io <https://limelightvision.io/>`_

### PhotonVision

PhotonVision is open-source vision software that runs on:

- Raspberry Pi
- Orange Pi
- Other supported coprocessors

Features include:

- AprilTag detection
- Retroreflective targeting
- Custom pipelines
- Multiple camera support
- Web-based configuration

**Website**: `photonvision.org <https://photonvision.org/>`_

### Custom Vision Solutions

Teams can also implement custom vision processing using:

- OpenCV on a coprocessor
- Python vision libraries
- Custom neural networks
- TensorFlow/ONNX models

## Choosing a Vision Solution

### For Beginners

Start with **Limelight** or **PhotonVision** because they:

- Provide complete hardware + software solutions
- Include extensive documentation
- Have active community support
- Work out-of-the-box with minimal setup

### For Advanced Teams

Consider custom solutions if you need:

- Specialized object detection
- Machine learning integration
- Multiple simultaneous vision pipelines
- Maximum performance optimization

## Integration with WPILib

All vision solutions integrate with WPILib through:

- **NetworkTables**: Share vision data between coprocessor and robot code
- **WPILib Vision Classes**: Built-in classes for camera access and processing
- **Pose Estimation**: Use vision data for robot localization

## Next Steps

For detailed vision programming information, see:

- :doc:`/docs/user-manual/hardware-interfaces/index` - Camera and vision hardware interfaces
- :doc:`/docs/software/vision-processing/index` - Vision processing in the User Manual
- :doc:`/docs/tutorials/index` - Vision tutorials for targeting and localization

## Additional Resources

- `PhotonVision Documentation <https://docs.photonvision.org/>`_
- `Limelight Documentation <https://docs.limelightvision.io/>`_
- `WPILib Vision Examples <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples>`_
