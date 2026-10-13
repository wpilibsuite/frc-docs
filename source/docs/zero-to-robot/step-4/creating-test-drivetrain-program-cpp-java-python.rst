# Create Your Test Drivetrain Program

**By the end of this page:** your drivetrain project will be configured for
its motor controllers and deployed to Systemcore. You will test the motors
on the next page, with the wheels off the floor.

Use the Java, C++, or Python walkthrough below, or start with a Blocks sample.

Before beginning, confirm that WPILib and any language-specific tools from
:doc:`Step 2 <../step-2/index>` are installed, Step 3 is complete, and you know
the motor-controller type, port numbers or CAN IDs, and team number for your
robot.

WPILib includes tested example projects with working robot structure already
in place. This walkthrough starts with the **Getting Started** example, then
explains the code you must check before deploying it to your robot.

* :ref:`create_java_cpp_project`
* :ref:`create_python_project`
* :ref:`create_blocks_project`

.. important::

   Choose the hardware tab that matches the motor controllers on your robot.
   The **PWM** tab covers the motor controller included in the FRC Kit of Parts.
   The **CTRE** tabs cover Talon controllers, and the **REV** tab covers SPARK
   controllers. Before deploying a CAN example, install the required
   :doc:`vendor library </docs/software/vscode-overview/3rd-party-libraries>`,
   update the devices, and assign unique CAN IDs using the manufacturer's
   instructions.

.. _create_blocks_project:

## Starting a Drivetrain Project in Blocks

In the Blocks editor, select :guilabel:`Samples...`, choose a drivetrain
sample, then select :guilabel:`Create New Project From Sample` to make an
editable copy. Choose the sample that matches your hardware:

- **DifferentialDrive301:** a two-motor differential drivetrain with A301
  motor controllers.
- **MecanumRobot301:** a four-motor mecanum drivetrain with A301 motor
  controllers.
- **MecanumRobotExpansionHub:** a four-motor mecanum drivetrain with motors
  connected to a REV Expansion Hub.

See :ref:`blocks-drivetrain-samples` for screenshots and links to each sample's
source. Before running a sample, check the motor connections, controller
assignment, and inversion against your robot. A sample for a different motor
controller is not a drop-in replacement for your hardware.

.. note::

   The detailed Systemcore Blocks deployment walkthrough is still being
   completed. Once your program is deployed, FRC teams can follow
   :doc:`running-test-program` for the pre-enable checks and first drive.

.. note::

   More drivetrain examples for Blocks are coming soon.

The remaining sections describe the Java, C++, and Python workflow.

.. _create_java_cpp_project:

## Creating a New WPILib Project (Java/C++)

Open **WPILib VS Code**. Open the WPILib command palette and select
:guilabel:`Create a new project`:

.. image:: /docs/software/vscode-overview/images/creating-robot-program/create-new-project.png
   :alt: Choose "WPILib: Create a new project".

The WPILib New Project Creator opens.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/new-project-creator.png
   :alt: The project type selector of the WPILib New Project Creator

Select :guilabel:`Example`, then :guilabel:`Next`. This starts from a
:doc:`working WPILib example </docs/software/examples-tutorials/wpilib-examples>`
instead of an empty template.

The next page asks for a language and project base.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/new-project-creator-language.png
   :alt: The language and base page of the WPILib New Project Creator

1. **Language:** select Java or C++ to match your choice in Step 2.
2. **Project Base:** select **Getting Started** for this walkthrough.

After making the selections, click :guilabel:`Next`.

On the Project and Configuration page, choose where to save the project and
enter your team number.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/new-project-creator-location.png
   :alt: The project and configuration page of the WPILib New Project Creator

1. **Base Folder**: This determines the folder in which the robot project will be located.
2. **Project Name**: The name of the robot project.  This also specifies the name that the project folder will be given if the Create New Folder box is checked.
3. **Create a New Folder**: If this is checked, a new folder will be created to hold the project within the previously-specified folder.  If it is *not* checked, the project will be located directly in the previously-specified folder.  An error will be thrown if the folder is not empty and this is not checked.
4. **Team Number**: The team number for the project, which will be used for package names within the project and to locate the robot when deploying code.
5. **Enable Desktop Support**: Enables unit test and simulation support (see :doc:`/docs/software/wpilib-tools/robot-simulation/introduction`). While WPILib supports this, third party software libraries may not. If libraries do not support desktop, then your code may not compile or may crash. It should be left unchecked unless unit testing or simulation is needed and all libraries support it. For this example, do not check this box.

.. warning:: Creating projects on OneDrive is not supported as OneDrive's caching interferes with the build system. Some Windows installations put the Documents and Desktop folders on OneDrive by default.

Once all the above have been configured, click :guilabel:`Next`.

This will bring up the Review and Create window.
The Review and Create page shows the settings you selected.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/new-project-creator-configured.png
   :alt: The review and create page of the WPILib New Project Creator

Check the language, example, folder, and team number. Use :guilabel:`Back`
to correct a setting, then select :guilabel:`Create Project`.

**Expected result:** VS Code offers to open the new project. If creation fails,
read the error notification before trying again.

.. note:: Any errors in project generation will appear in the bottom right-hand corner of the screen.

## Opening the New Project

.. image:: /docs/software/vscode-overview/images/importing-previous-project/opening-project.png
   :alt: Open Project Dialog in VS Code

Accept the prompt to open your new project. To open it later, press
:kbd:`Ctrl+K` then :kbd:`Ctrl+O` (or :kbd:`Command+O` on macOS) and select
the project folder.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/trusted-workspace.png
   :alt: Trusted Workspace dialog in VS Code.

Click :guilabel:`Yes I trust the authors`.

The file explorer shows the project folders. Open the Robot source file to
inspect the example you will configure in the following sections.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/opened-robot-project.png
    :alt: The robot.java code shown after opening a new project.

## C++ Configurations (C++ Only)

For a C++ project, accept the prompt to refresh C++ configurations. Select
**Yes** to set up IntelliSense for this project.

.. image:: /docs/software/vscode-overview/images/importing-previous-project/cpp-configurations.png
    :alt: You must choose "Yes" to refresh the C++ configurations.

.. _create_python_project:

## Creating a New WPILib Project (Python)

Running the ``robotpy init`` command will initialize a new robot project:

.. tab-set::

   .. tab-item:: Windows
      :sync: windows

      ```sh
      py -3 -m robotpy init
      ```

   .. tab-item:: macOS
      :sync: macos

      ```sh
      python3 -m robotpy init
      ```

   .. tab-item:: Linux
      :sync: linux

      ```sh
      python3 -m robotpy init
      ```

This will create a ``robot.py`` and ``pyproject.toml`` file, but will not overwrite an existing file.

* The ``pyproject.toml`` file contains the requirements for your project, which are downloaded and installed via the ``robotpy sync`` command.
* The ``robot.py`` file is where you will put your Robot class.

.. seealso:: :ref:`docs/zero-to-robot/step-2/python-setup:Download RobotPy for Systemcore`


## Basic Drivetrain Example

Read the complete PWM example below to see how the Robot class connects
controller input to motor output. Then use the hardware tabs in the following
sections to configure the example for your motor controllers.

.. note:: the Python example below is from `<https://github.com/robotpy/mostrobotpy/tree/main/examples/robot/GettingStarted>`__

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/gettingstarted/Robot.java
      :language: java
      :linenos:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
      :language: c++
      :linenos:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/GettingStarted/robot.py
      :language: python
      :linenos:

Now let's look at various parts of the code.

## Imports/Includes

.. tab-set::

   .. tab-item:: PWM
      :sync: pwm

      .. tab-set::

         .. tab-item:: Java
            :sync: java

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/gettingstarted/Robot.java
               :language: java
               :lines: 7-11
               :linenos:

         .. tab-item:: C++
            :sync: c++

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 5-9
               :lineno-match:

         .. tab-item:: Python

            .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/GettingStarted/robot.py
               :language: python
               :lines: 8
               :lineno-match:

   .. tab-item:: CTRE-Phoenix6
      :sync: ctre6


      .. tab-set-code::


         ```java
         import org.wpilib.framework.TimedRobot;
         import org.wpilib.system.Timer;
         import org.wpilib.driverstation.Gamepad;
         import org.wpilib.drive.DifferentialDrive;
         import com.ctre.phoenix6.hardware.TalonFX;
         ```

         ```c++
         #include "wpi/framework/TimedRobot.hpp"
         #include "wpi/system/Timer.hpp"
         #include "wpi/driverstation/Gamepad.hpp"
         #include "wpi/drive/DifferentialDrive.hpp"
         #include "ctre/phoenix6/TalonFX.hpp"
         ```

         ```python
         import wpilib                            # Used to get the joysticks
         from wpilib import DifferentialDrive     # Used for the DifferentialDrive class
         import phoenix6                          # CTRE library
         ```

   .. tab-item:: REV

         .. tab-set-code::

            ```java
            import com.revrobotics.CANSparkMax;
            import com.revrobotics.CANSparkLowLevel.MotorType;
            import org.wpilib.framework.TimedRobot;
            import org.wpilib.system.Timer;
            import org.wpilib.driverstation.Gamepad;
            import org.wpilib.drive.DifferentialDrive;
            ```

            ```c++
            #include "wpi/framework/TimedRobot.hpp"
            #include "wpi/system/Timer.hpp"
            #include "wpi/driverstation/Gamepad.hpp"
            #include "wpi/drive/DifferentialDrive.hpp"
            #include "wpi/hardware/motor/PWMSparkMax.hpp"
            #include "rev/CANSparkMax.h"
            ```

            ```python
            import wpilib           # Used to get the joysticks and DifferentialDrive class
            import rev              # REV library
            ```

   .. tab-item:: CTRE-Phoenix5
      :sync: ctre5


      .. tab-set-code::


         ```java
         import org.wpilib.framework.TimedRobot;
         import org.wpilib.system.Timer;
         import org.wpilib.driverstation.Gamepad;
         import org.wpilib.drive.DifferentialDrive;
         import com.ctre.phoenix.motorcontrol.can.WPI_TalonSRX;
         ```

         ```c++
         #include "wpi/framework/TimedRobot.hpp"
         #include "wpi/system/Timer.hpp"
         #include "wpi/driverstation/Gamepad.hpp"
         #include "wpi/drive/DifferentialDrive.hpp"
         #include "ctre/phoenix/motorcontrol/can/WPI_TalonSRX.h"
         ```

         ```python
         import wpilib                            # Used to get the joysticks
         from wpilib import DifferentialDrive     # Used for the DifferentialDrive class
         import phoenix5                          # Phoenix5 library
         ```

Our code needs to reference the components of WPILib that are used. In C++ this is accomplished using ``#include`` statements; in Java and Python it is done with ``import`` statements. The program references classes for ``Gamepad`` (for driving), ``PWMSparkMax`` / ``TalonFX`` / ``CANSparkMax`` / ``WPI_TalonSRX`` (for controlling motors), ``TimedRobot`` (the base class used for the example), ``Timer`` (used for autonomous), and ``DifferentialDrive`` (for connecting the Gamepad to the motors).

.. note:: The ``Gamepad`` class is used with the 2027 FIRST Driver Station. If
   you are using the NI Driver Station, use the ``NiDsXboxController`` class
   instead. The pinned Python PWM example above still shows
   ``NiDsXboxController``; replace it with ``wpilib.Gamepad(0)`` when following
   this guide with the 2027 Driver Station.

## Defining the variables for our sample robot

.. tab-set::

   .. tab-item:: PWM
      :sync: pwm

      .. tab-set::

         .. tab-item:: Java
            :sync: java

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/gettingstarted/Robot.java
               :language: java
               :lines: 18-24
               :lineno-match:

         .. tab-item:: C++
            :sync: c++

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 46-55
               :lineno-match:

         .. tab-item:: Python
            :sync: python

            .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/GettingStarted/robot.py
               :language: python
               :lineno-match:
               :lines: 12-29

   .. tab-item:: CTRE-Phoenix6
      :sync: ctre6

      .. tab-set::

         .. tab-item:: Java
            :sync: java

            ```java
            public class Robot extends TimedRobot {
               private final TalonFX leftDrive = new TalonFX(1);
               private final TalonFX rightDrive = new TalonFX(2);
               private final DifferentialDrive robotDrive =
                 new DifferentialDrive(leftDrive::set, rightDrive::set);
               private final Gamepad controller = new Gamepad(0);
               private final Timer timer = new Timer();
            ```

         .. tab-item:: C++
            :sync: c++

            ```c++
            private:
             // Robot drive system
             ctre::phoenix6::hardware::TalonFX left{1};
             ctre::phoenix6::hardware::TalonFX right{2};
             wpi::DifferentialDrive robotDrive{
               [&](double output) { left.Set(output); },
               [&](double output) { right.Set(output); }};
             wpi::Gamepad controller{0};
             wpi::Timer timer;
            ```

         .. tab-item:: Python
            :sync: python

            ```python
            class MyRobot(wpilib.TimedRobot):
              def __init__(self):
                 """
                 This function is called upon program startup and
                 should be used for any initialization code.
                 """
                 super().__init__()
                 self.left_drive = phoenix6.hardware.TalonFX(1)
                 self.right_drive = phoenix6.hardware.TalonFX(2)
                 self.robot_drive = DifferentialDrive(
                     self.left_drive, self.right_drive
                 )
                 self.controller = wpilib.Gamepad(0)
                 self.timer = wpilib.Timer()
                 # We need to invert one side of the drivetrain so that positive voltages
                 # result in both sides moving forward. Depending on how your robot's
                 # gearbox is constructed, you might have to invert the left side instead.
                 self.right_drive.set_inverted(True)
            ```

   .. tab-item:: REV
      :sync: rev

      .. tab-set::

         .. tab-item:: Java
            :sync: java

            ```java
            public class Robot extends TimedRobot {
              private final CANSparkMax leftDrive = new CANSparkMax(1, MotorType.kBrushless);
              private final CANSparkMax rightDrive = new CANSparkMax(2, MotorType.kBrushless);
              private final DifferentialDrive robotDrive =
                new DifferentialDrive(leftDrive::set, rightDrive::set);
              private final Gamepad controller = new Gamepad(0);
              private final Timer timer = new Timer();
            ```

         .. tab-item:: C++
            :sync: c++

            ```c++
            private:
             // Robot drive system
             rev::CANSparkMax left{1, rev::CANSparkMax::MotorType::kBrushless};
             rev::CANSparkMax right{2, rev::CANSparkMax::MotorType::kBrushless};
             wpi::DifferentialDrive robotDrive{
               [&](double output) { left.Set(output); },
               [&](double output) { right.Set(output); }};
             wpi::Gamepad controller{0};
             wpi::Timer timer;
            ```

         .. tab-item:: Python
            :sync: python

            .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/robotpy-rev/29651ec/examples/getting-started/robot.py
               :language: python
               :linenos:
               :lines: 12-28
               :lineno-start: 12

   .. tab-item:: CTRE-Phoenix5
      :sync: ctre5

      .. tab-set::

         .. tab-item:: Java
            :sync: java

            ```java
            public class Robot extends TimedRobot {
               private final WPI_TalonSRX leftDrive = new WPI_TalonSRX(1);
               private final WPI_TalonSRX rightDrive = new WPI_TalonSRX(2);
               private final DifferentialDrive robotDrive = new DifferentialDrive(leftDrive1::set, rightDrive2::set);
               private final Gamepad controller = new Gamepad(0);
               private final Timer timer = new Timer();
            ```

         .. tab-item:: C++
            :sync: c++

            ```c++
            private:
             // Robot drive system
             ctre::phoenix::motorcontrol::can::WPI_TalonSRX left{1};
             ctre::phoenix::motorcontrol::can::WPI_TalonSRX right{2};
             wpi::DifferentialDrive robotDrive{
               [&](double output) { left.Set(output); },
               [&](double output) { right.Set(output); }};
             wpi::Gamepad controller{0};
             wpi::Timer timer;
            ```

         .. tab-item:: Python
            :sync: python

            .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/robotpy-ctre/126e0a4/examples/getting-started/robot.py
               :language: python
               :linenos:
               :lines: 13-30
               :lineno-start: 13

The sample robot uses an Xbox controller (or another gamepad) on USB port 0
for arcade drive and two motors on PWM ports 0 and 1. The vendor examples use
CAN IDs 1 and 2. Here we create ``DifferentialDrive`` (``robotDrive``),
``Gamepad`` (``controller``), and ``Timer`` (``timer``) objects. This code:

1. Defines the variables as members of the Robot class.
2. Initializes each object once instead of recreating it periodically.

.. note:: The variable initializations for C++ are in the ``private`` section at the bottom of the program. This means they are private to the class (``Robot``).

## Robot Initialization

.. tab-set::

   .. tab-item:: Java
      :sync: java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/gettingstarted/Robot.java
         :language: java
         :lines: 27-32
         :lineno-match:

   .. tab-item:: C++
      :sync: c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
         :language: c++
         :lines: 13-20
         :lineno-match:

   .. tab-item:: Python
      :sync: python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/GettingStarted/robot.py
         :language: python
         :lines: 13-18, 25-28
         :linenos:
         :lineno-start: 12

The ``Robot`` constructor for our sample program inverts the right side of the drivetrain. Depending on your drive setup, you might need to invert the left side instead.

## Simple Autonomous Example

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/gettingstarted/Robot.java
      :language: java
      :lines: 34-50
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
      :language: c++
      :lines: 22-33
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/GettingStarted/robot.py
      :language: python
      :lines: 30-42
      :lineno-match:

The ``AutonomousInit`` method is run once each time the robot transitions to autonomous from another mode. In this program, we restart the ``Timer`` in this method.

``AutonomousPeriodic`` is run once every period while the robot is in autonomous mode. In the ``TimedRobot`` class the period is a fixed time, which defaults to 20ms. In this example, the periodic code checks if the timer is less than 2 seconds and if so, drives forward at half speed using the ``ArcadeDrive`` method of the ``DifferentialDrive`` class. If more than 2 seconds has elapsed, the code stops the robot drive.

## Joystick Control for Teleoperation

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/gettingstarted/Robot.java
      :language: java
      :lines: 52-60
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
      :language: c++
      :lines: 35-40
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/GettingStarted/robot.py
      :language: python
      :lines: 44-51
      :lineno-match:

Like in Autonomous, the Teleop mode has a ``TeleopInit`` and ``TeleopPeriodic`` function. In this example we don't have anything to do in ``TeleopInit``, it is provided for illustration purposes only. In ``TeleopPeriodic``, the code uses the ``ArcadeDrive`` method to map the Y-axis of the left thumbstick of the ``Gamepad`` to forward/back motion of the drive motors and the X-axis to turning motion.

## Utility Mode

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/gettingstarted/Robot.java
      :language: java
      :lines: 62-68
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
      :language: c++
      :lines: 42-44
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/GettingStarted/robot.py
      :language: python
      :lines: 53-57
      :lineno-match:

Utility Mode is used for testing robot functionality or running other code that shouldn't be run in a match. Similar to ``TeleopInit``, the ``UtilityInit`` and ``UtilityPeriodic`` methods are provided here for illustrative purposes only.

## Deploying the Project to a Robot

Before deploying, save the program and check that:

- The project's team number matches Systemcore and the Driver Station.
- Motor ports or CAN IDs match the wired devices.
- The required vendor libraries are installed for a CAN example.
- The controller is assigned to the port used by the example.

Connect the computer using the USB or robot-network path verified in Step 3.
Keep the robot disabled, then use the command for your language below.

.. tab-set::

   .. tab-item:: Java/C++

      In Visual Studio Code, click the WPILib logo in the top right to launch the WPILib Command Palette. Select :guilabel:`Deploy Robot Code` to deploy the code to the robot.

      .. note:: The run button in VS Code's debug view is not used to run robot code. Instead, use the :guilabel:`Deploy Robot Code` command as described above. The debug view's run button is used for running and debugging code on the local machine in simulation, which is not applicable for robot code that runs on Systemcore.

      For more detailed instructions, see :ref:`Deploy Java/C++ code <docs/software/vscode-overview/deploying-robot-code:Building and Deploying Robot Code>`.

   .. tab-item:: Python

      In the terminal, run the following command to deploy the code to the robot:

      .. tab-set::

         .. tab-item:: Windows
            :sync: windows

            ```sh
            py -3 -m robotpy deploy
            ```

         .. tab-item:: macOS
            :sync: macos

            ```sh
            python3 -m robotpy deploy
            ```

         .. tab-item:: Linux
            :sync: linux

            ```sh
            python3 -m robotpy deploy
            ```

      For more detailed instructions, see :doc:`Deploy Python code </docs/software/python/subcommands/deploy>`.

**Expected result:** the terminal reports deployment success, and Driver
Station shows both robot communication and robot code. If either is missing,
read the deploy output and resolve the first error before continuing.

Leave the robot disabled. Continue to :doc:`running-test-program` for the
controller checks and first drive test.

.. container:: sw-success

   .. container:: sw-success-h

      ✓ Your drivetrain program is deployed.

   Continue to the safety checks and first-enable procedure before running the
   motors.

.. container:: sw-nav

   :doc:`← Step 4: Write and Drive <index>`

   .. container:: sw-next

      :doc:`Run Your Test Program Safely → <running-test-program>`
