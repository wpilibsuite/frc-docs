Choosing an Autonomous Program
==============================

Often teams have more than one autonomous program, either for competitive reasons or for testing new software. Programs often vary by adding things like time delays, different strategies, etc. The methods to choose the strategy to run usually involves switches, joystick buttons, knobs or other hardware based inputs.

With the SmartDashboard you can simply display a widget on the screen to choose the autonomous program that you would like to run. And with command based programs, that program is encapsulated in one of several commands. This article shows how to select an autonomous program with only a few lines of code and a nice looking user interface, with examples for both TimedRobot and Command-Based Robots.

TimedRobot
----------

.. note:: The code snippets shown below are part of the TimedRobot template (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/timed>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/templates/timed>`__):

Creating SendableChooser Object
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``Robot.java`` / ``Robot.h``, create a variable to hold a reference to a ``SendableChooser`` object. Two or more auto modes can be added by creating strings to send to the chooser. Using the ``SendableChooser``, one can choose between them. In this example, ``Default`` and ``My Auto`` are shown as options. You will also need a variable to store which auto has been chosen, ``m_autoSelected``.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/timed/Robot.java
      :language: java
      :lines: 18-21

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/templates/timed/include/Robot.h
      :language: c++
      :lines: 28-31

Setting Up Options
^^^^^^^^^^^^^^^^^^^^^^^^^^

The chooser allows you to pick from a list of defined elements, in this case the strings we defined above. In ``robotInit``, add your options created as strings above using ``setDefaultOption`` or ``addOption``. ``setDefaultOption`` will be the one selected by default when the dashboard starts. The ``putData`` function will push it to the dashboard on your driver station computer.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/timed/Robot.java
      :language: java
      :lines: 28-32

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/templates/timed/cpp/Robot.cpp
      :language: c++
      :lines: 11-15

Running Autonomous Code
^^^^^^^^^^^^^^^^^^^^^^^

Now, in ``autonomousInit`` and ``autonomousPeriodic``, you can use the ``m_autoSelected`` variable to read which option was chosen, and change what happens during the autonomous period.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/timed/Robot.java
      :language: java
      :lines: 54-73

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/templates/timed/cpp/Robot.cpp
      :language: c++
      :lines: 38-57


Command-Based
-------------

.. note:: The code snippets shown below are part of the HatchbotTraditional example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional>`__):

Creating the SendableChooser Object
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``RobotContainer``, create a variable to hold a reference to a ``SendableChooser`` object. Two or more commands can be created and stored in new variables. Using the ``SendableChooser``, one can choose between them. In this example, ``SimpleAuto`` and ``ComplexAuto`` are shown as options.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/RobotContainer.java
      :language: java
      :lines: 37-47

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/include/RobotContainer.h
      :language: c++
      :lines: 38-44

Setting up SendableChooser
^^^^^^^^^^^^^^^^^^^^^^^^^^

Imagine that you have two autonomous programs to choose between and they are encapsulated in commands ``SimpleAuto`` and ``ComplexAuto``. To choose between them:

In ``RobotContainer``, create a ``SendableChooser`` object and add instances of the two commands to it. There can be any number of commands, and the one added as a default (``setDefaultOption``), becomes the one that is initially selected. Notice that each command is included in an ``setDefaultOption()`` or ``addOption()`` method call on the ``SendableChooser`` instance.

.. tabs::

  .. code-tab:: java

      // Add commands to the autonomous command chooser
      m_chooser.setDefaultOption("Simple Auto", m_simpleAuto);
      m_chooser.addOption("Complex Auto", m_complexAuto);

      // Put the chooser on the dashboard
      SmartDashboard.putData(m_chooser);

  .. code-tab:: c++

      // Add commands to the autonomous command chooser
      m_chooser.SetDefaultOption("Simple Auto", &m_simpleAuto);
      m_chooser.AddOption("Complex Auto", &m_complexAuto);

      // Put the chooser on the dashboard
      frc::SmartDashboard::PutData(&m_chooser);

Starting an Autonomous Command
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``Robot.java``, when the autonomous period starts, the ``SendableChooser`` object is polled to get the selected command and that command must be scheduled.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/RobotContainer.java
      :language: java
      :lines: 96-98

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/Robot.java
      :language: java
      :lines: 58-59,67-72

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/RobotContainer.cpp
      :language: c++
      :lines: 54-57

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/Robot.cpp
      :language: c++
      :lines: 37-44

Running the Scheduler during Autonomous
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``Robot.java``, this will run the scheduler every driver station update period (about every 20ms) and cause the selected autonomous command to run.

.. note:: Running the scheduler can occur in the ``autonomousPeriodic()`` function or ``robotPeriodic()``, both will function similarly in autonomous mode.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/Robot.java
      :language: java
      :lines: 40-41,46-47
      :linenos:
      :lineno-start: 40

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/Robot.cpp
      :language: c++
      :lines: 20-22
      :linenos:
      :lineno-start: 20

Canceling the Autonomous Command
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In ``Robot.java``, when the teleop period begins, the autonomous command will be canceled.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/hatchbottraditional/Robot.java
      :language: java
      :lines: 78-87
      :linenos:
      :lineno-start: 78

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/HatchbotTraditional/cpp/Robot.cpp
      :language: c++
      :lines: 47-56

SmartDashboard Display
^^^^^^^^^^^^^^^^^^^^^^

.. image:: images/choosing-an-autonomous-program-from-smartdashboard/smartdashboard-display.png
  :alt: SendableChooser shows two selectable autos: Simple Auto and Complex Auto.

When the SmartDashboard is run, the choices from the ``SendableChooser`` are automatically displayed. You can simply pick an option before the autonomous period begins and the corresponding command will run.
