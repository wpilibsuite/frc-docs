Driver Station Errors/Warnings
==============================

In an effort to provide both Teams and Volunteers (FTAs/CSAs/etc.) more information to use when diagnosing robot problems, a number of Warning and Error messages have been added to the Driver Station. These messages are displayed in the DS diagnostics tab when they occur and are also included in the DS Log Files that can be viewed with the Log File Viewer. This document discusses the messages produced by the DS (messages produced by WPILib can also appear in this box and the DS Logs).

Joystick Unplugged
------------------

.. code-block::

  ERROR<Code>-44009 occurred at Driver Station
  <time>2/5/2013 4:43:54 PM <unique#>1
  FRC: A joystick was disconnected while the robot was enabled.

This error is triggered when a Joystick is unplugged. Contrary to the message text this error will be printed even if the robot is not enabled, or even connected to the DS. You will see a single instance of this message occur each time the Driver Station is started, even if Joysticks are properly connected and functioning.

Lost Communication
------------------

.. code-block::

  Warning<Code>44004 occurred at Driver Station
  <time>2/6/2013 11:07:53 AM<unique#>2
  FRC: The Driver Station has lost communication with the robot.

This Warning message is printed whenever the Driver Station loses communication with the robot (Communications indicator changing from green to red). A single instance of this message is printed when the DS starts up, before communication is established.

Ping Status
-----------

.. code-block::

  Warning<Code>44002 occurred at Ping Results: link-GOOD, DS radio(.4)-bad, robot radio(.1)-GOOD, cRIO(.2)-bad, FMS- bad Driver Station
  <time>2/6/2013 11:07:59 AM<unique#>5
  FRC: Driver Station ping status has changed.

A Ping Status warning is generated each time the Ping Status to a device changes while the DS is not in communication with the roboRIO. As communications is being established when the DS starts up, a few of these warnings will appear as the Ethernet link comes up, then the connection to the robot radio, then the roboRIO (with FMS mixed in if applicable). If communications are later lost, the ping status change may help identify at which component the communication chain broke.

Time Since Robot Boot
---------------------

.. code-block::

  WARNING<Code>44007 occurred at FRC_NetworkCommunications
  **<secondsSinceReboot> 3.585**
  FRC: Time since robot boot.

This message is printed each time the DS begins communicating with the roboRIO. The message indicates the up-time, in seconds, of the roboRIO and can be used to determine if a loss of communication was due to a roboRIO Reboot.

Radio Detection Times
---------------------

.. code-block::

  WARNING<Code>44008 occurred at FRC_NetworkCommunications
  <radioLostEvents> 19.004<radioSeenEvents> 0.000
  FRC: Robot radio dectection times

  WARNING<Code>44008 occurred at FRC_NetworkCommunications
  <radioLostEvents> 2.501,422.008<radioSeenEvents> 0.000,147.005
  FRC: Robot radio dectection times.

This message may be printed when the DS begins communicating with the roboRIO and indicates the time, in seconds, since the last time the radio was lost and seen. In the first example image above the message indicates that the roboRIO's connection to the radio was lost 19 seconds before the message was printed and the radio was seen again right when the message was printed. If multiple radioLost or radioSeen events have occurred since the roboRIO booted, up to 2 events of each type will be included, separated by commas.

No Robot Code
-------------

.. code-block::

  Warning<Code>44003 occurred at Driver Station
  <time>2/8/2013 9:50:13 AM<unique#>8
  FRC: No robot code is currently running.

This message is printed when the DS begins communicating with the roboRIO, but detects no robot code running. A single instance of this message will be printed if the Driver Station is open and running while the roboRIO is booting as the DS will begin communication with the roboRIO before the robot code finishes loading.
