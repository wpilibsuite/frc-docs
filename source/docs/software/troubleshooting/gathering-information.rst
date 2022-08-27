Gathering Debug Information
===========================

During the cycle of troubleshooting, a key step is to gather data. A large amount of the behavior of a robot's control system is *hidden* from view, and requires special tools to observe. While not exhaustive, the following is a list of common tools that robot software developers should be familiar with.

Driver Station
--------------

The National Instruments DriverStation is the first place to check when robot does not behave as expected.

In particular, the :ref:`Diagnostics Tab <docs/software/driverstation/driver-station:Diagnostics Tab>` and :ref:`Messages Tab <docs/software/driverstation/driver-station:Messages Tab>` frequently contain the minimum info needed to start driving toward root cause on a problem.

Additionally, the :ref:`Log File Viewer <docs/software/driverstation/driver-station-log-viewer:Driver Station Log File Viewer` provides more-detailed timeseries graphs of key data values and message logs. 

rioLog
------

rioLog is a utility built into the WPILib suite and vsCode. It allows you to remotely view all of the :code:`stdout` and :code:`stderr` messages from your robot program. This includes all warnings, error messages, and print statements that your robot program generates. You can write your own software to generate these messages, as well as read the messages produced by WPILib or a 3rd party.

See :ref:`Riolog VS Code Plugin <docs/software/vscode-overview/viewing-console-output:Riolog VS Code Plugin>` for more info.

Command Line Utilities
----------------------

The Windows command prompt has a number of useful tools for troubleshooting.

The Windows command prompt may be accessed from the start menu. It is named :code:`cmd.exe`. The commands we describe here should be typed into the command prompt.

Using `ping`
^^^^^^^^^^^^

:code:`ping` is a utility built into Windows which allows for a basic network connection check between two points. It confirms basic functionality of both the physical layer (wiring or wireless), and a small portion of software. 

It can be invoked by typing :code:`ping`, followed by a space, followed by the IP address to be checked, followed by Enter. For example, checking the IP address :code:`10.12.34.1`:

.. code-block:: console

    C:\Users\YOUR_USER>ping 10.12.34.1

    Pinging 10.12.34.1 with 32 bytes of data:
    Reply from 10.12.34.1: bytes=32 time=3ms TTL=128
    Reply from 10.12.34.1: bytes=32 time=3ms TTL=128
    Reply from 10.12.34.1: bytes=32 time=3ms TTL=128
    Reply from 10.12.34.1: bytes=32 time=3ms TTL=128

    Ping statistics for 10.12.34.1:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 3ms, Maximum = 3ms, Average = 3ms

This shows four test "pings" being sent, and the device with IP address :code:`10.12.34.1` responding with a "Yup, I hear ya!" message within three milliseconds. 

If None of the pings are responded to, it would likely indicate some total failure which prevents communication - perhaps a cable is unplugged, or the device is turned off, or doesn't have the expected IP address.

If only some of the packets come back, it would indicate a partial failure preventing some communication. Perhaps a cable is loose, the wifi network is being rate limited or interfered with.

Using :code:`ipconfig`
^^^^^^^^^^^^^^^^^^^^^^

:code:`ipconfig` is a utility built into Windows which summarizes the configuration of the network interfaces on the device. It can help confirm your computer is actually attached to a robot network, and should be capable of communicating with robot components.

It is invoked simply by typing :code:`ipconfig` and hitting Enter.

Here is an example of running it on a computer with one wireless (wifi) network interface and one wired (ethernet) interface, but with neither connected.

.. code-block:: console

    C:\Users\YOUR_USER>ipconfig

    Windows IP Configuration


    Wireless LAN adapter Local Area Connection* 1:

    Media State . . . . . . . . . . . : Media disconnected
    Connection-specific DNS Suffix  . :

    Wireless LAN adapter Wi-Fi:

    Media State . . . . . . . . . . . : Media disconnected
    Connection-specific DNS Suffix  . :

Here is another example with the wifi network properly connected to team 1234's robot over wifi:

.. code-block:: console

    C:\Users\YOUR_USER>ipconfig
    
    Windows IP Configuration


    Wireless LAN adapter Wi-Fi:

        Connection-specific DNS Suffix  . : localdomain
        Link-local IPv6 Address . . . . . : fe80::890d:bbae:d81c:d416%7
        IPv4 Address. . . . . . . . . . . : 10.12.34.210
        Subnet Mask . . . . . . . . . . . : 255.255.255.0
        Default Gateway . . . . . . . . . : 10.12.34.1


Manufacturer-Specific Interfaces
--------------------------------

3rd party manufacturers support custom interfaces to help address problems that are specific to their hardware. These include:

 * `REV Robotics Hardware Client <https://docs.revrobotics.com/rev-hardware-client/>`__
 * `Cross the Road Electronics Pheonix Framework <https://docs.ctre-phoenix.com/en/stable/ch05_PrepWorkstation.html>`__
 * `Playing with Fusion's Web-Based Configuration <https://www.youtube.com/watch?v=LMuq73Vojw8&t=336s>`__

REV Robotics, Cross the Road Electronics, and Playing with Fusion all supply additional utilities for configuring and troubleshooting their hardware. 


