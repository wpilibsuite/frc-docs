Manually Setting the Driver Station to Start Dashboard
======================================================

.. note:: If WPILib is not installed to the default location (such as when files are copied to a PC manually), the dashboard of choice may not launch properly. To have the DS start a dashboard when it starts up, you have to manually modify the settings for the default dashboard.

.. warning:: This is not needed for most installations, try using the appropriate :ref:`Dashboard Type setting <docs/software/driverstation/driver-station:Setup Tab>` for your language first. Also, to use a dashboard without installing WPILib, Java 11 must be installed first.

Set Driver Station to Default
-----------------------------

.. image:: images/manually-setting-the-driver-station-to-start-smartdashboard/set-ds-to-default.png

Open the Driver Station software, click on the Setup tab and set the Dashboard setting to Default. **Then close the Driver Station!**

Locate Dashboard JAR file
-------------------------

Find the location of the dashboard ``jar`` file (SmartDashboard or Shuffleboard). It should be installed to ``C:\Users\USERNAME\wpilib\tools`` where ``USERNAME`` is the username of the user logged into the computer.

Open DS Data Storage file
-------------------------

.. image:: images/manually-setting-the-driver-station-to-start-smartdashboard/open-ds-data-storage-file.png

Browse to ``C:\Users\Public\Documents\FRC`` and double click on ``FRC DS Data Storage`` to open it.

DashboardCmdLine
----------------

.. image:: images/manually-setting-the-driver-station-to-start-smartdashboard/dashboard-cmd-line.png

Locate the line beginning with ``DashboardCmdLine``.

For SmartDashboard
^^^^^^^^^^^^^^^^^^

Replace the string after ``=`` with ``java -jar "C:\\Users\\USERNAME\\wpilib\\tools\\SmartDashboard.jar"`` where ``USERNAME`` is the username determined above. Save the file.

For Shuffleboard
^^^^^^^^^^^^^^^^

Replace the string after``=`` with ``java -jar "C:\\Users\\USERNAME\\wpilib\\tools\\Shuffleboard.jar"`` where ``USERNAME`` is the username determined above. Save the file.

Launch Driver Station
---------------------

The Driver Station should now launch the SmartDashboard or Shuffleboard each time it is opened.
