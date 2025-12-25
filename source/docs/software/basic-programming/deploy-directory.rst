# Robot Project Deploy Directory

The deploy directory is a part of an FRC project, used to store files that are transferred to the roboRIO during the deployment process. This directory allows teams to include additional resources, such as configuration files, scripts, or other assets, that their robot code may need at runtime.

## Location of the Deploy Directory

In a standard GradleRIO project, the deploy directory is located under the ``src/main`` folder. Any files placed in this directory will automatically be copied to the SystemCore when the code is deployed.

## How the Deploy Directory Works

When you run the ``deploy`` task, GradleRIO packages the contents of the deploy directory and transfers them to the roboRIO. By default, these files are placed in the ``/home/systemcore/deploy`` directory on the SystemCore. This ensures that your robot code can access these files during runtime.

### Example Use Cases

Here are some common examples of how teams use the ``deploy`` directory:

1. **Configuration Files**
   Teams may include configuration files (e.g., JSON, YAML, or XML) that define robot-specific settings, such as PID constants, swerve configuration, or autonomous routines. The :doc:`Preferences class <robot-preferences>` provides another method to store configuration on the SystemCore.

2. **Path Planning Files**
   For teams using path planning libraries, trajectory files such as those from :doc:`Choreo </docs/software/pathplanning/choreo/index>` and [PathPlanner](https://github.com/mjansen4857/pathplanner) can be stored in the deploy directory and loaded by the robot code.

### Accessing Deploy Files in Code

To access files from the deploy directory in your robot code, use the ``Filesystem`` class ([Java](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/wpilibj/Filesystem.html), [C++](https://github.wpilib.org/allwpilib/docs/2027/cpp/_filesystem_8h.html)). The ``getDeployDirectory`` method returns the path to the deploy directory. This ensures that your code can locate the files regardless of whether the code is running on the SystemCore or in simulation on your computer.

## Deleting Unused Deploy Files

By default the deploy directory in your project is transferred to the SystemCore when code is deployed.  It is initiated by this section of the ``build.gradle`` file.

.. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/vscode-wpilib/v2027.0.0-alpha-2/vscode-wpilib/resources/gradle/java/build.gradle
   :language: groovy
   :lines: 32-38
   :lineno-match:

This will overwrite any duplicate files found in the ``/home/systemcore/deploy`` directory on the RIO and copy over any additional not present there.  If ``deleteOldFiles`` is false it will not remove any files no longer present in the project deploy directory.  Changing it to `true` helps prevent programs like :doc:`Choreo </docs/software/pathplanning/choreo/index>` and [PathPlanner](https://github.com/mjansen4857/pathplanner) from getting confused by files that were deleted locally but still exist on the SystemCore.

If you want to manage the SystemCore files directly, the :doc:`FTP documentation </docs/software/systemcore-info/roborio-ftp>` provides one method to do so.
