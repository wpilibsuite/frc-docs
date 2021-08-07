What is NetworkTables
=====================

:term:`NetworkTables` is an implementation of a distributed "dictionary". That is named values are created either on the robot, driver station, or potentially an attached coprocessor, and the values are automatically distributed to all the other participants. For example, a driver station laptop might receive camera images over the network, perform some vision processing algorithm, and come up with some values to sent back to the robot. The values might be an X, Y, and Distance. By writing these results to NetworkTables values called "X", "Y", and "Distance" they can be read by the robot shortly after being written. Then the robot can act upon them.

NetworkTables can be used by programs on the robot in either C++, Java or LabVIEW and is built into each version of WPILib.

NetworkTables organization
---------------------------

Data is organized in NetworkTables in a hierarchy much like a directory on disk with folders and files. For any instance of NetworkTables there can be multiple values and subtables that may be nested in whatever way fits the data organization desired. Subtables actually are represented as a long key with slashes (/) separating the nested subtable and value key names. Each value has a key associated with it that is used to retrieve the value. For example, you might have a table called **datatable** as shown in the following examples. Within a **datatable** there are two keys, X and Y and their associated values. The OutlineViewer is a good utility for exploring the values stored in NetworkTables while a program is running.

Data types for NetworkTables are either boolean, numeric, or string. Numeric values are written as double precision values. In addition you can have arrays of any of those types to ensure that multiple data items are delivered consistently. There is also the option of storing raw data which can be used for representing structured data.

There are some default tables that are created automatically when the program starts up:

+-----------------+--------------------------+
| Table name      | Use                      |
+=================+==========================+
| /SmartDashboard | Used to store values     |
|                 | written to the           |
|                 | SmartDashboard or        |
|                 | Shuffleboard using the   |
|                 | ``SmartDashboard.put()`` |
|                 | set of methods.          |
+-----------------+--------------------------+
| /LiveWindow     | Used to store Test mode  |
|                 | (Test on the Driver      |
|                 | Station) values.         |
|                 | Typically these are      |
|                 | Subsystems and the       |
|                 | associated sensors and   |
|                 | actuators.               |
+-----------------+--------------------------+
| /FMSInfo        | Information about the    |
|                 | currently running match  |
|                 | that comes from the      |
|                 | Driver Station and the   |
|                 | Field Management System  |
+-----------------+--------------------------+

Writing a simple NetworkTables program
--------------------------------------

The NetworkTables classes are instantiated automatically when your program starts. To access the instance of NetworkTables do call methods to read and write the getDefault() method can be used to get the default instance.

.. tabs::

   .. code-tab:: java

      package edu.wpi.first.wpilibj.templates;

      import edu.wpi.first.wpilibj.TimedRobot;
      import edu.wpi.first.networktables.NetworkTable;
      import edu.wpi.first.networktables.NetworkTableEntry;
      import edu.wpi.first.networktables.NetworkTableInstance;

      public class EasyNetworkTableExample extends TimedRobot {
         NetworkTableEntry xEntry;
         NetworkTableEntry yEntry;

         public void robotInit() {
            //Get the default instance of NetworkTables that was created automatically
            //when your program starts
            NetworkTableInstance inst = NetworkTableInstance.getDefault();

            //Get the table within that instance that contains the data. There can
            //be as many tables as you like and exist to make it easier to organize
            //your data. In this case, it's a table called datatable.
            NetworkTable table = inst.getTable("datatable");

            //Get the entries within that table that correspond to the X and Y values
            //for some operation in your program.
            xEntry = table.getEntry("X");
            yEntry = table.getEntry("Y");
         }

         double x = 0;
         double y = 0;

         public void teleopPeriodic() {
            //Using the entry objects, set the value to a double that is constantly
            //increasing. The keys are actually "/datatable/X" and "/datatable/Y".
            //If they don't already exist, the key/value pair is added.
            xEntry.setDouble(x);
            yEntry.setDouble(y);
            x += 0.05;
            y += 1.0;
         }
      }

   .. code-tab:: c++

      #include "TimedRobot.h"
      #include "networktables/NetworkTable.h"
      #include "networktables/NetworkTableEntry.h"
      #include "networktables/NetworkTableInstance.h"

      class EasyNetworkExample : public frc::TimedRobot {
         public:
         nt::NetworkTableEntry xEntry;
         nt::NetworkTableEntry xEntry;

         void RobotInit() {
            auto inst = nt::NetworkTableInstance::GetDefault();
            auto table = inst.GetTable("datatable");
            xEntry = table->GetEntry("X");
            yEntry = table->GetEntry("Y");
         }

         double x = 0;
         double y = 0;

         void TeleopPeriodic() {
            xEntry.SetDouble(x);
            xEntry.SetDouble(Y);
            x += 0.05;
            y += 0.05;
         }
      }

      START_ROBOT_CLASS(EasyNetworkExample)


The values for X and Y can be easily viewed using the OutlineViewer program that shows the NetworkTables hierarchy and all the values associated with each key.

.. note:: Actually NetworkTables has a flat namespace for the keys. Having tables and subtables is an abstraction to make it easier to organize your data. So for a table called "SmartDashboard" and a key named "xValue", it is really a single key called "/SmartDashboard/xValue". The hierarchy is not actually represented in the distributed data, only keys with prefixes that are the contained table.
