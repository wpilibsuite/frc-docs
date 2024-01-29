Stale Data
==========

NetworkTables acts as a distributed table of name and value pairs. If a name/value pair is added to either the server (robot) or any client (dashboard, co-processor, limelight, etc) it is replicated to all devices. If a name/value pair is deleted from, say, the robot but any NetworkTables clients are still running, then when the robot is restarted, the old values will still appear in the client because they never stopped running and continue to have those values in their tables. When the robot restarts, those old values will be replicated to the robot.

To ensure that the robot and clients are showing current values, it is necessary to shut down all NetworkTables clients and robot at the same time. That way, old values that one is holding won't get replicated to the others. Once everything is shut down, the robot and clients can be restarted.

This usually isn't a problem if the program isn't constantly changing, but if the program is in development and the set of keys being added to NetworkTables is constantly changing, then it might be necessary to do the restart of everything to accurately see what is current.
