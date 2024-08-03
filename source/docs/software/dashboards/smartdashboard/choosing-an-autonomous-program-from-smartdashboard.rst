Choosing an Autonomous Program
==============================

Often teams have more than one autonomous program, either for competitive reasons or for testing new software. Programs often vary by adding things like time delays, different strategies, etc. The methods to choose the strategy to run usually involves switches, joystick buttons, knobs or other hardware based inputs.

With the SmartDashboard you can simply display a widget on the screen to choose the autonomous program that you would like to run. And with command based programs, that program is encapsulated in one of several commands. This article shows how to select an autonomous program with only a few lines of code and a nice looking user interface, with examples for both TimedRobot and Command-Based Robots.

TimedRobot
----------

.. note:: The code snippets shown below are part of the TimedRobot template (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/timed>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/templates/timed>`__):

Creating SendableChooser Object
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``Robot.java`` / ``Robot.h``, create a variable to hold a reference to a ``SendableChooser`` object. Two or more auto modes can be added by creating strings to send to the chooser. Using the ``SendableChooser``, one can choose between them. In this example, ``Default`` and ``My Auto`` are shown as options. You will also need a variable to store which auto has been chosen, ``m_autoSelected``.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/timed/Robot.java
         :language: Java
         :lines: 18-21

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/templates/timed/include/Robot.h
         :language: C++
         :lines: 28-31

   .. tab-item:: Python
      :sync: Python

      .. code-block:: python

         import wpilib

         self.defaultAuto = "Default"
         self.customAuto = "My Auto";
         self.chooser = wpilib.SendableChooser()

Setting Up Options
^^^^^^^^^^^^^^^^^^

The chooser allows you to pick from a list of defined elements, in this case the strings we defined above. In ``robotInit``, add your options created as strings above using ``setDefaultOption`` or ``addOption``. ``setDefaultOption`` will be the one selected by default when the dashboard starts. The ``putData`` function will push it to the dashboard on your driver station computer.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/timed/Robot.java
         :language: java
         :lines: 28-32

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/templates/timed/cpp/Robot.cpp
         :language: c++
         :lines: 10-14

   .. tab-item:: Python
      :sync: Python

      .. code-block:: python

         from wpilib import SmartDashboard

         self.chooser.setDefaultOption("Default Auto", self.defaultAuto)
         self.chooser.addOption("My Auto", self.customAuto)
         SmartDashboard.putData("Auto choices", self.chooser)

Running Autonomous Code
^^^^^^^^^^^^^^^^^^^^^^^

Now, in ``autonomousInit`` and ``autonomousPeriodic``, you can use the ``m_autoSelected`` variable to read which option was chosen, and change what happens during the autonomous period.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/timed/Robot.java
         :language: Java
         :lines: 54-56, 58-73

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/templates/timed/cpp/Robot.cpp
         :language: C++
         :lines: 37-38, 41-57

   .. tab-item:: Python
      :sync: Python

      .. code-block:: python

         def autonomousInit(self):
            self.autoSelected = self.chooser.getSelected()
            print("Auto selected: " + self.autoSelected)

         def autonomousPeriodic(self):
            match self.autoSelected:
               case self.customAuto:
                  # Put custom auto code here
               case _:
                  # Put default auto code here

Command-Based
-------------

.. note:: The code snippets shown below are part of the HatchbotTraditional example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional>`__, `Python <https://github.com/robotpy/examples/tree/main/HatchbotTraditional>`__):

Creating the SendableChooser Object
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``RobotContainer``, create a variable to hold a reference to a ``SendableChooser`` object. Two or more commands can be created and stored in new variables. Using the ``SendableChooser``, one can choose between them. In this example, ``SimpleAuto`` and ``ComplexAuto`` are shown as options.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/RobotContainer.java
         :language: Java
         :lines: 40-49

   .. tab-item:: C++ (using raw pointers)
      :sync: C++ (using raw pointers)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/RobotContainer.h
         :language: C++
         :lines: 38-44

   .. tab-item:: C++ (using ``CommandPtr``)
      :sync: C++ (using ``CommandPtr``)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/include/RobotContainer.h
         :language: C++
         :lines: 45-50

   .. tab-item:: Python
      :sync: Python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/2024.0.0b4/HatchbotTraditional/robotcontainer.py
         :language: Python
         :lines: 45-54

Setting up SendableChooser
^^^^^^^^^^^^^^^^^^^^^^^^^^

Imagine that you have two autonomous programs to choose between and they are encapsulated in commands ``SimpleAuto`` and ``ComplexAuto``. To choose between them:

In ``RobotContainer``, create a ``SendableChooser`` object and add instances of the two commands to it. There can be any number of commands, and the one added as a default (``setDefaultOption``), becomes the one that is initially selected. Notice that each command is included in an ``setDefaultOption()`` or ``addOption()`` method call on the ``SendableChooser`` instance.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/RobotContainer.java
         :language: java
         :lines: 69-71

   .. tab-item:: C++ (using raw pointers)
      :sync: C++ (using raw pointers)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/RobotContainer.cpp
         :language: c++
         :lines: 18-20

   .. tab-item:: C++ (using ``CommandPtr``)
      :sync: C++ (using ``CommandPtr``)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/RobotContainer.cpp
         :language: c++
         :lines: 12-15

   .. tab-item:: Python
      :sync: Python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/2024.0.0b4/HatchbotTraditional/robotcontainer.py
         :language: Python
         :lines: 56-58

Then, publish the chooser to the dashboard:

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. code-block:: java

         // Put the chooser on the dashboard
         SmartDashboard.putData(m_chooser);

   .. tab-item:: C++
      :sync: C++

      .. code-block:: c++

         // Put the chooser on the dashboard
         frc::SmartDashboard::PutData(&m_chooser);

   .. tab-item:: Python
      :sync: Python

      .. code-block:: python

         from wpilib import SmartDashboard

         # Put the chooser on the dashboard
         SmartDashboard.putData(chooser)

Starting an Autonomous Command
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``Robot.java``, when the autonomous period starts, the ``SendableChooser`` object is polled to get the selected command and that command must be scheduled.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/RobotContainer.java
         :language: java
         :lines: 124-126

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/Robot.java
         :language: java
         :lines: 67-68,76-81

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/RobotContainer.cpp
         :language: c++
         :lines: 81-84

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/Robot.cpp
         :language: c++
         :lines: 46-52

   .. tab-item:: Python
      :sync: Python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/2024.0.0b4/HatchbotTraditional/robotcontainer.py
         :language: Python
         :lines: 93-94

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/2024.0.0b4/HatchbotTraditional/robot.py
         :language: Python
         :lines: 41-46

Running the Scheduler during Autonomous
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``Robot.java``, this will run the scheduler every driver station update period (about every 20ms) and cause the selected autonomous command to run.  In Python the scheduler runs automatically when ``TimedCommandRobot`` is used.

.. note:: Running the scheduler can occur in the ``autonomousPeriodic()`` function or ``robotPeriodic()``, both will function similarly in autonomous mode.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/Robot.java
         :language: java
         :lines: 49-50,55-56
         :linenos:
         :lineno-start: 40

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/Robot.cpp
         :language: c++
         :lines: 29-31
         :linenos:
         :lineno-start: 29

Canceling the Autonomous Command
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``Robot.java``, when the teleop period begins, the autonomous command will be canceled.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/Robot.java
         :language: java
         :lines: 87-96
         :linenos:
         :lineno-start: 78

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/Robot.cpp
         :language: c++
         :lines: 56-65
         :linenos:
         :lineno-start: 56

   .. tab-item:: Python
      :sync: Python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/2024.0.0b4/HatchbotTraditional/robot.py
         :language: Python
         :lines: 51-57
         :linenos:
         :lineno-start: 51

SmartDashboard Display
^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/choosing-an-autonomous-program-from-smartdashboard/smartdashboard-display.png
  :alt: SendableChooser shows two selectable autos: Simple Auto and Complex Auto.

When the SmartDashboard is run, the choices from the ``SendableChooser`` are automatically displayed. You can simply pick an option before the autonomous period begins and the corresponding command will run.
