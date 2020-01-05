PID Control through PIDSubsystems and PIDCommands
=================================================

.. note:: For a description of the WPILib PID control features used by these command-based wrappers, see :ref:`docs/software/advanced-control/controllers/pidcontroller:PID Control in WPILib`.

.. note:: Unlike the earlier version of ``PIDController``, the 2020 ``PIDController`` class runs *synchronously*, and is not handled in its own thread.  Accordingly, changing its ``period`` parameter will *not* change the actual frequency at which it runs in any of these wrapper classes.  Users should never modify the ``period`` parameter unless they are certain of what they are doing.

One of the most common control algorithms used in FRC is the `PID controller <https://en.wikipedia.org/wiki/PID_controller>`__. WPILib offers its own :ref:`PIDController <docs/software/advanced-control/controllers/pidcontroller:PID Control in WPILib>` class to help teams implement this functionality on their robots. To further help teams integrate PID control into a command-based robot project, the command-based library includes two convenience wrappers for the ``PIDController`` class: ``PIDSubsystem``, which integrates the PID controller into a subsystem, and ``PIDCommand``, which integrates the PID controller into a command.

PIDSubsystems
-------------

The ``PIDSubsystem`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/PIDSubsystem.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1PIDSubsystem.html>`__) allows users to conveniently create a subsystem with a built-in ``PIDController``.  In order to use the ``PIDSubsystem`` class, users must create a subclass of it.

Creating a PIDSubsystem
^^^^^^^^^^^^^^^^^^^^^^^

When subclassing ``PIDSubsystem``, users must override two abstract methods to provide functionality that the class will use in its ordinary operation:

getMeasurement()
~~~~~~~~~~~~~~~~

.. tabs::

  .. code-tab:: java

    protected abstract double getMeasurement();

  .. code-tab:: c++

    virtual double GetMeasurement() = 0;

The ``getMeasurement`` method returns the current measurement of the process variable.  The ``PIDSubsystem`` will automatically call this method from its ``periodic()`` block, and pass its value to the control loop.

Users should override this method to return whatever sensor reading they wish to use as their process variable measurement.

useOutput()
~~~~~~~~~~~

.. tabs::

  .. code-tab:: java

    protected abstract void useOutput(double output, double setpoint);

  .. code-tab:: c++

    virtual void UseOutput(double output, double setpoint) = 0;


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
    examplePIDSubsyste.SetSetpoint(5);

enable() and disable()
~~~~~~~~~~~~~~~~~~~~~~

The ``enable()`` and ``disable()`` methods enable and disable the PID control of the ``PIDSubsystem``.  When the subsystem is enabled, it will automatically run the control loop and track the setpoint.  When it is disabled, no control is performed.

Additionally, the ``enable()`` method resets the internal ``PIDController``, and the ``disable()`` method calls the user-defined `useOutput()`_ method with both output and setpoint set to ``0``.

Full PIDSubsystem Example
^^^^^^^^^^^^^^^^^^^^^^^^^

What does a ``PIDSubsystem`` look like when used in practice? The following examples are taken from the FrisbeeBot example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/frisbeebot>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/frisbeebot/subsystems/ShooterSubsystem.java
      :language: java
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot/include/subsystems/ShooterSubsystem.h
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot/cpp/subsystems/ShooterSubsystem.cpp
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

Using a ``PIDSubsystem`` with commands can be very simple:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/frisbeebot/RobotContainer.java
      :language: java
      :lines: 85-91
      :linenos:
      :lineno-start: 85

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot/include/RobotContainer.h
      :language: c++
      :lines: 73-77
      :linenos:
      :lineno-start: 73

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot/cpp/RobotContainer.cpp
      :language: c++
      :lines: 32-36
      :linenos:
      :lineno-start: 32

PIDCommand
----------

The ``PIDCommand`` class allows users to easily create commands with a built-in PIDController.  As with PIDSubsystem, users can create a ``PIDCommmand`` by subclassing the ``PIDCommand`` class.  However, as with many of the other command classes in the command-based library, users may want to save code by defining a ``PIDCommand`` :ref:`inline <docs/software/commandbased/convenience-features:Inline Command Definitions>`.

Creating a PIDCommand
^^^^^^^^^^^^^^^^^^^^^

A ``PIDCommand`` can be created two ways - by subclassing the ``PIDCommand`` class, or by defining the command :ref:`inline <docs/software/commandbased/convenience-features:Inline Command Definitions>`.  Both methods ultimately extremely similar, and ultimately the choice of which to use comes down to where the user desires that the relevant code be located.

In either case, a ``PIDCommand`` is created by passing the necessary parameters to its constructor (if defining a subclass, this can be done with a `super()` call):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/PIDCommand.java
      :language: java
      :lines: 29-51
      :linenos:
      :lineno-start: 29

  .. group-tab:: C++

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibNewCommands/src/main/native/include/frc2/command/PIDCommand.h
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

The ``measurementSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/convenience-features:Lambda Expressions (Java)>`) that returns the measurement of the process variable.  Pasing in the ``measurementSource`` function in ``PIDCommand`` is functionally analogous to overriding the `getMeasurement()`_ function in ``PIDSubsystem``.

When subclassing ``PIDCommand``, advanced users may further modify the measurement supplier by modifying the class's ``m_measurement`` field.

setpointSource
~~~~~~~~~~~~~~

The ``setpointSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/convenience-features:Lambda Expressions (Java)>`) that returns the current setpoint for the control loop.  If only a constant setpoint is needed, an overload exists that takes a constant setpoint rather than a supplier.

When subclassing ``PIDCommand``, advanced users may further modify the setpoint supplier by modifying the class's ``m_setpoint`` field.

useOutput
~~~~~~~~~

The ``useOutput`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/convenience-features:Lambda Expressions (Java)>`) that consumes the output and setpoint of the control loop.  Passing in the ``useOutput`` function in ``PIDCommand`` is functionally analogous to overriding the `useOutput()`_ function in ``PIDSubsystem``.

When subclassing ``PIDCommand``, advanced users may further modify the output consumer by modifying the class's ``m_useOutput`` field.

requirements
~~~~~~~~~~~~

Like all inlineable commands, ``PIDCommand`` allows the user to specify its subsystem requirements as a constructor parameter.

Full PIDCommand Example
^^^^^^^^^^^^^^^^^^^^^^^

What does a ``PIDCommand`` look like when used in practice? The following examples are from the GyroDriveCommands example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/commands/TurnToAngle.java
      :language: java
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/include/commands/TurnToAngle.h
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/cpp/commands/TurnToAngle.cpp
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

And, for an :ref:`inlined <docs/software/commandbased/convenience-features:Inline Command Definitions>`  example:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/RobotContainer.java
      :language: java
      :lines: 70-81
      :linenos:
      :lineno-start: 70

  .. group-tab:: C++

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/cpp/RobotContainer.cpp
      :language: c++
      :lines: 37-53
      :linenos:
      :lineno-start: 37
