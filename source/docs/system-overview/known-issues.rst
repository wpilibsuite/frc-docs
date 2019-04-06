Known Issues
============

This article details known issues (and workarounds) for FRC Control
System Software.

VSCode failing to launch offline (no network present)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are reports that on some builds of Windows 10 (build 1809), VSCode
may fail to launch if no network is present (note: this is different
than no internet present).

Workaround: Install the Microsoft Loopback Adapter 1. Access the Device
Manager (typically by clicking start and typing Device Manager) 2. Click
the Network Adapter Catagory 3. Click the Action menu from the top bar
and select Add Legacy Hardware 4. Click Next on the window that pops up
5. Select the second option to install manually 6. Select “Network
Adapter” and click Next. You will need to wait a bit for the next screen
to populate. 7. Select Microsoft in the Manufacturer pane, then
Microsoft Loopback Adapter in the right pane. 8.Click Next twice to
install the adapter, then Finish to close the window.

Driver Station Dashboard launching
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Issue: When selecting SmartDashboard or Shuffleboard in the FRC Driver
Station, the programs fail to launch.

Workaround: Use the Desktop icons to launch the desired dashboard
manually.

Solution: `Fixed in 2019.1.0 NI Update Suite`_

C++ Intellisense - Files Open on launch don’t work properly
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Issue: In C++, files open when VS Code launches will have issues with
Intellisense showing suggestions from all options from a compilation
unit and not just the appropriate ones. This is a bug in VS Code

Workaround: Close the files in VS Code, close VS Code, wait ~ 1 min,
re-launch VS Code.

Auto SPI Does not work in v12 image (affects Analog Devices IMUs and Gyro))
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The Auto SPI functionality used by Analog Devices IMUs (ADIS16448 and
ADIS16470) and Gyro (ADXRS450) does not work correctly in the 2019-v12
image that is part of the kickoff release.

Workaround: After imaging, log into the robot console as admin (via
serial or SSH) and run the command “updateNIDrivers”, then reboot. A
simplified tool to execute this is in progress and more information
about a full update with this issue resolved will be coming soon.

Solution: Fixed in 2019v13 image in `2019.1.0 NI Update Suite`_

SmartDashboard and Simlation fail to launch on Windows N Editions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Issue: WPILib code using CSCore (dashboards and simulated robot code)
will fail to launch on Education N editions of Windows.

Solution: Install the Media Feature Pack from
https://www.microsoft.com/en-us/software-download/mediafeaturepack

Installing and Using GradleRIO Directly May not Deploy JRE
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If user installs GradleRIO directly (i.e. not from the offline
installers or zips provided by the WPILib release) and then runs a
deploy to the roboRIO without internet, the JRE may not be deployed. A
single deploy with internet connected (connect to the roboRIO over USB)
is needed to dow

.. _Fixed in 2019.1.0 NI Update Suite: 2019.1.0%20NI%20Update%20Suite
.. _2019.1.0 NI Update Suite: http://www.ni.com/download/first-robotics-software-2017/7904/en/