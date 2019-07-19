Introduction to Path Planning
=============================
Autonomous is an important section of the match; it is exciting when robots do impressive things in autonomous. In order to score, the robot usually need to go somewhere. The faster the robot arrives at that location, the sooner it can score points! The traditional method for autonomous is driving in a straight line, turning to a certain angle, and driving in a straight line again. This approach works fine, but the robot spends a non-negligible amount of time stopping and starting again after each straight line and turn.

A more advanced approach to autonomous is called “path planning”. Instead of driving in a straight line and turning once the line is complete, the robot continuously moves, driving with a curve-like motion. This can reduce turning stoppage time.

Paths have position and velocity values. A path has a list of position and velocity values for the robot every x seconds (usually 0.02 seconds or less). The robot then attempts to follow these points, adjusting using PID control when needed.

Many teams and organizations have created path planning libraries for FRC, but the officially supported library for WPILib is Pathfinder, which can be added as a vendor library by adding this vendor JSON using the **Manage Libraries->Install New Libraries (online)** function in VSCode (see the `3rd Party Libraries <../../getting-started/3rd-party-libraries.html>`__ article for more details): http://dev.imjac.in/maven/jaci/pathfinder/PathfinderOLD-latest.json
