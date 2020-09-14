WPILib Installation Guide
=========================

This guide is intended for Java and C++ teams. LabVIEW teams can skip to :doc:`labview-setup`. Additionally, the below tutorial shows Windows 10, but the steps are identical for all OSes. Notes differentating OSes will be shown.

Prerequisites
-------------

You can download the latest release of the installer from `GitHub <https://github.com/wpilibsuite/allwpilib/releases/latest/>`__. Ensure that you download the correct binary for your OS and architecture.

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

  - Selecting this option will bring up a prompt allowing you to select a pre-existing zip file of VS Code.

- Download VS Code for All Platforms

  - This option downloads VS Code for all platforms, which is useful for sharing the copy of the installer.

Go ahead and select :guilabel:`Download VS Code for Single Install`. This will begin the download process and can take a bit depending on internet connectivity. Once the download is done, select :guilabel:`Next`. You should be presented with a screen that looks similar to the one below.

.. image:: images/wpilib-setup/installer-options.png
   :alt: An overview of the installer options

This showcases a list of options included with the WPILib installation. It's advised to just leave the default options selected.

You will notice two buttons, :guilabel:`Install for this User` and :guilabel:`Install for all Users`. :guilabel:`Install for this User` only installs it on the current user account, and does not require administrator privileges. However, :guilabel:`Install for all Users` installs the tools for all system accounts and *will* require administrator access.

Select the option that is appropriate for you, and you'll presented with the following installation screen.

.. image:: images/wpilib-setup/installer-installing.png
   :alt: Installer progress bar

Congratulations, the WPILib development environment and tooling is now installed on your computer!

Troubleshooting
---------------

In case the installer fails, please open an issue on the installer repository. A link is available `here <https://github.com/wpilibsuite/wpilibinstaller-avalonia>`__. The installer should give a message on the cause of the error, please include this in the description of your issue.
