PID control through PIDSubsystems and PIDCommands
=================================================

One of the most common control algorithms used in FRC is the `PID controller <https://en.wikipedia.org/wiki/PID_controller>`__. WPILib offers its own :code:`PIDController` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/PIDController.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1PIDController.html>`__) to help teams implement this functionality on their robots. To further help teams integrate PID control into a command-based robot project, the command-based library includes two convenience wrappers for the ``PIDController`` object: PIDSubsystem, which integrates the PID controller into a subsystem, and PIDCommand, which integrates the PID controller into a command.

PIDSubsystems
-------------

The ``PIDSubsystem`` class (`Java <https://first.wpi.edu/FRC/roborio/development/docs/java/edu/wpi/first/wpilibj2/command/PIDSubsystem.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/development/docs/cpp/classfrc2_1_1PIDSubsystem.html>`__) allows users to conveniently create a subsystem with a built-in PIDController.  In order to use the ``PIDSubsystem`` class, users must create a subclass of it.

Using a PIDSubsystem
^^^^^^^^^^^^^^^^^^^^

What does a PIDSubsystem look like when used in practice? The following examples are taken from the FrisbeeBot example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/frisbeebot>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot>`__):

.. tabs::

  .. tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/frisbeebot/subsystems/ShooterSubsystem.java
      :language: java
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot/include/subsystems/ShooterSubsystem.h
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot/cpp/subsystems/ShooterSubsystem.cpp
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

Notice that the ``disable()`` method has been overridden, even though the superclass has an implementation - this is because the default implementation (for both synchronous and asynchronous) calls ``useOutput(0);``, which may not necessarily set the motor output to zero depending on the type of feedforward implemented by the user.

Using a PIDSubsystem with commands can be very simple:

.. tabs::

  .. tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/frisbeebot/RobotContainer.java
      :language: java
      :lines: 86-92
      :linenos:
      :lineno-start: 86

  .. tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot/include/RobotContainer.h
      :language: c++
      :lines: 73-77
      :linenos:
      :lineno-start: 73

  .. tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/Frisbeebot/cpp/RobotContainer.cpp
      :language: c++
      :lines: 32-36
      :linenos:
      :lineno-start: 32

PIDCommands
-----------

The ``PIDCommand`` class allows users to easily create commands with a built-in PIDController.  As with PIDSubsystem, users can create a PIDCommmand by subclassing the ``PIDCommand`` class.  However, as with many of the other command classes in the command-based library, users may want to save code by defining a PIDCommand :ref:`inline <docs/software/commandbased/convenience-features:Inline Command Definitions>`.

Using a PIDCommand
^^^^^^^^^^^^^^^^^^

What does a PIDCommand look like when used in practice? The following examples are from the GyroDriveCommands example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands>`__):

.. tabs::

  .. tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/commands/TurnToAngle.java
      :language: java
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/include/commands/TurnToAngle.h
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/cpp/commands/TurnToAngle.cpp
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8

And, for an :ref:`inlined <docs/software/commandbased/convenience-features:Inline Command Definitions>`  example:

.. tabs::

  .. tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands/RobotContainer.java
      :language: java
      :lines: 71-83
      :linenos:
      :lineno-start: 71

  .. tab:: C++ (Header)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands/include/RobotContainer.h
      :language: c++
      :lines: 54-69
      :linenos:
      :lineno-start: 54
