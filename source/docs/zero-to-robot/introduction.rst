.. include:: <isonum.txt>

# Zero to Robot

This guide takes you from setting up **Systemcore** to running a drivetrain
program.

Start with assembly and wiring in Step 1, set up your editor in Step 2,
configure the control system in Step 3, then write code and test the
drivetrain in Step 4.

Robot assembly and robot specific wiring are prerequisites. Step 1 links
to the FRC assembly and wiring guides currently hosted here and to
`FTC Docs <https://ftc-docs.firstinspires.org/en/latest/>`_ for FTC resources.
Use instructions that match your hardware.

FTC teams using a REV Control Hub or Expansion Hub should use
the `FTC Docs <https://ftc-docs.firstinspires.org/en/latest/>`_ for
legacy hardware setup and programming.

.. rubric:: Choose How You Will Program
   :class: wl-shared-text

Choose a programming environment and a language available for that platform.
Keep those choices as you follow Steps 2 and 4.

**Choice 1: Programming environment**

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: OnBot: Program in a Browser
      :class-card: sw-card-shared

      **OnBot Development**
      ^^^
      Open the editor hosted by Systemcore from a browser. Choose Java,
      Blocks, Python, or LabVIEW.

   .. grid-item-card:: Desktop: Program on Your Computer
      :class-card: sw-card-shared

      **Desktop Development**
      ^^^
      Write code on your computer. Use WPILib VS Code for Java, Blocks,
      C++, or Python, or choose desktop LabVIEW.

**Choice 2: Programming language**

Use the table to check which environments support your language. If your team
already knows a language, start there. If you prefer visual programming,
look at Blocks or LabVIEW.

.. list-table::
   :header-rows: 1
   :widths: 13 18 13 13 22 21

   * - Language
     - Style
     - OnBot
     - Desktop
     - Useful for
     - Notes
   * - **Java**
     - Text, statically typed
     - ✓
     - ✓
     - Teams choosing a text-based language
     - Uses classes and explicit type declarations
   * - **Blocks (Blockly)**
     - Graphical blocks
     - ✓
     - ✓
     - Teams new to programming or that prefer visual programming
     - Generates Python code
   * - **C++**
     - Text
     - ✗
     - ✓
     - Teams that already know C++
     - Desktop development only
   * - **Python**
     - Text
     - ✓
     - ✓
     - Teams already using Python
     - Uses indentation to group code
   * - **LabVIEW**
     - Graphical (dataflow)
     - ✓
     - ✓
     - Teams with a LabVIEW background
     - Graphical programming

LabVIEW is available through OnBot and desktop development. C++ is available
through desktop development only. Step 2 describes the environment you choose;
the desktop LabVIEW installation walkthrough is still being completed.

.. tip::

   **New to programming entirely?** No programming experience is required.
   This guide introduces variables, objects, methods, and control flow as you
   build and test the robot. If you want a full course alongside the guide, try
   `Codecademy Java <https://www.codecademy.com/learn/learn-java>`_ or
   `Python learning guides <http://docs.python-guide.org/en/latest/intro/learning/>`_.

.. rubric:: What You Need
   :class: wl-shared-text

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: FRC Robot Components
      :class-card: sw-card-frc

      **FRC Hardware**
      ^^^
      - Systemcore controller
      - Power Distribution Hub (PDH) or Panel (PDP)
      - Vivid VH-109 Radio
      - Motor controllers (SPARK MAX, Talon FX, etc.)
      - Drive motors and wheels
      - 12 V robot battery and fuse
      - Ethernet cable and a USB cable that matches the Systemcore's USB device port

   .. grid-item-card:: FTC Robot Components
      :class-card: sw-card-ftc

      **FTC Hardware**
      ^^^
      - Systemcore + Motioncore controllers
      - FTC legal motor controllers
      - Drive motors and wheels
      - 12 V robot battery
      - USB-C cable for programming
      - Wi-Fi for wireless deploy

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: What Gets Installed
      :class-card: sw-card-shared

      **Software: (If Needed)**
      ^^^
      OnBot teams don't need to download anything to write code. You only
      need desktop software if you're not using OnBot, or if you're an
      FRC team that needs the Driver Station.

      - **WPILib**: robot programming library + VS Code, for desktop
        development
      - **FRC Driver Station**: required for FRC teams. Runs on Windows,
        macOS, and Linux, but only the Windows version is competition
        legal
      - **RobotPy**: Python framework, for desktop Python teams
      - Vendor libraries (REVLib, Phoenix 6, etc.), installed per project

   .. grid-item-card:: Practice with the XRP
      :link: ../xrp-robot/index
      :link-type: doc
      :class-card: sw-card-shared

      **No Full Robot Yet?**
      ^^^
      Practice reading sensors, controlling motors, and writing drive
      code on an XRP desktop robot before your competition robot is ready.

.. rubric:: The Steps
   :class: wl-shared-text

Follow Steps 1 through 4 in order for the **FRC VS Code walkthrough**.
Step 4 links to the drivetrain example and the first driving test. Use
Troubleshooting when a connection, deployment, or motor test fails.

Some OnBot, Blocks, and FTC walkthroughs are still being completed.
Those sections identify what is available and what is still coming.

.. note::

   **FTC teams:** The Systemcore and Motioncore assembly and wiring
   walkthroughs are still being completed. Start with powering and connecting
   Systemcore (Step 1, Parts 2-3) and choosing your tools (Step 2).
   You can also practice WPILib programming with the
   :doc:`XRP robot <../xrp-robot/index>`.

.. grid:: 1 2 4 4
   :gutter: 3

   .. grid-item-card:: Build and Wire Your Robot
      :link: step-1/index
      :link-type: doc
      :class-card: sw-card-shared

      **01**
      ^^^
      Wire the control system: power distribution, Systemcore,
      motor controllers, and radio.

   .. grid-item-card:: Set Up Your Environment
      :link: step-2/index
      :link-type: doc
      :class-card: sw-card-shared

      **02**
      ^^^
      Set up the editor and language you chose above, and install the
      Driver Station for your robot.

   .. grid-item-card:: Configure Your Control System
      :link: step-3/index
      :link-type: doc
      :class-card: sw-card-shared

      **03**
      ^^^
      Configure your Systemcore and radio. Required every season
      before you can deploy code.

   .. grid-item-card:: Write and Drive
      :link: step-4/index
      :link-type: doc
      :class-card: sw-card-shared

      **04**
      ^^^
      Create your first robot project, deploy code to the robot,
      and enable it with the Driver Station.

.. card:: Something not working? Open Troubleshooting →
   :link: /docs/software/support/troubleshooting
   :link-type: doc
   :class-card: sw-card-shared

   Diagnose power, networking, communication, code, controller, and motor
   problems during setup or whenever you test your robot.

.. rubric:: Tips for New Teams
   :class: wl-shared-text

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item::

      .. tip::

         **Get driving first**

         Wire one drive motor per side, deploy arcade drive, and make sure
         the robot responds before adding more mechanisms. This lets you test
         the controller, motor directions, and drive code separately.

   .. grid-item::

      .. tip::

         **Check the Driver Station log**

         When something goes wrong on the robot, open the Driver Station log
         viewer. Check connection events and reported errors to narrow down
         the problem.

.. toctree::
   :maxdepth: 1
   :hidden:

   Step 1: Build and Wire Your Robot <step-1/index>
   Step 2: Set Up Your Environment <step-2/index>
   Step 3: Configure Your Control System <step-3/index>
   Step 4: Write and Drive <step-4/index>
