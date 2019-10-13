.. include:: <isonum.txt>

Installing LabVIEW for FRC (LabVIEW only)
=========================================

.. image:: images/labview/ni_logo.png

.. note:: This installation is for teams programming in LabVIEW or using NI Vision Assistant only. C++ and Java teams not using these features do not need to install from the DVD and should proceed to :doc:`Installing the FRC Update Suite </docs/getting-started/getting-started-frc-control-system/frc-update-suite>`.

Download and installation times will vary widely with computer and internet connection specifications, however note that this process involves a large file download and installation and will likely take at least an hour to complete.

Uninstall Old Versions (Recommended)
------------------------------------

.. note:: If you wish to keep programming cRIOs you will need to maintain an install of LabVIEW for FRC 2014. The LabVIEW for FRC 2014 license has been extended. While these versions should be able to co-exist on a single computer, this is not a configuration that has been extensively tested.

Before installing the new version of LabVIEW it is recommended to remove any old versions. The new version will likely co-exist with the old version, but all testing has been done with FRC 2020 only. Make sure to back up any team code located in the "User\\LabVIEW Data" directory before un-installing. Then click Start >> Add or Remove Programs. Locate the entry labeled "National Instruments Software", and select Uninstall.

.. image:: images/labview/uninstall_old_control_panel.png

Select Components to Uninstall
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In the dialog box that appears, select all entries. The easiest way to do this is to de-select the "Products Only" check-box and select the check-box to the left of "Name". Click Remove. Wait for the uninstaller to complete and reboot if prompted.

.. image:: images/labview/uninstall_select_components.png

Getting LabVIEW installer
-------------------------

Either locate and insert the LabVIEW USB Drive or download the LabVIEW 2020 installer from https://www.ni.com/download/labview-for-frc-18.0/7841/en/

.. note:: Beta teams will download LabVIEW from teamforge.

If downloaded, right click on the downloaded file (LabVIEW_Software_for_FRC_2020.zip) and select Extract All.

.. note:: This is a large download (~7GB). It is recommended to use a fast internet connection and to use the NI Downloader to allow the download to resume if interrupted.

Installing LabVIEW
------------------

National Instruments LabVIEW requires a license. Each season’s license is active until January 31st of the following year (e.g. the license for the 2020 season expires on January 31, 2021)

Teams are permitted to install the software on as many team computers as needed, subject to the restrictions and license terms that accompany the applicable software, and provided that only team members or mentors use the software, and solely for FRC. Rights to use LabVIEW are governed solely by the terms of the license agreements that are shown during the installation of the applicable software.

Welcome
^^^^^^^

.. image:: images/labview/labview_welcome.png

Double click on ``autorun.exe`` to launch the installer. If prompted to allow changes click Yes. To install LabVIEW to program your FRC\ |reg| robot, click the top option Install Everything for LabVIEW Development. If prompted with any Windows security warnings, click Allow or Yes.

Ni Package Manager License
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/labview/ni-package-license.png

If you see this screen, click "Next"


Disable Windows Fast Startup
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/labview/labview_fast_startup.png

If you see this screen, click "Next"

NI Package Manager Review
^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/labview/labview_package_manager_review.png

If you see this screen, click "Next"

NI Package Manager Installation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/labview/ni-package-install.png

Installation progress of the NI Package Manager will be tracked in this window

Product List
^^^^^^^^^^^^
.. image:: images/labview/labview_product_list.png

Click "Next"

Additional Packages
^^^^^^^^^^^^^^^^^^^
.. image:: images/labview/labview_additional_software.png

Click "Next"

License agreements
^^^^^^^^^^^^^^^^^^

.. image:: images/labview/labview_license_1.png

Check "I accept..." then Click "Next"

.. image:: images/labview/labview_license_2.png

Check "I accept..." then Click "Next"

Product Information
^^^^^^^^^^^^^^^^^^^

.. image:: images/labview/labview_product_info.png

Click "Next"

Start Installation
^^^^^^^^^^^^^^^^^^

.. image:: images/labview/labview_start_install.png

Click "Next"

Overall Progress
^^^^^^^^^^^^^^^^

.. image:: images/labview/labview_install_progress.png

Overall installation progress will be tracked in this window

NI Update Service
-----------------

.. image:: images/labview/ni_update_enable.png

You will be prompted whether to enable the NI update service. You can choose to not enable the update service.

.. warning:: It is not recommended to install these updates unless directed by FRC through our usual communication channels (FRC Blog, Team Updates or E-mail Blasts).

NI Activation Wizard
^^^^^^^^^^^^^^^^^^^^

.. image:: images/labview/ni_activation_login.png

Log into your ni.com account. If you don't have an account, select 'Create account' to create a free account.

.. image:: images/labview/ni_activation_keys.png

The serial number you entered at the "User Information" screen should appear in all of the text boxes, if it doesn't, enter it now. Click "Activate".

.. note:: If this is the first time activating the 2020 software on this account, you will see the message shown above about a valid license not being found. You can ignore this.

.. image:: images/labview/ni_activation_success.png

If your products activate successfully, an “Activation Successful” message will appear. If the serial number was incorrect, it will give you a text box and you can re-enter the number and select “Try Again”. The items shown above are not expected to activate. If everything activated successfully, click “Next”.

.. image:: images/labview/ni_activation_finish.png

Click "Close".

Restart
^^^^^^^

.. image:: images/labview/labview_restart.png

Select "Reboot Now" after closing any open programs.


