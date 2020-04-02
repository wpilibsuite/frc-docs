Building WPILib
===============

Requirements
------------

- A C++ compiler

  - On Linux, GCC 7+ works fine
  - On Windows, you need Visual Studio 2019 (the free community edition works fine). Make sure to select the C++ Programming Language for installation

- ARM Compiler Toolchain
- Doxygen (Only required if you want to build the C++ documentation)

Setup
-----

Clone the repository using ``git clone https://github.com/wpilibsuite/allwpilib.git``. If the toolchains are not installed, install them, and make sure they are available on the system PATH.

.. todo:: implement wpiformat article

See the wpiformat article on formatting your changes before opening a pull request.

Building
--------

All build steps are executed using the Gradle wrapper, ``gradlew``. Each target that Gradle can build is referred to as a task. The most common Gradle task to use is ``build``. This will build all the outputs created by WPILib. To run, open a console and cd into the cloned WPILib directory. Then:

.. code-block:: shell

   ./gradlew build

To build a specific subproject, such as WPILibC, you must access the subproject and run the build task only on that project. Accessing a subproject in Gradle is quite easy. Simply use ``:subproject_name:task_name`` with the Gradle wrapper. For example, building just WPILibC:

.. code-block:: shell

   ./gradlew :wpilibc:build

If you have installed the FRC Toolchain to a directory other than the default, or if the Toolchain location is not on your System PATH, you can pass the ``toolChainPath`` property to specify where it is located. Example:

.. code-block:: shell

   ./gradlew build -PtoolChainPath=some/path/to/frc/toolchain/bin

If you also want simulation to be built, add -PmakeSim. This requires gazebo_transport. We have tested on 14.04 and 15.05, but any correct install of Gazebo should work, even on Windows if you build Gazebo from source. Correct means CMake needs to be able to find gazebo-config.cmake. See `The Gazebo website <http://gazebosim.org/>`__ for installation instructions.

.. code-block:: shell

   ./gradlew build -PmakeSim

If you prefer to use CMake directly, the you can still do so. The common CMake tasks are wpilibcSim, frc_gazebo_plugins, and gz_msgs

.. code-block:: shell

   mkdir build #run this in the root of allwpilib
   cd build
   cmake ..
   make

The gradlew wrapper only exists in the root of the main project, so be sure to run all commands from there. All of the subprojects have build tasks that can be run. Gradle automatically determines and rebuilds dependencies, so if you make a change in the HAL and then run ``./gradlew :wpilibc:build``, the HAL will be rebuilt, then WPILibC.

There are a few tasks other than ``build`` available. To see them, run the meta-task ``tasks``. This will print a list of all available tasks, with a description of each task.

wpiformat can be executed anywhere in the repository via ``py -3 -m wpiformat`` on Windows or ``python3 -m wpiformat`` on other platforms.

.. todo:: implement cmake article

CMake is also supported for building. CMake building is generally faster than gradle building. See the CMake building article for more instructions.

Publishing
----------

If you are building to test with other dependencies or just want to export the build as a Maven-style dependency, simply run the ``publish`` task. This task will publish all available packages to ``~/releases/maven/development``. If you need to publish the project to a different repo, you can specify it with ``-Prepo=repo_name``. Valid options are:

- **development** - The default repo.
- **beta** - Publishes to ``~/releases/maven/beta``.
- **stable** - Publishes to ``~/releases/maven/stable``.
- **release** - Publishes to ``~/releases/maven/release``.

.. todo:: implement article

The maven artifacts are described in the Maven artifacts article

Structure and Organization
--------------------------

The main WPILib code you're probably looking for is in WPILibJ and WPILibC. Those directories are split into shared, sim, and athena. Athena contains the WPILib code meant to run on your roboRIO. Sim is WPILib code meant to run on your computer with Gazebo, and shared is code shared between the two. Shared code must be platform-independent, since it will be compiled with both the ARM cross-compiler and whatever desktop compiler you are using (g++, msvc, etc...).

The Simulation directory contains extra simulation tools and libraries, such as gz_msgs and JavaGazebo. See sub-directories for more information.

The integration test directories for C++ and Java contain test code that runs on our test-system. When you submit code for review, it is tested by those programs. If you add new functionality you should make sure to write tests for it so we don't break it in the future.

The hal directory contains more C++ code meant to run on the roboRIO. HAL is an acronym for "Hardware Abstraction Layer", and it interfaces with the NI Libraries. The NI Libraries contain the low-level code for controlling devices on your robot. The NI Libraries are found in the ni-libraries folder.

The styleguide repository contains our style guides for C++ and Java code. Anything submitted to the WPILib project needs to follow the code style guides outlined in there.
