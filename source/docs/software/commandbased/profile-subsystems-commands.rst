Motion Profiling in Command-based
================================================================================

.. note:: For a description of the WPILib motion profiling features used by these command-based wrappers, see :ref:`docs/software/advanced-controls/controllers/trapezoidal-profiles:Trapezoidal Motion Profiles in WPILib`.

.. note:: The ``TrapezoidProfile`` class, used on its own, is most useful when composed with external controllers, such as a "smart" motor controller with a built-in PID functionality.  For combining trapezoidal motion profiling with WPILib's ``PIDController``, see :doc:`profilepid-subsystems-commands`.

When controlling a mechanism, is often desirable to move it smoothly between two positions, rather than to abruptly change its setpoint.  This is called "motion-profiling," and is supported in WPILib through the ``TrapezoidProfile`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/math/trajectory/TrapezoidProfile.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_trapezoid_profile.html)).

.. note:: In C++, the ``TrapezoidProfile`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

The following examples are taken from the DriveDistanceOffboard example project ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/drivedistanceoffboard), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard)):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/drivedistanceoffboard/subsystems/DriveSubsystem.java
         :language: java
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard/include/subsystems/DriveSubsystem.h
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard/cpp/subsystems/DriveSubsystem.cpp
         :language: c++
         :lines: 5-
         :lineno-match:

There are two commands in this example. They function very similarly, with the main difference being that one resets encoders, and the other doesn't, which allows encoder data to be preserved.

The subsystem contains a ``TrapezoidProfile`` with a ``Timer``.  The timer is used along with a ``kDt`` constant of 0.02 seconds to calculate the current and next states from the ``TrapezoidProfile``.  The current state is fed to the "smart" motor controller for PID control, while the current and next state are used to calculate feedforward outputs.  Both commands end when ``isFinished(0)`` returns true, which means that the profile has reached the goal state.
