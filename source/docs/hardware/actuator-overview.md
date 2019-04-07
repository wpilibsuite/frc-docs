# Actuator overview

On  FRC robots, an actuator is anything that moves and is controlled by electronics. For example, a piston used to actuate an intake is an actuator, or the motors used to spin a robot's drivetrain is an actuator. Actuators in general require special electronics to interface with the RoboRIO; for example, a RS775 motor will require some kind of speed controller to regulate it's speed and provide it power, and the speed controller will in turn be commanded by the RoboRIO using CAN or PWM.
