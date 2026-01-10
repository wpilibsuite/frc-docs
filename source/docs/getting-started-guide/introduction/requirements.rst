.. include:: <isonum.txt>

# Software and Hardware Requirements

This page outlines the software and hardware requirements for FRC\ |reg| robot development using WPILib.

## Software Requirements

### Operating System

WPILib supports the following operating systems:

- **Windows**: Windows 11 (64-bit only)
- **macOS**: macOS 15 or later
- **Linux**: Ubuntu 26.04 or Debian Trixie (or later versions)

For detailed platform support information, see :doc:`what-is-wpilib`.

### Required Software

The WPILib installer includes everything you need:

- **Visual Studio Code**: The official IDE for FRC robot programming
- **WPILib Extensions**: VS Code extensions for robot development
- **Java Development Kit (JDK)**: For Java development
- **C++ Compiler**: For C++ development
- **Python**: For Python development (RobotPy)
- **GradleRIO**: Build system for deploying code to the robot
- **roboRIO Imaging Tool**: For imaging your robot's controller
- **Driver Station**: For operating the robot (Windows only)

### Additional Tools

- **FRC Game Tools**: Required for competition (Windows only)
  - FRC Driver Station
  - FRC Dashboard
- **Git**: Recommended for version control (not included)
- **Web Browser**: For accessing documentation and web-based tools

## Hardware Requirements

### Computer Requirements

**Minimum Specifications:**
- 64-bit processor
- 4 GB RAM
- 5 GB available disk space
- Internet connection (for initial setup and updates)

**Recommended Specifications:**
- Modern multi-core processor
- 8 GB or more RAM
- 10 GB available disk space
- Stable internet connection

### Robot Hardware

For building a competition robot, you'll need:

- **roboRIO 2.0**: The main robot controller
- **Power Distribution Hub (PDH)** or **Power Distribution Panel (PDP)**: Distributes power to robot components
- **Robot Radio**: For wireless communication with the robot
- **Robot Battery**: 12V FRC-legal battery
- **Motor Controllers**: Such as SPARK MAX, Talon SRX, or others
- **Motors**: CIM, NEO, Falcon 500, or other FRC-legal motors
- **Pneumatics Control Hub (Optional)**: For pneumatic systems

### Sensors and Accessories

Common additions include:

- Encoders
- Gyroscopes/IMUs
- Limit switches
- Cameras for vision processing
- Joysticks and controllers
- LED strips

## Network Requirements

- **Router/Network Access**: For initial setup and testing
- **USB Cable**: For direct connection to roboRIO during imaging
- **Ethernet Cable**: For wired robot connection (recommended for reliability)

## Next Steps

Once you have the required software and hardware, proceed to :doc:`/docs/getting-started-guide/installing-wpilib/index` to install WPILib on your computer.
