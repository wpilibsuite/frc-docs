.. include:: <isonum.txt>

# Running your Test Program

## Overview

You should create and download a Test Program as described for your programming language:

:doc:`C++/Java/Python </docs/zero-to-robot/step-4/creating-test-drivetrain-program-cpp-java-python>`

## Tethered Operation

Running your test program while tethered to the Driver Station via ethernet or USB cable will confirm the program was successfully deployed and that the driver station and roboRIO are properly configured.

The roboRIO should be powered on and connected to the PC over Ethernet or USB.

## Starting the FRC Driver Station

.. image:: /docs/software/driverstation/images/driver-station/ds-icon.png
    :alt: The Driver Station icon found on the desktop.

The FRC\ |reg| Driver Station can be launched by double-clicking the icon on the Desktop or by selecting Start->All Programs->FRC Driver Station.

## Setting Up the Driver Station

.. image:: /docs/software/driverstation/images/driver-station/ds-setup.png
    :alt: Using the 3rd tab with the gear of the Driver Station to set the team number.

The DS must be set to your team number in order to connect to your robot. In order to do this click the Setup tab then enter your team number in the team number box. Press return or click outside the box for the setting to take effect.

PCs will typically have the correct network settings for the DS to connect to the robot already, but if not, make sure your Network adapter is set to :term:`DHCP`.


## Confirm Connectivity

.. figure:: images/run-test-program/confirm-connectivity-tethered.png

    Tethered

.. figure:: images/run-test-program/confirm-connectivity-wireless.png

    Wireless

Using the Driver Station software, click Diagnostics and confirm that the Enet Link (or Robot Radio led, if operating wirelessly) and Robot leds are green.

## Operate the Robot

.. image:: images/run-test-program/run-robot.png
    :alt: Highlights the different sections of the Drive Tab (1st)

Click the Operation Tab

1. Confirm that battery voltage is displayed
2. Communications, Robot Code, and Joysticks indicators are green.
3. Put the robot in Teleop Mode
4. Click Enable. Move the joysticks and observe how the robot responds.
5. Click Disable

## Wireless Operation

Before attempting wireless operation, tethered operation should have been confirmed as described in `Tethered Operation`_. Running your test program while connected to the Driver Station via WiFi will confirm that the access point is properly configured.

### Configuring the Access Point

See the article :ref:`Programming your radio <docs/zero-to-robot/step-3/radio-programming:Programming your Radio>` for details on configuring the second VH-109 for use as an access point.

After configuring the access point, connect the driver station via Ethernet to the VH-109 AP radio.

You can now confirm wireless operation using the same steps in **Confirm Connectivity** and **Operate the Robot** above.
