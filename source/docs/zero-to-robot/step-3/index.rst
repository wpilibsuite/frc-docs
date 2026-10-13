# Step 3: Configure Your Control System

.. container:: sw-step-badge

   .. container:: sw-step-n

      03

   .. container::

      .. container:: sw-step-info-title

         Configure Your Control System

      .. container:: sw-step-info-sub

         Step 3 of 4

Install the current season image on Systemcore, set the team number, and
check the connection between your computer and robot.

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Robot Ready
      :class-card: sw-card-shared

      - Step 1 is complete and Systemcore powers on normally
      - Your computer opens ``robot.local`` over Systemcore Wi-Fi or USB

   .. grid-item-card:: Computer and Team Ready
      :class-card: sw-card-shared

      - Step 2 is complete and your program's driver software opens
      - You know your team number
      - FRC teams have an Ethernet cable available for the radio

Work through this step in order: update Systemcore, set the team number,
configure the network for your program, then check Driver Station
communication. Keep the robot disabled throughout configuration.

.. warning::

   **Re-configure every season.**
   The Systemcore image is season-specific. A robot that worked last year will
   not accept code deploys until the Systemcore is updated with the current
   year's image.

.. rubric:: Part 1: Image the Systemcore

Follow the imaging guide to select the update for your hardware revision and
installed OS version. It covers routine web updates and recovery for units
that cannot boot normally.

.. card:: Update and configure Systemcore
   :link: imaging-your-systemcore
   :link-type: doc
   :class-card: sw-card-shared

   Select the correct image, install it, and set your team number.

Before continuing:

- Reopen ``robot.local`` after the update and confirm the installed OS version.
- Confirm the Systemcore display shows your team number.
- Enter the same team number in your Driver Station settings.

.. important::

   Routine ``.llupdate`` files and recovery images are not interchangeable.
   Use the imaging guide to choose the procedure for your unit.

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Using a roboRIO?
      :link: https://docs.wpilib.org/en/stable/index.html
      :link-type: url
      :class-card: sw-card-frc

      **FRC Legacy**
      ^^^
      Teams still running a roboRIO should refer to the
      2026 WPILib docs for imaging instructions.

   .. grid-item-card:: FTC Legacy (REV)?
      :link: https://ftc-docs.firstinspires.org/en/latest/hardware_and_software_configuration/configuring/index.html
      :link-type: url
      :class-card: sw-card-ftc

      **FTC Legacy**
      ^^^
      Teams on REV Control Hub / Expansion Hub should refer to the
      official FTC hardware configuration guide instead. This page
      covers Systemcore only.

.. rubric:: Part 2: Configure the Radio

The steps below cover the external FRC radio. FTC uses the radio built into
Systemcore.
Systemcore-specific radio configuration steps for FTC are still being
written; see :doc:`Step 1: Confirm It's Alive <../step-1/index>` in the
meantime for the built-in connection details.

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Configure a Vivid VH-109
      :link: radio-programming
      :link-type: doc
      :class-card: sw-card-frc

      Follow the radio guide to select the firmware, enter your team number,
      and set up the network you will use for testing.

   .. grid-item-card:: OpenMesh Reference
      :link: openmesh
      :link-type: doc
      :class-card: sw-card-frc

      Legacy hardware specifications, indicator lights, and troubleshooting.
      Check the guide's hardware and season coverage before using it.

For an FRC radio setup, confirm that the radio's team number matches
Systemcore and the Driver Station. Connect the driver computer using the
setup you selected in the radio guide before checking communication.

.. rubric:: Part 3: Verify Configuration

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Systemcore
      :class-card: sw-card-shared

      - Web interface and display show the expected OS version
      - Display and Driver Station show the same team number
      - Power LED is solid green and Status LED is off

   .. grid-item-card:: Network and Driver Station
      :class-card: sw-card-shared

      - For FRC wireless testing, the radio powers on and its network is available
      - Laptop connects through the intended USB or radio path
      - Driver Station shows robot communication in green

.. TODO: Add a screenshot of the Driver Station with the communication
   indicator highlighted in green.

The robot-code indicator may remain off until the first program is deployed in
Step 4. That does not mean Step 3 failed.

.. container:: sw-success

   .. container:: sw-success-h

      ✓ Your control system is configured.

   Continue when the team numbers match, the computer uses your intended
   connection, and the Driver Station communication indicator is green. The robot-code
   indicator can remain off until you deploy in Step 4.

.. container:: sw-nav

   :doc:`← Step 2: Set Up Your Environment <../step-2/index>`

   .. container:: sw-next

      :doc:`Step 4: Write and Drive → <../step-4/index>`

.. toctree::
   :maxdepth: 1
   :hidden:

   imaging-your-systemcore
   radio-programming
   openmesh
