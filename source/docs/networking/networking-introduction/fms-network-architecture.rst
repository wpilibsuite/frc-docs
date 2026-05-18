# Understanding the FMS Network Architecture

This article provides an overview of how the Field Management System (FMS) network is structured at FRC competitions. Understanding this architecture helps teams troubleshoot connectivity issues and design robust networking solutions for their robots.

.. note:: This article summarizes key information from the `FMS Whitepaper <https://fms-manual.readthedocs.io/en/latest/fms-whitepaper/fms-whitepaper.html>`__. For complete technical details, refer to the full whitepaper.

## Network Topology Overview

The FMS network is an Ethernet-based system that connects all robots, driver stations, and field equipment. The **Score Switch** connects the following components:

- **Field Router**: Manages FMS network routing (VLANs) and traffic in/out of event internet uplink
- **FMS Server**: Controls match flow and communicates with Driver Station software
- **Field Access Point (AP)**: Provide 6 GHz wireless connectivity to robots

Robot-to-field communication uses a dedicated wireless access point operating in the 6 GHz band with 802.11ax (Wi-Fi 6E) to minimize interference from spectator devices. FTAs use a secondary AP with their wireless devices for field network debugging, that runs on either the 2.4GHz or 5GHz band depending on network congestion.

## Team Network Isolation

FMS completely isolates each team's traffic from other teams. Each team's network contains **only** their robot, driver station, and the FMS server.

.. important:: Teams cannot communicate with other teams' robots or driver stations, even during the same match. This isolation protects against accidental interference and ensures fair competition.

## IP Addressing on the Field

When connected to FMS, teams use the standard ``10.TE.AM.xx`` addressing scheme:

**Field Network (DHCP Range):**
- Driver Station: ``10.TE.AM.20`` - ``10.TE.AM.199`` (assigned by FMS)
- Gateway: ``10.TE.AM.4``
- Subnet Mask: ``255.255.255.0``

**Robot Network (via Team Radio):**
- Robot Radio: ``10.TE.AM.1`` (static)
- Systemcore: ``10.TE.AM.2`` (DHCP from robot radio)
- Other robot devices: ``10.TE.AM.200`` - ``10.TE.AM.219`` (DHCP from robot radio)

.. note:: The Field Router does **not** provide DHCP services to robot devices. Your team's robot radio provides DHCP addressing for devices onboard the robot.

## Wireless Specifications

- **Frequency Band**: 6 GHz
- **Standard**: 802.11ax (Wi-Fi 6E)
- **Encryption**: WPA3 with AES encryption
- **Security Keys**: Unique per team, per event (teams program their radio at event kiosks)

## Network Security

Teams are isolated from each other through WPA3 encryption with per-team keys, and a field firewall that restricts which ports are available (see :doc:`fms-ports-protocols`).

## How FMS Coordinates Robot Communication

Think of FMS as a conductor - it tells each Driver Station when to start and stop, but the Driver Station communicates directly with the robot to "make the music." FMS initially sets up the communication, like a conductor pairing musicians with their instruments.

When your robot connects to the field:

1. **Driver Station** connects to field via Ethernet or field AP, receives DHCP address from FMS
2. **Robot Radio** connects to 6 GHz field AP using team-specific WPA3 key
3. **Systemcore** receives DHCP address ``10.TE.AM.2`` from robot radio
4. **FMS Server** establishes connection with the Driver Station software and begins sending control packets to the Driver Station software
5. **Driver Station** sends control packets to the robot, corresponding to the FMS-commanded mode
6. **Robot** sends status information back to the Driver Station
7. **Driver Station** sends status information back to the FMS

The FMS tells your Driver Station what mode to use (auto/teleop/utility) and when to enable/disable the robot, but your Driver Station and robot communicate directly with each other.

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

- Each team's network is completely isolated from other teams
- FMS uses 6 GHz Wi-Fi 6E; FTAs use a separate 2.4/5 GHz AP for debugging
- Your robot radio provides DHCP for robot devices; FMS provides DHCP for driver stations
- Bandwidth is limited to 7 Mbps per team with prioritized traffic types
- Standard ``10.TE.AM.xx`` addressing works on field and in pits

For port-specific information, see :doc:`fms-ports-protocols`. For performance optimization, see :doc:`network-performance-optimization`.
