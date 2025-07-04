.. include:: <isonum.txt>

# Measuring Bandwidth Usage

On the FRC\ |reg| Field each team is allocated limited network bandwidth (see R704 in the 2025 manual). Some teams may wish to measure their overall bandwidth consumption. This document details how to make that measurement.

## Measuring Bandwidth Using the Performance Monitor (Win 7/10)

Windows contains a built-in tool called the Performance Monitor that can be used to monitor the bandwidth usage over a network interface.

### Launching the Performance Monitor

.. image:: images/measuring-bandwidth-usage/start-menu.png
   :alt: Using the start menu to type "perfmon.msc".

Open the Start menu and in the search box, type ``perfmon.msc`` and press Enter.

### Open Real-Time Monitor

.. image:: images/measuring-bandwidth-usage/performance-monitor.png
   :alt: Click "Performance Monitor" under "Monitoring Tools" in the tree view.

In the left pane, click :guilabel:`Performance Monitor` to display the real-time monitor.

### Add Network Counter

.. image:: images/measuring-bandwidth-usage/network-counter.png
   :alt: The "Add Counters" screen showinging the steps below.

#. Click the green plus near the top of the screen to add a counter
#. In the top left pane, locate and click on ``Network Interface`` to select it
#. In the bottom left pane, locate the desired network interface (or use All instances to monitor all interfaces)
#. Click :guilabel:`Add >>` to add the counter to the right pane.
#. Click :guilabel:`OK` to add the counters to the graph.

### Remove Extra Counters

.. image:: images/measuring-bandwidth-usage/extra-counters.png
   :alt: Removing the counter at the bottom of the graph screen.

In the bottom pane, select each counter other than ``Bytes Total/sec`` and press the :kbd:`Delete` key. The ``Bytes Total/sec`` entry should be the only entry remaining in the pane.

### Configure Data Properties

.. image:: images/measuring-bandwidth-usage/data-properties.png
   :alt: Scale dropdown highlighted on the Performance Monitor Properties page.

Press :kbd:`Ctrl+Q` to bring up the Properties window. Click on the dropdown next to ``Scale`` and select ``1.0``. Then click on the :guilabel:`Graph` tab.

### Configure Graph Properties

.. image:: images/measuring-bandwidth-usage/graph-properties.png
   :alt: Moving to the Graph tab the Maximum field under Vertical Scale is highlighted.

In the ``Maximum Box`` under ``Vertical Scale`` enter 524288 (this is 4 Megabits converted to Bytes). If desired, turn on the horizontal grid by checking the box. Then click :guilabel:`OK` to close the dialog.

### Viewing Bandwidth Usage

.. image:: images/measuring-bandwidth-usage/graph.png
   :alt: Observing the bandwidth usage on the chart screen.

You may now connect to your robot as normal over the selected interface (if you haven't done so already). The graph will show the total bandwidth usage of the connection, with the bandwidth cap at the top of the graph.  he Last, Average, Min, and Max values are also displayed at the bottom of the graph. Note that these values are in Bytes/Second meaning the cap is 524,288. With just the Driver Station open you should see a flat line at ~100000 Bytes/Second.

## Measuring Bandwidth Usage using Wireshark

If you cannot use Performance Monitor, you will need to install a 3rd party program to monitor bandwidth usage. One program that can be used for this purpose is Wireshark. Download and install the latest version of Wireshark for your version of Windows from [this page](https://www.wireshark.org/download.html). After installation is complete, locate and open Wireshark. Connect your computer to your robot, open the Driver Station and any Dashboard or custom programs you may be using.

### Select the interface and Start capture

.. image:: images/measuring-bandwidth-usage/start-capture.png
   :alt: Selecting the Start button and choosing the NIC in Wireshark.

In the Wireshark program on the left side, double click the interface you are using to connect to the robot.

### Open Capture File Properties

.. image:: images/measuring-bandwidth-usage/capture-file-properties.png
   :alt: In the menu bar at the top choosing "Statistics" then "Capture File Properties"

Let the capture run for at least 1 minute, then click :guilabel:`Statistics` then :guilabel:`Capture File Properties`.

### View Bandwidth Usage

.. image:: images/measuring-bandwidth-usage/view-usage.png
   :alt: Looking at the "Average bits/sec" field of the Wireshark summary.

Average bandwidth usage, in bits/second is displayed near the bottom of the window.
