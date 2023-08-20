Migrating from NetworkTables 3.0 to NetworkTables 4.0
=====================================================

NetworkTables 4.0 (new for 2023) has a number of significant API breaking changes from NetworkTables 3.0, the version of NetworkTables used from 2016-2022.

NetworkTableEntry
-----------------

While ``NetworkTableEntry`` can still be used (for backwards compatibility), users are encouraged to migrate to use of type-specific Publisher/Subscriber/Entry classes as appropriate, or if necessary, ``GenericEntry`` (see :ref:`docs/software/networktables/publish-and-subscribe:publishing and subscribing to a topic`. It's important to note that unlike ``NetworkTableEntry``, these classes need to have appropriate lifetime management. Some functionality (e.g. persistent settings) has also moved to ``Topic`` properties (see :ref:`docs/software/networktables/tables-and-topics:networktables tables and topics`).

NT3 code (was):

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Example {
              final NetworkTableEntry yEntry;
              final NetworkTableEntry outEntry;

              public Example() {
                NetworkTableInstance inst = NetworkTableInstance.getDefault();

                // get the subtable called "datatable"
                NetworkTable datatable = inst.getTable("datatable");

                // get the entry in "datatable" called "Y"
                yEntry = datatable.getEntry("Y");

                // get the entry in "datatable" called "Out"
                outEntry = datatable.getEntry("Out");
              }

              public void periodic() {
                // read a double value from Y, and set Out to that value multiplied by 2
                double value = yEntry.getDouble(0.0);  // default to 0
                outEntry.setDouble(value * 2);
              }
            }

    .. group-tab:: C++

        .. code-block:: cpp

            class Example {
              nt::NetworkTableEntry yEntry;
              nt::NetworkTableEntry outEntry;

             public:
              Example() {
                nt::NetworkTableInstance inst = nt::NetworkTableInstance::GetDefault();

                // get the subtable called "datatable"
                auto datatable = inst.GetTable("datatable");

                // get the entry in "datatable" called "Y"
                yEntry = datatable->GetEntry("Y");

                // get the entry in "datatable" called "Out"
                outEntry = datatable->GetEntry("Out");
              }

              void Periodic() {
                // read a double value from Y, and set Out to that value multiplied by 2
                double value = yEntry.GetDouble(0.0);  // default to 0
                outEntry.SetDouble(value * 2);
              }
            };

    .. group-tab:: Python

        .. code-block:: python

            class Example:
                def __init__(self):
                    inst = ntcore.NetworkTableInstance.getDefault()

                    # get the subtable called "datatable"
                    datatable = inst.getTable("datatable")

                    # get the entry in "datatable" called "Y"
                    self.yEntry = datatable.getEntry("Y")

                    # get the entry in "datatable" called "Out"
                    self.outEntry = datatable.getEntry("Out")

                def periodic(self):
                    # read a double value from Y, and set Out to that value multiplied by 2
                    value = self.yEntry.getDouble(0.0)  # default to 0
                    self.outEntry.setDouble(value * 2)


Recommended NT4 equivalent (should be):

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Example {
              final DoubleSubscriber ySub;
              final DoublePublisher outPub;

              public Example() {
                NetworkTableInstance inst = NetworkTableInstance.getDefault();

                // get the subtable called "datatable"
                NetworkTable datatable = inst.getTable("datatable");

                // subscribe to the topic in "datatable" called "Y"
                // default value is 0
                ySub = datatable.getDoubleTopic("Y").subscribe(0.0);

                // publish to the topic in "datatable" called "Out"
                outPub = datatable.getDoubleTopic("Out").publish();
              }

              public void periodic() {
                // read a double value from Y, and set Out to that value multiplied by 2
                double value = ySub.get();
                outPub.set(value * 2);
              }

              // often not required in robot code, unless this class doesn't exist for
              // the lifetime of the entire robot program, in which case close() needs to be
              // called to stop subscribing
              public void close() {
                ySub.close();
                outPub.close();
              }
            }

    .. group-tab:: C++

        .. code-block:: cpp

            class Example {
              nt::DoubleSubscriber ySub;
              nt::DoublePublisher outPub;

             public:
              Example() {
                nt::NetworkTableInstance inst = nt::NetworkTableInstance::GetDefault();

                // get the subtable called "datatable"
                auto datatable = inst.GetTable("datatable");

                // subscribe to the topic in "datatable" called "Y"
                // default value is 0
                ySub = datatable->GetDoubleTopic("Y").Subscribe(0.0);

                // publish to the topic in "datatable" called "Out"
                outPub = datatable->GetDoubleTopic("Out").Publish();
              }

              void Periodic() {
                // read a double value from Y, and set Out to that value multiplied by 2
                double value = ySub.Get();
                outPub.Set(value * 2);
              }
            };

    .. group-tab:: Python

        .. code-block:: python

            class Example:
                def __init__(self) -> None:
                    inst = ntcore.NetworkTableInstance.getDefault()

                    # get the subtable called "datatable"
                    datatable = inst.getTable("datatable")

                    # subscribe to the topic in "datatable" called "Y"
                    # default value is 0
                    self.ySub = datatable.getDoubleTopic("Y").subscribe(0.0)

                    # publish to the topic in "datatable" called "Out"
                    self.outPub = datatable.getDoubleTopic("Out").publish()

                def periodic(self):
                    # read a double value from Y, and set Out to that value multiplied by 2
                    value = self.ySub.get()
                    self.outPub.set(value * 2)

                # often not required in robot code, unless this class doesn't exist for
                # the lifetime of the entire robot program, in which case close() needs to be
                # called to stop subscribing
                def close(self):
                    self.ySub.close()
                    self.outPub.close()

Shuffleboard
------------

In WPILib's Shuffleboard classes, usage of ``NetworkTableEntry`` has been replaced with use of ``GenericEntry``. In C++, since ``GenericEntry`` is non-copyable, return values now return a reference rather than a value.

Force Set Operations
--------------------

Force set operations have been removed, as it's no longer possible to change a topic's type once it's been published. In most cases calls to ``forceSet`` can simply be replaced with ``set``, but more complex scenarios may require a different design approach (e.g. splitting into different topics).

Listeners
---------

The separate connection, value, and log listeners/events have been unified into a single listener/event. The NetworkTable-level listeners have also been removed. Listeners in many cases can be replaced with subscriber ``readQueue()`` calls, but if listeners are still required, they can be used via ``NetworkTableInstance`` (see :ref:`docs/software/networktables/listening-for-change:listening for changes` for more information).

Client/Server Operations
------------------------

Starting a NetworkTable server now requires specifying both the NT3 port and the NT4 port. For a NT4-only server, the NT3 port can be specified as 0.

A NetworkTable client can only operate in NT3 mode or NT4 mode, not both (there is no provision for automatic fallback). As such, the ``startClient()`` call has been replaced by ``startClient3()`` and ``startClient4()``. The client must also specify a unique name for itself--the server will reject connection attempts with duplicate names.

C++ Changes
-----------

C++ values are now returned/used as value objects (plain ``nt::Value``) instead of shared pointers to them (``std::shared_ptr<nt::Value>``).
