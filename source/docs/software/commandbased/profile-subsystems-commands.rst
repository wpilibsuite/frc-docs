Motion Profiling through TrapezoidProfileCommands
================================================================================

.. note:: For a description of the WPILib motion profiling features used by these command-based wrappers, see :ref:`docs/software/advanced-controls/controllers/trapezoidal-profiles:Trapezoidal Motion Profiles in WPILib`.

.. note:: The ``TrapezoidProfile`` command wrappers are generally intended for composition with custom or external controllers.  For combining trapezoidal motion profiling with WPILib's ``PIDController``, see :doc:`profilepid-subsystems-commands`.

When controlling a mechanism, is often desirable to move it smoothly between two positions, rather than to abruptly change its setpoint.  This is called "motion-profiling," and is supported in WPILib through the ``TrapezoidProfile`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/math/trajectory/TrapezoidProfile.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_trapezoid_profile.html>`__).

To further help teams integrate motion profiling into their command-based robot projects, WPILib includes a convenience wrapper for the ``TrapezoidProfile`` class: ``TrapezoidProfileCommand``, which executes a single user-provided ``TrapezoidProfile``.

TrapezoidProfileCommand
-----------------------

.. note:: In C++, the ``TrapezoidProfileCommand`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

The ``TrapezoidProfileCommand`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/TrapezoidProfileCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_trapezoid_profile_command.html>`__) allows users to create a command that will execute a single ``TrapezoidProfile``, passing its current state at each iteration to a user-defined function.

Creating a TrapezoidProfileCommand
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A ``TrapezoidProfileCommand`` can be created two ways - by subclassing the ``TrapezoidProfileCommand`` class, or by defining the command :ref:`inline <docs/software/commandbased/organizing-command-based:Inline Commands>`.  Both methods are ultimately extremely similar, and ultimately the choice of which to use comes down to where the user desires that the relevant code be located.

.. note:: If subclassing ``TrapezoidProfileCommand`` and overriding any methods, make sure to call the ``super`` version of those methods! Otherwise, motion profiling functionality will not work properly.

In either case, a ``TrapezoidProfileCommand`` is created by passing the necessary parameters to its constructor (if defining a subclass, this can be done with a `super()` call):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/TrapezoidProfileCommand.java
         :language: java
         :lines: 28-43
         :linenos:
         :lineno-start: 28

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibNewCommands/src/main/native/include/frc2/command/TrapezoidProfileCommand.h
         :language: c++
         :lines: 35-49
         :linenos:
         :lineno-start: 35

profile
~~~~~~~

The ``profile`` parameter is the ``TrapezoidProfile`` object that will be executed by the command.  By passing this in, users specify the motion constraints of the profile that the command will use.

output
~~~~~~

The ``output`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that consumes the output and setpoint of the control loop.

goal
~~~~

The ``goal`` parameter is a function that supplies the desired state of the motion profile. This can be used to change the goal at runtime if desired.

currentState
~~~~~~~~~~~~

The ``currentState`` parameter is a function that supplies the starting state of the motion profile. Combined with ``goal``, this can be used to dynamically generate and follow any motion profile at runtime.

requirements
~~~~~~~~~~~~

Like all inlineable commands, ``TrapezoidProfileCommand`` allows the user to specify its subsystem requirements as a constructor parameter.

Full TrapezoidProfileCommand Example
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

What does a ``TrapezoidProfileCommand`` look like when used in practice?  The following examples are taking from the DriveDistanceOffboard example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/drivedistanceoffboard>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard>`__):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/drivedistanceoffboard/commands/DriveDistanceProfiled.java
         :language: java
         :lines: 5-
         :linenos:
         :lineno-start: 5

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard/include/commands/DriveDistanceProfiled.h
         :language: c++
         :lines: 5-
         :linenos:
         :lineno-start: 5

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard/cpp/commands/DriveDistanceProfiled.cpp
         :language: c++
         :lines: 5-
         :linenos:
         :lineno-start: 5

And, for an :ref:`inlined <docs/software/commandbased/organizing-command-based:Inline Commands>` example:

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/drivedistanceoffboard/RobotContainer.java
         :language: java
         :lines: 66-85
         :linenos:
         :lineno-start: 66

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard/cpp/RobotContainer.cpp
         :language: c++
         :lines: 37-60
         :linenos:
         :lineno-start: 37
