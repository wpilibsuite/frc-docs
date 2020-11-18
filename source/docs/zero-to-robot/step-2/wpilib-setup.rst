WPILib Installation Guide
=========================

This guide is intended for Java and C++ teams. LabVIEW teams can skip to :doc:`labview-setup`. Additionally, the below tutorial shows Windows 10, but the steps are identical for all operating systems. Notes differentating operating systems will be shown.

Prerequisites
-------------

You can download the latest release of the installer from `GitHub <https://github.com/wpilibsuite/allwpilib/releases/latest/>`__. Ensure that you download the correct binary for your OS and architecture.

.. note:: Windows 7 users must have an updated system with `this <https://support.microsoft.com/en-us/help/2999226/update-for-universal-c-runtime-in-windows>`__ update installed.

Extracting the Installer
------------------------

When you download the WPILib installer, it is distributed as a disk image file ``.iso`` for Windows, ``.tar.gz`` for Linux, and distributed as a ``DMG`` for MacOS.

.. tabs::

   .. group-tab:: Windows 10

      Windows 10 users can right click on the downloaded disk image and select :guilabel:`Mount` to open it. Then launch ``WPILibInstaller.exe``.

      .. image:: images/wpilib-setup/extract-windows-10.png

   .. group-tab:: Windows 7

      You can use `7-zip <https://www.7-zip.org/>`__ to extract the disk image by right-clicking, selecting :guilabel:`7-Zip` and selecting :guilabel:`Extract to...`. Then launch ``WPILibInstaller.exe``

      .. image:: images/wpilib-setup/extract-windows-7.png

   .. group-tab:: macOS

      macOS users can double click on the downloaded ``DMG`` and then select ``WPILibInstaller`` to launch the application.

      .. image:: images/wpilib-setup/macos-launch.png

   .. group-tab:: Linux

      Linux users should extract the downloaded ``.tar.gz`` and then launch ``WPILibInstaller``.

Running the Installer
---------------------

Upon opening the installer, you'll be presented with the below screen. Go ahead and press :guilabel:`Start`.

.. image:: images/wpilib-setup/installer-start.png
   :alt: Start of Installer

This next screen involves downloading VS Code. Unfortunately, due to licensing reasons, VS Code can not be bundled with the installer.

.. image:: images/wpilib-setup/installer-vscode-download.png
   :alt: Overview of VS Code download options

- Download VS Code for Single Install

  - This downloads VS Code only for the current platform, which is also the smallest download.

- Skip installing VS Code

  - Skips installing VS Code. Useful for advanced installations or configurations. Generally not recommended.

- Select Existing VS Code Download

  - Selecting this option will bring up a prompt allowing you to select a pre-existing zip file of VS Code that has been downloaded by the installer previously. This option does **not** let you select an already installed copy of VS Code on your machine.

- Download VS Code for Offline Installs

  - This option downloads and saves a copy of VS Code for all platforms, which is useful for sharing the copy of the installer.

Go ahead and select :guilabel:`Download VS Code for Single Install`. This will begin the download process and can take a bit depending on internet connectivity (it's ~60MB). Once the download is done, select :guilabel:`Next`. You should be presented with a screen that looks similar to the one below.

.. image:: images/wpilib-setup/installer-options.png
   :alt: An overview of the installer options

This showcases a list of options included with the WPILib installation. It's advised to just leave the default options selected.

You will notice two buttons, :guilabel:`Install for this User` and :guilabel:`Install for all Users`. :guilabel:`Install for this User` only installs it on the current user account, and does not require administrator privileges. However, :guilabel:`Install for all Users` installs the tools for all system accounts and *will* require administrator access.

Select the option that is appropriate for you, and you'll presented with the following installation screen.

.. image:: images/wpilib-setup/installer-installing.png
   :alt: Installer progress bar

Congratulations, the WPILib development environment and tooling is now installed on your computer!

What is Installed?
------------------

The Offline Installer installs the following components:

- **Visual Studio Code** - The supported IDE for 2019 and later robot code development. The offline installer sets up a separate copy of VS Code for WPILib development, even if you already have VS Code on your machine. This is done because some of the settings that make the WPILib setup work may break existing workflows if you use VS Code for other projects.

- **C++ Compiler** - The toolchains for building C++ code for the roboRIO

- **Gradle** - The specific version of Gradle used for building/deploying C++ or Java robot code

- **Java JDK/JRE** - A specific version of the Java JDK/JRE that is used to build Java robot code and to run any of the Java based Tools (Dashboards, etc.). This exists side by side with any existing JDK installs and does not overwrite the JAVA_HOME variable

- **WPILib Tools** - SmartDashboard, Shuffleboard, Robot Builder, Outline Viewer, Pathweaver

- **WPILib Dependencies** - OpenCV, etc.

- **VS Code Extensions** - WPILib extensions for robot code development in VS Code

Uninstalling
------------

WPILib is designed to install to different folders for different years, so that it is not necessary to uninstall a previous version before installing this year's WPILib. However, the following instructions can be used to uninstall WPILib if desired.

.. tabs::

  .. tab:: Windows

     1. Delete the appropriate wpilib folder (2019: ``c:\Users\Public\frc2019``, 2020 and later: ``c:\Users\Public\wpilib\YYYY`` where ``YYYY`` is the year to uninstall)
     2. Delete the desktop icons at ``C:\Users\Public\Public Desktop``
     3. Delete the path environment variables.

        1. In the start menu, type environment and select "edit the system environment variables"
        2. Click on the environment variables button (1).
        3. In the user variables, select path (2) and then click on edit (3).
        4. Select the path with ``roborio\bin`` (4) and click on delete (5).
        5. Select the path with ``frccode`` and click on delete (5).
        6. Repeat steps 3-6 in the Systems Variable pane.

     .. image:: images/wpilib-setup/EnvironmentVariables.png

  .. tab:: macOS

     1. Delete the appropriate wpilib folder (2019: ``~/frc2019``, 2020 and later: ``~/wpilib/YYYY`` where ``YYYY`` is the year to uninstall)

  .. tab:: Linux

     1. Delete the appropriate wpilib folder (2019: ``~/frc2019``, 2020 and later: ``~/wpilib/YYYY`` where ``YYYY`` is the year to uninstall). eg ``rm -rf ~/wpilib/YYYY``

Troubleshooting
---------------

In case the installer fails, please open an issue on the installer repository. A link is available `here <https://github.com/wpilibsuite/wpilibinstaller-avalonia>`__. The installer should give a message on the cause of the error, please include this in the description of your issue.
