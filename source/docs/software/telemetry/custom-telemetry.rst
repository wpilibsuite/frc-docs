# Logging and Tuning Custom Classes

Use ``TelemetryLoggable`` to describe the values a custom class records, and ``ComplexTunable`` to describe the values a dashboard can edit. A class can implement either interface or both. These interfaces replace the output and input responsibilities of the old ``Sendable`` interface.

## Implementing TelemetryLoggable

Implement ``logTo()`` (Java), ``LogTo() const`` (C++), or ``log_to()`` (Python) to write the object's current state into the provided table:

.. tab-set-code::
   ```java
   import org.wpilib.telemetry.TelemetryLoggable;
   import org.wpilib.telemetry.TelemetryTable;

   public class IntakeStatus implements TelemetryLoggable {
     public double speed;
     public boolean hasPiece;

     @Override
     public void logTo(TelemetryTable table) {
       table.log("speed", speed);
       table.log("hasPiece", hasPiece);
     }
   }
   ```

   ```c++
   #include <wpi/telemetry/TelemetryLoggable.hpp>
   #include <wpi/telemetry/TelemetryTable.hpp>

   class IntakeStatus : public wpi::telemetry::TelemetryLoggable {
    public:
     double speed = 0.0;
     bool hasPiece = false;

     void LogTo(wpi::telemetry::TelemetryTable& table) const override {
       table.Log("speed", speed);
       table.Log("hasPiece", hasPiece);
     }
   };
   ```

   ```python
   import telemetry

   class IntakeStatus(telemetry.TelemetryLoggable):
       def __init__(self):
           self.speed = 0.0
           self.has_piece = False

       def log_to(self, table):
           table.log("speed", self.speed)
           table.log("hasPiece", self.has_piece)
   ```

Update the object's fields and log it each cycle:

.. tab-set-code::
   ```java
   Telemetry.log("Intake", m_status);
   ```

   ```c++
   wpi::telemetry::Log("Intake", m_status);
   ```

   ```python
   telemetry.log("Intake", self.status)
   ```

With the default backend, this produces ``/Telemetry/Intake/speed`` and ``/Telemetry/Intake/hasPiece``. The table is supplied by the caller, so the class does not need to know its location in the robot's telemetry hierarchy.

An optional ``getTelemetryType()`` / ``GetTelemetryType() const`` / ``get_telemetry_type()`` method identifies the table's type to dashboards. Use a known widget type only when the object implements that widget's expected fields. Leave it unspecified for ordinary groups of values.

## Implementing ComplexTunable

Store editable values in tunable members and publish those members from ``publishTunable()`` (Java), ``PublishTunable()`` (C++), or ``publish_tunables()`` (Python):

.. tab-set-code::
   ```java
   import org.wpilib.tunable.ComplexTunable;
   import org.wpilib.tunable.TunableDouble;
   import org.wpilib.tunable.TunableTable;

   public class IntakeSettings implements ComplexTunable {
     public final TunableDouble speed = TunableDouble.create(0.5);

     @Override
     public void publishTunable(TunableTable table) {
       table.publish("speed", speed);
     }
   }
   ```

   ```c++
   #include <wpi/tunables/ComplexTunable.hpp>
   #include <wpi/tunables/Tunable.hpp>
   #include <wpi/tunables/TunableTable.hpp>

   class IntakeSettings : public wpi::tunables::ComplexTunable {
    public:
     wpi::tunables::TunableDouble speed{0.5};

     void PublishTunable(wpi::tunables::TunableTable& table) override {
       table.Publish("speed", speed);
     }
   };
   ```

   ```python
   import tunables

   class IntakeSettings(tunables.ComplexTunable):
       def __init__(self):
           self.speed = tunables.Tunable(0.5)

       def publish_tunables(self, table):
           table.publish("speed", self.speed)
   ```

Publish the settings object once during initialization with ``Tunables.publish("Intake", m_settings)``, ``wpi::tunables::Publish("Intake", m_settings)``, or ``tunables.publish("Intake", self.settings)``. Read the speed using the member's ``get()`` / ``Get()`` method where the robot uses it. The default backend exposes the setting at ``/Tunables/Intake/speed``.

The optional ``getTunableType()`` / ``GetTunableType() const`` / ``get_tunable_type()`` method supplies a dashboard widget type. If derived values need refreshing during registry updates, implement ``updateTunable()`` / ``UpdateTunable() const`` / ``update_tunables()``. Publishing and update methods must not throw exceptions. The publish method should describe all current children, since the backend can request it again when an object is republished.
