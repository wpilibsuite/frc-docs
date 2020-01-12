Introduction to Path Planning
=============================
Autonomous is an important section of the match; it is exciting when robots do impressive things in autonomous. In order to score, the robot usually need to go somewhere. The faster the robot arrives at that location, the sooner it can score points! The traditional method for autonomous is driving in a straight line, turning to a certain angle, and driving in a straight line again. This approach works fine, but the robot spends a non-negligible amount of time stopping and starting again after each straight line and turn.

A more advanced approach to autonomous is called “path planning”. Instead of driving in a straight line and turning once the line is complete, the robot continuously moves, driving with a curve-like motion. This can reduce turning stoppage time.

Paths have position and velocity values. A path has a list of position and velocity values. The robot then attempts to follow these points, adjusting using PID control when needed.

WPILib contains a trajectory generation suite that can be used by teams to generate and follow trajectories.
