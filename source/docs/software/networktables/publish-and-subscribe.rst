# Publishing and Subscribing to a Topic

## Publishing to a Topic

In order to create a :term:`topic` and publish values to it, it's necessary to create a :term:`publisher`.

NetworkTable publishers are represented as type-specific Publisher objects (e.g. ``BooleanPublisher``: [Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/BooleanPublisher.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_boolean_publisher.html), :external:py:class:`Python <ntcore.BooleanPublisher>`). Publishers are only active as long as the Publisher object exists. Typically you want to keep publishing longer than the local scope of a function, so it's necessary to store the Publisher object somewhere longer term, e.g. in an instance variable. In Java, the ``close()`` method needs be called to stop publishing; in C++ this is handled by the destructor. C++ publishers are moveable and non-copyable. In Python the ``close()`` method should be called to stop publishing, but it will also be closed when the object is garbage collected.

In the handle-based APIs, there is only the non-type-specific ``NT_Publisher`` handle; the user is responsible for keeping track of the type of the publisher and using the correct type-specific set methods.

Publishing values is done via a ``set()`` operation. By default, this operation uses the current time, but a timestamp may optionally be specified. Specifying a timestamp can be useful when multiple values should have the same update timestamp. The timestamp units are integer microseconds (see example code for how to get a current timestamp that is consistent with the library).

.. tab-set::

    .. tab-item:: Java
      :sync: Java

      ```java
      public class Example {
        // the publisher is an instance variable so its lifetime matches that of the class
        final DoublePublisher dblPub;
        public Example(DoubleTopic dblTopic) {
          // start publishing; the return value must be retained (in this case, via
          // an instance variable)
          dblPub = dblTopic.publish();
          // publish options may be specified using PubSubOption
          dblPub = dblTopic.publish(PubSubOption.keepDuplicates(true));
          // publishEx provides additional options such as setting initial
          // properties and using a custom type string. Using a custom type string for
          // types other than raw and string is not recommended. The properties string
          // must be a JSON map.
          dblPub = dblTopic.publishEx("double", "{\"myprop\": 5}");
        }
        public void periodic() {
          // publish a default value
          dblPub.setDefault(0.0);
          // publish a value with current timestamp
          dblPub.set(1.0);
          dblPub.set(2.0, 0);  // 0 = use current time
          // publish a value with a specific timestamp; NetworkTablesJNI.now() can
          // be used to get the current time. On the roboRIO, this is the same as
          // the FPGA timestamp (e.g. RobotController.getFPGATime())
          long time = NetworkTablesJNI.now();
          dblPub.set(3.0, time);
          // publishers also implement the appropriate Consumer functional interface;
          // this example assumes void myFunc(DoubleConsumer func) exists
          myFunc(dblPub);
        }
        // often not required in robot code, unless this class doesn't exist for
        // the lifetime of the entire robot program, in which case close() needs to be
        // called to stop publishing
        public void close() {
          // stop publishing
          dblPub.close();
        }
      }
      ```

    .. tab-item:: C++
      :sync: C++

      ```c++
      class Example {
        // the publisher is an instance variable so its lifetime matches that of the class
        // publishing is automatically stopped when dblPub is destroyed by the class destructor
        nt::DoublePublisher dblPub;
       public:
        explicit Example(nt::DoubleTopic dblTopic) {
          // start publishing; the return value must be retained (in this case, via
          // an instance variable)
          dblPub = dblTopic.Publish();
          // publish options may be specified using PubSubOptions
          dblPub = dblTopic.Publish({.keepDuplicates = true});
          // PublishEx provides additional options such as setting initial
          // properties and using a custom type string. Using a custom type string for
          // types other than raw and string is not recommended. The properties must
          // be a JSON map.
          dblPub = dblTopic.PublishEx("double", {{"myprop", 5}});
        }
        void Periodic() {
          // publish a default value
          dblPub.SetDefault(0.0);
          // publish a value with current timestamp
          dblPub.Set(1.0);
          dblPub.Set(2.0, 0);  // 0 = use current time
          // publish a value with a specific timestamp; nt::Now() can
          // be used to get the current time.
          int64_t time = nt::Now();
          dblPub.Set(3.0, time);
        }
      };
      ```

    .. tab-item:: C++ (Handle-based)
      :sync: C++ (Handle-based)

      ```c++
      class Example {
        // the publisher is an instance variable, but since it's a handle, it's
        // not automatically released, so we need a destructor
        NT_Publisher dblPub;
       public:
        explicit Example(NT_Topic dblTopic) {
          // start publishing. It's recommended that the type string be standard
          // for all types except string and raw.
          dblPub = nt::Publish(dblTopic, NT_DOUBLE, "double");
          // publish options may be specified using PubSubOptions
          dblPub = nt::Publish(dblTopic, NT_DOUBLE, "double",
              {.keepDuplicates = true});
          // PublishEx allows setting initial properties. The
          // properties must be a JSON map.
          dblPub = nt::PublishEx(dblTopic, NT_DOUBLE, "double", {{"myprop", 5}});
        }
        void Periodic() {
          // publish a default value
          nt::SetDefaultDouble(dblPub, 0.0);
          // publish a value with current timestamp
          nt::SetDouble(dblPub, 1.0);
          nt::SetDouble(dblPub, 2.0, 0);  // 0 = use current time
          // publish a value with a specific timestamp; nt::Now() can
          // be used to get the current time.
          int64_t time = nt::Now();
          nt::SetDouble(dblPub, 3.0, time);
        }
        ~Example() {
          // stop publishing
          nt::Unpublish(dblPub);
        }
      };
      ```

    .. tab-item:: C
      :sync: C

      ```c
      // This code assumes that a NT_Topic dblTopic variable already exists
      // start publishing. It's recommended that the type string be standard
      // for all types except string and raw.
      NT_Publisher dblPub = NT_Publish(dblTopic, NT_DOUBLE, "double", NULL, 0);
      // publish options may be specified
      struct NT_PubSubOptions options;
      memset(&options, 0, sizeof(options));
      options.structSize = sizeof(options);
      options.keepDuplicates = 1;  // true
      NT_Publisher dblPub = NT_Publish(dblTopic, NT_DOUBLE, "double", &options);
      // PublishEx allows setting initial properties. The properties string must
      // be a JSON map.
      NT_Publisher dblPub =
          NT_PublishEx(dblTopic, NT_DOUBLE, "double", "{\"myprop\", 5}", NULL, 0);
      // publish a default value
      NT_SetDefaultDouble(dblPub, 0.0);
      // publish a value with current timestamp
      NT_SetDouble(dblPub, 1.0);
      NT_SetDouble(dblPub, 2.0, 0);  // 0 = use current time
      // publish a value with a specific timestamp; NT_Now() can
      // be used to get the current time.
      int64_t time = NT_Now();
      NT_SetDouble(dblPub, 3.0, time);
      // stop publishing
      NT_Unpublish(dblPub);
      ```

    .. tab-item:: Python
      :sync: Python

      ```python
      class Example:
          def __init__(self, dblTopic: ntcore.DoubleTopic):
              # start publishing; the return value must be retained (in this case, via
              # an instance variable)
              self.dblPub = dblTopic.publish()
              # publish options may be specified using PubSubOption
              self.dblPub = dblTopic.publish(ntcore.PubSubOptions(keepDuplicates=True))
              # publishEx provides additional options such as setting initial
              # properties and using a custom type string. Using a custom type string for
              # types other than raw and string is not recommended. The properties
              # must be a JSON map.
              self.dblPub = dblTopic.publishEx("double", {"myprop": 5})
          def periodic(self):
              # publish a default value
              self.dblPub.setDefault(0.0)
              # publish a value with current timestamp
              self.dblPub.set(1.0)
              self.dblPub.set(2.0, 0)  # 0 = use current time
              # publish a value with a specific timestamp with microsecond resolution.
              # On the roboRIO, this is the same as the FPGA timestamp (e.g.
              # RobotController.getFPGATime())
              self.dblPub.set(3.0, ntcore._now())
          # often not required in robot code, unless this class doesn't exist for
          # the lifetime of the entire robot program, in which case close() needs to be
          # called to stop publishing
          def close(self):
              # stop publishing
              self.dblPub.close()
      ```

## Subscribing to a Topic

A :term:`subscriber` receives value updates made to a topic. Similar to publishers, NetworkTable subscribers are represented as type-specific Subscriber classes (e.g. ``BooleanSubscriber``: [Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/BooleanSubscriber.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_boolean_subscriber.html), :external:py:class:`Python <ntcore.BooleanSubscriber>`) that must be stored somewhere to continue subscribing.

Subscribers have a range of different ways to read received values. It's possible to just read the most recent value using ``get()``, read the most recent value, along with its timestamp, using ``getAtomic()``, or get an array of all value changes since the last call using ``readQueue()`` or ``readQueueValues()``.

.. tab-set::

    .. tab-item:: Java
      :sync: Java

      ```java
      public class Example {
        // the subscriber is an instance variable so its lifetime matches that of the class
        final DoubleSubscriber dblSub;
        public Example(DoubleTopic dblTopic) {
          // start subscribing; the return value must be retained.
          // the parameter is the default value if no value is available when get() is called
          dblSub = dblTopic.subscribe(0.0);
          // subscribe options may be specified using PubSubOption
          dblSub =
              dblTopic.subscribe(0.0, PubSubOption.keepDuplicates(true), PubSubOption.pollStorage(10));
          // subscribeEx provides the options of using a custom type string.
          // Using a custom type string for types other than raw and string is not recommended.
          dblSub = dblTopic.subscribeEx("double", 0.0);
        }
        public void periodic() {
          // simple get of most recent value; if no value has been published,
          // returns the default value passed to the subscribe() function
          double val = dblSub.get();
          // get the most recent value; if no value has been published, returns
          // the passed-in default value
          double val = dblSub.get(-1.0);
          // subscribers also implement the appropriate Supplier interface, e.g. DoubleSupplier
          double val = dblSub.getAsDouble();
          // get the most recent value, along with its timestamp
          TimestampedDouble tsVal = dblSub.getAtomic();
          // read all value changes since the last call to readQueue/readQueueValues
          // readQueue() returns timestamps; readQueueValues() does not.
          TimestampedDouble[] tsUpdates = dblSub.readQueue();
          double[] valUpdates = dblSub.readQueueValues();
        }
        // often not required in robot code, unless this class doesn't exist for
        // the lifetime of the entire robot program, in which case close() needs to be
        // called to stop subscribing
        public void close() {
          // stop subscribing
          dblSub.close();
        }
      }
      ```

    .. tab-item:: C++
      :sync: C++

      ```c++
      class Example {
        // the subscriber is an instance variable so its lifetime matches that of the class
        // subscribing is automatically stopped when dblSub is destroyed by the class destructor
        nt::DoubleSubscriber dblSub;
       public:
        explicit Example(nt::DoubleTopic dblTopic) {
          // start subscribing; the return value must be retained.
          // the parameter is the default value if no value is available when get() is called
          dblSub = dblTopic.Subscribe(0.0);
          // subscribe options may be specified using PubSubOptions
          dblSub =
              dblTopic.subscribe(0.0,
              {.pollStorage = 10, .keepDuplicates = true});
          // SubscribeEx provides the options of using a custom type string.
          // Using a custom type string for types other than raw and string is not recommended.
          dblSub = dblTopic.SubscribeEx("double", 0.0);
        }
        void Periodic() {
          // simple get of most recent value; if no value has been published,
          // returns the default value passed to the Subscribe() function
          double val = dblSub.Get();
          // get the most recent value; if no value has been published, returns
          // the passed-in default value
          double val = dblSub.Get(-1.0);
          // get the most recent value, along with its timestamp
          nt::TimestampedDouble tsVal = dblSub.GetAtomic();
          // read all value changes since the last call to ReadQueue/ReadQueueValues
          // ReadQueue() returns timestamps; ReadQueueValues() does not.
          std::vector<nt::TimestampedDouble> tsUpdates = dblSub.ReadQueue();
          std::vector<double> valUpdates = dblSub.ReadQueueValues();
        }
      };
      ```

    .. tab-item:: C++ (Handle-based)
      :sync: C++ (Handle-based)

      ```c++
      class Example {
        // the subscriber is an instance variable, but since it's a handle, it's
        // not automatically released, so we need a destructor
        NT_Subscriber dblSub;
       public:
        explicit Example(NT_Topic dblTopic) {
          // start subscribing
          // Using a custom type string for types other than raw and string is not recommended.
          dblSub = nt::Subscribe(dblTopic, NT_DOUBLE, "double");
          // subscribe options may be specified using PubSubOptions
          dblSub =
              nt::Subscribe(dblTopic, NT_DOUBLE, "double",
              {.pollStorage = 10, .keepDuplicates = true});
        }
        void Periodic() {
          // get the most recent value; if no value has been published, returns
          // the passed-in default value
          double val = nt::GetDouble(dblSub, 0.0);
          // get the most recent value, along with its timestamp
          nt::TimestampedDouble tsVal = nt::GetAtomic(dblSub, 0.0);
          // read all value changes since the last call to ReadQueue/ReadQueueValues
          // ReadQueue() returns timestamps; ReadQueueValues() does not.
          std::vector<nt::TimestampedDouble> tsUpdates = nt::ReadQueueDouble(dblSub);
          std::vector<double> valUpdates = nt::ReadQueueValuesDouble(dblSub);
        }
        ~Example() {
          // stop subscribing
          nt::Unsubscribe(dblSub);
        }
      ```

    .. tab-item:: C
      :sync: C

      ```c
      // This code assumes that a NT_Topic dblTopic variable already exists
      // start subscribing
      // Using a custom type string for types other than raw and string is not recommended.
      NT_Subscriber dblSub = NT_Subscribe(dblTopic, NT_DOUBLE, "double", NULL, 0);
      // subscribe options may be specified using NT_PubSubOptions
      struct NT_PubSubOptions options;
      memset(&options, 0, sizeof(options));
      options.structSize = sizeof(options);
      options.keepDuplicates = 1;  // true
      options.pollStorage = 10;
      NT_Subscriber dblSub = NT_Subscribe(dblTopic, NT_DOUBLE, "double", &options);
      // get the most recent value; if no value has been published, returns
      // the passed-in default value
      double val = NT_GetDouble(dblSub, 0.0);
      // get the most recent value, along with its timestamp
      struct NT_TimestampedDouble tsVal;
      NT_GetAtomic(dblSub, 0.0, &tsVal);
      NT_DisposeTimestamped(&tsVal);
      // read all value changes since the last call to ReadQueue/ReadQueueValues
      // ReadQueue() returns timestamps; ReadQueueValues() does not.
      size_t tsUpdatesLen;
      struct NT_TimestampedDouble* tsUpdates = NT_ReadQueueDouble(dblSub, &tsUpdatesLen);
      NT_FreeQueueDouble(tsUpdates, tsUpdatesLen);
      size_t valUpdatesLen;
      double* valUpdates = NT_ReadQueueValuesDouble(dblSub, &valUpdatesLen);
      NT_FreeDoubleArray(valUpdates, valUpdatesLen);
      // stop subscribing
      NT_Unsubscribe(dblSub);
      ```

    .. tab-item:: Python
      :sync: Python

      ```python
      class Example:
          def __init__(self, dblTopic: ntcore.DoubleTopic):
              # start subscribing; the return value must be retained.
              # the parameter is the default value if no value is available when get() is called
              self.dblSub = dblTopic.subscribe(0.0)
              # subscribe options may be specified using PubSubOption
              self.dblSub = dblTopic.subscribe(
                  0.0, ntcore.PubSubOptions(keepDuplicates=True, pollStorage=10)
              )
              # subscribeEx provides the options of using a custom type string.
              # Using a custom type string for types other than raw and string is not recommended.
              dblSub = dblTopic.subscribeEx("double", 0.0)
          def periodic(self):
              # simple get of most recent value; if no value has been published,
              # returns the default value passed to the subscribe() function
              val = self.dblSub.get()
              # get the most recent value; if no value has been published, returns
              # the passed-in default value
              val = self.dblSub.get(-1.0)
              # get the most recent value, along with its timestamp
              tsVal = self.dblSub.getAtomic()
              # read all value changes since the last call to readQueue
              # readQueue() returns timestamps
              tsUpdates = self.dblSub.readQueue()
              # often not required in robot code, unless this class doesn't exist for
          # the lifetime of the entire robot program, in which case close() needs to be
          # called to stop subscribing
          def close(self):
              # stop subscribing
              self.dblSub.close()
      ```

## Using Entry to Both Subscribe and Publish

An :term:`entry` is a combined publisher and subscriber. The subscriber is always active, but the publisher is not created until a publish operation is performed (e.g. a value is "set", aka published, on the entry). This may be more convenient than maintaining a separate publisher and subscriber. Similar to publishers and subscribers, NetworkTable entries are represented as type-specific Entry classes (e.g. ``BooleanEntry``: [Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/BooleanEntry.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_boolean_entry.html), :external:py:class:`Python <ntcore.BooleanEntry>`) that must be retained to continue subscribing (and publishing).

.. tab-set::

    .. tab-item:: Java
      :sync: Java

      ```java
      public class Example {
        // the entry is an instance variable so its lifetime matches that of the class
        final DoubleEntry dblEntry;
        public Example(DoubleTopic dblTopic) {
          // start subscribing; the return value must be retained.
          // the parameter is the default value if no value is available when get() is called
          dblEntry = dblTopic.getEntry(0.0);
          // publish and subscribe options may be specified using PubSubOption
          dblEntry =
              dblTopic.getEntry(0.0, PubSubOption.keepDuplicates(true), PubSubOption.pollStorage(10));
          // getEntryEx provides the options of using a custom type string.
          // Using a custom type string for types other than raw and string is not recommended.
          dblEntry = dblTopic.getEntryEx("double", 0.0);
        }
        public void periodic() {
          // entries support all the same methods as subscribers:
          double val = dblEntry.get();
          double val = dblEntry.get(-1.0);
          double val = dblEntry.getAsDouble();
          TimestampedDouble tsVal = dblEntry.getAtomic();
          TimestampedDouble[] tsUpdates = dblEntry.readQueue();
          double[] valUpdates = dblEntry.readQueueValues();
          // entries also support all the same methods as publishers; the first time
          // one of these is called, an internal publisher is automatically created
          dblEntry.setDefault(0.0);
          dblEntry.set(1.0);
          dblEntry.set(2.0, 0);  // 0 = use current time
          long time = NetworkTablesJNI.now();
          dblEntry.set(3.0, time);
          myFunc(dblEntry);
        }
        public void unpublish() {
          // you can stop publishing while keeping the subscriber alive
          dblEntry.unpublish();
        }
        // often not required in robot code, unless this class doesn't exist for
        // the lifetime of the entire robot program, in which case close() needs to be
        // called to stop subscribing
        public void close() {
          // stop subscribing/publishing
          dblEntry.close();
        }
      }
      ```

    .. tab-item:: C++
      :sync: C++

      ```c++
      class Example {
        // the entry is an instance variable so its lifetime matches that of the class
        // subscribing/publishing is automatically stopped when dblEntry is destroyed by
        // the class destructor
        nt::DoubleEntry dblEntry;
       public:
        explicit Example(nt::DoubleTopic dblTopic) {
          // start subscribing; the return value must be retained.
          // the parameter is the default value if no value is available when get() is called
          dblEntry = dblTopic.GetEntry(0.0);
          // publish and subscribe options may be specified using PubSubOptions
          dblEntry =
              dblTopic.GetEntry(0.0,
              {.pollStorage = 10, .keepDuplicates = true});
          // GetEntryEx provides the options of using a custom type string.
          // Using a custom type string for types other than raw and string is not recommended.
          dblEntry = dblTopic.GetEntryEx("double", 0.0);
        }
        void Periodic() {
          // entries support all the same methods as subscribers:
          double val = dblEntry.Get();
          double val = dblEntry.Get(-1.0);
          nt::TimestampedDouble tsVal = dblEntry.GetAtomic();
          std::vector<nt::TimestampedDouble> tsUpdates = dblEntry.ReadQueue();
          std::vector<double> valUpdates = dblEntry.ReadQueueValues();
          // entries also support all the same methods as publishers; the first time
          // one of these is called, an internal publisher is automatically created
          dblEntry.SetDefault(0.0);
          dblEntry.Set(1.0);
          dblEntry.Set(2.0, 0);  // 0 = use current time
          int64_t time = nt::Now();
          dblEntry.Set(3.0, time);
        }
        void Unpublish() {
          // you can stop publishing while keeping the subscriber alive
          dblEntry.Unpublish();
        }
      };
      ```

    .. tab-item:: C++ (Handle-based)
      :sync: C++ (Handle-based)

      ```c++
      class Example {
        // the entry is an instance variable, but since it's a handle, it's
        // not automatically released, so we need a destructor
        NT_Entry dblEntry;
       public:
        explicit Example(NT_Topic dblTopic) {
          // start subscribing
          // Using a custom type string for types other than raw and string is not recommended.
          dblEntry = nt::GetEntry(dblTopic, NT_DOUBLE, "double");
          // publish and subscribe options may be specified using PubSubOptions
          dblEntry =
              nt::GetEntry(dblTopic, NT_DOUBLE, "double",
              {.pollStorage = 10, .keepDuplicates = true});
        }
        void Periodic() {
          // entries support all the same methods as subscribers:
          double val = nt::GetDouble(dblEntry, 0.0);
          nt::TimestampedDouble tsVal = nt::GetAtomic(dblEntry, 0.0);
          std::vector<nt::TimestampedDouble> tsUpdates = nt::ReadQueueDouble(dblEntry);
          std::vector<double> valUpdates = nt::ReadQueueValuesDouble(dblEntry);
          // entries also support all the same methods as publishers; the first time
          // one of these is called, an internal publisher is automatically created
          nt::SetDefaultDouble(dblPub, 0.0);
          nt::SetDouble(dblPub, 1.0);
          nt::SetDouble(dblPub, 2.0, 0);  // 0 = use current time
          int64_t time = nt::Now();
          nt::SetDouble(dblPub, 3.0, time);
        }
        void Unpublish() {
          // you can stop publishing while keeping the subscriber alive
          nt::Unpublish(dblEntry);
        }
        ~Example() {
          // stop publishing and subscribing
          nt::ReleaseEntry(dblEntry);
        }
      ```

    .. tab-item:: C
      :sync: C

      ```c
      // This code assumes that a NT_Topic dblTopic variable already exists
      // start subscribing
      // Using a custom type string for types other than raw and string is not recommended.
      NT_Entry dblEntry = NT_GetEntryEx(dblTopic, NT_DOUBLE, "double", NULL, 0);
      // publish and subscribe options may be specified using NT_PubSubOptions
      struct NT_PubSubOptions options;
      memset(&options, 0, sizeof(options));
      options.structSize = sizeof(options);
      options.keepDuplicates = 1;  // true
      options.pollStorage = 10;
      NT_Entry dblEntry = NT_GetEntryEx(dblTopic, NT_DOUBLE, "double", &options);
      // entries support all the same methods as subscribers:
      double val = NT_GetDouble(dblEntry, 0.0);
      struct NT_TimestampedDouble tsVal;
      NT_GetAtomic(dblEntry, 0.0, &tsVal);
      NT_DisposeTimestamped(&tsVal);
      size_t tsUpdatesLen;
      struct NT_TimestampedDouble* tsUpdates = NT_ReadQueueDouble(dblEntry, &tsUpdatesLen);
      NT_FreeQueueDouble(tsUpdates, tsUpdatesLen);
      size_t valUpdatesLen;
      double* valUpdates = NT_ReadQueueValuesDouble(dblEntry, &valUpdatesLen);
      NT_FreeDoubleArray(valUpdates, valUpdatesLen);
      // entries also support all the same methods as publishers; the first time
      // one of these is called, an internal publisher is automatically created
      NT_SetDefaultDouble(dblPub, 0.0);
      NT_SetDouble(dblPub, 1.0);
      NT_SetDouble(dblPub, 2.0, 0);  // 0 = use current time
      int64_t time = NT_Now();
      NT_SetDouble(dblPub, 3.0, time);
      // you can stop publishing while keeping the subscriber alive
      // it's not necessary to call this before NT_ReleaseEntry()
      NT_Unpublish(dblEntry);
      // stop subscribing
      NT_ReleaseEntry(dblEntry);
      ```

    .. tab-item:: Python
      :sync: Python


      ```python
      class Example:
          def __init__(self, dblTopic: ntcore.DoubleTopic):
              # start subscribing; the return value must be retained.
              # the parameter is the default value if no value is available when get() is called
              self.dblEntry = dblTopic.getEntry(0.0)
              # publish and subscribe options may be specified using PubSubOption
              self.dblEntry = dblTopic.getEntry(
                  0.0, ntcore.PubSubOptions(keepDuplicates=True, pollStorage=10)
              )
              # getEntryEx provides the options of using a custom type string.
              # Using a custom type string for types other than raw and string is not recommended.
              self.dblEntry = dblTopic.getEntryEx("double", 0.0)
          def periodic(self):
              # entries support all the same methods as subscribers:
              val = self.dblEntry.get()
              val = self.dblEntry.get(-1.0)
              val = self.dblEntry.getAsDouble()
              tsVal = self.dblEntry.getAtomic()
              tsUpdates = self.dblEntry.readQueue()
              # entries also support all the same methods as publishers; the first time
              # one of these is called, an internal publisher is automatically created
              self.dblEntry.setDefault(0.0)
              self.dblEntry.set(1.0)
              self.dblEntry.set(2.0, 0)  # 0 = use current time
              time = ntcore._now()
              self.dblEntry.set(3.0, time)
          def unpublish(self):
              # you can stop publishing while keeping the subscriber alive
              self.dblEntry.unpublish()
          # often not required in robot code, unless this class doesn't exist for
          # the lifetime of the entire robot program, in which case close() needs to be
          # called to stop subscribing
          def close(self):
              # stop subscribing/publishing
              self.dblEntry.close()
      ```

## Using GenericEntry, GenericPublisher, and GenericSubscriber

For the most robust code, using the type-specific Publisher, Subscriber, and Entry classes is recommended, but in some cases it may be easier to write code that uses type-specific get and set function calls instead of having the NetworkTables type be exposed via the class (object) type. The ``GenericPublisher`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/GenericPublisher.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_generic_publisher.html), :external:py:class:`Python <ntcore.GenericPublisher>`), ``GenericSubscriber`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/GenericSubscriber.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_generic_subscriber.html), :external:py:class:`Python<ntcore.GenericSubscriber>`), and ``GenericEntry`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/GenericEntry.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_generic_entry.html), :external:py:class:`Python <ntcore.GenericEntry>`) classes enable this approach.

.. tab-set::

    .. tab-item:: Java
      :sync: Java

      ```java
      public class Example {
        // the entry is an instance variable so its lifetime matches that of the class
        final GenericPublisher pub;
        final GenericSubscriber sub;
        final GenericEntry entry;
        public Example(Topic topic) {
          // start subscribing; the return value must be retained.
          // when publishing, a type string must be provided
          pub = topic.genericPublish("double");
          // subscribing can optionally include a type string
          // unlike type-specific subscribers, no default value is provided
          sub = topic.genericSubscribe();
          sub = topic.genericSubscribe("double");
          // when getting an entry, the type string is also optional; if not provided
          // the publisher data type will be determined by the first publisher-creating call
          entry = topic.getGenericEntry();
          entry = topic.getGenericEntry("double");
          // publish and subscribe options may be specified using PubSubOption
          pub = topic.genericPublish("double",
              PubSubOption.keepDuplicates(true), PubSubOption.pollStorage(10));
          sub =
              topic.genericSubscribe(PubSubOption.keepDuplicates(true), PubSubOption.pollStorage(10));
          entry =
              topic.getGenericEntry(PubSubOption.keepDuplicates(true), PubSubOption.pollStorage(10));
          // genericPublishEx provides the option of setting initial properties.
          pub = topic.genericPublishEx("double", "{\"retained\": true}",
              PubSubOption.keepDuplicates(true), PubSubOption.pollStorage(10));
        }
        public void periodic() {
          // generic subscribers and entries have typed get operations; a default must be provided
          double val = sub.getDouble(-1.0);
          double val = entry.getDouble(-1.0);
          // they also support an untyped get (also meets Supplier<NetworkTableValue> interface)
          NetworkTableValue val = sub.get();
          NetworkTableValue val = entry.get();
          // they also support readQueue
          NetworkTableValue[] updates = sub.readQueue();
          NetworkTableValue[] updates = entry.readQueue();
          // publishers and entries have typed set operations; these return false if the
          // topic already exists with a mismatched type
          boolean success = pub.setDefaultDouble(1.0);
          boolean success = pub.setBoolean(true);
          // they also implement a generic set and Consumer<NetworkTableValue> interface
          boolean success = entry.set(NetworkTableValue.makeDouble(...));
          boolean success = entry.accept(NetworkTableValue.makeDouble(...));
        }
        public void unpublish() {
          // you can stop publishing an entry while keeping the subscriber alive
          entry.unpublish();
        }
        // often not required in robot code, unless this class doesn't exist for
        // the lifetime of the entire robot program, in which case close() needs to be
        // called to stop subscribing/publishing
        public void close() {
          pub.close();
          sub.close();
          entry.close();
        }
      }
      ```

    .. tab-item:: C++
      :sync: C++

      ```c++
      class Example {
        // the entry is an instance variable so its lifetime matches that of the class
        // subscribing/publishing is automatically stopped when dblEntry is destroyed by
        // the class destructor
        nt::GenericPublisher pub;
        nt::GenericSubscriber sub;
        nt::GenericEntry entry;
       public:
        Example(nt::Topic topic) {
          // start subscribing; the return value must be retained.
          // when publishing, a type string must be provided
          pub = topic.GenericPublish("double");
          // subscribing can optionally include a type string
          // unlike type-specific subscribers, no default value is provided
          sub = topic.GenericSubscribe();
          sub = topic.GenericSubscribe("double");
          // when getting an entry, the type string is also optional; if not provided
          // the publisher data type will be determined by the first publisher-creating call
          entry = topic.GetEntry();
          entry = topic.GetEntry("double");
          // publish and subscribe options may be specified using PubSubOptions
          pub = topic.GenericPublish("double",
              {.pollStorage = 10, .keepDuplicates = true});
          sub = topic.GenericSubscribe(
              {.pollStorage = 10, .keepDuplicates = true});
          entry = topic.GetGenericEntry(
              {.pollStorage = 10, .keepDuplicates = true});
          // genericPublishEx provides the option of setting initial properties.
          pub = topic.genericPublishEx("double", {{"myprop", 5}},
              {.pollStorage = 10, .keepDuplicates = true});
        }
        void Periodic() {
          // generic subscribers and entries have typed get operations; a default must be provided
          double val = sub.GetDouble(-1.0);
          double val = entry.GetDouble(-1.0);
          // they also support an untyped get
          nt::NetworkTableValue val = sub.Get();
          nt::NetworkTableValue val = entry.Get();
          // they also support readQueue
          std::vector<nt::NetworkTableValue> updates = sub.ReadQueue();
          std::vector<nt::NetworkTableValue> updates = entry.ReadQueue();
          // publishers and entries have typed set operations; these return false if the
          // topic already exists with a mismatched type
          bool success = pub.SetDefaultDouble(1.0);
          bool success = pub.SetBoolean(true);
          // they also implement a generic set and Consumer<NetworkTableValue> interface
          bool success = entry.Set(nt::NetworkTableValue::MakeDouble(...));
        }
        void Unpublish() {
          // you can stop publishing an entry while keeping the subscriber alive
          entry.Unpublish();
        }
      };
      ```

    .. tab-item:: Python
      :sync: Python

      ```python
      class Example:
          def __init__(self, topic: ntcore.Topic):
              # start subscribing; the return value must be retained.
              # when publishing, a type string must be provided
              self.pub = topic.genericPublish("double")
              # subscribing can optionally include a type string
              # unlike type-specific subscribers, no default value is provided
              self.sub = topic.genericSubscribe()
              self.sub = topic.genericSubscribe("double")
              # when getting an entry, the type string is also optional; if not provided
              # the publisher data type will be determined by the first publisher-creating call
              self.entry = topic.getGenericEntry()
              self.entry = topic.getGenericEntry("double")
              # publish and subscribe options may be specified using PubSubOption
              self.pub = topic.genericPublish(
                  "double", ntcore.PubSubOptions(keepDuplicates=True, pollStorage=10)
              )
              self.sub = topic.genericSubscribe(
                  ntcore.PubSubOptions(keepDuplicates=True, pollStorage=10)
              )
              self.entry = topic.getGenericEntry(
                  ntcore.PubSubOptions(keepDuplicates=True, pollStorage=10)
              )
              # genericPublishEx provides the option of setting initial properties.
              self.pub = topic.genericPublishEx(
                  "double",
                  {"retained": true},
                  ntcore.PubSubOptions(keepDuplicates=True, pollStorage=10),
              )
          def periodic(self):
              # generic subscribers and entries have typed get operations; a default must be provided
              val = self.sub.getDouble(-1.0)
              val = self.entry.getDouble(-1.0)
              # they also support an untyped get (also meets Supplier<NetworkTableValue> interface)
              val = self.sub.get()
              val = self.entry.get()
              # they also support readQueue
              updates = self.sub.readQueue()
              updates = self.entry.readQueue()
              # publishers and entries have typed set operations; these return false if the
              # topic already exists with a mismatched type
              success = self.pub.setDefaultDouble(1.0)
              success = self.pub.setBoolean(True)
              # they also implement a generic set
              success = self.entry.set(ntcore.Value.makeDouble(...))
          def unpublish(self):
              # you can stop publishing an entry while keeping the subscriber alive
              self.entry.unpublish()
          # often not required in robot code, unless this class doesn't exist for
          # the lifetime of the entire robot program, in which case close() needs to be
          # called to stop subscribing/publishing
          def close(self):
              self.pub.close()
              self.sub.close()
              self.entry.close()
      ```

## Subscribing to Multiple Topics

While in most cases it's only necessary to subscribe to individual topics, it is sometimes useful (e.g. in dashboard applications) to subscribe and get value updates for changes to multiple topics. Listeners (see :ref:`docs/software/networktables/listening-for-change:listening for changes`) can be used directly, but creating a ``MultiSubscriber`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/MultiSubscriber.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_multi_subscriber.html)) allows specifying subscription options and reusing the same subscriber for multiple listeners.

.. tab-set::

    .. tab-item:: Java
      :sync: Java

      ```java
      public class Example {
        // the subscriber is an instance variable so its lifetime matches that of the class
        final MultiSubscriber multiSub;
        final NetworkTableListenerPoller poller;
        public Example(NetworkTableInstance inst) {
          // start subscribing; the return value must be retained.
          // provide an array of topic name prefixes
          multiSub = new MultiSubscriber(inst, new String[] {"/table1/", "/table2/"});
          // subscribe options may be specified using PubSubOption
          multiSub = new MultiSubscriber(inst, new String[] {"/table1/", "/table2/"},
              PubSubOption.keepDuplicates(true));
          // to get value updates from a MultiSubscriber, it's necessary to create a listener
          // (see the listener documentation for more details)
          poller = new NetworkTableListenerPoller(inst);
          poller.addListener(multiSub, EnumSet.of(NetworkTableEvent.Kind.kValueAll));
        }
        public void periodic() {
          // read value events
          NetworkTableEvent[] events = poller.readQueue();
          for (NetworkTableEvent event : events) {
            NetworkTableValue value = event.valueData.value;
          }
        }
        // often not required in robot code, unless this class doesn't exist for
        // the lifetime of the entire robot program, in which case close() needs to be
        // called to stop subscribing
        public void close() {
          // close listener
          poller.close();
          // stop subscribing
          multiSub.close();
        }
      }
      ```

    .. tab-item:: C++
      :sync: C++

      ```c++
      class Example {
        // the subscriber is an instance variable so its lifetime matches that of the class
        // subscribing is automatically stopped when multiSub is destroyed by the class destructor
        nt::MultiSubscriber multiSub;
        nt::NetworkTableListenerPoller poller;
       public:
        explicit Example(nt::NetworkTableInstance inst) {
          // start subscribing; the return value must be retained.
          // provide an array of topic name prefixes
          multiSub = nt::MultiSubscriber{inst, {{"/table1/", "/table2/"}}};
          // subscribe options may be specified using PubSubOption
          multiSub = nt::MultiSubscriber{inst, {{"/table1/", "/table2/"}},
              {.keepDuplicates = true}};
          // to get value updates from a MultiSubscriber, it's necessary to create a listener
          // (see the listener documentation for more details)
          poller = nt::NetworkTableListenerPoller{inst};
          poller.AddListener(multiSub, nt::EventFlags::kValueAll);
        }
        void Periodic() {
          // read value events
          std::vector<nt::Event> events = poller.ReadQueue();
          for (auto&& event : events) {
            nt::NetworkTableValue value = event.GetValueEventData()->value;
          }
        }
      };
      ```

    .. tab-item:: C++ (Handle-based)
      :sync: C++ (Handle-based)

      ```c++
      class Example {
        // the subscriber is an instance variable, but since it's a handle, it's
        // not automatically released, so we need a destructor
        NT_MultiSubscriber multiSub;
        NT_ListenerPoller poller;
       public:
        explicit Example(NT_Inst inst) {
          // start subscribing; the return value must be retained.
          // provide an array of topic name prefixes
          multiSub = nt::SubscribeMultiple(inst, {{"/table1/", "/table2/"}});
          // subscribe options may be specified using PubSubOption
          multiSub = nt::SubscribeMultiple(inst, {{"/table1/", "/table2/"}},
              {.keepDuplicates = true});
          // to get value updates from a MultiSubscriber, it's necessary to create a listener
          // (see the listener documentation for more details)
          poller = nt::CreateListenerPoller(inst);
          nt::AddPolledListener(poller, multiSub, nt::EventFlags::kValueAll);
        }
        void Periodic() {
          // read value events
          std::vector<nt::Event> events = nt::ReadListenerQueue(poller);
          for (auto&& event : events) {
            nt::NetworkTableValue value = event.GetValueEventData()->value;
          }
        }
        ~Example() {
          // close listener
          nt::DestroyListenerPoller(poller);
          // stop subscribing
          nt::UnsubscribeMultiple(multiSub);
        }
      ```

    .. tab-item:: C
      :sync: C

      ```c
      // This code assumes that a NT_Inst inst variable already exists
      // start subscribing
      // provide an array of topic name prefixes
      struct NT_String prefixes[2];
      prefixes[0].str = "/table1/";
      prefixes[0].len = 8;
      prefixes[1].str = "/table2/";
      prefixes[1].len = 8;
      NT_MultiSubscriber multiSub = NT_SubscribeMultiple(inst, prefixes, 2, NULL, 0);
      // subscribe options may be specified using NT_PubSubOptions
      struct NT_PubSubOptions options;
      memset(&options, 0, sizeof(options));
      options.structSize = sizeof(options);
      options.keepDuplicates = 1;  // true
      NT_MultiSubscriber multiSub = NT_SubscribeMultiple(inst, prefixes, 2, &options);
      // to get value updates from a MultiSubscriber, it's necessary to create a listener
      // (see the listener documentation for more details)
      NT_ListenerPoller poller = NT_CreateListenerPoller(inst);
      NT_AddPolledListener(poller, multiSub, NT_EVENT_VALUE_ALL);
      // read value events
      size_t eventsLen;
      struct NT_Event* events = NT_ReadListenerQueue(poller, &eventsLen);
      for (size_t i = 0; i < eventsLen; i++) {
        NT_Value* value = &events[i].data.valueData.value;
      }
      NT_DisposeEventArray(events, eventsLen);
      // close listener
      NT_DestroyListenerPoller(poller);
      // stop subscribing
      NT_UnsubscribeMultiple(multiSub);
      ```

    .. tab-item:: Python
      :sync: Python

      ```python
      class Example:
          def __init__(self, inst: ntcore.NetworkTableInstance):
              # start subscribing; the return value must be retained.
              # provide an array of topic name prefixes
              self.multiSub = ntcore.MultiSubscriber(inst, ["/table1/", "/table2/"])
              # subscribe options may be specified using PubSubOption
              self.multiSub = ntcore.MultiSubscriber(
                  inst, ["/table1/", "/table2/"], ntcore.PubSubOptions(keepDuplicates=True)
              )
              # to get value updates from a MultiSubscriber, it's necessary to create a listener
              # (see the listener documentation for more details)
              self.poller = ntcore.NetworkTableListenerPoller(inst)
              self.poller.addListener(self.multiSub, ntcore.EventFlags.kValueAlls)
          def periodic(self):
              # read value events
              events = self.poller.readQueue()
              for event in events:
                  value: ntcore.Value = event.data.value
          # often not required in robot code, unless this class doesn't exist for
          # the lifetime of the entire robot program, in which case close() needs to be
          # called to stop subscribing
          def close(self):
              # close listener
              self.poller.close()
              # stop subscribing
              self.multiSub.close()
      ```

## Publish/Subscribe Options

Publishers and subscribers have various options that affect their behavior. Options can only be set at the creation of the publisher, subscriber, or entry. Options set on an entry affect both the publisher and subscriber portions of the entry. The above examples show how options can be set when creating a publisher or subscriber.

Subscriber options:

- ``pollStorage``: Polling storage size for a subscription. Specifies the maximum number of updates NetworkTables should store between calls to the subscriber's ``readQueue()`` function. If zero, defaults to 1 if sendAll is false, 20 if sendAll is true.

- ``topicsOnly``: Don't send value changes, only topic announcements. Defaults to false. As a client doesn't get topic announcements for topics it is not subscribed to, this option may be used with ``MultiSubscriber`` to get topic announcements for a particular topic name prefix, without also getting all value changes.

- ``excludePublisher``: Used to exclude a single publisher's updates from being queued to the subscriber's ``readQueue()`` function. This is primarily useful in scenarios where you don't want local value updates to be "echoed back" to a local subscriber. Regardless of this setting, the topic value is updated--this only affects ``readQueue()`` on this subscriber.

- ``disableRemote``: If true, remote value updates are not queued for ``readQueue()``. Defaults to false. Regardless of this setting, the topic value is updated--this only affects ``readQueue()`` on this subscriber.

- ``disableLocal``: If true, local value updates are not queued for ``readQueue()``. Defaults to false. Regardless of this setting, the topic value is updated--this only affects ``readQueue()`` on this subscriber.

Subscriber and publisher options:

- ``periodic``: How frequently changes will be sent over the network, in seconds. NetworkTables may send more frequently than this (e.g. use a combined minimum period for all values) or apply a restricted range to this value. The default is 0.1 seconds. For publishers, it specifies how frequently local changes should be sent over the network; for subscribers, it is a request to the server to send server changes at the requested rate. Note that regardless of the setting of this option, only value changes are sent, unless the ``keepDuplicates`` option is set.

- ``sendAll``: If true, send all value changes over the network. Defaults to false. As with ``periodic``, this is a request to the server for subscribers and a behavior change for publishers.

- ``keepDuplicates``: If true, preserves duplicate value changes (rather than ignoring them). Defaults to false. As with ``periodic``, this is a request to the server for subscribers and a behavior change for publishers.

Entry options:

- ``excludeSelf``: Provides the same behavior as ``excludePublisher`` for the entry's internal publisher. Defaults to false.

## NetworkTableEntry

``NetworkTableEntry`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/NetworkTableEntry.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_network_table_entry.html), :external:py:class:`Python <ntcore.NetworkTableEntry>`) is a class that exists for backwards compatibility. New code should prefer using type-specific Publisher and Subscriber classes, or GenericEntry if non-type-specific access is needed.

It is similar to ``GenericEntry`` in that it supports both publishing and subscribing in a single object. However, unlike ``GenericEntry``, ``NetworkTableEntry`` is not released (e.g. unsubscribes/unpublishes) if ``close()`` is called (in Java) or the object is destroyed (in C++); instead, it operates similar to ``Topic``, in that only a single ``NetworkTableEntry`` exists for each topic and it lasts for the lifetime of the instance.
