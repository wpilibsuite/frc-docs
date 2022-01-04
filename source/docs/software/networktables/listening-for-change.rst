Listening for value changes
===========================
A common use case for :term:`NetworkTables` is where a program on the Driver Station generates values that need to be sent to the robot. For example, imagine that some image processing code running on the Driver Station computes the heading and distance to a goal and sends those values to the robot. In this case it might be desirable for the robot program to be notified when new values arrive from the Driver Station. NetworkTables provides facilities to do that.

Using a NetworkTable EntryListener
----------------------------------
One of the more common cases for NetworkTables is waiting for a value to change on the robot. This is called an EntryListener because it notifies the robot program when a NetworkTables entry (single value) changes. The following code shows how to do this.

.. tabs::

   .. code-tab:: java

      package networktablesdesktopclient;

      import edu.wpi.first.networktables.EntryListenerFlags;
      import edu.wpi.first.networktables.NetworkTable;
      import edu.wpi.first.networktables.NetworkTableEntry;
      import edu.wpi.first.networktables.NetworkTableInstance;

      public class TableEntryListenerExample {

         public static void main(String[] args) {
            new TableEntryListenerExample().run();
         }

         public void run() {
            //get the default instance of NetworkTables
            NetworkTableInstance inst = NetworkTableInstance.getDefault();

            //get a reference to the subtable called "datatable"
            NetworkTable datatable = inst.getTable("datatable");

            //get a reference to key in "datatable" called "Y"
            NetworkTableEntry yEntry = datatable.getEntry("Y");
            inst.startClientTeam(190);

            //add an entry listener for changed values of "X", the lambda ("->" operator)
            //defines the code that should run when "X" changes
            datatable.addEntryListener("X", (table, key, entry, value, flags) -> {
               System.out.println("X changed value: " + value.getValue());
            }, EntryListenerFlags.kNew | EntryListenerFlags.kUpdate);

            //add an entry listener for changed values of "Y", the lambda ("->" operator)
            //defines the code that should run when "Y" changes
            yEntry.addListener(event -> {
               System.out.println("Y changed value: " + event.getEntry().getValue());
            }, EntryListenerFlags.kNew | EntryListenerFlags.kUpdate);

            try {
               Thread.sleep(10000);
            } catch (InterruptedException ex) {
               System.out.println("Interrupted");
               Thread.currentThread().interrupt();
               return;
            }
         }
      }
