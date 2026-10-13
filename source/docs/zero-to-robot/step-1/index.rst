# Step 1: Build and Wire Your Robot

.. container:: sw-step-badge

   .. container:: sw-step-n

      01

   .. container::

      .. container:: sw-step-info-title

         Build and Wire Your Robot

      .. container:: sw-step-info-sub

         Step 1 of 4

**By the end of this step:** your drivetrain and control system will be
assembled, Systemcore will power on, and its web interface will open from your
computer.

Before starting, turn robot power **Off** and disconnect the battery. For FRC,
switch the main breaker off; for FTC, use the robot's power switch. Keep the
drivetrain safely supported so the wheels cannot move the robot during later
testing.

.. rubric:: Before You Start

Use this order to work through the step:

1. Assemble the chassis and drivetrain using the guide for your robot.
2. Connect Systemcore power using the instructions on this page.
3. Open the Systemcore web interface to check power and communication.
4. Turn power off again, then finish wiring the motor controllers and radio.

Already assembled and wired? Check the Systemcore power connection and complete
**Part 3: Confirm It's Alive** before moving to software setup.

.. rubric:: What You Need for This Step

- Systemcore and a robot battery
- Compatible power distribution hardware
- The provided MicroFit Pwr/Bridge cable when using Motioncore
- The provided MicroFit-to-XT30 cable when not using Motioncore
- A matching XT30 extension if bare-wire power is required
- A computer with Wi-Fi or a data-capable USB cable

These instructions cover Systemcore hardware with the **MicroFit Pwr/Bridge**
power connector.

.. note::

   For earlier Alpha hardware, use the
   `Systemcore testing guide <https://github.com/wpilibsuite/SystemcoreTesting#powering-on>`_.

.. rubric:: Part 1: Assemble Your Robot

Use the assembly and wiring resources for your program to prepare the
chassis, drivetrain, and power distribution. The FRC references remain on
this site; `FTC Docs <https://ftc-docs.firstinspires.org/en/latest/>`_ provides
FTC-specific resources. Check the hardware covered by each guide before
following it. Parts 2 and 3 below cover the shared Systemcore connection.

.. grid:: 1
   :gutter: 3

   .. grid-item-card:: Kitbot / Starter Bot Assembly
      :link: kitbot-starterbot-assembly
      :link-type: doc
      :class-card: sw-card-shared

      **FRC + FTC**
      ^^^
      Step-by-step guide to assembling the FRC Kit of Parts chassis or
      an FTC starter bot into a drive-ready robot.

.. note::

   FRC KitBot code will be available after the 2027 kickoff in
   :doc:`Step 4: Write and Drive <../step-4/index>`.

.. rubric:: Part 2: Wire Your Systemcore

Power Systemcore through the **MicroFit Pwr/Bridge** port. Choose the
connection that matches your control system:

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: With Motioncore
      :class-card: sw-card-shared

      Connect Systemcore's **Pwr/Bridge** port to Motioncore's **Bridge** port
      using a provided MicroFit cable.

   .. grid-item-card:: Without Motioncore
      :class-card: sw-card-shared

      Use the included **MicroFit-to-XT30** cable. If your power distribution
      hardware requires bare wires, use an XT30 extension cable with one end
      removed.

.. TODO: Add a close-up photo showing the Systemcore Pwr/Bridge connector and
   correct MicroFit cable orientation.

Use the provided cables whenever possible. If your team must build a cable,
follow the `Systemcore and Motioncore cable specifications
<https://downloads.limelightvision.io/documents/systemcore_motioncore_cable_specifications.pdf>`_
for its pinout, wire, and connector requirements.

Before connecting the battery, inspect every power connection:

- Red wire goes to positive and black wire goes to negative.
- No bare copper is visible outside a connector.
- Each connector is fully seated and cannot be pulled out gently.
- The Systemcore is connected by exactly one of the power methods above.

.. warning::

   Never power the Systemcore through a regulator (such as a VRM). It
   needs battery voltage directly, and some regulators can't supply
   enough current under full load.

.. important::

   The USB-C **LINK** port carries data only and does not power the
   Systemcore. Connect robot power through Pwr/Bridge before checking the
   USB connection.

.. rubric:: Part 3: Confirm It's Alive

Once powered, the Systemcore hosts its own network so you can connect
to it directly, before any radio or field network is involved.

.. list-table::
   :header-rows: 1

   * - Connection
     - Default value
   * - Built-in Wi-Fi SSID
     - ``SYSTEMCORE``
   * - Built-in Wi-Fi password
     - ``PASSWORD``
   * - Wi-Fi access point IP
     - ``172.30.0.1``
   * - USB (Windows)
     - ``172.26.0.1``
   * - USB (macOS / Linux)
     - ``172.27.0.1``

.. note::

   Units on OS image 9 or earlier use ``172.28.0.1`` (USB, Windows) or
   ``172.29.0.1`` (USB, macOS/Linux) instead.

1. Connect the battery and turn robot power **On**.
2. Confirm that Systemcore powers on and check the onboard display for
   hardware faults before continuing.
3. Connect the computer to the ``SYSTEMCORE`` Wi-Fi network using password
   ``PASSWORD``, or connect it to the USB-C LINK port with a data-capable
   cable.
4. Open ``http://robot.local`` in a browser. If that name does not resolve,
   use the appropriate IP address from the table.
5. Confirm that the Systemcore web interface loads and identifies the unit.
   The onboard display also shows connection information such as IP addresses.

.. TODO: Add a paired image of the successful robot.local page and the matching
   Systemcore onboard display.

If the web interface loads, the Systemcore has power, has booted, and can
communicate with the computer. It does not yet mean that the radio, motor
controllers, or drivetrain are configured.

.. warning::

   If the Systemcore does not boot, a connector becomes hot, a breaker trips,
   or you see or smell smoke, turn robot power off and disconnect the
   battery immediately. Recheck polarity, exposed conductors, and shorts before
   applying power again.

.. rubric:: Part 4: Wire the Rest of the Control System

Motor controllers, radio, CAN bus, and pneumatics wiring still follow
the reference guides below.

Turn robot power **Off** and disconnect the battery again before making any of
these connections.

.. admonition:: Wiring Guide Compatibility

   Use **Part 2 on this page** for the current 2027 instructions for powering
   and connecting Systemcore.

   The FRC walkthrough and reference still show roboRIO-era hardware. Their
   guidance remains useful for the PDH or PDP, main breaker, motor controllers,
   CAN bus, radio, and pneumatics. Do not follow their roboRIO power or data
   connections when building a Systemcore robot.

   The FTC Systemcore and Motioncore walkthrough and reference are still
   being developed. Teams using the REV Control Hub or Expansion Hub should
   follow the
   `current FTC Robot Wiring Guide
   <https://ftc-docs.firstinspires.org/en/latest/robot_building/wiring_guide/wiring-guide.html>`_.

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item::

      .. rubric:: FRC
         :class: wl-frc-text

   .. grid-item::

      .. rubric:: FTC
         :class: wl-ftc-text

   .. grid-item-card:: FRC Robot Wiring Walkthrough
      :link: basic-robot-wiring
      :link-type: doc
      :class-card: sw-card-frc

      **FRC**
      ^^^
      **Wiring your first robot?**

      Complete, start-to-finish instructions for wiring a basic
      drivetrain robot. Start here and follow the steps in order.

   .. grid-item-card:: FTC Robot Wiring Walkthrough
      :link: ../../ftc/basic-ftc-robot-wiring
      :link-type: doc
      :class-card: sw-card-ftc

      **FTC with Systemcore**
      ^^^
      **Wiring your first robot?**

      Complete, start-to-finish instructions for wiring a basic
      Systemcore and Motioncore drivetrain robot. Start here and
      follow the steps in order.

   .. grid-item-card:: FRC Robot Wiring Reference
      :link: intro-to-frc-robot-wiring
      :link-type: doc
      :class-card: sw-card-frc

      **FRC**
      ^^^
      **Looking up a connection?**

      Connection diagrams and component details to look up while
      wiring or troubleshooting an FRC control system.

   .. grid-item-card:: FTC Robot Wiring Reference
      :link: ../../ftc/ftc-robot-wiring-overview
      :link-type: doc
      :class-card: sw-card-ftc

      **FTC with Systemcore**
      ^^^
      **Looking up a connection?**

      Connection diagrams and component details to look up while
      wiring or troubleshooting an FTC control system.

.. tip::

   **Not sure which power distribution unit you have?**
   The hardware overview compares the **REV Power Distribution Hub (PDH)**,
   **CTRE Power Distribution Panel (PDP)**, **CTRE PDP 2.0**, and
   **AndyMark AMPD**. Find your unit in the **FRC → Power Distribution**
   section of the :doc:`hardware overview
   </docs/hardware/hardware-basics/hardware-overview>`, then follow its
   manufacturer's wiring instructions.

.. container:: sw-success

   .. container:: sw-success-h

      ✓ Your robot is assembled, powered, and ready for software setup.

   Continue when every power connection passes inspection, Systemcore has
   booted normally, and ``robot.local`` opens from the computer. The radio,
   motor controllers, and drivetrain do not need to be configured yet.

.. container:: sw-nav

   :doc:`← Zero to Robot <../introduction>`

   .. container:: sw-next

      :doc:`Step 2: Set Up Your Environment → <../step-2/index>`

.. toctree::
   :maxdepth: 1
   :hidden:

   Kitbot / Starter Bot Assembly <kitbot-starterbot-assembly>
   FRC Robot Wiring Walkthrough <basic-robot-wiring>
   FTC Robot Wiring Walkthrough </docs/ftc/basic-ftc-robot-wiring>
   FRC Robot Wiring Reference <intro-to-frc-robot-wiring>
   FTC Robot Wiring Reference </docs/ftc/ftc-robot-wiring-overview>
