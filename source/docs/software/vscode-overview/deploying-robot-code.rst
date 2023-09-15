Building and Deploying Robot Code
=================================

.. tabs::

   .. group-tab:: Java/C++

      Robot projects must be compiled ("built") and deployed in order to run on the roboRIO.  Since the code is not compiled natively on the robot controller, this is known as "cross-compilation."

      To build and deploy a robot project, do one of:

      1. Open the Command Palette and enter/select "Build Robot Code"
      2. Open the shortcut menu indicated by the ellipses in the top right corner of the VS Code window and select "Build Robot Code"
      3. Right-click on the build.gradle file in the project hierarchy and select "Build Robot Code"

      .. image:: images/deploying-robot-code/building-code-options.png

      Deploy robot code by selecting "Deploy Robot Code" from any of the three locations from the previous instructions. That will build (if necessary) and deploy the robot program to the roboRIO.

      .. warning:: Avoid powering off the robot while deploying robot code. Interrupting the deployment process can corrupt the roboRIO filesystem and prevent your code from working until the roboRIO is :doc:`re-imaged </docs/zero-to-robot/step-3/imaging-your-roborio>`.

      If successful, we will see a "Build Successful" message (1) and the RioLog will open with the console output from the robot program as it runs (2).

      .. image:: images/deploying-robot-code/build-successful.png

   .. group-tab:: Python

      .. note:: Before deploying the code to your robot, you must start by :ref:`installing RobotPy on your roboRIO <docs/software/roborio-info/roborio-robotpy:RobotPy installation on roboRIO>`

      To deploy code to your robot, you can simply run the following command and it will upload the code and start it immediately.

      .. tabs::

         .. group-tab:: Windows

            .. code-block:: sh

               py -3 robot.py deploy

         .. group-tab:: Linux/macOS

            .. code-block:: sh

               python3 robot.py deploy

      Through VS Code, a terminal is accessible by opening your :guilabel:`robot.py` file and then clicking Terminal -> New Terminal from the top menu.

      This command will first run any unit tests on your robot code, and if they pass then it will upload the robot code to the roboRIO. Running the tests is really important, it allows you to catch errors in your code before you run it on the robot.

      You can watch your robot code's output (and see any problems) with netconsole by using the Driver Station Log Viewer or `pynetconsole <https://github.com/robotpy/pynetconsole>`__. You can use netconsole and the normal FRC tools to interact with the running robot code.

      **Immediate feedback via Netconsole**

      When deploying the code to the roboRIO, you can have immediate feedback by adding the option :guilabel:`--nc`. This will cause the deploy command to show your program's console output, by launching a netconsole listener.

      .. tabs::

         .. group-tab:: Windows

            .. code-block:: sh

               py -3 robot.py deploy --nc

         .. group-tab:: Linux/macOS

            .. code-block:: sh

               python3 robot.py deploy --nc

         .. Note:: This requires the driver station software to be connected to your robot

      **Skipping Tests**

      In the event that the tests are failing but you want to upload the code anyway, you can skip them by adding the option :guilabel:`--skip-tests`.

      .. tabs::

         .. group-tab:: Windows

            .. code-block:: sh

               py -3 robot.py deploy --skip-tests

         .. group-tab:: Linux/macOS

            .. code-block:: sh

               python3 robot.py deploy --skip-tests
