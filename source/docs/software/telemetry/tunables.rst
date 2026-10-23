# Dashboard Input with Tunables

A tunable is a value that robot code and a dashboard can both change. Use tunables for runtime settings such as PID gains, speed limits, and setpoints. Use :doc:`telemetry` to record output that the dashboard should only observe.

The Java API is in ``org.wpilib.tunable``. The C++ API is in ``wpi::tunables``, with headers under ``wpi/tunables/``. Python uses the ``tunables`` module.

## Creating and Reading a Tunable

Create the tunable once, during robot or subsystem initialization, and retain the returned object. Read its current value where the robot uses the setting:

.. tab-set-code::
   ```java
   import org.wpilib.tunable.TunableDouble;
   import org.wpilib.tunable.Tunables;

   private final TunableDouble m_maxOutput = Tunables.addDouble("Drive/maxOutput", 0.5);

   // When calculating the drive output:
   double output = requestedOutput * m_maxOutput.get();
   ```

   ```c++
   #include <wpi/tunables/Tunables.hpp>

   wpi::tunables::TunableDouble m_maxOutput =
       wpi::tunables::Add<double>("Drive/maxOutput", 0.5);

   // When calculating the drive output:
   double output = requestedOutput * m_maxOutput.Get();
   ```

   ```python
   import tunables

   # In initialization:
   self.max_output = tunables.add_double("Drive/maxOutput", 0.5)

   # When calculating the drive output:
   output = requested_output * self.max_output.get()
   ```

The standard robot framework publishes this value at ``/Tunables/Drive/maxOutput`` in NetworkTables. Change it in a dashboard to adjust the value returned to robot code. To change it from robot code, call ``set()`` / ``Set()`` / ``set()`` on the tunable. C++ also supports assignment and implicit conversion to the underlying value.

.. important:: Do not recreate the tunable or set it back to its initial value every cycle. Create it once and read it as needed so dashboard edits remain effective.

Java has specialized wrappers for primitive types, including ``TunableBoolean``, ``TunableInt``, and ``TunableDouble``, plus ``Tunable<T>`` for other supported values. C++ uses ``Tunable<T>`` with aliases such as ``TunableDouble``. Python uses ``Tunable`` and provides helpers such as ``add_double()``. Arrays and struct-serializable values are also supported.

Tunables do not automatically persist settings across robot program restarts. Use :doc:`/docs/software/basic-programming/robot-preferences` for settings that need to survive a restart.

## Publishing an Existing Object

Objects implementing ``ComplexTunable`` expose a group of editable values. For example, publish a PID controller once to let the dashboard edit its gains:

.. tab-set-code::
   ```java
   // In initialization:
   Tunables.publish("Drive/PID", m_controller);
   ```

   ```c++
   // In initialization; pass the controller by reference.
   wpi::tunables::Publish("Drive/PID", m_controller);
   ```

   ```python
   # In initialization:
   tunables.publish("Drive/PID", self.controller)
   ```

The same pattern publishes a :doc:`Selectable <selectable>` or an editable :doc:`Field2d </docs/software/dashboards/glass/field2d-widget>`. Keep the published object alive for as long as it is in use. In C++, the backend does not take ownership of an object passed by reference. Remove a publication with ``Tunables.remove(name)`` / ``wpi::tunables::Remove(name)`` / ``tunables.remove(name)`` when it is no longer needed.

``Tunables.getTable("Drive")`` / ``wpi::tunables::GetTable("Drive")`` / ``tunables.get_table("Drive")`` creates a table for grouping settings. Publishing ``"PID"`` through that table is equivalent to publishing ``"Drive/PID"`` through the root API. See :doc:`custom-telemetry` for implementing your own ``ComplexTunable``.

## Update Timing

Publishing registers the tunable with a backend. ``TunableRegistry.update()`` applies incoming dashboard changes and updates published values. ``TimedRobot`` and ``OpModeRobot`` call it automatically as part of their normal loop. Custom loops and standalone tests must call ``TunableRegistry.update()`` (Java), ``wpi::tunables::TunableRegistry::Update()`` (C++), or ``tunables.TunableRegistry.update()`` (Python) themselves.

Tuning callbacks run on the thread that calls the registry update, normally the main robot thread. Ordinary tunables are not internally thread-safe. Keep access in the main robot loop, or synchronize all competing accesses when sharing tunables with another thread.

## Configuring Tunables

Java's ``TunableConfig`` and ``TunableOption``, C++'s ``TunableConfig``, and Python keyword arguments can configure mutability, metadata, polling, and tuning callbacks. An immutable tunable rejects remote edits. A robust tunable uses separate request and accepted-value topics so dashboards can distinguish a requested change from the value accepted by the robot.

Getters and setters can connect an existing field to a tunable. Java provides methods such as ``Tunables.publishDouble(name, getter, setter)``. C++ can publish a member through a ``ComplexTunable`` with ``table.Publish(name, this, &Class::member)``. Python provides ``table.publish_double(name, getter, setter)``. Getters, setters, and tuning callbacks should be short and must not throw exceptions.

In C++, a plain member changed directly by robot code needs ``SetChildTunableChanged(name)`` or an ``AlwaysGet()`` configuration so the backend sees the change. Using a ``Tunable<T>`` member handles this tracking automatically.
