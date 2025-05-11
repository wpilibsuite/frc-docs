# NetworkTables Tables and Topics

## Using the NetworkTable Class

The ``NetworkTable`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/NetworkTable.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_network_table.html), :external:py:class:`Python <ntcore.NetworkTable>`) class is an API abstraction that represents a single "folder" (or "table") of topics as described in :ref:`docs/software/networktables/networktables-intro:networktables organization`. The NetworkTable class stores the base path to the table and provides functions to get topics within the table, automatically prepending the table path.

## Getting a Topic

A ``Topic`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/Topic.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_topic.html), :external:py:class:`Python <ntcore.Topic>`) object (or ``NT_Topic`` handle) represents a :term:`topic`. This has a 1:1 correspondence with the topic's name, and will not change as long as the instance exists. Unlike publishers and subscribers, it is not necessary to store a Topic object.

Having a Topic object or handle does not mean the topic exists or is of the correct type. For convenience when creating publishers and subscribers, there are type-specific Topic classes (e.g. ``BooleanTopic``: [Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/BooleanTopic.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_boolean_topic.html), :external:py:class:`Python <ntcore.BooleanTopic>`), but there is no check at the Topic level to ensure that the topic's type actually matches. The preferred method to get a type-specific topic to call the appropriate type-specific getter, but it's also possible to directly convert a generic Topic into a type-specific Topic class. Note: the handle-based API does not have a concept of type-specific classes.

.. tab-set::

    .. tab-item:: Java
       :sync: Java

        ```java
        NetworkTableInstance inst = NetworkTableInstance.getDefault();
        NetworkTable table = inst.getTable("datatable");
        // get a topic from a NetworkTableInstance
        // the topic name in this case is the full name
        DoubleTopic dblTopic = inst.getDoubleTopic("/datatable/X");
        // get a topic from a NetworkTable
        // the topic name in this case is the name within the table;
        // this line and the one above reference the same topic
        DoubleTopic dblTopic = table.getDoubleTopic("X");
        // get a type-specific topic from a generic Topic
        Topic genericTopic = inst.getTopic("/datatable/X");
        DoubleTopic dblTopic = new DoubleTopic(genericTopic);
        ```

    .. tab-item:: C++
     :sync: C++

        ```c++
        nt::NetworkTableInstance inst = nt::NetworkTableInstance::GetDefault();
        std::shared_ptr<nt::NetworkTable> table = inst.GetTable("datatable");
        // get a topic from a NetworkTableInstance
        // the topic name in this case is the full name
        nt::DoubleTopic dblTopic = inst.GetDoubleTopic("/datatable/X");
        // get a topic from a NetworkTable
        // the topic name in this case is the name within the table;
        // this line and the one above reference the same topic
        nt::DoubleTopic dblTopic = table->GetDoubleTopic("X");
        // get a type-specific topic from a generic Topic
        nt::Topic genericTopic = inst.GetTopic("/datatable/X");
        nt::DoubleTopic dblTopic{genericTopic};
        ```

    .. tab-item:: C++ (Handle-based)
     :sync: C++ (Handle-based)

        ```c++
        NT_Instance inst = nt::GetDefaultInstance();
        // get a topic from a NetworkTableInstance
        NT_Topic topic = nt::GetTopic(inst, "/datatable/X");
        ```

    .. tab-item:: C
        :sync: C

        ```c
        NT_Instance inst = NT_GetDefaultInstance();
        // get a topic from a NetworkTableInstance
        NT_Topic topic = NT_GetTopic(inst, "/datatable/X");
        ```

    .. tab-item:: Python
     :sync: Python


        ```python
        import ntcore
        inst = ntcore.NetworkTableInstance.getDefault()
        table = inst.getTable("datatable")
        # get a topic from a NetworkTableInstance
        # the topic name in this case is the full name
        dblTopic = inst.getDoubleTopic("/datatable/X")
        # get a topic from a NetworkTable
        # the topic name in this case is the name within the table;
        # this line and the one above reference the same topic
        dblTopic = table.getDoubleTopic("X")
        # get a type-specific topic from a generic Topic
        genericTopic = inst.getTopic("/datatable/X")
        dblTopic = ntcore.DoubleTopic(genericTopic)
        ```

