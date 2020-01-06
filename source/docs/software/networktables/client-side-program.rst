Creating a client-side program
==============================

If all you need to do is have your robot program communicate with GRIP or a dashboard running on the Driver Station laptop, then the previous examples of writing robot programs are sufficient. But if you would like to write some custom client code that would run on the drivers station or on a coprocessor then you need to know how to build Network Tables programs for those (non-roboRIO) platforms.

A basic client program looks like the following example.

.. tabs::

   .. code-tab:: java
      package networktablesdesktopclient;
      import edu.wpi.first.networktables.NetworkTable;
      import edu.wpi.first.networktables.NetworkTableEntry;
      import edu.wpi.first.networktables.NetworkTableInstance;

      public class NetworkTablesDesktopClient {
        public static void main(String[] args) {
          new NetworkTablesDesktopClient().run();
        }

        public void run() {
          NetworkTableInstance inst = NetworkTableInstance.getDefault();
          NetworkTable table = inst.getTable("datatable");
          NetworkTableEntry xEntry = table.getEntry("x");
          NetworkTableEntry yEntry = table.getEntry("y");
          inst.startClientTeam(TEAM);  // where TEAM=190, 294, etc, or use inst.startClient("hostname") or similar
          inst.startDSClient();  // recommended if running on DS computer; this gets the robot IP from the DS
          while (true) {
            try {
              Thread.sleep(1000);
            } catch (InterruptedException ex) {
              System.out.println("interrupted");
              return;
            }
            double x = xEntry.getDouble(0.0);
            double y = yEntry.getDouble(0.0);
            System.out.println("X: " + x + " Y: " + y);
          }
        }
      }

In this example an instance of NetworkTables is created and a NetworkTableEntry if created to reference the values of "x" and "y" from a table called "datatable".

Then this instance is started as a NetworkTable client with the team number (the roboRIO is always the server). Additionally, if the program is running on the Driver Station computer, by using the startDSClient() method, NetworkTables will get the robot IP address from the Driver Station.

Then this sample program simply loops once a second and gets the values for x and y and prints them on the console. In a more realistic program, the client might be processing or generating values for the robot to consume.

Building the program
--------------------
When building and running the program you will need some additional libraries to include with your client-side program. These are:

https://frcmaven.wpi.edu/artifactory/release/edu/wpi/first/ntcore/ntcore-java/2020.1.2/ (ntcore java files)

https://frcmaven.wpi.edu/artifactory/release/edu/wpi/first/ntcore/ntcore-jni/2020.1.2/ (ntcore native libs for all desktop platforms)

https://frcmaven.wpi.edu/artifactory/release/edu/wpi/first/wpiutil/wpiutil-java/2020.1.2/ (wpiutil java files)

.. note:: The desktop platform jar is for Windows, macOS, and Linux.
