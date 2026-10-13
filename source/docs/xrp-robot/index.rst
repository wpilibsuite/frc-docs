.. include:: <isonum.txt>

# Getting Started with XRP

The XRP (Experiential Robotics Platform), powered by
`Worcester Polytechnic Institute <http://wpi.edu>`_, is a small, low-cost robot
designed for learning WPILib programming without full FRC hardware.
Practice the WPILib tools and programming patterns used by FRC robots
and FTC robots running Systemcore.

.. rubric:: Why Use the XRP?

.. grid:: 1 2 2 4
   :gutter: 3

   .. grid-item-card:: Real WPILib Code
      :class-card: sw-card-shared

      **Learn**
      ^^^
      Practice Java, C++, or Python with WPILib. XRP-specific classes
      provide access to its motors, servos, and gyro.

   .. grid-item-card:: No Control System Required
      :class-card: sw-card-shared

      **Practice**
      ^^^
      No roboRIO, no PDH, no radio programming. Just the XRP,
      a USB cable for initial setup, and your laptop.

   .. grid-item-card:: Off-Season Programming
      :class-card: sw-card-shared

      **Pre-season**
      ^^^
      Learn command-based programming, encoders, PID, and odometry
      before build season starts, right on a desk.

   .. grid-item-card:: FTC Prep
      :class-card: sw-card-ftc

      **FTC with Systemcore**
      ^^^
      Systemcore teams use the same WPILib toolchain. XRP skills
      transfer directly to FTC robot programming.

.. rubric:: How It Works

.. tip::

   XRP code runs on your **laptop as a simulation**, communicating
   with the XRP hardware over Wi-Fi. Use **WPILib VS Code** to launch
   the program and the **simulation GUI** to control robot state and
   joystick inputs. The simulated robot drives real XRP motors.

.. grid:: 1 2 3 3
   :gutter: 3

   .. grid-item-card:: Create an XRP project

      Use the WPILib VS Code extension you already installed.
      XRP projects use the same project structure as FRC.

   .. grid-item-card:: Run as simulation

      Launch with **Simulate Robot Code** instead of Deploy.
      The simulation connects to the XRP over Wi-Fi.

   .. grid-item-card:: Drive with the simulation GUI

      Assign your joystick and select Teleoperated in the simulation GUI.
      See :doc:`Simulation GUI </docs/software/wpilib-tools/robot-simulation/simulation-gui>`
      for robot state and joystick controls.

.. rubric:: Hardware Specifications

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Component
     - Details
   * - **Processor**
     - RP2350 on the XRP Controller; RP2040 on the Beta controller
   * - **Wireless**
     - Wi-Fi 802.11 b/g/n (2.4 GHz) for host communication
   * - **Drive motors**
     - 2 brushed DC gear motors with integrated quadrature encoders
   * - **IMU**
     - Built-in gyro and accelerometer; component varies by board version
   * - **Servo ports**
     - Connector count varies by board version; see the hardware overview
   * - **User I/O**
     - Reflectance sensor, ultrasonic distance sensor port
   * - **Power**
     - 4 AA battery pack; USB connection for setup


See the `SparkFun hardware overview
<https://docs.sparkfun.com/SparkFun_XRP_Controller/introduction/>`_ to identify
your board, and :doc:`hardware-support` for devices supported by WPILib.

.. rubric:: XRP vs Full FRC Robot

.. list-table::
   :header-rows: 1
   :widths: 30 35 35

   * - Feature
     - XRP
     - FRC Robot
   * - WPILib API
     - Supported WPILib classes plus XRP-specific hardware classes
     - ✓ Full API
   * - Command-based
     - ✓ Yes
     - ✓ Yes
   * - Encoders
     - ✓ Integrated
     - External (per motor controller)
   * - IMU / gyro
     - ✓ Built-in
     - ✓ Built into Systemcore
   * - Robot control
     - Simulation GUI
     - Driver Station
   * - Deploy method
     - Simulate (Wi-Fi to laptop)
     - Deploy to Systemcore
   * - CAN bus
     - ✗ Not available
     - ✓ Full CAN support
   * - Vendor libraries
     - XRP vendordep provides hardware support
     - REVLib, Phoenix 6, etc.


.. rubric:: Prerequisites

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Software (all platforms)

      - :doc:`WPILib installed <../zero-to-robot/step-2/wpilib-setup>`
      - WPILib simulation GUI
      - XRP firmware flashed on the board

   .. grid-item-card:: Hardware

      - XRP robot kit (assembled)
      - USB data cable: USB-C for XRP, Micro-USB for Beta XRP
      - 4 AA batteries
      - 2.4 GHz Wi-Fi on your laptop

.. rubric:: Getting Started

.. grid:: 1 2 3 3
   :gutter: 3

   .. grid-item-card:: Set Up Hardware
      :link: hardware-and-imaging
      :link-type: doc
      :class-card: sw-card-shared

      **01**
      ^^^
      Flash XRP firmware, insert batteries, and connect to the XRP
      Wi-Fi network.

   .. grid-item-card:: Get to Know the XRP
      :link: getting-to-know-xrp
      :link-type: doc
      :class-card: sw-card-shared

      **02**
      ^^^
      Sensor locations, motor wiring, the web UI, and what each
      I/O port is for.

   .. grid-item-card:: Write and Run Code
      :link: programming-xrp
      :link-type: doc
      :class-card: sw-card-shared

      **03**
      ^^^
      Create an XRP project in WPILib VS Code, run the simulation,
      and drive your robot.

.. rubric:: Examples and Hardware Support

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: XRP Arcade Drive
      :link: programming-xrp
      :link-type: doc
      :class-card: sw-card-frc

      Basic teleop drive using a joystick. Good first project.

   .. grid-item-card:: Sensors and Encoders
      :link: hardware-support
      :link-type: doc
      :class-card: sw-card-frc

      Check supported devices and the XRP-specific classes used to access them.

.. tip::

   **WPI XRP Curriculum available.**
   `WPI XRP Curriculum <https://wp.wpi.edu/xrp/curriculum/>`_
   covers setup, programming, and hands-on activities for the XRP robot.

.. toctree::
   :maxdepth: 1
   :hidden:

   hardware-and-imaging
   getting-to-know-xrp
   hardware-support
   web-ui
   programming-xrp
