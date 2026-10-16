.. include:: <isonum.txt>

# Common Issues and Solutions (FAQ)

This document compiles frequently asked questions and common issues encountered by FRC\ |reg| teams. For additional support, see :doc:`support-resources`.

## Build and Deployment Issues

### Code Won't Deploy / Connection Timeout

**Symptoms:**

- "Connection failed. The network address might be invalid or the target is not responding"
- Timeout errors during code deployment
- Cannot connect to roboRIO

**Solutions:**

- **Disable Windows Firewall** - This is the most common cause of deployment issues
- **Verify Network Adapter Settings:**

  - Disable all network adapters except the one connecting to the robot
  - Turn off WiFi adapter if using wired connection

- **Check Connection Method:**

  - USB connection: ``172.22.11.2``
  - Ethernet/Wireless: ``10.TE.AM.2`` (where TE.AM is your team number)

- **Try USB deployment first** - USB connections are more reliable for initial deployment
- **Radio Configuration:** Ensure radio firewall checkbox is NOT checked during programming

### mDNS Resolution Issues

**Symptoms:**

- Cannot ping ``roboRIO-####-FRC.local``
- Driver Station can't find robot by hostname
- Network connection works with IP but not hostname

**Solutions:**

- **Install mDNS Resolver:** Installed with NI FRC Game Tools - ensure Game Tools are properly installed
- **Test mDNS:** Ping ``roboRIO-####-FRC.local`` (no leading zeros in team number)
- **DNS Server Conflicts:** Some network DNS servers try to resolve .local addresses - disable or reconfigure DNS server
- **Alternative:** Put hostname directly in Team Number box: ``roboRIO-####-FRC`` or ``roboRIO-####-FRC.lan``
- **Disable Other Adapters:** Only enable the adapter connecting to robot

For more information, see :doc:`/docs/networking/networking-introduction/roborio-network-troubleshooting`.

### roboRIO Imaging Fails

**Symptoms:**

- Imaging tool can't find roboRIO
- Imaging process fails midway
- Error -2147220622 (illegal characters in hostname)

**Solutions:**

- **Run as Administrator** - Right-click imaging tool and select "Run as Administrator"
- **Computer Name Issues:**

  - Remove special characters (dashes, etc.) from computer name
  - Remove numbers from computer name
  - Shorten computer name if too long

- **Connection Method:** MUST use USB connection - do not attempt imaging over Ethernet
- **Safe Mode Recovery:** Press and hold reset button for at least 5 seconds
- **Prerequisites:** Install NI FRC Game Tools before imaging
- **roboRIO 2.0 Note:** Cannot image directly with Imaging Tool - use microSD card with balenaEtcher

For more information, see :doc:`/docs/zero-to-robot/step-3/imaging-your-roborio`.

### Gradle Build Failed / Dependency Resolution

**Symptoms:**

- "Could not resolve all dependencies"
- Build fails in VS Code
- Import errors for WPILib classes

**Solutions:**

- **Clear Gradle Cache:** Delete ``.gradle`` folder in home directory (``C:\Users\{username}\.gradle``)
- **Run Gradle Clean:** VS Code → WPILib → Run a command in Gradle → clean
- **Refresh Dependencies:** Run ``./gradlew --refresh-dependencies``
- **Network Issues:**

  - Check internet connectivity
  - Verify firewall isn't blocking Gradle repositories
  - Configure proxy settings if behind corporate network

- **Vendor Dependency Cache:** If installed via "online" mode, must reconnect to internet every ~30 days

For more information, see :doc:`/docs/software/vscode-overview/3rd-party-libraries`.

## Hardware Issues

### CAN Bus Errors / Devices Not Found

**Symptoms:**

- Motor controllers not responding
- "No CAN Comm" fault
- Phoenix Tuner shows devices in RED
- "Device ID conflict" errors
- Controllers blink orange continuously

**Solutions:**

- **Wiring Requirements:**

  - **MUST twist CAN wires together** to reduce electrical noise
  - Yellow to yellow, green to green - NEVER cross them
  - Check all connections are secure - tug test each crimped wire

- **Termination:**

  - Need exactly TWO 120-ohm resistors at each end of bus
  - roboRIO and PDP both have built-in terminators
  - Never use more than 2 terminators

- **Device ID Conflicts:**

  - Phoenix Tuner shows conflicting devices in RED
  - Cannot use same ID for two devices of same type
  - To fix: Power off robot, program devices one at a time
  - For SPARK MAX: Connect USB-C directly, set ID, **BURN FLASH** (critical!)

- **Device IDs:** Range is 0-63, each device type has its own namespace

### Brownouts / Battery Voltage Issues

**Symptoms:**

- roboRIO reboots during match
- PWM outputs disabled
- Voltage drops below 6.8V
- Robot loses power under load

**Solutions:**

- **Electrical Connection Checks:**

  - Tighten battery lugs at battery terminals
  - Tighten connections at main breaker
  - Tighten connections at PDP/PDH
  - Verify SB50 connector is plugged in solidly
  - Check split washers are under screw heads
  - Any high-resistance connection causes voltage drop

- **Prevention Strategies:**

  - Create a power budget for your robot
  - Implement current limiting in code
  - Monitor voltage in code and reduce motor output when voltage drops
  - Use PDP/PDH current monitoring to track power usage

- **Battery Maintenance:**

  - Keep batteries charged
  - Verify batteries aren't worn out
  - Test battery voltage under load

For more information, see :doc:`/docs/software/roborio-info/roborio-brownouts`.

### Pneumatics Not Working

**Symptoms:**

- Compressor won't run
- Solenoids not actuating
- PCM/PH fault light flashing red

**Solutions:**

- **Voltage Jumper Settings:** Festo solenoids require 24V - PCM defaults to 12V, move jumper to 24V position
- **Current Limits:** Combined current for all PCM channels must not exceed 500mA
- **Troubleshooting Steps:**

  1. Remove compressor and all solenoids
  2. Check if PCM/PH still faults
  3. Plug components back one at a time
  4. Identify faulty component

- **Radio Interference:** PCM can fault if radio placed adjacent to it - move radio away

### Motor Controller Status Lights

**Symptoms:**

- Red blinking LEDs on motor controllers
- Uncertain of controller status

**Solutions:**

- **PWM Motor Controllers:**

  - Solid red = Reverse direction (100%)
  - Blinking red = Reverse direction (less than 100%)
  - Blink rate proportional to throttle percentage

- **CAN Motor Controllers:**

  - Red blinking circular pattern = Negative duty cycle
  - Orange blinking = Healthy CAN device not being controlled (normal when robot disabled)

- **Check Documentation:** Refer to :doc:`/docs/hardware/hardware-basics/status-lights-ref` for complete details

## Programming Issues

### Null Pointer Exceptions

**Symptoms:**

- ``NullPointerException`` in stack trace
- Robot code crashes on startup or during operation
- "Robots don't quit!" warning in console

**Solutions:**

- **Common Causes:**

  - Uninitialized member variables
  - Hardware not properly initialized (sensors, controllers)
  - Attempting to use objects before creation

- **Prevention Techniques:**

  - Initialize variables when declared with default values
  - Use ``"Test".equals(s)`` instead of ``s.equals("Test")`` to avoid NPE if s is null
  - Check for null before using objects: ``if (object != null)``
  - Initialize all hardware in ``robotInit()`` or constructor

- **Reading Stack Traces:** Stack trace shows exact line number of error - work backwards through call stack to find root cause

For more information, see :doc:`/docs/software/basic-programming/reading-stacktraces`.

### Command-Based Programming Errors

**Symptoms:**

- Commands don't execute
- Subsystem conflicts
- Commands never finish
- Scheduler errors

**Solutions:**

- **Common Mistakes:**

  - Commands must require subsystems they use
  - Newly scheduled commands execute on NEXT scheduler run (20ms later)
  - Sequential commands: Ensure each command finishes, or next won't start

- **Testing:**

  - Test commands individually first
  - Verify requirements are declared properly
  - Use default commands for subsystems
  - Check ``isFinished()`` methods return true when appropriate

For more information, see :doc:`/docs/software/commandbased/index`.

### Vendor Library Installation Issues

**Symptoms:**

- ``import com.ctre cannot be resolved``
- REV libraries not showing in vendor dependencies
- Phoenix classes not found

**Solutions:**

- **Installation Process:**

  1. Open robot project in VS Code
  2. Click WPI icon → Manage Vendor Libraries
  3. Select "Install new library (online)"
  4. Enter vendor URL

- **Troubleshooting:**

  - Clear Gradle cache
  - Refresh dependencies: ``./gradlew --refresh-dependencies``
  - Delete ``.gradle`` folder in project
  - Re-install vendor dependencies

- **Year Transitions:** Must update vendor libraries when importing previous year's project

For more information, see :doc:`/docs/software/vscode-overview/3rd-party-libraries`.

### Robot Code Crashes

**Symptoms:**

- "Could not instantiate robot" error
- "WARNING: Robots don't quit!"
- Robot code status cycling between Disabled and "No Robot Code"

**Solutions:**

- **Check NetConsole:** Unhandled exceptions appear in NetConsole - review full stack trace for root cause
- **Common Causes:**

  - Exception during robot construction/initialization
  - Missing or disconnected hardware (gyro, sensors)
  - Null pointer exceptions in ``robotInit()``

- **Testing:**

  - Run in Practice Mode to test auto/teleop transitions
  - Test autonomous and teleop together
  - Check Driver Station Diagnostics tab for messages

## Driver Station Issues

### No Robot Communication

**Symptoms:**

- Communications indicator red
- "No Robot Communication" message
- Can see robot WiFi but DS shows no connection

**Solutions:**

- **Basic Checks:**

  - Verify robot is powered on
  - Check roboRIO has power (LEDs lit)
  - Ensure radio is on and configured

- **Firewall:** Disable Windows Firewall
- **Network Configuration:**

  - Verify team number in Setup tab
  - Try entering IP directly: ``10.TE.AM.2``
  - Or hostname: ``roboRIO-####-FRC.local``

- **Connection Methods:**

  - Try USB connection first
  - Try Ethernet if wireless fails
  - Verify correct network adapter is active

For more information, see :doc:`/docs/software/driverstation/driver-station`.

### Joystick Issues

**Symptoms:**

- "Joystick disconnected" error
- Driver Station doesn't recognize joysticks
- Controls not responding

**Solutions:**

- **Force Refresh:** Press F1 to force joystick refresh
- **Check Joysticks Indicator:** Green when at least one joystick recognized, red when none connected
- **USB Hub:** Some USB hubs cause issues - try connecting directly to computer
- **Testing:** Open "USB Devices" tab to verify joystick data and button presses register

### Dashboard Not Showing Data

**Symptoms:**

- Camera stream not visible on dashboard
- NetworkTables values not updating
- Shuffleboard shows static values

**Solutions:**

- **Dashboard Selection:** Configure on Setup Tab: LabVIEW Dashboard, SmartDashboard, or Shuffleboard
- **NetworkTables Connection:** Check robot connection first - use OutlineViewer to verify data is being sent
- **Shuffleboard:** Drag values from NetworkTables view to create widgets
- **Camera Streams:**

  - Verify camera connected and powered
  - Check camera code is running on roboRIO or coprocessor
  - Test stream in browser: ``http://10.TE.AM.2:1181``

For more information, see :doc:`/docs/software/dashboards/shuffleboard/getting-started/shuffleboard-displaying-data`.

## Firmware and Software

### Outdated Firmware

**Symptoms:**

- "Firmware version mismatch" errors
- Incompatible device versions

**Solutions:**

- **Radio Firmware:** Update via FRC Radio Configuration Utility
- **roboRIO Firmware:** Update via roboRIO Imaging Tool
- **Motor Controller Firmware:**

  - SPARK MAX/Flex: Update via REV Hardware Client
  - Talon SRX/FX: Update via Phoenix Tuner/Phoenix Tuner X

- **When to Update:**

  - Beginning of each season (January)
  - When vendor releases critical fixes
  - Before first competition

### Vendor Dependencies Not Updating

**Symptoms:**

- "Update Available" shown but update fails
- Old vendor library causing issues

**Solutions:**

- **Update Process:**

  1. VS Code → WPI icon → Manage Vendor Libraries
  2. Click "To Latest" for individual library
  3. Or click "Update All" for all libraries

- **Manual Update:** Delete vendor JSON file from ``vendordeps`` folder and re-install via online URL
- **After Update:** Run Gradle clean, rebuild project, deploy fresh code

## Network Configuration

### Radio Configuration / Programming

**Symptoms:**

- Cannot program radio
- "Timeout waiting for radio" error
- Radio doesn't broadcast correct SSID

**Solutions:**

- **Prerequisites:**

  - Radio connected via Ethernet to computer
  - Computer IP set to DHCP or 10.0.0.5
  - Only Ethernet adapter enabled (disable WiFi)

- **Firewall:** Disable Windows Firewall - do NOT check firewall option in Radio Config Utility
- **Verification:**

  - Look for SSID: ``####`` (your team number)
  - Radio should have IP: ``10.TE.AM.1``

For more information, see :doc:`/docs/zero-to-robot/step-3/radio-programming`.

### Robot Network Not Working at Competition

**Symptoms:**

- Works at home but not at competition
- Cannot connect when on field

**Solutions:**

- **Static IPs:** Remove any static IP configuration - robot must use DHCP at competition
- **Firewall:** Disable all firewalls on Driver Station laptop
- **FMS Connection:**

  - Team SSID won't work on field
  - Must use wired Ethernet to field
  - Radio automatically configured by FMS

- **Network Adapter:** Use wired Ethernet for DS at competition, disable WiFi on DS laptop

### Camera / Vision Not Working

**Symptoms:**

- Camera stream not visible on dashboard
- Vision processing not working
- USB camera not detected

**Solutions:**

- **Camera Connection:**

  - USB cameras: Verify connected to roboRIO USB port
  - Ethernet cameras: Verify IP configuration and DNS name
  - Power check: Ensure camera has power

- **Camera Code:** Verify camera code running (check riolog)
- **NetworkTables Connection:** Raspberry Pi streams require NetworkTables connection - verify Pi connects to roboRIO
- **Bandwidth:** Reduce camera resolution/framerate if high latency - limit streams to 1-2 cameras max
- **Test URLs:** Default stream: ``http://10.TE.AM.2:1181``

For more information, see :doc:`/docs/software/vision-processing/index`.

### Sensor Issues

**Symptoms:**

- Encoder not reading
- Gyro values incorrect
- "Gyro not calibrated" warning
- Sensor drift

**Solutions:**

- **Gyro Calibration:**

  - Robot MUST be stationary during calibration
  - Calibrate in ``robotInit()`` by calling ``calibrate()``
  - Check ``isCalibrating()`` before using gyro data
  - Gyro drift accumulates over time (normal behavior)

- **Encoder Issues:**

  - Verify wiring (A/B channels connected correctly)
  - Check for crosstalk between encoder and motor wires
  - Swap encoder wires if getting reversed readings
  - Verify encoder counts changing when wheel spins

- **CAN Encoders:** Verify motor controller CAN connection and encoder type configuration

For more information, see :doc:`/docs/software/hardware-apis/sensors/gyros-software`.

## Design Decision Questions

These questions address common "which should I choose" decisions teams face. Answers focus on objective technical facts rather than subjective preferences.

### Should I use Command-Based programming?

**Command-Based provides:**
- Structured framework for organizing robot code
- Built-in scheduling and command composition
- Better code reusability across mechanisms
- Easier to add autonomous routines
- Industry-standard design patterns

**When not to use Command-Based:**
- Very simple robots (single mechanism)
- Team is more comfortable with timed/state machine approaches
- Limited programming experience and time

Most competitive teams use Command-Based for its organizational benefits. See :doc:`/docs/software/commandbased/what-is-command-based` for details.

### PID on motor controller vs on roboRIO?

**On Motor Controller (Phoenix, REVLib):**
- Lower latency (faster control loop)
- Offloads computation from roboRIO
- Works even if roboRIO code crashes
- More limited tuning/debugging visibility
- Requires CAN bus for configuration

**On roboRIO (WPILib PIDController):**
- Full control over implementation
- Easy to log and debug
- Can combine multiple sensors
- More flexible filtering and setpoint generation
- Subject to roboRIO loop timing

**Recommendation:** Use motor controller PID for simple position/velocity control of individual mechanisms. Use roboRIO for complex control strategies that need multiple sensors or custom logic.

### Which trajectory follower should I use?

**Ramsete (Differential Drive):**
- Designed specifically for tank/differential drives
- Handles non-holonomic constraints
- Well-tested and documented
- See :doc:`/docs/software/pathplanning/trajectory-tutorial/index`

**Holonomic Controller (Swerve/Mecanum):**
- For holonomic drivetrains only
- Simpler math than non-holonomic control
- See :doc:`/docs/software/advanced-controls/trajectories/holonomic`

**PathPlanner/Choreo:**
- Higher-level path planning tools
- Generate trajectories with WPILib followers
- Add waypoints, constraints, event markers
- PathPlanner: https://pathplanner.dev
- Choreo: :doc:`/docs/software/pathplanning/choreo/index`

**Note:** Ramsete documentation is being replaced with guidance toward PathPlanner and Choreo as modern alternatives. See Issue #2651.

### Which dashboard should I use?

**Shuffleboard:**
- Official WPILib dashboard
- Customizable layouts with tabs
- NetworkTables integration
- Plugin support
- See :doc:`/docs/software/dashboards/shuffleboard/index`

**Glass:**
- Lightweight, focused on visualization
- Built-in pose plotting and mechanism visualization
- Lower resource usage than Shuffleboard
- See :doc:`/docs/software/dashboards/glass/index`

**SmartDashboard:**
- Legacy dashboard, still functional
- Simple key-value display
- Minimal features compared to newer options
- Consider upgrading to Shuffleboard or Glass

**Third-Party:**
- AdvantageScope: Log file analysis and replay
- Elastic: Web-based dashboard
- QDriverStation: Cross-platform driver station

**Recommendation:** Use Shuffleboard for general purposes, Glass for pose visualization, AdvantageScope for match analysis.

### Java, C++, or Python?

**Java:**
- Most common FRC language (~70% of teams)
- Best documentation and examples
- Robust ecosystem and tooling
- Garbage collection simplifies memory management

**C++:**
- Highest performance (rarely matters in FRC)
- No garbage collection pauses
- More complex memory management
- Preferred by teams with C++ mentors

**Python (RobotPy):**
- Fastest to write and prototype
- Simple syntax, good for beginners
- Smaller community and fewer examples
- Some vendor libraries have limited support
- See https://robotpy.readthedocs.io

**Recommendation:** Choose based on mentor/student experience. Java is the "safe" choice with the most support. All three languages have access to the same WPILib features.

## Additional Resources

For more support options, see :doc:`support-resources`.

**Official Documentation:**

- WPILib Docs: https://docs.wpilib.org
- Known Issues: :doc:`/docs/yearly-overview/known-issues`
- Status Light Reference: :doc:`/docs/hardware/hardware-basics/status-lights-ref`

**Community Resources:**

- Chief Delphi Forums: https://www.chiefdelphi.com
- FRC Discord: https://discord.com/invite/frc
- r/FRC Subreddit: https://reddit.com/r/FRC
