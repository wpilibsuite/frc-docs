# Creating your Test Drivetrain Program (Java/C++/Python)

Once everything is installed, we're ready to create a robot program.  WPILib comes with several templates for robot programs.  Use of these templates is highly recommended for new users; however, advanced users are free to write their own robot code from scratch. This article walks through creating a project from one of the provided examples which has some code already written to drive a basic robot.

* :ref:`create_java_cpp_project`
* :ref:`create_python_project`

.. important:: This guide includes code examples that involve vendor hardware for the convenience of the user. In this document, :term:`PWM` refers to the motor controller included in the KOP. The CTRE tab references the Talon FX motor controller (Falcon 500 motor), but usage is similar for TalonSRX and VictorSPX. The REV tab references the CAN SPARK MAX controlling a brushless motor, but it's similar for brushed motor. There is an assumption that the user has already installed the required :doc:`vendordeps </docs/software/vscode-overview/3rd-party-libraries>` and configured the device(s) (update firmware, assign CAN IDs, etc.) according to the manufacturer documentation ([CTRE](https://docs.ctr-electronics.com/) / [REV](https://docs.revrobotics.com/brushless/spark-max/gs)).

.. _create_java_cpp_project:

## Creating a New WPILib Project (Java/C++)

Bring up the Visual Studio Code command palette with :kbd:`Ctrl+Shift+P`. Then, type "WPILib" into the prompt.  Since all WPILib commands start with "WPILib", this will bring up the list of WPILib-specific VS Code commands. Now, select the "Create a new project" command:

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
5. **Project Name**: The name of the robot project.  This also specifies the name that the project folder will be given if the Create New Folder box is checked.
6. **Create a New Folder**: If this is checked, a new folder will be created to hold the project within the previously-specified folder.  If it is *not* checked, the project will be located directly in the previously-specified folder.  An error will be thrown if the folder is not empty and this is not checked. project folder will be given if the Create New Folder box is checked.
7. **Team Number**: The team number for the project, which will be used for package names within the project and to locate the robot when deploying code.
8. **Enable Desktop Support**: Enables unit test and simulation. While WPILib supports this, third party software libraries may not. If libraries do not support desktop, then your code may not compile or may crash. It should be left unchecked unless unit testing or simulation is needed and all libraries support it. For this example, do not check this box.

Once all the above have been configured, click "Generate Project" and the robot project will be created.

.. note:: Any errors in project generation will appear in the bottom right-hand corner of the screen.

.. warning:: Creating projects on OneDrive is not supported as OneDrive's caching interferes with the build system. Some Windows installations put the Documents and Desktop folders on OneDrive by default.

## Opening The New Project

.. image:: /docs/software/vscode-overview/images/importing-previous-project/opening-project.png
   :alt: Open Project Dialog in VS Code

After successfully creating your project, VS Code will give the option of opening the project as shown above. We can choose to do that now or later by typing :kbd:`Ctrl+K` then :kbd:`Ctrl+O` (or just :kbd:`Command+O` on macOS) and select the folder where we saved our project.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/trusted-workspace.png
   :alt: Trusted Workspace dialog in VS Code.

Click :guilabel:`Yes I trust the authors`.

Once opened we will see the project hierarchy on the left. Double clicking on the file will open that file in the editor.

.. image:: /docs/software/vscode-overview/images/creating-robot-program/opened-robot-project.png
    :alt: The robot.java code shown after opening a new project.

## C++ Configurations (C++ Only)

For C++ projects, there is one more step to set up IntelliSense.  Whenever we open a project, we should get a pop-up in the bottom right corner asking to refresh C++ configurations.  Click "Yes" to set up IntelliSense.

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
* The ``robot.py`` file is where you will put the your Robot class.

.. seealso:: :ref:`docs/zero-to-robot/step-2/python-setup:Download RobotPy for roboRIO`


## Basic Drivetrain example

First, here is what a simple code can look like for a Drivetrain with PWM controlled motors (such as SparkMax).

.. note:: the Python example below is from `<https://github.com/robotpy/examples/tree/main/GettingStarted>`__

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
      :language: java
      :linenos:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.1.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
      :language: c++
      :linenos:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/c616f00ad7c316ecb21428118a2aefb8a5b104ad/getting-started/robot.py
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

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
               :language: java
               :lines: 7-12
               :linenos:

         .. tab-item:: C++
            :sync: c++

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 5-9
               :lineno-match:

         .. tab-item:: Python

            .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/GettingStarted/robot.py
               :language: python
               :lines: 8-9
               :lineno-match:

   .. tab-item:: CTRE-Phoenix6
      :sync: ctre6


      .. tab-set-code::


         ```java
         import edu.wpi.first.wpilibj.TimedRobot;
         import edu.wpi.first.wpilibj.Timer;
         import edu.wpi.first.wpilibj.XboxController;
         import edu.wpi.first.wpilibj.drive.DifferentialDrive;
         import com.ctre.phoenix6.hardware.TalonFX;
         ```

         ```c++
         #include <frc/TimedRobot.h>
         #include <frc/Timer.h>
         #include <frc/XboxController.h>
         #include <frc/drive/DifferentialDrive.h>
         #include <ctre/phoenix6/TalonFX.hpp>
         ```

         ```python
         import wpilib               # Used to get the joysticks
         import wpilib.drive         # Used for the DifferentialDrive class
         import phoenix6             # CTRE library
         ```

   .. tab-item:: REV

         .. tab-set-code::

            ```java
            import com.revrobotics.CANSparkMax;
            import com.revrobotics.CANSparkLowLevel.MotorType;
            import edu.wpi.first.wpilibj.TimedRobot;
            import edu.wpi.first.wpilibj.Timer;
            import edu.wpi.first.wpilibj.XboxController;
            import edu.wpi.first.wpilibj.drive.DifferentialDrive;
            ```

            ```c++
            #include <frc/TimedRobot.h>
            #include <frc/Timer.h>
            #include <frc/XboxController.h>
            #include <frc/drive/DifferentialDrive.h>
            #include <frc/motorcontrol/PWMSparkMax.h>
            #include <rev/CANSparkMax.h>
            ```

            ```python
            import wpilib           # Used to get the joysticks
            import wpilib.drive     # Used for the DifferentialDrive class
            import rev              # REV library
            ```

   .. tab-item:: CTRE-Phoenix5
      :sync: ctre5


      .. tab-set-code::


         ```java
         import edu.wpi.first.wpilibj.TimedRobot;
         import edu.wpi.first.wpilibj.Timer;
         import edu.wpi.first.wpilibj.XboxController;
         import edu.wpi.first.wpilibj.drive.DifferentialDrive;
         import com.ctre.phoenix.motorcontrol.can.WPI_TalonSRX;
         ```

         ```c++
         #include <frc/TimedRobot.h>
         #include <frc/Timer.h>
         #include <frc/XboxController.h>
         #include <frc/drive/DifferentialDrive.h>
         #include <ctre/phoenix/motorcontrol/can/WPI_TalonSRX.h>
         ```

         ```python
         import wpilib           # Used to get the joysticks
         import wpilib.drive     # Used for the DifferentialDrive class
         import ctre             # CTRE library
         ```

Our code needs to reference the components of WPILib that are used. In C++ this is accomplished using ``#include`` statements; in Java and Python it is done with ``import`` statements. The program references classes for ``XBoxController`` (for driving), ``PWMSparkMax`` / ``TalonFX`` / ``CANSparkMax`` / ``WPI_TalonSRX`` (for controlling motors), ``TimedRobot`` (the base class used for the example), ``Timer`` (used for autonomous), and ``DifferentialDrive`` (for connecting the Xbox  controller to the motors).

## Defining the variables for our sample robot

.. tab-set::

   .. tab-item:: PWM
      :sync: pwm

      .. tab-set::

         .. tab-item:: Java
            :sync: java

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
               :language: java
               :lines: 19-25
               :lineno-match:

         .. tab-item:: C++
            :sync: c++

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 50-60
               :lineno-match:

         .. tab-item:: Python
            :sync: python

            .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/c6d0540b01e138725fad7366ff4e317e9994b78b/GettingStarted/robot.py
               :language: python
               :linenos:
               :lines: 12-29
               :lineno-start: 12

   .. tab-item:: CTRE-Phoenix6
      :sync: ctre6

      .. tab-set::

         .. tab-item:: Java
            :sync: java

            ```java
            public class Robot extends TimedRobot {
               private final TalonFX m_leftDrive = new TalonFX(1);
               private final TalonFX m_rightDrive = new TalonFX(2);
               private final DifferentialDrive m_robotDrive =
                 new DifferentialDrive(m_leftDrive::set, m_rightDrive::set);
               private final XboxController m_controller = new XboxController(0);
               private final Timer m_timer = new Timer();
            ```

         .. tab-item:: C++
            :sync: c++

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 12-13
               :lineno-match:

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 17-23
               :lineno-match:

            ```c++
            private:
             // Robot drive system
             ctre::phoenix6::hardware::TalonFX m_left{1};
             ctre::phoenix6::hardware::TalonFX m_right{2};
             frc::DifferentialDrive m_robotDrive{
               [&](double output) { m_left.Set(output); },
               [&](double output) { m_right.Set(output); }};
             frc::XboxController m_controller{0};
             frc::Timer m_timer;
            ```

         .. tab-item:: Python
            :sync: python

            ```python
            class MyRobot(wpilib.TimedRobot):
              def robotInit(self):
                 """
                 This function is called upon program startup and
                 should be used for any initialization code.
                 """
                 self.leftDrive = phoenix6.hardware.TalonFX(1)
                 self.rightDrive = phoenix6.hardware.TalonFX(2)
                 self.robotDrive = wpilib.drive.DifferentialDrive(
                     self.leftDrive, self.rightDrive
                 )
                 self.controller = wpilib.XboxController(0)
                 self.timer = wpilib.Timer()
                 # We need to invert one side of the drivetrain so that positive voltages
                 # result in both sides moving forward. Depending on how your robot's
                 # gearbox is constructed, you might have to invert the left side instead.
                 self.rightDrive.setInverted(True)
            ```

   .. tab-item:: REV
      :sync: rev

      .. tab-set::

         .. tab-item:: Java
            :sync: java

            ```java
            public class Robot extends TimedRobot {
              private final CANSparkMax m_leftDrive = new CANSparkMax(1, MotorType.kBrushless);
              private final CANSparkMax m_rightDrive = new CANSparkMax(2, MotorType.kBrushless);
              private final DifferentialDrive m_robotDrive =
                new DifferentialDrive(m_leftDrive::set, m_rightDrive::set);
              private final XboxController m_controller = new XboxController(0);
              private final Timer m_timer = new Timer();
            ```

         .. tab-item:: C++
            :sync: c++

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 12-13
               :lineno-match:

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 17-23
               :lineno-match:

            ```c++
            private:
             // Robot drive system
             rev::CANSparkMax m_left{1, rev::CANSparkMax::MotorType::kBrushless};
             rev::CANSparkMax m_right{2, rev::CANSparkMax::MotorType::kBrushless};
             frc::DifferentialDrive m_robotDrive{
               [&](double output) { m_left.Set(output); },
               [&](double output) { m_right.Set(output); }};
             frc::XboxController m_controller{0};
             frc::Timer m_timer;
            ```

         .. tab-item:: Python
            :sync: python

            .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/robotpy-rev/bc3ebc4/examples/getting-started/robot.py
               :language: python
               :linenos:
               :lines: 13-30
               :lineno-start: 13

   .. tab-item:: CTRE-Phoenix5
      :sync: ctre5

      .. tab-set::

         .. tab-item:: Java
            :sync: java

            ```java
            public class Robot extends TimedRobot {
               private final WPI_TalonSRX m_leftDrive = new WPI_TalonSRX(1);
               private final WPI_TalonSRX m_rightDrive = new WPI_TalonSRX(2);
               private final DifferentialDrive m_robotDrive = new DifferentialDrive(m_leftDrive1::set, m_rightDrive2::set);
               private final XboxController m_controller = new XboxController(0);
               private final Timer m_timer = new Timer();
            ```

         .. tab-item:: C++
            :sync: c++

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 12-13
               :lineno-match:

            .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
               :language: c++
               :lines: 17-23
               :lineno-match:

            ```c++
            private:
             // Robot drive system
             ctre::phoenix::motorcontrol::can::WPI_TalonSRX m_left{1};
             ctre::phoenix::motorcontrol::can::WPI_TalonSRX m_right{2};
             frc::DifferentialDrive m_robotDrive{
               [&](double output) { m_left.Set(output); },
               [&](double output) { m_right.Set(output); }};
             frc::XboxController m_controller{0};
             frc::Timer m_timer;
            ```

         .. tab-item:: Python
            :sync: python

            .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/robotpy-ctre/5b8d33f/examples/getting-started/robot.py
               :language: python
               :linenos:
               :lines: 13-30
               :lineno-start: 13

The sample robot in our examples will have an Xbox Controller on USB port 0 for arcade drive and two motors on PWM ports 0 and 1 (Vendor examples use CAN with IDs 1 and 2). Here we create objects of type ``DifferentialDrive`` (m_robotDrive), ``XboxController`` (m_controller) and ``Timer`` (m_timer). This section of the code does three things:

1. Defines the variables as members of our Robot class.
2. Initializes the variables.

.. note:: The variable initializations for C++ are in the ``private`` section at the bottom of the program. This means they are private to the class (``Robot``). The C++ code also sets the Motor Safety expiration to 0.1 seconds (the drive will shut off if we don't give it a command every .1 seconds) and starts the ``Timer`` used for autonomous.

## Robot Initialization

.. tab-set::

   .. tab-item:: Java
      :sync: java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
         :language: java
         :lines: 27-28,32-36
         :linenos:
         :lineno-start: 27

   .. tab-item:: C++
      :sync: c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
         :language: c++
         :lines: 12-13,17-24
         :linenos:
         :lineno-start: 12

   .. tab-item:: Python
      :sync: python

      ```python
      def robotInit(self):
      ```

The ``Robot`` constructor for our sample program inverts the right side of the drivetrain. Depending on your drive setup, you might need to invert the left side instead.

## Simple Autonomous Example

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
      :language: java
      :lines: 38-54
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
      :language: c++
      :lines: 25-36
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/GettingStarted/robot.py
      :language: python
      :lines: 31-43
      :lineno-match:

The ``AutonomousInit`` method is run once each time the robot transitions to autonomous from another mode. In this program, we restart the ``Timer`` in this method.

``AutonomousPeriodic`` is run once every period while the robot is in autonomous mode. In the ``TimedRobot`` class the period is a fixed time, which defaults to 20ms. In this example, the periodic code checks if the timer is less than 2 seconds and if so, drives forward at half speed using the ``ArcadeDrive`` method of the ``DifferentialDrive`` class. If more than 2 seconds has elapsed, the code stops the robot drive.

## Joystick Control for Teleoperation

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
      :language: java
      :lines: 56-64
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
      :language: c++
      :lines: 38-45
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/GettingStarted/robot.py
      :language: python
      :lines: 45-52
      :lineno-match:

Like in Autonomous, the Teleop mode has a ``TeleopInit`` and ``TeleopPeriodic`` function. In this example we don't have anything to do in ``TeleopInit``, it is provided for illustration purposes only. In ``TeleopPeriodic``, the code uses the ``ArcadeDrive`` method to map the Y-axis of the left thumbstick of the ``XBoxController`` to forward/back motion of the drive motors and the X-axis to turning motion.

## Test Mode

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
      :language: java
      :lines: 66-73
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
      :language: c++
      :lines: 45-48
      :lineno-match:

   .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/GettingStarted/robot.py
      :language: python
      :lines: 54-58
      :lineno-match:

Test Mode is used for testing robot functionality. Similar to ``TeleopInit``, the ``TestInit`` and ``TestPeriodic`` methods are provided here for illustrative purposes only.

## Deploying the Project to a Robot

* :ref:`Deploy Java/C++ code <docs/software/vscode-overview/deploying-robot-code:Building and Deploying Robot Code>`
* :doc:`Deploy Python code </docs/software/python/subcommands/deploy>`
