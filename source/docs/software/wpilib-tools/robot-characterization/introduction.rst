Introduction to Robot Characterization
======================================

The characterization tools consist of a python application that runs on the user's PC, and matching robot code that runs on the user's robot. The PC application will send control signals to the robot over network tables, while the robot sends data back to the application. The application then processes the data and determines characterization parameters for the user's robot mechanism, as well as producing diagnostic plots. Data can be saved (in JSON format) for future use, if desired.

What is Characterization?
-------------------------

The process of “characterization” measures how your drivetrain responds to voltage applied (or really, how much voltage it needs to start moving, how much voltage it needs to have applied to maintain a given speed, and how much voltage on top of that is needed to induce a given acceleration). It does this by measuring three coefficients.

``kS`` is the voltage needed to overcome your drivetrain’s static friction, or in other words to just barely get it moving; it turns out that this static friction (because it’s, well, static) constantly has the same effect on the motor power needed. That is, no matter what speed you’re going or what voltage you’ve applied to your motors, about 1 volt of that voltage (give or take depending on your drivetrain torque and the specific assembly) will be going towards overcoming the static friction in your gears, bearings, etc; this value is your kS.

``kV`` describes how much voltage your drivetrain needs to hold (or “cruise”) at a given constant velocity while overcoming the electromagnetic resistance in the motor and any additional friction that increases with speed. The relationship between speed and voltage required is almost entirely linear (with FRC components, anyway) because of how motors work, so if you take a bunch of measurements of velocity with different voltages (and little to no acceleration), you can perform a linear regression and find the ratio between velocity and voltage applied.

``kA`` describes the voltage needed to induce a given acceleration while overcoming the robot’s inertia. Same deal as ``kV``, it’s pretty linear, and you can calculate it by accelerating to a given speed, measuring your robot’s acceleration and voltage, and subtracting the component of voltage related to static friction and velocity (which you can do because you know ``kV`` and ``kA``).

With these three coefficients, and given a desired velocity and acceleration for (one side of) your drivetrain, you can use the below equation to calculate the voltage you should apply. (It also works, albeit not as well, with just velocity.) This is very useful not just for, say, following a motion profile, but also for making your drivetrain more controllable in open-loop driving because your joystick inputs will more closely match the actual robot velocity.

.. math:: V = kS \cdot sgn(\dot{d}) + kV \cdot \dot{d} + kA \cdot \ddot{d}

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

The toolsuite, and all of its dependencies, should be automatically downloaded and installed. If you are using a Windows machine and the command pip is not recognized, ensure that your python scripts folder `has been added to the PATH <https://datatofish.com/add-python-to-windows-path/>`__.

Once the toolsuite has been installed, launch a new drive characterization project to ensure that it works by running the following command from powershell or a terminal window.


.. code-block:: console

   robotpy-characterization drive new

The new project GUI should open momentarily. To launch other characterization projects, simply replace ``drive`` with the desired characterization type.

While the new project GUI has buttons for launching both the logging tool and the analyzer tool, these can also be launched directly from the CLI by replacing new with logger or analyzer.

For more information on CLI usage, enter ``robot-characterization -h``.
