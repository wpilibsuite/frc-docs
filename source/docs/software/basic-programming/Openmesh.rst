
# Using the OpenMesh OMP5 Radio


Prior to 2025 the official radio used in FRC was an OM5P-AN or OM5P-AC Radio. 



.. image:: images/control-system-hardware/openmesh-radio.png
  :alt: OpenMesh OM5P-AN or OM5P-AC Radio
  :width: 500

Either the OpenMesh OM5P-AN or `OpenMesh OM5P-AC <https://www.andymark.com/products/open-mesh-om5p-ac-dual-band-1-17-gbps-access-point-radio>`__ wireless radio was used as the robot radio to provide wireless communication functionality to the robot. The device can still be configured as an Access Point for direct connection of a laptop for use at home. It can also be configured as a bridge for use on the field. The robot radio should be powered by one of the 12V/2A outputs on the VRM and connected to the roboRIO controller over Ethernet.



##Programming your Radio

This guide will show you how to use the FRC\ |reg| Radio Configuration Utility software to configure your robot's wireless bridge for use outside of FRC events.

##Prerequisites

The FRC Radio Configuration Utility requires administrator privileges to configure the network settings on your machine. The program should request the necessary privileges automatically (may require a password if run from a non-administrator account), but if you are having trouble, try running it from an administrator account.

Download the latest FRC Radio Configuration Utility Installer from the following links:

`FRC Radio Configuration 24.0.1 <https://firstfrc.blob.core.windows.net/frc2024/Radio/FRC_Radio_Configuration_24_0_1.zip>`_

`FRC Radio Configuration 24.0.1 Israel Version <https://firstfrc.blob.core.windows.net/frc2024/Radio/FRC_Radio_Configuration_24_0_1_IL.zip>`_

.. note:: The _IL version is for Israel teams and contains a version of the OM5PAC firmware with restricted channels for use in Israel.

.. note::. Teams planning on using the radio tool on a machine without the WPILib suite installed, will need a copy of Java installed. This can be downloaded `here <https://adoptium.net/temurin/releases/?version=17>`__.

Before you begin using the software:

1. :ref:`Disable all other network adapters <docs/networking/networking-introduction/roborio-network-troubleshooting:Disabling Network Adapters>`
2. Plug directly from your computer into the wireless bridge ethernet port closest to the power jack. Make sure no other devices are connected to your computer via ethernet. If powering the radio via PoE, plug an Ethernet cable from the PC into the socket side of the PoE adapter (where the roboRIO would plug in). If you experience issues configuring through the PoE adapter, you may try connecting the PC to the alternate port on the radio.

.. warning:: The OM5P-AN and AC use the same power plug as the former D-Link DAP1522, however they are 12V radios. Wire the radio to the 12V 2A terminals on the VRM (center-pin positive).

##Application Notes


By default, the Radio Configuration Utility will program the radio to enforce the 4Mbps bandwidth limit on traffic exiting the radio over the wireless interface. In the home configuration (AP mode) this is a total, not a per client limit. This means that streaming video to multiple clients is not recommended.

The Utility has been tested on Windows 7, 8 and 10. It may work on other operating systems, but has not been tested.

##Programmed Configuration


.. image:: /docs/hardware/hardware-basics/images/status-lights/openmesh-radio-status-lights.png
  :alt: Lists the names of each of the status lights on the two legal radios.

The Radio Configuration Utility programs a number of configuration settings into the radio when run. These settings apply to the radio in all modes (including at events). These include:

- Set a static IP of ``10.TE.AM.1``
- Set an alternate IP on the wired side of ``192.168.1.1`` for future programming
- Bridge the wired ports so they may be used interchangeably
- The LED configuration noted in the graphic above.
- 4Mb/s bandwidth limit on the outbound side of the wireless interface (may be disabled for home use)
- QoS rules for internal packet prioritization (affects internal buffer and which packets to discard if bandwidth limit is reached). These rules are:

  - Robot Control and Status (UDP ``1110``, ``1115``, ``1150``)
  - Robot TCP & :term:`NetworkTables` (TCP ``1735``, ``1740``)
  - Bulk (All other traffic). (disabled if BW limit is disabled)

- :term:`DHCP` server enabled. Serves out:

  - ``10.TE.AM.11`` - ``10.TE.AM.111`` on the wired side
  - ``10.TE.AM.138`` - ``10.TE.AM.237`` on the wireless side
  - Subnet mask of ``255.255.255.0``
  - Broadcast address ``10.TE.AM.255``

- DNS server enabled. DNS server IP and domain suffix (``.lan``) are served as part of the DHCP.

At home only:

- SSID may have a "Robot Name" appended to the team number to distinguish multiple networks.
- Firewall option may be enabled to mimic the field firewall rules (open ports may be found in the Game Manual)

.. warning:: It is not possible to modify the configuration manually.

##Install the Software


.. image:: images/radio-programming/radio-installer.png
  :alt: The radio configuration installer .exe file in windows explorer.

Double click on ``FRC_Radio_Configuration_VERSION.exe`` to launch the installer. Follow the prompts to complete the installation.

Part of the installation prompts will include installing Npcap if it is not already present. The Npcap installer contains a number of checkboxes to configure the install. You should leave the options as the defaults.






