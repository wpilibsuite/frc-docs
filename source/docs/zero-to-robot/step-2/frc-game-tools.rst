.. include:: <isonum.txt>

Installing the FRC Game Tools
=============================

The FRC\ |reg| Game Tools contains the following software components:

- LabVIEW Update
- FRC Driver Station
- FRC roboRIO Imaging Tool and Images

The LabVIEW runtime components required for the Driver Station and Imaging Tool are included in this package.

.. note:: No components from the LabVIEW Software for FRC package are required for running either the Driver Station or Imaging Tool.

Requirements
------------

- Windows 10 or higher (Windows 10, 11). Windows 11 is not officially supported by NI, but has been tested to work.
- Download the `FRC Game Tools <https://www.ni.com/en-us/support/downloads/drivers/download.frc-game-tools.html>`__ from NI.

.. image:: images/labview/offline-installer.png
   :alt: The Download button for the NI installer with the offline installer link below it.

If you wish to install on other machines offline, click :guilabel:`Individual Offline Installers` before clicking :guilabel:`Download` to download the full installer.

Uninstall Old Versions (Recommended)
------------------------------------

.. important:: LabVIEW teams have already completed this step, do not repeat it. LabVIEW teams should skip to the :ref:`docs/zero-to-robot/step-2/frc-game-tools:installation` section.

Before installing the new version of the FRC Game Tools it is recommended to remove any old versions. The new version will likely co-exist with the old version (note that the DS will overwrite old versions), but all testing has been done with FRC 2022 only.  Then click Start >> Add or Remove Programs. Locate the entry labeled "NI Software", and select :guilabel:`Uninstall`.

.. note:: It is only necessary to uninstall previous versions when installing a new year's tools. For example, uninstall the 2021 tools before installing the 2022 tools. It is not necessary to uninstall before upgrading to a new update of the 2022 game tools.

.. image:: images/labview/uninstall_control_panel.png
   :alt: Add or Remove -> NI Software

Select Components to Uninstall
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In the dialog box that appears, select all entries. The easiest way to do this is to de-select the :guilabel:`Products Only` check-box and select the check-box to the left of "Name". Click :guilabel:`Remove`. Wait for the uninstaller to complete and reboot if prompted.

.. image:: images/labview/uninstall_select_components.png
   :alt: Using the checkbox in the upper left to select all.

Installation
------------

.. important:: The Game Tools installer may prompt that .NET Framework 4.6.2 needs to be updated or installed. Follow prompts on-screen to complete the installation, including rebooting if requested. Then resume the installation of the FRC Game Tools, restarting the installer if necessary.

Extraction
^^^^^^^^^^

.. tabs::
   .. tab:: Online

      Run the downloaded executable file to start the install process. Click :guilabel:`Yes` if a Windows Security prompt appears.

   .. tab:: Offline (Windows 10+)

      Right click on the downloaded iso file and select :guilabel:`mount`. Run ``install.exe`` from the mounted iso. Click :guilabel:`Yes` if a Windows Security prompt appears.

      .. image:: images/labview/mount-iso.png
         :alt: The menu after right clicking on an .iso file to choose "Mount".

      .. note:: Other installed programs may associate with iso files and the :guilabel:`mount` option may not appear. If that software does not give the option to mount or extract the iso file, then install 7-Zip and use that to extract the iso.

NI Package Manager License
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/update-suite/ni-package-license.png
   :alt: Accepting the License Agreement for NI Package Manager.

If you see this screen, click :guilabel:`Next`. This screen confirms that you agree to NI Package Manager License agreement.

Disable Windows Fast Startup
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/update-suite/labview_fast_startup.png
   :alt: Screen for disabling Windows fast startup.

It is recommended to leave this screen as-is, as Windows Fast Startup can cause issues with the NI drivers required to image the roboRIO. Go ahead and click :guilabel:`Next`.

NI Package Manager Review
^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/update-suite/labview_package_manager_review.png
   :alt: Review screen that shows what is about to be installed.

If you see this screen, click :guilabel:`Next`.

NI Package Manager Installation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/update-suite/ni-package-install.png
   :alt: Screen with progress bars indicating the amount of completion.

Installation progress of the NI Package Manager will be tracked in this window.

Additional Software
^^^^^^^^^^^^^^^^^^^

.. image:: images/update-suite/additional-software.png
   :alt: Leave all of the additional packages selected.

If you see this screen, click :guilabel:`Next`.

License Agreements
^^^^^^^^^^^^^^^^^^

.. image:: images/update-suite/license-agreements.png
   :alt: Accept the NI software license agreement.

Select :guilabel:`I accept…` then click :guilabel:`Next`

.. image:: images/labview/labview_license_2.png
   :alt: Accept the Silverlight license agreements.

Go ahead and press :guilabel:`I accept…` then click :guilabel:`Next`, confirming that you agree to the NI License agreement.

Review Summary
^^^^^^^^^^^^^^

.. image:: images/update-suite/review-summary.png
   :alt: Review Summary

Click :guilabel:`Next`.

Detail Progress
^^^^^^^^^^^^^^^

.. image:: images/update-suite/detail-progress.png
   :alt: Detail Progress

This screen showcases the installation process, go ahead and press :guilabel:`Next` when it's finished.

NI Activation Wizard
^^^^^^^^^^^^^^^^^^^^

.. image:: images/labview/ni_activation_login.png
   :alt: The NI user login screen.

Log into your `ni.com <https://ni.com>`__ account. If you don’t have an account, select :guilabel:`Create account` to create a free account.

.. image:: images/update-suite/ni-activation-wizard-2.png
   :alt: Screen for entering your product key.

Enter the serial number. Click :guilabel:`Activate`.

.. note:: If this is the first time activating this year's software on this account, you will see the message shown above about a valid license not being found. You can ignore this.

.. image:: images/update-suite/ni-activation-wizard-3.png
   :alt: Screen details the activation success of each package.

If your products activate successfully, an :guilabel:`Activation Successful` message will appear. If the serial number was incorrect, it will give you a text box and you can re-enter the number and select :guilabel:`Try Again`. If everything activated successfully, click :guilabel:`Next`.

.. image:: images/update-suite/ni-activation-wizard-4.png
   :alt: Close through this screen asking you to register.

Click :guilabel:`Close`.

NI Update Service
^^^^^^^^^^^^^^^^^

.. image:: images/labview/ni_update_enable.png
   :alt: The update service is not needed.

You will be prompted whether to enable the NI update service. You can choose to not enable the update service.

.. warning:: It is not recommended to install these updates unless directed by FRC through our usual communication channels (FRC Blog, Team Updates or E-mail Blasts).

Reboot to Complete Installation
-------------------------------

.. image:: images/update-suite/install-complete-reboot.png
   :alt: Choose reboot to complete the installation.

If prompted, select :guilabel:`Reboot Now` after closing any open programs.
