.. include:: <isonum.txt>

# Known Issues

This article details known issues (and workarounds) for FIRST\ |reg| Control System Software.

## Open Issues

### Unable to deploy on macOS when multiple VS Code versions are installed

**Issue:** On macOS, having multiple installed copies of Visual Studio Code can cause deploy operations to fail because of [macOS local network privacy](https://developer.apple.com/documentation/technotes/tn3179-understanding-local-network-privacy)

**Workaround:** Open Settings -> Privacy and Security -> Local Network Access and ensure that all VS Code versions are allowed Local Network Access.

If that doesn't work, you can run the following commands in a terminal and then reboot. This allows any program to access the robot's network.

```zsh
sudo defaults write com.apple.network.local-network AllowedEthernetLocalNetworkAddresses -array "10.0.0.0/8"
sudo defaults write com.apple.network.local-network AllowedWiFiLocalNetworkAddresses -array "10.0.0.0/8"
```

.. warning:: This also allows any program to access any network with the address in the range of ``10.x.x.x``, which may be undesirable if you connect to other networks in that range beside's the robot's network. If you only access a robot with a single team number, you can substitute ``10.TE.AM.0/24``` (:ref:`TE.AM IP Notation <docs/networking/networking-introduction/ip-configurations:TE.AM IP Address Notation>`). If you only access the robot's network over eithernet or WiFi, you can only run the appropriate command.

### Driver Station randomly disabled

**Issue:** The Driver Station contains safety mechanisms to protect against control issues. Some teams have seen this cause the robot to disable.

**Workaround:** There are multiple potential causes for tripping the safety mechanisms.

.. note:: The safety mechanisms will *not* disable the robot when connected to the :term:`FMS`.

Some teams have seen this happen only when the robot is operated wirelessly, but not when operated via USB or ethernet tether. Some potential mitigations:

1. Try relocating the robot radio to a better location (high in the robot and away from motors or large amounts of metal). Follow the `manufacturer's recommended mounting <https://frc-radio.vivid-hosting.net/getting-started/usage/mounting-your-radio>`__
2. :doc:`Measure your robot's bandwidth </docs/networking/networking-introduction/measuring-bandwidth-usage>` and ensure you have margin under the 7 Mbps bandwidth limit
3. See if the Wi-Fi environment is congested using a tool like [WiFi Analyzer](https://apps.microsoft.com/detail/9NBLGGH33N0N?hl=en-US&gl=US).
4. Utilize the recommended :doc:`2 radio setup </docs/zero-to-robot/step-3/radio-programming>`.
   1. Ensure the DS Radio is mounted high, away from interference and humans walking between the DS radio and the robot.
   2. Use ethernet to connect the DS computer to the DS Radio
5. Update the Wi-Fi drivers for the DS computer.

Some teams have seen this happen due to software that is running on the driver station (such as Autodesk updater or Discord). Some potential mitigations:

1. Reboot the driver station computer
2. Close software that is running in the background
3. Follow the :doc:`Driver Station Best Practices </docs/software/firstdriverstation/first-driver-station-best-practices>`

While rare, this can be caused by robot code that oversaturates the Systemcore processor or network connection. If all other troubleshooting steps fail, you can try running with one of the WPILib example programs to see if the problem still occurs.

If you identify software that interferes with driver station, please open an issue at https://github.com/wpilibsuite/FirstDriverStation-Public/issues

### Simulation crashes on Mac after updating WPILib

**Issue:** On macOS, after updating the project to use a newer version of WPILib, running simulation immediately crashes without the GUI appearing.

**Workaround:** In VS Code, run WPILib | Run a command in Gradle, ``clean``. Alternatively, run ``./gradlew clean`` in the terminal or delete the build directory.

### Invalid build due to missing GradleRIO

**Issue:** Rarely, a user's Gradle cache will get broken and they will get shown errors similar to the following:

```console
Could not apply requested plugin [id: ‘edu.wpi.first.GradleRIO’, version: ‘2020.3.2’] as it does not provide a plugin with id ‘edu.wpi.first.GradleRIO’
```

**Workaround:**

Delete your Gradle cache located under ``~$USER_HOME/.gradle``. Windows machines may need to enable the ability to [view hidden files](https://support.microsoft.com/en-us/windows/view-hidden-files-and-folders-in-windows-10-97fbc472-c603-9d90-91d0-1166d1d9f4b5). This issue has only shown up on Windows so far. Please [report](https://github.com/wpilibsuite/wpilib-docs/issues/new) this issue if you get it on an alternative OS.

### C++ Intellisense - Files Open on Launch Don't Work Properly

**Issue:** In C++, files open when VS Code launches will have issues with Intellisense showing suggestions from all options from a compilation unit and not just the appropriate ones or not finding header files. This is a bug in VS Code.

**Workaround:**

#. Close all  files in VS Code, but leave VS Code open
#. Delete c_cpp_properties.json file in the .vscode folder, if it exists
#. Run the "Refresh C++ Intellisense" command in VS Code.
#. In the bottom right you should see something that looks like a platform (linuxathena or windowsx86-64 etc). If it’s not linuxathena click it and set it to linuxathena (release)
#. Wait ~1 min
#. Open the main cpp file (not a header file). Intellisense should now be working

### Issues with WPILib Dashboards and Simulation on Windows N Editions

**Issue:** WPILib code using CSCore (dashboards and simulated robot code) will have issues on Education N editions of Windows.

- Shuffleboard will run, but not load cameras
- Smartdashbard will crash on start-up
- Robot Simulation will crash on start-up

**Solution:** Install the [Media Feature Pack](https://support.microsoft.com/en-us/topic/media-feature-pack-list-for-windows-n-editions-c1c6fffa-d052-8338-7a79-a4bb980a700a)

## Fixed in WPILib 2027.0.0-alpha-2

### I2C numbering backwards

The I2C numbering in WPILib is backwards from what the labels are on Systemcore. This will be fixed in Alpha 2 and later releases.

### DutyCycle.getOutput crashes

Attempting to call DutyCycle.getOutput() or DutyCycleEncoder.get() without calling setAssumedFrequency() will crash. This is because currently the HW does not report frequency, which doesn't allow us to compute a percentage output. This also means getFrequency() also will fail.

Use DutyCycle.getHighTime() or DutyCycleEncoder.setAssumedFrequency(), and use the value specified in the datasheet of the sensor to compute a percentage output.

## Fixed in VH-109 fimware version 2.0.0

### Systemcore won't get 10.TE.AM.2 address from Radio.

Due to the change in Hostname, the radio will not hand out .2 to Systemcore. Use the IP address displayed on the Systemcore screen if you need to know the IP address.

Generally, everything should work in this configuration. But if you run into issues where the DS cannot connect (And you're sure the team number is set, it's required to connect the DS and can be verified on the screen), you can manually type the IP address into the team number selector in the DS.
