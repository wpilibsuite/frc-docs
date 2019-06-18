RoboRIO Networking
==================

The network setup used on the roboRIO system is a little bit different than the previous Control System. The new scheme utilizes mDNS to allow for the use of DHCP addressing and seamless transition from ethernet to USB and back.

This document discusses the  typical setup at home. For more information about the networking environment at events, or about using Static IPs see :ref:`docs/networking/ip-networking:IP Networking`

mDNS
----

The FRC Driver Station, LabVIEW, and the Eclipse plugins for C++ and Java are all programmed to discover your roboRIO using the mDNS protocol. This means that the roboRIO can be detected regardless of the interface or IP being used.

mDNS - Principles
^^^^^^^^^^^^^^^^^

Multicast Domain Name System (mDNS) is a system which allows for resolution of host names to IP addresses on small networks with no dedicated name server. To resolve a host name a device sends out a multicast message to the network querying for the device. The device then responds with a multicast message containing it's IP. Devices on the network can store this information in a cache so subsequent requests for this address can be resolved from the cache without repeating the network query.

mDNS - Providers
^^^^^^^^^^^^^^^^

To use mDNS, an mDNS implementation is required to be installed on your PC. Here are some common mDNS implementations for each major platform:

Windows:

- **NI mDNS Responder:** Installed with the NI FRC Update Suite
- **Apple Bonjour:** Installed with iTunes

OSX:

- **Apple Bonjour:** Installed by default

Linux:

- **nss-mDNS/Avahi/Zeroconf:** Installed and enabled by default on some Linux variants (such as Ubuntu or Mint). May need to be installed or enabled on others (such as Arch)

mDNS - Firewalls
^^^^^^^^^^^^^^^^

.. note:: Depending on your PC configuration, no changes may be required, this section is provided to assist with troubleshooting.

To work properly mDNS must be allowed to pass through your firewall. Because the network traffic comes from the mDNS implementation and not directly from the Driver Station or IDE, allowing those applications through may not be sufficient. There are two main ways to resolve mDNS firewall issues:

- Add an application/service exception for the mDNS implementation (NI mDNS Responder is ``C:\Program Files\National Instruments\Shared\mDNS Responder\nimdnsResponder.exe``)
- Add a port exception for traffic to/from UDP 5353. IP Ranges:

  - 10.0.0.0 - 10.255.255.255
  - 172.16.0.0 - 172.31.255.255
  - 192.168.0.0 - 192.168.255.255
  - 169.254.0.0 - 169.254.255.255
  - 224.0.0.251

mDNS - Browser support
^^^^^^^^^^^^^^^^^^^^^^

Most web-browsers should be able to utilize the mDNS address to access the roboRIO webserver as long as an mDNS provider is installed. To access the webdashboard, the browser must also support Microsoft Silverlight. Internet Explorer is recommended.

USB
---

If using the USB interface, no network setup is required (you do need the :ref:`docs/software/getting-started/frc-update-suite:Installing the FRC Update Suite` installed to provide the roboRIO USB Driver). The roboRIO driver will automatically configure the IP address of the host (your computer) and roboRIO and the software listed above should be able to locate and utilize your roboRIO.

Ethernet/Wireless
-----------------

The :ref:`docs/software/getting-started/radio-programming:Programming your Radio` will enable the DHCP server on the OpenMesh radio in the home use case (AP mode), if you are putting the OpenMesh in bridge mode and using a router, you can enable DHCP addressing on the router. The bridge is set to the same team based IP address as before (10.TE.AM.1) and will hand out DHCP address from **10.TE.AM.20** to **10.TE.AM.199**. When connected to the field, FMS will also hand out addresses in the same IP range.

roboRIO Ethernet Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. important:: The roboRIO Ethernet interface should be set to DHCP.

When connected to the OpenMesh bridge, the roboRIO will receive an IP from the bridge. When tethered directly to a PC, both devices will self-assign IPs.

PC Adapter Configuration
^^^^^^^^^^^^^^^^^^^^^^^^

.. important:: When connecting via Ethernet (to either the radio or directly to the roboRIO) or Wireless (to the OpenMesh radio), your computer adapter should be set to DHCP.

When connecting through the OpenMesh, your PC will receive an IP address from the radio. If tethered directly to the roboRIO both devices will self-assign IPs.

IP List
-------

See :ref:`docs/networking/ip-networking:IP Networking` for more information
