WPILib Installation Guide
=============================

.. note:: This setup is for C++\Java teams. LabVIEW teams should proceed to :doc:`Installing LabVIEW for FRC </docs/getting-started/getting-started-frc-control-system/labview-setup>`.

.. tabs::

  .. tab:: Windows
    .. note:: Windows 7: You **must** install the NI Update or .NET Version 4.62 (or later) before proceeding with the install of Visual Studio Code for FRC. The NI Update installer will automatically install the proper version of .NET. The standalone .NET installer is `here <https://support.microsoft.com/en-us/help/3151800/the-net-framework-4-6-2-offline-installer-for-windows>`__

    **Offline Installer**

      Download the appropriate installer for your Windows installation (32 bit or 64 bit) `from GitHub <https://github.com/wpilibsuite/allwpilib/releases>`__. If you're not sure, open Control Panel -> System to check. After the zip file is downloaded, ensure that the installer is extracted before attempting to run it. Running it while the installer is inside the zip will cause the installation process to fail.

      Double click on the installer to run it. If you see any Security warnings, click *Run (Windows 7)* or *More Info -> Run Anyway* (Windows 8+).

      .. image:: images/windows/InstallationType.png

      Choose whether to install for *All Users* on the machine or the *Current User*. The *All Users* option requires administrator privileges, but installs in a way that is accessible to all user accounts, the *Current User* install is only accessible from the account it is installed from.

      If you select *All Users*, you will need to accept the security prompt that appears.

    **Download Visual Studio Code**

      For licensing reasons, the installer cannot contain the VS Code installer bundled in. Click *Select/Download VS Code* to either download the VS Code installer or select a pre-downloaded copy. If you intend to install on other machines without internet connections, after the download completes, you can click *Open Downloaded File* to be taken to the zip file on the file system to copy along with the Offline Installer.

      .. image:: images/windows/DownloadVSCode.png


    **Execute Install**

      Make sure all checkboxes are checked (unless you have already installed 2020 WPILib software on this machine and the software unchecked them automatically), then click *Execute Install*.

      .. image:: images/windows/ExecuteInstall.png


    **Finished**

      When the installer completes, you will now be able to open and use the WPILib version of VS Code. If you are using any 3rd party libraries, you will still need to install those separately before using them in robot code.

      .. image:: images/windows/Finished.png


    **What's installed?**

      The Offline Installer installs the following components:

      -  *Visual Studio Code* - The supported IDE for 2019 and later robot code development. The offline installer sets up a separate copy of VS Code for WPILib development, even if you already have VS Code on your machine. This is done because some of the settings that make the WPILib setup work may break existing workflows if you use VS Code for other projects.
      -  *C++ Compiler* - The toolchains for building C++ code for the roboRIO
      -  *Gradle* - The specific version of Gradle used for building/deploying C++ or Java robot code
      -  *Java JDK/JRE* - A specific version of the Java JDK/JRE that is used to build Java robot code and to run any of the Java based Tools (Dashboards, etc.). This exists side by side with any existing JDK installs and does not overwrite the ``JAVA_HOME`` variable
      -  *WPILib Tools* - SmartDashboard, Shuffleboard, Robot Builder, Outline Viewer, Pathweaver
      -  *WPILib Dependencies* - OpenCV, etc.
      -  *VS Code Extensions* - WPILib extensions for robot code development in VS Code

    **What's Installed - Continued**

      The Offline Installer also installs a Desktop Shortcut to the WPILib copy of VS Code and sets up a command shortcut so this copy of VS Code can be opened from the command line using the command ``frccode2020``.

      .. image:: images/windows/DesktopIcon.png

      Both of these reference the specific year as the WPIlib C++ tools will now support side-by-side installs of multiple environments from different seasons.

  .. tab :: Mac OSX

    **Getting Visual Studio Code**

      VS Code is the IDE (Integrated Development Environment) that is used for
      2019 and beyond. It needs to be installed on any development computer.
      It can be downloaded here: https://code.visualstudio.com.

      The downloaded file will be "VSCode-darwin-stable.zip" (1)

      Once downloaded, double-click on the zip file to expand it and copy the
      new file: "Visual Studio Code" to the Applications folder (2).

      .. figure:: images/mac/VisualStudioCode.png
          :alt:

    **Download the WPILib release and move the directory**

      Download the software release by navigating to this page:
      https://github.com/wpilibsuite/allwpilib/releases and downloading the
      Mac release.

      .. figure:: images/mac/MacReleasePage.png
          :alt:

      Unzip and untar the file by looking at the file in the explorer and
      double-clicking on it, once or twice to unzip (remove the .gz extension)
      and again to untar it (remove the .tar extension). When finished it
      should like like the folder shown below.

      .. figure:: images/mac/UntarredRelease.png
          :alt:

      Using Finder (or command line) copy the contents of the folder to a new
      folder in your home directory, ~/wpilib/2020 as shown below.

      .. figure:: images/mac/MovedFiles.png
          :alt:

    **Run the ToolsUpdater.py script**

      To update all the additional tools WPILib tools, open a terminal window
      and change directory to ~/wpilib/2020/tools and run the script
      ``ToolsUpdater.py`` with the command:

      ``python ToolsUpdater.py``

      This should populate the tools directory with all of the WPILib tools
      (Shuffleboard, Robot Builder, PathWeaver, etc.)

      .. figure:: images/mac/ToolsUpdater.png
          :alt:

    **Installing the extensions for WPILib development**

      Before using VS Code for WPILib development there are a number of
      extensions that need to be installed. Start up VS Code and type the
      shortcut Cmd-Shift-P to bring up the list of commands available. Start
      typing "Install from VSIX into the search box. Choose that command. In
      the file selection box select Cpp.vsix.

      .. figure:: images/mac/InstallFromVSIX.png
          :alt:

      .. figure:: images/mac/CppVSIX.png
          :alt:

      You should see a message confirming the install and asking to reload
      VS Code. Click the reload button then repeat the vsix installation for
      the rest of the vsix files in this order:

      1. Cpp.vsix
      2. JavaLang.vsix
      3. JavaDeps.vsix
      4. JavaDebug.vsix
      5. WPILib.vsix

    **Setting up Visual Studio Code to use Java 11**

      The WPILib installation includes a JDK, however you need to point VS
      Code at where it is. To do this:

      1) Open VS Code
      2) Press *Ctrl + Shift + P* and type *WPILib* or click on the WPILib icon in
         the top right to open the WPILib Command Palette
      3) Begin typing *Set VS Code Java Home to FRC Home* and select that item
         from the dropdown

      .. figure:: images/mac/JDKHome.png
          :alt:

  .. tab:: Linux

    .. note:: These instructions are based on Ubuntu 18.04, but would be similar for other Debian based Linux distributions.

    **Installing Visual Studio Code**

      1. Download the Linux .deb file from `code.visualstudio.com <https://code.visualstudio.com/>`__
      2. Double-click on the .deb file in the file explorer
      3. Click the "Install" button to install VS Code

      .. figure:: images/linux/install-vscode.png
          :alt: Install VS-Code

    **Download the WPILib release**

      Download the latest Linux release from https://github.com/wpilibsuite/allwpilib/releases Right-click on the downloaded archive, click "Extract Here"

      .. figure:: images/linux/wpi-github.png
          :alt: WPILib GitHub
      .. figure:: images/linux/extract-wpilib.png
          :alt: Extract WPILib

    **Moving to wpilib/2020**

      1. Create a directory structure in your home directory called wpilib/2020 - either from the file manager or with ``$ mkdir -p ~/wpilib/2020``
      2. Drag the contents of WPILIB\_Linux-2020.1.1 directory to ~/wpilib/2020 or run ``$ mv -v WPILib_Linux-2020.1.1/* ~/wpilib/2020``

      .. figure:: images/linux/toolsupdater.png
          :alt: Tools Updater

    **Running Tools Updater**

      To extract the WPILib tools (Dashboards, Robot Builder, etc.), run:

      - ``$ cd ~/wpilib/2020/tools``
      - ``$ python3 ToolsUpdater.py``

    **Installing the extensions for WPILib Visual Studio Code**

      1. Start VS Code (``$ code`` or search "Visual Studio Code" in your application launcher)
      2. *Control-Shift-P* to bring up the command palette, type "Install from VSIX"
      3. Select "Extensions: Install from VSIX"
      4. Navigate to ``~/wpilib/2020/vsCodeExtensions`` and select Cpp.vsix
      5. Repeat for JavaLang.vsix, JavaDeps.vsix, JavaDebug.vsix, and WPILib.vsix in that order

      .. figure:: images/linux/install-vsix.png
          :alt: Install VSIX

      .. figure:: images/linux/vsix-files.png
          :alt: VSIX Files

    **Setting up Visual Studio Code to use Java 11**

      The WPILib installation includes a JDK, however you need to point VS Code at where it is. To do this:

       1. Open VS Code
       2. Press *Ctrl-Shift-P* and type *WPILib* or click on the WPILib icon in the top right to open the WPILib Command Palette
       3. Begin typing *Set VS Code Java Home to FRC Home* and select that item from the dropdown.

      .. figure:: images/linux/java-11.png
          :alt: Java 11
