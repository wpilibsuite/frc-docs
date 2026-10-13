# Step 2: Set Up Your Environment

.. container:: sw-step-badge

   .. container:: sw-step-n

      02

   .. container::

      .. container:: sw-step-info-title

         Set Up Your Environment

      .. container:: sw-step-info-sub

         Step 2 of 4

**By the end of this step:** your selected programming environment will open
successfully, and the driver software required by your program will be ready
for robot setup and testing.

.. rubric:: Before You Start

Keep the language and programming environment you selected in :doc:`Zero to Robot
<../introduction>`. Complete the setup for that environment, then set up your
program's driver software. The programming environment is where you write code;
the Driver Station is where you control the robot during a test.

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Programming Computer
      :class-card: sw-card-shared

      - The computer you plan to use for programming
      - Administrator access if you selected desktop development
      - Internet access, or offline packages downloaded in advance

   .. grid-item-card:: FRC Driver Station Computer
      :class-card: sw-card-frc

      FRC teams also need a Windows 11 computer for the competition Driver
      Station. It may be the same computer used for programming.

Choose how you'll write code. **OnBot** runs in the browser with nothing
to install; **desktop development** uses tools installed on your computer,
including WPILib VS Code or LabVIEW. These paths support FRC and FTC with Systemcore. Keep using the environment and language you selected
on the Zero to Robot page.

.. important::

   **Some 2027 instructions are still being completed.** The FRC VS Code path
   is documented end to end. Detailed Systemcore OnBot and FTC walkthroughs
   will be added as their software is finalized. If you are using a REV
   Control Hub today, use the linked current FTC documentation instead.

.. rubric:: Part 1: Set Up Your Programming Environment

.. tab-set::

   .. tab-item:: OnBot
      :sync: onbot

      OnBot runs directly in the browser, hosted on the Systemcore itself.
      There's nothing to download or install.

      **Languages:** Java, Blocks, Python, and LabVIEW.

      .. TODO: Add a screenshot of the Systemcore OnBot landing page with the programming environment choices labeled.

      .. note::

         **Systemcore-specific OnBot setup steps are still being written.**
         In the meantime, do not substitute current REV Control Hub connection addresses or
         deployment steps. See the `current FTC programming-tool guide
         <https://ftc-docs.firstinspires.org/en/latest/programming_resources/shared/choosing_program_lang/choosing-program-lang.html>`_
         when using current FTC hardware.

      .. tip::

         **FRC teams:** OnBot provides the programming environment, not the Driver
         Station. You'll still need the FRC Driver Station installed
         locally for competition. See **Set Up Driver Software** below.

   .. tab-item:: VS Code
      :sync: vscode

      The WPILib installer and VS Code setup below are the same install for
      **FRC and FTC**. Where a tool or step is program-specific (like the FRC
      Driver Station or simulation), it's labeled.

      **Languages:** Java, Blocks, C++, and Python.

      .. rubric:: System Requirements

      .. grid:: 1 1 2 2
         :gutter: 3

         .. grid-item-card:: Coding Only
            :class-card: sw-card-shared

            **FRC + FTC: macOS / Linux**
            ^^^
            - macOS 12+ or modern Linux distro
            - WPILib + VS Code for writing code
            - Can run Driver Station for testing only, cannot image Systemcore
            - Deploy code over USB or Wi-Fi (needs network access)
            - Robot simulation is currently FRC only

         .. grid-item-card:: Windows for Coding
            :class-card: sw-card-shared

            **FRC + FTC: Windows**
            ^^^
            - Windows 11
            - WPILib + VS Code for writing code
            - Robot simulation is currently FRC only

      .. rubric:: Installation Steps

      .. grid:: 1 1 3 3
         :gutter: 3

         .. grid-item-card:: WPILib Installer
            :link: wpilib-setup
            :link-type: doc
            :class-card: sw-card-shared

            **FRC + FTC**
            ^^^
            Installs Visual Studio Code, WPILib extensions, and all
            desktop tools (Glass, Elastic, OutlineViewer).
            Required for Java, C++, and Python teams.

         .. grid-item-card:: RobotPy Setup
            :link: python-setup
            :link-type: doc
            :class-card: sw-card-shared

            **FRC + FTC, Python teams only**
            ^^^
            Install RobotPy and the required Python packages.
            Java and C++ teams can skip this part.

         .. grid-item-card:: Offline Installation
            :link: offline-installation-preparations
            :link-type: doc
            :class-card: sw-card-shared

            **Optional: FRC + FTC**
            ^^^
            Preparing to install without internet access?
            Download the offline installer packages in advance.

      .. rubric:: Verify Your Installation

      Install WPILib first. Python teams should then complete RobotPy setup;
      Java and C++ teams can skip it. The offline preparation guide is only
      needed when installing without internet access.

      Confirm the installation is working:

      .. grid:: 1 1 2 2
         :gutter: 3

         .. grid-item-card:: Open VS Code
            :class-card: sw-card-shared

            **FRC + FTC**
            ^^^
            Launch the WPILib VS Code shortcut (not the system VS Code).
            You should see the WPILib icon (W) in the activity bar.

         .. grid-item-card:: Run WPILib Command
            :class-card: sw-card-shared

            **FRC + FTC**
            ^^^
            Press :kbd:`Ctrl+Shift+P` (or :kbd:`Cmd+Shift+P` on Mac)
            and type *WPILib*. You should see WPILib commands in the palette.

      .. TODO: Add a screenshot showing the WPILib activity-bar icon and WPILib commands in the VS Code command palette.

      .. tip::

         **Vendor libraries are not installed here.**
         Libraries like REVLib and Phoenix 6 are added per-project in Step 4
         using the WPILib Dependency Manager. You do not need them yet.

.. rubric:: Desktop LabVIEW

LabVIEW is also available for desktop development. Its Systemcore installation
and project-creation walkthroughs are still being completed. The VS Code
installation steps above apply to Java, Blocks, C++, and Python.

.. rubric:: Part 2: Set Up Driver Software

Your programming environment and your competition driver software are
separate choices. Set up the driver software required by your program,
regardless of whether you selected OnBot, VS Code, or desktop LabVIEW.

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: FRC Driver Station
      :link: first-driver-station-installation
      :link-type: doc
      :class-card: sw-card-frc

      **FRC only: Windows 11**
      ^^^
      Install this on the Windows laptop that will drive the robot at
      competition. The 2027 production release supports the official FMS.
      During pre-season testing, match alpha Driver Station builds with a
      compatible Systemcore release.

   .. grid-item-card:: FTC Driver Station
      :link: ../../ftc/index
      :link-type: doc
      :class-card: sw-card-ftc

      **FTC with Systemcore**
      ^^^
      Systemcore and Motioncore use FTC-specific driver software. See the
      FTC overview for Systemcore resources. Teams using a REV Control Hub or
      Expansion Hub should use the
      `FTC Docs <https://ftc-docs.firstinspires.org/en/latest/>`_.

.. warning::

   **Windows 10 is not supported by the FRC Driver Station beginning in
   2027.** Upgrade the FRC driver-station computer to Windows 11 before
   installing it.

.. rubric:: Part 3: Check That You Can Continue

- Your selected programming environment opens and its setup instructions are complete.
- For VS Code, WPILib commands appear in the command palette.
- The driver software for your program is installed and opens.

You do not need to create a project or install vendor libraries yet. Those
belong to Step 4, after the control system is configured.

.. container:: sw-success

   .. container:: sw-success-h

      ✓ Your programming environment is ready.

   Continue when your selected programming environment opens successfully. FRC teams should
   also confirm that the FRC Driver Station opens; "No Robot Communication"
   is expected until the robot is configured in Step 3.

.. container:: sw-nav

   :doc:`← Step 1: Build and Wire Your Robot <../step-1/index>`

   .. container:: sw-next

      :doc:`Step 3: Configure Your Control System → <../step-3/index>`

.. toctree::
   :maxdepth: 1
   :hidden:

   offline-installation-preparations
   first-driver-station-installation
   wpilib-setup
   python-setup
   step-2-next-steps
