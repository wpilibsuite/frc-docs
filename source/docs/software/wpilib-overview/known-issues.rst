Known Issues
============

This article details known issues (and workarounds) for FRC Control System Software.

C++ Intellisense - Files Open on Launch Don't Work Properly
-----------------------------------------------------------

**Issue:** In C++, files open when VS Code launches will have issues with Intellisense showing suggestions from all options from a compilation unit and not just the appropriate ones. This is a bug in VS Code

**Workaround:** Close the files in VS Code, close VS Code, wait ~ 1 min, re-launch VS Code.

SmartDashboard and Simulation fail to launch on Windows N Editions
------------------------------------------------------------------

**Issue:** WPILib code using CSCore (dashboards and simulated robot code) will fail to launch on Education N editions of Windows.

**Solution:** Install the `Media Feature Pack <https://www.microsoft.com/en-us/software-download/mediafeaturepack>`__

NetworkTables Interoperability
------------------------------

There is currently an issue with inter-operating C++/Java Network Tables clients (dashboards or co-processors) with LabVIEW servers (LV robot code). In some scenarios users will see updates from one client fail to be replicated across to other clients (e.g. data from a co-processor will not be properly replicated out to a dashboard). Data still continues to return correctly when accessed by code on the server.

**Workaround**: Write code on the server to mirror any keys you wish to see on other clients (e.g. dashboards) to a separate key. For example, if you have a key named ``targetX`` being published by a co-processor that you want to show up on a dashboard, you could write code on the robot to read the key and re-write it to a key like ``targetXDash``.
