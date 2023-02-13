Motion Profiling through TrapezoidProfileSubsystems and TrapezoidProfileCommands
================================================================================

.. note:: For a description of the WPILib motion profiling features used by these command-based wrappers, see :ref:`docs/software/advanced-controls/controllers/trapezoidal-profiles:Trapezoidal Motion Profiles in WPILib`.

.. note:: The ``TrapezoidProfile`` command wrappers are generally intended for composition with custom or external controllers.  For combining trapezoidal motion profiling with WPILib's ``PIDController``, see :doc:`profilepid-subsystems-commands`.

When controlling a mechanism, is often desirable to move it smoothly between two positions, rather than to abruptly change its setpoint.  This is called "motion-profiling," and is supported in WPILib through the ``TrapezoidProfile`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/math/trajectory/TrapezoidProfile.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_trapezoid_profile.html>`__).

To further help teams integrate motion profiling into their command-based robot projects, WPILib includes two convenience wrappers for the ``TrapezoidProfile`` class: ``TrapezoidProfileSubsystem``, which automatically generates and executes motion profiles in its ``periodic()`` method, and the ``TrapezoidProfileCommand``, which executes a single user-provided ``TrapezoidProfile``.

TrapezoidProfileSubsystem
-------------------------

.. note:: In C++, the ``TrapezoidProfileSubsystem`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

The ``TrapezoidProfileSubsystem`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/TrapezoidProfileSubsystem.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_trapezoid_profile_subsystem.html>`__) will automatically create and execute trapezoidal motion profiles to reach the user-provided goal state.  To use the ``TrapezoidProfileSubsystem`` class, users must create a subclass of it.

Creating a TrapezoidProfileSubsystem
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: If ``periodic`` is overridden when inheriting from ``TrapezoidProfileSubsystem``, make sure to call ``super.periodic()``! Otherwise, motion profiling functionality will not work properly.

When subclassing ``TrapezoidProfileSubsystem``, users must override a single abstract method to provide functionality that the class will use in its ordinary operation:

useState()
~~~~~~~~~~

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/TrapezoidProfileSubsystem.java
         :language: java
         :lines: 105-105

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2023.3.2/wpilibNewCommands/src/main/native/include/frc2/command/TrapezoidProfileSubsystem.h
         :language: c++
         :lines: 77-77


The ``useState()`` method consumes the current state of the motion profile.  The ``TrapezoidProfileSubsystem`` will automatically call this method from its ``periodic()`` block, and pass it the motion profile state corresponding to the subsystem's current progress through the motion profile.

Users may do whatever they want with this state; a typical use case (as shown in the `Full TrapezoidProfileSubsystem Example`_) is to use the state to obtain a setpoint and a feedforward for an external "smart" motor controller.

Constructor Parameters
~~~~~~~~~~~~~~~~~~~~~~

Users must pass in a set of ``TrapezoidProfile.Constraints`` to the ``TrapezoidProfileSubsystem`` base class through the superclass constructor call of their subclass.  This serves to constrain the automatically-generated profiles to a given maximum velocity and acceleration.

Users must also pass in an initial position for the mechanism.

Advanced users may pass in an alternate value for the loop period, if a non-standard main loop period is being used.

Using a TrapezoidProfileSubsystem
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Once an instance of a ``TrapezoidProfileSubsystem`` subclass has been created, it can be used by commands through the following methods:

setGoal()
~~~~~~~~~

.. note:: If you wish to set the goal to a simple distance with an implicit target velocity of zero, an overload of ``setGoal()`` exists that takes a single distance value, rather than a full motion profile state.

The ``setGoal()`` method can be used to set the goal state of the ``TrapezoidProfileSubsystem``.  The subsystem will automatically execute a profile to the goal, passing the current state at each iteration to the provided `useState()`_ method.

.. tabs::

  .. code-tab:: java

    // The subsystem will execute a profile to a position of 5 and a velocity of 3.
    examplePIDSubsystem.setGoal(new TrapezoidProfile.State(5, 3);

  .. code-tab:: c++

    // The subsystem will execute a profile to a position of 5 meters and a velocity of 3 mps.
    examplePIDSubsyste.SetGoal({5_m, 3_mps});

enable() and disable()
~~~~~~~~~~~~~~~~~~~~~~

The ``enable()`` and ``disable()`` methods enable and disable the motion profiling control of the ``TrapezoidProfileSubsystem``.  When the subsystem is enabled, it will automatically run the control loop and call ``useState()`` periodically.  When it is disabled, no control is performed.

Full TrapezoidProfileSubsystem Example
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

What does a ``TrapezoidProfileSubsystem`` look like when used in practice?  The following examples are taking from the ArmbotOffobard example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armbotoffboard>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/ArmBotOffboard>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armbotoffboard/subsystems/ArmSubsystem.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/ArmBotOffboard/include/subsystems/ArmSubsystem.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/ArmBotOffboard/cpp/subsystems/ArmSubsystem.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

Using a ``TrapezoidProfileSubsystem`` with commands can be quite simple:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/armbotoffboard/RobotContainer.java
      :language: java
      :lines: 52-58
      :linenos:
      :lineno-start: 52

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/ArmBotOffboard/cpp/RobotContainer.cpp
      :language: c++
      :lines: 24-29
      :linenos:
      :lineno-start: 24

TrapezoidProfileCommand
-----------------------

.. note:: In C++, the ``TrapezoidProfileCommand`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

The ``TrapezoidProfileCommand`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/TrapezoidProfileCommand.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_trapezoid_profile_command.html>`__) allows users to create a command that will execute a single ``TrapezoidProfile``, passing its current state at each iteration to a user-defined function.

Creating a TrapezoidProfileCommand
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A ``TrapezoidProfileCommand`` can be created two ways - by subclassing the ``TrapezoidProfileCommand`` class, or by defining the command :ref:`inline <docs/software/commandbased/organizing-command-based:Inline Commands>`.  Both methods ultimately extremely similar, and ultimately the choice of which to use comes down to where the user desires that the relevant code be located.

.. note:: If subclassing ``TrapezoidProfileCommand`` and overriding any methods, make sure to call the ``super`` version of those methods! Otherwise, motion profiling functionality will not work properly.

In either case, a ``TrapezoidProfileCommand`` is created by passing the necessary parameters to its constructor (if defining a subclass, this can be done with a `super()` call):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibNewCommands/src/main/java/edu/wpi/first/wpilibj2/command/TrapezoidProfileCommand.java
      :language: java
      :lines: 25-34
      :linenos:
      :lineno-start: 25

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibNewCommands/src/main/native/include/frc2/command/TrapezoidProfileCommand.h
      :language: c++
      :lines: 35-45
      :linenos:
      :lineno-start: 35

profile
~~~~~~~

The ``profile`` parameter is the ``TrapezoidProfile`` object that will be executed by the command.  By passing this in, users specify the start state, end state, and motion constraints of the profile that the command will use.

output
~~~~~~

The ``output`` parameter is a function (usually passed as a :ref:`lambda <docs/software/commandbased/index:Lambda Expressions (Java)>`) that consumes the output and setpoint of the control loop.  Passing in the ``useOutput`` function in ``PIDCommand`` is functionally analogous to overriding the `useState()`_ function in ``PIDSubsystem``.

requirements
~~~~~~~~~~~~

Like all inlineable commands, ``TrapezoidProfileCommand`` allows the user to specify its subsystem requirements as a constructor parameter.

Full TrapezoidProfileCommand Example
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

What does a ``TrapezoidProfileSubsystem`` look like when used in practice?  The following examples are taking from the DriveDistanceOffboard example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/drivedistanceoffboard>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/drivedistanceoffboard/commands/DriveDistanceProfiled.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard/include/commands/DriveDistanceProfiled.h
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard/cpp/commands/DriveDistanceProfiled.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5

And, for an :ref:`inlined <docs/software/commandbased/organizing-command-based:Inline Commands>` example:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/drivedistanceoffboard/RobotContainer.java
      :language: java
      :lines: 66-83
      :linenos:
      :lineno-start: 66

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.3.2/wpilibcExamples/src/main/cpp/examples/DriveDistanceOffboard/cpp/RobotContainer.cpp
      :language: c++
      :lines: 37-56
      :linenos:
      :lineno-start: 37
