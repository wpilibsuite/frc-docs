Imaging your Romi
=================

.. warning:: We are working hard on getting the Romi documentation complete. Please check back later.

The Romi has 2 boards that both need to be imaged in order for the robot to work – the Raspberry Pi and the Romi 32U4 Control Board. Once the Raspberry Pi is imaged, we can use the web dashboard included on the device to image the 32U4 Control Board.

Raspberry Pi
------------

Download
^^^^^^^^

The Raspberry Pi Romi image is built on top of WPILibPi.

- `Romi WPILibPi <https://github.com/wpilibsuite/WPILibPi/releases>`__

Please ensure you download the Romi version and not the standard release of WPILibPi. The Romi version is suffixed with ``-Romi``. See the below image for an example.

.. image:: images/imaging-romi/romi-download.png
   :alt: GitHub Romi Release

Imaging
^^^^^^^

Imaging is identical to the standard :doc:`WPILibPi Installation </docs/software/vision-processing/frcvision/installing-the-image-to-your-microsd-card>`.

Wireless Network Setup
^^^^^^^^^^^^^^^^^^^^^^

After turning the Romi on, connect to the WiFi SSID ``WPILibPi`` with the WPA2 passphrase ``WPILib2021!``. Open a web browser and connect to either ``http://10.0.0.2/`` or http://wpilibpi.local/ to open the web dashboard.

.. note:: The image boots up read-only by default, so it is necessary to click the ``Writable`` button to make changes. Once done making changes, click the ``Read-Only`` button to prevent memory corruption.

It is very important to change the default password associated with your Romi. Select ``Writable`` at the top of the page then set a new password in the ``WPA2 Passphrase`` field. Press the ``Save`` button at the bottom to save changes. You will need to reconnect to the Romi's WiFi network with the new password.

.. image:: images/imaging-romi/network-settings.png
   :alt: Romi web dashboard network settings

32U4 Control Board
------------------

With the Raspberry Pi now imaged, we can use it to image the 32U4 Control Board. Before turning the Romi on, use a USB A to micro-B cable to connect one of the Raspberry Pi's USB ports to the micro USB port on the 32U4 Control Board. Next, turning the Romi on, connect to its Wifi network, open a web browser, and connect to the web dashboard. On the ``Romi`` configuration page, press the ``Update Firmware`` button.

.. image:: images/imaging-romi/firmware-upload-before.png
   :alt: The firmware update button before updating firmware

A console will appear showing a log of the firmware deploy process. Once the firmware has been deployed to the 32U4 Control Board, the message ``avrdude done. Thank you.`` will appear.

.. image:: images/imaging-romi/firmware-upload-after.png
   :alt: The firmware update log showing the completed firmware update
