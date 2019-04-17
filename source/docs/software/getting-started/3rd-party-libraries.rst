3rd Party Libraries
===================

A number of software components were broken out of WPILib starting in
2017 and are now maintained by the third parties who produce the
hardware. See this blog for more details.

Libraries
---------

.. warning:: Note: These are not links to directly plug in to the VS Code -> Install New Libraries (online) feature. Click\
 these links to visit the vendor site to see whether they offer online installers, offline installers, or both. \
 
 Most vendors have not yet published final releases for 2019, keep an eye on the vendor pages for 2019 software releases.

`Analog Devices ADIS16448
IMU <https://github.com/juchong/ADIS16448-RoboRIO-Driver>`__ - Driver
for ADIS16448 IMU. More info on https://wiki.analog.com/first

`Analog Devices ADIS16470
IMU <https://github.com/juchong/ADIS16470-RoboRIO-Driver>`__ - Driver
for ADIS16470 IMU. More info on https://wiki.analog.com/first

`CTRE Phoenix
Toolsuite <http://www.ctr-electronics.com/control-system/hro.html#product_tabs_technical_resources>`__
- Contains TalonSRX/Victor SPX Libraries and Phoenix Tuner program for
configuring CTRE CAN devices

`Digilent <https://reference.digilentinc.com/dmc-60c/getting-started>`__
- DMC-60C library

`Kauai
Labs <https://pdocs.kauailabs.com/navx-mxp/software/roborio-libraries/>`__
- Libraries for NavX-MXP, NavX-Micro, and Sensor Fusion

`Mindsensors
Libraries <http://www.mindsensors.com/blog/how-to/how-to-use-sd540c-and-canlight-with-roborio>`__
- Contains libraries for SD540C and CANLight

`Rev Robotics <http://www.revrobotics.com/sparkmax-software/>`__ - SPARK
MAX Library

`Scanse Sweep <https://github.com/PeterJohnson/sweep-sdk/releases>`__ -
C/Java Libraries for Scansense Sweep LIDAR (packaged by
Peter Johnson)

The Mechanism
-------------

In support of this effort NI (for LabVIEW) and FIRST/WPI (for C++/Java)
have developed mechanisms that should make it easy for vendors to plug
their code into the WPILib software and for teams to use that code once
it has been installed. A brief description of how the system works for
each language can be found below.

The Mechanism - LabVIEW
~~~~~~~~~~~~~~~~~~~~~~~

For LabVIEW teams, you may notice a few new Third Party items on various
paletes (specifically, one in Actuators, one in Actuators->Motor Control
labeled “CAN Motor”, and one in “Sensors”). These correspond to folders
in
``Program Files/National Instruments/LabVIEW 2016/vi.lib/Rock Robotics/WPI/Third Party``.
For a library to insert VI’s in these palettes, they simply make a
subfolder in one of these three Third Party folders containing their VIs
and they will be added automatically. To control the appearance of the
palette (have some VI’s not show up, set the Icon for the folder, etc.)
there is a process to create a dir.mnu file for your directory. We will
be working on documenting that process shortly.

To use installed Third Party libraries, simply locate the VIs in one of
these 3 locations and drag them into your project as you would with any
other VI.

The Mechanism - C++/Java
~~~~~~~~~~~~~~~~~~~~~~~~

For C++ and Java a JSON file describing the vendor library is installed
on your system to ``~home/frcYYYY/vendordeps`` (~home = C:/Users/Public
on Windows). This can either be done by an offline installer or the file
can be fetched from an online location using the menu item in VSCode.
This file is then used from VS Code to add to the library to each
individual project. Vendor library information is managed on a
per-project basis to make sure that a project is always pointing to a
consistent version of a given vendor library. The libraries themselves
are placed in the Maven cache at ``C:/Users/Public/frcYYYY/maven``.
Vendors can place a local copy here with an offline installer
(recommended) or require users to be online for an initial build to
fetch the library from a remote Maven location.

The JSON file allows specification of complex libraries with multiple
components (C++, Java, JNI, etc.) and also helps handle some
complexities related to simulation. Vendors choosing to provide a remote
URL in the JSON also enable users to check for updates from within VS
Code.

.. note:: Note: The vendor JSON files are actually processed by GradleRIO once\
 they are in your projects vendordeps folder. If you are using another\
 IDE, you will need to manually create a “vendordeps” folder in your\
 project and copy any desired vendor JSON files from the “frcYYYY” folder\
 (where they should be placed by an offline installer) or download them\
 directly from the vendor and place them into the folder in the
 project.**

Adding an offline-installed Library
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

|image0|

To add a vendor library that has been installed by an offline installer,
press **Ctrl+Shift+P** and type WPILib or click on the WPILib icon in
the top right to open the WPILib Command Palette and begin typing
**Manage Vendor Libraries**, then select it from the menu. Select the
option to **Install new libraries (offline)**.

|image1|

Select the desired libraries to add to the project by checking the box
next to each, then click OK. The JSON file will be copied to the
**vendordeps** folder in the project, adding the libary as a dependency
to the project.

Checking for Updates (offline)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Remember: Dependencies are now version managed and done on a per-project
bases. Even if you have installed an updated library using an offline
installer, you will need to Manage Vendor Libraries and select **Check
for updates (offline)** for each project you wish to update.

Checking for Updates (online)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Part of the JSON file that vendors may optionally populate is an online
update location. If a library has an appropriate location specified,
running **Check for updates (online)** will check if a newer version of
the library is available from the remote location.

Removing a library dependency
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To remove a library dependency from a project, select **Manage Current
Libraries** from the **Manage Vendor Libraries** menu, check the box for
any libraries to uninstall and click OK. These libraries will be removed
as dependencies from the project.

.. |image0| image:: images/3rd-party-libraries/adding-offline-library.png
.. |image1| image:: images/3rd-party-libraries/library-installer-steptwo.png

