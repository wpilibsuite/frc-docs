.. include:: <isonum.txt>

# What is WPILib?

.. figure:: /assets/wpilib-generic.svg
   :alt: The WPI Robotics Library logo.
   :target: http://wpilib.org
   :width: 400

WPILib is the standard software library for programming
*FIRST*\ |reg| robots.
It provides the classes and tools needed to control motors, read sensors,
communicate with the Driver Station, and run autonomous routines across
FRC\ |reg| and FTC\ |reg| via Systemcore.

.. image:: /assets/wpi-logo.png
   :alt: Worcester Polytechnic Institute (WPI) logo.
   :target: http://wpi.edu
   :width: 300
   :align: center

WPILib is developed and maintained by a partnership between
`Worcester Polytechnic Institute (WPI) <http://wpi.edu>`_,
FIRST\ |reg|, and volunteer developers from the community.

.. rubric:: Which path are you on?

.. grid:: 1 2 2 4
   :gutter: 3

   .. grid-item-card:: FTC Systemcore
      :class-card: sw-card-ftc

      **FTC with Systemcore**
      ^^^
      Use WPILib with Systemcore and Motioncore. Write your code in
      Java, Blocks, C++, or Python.

   .. grid-item-card:: FTC REV Control Hub / Expansion Hub
      :link: https://ftc-docs.firstinspires.org/en/latest/
      :link-type: url
      :class-card: sw-card-ftc

      **FTC SDK**
      ^^^
      Program a REV Control Hub or Expansion Hub with the FTC SDK.
      FTC Docs covers the hardware, wiring, setup, and programming.

   .. grid-item-card:: FIRST Robotics Competition
      :class-card: sw-card-frc

      **FRC**
      ^^^
      Write your robot code in Java, Blocks, C++, or Python and run it on
      Systemcore. You'll need a Windows computer for the Driver Station
      at competition.

   .. grid-item-card:: XRP Practice Robot
      :class-card: sw-card-shared

      **FRC + FTC**
      ^^^
      Practice reading sensors, controlling motors, and writing drive code
      on an XRP desktop robot. You don't need a competition robot to
      get started.

.. rubric:: What WPILib Includes

.. list-table::
   :header-rows: 1
   :widths: 22 46 10 22

   * - Component
     - Description
     - FRC
     - FTC
   * - **Robot library**
     - Motor control, sensors, drive classes, kinematics
     - ✓
     - ✓ (Systemcore)
   * - **VS Code extension**
     - Project templates, deploy, build, vendor manager
     - ✓
     - ✓
   * - **Simulation framework**
     - Run robot code on laptop without hardware
     - ✓
     - ✓ (XRP)
   * - **Glass dashboard**
     - Real-time telemetry and field visualization
     - ✓
     - ✓
   * - **Elastic dashboard**
     - Configurable driver dashboard (replaces Shuffleboard)
     - ✓
     - Planned
   * - **PathPlanner / Choreo**
     - GUI path planning for autonomous
     - ✓
     - Planned
   * - **OutlineViewer**
     - NetworkTables browser
     - ✓
     - ✓

.. rubric:: Language Comparison

.. list-table::
   :header-rows: 1
   :widths: 20 30 20 30

   * - Language
     - Useful for
     - Programming style
     - Notes
   * - **Java**
     - Teams choosing a text-based language
     - Statically typed
     - Uses classes and explicit type declarations
   * - **Blocks (Blockly)**
     - Teams that prefer visual programming
     - Graphical blocks
     - Generates Python code
   * - **C++**
     - Teams with C++ experience
     - Statically typed
     - Available in the desktop environment only
   * - **Python**
     - Teams that know Python or want to learn it
     - Dynamically typed
     - Uses indentation to group code

.. tip::

   **Java, C++, and Python use similar APIs.**
   Class names and method names are kept identical or very close across
   Java, C++, and Python.

.. rubric:: Development Environments

Write code on your computer with a **desktop editor**, or use an
**OnBot editor** in your browser. OnBot runs on Systemcore and does not
require a local editor installation.

**Desktop Environment: Java, C++, Python**

.. card:: Visual Studio Code + WPILib Extension
   :class-card: sw-card-frc

   **Desktop**

   All three languages use VS Code as the IDE, with the WPILib extension
   providing project templates, build tools, simulation, and vendor library
   management. Works on Windows, macOS, and Linux.

   .. list-table::
      :header-rows: 1

      * - Feature
        - Java
        - C++
        - Python
      * - **IDE**
        - VS Code
        - VS Code
        - VS Code
      * - **Build system**
        - GradleRIO
        - GradleRIO (open to change)
        - More integrated experience
      * - **Desktop simulation**
        - ✓
        - ✓
        - ✓
      * - **Offline install**
        - ✓
        - ✓
        - ✓
      * - **Deploy**
        - USB or Wi-Fi to Systemcore
        - USB or Wi-Fi to Systemcore
        - USB or Wi-Fi to Systemcore

.. tip::

   **Python install experience:** WPILib is actively working to
   provide a more integrated Python setup, reducing the number of
   separate steps compared to Java/C++.
   **C++ build system:** GradleRIO is the baseline; transitioning
   to an alternative build system is possible depending on community contributions.

**OnBot Environments: Blockly, Java, Python, LabVIEW**

.. card:: VS Code-derived editor hosted on Systemcore
   :class-card: sw-card-frc

   **OnBot (Browser-based)**

   OnBot environments run entirely in the browser, no local
   installation required. Code is written, saved, and deployed directly
   on the Systemcore. Supports multiple saved Workspaces with a Deploy
   button to choose which one runs.

   .. list-table::
      :header-rows: 1

      * - Feature
        - Blockly
        - Java
        - Python
        - LabVIEW
      * - **Editor**
        - Block visual editor
        - VS Code-derived
        - VS Code-derived
        - Graphical (browser)
      * - **Backed by**
        - Python
        - Java
        - Python
        - LabVIEW
      * - **Desktop install**
        - None required
        - None required
        - None required
        - None required
      * - **Multi-user**
        - Single-user (under investigation)
        - Single-user (under investigation)
        - Single-user (under investigation)
        - Single-user (under investigation)

.. warning::

   **C++ is not supported in OnBot environments.**
   The browser-based toolchain does not provide a good enough C++ experience
   to ship. Use the desktop VS Code environment for C++ development.

   **OnBot notes:** Currently planned as single-user access
   (multi-user being investigated). Supports multiple saved
   *Workspaces* with a Deploy button to select which one runs on
   the Systemcore. Simulation is not planned for OnBot environments.

**FTC Legacy (REV)**

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: OnBot Java / Android Studio
      :link: https://ftc-docs.firstinspires.org/en/latest/programming_resources/shared/choosing_program_lang/choosing-program-lang.html
      :link-type: url
      :class-card: sw-card-ftc

      **FTC Legacy (REV)**
      ^^^
      Teams using the REV FTC SDK with OnBot Java (browser-based)
      or Android Studio. Documented at
      `ftc-docs.firstinspires.org <https://ftc-docs.firstinspires.org>`_.

   .. grid-item-card:: Blocks (FTC SDK)
      :link: https://ftc-docs.firstinspires.org/en/latest/programming_resources/shared/choosing_program_lang/choosing-program-lang.html
      :link-type: url
      :class-card: sw-card-ftc

      **FTC Legacy (REV)**
      ^^^
      Visual block-based programming via the FTC SDK OnBot interface.
      Documented at
      `ftc-docs.firstinspires.org <https://ftc-docs.firstinspires.org>`_.

.. rubric:: Build and Deploy Comparison

.. list-table::
   :header-rows: 1
   :widths: 22 26 30 22

   * - Feature
     - Desktop (VS Code)
     - OnBot (Java / Python / Blockly / LabVIEW)
     - FTC Legacy (REV)
   * - **Languages**
     - Java, C++, Python
     - Java, Python, Blockly, LabVIEW
     - Java, Blocks
   * - **C++ support**
     - ✓
     - ✗ Not supported
     - ✗
   * - **Build system**
     - GradleRIO
     - On-device (browser)
     - FTC SDK / Gradle
   * - **Deploy**
     - USB or Wi-Fi to Systemcore
     - Deploy button in browser (Workspace-based)
     - ADB over USB or Wi-Fi
   * - **Simulation**
     - ✓ Full desktop sim
     - ✗ Not planned
     - ✗ None
   * - **Offline install**
     - ✓
     - N/A, runs on Systemcore
     - ✓
   * - **Multi-user**
     - N/A
     - Single-user (under investigation)
     - N/A
   * - **Driver Station**
     - _FIRST_ DS (Windows, Mac, Linux)
     - _FIRST_ DS (Windows, Mac, Linux)
     - Driver Hub / phone

.. note::

  Only the Windows Version of the _FIRST_ DS is competition legal
.. rubric:: Dashboards

.. list-table::
   :header-rows: 1
   :widths: 20 35 45

   * - Dashboard
     - Status
     - Best for
   * - **Elastic**
     - ✓ Current, recommended
     - Competition driver dashboard. Highly configurable.
   * - **AdvantageScope**
     - ✓ Current, recommended
     - Log review, 3D field visualization, mechanism replay.
   * - **Glass**
     - ✓ Current
     - Built-in simulation UI and lightweight telemetry.

.. rubric:: Vendor Libraries

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: What are vendor libraries?

      Hardware vendors (REV, CTRE, etc.) ship WPILib extension
      libraries that add support for their specific motor controllers,
      sensors, and accessories. In addition, software vendors (PhotonLib, PathPlannerLib, etc.)
      ship libraries to support autonomous routines, trajectory and vision. They are installed
      **per project** via the VS Code Dependency Manager
      and do not carry over on project import.

   .. grid-item-card:: Common libraries

      - **REVLib**: SPARK MAX, SPARK Flex
      - **Phoenix 6**: Talon FX, CANcoder
      - **PathplannerLib**: auto trajectories
      - **PhotonLib**: PhotonVision cameras
      - **Limelight**: Limelight cameras

.. rubric:: Path Planning

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: PathPlanner / Choreo
      :link: pathplanning/index
      :link-type: doc
      :class-card: sw-card-frc

      **FRC and FTC + Systemcore**
      ^^^
      GUI tools for drawing autonomous paths. Both generate
      trajectory commands that slot into command-based robot programs.
      PathPlanner is more beginner-friendly; Choreo optimizes
      for time.

   .. grid-item-card:: Road Runner and PedroPathing
      :link: https://ftc-docs.firstinspires.org/en/latest/programming_resources/index.html
      :link-type: url
      :class-card: sw-card-ftc

      **FTC Legacy (REV)**
      ^^^
      Libraries for generating autonomous paths and trajectories.
      RoadRunner focuses on time consistency, while Pedro Pathing
      focuses on maximizing speed.

.. rubric:: Shared Concepts Across Programs

These programming concepts are identical whether you are writing FRC,
FTC Systemcore, or XRP code.

.. grid:: 1 1 1 1
   :gutter: 3

   .. grid-item-card:: PID Control
      :class-card: sw-card-shared

      Proportional-Integral-Derivative feedback loop for precise
      motor velocity and position control.

   .. grid-item-card:: Odometry
      :class-card: sw-card-shared

      Track robot position on the field using encoder and gyro data.
      Used for autonomous navigation.

   .. grid-item-card:: State Machines
      :class-card: sw-card-shared

      Command-based programming uses a state machine model:
      subsystems, commands, and triggers.

   .. grid-item-card:: AprilTags
      :class-card: sw-card-shared

      WPILib includes built-in AprilTag detection for field
      localization and target tracking.

   .. grid-item-card:: Motor Control
      :class-card: sw-card-shared

      DifferentialDrive, MecanumDrive, and swerve kinematics
      classes work identically across all platforms.

   .. grid-item-card:: Java Fundamentals
      :class-card: sw-card-shared

      WPILib Java code uses standard Java: classes, interfaces,
      lambdas. No framework-specific syntax to learn separately.

.. rubric:: Source Code and API Docs

- `Java source code <https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-7/wpilibj/src/main/java/org/wpilib>`_
- `C++ source code <https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-7/wpilibc/src/main/native/cpp>`_
- `Python source code <https://github.com/robotpy/mostrobotpy>`_

.. grid:: 1 2 3 3
   :gutter: 3

   .. grid-item-card:: Java API Reference
      :link: https://github.wpilib.org/allwpilib/docs/release/java/
      :link-type: url
      :class-card: sw-card-frc

      Full Javadoc for WPILibJ classes and methods.

   .. grid-item-card:: C++ API Reference
      :link: https://github.wpilib.org/allwpilib/docs/release/cpp/
      :link-type: url
      :class-card: sw-card-frc

      Doxygen documentation for WPILibC.

   .. grid-item-card:: Python API Reference
      :link: https://robotpy.readthedocs.io/projects/robotpy/en/stable/
      :link-type: url
      :class-card: sw-card-frc

      RobotPy documentation for Python-based robot programs.
