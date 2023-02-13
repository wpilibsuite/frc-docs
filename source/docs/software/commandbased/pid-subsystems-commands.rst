.. include:: <isonum.txt>

PID Control through PIDSubsystems and PIDCommands
=================================================

.. note:: For a description of the WPILib PID control features used by these command-based wrappers, see :ref:`docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib`.

One of the most common control algorithms used in FRC\ |reg| is the :term:`PID` controller. WPILib offers its own :ref:`PIDController <docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib>` class to help teams implement this functionality on their robots. To further help teams integrate PID control into a command-based robot project, the command-based library includes two convenience wrappers for the ``PIDController`` class: ``PIDSubsystem``, which integrates the PID controller into a subsystem, and ``PIDCommand``, which integrates the PID controller into a command.

PIDSubsystems
-------------

The ``PIDSubsystem`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/PIDSubsystem.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_p_i_d_subsystem.html>`__) allows users to conveniently create a subsystem with a built-in ``PIDController``.  In order to use the ``PIDSubsystem`` class, users must create a subclass of it.

Creating a PIDSubsystem
^^^^^^^^^^^^^^^^^^^^^^^

.. note:: If ``periodic`` is overridden when inheriting from ``PIDSubsystem``, make sure to call ``super.periodic()``! Otherwise, PID functionality will not work properly.

When subclassing ``PIDSubsystem``, users must override two abstract methods to provide functionality that the class will use in its ordinary operation:

getMeasurement()
~~~~~~~~~~~~~~~~

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/PIDSubsystem.java
         :language: java
         :lines: 84-84

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/native/include/frc2/command/PIDSubsystem.h
         :language: cpp
         :lines: 79-79

The ``getMeasurement`` method returns the current measurement of the process variable.  The ``PIDSubsystem`` will automatically call this method from its ``periodic()`` block, and pass its value to the control loop.

Users should override this method to return whatever sensor reading they wish to use as their process variable measurement.

useOutput()
~~~~~~~~~~~

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/PIDSubsystem.java
         :language: java
         :lines: 77-77

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/native/include/frc2/command/PIDSubsystem.h
         :language: cpp
         :lines: 87-87


The ``useOutput()`` method consumes the output of the PID controller, and the current setpoint (which is often useful for computing a feedforward).  The ``PIDSubsystem`` will automatically call this method from its ``periodic()`` block, and pass it the computed output of the control loop.

Users should override this method to pass the final computed control output to their subsystem's motors.

Passing In the Controller
~~~~~~~~~~~~~~~~~~~~~~~~~

Users must also pass in a ``PIDController`` to the ``PIDSubsystem`` base class through the superclass constructor call of their subclass.  This serves to specify the PID gains, as well as the period (if the user is using a non-standard main robot loop period).

Additional modifications (e.g. enabling continuous input) can be made to the controller in the constructor body by calling ``getController()``.

Using a PIDSubsystem
^^^^^^^^^^^^^^^^^^^^

Once an instance of a ``PIDSubsystem`` subclass has been created, it can be used by commands through the following methods:

setSetpoint()
~~~~~~~~~~~~~

The ``setSetpoint()`` method can be used to set the setpoint of the ``PIDSubsystem``.  The subsystem will automatically track to the setpoint using the defined output:

.. tabs::

  .. code-tab:: java

    // The subsystem will track to a setpoint of 5.
    examplePIDSubsystem.setSetpoint(5);

  .. code-tab:: c++

    // The subsystem will track to a setpoint of 5.
    examplePIDSubsystem.SetSetpoint(5);

enable() and disable()
~~~~~~~~~~~~~~~~~~~~~~

The ``enable()`` and ``disable()`` methods enable and disable the PID control of the ``PIDSubsystem``.  When the subsystem is enabled, it will automatically run the control loop and track the setpoint.  When it is disabled, no control is performed.

Additionally, the ``enable()`` method resets the internal ``PIDController``, and the ``disable()`` method calls the user-defined `useOutput()`_ method with both output and setpoint set to ``0``.

Full PIDSubsystem Example
^^^^^^^^^^^^^^^^^^^^^^^^^

What does a ``PIDSubsystem`` look like when used in practice? The following examples are taken from the FrisbeeBot example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/frisbeebot>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/Frisbeebot>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/frisbeebot/subsystems/ShooterSubsystem.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/Frisbeebot/include/subsystems/ShooterSubsystem.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/Frisbeebot/cpp/subsystems/ShooterSubsystem.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

Using a ``PIDSubsystem`` with commands can be very simple:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/frisbeebot/RobotContainer.java
      :language: java
      :lines: 26-27, 80-87

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/Frisbeebot/include/RobotContainer.h
      :language: c++
      :lines: 45-49
      :linenos:
      :lineno-start: 45

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/Frisbeebot/cpp/RobotContainer.cpp
      :language: c++
      :lines: 25-31
      :linenos:
      :lineno-start: 25

PIDCommand
----------

The ``PIDCommand`` class allows users to easily create commands with a built-in PIDController.

Creating a PIDCommand
^^^^^^^^^^^^^^^^^^^^^

A ``PIDCommand`` can be created two ways - by subclassing the ``PIDCommand`` class, or by defining the command :ref:`inline <docs/software/commandbased/organizing-command-based:Inline Commands>`. Both methods ultimately extremely similar, and ultimately the choice of which to use comes down to where the user desires that the relevant code be located.

.. note:: If subclassing ``PIDCommand`` and overriding any methods, make sure to call the ``super`` version of those methods! Otherwise, PID functionality will not work properly.

In either case, a ``PIDCommand`` is created by passing the necessary parameters to its constructor (if defining a subclass, this can be done with a `super()` call):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/PIDCommand.java
      :language: java
      :lines: 27-41
      :linenos:
      :lineno-start: 27

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibNewCommands/src/main/native/include/frc2/command/PIDCommand.h
      :language: c++
      :lines: 29-43
      :linenos:
      :lineno-start: 29

controller
~~~~~~~~~~

The ``controller`` parameter is the ``PIDController`` object that will be used by the command.  By passing this in, users can specify the PID gains and the period for the controller (if the user is using a nonstandard main robot loop period).

When subclassing ``PIDCommand``, additional modifications (e.g. enabling continuous input) can be made to the controller in the constructor body by calling ``getController()``.

measurementSource
~~~~~~~~~~~~~~~~~

The ``measurementSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that returns the measurement of the process variable.  Passing in the ``measurementSource`` function in ``PIDCommand`` is functionally analogous to overriding the `getMeasurement()`_ function in ``PIDSubsystem``.

When subclassing ``PIDCommand``, advanced users may further modify the measurement supplier by modifying the class's ``m_measurement`` field.

setpointSource
~~~~~~~~~~~~~~

The ``setpointSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that returns the current setpoint for the control loop.  If only a constant setpoint is needed, an overload exists that takes a constant setpoint rather than a supplier.

When subclassing ``PIDCommand``, advanced users may further modify the setpoint supplier by modifying the class's ``m_setpoint`` field.

useOutput
~~~~~~~~~

The ``useOutput`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that consumes the output and setpoint of the control loop.  Passing in the ``useOutput`` function in ``PIDCommand`` is functionally analogous to overriding the `useOutput()`_ function in ``PIDSubsystem``.

When subclassing ``PIDCommand``, advanced users may further modify the output consumer by modifying the class's ``m_useOutput`` field.

requirements
~~~~~~~~~~~~

Like all inlineable commands, ``PIDCommand`` allows the user to specify its subsystem requirements as a constructor parameter.

Full PIDCommand Example
^^^^^^^^^^^^^^^^^^^^^^^

What does a ``PIDCommand`` look like when used in practice? The following examples are from the GyroDriveCommands example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/commands/TurnToAngle.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/include/commands/TurnToAngle.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/cpp/commands/TurnToAngle.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

And, for an :ref:`inlined <docs/software/commandbased/organizing-command-based:Inline Commands>`  example:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/RobotContainer.java
      :language: java
      :lines: 64-79
      :linenos:
      :lineno-start: 64

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/cpp/RobotContainer.cpp
      :language: c++
      :lines: 34-49
      :linenos:
      :lineno-start: 34
