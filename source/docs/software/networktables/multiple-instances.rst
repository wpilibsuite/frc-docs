Creating multiple instances of NetworkTables
============================================

This feature is mainly useful for coprocessors and unit testing. It allows a single program to be a member of two completely independent :term:`NetworkTables` "networks" that contain completely different (and unrelated) sets of tables. For most general usage, you should use tables within the single instance, as all current dashboard programs can only connect to a single NetworkTables server at a time.

Normally the "default" instance is set up on the robot as a server, and used for communication with the dashboard program running on your driver station computer. This is what the SmartDashboard and LiveWindow classes use.

If you had a coprocessor and wanted to have a set of tables that's shared only between the coprocessor and the robot, you could set up a separate instance in the robot code that acts as a client (or a server) and connect the coprocessor to it, and those tables will NOT be sent to the dashboard.

Similarly, if you wanted to do unit testing of your robot program's NetworkTables communications, you could set up your unit tests such that they create a separate client instance (still within the same program) and have it connect to the server instance that the main robot code is running.

Another example might be having two completely separate dashboard programs. You could set up two NetworkTables server instances in your robot program (on different TCP ports of course), set up different tables on each one, and have each dashboard connect to a different server instance. Each dashboard would only see the tables on its instance.
