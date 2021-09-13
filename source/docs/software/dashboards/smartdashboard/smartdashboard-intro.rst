.. include:: <isonum.txt>

SmartDashboard Introduction
===========================

.. image:: images/smartdashboard-intro/smartdashboard-example.png
   :alt: An example of what the SmartDashboard UI can look like.

The SmartDashboard is a Java program that will display robot data in real time. The SmartDashboard helps you with these things:

- Displays robot data of your choice while the program is running. It can be displayed as simple text fields or more elaborately in many other display types like graphs, dials, etc.
- Displays the state of the robot program such as the currently executing commands and the status of any subsystems
- Displays buttons that you can press to cause variables to be set on your robot
- Allows you to choose startup options on the dashboard that can be read by the robot program

The displayed data is automatically formatted in real-time as the data is sent from the robot, but you can change the format or the display widget types and then save the new screen layouts to be used again later. And with all these options, it is still extremely simple to use. To display some data on the dashboard, simply call one of the SmartDashboard methods with the data and its name and the value will automatically appear on the dashboard screen.

Installing the SmartDashboard
-----------------------------

.. image:: images/smartdashboard-intro/smartdashboard-driverstation.png
   :alt: Using the 3rd tab of the Driver Station to select SmartDashboard from the Dashboard Type dropdown so that it will be launched.

The SmartDashboard is packaged with the WPILib Installer and can be launched directly from the Driver Station by selecting the **SmartDashboard** button on the Setup tab.

Configuring the Team Number
---------------------------

.. image:: images/smartdashboard-intro/smartdashboard-teamnumber.png
   :alt: Checking the "Team Number" property in the Preferences dialog box.

The first time you launch the SmartDashboard you should be prompted for your team number. To change the team number after this: click **File > Preferences** to open the Preferences dialog. Double-click the box to the right of **Team Number** and enter your FRC\ |reg| Team Number, then click outside the box to save.

.. note:: SmartDashboard will take a moment to configure itself for the team number, do not be alarmed.

Setting a Custom NetworkTables Server Location
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

By default, SmartDashboard will look for NetworkTables instances running on a connected RoboRIO, but it's sometimes useful to look for NetworkTables at a different IP address. To connect to SmartDashboard from a host other than the roboRIO, open SmartDashboard preferences under the ``File`` menu and in the ``Team Number`` field, enter the IP address or hostname of the NetworkTables host.

This option is incredibly useful for using SmartDashboard with :doc:`WPILib simulation </docs/software/wpilib-tools/robot-simulation/introduction>`. Simply add ``localhost`` to the ``Team Number`` field and SmartDashboard will detect your locally-hosted robot!

.. image:: images/smartdashboard-intro/smartdashboard-networktables.png
   :alt: Using localhost to connect to a robot simulation.

Locating the Save File
----------------------

.. image:: images/smartdashboard-intro/smartdashboard-save.png
   :alt: In Preferences the "Save File" key shows the location of the save file.

Users may wish to customize the save location of the SmartDashboard. To do this click the box next to **Save File** then browse to the folder where you would like to save the configuration. Files saved in the installation directories for the WPILib components will likely be overwritten on updates to the tools.

Adding a Connection Indicator
-----------------------------

.. image:: images/smartdashboard-intro/smartdashboard-connection.png
   :alt: Select View->Add...->Connection Indicator to show when SmartDashboard is connected.

It is often helpful to see if the SmartDashboard is connected to the robot. To add a connection indicator, select **View > Add > Connection Indicator**. This indicator will be red when disconnected and green when connected. To move or resize this indicator, select **View > Editable** to toggle the SmartDashboard into editable mode, then drag the center of the indicator to move it or the edges to resize. Select the **Editable** item again to lock it in place.

Adding Widgets to the SmartDashboard
------------------------------------

Widgets are automatically added to the SmartDashboard for each "key" sent by the robot code. For instructions on adding robot code to write to the SmartDashboard see :doc:`Displaying Expressions from Within the Robot Program <displaying-expressions>`.
