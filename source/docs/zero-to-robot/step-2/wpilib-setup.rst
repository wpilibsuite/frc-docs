# WPILib Installation Guide

This guide will walk you through installing the WPILib development environment on your computer. This includes the WPILib tools, Visual Studio Code, and all dependencies needed to develop and deploy code to the roboRIO. WPILib Installation is required for Java and C++ teams. LabVIEW teams can skip to :doc:`labview-setup`. Python teams can do a full install per these instructions to get a Visual Studio Code environment with some python extensions, or do a tools only installation to install dashboards such as Shuffleboard and Elastic. Python teams additionally need to follow the :doc:`python-setup`.

## Prerequisites

Supported Operating Systems and Architectures:
 * Windows 10 & 11, 64 bit only. 32 bit and Arm are not supported
 * Ubuntu 22.04 & 24.04, 64 bit. Other Linux distributions with glibc >= 2.34 may work, but are unsupported
 * macOS 13.3 or higher, both Intel and Arm.

.. warning:: The following OSes are no longer supported: macOS 12 or earlier, Ubuntu 18.04 & 20.04, Windows 7, Windows 8.1, and any 32-bit Windows.

.. note:: [Windows 10 support from Microsoft will end in October 2025](https://www.microsoft.com/en-us/windows/end-of-support). We intend to continue supporting Windows 10 through the 2026 season, but may have to drop support in 2027. Teams should start planning their upgrade path to Windows 11, or switch to one of the supported Linux distributions listed.

.. note:: C++ compilation is memory intensive. A minimum of 32 GB of RAM is recommended for C++ teams.

This tutorial shows Windows 11, but the steps are identical for all operating systems. Notes differentiating operating systems will be shown.

WPILib is designed to install to different folders for different years, so that it is not necessary to uninstall a previous version before installing this year's WPILib.

## Downloading

.. only:: not prbuild

   .. wpilibrelease:: v2025.3.2

[You can download the latest release of the installer from GitHub](https://github.com/wpilibsuite/allwpilib/releases/latest/).

Once on the GitHub releases page, scroll to the Downloads section.

.. image:: images/installer-download/github-release.jpg
   :alt: Latest WPILib release page on GitHub

Then click on the correct binary for your OS and architecture to begin the download.

## Extracting the Installer

When you download the WPILib installer, it is distributed as a disk image file ``.iso`` for Windows, ``.tar.gz`` for Linux, and distributed as a ``DMG`` for MacOS.

.. tab-set::

   .. tab-item:: Windows 10+
      :sync: windows-10

      Windows 10+ users can right click on the downloaded disk image and select :guilabel:`Mount` to open it. Then launch ``WPILibInstaller.exe``.

      .. image:: images/wpilib-setup/extract-windows-10.png
         :alt: The menu after right clicking on an .iso file to choose "Mount".

      .. note:: Other installed programs may associate with iso files and the :guilabel:`mount` option may not appear. If that software does not give the option to mount or extract the iso file, then follow the directions below.

      You can use [7-zip](https://www.7-zip.org/) to extract the disk image by right-clicking, selecting :guilabel:`7-Zip` and selecting :guilabel:`Extract to...`. Windows 11 users may need to select :guilabel:`Show more options` at the bottom of the context menu.

      .. image:: images/wpilib-setup/extract-windows-7.png
         :alt: After right clicking on the .iso file go to "7-Zip" then "Extract to....".

      After opening the ``.iso`` file, launch the installer by opening ``WPILibInstaller.exe``.

      .. note:: After launching the installer, Windows may display a window titled "Windows protected your PC". Click :guilabel:`More info`, then select :guilabel:`Run anyway` to run the installer.

   .. tab-item:: macOS
      :sync: macos

      .. note:: Ensure you've ejected any previous WPILibInstaller images from the desktop before starting installation

      macOS users can double click on the downloaded ``dmg`` and then select ``WPILibInstaller`` to launch the application.

      .. image:: images/wpilib-setup/macos-launch.png
         :alt: Show the macOS screen after double clicking the .dmg file.

      If a warning is shown about WPILibInstaller being downloaded from the internet, select :guilabel:`Open`.

      .. image:: images/wpilib-setup/macos-downloaded.png
         :alt: Warning about WPILibInstaller being downloaded from the internet

   .. tab-item:: Linux
      :sync: linux

      Linux users should extract the downloaded ``.tar.gz`` and then launch ``WPILibInstaller``. Ubuntu treats executables in the file explorer as shared libraries, so double-clicking won't run them. Run the following commands in a terminal instead with ``<version>`` replaced with the version you're installing.

      ```console
      $ tar -xf WPILib_Linux-<version>.tar.gz
      $ cd WPILib_Linux-<version>/
      $ ./WPILibInstaller
      ```

## Running the Installer

Upon opening the installer, you'll be presented with the below screen. Go ahead and press :guilabel:`Start`.

.. image:: images/wpilib-setup/installer-start.png
   :alt: Start of Installer

.. image:: images/wpilib-setup/installer-options.png
   :alt: An overview of the installer options

This showcases a list of options included with the WPILib installation.

- :guilabel:`Tools Only` installs just the WPILib tools (:doc:`SmartDashboard </docs/software/dashboards/smartdashboard/index>`, :doc:`Shuffleboard </docs/software/dashboards/shuffleboard/index>`, :doc:`RobotBuilder </docs/software/wpilib-tools/robotbuilder/index>`, :doc:`OutlineViewer </docs/software/wpilib-tools/outlineviewer/index>`, :doc:`PathWeaver </docs/software/pathplanning/pathweaver/index>`, :doc:`Glass </docs/software/dashboards/glass/index>`, :doc:`SysId </docs/software/advanced-controls/system-identification/index>`, :ref:`Data Log Tool <docs/software/telemetry/datalog-download:Managing Data Logs with the DataLogTool>`, :doc:`roboRIO Team Number Setter </docs/software/wpilib-tools/roborio-team-number-setter/index>`, :doc:`AdvantageScope </docs/software/dashboards/advantagescope>`, :doc:`Elastic </docs/software/dashboards/elastic>`, :doc:`WPIcal </docs/software/wpilib-tools/wpical/index>`) and JDK.
- :guilabel:`Everything` installs the full development environment (VS Code, extensions, all dependencies, C++ compiler and JDK), WPILib tools, and documentation

You will notice two buttons, :guilabel:`Install for this User` and :guilabel:`Install for all Users`. :guilabel:`Install for this User` only installs it on the current user account, and does not require administrator privileges. However, :guilabel:`Install for all Users` installs the tools for all system accounts and *will* require administrator access. :guilabel:`Install for all Users` is not an option for macOS and Linux.

.. note:: If you select Install for all Users, Windows will prompt for administrator access through UAC during installation.

Select the option that is appropriate for you, and you'll presented with the following installation screen.

This next screen involves downloading VS Code. Unfortunately, due to licensing reasons, VS Code can not be bundled with the installer.

.. image:: images/wpilib-setup/installer-vscode-download.png
   :alt: Overview of VS Code download options

- Download for this computer only

  - This downloads VS Code only for the current platform, which is also the smallest download.

- Skip and don't use VS Code

  - Skips installing VS Code. Useful for advanced installations or configurations. Generally not recommended.

- Select existing VS Code archive for offline install on this computer

  - Selecting this option will bring up a prompt allowing you to select a pre-existing zip file of VS Code that has been downloaded by the installer previously. This option does **not** let you select an already installed copy of VS Code on your machine.

- Create VS Code archives to share with other computers/OSes for offline install

  - This option downloads and saves a copy of VS Code for all platforms, which is useful for sharing with the installer for future offline installs.

Go ahead and select :guilabel:`Download for this computer only`. This will begin the download process and can take a bit depending on internet connectivity (it's ~150MB). Once the download is done, select :guilabel:`Next`. You should be presented with a screen that looks similar to the one below.

.. note:: teams upgrading from Beta will already have a version of VS Code installed. However, it's still recommended to select :guilabel:`Download for this computer only` to ensure the latest recommended version of VS Code is installed

.. image:: images/wpilib-setup/installer-installing.png
   :alt: Installer progress bar

After installation is complete, you will be presented with the finished screen.

.. image:: images/wpilib-setup/installer-finish.png
   :alt: Installer finished screen.

.. important:: WPILib installs a separate version of VS Code. It does not use an already existing installation. Each year has it's own copy of the tools appended with the year. IE: ``WPILib VS Code 2025``. Please launch the WPILib VS Code and not a system installed copy!

Congratulations, the WPILib development environment and tooling is now installed on your computer! Press Finish to exit the installer.

## Post-Installation

Some operating systems require some final action to complete installation.

.. tab-set::

   .. tab-item:: macOS
      :sync: macos

      After installation, the installer opens the WPILib VS Code folder. Drag the VS Code application to the dock.
      Eject WPILibInstaller image from the desktop.

   .. tab-item:: Linux
      :sync: linux

      Some versions of Linux (e.g. Ubuntu 22.04 and later) require you to give the desktop shortcut the ability to launch. Right click on the desktop icon and select Allow Launching.

      .. image:: images/wpilib-setup/linux-enable-launching.png
         :alt: Menu that pops up after right click the desktop icon in Linux.

      Ubuntu 23.10 and later [disable the kernel user namespaces feature for unknown applications](https://ubuntu.com/blog/ubuntu-23-10-restricted-unprivileged-user-namespaces). This means that the [sandboxing feature](https://code.visualstudio.com/blogs/2022/11/28/vscode-sandbox) won't work on the WPILib VS Code. To enable sandboxing for the WPILib applications, AppArmor profiles are provided, and can be installed using the command below.

      ```console
      $ sudo cp ~/wpilib/YEAR/frccode/AppArmor/* /etc/apparmor.d/
      $ sudo systemctl reload apparmor.service
      ```

      The above will fix the following error:

      ```console
      The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that ~/wpilib/2025/advantagescope/chrome-sandbox is owned by root and has mode 4755.
      ```


.. note:: Installing desktop tools and rebooting will create a folder on the desktop called ``YYYY WPILib Tools``, where ``YYYY`` is the current year. Desktop tool shortcuts are not available on Linux and macOS.

## Additional C++ Installation for Simulation

C++ robot simulation requires that a native compiler to be installed. For Windows, this would be [Visual Studio 2022 version 17.9 or later](https://visualstudio.microsoft.com/vs/) (**not** VS Code), macOS requires [Xcode 14 or later](https://apps.apple.com/us/app/xcode/id497799835), and Linux (Ubuntu) requires the ``build-essential`` package.

Ensure the :guilabel:`Desktop Development with C++` option is checked in the Visual Studio installer for simulation support.

.. image:: /docs/software/wpilib-tools/robot-simulation/images/vs-build-tools.png
   :alt: Screenshot of the Visual Studio build tools option

## What is Installed?

The Offline Installer installs the following components:

- **Visual Studio Code** - The supported IDE for 2019 and later robot code development. The offline installer sets up a separate copy of VS Code for WPILib development, even if you already have VS Code on your machine. This is done because some of the settings that make the WPILib setup work may break existing workflows if you use VS Code for other projects.

- **C++ Compiler** - The toolchains for building C++ code for the roboRIO

- **Gradle** - The specific version of Gradle used for building/deploying C++ or Java robot code

- **Java JDK/JRE** - A specific version of the Java JDK/JRE that is used to build Java robot code and to run any of the Java based Tools (Dashboards, etc.). This exists side by side with any existing JDK installs and does not overwrite the JAVA_HOME variable

- **WPILib Tools** - :doc:`SmartDashboard </docs/software/dashboards/smartdashboard/index>`, :doc:`Shuffleboard </docs/software/dashboards/shuffleboard/index>`, :doc:`RobotBuilder </docs/software/wpilib-tools/robotbuilder/index>`, :doc:`OutlineViewer </docs/software/wpilib-tools/outlineviewer/index>`, :doc:`PathWeaver </docs/software/pathplanning/pathweaver/index>`, :doc:`Glass </docs/software/dashboards/glass/index>`, :doc:`SysId </docs/software/advanced-controls/system-identification/index>`, :ref:`Data Log Tool <docs/software/telemetry/datalog-download:Managing Data Logs with the DataLogTool>`, :doc:`roboRIO Team Number Setter </docs/software/wpilib-tools/roborio-team-number-setter/index>`, :doc:`AdvantageScope </docs/software/dashboards/advantagescope>`, :doc:`Elastic </docs/software/dashboards/elastic>`, :doc:`WPIcal </docs/software/wpilib-tools/wpical/index>`

- **WPILib Dependencies** - OpenCV, etc.

- **VS Code Extensions** - WPILib and Java/C++/Python extensions for robot code development in VS Code

- **Documentation** - Offline copies of this frc-docs documentation and Java/C++/Python APIs

.. note:: It's not recommended to use the VS Code Backup and Settings Sync feature to sync settings between a regular VS Code installation and the FRC VS Code installation. This could lead to either installation being broken.


## Uninstalling

WPILib is designed to install to different folders for different years, so that it is not necessary to uninstall a previous version before installing this year's WPILib. However, the following instructions can be used to uninstall WPILib if desired.

.. tab-set::

  .. tab-item:: Windows

     1. Delete the appropriate wpilib folder (``c:\Users\Public\wpilib\YYYY`` where ``YYYY`` is the year to uninstall)
     2. Delete the desktop icons at ``C:\Users\Public\Public Desktop``

  .. tab-item:: macOS

     1. Delete the appropriate wpilib folder (``~/wpilib/YYYY`` where ``YYYY`` is the year to uninstall)

  .. tab-item:: Linux

     1. Delete the appropriate wpilib folder (``~/wpilib/YYYY`` where ``YYYY`` is the year to uninstall). eg ``rm -rf ~/wpilib/YYYY``

## Troubleshooting

In case the installer fails, please open an issue on the installer repository. A link is available [here](https://github.com/wpilibsuite/wpilibinstaller-avalonia). The installer should give a message on the cause of the error, please include this in the description of your issue.
