# FMS Network Ports and Protocols

This article provides a reference for network ports and protocols used by the Field Management System (FMS) and common FRC software. Understanding these ports helps with firewall configuration, custom software development, and network troubleshooting.

.. important:: Port usage rules are defined in the FRC Game Manual (Rule R704 for 2024). Always consult the current year's manual for official requirements. The `FMS Whitepaper <https://fms-manual.readthedocs.io/en/latest/fms-whitepaper/fms-whitepaper.html>`__ provides additional technical details.

## Core Robot Communication Ports

These ports are used for essential robot operation and are always allowed:

.. list-table::
   :header-rows: 1
   :widths: 15 15 50 20

   * - Port(s)
     - Protocol
     - Purpose
     - Used By
   * - 1110
     - TCP
     - Camera data (roboRIO)
     - WPILib CameraServer
   * - 1130
     - UDP
     - Dashboard-to-Robot control
     - Driver Station, Dashboards
   * - 1140
     - UDP
     - Robot-to-Dashboard status
     - roboRIO, Dashboards
   * - 1180-1190
     - TCP/UDP
     - Camera streams
     - IP Cameras, Driver Station
   * - 1735
     - TCP
     - SmartDashboard / Shuffleboard
     - SmartDashboard, Shuffleboard
   * - 5353
     - UDP
     - mDNS (multicast DNS)
     - All devices (``roboRIO-TEAM-FRC.local``)
   * - 5800-5810
     - TCP/UDP
     - Team custom use
     - Custom team software

## NetworkTables Ports

NetworkTables uses multiple ports for different protocol versions:

.. list-table::
   :header-rows: 1
   :widths: 15 15 50 20

   * - Port(s)
     - Protocol
     - Purpose
     - Version
   * - 1735
     - TCP
     - NetworkTables 3
     - NT3 (legacy)
   * - 5810
     - TCP
     - NetworkTables 4 (primary)
     - NT4 (current)
   * - 5810
     - UDP
     - NetworkTables 4 (discovery)
     - NT4 (current)

.. note:: NetworkTables 4 is the current standard. NetworkTables 3 (port 1735) is maintained for backwards compatibility with older dashboards.

## Driver Station Ports

The Driver Station uses these ports to communicate with the roboRIO and FMS:

.. list-table::
   :header-rows: 1
   :widths: 15 15 50

   * - Port
     - Protocol
     - Purpose
   * - 1110-1115
     - UDP
     - FMS-to-Robot control
   * - 1120-1125
     - UDP
     - Robot-to-FMS status
   * - 1130
     - UDP
     - DS-to-Robot control packets
   * - 1140
     - UDP
     - Robot-to-DS status packets
   * - 1750
     - TCP
     - DS-to-roboRIO (webdash, imaging)

## Vision Processing Ports

Common ports used by vision processing systems:

.. list-table::
   :header-rows: 1
   :widths: 15 15 50 20

   * - Port(s)
     - Protocol
     - Purpose
     - Device
   * - 1180-1190
     - TCP/UDP
     - MJPEG camera streams
     - Axis cameras, roboRIO
   * - 5800-5807
     - TCP
     - PhotonVision web interface
     - PhotonVision coprocessor
   * - 5800-5807
     - TCP
     - Limelight web interface
     - Limelight camera

.. note:: Vision coprocessors also use NetworkTables (port 5810) to send targeting data to the robot.

## Web Interface Ports

These ports provide web-based configuration and monitoring:

.. list-table::
   :header-rows: 1
   :widths: 15 15 50

   * - Port
     - Protocol
     - Purpose
   * - 80
     - TCP
     - roboRIO Web Dashboard (HTTP)
   * - 443
     - TCP
     - roboRIO Web Dashboard (HTTPS)
   * - 5800-5810
     - TCP
     - Coprocessor web interfaces (PhotonVision, Limelight, etc.)

## Packet Prioritization

FMS prioritizes network traffic to ensure reliable robot control:

1. **Highest Priority**: Driver Station control packets (ports 1110-1115, 1130)

   - Robot enable/disable commands
   - Mode selection (auto/teleop/test)
   - Joystick/gamepad data
   - These packets are **never** dropped or delayed

2. **Medium Priority**: NetworkTables data (ports 1735, 5810)

   - Sensor readings sent to dashboard
   - Configuration values from dashboard
   - Vision targeting information
   - May be throttled if bandwidth limit exceeded

3. **Lowest Priority**: Camera streams and custom data (ports 1180-1190, 5800-5810)

   - MJPEG video streams
   - Custom telemetry data
   - May be significantly throttled or dropped if bandwidth limit exceeded

.. important:: To ensure reliable robot control, keep NetworkTables and camera bandwidth low. See :doc:`network-performance-optimization` for optimization strategies.

## Protocol Details

**UDP (User Datagram Protocol)**
- Used for time-sensitive data (control packets, status updates)
- No guaranteed delivery, but lower latency
- Preferred for real-time robot control

**TCP (Transmission Control Protocol)**
- Used for reliable data transfer (NetworkTables, camera streams, web interfaces)
- Guaranteed delivery with automatic retransmission
- Higher latency than UDP

**mDNS (Multicast DNS)**
- Allows devices to be found by name (``roboRIO-TEAM-FRC.local``)
- Uses UDP port 5353
- No DNS server required
- Essential for DHCP networks where IP addresses may change

## Firewall Configuration

For PC-based tools (Driver Station, dashboards, imaging tools) to work properly, your firewall must allow:

- **All ports listed above** for the ``10.0.0.0/8`` IP range (``10.TE.AM.xx`` addresses)
- **UDP port 5353** for mDNS (for ``.local`` hostname resolution)
- **Link-local range** ``169.254.0.0/16`` (for direct connections without DHCP)

See :doc:`windows-firewall-configuration` for detailed firewall setup instructions.

## Port Usage Rules

.. warning:: The FRC Game Manual restricts which ports teams may use. Always verify port usage against the current year's rules (typically Rule R704).

**Generally Allowed:**
- Ports listed in the tables above (WPILib standard ports)
- Ports 5800-5810 for custom team use

**Restricted:**
- Ports outside the approved ranges may be blocked by FMS
- Using non-standard ports may prevent your robot from functioning on the field

## Common Port Issues

**Problem**: Dashboard can't connect to robot
- **Check**: Firewall blocking port 5810 (NT4) or 1735 (NT3)
- **Check**: mDNS not working (port 5353 blocked)

**Problem**: Camera stream not visible
- **Check**: Bandwidth limit exceeded (camera resolution too high)
- **Check**: Firewall blocking ports 1180-1190

**Problem**: Can't access roboRIO web dashboard
- **Check**: Firewall blocking port 80/443
- **Check**: Using HTTP (``http://10.TE.AM.2``) not HTTPS

For more troubleshooting guidance, see :doc:`roborio-network-troubleshooting`.

## Key Takeaways

- Driver Station control packets (ports 1110-1115, 1130) have highest priority
- NetworkTables 4 uses port 5810 (TCP/UDP); NT3 uses port 1735 (TCP)
- Camera streams (ports 1180-1190) are lowest priority and may be throttled
- mDNS (port 5353) is essential for ``.local`` hostname resolution
- Ports 5800-5810 are reserved for team custom use
- Always consult the current Game Manual for official port restrictions

For bandwidth optimization, see :doc:`network-performance-optimization`. For IP addressing details, see :doc:`ip-configurations`.
