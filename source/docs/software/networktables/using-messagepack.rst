Using MessagePack
=================

Passing structured data through Network Tables is now possible using
`MessagePack <https://msgpack.org/index.html>`__, a format that is also
understood by the Glass tool, which renders a nice little tree.

Here are a few snippets of how to do it in Java on Windows, which could be used
to make a little dashboard app that can be run by the Driver Station.  These
snippets are simplified, eliding several parts required to make them work.
To run it yourself, check out the complete demo found
`here.  <https://github.com/truher/radar>`__

There's more than one way to get data in and out of MessagePack; for example,
the `MessagePack for Java <https://github.com/msgpack/msgpack-java>`__ library
supports manual packing (packDouble, packInt, packByte, etc) using a
`MessagePacker <https://github.com/msgpack/msgpack-java/blob/develop/msgpack-core/src/main/java/org/msgpack/core/MessagePacker.java>`__.
but this manual method seems error-prone and tedious.

Instead, we'll use a **data binding approach,** using the
`Jackson serializer <https://github.com/msgpack/msgpack-java/blob/develop/msgpack-jackson/README.md>`__.
Jackson supports many different binding methods; we'll just use unannotated Java objects,
since it's the simplest approach.

First, for our little dashboard, there's the notion of a target and a container.
Note there are no annotations or anything like that here, Jackson doesn't need
them for this simple case.

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Target {
                public enum Type {
                    TAG, ALLY, OPPONENT, SELF
                }
                public Type type;
                public int id;
                public Pose2d pose;
            }

            public class TargetList {
                public List<Target> targets = new ArrayList<Target>();
            }

These objects are accepted by a consumer, which starts a client, gets a table
("radar") and creates a raw publisher for a topic ("targets").  Each TargetList
update is serialized to bytes by the ObjectMapper and written to the publisher.

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Publisher implements Consumer<TargetList> {
                public NetworkTableInstance inst = NetworkTableInstance.getDefault();
                public ObjectMapper objectMapper = new ObjectMapper(new MessagePackFactory());
                public RawPublisher publisher;

                public Publisher() {
                    inst.startClient4("radar target publisher");
                    inst.setServer("localhost", NetworkTableInstance.kDefaultPort4);
                    publisher = inst.getTable("radar").getRawTopic("targets").publish("msgpack");
                }

                public void accept(TargetList list) {
                    publisher.set(objectMapper.writeValueAsBytes(list));
                }
            }

On the receiver side, the story is similar, with the same client and table, but
instead of creating a publisher, it adds a listener to "value" events.  The
listener extracts the raw bytes from the event, and uses the ObjectMapper to
deserialize back into a TargetList, which is passed to the downstream consumer
(in this case, an AWT-based renderer, see the
`project <https://github.com/truher/radar/>`__ for that).

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Subscriber {
                public ObjectMapper objectMapper = new ObjectMapper(new MessagePackFactory());
                public NetworkTableInstance inst = NetworkTableInstance.getDefault();
                public Consumer<TargetList> consumer;

                public Subscriber(Consumer<TargetList> consumer) {
                    this.consumer = consumer;
                    inst.startClient4("radar target subscriber");
                    inst.setServer("localhost", NetworkTableInstance.kDefaultPort4);
                    inst.addListener(
                        inst.getTable("radar").getEntry("targets"),
                        EnumSet.of(NetworkTableEvent.Kind.kValueAll),
                        (event) -> render(event));
                }

                private void render(NetworkTableEvent event) {
                    consumer.accept(
                        objectMapper.readValue(event.valueData.value.getRaw(), TargetList.class));
                }
            }

And there you have it!  POJO's passed end to end courtesy of Network Tables 4,
MessagePack for Java, and Jackson.

Native Dependencies
-------------------

To use Network Tables, you need to correctly load the native ntcore library,
which itself depends on two other native wpi libraries, and these need to be
correctly handled in the build and app itself.  Also, some parts of wpimath
(e.g. aspects of the pose used in the Target above) involve matrix math from
another native library,
`EJML <https://ejml.org/wiki/index.php?title=Main_Page>`__.
The details of Gradle and native loaders are not complicated, but the error
messages can be hard to interpret when things go wrong, for example, an error
about missing dependent libraries doesn't mention **which** dependent library
is missing.  See `the project <https://github.com/truher/radar>`__
for details in build.gradle and how to load native code in the application.

