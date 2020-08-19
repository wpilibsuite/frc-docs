Windows Firewall Configuration
==============================

Many of the programming tools used in FRC need network access for various reasons. Depending on the exact configuration, the Windows Firewall may potentially interfere with this access for one or more of these programs.

Disabling Windows Firewall
--------------------------

.. important:: Disabling your firewall requires administrator privileges to the PC. Additionally note that disabling the firewall is not recommended for computers that connect to the internet.

The easiest solution is to disable the Windows Firewall. Teams should beware that this does make the PC potentially more vulnerable to malware attacks if connecting to the internet.

.. tabs::

   .. group-tab:: Windows 10

      Click :guilabel:`Start` -> :guilabel:`Settings`

      .. image:: images/windows-firewall/select-settings.png

      Click :guilabel:`Update & Security`

      .. image:: images/windows-firewall/select-update-security.png

      In the left pane, select :guilabel:`Open Windows Security`

      .. image:: images/windows-firewall/open-windows-security.png

      In the left pane, select :guilabel:`Firewall and network protection`

      .. image:: images/windows-firewall/select-firewall.png

      Click on **each** of the highlighted options

      .. image:: images/windows-firewall/select-network.png

      Then click on the **On** toggle to turn it off.

      .. image:: images/windows-firewall/disable-firewall-toggle.png

   .. group-tab:: Windows 7

      .. image:: images/windows-firewall-configuration-1.png

      Click :guilabel:`Start` -> :guilabel:`Control Panel` to open the Control Panel. Click the dropdown next to :guilabel:`View by:` and select :guilabel:`Small icons` then click :guilabel:`Windows Defender Firewall`.

      .. image:: images/windows-firewall-configuration-2.png

      In the left pane, click :guilabel:`Turn Windows Defender Firewall on or off`, and click yes. Enter your Administrator password if a dialog appears.

      .. image:: images/windows-firewall-configuration-3.png

      For each category, select the radio button to :guilabel:`Turn off Windows Defender Firewall`. Then click OK.

Whitelisting Apps
-----------------

Alternatively, you can add exceptions to the Firewall for any FRC programs you are having issues with.

.. tabs::

   .. group-tab:: Windows 10

      Click :guilabel:`Start` -> :guilabel:`Settings`

      .. image:: images/windows-firewall/select-settings.png

      Click :guilabel:`Update & Security`

      .. image:: images/windows-firewall/select-update-security.png

      In the left pane, select :guilabel:`Open Windows Security`

      .. image:: images/windows-firewall/open-windows-security.png

      In the left pane, select :guilabel:`Firewall and network protection`

      .. image:: images/windows-firewall/select-firewall.png

      At the bottom of the window, select :guilabel:`Allow an app through firewall`

      .. image:: images/windows-firewall/add-to-firewall.png

      For each FRC program you are having an issue with, make sure that it appears in the list and that it has a check in each of the 3 columns. If you need to change a setting, you made need to click the :guilabel:`Change settings` button in the top right before changing the settings. If the program is not in the list at all, click the :guilabel:`Allow another program...` button and browse to the location of the program to add it.

      .. image:: images/windows-firewall/allow-through-firewall.png

   .. group-tab:: Windows 7

      Click :guilabel:`Start` -> :guilabel:`Control Panel` to open the Control Panel. Click the dropdown next to :guilabel:`View by:` and select :guilabel:`Small icons` then click :guilabel:`Windows Defender Firewall`.

      .. image:: images/windows-firewall-configuration-1.png

      In the left pane, click :guilabel:`Allow a program or feature through Windows Defender Firewall`

      .. image:: images/windows-firewall-configuration-5.png

      For each FRC program you are having an issue with, make sure that it appears in the list and that it has a check in each of the 3 columns. If you need to change a setting, you made need to click the :guilabel:`Change settings` button in the top right before changing the settings. If the program is not in the list at all, click the :guilabel:`Allow another program...` button and browse to the location of the program to add it.

      .. image:: images/windows-firewall-configuration-6.png
