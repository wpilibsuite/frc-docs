.. include:: <isonum.txt>

Creating a Client-side Program
==============================

If all you need to do is have your robot program communicate with a :term:`COTS` coprocessor or a dashboard running on the Driver Station laptop, then the previous examples of writing robot programs are sufficient. But if you would like to write some custom client code that would run on the drivers station or on a coprocessor then you need to know how to build :term:`NetworkTables` programs for those (non-roboRIO) platforms.

A basic client program looks like the following example.

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            package networktablesdesktopclient;

            import edu.wpi.first.networktables.DoubleSubscriber;
            import edu.wpi.first.networktables.NetworkTable;
            import edu.wpi.first.networktables.NetworkTableInstance;

            public class NetworkTablesDesktopClient {
              public static void main(String[] args) {
                new NetworkTablesDesktopClient().run();
              }

              public void run() {
                NetworkTableInstance inst = NetworkTableInstance.getDefault();
                NetworkTable table = inst.getTable("datatable");
                DoubleSubscriber xSub = table.getDoubleTopic("x").subscribe(0.0);
                DoubleSubscriber ySub = table.getDoubleTopic("y").subscribe(0.0);
                inst.startClient4("example client");
                inst.setServerTeam(TEAM);  // where TEAM=190, 294, etc, or use inst.setServer("hostname") or similar
                inst.startDSClient();  // recommended if running on DS computer; this gets the robot IP from the DS
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
              auto xSub = table->GetDoubleTopic("x").subscribe(0.0);
              auto ySub = table->GetDoubleTopic("y").subscribe(0.0);
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
            #include <networktables/ntcore.h>

            int main() {
              NT_Instance inst = nt::GetDefaultInstance();
              NT_Subscriber xSub =
                  nt::Subscribe(nt::GetTopic(inst, "/datatable/x"), NT_DOUBLE, "double");
              NT_Subscriber ySub =
                  nt::Subscribe(nt::GetTopic(inst, "/datatable/y"), NT_DOUBLE, "double");
              nt::StartClient4(inst, "example client");
              nt::SetServerTeam(inst, TEAM);  // where TEAM=190, 294, etc, or use inst.setServer("hostname") or similar
              nt::StartDSClient(inst);  // recommended if running on DS computer; this gets the robot IP from the DS
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


In this example an instance of NetworkTables is created and subscribers are created to reference the values of "x" and "y" from a table called "datatable".

Then this instance is started as a NetworkTables client with the team number (the roboRIO is always the server). Additionally, if the program is running on the Driver Station computer, by using the startDSClient() method, NetworkTables will get the robot IP address from the Driver Station.

Then this sample program simply loops once a second and gets the values for x and y and prints them on the console. In a more realistic program, the client might be processing or generating values for the robot to consume.

Building the program
--------------------
When building and running the program you will need some additional libraries to include with your client-side program. These are:

https://frcmaven.wpi.edu/artifactory/development/edu/wpi/first/ntcore/ntcore-java/ (ntcore Java files)

https://frcmaven.wpi.edu/artifactory/development/edu/wpi/first/ntcore/ntcore-jni/ (ntcore native libs for all desktop platforms)

https://frcmaven.wpi.edu/artifactory/development/edu/wpi/first/wpiutil/wpiutil-java/ (wpiutil Java files)

.. note:: The desktop platform jar is for Windows, macOS, and Linux.

Building using Gradle
^^^^^^^^^^^^^^^^^^^^^

The dependencies above can be added to the ``dependencies`` block in a ``build.gradle`` file. The ``ntcore-java`` and ``wpiutil-java`` libraries are required at compile-time and the JNI dependencies are required at runtime. The JNI dependencies for all supported platforms should be added to the ``build.gradle`` if cross-platform support for the application is desired.

First, the FRC\ |reg| Maven repository should be added to the ``repositories`` block. Note that this is not required if you are using the GradleRIO plugin with your application.

.. code-block:: groovy

   repositories {
       maven { url "https://frcmaven.wpi.edu/artifactory/development/" }
   }

Then, the dependencies can be added to the ``dependencies`` block. Here, ``VERSION`` should be replaced with the latest version number of the following dependencies. This usually corresponds to the version number of the latest WPILib release.

.. code-block:: groovy

   dependencies {
       // Add ntcore-java
       implementation "edu.wpi.first.ntcore:ntcore-java:VERSION"

       // Add wpiutil-java
       implementation "edu.wpi.first.wpiutil:wpiutil-java:VERSION"

       // Add ntcore-jni for runtime. We are adding all supported platforms
       // so that our application will work on all supported platforms.
       implementation "edu.wpi.first.ntcore:ntcore-jni:VERSION:windowsx86"
       implementation "edu.wpi.first.ntcore:ntcore-jni:VERSION:windowsx86-64"
       implementation "edu.wpi.first.ntcore:ntcore-jni:VERSION:linuxx86-64"
       implementation "edu.wpi.first.ntcore:ntcore-jni:VERSION:linuxraspbian"
       implementation "edu.wpi.first.ntcore:ntcore-jni:VERSION:osxx86-64"
   }
