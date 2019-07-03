Setting up the Robot Project
============================

The RobotBuilder program has some default properties that need to be set up so the generated program and other generated files work properly. This setup information is stored in the properties for robot description (the first line).

Robot Project Properties
------------------------

The properties that describe the robot are:

**Name** - The name of the robot project that is created

**Autnomous Command** - the command that will run by default when the program is placed in autonomous mode

**Team Number** - the team number is used for creating the package names

**Use Default Java Package** - If checked RobotBuilder will use the default package (org.usfirst.frc####). Otherwise you can specify a custom package name to be used.

**Java Package** - The name of the generated Java package used when generating the project code

**Export Directory** - The folder that the java project is generated into when Export to Java is selected

**Export Subsystems** - Checked if RobotBuilder should export the Subsystem classes from your project

**Export Commands** - Checked if RobotBuilder should export the Command classes from your project

**Simulation World File** - The World File that is used for simulation of your robot project

**Wiring File** - the location of the html file that contains the wiring diagram for your robot

Using Source Control with the RobotBuilder Project
--------------------------------------------------

.. image:: images/robotbuilder-setup-1.png

When using source control the project will typically be used on a number of computers and the path to the project directory might be different from one users computer to another. If the RobotBuilder project file is stored using an absolute path, it will typically contain the user name and won't be usable across multiple computers. To make this work, select "relative path" and specify the path as an directory offset from the project files. In the above example, the project file is stored in the folder just above the project files in the file hierarchy. In this case, the user name is not part of the path and it will be portable across all of your computers.
