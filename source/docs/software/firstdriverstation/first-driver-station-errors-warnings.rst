# Driver Station Errors/Warnings

In an effort to provide both Teams and Volunteers (:term:`FTA` / :term:`CSA` / etc.) more information to use when diagnosing robot problems, a number of Warning and Error messages have been added to the FIRST Driver Station. These messages are displayed in the DS logs tab when they occur and are also included in the DS Log Files that can be viewed with the AdvantageScope web app (see :ref:`docs/software/firstdriverstation/first-driver-station-log-viewer:Driver Station Log File Viewer` for more information). This document discusses the messages produced by the DS (messages produced by WPILib can also appear in this box and logs).

## Joystick Unplugged

```text
Warning at org.wpilib.driverstation.internal.DriverStationBackend.reportJoystickWarning(DriverStationBackend.java:1835): Joystick on port 0 not available, check if controller is plugged in
Warning Joystick on port 0 not available, check if controller is plugged in
```

This error is triggered when a Joystick is used in code, but not detected by the DS.

## Ping Status

```text
Ping Result: Robot Radio (.1): Bad, Robot (.2): Bad, Field AP (.4): Bad, FMS:Bad, Robot WiFi: Bad
```

A Ping Status warning is generated each time the Ping Status to a device changes while the DS is not in communication with the Robot Controller. As communications is being established when the DS starts up, a few of these warnings will appear as the Ethernet link comes up, then the connection to the robot radio, then the Systemcore (with :term:`FMS` mixed in if applicable). If communications are later lost, the ping status change may help identify at which component the communication chain broke.

.. todo:: Add more errors/warnings when the DS docs are more fleshed out.
