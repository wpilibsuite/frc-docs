.. include:: <isonum.txt>

# Known Issues

This article details known issues (and workarounds) for FRC\ |reg| Control System Software.

## Open Issues

### Driver Station randomly disabled

**Issue:** The Driver Station contains tighter safety mechanisms introduced in 2024 to protect against control issues. Some teams have seen this cause the robot to disable.

**Workaround:** There are multiple potential causes for tripping the safety mechanisms.

.. note:: The new safety mechanisms will *not* disable the robot when connected to the :term:`FMS`.

The Driver Station software has new tools for control packet delays that could cause this. The control system team requests that teams that experience this issue post screenshots of the :doc:`Driver Station Timing window </docs/software/driverstation/driver-station-timing-viewer>` to https://github.com/wpilibsuite/allwpilib/issues/6174

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
3. Follow the :doc:`Driver Station Best Practices </docs/software/driverstation/driver-station-best-practices>`

While rare, this can be caused by robot code that oversaturates the roboRIO processor or network connection. If all other troubleshooting steps fail, you can try running with one of the WPILib example programs to see if the problem still occurs.

If you identify software that interferes with driver station, please post it to https://github.com/wpilibsuite/allwpilib/issues/6174

### Driver Station Reports Less Free RAM then is Available

**Issue:** The Driver Station diagnostic screen reports free RAM that is misleadingly low. This is due to Linux's use of memory caches. Linux will cache data in memory, but then relinquish when the robot programs requests more memory. The Driver Station only reports memory that isn't used by caches.

**Workaround:** The true memory available to the robot program is available in the file ``/proc/meminfo``. :doc:`Use ssh to connect to the robot </docs/software/roborio-info/roborio-ssh>`, and run ``cat /proc/meminfo``.

```text
MemTotal:         250152 kB
MemFree:           46484 kB
MemAvailable:     126956 kB
```

The proper value to look is as MemAvailable, rather then MemFree (which is what the driver station is reporting).

### Driver Station Reporting No Code

**Issue:** There is a rare occurrence in the roboRIO 2.0 that causes the roboRIO to not properly start the robot program. This causes the Driver Station to report a successful connection but no code, even though code is deployed on the roboRIO.

**Workaround:** We are currently investigating the root cause, but FIRST volunteers have been made aware and the recommendation is to reboot the roboRIO when this occurs.

.. note:: Pressing the physical :guilabel:`User` button on the roboRIO for 5 seconds can also cause the robot code to not start, but a reboot will not start the robot code. If the robot code does not start after rebooting, press the :guilabel:`User` button. Ensure that nothing on the robot is in contact with the :guilabel:`User` button.

### Onboard I2C Causing System Lockups

**Issue:** Use of the onboard I2C port on the roboRIO 1 or 2, in any language, can result in system lockups. The frequency of these lockups appears to be dependent on the specific hardware (i.e. different roboRIOs will behave differently) as well as how the bus is being used.

**Workaround:** The only surefire mitigation is to use the MXP I2C port or another device to read the I2C data. Accessing the device less frequently and/or using a different roboRIO may significantly reduce the likelihood/frequency of lockups, it will be up to each team to assess their tolerance of the risk of lockup. This lockup can not be definitively identified on the field and a field fault will not be called for a match where this behavior is believed to occur. This lockup is a CPU/kernel hang, the roboRIO will completely stop responding and will not be accessible via the DS, webpage, or SSH. If you can access your roboRIO via any of these methods, you are experiencing a different issue.

Several alternatives exist for accessing the REV color sensor without using the roboRIO I2C port. A similar approach could be used for other I2C sensors.

- Use a [Raspberry Pi Pico](https://github.com/ThadHouse/picocolorsensor/). Supports up to 2 REV color sensors, sends data to the roboRIO via serial. The Pi Pico is low cost (less than $10) and readily available.
- Use a [Raspberry Pi](https://github.com/PeterJohnson/rpi-colorsensor/). Supports 1-4 color sensors, sends data to the roboRIO via NetworkTables. Primarily useful for teams already using a Raspberry Pi as a coprocessor.

### Updating Properties on roboRIO 2.0 may be slow or hang

**Issue:** Updating the properties on a roboRIO 2.0 without reformatting using the Imaging Tool (such as setting the team number) may be slow or hang.

**Workaround:** After a few minutes of the tool waiting the roboRIO should be able to be rebooted and the new properties should be set.

### Simulation crashes on Mac after updating WPILib

**Issue:** On macOS, after updating the project to use a newer version of WPILib, running simulation immediately crashes without the GUI appearing.

**Workaround:** In VS Code, run WPILib | Run a command in Gradle, ``clean``. Alternatively, run ``./gradlew clean`` in the terminal or delete the build directory.

### Invalid build due to missing GradleRIO

**Issue:** Rarely, a user's Gradle cache will get broken and they will get shown errors similar to the following:

```console
Could not apply requested plugin [id: ‘edu.wpi.first.GradleRIO’, version: ‘2020.3.2’] as it does not provide a plugin with id ‘edu.wpi.first.GradleRIO’
```

**Workaround:**

Delete your Gradle cache located under ``~$USER_HOME/.gradle``. Windows machines may need to enable the ability to [view hidden files](https://support.microsoft.com/en-us/windows/view-hidden-files-and-folders-in-windows-10-97fbc472-c603-9d90-91d0-1166d1d9f4b5). This issue has only shown up on Windows so far. Please [report](https://github.com/wpilibsuite/frc-docs/issues/new) this issue if you get it on an alternative OS.

### Chinese characters in Driver Station Log

**Issue:** Rarely, the driver station log will show Chinese characters instead of the English text. This appears to only happen when Windows is set to a language other then English.

.. image:: /docs/software/vscode-overview/images/known-issues/DS-chinese.jpg
  :alt: Chinese character appearing in the Driver Station log window.

**Workaround:**
There are two known workarounds:

#. Copy and paste the Chinese characters into notepad, and the English text will be shown.
#. Temporarily change the Windows language to English.

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

### Python - CameraServer/cscore runs out of memory on roboRIO 1

**Issue:** When using CameraServer on a roboRIO 1, the image processing program will sometimes exit with a ``SIGABRT`` or "Error code 6" or a ``MemoryError``.

**Solution:** You may be able to workaround this issue by disabling the NI webserver using the following robotpy-installer command:

```shell
python -m robotpy installer niweb disable
```

.. seealso:: [Github issue](https://github.com/robotpy/mostrobotpy/issues/61)

## Fixed in WPILib 2026.2.1

### roboRIO Team Number Setter desktop shortcut broken on Windows

**Issue:** The :doc:`roboRIO Team Number Setter </docs/software/wpilib-tools/roborio-team-number-setter/index>` desktop shortcut is broken in the 2026.1.1 release, but the software is still installed.

**Workaround:** There are several other ways to start the roboRIO Team Number Setter

1. Use the icon in the Windows start menu
2. Use the Visual Studio Code :guilabel:`Start Tool` feature
