3rd Party Libraries
===================

Teams that are using non-:term:`PWM` motor controllers or advanced sensors will most likely need to install external vendor dependencies.

What Are Vendor Dependencies?
-----------------------------

A vendor dependency is a way for vendors such as CTRE, REV, and others to add their :term:`software library` to robot projects. This library can interface with motor controllers and other devices. This way, teams can interact with their devices via CAN and have access to more complex and in-depth features than traditional PWM control.

Managing Vendor Dependencies
----------------------------

Vendor dependencies are installed on a per-project basis (so each robot project can have its own set of vendor dependencies). Vendor dependencies can be installed "online" or "offline". The "online" functionality is done by downloading the dependencies over the internet, while offline is typically provided by a vendor-specific installer.

.. warning:: If installing a vendor dependency via the "online" mode, make sure to reconnect the computer to the internet and rebuild about every 30 days otherwise the cache will clear, completely deleting the downloaded library install.

.. note:: Vendors recommend using their offline installers when available, because the offline installer is typically bundled with additional programs that are extremely useful when working with their devices.

How Does It Work?
^^^^^^^^^^^^^^^^^

How Does It Work? - Java/C++
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

For Java and C++, a :term:`JSON` file describing the vendor library is installed on your system to ``~/wpilib/YYYY/vendordeps`` (where YYYY is the year and ~ is ``C:\Users\Public`` on Windows). This can either be done by an offline installer or the file can be fetched from an online location using the menu item in Visual Studio Code. This file is then used from VS Code to add to the library to each individual project. Vendor library information is managed on a per-project basis to make sure that a project is always pointing to a consistent version of a given vendor library. The libraries themselves are placed in the Maven cache at ``C:\Users\Public\wpilib\YYYY\maven``. Vendors can place a local copy here with an offline installer (recommended) or require users to be connected to the internet for an initial build to fetch the library from a remote Maven location.

This JSON file allows specification of complex libraries with multiple components (Java, C++, JNI, etc.) and also helps handle some complexities related to simulation. Vendors that choose to provide a remote URL in the JSON also enable users to check for updates from within VS Code.

How Does It Work? - LabVIEW
~~~~~~~~~~~~~~~~~~~~~~~~~~~

For LabVIEW teams, there might be a few new :guilabel:`Third Party` items on various palettes (specifically, one in :guilabel:`Actuators`, one in :guilabel:`Actuators` -> :guilabel:`Motor Control` labeled :guilabel:`CAN Motor`, and one in :guilabel:`Sensors`). These correspond to folders in ``C:\Program Files\National Instruments\LabVIEW 2023\vi.lib\Rock Robotics\WPI\Third Party``

In order to install third party libraries for LabVIEW, download the VIs from the vendor (typically via some sort of installer). Then drag and drop the third party VIs into the respective folder mentioned above just like any other VI.

How Does It Work? - Python
~~~~~~~~~~~~~~~~~~~~~~~~~~

Third party libraries are packaged into Python wheels and uploaded either to PyPI (if pure python) or WPILib's artifactory. Users can enable them as dependencies either by adding the component name to ``robotpy_extras`` (recommended) or by adding an explicit dependency in ``requires``. The dependencies are downloaded when ``robotpy sync`` is executed, and installed on the roboRIO when ``robotpy deploy`` is executed.

.. seealso:: :doc:`/docs/software/python/pyproject_toml`


Installing Libraries
^^^^^^^^^^^^^^^^^^^^^^^^

VS Code
~~~~~~~

.. image:: images/3rd-party-libraries/adding-offline-library.png
   :alt: Using the Manage Vendor Libraries option of the WPILib Command Palette.

To add a vendor library that has been installed by an offline installer, press :kbd:`Ctrl+Shift+P` and type WPILib or click on the WPILib icon in the top right to open the WPILib Command Palette and begin typing :guilabel:`Manage Vendor Libraries`, then select it from the menu. Select the option to :guilabel:`Install new libraries (offline)`.

.. image:: images/3rd-party-libraries/library-installer-steptwo.png
   :alt: Select the libraries to add.

Select the desired libraries to add to the project by checking the box next to each, then click :guilabel:`OK`. The JSON file will be copied to the ``vendordeps`` folder in the project, adding the library as a dependency to the project.

In order to install a vendor library in online mode, press :kbd:`Ctrl+Shift+P` and type WPILib or click on the WPILib icon in the top right to open the WPILib Command Palette and begin typing :guilabel:`Manage Vendor Libraries` and select it in the menu, and then click on :guilabel:`Install new libraries (online)` instead and copy + paste the vendor JSON URL.


Checking for Updates (Offline)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Since dependencies are version managed on a per-project basis, even when installed offline, you will need to :guilabel:`Manage Vendor Libraries` and select :guilabel:`Check for updates (offline)` for each project you wish to update.

Checking for Updates (Online)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Part of the JSON file that vendors may optionally populate is an online update location. If a library has an appropriate location specified, running :guilabel:`Check for updates (online)` will check if a newer version of the library is available from the remote location.

Removing a Library Dependency
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To remove a library dependency from a project, select :guilabel:`Manage Current Libraries` from the :guilabel:`Manage Vendor Libraries` menu, check the box for any libraries to uninstall and click :guilabel:`OK`. These libraries will be removed as dependencies from the project.

Command-Line
~~~~~~~~~~~~

Adding a vendor library dependency from the vendor URL can also be done through the command-line via a gradle task. Open a command-line instance at the project root, and enter ``gradlew vendordep --url=<url>`` where ``<url>`` is the vendor JSON URL. This will add the vendor library dependency JSON file to the ``vendordeps`` folder of the project. Vendor libraries can be updated the same way.

The ``vendordep`` gradle task can also fetch vendordep JSONs from the user ``wpilib`` folder. To do so, pass ``FRCLOCAL/Filename.json`` as the file URL. For example, ``gradlew vendordep --url=FRCLOCAL/WPILibNewCommands.json`` will fetch the JSON for the command-based framework.

Libraries
---------

WPILib Libraries
^^^^^^^^^^^^^^^^

Command Library
~~~~~~~~~~~~~~~

The WPILib :doc:`command library </docs/software/commandbased/index>` has been split into a vendor library. It is installed by the WPILib installer for offline installation. It may also be installed with the following online link:

`New Command Library <https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibNewCommands/WPILibNewCommands.json>`__

Romi Library
~~~~~~~~~~~~

A Romi Library has been created to contain several helper classes that are used in the ``RomiReference`` example.

`Romi Vendordep <https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/romiVendordep/RomiVendordep.json>`__.

XRP Library
~~~~~~~~~~~

An XRP Library has been created to contain several helper classes that are used in the ``XRPReference`` example.

`XRP Vendordep <https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/xrpVendordep/XRPVendordep.json>`__.

Vendor Libraries
^^^^^^^^^^^^^^^^

Click these links to visit the vendor site to see whether they offer online installers, offline installers, or both.  URLs below are to plug in to the :guilabel:`VS Code` -> :guilabel:`Install New Libraries (online)` feature.

`CTRE Phoenix Framework <https://store.ctr-electronics.com/software/>`__ - Contains CANcoder, CANifier, CANdle, Pigeon IMU, Pigeon 2.0, Talon FX, Talon SRX, and Victor SPX Libraries and Phoenix Tuner program for configuring CTRE CAN devices
   Phoenix (v6):        Not yet available for 2024

   Phoenix (v5):        Not yet available for 2024

   .. note:: All users should use the Phoenix (v6) library.  If you also need Phoenix v5 support, additionally install the v5 vendor library.

`Redux Robotics ReduxLib <https://docs.reduxrobotics.com/reduxlib.html>`__ - Library for all Redux devices including the Canandcoder
   Not yet available for 2024

`Playing With Fusion Driver <https://www.playingwithfusion.com/docview.php?docid=1205>`__ - Library for all PWF devices including the Venom motor/controller
   Not yet available for 2024

`Kauai Labs <https://pdocs.kauailabs.com/navx-mxp/software/roborio-libraries/>`__ - Libraries for NavX-MXP, NavX-Micro, and Sensor Fusion
   ``https://dev.studica.com/releases/2024/NavX.json``

`REV Robotics REVLib <https://docs.revrobotics.com/brushless/spark-flex/revlib>`__ - Library for all REV devices including SPARK Flex, SPARK MAX, and Color Sensor V3
   ``https://software-metadata.revrobotics.com/REVLib-2024.json``

Community Libraries
^^^^^^^^^^^^^^^^^^^

`PhotonVision <https://docs.photonvision.org/en/latest/docs/programming/photonlib/adding-vendordep.html>`_ - Library for PhotonVision CV software
   ``https://maven.photonvision.org/repository/internal/org/photonvision/photonlib-json/1.0/photonlib-json-1.0.json``

`PathPlanner <https://pathplanner.dev/home.html>`_ - Library for PathPlanner
   ``https://3015rangerrobotics.github.io/pathplannerlib/PathplannerLib.json``

`ChoreoLib <https://sleipnirgroup.github.io/Choreo/choreolib/installation/>`_ - Library for reading and following trajectories generated by `Choreo <https://sleipnirgroup.github.io/Choreo/>`_
   ``https://sleipnirgroup.github.io/ChoreoLib/dep/ChoreoLib.json``

