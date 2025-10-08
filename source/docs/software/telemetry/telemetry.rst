# Telemetry: Recording and Sending Real-Time Data

Recording and viewing :term:`telemetry` data is a crucial part of the engineering process - accurate telemetry data helps you tune your robot to perform optimally, and is indispensable for debugging your robot when it fails to perform as expected.

By default, no telemetry data is recorded (saved) on the robot.  However, recording data on the robot can provide benefits over recording on a dashboard, namely that more data can be recorded (there are no bandwidth limitations), and all the recorded data can be very accurately timestamped.  WPILib has integrated support for on-robot recording of telemetry data via the ``DataLogManager`` and ``DataLog`` classes and provides a tool for downloading data log files and converting them to CSV. The Java library also provides a convenient :doc:`annotation <robot-telemetry-with-annotations>` to autogenerate telemetry logging code based on your project.

.. note:: In addition to on-robot recording of telemetry data, teams can record their telemetry data on their driver station computer with :ref:`Shuffleboard recordings <docs/software/dashboards/shuffleboard/getting-started/shuffleboard-recording:Recording and Playback>`.

## Adding Telemetry to Robot Code

WPILib supports several different ways to record and send telemetry data from robot code.

At the most basic level, the :ref:`Riolog <docs/software/vscode-overview/viewing-console-output:Viewing Console Output>` provides support for viewing print statements from robot code.  This is useful for on-the-fly debugging of problematic code, but does not scale as console interfaces are not suitable for rich data streams.

WPILib supports several :ref:`dashboards <docs/software/dashboards/index:Dashboards>` that allow users to more easily send rich telemetry data to the driver-station computer.  All WPILib dashboards communicate with the :ref:`NetworkTables <docs/software/networktables/networktables-intro:What is NetworkTables>` protocol, and so they are *to some degree* interoperable (telemetry logged with one dashboard will be visible on the others, but the specific widgets/formatting will generally not be compatible).  NetworkTables (and thus all WPILib dashboards) support the following primitive data types:

* ``boolean``
* ``boolean[]``
* ``double``
* ``double[]``
* ``string``
* ``string[]``
* ``byte[]``

In addition to these primitive types, NetworkTables supports serialization of complex data types using **Struct** and **Protobuf** formats. Struct serialization is designed for fixed-size data structures and provides the fastest and most compact encoding. Protobuf serialization offers more flexibility for variable-size data. Many WPILib classes (such as ``Pose2d``, ``Rotation2d``, ``SwerveModuleState``, and other geometry/math types) implement the ``StructSerializable`` interface and can be sent directly over NetworkTables. Teams can also :doc:`create custom struct and protobuf serializers </docs/software/networktables/custom-serialization>` for their own data types.

Telemetry data can be sent to a WPILib dashboard using an associated WPILib method (for more details, see the documentation for the individual dashboard in question), or by :ref:`directly publishing to NetworkTables <docs/software/networktables/networktables-intro:what is networktables>`.

For *mutable* types from user code that need to interface directly with WPILib dashboards, the ``Sendable`` interface can be used, as described in the next article.
