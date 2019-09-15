Differential Drive Kinematics
=============================

The kinematics suite allows easy odometry with differential drive robots (such as the Kitbot or any other tank drive). This lets one keep track of the robot's x/y position in the Cartesian plane. Odometry data can be used for more robust path following and vision algorithms. View the `Differential Drive Example <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/differentialdrivebot/Drivetrain.java/>`__ for more information.

Differential Drive Kinematics
-----------------------------

WPILib provides a helper DifferentialDriveKinematics class to convert from robot velocities (linear and angular velocity) to left and right wheel velocities. This class is necessary for odometry and requires the robot's trackwidth (the distance between the left and right wheels). 

Empirical Trackwidth Measurement
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

While the trackwidth can be measured by physically measuring the distance between wheels, it's common for the actual trackwidth to differ. The trackwidth can be empirically measured as long as the robot has wheel encoders and a gyro. 

1. Turn the robot in place by a known angle meausure.
2. Measure the change in left and right encoder position caused by turning the robot in place.
3. Calculate the trackwidth. A differential drivetrain's turning circle when turning in place can be represented by a circle whose diameter is the trackwidth. Since an angle measure in radians is defined as an arc length divided by a radius, and we know the angle measure (the angle the robot turned) and the arc length (the change in encoder positions), we can solve for the radius. Multiply the radius by 2 to get the trackwidth.
4. Repeat the trial several times for accuracy, and average your results.

Differential Drive Odometry
---------------------------

A DifferentialDriveOdometry class is provided to calculate the robot's current x and y position. The robot's starting position can be set in the constructor. Call the update() method of an instance of DifferentialDriveOdometry to calculate the robot's pose, giving it the robot's current angle, wheel speeds (as a DifferentialDriveWheelSpeeds), and the time between calls of the update() method. The method can also be called with only the current angle and wheel speeds, and the function will automatically calculate the time difference between function calls. The method returns the robot's current position as a Pose2D.

Differential Drive Wheel Speeds
-------------------------------

The DifferentialDriveWheelSpeeds class contains the left and right wheel velocities of the robot. The DifferentialDriveKinematics class can convert wheel speeds to chasis speeds.
