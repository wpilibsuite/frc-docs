C++ Command Ownership Model
===========================

C++ Ownership Scope Semantics
-----------------------------

Unlike languages (such as Java and Python) that hide memory management from the programmer, C++ programmers must be conscious of memory management and object lifetimes.

When allocating on the stack, as following, the object is destroyed when it goes out of scope. In this case, ``x`` is destroyed when ``MyFunction`` returns:

.. code-block:: c++

   int* MyFunction() {
     int x = 3;
     // ...
     return &x; // invalid pointer -- using it will crash/"segfault"!!!
   } // x is destroyed here!

Thus, it is important to store objects in the correct scope so they aren't destroyed while they're used -- this causes a whole category of C++ bugs called "use after free".

Allocating on the heap (with ``new``) persists the object beyond the variable scope, but then the object must be destroyed manually, which is even more difficult to do at the right time: this can cause "use after free" bugs (if the object is destroyed too early) as well as memory leaks (if the object is not destroyed).

In summary, each object should always be _owned_ by a scope that dictates its lifetime and is responsible for automatically destroying it.


Ownership of Command Objects
----------------------------

The C++ Command-based framework often uses two types with vastly different ownership semantics:

- ``Command*`` is a raw pointer, non-owning: the command object is owned elsewhere.
- ``CommandPtr`` is an "smart" owning pointer (wrapper around ``std::unique_ptr``): whatever owns the ``CommandPtr`` transitively owns the command object.

In other words, functions that take/return a ``CommandPtr`` take/return _ownership_ of the command object, as opposed to functions taking/returning a ``Command*`` that don't transfer ownership.

For example, the :ref:`trigger bindings <docs/software/commandbased/binding-commands-to-triggers:Binding Commands to Triggers>` have overloads for both ``Command*`` and ``CommandPtr``.

Command*: Non-Owning
^^^^^^^^^^^^^^^^^^^^

Here, the command objects are defined as variables of the ``RobotContainer`` class, and therefore are owned by the ``RobotContainer`` object and exist as long as the robot code is running. The variables can be of a ``Command`` subclass (such as ``InstantCommand`` in the case of ``m_driveHalfSpeed`` and ``m_driveHalfSpeed``), or as ``CommandPtr`` (as in ``m_spinUpShooter`` and ``m_stopShooter``).

.. tab-set::

  .. tab-item:: Command Subclass
    :sync: tabcode-subclass

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/StateSpaceDifferentialDriveSimulation/include/RobotContainer.h
         :language: cpp
         :lines: 26, 34, 43-46
         :linenos:
         :lineno-start: 26

  .. tab-item:: CommandPtr
     :sync: tabcode-ptr

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/Frisbeebot/include/RobotContainer.h
         :language: cpp
         :lines: 25, 32, 41-49
         :linenos:
         :lineno-start: 25

To get a ``Command*``, use ``&`` (address-of operator) in case of a ``Command`` subclass or ``.get()`` in case of a ``CommandPtr``, and pass it the trigger binding method (such as ``OnTrue``):

.. tab-set::

  .. tab-item:: Command Subclass
    :sync: tabcode-subclass

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/StateSpaceDifferentialDriveSimulation/cpp/RobotContainer.cpp
         :language: cpp
         :lines: 50-58
         :linenos:
         :lineno-start: 50

  .. tab-item:: CommandPtr
     :sync: tabcode-ptr

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/Frisbeebot/cpp/RobotContainer.cpp
         :language: cpp
         :lines: 22-31
         :linenos:
         :lineno-start: 22


Since the command was passed as a ``Command*``, ownership is not transferred and the program relies on the command being owned in an appropriate scope. If the command object were to be defined in a different scope and get destroyed, this would be a use-after-free and the program would crash or otherwise misbehave ("Undefined Behavior").

CommandPtr: Owning
^^^^^^^^^^^^^^^^^^

Here, commands are defined as ``CommandPtr`` and _moved_ into the binding, ownership is passed to the scheduler.

.. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Frisbeebot/cpp/RobotContainer.cpp
   :language: c++
   :lines: 22, 33-52
   :linenos:
   :lineno-start: 22

Note the calls to ``std::move`` that hint at the ownership move.

The ``shoot`` and ``stopFeeder`` variables will be destroyed when the function returns, but this isn't a problem because the object was moved (with ``std::move``) into the function. However, these variables are now in an invalid state and must not be used! Similar to use-after-free, using them would cause crashes or other undefined behavior: this is called use-after-move.

To avoid the risk of use-after-move and invalid variables, ``CommandPtr`` expressions can also be passed inline:

.. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Frisbeebot/cpp/RobotContainer.cpp
   :language: c++
   :lines: 22, 54-60
   :linenos:
   :lineno-start: 22

It's also possible to convert ``Command`` subclasses to ``CommandPtr`` using ``.ToPtr()``:

.. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/GearsBot/cpp/RobotContainer.cpp
   :language: c++
   :lines: 37
   :linenos:
   :lineno-start: 37

Ownership in Compositions
-------------------------

As described in :ref:`docs/software/commandbased/command-compositions:Command Compositions`, command instances that have been passed to a command composition cannot be independently scheduled or passed to a second command composition. In C++, this interacts nicely with the ownership model: each composition owns its components! This way, double-composition bugs are nearly inexistent in C++ (whereas they pose a common error in Java).

Therefore, compositions only take ``CommandPtr``s and not ``Command*``:

.. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/MecanumControllerCommand/cpp/RobotContainer.cpp
   :language: c++
   :lines: 112-121
   :linenos:
   :lineno-start: 112

Ownership of Default Commands
-----------------------------

All default commands are owned by the scheduler, therefore, ``SetDefaultCommand`` only takes a ``CommandPtr`` and not a ``Command*``:

.. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/ArmBot/cpp/RobotContainer.cpp
   :language: c++
   :lines: 22-27
   :linenos:
   :lineno-start: 22
