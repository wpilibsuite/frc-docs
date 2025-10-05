.. include:: <isonum.txt>

# Simulation Environment Overview

Robot simulation allows you to test code without physical hardware, accelerating development and enabling practice at home.

## What is Simulation?

WPILib simulation:

- Runs robot code on your computer
- Simulates sensors and actuators
- Provides visual feedback
- Enables debugging without hardware

## Starting Simulation

In VS Code:

1. Press **Ctrl+Shift+P** (or **Cmd+Shift+P** on Mac)
2. Select "WPILib: Simulate Robot Code"
3. Choose simulation type (Desktop or Halsim GUI)

## Benefits of Simulation

- Test code before robot is built
- Practice programming at home
- Debug complex autonomous routines
- Iterate faster without hardware constraints

## Simulation GUI

The simulation GUI shows:

- Robot pose on field
- Motor outputs
- Sensor values
- Joystick inputs

You can interact with the simulation to test different scenarios.

## Hardware-in-Loop Simulation

Connect real devices (like motor controllers) to your computer while running simulation for more realistic testing.

## Simulation Physics

Define physics models for your mechanisms:

- Drivetrain dynamics
- Arm motion
- Flywheel spin-up
- Custom mechanism behavior

For complete simulation documentation, see :doc:`/docs/software/wpilib-tools/robot-simulation/index`.

## Additional Resources

- :doc:`/docs/user-manual/simulation-tools/index` - Simulation in User Manual
- :doc:`/docs/software/wpilib-tools/robot-simulation/index` - Complete simulation guide
