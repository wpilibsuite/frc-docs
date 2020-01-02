Known Issues
============

This article details known issues (and workarounds) for FRC Control System Software.

C++ Intellisense - Files Open on Launch Don't Work Properly
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Issue:** In C++, files open when VS Code launches will have issues with Intellisense showing suggestions from all options from a compilation unit and not just the appropriate ones. This is a bug in VS Code

**Workaround:** Close the files in VS Code, close VS Code, wait ~ 1 min, re-launch VS Code.

SmartDashboard and Simulation fail to launch on Windows N Editions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Issue:** WPILib code using CSCore (dashboards and simulated robot code) will fail to launch on Education N editions of Windows.

**Solution:** Install the `Media Feature Pack <https://www.microsoft.com/en-us/software-download/mediafeaturepack>`__

NetworkTables Interoperability
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There is currently an issue with inter-operating C++/Java Network Tables clients (dashboards or co-processors) with LabVIEW servers (LV robot code). In some scenarios users will see updates from one client fail to be replicated across to other clients (e.g. data from a co-processor will not be properly replicated out to a dashboard). Data still continues to return correctly when accessed by code on the server.

**Workaround**: Write code on the server to mirror any keys you wish to see on other clients (e.g. dashboards) to a separate key. For example, if you have a key named ``targetX`` being published by a co-processor that you want to show up on a dashboard, you could write code on the robot to read the key and re-write it to a key like ``targetXDash``.

Fixed in 2020.1.2
-----------------

WPILib Projects created with 2020.1.1 have a project version of Beta2020-2
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Any projects created have a project version of `Beta2020-2` set in wpilib_preferences.json. This is not an issue, everything will still work properly. This will be fixed and update your projects in the 2nd release.

PathWeaver "Build Paths" Doesn't Work
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The "Build Paths" button in PathWeaver currently doesn't work due to HAL usage reporting in the kinematics classes. This will be resolved in the 2nd release. See `this page <https://github.com/wpilibsuite/PathWeaver/issues/157>`_ for more info on this error.
