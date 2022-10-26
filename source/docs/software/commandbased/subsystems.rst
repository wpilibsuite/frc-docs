Subsystems
==========

Subsystems are the basic unit of robot organization in the command-based paradigm. A subsystem is an abstraction for a collection of robot hardware that *operates together as a unit*. Subsystems form an :term:`encapsulation` for this hardware, "hiding" it from the rest of the robot code (e.g. commands) and restricting access to it except through the subsystem’s public methods. Restricting the access in this way provides a single convenient place for code that might otherwise be duplicated in multiple places (such as scaling motor outputs or checking limit switches) if the subsystem internals were exposed. It also allows changes to the specific details of how the subsystem works (the "implementation") to be isolated from the rest of robot code, making it far easier to make substantial changes if/when the design constraints change.

Subsystems also serve as the backbone of the ``CommandScheduler``\ ’s resource management system. Commands may declare resource requirements by specifying which subsystems they interact with; the scheduler will never concurrently schedule more than one command that requires a given subsystem. An attempt to schedule a command that requires a subsystem that is already-in-use will either interrupt the currently-running command (if the command has been scheduled as interruptible), or else be ignored.

Subsystems can be associated with "default commands" that will be automatically scheduled when no other command is currently using the subsystem. This is useful for continuous "background" actions such as controlling the robot drive, or keeping an arm held at a setpoint. Similar functionality can be achieved in the subsystem’s ``periodic()`` method, which is run once per run of the scheduler; teams should try to be consistent within their codebase about which functionality is achieved through either of these methods. There is also a ``simulationPeriodic()`` method that is similar to ``periodic()`` except that it is only run during :doc:`Simulation </docs/software/wpilib-tools/robot-simulation/introduction>` and can be used to update the state of the robot. Subsystems are represented in the command-based library by the Subsystem interface (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/Subsystem.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_subsystem.html>`__).

Creating a Subsystem
--------------------

The recommended method to create a subsystem for most users is to subclass the abstract ``SubsystemBase`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/SubsystemBase.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_subsystem_base.html>`__), as seen in the command-based template (`Java <https://github.com/wpilibsuite/allwpilib/blob/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/commandbased/subsystems/ExampleSubsystem.java>`__, `C++ <https://github.com/wpilibsuite/allwpilib/blob/main/wpilibcExamples/src/main/cpp/templates/commandbased/include/subsystems/ExampleSubsystem.h>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/commandbased/subsystems/ExampleSubsystem.java
      :language: java
      :lines: 7-
      :linenos:
      :lineno-start: 7

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/templates/commandbased/include/subsystems/ExampleSubsystem.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

This class contains a few convenience features on top of the basic ``Subsystem`` interface: it automatically calls the ``register()`` method in its constructor to register the subsystem with the scheduler (this is necessary for the ``periodic()`` method to be called when the scheduler runs), and also implements the ``Sendable`` interface so that it can be sent to the dashboard to display/log relevant status information.

Advanced users seeking more flexibility may simply create a class that implements the ``Subsystem`` interface.

Simple Subsystem Example
------------------------

What might a functional subsystem look like in practice? Below is a simple pneumatically-actuated hatch mechanism from the HatchBot example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/subsystems/HatchSubsystem.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/subsystems/HatchSubsystem.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/subsystems/HatchSubsystem.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

Notice that the subsystem hides the presence of the DoubleSolenoid from outside code (it is declared ``private``), and instead publicly exposes two higher-level, descriptive robot actions: ``grabHatch()`` and ``releaseHatch()``. It is extremely important that "implementation details" such as the double solenoid be "hidden" in this manner; this ensures that code outside the subsystem will never cause the solenoid to be in an unexpected state. It also allows the user to change the implementation (for instance, a motor could be used instead of a pneumatic) without any of the code outside of the subsystem having to change with it.

Setting Default Commands
------------------------

.. note:: In the C++ command-based library, the CommandScheduler `owns` the default command objects - accordingly, the object passed to the ``SetDefaultCommand()`` method will be either moved or copied, depending on whether it is an rvalue or an lvalue (`rvalue/lvalue explanation <http://thbecker.net/articles/rvalue_references/section_01.html>`__).  The examples here ensure that move semantics are used by casting to an rvalue with ``std::move()``.

"Default commands" are commands that run automatically whenever a subsystem is not being used by another command.

Setting a default command for a subsystem is very easy; one simply calls ``CommandScheduler.getInstance().setDefaultCommand()``, or, more simply, the ``setDefaultCommand()`` method of the ``Subsystem`` interface:

.. tabs::

  .. code-tab:: java

    CommandScheduler.getInstance().setDefaultCommand(exampleSubsystem, exampleCommand);

  .. code-tab:: c++

    CommandScheduler.GetInstance().SetDefaultCommand(exampleSubsystem, std::move(exampleCommand));

.. tabs::

  .. code-tab:: java

    exampleSubsystem.setDefaultCommand(exampleCommand);

  .. code-tab:: c++

    exampleSubsystem.SetDefaultCommand(std::move(exampleCommand));

.. note:: A command that is assigned as the default command for a subsystem must require that subsystem.
