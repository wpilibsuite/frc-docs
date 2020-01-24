Importing a PathWeaver JSON
===========================

The ``TrajectoryUtil`` class can be used to import a PathWeaver JSON into robot code to follow it. This article will go over importing the trajectory. Please visit the :ref:`end-to-end trajectory tutorial <docs/software/examples-tutorials/trajectory-tutorial/index:Trajectory Tutorial>` for more information on following the trajectory.

The ``fromPathweaverJson`` (Java) / ``FromPathweaverJson`` (C++) static methods in ``TrajectoryUtil`` can be used to create a trajectory from a JSON file stored on the roboRIO file system.

.. tabs::

   .. code-tab:: java

      String trajectoryJSON = "paths/YourPath.wpilib.json";
      try {
        Path trajectoryPath = Filesystem.getDeployDirectory().getPath().resolve(trajectoryJSON);
        Trajectory trajectory = TrajectoryUtil.fromPathweaverJson(trajectoryPath);
      } catch (IOException ex) {
        DriverStation.reportError("Unable to open trajectory: " + trajectoryJSON, ex.getStackTrace());
      }

   .. code-tab:: c++

       #include <frc/Filesystem.h>
       #include <frc/trajectory/TrajectoryUtil.h>
       #include <wpi/Path.h>

       wpi::SmallVector<char, 64> deployDirectory;
       frc::filesystem::GetDeployDirectory(deployDirectory);
       wpi::sys::path::append(deployDirectory, "paths");
       wpi::sys::path::append(deployDirectory, "YourPath.wpilib.json");

       frc::Trajectory trajectory = frc::TrajectoryUtil::FromPathweaverJson(deployDirectory);
