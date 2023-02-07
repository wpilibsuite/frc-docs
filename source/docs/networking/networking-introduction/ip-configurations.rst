IP Configurations
=================

.. note:: This document describes the IP configuration used at events, both on the fields and in the pits, potential issues and workaround configurations.

TE.AM IP Notation
-----------------

The notation TE.AM is used as part of IPs in numerous places in this document. This notation refers to splitting your four digit team number into two digit pairs for the IP address octets.

Example: ``10.TE.AM.2``

Team 12 - ``10.0.12.2``

Team 122 - ``10.1.22.2``

Team 1212 - ``10.12.12.2``

Team 1202 - ``10.12.2.2``

Team 1220 - ``10.12.20.2``

Team 3456 - ``10.34.56.2``

On the Field
------------

This section describes networking when connected to the Field Network for match play

On the Field DHCP Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The Field Network runs a DHCP server with pools for each team that will hand out addresses in the range of ``10.TE.AM.20`` to ``10.TE.AM.199`` with a subnet mask of ``255.255.255.0``, and a default gateway of ``10.TE.AM.4``.
When configured for an event, the Team Radio runs a DHCP server with a pool for devices onboard the robot that will hand out addresses in the range of 10.TE.AM.200 to 10.TE.AM.219 with a subnet mask of 255.255.255.0, and a gateway of 10.TE.AM.1.

-  OpenMesh OM5P-AN or OM5P-AC radio - Static ``10.TE.AM.1`` programmed by
   Kiosk
-  roboRIO - DHCP ``10.TE.AM.2`` assigned by the Robot Radio
-  Driver Station - DHCP ("Obtain an IP address automatically")
   10.TE.AM.X assigned by field
-  IP camera (if used) - DHCP ``10.TE.AM.Y`` assigned by Robot Radio
-  Other devices (if used) - DHCP ``10.TE.AM.Z`` assigned by Robot Radio

On the Field Static Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It is also possible to configure static IPs on your devices to accommodate devices or software which do not support mDNS. When doing so you want to make sure to avoid addresses that will be in use when the robot is on the field network. These addresses are ``10.TE.AM.1`` for the OpenMesh radio, ``10.TE.AM.4`` for the field router, and anything greater than ``10.TE.AM.20`` which may be assigned to a device configured for DHCP or else reserved. The roboRIO network configuration can be set from the webdashboard.

-  OpenMesh radio - Static ``10.TE.AM.1`` programmed by Kiosk
-  roboRIO - Static ``10.TE.AM.2`` would be a reasonable choice, subnet mask
   of ``255.255.255.0`` (default)
-  Driver Station - Static ``10.TE.AM.5`` would be a reasonable choice,
   subnet mask **must** be ``255.0.0.0`` to enable the DS to reach both the robot and FMS Server, without additionally configuring the default gateway.
   If a static address is assigned and the subnet mask is set to ``255.255.255.0``, then the default gateway must be configured to ``10.TE.AM.4``.
-  IP Camera (if used) - Static ``10.TE.AM.11`` would be a reasonable
   choice, subnet ``255.255.255.0`` should be fine
-  Other devices - Static ``10.TE.AM.6-.10`` or ``.12-.19`` (.11 if camera not
   present) subnet ``255.255.255.0``

In the Pits
-----------

.. note:: **New for 2018:** There is now a DHCP server running on the wired side of the Robot Radio in the event configuration.

In the Pits DHCP Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

-  OpenMesh radio - Static ``10.TE.AM.1`` programmed by Kiosk.
-  roboRIO - ``10.TE.AM.2``, assigned by Robot Radio
-  Driver Station - DHCP ("Obtain an IP address automatically"),
   ``10.TE.AM.X``, assigned by Robot Radio
-  IP camera (if used) - DHCP, ``10.TE.AM.Y``, assigned by Robot Radio
-  Other devices (if used) - DHCP, ``10.TE.AM.Z``, assigned by Robot Radio

In the Pits Static Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It is also possible to configure static IPs on your devices to accommodate devices or software which do not support mDNS. When doing so you want to make sure to avoid addresses that will be in use when the robot is on the field network. These addresses are ``10.TE.AM.1`` for the OpenMesh radio and ``10.TE.AM.4`` for the field router.
