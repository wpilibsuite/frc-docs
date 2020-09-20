Physics Simulation with WPILib
==============================

Because :ref:`state-space notation <docs/software/advanced-controls/state-space/state-space-intro:What is State-Space Notation?>` allows us to compactly represent the :term:`dynamics <dynamics>` of :term:`systems <system>`, we can leverage it to provide a backend for simulating physical systems on robots. The goal of these simulators is to simulate the motion of robot mechanisms without modifying existing non-simulation user code. The basic flow of such simulators is as follows:

- In normal user code:

   - PID or similar control algorithms generate voltage commands from encoder (or other sensor) readings
   - Motor outputs are set
- In simulation periodic code:

   - The simulation's :term:`state` is updated using :term:`inputs <input>`, usually voltages from motors set from a PID loop
   - Simulated encoder (or other sensor) readings are set for user code to use in the next timestep

WPILib's Simulation Classes
---------------------------

The following physics simulation classes are available in WPILib:

- LinearSystemSim, for modeling systems with linear dynamics
- FlywheelSim
- DifferentialDrivetrainSim
- ElevatorSim, which models gravity
- SingleJointedArmSim, which models gravity
- BatterySim, which simply estimates battery voltage sag based on drawn currents

All simulation classes (with the exception of the differential drive simulator) inherit from the :code:`LinearSystemSim` class. By default, the dynamics are the linear system dynamics :math:`\mathbf{x}_{k+1} = \mathbf{A}\mathbf{x}_k + \mathbf{B}\mathbf{u}_k`. Subclasses override the :code:`UpdateX(x, u, dt)` method to provide custom, nonlinear dynamics, such as modeling gravity.

Usage in User Code
------------------

The following is available from the WPILib :code:`elevatorsimulation` `example project <https://github.com/mcm001/allwpilib/tree/state-space-v2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorsimulation>`__.

In addition to standard objects such as motors and encoders, we instantiate our elevator simulator using known constants such as carriage mass and gearing reduction. We also instantiate an :code:`EncoderSim`, which sets the distance and rate read by our our :code:`Encoder`.

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/mcm001/allwpilib/state-space-v2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorsimulation/Robot.java
         :language: java
         :lines: 54-61
         :linenos:
         :lineno-start: 36

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/mcm001/allwpilib/state-space-v2-stage-2/wpilibcExamples/src/main/cpp/examples/ElevatorSimulation/cpp/Robot.cpp
         :language: cpp
         :lines: 58-66
         :linenos:
         :lineno-start: 36

Next, :code:`teleopPeriodic`/:code:`TeleopPeriodic` (Java/C++) uses a simple PID control loop to drive our elevator to a setpoint 30 inches off the ground.

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/mcm001/allwpilib/state-space-v2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorsimulation/Robot.java
         :language: java
         :lines: 83-93
         :linenos:
         :lineno-start: 36

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/mcm001/allwpilib/state-space-v2-stage-2/wpilibcExamples/src/main/cpp/examples/ElevatorSimulation/cpp/Robot.cpp
         :language: cpp
         :lines: 89-99
         :linenos:
         :lineno-start: 36

Next, :code:`simulationPeriodic`/:code:`SimulationPeriodic` (Java/C++) uses the voltage applied to the motor to update the simulated position of the elevator. We use :code:`SimulationPeriodic` because it runs periodically only for simulated robots. This means that our simulation code will not be run on a real robot.

Finally, the simulated encoder's distance reading is set using the simulated elevator's position, and the robot's battery voltage is set using the estimated current drawn by the elevator.

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/mcm001/allwpilib/state-space-v2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorsimulation/Robot.java
         :language: java
         :lines: 68-81
         :linenos:
         :lineno-start: 36

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/mcm001/allwpilib/state-space-v2-stage-2/wpilibcExamples/src/main/cpp/examples/ElevatorSimulation/cpp/Robot.cpp
         :language: cpp
         :lines: 71-87
         :linenos:
         :lineno-start: 36
