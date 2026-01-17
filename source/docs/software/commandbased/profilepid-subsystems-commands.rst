.. include:: <isonum.txt>

# Combining Motion Profiling and PID in Command-Based

.. note:: For a description of the WPILib PID control features used by these command-based wrappers, see :ref:`docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib`.

A common FRC\ |reg| controls solution is to pair a trapezoidal motion profile for setpoint generation with a PID controller for setpoint tracking.  To facilitate this, WPILib includes its own :ref:`ProfiledPIDController <docs/software/advanced-controls/controllers/profiled-pidcontroller:Combining Motion Profiling and PID Control with ProfiledPIDController>` class.  The following example is from the RapidReactCommandBot example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot>`__) and shows how ``ProfiledPIDController`` can be used within the command-based framework to turn a drivetrain to a specified angle:

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Drive.java
         :language: java
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/include/subsystems/Drive.h
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/cpp/subsystems/Drive.cpp
         :language: c++
         :lines: 5-
         :lineno-match:

``turnToAngleCommand`` uses a ProfiledPIDController to smoothly turn the drivetrain. The ``startRun`` command factory is used to reset the ``ProfiledPIDController`` when the command is scheduled to avoid unwanted behavior, and to calculate PID and feedforward outputs to pass into the ``arcadeDrive`` method in order to drive the robot. The command is decorated using the ``until`` decorator to end the command when the ProfiledPIDController is finished with the profile. To ensure the drivetrain stops when the command ends, the ``finallyDo`` decorator is used to stop the drivetrain by setting the speed to zero.
