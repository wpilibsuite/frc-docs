.. include:: <isonum.txt>

Built-in Plugins
================

Shuffleboard provides a number of built-in plugins that handle common tasks for FRC\ |reg| use, such as camera streams, all widgets, and :term:`NetworkTables` connections.

Base Plugin
-----------

The base plugin defines all the data types, widgets, and layouts necessary for FRC use. It does *not* define any of the source types, or any special data types or widgets for those source types. Those are handled by the `NetworkTables Plugin`_ and the `CameraServer Plugin`_. This separation of concerns makes it easier for teams to create plugins for custom source types or protocols (eg HTTP, ZeroMQ) for the FRC data types without needing a NetworkTables client.


CameraServer Plugin
-------------------

The camera server plugin provides sources and widgets for viewing camerastreams from the ``CameraServer`` WPILib class.

This plugin depends on the `NetworkTables Plugin`_ in order to discover the available camera streams.

Stream discovery
^^^^^^^^^^^^^^^^

CameraServer sources are automatically discovered by looking at the
``/CameraPublisher`` NetworkTable.

::

   /CameraPublisher
     /<camera name>
       streams=["url1", "url2", ...]

For example, a camera named "Camera" with a server at
``roborio-0000-frc.local`` would have this table layout:

::

   /CameraPublisher
     /Camera
       streams=["mjpeg:http://roborio-0000-frc.local:1181/?action=stream"]

This setup will automatically discover all camera streams hosted on a roboRIO by the CameraServer class in WPILib. Any non-WPILib projects that want to have camera streams appear in shuffleboard will have to set the streams entry for the camera server.

NetworkTables Plugin
--------------------

The NetworkTables plugin provides data sources backed by ntcore. Since the ``LiveWindow``, ``SmartDashboard``, and ``Shuffleboard`` classes in WPILib use NetworkTables to send the data to the driver station, this plugin will need to be loaded in order to use those classes.

This plugin handles the connection and reconnection to NetworkTables automatically, users of shuffleboard and writers of custom plugins will not have to worry about the intricacies of the NetworkTables protocol.
