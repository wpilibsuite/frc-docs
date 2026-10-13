.. include:: <isonum.txt>

# Driver Station Log File Viewer

In an effort to provide information to aid in debugging, the FIRST Driver Station creates log files of important diagnostic data while running. These logs are saved as files with extension ``.wpilog`` and they can be reviewed later using AdvantageScope. You can launch AdvantageScope by navigating to ``http://localhost:6768/ascope`` or clicking the :guilabel:`Open Log Viewer` button in the settings tab (see below).

.. image:: images/driver-station-log-viewer/logging.png
   :alt: Showing how to launch the Log Viewer Webpage using the settings tab and view the log output from the logging tab on the right hand side.

## Event Logs

The  Driver Station logs all messages sent to the Logs tab into a new Log file. Log files are stored in the ``~/.firstds`` on unix platforms or ``Public Documents/FIRSTDriverStation/Logs`` on Windows. Each log has FIRST_DS in the file name with extension ``.wpilog``.

.. image:: images/driver-station-log-viewer/first-ds-webpage.png
   :alt: Overview of FIRST Driver Station web server

There is also a DS web server at ``http://localhost:6768`` that can be used to access log files. There are a few different helpful links on the home page:

1. Log Files - allows you to see and download DS log files.
2. Log Viewer (AdvantageScope) - launches the AdvantageScope web server.
3. Override Files - upload, download, and edit DS override files.

## AdvantageScope UI

.. image:: images/driver-station-log-viewer/advantage-scope.png
   :alt: Overview of the home AdvantageScope screen.

The AdvantageScope contains a number of controls and displays to aid in the analysis of the Driver Station log files:

1.  Menus Bar - This is where you can learn about the AdvantageScope, upload or export files, create new tabs, etc.
2.  Sidebar - The sidebar lists the available tables and fields. You can also search for a field using the search box.
3.  Tab Bar - The tab bar allows you to switch between different views. The bookmark icon takes you to the documentation.
4.  Viewer Pane - This is where data is presented for each tab type.
5.  Control Pane - The control pane is where you select fields for visualization.

.. image:: images/driver-station-log-viewer/advantage-scope-open-logs.png
   :alt: Showing how to open a log file.

As shown above, you can open log files on AdvantageScope by clicking the file menu tab at the menu bar, and then clicking ``Open Log``. Alternatively, you can open logs by pressing :kbd:`Ctrl+O`.

.. note:: For more information about AdvantageScope, either navigate to the docs tab on AdvantageScope, or go to the docs page: :ref:`AdvantageScope <docs/software/dashboards/advantagescope:AdvantageScope>`

## Console fields

.. image:: images/driver-station-log-viewer/advantage-console.png
   :alt: Showing the location of Console info.

The Console fields offer information about errors, warnings, or robot program crashes:

- ConsoleLine - robot console output line with timestamp and sequence number.
- ErrorInfo - robot error or warning details with timestamps, sequence number, occurrence count, location, and call stack.
- ProgramCrashInfo - robot program crash details, location, call stack, and timestamp
