# Installing the FIRST Driver Station

The new FIRST Driver Station is distributed from the
`FirstDriverStation-Public releases page
<https://github.com/wpilibsuite/FirstDriverStation-Public/releases/latest>`_.

.. warning::

   Pre-season alpha releases may require a specific Systemcore OS version and
   are not compatible with the roboRIO or the current FTC SDK. Check the
   release notes before installing an alpha build. Production Driver Station
   releases for 2027 and later support the official FIRST Field Management
   System (FMS).

## Before You Download

- Read the release notes and confirm that the Driver Station and Systemcore
  OS versions are compatible.
- Download only from the official WPILib GitHub organization.
- On Windows, use an Intel or AMD 64-bit computer. Windows on Arm is not
  supported.

## Downloading Install Files

Navigate to the [First Drive Station Releases Page](https://github.com/wpilibsuite/FirstDriverStation-Public/releases/latest). On macOS platforms download the correct ``.pkg`` file and on Windows platforms download the correct ``.exe`` file for your device. For Linux devices, only the archive files are provided.

## Per Platform Setup

### Windows

On Windows, the app has everything configured by default. Just run the installer, and then run the application.

### macOS

There are 3 permissions that macOS requires. It requires Input Monitoring, Local Network access, and data access from other apps. You will get popups for these, and they must be accepted in order to work. The first time you start up the app, these prompts will cause the launch to fail, and you'll need to accept the Input Monitoring prompt, and then restart the app. Then you'll be able to accept the Local Network permission.

.. todo:: add description of what the symptoms would be if these permissions are not granted.

If Local Network access is declined, the app will still seem to function normally, as Apple does not provide a way to detect if the permission has been granted.

macOS will also prompt with "FirstDriverStation" would like to access data from other apps. This permission is required for launching dashboards and for log file writing. You should click Allow when this prompt appears.

If you decline any of these, you can fix the settings in the ``Privacy & Security`` tab of System Settings.

If Local Network access still does not work after re-enabling it there, see :ref:`docs/zero-to-robot/step-2/first-driver-station-installation:macos permissions` for a terminal-based workaround.

### Linux

.. note:: root or sudo access is required to install the FIRST Driver Station on Linux.

The following packages must be installed in order for linux to work:

.. todo:: update when the FirstDriverStation docs update

Additionally, the app needs to be a part of the input group in order to have input access. That can be done with the following commands.

```bash
sudo chgrp input FirstDriverStation
sudo chmod g+s FirstDriverStation
```

Finally, for proper controller access, the current user needs access to hidraw. To do that, create a ``/etc/udev/rules.d/72-hidraw.rules`` containing

```bash
# Grant access to all hidraw devices for the active user
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0660", TAG+="uaccess"
```

Then reload udev rules:

```bash
sudo udevadm control --reload-rules && sudo udevadm trigger
```

## macOS Permissions

macOS requires both Input Monitoring and Local Network access for the Driver Station to function correctly. If you decline one of these prompt, first try re-enabling access in System Settings->Privacy & Security. If the Driver Station still cannot access the local network, you can add macOS local network exceptions from Terminal for both Ethernet and Wi-Fi. The following commands allow access to any ``10.x.x.x`` address and any ``172.16.x.x`` through ``172.31.x.x`` address:

```bash
sudo defaults write com.apple.network.local-network AllowedEthernetLocalNetworkAddresses -array "10.0.0.0/8"
sudo defaults write com.apple.network.local-network AllowedEthernetLocalNetworkAddresses -array-add "172.16.0.0/12"
sudo defaults write com.apple.network.local-network AllowedWiFiLocalNetworkAddresses -array "10.0.0.0/8"
sudo defaults write com.apple.network.local-network AllowedWiFiLocalNetworkAddresses -array-add "172.16.0.0/12"
```

After running these commands, reboot macOS before starting the Driver Station again.

.. warning:: This also allows any program to access any network with the address in the range of ``10.x.x.x``, which may be undesirable if you connect to other networks in that range beside's the robot's network. If you only access a robot with a single team number, you can substitute ``10.TE.AM.0/24``` (:ref:`TE.AM IP Notation <docs/networking/networking-introduction/ip-configurations:TE.AM IP Address Notation>`). If you only access the robot's network over Ethernet or WiFi, you can only run the appropriate command.

.. note:: For more information, see Apple's documentation on [understanding local network privacy](https://developer.apple.com/documentation/technotes/tn3179-understanding-local-network-privacy#macOS-considerations)

## Verify the Installation

1. Open the Driver Station. It should start without an error dialog.
2. Open **Settings** and enter your team number.
3. Connect a gamepad, then confirm that it appears and its controls respond in
   the USB/controller view.
4. With no robot connected, a communication warning is expected.

Continue to :doc:`Step 3: Configure Your Control System <../step-3/index>`.
