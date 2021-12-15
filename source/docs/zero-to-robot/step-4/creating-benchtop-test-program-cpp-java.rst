Creating your Benchtop Test Program (C++/Java)
==============================================

Once everything is installed, we're ready to create a robot program.  WPILib comes with several templates for robot programs.  Use of these templates is highly recommended for new users; however, advanced users are free to write their own robot code from scratch. This article walks through creating a project from one of the provided examples which has some code already written to drive a basic robot.

Creating a New WPILib Project
-----------------------------

Bring up the Visual Studio Code command palette with :kbd:`Ctrl+Shift+P`:

.. image:: /docs/software/vscode-overview/images/creating-robot-program/command-palette.png
    :alt: Opening the Command Palette.

Then, type "WPILib" into the prompt.  Since all WPILib commands start with "WPILib," this will bring up the list of WPILib-specific VS Code commands:

.. image:: /docs/software/vscode-overview/images/creating-robot-program/wpilib-commands.png
    :alt: Typing WPILib to filter for just the WPILib commands.

Now, select the "Create a new project" command:

.. image:: /docs/software/vscode-overview/images/creating-robot-program/create-new-project.png
    :alt: Choose "WPILib: Create a new project".

This will bring up the "New Project Creator Window:"

.. image:: /docs/software/vscode-overview/images/creating-robot-program/new-project-creator.png
    :alt: The different parts of the new project creation window.

The elements of the New Project Creator Window are explained below:

1. **Project Type**: The kind of project we wish to create.  For this example, select **Example**
2. **Language**: This is the language (C++ or Java) that will be used for this project.
3. **Project Base**: This box is used to select the base class or example to generate the project from. For this example, select **Getting Started**
4. **Base Folder**: This determines the folder in which the robot project will be located.
5. **Project Name**: The name of the robot project.  This also specifies the name that the
6. **Create a New Folder**: If this is checked, a new folder will be created to hold the project within the previously-specified folder.  If it is *not* checked, the project will be located directly in the previously-specified folder.  An error will be thrown if the folder is not empty and this is not checked. project folder will be given if the Create New Folder box is checked.
7. **Team Number**: The team number for the project, which will be used for package names within the project and to locate the robot when deploying code.
8. **Enable Desktop Support**: Enables unit test and simulation. While WPILib supports this, third party software libraries may not. If libraries do not support desktop, then your code may not compile or may crash. It should be left unchecked unless unit testing or simulation is needed and all libraries support it. For this example, do not check this box.

Once all the above have been configured, click "Generate Project" and the robot project will be created.

.. note:: Any errors in project generation will appear in the bottom right-hand corner of the screen.

Opening The New Project
-----------------------

.. image:: /docs/software/vscode-overview/images/importing-previous-project/opening-project.png
   :alt: Open Project Dialog in VS Code

After successfully creating your project, VS Code will give the option of opening the project as shown above. We can choose to do that now or later by typing :kbd:`Ctrl+K` then :kbd:`Ctrl+O` (or just :kbd:`Command+O` on macOS) and select the folder where we saved our project.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/trusted-workspace.png
   :alt: Trusted Workspace dialog in VS Code.

Click :guilabel:`Yes I trust the authors`.

Once opened we will see the project hierarchy on the left. Double clicking on the file will open that file in the editor.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/opened-robot-project.png
    :alt: The robot.java code shown after opening a new project.

C++ Configurations (C++ Only)
-----------------------------

For C++ projects, there is one more step to set up IntelliSense.  Whenever we open a project, we should get a pop-up in the bottom right corner asking to refresh C++ configurations.  Click "Yes" to set up IntelliSense.

.. image:: /docs/software/vscode-overview/images/importing-previous-project/cpp-configurations.png
    :alt: You must choose "Yes" to refresh the C++ configurations.

Imports/Includes
----------------
.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
         :language: java
         :lines: 7-11
         :linenos:
         :lineno-start: 7

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
         :language: c++
         :lines: 5-10
         :linenos:
         :lineno-start: 5

Our code needs to reference the components of WPILib that are used. In C++ this is accomplished using ``#include`` statements; in Java it is done with ``import`` statements. The program references classes for ``Joystick`` (for driving), ``PWMSparkMax`` (for controlling motors), ``TimedRobot`` (the base class used for the example), ``Timer`` (used for autonomous), ``DifferentialDrive`` (for connecting the joystick control to the motors), and ``LiveWindow`` (C++ only).

Defining the variables for our sample robot
-------------------------------------------

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
         :language: java
         :lines: 19-23
         :linenos:
         :lineno-start: 19

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
         :language: c++
         :lines: 12-17
         :linenos:
         :lineno-start: 12

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
         :language: c++
         :lines: 46-54
         :linenos:
         :lineno-start: 46

The sample robot in our examples will have a joystick on USB port 0 for arcade drive and two motors on PWM ports 0 and 1. Here we create objects of type DifferentialDrive (m_robotDrive), Joystick (m_stick) and time (m_timer). This section of the code does three things:

1. Defines the variables as members of our Robot class.
2. Initializes the variables.

.. note:: The variable initializations for C++ are in the ``private`` section at the bottom of the program. This means they are private to the class (``Robot``). The C++ code also sets the Motor Safety expiration to 0.1 seconds (the drive will shut off if we don't give it a command every .1 seconds) and starts the ``Timer`` used for autonomous.

Robot Initialization
--------------------

.. tabs::

    .. code-tab:: java

          @Override
          public void robotInit() {}

    .. code-tab:: c++

        void RobotInit() {}


The ``RobotInit`` method is run when the robot program is starting up, but after the constructor. The ``RobotInit`` for our sample program doesn't do anything. If we wanted to run something here we could provide the code above to override the default).

Simple Autonomous Example
-------------------------

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
         :language: java
         :lines: 32-48
         :linenos:
         :lineno-start: 32

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
         :language: c++
         :lines: 18-33
         :linenos:
         :lineno-start: 18

The ``AutonomousInit`` method is run once each time the robot transitions to autonomous from another mode. In this program, we reset the ``Timer`` and then start it in this method.

``AutonomousPeriodic`` is run once every period while the robot is in autonomous mode. In the ``TimedRobot`` class the period is a fixed time, which defaults to 20ms. In this example, the periodic code checks if the timer is less than 2 seconds and if so, drives forward at half speed using the ``ArcadeDrive`` method of the ``DifferentialDrive`` class. If more than 2 seconds has elapsed, the code stops the robot drive.

Joystick Control for teleoperation
----------------------------------

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
         :language: java
         :lines: 50-58
         :linenos:
         :lineno-start: 50

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
         :language: c++
         :lines: 35-40
         :linenos:
         :lineno-start: 35

Like in Autonomous, the Teleop mode has a ``TeleopInit`` and ``TeleopPeriodic`` function. In this example we don't have anything to do in ``TeleopInit``, it is provided for illustration purposes only. In ``TeleopPeriodic``, the code uses the ``ArcadeDrive`` method to map the Y-axis of the ``Joystick`` to forward/back motion of the drive motors and the X-axis to turning motion.

Test Mode
---------

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
         :language: java
         :lines: 60-67
         :linenos:
         :lineno-start: 60

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2022.1.1-beta-3/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
         :language: c++
         :lines: 42-44
         :linenos:
         :lineno-start: 42

Test Mode is used for testing robot functionality. Similar to ``TeleopInit``, the ``TestInit`` and ``TestPeriodic`` methods are provided here for illustrative purposes only.

Deploying the Project to a Robot
--------------------------------

Please see the instructions :ref:`here <docs/software/vscode-overview/deploying-robot-code:Building and Deploying Robot Code>` for deploying the program onto a robot.
