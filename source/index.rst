.. FIRST Robotics Competition documentation master file, created by
   sphinx-quickstart on Fri Apr  5 23:28:43 2019.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

.. include:: <isonum.txt>

.. meta::
   :google-site-verification: POR_nG8b56eXGxmUIutST7jcA_Vl58ypSdJTzJ1g0zg

# FIRST Robotics Competition Control System

Welcome to the *FIRST*\ |reg| Robotics Competition Control System Documentation! This site contains everything you need to know for programming a competition robot!

Community translations can be found in a variety of languages in the menu towards the bottom-right of the screen.

## Choose Your Path

.. grid:: 1 2 2 2
   :gutter: 3

   .. grid-item-card::
      :class-header: sd-bg-primary sd-text-white

      **I'm New Here**

      ^^^

      Step-by-step guide for beginners to build and deploy your first robot quickly.

      +++

      .. button-ref:: /docs/getting-started-guide/index
         :color: primary
         :shadow:
         :align: center
         :expand:

         Getting Started Guide

   .. grid-item-card::
      :class-header: sd-bg-info sd-text-white

      **I Want Deep Technical Info**

      ^^^

      Comprehensive reference manual for experienced programmers and returning teams.

      +++

      .. button-ref:: /docs/user-manual/index
         :color: primary
         :shadow:
         :align: center
         :expand:

         WPILib User Manual

   .. grid-item-card::
      :class-header: sd-bg-success sd-text-white

      **New Season - Let's Get Started**

      ^^^

      Quick start guide for returning teams: what's new, known issues, and migration guide.

      +++

      .. button-ref:: /docs/yearly-overview/returning-quickstart
         :color: primary
         :shadow:
         :align: center
         :expand:

         Quick Start for Returning Teams

   .. grid-item-card::
      :class-header: sd-bg-warning sd-text-white

      **I Want to Learn by Doing**

      ^^^

      Hands-on tutorials and example projects for both FRC and FTC.

      +++

      .. button-ref:: /docs/tutorials/index
         :color: primary
         :shadow:
         :align: center
         :expand:

         Tutorials

## Quick Access

.. grid:: 1 2 3 3
   :gutter: 3

   .. grid-item-card::
      :class-header: sd-bg-info sd-text-white

      **Hardware Overview**

      ^^^

      An overview of the hardware components available to teams.

      +++

      .. button-ref:: /docs/controls-overviews/control-system-hardware
         :color: primary
         :align: center
         :expand:
         :outline:

         Go to Hardware Overview

   .. grid-item-card::
      :class-header: sd-bg-info sd-text-white

      **Software Overview**

      ^^^

      An overview of the software components and tools available to teams.

      +++

      .. button-ref:: /docs/controls-overviews/control-system-software
         :color: primary
         :shadow:
         :align: center
         :expand:
         :outline:

         Go to Software Overview

   .. grid-item-card::
      :class-header: sd-bg-info sd-text-white

      **Tools**

      ^^^

      Essential tooling such as FRC Driver Station, Dashboards, PathPlanner and more.

      +++

      .. button-ref:: /docs/tools/index
         :color: primary
         :shadow:
         :align: center
         :expand:
         :outline:

         View Tools

   .. grid-item-card::
      :class-header: sd-bg-info sd-text-white

      **Romi and XRP Robots**

      ^^^

      The Romi and XRP robots are low-cost platforms for practicing WPILib programming.

      +++

      .. button-ref:: docs/romi-robot/index
         :color: primary
         :shadow:
         :align: center
         :expand:
         :outline:

         View Romi articles

      .. button-ref:: docs/xrp-robot/index
         :color: primary
         :shadow:
         :align: center
         :expand:
         :outline:

         View XRP articles

   .. grid-item-card::
      :class-header: sd-bg-info sd-text-white

      **API Documentation**

      ^^^

      Java, C++, and Python class documentation.

      .. button-link:: https://github.wpilib.org/allwpilib/docs/2027/java/index.html
         :color: primary
         :shadow:
         :align: center
         :expand:
         :outline:

         Java

      .. button-link:: https://github.wpilib.org/allwpilib/docs/2027/cpp/index.html
         :color: primary
         :shadow:
         :align: center
         :expand:
         :outline:

         C++

      .. button-link:: https://robotpy.readthedocs.io/projects/robotpy/en/stable/
         :color: primary
         :shadow:
         :align: center
         :expand:
         :outline:

         Python

   .. grid-item-card::
      :class-header: sd-bg-info sd-text-white

      **Resources**

      ^^^

      FAQs, glossary, contributing, and additional resources.

      +++

      .. button-ref:: /docs/resources/index
         :color: primary
         :shadow:
         :align: center
         :expand:
         :outline:

         View Resources

.. toctree::
   :maxdepth: 1
   :titlesonly:
   :caption: Getting Started
   :hidden:

   docs/getting-started-guide/index

.. toctree::
   :maxdepth: 1
   :caption: User Manual
   :hidden:

   docs/user-manual/index

.. toctree::
   :maxdepth: 1
   :caption: Tutorials
   :hidden:

   docs/tutorials/index

.. toctree::
   :maxdepth: 1
   :caption: Tools
   :hidden:

   docs/tools/index

.. toctree::
   :maxdepth: 1
   :caption: Resources
   :hidden:

   docs/resources/index

.. toctree::
   :maxdepth: 1
   :caption: Control System Overviews
   :hidden:

   docs/controls-overviews/control-system-hardware
   docs/controls-overviews/control-system-software

.. toctree::
   :maxdepth: 1
   :caption: Yearly Overview
   :hidden:

   docs/yearly-overview/index

.. toctree::
   :maxdepth: 1
   :caption: API Docs
   :hidden:

   WPILib Java API Docs <https://github.wpilib.org/allwpilib/docs/2027/java/index.html>
   WPILib C++ API Docs <https://github.wpilib.org/allwpilib/docs/2027/cpp/index.html>
   WPILib Python API Docs <https://robotpy.readthedocs.io/projects/robotpy/en/stable/>

.. toctree::
   :maxdepth: 1
   :caption: Hardware
   :hidden:

   docs/hardware/hardware-basics/index
   docs/hardware/hardware-tutorials/index
   docs/hardware/sensors/index

.. toctree::
   :maxdepth: 1
   :caption: Romi and XRP Support
   :hidden:

   docs/romi-robot/index
   docs/xrp-robot/index

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
   :caption: Legacy Documentation
   :hidden:

   docs/legacy/index

.. toctree::
   :maxdepth: 1
   :caption: Legal
   :hidden:

   docs/legal/privacy-policy

.. toctree::
   :maxdepth: 1
   :caption: Issues
   :hidden:

   Report a Documentation Issue <https://github.com/wpilibsuite/frc-docs/issues>

