.. include:: <isonum.txt>

Combining Motion Profiling and PID in Command-Based
===================================================

.. note:: For a description of the WPILib PID control features used by these command-based wrappers, see :ref:`docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib`.

A common FRC\ |reg| controls solution is to pair a trapezoidal motion profile for setpoint generation with a PID controller for setpoint tracking.  To facilitate this, WPILib includes its own :ref:`ProfiledPIDController <docs/software/advanced-controls/controllers/profiled-pidcontroller:Combining Motion Profiling and PID Control with ProfiledPIDController>` class.  To further aid teams in integrating this functionality into their robots, the command-based framework contains two convenience wrappers for the ``ProfiledPIDController`` class: ``ProfiledPIDSubsystem``, which integrates the controller into a subsystem, and ``ProfiledPIDCommand``, which integrates the controller into a command.

ProfiledPIDSubsystem
--------------------

.. note:: In C++, the ``ProfiledPIDSubsystem`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

The ``ProfiledPIDSubsystem`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ProfiledPIDSubsystem.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_profiled_p_i_d_subsystem.html>`__) allows users to conveniently create a subsystem with a built-in PIDController.  In order to use the ``ProfiledPIDSubsystem`` class, users must create a subclass of it.

Creating a ProfiledPIDSubsystem
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: If ``periodic`` is overridden when inheriting from ``ProfiledPIDSubsystem``, make sure to call ``super.periodic()``! Otherwise, control functionality will not work properly.

When subclassing ``ProfiledPIDSubsystem``, users must override two abstract methods to provide functionality that the class will use in its ordinary operation:

getMeasurement()
~~~~~~~~~~~~~~~~

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/ProfiledPIDSubsystem.java
         :language: java
         :lines: 85-85

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/native/include/frc2/command/ProfiledPIDSubsystem.h
         :language: cpp
         :lines: 103-103

The ``getMeasurement`` method returns the current measurement of the process variable.  The ``PIDSubsystem`` will automatically call this method from its ``periodic()`` block, and pass its value to the control loop.

Users should override this method to return whatever sensor reading they wish to use as their process variable measurement.

useOutput()
~~~~~~~~~~~

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/ProfiledPIDSubsystem.java
         :language: java
         :lines: 78-78

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/native/include/frc2/command/ProfiledPIDSubsystem.h
         :language: cpp
         :lines: 112-112


The ``useOutput()`` method consumes the output of the Profiled PID controller, and the current setpoint state (which is often useful for computing a feedforward).  The ``PIDSubsystem`` will automatically call this method from its ``periodic()`` block, and pass it the computed output of the control loop.

Users should override this method to pass the final computed control output to their subsystem's motors.

Passing In the Controller
~~~~~~~~~~~~~~~~~~~~~~~~~

Users must also pass in a ``ProfiledPIDController`` to the ``ProfiledPIDSubsystem`` base class through the superclass constructor call of their subclass.  This serves to specify the PID gains, the motion profile constraints, and the period (if the user is using a non-standard main robot loop period).

Additional modifications (e.g. enabling continuous input) can be made to the controller in the constructor body by calling ``getController()``.

Using a ProfiledPIDSubsystem
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Once an instance of a ``PIDSubsystem`` subclass has been created, it can be used by commands through the following methods:

setGoal()
~~~~~~~~~

.. note:: If you wish to set the goal to a simple distance with an implicit target velocity of zero, an overload of ``setGoal()`` exists that takes a single distance value, rather than a full motion profile state.

The ``setGoal()`` method can be used to set the setpoint of the ``PIDSubsystem``.  The subsystem will automatically track to the setpoint using the defined output:

.. tabs::

  .. code-tab:: java

    // The subsystem will track to a goal of 5 meters and velocity of 3 meters per second.
    examplePIDSubsystem.setGoal(5, 3);

  .. code-tab:: c++

    // The subsystem will track to a goal of 5 meters and velocity of 3 meters per second.
    examplePIDSubsystem.SetGoal({5_m, 3_mps});

enable() and disable()
~~~~~~~~~~~~~~~~~~~~~~

The ``enable()`` and ``disable()`` methods enable and disable the automatic control of the ``ProfiledPIDSubsystem``.  When the subsystem is enabled, it will automatically run the motion profile and the control loop and track to the goal.  When it is disabled, no control is performed.

Additionally, the ``enable()`` method resets the internal ``ProfiledPIDController``, and the ``disable()`` method calls the user-defined `useOutput()`_ method with both output and setpoint set to ``0``.

Full ProfiledPIDSubsystem Example
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

What does a PIDSubsystem look like when used in practice? The following examples are taken from the ArmBot example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armbot>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/ArmBot>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armbot/subsystems/ArmSubsystem.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/ArmBot/include/subsystems/ArmSubsystem.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/ArmBot/cpp/subsystems/ArmSubsystem.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

Using a ``ProfiledPIDSubsystem`` with commands can be very simple:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armbot/RobotContainer.java
      :language: java
      :lines: 55-64
      :linenos:
      :lineno-start: 55

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/ArmBot/cpp/RobotContainer.cpp
      :language: c++
      :lines: 33-39
      :linenos:
      :lineno-start: 32

ProfiledPIDCommand
------------------

.. note:: In C++, the ``ProfiledPIDCommand`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

The ``ProfiledPIDCommand`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ProfiledPIDCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_profiled_p_i_d_command.html>`__) allows users to easily create commands with a built-in ProfiledPIDController.

Creating a PIDCommand
^^^^^^^^^^^^^^^^^^^^^

A ``ProfiledPIDCommand`` can be created two ways - by subclassing the ``ProfiledPIDCommand`` class, or by defining the command :ref:`inline <docs/software/commandbased/organizing-command-based:Inline Commands>`.  Both methods ultimately extremely similar, and ultimately the choice of which to use comes down to where the user desires that the relevant code be located.

.. note:: If subclassing ``ProfiledPIDCommand`` and overriding any methods, make sure to call the ``super`` version of those methods! Otherwise, control functionality will not work properly.

In either case, a ``ProfiledPIDCommand`` is created by passing the necessary parameters to its constructor (if defining a subclass, this can be done with a `super()` call):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/ProfiledPIDCommand.java
      :language: java
      :lines: 29-44
      :linenos:
      :lineno-start: 29

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibNewCommands/src/main/native/include/frc2/command/ProfiledPIDCommand.h
      :language: c++
      :lines: 39-53
      :linenos:
      :lineno-start: 39

controller
~~~~~~~~~~

The ``controller`` parameter is the ``ProfiledPIDController`` object that will be used by the command.  By passing this in, users can specify the PID gains, the motion profile constraints, and the period for the controller (if the user is using a nonstandard main robot loop period).

When subclassing ``ProfiledPIDCommand``, additional modifications (e.g. enabling continuous input) can be made to the controller in the constructor body by calling ``getController()``.

measurementSource
~~~~~~~~~~~~~~~~~

The ``measurementSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that returns the measurement of the process variable.  Passing in the ``measurementSource`` function in ``ProfiledPIDCommand`` is functionally analogous to overriding the `getMeasurement()`_ function in ``ProfiledPIDSubsystem``.

When subclassing ``ProfiledPIDCommand``, advanced users may further modify the measurement supplier by modifying the class's ``m_measurement`` field.

goalSource
~~~~~~~~~~

The ``goalSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that returns the current goal state for the mechanism.  If only a constant goal is needed, an overload exists that takes a constant goal rather than a supplier.  Additionally, if goal velocities are desired to be zero, overloads exist that take a constant distance rather than a full profile state.

When subclassing ``ProfiledPIDCommand``, advanced users may further modify the setpoint supplier by modifying the class's ``m_goal`` field.

useOutput
~~~~~~~~~

The ``useOutput`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that consumes the output and setpoint state of the control loop.  Passing in the ``useOutput`` function in ``ProfiledPIDCommand`` is functionally analogous to overriding the `useOutput()`_ function in ``ProfiledPIDSubsystem``.

When subclassing ``ProfiledPIDCommand``, advanced users may further modify the output consumer by modifying the class's ``m_useOutput`` field.

requirements
~~~~~~~~~~~~

Like all inlineable commands, ``ProfiledPIDCommand`` allows the user to specify its subsystem requirements as a constructor parameter.

Full ProfiledPIDCommand Example
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

What does a ``ProfiledPIDCommand`` look like when used in practice? The following examples are from the GyroDriveCommands example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/commands/TurnToAngleProfiled.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/include/commands/TurnToAngleProfiled.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/cpp/commands/TurnToAngleProfiled.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

.. todo:: inlined example?
