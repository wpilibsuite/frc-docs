.. include:: <isonum.txt>

# Programming your Radio

This guide shows a basic at-home setup using the VH-109 FRC\ |reg| Radio.
The `Vivid-Hosting radio documentation
<https://frc-radio.vivid-hosting.net/>`_ is the authority for current firmware,
power, mounting, and configuration requirements.

.. note::

   **Using a legacy OpenMesh OM5P radio?** Keep using
   :ref:`docs/zero-to-robot/step-3/openmesh:Using the OpenMesh OM5P Radio`.
   Its regulated VRM/RPM power and configuration instructions remain separate
   from the VH-109 instructions on this page.

## Prerequisites

The recommended setup requires: 2 VH-109 radios, 1 VH-117 :term:`PoE` Wall Adapter, and 1 Radio Heatsink.  Available [here](https://wcproducts.com/products/frc-radio).

Please see the :ref:`docs/zero-to-robot/step-3/radio-programming:Alternative Setup Discussion` if you do not currently have this hardware.

.. image:: images/radio-programming/VH-109-2-radios.drawio.svg
   :alt: Connectivity diagram of VH-109 on robot connected to VH-109 on Driver station, powered by VH-117 POE wall adapter, with DS, and programming laptops connected to it
   :width: 500

## Powering the VH-109

The robot-mounted VH-109 is designed to run directly from robot battery
voltage. Connect the robot power distribution system to the radio's 12 VDC
Weidmuller input using the wiring described in
:ref:`docs/zero-to-robot/step-1/basic-robot-wiring:Radio Power`. A VRM is not
required.

The VH-109 can also receive passive :term:`PoE` through its RIO port. Vivid
Hosting recommends 12 VDC plus PoE for redundant robot-radio power, with both
inputs supplied from the same source and at the same voltage.

.. warning::

   Do not power a VH-109 from both a REV Radio Power Module (RPM) and its 12 VDC
   input. If AUX-port PoE output is enabled, verify that every downstream device
   accepts the supplied voltage before connecting it.

.. important::

   A VH-109 configured as an **access point** must use an AC-powered adapter or
   power supply; it cannot legally be powered from a battery. The recommended
   at-home method is the VH-117 PoE wall adapter. If powering through the 12 VDC
   input instead, use a wall supply rated for at least 12 V at 1 A.

## Getting to the Web Configuration Page

1. Connect the radio directly to your computer using an Ethernet cable in the :guilabel:`DS` port.

2. Ensure the radio has power either through the Weidmuller connectors or :term:`PoE`.

3. Open a web browser and navigate to :guilabel:`http://radio.local/`.  See :ref:`docs/zero-to-robot/step-3/radio-programming:Troubleshooting` if the connection doesn't work.

## Radio Firmware Update

.. image:: images/radio-programming/radio-firmware.png
  :alt: The Firmware Upload section of the radio configuration page

The required firmware changes by season. Compare the version shown by the
radio with the current version on the Vivid-Hosting
`firmware releases page
<https://frc-radio.vivid-hosting.net/miscellaneous/firmware-releases>`_. Skip
the update only when the installed version already satisfies the current
season requirement.

1. On the Vivid-Hosting [firmware releases](https://frc-radio.vivid-hosting.net/miscellaneous/firmware-releases) page download the proper firmware for the current firmware version you have.  Always choose the `Radio Variant`.

2. Copy the SHA-256 key below the firmware you downloaded.

3. Paste that key into the :guilabel:`Checksum` box of the :guilabel:`Firmware Upload` section at the bottom of the configuration page we navigated to above.

4. Click :guilabel:`Browse...` and select the firmware file you downloaded.

5. Click the :guilabel:`Upload` button.

.. warning:: The radio will take approximately 2-3 minutes to complete firmware updates. Do not remove power during this process. Damage to the radio can occur.  When the PWR light is solid and the SYS light is slowly blinking at 1 Hz, the firmware upgrade process is complete.

## Robot Radio Configuration (All Teams)

.. image:: images/radio-programming/configuration-page.png
  :alt: The top section of the radio configuration page

This section is used for configuring the VH-109 radio outside of competition. At competition, configuration will be done by a provided computer and manual configuration using this page **should not be used**.

1. Select :guilabel:`Robot Radio Mode`

2. Enter the team number

3. Enter the suffix, if desired.  This will help identify your robot and distinguish it from other networks.

4. Enter the 6 GHz WPA/SAE key.  This key will need to match the key on the Access Point you configure.

5. Enter the 2.4 GHz WPA/SAE key.  This is the password team members will type in when connecting to the 2.4 GHz network, if available.

## Access Point Radio Configuration

On the Access Point Radio, follow all of the same steps as the robot radio configuration instead choosing :guilabel:`Access Point Mode` at the top of the configuration page. Ensure you use the exact same settings for team number, suffix, and WPA/SAE keys.

## Alternative Setup Discussion

### Optimal Setup: Two VH-109 Radios

For the best experience and to closely simulate field conditions, it is strongly recommended that your team uses two VH-109 radios during testing and preparation. This dual-radio setup mirrors the competition environment, ensuring your robot operates under realistic network conditions. Additionally, having two radios allows you to fully leverage the high-speed, low-latency communication provided by the 6GHz band, which is crucial for optimal robot performance in high-stakes scenarios.

When mounting the access point radio, ensure it is mounted high where it has a clear line of sight to the robot.

### Only 1 VH-109 radio

If your team has access to only one VH-109 radio, there are still viable options to continue testing and preparing for competition. However, these setups require additional considerations:

#### Use an Old Radio for Testing

If your team still has an older radio from a previous season, it can serve as a temporary substitute for the VH-109 on your robot. In this case, you should:

- Reserve a mounting location on your robot for the VH-109 radio.
- Provide the older radio regulated power with a REV Radio Power Module or a CTRE Voltage Regulator Module.
- Be prepared to connect devices via a network switch if the older radio does not provide enough Ethernet ports. This may add complexity but ensures all devices are networked properly during testing.

Advantages:

- Connection strength similar to previous years.

Disadvantages:

- Requires additional hardware (e.g., the old radio and maybe a network switch).
- The older radio may not offer the same performance as the VH-109, potentially affecting test results.

#### Use the VH-109 2.4 GHz Network

Some firmware versions allow the robot radio to host a 2.4 GHz network for
direct testing. Firmware 2.0 and later configure this in software; older
DIP-switch instructions do not apply. Follow the current
`Practicing At Home guide
<https://frc-radio.vivid-hosting.net/overview/practicing-at-home>`_ for the
installed firmware.

.. warning:: Vivid Hosting does not recommend 2.4 GHz as the normal practice
   setup. Congested environments, including many school campuses, can produce
   poor performance.

Advantages:

- Simple setup with no need for additional hardware.
- Allows immediate use of the VH-109 without extra configuration.

Disadvantages:

- The 2.4GHz band is more prone to congestion and interference, especially in crowded environments.
- Range and accessibility may be limited compared to the 6GHz band.

### No VH-117 :term:`PoE` Wall Adapter

You can power the access point radio with a 12V wall plug connecting wires to the Weidmuller ports.  We recommend trying to find one with a [switch](https://a.co/d/cUsD25n) to simplify turning on and off the radio.  The primary concern will be cord length which will likely not be long enough to run from your wall outlet so you will need to bring the power closer with an extension cord.

### No Radio Heatsink

The access point radio will get hot after being on for a longer than a full match.  This will cause latency to increase.

## Troubleshooting

### Cannot Reach the Configuration Page at radio.local

Disconnect other network connections such as Wi-Fi.

Download and use the [Network Assistant](https://frc-radio.vivid-hosting.net/miscellaneous/network-assistant-tool).  See the instructions below the download for how to use.

Disable :doc:`firewalls </docs/networking/networking-introduction/windows-firewall-configuration>`.

Ensure an :ref:`mDNS responder <docs/networking/networking-introduction/networking-basics:mDNS - Providers>` is installed.

Set a [static ip address](https://www.trendnet.com/press/resource-library/how-to-set-static-ip-address) with these parameters:

- IP Address: 192.168.69.2
- Subnet Mask: 255.255.255.0
- Gateway: Leave Blank
- DNS: 192.168.69.1 or Leave Blank

Navigate to :guilabel:`http://192.168.69.1/`

### Setting Up an Entire Field

See the documentation on using the [VH-113 Access Point](https://frc-radio.vivid-hosting.net/overview/practicing-at-home#vh-113-full-field).

### How do I run an Offseason Event?

Use the [Vivid-Hosting radio kiosk](https://frc-radio.vivid-hosting.net/miscellaneous/offseason-kiosk-programmer).

### Additional Radio Problems

Contact WCP support at: [support@westcoastproducts.com](mailto:support@westcoastproducts.com)
