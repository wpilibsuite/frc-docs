.. FIRST Robotics Competition documentation master file, created by
   sphinx-quickstart on Fri Apr  5 23:28:43 2019.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

.. include:: <isonum.txt>

.. meta::
   :google-site-verification: POR_nG8b56eXGxmUIutST7jcA_Vl58ypSdJTzJ1g0zg

FIRST Robotics Competition Control System
=========================================

Welcome to the *FIRST*\ |reg| Robotics Competition Control System Documentation! This site contains everything you need to know for programming a competition robot!

Community translations can be found in a variety of languages in the bottom-left menu.

.. panels::
   :column: col-sm-6 d-flex pb-3
   :footer: bg-white border-0

   ---
   :header: bg-success font-weight-bold text-white

   Returning Teams

   ^^^

   If you are a returning team, please check out the overview of changes from 2021 to 2022 and the known issues.

   +++

   .. div:: container-fluid p-0

      .. div:: row

         .. div:: col-sm pl-1 pr-1

            .. link-button:: /docs/yearly-overview/yearly-changelog
               :type: ref
               :text: Changelog
               :classes: btn-outline-primary btn-block

      .. div:: row

         .. div:: col-sm pl-1 pr-1 pt-1

            .. link-button:: /docs/yearly-overview/known-issues
               :type: ref
               :text: Known Issues
               :classes: btn-outline-primary btn-block

   ---
   :header: bg-info font-weight-bold text-white

   New Teams

   ^^^

   The Zero-to-Robot tutorial will guide you through preparation, wiring and programming a basic robot!

   +++

   .. link-button:: /docs/zero-to-robot/introduction
      :type: ref
      :text: Go to Zero-to-Robot
      :classes: btn-outline-primary btn-block

.. panels::
   :column: col-sm-6 d-flex pb-3
   :footer: bg-white border-0

   ---
   :header: bg-info font-weight-bold text-white

   Hardware Overview

   ^^^

   An overview of the hardware components available to teams.

   +++

   .. link-button:: /docs/controls-overviews/control-system-hardware
      :type: ref
      :text: Go to Hardware Overview
      :classes: btn-outline-primary btn-block

   ---
   :header: bg-info font-weight-bold text-white

   Software Overview

   ^^^

   An overview of the software components and tools available to teams.

   +++

   .. link-button:: /docs/controls-overviews/control-system-software
      :type: ref
      :text: Go to Software Overview
      :classes: btn-outline-primary btn-block

.. panels::
   :column: col-sm-4 d-flex pb-3
   :footer: border-0 bg-white

   ---

   Programming Basics

   ^^^

   Documentation that is useful throughout a team's programming process.

   +++

   .. link-button:: stubs/programming-basics-stub
      :type: ref
      :text: View articles
      :classes: btn-outline-primary btn-block mt-auto

   ---

   Advanced Programming

   ^^^

   Documentation that is suited toward veteran teams. This includes content such as Path Planning and Kinematics.

   +++

   .. link-button:: stubs/advanced-programming-stub
      :type: ref
      :text: View articles
      :classes: btn-outline-primary btn-block

   ---

   Hardware

   ^^^

   Hardware tutorials and content available for teams.

   +++

   .. link-button:: stubs/hardware-stub
      :type: ref
      :text: View articles
      :classes: btn-outline-primary btn-block

   ---

   Romi Robot

   ^^^

   The Romi Robot is a low-cost Raspberry Pi based platform for practicing WPILib programming.

   +++

   .. link-button:: docs/romi-robot/index
      :type: ref
      :text: View articles
      :classes: btn-outline-primary btn-block

   ---

   API Documentation

   ^^^

   Java and C++ class documentation.

   +++

   .. div:: container-fluid p-0

      .. div:: row

         .. div:: col-sm pl-1 pr-1

            .. link-button:: https://first.wpi.edu/wpilib/allwpilib/docs/development/java/index.html
               :type: url
               :text: Java
               :classes: btn-outline-primary btn-block

         .. div:: col-sm pl-1 pr-1

            .. link-button:: https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/index.html
               :type: url
               :text: C++
               :classes: btn-outline-primary btn-block

   ---

   Software Tools

   ^^^

   Essential tooling such as FRC Driver Station, Dashboards, roboRIO Imaging Tool and more.

   +++

   .. link-button:: stubs/software-tools-stub
      :type: ref
      :text: View articles
      :classes: btn-outline-primary btn-block

   ---

   Example Projects

   ^^^

   This section showcases the available example projects that teams can reference in VS Code.

   +++

   .. link-button:: docs/software/examples-tutorials/wpilib-examples
      :type: ref
      :text: View articles
      :classes: btn-outline-primary btn-block

   ---

   Status Light Quick Reference

   ^^^

   Quick reference guide for the status lights on a variety of FRC hardware.

   +++

   .. link-button:: docs/hardware/hardware-basics/status-lights-ref
      :type: ref
      :text: View article
      :classes: btn-outline-primary btn-block

   ---

   3rd Party Libraries

   ^^^

   Tutorial on adding 3rd party libraries such as CTRE and REV to your robot project.

   +++

   .. link-button:: docs/software/vscode-overview/3rd-party-libraries
      :type: ref
      :text: View article
      :classes: btn-outline-primary btn-block

.. toctree::
   :maxdepth: 1
   :titlesonly:
   :caption: FRC Beta Test

   docs/beta/beta-getting-started/index
   docs/beta/tasks/index

.. toctree::
   :maxdepth: 1
   :titlesonly:
   :caption: Zero to Robot
   :hidden:

   docs/zero-to-robot/introduction
   docs/zero-to-robot/step-1/index
   docs/zero-to-robot/step-2/index
   docs/zero-to-robot/step-3/index
   docs/zero-to-robot/step-4/index

.. toctree::
   :maxdepth: 1
   :caption: Control System Overviews
   :hidden:

   docs/controls-overviews/control-system-hardware
   docs/controls-overviews/control-system-software

.. toctree::
   :maxdepth: 1
   :caption: Programming Basics
   :hidden:

   docs/software/what-is-wpilib
   docs/yearly-overview/index
   docs/software/vscode-overview/index
   docs/software/dashboards/index
   docs/software/telemetry/index
   docs/software/labview/index
   docs/software/hardware-apis/index
   docs/software/can-devices/index
   docs/software/basic-programming/index
   docs/software/support/support-resources
   docs/software/frc-glossary

.. toctree::
   :maxdepth: 1
   :caption: API Docs
   :hidden:

   WPILib Java API Docs <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/index.html>
   WPILib C++ API Docs <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/index.html>

.. toctree::
   :maxdepth: 1
   :caption: Software Tools
   :hidden:

   docs/software/driverstation/index
   docs/software/wpilib-tools/robotbuilder/index
   docs/software/wpilib-tools/robot-simulation/index
   docs/software/wpilib-tools/outlineviewer/index
   docs/software/wpilib-tools/axon/index

.. toctree::
   :maxdepth: 1
   :caption: Advanced Programming
   :hidden:

   docs/software/vision-processing/index
   docs/software/commandbased/index
   docs/software/kinematics-and-odometry/index
   docs/software/networktables/index
   docs/software/pathplanning/index
   docs/software/roborio-info/index
   docs/software/advanced-gradlerio/index
   docs/software/advanced-controls/index
   docs/software/convenience-features/index

.. toctree::
   :maxdepth: 1
   :caption: Examples and Tutorials
   :hidden:

   docs/software/examples-tutorials/wpilib-examples
   docs/software/examples-tutorials/third-party-examples

.. toctree::
   :maxdepth: 1
   :caption: Hardware
   :hidden:

   docs/hardware/hardware-basics/index
   docs/hardware/hardware-tutorials/index
   docs/hardware/sensors/index

.. toctree::
   :maxdepth: 1
   :caption: Romi Robot
   :hidden:

   docs/romi-robot/index

.. toctree::
   :maxdepth: 1
   :caption: Robot Networking
   :hidden:

   docs/networking/networking-introduction/index
   docs/networking/networking-utilities/index

.. toctree::
   :maxdepth: 1
   :caption: Contributing
   :hidden:

   docs/contributing/frc-docs/index
   docs/contributing/wpilib/index

.. toctree::
   :maxdepth: 1
   :caption: Issues
   :hidden:

   Report an Issue <https://github.com/wpilibsuite/frc-docs/issues>

.. todolist::
