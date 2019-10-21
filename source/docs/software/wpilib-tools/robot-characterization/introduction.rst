Introduction to Robot Characterization
======================================

The characterization tools consist of a python application that runs on the user's PC, and matching robot code that runs on the user's robot. The PC application will send control signals to the robot over network tables, while the robot sends data back to the application. The application then processes the data and determines characterization parameters for the user's robot mechanism, as well as producing diagnostic plots. Data can be saved (in JSON format) for future use, if desired.

Included Characterization Tools
-------------------------------

The robot characterization toolsuite currently supports characterization for:

- Drivetrains
- Arms
- Elevators

.. note:: Many mechanisms can be characterized by simply adapting the existing code in this library.

Prerequisites
-------------

To use the Robotpy Characterization Toolsuite, you must have Python (3.6 or higher) installed on your computer, as well as the standard WPILib programming toolsuite.

`Python 3.7 <https://www.python.org/downloads/>`__

Installing and Launching the Toolsuite
--------------------------------------

To install the Robotpy Characterization Toolsuite, open a console and enter the following command


.. code-block:: console

   pip install frc-characterization

The toolsuite, and all of its dependencies, should be automatically downloaded and installed. If you are using a windows machine and the command pip is not recognized, ensure that your python scripts folder `has been added to the PATH <https://datatofish.com/add-python-to-windows-path/>`__.

Once the toolsuite has been installed, launch a new drive characterization project to ensure that it works by running the following command from powershell or a terminal window.


.. code-block:: console

   robotpy-characterization drive new

The new project GUI should open momentarily. To launch other characterization projects, simply replace drive with the desired characterization type.

While the new project GUI has buttons for launching both the logging tool and the analyzer tool, these can also be launched directly from the CLI by replacing new with logger or analyzer.

For more information on CLI usage, enter ``robot-characterization -h``.
