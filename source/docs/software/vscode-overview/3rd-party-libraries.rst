# 3rd Party Libraries

Teams that are using non-:term:`PWM` motor controllers or advanced sensors will most likely need to install external vendor dependencies.

## What Are Vendor Dependencies?

A vendor dependency is a way for vendors to add their :term:`software library` to robot projects. This library can interface with motor controllers and other devices. This way, teams can interact with their devices via CAN and have access to more complex and in-depth features than traditional PWM control.

## Managing Vendor Dependencies

Vendor dependencies are installed on a per-project basis (so each robot project can have its own set of vendor dependencies). Vendor dependencies can be installed "online" or "offline". The "online" functionality is done by downloading the dependencies over the internet, while offline is typically provided by a vendor-specific installer.

.. warning:: If installing a vendor dependency via the "online" mode, make sure to reconnect the computer to the internet and rebuild about every 30 days otherwise the cache will clear, completely deleting the downloaded library install.

.. note:: Vendors recommend using their offline installers when available, because the offline installer is typically bundled with additional programs that are extremely useful when working with their devices.

### Installing Libraries

.. tab-set::

   .. tab-item:: Java/C++
      :sync: javacpp

      **VS Code**

      .. image:: images/3rd-party-libraries/dependency-activity-bar.png
         :alt: The activity bar of VS Code showing the WPILib icon that opens the Dependency Manager.

      All vendordep operations can be controlled by the Dependency Manager.  Click the WPILib logo in the activity bar as shown above to access the interface.

      .. image:: images/3rd-party-libraries/dependency-sidebar.png
         :alt: The interface of the Dependency Manager with the installed vendordeps at the top and a list of available vendordeps below it.

      Select the desired libraries to add to the project by clicking the :guilabel:`Install` button next to each. The JSON file will be copied to the ``vendordeps`` folder in the project, adding the library as a dependency to the project.

      When an update is available for an installed vendordep you will see the :guilabel:`To Latest` button become available.  To update you can either press that or the :guilabel:`Update All` to move all vendordeps to the latest version.

      The button with the trash icon will uninstall the vendordep.  The dropdown shows what version is currently installed but you can change that to a different version to :guilabel:`update` or :guilabel:`downgrade` to the specified version.

      .. note:: The Dependency Manager will automatically build your program when it loses focus.  This allows you to use the changed dependencies.

   .. tab-item:: Python
      :sync: python

      All RobotPy project dependencies are specified in ``pyproject.toml``. You can specify optional WPILib components by adding the component name to ``components``.

      .. seealso:: :doc:`/docs/software/python/pyproject_toml`

      Optional WPILib components:

      +----------+----------------+---------------------+
      |          | components     | requires            |
      +==========+================+=====================+
      | Apriltag | apriltag       | robotpy-apriltag    |
      +----------+----------------+---------------------+
      | Commands | commands2      | robotpy-commands-v2 |
      +----------+----------------+---------------------+
      | cscore   | cscore         | robotpy-cscore      |
      +----------+----------------+---------------------+
      | Romi     | romi           | robotpy-romi        |
      +----------+----------------+---------------------+
      | XRP      | xrp            | robotpy-xrp         |
      +----------+----------------+---------------------+

      To add vendor libraries to your project, you must add the PyPI package name to ``requires``.

      Optional vendor-specific components (not all are available at the beginning of the season):

      +---------------------+-----------+---------------------------+
      |                     | Origin    | requires                  |
      +=====================+===========+===========================+
      | ChoreoLib           | Vendor    | sleipnirgroup-choreolib   |
      +---------------------+-----------+---------------------------+
      | CTRE Phoenix 6      | Vendor    | phoenix6                  |
      +---------------------+-----------+---------------------------+
      | CTRE Phoenix 5      | Community | robotpy-ctre              |
      +---------------------+-----------+---------------------------+
      | PathPlannerLib      | Vendor    | robotpy-pathplannerlib    |
      +---------------------+-----------+---------------------------+
      | PhotonVision        | Vendor    | photonlibpy               |
      +---------------------+-----------+---------------------------+
      | Playing With Fusion | Community | robotpy-playingwithfusion |
      +---------------------+-----------+---------------------------+
      | REVLib              | Community | robotpy-rev               |
      +---------------------+-----------+---------------------------+
      | Studica             | Community | robotpy-navx              |
      +---------------------+-----------+---------------------------+
      | URCL                | Community | robotpy-urcl              |
      +---------------------+-----------+---------------------------+

      When using ``requires``, you should specify a version by appending ``==<version>`` to the package name, e.g. ``robotpy-commands-v2==2024.0.0``. If you do not specify a version, the latest version will be installed.

      To check what version of packages are currently installed, run the command ``pip list``.

      Note that pinning versions may cause issues with incompatibilities between different components. Unpinning all versions, installing, then re-pinning to the latest set is a good practice when updating.

      Pinning versions is a good practice to do after most robot code is written and validated, before and during a competition. However, outside of this window, remaining on the latest version of the components is recommended, as it will ensure you have the latest bug fixes and features.

      See https://pip.pypa.io/en/stable/topics/repeatable-installs/ for more information on how to specify versions.

   .. tab-item:: Java/C++ (Legacy)
      :sync: javacpplegacy

      **VS Code**

      .. image:: images/3rd-party-libraries/adding-offline-library.png
         :alt: Using the Manage Vendor Libraries option of the WPILib Command Palette.

      To add a vendor library that has been installed by an offline installer, press :kbd:`Ctrl+Shift+P` and type WPILib or click on the WPILib icon in the top right to open the WPILib Command Palette and begin typing :guilabel:`Manage Vendor Libraries`, then select it from the menu. Select the option to :guilabel:`Install new libraries (offline)`.

      .. image:: images/3rd-party-libraries/library-installer-steptwo.png
         :alt: Select the libraries to add.

      Select the desired libraries to add to the project by checking the box next to each, then click :guilabel:`OK`. The JSON file will be copied to the ``vendordeps`` folder in the project, adding the library as a dependency to the project.

      In order to install a vendor library in online mode, press :kbd:`Ctrl+Shift+P` and type WPILib or click on the WPILib icon in the top right to open the WPILib Command Palette and begin typing :guilabel:`Manage Vendor Libraries` and select it in the menu, and then click on :guilabel:`Install new libraries (online)` instead and copy + paste the vendor JSON URL.

      **Checking for Updates (Offline)**

      Since dependencies are version managed on a per-project basis, even when installed offline, you will need to :guilabel:`Manage Vendor Libraries` and select :guilabel:`Check for updates (offline)` for each project you wish to update.

      **Checking for Updates (Online)**

      Part of the JSON file that vendors may optionally populate is an online update location. If a library has an appropriate location specified, running :guilabel:`Check for updates (online)` will check if a newer version of the library is available from the remote location.

      **Removing a Library Dependency**

      To remove a library dependency from a project, select :guilabel:`Manage Current Libraries` from the :guilabel:`Manage Vendor Libraries` menu, check the box for any libraries to uninstall and click :guilabel:`OK`. These libraries will be removed as dependencies from the project.

   .. tab-item:: Command-Line

      Adding a vendor library dependency from the vendor URL can also be done through the command-line via a gradle task. Open a command-line instance at the project root, and enter ``gradlew vendordep --url=<url>`` where ``<url>`` is the vendor JSON URL. This will add the vendor library dependency JSON file to the ``vendordeps`` folder of the project. Vendor libraries can be updated the same way.

      The ``vendordep`` gradle task can also fetch vendordep JSONs from the user ``wpilib`` folder. To do so, pass ``FRCLOCAL/Filename.json`` as the file URL. For example, ``gradlew vendordep --url=FRCLOCAL/WPILibNewCommands.json`` will fetch the JSON for the command-based framework.

### How Does It Work?

.. tab-set::

   .. tab-item:: Java/C++
      :sync: javacpp

      For Java and C++, a :term:`JSON` file describing the vendor library is installed on your system to ``~/wpilib/YYYY/vendordeps`` (where YYYY is the year and ~ is ``C:\Users\Public`` on Windows). This is often done by an offline installer, but may need to be done manually if a ``.zip`` of the ``.json`` files is provided. This file is then used from VS Code to add to the library to each individual project. Vendor library information is managed on a per-project basis to make sure that a project is always pointing to a consistent version of a given vendor library. The libraries themselves are placed in the Maven cache at ``C:\Users\Public\wpilib\YYYY\maven``. Vendors can place a local copy here with an offline installer (recommended) or require users to be connected to the internet for an initial build to fetch the library from a remote Maven location.

      This JSON file allows specification of complex libraries with multiple components (Java, C++, JNI, etc.) and also helps handle some complexities related to simulation.

   .. tab-item:: LabVIEW
      :sync: labview

      For LabVIEW teams, there might be a few new :guilabel:`Third Party` items on various palettes (specifically, one in :guilabel:`Actuators`, one in :guilabel:`Actuators` -> :guilabel:`Motor Control` labeled :guilabel:`CAN Motor`, and one in :guilabel:`Sensors`). These correspond to folders in ``C:\Program Files\National Instruments\LabVIEW 2023\vi.lib\Rock Robotics\WPI\Third Party``

      In order to install third party libraries for LabVIEW, download the VIs from the vendor (typically via some sort of installer). Then drag and drop the third party VIs into the respective folder mentioned above just like any other VI.

   .. tab-item:: Python
      :sync: python

      Third party libraries are packaged into Python wheels and uploaded to PyPI (if pure python) and/or WPILib's artifactory. Users can enable them as dependencies either by adding them by adding an explicit dependency for the PyPI package in ``requires``. The dependencies are downloaded when ``robotpy sync`` is executed, and installed on the roboRIO when ``robotpy deploy`` is executed.
