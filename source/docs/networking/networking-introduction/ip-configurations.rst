# IP Configurations

This document describes the IP configuration used at events, both on the fields and in the pits, potential issues, and workaround configurations.

## TE.AM IP Address Notation

The notation TE.AM is used as part of IPs in numerous places. This notation refers to splitting your five digit team number into digits for the IP address octets. Where AM is the last two digits of the team number, and TE is the first three digits. Leading zeros are optional. This scheme supports team numbers up to 25599.

Example: ``10.TE.AM.2``

Team 1 - ``10.0.1.2``

Team 12 - ``10.0.12.2``

Team 122 - ``10.1.22.2``

Team 1002 - ``10.10.2.2``

Team 1212 - ``10.12.12.2``

Team 1202 - ``10.12.2.2``

Team 1220 - ``10.12.20.2``

Team 3456 - ``10.34.56.2``

Team 10000 - ``10.100.0.2``

Team 12345 - ``10.123.45.2``

## DHCP configuration

This section describes networking when using :term:`DHCP` to assign IP addresses on the field, in the pits, and at home.

### On the Field DHCP Configuration

Both the Field Network and Robot Radio run DHCP servers with non-overlapping pools. The Field Network DHCP server provides an IP address for the Driver Station, and the Robot Radio provides IP addresses for devices onboard the robot. The IP ranges, subnet mask, and default gateway are listed in the table below.

+-----------------+-------------------------------------+-------------------------------------------------------------+
|                 | Field Network                       | Robot Radio                                                 |
+=================+=====================================+=============================================================+
| DHCP Range      | ``10.TE.AM.20`` to ``10.TE.AM.199`` | ``10.TE.AM.200`` to ``10.TE.AM.219``                        |
+-----------------+-------------------------------------+-------------------------------------------------------------+
| Subnet Mask     | ``255.255.255.0``                   | ``255.255.255.0``                                           |
+-----------------+-------------------------------------+-------------------------------------------------------------+
| Default Gateway | ``10.TE.AM.4``                      | ``10.TE.AM.4`` (``10.TE.AM.1`` if using the OpenMesh radio) |
+-----------------+-------------------------------------+-------------------------------------------------------------+

-  Vivid-Hosting VH-109 Robot Radio - Static ``10.TE.AM.1`` programmed by Kiosk
-  roboRIO - DHCP ``10.TE.AM.2`` assigned by the Robot Radio
-  Driver Station - DHCP ("Obtain an IP address automatically") ``10.TE.AM.X`` assigned by field
-  Other devices (if used) - DHCP ``10.TE.AM.YY`` assigned by Robot Radio

### In the Pits DHCP Configuration

-  VH-109 radio - Static ``10.TE.AM.1`` programmed by Kiosk.
-  roboRIO - ``10.TE.AM.2``, assigned by Robot Radio
-  Driver Station - DHCP ("Obtain an IP address automatically"),
   ``10.TE.AM.X``, assigned by Robot Radio
-  Other devices (if used) - DHCP, ``10.TE.AM.Y``, assigned by Robot Radio

.. note:: If the roboRIO is not being assigned a DHCP IP address of ``10.TE.AM.2``, ensure you've :ref:`Set the roboRIO team number <docs/zero-to-robot/step-3/roborio2-imaging:Setting the roboRIO Team Number>`

### At Home DHCP Configuration

-  VH-109 radio - Static ``10.TE.AM.1`` programmed when configuring robot radio
-  roboRIO - ``10.TE.AM.2``, assigned by Robot Radio
-  VH-109 access point radio - Static ``10.TE.AM.4``, programmed when configuring access point radio
-  Driver Station - DHCP ("Obtain an IP address automatically"),
   ``10.TE.AM.X``, assigned by Robot Radio
-  Other devices (if used) - DHCP, ``10.TE.AM.Y``, assigned by Robot Radio

.. note:: If the roboRIO is not being assigned a DHCP IP address of ``10.TE.AM.2``, ensure you've :ref:`Set the roboRIO team number <docs/zero-to-robot/step-3/roborio2-imaging:Setting the roboRIO Team Number>`

## Static Configuration

It is also possible to configure static IPs on your devices to accommodate devices or software which do not support mDNS. When doing so you want to make sure to avoid addresses that will be in use when the robot is on the field network. These addresses are ``10.TE.AM.1`` for the VH-109 radio, ``10.TE.AM.3`` and ``10.TE.AM.4`` for the field network, and anything ``10.TE.AM.20`` or greater which may be assigned to a device configured for DHCP or else reserved. The roboRIO network configuration can be set from the webdashboard.

-  VH-109 radio - Static ``10.TE.AM.1`` programmed when configuring robot radio
-  roboRIO - Static ``10.TE.AM.2`` subnet mask of ``255.255.255.0`` (default)
-  VH-109 access point radio - Static ``10.TE.AM.4``, programmed when configuring access point radio
-  Driver Station - Static ``10.TE.AM.5`` subnet mask **must** be ``255.0.0.0`` to enable the DS to reach both the robot and :term:`FMS` Server, without additionally configuring the default gateway.
   If a static address is assigned and the subnet mask is set to ``255.255.255.0``, then the default gateway must be configured to ``10.TE.AM.4``.
-  Other devices - Static ``10.TE.AM.6-.19`` subnet ``255.255.255.0``
