.. include:: <isonum.txt>

Developing with allwpilib
=========================

.. important:: This document contains information for developers *of* WPILib. This is not for programming FRC\ |reg| robots.

This is a list of links to the various documentation for the `allwpilib <https://github.com/wpilibsuite/allwpilib>`__ repository.

Quick Start
-----------

Below is a list of instructions that guide you through cloning, building, publishing and using local allwpilib binaries in a robot project. This quick start is not intended as a replacement for the information that is further listed in this document.

* Clone the repository with ``git clone https://github.com/wpilibsuite/allwpilib.git``
* Build the repository with ``./gradlew build`` or ``./gradlew build --build-cache`` if you have an internet connection
* Publish the artifacts locally by running ``./gradlew publish``
* `Update your robot project's <https://github.com/wpilibsuite/allwpilib/blob/main/OtherVersions.md>`__ ``build.gradle`` `to use the artifacts <https://github.com/wpilibsuite/allwpilib/blob/main/OtherVersions.md>`__

Core Repository
---------------
.. toctree::
   :maxdepth: 1

   Overview <https://github.com/wpilibsuite/allwpilib>
   Styleguide & wpiformat <https://github.com/wpilibsuite/styleguide/blob/main/README.md>
   Building with CMake <https://github.com/wpilibsuite/allwpilib/blob/main/README-CMAKE.md>
   Using Development Builds <https://github.com/wpilibsuite/allwpilib/blob/main/OtherVersions.md>
   Maven Artifacts <https://github.com/wpilibsuite/allwpilib/blob/main/MavenArtifacts.md>
   Contributor Guidelines <https://github.com/wpilibsuite/allwpilib/blob/main/CONTRIBUTING.md>

NetworkTables
-------------

.. toctree::
   :maxdepth: 1

   NetworkTables 3 Protocol Spec <https://github.com/wpilibsuite/allwpilib/blob/main/ntcore/doc/networktables3.adoc>
