2020 Command-Based Rewrite: What Changed?
=========================================

This article provides a summary of changes from the original command-based framework to the 2020 rewrite.  This summary is not necessarily comprehensive - for rigorous documentation, as always, refer to the API docs (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/package-summary.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/>`__).

Package Location
----------------

The new command-based framework is located in the ``wpilibj2`` package for Java, and in the ``frc2`` namespace for C++. The new framework must be installed using the instructions: :ref:`docs/software/vscode-overview/3rd-party-libraries:WPILib Command Libraries`.

Major Architectural Changes
---------------------------

The overall structure of the command-based framework has remained largely the same.  However, there are some still a few major architectural changes that users should be aware of:

Commands and Subsystems as Interfaces
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``Command`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/Command.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_command.html>`__) and ``Subsystem`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/Subsystem.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_subsystem.html>`__) are both now interfaces as opposed to abstract classes, allowing advanced users more potential flexibility.  ``CommandBase`` and ``SubsystemBase`` abstract base classes are still provided for convenience, but are not required.  For more information, see :doc:`commands` and :doc:`subsystems`.

Multiple Command Group Classes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``CommandGroup`` class no longer exists, and has been replaced by a number of narrower classes that can be recursively composed to create more-complicated group structures.  For more information see :doc:`command-groups`.

Inline Command Definitions
^^^^^^^^^^^^^^^^^^^^^^^^^^

Previously, users were required to write a subclass of ``Command`` in almost all cases where a command was needed.  Many of the new commands are designed to allow inline definition of command functionality, and so can be used without the need for an explicit subclass.  For more information, see :doc:`convenience-features`.

Injection of Command Dependencies
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

While not an actual change to the coding of the library, the recommended use pattern for the new command-based framework utilizes injection of subsystem dependencies into commands, so that subsystems are not declared as globals.  This is a cleaner, more maintainable, and more reusable pattern than the global subsystem pattern promoted previously.  For more information, see :doc:`structuring-command-based-project`.

Command Ownership (C++ Only)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The previous command framework required users to use raw pointers for all commands, resulting in nearly-unavoidable memory leaks in all C++ command-based projects, as well as leaving room for common errors such as double-allocating commands within command-groups.

The new command framework offers ownership management for all commands.  Default commands and commands bound to buttons are typically owned by the scheduler, and component commands are owned by their encapsulating command groups.  As a result, users should generally never heap-allocate a command with ``new`` unless there is a very good reason to do so.

Transfer of ownership is done using `perfect forwarding <https://cpppatterns.com/patterns/perfect-forwarding.html>`__, meaning rvalues will be *moved* and lvalues will be *copied* (`rvalue/lvalue explanation <http://thbecker.net/articles/rvalue_references/section_01.html>`__).

Changes to the Scheduler
------------------------

* ``Scheduler`` has been renamed to ``CommandScheduler`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/CommandScheduler.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_command_scheduler.html>`__).
* Interruptibility of commands is now the responsibility of the scheduler, not the commands, and can be specified during the call to ``schedule``.
* Users can now pass actions to the scheduler which are taken whenever a command is scheduled, interrupted, or ends normally.  This is highly useful for cases such as event logging.

Changes to Subsystem
--------------------

.. note:: For more information on subsystems, see :doc:`subsystems`.

* As noted earlier, ``Subsystem`` is now an interface (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/Subsystem.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_subsystem.html>`__); the closest equivalent of the old ``Subsystem`` is the new ``SubsystemBase`` class.  Many of the Sendable-related constructor overloads have been removed to reduce clutter; users can call the setters directly from their own constructor, if needed.
* ``initDefaultCommand`` has been removed; subsystems no longer need to "know about" their default commands, which are instead registered directly with the ``CommandScheduler``.  The new ``setDefaultCommand`` method simply wraps the ``CommandScheduler`` call.
* Subsystems no longer "know about" the commands currently requiring them; this is handled exclusively by the ``CommandScheduler``.  A convenience wrapper on the ``CommandScheduler`` method is provided, however.

Changes to Command
------------------

.. note:: For more information on commands, see :doc:`commands`.

* As noted earlier, ``Command`` is now an interface (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/Command.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc2_1_1_command.html>`__); the closest equivalent of the old ``Command`` is the new ``CommandBase`` class.  Many of the Sendable-related constructor overloads have been removed to reduce clutter; users can call the setters directly from their own constructor, if needed.
* Commands no longer handle their own scheduling state; this is now the responsibility of the scheduler.
* The ``interrupted()`` method has been rolled into the ``end()`` method, which now takes a parameter specifying whether the command was interrupted (``false`` if it ended normally).
* The ``requires()`` method has been renamed to ``addRequirement()``.
* ``void setRunsWhenDisabled(boolean disabled)`` has been replaced by an overrideable ``runsWhenDisabled()`` method.  Commands that should run when disabled should override this method to return true.
* ``void setInterruptible(boolean interruptible)`` has been removed; interruptibility is no longer an innate property of commands, and can be set when the command is scheduled.
* Several :ref:`"decorator" methods <docs/software/commandbased/convenience-features:Command Decorator Methods>` have been added to allow easy inline modification of commands (e.g. adding a timeout).
* (C++ only) In order to allow the decorators to work with the command ownership model, a :term:`CRTP` is used via the ``CommandHelper`` `class <https://github.com/wpilibsuite/allwpilib/blob/main/wpilibNewCommands/src/main/native/include/frc2/command/CommandHelper.h>`__.  Any user-defined Command subclass ``Foo`` *must* extend ``CommandHelper<Foo, Base>`` where ``Base`` is the desired base class.

Changes to PIDSubsystem/PIDCommand
----------------------------------

.. note:: For more information, see :doc:`pid-subsystems-commands`, and :ref:`docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib`

* Following the changes to PIDController, these classes now run synchronously from the main robot loop.
* The ``PIDController`` is now injected through the constructor, removing many of the forwarding methods.  It can be modified after construction with ``getController()``.
* ``PIDCommand`` is intended largely for inline use, as shown in the GyroDriveCommands example (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gyrodrivecommands>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/GyroDriveCommands>`__).
* If users wish to use PIDCommand more "traditionally," overriding the protected ``returnPIDInput()`` and ``usePIDOutput(double output)`` methods has been replaced by modifying the protected ``m_measurement`` and ``m_useOutput`` fields.  Similarly, rather than calling ``setSetpoint``, users can modify the protected ``m_setpoint`` field.
