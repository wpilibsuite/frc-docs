Manipulating Trajectories
=========================
Once a trajectory has been generated, you can retrieve information from it using certain methods. These methods will be useful when writing code to follow these trajectories.

Getting the total duration of the trajectory
--------------------------------------------
Because all trajectories have timestamps at each point, the amount of time it should take for a robot to traverse the entire trajectory is pre-determined. The ``TotalTime()`` (C++) / ``getTotalTimeSeconds()`` (Java) method can be used to determine the time it takes to traverse the trajectory.


.. tabs::

   .. code-tab:: java

      // Get the total time of the trajectory in seconds
      double duration = trajectory.getTotalTimeSeconds();

   .. code-tab:: c++

      // Get the total time of the trajectory
      units::second_t duration = trajectory.TotalTime();

Sampling the trajectory
-----------------------
The trajectory can be sampled at various timesteps to get the pose, velocity, and acceleration at that point. The ``Sample(units::second_t time)`` (C++) / ``sample(double timeSeconds)`` (Java) method can be used to sample the trajectory at any timestep. The parameter refers to the amount of time passed since 0 seconds (the starting point of the trajectory). This method returns a ``Trajectory::Sample`` with information about that sample point.

.. tabs::

   .. code-tab:: java

      // Sample the trajectory at 1.2 seconds. This represents where the robot
      // should be after 1.2 seconds of traversal.
      Trajectory.Sample point = trajectory.sample(1.2);

   .. code-tab:: c++

      // Sample the trajectory at 1.2 seconds. This represents where the robot
      // should be after 1.2 seconds of traversal.
      Trajectory::State point = trajectory.Sample(1.2_s);

The ``Trajectory::Sample`` struct has several pieces of information about the sample point:

* ``t``: The time elapsed from the beginning of the trajectory up to the sample point.
* ``velocity``: The velocity at the sample point.
* ``acceleration``: The acceleration at the sample point.
* ``pose``: The pose (x, y, heading) at the sample point.
* ``curvature``: The curvature (rate of change of heading with respect to distance along the trajectory) at the sample point.

Note: The angular velocity at the sample point can be calculated by multiplying the velocity by the curvature.

Getting all states of the trajectory (advanced)
-----------------------------------------------
A more advanced user can get a list of all states of the trajectory by calling the ``States()`` (C++) / ``getStates()`` (Java) method. Each state represents a point on the trajectory. :ref:`When the trajectory is created <docs/software/advanced-control/trajectories/trajectory-generation:Generating the trajectory>` using the ``TrajectoryGenerator::GenerateTrajectory(...)`` method, a list of trajectory points / states are created. When the user samples the trajectory at a particular timestep, a new sample point is interpolated between two existing points / states in the list.
