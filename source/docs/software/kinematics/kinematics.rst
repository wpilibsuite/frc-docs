Kinematics
==========

The kinematics suite simplifies advanced control of differential, mecanum, and swerve drivetrains, handling the inverse kinematics and odometry for a user. Each type of drivetrain has a kinematics and odometry class. The kinematics classes convert chasis speeds to robot wheel speeds and vice versa. The odometry classes calculate and return the position of the robot on the cartesian plane. Note that all kinematics classes assume that units of length are in meters.

Chasis Speeds
-------------

All drivetrains make use of the ChasisSpeeds class, which represents a robot's velocity in terms of x and y velocities, along with an angular velocity. The velocity in the x direction represents the forwards/backwards velocity of a robot. The y velocity represents the sideways velocity of a robot. A nonholonomic drivetrain such as a differential drive will always have a y velocity of 0.
