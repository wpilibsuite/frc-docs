.. include:: <isonum.txt>

# Using the WPILib Classes to Drive your Robot

WPILib includes many classes to help make your robot get driving faster.

## Standard drivetrains

### Differential Drive Robots
.. image:: /docs/zero-to-robot/step-1/images/how-to-wire-a-simple-robot/layout.jpg
   :alt: The wiring of a simple differential drive robot.
   :width: 600

These drive bases typically have two or more in-line traction or omni  wheels per side (e.g., 6WD or 8WD) and may also be known as  "skid-steer", "tank drive", or "West Coast Drive". The Kit of Parts  drivetrain is an example of a differential drive. These drivetrains are capable of driving forward/backward and can turn by driving the two sides in opposite directions causing the wheels to skid sideways. These drivetrains are not capable of sideways translational movement.

### Mecanum Drive
.. image:: images/am-14u4-6in-mecanum-upgrade.png
   :alt: A four wheel Mecanum robot using the KOP chassis.
   :width: 600

Mecanum drive is a method of driving using specially designed wheels that allow the robot to drive in any direction without changing the orientation of the robot. A robot with a conventional drivetrain (all wheels pointing in the same direction) must turn in the direction it needs to drive. A mecanum robot can move in any direction without first turning and is called a holonomic drive. The wheels (shown on this robot) have rollers that cause the forces from driving to be applied at a 45 degree angle rather than straight forward as in the case of a conventional drive.

When viewed from the top, the rollers on a mecanum drivetrain should form an 'X' pattern. This results in the force vectors (when driving the wheel forward) on the front two wheels pointing forward and inward and the rear two wheels pointing forward and outward. By spinning the wheels in different directions, various components of the force vectors cancel out, resulting in the desired robot movement. A quick chart of different movements has been provided below, drawing out the force vectors for each of these motions may help in understanding how these drivetrains work. By varying the speeds of the wheels in addition to the direction, movements can be combined resulting in translation in any direction and rotation, simultaneously.

## Swerve Drive

.. image:: images/WCPSwerveX2i.png
   :alt: A swerve drive robot using WCP X2i swerve modules.
   :width: 600

Swerve drive is a method of driving using independently steerable and drivable wheels. This allows the robot to drive in any direction without changing the orientation of the robot, much like mecanum drive. However, since the wheels are steerable, they can be driven with their force vectors pointing straight forward, rather than at a 45 degree angle as in mecanum drive. This results in more efficient movement and better traction than mecanum drive.

## Drive Class Conventions

### Motor Inversion

It is the responsibility of the user to manage proper inversions for their drivetrain. Users can invert motors by calling ``setInverted()``/``SetInverted()`` on their motor objects. Typically for differential drive trains, one side must be inverted to avoid spinning in circles, since the forward direction of each side of the tank drive is opposite of each other.

.. tab-set::

    .. tab-item:: Java
        :sync: Java

        .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/tankdrivegamepad/Robot.java
            :language: java
            :lines: 18,24-29

    .. tab-item:: C++
        :sync: C++

        .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/TankDriveGamepad/cpp/Robot.cpp
            :language: c++
            :lines: 16, 22-28

    .. tab-item:: Python
        :sync: Python

        .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/TankDrive/robot.py
           :language: python
           :lines: 18-20,23,31

### Squaring Inputs

When driving robots, it is often desirable to manipulate the joystick inputs such that the robot has finer control at low speeds while still using the full output range. One way to accomplish this is by squaring the joystick input, then reapplying the sign. By default the Differential Drive class will square the inputs. If this is not desired (e.g. if passing values in from a PIDController), use one of the drive methods with the squaredInputs parameter and set it to false.

### Maximum Output

Sometimes drivers feel that their drivetrain is driving too fast and want to limit the output.  This can be accomplished with the `setMaxOutput()` method.  This maximum output is multiplied by result of the previous drive functions like squared inputs.

### Motor Safety

Motor Safety is a mechanism in WPILib that takes the concept of a watchdog and breaks it out into one watchdog (Motor Safety timer) for each individual actuator. Note that this protection mechanism is in addition to the System Watchdog which is controlled by the Network Communications code and the FPGA and will disable all actuator outputs if it does not receive a valid data packet for 125ms.

The purpose of the Motor Safety mechanism is the same as the purpose of a watchdog timer, to disable mechanisms which may cause harm to themselves, people, or property if the code locks up and does not properly update the actuator output. Motor Safety breaks this concept out on a per actuator basis so that you can appropriately determine where it is necessary and where it is not. Examples of mechanisms that should have motor safety enabled are systems like drive trains and arms. If these systems get latched on a particular value they could cause damage to their environment or themselves. An example of a mechanism that may not need motor safety is a spinning flywheel for a shooter. If this mechanism gets latched on a particular value it will simply continue spinning until the robot is disabled. By default Motor Safety is enabled for DifferentialDrive and MecanumDrive objects and disabled for all other motor controllers and servos.

The Motor Safety feature operates by maintaining a timer that tracks how long it has been since the feed() method has been called for that actuator. Code in the Driver Station class initiates a comparison of these timers to the timeout values for any actuator with safety enabled every 5 received packets (100ms nominal). The set() methods of each motor controller class and the set() and setAngle() methods of the servo class call feed() to indicate that the output of the actuator has been updated.

The Motor Safety interface of motor controllers can be interacted with by the user using the following methods:

.. tab-set-code::


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/snippets/motorcontrol/Robot.java
        :language: java
        :lines: 50-53

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/snippets/MotorControl/cpp/Robot.cpp
        :language: c++
        :lines: 49-52

    .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/snippets/robot/MotorControl/robot.py
        :language: python
        :lines: 51-54


By default all Drive objects enable Motor Safety. Depending on the mechanism and the structure of your program, you may wish to configure the timeout length of the motor safety (in seconds). The timeout length is configured on a per actuator basis and is not a global setting. The default (and minimum useful) value is 100ms.

### Axis Conventions

The drive classes use the NWU axes convention (North-West-Up as external reference in the world frame). The positive X axis points ahead, the positive Y axis points left, and the positive Z axis points up. We use NWU here because the rest of the library, and math in general, use NWU axes convention.

Joysticks follow NED (North-East-Down) convention, where the positive X axis points ahead, the positive Y axis points right, and the positive Z axis points down. However, it's important to note that axes values are rotations around the respective axes, not translations. When viewed with each axis pointing toward you, CCW is a positive value and CW is a negative value. Pushing forward on the joystick is a CW rotation around the Y axis, so you get a negative value. Pushing to the right is a CCW rotation around the X axis, so you get a positive value.

.. note:: See the :doc:`/docs/software/basic-programming/coordinate-system` section for more detail about the axis conventions and coordinate systems.

## Using the DifferentialDrive class to control Differential Drive robots

.. note:: The DifferentialDrive class handles the differential drivetrain configuration. These drive bases typically have two or more in-line traction or omni wheels per side (e.g., 6WD or 8WD) and may also be known as "skid-steer", "tank drive", or "West Coast Drive" (WCD). The Kit of Parts drivetrain is an example of a differential drive. There are methods to control the drive with 3 different styles ("Tank", "Arcade", or "Curvature"), explained in the article below.

DifferentialDrive is a method provided for the control of "skid-steer" or "West Coast" drivetrains, such as the Kit of Parts chassis. Instantiating a DifferentialDrive is as simple as so:

.. tab-set::

    .. tab-item:: Java
        :sync: Java

        .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/tankdrivegamepad/Robot.java
            :language: java
            :lines: 17-20

    .. tab-item:: C++ (Header)
        :sync: C++ (Header)

        .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/TankDriveGamepad/cpp/Robot.cpp
            :language: c++
            :lines: 15-19

    .. tab-item:: Python
        :sync: Python

        .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/TankDrive/robot.py
           :language: python
           :lines: 22-24


### Multi-Motor DifferentialDrive

Many FRC\ |reg| drivetrains have more than 1 motor on each side. Classes derived from ``PWMMotorController`` ([Java](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/hardware/motor/PWMMotorController.html) / [C++](https://github.wpilib.org/allwpilib/docs/beta/cpp/classwpi_1_1_p_w_m_motor_controller.html) / :external:py:class:`Python <wpilib.PWMMotorController>`) have an ``addFollower`` method so that multiple follower motor controllers can be updated when the leader motor controller is commanded. CAN motor controllers have similar features, review the vendor's documentation to see how to use them. The examples below show a 4 motor (2 per side) drivetrain. To extend to more motors, simply create the additional controllers and use additional ``addFollower`` calls.

.. tab-set::

    .. tab-item:: Java
        :sync: Java

        Class variables (e.g. in Robot.java or Subsystem):

        .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/hatchbotinlined/subsystems/DriveSubsystem.java
            :language: java
            :lines: 16-25

        In Robot or Subsystem constructor:

        .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/hatchbotinlined/subsystems/DriveSubsystem.java
            :language: java
            :lines: 43-49

    .. tab-item:: C++ (Header)
        :sync: C++ (Header)

        .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/include/subsystems/DriveSubsystem.hpp
            :language: c++
            :lines: 54, 58-67

    .. tab-item:: C++ (Source)
        :sync: C++ (Source)

        In Robot or Subsystem constructor:

        .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/subsystems/DriveSubsystem.cpp
            :language: c++
            :lines: 18-24

    .. tab-item:: Python
        :sync: Python

        .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/HatchbotInlined/subsystems/drivesubsystem.py
            :language: python
            :lines: 16-30


### Drive Modes

The DifferentialDrive class contains three default methods for controlling skid-steer or WCD robots. Note that you can create your own methods of controlling the robot's driving and have them call tankDrive() with the derived inputs for left and right motors.

The Tank Drive mode is used to control each side of the drivetrain independently (usually with an individual joystick axis controlling each). This example shows how to use the Y-axis of two separate joysticks to run the drivetrain in Tank mode. Construction of the objects has been omitted, for above for drivetrain construction and here for Joystick construction.

The Arcade Drive mode is used to control the drivetrain using speed/throttle and rotation rate. This is typically used either with two axes from a single joystick, or split across joysticks (often on a single gamepad) with the throttle coming from one stick and the rotation from another. This example shows how to use a single joystick with the Arcade mode. Construction of the objects has been omitted, for above for drivetrain construction and here for Joystick construction.

Like Arcade Drive, the Curvature Drive mode is used to control the drivetrain using speed/throttle and rotation rate. The difference is that the rotation control input controls the radius of curvature instead of rate of heading change, much like the steering wheel of a car. This mode also supports turning in place, which is enabled when the third :code:`boolean` parameter is true.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/snippets/differentialdrive/Robot.java
        :language: java
        :lines: 34-42

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/snippets/DifferentialDrive/cpp/Robot.cpp
        :language: c++
        :lines: 37-47

    ```python
    def teleop_periodic(self):
        # Tank drive with a given left and right rates
        self.myDrive.tank_drive(-self.left_stick.get_y(), -self.right_stick.get_y())
        # Arcade drive with a given forward and turn rate
        self.myDrive.arcade_drive(-self.driveStick.get_y(), -self.driveStick.get_x())
        # Curvature drive with a given forward and turn rate, as well as a button for turning in-place.
        self.myDrive.curvature_drive(-self.driveStick.get_y(), -self.driveStick.get_x(), self.driveStick.getButton(1))
    ```

.. todo:: Add RLI for python example above.

## Using the MecanumDrive class to control Mecanum Drive robots

MecanumDrive is a method provided for the control of holonomic drivetrains with Mecanum wheels, such as the Kit of Parts chassis with the mecanum drive upgrade kit, as shown above. Instantiating a MecanumDrive is as simple as so:

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/mecanumdrive/Robot.java
        :language: java
        :lines: 18-21, 26, 31-48

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/MecanumDrive/cpp/Robot.cpp
        :language: c++
        :lines: 37-40, 45-53, 18-23

    .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/2027.0.0a7/examples/robot/MecanumDrive/robot.py
      :language: python
      :lines: 19-23, 26-43

### Mecanum Drive Modes
.. note::
    The drive axis conventions are different from common joystick axis conventions. See the `Axis Conventions`_ above for more information.

The MecanumDrive class contains two different default modes of driving your robot's motors.

- driveCartesian: Angles are measured clockwise from the positive X axis. The robot's speed is independent from its angle or rotation rate.

- drivePolar: Angles are measured counter-clockwise from straight ahead. The speed at which the robot drives (translation) is independent from its angle or rotation rate.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/snippets/mecanumdrive/Robot.java
        :language: java
        :lines: 62-67

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/snippets/MecanumDrive/cpp/Robot.cpp
        :language: c++
        :lines: 38-43

    ```python
    def teleop_periodic(self):
        # Drive using the X, Y, and Z axes of the joystick.
        self.robot_drive.drive_cartesian(-self.stick.get_y(), -self.stick.get_x(), -self.stick.get_z())
        # Drive at 45 degrees relative to the robot, at the speed given by the Y axis of the joystick, with no rotation.
        self.robot_drive.drive_polar(-self.stick.get_y(), Rotation2d.from_degrees(45), 0)
    ```

.. todo:: Add RLI for python example above.

### Field-Oriented Driving

A 4th parameter can be supplied to the ``driveCartesian(double ySpeed, double xSpeed, double zRotation, double gyroAngle)`` method, the angle returned from a Gyro sensor. This will adjust the rotation value supplied. This is particularly useful with mecanum drive since, for the purposes of steering, the robot really has no front, back, or sides. It can go in any direction. Adding the angle in degrees from a gyro object will cause the robot to move away from the drivers when the joystick is pushed forwards, and towards the drivers when it is pulled towards them, regardless of what direction the robot is facing.

The use of field-oriented driving makes often makes the robot much easier to drive, especially compared to a "robot-oriented" drive system where the controls are reversed when the robot is facing the drivers.

Just remember to get the gyro angle each time ``driveCartesian()`` is called.

.. note:: Many teams also like to ramp the joysticks inputs over time to promote a smooth acceleration and reduce jerk.  This can be accomplished with a :ref:`Slew Rate Limiter <docs/software/advanced-controls/filters/slew-rate-limiter:Slew Rate Limiter>`.

## Swerve Drive SW

WPILib does not have a default class for controlling swerve drive. The WPILib swerve drive kinematics classes can be used to help with the math for controlling a swerve drive. See the :doc:`/docs/software/kinematics-and-odometry/swerve-drive-kinematics` section for more information on the kinematics of swerve drive and how to use the WPILib swerve drive kinematics classes. See the :doc:`/docs/software/kinematics-and-odometry/swerve-drive-odometry` section for more information on the odometry of swerve drive and how to use the WPILib swerve drive odometry classes. These are used in the SwerveBot ([Java](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/swervebot), [C++](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/SwerveBot), [Python](https://github.com/robotpy/mostrobotpy/tree/main/examples/robot/SwerveBot)) and SwerveDrivePoseEstimator ([Java](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-7/wpilibjExamples/src/main/java/org/wpilib/examples/swervedriveposeestimator), [C++](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-7/wpilibcExamples/src/main/cpp/examples/SwerveDrivePoseEstimator)) examples.

### Third Party Swerve Drive Libraries

There are also third party libraries for controlling swerve drive. These libraries typically include classes for controlling the swerve modules and the drivetrain as a whole, and may also include features such as odometry and path following. See the vendor's documentation for more information on how to use these libraries.

[AdvantageKit Swerve](https://docs.advantagekit.org/getting-started/template-projects): Thare are templates provided by AdvantageKit for controlling swerve drive robots for users of the AdvantageKit library.

[CTRE Swerve Project Generator](https://v6.docs.ctr-electronics.com/en/latest/docs/tuner/tuner-swerve/index.html): This is a tool provided by CTRE to generate swerve drive code for their motor controllers, encoders, and gyro.

[Rev Max Swerve Template](https://github.com/REVrobotics/MAXSwerve-Java-Template): This is a template provided by REV Robotics for controlling their MAX Swerve drive system.

[Thrifty Swerve Generator](https://docs.home.thethriftybot.com/pages/thrifty-config.html): This is a tool provided by ThriftyBot to generate swerve drive code for their motor controllers and encoders.

[Yet Another Mechanism System (YAMS)](https://yagsl.gitbook.io/yams/documentation/tutorials/swerve-drive): This is a generic mechanism library that includes support for swerve drive.
