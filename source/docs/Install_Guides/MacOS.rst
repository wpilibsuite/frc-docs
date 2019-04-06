MacOS Offline Install Guide
===========================

    The tools (except the Driver Station and the roboRIO Imaging Tool)
    will run natively on a Mac.

    Note: if you have the alpha release of VSCode for FRC installed, you
    should uninstall it before proceeding or create a new VSCode
    install. Failing to do this will have both versions installed at the
    same time causing things to not operate properly.

Getting Visual Studio Code
^^^^^^^^^^^^^^^^^^^^^^^^^^

VSCode is the IDE (Integrated Development Environment) that is used for
2019 and beyond. It needs to be installed on any development computer.
It can be downloaded here: https://code.visualstudio.com.

The downloaded file will be "VSCode-darwin-stable.zip" (1)

Once downloaded, double-click on the zip file to expand it and copy the
new file: "Visual Studio Code" to the Applications folder (2).

.. figure:: /images/Install_Guides/Mac/VisualStudioCode.png
   :alt: 

Download the WPILib release and move the directory
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Download the software release by navigating to this page:
https://github.com/wpilibsuite/allwpilib/releases and downloading the
Mac release.

.. figure:: /images/Install_Guides/Mac/MacReleasePage.png
   :alt: 

Unzip and untar the file by looking at the file in the explorer and
double-clicking on it, once or twice to unzip (remove the .gz extension)
and again to untar it (remove the .tar extension). When finished it
should like like the folder shown below.

.. figure:: /images/Install_Guides/Mac/UntarredRelease.png
   :alt: 

Using Finder (or command line) copy the contents of the folder to a new
folder in your home directory, ~/frc2019 as shown below.

.. figure:: /images/Install_Guides/Mac/MovedFiles.png
   :alt: 

Run the ``ToolsUpdater.py`` script
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To update all the additional tools WPILib tools, open a terminal window
and change directory to ~/frc2019/tools and run the script
``ToolsUpdater.py`` with the command:

``python ToolsUpdater.py``

This should populate the tools directory with all of the WPILib tools
(Shuffleboard, Robot Builder, PathWeaver, etc.)

.. figure:: /images/Install_Guides/Mac/ToolsUpdater.png
   :alt: 

Installing the extensions for WPILib development
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Before using VSCode for WPILib development there are a number of
extensions that need to be installed. Start up VSCode and type the
shortcut Cmd-Shift-P to bring up the list of commands available. Start
typing "Install from VSIX into the search box. Choose that command. In
the file selection box select Cpp.vsix.

.. figure:: /images/Install_Guides/Mac/InstallFromVSIX.png
   :alt: 

.. figure:: /images/Install_Guides/Mac/CppVSIX.png
   :alt: 

You should see a message confirming the install and asking to reload
vscode. Click the reload button then repeat the vsix installation for
the rest of the vsix files in this order:

1. Cpp.vsix
2. JavaLang.vsix
3. JavaDeps.vsix
4. JavaDebug.vsix
5. WPILib.vsix

Setting up VSCode to use Java 11
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The WPILib installation includes a JDK, however you need to point VS
Code at where it is. To do this:

1) Open VS Code
2) Press Ctrl + Shift + P and type WPILib or click on the WPILib icon in
   the top right to open the WPILib Command Palette
3) Begin typing Set VS Code Java Home to FRC Home and select that item
   from the dropdown

.. figure:: /images/Install_Guides/Mac/JDKHome.png
   :alt: 


