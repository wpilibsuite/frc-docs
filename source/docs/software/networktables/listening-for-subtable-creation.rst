Listening for subtable creation
================================

.. tabs::

   .. code-tab:: java

      package networktablesdesktopclient;

      import edu.wpi.first.networktables.NetworkTable;
      import edu.wpi.first.networktables.NetworkTableInstance;

      public class SubTableListenerExample {

         public static void main(String[] args) {
            new SubTableListenerExample().run();
         }

         public void run() {
            NetworkTableInstance inst = NetworkTableInstance.getDefault();
            NetworkTable table = inst.getTable("datatable");
            inst.startClientTeam(190);

            table.addSubTableListener((parent, name, table) -> {
               System.out.println("Parent: " + parent + " Name: " + name);
            }, false);

            try {
               Thread.sleep(100000);
            } catch (InterruptedException ex) {
               System.out.println("Interrupted!");
            }
         }
      }


In this example a listener is defined that listens for creation of subtables one level down from the listener. That is subtables with the key "/datatable/<any-table-name>". This will fire the callback for each existing subtable, then continue to listen for new subtables created immediately below "datatable" in this case.
