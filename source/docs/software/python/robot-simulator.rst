Robot Simulator
===============

An important (but often neglected) part of developing your robot code is to test it! Because we feel strongly about testing and simulation, the RobotPy project provides tools to make those types of things easier through the pyfrc project.

Running the simulator
---------------------

To run the GUI simulator, run your robot.py with the following arguments:

.. tabs::

  .. group-tab:: Windows

      .. code-block:: sh

        py -3 robot.py sim

  .. group-tab:: Linux/macOS

      .. code-block:: sh

        python3 robot.py sim

User interface
--------------

See the :ref:`WPILib Simulation User Interface documentation <docs/software/wpilib-tools/robot-simulation/simulation-gui:Simulation Specific User Interface Elements>` for more details.

2D Field Widget and Physics
---------------------------

The WPILib Simulation GUI has a 2D field available. This allows you to drive your robot around on a virtual field, in particular. It's very useful for testing the logic of autonomous mode movements.

.. note::
    To enable the field view, go to the 'Window' menu, and select 2D field view.

For the robot to move across the field, you must implement a physics module (it's a lot easier than it sounds!). Helper functions are provided to calculate robot position for common drivetrain types.

We have a variety of examples and documentation available:

* `RobotPy Examples Repository <https://github.com/robotpy/examples>`_
* `PyFRC API docs <https://robotpy.readthedocs.io/projects/pyfrc/en/stable/physics.html#physics-model>`__
* `wpilib simulation <https://robotpy.readthedocs.io/projects/pyfrc/en/stable/physics.html#physics-model>`__

Communicating via NetworkTables
-------------------------------

The simulator launches a NetworkTables server (just as the robot does), so it can be communicated with via standard NetworkTables tools (such as OutlineViewer, Shuffleboard, or SmartDashboard).

For this to work, you need to tell the client to connect to the IP address that your simulator is listening on (this will be :guilabel:`localhost` or :guilabel:`127.0.0.1``).

pynetworktables2js
~~~~~~~~~~~~~~~~~~

pynetworktables2js will automatically connect to ``localhost`` if no arguments
are given.

OutlineViewer
~~~~~~~~~~~~~

You can type an address in when OutlineViewer launches, then tell it to start in
client mode.

Shuffleboard
~~~~~~~~~~~~

Shuffleboard can be configured to connect to localhost in the preferences.

SmartDashboard
~~~~~~~~~~~~~~

Using SmartDashboard, you need to launch the jar using the following command:

.. code-block:: sh

  $ java -jar SmartDashboard.jar ip 127.0.0.1
