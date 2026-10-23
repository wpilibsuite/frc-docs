# Telemetry: Recording and Sending Real-Time Data

Recording and viewing :term:`telemetry` data helps you tune your robot and diagnose unexpected behavior. WPILib's Telemetry API sends values to dashboards or log files without requiring robot code to manage individual NetworkTables publishers or data log entries.

Use Telemetry for output from the robot, such as sensor readings, calculated poses, and status information. Use :doc:`tunables` for values that a dashboard can change, such as PID gains, and :doc:`selectable` for choosing among named options. These APIs replace the SmartDashboard, Sendable, and SendableChooser APIs; see :doc:`migration` for the corresponding operations.

## Logging Values

Call ``Telemetry.log()`` (Java), ``wpi::telemetry::Log()`` (C++), or ``telemetry.log()`` (Python) whenever you want to record a value. For continuously changing values, call it from a periodic method:

.. tab-set-code::
   ```java
   import org.wpilib.telemetry.Telemetry;

   // In robotPeriodic() or subsystem periodic():
   Telemetry.log("Drive/speed", m_drive.getSpeed());
   Telemetry.log("Drive/ready", m_drive.isReady());
   ```

   ```c++
   #include <wpi/telemetry/Telemetry.hpp>

   // In RobotPeriodic() or subsystem Periodic():
   wpi::telemetry::Log("Drive/speed", m_drive.GetSpeed());
   wpi::telemetry::Log("Drive/ready", m_drive.IsReady());
   ```

   ```python
   import telemetry

   # In robot_periodic() or subsystem periodic():
   telemetry.log("Drive/speed", self.drive.get_speed())
   telemetry.log("Drive/ready", self.drive.is_ready())
   ```

The standard WPILib robot framework configures a NetworkTables backend under ``/Telemetry``. With this configuration, the values above appear at ``/Telemetry/Drive/speed`` and ``/Telemetry/Drive/ready``. They can be viewed in :doc:`/docs/software/dashboards/glass/index`, :doc:`/docs/software/dashboards/elastic`, :doc:`/docs/software/dashboards/advantagescope`, or another NetworkTables client.

.. important:: Logging an object records its current state. It does not register the object for automatic updates. Call ``log()`` each cycle to display changes, including changes to ``Field2d`` and ``Mechanism2d`` objects.

## Organizing Values with Tables

A ``TelemetryTable`` groups related values. Table names can contain slashes to create a hierarchy. These examples write to the same paths as the previous examples:

.. tab-set-code::
   ```java
   import org.wpilib.telemetry.TelemetryTable;

   private final TelemetryTable m_driveTelemetry = Telemetry.getTable("Drive");

   // In periodic():
   m_driveTelemetry.log("speed", m_drive.getSpeed());
   m_driveTelemetry.log("ready", m_drive.isReady());
   ```

   ```c++
   wpi::telemetry::TelemetryTable& m_driveTelemetry =
       wpi::telemetry::GetTable("Drive");

   // In Periodic():
   m_driveTelemetry.Log("speed", m_drive.GetSpeed());
   m_driveTelemetry.Log("ready", m_drive.IsReady());
   ```

   ```python
   # In initialization:
   self.drive_telemetry = telemetry.get_table("Drive")

   # In periodic():
   self.drive_telemetry.log("speed", self.drive.get_speed())
   self.drive_telemetry.log("ready", self.drive.is_ready())
   ```

Call ``getTable()`` / ``GetTable()`` / ``get_table()`` on a table to obtain a child table. The backend determines the destination prefix; you do not need to include ``Telemetry`` in each name.

## Structured Values and Objects

Telemetry supports booleans, numbers, strings, raw bytes, arrays, and structured values. For example, a ``Pose2d`` can be logged directly for visualization in AdvantageScope:

.. tab-set-code::
   ```java
   Telemetry.log("Drive/pose", m_odometry.getPoseMeters());
   ```

   ```c++
   #include <wpi/math/geometry/struct/Pose2dStruct.hpp>

   wpi::telemetry::Log("Drive/pose", m_odometry.GetPose());
   ```

   ```python
   telemetry.log("Drive/pose", self.odometry.get_pose())
   ```

Java discovers serializers for objects implementing ``StructSerializable`` or ``ProtobufSerializable``, and also accepts an explicit serializer such as ``Pose2d.struct``. C++ uses the type's struct or protobuf serialization support; include the appropriate serialization header. Python supports ``WPIStruct`` objects and requires an explicit ``element_type`` for sequences, for example ``telemetry.log("Drive/speeds", [1.0, 2.0], element_type=float)``.

Objects implementing ``TelemetryLoggable`` log multiple fields into a subtable. WPILib provides implementations for many library classes, including :doc:`Field2d </docs/software/dashboards/glass/field2d-widget>` and :doc:`Mechanism2d </docs/software/dashboards/glass/mech2d-widget>`. See :doc:`custom-telemetry` to add this behavior to your own classes.

## Recording Data and Choosing a Backend

The default telemetry backend publishes to NetworkTables. To also save that data on the robot, start :doc:`DataLogManager <datalog>`; its default configuration records NetworkTables values. On-robot recording avoids losing samples because of a dashboard disconnection and lets you analyze data after a run.

Advanced applications can use ``TelemetryRegistry`` to route a path prefix to a different backend. WPILib includes ``NetworkTablesTelemetryBackend``, ``DataLogTelemetryBackend``, ``MultiTelemetryBackend``, ``DiscardTelemetryBackend``, and ``MockTelemetryBackend``. For example, a data log backend can record high-rate data directly to disk without sending it over the radio. Registering a more specific path prefix overrides the backend for that subtree. Standalone programs and tests that do not use the robot framework must configure their own backend.

Java users can also use :doc:`robot-telemetry-with-annotations` to generate periodic logging calls. For advanced transport or subscription needs, the :doc:`NetworkTables </docs/software/networktables/networktables-intro>` and :doc:`DataLog <datalog>` APIs remain available directly.
