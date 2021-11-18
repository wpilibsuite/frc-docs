RoboRIO2 Imaging
================

The NI roboRIO 2.0 boots from a microSD card configured with an appropriate boot image containing the NI Linux Real-Time OS, drivers, and libraries specific to FRC. There are two ways to create the SD card -- with the roboRIO using the imaging tool, or with a laptop and an SD burner application.

microSD Requirements
--------------------

The NI roboRIO 2.0 controller supports microSD cards.

Operation Tips
--------------

The NI roboRIO 2.0 controller requires a fully inserted SD card containing a valid image in order to boot and operate as intended.

If the SD card is removed while powered, the controller will hang. Once the SD card is replaced, the controller will need to be restarted using the reset button, or it can have the power cycled.

No damage will result from SD card removal or insertion while powered, but best practice is to perform these operations while unpowered.

Imaging Using a Computer
------------------------

The image will be transferred to the SD card using a specialized writing utility, sometimes called a burner. Several utilities are listed below, but most that can write arbitrary images for booting a Raspberry Pi or similar dev boards will also produce a bootable SD card for roboRIO 2.0.

Supported image files are named FRC_roboRIO2_VERSION.img.zip and should be located next to this instruction file. You may also locate then by clicking the SD button in the roboRIO Imaging tool. Select the version that matches the version of the programming tools being used. A mismatch between tools and image may result in inconsistent library dependencies.

If using a non Windows OS you will need to copy this image file to that computer.

.. figure:: images/sd_button.png
   :alt: Click the SD folder icon will bring up the location of the images in windows explorer.

A `microSD to USB dongle <https://www.amazon.com/gp/product/B0779V61XB>`__ works well for writing to microSD cards.

.. note:: Raspberry Pi images will not boot on a roboRIO because the OS and drivers are incompatible. Similarly, a roboRIO image is not compatible with Raspberry Pi controller boards.

Writing the image with balenaEtcher
-----------------------------------

- Download and install `balenaEtcher <https://www.balena.io/etcher/>`__.
- Launch
- Flash from file >> locate the image file you want to copy to the SD card
- Select target >> select the destination SD device
- Press Flash
- Insert microSD card and boot the roboRIO 2.0
- Use the roboRIO Imaging Tool to update the team number

Writing the image with Raspberry Pi Imager
------------------------------------------

- Download and install from `Raspberry Pi Imager <https://www.raspberrypi.com/software/>`__.
- Launch
- Operating System >> select Custom and locate the image file you want to copy to the SD card
- Storage >> select the destination SD device
- Press Write
- Insert microSD card and boot the roboRIO 2.0
- Use the roboRIO Imaging Tool to update the team number
