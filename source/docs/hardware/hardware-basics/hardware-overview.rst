.. include:: <isonum.txt>

# Control System Hardware Overview

This page introduces the hardware interfaces used by WPILib: Systemcore,
motor controllers, sensors, and their connections to robot software.

For chassis assembly and program-specific wiring, use the
:doc:`FRC wiring reference </docs/zero-to-robot/step-1/intro-to-frc-robot-wiring>`,
:doc:`kitbot and starter-bot resources </docs/zero-to-robot/step-1/kitbot-starterbot-assembly>`,
or `FTC Docs <https://ftc-docs.firstinspires.org/en/latest/>`_. The FRC guides
are currently hosted on this site. Check each guide's hardware scope before
following its wiring diagrams.

.. tab-set::

   .. tab-item:: Shared
      :sync: shared

      .. rubric:: Main Controller

      .. card:: Systemcore
         :class-card: sw-card-shared

         **FRC 2027+ / FTC 2027-2028+**
         ^^^
         The primary robot controller for FRC (2027+) and FTC (2027-2028+).
         Runs robot code in Java, C++, or Python. Supports CAN, PWM, DIO,
         and analog I/O. Connects over Ethernet or USB for deployment and
         supports the full WPILib simulation framework.

      .. list-table::
         :header-rows: 1
         :widths: 30 70

         * - Spec
           - Systemcore
         * - Languages
           - Java, C++, Python
         * - CAN bus
           - Yes
         * - PWM outputs
           - Yes
         * - DIO
           - Yes
         * - Analog inputs
           - Yes
         * - Connectivity
           - Ethernet, USB
         * - Deploy method
           - USB or Wi-Fi via VS Code / OnBot
         * - Simulation
           - Full desktop simulation support
         * - Programs
           - FRC (2027+) and FTC via Motioncore (2027-2028+)

      .. rubric:: Practice Today

      .. grid:: 1
         :gutter: 3

         .. grid-item-card:: Practice with the XRP
            :link: ../../xrp-robot/index
            :link-type: doc
            :class-card: sw-card-shared

            **Available Now**
            ^^^
            Learn WPILib programming on the XRP desktop robot; the
            same code runs on Systemcore once your hardware arrives.

   .. tab-item:: FRC
      :sync: frc

      .. rubric:: Power Distribution

      Power distribution connects the robot battery to motor controllers and
      other electrical devices through individually protected circuits.
      The options below differ in their output connections, current monitoring,
      and software-controlled switching.

      .. list-table::
         :header-rows: 1
         :widths: 24 19 19 19 19

         * - Feature
           - `PDH (REV) <https://www.revrobotics.com/rev-11-1850/>`_
           - `PDP (CTRE) <https://store.ctr-electronics.com/products/power-distribution-panel>`_
           - `PDP 2.0 (CTRE) <https://store.ctr-electronics.com/products/pdp-2>`_
           - `AMPD (AndyMark) <https://andymark.com/products/ampd-andymark-power-distribution>`_
         * - High-current ports
           - 20 (40 A each)
           - 16 (40 A each)
           - 24 (40 A capable)
           - 24 (40 A continuous each)
         * - Low-current ports
           - 3 (20 A each)
           - 8 (20 A each)
           - No dedicated low-current ports
           - No dedicated low-current ports
         * - Main breaker slot
           - Yes (120 A SB)
           - Yes (120 A SB)
           - No (external breaker)
           - No (external breaker)
         * - CAN monitoring
           - Yes (per channel)
           - Yes (aggregate)
           - No (monitor through motor controllers)
           - Not listed by manufacturer
         * - Switchable outputs
           - Yes (software)
           - No
           - No
           - Not listed by manufacturer

      .. rubric:: Robot Radio

      .. grid:: 1 1 2 2
         :gutter: 3

         .. grid-item-card:: Vivid VH109
            :link: /docs/zero-to-robot/step-3/radio-programming
            :link-type: doc
            :class-card: sw-card-frc

            **FRC Standard**
            ^^^
            The standard FRC robot radio. Must be programmed annually with the
            current configuration process to set team number, SSID, and
            firmware. Designed to run directly from robot battery voltage
            through its 12 VDC Weidmuller input; a VRM is not required.

         .. grid-item-card:: OpenMesh OM5P-AC
            :link: /docs/zero-to-robot/step-3/openmesh
            :link-type: doc
            :class-card: sw-card-frc

            **FRC Legacy / Regional Use**
            ^^^
            Legacy radio retained for teams and regions that still use it.
            Requires regulated 12 V / 2 A power and the legacy FRC Radio
            Configuration Utility. Do not select it for a new VH-109 build.

      .. rubric:: Motor Controllers

      .. list-table::
         :header-rows: 1
         :widths: 25 15 20 40

         * - Controller
           - Vendor
           - Interface
           - Notes
         * - `Koors40 <https://andymark.com/products/koors40-brushed-dc-motor-controller>`_
           - AndyMark
           - PWM
           - Brushed motors only.
         * - `SPARK Flex <https://docs.revrobotics.com/brushless/spark-flex/overview>`_
           - REV
           - CAN or PWM
           - Brushed and brushless motors. Docks directly with NEO Vortex.
         * - `SPARK <https://docs.revrobotics.com/brushless/legacy/og-spark>`_
           - REV
           - PWM
           - Brushed motors only.
         * - `SPARK MAX <https://docs.revrobotics.com/brushless/spark-max/overview>`_
           - REV
           - CAN or PWM
           - Brushed and brushless motors, including NEO and NEO 550.
         * - `Talon FX <https://v6.docs.ctr-electronics.com/en/stable/docs/hardware-reference/talonfx/index.html>`_
           - CTRE
           - CAN
           - Controls its integral Falcon 500, Kraken X60, or Kraken X44 motor only.
         * - `Talon FXS <https://v6.docs.ctr-electronics.com/en/stable/docs/hardware-reference/talonfxs/index.html>`_
           - CTRE
           - CAN or PWM
           - Brushed motors and supported brushless motors, including Minion and NEO.
         * - `Talon / Talon SR <https://files.andymark.com/Talon_User_Manual_1_3.pdf>`_
           - CTRE
           - PWM
           - Brushed motors only.
         * - `Talon SRX <https://v5.docs.ctr-electronics.com/en/stable/ch13_MC.html>`_
           - CTRE
           - CAN or PWM
           - Brushed motors; supports external sensors for closed-loop control.
         * - `Thrifty Nova <https://www.thethriftybot.com/products/thrifty-nova>`_
           - The Thrifty Bot
           - CAN
           - Sensored brushless motors, including NEO and NEO 550.
         * - `Venom <https://www.playingwithfusion.com/files/bdc10001_frc_usermanual_r03.pdf>`_
           - Playing With Fusion
           - CAN or PWM
           - Controls its integral motor only.
         * - `Victor SP <https://web.archive.org/web/20220926211100/https://store.ctr-electronics.com/content/user-manual/Victor-SP-Quick-Start-Guide.pdf>`_
           - CTRE
           - PWM
           - Brushed motors only.
         * - `Victor SPX <https://ctre.download/files/user-manual/Victor%20SPX%20User's%20Guide.pdf>`_
           - CTRE
           - CAN or PWM
           - Brushed motors only.

      .. dropdown:: Motor Controller Part Numbers

         - **Koors40:** am-5600
         - **SPARK Flex:** REV-11-2159, am-5276
         - **SPARK:** REV-11-1200, am-4260
         - **SPARK MAX:** REV-11-2158, am-4261
         - **Talon FX:** 217-6515, 19-708850, am-6515, am-6515_Short,
           WCP-0940, WCP-0941
         - **Talon FXS:** 24-708883, WCP-1692
         - **Talon / Talon SR:** CTRE_Talon, CTRE_Talon_SR, am-2195
         - **Talon SRX:** 217-8080, am-2854, 14-838288
         - **Thrifty Nova:** TTB-0100
         - **Venom:** BDC-10001
         - **Victor SP:** 217-9090, am-2855, 14-868380
         - **Victor SPX:** 217-9191, 17-868388, am-3748

      .. grid:: 1 1 2 2
         :gutter: 3

         .. grid-item-card:: CAN bus

            Two-wire daisy-chain. Enables telemetry (current, temperature,
            velocity), firmware updates over the wire, and advanced
            closed-loop control on the controller itself. Requires correct
            termination at both ends of the chain.

         .. grid-item-card:: PWM

            Three-wire (signal, +5 V, GND) from Systemcore PWM port.
            No telemetry. Easier to debug. Can be used when CAN is not supported.

      .. rubric:: Pneumatics

      .. list-table::
         :header-rows: 1
         :widths: 24 14 22 18 22

         * - Module
           - Vendor
           - Solenoid channels
           - Pressure switch
           - Notes
         * - **Pneumatic Hub (PH)**
           - REV
           - 16 (CAN)
           - Analog + digital
           - Preferred for new builds. Analog pressure sensing.
         * - **PCM**
           - CTRE
           - 8 (CAN)
           - Digital only
           - Older module, still legal.

      .. rubric:: Common Sensors

      .. list-table::
         :header-rows: 1
         :widths: 34 24 42

         * - Sensor
           - Interface
           - Use case
         * - **Quadrature encoder**
           - DIO (2 channels)
           - Wheel distance and velocity
         * - **NavX / Pigeon 2 IMU**
           - SPI / CAN
           - Heading, gyro, accelerometer
         * - **Limit switch**
           - DIO
           - Hard stop detection
         * - **Ultrasonic (ping-echo)**
           - DIO (2 channels)
           - Distance measurement
         * - **AprilTag camera**
           - USB / Ethernet
           - Field localization and pose estimation
         * - **Color sensor (REV)**
           - I2C
           - Game piece detection

      .. rubric:: Other Components

      .. grid:: 1 1 2 2
         :gutter: 3

         .. grid-item-card:: Driver Station Laptop
            :class-card: sw-card-frc

            **FRC**
            ^^^
            Windows 11 required (2027+). Runs the FRC Driver Station
            software to communicate with and enable the robot.
            Connected to robot radio over Wi-Fi at competition.

         .. grid-item-card:: Voltage Regulator Module (VRM)
            :class-card: sw-card-frc

            **FRC**
            ^^^
            Provides regulated 12 V / 2 A and 5 V accessory power. Still used
            by legacy OpenMesh radio installations and other accessories, but
            is not required to power a VH-109.

      .. rubric:: What's Next

      .. grid:: 1 1 2 3
         :gutter: 3

         .. grid-item-card:: Wiring Guide
            :link: ../../zero-to-robot/step-1/intro-to-frc-robot-wiring
            :link-type: doc
            :class-card: sw-card-frc

            Step-by-step control system wiring with diagrams.

         .. grid-item-card:: Image the Systemcore
            :link: ../../zero-to-robot/step-3/imaging-your-systemcore
            :link-type: doc
            :class-card: sw-card-frc

            Required every season before deploying code.

         .. grid-item-card:: Status Light Reference
            :link: status-lights-ref
            :link-type: doc
            :class-card: sw-card-frc

            Decode LED patterns on the Systemcore, radio, and motor
            controllers.

   .. tab-item:: FTC
      :sync: ftc

      Full WPILib hardware documentation for FTC arrives with the
      **Systemcore** and **Motioncore** controllers, ahead of the
      2027-2028 season.

      .. note::

         The legacy **REV Control Hub / Expansion Hub** control system is
         also an option for FTC teams and uses the FTC SDK. For hardware,
         wiring, setup, and programming guidance, use
         `FTC Docs <https://ftc-docs.firstinspires.org/en/latest/>`_, starting
         with the `Robot Controller Overview
         <https://ftc-docs.firstinspires.org/en/latest/control_hard_compon/rc_components/index.html>`_.

      .. rubric:: Motor Controller Hub

      .. grid:: 1
         :gutter: 3

         .. grid-item-card:: Motioncore
            :class-card: sw-card-ftc

            **Coming 2027-2028**
            ^^^
            Motor and servo controller hub for FTC robots. Works alongside
            Systemcore (see the Shared tab) to drive mechanisms.

      .. grid:: 1 1 3 3
         :gutter: 3

         .. grid-item-card:: FTC with WPILib
            :link: ../../ftc/index
            :link-type: doc
            :class-card: sw-card-ftc

            **Full FTC Overview**
            ^^^
            Program status, supported languages, and what's available
            today for FTC teams.

         .. grid-item-card:: Starter Bot Resources
            :link: https://ftc-resources.firstinspires.org/ftc/team
            :link-type: url
            :class-card: sw-card-ftc

            **FIRST Tech Challenge**
            ^^^
            Kit hardware, build guides, and assembly instructions from
            the official FTC team resources site.

         .. grid-item-card:: Control System Troubleshooting
            :link: https://ftc-docs.firstinspires.org/en/latest/control_system_troubleshooting/index.html
            :link-type: url
            :class-card: sw-card-ftc

            **FIRST Tech Challenge**
            ^^^
            Official diagnostics guide for the FTC control system,
            including REV Control Hub and Driver Hub issues.
