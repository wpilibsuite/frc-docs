# Imaging your Systemcore

For a Systemcore that boots normally and runs OS version 11 or later, routine
updates run through its web interface at ``robot.local``. Older installations
and units that cannot boot use the recovery procedure later on this page.

## Prerequisites

- A ``.llupdate`` file downloaded from the
  `Systemcore releases page <https://github.com/LimelightVision/systemcore-os-public/releases/latest>`_.
  Make sure to download the alpha or beta update that matches your Systemcore unit.
- A Wi-Fi or USB connection to the Systemcore
- The hardware revision (Alpha or Beta) and current OS version shown by the
  onboard display or web interface

.. important::

   Update files are hardware-specific. Do not install an Alpha update on a
   Beta Systemcore or a Beta update on an Alpha Systemcore.

Alpha units shipped without port labels; Beta units have port labels. Confirm
the hardware revision before selecting the update.

## Routine Web Update

1. Download the ``.llupdate`` file for the current season from the
   `Systemcore releases page <https://github.com/LimelightVision/systemcore-os-public/releases/latest>`_.

   .. image:: images/imaging-systemcore/llupdate.png
      :alt: The Systemcore release page with the .llupdate file download link boxed in yellow.

2. Boot the Systemcore normally. Connect over Wi-Fi, or connect a
   data-capable cable to the USB-C LINK port after an Alpha unit has started.
3. Open a browser and navigate to ``robot.local``.
4. Click the settings (gear) icon and open the configure/update section.

   .. image:: images/imaging-systemcore/configuretab.png
      :alt: The Systemcore home page with a box around the settings wheel tab that leads to the configure and update tab.

5. Under **OS Update**, click **Select File**, choose the ``.llupdate``
   file you downloaded, then click **Flash Update**. The process takes
   several minutes to complete.

   .. image:: images/imaging-systemcore/findos.png
      :alt: The Systemcore configuration page at the OS Update section.

Once the update finishes, every step shows a check mark:

.. image:: images/imaging-systemcore/rebootfinished.png
   :alt: The finished OS Update page with all processes marked with a check mark.

.. note::

   **USB connection:** a success message appears once the update finishes.

   **Wi-Fi connection:** the Systemcore reboots as part of the update.
   Manually reconnect and refresh the page to see the completion status.

## Configure and Verify

After the update and reboot:

1. Reopen ``robot.local`` and confirm that the displayed OS version matches
   the release you installed.
2. Open the configuration tab, enter your team number, and click **Change Team
   Number**.
3. Confirm that the onboard display shows the correct team number.
4. Enter the same team number in the Driver Station settings.
5. Confirm that the Driver Station reports robot communication. A missing
   robot-code indicator is expected until code is deployed in Step 4.

If the Driver Station cannot connect, compare the team number on the Systemcore
display with the number in Driver Station settings. When creating a project in
Step 4, use this same number for deployment.

## Recovery Flashing

Use recovery flashing when the Systemcore runs an OS version older than 11,
does not boot normally, or the release instructions specifically require a
full image. Recovery uses the Limelight Hardware Manager and a full ``.zip``
or ``.img`` image, not the routine ``.llupdate`` workflow above.

1. From the `Systemcore alpha/beta testing page
   <https://github.com/wpilibsuite/SystemcoreTesting>`_, install the current
   Limelight Hardware Manager and download the full image for the correct
   hardware revision.
2. Open Hardware Manager and select its OS flashing tool.
3. Connect the USB-C LINK port and enter flash mode:

   - **Alpha:** turn robot power off, connect LINK, then turn power on.
   - **Beta:** connect LINK, hold the **Config** button, and turn power on.

4. In Hardware Manager, refresh the device list and select the device
   identified as Limelight/Systemcore. Never select a drive based only on its
   position in the list.
5. Select the full image and start the flash. Do not disconnect USB or robot
   power while writing is in progress.
6. When Hardware Manager reports completion, turn robot power off, disconnect
   LINK, and boot normally. Then complete **Configure and Verify** above.

.. warning::

   Recovery flashing overwrites the Systemcore OS. Confirm the hardware
   revision, image file, and selected target device before starting.
