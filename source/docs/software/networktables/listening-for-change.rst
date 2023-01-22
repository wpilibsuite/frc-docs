Listening for Changes
=====================

A common use case for :term:`NetworkTables` is where a coprocessor generates values that need to be sent to the robot. For example, imagine that some image processing code running on a coprocessor computes the heading and distance to a goal and sends those values to the robot. In this case it might be desirable for the robot program to be notified when new values arrive.

There are a few different ways to detect that a topic's value has changed; the easiest way is to periodically call a subscriber's ``get()``, ``readQueue()``, or ``readQueueValues()`` function from the robot's periodic loop, as shown below:

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Example {
              final DoubleSubscriber ySub;
              double prev;

              public Example() {
                // get the default instance of NetworkTables
                NetworkTableInstance inst = NetworkTableInstance.getDefault();

                // get the subtable called "datatable"
                NetworkTable datatable = inst.getTable("datatable");

                // subscribe to the topic in "datatable" called "Y"
                ySub = datatable.getDoubleTopic("Y").subscribe(0.0);
              }

              public void periodic() {
                // get() can be used with simple change detection to the previous value
                double value = ySub.get();
                if (value != prev) {
                  prev = value;  // save previous value
                  System.out.println("X changed value: " + value);
                }

                // readQueueValues() provides all value changes since the last call;
                // this way it's not possible to miss a change by polling too slowly
                for (double iterVal : ySub.readQueueValues()) {
                  System.out.println("X changed value: " + iterVal);
                }

                // readQueue() is similar to readQueueValues(), but provides timestamps
                // for each change as well
                for (TimestampedDouble tsValue : ySub.readQueue()) {
                  System.out.println("X changed value: " + tsValue.value + " at local time " + tsValue.timestamp);
                }
              }

              // may not be necessary for robot programs if this class lives for
              // the length of the program
              public void close() {
                ySub.close();
              }
            }

    .. group-tab:: C++

        .. code-block:: cpp

            class Example {
              nt::DoubleSubscriber ySub;
              double prev = 0;

             public:
              Example() {
                // get the default instance of NetworkTables
                nt::NetworkTableInstance inst = nt::NetworkTableInstance::GetDefault();

                // get the subtable called "datatable"
                auto datatable = inst.GetTable("datatable");

                // subscribe to the topic in "datatable" called "Y"
                ySub = datatable->GetDoubleTopic("Y").Subscribe(0.0);
              }

              void Periodic() {
                // Get() can be used with simple change detection to the previous value
                double value = ySub.Get();
                if (value != prev) {
                  prev = value;  // save previous value
                  fmt::print("X changed value: {}\n", value);
                }

                // ReadQueueValues() provides all value changes since the last call;
                // this way it's not possible to miss a change by polling too slowly
                for (double iterVal : ySub.ReadQueueValues()) {
                  fmt::print("X changed value: {}\n", iterVal);
                }

                // ReadQueue() is similar to ReadQueueValues(), but provides timestamps
                // for each change as well
                for (nt::TimestampedDouble tsValue : ySub.ReadQueue()) {
                  fmt::print("X changed value: {} at local time {}\n", tsValue.value, tsValue.timestamp);
                }
              }
            };

    .. group-tab:: C++ (handle-based)

        .. code-block:: cpp

            class Example {
              NT_Subscriber ySub;
              double prev = 0;

             public:
              Example() {
                // get the default instance of NetworkTables
                NT_Inst inst = nt::GetDefaultInstance();

                // subscribe to the topic in "datatable" called "Y"
                ySub = nt::Subscribe(nt::GetTopic(inst, "/datatable/Y"), NT_DOUBLE, "double");
              }

              void Periodic() {
                // Get() can be used with simple change detection to the previous value
                double value = nt::GetDouble(ySub, 0.0);
                if (value != prev) {
                  prev = value;  // save previous value
                  fmt::print("X changed value: {}\n", value);
                }

                // ReadQueue() provides all value changes since the last call;
                // this way it's not possible to miss a change by polling too slowly
                for (nt::TimestampedDouble value : nt::ReadQueueDouble(ySub)) {
                  fmt::print("X changed value: {} at local time {}\n", tsValue.value, tsValue.timestamp);
                }
              }
            };

    .. group-tab:: Python

        .. code-block:: python

            class Example:
                def __init__(self) -> None:

                    # get the default instance of NetworkTables
                    inst = ntcore.NetworkTableInstance.getDefault()

                    # get the subtable called "datatable"
                    datatable = inst.getTable("datatable")

                    # subscribe to the topic in "datatable" called "Y"
                    self.ySub = datatable.getDoubleTopic("Y").subscribe(0.0)

                    self.prev = 0

                def periodic(self):
                    # get() can be used with simple change detection to the previous value
                    value = self.ySub.get()
                    if value != self.prev:
                        self.prev = value
                        # save previous value
                        print("X changed value: " + value)

                    # readQueue() provides all value changes since the last call;
                    # this way it's not possible to miss a change by polling too slowly
                    for tsValue in self.ySub.readQueue():
                        print(f"X changed value: {tsValue.value} at local time {tsValue.time}")

                # may not be necessary for robot programs if this class lives for
                # the length of the program
                def close(self):
                    self.ySub.close()

With a command-based robot, it's also possible to use ``NetworkBooleanEvent`` to link boolean topic changes to callback actions (e.g. running commands).

While these functions suffice for value changes on a single topic, they do not provide insight into changes to topics (when a topic is published or unpublished, or when a topic's properties change) or network connection changes (e.g. when a client connects or disconnects). They also don't provide a way to get in-order updates for value changes across multiple topics. For these needs, NetworkTables provides an event listener facility.

The easiest way to use listeners is via ``NetworkTableInstance``. For more automatic control over listener lifetime (particularly in C++), and to operate without a background thread, NetworkTables also provides separate classes for both polled listeners (``NetworkTableListenerPoller``), which store events into an internal queue that must be periodically read to get the queued events, and threaded listeners (``NetworkTableListener``), which call a callback function from a background thread.

NetworkTableEvent
-----------------

All listener callbacks take a single ``NetworkTableEvent`` parameter, and similarly, reading a listener poller returns an array of ``NetworkTableEvent``. The event contains information including what kind of event it is (e.g. a value update, a new topic, a network disconnect), the handle of the listener that caused the event to be generated, and more detailed information that depends on the type of the event (connection information for connection events, topic information for topic-related events, value data for value updates, and the log message for log message events).

Using NetworkTableInstance to Listen for Changes
------------------------------------------------

The below example listens to various kinds of events using ``NetworkTableInstance``. The listener callback provided to any of the addListener functions will be called asynchronously from a background thread when a matching event occurs.

.. warning:: Because the listener callback is called from a separate background thread, it's important to use thread-safe synchronization approaches such as mutexes or atomics to pass data to/from the main code and the listener callback function.

The ``addListener`` functions in NetworkTableInstance return a listener handle. This can be used to remove the listener later.

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Example {
              final DoubleSubscriber ySub;
              // use an AtomicReference to make updating the value thread-safe
              final AtomicReference<Double> yValue = new AtomicReference<Double>();
              // retain listener handles for later removal
              int connListenerHandle;
              int valueListenerHandle;
              int topicListenerHandle;

              public Example() {
                // get the default instance of NetworkTables
                NetworkTableInstance inst = NetworkTableInstance.getDefault();

                // add a connection listener; the first parameter will cause the
                // callback to be called immediately for any current connections
                connListenerHandle = inst.addConnectionListener(true, event -> {
                  if (event.is(NetworkTableEvent.Kind.kConnected)) {
                    System.out.println("Connected to " + event.connInfo.remote_id);
                  } else if (event.is(NetworkTableEvent.Kind.kDisconnected)) {
                    System.out.println("Disconnected from " + event.connInfo.remote_id);
                  }
                });

                // get the subtable called "datatable"
                NetworkTable datatable = inst.getTable("datatable");

                // subscribe to the topic in "datatable" called "Y"
                ySub = datatable.getDoubleTopic("Y").subscribe(0.0);

                // add a listener to only value changes on the Y subscriber
                valueListenerHandle = inst.addListener(
                    ySub,
                    EnumSet.of(NetworkTableEvent.Kind.kValueAll),
                    event -> {
                      // can only get doubles because it's a DoubleSubscriber, but
                      // could check value.isDouble() here too
                      yValue.set(event.valueData.value.getDouble());
                    });

                // add a listener to see when new topics are published within datatable
                // the string array is an array of topic name prefixes.
                topicListenerHandle = inst.addListener(
                    new String[] { datatable.getPath() + "/" },
                    EnumSet.of(NetworkTableEvent.Kind.kTopic),
                    event -> {
                      if (event.is(NetworkTableEvent.Kind.kPublish)) {
                        // topicInfo.name is the full topic name, e.g. "/datatable/X"
                        System.out.println("newly published " + event.topicInfo.name);
                      }
                    });
              }

              public void periodic() {
                // get the latest value by reading the AtomicReference; set it to null
                // when we read to ensure we only get value changes
                Double value = yValue.getAndSet(null);
                if (value != null) {
                  System.out.println("got new value " + value);
                }
              }

              // may not be needed for robot programs if this class exists for the
              // lifetime of the program
              public void close() {
                NetworkTableInstance inst = NetworkTableInstance.getDefault();
                inst.removeListener(topicListenerHandle);
                inst.removeListener(valueListenerHandle);
                inst.removeListener(connListenerHandle);
                ySub.close();
              }
            }

    .. group-tab:: C++

        .. code-block:: cpp

            class Example {
              nt::DoubleSubscriber ySub;
              // use a mutex to make updating the value and flag thread-safe
              wpi::mutex mutex;
              double yValue;
              bool yValueUpdated = false;
              // retain listener handles for later removal
              NT_Listener connListenerHandle;
              NT_Listener valueListenerHandle;
              NT_Listener topicListenerHandle;

             public:
              Example() {
                // get the default instance of NetworkTables
                nt::NetworkTableInstance inst = nt::NetworkTableInstance::GetDefault();

                // add a connection listener; the first parameter will cause the
                // callback to be called immediately for any current connections
                connListenerHandle = inst.AddConnectionListener(true, [] (const nt::Event& event) {
                  if (event.Is(nt::EventFlags::kConnected)) {
                    fmt::print("Connected to {}\n", event.GetConnectionInfo()->remote_id);
                  } else if (event.Is(nt::EventFlags::kDisconnected)) {
                    fmt::print("Disconnected from {}\n", event.GetConnectionInfo()->remote_id);
                  }
                });

                // get the subtable called "datatable"
                auto datatable = inst.GetTable("datatable");

                // subscribe to the topic in "datatable" called "Y"
                ySub = datatable.GetDoubleTopic("Y").Subscribe(0.0);

                // add a listener to only value changes on the Y subscriber
                valueListenerHandle = inst.AddListener(
                    ySub,
                    nt::EventFlags::kValueAll,
                    [this] (const nt::Event& event) {
                      // can only get doubles because it's a DoubleSubscriber, but
                      // could check value.IsDouble() here too
                      std::scoped_lock lock{mutex};
                      yValue = event.GetValueData()->value.GetDouble();
                      yValueUpdated = true;
                    });

                // add a listener to see when new topics are published within datatable
                // the string array is an array of topic name prefixes.
                topicListenerHandle = inst.AddListener(
                    {{fmt::format("{}/", datatable->GetPath())}},
                    nt::EventFlags::kTopic,
                    [] (const nt::Event& event) {
                      if (event.Is(nt::EventFlags::kPublish)) {
                        // name is the full topic name, e.g. "/datatable/X"
                        fmt::print("newly published {}\n", event.GetTopicInfo()->name);
                      }
                    });
              }

              void Periodic() {
                // get the latest value by reading the value; set it to false
                // when we read to ensure we only get value changes
                wpi::scoped_lock lock{mutex};
                if (yValueUpdated) {
                  yValueUpdated = false;
                  fmt::print("got new value {}\n", yValue);
                }
              }

              ~Example() {
                nt::NetworkTableInstance inst = nt::NetworkTableInstance::GetDefault();
                inst.RemoveListener(connListenerHandle);
                inst.RemoveListener(valueListenerHandle);
                inst.RemoveListener(topicListenerHandle);
              }
            };

    .. group-tab:: Python

        .. code-block:: python

            import ntcore
            import threading

            class Example:
                def __init__(self) -> None:

                    # get the default instance of NetworkTables
                    inst = ntcore.NetworkTableInstance.getDefault()

                    # Use a mutex to ensure thread safety
                    self.lock = threading.Lock()
                    self.yValue = None

                    # add a connection listener; the first parameter will cause the
                    # callback to be called immediately for any current connections
                    def _connect_cb(event: ntcore.Event):
                        if event.is_(ntcore.EventFlags.kConnected):
                            print("Connected to", event.data.remote_id)
                        elif event.is_(ntcore.EventFlags.kDisconnected):
                            print("Disconnected from", event.data.remote_id)

                    self.connListenerHandle = inst.addConnectionListener(True, _connect_cb)

                    # get the subtable called "datatable"
                    datatable = inst.getTable("datatable")

                    # subscribe to the topic in "datatable" called "Y"
                    self.ySub = datatable.getDoubleTopic("Y").subscribe(0.0)

                    # add a listener to only value changes on the Y subscriber
                    def _on_ysub(event: ntcore.Event):
                        # can only get doubles because it's a DoubleSubscriber, but
                        # could check value.isDouble() here too
                        with self.lock:
                            self.yValue = event.data.value.getDouble()

                    self.valueListenerHandle = inst.addListener(
                        self.ySub, ntcore.EventFlags.kValueAll, _on_ysub
                    )

                    # add a listener to see when new topics are published within datatable
                    # the string array is an array of topic name prefixes.
                    def _on_pub(event: ntcore.Event):
                        if event.is_(ntcore.EventFlags.kPublish):
                            # topicInfo.name is the full topic name, e.g. "/datatable/X"
                            print("newly published", event.data.name)

                    self.topicListenerHandle = inst.addListener(
                        [datatable.getPath() + "/"], ntcore.EventFlags.kTopic, _on_pub
                    )

                def periodic(self):
                    # get the latest value by reading the value; set it to null
                    # when we read to ensure we only get value changes
                    with self.lock:
                        value, self.yValue = self.yValue, None

                    if value is not None:
                        print("got new value", value)

                # may not be needed for robot programs if this class exists for the
                # lifetime of the program
                def close(self):
                    inst = ntcore.NetworkTableInstance.getDefault()
                    inst.removeListener(self.topicListenerHandle)
                    inst.removeListener(self.valueListenerHandle)
                    inst.removeListener(self.connListenerHandle)
                    self.ySub.close()
