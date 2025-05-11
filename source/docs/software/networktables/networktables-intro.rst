# What is NetworkTables

:term:`NetworkTables` is an implementation of a [publish-subscribe messaging system](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern). Values are published to named "topics" either on the robot, driver station, or potentially an attached coprocessor, and the values are automatically distributed to all subscribers to the topic. For example, a driver station laptop might receive camera images over the network, perform some vision processing algorithm, and come up with some values to sent back to the robot. The values might be an X, Y, and Distance. By writing these results to NetworkTables topics called "X", "Y", and "Distance" they can be read by the robot shortly after being written. Then the robot can act upon them. Similarly, the robot program can write sensor values to topics and those can be read and plotted in real time on a dashboard application.

NetworkTables can be used by programs on the robot in Java, C++, or LabVIEW, and is built into each version of WPILib.

.. note:: NetworkTables has changed substantially in 2023. For more information on migrating pre-2023 code to use the new features, see :ref:`docs/software/networktables/nt4-migration-guide:migrating from networktables 3.0 to networktables 4.0`.

## NetworkTables Concepts

First, let's define some terms:

- **Topic**: a named data channel. Topics have a fixed data type (for the lifetime of the topic) and :term:`mutable` properties.
- **Publisher**: defines the topic and creates and sends timestamped data values.
- **Subscriber**: receives timestamped data value updates to one or more topics.
- **Entry**: a combined publisher and subscriber. The subscriber is always active, but the publisher is not created until a publish operation is performed (e.g. a value is "set", aka published, on the entry). This may be more convenient than maintaining a separate publisher and subscriber.
- **Property**: named information (metadata) about a topic stored and updated separately from the topic's data. A topic may have any number of properties. A property's value can be any data type that can be represented in JSON.

NetworkTables supports a range of data types, including :term:`boolean`, numeric, string, and arrays of those types. Supported numeric data types are single or double precision :term:`floating point`, or 64-bit integer. There is also the option of storing raw data (an array of bytes), which can be used for representing binary encoded structured data. Types are represented as strings for efficiency reasons. There is also an :term:`enumeration` for the most common types in the NetworkTables API.

Topics are created when the first publisher announces the topic and are removed when the last publisher stops publishing. It's possible to subscribe to a topic that has not yet been created/published.

Topics have properties. Properties are initially set by the first publisher, but may be changed at any time. Similarly to values, property changes to a topic are propagated to all subscribers to that topic. Properties are structured data (JSON), but at the top level are simply a key/value store (a JSON map). Some properties have defined behavior, but arbitrary ones can be set by the application.

Publishers specify the topic's data type; while there can be multiple publishers to a single topic, they must all be publishing the same data type. This is enforced by the NetworkTables server (the first publisher "wins"). Typically single-topic subscribers also specify what data type they're expecting to receive on a topic and thus won't receive value updates of other types.

The [Network Tables Protocol Specification](https://github.com/wpilibsuite/allwpilib/blob/main/ntcore/doc/networktables4.adoc) contains detailed documentation on the current wire protocol.

## Retained and Persistent Topics

While by default topics are :term:`transitory` and disappear after the last publisher stops publishing, topics can be marked as :term:`retained` (via setting the "retained" property to true) to prevent them from disappearing. For retained topics, the server acts as an implicit publisher of the last value, and will keep doing so as long as the server is running. This is primarily useful for configuration values; e.g. an autonomous mode selection published by a dashboard should set the topic as retained so its value is preserved in case the dashboard disconnects.

Additionally, topics can be marked as :term:`persistent` via setting the "persistent" property to true. These operate similarly to retained topics, but in addition, persistent topic values are automatically saved to a file on the server and when the server starts up again, the topic is created and its last value is published by the server.

## Value Propagation

The server keeps a copy of the last published value for every topic. When a subscriber initially subscribes to a topic, the server sends the last published value. After that initial value, new value updates are communicated to subscribers each time the publisher sends a new value.

NetworkTables is a client/server system; clients do not talk directly to each other, but rather communicate via the server. Typically, the robot program is the server, and other pieces of software on other computers (e.g. the driver station or a coprocessor) are clients that connect to it. Thus, when a coprocessor (client) publishes a value, the value is sent first from the coprocessor (client) to the robot program (server), and then the robot program distributes that value to any subscribers (e.g. the robot program local program, or other clients such as dashboards).

The server does not send topic changes or value updates to clients that have not subscribed to the topic.

By default, NetworkTables sends value updates periodically, batching the data to help limit the number of small packets being sent over the network. Also, by default, only the most recent value is transmitted; any intermediate value changes made between network transmissions are discarded. This behavior can be changed via publish/subscribe options--publishers and subscribers can indicate that all value updates should be preserved and communicated via the "send all" option. In addition, it is possible to force NetworkTables to "flush" all current updates to the network; this is useful for minimizing latency.

## Timestamps

All NetworkTable value updates are timestamped at the time they are published. Timestamps in NetworkTables are measured in integer microseconds.

NetworkTables automatically synchronizes time between the server and clients. Each client maintains an offset between the client local time and the server time, so when a client publishes a value, it stores a timestamp in local time and calculates the equivalent server timestamp. The server timestamp is what is communicated over the network to any subscribers. This makes it possible e.g. for a robot program to get a reasonable estimation of the time when a value was published on a coprocessor relative to the current time.

Because of this, two timestamps are visible through the API: a server timestamp indicating the time (estimated) on the server, and a local timestamp indicating the time on the client. When the RoboRIO is the NetworkTables server, the server timestamp is the same as the FPGA timestamp returned by ``Timer.getFPGATimestamp()`` (except the units are different: NetworkTables uses microseconds, while ``getFPGATimestamp()`` returns seconds).

## NetworkTables Organization

Data is organized in NetworkTables in a hierarchy much like a filesystem's folders and files. There can be multiple subtables (folders) and topics (files) that may be nested in whatever way fits the data organization desired. At the top level (``NetworkTableInstance``: [Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/NetworkTableInstance.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_network_table_instance.html), :external:py:class:`Python <ntcore.NetworkTableInstance>`), topic names are handled similar to absolute paths in a filesystem: subtables are represented as a long topic name with slashes ("/") separating the nested subtable and value names. A ``NetworkTable`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/NetworkTable.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_network_table.html), :external:py:class:`Python <ntcore.NetworkTable>`) object represents a single subtable (folder), so topic names are relative to the NetworkTable's base path: e.g. for a root table called "SmartDashboard" with a topic named "xValue", the same topic can be accessed via ``NetworkTableInstance`` as a topic named "/SmartDashboard/xValue". However, unlike a filesystem, subtables don't really exist in the same way folders do, as there is no way to represent an empty subtable on the network--a subtable "appears" only as long as there are topics published within it.

:ref:`docs/software/wpilib-tools/outlineviewer/index:outlineviewer` is a utility for exploring the values stored in NetworkTables, and can show either a flat view (topics with absolute paths) or a nested view (subtables and topics).

There are some default tables that are created automatically when a robot program starts up:

+-----------------+--------------------------+
| Table name      | Use                      |
+=================+==========================+
| /SmartDashboard | Used to store values     |
|                 | written to the           |
|                 | SmartDashboard or        |
|                 | Shuffleboard using the   |
|                 | ``SmartDashboard.put()`` |
|                 | set of methods.          |
+-----------------+--------------------------+
| /LiveWindow     | Used to store Test mode  |
|                 | (Test on the Driver      |
|                 | Station) values.         |
|                 | Typically these are      |
|                 | Subsystems and the       |
|                 | associated sensors and   |
|                 | actuators.               |
+-----------------+--------------------------+
| /FMSInfo        | Information about the    |
|                 | currently running match  |
|                 | that comes from the      |
|                 | Driver Station and the   |
|                 | Field Management System  |
+-----------------+--------------------------+

## NetworkTables API Variants

There are two major variants of the NetworkTables API. The object-oriented API (C++ and Java) is recommended for robot code and general team use, and provides classes that help ensure correct use of the API. For advanced use cases such as writing object-oriented wrappers for other programming languages, there's also a C/C++ handle-based API.

## Lifetime Management

Publishers, subscribers, and entries only exist as long as the objects exist.

In Java, a common bug is to create a subscriber or publisher and not properly release it by calling ``close()``, as this will result in the object lingering around for an unknown period of time and not releasing resources properly. This is less common of an issue in robot programs, as long as the publisher or subscriber object is stored in an instance variable that persists for the life of the program.

In C++, publishers, subscribers, and entries are :term:`RAII`, which means they are automatically destroyed when they go out of scope. ``NetworkTableInstance`` is an exception to this; it is designed to be explicitly destroyed, so it's not necessary to maintain a global instance of it.

Python is similar to Java, except that subscribers or publishers are released when they are garbage collected.
