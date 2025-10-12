# Removed features

## LabVIEW
LabVIEW is not currently supported on Systemcore. Old LabVIEW docs can be found [here](https://docs.wpilib.org/en/stable/docs/software/labview/index.html).

## NetworkTables 3
Removed since NetworkTables 4 has been out for a few years and is a better protocol bandwidth-wise.

## Java tools
All Java GUI tools have been removed due to lack of maintenance.

### Shuffleboard
Use :doc:`/docs/software/dashboards/elastic` as a driver dashboard and use :doc:`/docs/software/dashboards/advantagescope` for debugging and data visualization.

### SmartDashboard
In addition to lack of maintenance, SmartDashboard uses the NT3 protocol, which has been removed, and SmartDashboard does not support modern platforms used in FRC. Instead, use :doc:`/docs/software/dashboards/elastic` as a driver dashboard and use :doc:`/docs/software/dashboards/advantagescope` for debugging and data visualization.

### RobotBuilder
No replacement. There are many upcoming codegen projects however.

### PathWeaver
Use :doc:`/docs/software/pathplanning/choreo/index` or [PathPlanner](https://pathplanner.dev) instead.

## roboRIO Team Number Setter
Config for Systemcore will be handled via the web interface.

## WPILib Standalone Utility
Removed because of low use.

## Hardware

### Relay
Systemcore doesn't support Relays.

### Analog Output
Systemcore doesn't support Analog Outputs.

### Analog Gyro
Systemcore doesn't support Analog Gyros.

### SPI
Systemcore doesn't support SPI. Several IMUs that WPILib had built-in support for also used SPI, and therefore also aren't supported on Systemcore. IMUs that were removed:

* ADIS16448
* ADIS16470
* ADXL345
* ADXRS450

### DigitalGlitchFilter
Systemcore doesn't support DigitalGlitchFilter.

### Analog Trigger
Systemcore doesn't support Analog Triggers.

### DMA
Systemcore doesn't support DMA.

### Counter
Systemcore doesn't support Counters.

### Servo
Systemcore doesn't have the ability to give servos the power they demand.

### Ultrasonic
Systemcore doesn't support Ultrasonic because it doesn't support Counters.

### DigitalSource
Digital IO works differently on Systemcore and DigitalSource was removed as part of the transition.

### Interrupts
Systemcore doesn't support Interrupts.

### Axis Camera
Explicit support removed because it required special software support, and Usage Reporting indicated extremely few users. Usage is still possible with HttpCamera.

### Nidec Dynamo Brushless
Support removed because per https://community.firstinspires.org/more-reefscape-by-the-numbers-new-legal-devices, zero teams used it, and because Systemcore doesn't support its control method.

## RamseteController/RamseteCommand
Use LTV Unicycle Controller, which has more intuitive tuning.

## Control commands/subsytems
PIDCommand, ProfiledPIDCommand, TrapezoidProfileCommand, and their subsystem counterparts have been removed for being poor abstractions. Instead, use PIDController/ProfiledPIDController/TrapezoidProfile themselves in commands/subsystems.

## Mutable Java units
Mutable Java units can cause many confusing issues if used incorrectly, and only exist because of the roboRIO's lack of RAM. Systemcore has enough RAM to handle immutable units.

## robotInit
Use a constructor instead.

## MathUtil.clamp()
Use Math.clamp() instead.

## Pose2/3d.exp(Twist2/3d)
Replaced with Pose2/3d.plus(Twist2/3d.exp())
