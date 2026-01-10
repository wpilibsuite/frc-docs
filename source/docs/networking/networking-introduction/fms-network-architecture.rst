# Understanding the FMS Network Architecture

This article provides an overview of how the Field Management System (FMS) network is structured at FRC competitions. Understanding this architecture helps teams troubleshoot connectivity issues and design robust networking solutions for their robots.

.. note:: This article summarizes key information from the `FMS Whitepaper <https://fms-manual.readthedocs.io/en/latest/fms-whitepaper/fms-whitepaper.html>`__. For complete technical details, refer to the full whitepaper.

## Network Topology Overview

The FMS network is an Ethernet-based system that connects all robots, driver stations, and field equipment. The **Score Switch** connects the following components:

- **Field Router**: Connects to the FMS server and manages alliance networks
- **FMS Server**: Controls match flow and communicates with Driver Station software
- **Field Access Point (AP)**: Provides 6 GHz wireless connectivity to robots
- **Smart Router**: Manages external connectivity and network services

Robot-to-field communication uses a dedicated wireless access point operating in the 6 GHz band with 802.11ax (Wi-Fi 6E) to minimize interference from spectator devices.

## Team Network Isolation

The FMS network uses Virtual LANs (VLANs) to completely isolate each team's traffic. Each team's network contains **only** their robot, driver station, and the FMS server.

.. important:: Teams cannot communicate with other teams' robots or driver stations, even during the same match. This isolation protects against accidental interference and ensures fair competition.

## IP Addressing on the Field

When connected to FMS, teams use the standard ``10.TE.AM.xx`` addressing scheme:

**Field Network (DHCP Range):**
- Driver Station: ``10.TE.AM.20`` - ``10.TE.AM.199`` (assigned by FMS)
- Gateway: ``10.TE.AM.4``
- Subnet Mask: ``255.255.255.0``

**Robot Network (via Team Radio):**
- Robot Radio: ``10.TE.AM.1`` (static)
- roboRIO: ``10.TE.AM.2`` (DHCP from robot radio)
- Other robot devices: ``10.TE.AM.200`` - ``10.TE.AM.219`` (DHCP from robot radio)

.. note:: The Field Router does **not** provide DHCP services to robot devices. Your team's robot radio provides DHCP addressing for devices onboard the robot.

## Wireless Specifications

FMS wireless uses modern standards to ensure reliable connectivity:

- **Frequency Band**: 6 GHz exclusively (avoids 2.4/5 GHz congestion from phones, tablets)
- **Standard**: 802.11ax (Wi-Fi 6E)
- **Encryption**: WPA3 with AES encryption
- **Security Keys**: Unique per team, per event (teams configure radios using event kiosks)

.. warning:: Field staff devices use separate 2.4 GHz and 5 GHz networks. Robot radios must be configured for 6 GHz operation at competition.

## Network Security

FMS uses several techniques to isolate team networks:

1. **VLAN Isolation**: Each team's network is completely separated from other teams
2. **WPA3 Encryption**: Wireless traffic is encrypted with per-team keys
3. **Port Restrictions**: Only approved network ports are allowed through the field firewall (see :doc:`fms-ports-protocols`)

## How FMS Coordinates Robot Communication

Think of FMS as a conductor - it tells each Driver Station when to start and stop, but the Driver Station communicates directly with the robot to "make the music." FMS initially sets up the communication, like a conductor pairing musicians with their instruments.

When your robot connects to the field:

1. **Driver Station** connects to field via Ethernet or field AP, receives DHCP address from FMS
2. **Robot Radio** connects to 6 GHz field AP using team-specific WPA3 key
3. **roboRIO** receives DHCP address ``10.TE.AM.2`` from robot radio
4. **FMS Server** establishes connection with the Driver Station software and begins sending control packets to the Driver Station software
5. **Driver Station** sends control packets to the robot, corresponding to the FMS-commanded mode
6. **Robot** sends status information back to the Driver Station
7. **Driver Station** sends status information back to the FMS

The FMS tells your Driver Station what mode to use (auto/teleop/test) and when to enable/disable the robot, but your Driver Station and robot communicate directly with each other.

## Bandwidth Allocation

FMS allocates network bandwidth with the following limits:

- **Per Team**: 7 Mbps maximum
- **Total Field**: 42 Mbps (across all 6 robots)

Traffic is prioritized in this order:
1. Driver Station control packets (highest priority)
2. NetworkTables data
3. Camera streams and custom data (lowest priority)

See :doc:`network-performance-optimization` for guidance on staying within bandwidth limits.

## Field vs. Pits Networking

**On the Field:**
- FMS provides DHCP for driver stations
- Robot radio provides DHCP for robot devices
- Field firewall restricts which ports can be used

**In the Pits:**
- Only your robot radio provides DHCP
- No FMS server present
- All ports are available for debugging

Your robot should work seamlessly in both environments if following standard :doc:`ip-configurations`.

## Key Takeaways

- Each team's network is completely isolated in its own VLAN
- FMS uses 6 GHz Wi-Fi 6E to avoid interference
- Your robot radio provides DHCP for robot devices; FMS provides DHCP for driver stations
- Bandwidth is limited to 7 Mbps per team with prioritized traffic types
- Standard ``10.TE.AM.xx`` addressing works on field and in pits

For port-specific information, see :doc:`fms-ports-protocols`. For performance optimization, see :doc:`network-performance-optimization`.
