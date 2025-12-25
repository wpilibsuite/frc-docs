# Drivetrain Simulation Tutorial
This is a tutorial for implementing a simulation model of your differential drivetrain using the simulation classes. Although the code that we will cover in this tutorial is framework-agnostic, there are two full examples available -- one for each framework.

* ``StateSpaceDifferentialDriveSimulation`` ([Java](https://github.com/wpilibsuite/allwpilib/tree/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/statespacedifferentialdrivesimulation), [C++](https://github.com/wpilibsuite/allwpilib/tree/v2024.3.2/wpilibcExamples/src/main/cpp/examples/StateSpaceDifferentialDriveSimulation)) uses the command-based framework.
* ``SimpleDifferentialDriveSimulation`` ([Java](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/simpledifferentialdrivesimulation), [C++](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/examples/SimpleDifferentialDriveSimulation)) uses a more traditional approach to data flow.

Both of these examples are also available in the VS Code :guilabel:`New Project` window.

.. toctree::
   :maxdepth: 1

   diffdrive-sim-overview
   simulation-instance
   drivetrain-model
   updating-drivetrain-model
   odometry-simgui
