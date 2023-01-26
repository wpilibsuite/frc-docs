.. include:: <isonum.txt>

Creating a Client-side Program
==============================

If all you need to do is have your robot program communicate with a :term:`COTS` coprocessor or a dashboard running on the Driver Station laptop, then the previous examples of writing robot programs are sufficient. But if you would like to write some custom client code that would run on the drivers station or on a coprocessor then you need to know how to build :term:`NetworkTables` programs for those (non-roboRIO) platforms.

A basic client program looks like the following example.

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

           import edu.wpi.first.networktables.DoubleSubscriber;
           import edu.wpi.first.networktables.NetworkTable;
           import edu.wpi.first.networktables.NetworkTableInstance;
           import edu.wpi.first.networktables.NetworkTablesJNI;
           import edu.wpi.first.util.CombinedRuntimeLoader;

           import java.io.IOException;

           import edu.wpi.first.cscore.CameraServerJNI;
           import edu.wpi.first.math.WPIMathJNI;
           import edu.wpi.first.util.WPIUtilJNI;


           public class Program {
               public static void main(String[] args) throws IOException {
                   NetworkTablesJNI.Helper.setExtractOnStaticLoad(false);
                   WPIUtilJNI.Helper.setExtractOnStaticLoad(false);
                   WPIMathJNI.Helper.setExtractOnStaticLoad(false);
                   CameraServerJNI.Helper.setExtractOnStaticLoad(false);

                   CombinedRuntimeLoader.loadLibraries(Program.class, "wpiutiljni", "wpimathjni", "ntcorejni",
                           "cscorejnicvstatic");
                   new Program().run();
               }

               public void run() {
                   NetworkTableInstance inst = NetworkTableInstance.getDefault();
                   NetworkTable table = inst.getTable("datatable");
                   DoubleSubscriber xSub = table.getDoubleTopic("x").subscribe(0.0);
                   DoubleSubscriber ySub = table.getDoubleTopic("y").subscribe(0.0);
                   inst.startClient4("example client");
                   inst.setServer("localhost"); // where TEAM=190, 294, etc, or use inst.setServer("hostname") or similar
                   inst.startDSClient(); // recommended if running on DS computer; this gets the robot IP from the DS
                   while (true) {
                       try {
                           Thread.sleep(1000);
                       } catch (InterruptedException ex) {
                           System.out.println("interrupted");
                           return;
                       }
                       double x = xSub.get();
                       double y = ySub.get();
                       System.out.println("X: " + x + " Y: " + y);
                   }
               }
           }

    .. group-tab:: C++

        .. code-block:: cpp

            #include <chrono>
            #include <thread>
            #include <fmt/format.h>
            #include <networktables/NetworkTableInstance.h>
            #include <networktables/NetworkTable.h>
            #include <networktables/DoubleTopic.h>

            int main() {
              auto inst = nt::NetworkTableInstance::GetDefault();
              auto table = inst.GetTable("datatable");
              auto xSub = table->GetDoubleTopic("x").Subscribe(0.0);
              auto ySub = table->GetDoubleTopic("y").Subscribe(0.0);
              inst.StartClient4("example client");
              inst.SetServerTeam(TEAM);  // where TEAM=190, 294, etc, or use inst.setServer("hostname") or similar
              inst.StartDSClient();  // recommended if running on DS computer; this gets the robot IP from the DS
              while (true) {
                using namespace std::chrono_literals;
                std::this_thread::sleep_for(1s);
                double x = xSub.Get();
                double y = ySub.Get();
                fmt::print("X: {} Y: {}\n", x, y);
              }
            }

    .. group-tab:: C++ (handle-based)

        .. code-block:: cpp

            #include <chrono>
            #include <thread>
            #include <fmt/format.h>
            #include <ntcore_cpp.h>

            int main() {
              NT_Inst inst = nt::GetDefaultInstance();
              NT_Subscriber xSub =
                  nt::Subscribe(nt::GetTopic(inst, "/datatable/x"), NT_DOUBLE, "double");
              NT_Subscriber ySub =
                  nt::Subscribe(nt::GetTopic(inst, "/datatable/y"), NT_DOUBLE, "double");
              nt::StartClient4(inst, "example client");
              nt::SetServerTeam(inst, TEAM, 0);  // where TEAM=190, 294, etc, or use inst.setServer("hostname") or similar
              nt::StartDSClient(inst, 0);  // recommended if running on DS computer; this gets the robot IP from the DS
              while (true) {
                using namespace std::chrono_literals;
                std::this_thread::sleep_for(1s);
                double x = nt::GetDouble(xSub, 0.0);
                double y = nt::GetDouble(ySub, 0.0);
                fmt::print("X: {} Y: {}\n", x, y);
              }
            }

    .. group-tab:: C

        .. code-block:: c

            #include <stdio.h>
            #include <threads.h>
            #include <time.h>
            #include <networktables/ntcore.h>

            int main() {
              NT_Instance inst = NT_GetDefaultInstance();
              NT_Subscriber xSub =
                  NT_Subscribe(NT_GetTopic(inst, "/datatable/x"), NT_DOUBLE, "double", NULL, 0);
              NT_Subscriber ySub =
                  NT_Subscribe(NT_GetTopic(inst, "/datatable/y"), NT_DOUBLE, "double", NULL, 0);
              NT_StartClient4(inst, "example client");
              NT_SetServerTeam(inst, TEAM);  // where TEAM=190, 294, etc, or use inst.setServer("hostname") or similar
              NT_StartDSClient(inst);  // recommended if running on DS computer; this gets the robot IP from the DS
              while (true) {
                thrd_sleep(&(struct timespec){.tv_sec=1}, NULL);
                double x = NT_GetDouble(xSub, 0.0);
                double y = NT_GetDouble(ySub, 0.0);
                printf("X: %f Y: %f\n", x, y);
              }
            }

    .. group-tab:: Python

        .. code-block:: python

            #!/usr/bin/env python3

            import ntcore
            import time

            if __name__ == "__main__":
                inst = ntcore.NetworkTableInstance.getDefault()
                table = inst.getTable("datatable")
                xSub = table.getDoubleTopic("x").subscribe(0)
                ySub = table.getDoubleTopic("y").subscribe(0)
                inst.startClient4("example client")
                inst.setServerTeam(TEAM) # where TEAM=190, 294, etc, or use inst.setServer("hostname") or similar
                inst.startDSClient() # recommended if running on DS computer; this gets the robot IP from the DS

                while True:
                    time.sleep(1)

                    x = xSub.get()
                    y = ySub.get()
                    print(f"X: {x} Y: {y}")


In this example an instance of NetworkTables is created and subscribers are created to reference the values of "x" and "y" from a table called "datatable".

Then this instance is started as a NetworkTables client with the team number (the roboRIO is always the server). Additionally, if the program is running on the Driver Station computer, by using the startDSClient() method, NetworkTables will get the robot IP address from the Driver Station.

Then this sample program simply loops once a second and gets the values for x and y and prints them on the console. In a more realistic program, the client might be processing or generating values for the robot to consume.

Building using Gradle
^^^^^^^^^^^^^^^^^^^^^

Example build.gradle files are provided in the `StandaloneAppSamples Repository <https://github.com/wpilibsuite/StandaloneAppSamples>`__ Update the GradleRIO version to correspond to the desired WPILib version.

.. tabs::

    .. group-tab:: Java

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/StandaloneAppSamples/3b64aadee717c9f0566497a40fd0be7d0eaed96d/Java/build.gradle
          :language: groovy
          :linenos:
          :emphasize-lines: 5

    .. group-tab:: C++

       Uncomment the appropriate platform as highlighted.

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/StandaloneAppSamples/3b64aadee717c9f0566497a40fd0be7d0eaed96d/Cpp/build.gradle
          :language: groovy
          :linenos:
          :emphasize-lines: 3, 20-22

Building Python
^^^^^^^^^^^^^^^

For Python, refer to the `RobotPy pyntcore install documentation <https://robotpy.readthedocs.io/en/stable/install/pynetworktables.html>`__.
