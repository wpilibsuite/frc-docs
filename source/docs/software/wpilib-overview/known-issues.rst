Known Issues
============

This article details known issues (and workarounds) for FRC Control System Software.

Open Issues
-----------

macOS Simulation fails to launch in Visual Studio Code
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The first time launching simulation in VS Code on macOS using the ``WPILib: Simulate Robot Code on Desktop`` task will fail with a warning similar to the one below.

.. code-block:: console

    java.io.IOException: wpiHaljni could not be loaded from path or an embedded resource.
        attempted to load for platform /osx/x86-64/
        at edu.wpi.first.wpiutil.RuntimeLoader.loadLibrary(RuntimeLoader.java:78)
        at edu.wpi.first.hal.JNIWrapper.<clinit>(JNIWrapper.java:38)
        at edu.wpi.first.wpilibj.RobotBase.startRobot(RobotBase.java:316)
        at frc.robot.Main.main(Main.java:27)

This is a bug in VS Code being tracked by WPILib in `vscode-wpilib#334 <https://github.com/wpilibsuite/vscode-wpilib/issues/334>`__.

**Workaround:** Attempt to launch the simulation once using the ``WPILib: Simulate Robot Code on Desktop`` task and let the task fail. Without closing the console that opens at the bottom of the VS Code window, launch the simulator again using the ``WPILib: Simulate Robot Code on Desktop`` task. The second time the simulator will launch properly.

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

Fixed in 2020.2.2
-----------------

Java predefined colors are all zero
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The predefined (static) colors from the WPILib Color class have all zero red, green, blue values.

This issue is being tracked by WPILib in `allwpilib#2269 <https://github.com/wpilibsuite/allwpilib/pull/2269>`__.

C++ Command Based JoystickButton and POVButton not functioning
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

C++ JoystickButton and POVButton are both non functioning.

This issue is being tracked by WPILib in `allwpilib#2259 <https://github.com/wpilibsuite/allwpilib/pull/2259>`__.

**Workaround**: Use a Button object directly instead of using JoystickButton or POVButton.

.. code-block:: cpp

    frc2::Button button{[&] { return m_joy.GetRawButton(1); }};

RobotBuilder extensions use the frc namespace (C++)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When using RobotBuilder to create a C++ robot program, extensions will generate code prepended with the ``frc::`` namespace which will not compile.

**Workaround**: After generating C++ robot code with RobotBuilder, where appropriate, replace ``frc::`` with the correct namespace for that device.

This issue is being tracked by WPILib in `RobotBuilder#194 <https://github.com/wpilibsuite/RobotBuilder/issues/194>`__.

Fixed in 2020.1.2
-----------------

WPILib Projects created with 2020.1.1 have a project version of Beta2020-2
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Any projects created have a project version of `Beta2020-2` set in wpilib_preferences.json. This is not an issue, everything will still work properly. This will be fixed and update your projects in the 2nd release.

PathWeaver "Build Paths" Doesn't Work
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The "Build Paths" button in PathWeaver currently doesn't work due to HAL usage reporting in the kinematics classes. This will be resolved in the 2nd release. See `this page <https://github.com/wpilibsuite/PathWeaver/issues/157>`_ for more info on this error.
