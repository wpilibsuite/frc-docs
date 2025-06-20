# Removed features

## Labview
NI will not support Labview on SystemCore.

## Java tools

All Java GUI tools have been removed due to lack of maintenance.

### Shuffleboard
Use :doc:`/docs/software/dashboards/elastic` as a driver dashboard and use :doc:`/docs/software/dashboards/advantagescope` for debugging and data visualization.

### SmartDashboard
In addition to lack of maintenance, SmartDashboard uses the NT3 protocol, which has been removed, and SmartDashboard does not support modern platforms used in FRC. Instead, use :doc:`/docs/software/dashboards/elastic` as a driver dashboard and use :doc:`/docs/software/dashboards/advantagescope` for debugging and data visualization.

### RobotBuilder
No replacement. There are many upcoming codegen projects however.

### PathWeaver
Use :doc:`/docs/software/pathplanning/choreo` or [PathPlanner](https://pathplanner.dev) instead.

## roboRIO Team Number Setter
Config for SystemCore will be handled via the web interface.

## Hardware

### Relay
No support.

### Analog Output
No support.

### Analog Gyro
No support.

### SPI
No support.

### DigitalGlitchFilter
No support.

### Analog Trigger
No support.

### DMA
No support.

### Counter
No support.

### Ultrasonic
No support.

### DigitalSource

### Interrupts
No support.

### Axis Camera
Not manufactured anymore.

### Nidec Brushless

## RamseteController/RamseteCommand

## Control commands/subsytems
PIDCommand, ProfiledPIDCommand, TrapezoidProfileCommand, and their subsystem counterparts have been removed for being poor abstractions. Instead, use PIDController/ProfiledPIDController/TrapezoidProfile themselves in commands/subsystems.

## NT3 support