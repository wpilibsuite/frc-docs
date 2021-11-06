RoboRIO2 Imaging
================

The roboRIO2 uses a microSD card to hold all of it's software and robot code.  There are two ways to image the roboRIO2.  The traditional way with a USB cable and the FRC Imaging Utility with the microSD card plugged into the roboRIO2.  The second way is to use Balena Etcher to directly image the microSD card.

Getting the image
-----------------

The image is provided as part of the FRC Game Tools install.  To locate the image you can open the Imaging Tool

Copy the image to your MicroSD card
-----------------------------------

Download and install `Etcher <https://www.balena.io/etcher/>`__ to image the micro SD card.  Note: a `micro SD to USB dongle <https://www.amazon.com/gp/product/B0779V61XB>`__ works well for writing to micro SD cards.

.. figure:: ../vision-processing/wpilibpi/images/installing-the-image-to-your-microsd-card/copy-the-image-to-your-microsd-card.png

Flash the MicroSD card with the image using Etcher by selecting the zip file as the source, your SD card as the destination and
click "Flash".

.. figure:: ../vision-processing/wpilibpi/images/installing-the-image-to-your-microsd-card/flash-etcher.png
