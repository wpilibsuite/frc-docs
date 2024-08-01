.. include:: <isonum.txt>

PID Control through PIDCommands
=================================================

.. note:: For a description of the WPILib PID control features used by these command-based wrappers, see :ref:`docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib`.

One of the most common control algorithms used in FRC\ |reg| is the :term:`PID` controller. WPILib offers its own :ref:`PIDController <docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib>` class to help teams implement this functionality on their robots. To further help teams integrate PID control into a command-based robot project, the command-based library includes a convenience wrapper for the ``PIDController`` class: ``PIDCommand``, which integrates the PID controller into a command.

PIDCommand
----------

The ``PIDCommand`` class allows users to easily create commands with a built-in PIDController.

Creating a PIDCommand
^^^^^^^^^^^^^^^^^^^^^

A ``PIDCommand`` can be created two ways - by subclassing the ``PIDCommand`` class, or by defining the command :ref:`inline <docs/software/commandbased/organizing-command-based:Inline Commands>`. Both methods ultimately extremely similar, and ultimately the choice of which to use comes down to where the user desires that the relevant code be located.

.. note:: If subclassing ``PIDCommand`` and overriding any methods, make sure to call the ``super`` version of those methods! Otherwise, PID functionality will not work properly.

In either case, a ``PIDCommand`` is created by passing the necessary parameters to its constructor (if defining a subclass, this can be done with a `super()` call):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/PIDCommand.java
         :language: java
         :lines: 27-41
         :linenos:
         :lineno-start: 27

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibNewCommands/src/main/native/include/frc2/command/PIDCommand.h
         :language: c++
         :lines: 28-42
         :linenos:
         :lineno-start: 28

controller
~~~~~~~~~~

The ``controller`` parameter is the ``PIDController`` object that will be used by the command.  By passing this in, users can specify the PID gains and the period for the controller (if the user is using a nonstandard main robot loop period).

When subclassing ``PIDCommand``, additional modifications (e.g. enabling continuous input) can be made to the controller in the constructor body by calling ``getController()``.

measurementSource
~~~~~~~~~~~~~~~~~

The ``measurementSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that returns the measurement of the process variable.

When subclassing ``PIDCommand``, advanced users may further modify the measurement supplier by modifying the class's ``m_measurement`` field.

setpointSource
~~~~~~~~~~~~~~

The ``setpointSource`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that returns the current setpoint for the control loop.  If only a constant setpoint is needed, an overload exists that takes a constant setpoint rather than a supplier.

When subclassing ``PIDCommand``, advanced users may further modify the setpoint supplier by modifying the class's ``m_setpoint`` field.

useOutput
~~~~~~~~~

The ``useOutput`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that consumes the output and setpoint of the control loop.

When subclassing ``PIDCommand``, advanced users may further modify the output consumer by modifying the class's ``m_useOutput`` field.

requirements
~~~~~~~~~~~~

Like all inlineable commands, ``PIDCommand`` allows the user to specify its subsystem requirements as a constructor parameter.

Full PIDCommand Example
^^^^^^^^^^^^^^^^^^^^^^^

What does a ``PIDCommand`` look like when used in practice? The following examples are from the GyroDriveCommands example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands>`__):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/commands/TurnToAngle.java
         :language: java
         :lines: 5-
         :linenos:
         :lineno-start: 5

   .. tab-item:: C++
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/include/commands/TurnToAngle.h
         :language: c++
         :lines: 5-
         :linenos:
         :lineno-start: 5

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/cpp/commands/TurnToAngle.cpp
         :language: c++
         :lines: 5-
         :linenos:
         :lineno-start: 5

And, for an :ref:`inlined <docs/software/commandbased/organizing-command-based:Inline Commands>`  example:

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/RobotContainer.java
         :language: java
         :lines: 64-79
         :linenos:
         :lineno-start: 64

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/cpp/RobotContainer.cpp
         :language: c++
         :lines: 34-49
         :linenos:
         :lineno-start: 34
