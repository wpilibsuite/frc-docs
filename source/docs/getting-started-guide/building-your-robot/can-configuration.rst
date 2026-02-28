.. include:: <isonum.txt>

# CAN Configuration

The Controller Area Network (CAN) bus is the primary communication system for many FRC\ |reg| robot devices. This page explains CAN basics and how to configure CAN devices on your robot.

## What is CAN?

CAN (Controller Area Network) is a robust communication protocol that:

- Connects motor controllers, pneumatics hubs, and other devices to the roboRIO
- Uses a two-wire bus (CAN High and CAN Low)
- Allows multiple devices on a single bus
- Provides reliable, high-speed communication
- Supports device identification via unique IDs

## CAN Devices

Common CAN devices on FRC robots include:

- **Motor Controllers**: SPARK MAX, Talon FX, Talon SRX, Victor SPX
- **Pneumatics Control Hub (PCH)**: Controls pneumatic solenoids
- **Power Distribution Hub (PDH)**: Distributes power and monitors current
- **CANivore**: USB-to-CAN adapter for high-performance applications

## CAN Wiring

### Physical Connection

CAN uses a daisy-chain wiring topology:

1. CAN starts at the roboRIO CAN port
2. Yellow wire = CAN High
3. Green wire = CAN Low
4. Each device connects to the next in a chain
5. Termination resistors at both ends (built into roboRIO and PDH)

### Best Practices

- Keep CAN wiring as short as practical
- Avoid sharp bends in CAN cables
- Use quality CAN cables and connectors
- Don't create "stubs" or branches in the CAN bus
- Ensure proper termination (120Ω resistors at each end)

## Device IDs

Each CAN device must have a unique ID number:

- **Valid range**: 0-62 (some devices have narrower ranges)
- **Avoid conflicts**: No two devices can share the same ID
- **Document your IDs**: Keep a list of which device has which ID

### Common ID Conventions

Many teams use ID numbering schemes like:

- **0-19**: Motor controllers
- **20-29**: Pneumatics hubs
- **60+**: Power distribution, sensors

Choose a scheme that works for your team and document it.

## Configuring Device IDs

Each manufacturer provides tools for setting device IDs:

### REV Devices (SPARK MAX)

Use the **REV Hardware Client**:

1. Connect SPARK MAX via USB-C
2. Open REV Hardware Client
3. Navigate to device configuration
4. Set CAN ID
5. Save and disconnect

### CTRE Devices (Talon FX, Talon SRX)

Use **Phoenix Tuner** or **Phoenix Tuner X**:

1. Connect device via CAN or USB
2. Open Phoenix Tuner
3. Select device
4. Change device ID
5. Save configuration

### Playing Sound (PCH)

Use the **FRC roboRIO Imaging Tool** or **REV Hardware Client**:

1. Connect to robot over USB or network
2. Select Pneumatics Control Hub
3. Configure device ID
4. Apply changes

## Verifying CAN Configuration

After configuring devices, verify your CAN bus:

1. **Use Phoenix Tuner** (for CTRE devices) or **REV Hardware Client** (for REV devices)
2. **Check Device List**: All devices should appear with correct IDs
3. **Monitor CAN Utilization**: Should be below 80% during operation
4. **Test Each Device**: Verify each device responds to commands

## Troubleshooting CAN Issues

### Device Not Found

- Check physical CAN wiring
- Verify device is powered
- Ensure device ID is unique
- Check for loose connections

### CAN Bus Utilization Too High

- Reduce status frame rates in code
- Remove unnecessary devices from CAN bus
- Consider using PWM for some motor controllers

### Intermittent Communication

- Check for damaged CAN wiring
- Verify termination resistors
- Look for electrical noise sources
- Ensure proper wire routing away from power cables

## Programming with CAN Devices

Once configured, CAN devices are controlled through vendor libraries in your robot code. See:

- :doc:`/docs/software/can-devices/index` - CAN devices in software
- :doc:`/docs/user-manual/hardware-interfaces/index` - Hardware interface programming
- Vendor documentation (REV, CTRE, etc.)

## Additional Resources

- `REV Hardware Client <https://docs.revrobotics.com/rev-hardware-client/>`_
- `Phoenix Tuner Documentation <https://pro.docs.ctr-electronics.com/en/latest/docs/tuner/index.html>`_
- :doc:`/docs/software/can-devices/index` - CAN device software documentation
