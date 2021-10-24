Importing a PathWeaver JSON
===========================

The ``TrajectoryUtil`` class can be used to import a PathWeaver JSON into robot code to follow it. This article will go over importing the trajectory. Please visit the :ref:`end-to-end trajectory tutorial <docs/software/pathplanning/trajectory-tutorial/index:Trajectory Tutorial>` for more information on following the trajectory.

The ``fromPathweaverJson`` (Java) / ``FromPathweaverJson`` (C++) static methods in ``TrajectoryUtil`` can be used to create a trajectory from a JSON file stored on the roboRIO file system.

.. important:: To be compatible with the ``Field2d`` view in the simulator GUI, the coordinates for the exported JSON have changed. Previously (before 2021), the range of the y-coordinate was from -27 feet to 0 feet whereas now, the range of the y-coordinate is from 0 feet to 27 feet (with 0 being at the bottom of the screen and 27 feet being at the top). This should not affect teams who are correctly :ref:`resetting their odometry to the starting pose of the trajectory <docs/software/pathplanning/trajectory-tutorial/creating-following-trajectory:Creating the RamseteCommand>` before path following.

.. note:: PathWeaver places JSON files in ``src/main/deploy/paths`` which will automatically be placed on the roboRIO file system in ``/home/lvuser/deploy/paths`` and can be accessed using getDeployDirectory as shown below.

.. tabs::

   .. code-tab:: java

      String trajectoryJSON = "paths/YourPath.wpilib.json";
      Trajectory trajectory = new Trajectory();

      @Override
      public void robotInit() {
         try {
            Path trajectoryPath = Filesystem.getDeployDirectory().toPath().resolve(trajectoryJSON);
            trajectory = TrajectoryUtil.fromPathweaverJson(trajectoryPath);
         } catch (IOException ex) {
            DriverStation.reportError("Unable to open trajectory: " + trajectoryJSON, ex.getStackTrace());
         }
      }

   .. code-tab:: c++

      #include <frc/Filesystem.h>
      #include <frc/trajectory/TrajectoryUtil.h>
      #include <wpi/fs.h>

      frc::Trajectory trajectory;

      void Robot::RobotInit() {
         fs::path deployDirectory = frc::filesystem::GetDeployDirectory();
         deployDirectory = deployDirectory / "paths" / "YourPath.wpilib.json";
         trajectory = frc::TrajectoryUtil::FromPathweaverJson(deployDirectory.string());
      }

In the examples above, ``YourPath`` should be replaced with the name of your path.

.. warning:: Loading a PathWeaver JSON from file in Java can take more than one loop iteration so it is highly recommended that the robot load these paths on startup.
