# Migrating from SmartDashboard and Sendable

The SmartDashboard, Sendable, and SendableChooser APIs have been replaced by :doc:`telemetry`, :doc:`tunables`, and :doc:`selectable`. Choose the replacement based on whether data flows out of the robot or can be edited by a dashboard.

.. list-table:: API Replacements
   :header-rows: 1
   :widths: 30 35 35

   * - Previous Use
     - Replacement
     - When to Call
   * - ``SmartDashboard.putNumber()`` / ``putBoolean()`` / ``putString()`` for display
     - ``Telemetry.log()`` / ``wpi::telemetry::Log()`` / ``telemetry.log()``
     - Each time a new sample should be recorded, usually in a periodic method.
   * - ``SmartDashboard.getNumber()`` and other editable dashboard values
     - ``Tunables.addDouble()`` / ``wpi::tunables::Add<double>()`` / ``tunables.add_double()``, then read the returned tunable
     - Create once during initialization; read with ``get()`` / ``Get()`` as needed.
   * - ``SmartDashboard.putData()`` for output, including ``Mechanism2d`` and read-only ``Field2d``
     - Log the object through Telemetry
     - Each periodic cycle, after updating the object.
   * - ``SmartDashboard.putData()`` for editable objects, including PID controllers and editable ``Field2d``
     - ``Tunables.publish()`` / ``wpi::tunables::Publish()`` / ``tunables.publish()``
     - Once during initialization; the framework updates the publication.
   * - ``Sendable`` getters used for display
     - ``TelemetryLoggable``
     - Implement ``logTo()`` / ``LogTo()`` / ``log_to()`` and log the object periodically.
   * - ``Sendable`` setters used for dashboard input
     - ``ComplexTunable``
     - Implement ``publishTunable()`` / ``PublishTunable()`` / ``publish_tunables()`` and publish the object once.
   * - ``SendableChooser``
     - ``Selectable``
     - Add options, publish once through Tunables, then read the selection where needed.

The C++ APIs take objects by reference: use ``wpi::telemetry::Log("Field", m_field)`` or ``wpi::tunables::Publish("Field", m_field)``, rather than passing ``&m_field`` as was common with ``PutData()``.

For Selectable, replace ``addOption()`` / ``AddOption()`` with ``add()`` / ``Add()``, and ``setDefaultOption()`` / ``SetDefaultOption()`` with ``addDefault()`` / ``AddDefault()``. Python uses ``add()`` and ``add_default()``. The selected value is still retrieved with ``getSelected()`` / ``GetSelected()`` / ``get_selected()``.

## Updating Dashboard Layouts

The standard robot framework sends Telemetry to ``/Telemetry`` and Tunables to ``/Tunables``. For example, a displayed ``"Drive/speed"`` value moves from ``/SmartDashboard/Drive/speed`` to ``/Telemetry/Drive/speed``. An editable ``"Drive/maxOutput"`` value belongs under ``/Tunables/Drive/maxOutput``. Update saved dashboard sources to use the new paths.

Do not replace a one-time ``putData()`` call with a one-time telemetry call for an object that changes. Telemetry records a snapshot; the object must be logged again to display later changes. Conversely, do not recreate tunables or publish the same object every cycle.

Automatic LiveWindow publication is no longer provided. Explicitly log hardware and subsystem state, and publish objects that should be editable. See :doc:`/docs/software/dashboards/glass/command-based-widgets` for command and scheduler examples, and :doc:`custom-telemetry` for migrating user-defined Sendable classes.

The removal of the SmartDashboard desktop application is separate from these API changes. Use a supported :doc:`dashboard </docs/software/dashboards/dashboard-intro>` to display the new APIs' NetworkTables data.
