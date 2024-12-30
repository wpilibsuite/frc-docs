.. include:: <isonum.txt>

# Programming your Radio

This guide will show you how to do a basic setup for controlling your robot "at home" using the VH-109 FRC\ |reg| Radio.  For complete documentation and information please see the [Vivid-Hosting radio site](https://frc-radio.vivid-hosting.net/).

## Prerequisites

The recommended setup requires: 2 VH-109 radios, 1 VH-117 :term:`PoE` Wall Adapter, and 1 Radio Heatsink.  Available [here](https://wcproducts.com/products/frc-radio).

Please see the :ref:`docs/zero-to-robot/step-3/radio-programming:Alternative Setup Discussion` if you do not currently have this hardware.

## Getting to the Web Configuration Page

1. Connect the radio directly to your computer using an Ethernet cable in the :guilabel:`DS` port.

2. Ensure the radio has power either through the Weidmuller connectors or :term:`PoE`.

3. Open a web browser and navigate to :guilabel:`http://192.168.69.1/`

## Radio Firmware Update (You can skip if already at version 1.2.6)

.. image:: images/radio-programming/radio-firmware.png
  :alt: The Firmware Upload section of the radio configuration page

.. note:: Newer versions of the radio firmware will have the version listed at the bottom.  If you do not see the version listed you have firmware prior to 1.2.0.

1. On the Vivid-Hosting [firmware releases](https://frc-radio.vivid-hosting.net/miscellaneous/firmware-releases) page download the proper firmware for the current firmware version you have.  Always choose the `Radio Variant`.

2. Copy the SHA-256 key below the firmware you downloaded.

3. Paste that key into the :guilabel:`Checksum` box of the :guilabel:`Firmware Upload` section at the bottom of the configuration page we navigated to above.

4. Click :guilabel:`Browse...` and select the firmware file you downloaded.

5. Click the :guilabel:`Upload` button.

.. warning:: The radio will take approximately 2-3 minutes to complete firmware updates. Do not remove power during this process. Damage to the radio can occur.  When the PWR light is solid and the SYS light is slowly blinking at 1 Hz, the firmware upgrade process is complete.

## Robot Radio Configuration (All Teams)

.. image:: images/radio-programming/configuration-page.png
  :alt: The top section of the radio configuration page

This is the default configuration for the VH-109 radio to act as a Robot Radio for FRC competitions while at home. This procedure is not required when at a competition.

1. Select :guilabel:`Robot Radio Mode`

2. Enter the team number

3. Enter the suffix, if desired.  This will help identify you robot and distinguish it from other networks.

4. Enter the 6 GHz WPA/SAE key.  This key will need to match the key on the Acess Point you configure.

5. Enter the 2.4 GHz WPA/SAE key.  This is the password team members will type in when connecting to the 2.4 GHz network, if available.

## Access Point Radio Configuration

Follow all of the same steps as the robot radio configuration instead choosing :guilabel:`Access Point Mode` at the top of the configuration page.

## Alternative Setup Discussion

### Optimal Setup: Two VH-109 Radios

For the best experience and to closely simulate field conditions, it is strongly recommended that your team uses two VH-109 radios during testing and preparation. This dual-radio setup mirrors the competition environment, ensuring your robot operates under realistic network conditions. Additionally, having two radios allows you to fully leverage the high-speed, low-latency communication provided by the 6GHz band, which is crucial for optimal robot performance in high-stakes scenarios.

### Only 1 VH-109 radio

If your team has access to only one VH-109 radio, there are still viable options to continue testing and preparing for competition. However, these setups require additional considerations:

#### Use an Old Radio for Testing

If your team still has an older radio from a previous season, it can serve as a temporary substitute for a second VH-109. In this case, you should:

Reserve a spot on your robot specifically for the VH-109 radio to ensure seamless integration during competition.

Be prepared to connect devices via a network switch if the older radio does not provide enough Ethernet ports. This may add complexity but ensures all devices are networked properly during testing.

Advantages:

Maintains the ability to simulate dual-radio setups with some fidelity.

Preserves the design for easy integration of the VH-109 at competition.

Disadvantages:

Requires additional hardware (e.g., the old radio and maybe a network switch).

The older radio may not offer the same performance as the VH-109, potentially affecting test results.

#### Enable 2.4GHz Wifi on the VH-109

The VH-109 radio includes a standalone mode that can be activated using DIP switch 3. In this configuration, the radio hosts its own 2.4GHz network, enabling direct connections without additional hardware.

To enable standalone mode:

Locate the DIP switches on the VH-109 radio, removing the sticker if required.

Flip DIP switch 3 to the "ON" position.

Connect devices directly to the 2.4GHz network hosted by the radio.

Advantages:

Simple setup with no need for additional hardware.

Allows immediate use of the VH-109 without extra configuration.

Disadvantages:

The 2.4GHz band is more prone to congestion and interference, especially in crowded environments.

Range and accessibility may be limited compared to the 6GHz band.
