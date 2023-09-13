Creating your Test Drivetrain Program (Python)
==============================================

Once everything is installed, we're ready to create a robot program. RobotPy comes with several templates for robot programs.  Use of these templates is highly recommended for new users; however, advanced users are free to write their own robot code from scratch. This article walks through creating a project from one of the provided examples which has some code already written to drive a basic robot.

.. important:: This guide includes code examples that involve vendor hardware for the convenience of the user. In this document, PWM refers to the motor controller included in the KOP. The CTRE tab references the Talon FX motor controller (Falcon 500 motor), but usage is similar for TalonSRX and VictorSPX. The REV tab references the CAN SPARK MAX controlling a brushless motor, but it's similar for brushed motor. Using the :guilabel:`pip install robotpy[all]` during installation includes all vendor Python modules. There is an assumption that the user has already configured the device(s) (update firmware, assign CAN IDs, etc) according to the manufacturer documentation (`CTRE <https://docs.ctr-electronics.com/>`__ `REV <https://docs.revrobotics.com/sparkmax/gs-sm>`__).

Creating a New Project
----------------------

Create a new folder and in this folder create a file named :guilabel:`robot.py`.
Open Visual Studio Code and from the File menu and click on Open Folder. From there, select and open the newly created folder.

If you start from a `template <https://github.com/robotpy/examples>`__, replace the robot.py file with the template one and add all other files.

VS Code might show you this window:

.. image:: /docs/software/vscode-overview/images/creating-robot-program/trusted-workspace.png
   :alt: Trusted Workspace dialog in VS Code.

Click :guilabel:`Yes I trust the authors`.

Once opened we will see the project hierarchy on the left. Double clicking on the file will open that file in the editor.


Basic code structure
--------------------

First, here is what a simple code can look like.

.. tabs::

   .. group-tab:: PWM

         .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/getting-started/robot.py
            :language: python
            :linenos:

   .. group-tab:: CTRE

         .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/robotpy-rev/main/examples/getting-started/robot.py
            :language: python
            :linenos:

   .. group-tab:: REV

         .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/robotpy-ctre/main/examples/getting-started/robot.py
            :language: python
            :linenos:

Now let's see the various parts of the code

Imports
-------

The first lines found in a Python file should be the **import** of the various needed modules.

.. tabs::

   .. group-tab:: PWM

         .. code-block:: python

            import wpilib           # Used to get the joysticks
            import wpilib.drive     # Used for the DifferentialDrive class and the PWM motor

   .. group-tab:: CTRE

         .. code-block:: python

            import wpilib           # Used to get the joysticks
            import wpilib.drive     # Used for the DifferentialDrive class
            import ctre             # CTRE library

   .. group-tab:: REV

         .. code-block:: python

            import wpilib           # Used to get the joysticks
            import wpilib.drive     # Used for the DifferentialDrive class
            import rev              # REV library


The actual imports will vary depending on the needed libraries. Shoud you need to access the NAVX library, you would add the ``import navx`` line.

Defining the variables for our sample robot
-------------------------------------------

Your variables should be defined under the :guilabel:`def robotInit(self):` method.

.. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/getting-started/robot.py
   :language: python
   :linenos:
   :lines: 12-29
   :lineno-start: 12

The sample robot in our examples will have a joystick on USB port 0 for arcade drive and two motors on PWM ports 0 and 1 (Vendor examples use CAN with IDs 1 and 2). Here we create objects of type DifferentialDrive (self.robotDrive), XboxController (self.controller) and Timer (self.timer). This section of the code does three things:

1. Defines the variables as members of our Robot class.
2. Initializes the variables.

.. note:: The ``Timer`` is used for the autonomous mode.

Robot Initialization
--------------------

.. code-block:: python

   if __name__ == "__main__":
      wpilib.run(MyRobot)

The ``wpilib.run(MyRobot)`` method is run when the robot program is starting up, but after the constructor.

Simple Autonomous Example
-------------------------

.. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/getting-started/robot.py
   :language: python
   :lines: 31-43
   :linenos:
   :lineno-start: 31

The ``autonomousInit`` method is run once each time the robot transitions to autonomous from another mode. In this program, we restart the ``Timer`` in this method.

``autonomousPeriodic`` is run once every period while the robot is in autonomous mode. In the ``TimedRobot`` class the period is a fixed time, which defaults to 20ms. In this example, the periodic code checks if the timer is less than 2 seconds and if so, drives forward at half speed using the ``ArcadeDrive`` method of the ``DifferentialDrive`` class. If more than 2 seconds has elapsed, the code stops the robot drive.

Joystick Control for Teleoperation
----------------------------------

.. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/getting-started/robot.py
   :language: python
   :lines: 45-52
   :linenos:
   :lineno-start: 45


Like in Autonomous, the Teleop mode has a ``teleopInit`` and ``teleopPeriodic`` function. In this example we don't have anything to do in ``teleopInit``, it is provided for illustration purposes only. In ``teleopPeriodic``, the code uses the ``arcadeDrive`` method to map the Y-axis of the ``Joystick`` to forward/back motion of the drive motors and the X-axis to turning motion.

Test Mode
---------

.. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/main/getting-started/robot.py
   :language: python
   :lines: 54-58
   :linenos:
   :lineno-start: 54

Test Mode is used for testing robot functionality. Similar to ``teleopInit``, the ``testInit`` and ``testPeriodic`` methods are provided here for illustrative purposes only.

Deploying the Project to a Robot
--------------------------------

Please see the instructions :ref:`here <docs/software/python/deploying-robot-code:Deploying Robot Code>` for deploying the program onto a robot.
