# Understanding the FMS Network Architecture

This article provides an overview of how the Field Management System (FMS) network is structured at FRC competitions. Understanding this architecture helps teams troubleshoot connectivity issues and design robust networking solutions for their robots.

.. note:: This article summarizes key information from the `FMS Whitepaper <https://fms-manual.readthedocs.io/en/latest/fms-whitepaper/fms-whitepaper.html>`__. For complete technical details, refer to the full whitepaper.

## Network Topology Overview

The FMS network is an Ethernet-based system that connects all robots, driver stations, and field equipment. The network centers around a **Score Switch** that manages traffic between:

- **Field Router**: Connects to the FMS server and manages alliance networks
- **FMS Server**: Controls match flow and communicates with all robots
- **Field Access Points (APs)**: Provide 6 GHz wireless connectivity to robots
- **Smart Router**: Manages external connectivity and network services

All competition field communication uses dedicated wireless access points operating in the 6 GHz band with 802.11ax (Wi-Fi 6E) to minimize interference from spectator devices.

## VLAN Structure and Team Isolation

The FMS network uses Virtual LANs (VLANs) to isolate each team's traffic:

**Blue Alliance:**
- VLAN 10 (Station 1)
- VLAN 20 (Station 2)
- VLAN 30 (Station 3)

**Red Alliance:**
- VLAN 40 (Station 1)
- VLAN 50 (Station 2)
- VLAN 60 (Station 3)

**Administrative:**
- VLAN 100 (Field staff and equipment)

.. important:: Each VLAN contains **only** the robot, driver station, and FMS server. Teams cannot communicate with other teams' robots or driver stations, even during the same match.

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

.. note:: The Field Router does **not** provide DHCP services to robot devices. Your team's robot radio provides DHCP addressing for the robot network.

## Wireless Specifications

FMS wireless uses modern standards to ensure reliable connectivity:

- **Frequency Band**: 6 GHz exclusively (avoids 2.4/5 GHz congestion from phones, tablets)
- **Standard**: 802.11ax (Wi-Fi 6E)
- **Encryption**: WPA3 with AES encryption
- **Security Keys**: Unique per team, per event (teams receive keys at check-in)

.. warning:: Field staff devices use separate 2.4 GHz and 5 GHz networks. Robot radios must be configured for 6 GHz operation at competition.

## Security Features

FMS implements multiple security layers:

1. **VLAN Isolation**: Teams cannot see or communicate with other teams' networks
2. **WPA3 Encryption**: All wireless traffic is encrypted with per-team keys
3. **Port Restrictions**: Only approved network ports are allowed (see :doc:`fms-ports-protocols`)
4. **Traffic Inspection**: FMS monitors network traffic for rules compliance

These measures protect against accidental interference and ensure fair competition.

## How Robot-to-FMS Communication Works

When your robot connects to the field:

1. **Driver Station** connects to field via Ethernet or field AP, receives DHCP address from FMS
2. **Robot Radio** connects to 6 GHz field AP using team-specific WPA3 key
3. **roboRIO** receives DHCP address ``10.TE.AM.2`` from robot radio
4. **FMS Server** establishes control connection with both DS and robot
5. **Driver Station** sends control packets through FMS to robot
6. **Robot** sends status information back through FMS to DS

All control traffic is routed through the FMS server, which enforces match timing, enable/disable states, and mode selection (auto/teleop/test).

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
- All traffic monitored and controlled by FMS

**In the Pits:**
- Only your robot radio provides DHCP
- No FMS server present
- Devices may fall back to link-local (``169.254.x.x``) if misconfigured

Your robot should work seamlessly in both environments if following standard :doc:`ip-configurations`.

## Key Takeaways

- Each team's network is completely isolated in its own VLAN
- FMS uses 6 GHz Wi-Fi 6E to avoid interference
- Your robot radio provides DHCP for robot devices; FMS provides DHCP for driver stations
- Bandwidth is limited to 7 Mbps per team with prioritized traffic types
- Standard ``10.TE.AM.xx`` addressing works on field and in pits

For port-specific information, see :doc:`fms-ports-protocols`. For performance optimization, see :doc:`network-performance-optimization`.
