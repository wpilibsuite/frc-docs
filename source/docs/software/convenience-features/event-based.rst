Event-Based Programming With EventLoop
======================================

Many operations in robot code are driven by certain conditions; buttons are one common example. Conditions can be polled with an :term:`imperative programming` style by using an ``if`` statement in a periodic method. As an alternative, WPILib offers an :term:`event-driven programming` style of API in the shape of the ``EventLoop`` and ``BooleanEvent`` classes.

.. note:: The example code here is taken from the EventLoop example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/eventloop/Robot.java>`__/`C++ <https://github.com/wpilibsuite/allwpilib/blob/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibcExamples/src/main/cpp/examples/EventLoop/cpp/Robot.cpp>`__).

EventLoop
---------

The ``EventLoop`` class is a "container" for pairs of conditions and actions, which can be polled using the ``poll()``/``Poll()`` method. When polled, every condition will be queried and if it returns ``true`` the action associated with the condition will be executed.

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/eventloop/Robot.java
         :language: java
         :lines: 33-33, 86-90

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibcExamples/src/main/cpp/examples/EventLoop/cpp/Robot.cpp
         :language: cpp
         :lines: 94-94, 81-81

.. warning:: The ``EventLoop``'s ``poll()`` method should be called consistently in a ``*Periodic()`` method. Failure to do this will result in unintended loop behavior.

BooleanEvent
------------

The ``BooleanEvent`` class represents a boolean condition: a ``BooleanSupplier`` (`Java <https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/BooleanSupplier.html>`__) / ``std::function<bool()>`` (C++).

To bind a callback action to the condition, use ``ifHigh()``/``IfHigh()``:

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/eventloop/Robot.java
         :language: java
         :lines: 71-77

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibcExamples/src/main/cpp/examples/EventLoop/cpp/Robot.cpp
         :language: cpp
         :lines: 64-72

Remember that button binding is *declarative*: bindings only need to be declared once, ideally some time during robot initialization. The library handles everything else.

Composing Conditions
--------------------

``BooleanEvent`` objects can be composed to create composite conditions. In C++ this is done using operators when applicable, other cases and all compositions in Java are done using methods.

and() / &&
^^^^^^^^^^

The ``and()``/``&&`` composes two ``BooleanEvent`` conditions into a third condition that returns ``true`` only when **both** of the conditions return ``true``.

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/eventloop/Robot.java
         :language: java
         :lines: 44-49

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibcExamples/src/main/cpp/examples/EventLoop/cpp/Robot.cpp
         :language: cpp
         :lines: 35-40

or() / ||
^^^^^^^^^

The ``or()``/``||`` composes two ``BooleanEvent`` conditions into a third condition that returns ``true`` only when **either** of the conditions return ``true``.

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/eventloop/Robot.java
         :language: java
         :lines: 51-56

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibcExamples/src/main/cpp/examples/EventLoop/cpp/Robot.cpp
         :language: cpp
         :lines: 42-47

negate() / !
^^^^^^^^^^^^

The ``negate()``/``!`` composes one ``BooleanEvent`` condition into another condition that returns the opposite of what the original conditional did.

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/eventloop/Robot.java
         :language: java
         :lines: 46-47

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibcExamples/src/main/cpp/examples/EventLoop/cpp/Robot.cpp
         :language: cpp
         :lines: 37-38

debounce() / Debounce()
^^^^^^^^^^^^^^^^^^^^^^^

To avoid rapid repeated activation, conditions (especially those originating from digital inputs) can be debounced with the :ref:`WPILib Debouncer class <docs/software/advanced-controls/filters/debouncer:Debouncer>` using the `debounce` method:

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/eventloop/Robot.java
         :language: java
         :lines: 71-74

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibcExamples/src/main/cpp/examples/EventLoop/cpp/Robot.cpp
         :language: cpp
         :lines: 64-69

rising(), falling()
^^^^^^^^^^^^^^^^^^^

Often times it is desired to bind an action not to the *current* state of a condition, but instead to when that state *changes*. For example, binding an action to when a button is newly pressed as opposed to when it is held. This is what the ``rising()`` and ``falling()`` decorators do: ``rising()`` will return a condition that is ``true`` only when the original condition returned ``true`` in the *current* polling and ``false`` in the *previous* polling; ``falling()`` returns a condition that returns ``true`` only on a transition from ``true`` to ``false``.

.. warning:: Due to the "memory" these conditions have, do not use the same instance in multiple places.

.. tabs::

   .. group-tab:: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/eventloop/Robot.java
         :language: java
         :lines: 79-83

   .. group-tab:: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/1bde262450b3fcd89285e61c9aa154c25059a6e1/wpilibcExamples/src/main/cpp/examples/EventLoop/cpp/Robot.cpp
         :language: cpp
         :lines: 74-78

Downcasting ``BooleanEvent`` Objects
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To convert ``BooleanEvent`` objects to other types, most commonly the ``Trigger`` subclass used for :ref:`binding commands to conditions <docs/software/commandbased/binding-commands-to-triggers:Binding Commands to Triggers>`, the generic ``castTo()``/``CastTo()`` decorator exists:

.. tabs::

  .. code-tab:: java

    Trigger trigger = booleanEvent.castTo(Trigger::new);

  .. code-tab:: c++

    frc2::Trigger trigger = booleanEvent.CastTo<frc2::Trigger>();

.. note:: In Java, the parameter expects a method reference to a constructor accepting an ``EventLoop`` instance and a ``BooleanSupplier``. Due to the lack of method references, this parameter is defaulted in C++ as long as a constructor of the form ``Type(frc::EventLoop*, std::function<bool()>)`` exists.
