.. include:: <isonum.txt>

Known Issues
============

This article details known issues (and workarounds) for FRC\ |reg| Control System Software.

Open Issues
-----------

Onboard I2C Causing System Lockups
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** Use of the onboard I2C port, in any language, can result in system lockups. The frequency of these lockups appears to be dependent on the specific hardware (i.e. different roboRIOs will behave differently) as well as how the bus is being used.

**Workaround:** The only surefire mitigation is to use the MXP I2C port instead. Acessing the device less frequently and/or using a different roboRIO may significantly reduce the likelihood/frequency of lockups, it will be up to each team to assess their tolerance of the risk of lockup. This lockup can not be definitively identified on the field and a field fault will not be called for a match where this behavior is believed to occur. This lockup is a CPU/kernel hang, the roboRIO will completely stop responding and will not be accessible via the DS, webpage or SSH. If you can access your roboRIO via any of these methods, you are experiencing a different issue.

Analog Devices Gyros don't work properly
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
**Issue:** Due to an issue with the "autoSPI" feature in the roboRIO image 2022_v3.0, Analog Devices gyros do not work properly.

**Workaround:** There is no known workaround. An updated image will be released when the issue has been resolved.

Game Tools Autorun graphics say 2020
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** If you launch the Game Tools installer by using the Autorun file, the menu item correctly says 2022, but the graphic says 2020.

**Workaround:** This can be safely ignored, if the menu item says 2022, you are installing the correct software.

Updating Properties on roboRIO 2.0 may be slow or hang
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** Updating the properties on a roboRIO 2.0 without reformatting using the Imaging Tool (such as setting the team number) may be slow or hang.

**Workaround:** After a few minutes of the tool waiting the roboRIO should be able to be rebooted and the new properties should be set.

Invalid build due to missing GradleRIO
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** Rarely, a user's Gradle cache will get broken and they will get shown errors similar to the following:

.. code-block:: console

   Could not apply requested plugin [id: ‘edu.wpi.first.GradleRIO’, version: ‘2020.3.2’] as it does not provide a plugin with id ‘edu.wpi.first.GradleRIO’

**Workaround:**

Delete your Gradle cache located under ``~$USER_HOME/.gradle``. Windows machines may need to enable the ability to `view hidden files <https://support.microsoft.com/en-us/windows/view-hidden-files-and-folders-in-windows-10-97fbc472-c603-9d90-91d0-1166d1d9f4b5>`__. This issue has only shown up on Windows so far. Please `report <https://github.com/wpilibsuite/frc-docs/issues/new>`__ this issue if you get it on an alternative OS.

Unable to Build Robot Projects outside of VS Code on M1-based macOS
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** Error when building a robot project in non-WPILib installations.

.. code-block:: console

   Could not determine the dependencies of task ':extractReleaseNative'.
   > Could not resolve all files for configuration ':nativeRelease'.
     > Failed to transform hal-cpp-2022.1.1-rc-1-osxx86.zip (edu.wpi.first.hal:hal-cpp:2022.1.1-rc-1) to match attributes {artifactType=gr-directory, org.gradle.status=release}.
   ...

**Workaround:** M1-based macOS is not supported. The above error will show up when using an ARM-based JDK. User must use a x64-compatible JDK 11 or preferably use the WPILib installer.

Chinese characters in Driver Station Log
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** Rarely, the driver station log will show Chinese characters instead of the English text. This appears to only happen when Windows is set to a language other then English.

.. image:: /docs/software/vscode-overview/images/known-issues/DS-chinese.jpg
  :alt: Chinese character appearing in the Driver Station log window.

**Workaround:**
There are two known workarounds:

  #. Copy and paste the Chinese characters into notepad, and the English text will be shown.
  #. Temporarily change the Windows language to English.

C++ Intellisense - Files Open on Launch Don't Work Properly
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** In C++, files open when VS Code launches will have issues with Intellisense showing suggestions from all options from a compilation unit and not just the appropriate ones or not finding header files. This is a bug in VS Code.

**Workaround:**

  #. Close all  files in VS Code, but leave VS Code open
  #. Delete c_cpp_properties.json file in the .vscode folder, if it exists
  #. Run the "Refresh C++ Intellisense" command in vscode.
  #. In the bottom right you should see something that looks like a platform (linuxathena or windowsx86-64 etc). If it’s not linuxathena click it and set it to linuxathena (release)
  #. Wait ~1 min
  #. Open the main cpp file (not a header file). Intellisense should now be working

Issues with WPILib Dashboards and Simulation on Windows N Editions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** WPILib code using CSCore (dashboards and simulated robot code) will have issues on Education N editions of Windows.

- Shuffleboard will run, but not load cameras
- Smartdashbard will crash on start-up
- Robot Simulation will crash on start-up

**Solution:** Install the `Media Feature Pack <https://www.microsoft.com/en-us/software-download/mediafeaturepack>`__

NetworkTables Interoperability
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

There is currently an issue with inter-operating C++/Java :term:`NetworkTables` clients (dashboards or co-processors) with LabVIEW servers (LV robot code). In some scenarios users will see updates from one client fail to be replicated across to other clients (e.g. data from a co-processor will not be properly replicated out to a dashboard). Data still continues to return correctly when accessed by code on the server.

**Workaround**: Write code on the server to mirror any keys you wish to see on other clients (e.g. dashboards) to a separate key. For example, if you have a key named ``targetX`` being published by a co-processor that you want to show up on a dashboard, you could write code on the robot to read the key and re-write it to a key like ``targetXDash``.

Fixed in WPILib 2022.2.1
------------------------

Joysticks may stop updating in Java
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** A deadlock in the Java WPILib DriverStation thread may occur. This is primarily noticeable by Joystick values "freezing" and not updating. Disable and E-Stop are not affected by this issue.

**Recommendations:** Ensure that anyone operating a robot is prepared to disable or E-Stop if this issue occurs. Limit calls to the following DriverStation methods: ``isEnabled``, ``isEStopped``, ``isAutonomous``, ``isDisabled``, ``isAutonomousEnabled``, ``isTeleopEnabled``, ``isTest``, ``isDSAttached``, ``isFMSAttached``, and ``updateControlWord``, especially from multiple threads, to limit the chance of the deadlock occurring. Follow `this WPILib issue <https://github.com/wpilibsuite/allwpilib/issues/3896>`__ for more updates and possible workarounds.

VS Code Vendor Check for Updates Broken
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** Checking for vendor library updates online results in the following error message: `Command 'WPILib: Manage Vendor Libraries' resulted in an error (Only absolute URLs are supported)`. This is caused by a bug in the VS Code extension related to the way the WPILib Command library vendordeps were created. This issue will be fixed in the next WPILib release.

**Workaround:** If you aren't using either the new or old Command vendordep, remove them from your project. Alternately, the new or old Command vendordep can be temporarily removed before checking for updates, and then re-added.

Shuffleboard aborts while launching
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**Issue:** Shuffleboard may start to open, and then abort. This is caused by issues with the scripts for launching the WPILib tools.

**Workaround:** Manually launch Shuffleboard from the commandline without using the shortcut or script. On Windows run ``c:\Users\Public\wpilib\2022\jdk\bin\java -jar c:\Users\Public\wpilib\2022\tools\shuffleboard.jar``. On Linux or macOS, run ``~/wpilib/2022/jdk/bin/java -jar ~/wpilib/2022/tools/shuffleboard.jar``

.. note:: This issue may affect any WPILib java tool, as they use the same scripts to open. If you have issues with PathWeaver, RobotBuilder, or SmartDashboard replace ``shuffleboard.jar`` above with ``PathWeaver.jar``, ``RobotBuilder.jar`` or ``SmartDashboard.jar``
