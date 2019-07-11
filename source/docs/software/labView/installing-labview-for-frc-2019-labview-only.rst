Installing LabVIEW for FRC 2019 (LabVIEW only)
==============================================

.. image::images/installing-labview-for-frc-2019-labview-only/ni-logo.png

.. note:: This installation is for teams programming in LabVIEW or using NI Vision Assistant only. **C++ and Java teams not using these features do not need to install from the DVD. Download and installation times will vary widely with computer and internet connection specifications, however note that this process involves a large file download and installation and will likely take at least an hour to complete.**

Uninstall Old Versions (Recommended)
------------------------------------

.. image::images/installing-labview-for-frc-2019-labview-only/uninstall-old-versions.png

.. warning:: If you wish to keep programming cRIOs you will need to maintain an install of LabVIEW for FRC 2014. The LabVIEW for FRC 2014 license has been extended. While these versions should be able to co-exist on a single computer, this is not a configuration that has been extensively tested.

Before installing the new version of LabVIEW it is recommended to remove any old versions. The new version will likely co-exist with the old version, but all testing has been done with FRC 2019 only. Make sure to back up any team code located in the ``User\LabVIEW Data`` directory before un-installing. Then click ``Start`` >> ``Control Panel`` >> ``Uninstall a Program``. Locate the entry labeled ``National Instruments Software``, right-click on it and select ``Uninstall/Change``.

Select Components to Uninstall
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. image::images/installing-labview-for-frc-2019-labview-only/select-components-to-uninstall.png

In the left pane of the dialog box that appears, **select all entries**. The easiest way to do this is to click the top entry to highlight it, then scroll down to the bottom entry, press and hold shift and click on the last entry then release shift. Click ``Remove``. Wait for the uninstaller to complete and reboot if prompted.

Getting the LabVIEW Installer
-----------------------------

Either locate and insert the LabVIEW USB Drive or download the LabVIEW 2019 installer from http://www.ni.com/download/labview-for-frc-18.0/7841/en/

If downloaded, right click on the downloaded file (NI_FRC2019.zip) and select Extract All.

.. note:: This is a large download (~5GB). It is recommended to use a fast internet connection and to use the NI Downloader to allow the download to resume if interrupted.

Installing LabVIEW
------------------

National Instruments LabVIEW requires a license. Each season’s license is active until January 31st of the following year (e.g. the license for the 2019 season expires on January 31, 2020)

Teams are permitted to install the software on as many team computers as needed, subject to the restrictions and license terms that accompany the applicable software, and provided that only team members or mentors use the software, and solely for FRC. Rights to use LabVIEW are governed solely by the terms of the license agreements that are shown during the installation of the applicable software.

.. tabs::
  .. tab:: Welcome

  .. image::images/installing-labview-for-frc-2019-labview-only/welcome.png

  Double click on ``autorun.exe`` to launch the installer. If prompted to allow changes click Yes. To install LabVIEW to program your FRC robot, click the top option ``Install Everything for LabVIEW Development``. To install only NI Vision Assistant for use with C++ or Java, click ``Install Only NI Vision Development Module``. If prompted with any Windows security warnings, click Allow or Yes.

  .. tab:: Warnings

  .. image::images/installing-labview-for-frc-2019-labview-only/warnings.png

  Click "Next"

  .. tab:: Product List

  .. image::images/installing-labview-for-frc-2019-labview-only/product-list.png

  Click "Next"

  .. tab:: Product Information

  .. image::images/installing-labview-for-frc-2019-labview-only/product-information.png

  Un-check the box, then click "Next". (Note: you may not see the warning shown in the top portion of the window in this picture).

  .. tab:: User Information

  .. image::images/installing-labview-for-frc-2019-labview-only/user-information.png

  Enter name, organization, and the serial number from the **ReadMe in the File Releases on Teamforge**. Click "Next". If you cannot find your serial number, please reach out to National Instruments at www.ni.com/frc/needhelp.

  .. tab:: Destination Directory

  .. image::images/installing-labview-for-frc-2019-labview-only/destination-directory.png

  Click "Next"

  .. tab:: Destination Directory

  .. image::images/installing-labview-for-frc-2019-labview-only/destination-directory.png

  Click "Next"

  .. tab:: License Agreements (1)

  .. image::images/installing-labview-for-frc-2019-labview-only/license-agreements-1.png

  Check "I accept..." then Click "Next"

  .. tab:: License Agreements (2)

  .. image::images/installing-labview-for-frc-2019-labview-only/license-agreements-2.png

  Check "I accept..." then Click "Next"

  .. tab:: Driver Software Installation

  .. image::images/installing-labview-for-frc-2019-labview-only/driver-software-installation.png

  If you see this screen, Click "Next"

  .. tab:: Disable Windows Fast Startup

  .. image::images/installing-labview-for-frc-2019-labview-only/disable-windows-fast-startup.png

  If you see this screen, Click "Next"

  .. tab:: Start Installation

  .. image::images/installing-labview-for-frc-2019-labview-only/start-installation.png

  Click "Next"

  .. tab:: Overall Progress

  .. image::images/installing-labview-for-frc-2019-labview-only/overall-progress.png

  Overall installation progress will be tracked in this window.

  .. tab:: Individual Product Progress

  .. image::images/installing-labview-for-frc-2019-labview-only/individual-product-progress.png

  Each product installed will also create an individual progress window like the one shown above.

  .. tab:: Product Information

  .. image::images/installing-labview-for-frc-2019-labview-only/product-information.png

  Click "Next"

  .. tab:: Installation Summary

  .. image::images/installing-labview-for-frc-2019-labview-only/installation-summary.png

  If internet access is available and you are ready to activate, click "Next"; otherwise uncheck the "Run License Manager..." and click "Next".

NI Activation Wizard
^^^^^^^^^^^^^^^^^^^^

.. tabs::

  .. tab:: NI Activation Wizard (1)

  .. image::images/installing-labview-for-frc-2019-labview-only/ni-activation-wizard.png

  Log into your ni.com account. If you don't have an account, select 'Create account' to create a free account.

  .. tab:: NI Activation Wizard (2)

  .. image::images/installing-labview-for-frc-2019-labview-only/ni-activation-wizard-2.png

  The serial number you entered at the "User Information" screen should appear in all of the text boxes, if it doesn't, enter it now. Click "Activate".

  .. note:: If this is the first time activating the 2019 software on this account, you will see the message shown above about a valid license not being found. You can ignore this.

  .. tab:: NI Activation Wizard (3)

  .. image::images/installing-labview-for-frc-2019-labview-only/ni-activation-wizard-3.png

  If your products activate successfully, an “Activation Successful” message will appear. If the serial number was incorrect, it will give you a text box and you can re-enter the number and select “Try Again”. If everything activated successfully, click “Next”.

  .. tab:: NI Activation Wizard (4)

  .. image::images/installing-labview-for-frc-2019-labview-only/ni-activation-wizard-4.png

  Click "Close".

  .. tab:: Restart Message

  .. image::images/installing-labview-for-frc-2019-labview-only/restart-message.png

  Select "Yes"

NI Update Service
-----------------
.. image::images/installing-labview-for-frc-2019-labview-only/ni-update-service.png

.. warning:: On occasion you may see alerts from the NI Update Service about patches to LabVIEW. It is not recommended to install these updates unless directed by FRC through our usual communication channels (Frank's Blog, Team Updates or E-mail Blasts).
