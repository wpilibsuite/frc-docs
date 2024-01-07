Deploy Python program to roboRIO
================================

.. note:: Before deploying the code to your robot, you must start by :doc:`installing RobotPy on your computer </docs/zero-to-robot/step-2/python-setup>`

          In particular, it is expected that you have ran ``robotpy sync`` to download all of the roboRIO python dependencies.

.. tab-set::

   .. tab-item:: Windows
      :sync: windows

      .. code-block:: sh

         py -3 -m robotpy deploy

   .. tab-item:: macOS
      :sync: macos

      .. code-block:: sh

         python3 -m robotpy deploy

   .. tab-item:: Linux
      :sync: linux

      .. code-block:: sh

         python3 -m robotpy deploy

When you execute the ``robotpy deploy`` subcommand, it will do the following:

* Run ``pytest`` tests on your code (will exit if they fail)
* Install Python on the roboRIO (if not already present)
* Install python packages on the roboRIO as specified by your ``pyproject.toml`` (if not already present)
* Copy the entire robot project directory to the roboRIO and execute it

.. warning:: Avoid powering off the robot while deploying robot code. Interrupting the deployment process can corrupt the roboRIO filesystem and prevent your code from working until the roboRIO is :doc:`re-imaged </docs/zero-to-robot/step-3/imaging-your-roborio>`.

When successful, you will see a ``SUCCESS: Deploy was successful!`` message.

You can watch your robot code's output (and see any problems) with netconsole by using the Driver Station Log Viewer or `pynetconsole <https://github.com/robotpy/pynetconsole>`__. You can use netconsole and the normal FRC tools to interact with the running robot code.

.. seealso:: :doc:`/docs/software/vscode-overview/viewing-console-output`

**Immediate feedback via Netconsole**

When deploying the code to the roboRIO, you can have immediate feedback by adding the option :guilabel:`--nc`. This will cause the deploy command to show your program's console output, by launching a netconsole listener.

.. tab-set::

   .. tab-item:: Windows
      :sync: windows

      .. code-block:: sh

         py -3 -m robotpy deploy --nc

   .. tab-item:: macOS
      :sync: macos

      .. code-block:: sh

         python3 -m robotpy deploy --nc

   .. tab-item:: Linux
      :sync: linux

      .. code-block:: sh

         python3 -m robotpy deploy --nc

.. note:: Viewing netconsole output requires the driver station software to be connected to your robot

**Skipping Tests**

In the event that the tests are failing but you want to upload the code anyway, you can skip them by adding the option :guilabel:`--skip-tests`.

.. tab-set::

   .. tab-item:: Windows
      :sync: windows

      .. code-block:: sh

         py -3 -m robotpy deploy --skip-tests

   .. tab-item:: macOS
      :sync: macos

      .. code-block:: sh

         python3 -m robotpy deploy --skip-tests

   .. tab-item:: Linux
      :sync: linux

      .. code-block:: sh

         python3 -m robotpy deploy --skip-tests
