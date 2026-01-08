# Subsystems

Subsystems are the basic unit of robot organization in the command-based paradigm. A subsystem is an abstraction for a collection of robot hardware that *operates together as a unit*. Subsystems form an :term:`encapsulation` for this hardware, "hiding" it from the rest of the robot code and restricting access to it except through the subsystem’s public methods. Restricting the access in this way provides a single convenient place for code that might otherwise be duplicated in multiple places (such as scaling motor outputs or checking limit switches) if the subsystem internals were exposed. It also allows changes to the specific details of how the subsystem works (the "implementation") to be isolated from the rest of robot code, making it far easier to make substantial changes if/when the design constraints change.

Subsystems also serve as the backbone of the ``CommandScheduler``\ ’s resource management system. Commands may declare resource requirements by specifying which subsystems they interact with; the scheduler will never concurrently schedule more than one command that requires a given subsystem. An attempt to schedule a command that requires a subsystem that is already-in-use will either interrupt the currently-running command or be ignored, based on the running command's :ref:`Interruption Behavior <docs/software/commandbased/commands:getInterruptionBehavior>`.

Subsystems can be associated with "default commands" that will be automatically scheduled when no other command is currently using the subsystem. This is useful for "background" actions such as controlling the robot drive, keeping an arm held at a setpoint, or stopping motors when the subsystem isn't used. Similar functionality can be achieved in the subsystem’s ``periodic()`` method, which is run once per run of the scheduler; teams should try to be consistent within their codebase about which functionality is achieved through either of these methods. Subsystems are represented in the command-based library by the ``Subsystem`` interface ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Subsystem.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_subsystem.html), :external:py:class:`Python <commands2.Subsystem>`).

## Creating a Subsystem

The recommended method to create a subsystem for most users is to subclass the abstract ``SubsystemBase`` class in ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/SubsystemBase.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_subsystem_base.html)), as seen in the command-based template ([Java](https://github.com/wpilibsuite/allwpilib/blob/3eb372c25ad6079d6edfbdb4bb099a7bc00e4350/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/commandbased/subsystems/ExampleSubsystem.java), [C++](https://github.com/wpilibsuite/allwpilib/blob/3eb372c25ad6079d6edfbdb4bb099a7bc00e4350/wpilibcExamples/src/main/cpp/templates/commandbased/include/subsystems/ExampleSubsystem.h)). In Python, because Python does not have interfaces, the ``Subsystem`` class is a concrete class that can be subclassed directly (:external:py:class:`Python <commands2.Subsystem>`). The following example demonstrates how to create a simple subsystem in each of the supported languages:

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/commandbased/subsystems/ExampleSubsystem.java
         :language: java
         :lines: 7-
         :lineno-match:

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/templates/commandbased/include/subsystems/ExampleSubsystem.h
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: Python
      :sync: Python

      ```python
      from commands2 import Command
      from commands2 import Subsystem
      class ExampleSubsystem(Subsystem):
          def __init__(self):
              """Creates a new ExampleSubsystem."""
              super().__init__()
          def exampleMethodCommand()->Command:
              """
              Example command factory method.
               :return a command
              """
              return self.runOnce(
                  lambda: # one-time action goes here #
              )
          def exampleCondition(self)->bool:
              """
              An example method querying a boolean state of the subsystem (for example, a digital sensor).
              :return value of some boolean subsystem state, such as a digital sensor.
              """
              #Query some boolean state, such as a digital sensor.
              return False
          def periodic(self):
              # This method will be called once per scheduler run
              pass
          def simulationPeriodic(self):
              # This method will be called once per scheduler run during simulation
              pass
      ```

This class contains a few convenience features on top of the basic ``Subsystem`` interface: it automatically calls the ``register()`` method in its constructor to register the subsystem with the scheduler (this is necessary for the ``periodic()`` method to be called when the scheduler runs), and also implements the ``Sendable`` interface so that it can be sent to the dashboard to display/log relevant status information.

Advanced users seeking more flexibility may simply create a class that implements the ``Subsystem`` interface.

## Simple Subsystem Example

What might a functional subsystem look like in practice? Below is a simple pneumatically-actuated hatch mechanism from the HatchBotTraditional example project ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional), [Python](https://github.com/robotpy/examples/tree/main/HatchbotTraditional)):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/subsystems/HatchSubsystem.java
         :language: java
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/subsystems/HatchSubsystem.h
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/subsystems/HatchSubsystem.cpp
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: Python
      :sync: Python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/HatchbotTraditional/subsystems/hatchsubsystem.py
         :language: python
         :lines: 7-
         :lineno-match:

Notice that the subsystem hides the presence of the DoubleSolenoid from outside code (it is declared ``private``), and instead publicly exposes two higher-level, descriptive robot actions: ``grabHatch()`` and ``releaseHatch()``. It is extremely important that "implementation details" such as the double solenoid be "hidden" in this manner; this ensures that code outside the subsystem will never cause the solenoid to be in an unexpected state. It also allows the user to change the implementation (for instance, a motor could be used instead of a pneumatic) without any of the code outside of the subsystem having to change with it.

Alternatively, instead of writing ``void`` public methods that are called from commands, we can define the public methods as factories that return a command. Consider the following from the HatchBotInlined example project ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotInlined), [Python](https://github.com/robotpy/examples/tree/main/HatchbotInlined)):

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbotinlined/subsystems/HatchSubsystem.java
         :language: java
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/include/subsystems/HatchSubsystem.h
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/subsystems/HatchSubsystem.cpp
         :language: c++
         :lines: 5-
         :lineno-match:

   .. tab-item:: Python
      :sync: Python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/HatchbotInlined/subsystems/hatchsubsystem.py
         :language: python
         :lines: 7-
         :lineno-match:


Note the qualification of the ``RunOnce`` factory used here: this isn't the static factory in ``Commands``! Subsystems have similar instance factories that return commands requiring ``this`` (Java/C++) or ``self`` (Python) subsystem. Here, the ``Subsystem.runOnce(Runnable)`` factory ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/Subsystem.html#runOnce(java.lang.Runnable)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_subsystem.html#a6b8b3b7dab6f54fb8635e335dad448fe), :external:py:meth:`Python <commands2.Subsystem.runOnce>`) is used.

For a comparison between these options, see :ref:`docs/software/commandbased/organizing-command-based:Instance Command Factory Methods`.

## Periodic

Subsystems have a ``periodic`` method that is called once every scheduler iteration (usually, once every 20 ms). This method is typically used for telemetry and other periodic actions that do not interfere with whatever command is requiring the subsystem.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/statespacedifferentialdrivesimulation/subsystems/DriveSubsystem.java
         :language: java
         :lines: 117-125
         :lineno-match:

   .. tab-item:: C++ (Header)
      :sync: C++ (Header)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/StateSpaceDifferentialDriveSimulation/include/subsystems/DriveSubsystem.h
         :language: c++
         :lines: 30-30
         :lineno-match:

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/StateSpaceDifferentialDriveSimulation/cpp/subsystems/DriveSubsystem.cpp
         :language: c++
         :lines: 30-36
         :lineno-match:

   .. tab-item:: Python
      :sync: Python

      ```python
      def periodic(self):
          #Update the odometry in the periodic block
          self.odometry.update(
              Rotation2d.fromDegrees(getHeading()),
              self.leftEncoder.getDistance(),
              self.rightEncoder.getDistance())
          self.fieldSim.setRobotPose(getPose())
      ```

There is also a ``simulationPeriodic()`` method that is similar to ``periodic()`` except that it is only run during :doc:`Simulation </docs/software/wpilib-tools/robot-simulation/introduction>` and can be used to update the state of the robot.

## Default Commands

.. note:: In the C++ command-based library, the CommandScheduler `owns` the default command object.

"Default commands" are commands that run automatically whenever a subsystem is not being used by another command. This can be useful for "background" actions such as controlling the robot drive, or keeping an arm held at a setpoint.

Setting a default command for a subsystem is very easy; one simply calls ``CommandScheduler.getInstance().setDefaultCommand()``, or, more simply, the ``setDefaultCommand()`` method of the ``Subsystem`` interface:

.. tab-set-code::

   ```java
   CommandScheduler.getInstance().setDefaultCommand(exampleSubsystem, exampleCommand);
   ```

   ```c++
   CommandScheduler.GetInstance().SetDefaultCommand(exampleSubsystem, std::move(exampleCommand));
   ```

   ```python
   CommandScheduler.getInstance().setDefaultCommand(exampleSubsystem, exampleCommand)
   ```

.. tab-set-code::

   ```java
   exampleSubsystem.setDefaultCommand(exampleCommand);
   ```

   ```c++
   exampleSubsystem.SetDefaultCommand(std::move(exampleCommand));
   ```

   ```python
   exampleSubsystem.setDefaultCommand(exampleCommand)
   ```

.. note:: A command that is assigned as the default command for a subsystem must require that subsystem.
