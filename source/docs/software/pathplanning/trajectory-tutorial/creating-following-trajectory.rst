# Step 4: Using Path Planning Tools

With your drive subsystem configured with odometry and characterized feedforward values, you're now ready to implement autonomous path following using a third-party path planning tool.

.. warning:: RamseteCommand has been deprecated and removed from WPILib. This page has been updated to guide teams toward modern path planning solutions.

## Choosing a Path Planning Tool

WPILib no longer provides built-in command-based trajectory following. Instead, teams should use one of these proven third-party tools:

### PathPlanner

`PathPlanner <https://pathplanner.dev/>`__ is a popular graphical path planning tool with extensive features:

**Key Features:**
- Graphical path editor with Bézier curves
- Built-in automatic pathfinding (AD* algorithm)
- Event markers for triggering actions during paths
- Hot-reload paths without code redeployment
- Full command-based autonomous routine builder
- Real-time telemetry and path preview

**Getting Started with PathPlanner:**

1. **Install PathPlannerLib** as a vendor dependency:

   - In VS Code, open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Select "WPILib: Manage Vendor Libraries"
   - Choose "Install new libraries (online)"
   - Enter the URL: ``https://3015rangerrobotics.github.io/pathplannerlib/PathplannerLib.json``

2. **Configure AutoBuilder** in your drive subsystem constructor:

   Your drive subsystem needs these methods:

   - ``getPose()`` - Returns the current robot pose
   - ``resetPose(Pose2d pose)`` - Resets odometry to a specific pose
   - ``getRobotRelativeSpeeds()`` - Returns current ChassisSpeeds
   - ``driveRobotRelative(ChassisSpeeds speeds)`` - Drives the robot

3. **Set up the path following controller:**

   - For differential drive: Use ``PPLTVController``
   - For swerve drive: Use ``PPHolonomicDriveController``

4. **Learn more:** See the complete `PathPlanner documentation <https://pathplanner.dev/pplib-getting-started.html>`__

### Choreo

`Choreo <https://choreo.autos/>`__ is a time-optimized trajectory planner designed to maximize robot performance:

**Key Features:**
- Time-optimized trajectories that respect robot dynamics
- Graphical interface with real-time playback
- Support for waypoints, constraints, and obstacles
- Cross-platform (Windows, macOS, Linux)
- Open source (BSD-3-Clause license)
- Designed to push robots to their physical limits safely

**Getting Started with Choreo:**

1. **Install ChoreoLib** as a vendor dependency:

   - In VS Code, open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Select "WPILib: Manage Vendor Libraries"
   - Choose "Install new libraries (online)"
   - Enter the URL: ``https://lib.choreo.autos/dep/ChoreoLib2025.json``

2. **Implement trajectory following** in your drive subsystem:

   Unlike PathPlanner, Choreo leaves the trajectory following implementation to you. You'll need:

   - A method to get the robot's current pose
   - PID controllers for position and heading correction
   - A way to drive field-relatively (swerve) or calculate wheel speeds (differential)

3. **Learn more:** See the complete `Choreo documentation <https://choreo.autos/>`__

## What Happened to WPILib Trajectory Following?

Prior to 2025, WPILib included ``RamseteCommand`` for trajectory following on differential drives. This has been deprecated and removed because:

1. **Third-party tools are more capable** - PathPlanner and Choreo offer graphical interfaces, better tuning, and more features
2. **Easier to use** - Teams can design paths visually instead of specifying waypoints in code
3. **Better maintained** - These tools are actively developed by the FRC community
4. **Industry standard** - Most competitive teams use these tools

The underlying WPILib trajectory generation and following classes (``TrajectoryGenerator``, ``LTVUnicycleController``) are still available for teams who want to implement custom solutions, but command-based wrappers have been removed.

## Next Steps

After completing the previous tutorial steps (characterization, odometry setup, drive subsystem creation), you should:

1. Choose PathPlanner or Choreo based on your team's needs
2. Follow that tool's documentation to install and configure it
3. Design your autonomous paths using the graphical interface
4. Test your autonomous routines incrementally, starting with simple paths

Both tools have active communities on Chief Delphi and provide example code to help you get started.
