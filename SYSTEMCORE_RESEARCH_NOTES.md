# SystemCore Research Summary

Research conducted for updating frc-docs 2027 branch from roboRIO to SystemCore documentation.

## Hardware Specifications

### Processor & Memory
- **SoC**: Raspberry Pi Compute Module 5 (CM5)
- **CPU**: Quad-core ARM Cortex-A76 processor
- **RAM**: 4 GB
- **GPU**: VideoCore VII
- **OS**: Real-time Linux
- **I/O Controller**: Raspberry Pi RP2050 for reconfigurable I/O

### Physical Specifications
- **Dimensions**: 5.3" x 2.8" x 1.1" (135.3mm x 71.5mm x 28.13mm)
- **Weight**: ~0.475 lb (215 g)
- **Size**: Approximately that of a large smartphone

### Built-in Features
- Integrated IMU for odometry/localization
- Integrated 2.4GHz/5GHz WiFi radio
- Display screen for diagnostic information
- Integrated Limelight vision processing capability
- Reverse polarity protection
- Short circuit protection
- ESD protection

## Ports & Connectivity

### SystemCore Ports
- **CAN**: 5x CAN-FD ports (Weidmuller wire-to-board connectors)
- **SmartIO**: 6x SmartIO ports (3-pin Molex-SL) - reconfigurable for:
  - Analog input
  - Digital input (including PWM or quadrature)
  - Digital output
  - PWM output
- **I2C**: 2x I2C ports (4-pin Molex-SL)
- **USB-A**: 4x USB 3.0-A ports
- **USB-C**: 1x USB-C device port
- **Ethernet**: 1x Ethernet port
- **Power**: 1x Power Input port
- **RSL**: 1x RSL port
- **MotionCore Bridge**: 1x MotionCore bridge port (4-pin Molex Microfit+)
- **M.2**: 1x M.2 A+E port (compatible with Hailo-8 AI Accelerator)

## Features NOT Supported on SystemCore

### Hardware Removals
- Relay outputs
- Analog outputs
- Analog gyros
- SPI interface (and related IMUs: ADIS16448, ADXL345)
- DigitalGlitchFilter
- Analog Trigger
- DMA
- Counter class
- Ultrasonic class
- DigitalSource
- Interrupts
- Axis Camera
- Nidec Dynamo Brushless Motor
- MXP expansion port

### Software Removals
- **LabVIEW**: No longer supported
- **NetworkTables 3**: Deprecated in favor of NetworkTables 4
- **Java GUI Tools**:
  - Shuffleboard → Replaced by Elastic and AdvantageScope
  - SmartDashboard → Replaced by Elastic and AdvantageScope
  - RobotBuilder → No direct replacement
  - PathWeaver → Replaced by Choreo or PathPlanner
- **Control Commands**:
  - RamseteController/RamseteCommand → Replaced by LTV Unicycle Controller
  - PIDCommand, ProfiledPIDCommand → Replaced by direct controller usage

## New Capabilities

### Software Features
- Web interface for:
  - Device configuration
  - On-robot coding (Blockly, Java, Python)
  - Sensor value display
- Full IDE support
- Cross-platform software experience
- Robust software update/recovery

### Hardware Advantages
- **Multiple CAN buses**: 5 CAN-FD ports provide near point-to-point CAN wiring for simple robots while allowing complex robots to avoid CAN bus congestion
- **Enhanced vision**: Multiple USB 3.0 ports for cameras or sensors (LIDAR)
- **SmartIO flexibility**: Ports can be reconfigured dynamically vs. fixed function pins on roboRIO
- **AI acceleration**: M.2 slot for Hailo-8 AI Accelerator
- **Integrated IMU**: Built-in vs. separate sensor
- **Positive retention connectors**: Prevent accidental disconnects

## Key Differences from roboRIO

### Configuration
- **roboRIO**: Imaging tool, LabVIEW project access
- **SystemCore**: Web-based interface

### CAN Bus
- **roboRIO**: Single CAN bus
- **SystemCore**: 5 CAN-FD buses

### I/O Flexibility
- **roboRIO**: Fixed function pins, MXP expansion
- **SystemCore**: 6 reconfigurable SmartIO ports

### Vision Processing
- **roboRIO**: Separate camera/Limelight device
- **SystemCore**: Integrated Limelight technology, 4x USB 3.0 ports

### Brownout Protection
- **roboRIO 1.0**: 6.3V trigger (fixed)
- **roboRIO 2.0**: 6.75V default (settable)
- **SystemCore**: TBD - needs documentation

### Manufacturer
- **roboRIO**: National Instruments
- **SystemCore**: Limelight (manufactured by Sony UK Technology Centre in Wales)

## Development Timeline

- **Announcement**: 2024
- **Alpha Testing (FRC)**: June 2025
- **Alpha Testing (FTC)**: September 2025
- **Alpha 2**: Current phase (as of research)
- **Competition Deployment**: 2027 season (FRC), 2027-28 season (FTC)

## Documentation Tasks for 2027 Branch

### Files Needing Updates in `source/docs/software/systemcore-info/`

1. **systemcore-introduction.rst** - Expand with full specifications
2. **roborio-brownouts.rst** - Update for SystemCore voltage specifications
3. **roborio-web-dashboard.rst** - Update for SystemCore web interface
4. **roborio-ftp.rst** - Update for SystemCore file access methods
5. **roborio-ssh.rst** - Update for SystemCore SSH access
6. **recovering-a-roborio-using-safe-mode.rst** - Update for SystemCore recovery procedures

### Content Areas to Address

- [ ] SystemCore imaging/flashing process
- [ ] SystemCore web dashboard interface
- [ ] SmartIO port configuration
- [ ] Multiple CAN bus configuration
- [ ] SystemCore brownout protection details
- [ ] SystemCore recovery/safe mode
- [ ] Vision processing with integrated Limelight
- [ ] AI accelerator usage
- [ ] MotionCore bridge functionality
- [ ] Migration guide from roboRIO to SystemCore

### Reference Links

- WPILib 2027 Docs: https://docs.wpilib.org/en/2027/
- SystemCore Specs PDF: https://downloads.limelightvision.io/documents/systemcore_specifications_june15_2025_alpha.pdf
- FIRST Blog - Introducing: https://community.firstinspires.org/introducing-the-future-mobile-robot-controller
- FIRST Blog - Updates: https://community.firstinspires.org/march-updates-on-the-future-robot-controller
- FIRST Blog - Alpha Testing: https://community.firstinspires.org/systemcore-alpha-testing-first-wave
- Removed Features: https://docs.wpilib.org/en/2027/docs/yearly-overview/removed-features.html

## Notes

- Limelight is creating the firmware (NI not involved)
- SystemCore uses positive retention connectors to prevent accidental disconnects
- Web interface allows on-robot programming without separate IDE
- Real-time Linux provides better performance than traditional OS
- SmartIO concept allows teams to reconfigure I/O as needed vs. fixed pin functions
