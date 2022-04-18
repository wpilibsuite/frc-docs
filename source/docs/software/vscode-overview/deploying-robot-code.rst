Building and Deploying Robot Code
=================================

Robot projects must be compiled ("built") and deployed in order to run on the roboRIO.  Since the code is not compiled natively on the robot controller, this is known as "cross-compilation."

To build and deploy a robot project, do one of:

1. Open the Command Palette and enter/select "Build Robot Code"
2. Open the shortcut menu indicated by the ellipses in the top right corner of the VS Code window and select "Build Robot Code"
3. Right-click on the build.gradle file in the project hierarchy and select "Build Robot Code"

.. image:: images/deploying-robot-code/building-code-options.png

Deploy robot code by selecting "Deploy Robot Code" from any of the three locations from the previous instructions. That will build (if necessary) and deploy the robot program to the roboRIO.

.. warning:: Avoid powering off the robot while deploying robot code. Interrupting the deployment process can corrupt the roboRIO filesystem and prevent your code from working until the roboRIO is :doc:`re-imaged </docs/zero-to-robot/step-3/imaging-your-roborio>`.

If successful, we will see a "Build Successful" message (1) and the RioLog will open with the console output from the robot program as it runs (2).

.. image:: images/deploying-robot-code/build-successful.png
