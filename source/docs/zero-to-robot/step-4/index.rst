# Step 4: Write and Drive

.. container:: sw-step-badge

   .. container:: sw-step-n

      04

   .. container::

      .. container:: sw-step-info-title

         Write and Drive

      .. container:: sw-step-info-sub

         Step 4 of 4

**By the end of this step:** a drivetrain program will run on Systemcore,
your controller will operate the drive motors, and you will have checked
that disabling the robot stops them.

Use the programming environment and language you set up in Step 2. Start with the example
for your hardware and test with the drive wheels off the floor.

.. note::

   FRC KitBot example code will be available after the 2027 kickoff.

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Control System Ready
      :class-card: sw-card-shared

      - Step 3 is complete
      - Driver Station communication is green
      - Your controller is connected to the driver computer

   .. grid-item-card:: Test Area Ready
      :class-card: sw-card-shared

      - The drivetrain is securely supported with every wheel off the floor
      - People, tools, hair, and loose clothing are clear of moving parts
      - Someone is ready to turn off robot power

.. rubric:: Part 1: Choose Your Walkthrough

The detailed FRC VS Code walkthrough covers project creation through the
first drive test. Blocks has a project-creation guide; its deployment
walkthrough and the OnBot, LabVIEW, and FTC walkthroughs are still being
completed. Use the path that matches your programming environment and hardware.

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Java, C++, or Python in VS Code
      :link: creating-test-drivetrain-program-cpp-java-python
      :link-type: doc
      :class-card: sw-card-shared

      Create a project, configure the motor controllers, and deploy using
      the full drivetrain walkthrough. C++ uses desktop development only.

   .. grid-item-card:: Blocks
      :link: create_blocks_project
      :link-type: ref
      :class-card: sw-card-shared

      Start with a drivetrain sample in the Blocks editor. Choose the sample
      for your hardware, make an editable copy, and check its configuration.
      More drivetrain examples for Blocks are coming soon.

   .. grid-item-card:: Java or Python in OnBot
      :class-card: sw-card-shared

      Open the editor hosted by Systemcore. The detailed project-creation
      and deployment walkthroughs are still being completed.

   .. grid-item-card:: LabVIEW: OnBot or Desktop
      :class-card: sw-card-shared

      Use the LabVIEW environment you selected in Step 2. The Systemcore
      project-creation and deployment walkthroughs for both environments
      are still being completed.

.. rubric:: Part 2: Create and Configure Your Project

Start with a working drivetrain example, then match it to your robot's
motor controllers and wiring.

.. tab-set::

   .. tab-item:: Java / C++

      1. Open **WPILib VS Code** and open the WPILib command palette.
         Select :guilabel:`Create a new project`.
      2. Choose :guilabel:`Example`, then :guilabel:`Next`. Select your
         language and the :guilabel:`Getting Started` project base.
      3. Choose a project folder and name, and enter the team number shown
         on Systemcore. Leave desktop support unchecked for this example,
         as described in the full walkthrough.
      4. Review the settings, select :guilabel:`Create Project`, then open
         the new project in VS Code. For C++, accept the prompt to refresh
         C++ configurations.

      **Expected result:** the project appears in the file explorer and you
      can open its Robot source file. The Getting Started example provides
      the robot program structure and drivetrain code.

   .. tab-item:: Python

      1. Create a folder for your robot project and open it in VS Code.
      2. Open a terminal in that folder. On Windows, run
         ``py -3 -m robotpy init``. On macOS or Linux, run
         ``python3 -m robotpy init``.
      3. Open the generated ``robot.py``. Use the complete Python drivetrain
         example in the :doc:`walkthrough
         <creating-test-drivetrain-program-cpp-java-python>` to fill in the
         Robot class and configure the hardware.

      **Expected result:** the folder contains ``robot.py`` and
      ``pyproject.toml``. The first contains your robot code; the second
      lists its Python dependencies.

The :doc:`full drivetrain walkthrough
<creating-test-drivetrain-program-cpp-java-python>` includes screenshots,
complete code, and motor-controller-specific configurations. Use its complete
example when adapting the project to your hardware.

For **Blocks**, follow :ref:`create_blocks_project` to make an editable copy
of a drivetrain sample. Check the sample's hardware before using it.

For **OnBot or LabVIEW**, use the environment you selected in Step 2. The
Systemcore project-creation instructions are still being completed; the
VS Code walkthrough does not describe these editors.

Before deploying any drivetrain project:

- Set the project team number to match Systemcore.
- Check each motor controller's type and port or CAN ID against the wiring.
- Check which controller axes the example uses to drive and turn.
- Add the vendor libraries required by the motor controllers in your example.

.. card:: Managing Vendor Dependencies
   :link: /docs/software/vscode-overview/3rd-party-libraries
   :link-type: doc
   :class-card: sw-card-shared

   Install and update the vendor libraries used by a VS Code project.
   Add dependencies each time you create or import a project.

.. note::

   **Using an A301 with Motioncore?** Keep its firmware and REVLib versions
   compatible, and identify the Motioncore channel with ``CANBusMap`` rather
   than a raw integer. Motioncore channel D0 is not the same bus as Systemcore
   bus 0. See the current `A301 testing guide
   <https://github.com/wpilibsuite/SystemcoreTesting/blob/main/A301.md>`_
   for the required version pair and channel examples.

.. rubric:: Understand How the Robot Drives

Open the Robot class and trace the path from controller input to motor output:

1. The program creates the motor-controller objects, a ``Gamepad`` on port 0,
   and a ``DifferentialDrive`` once when the robot starts. The motor objects
   identify the PWM ports or CAN IDs connected to your drivetrain.
2. During teleop, ``teleopPeriodic`` (``TeleopPeriodic`` in C++) reads the
   controller axes repeatedly. One input requests forward or backward motion;
   the other requests a turn.
3. ``DifferentialDrive`` combines those inputs into left and right motor
   outputs. The motor-controller objects send the outputs to the hardware.

Find the motor ports or CAN IDs in your example and compare them with the
wiring. The PWM example uses ports 0 and 1; the vendor examples use CAN IDs
1 and 2. Keep the objects outside the periodic method so they are not
recreated on every iteration.

Follow the example's motor-inversion setup so both drivetrain sides move the
robot in the same direction for a forward request. You will check that direction
with the wheels off the floor during the first drive test.

**Expected result:** you can identify the controller input, the left and right
motor assignments, and the drive call in your program before deploying it.

.. _first-drive-deploy:

.. rubric:: Part 3: Deploy and Confirm Robot Code Is Running

Keep the robot disabled and its drive wheels supported off the floor.

1. Power on Systemcore and connect the computer using the USB or robot-network
   path you checked in Step 3. Confirm Driver Station communication before
   deploying.
2. Save your program and deploy using the command for your language:

   - **Java / C++:** open the WPILib command palette in VS Code and select
     :guilabel:`Deploy Robot Code`.
   - **Python on Windows:** run ``py -3 -m robotpy deploy`` in the project folder.
   - **Python on macOS / Linux:** run ``python3 -m robotpy deploy`` in the
     project folder.

3. Watch the build and deploy output. If it reports an error, fix that error
   before continuing. A successful build alone does not confirm that the
   program reached the robot.
4. Check Driver Station for both robot communication and robot code running.
   Leave the robot disabled until you complete the checks in Part 4.

**Expected result:** deployment reports success, and Driver Station reports
communication and robot code. If code is missing, inspect the deploy output
and Driver Station log before trying to enable.

For **OnBot or LabVIEW**, deploy from your selected editor. The detailed
Systemcore deployment walkthroughs for these paths are still being completed.

.. card:: Running and Testing Your Program
   :link: running-test-program
   :link-type: doc
   :class-card: sw-card-frc

   FRC Driver Station and controller checks, followed by the first teleop test.

.. _first-drive-enable:

.. rubric:: Part 4: Test, Disable, and Check the Result

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Pre-enable checklist

      - First test: robot safely elevated with every drive wheel off the floor
      - All team members clear of moving parts
      - Driver Station shows communication and robot code running
      - Joystick connected and recognized in DS
      - Driver Station reports a plausible robot battery voltage

   .. grid-item-card:: FRC enable steps

      - Open FRC Driver Station
      - Select **TeleOperated** mode
      - Announce that the robot is about to enable, then click **Enable**
      - Apply a small forward input, then release it
      - Confirm both sides turn in the expected direction and stop on release
      - Apply a small turn input, then release it
      - Click **Disable** or press :kbd:`Enter` before approaching the robot

   .. grid-item-card:: FTC with Systemcore
      :link: /docs/ftc/index
      :link-type: doc
      :class-card: sw-card-ftc

      The detailed Systemcore driver-software and first-drive walkthroughs
      are still being completed. Check the FTC overview for available
      instructions before proceeding with a powered test.

.. TODO: Add a screenshot showing the controller recognized and the robot ready
   to enable in Driver Station.

.. warning::

   **FRC Driver Station:** the :kbd:`Space` bar triggers **Emergency Stop**;
   it is not the ordinary disable shortcut. An emergency-stopped robot must be
   rebooted before it can be enabled again.

.. tip::

   **Something not working?** See :doc:`Troubleshooting </docs/software/support/troubleshooting>`.

.. rubric:: Check That You Can Continue

For the FRC drive test, confirm each result before putting the robot on the
floor:

- The expected controller input operates the expected motor or drivetrain side.
- Forward and turn directions match the example's intended controls.
- Releasing the controls stops the drive motors.
- Disabling the robot stops the drive motors.

If any check fails, disable the robot before changing its code or wiring.
Use the drivetrain walkthrough and troubleshooting guide to resolve the
problem, then repeat the test with the wheels off the floor.

.. container:: sw-success

   .. container:: sw-success-h

      ✓ First drive test complete.

   Use the
   :doc:`Command-Based framework <../../software/commandbased/index>`
   to organize code for more mechanisms,
   :doc:`path planning <../../software/pathplanning/index>`
   for autonomous, and
   :doc:`simulation <../../software/wpilib-tools/robot-simulation/index>`
   to test code without hardware.

.. container:: sw-nav

   :doc:`← Step 3: Configure Your Control System <../step-3/index>`

.. toctree::
   :maxdepth: 1
   :hidden:

   creating-test-drivetrain-program-cpp-java-python
   running-test-program
