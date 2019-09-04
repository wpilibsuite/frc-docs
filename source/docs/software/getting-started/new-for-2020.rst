New for 2020
============

WPILib developers have done a number of changes to the control system for the 2020 season. This article will describe and provide a brief overview of the new changes and features. 

WPILib
------

- LinearDigitalFilter has been renamed to LinearFilter, and now has a ``Calculate()`` method which returns the filtered value
- PIDController has been rewritten
  - Takes lambdas for the measurements and outputs
  - No longer runs asynchronously. Async has been a footgun for a large majority of teams, and a new implementation will be implemented in the future.
- Kinematics classes have been added for Swerve, Mecanum, and DifferentialDrive. This allows for more complete closed loop driving of these drive types.