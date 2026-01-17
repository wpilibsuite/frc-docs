# Physics Simulation with WPILib

Because :ref:`state-space notation <docs/software/advanced-controls/state-space/state-space-intro:What is State-Space Notation?>` allows us to compactly represent the :term:`dynamics <dynamics>` of :term:`systems <system>`, we can leverage it to provide a backend for simulating physical systems on robots. The goal of these simulators is to simulate the motion of robot mechanisms without modifying existing non-simulation user code. The basic flow of such simulators is as follows:

- In normal user code:

  - PID or similar control algorithms generate voltage commands from encoder (or other sensor) readings
  - Motor outputs are set

- In simulation periodic code:

  - The simulation's :term:`state` is updated using :term:`inputs <input>`, usually voltages from motors set from a PID loop
  - Simulated encoder (or other sensor) readings are set for user code to use in the next timestep

## WPILib's Simulation Classes

The following physics simulation classes are available in WPILib:

- LinearSystemSim, for modeling systems with linear dynamics
- FlywheelSim
- DifferentialDrivetrainSim
- ElevatorSim, which models gravity in the direction of elevator motion
- SingleJointedArmSim, which models gravity proportional to the arm angle
- BatterySim, which simply estimates battery voltage sag based on drawn currents

All simulation classes (with the exception of the differential drive simulator) inherit from the :code:`LinearSystemSim` class. By default, the dynamics are the linear system dynamics :math:`\mathbf{x}_{k+1} = \mathbf{A}\mathbf{x}_k + \mathbf{B}\mathbf{u}_k`. Subclasses override the :code:`UpdateX(x, u, dt)` method to provide custom, nonlinear dynamics, such as modeling gravity.

.. note:: Swerve support for simulation is in the works, but we cannot provide an ETA. For updates on progress, please follow this [pull request](https://github.com/wpilibsuite/allwpilib/pull/3374).

## Usage in User Code

The following is available from the WPILib :code:`elevatorsimulation` [example project](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorsimulation).

In addition to standard objects such as motors and encoders, we instantiate our elevator simulator using known constants such as carriage mass and gearing reduction. We also instantiate an :code:`EncoderSim`, which sets the distance and rate read by our :code:`Encoder`.

In the following example, we simulate an elevator given the mass of the moving carriage (in kilograms), the radius of the drum driving the elevator (in meters), the gearing reduction between motor and drum as output over input (so usually greater than one), the minimum and maximum height of the elevator (in meters), the starting height of the elevator, and some random noise to add to our position estimate.

.. note:: The elevator and arm simulators will prevent the simulated position from exceeding given minimum or maximum heights or angles. If you wish to simulate a mechanism with infinite rotation or motion, :code:`LinearSystemSim` may be a better option.

.. tab-set::

   .. tab-item:: Java
      :sync: java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorsimulation/subsystems/Elevator.java
         :language: java
         :lines: 46-58
         :lineno-match:

   .. tab-item:: C++
      :sync: c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/ElevatorSimulation/include/subsystems/Elevator.h
         :language: c++
         :lines: 51-61
         :lineno-match:

Next, :code:`teleopPeriodic`/:code:`TeleopPeriodic` (Java/C++) uses a simple PID control loop to drive our elevator to a setpoint 30 inches off the ground.

.. tab-set::

   .. tab-item:: Java
      :sync: java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorsimulation/Robot.java
         :language: java
         :lines: 30-39
         :lineno-match:

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorsimulation/subsystems/Elevator.java
         :language: java
         :lines: 99-106
         :lineno-match:

   .. tab-item:: C++
      :sync: c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/ElevatorSimulation/cpp/Robot.cpp
         :language: c++
         :lines: 20-28
         :lineno-match:

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/ElevatorSimulation/cpp/subsystems/Elevator.cpp
         :language: c++
         :lines: 42-50
         :lineno-match:

Next, :code:`simulationPeriodic`/:code:`SimulationPeriodic` (Java/C++) uses the voltage applied to the motor to update the simulated position of the elevator. We use :code:`SimulationPeriodic` because it runs periodically only for simulated robots. This means that our simulation code will not be run on a real robot.

.. note:: Classes inheriting from command-based's ``Subsystem`` can override the inherited ``simulationPeriodic()`` method. Other classes will need their simulation update methods called from ``Robot``'s ``simulationPeriodic``.

Finally, the simulated encoder's distance reading is set using the simulated elevator's position, and the robot's battery voltage is set using the estimated current drawn by the elevator.

.. tab-set::

   .. tab-item:: Java
      :sync: java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorsimulation/subsystems/Elevator.java
         :language: java
         :lines: 79-92
         :lineno-match:

   .. tab-item:: C++
      :sync: c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/ElevatorSimulation/cpp/subsystems/Elevator.cpp
         :language: c++
         :lines: 20-35
         :lineno-match:
