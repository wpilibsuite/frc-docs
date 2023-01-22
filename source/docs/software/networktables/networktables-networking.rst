NetworkTables Networking
========================

The advantage of the robot program being the server is that it's at a known network name (and typically at a known address) that is based on the team number. This is why it's possible in both the NetworkTables client API and in most dashboards to simply provide the team number, rather than a server address. As the robot program is the server, note this means the NetworkTables server is running on the local computer when running in simulation.

Starting a NetworkTables Server
-------------------------------

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            NetworkTableInstance inst = NetworkTableInstance.getDefault();
            inst.startServer();

    .. group-tab:: C++

        .. code-block:: cpp

            nt::NetworkTableInstance inst = nt::NetworkTableInstance::GetDefault();
            inst.StartServer();

    .. group-tab:: C++ (handle-based)

        .. code-block:: cpp

            NT_Inst inst = nt::GetDefaultInstance();
            nt::StartServer(inst, "networktables.json", "", NT_DEFAULT_PORT3, NT_DEFAULT_PORT4);

    .. group-tab:: C

        .. code-block:: c

            NT_Inst inst = NT_GetDefaultInstance();
            NT_StartServer(inst, "networktables.json", "", NT_DEFAULT_PORT3, NT_DEFAULT_PORT4);

    .. group-tab:: Python

        .. code-block:: python

            import ntcore

            inst = ntcore.NetworkTableInstance.getDefault()
            inst.startServer()


Starting a NetworkTables Client
-------------------------------

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            NetworkTableInstance inst = NetworkTableInstance.getDefault();

            // start a NT4 client
            inst.startClient4("example client");

            // connect to a roboRIO with team number TEAM
            inst.setServerTeam(TEAM);

            // starting a DS client will try to get the roboRIO address from the DS application
            inst.startDSClient();

            // connect to a specific host/port
            inst.setServer("host", NetworkTableInstance.kDefaultPort4)

    .. group-tab:: C++

        .. code-block:: cpp

            nt::NetworkTableInstance inst = nt::NetworkTableInstance::GetDefault();

            // start a NT4 client
            inst.StartClient4("example client");

            // connect to a roboRIO with team number TEAM
            inst.SetServerTeam(TEAM);

            // starting a DS client will try to get the roboRIO address from the DS application
            inst.StartDSClient();

            // connect to a specific host/port
            inst.SetServer("host", NT_DEFAULT_PORT4)

    .. group-tab:: C++ (handle-based)

        .. code-block:: cpp

            NT_Inst inst = nt::GetDefaultInstance();

            // start a NT4 client
            nt::StartClient4(inst, "example client");

            // connect to a roboRIO with team number TEAM
            nt::SetServerTeam(inst, TEAM);

            // starting a DS client will try to get the roboRIO address from the DS application
            nt::StartDSClient(inst);

            // connect to a specific host/port
            nt::SetServer(inst, "host", NT_DEFAULT_PORT4)

    .. group-tab:: C

        .. code-block:: c

            NT_Inst inst = NT_GetDefaultInstance();

            // start a NT4 client
            NT_StartClient4(inst, "example client");

            // connect to a roboRIO with team number TEAM
            NT_SetServerTeam(inst, TEAM);

            // starting a DS client will try to get the roboRIO address from the DS application
            NT_StartDSClient(inst);

            // connect to a specific host/port
            NT_SetServer(inst, "host", NT_DEFAULT_PORT4)

    .. group-tab:: Python

        .. code-block:: python

            import ntcore

            inst = ntcore.NetworkTableInstance.getDefault()

            # start a NT4 client
            inst.startClient4("example client")

            # connect to a roboRIO with team number TEAM
            inst.setServerTeam(TEAM)

            # starting a DS client will try to get the roboRIO address from the DS application
            inst.startDSClient()

            # connect to a specific host/port
            inst.setServer("host", ntcore.NetworkTableInstance.kDefaultPort4)
