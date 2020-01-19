Importing a PathWeaver JSON
===========================

The ``TrajectoryUtil`` class can be used to import a PathWeaver JSON into robot code to follow it. This article will go over importing the trajectory. Please visit the :ref:`end-to-end trajectory tutorial <docs/software/examples-tutorials/trajectory-tutorial/index:Trajectory Tutorial>` for more information on following the trajectory.

The ``fromPathweaverJson`` (Java) / ``FromPathweaverJson`` (C++) static methods in ``TrajectoryUtil`` can be used to create a trajectory from a JSON file stored on the roboRIO file system.

.. note:: JSON files placed in ``src/main/deploy`` will automatically be placed on the roboRIO file system in ``/home/lvuser/deploy``.

.. tabs::

   .. code-tab:: java

      Trajectory trajectory = TrajectoryUtil.fromPathweaverJson(Paths.get("/home/lvuser/deploy/YourPath.wpilib.json"));

   .. code-tab:: c++

      frc::Trajectory trajectory = frc::TrajectoryUtil::FromPathweaverJson("/home/lvuser/deploy/YourPath.wpilib.json");

