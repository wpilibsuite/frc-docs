NetworkTables Instances
=======================

The NetworkTables implementation supports simultaneous operation of multiple "instances." Each instance has a completely independent set of topics, publishers, subscribers, and client/server state. This feature is mainly useful for unit testing. It allows a single program to be a member of two :term:`NetworkTables` "networks" that contain different (and unrelated) sets of topics, or running both client and server instances in a single program.

For most general usage, you should use the "default" instance, as all current dashboard programs can only connect to a single NetworkTables server at a time. Normally the default instance is set up on the robot as a server, and used for communication with the dashboard program running on your driver station computer. This is what the SmartDashboard and LiveWindow classes use.

However, if you wanted to do unit testing of your robot program's NetworkTables communications, you could set up your unit tests such that they create a separate client instance (still within the same program) and have it connect to the server instance that the main robot code is running.

The ``NetworkTableInstance`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/NetworkTableInstance.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classnt_1_1_network_table_instance.html>`__, `Python <https://robotpy.readthedocs.io/projects/pyntcore/en/stable/ntcore/NetworkTableInstance.html>`__) class provides the API abstraction for instances. The number of instances that can be simultaneously created is limited to 16 (including the default instance), so when using multiple instances in cases such as unit testing code, it's important to destroy instances that are no longer needed.

Destroying a NetworkTableInstance frees all resources related to the instance. All classes or handles that reference the instance (e.g. Topics, Publishers, and Subscribers) are invalidated and may result in unexpected behavior if used after the instance is destroyed--in particular, instance handles are reused so it's possible for a handle "left over" from a previously destroyed instance to refer to an unexpected resource in a newly created instance.

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            // get the default NetworkTable instance
            NetworkTableInstance defaultInst = NetworkTableInstance.getDefault();

            // create a NetworkTable instance
            NetworkTableInstance inst = NetworkTableInstance.create();

            // destroy a NetworkTable instance
            inst.close();

    .. group-tab:: C++

        .. code-block:: cpp

            // get the default NetworkTable instance
            nt::NetworkTableInstance defaultInst = nt::NetworkTableInstance::GetDefault();

            // create a NetworkTable instance
            nt::NetworkTableInstance inst = nt::NetworkTableInstance::Create();

            // destroy a NetworkTable instance; NetworkTableInstance objects are not RAII
            nt::NetworkTableInstance::Destroy(inst);

    .. group-tab:: C++ (handle-based)

        .. code-block:: cpp

            // get the default NetworkTable instance
            NT_Instance defaultInst = nt::GetDefaultInstance();

            // create a NetworkTable instance
            NT_Instance inst = nt::CreateInstance();

            // destroy a NetworkTable instance
            nt::DestroyInstance(inst);

    .. group-tab:: C

        .. code-block:: c

            // get the default NetworkTable instance
            NT_Instance defaultInst = NT_GetDefaultInstance();

            // create a NetworkTable instance
            NT_Instance inst = NT_CreateInstance();

            // destroy a NetworkTable instance
            NT_DestroyInstance(inst);

    .. group-tab:: Python

        .. code-block:: python

            import ntcore

            # get the default NetworkTable instance
            defaultInst = ntcore.NetworkTableInstance.getDefault()

            # create a NetworkTable instance
            inst = ntcore.NetworkTableInstance.create()

            # destroy a NetworkTable instance
            ntcore.NetworkTableInstance.destroy(inst)
