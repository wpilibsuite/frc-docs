Gathering Debug Information
===========================

During the cycle of troubleshooting, a key step is to gather data. A large amount of the behavior of a robot's control system is *hidden* from view, and requires special tools to observe. While not exhaustive, the following is a list of common tools that robot software developers should be familiar with.

Driver Station
--------------

The National Instruments DriverStation is the first place to check when robot does not behave as expected.

Key Indicators
^^^^^^^^^^^^^^

TODO

Timeseries Logs
^^^^^^^^^^^^^^^

TODO

rioLog
------

rioLog is a utility built into the WPILib suite and vsCode. It allows you to remotely view all of the `stdout` and `stderr` messages from your robot program. This includes all warnings, error messages, and print statements that your robot program generates. You can write your own software to generate these messages, as well as read the messages produced by WPILib or a 3rd party.

It is also mirrored into the console of the DriverStation.

Command Line Utilities
----------------------

The Windows command prompt has a number of useful tools for troubleshooting.

The Windows command prompt may be accessed from the start menu. It is named `cmd.exe`. The commands we describe here should be typed into the command prompt.

Using `ping`
^^^^^^^^^^^^

`ping` is a utility built into Windows which allows for a basic network connection check between two points. It confirms basic functionality of both the physical layer (wiring or wireless), and a small portion of software. 

It can be invoked by typing `ping`, followed by a space, followed by the IP address to be checked, followed by Enter. For example, checking the IP address `10.12.34.1`:

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

This shows four test "pings" being sent, and the device with IP address `10.12.34.1` responding with a "Yup, I hear ya!" message within three milliseconds. 

If None of the pings are responded to, it would likely indicate some total failure which prevents communication - perhaps a cable is unplugged, or the device is turned off, or doesn't have the expected IP address.

If only some of the packets come back, it would indicate a partial failure preventing some communication. Perhaps a cable is loose, the wifi network is being rate limited or interfered with.

Using `ipconfig`
^^^^^^^^^^^^^^^^

`ipconfig` is a utility built into Windows which summarizes the configuration of the network interfaces on the device. It can help confirm your computer is actually attached to a robot network, and should be capable of communicating with robot components.

It is invoked simply by typing `ipconfig` and hitting Enter.

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

Here is another example with the wifi network properly connected to a robot:

.. code-block:: console

    C:\Users\YOUR_USER>ipconfig

    TODO

Manufacturer-Specific Interfaces
--------------------------------

REV Robotics, Cross the Road Electronics, and Playing with Fusion all supply additional utilities for configuring and troubleshooting their hardware. 


