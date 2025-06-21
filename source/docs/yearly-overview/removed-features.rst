# Removed features

## LabVIEW
LabVIEW is not currently supported on SystemCore.

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
Config for SystemCore will be handled via the web interface.

## Hardware

### Relay
SystemCore doesn't support Relays.

### Analog Output
SystemCore doesn't support Analog Outputs.

### Analog Gyro
SystemCore doesn't support Analog Gyros.

### SPI
SystemCore doesn't support SPI. Several IMUs that WPILib had built-in support for also used SPI, and therefore also aren't supported on SystemCore. IMUs that were removed:
* ADIS16448
* ADIS16470
* ADXL345
* ADXRS450

### DigitalGlitchFilter
SystemCore doesn't support DigitalGlitchFilter.

### Analog Trigger
SystemCore doesn't support Analog Triggers.

### DMA
SystemCore doesn't support DMA.

### Counter
SystemCore doesn't support Counters.

### Ultrasonic
SystemCore doesn't support Ultrasonic because it doesn't support Counters.

### DigitalSource
Digital IO works differently on SystemCore and DigitalSource was removed as part of the transition.

### Interrupts
SystemCore doesn't support Interrupts.

### Axis Camera
Explicit support removed because it required special software support, and Usage Reporting indicated extremely few users. Usage is still possible with HttpCamera.

### Nidec Brushless
Support removed because per https://community.firstinspires.org/more-reefscape-by-the-numbers-new-legal-devices, zero teams used it, and it will be dropped from the legal list of parts.

## RamseteController/RamseteCommand
Use LTV Unicycle Controller, which has more intuitive tuning.

## Control commands/subsytems
PIDCommand, ProfiledPIDCommand, TrapezoidProfileCommand, and their subsystem counterparts have been removed for being poor abstractions. Instead, use PIDController/ProfiledPIDController/TrapezoidProfile themselves in commands/subsystems.
