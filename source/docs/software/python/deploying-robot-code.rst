
Deploying Robot Code
====================

.. note:: Before deploying the code to your robot, you must start by :ref:`installing RobotPy on your roboRIO <docs/software/python/installing-robotpy-on-roborio:RobotPy installation on roboRIO>`

To deploy code to your robot, you can just run the following command and it will upload the code and start it immediately.

.. tabs::
   .. group-tab:: Windows

    .. code-block:: sh

        py -3 robot.py deploy

   .. group-tab:: Linux/macOS

    .. code-block:: sh

        python3 robot.py deploy

You can watch your robot code's output (and see any problems) by using the netconsole program (you can either use NI's tool, or `pynetconsole <https://github.com/robotpy/pynetconsole>`__. You can use netconsole and the normal FRC tools to interact with the running robot code.

If you're having problems deploying code to the robot, you can `join the Discord channel <https://discord.gg/Vj3DWnBr>`__ and ask for help!

Immediate feedback via Netconsole
---------------------------------

Note that when you run the deploy command like that, you won't get any feedback from the robot whether your code actually worked or not. If you want to see the feedback from your robot without launching a separate NetConsole window, a really useful option is :guilabel:`--nc`. This will cause the deploy command to show your program's console output, by launching a netconsole listener.

.. tabs::

   .. group-tab:: Windows

    .. code-block:: sh

        py -3 robot.py deploy --nc

   .. group-tab:: Linux/macOS

    .. code-block:: sh

        python3 robot.py deploy --nc

Note: This requires the driver station software to be connected to your robot

Skipping Tests
--------------

Now perhaps your tests are failing, but you really need to upload the code, and don't care about the tests. That's OK, you can still upload code to the robot:

.. tabs::

   .. group-tab:: Windows

    .. code-block:: sh

        py -3 robot.py deploy --skip-tests

   .. group-tab:: Linux/macOS

    .. code-block:: sh

        python3 robot.py deploy --skip-tests

Starting deployed code at boot
------------------------------

If you wish for the deployed code to be started up when the roboRIO boots up, you need to make sure that "Disable RT Startup App" is not checked in the roboRIO's web configuration. See the :ref:`FIRST documentation <docs/software/roborio-info/roborio-web-dashboard:roboRIO Web Dashboard>` for more information.


Next Steps
----------

Let's talk about the :ref:`robot simulator <docs/software/python/robot-simulator:Robot Simulator>` next.
