Writing a Simple NetworkTables Robot Program
============================================

In a robot program, a NetworkTables server is automatically started on the default instance. So it's only necessary to get the default instance to start publishing or subscribing and have it visible over the network.

The example robot program below publishes incrementing X and Y values to a table named ``datatable``. The values for X and Y can be easily viewed using the OutlineViewer program that shows the NetworkTables hierarchy and all the values associated with each topic.

.. tabs::

    .. code-tab:: java

        package edu.wpi.first.wpilibj.templates;

        import edu.wpi.first.wpilibj.TimedRobot;
        import edu.wpi.first.networktables.DoublePublisher;
        import edu.wpi.first.networktables.NetworkTable;
        import edu.wpi.first.networktables.NetworkTableInstance;

        public class EasyNetworkTableExample extends TimedRobot {
          DoublePublisher xPub;
          DoublePublisher yPub;

          public void robotInit() {
            // Get the default instance of NetworkTables that was created automatically
            // when the robot program starts
            NetworkTableInstance inst = NetworkTableInstance.getDefault();

            // Get the table within that instance that contains the data. There can
            // be as many tables as you like and exist to make it easier to organize
            // your data. In this case, it's a table called datatable.
            NetworkTable table = inst.getTable("datatable");

            // Start publishing topics within that table that correspond to the X and Y values
            // for some operation in your program.
            // The topic names are actually "/datatable/x" and "/datatable/y".
            xPub = table.getDoubleTopic("x").publish();
            yPub = table.getDoubleTopic("y").publish();
          }

          double x = 0;
          double y = 0;

          public void teleopPeriodic() {
            // Publish values that are constantly increasing.
            xPub.set(x);
            yPub.set(y);
            x += 0.05;
            y += 1.0;
          }
        }

    .. code-tab:: c++

        #include <frc/TimedRobot.h>
        #include <networktables/DoubleTopic.h>
        #include <networktables/NetworkTable.h>
        #include <networktables/NetworkTableInstance.h>

        class EasyNetworkExample : public frc::TimedRobot {
         public:
          nt::DoublePublisher xPub;
          nt::DoublePublisher yPub;

          void RobotInit() {
            // Get the default instance of NetworkTables that was created automatically
            // when the robot program starts
            auto inst = nt::NetworkTableInstance::GetDefault();

            // Get the table within that instance that contains the data. There can
            // be as many tables as you like and exist to make it easier to organize
            // your data. In this case, it's a table called datatable.
            auto table = inst.GetTable("datatable");

            // Start publishing topics within that table that correspond to the X and Y values
            // for some operation in your program.
            // The topic names are actually "/datatable/x" and "/datatable/y".
            xPub = table->GetDoubleTopic("x").Publish();
            yPub = table->GetDoubleTopic("y").Publish();
          }

          double x = 0;
          double y = 0;

          void TeleopPeriodic() {
            // Publish values that are constantly increasing.
            xPub.Set(x);
            yPub.Set(y);
            x += 0.05;
            y += 0.05;
          }
        }

        START_ROBOT_CLASS(EasyNetworkExample)

    .. code-tab:: python

        #!/usr/bin/env python3

        import ntcore
        import wpilib


        class EasyNetworkTableExample(wpilib.TimedRobot):
            def robotInit(self) -> None:
                # Get the default instance of NetworkTables that was created automatically
                # when the robot program starts
                inst = ntcore.NetworkTableInstance.getDefault()

                # Get the table within that instance that contains the data. There can
                # be as many tables as you like and exist to make it easier to organize
                # your data. In this case, it's a table called datatable.
                table = inst.getTable("datatable")

                # Start publishing topics within that table that correspond to the X and Y values
                # for some operation in your program.
                # The topic names are actually "/datatable/x" and "/datatable/y".
                self.xPub = table.getDoubleTopic("x").publish()
                self.yPub = table.getDoubleTopic("y").publish()

                self.x = 0
                self.y = 0

            def teleopPeriodic(self) -> None:
                # Publish values that are constantly increasing.
                self.xPub.set(self.x)
                self.yPub.set(self.y)
                self.x += 0.05
                self.y += 1.0


        if __name__ == "__main__":
            wpilib.run(EasyNetworkTableExample)

