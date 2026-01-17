.. include:: <isonum.txt>

PID Control in Command-based
=================================================

.. note:: For a description of the WPILib PID control features used by these command-based wrappers, see :ref:`docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib`.

One of the most common control algorithms used in FRC\ |reg| is the :term:`PID` controller. WPILib offers its own :ref:`PIDController <docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib>` class to help teams implement this functionality on their robots. The following example is from the RapidReactCommandBot example project ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot)) and shows how PIDControllers can be used within the command-based framework:

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Shooter.java
         :language: java
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/include/subsystems/Shooter.h
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/cpp/subsystems/Shooter.cpp
         :language: c++
         :lines: 5-
         :lineno-match:

A ``PIDController`` is declared inside the ``Shooter`` subsystem. It is used by ``ShootCommand`` alongside a feedforward to spin the shooter flywheel to the specified velocity. Once the ``PIDController`` reaches the specified velocity, the ``ShootCommand`` runs the feeder.
