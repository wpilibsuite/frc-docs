Install Other WPILib Versions
=============================

This article contains instructions on building projects using a development build and a local WPILib build
.. note:: This only applies to C++/Java teams.

Development Build
-----------------

In order to build a project using a development build, find the ``build.gradle`` file and open it. Then, add the following code below the plugin section and replace ``YEAR`` with the year of the development version.

.. code-block :: text

    wpi.maven.useDevelopment = true
    wpi.wpilibVersion = 'YEAR.+'

The top of your ``build.gradle`` file should now look similar to the code below. Ignore any differences in versions.

.. tabs::

  .. code-tab:: java

    plugins {
        id "java"
        id "edu.wpi.first.GradleRIO" version "2020.3.2"
    }

    wpi.maven.useDevelopment = true
    wpi.wpilibVersion = '2020.+'

  .. code-tab:: c++

    plugins {
        id "cpp"
        id "google-test-test-suite"
        id "edu.wpi.first.GradleRIO" version "2020.3.2"
    }

    wpi.maven.useDevelopment = true
    wpi.wpilibVersion = '2020.+'

Local Build
-----------

Building with a local build is very similar to building with a local build. First, you must have an initial build. The instructions can be found `here <https://github.com/wpilibsuite/allwpilib#building-wpilib>`__. Next, find the ``build.gradle`` file in your robot project and open it. Then, add the following code below the plugin section and replace ``YEAR`` with the year of the local version.

.. code-block :: text

    wpi.maven.useFrcMavenLocalDevelopment = true
    wpi.wpilibVersion = 'YEAR.424242.+'

The top of your ``build.gradle`` file should now look similar to the code below. Ignore any differences in versions.

.. tabs::

  .. code-tab:: java

    plugins {
        id "java"
        id "edu.wpi.first.GradleRIO" version "2020.3.2"
    }

    wpi.maven.useFrcMavenLocalDevelopment = true
    wpi.wpilibVersion = '2020.424242.+'

  .. code-tab:: c++

    plugins {
        id "cpp"
        id "google-test-test-suite"
        id "edu.wpi.first.GradleRIO" version "2020.3.2"
    }

    wpi.maven.useFrcMavenLocalDevelopment = true
    wpi.wpilibVersion = '2020.424242.+'

