Using the WPILib Classes to Drive your Robot
======================================================

WPILib includes many classes to help make your robot get
driving faster.

Standard drivetrains
--------------------

Differential Drive Robots
^^^^^^^^^^^^^^^^^^^^^^^^^
.. image:: images/diffdrive.jpg
   :width: 600

These drive bases typically have two or more in-line
traction or omni  wheels per side (e.g., 6WD or 8WD) and may
also be known as  "skid-steer", "tank drive", or "West Coast
Drive". The Kit of Parts  drivetrain is an example of a
differential drive. These drivetrains are capable of driving
forward/backward and can turn by driving the two sides in
opposite directions causing the wheels to skid sideways.
These drivetrains are not capable of sideways translational
movement.

Mecanum Drive
^^^^^^^^^^^^^
.. image:: images/mecanumdrive.jpg
   :width: 600

Mecanum drive is a method of driving using specially
designed wheels that allow the robot to drive in any
direction without changing the orientation of the robot. A
robot with a conventional drivetrain (all wheels pointing in
the same direction) must turn in the direction it needs to
drive. A mecanum robot can move in any direction without
first turning and is called a holonomic drive. The wheels
(shown on this robot) have rollers that cause the forces
from driving to be applied at a 45 degree angle rather than
straight forward as in the case of a conventional drive.

When viewed from the top, the rollers on a mecanum
drivetrain should form an 'X' pattern. This results in the
force vectors (when driving the wheel forward) on the front
two wheels pointing forward and inward and the rear two
wheels pointing forward and outward. By spinning the wheels
in different directions, various components of the force
vectors cancel out, resulting in the desired robot movement.
A quick chart of different movements has been provided
below, drawing out the force vectors for each of these
motions may help in understanding how these drivetrains
work. By varying the speeds of the wheels in addition to the
direction, movements can be combined resulting in
translation in any direction and rotation, simultaneously.

Drive Class Conventions
-----------------------
.. note:: This article describes conventions and defaults used by the WPILib Drive classes (DifferentialDrive, MecanumDrive, and KilloughDrive). For further details on using these classes, see the subsequent articles.

Motor Inversion
^^^^^^^^^^^^^^^
By default, the class inverts the motor outputs for the
right side of the drivetrain. Generally this will mean that
no inversion needs to be done on the individual
SpeedController objects. To disable this behavior, use the
setRightSideInverted() method.

Squaring Inputs & Input Deadband
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
When driving robots, it is often desirable to manipulate the
joystick inputs such that the robot has finer control at low
speeds while still using the full output range. One way to
accomplish this is by squaring the joystick input, then
reapplying the sign. By default the Differential Drive class
will square the inputs. If this is not desired (e.g. if
passing values in from a PIDController), use one of the
drive methods with the squaredInputs parameter and set it to
false.

By default, the Differential Drive class applies an input
deadband of .02. This means that input values with a
magnitude below .02 (after any squaring as described above)
will be set to 0. In most cases these small inputs result
from imperfect joystick centering and are not sufficient to
cause drivetrain movement, the deadband helps reduce
unnecessary motor heating that may result from applying these
small values to the drivetrain. To change the deadband, use
the setDeadband() method.

Motor Safety
^^^^^^^^^^^^
Motor Safety is a mechanism in WPILib that takes the concept of a
watchdog and breaks it out into one watchdog (Motor Safety timer)
for each individual actuator. Note that this protection mechanism
is in addition to the System Watchdog which is controlled by the
Network Communications code and the FPGA and will disable all
actuator outputs if it does not receive a valid data packet for
125ms.

The purpose of the Motor Safety mechanism is the same as the
purpose of a watchdog timer, to disable mechanisms which may
cause harm to themselves, people or property if the code
locks up and does not properly update the actuator output.
Motor Safety breaks this concept out on a per actuator basis
so that you can appropriately determine where it is
necessary and where it is not. Examples of mechanisms that
should have motor safety enabled are systems like drive
trains and arms. If these systems get latched on a
particular value they could cause damage to their
environment or themselves. An example of a mechanism that
may not need motor safety is a spinning flywheel for a
shooter. If this mechanism gets latched on a particular
value it will simply continue spinning until the robot is
disabled. By default Motor Safety is enabled for RobotDrive
objects and disabled for all other speed controllers and
servos.

The Motor Safety feature operates by maintaining a timer
that tracks how long it has been since the feed() method has
been called for that actuator. Code in the Driver Station
class initiates a comparison of these timers to the timeout
values for any actuator with safety enabled every 5 received
packets (100ms nominal). The set() methods of each speed
controller class and the set() and setAngle() methods of the
servo class call feed() to indicate that the output of the
actuator has been updated.

The Motor Safety interface of speed controllers can be interacted with by the user using the following methods:

.. tabs::

    .. code-tab:: java

        exampleJaguar.setSafetyEnabled(true);
        exampleJaguar.setSafetyEnabled(false);
        exampleJaguar.setExpiration(.1);
        exampleJaguar.feed()

    .. code-tab:: c++

        exampleJaguar->SetSafetyEnabled(true);
        exampleJaguar->SetSafetyEnabled(false);
        exampleJaguar->SetExpiration(.1);
        exampleJaguar->Feed();



By default all RobotDrive objects enable Motor Safety.
Depending on the mechanism and the structure of your
program, you may wish to configure the timeout length of the
motor safety (in seconds). The timeout length is configured
on a per actuator basis and is not a global setting. The
default (and minimum useful) value is 100ms.


Axis Conventions
^^^^^^^^^^^^^^^^
.. image:: images/axisconventions.jpg
   :width: 600

This library uses the NED axes convention (North-East-Down
as external reference in the world frame). The positive X
axis points ahead, the positive Y axis points right, and the
positive Z axis points down. Rotations follow the right-hand
rule, so clockwise rotation around the Z axis is positive.

.. warning:: This convention is different than the convention for joysticks which typically have -Y as Up (commonly mapped to throttle) and +X as Right. Pay close attention to the examples below if you want help with typical Joystick->Drive mapping.

Using the DifferentialDrive class to control Differential Drive (WCD) robots
----------------------------------------------------------------------------
.. note:: WPILib provides separate Robot Drive classes for the most common drive train configurations (differential, mecanum, and Killough).  The DifferentialDrive class handles the differential drivetrain configuration. These drive bases typically have two or more in-line traction or omni wheels per side (e.g., 6WD or 8WD) and may also be known as "skid-steer", "tank drive", or "West Coast Drive". The Kit of Parts drivetrain is an example of a differential drive. There are methods to control the drive with 3 different styles ("Tank", "Arcade", or "Curvature"), explained in the article below.

DifferentialDrive is a method provided for the control of
"skid-steer" or "West Coast" drivetrains, such as the Kit of
Parts chassis. Instantiating a DifferentialDrive is as simple
as so:

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Robot {
                Spark m_left = new Spark(1);
                Spark m_right = new Spark(2);
                DifferentialDrive m_drive = new DifferentialDrive(m_left, m_right);

                public void robotInit() {
                    m_left.setInverted(true); // if you want to invert motor outputs, you must do so here
                }

    .. group-tab:: C++ (Header)

        .. code-block:: cpp

            class Robot {
                private:
                    frc::Spark m_left{1};
                    frc::Spark m_right{2};
                    frc::DifferentialDrive m_drive{m_left, m_right};

    .. group-tab:: C++ (Source)

        .. code-block:: cpp

            void Robot::RobotInit() {
                m_left.SetInverted(true); // if you want to invert motor outputs, you must do so here
            }



Multi-Motor DifferentialDrive with SpeedControllerGroups
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Many FRC drivetrains have more than 1 motor on each side. In
order to use these with DifferentialDrive, the motors on
each side have to be collected into a single
SpeedController, using the SpeedControllerGroup class. The
examples below show a 4 motor (2 per side) drivetrain. To
extend to more motors, simply create the additional
controllers and pass them all into the SpeedController group
constructor (it takes an arbitrary number of inputs).

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Robot {
                Spark m_frontLeft = new Spark(1);
                Spark m_rearLeft = new Spark(2);
                SpeedControllerGroup m_left = new SpeedControllerGroup(m_frontLeft, m_rearLeft);

                Spark m_frontRight = new Spark(3);
                Spark m_rearRight = new Spark(4);
                SpeedControllerGroup m_right = new SpeedControllerGroup(m_frontRight, m_rearRight);
                DifferentialDrive m_drive = new DifferentialDrive(m_left, m_right);

                public void robotInit() {
                    m_left.setInverted(true); // if you want to invert the entire side you can do so here
                }

    .. group-tab:: C++ (Header)

        .. code-block:: c++

            class Robot {
                public:
                    frc::Spark m_frontLeft{1};
                    frc::Spark m_rearLeft{2};
                    frc::SpeedControllerGroup m_left{m_frontLeft, m_rearLeft};

                    frc::Spark m_frontRight{3};
                    frc::Spark m_rearRight{4};
                    frc::SpeedControllerGroup m_right{m_frontRight, m_rearRight};

                    frc::DifferentialDrive m_drive{m_left, m_right};

    .. group-tab:: C++ (Source)

        .. code-block:: c++

            void Robot::RobotInit() {
                m_left.SetInverted(true); // if you want to invert the entire side you can do so here
            }




Drive Modes
^^^^^^^^^^^
.. note::
    The DifferentialDrive class contains three different
    default modes of driving your robot's motors.

    - Tank Drive, which controls the left and right side independently
    - Arcade Drive, which controls a forward and turn speed
    - Curvature Drive, a subset of Arcade Drive, which makes your robot handle like a car with constant-curvature turns.

As stated above, the DifferentialDrive class contains three
default methods for controlling skid-steer or WCD robots.
Note that you can create your own methods of controlling the
robot's driving and have them call tankDrive() with the
derived inputs for left and right motors.

The Tank Drive mode is used to control each side of the
drivetrain independently (usually with an individual
joystick axis controlling each). This example shows how to
use the Y-axis of two separate joysticks to run the
drivetrain in Tank mode. Construction of the objects has
been omitted, for above for drivetrain construction and here
for Joystick construction.

The Arcade Drive mode is used to control the drivetrain
using speed/throttle and rotation rate. This is typically
used either with two axes from a single joystick, or split
across joysticks (often on a single gamepad) with the
throttle coming from one stick and the rotation from
another. This example shows how to use a single joystick
with the Arcade mode. Construction of the objects has been
omitted, for above for drivetrain construction and here for
Joystick construction.

Like Arcade Drive, the Curvature Drive mode is used to
control the drivetrain using speed/throttle and rotation
rate. The difference is that the rotation control is
attempting to control radius of curvature instead of rate of
heading change. This mode also has a quick-turn parameter
that is used to engage a sub-mode that allows for turning in
place. This example shows how to use a single joystick with
the Curvature mode. Construction of the objects has been
omitted, for above for drivetrain construction and here for
Joystick construction.

.. tabs::

    .. code-tab:: java

        public void teleopPeriodic() {
            myDrive.tankDrive(leftStick.getY(), rightStick.getY());
            myDrive.arcadeDrive(driveStick.getY(),driveStick.getX());
            myDrive.curvatureDrive(driveStick.getY(), driveStick.getX(), driveStick.GetButton(1));
        }

    .. code-tab:: c++

        void TeleopPeriodic() override {
            myDrive.TankDrive(leftStick.GetY(), rightStick.GetY());
            myDrive.ArcadeDrive(driveStick.GetY(), driveStick.GetX());
            myDrive.CurvatureDrive(driveStick.GetY(), driveStick.GetX(), driveStick.GetButton(1));
        }
