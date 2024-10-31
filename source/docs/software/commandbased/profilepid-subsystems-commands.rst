.. include:: <isonum.txt>

# Combining Motion Profiling and PID in Command-Based

.. note:: For a description of the WPILib PID control features used by these command-based wrappers, see :ref:`docs/software/controls/controllers/pidcontroller:PID Control in WPILib`.

A common FRC\ |reg| controls solution is to pair a trapezoidal motion profile for setpoint generation with a PID controller for setpoint tracking.  To facilitate this, WPILib includes its own :ref:`ProfiledPIDController <docs/software/controls/controllers/profiled-pidcontroller:Combining Motion Profiling and PID Control with ProfiledPIDController>` class.  To further aid teams in integrating this functionality into their robots, the command-based framework contains a convenience wrapper for the ``ProfiledPIDController`` class: ``ProfiledPIDCommand``, which integrates the controller into a command.

## ProfiledPIDCommand

.. note:: In C++, the ``ProfiledPIDCommand`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

The ``ProfiledPIDCommand`` class ([Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/ProfiledPIDCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc2_1_1_profiled_p_i_d_command.html)) allows users to easily create commands with a built-in ProfiledPIDController.

### Creating a PIDCommand

A ``ProfiledPIDCommand`` can be created two ways - by subclassing the ``ProfiledPIDCommand`` class, or by defining the command :ref:`inline <docs/software/commandbased/organizing-command-based:Inline Commands>`.  Both methods ultimately extremely similar, and ultimately the choice of which to use comes down to where the user desires that the relevant code be located.

.. note:: If subclassing ``ProfiledPIDCommand`` and overriding any methods, make sure to call the ``super`` version of those methods! Otherwise, control functionality will not work properly.

In either case, a ``ProfiledPIDCommand`` is created by passing the necessary parameters to its constructor (if defining a subclass, this can be done with a `super()` call):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/ProfiledPIDCommand.java
         :language: java
         :lines: 29-44
         :linenos:
         :lineno-start: 29

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibNewCommands/src/main/native/include/frc2/command/ProfiledPIDCommand.h
         :language: c++
         :lines: 38-52
         :linenos:
         :lineno-start: 38

#### controller

The ``controller`` parameter is the ``ProfiledPIDController`` object that will be used by the command.  By passing this in, users can specify the PID gains, the motion profile constraints, and the period for the controller (if the user is using a nonstandard main robot loop period).

When subclassing ``ProfiledPIDCommand``, additional modifications (e.g. enabling continuous input) can be made to the controller in the constructor body by calling ``getController()``.

#### measurementSource

The ``measurementSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that returns the measurement of the process variable.

When subclassing ``ProfiledPIDCommand``, advanced users may further modify the measurement supplier by modifying the class's ``m_measurement`` field.

#### goalSource

The ``goalSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that returns the current goal state for the mechanism.  If only a constant goal is needed, an overload exists that takes a constant goal rather than a supplier.  Additionally, if goal velocities are desired to be zero, overloads exist that take a constant distance rather than a full profile state.

When subclassing ``ProfiledPIDCommand``, advanced users may further modify the setpoint supplier by modifying the class's ``m_goal`` field.

#### useOutput

The ``useOutput`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that consumes the output and setpoint state of the control loop.

When subclassing ``ProfiledPIDCommand``, advanced users may further modify the output consumer by modifying the class's ``m_useOutput`` field.

#### requirements

Like all inlineable commands, ``ProfiledPIDCommand`` allows the user to specify its subsystem requirements as a constructor parameter.

### Full ProfiledPIDCommand Example

What does a ``ProfiledPIDCommand`` look like when used in practice? The following examples are from the GyroDriveCommands example project ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands)):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/commands/TurnToAngleProfiled.java
         :language: java
         :lines: 5-
         :linenos:
         :lineno-start: 5

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/include/commands/TurnToAngleProfiled.h
         :language: c++
         :lines: 5-
         :linenos:
         :lineno-start: 5

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/cpp/commands/TurnToAngleProfiled.cpp
         :language: c++
         :lines: 5-
         :linenos:
         :lineno-start: 5

.. todo:: inlined example?
