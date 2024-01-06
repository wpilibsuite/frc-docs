Gradlew Tasks
=============

This article aims to highlight the gradle commands supported by the WPILib team for user use. These commands can be viewed by typing ``./gradlew tasks`` at the root of your robot project. Not all commands shown in ``./gradlew tasks`` and unsupported commands will not be documented here.

Build tasks
-----------

``./gradlew build`` - Assembles and tests this project. Useful for prebuilding your project without deploying to the roboRIO.

``./gradlew clean`` - Deletes the build directory.

CompileCommands tasks
---------------------

``./gradlew generateCompileCommands`` - Generate compile_commands.json for C++ programs. This is a configuration file that is supported by many Integrated Development Environments and build tools.

DeployUtils tasks
-------------------

``./gradlew deploy`` - Deploy all artifacts on all targets. This will deploy your robot project to the available targets (IE, roboRIO).

``./gradlew discoverRoborio`` - Determine the address(es) of target roboRIO. This will print out the IP address of a connected roboRIO.

GradleRIO tasks
---------------

``./gradlew $TOOL$`` - Runs the tool ``$TOOL$`` (Replace ``$TOOL$`` with the name of the tool. IE, Glass, Shuffleboard, etc)

``./gradlew $TOOL$Install`` - Installs the java tool ``$TOOL$`` (Replace ``$TOOL$`` with the name of the tool. IE, Shuffleboard, SmartDashboard, etc)

``./gradlew InstallAllTools`` - Installs all available tools. This excludes the development environment such as Visual Studio Code. It's the users requirement to ensure the required dependencies (Java) is installed. Only recommended for advanced users!

``./gradlew simulateExternalNativeRelease`` - Simulate External Task for native executable. Exports a JSON file for use by editors / tools

``./gradlew simulateExternalJavaRelease`` - Simulate External Task for Java/Kotlin/JVM. Exports a JSON file for use by editors / tools

``./gradlew simulateJava`` - Launches simulation for the Java projects

``./gradlew simulateNative`` - Launches simulation for C++ projects

``./gradlew vendordep`` - Install vendordep JSON file from URL or local installation. See :doc:`/docs/software/vscode-overview/3rd-party-libraries`
