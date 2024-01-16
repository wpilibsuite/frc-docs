Coordinate System
=================

Coordinate systems are used in FRC programming in several places. A few of the common places are: robot movement, joystick input, pose estimation, AprilTags, and path planning.

It is important to understand the basics of the coordinate system used throughout WPILib and other common tools for programming an FRC robot, such as PathPlanner. Many teams intuitively  think of a coordinate system that is different from what is used in WPILib, and this leads to problems that need to be tracked down throughout the season. It is worthwhile to take a few minutes to understand the coordinate system, and come back here as a reference when programming. It's not very difficult to get robot movement with a joystick working without getting the coordinate system right, but it will be much more difficult to build on code using a different coordinate system to add pose estimation with AprilTags and path planning for autonomous.

WPILib coordinate system
------------------------

In most cases, WPILib uses the NWU axes convention (North-West-Up as external reference in the world frame.) In the NWU axes convention, where the positive X axis points ahead, the positive Y axis points left, and the positive Z axis points up. When viewed with each positive axis pointing toward you, counter-clockwise (CCW) is a positive value and clockwise (CW) is a negative value.

.. image:: images/coordinate-system/robot-3d.svg
   :scale: 200
   :alt: NWU axes convention in three dimensions

The figure above shows the coordinate system in relation to an FRC robot. The figure below shows this same coordinate system when viewed from the top (with the Z axis pointing toward you.) This is how you can think of the robot's coordinates in 2D.

.. image:: images/coordinate-system/robot-2d.svg
   :scale: 200
   :alt: NWU axes convention in two dimensions

Rotation conventions
--------------------

In most cases in WPILib programming, 0° is aligned with the positive X axis, and 180° is aligned with the negative X axis. CCW rotation is positive, so 90° is aligned with the positive Y axis, and -90° is aligned with the negative Y axis.

.. image:: images/coordinate-system/rotation.svg
   :scale: 200
   :alt: Unit circle

The figure above shows the unit circle with common angles labeled in degrees (°) and radians (rad). Notice that rotation to the right is negative, and the range for the whole unit circle is -180° to 180° (-Pi radians to Pi radians).

There are some places you may choose to use a different range, such as 0° to 360° or 0 to 1 rotation, but be aware that many core WPILib classes and FRC tools are built with the unit circle above.

.. note:: The range is (-180, 180], meaning it is exclusive of -180° and inclusive of 180°.

Joystick and XBox Controller coordinate system
----------------------------------------------

Joysticks, including the sticks on XBox controllers, don't use the same NWU coordinate system. They use the NED (North-East-Down) convention, where the positive X axis points ahead, the positive Y axis points right, and the positive Z axis points down. When viewed with each positive axis pointing toward you, counter-clockwise (CCW) is a positive value and clockwise (CW) is a negative value.

.. image:: images/coordinate-system/joystick-3d.svg
   :scale: 200
   :alt: NED axes convention

It's important to note that joystick axes values are rotations around the respective axes, not translations. In practical terms, this means:

- pushing forward on the joystick (toward the positive X axis) is a CW rotation around the Y axis, so you get a negative Y value.
- pushing to the right (toward the postivie Y axis) is a CCW rotation around the X axis, so you get a positive X value.
- twisting the joystick CW (toward the positive Y axis) is a CCW rotation around the Z axis, so you get a positive Z value.

Using Joystick and XBox Controller input to drive a robot
---------------------------------------------------------

You may have noticed, the coordinate system used by WPILib for the robot is not the same as the coordinate system used for joysticks. Care needs to be taken to understand the difference, and properly pass driver input to the drive subsystem.

Non-holonomic drivetrain example
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Non-holonomic means the robot drivetrain cannot move side-to-side (strafe). This type of drivetrain can move forward and backward along the X axis, and rotate around the Z axis. Consider a common arcade drive scheme using a single joystick where the driver pushes the joystick forward/backwrd for forward/backward robot movement, and push the joystick left/right to rotate the robot left/right.

The code snippet below uses the ``DifferentialDrive`` and ``Joystick`` classes to drive the robot with the arcade scheme described above. ``DifferentialDrive`` uses the robot coordinate system defined above, and ``Joystick`` uses the joystick coordinate system.

.. tab-set-code::

    .. code-block:: java

        public void teleopPeriodic() {
            // Arcade drive with a given forward and turn rate
            myDrive.arcadeDrive(-driveStick.getY(), -driveStick.getX());
        }

    .. code-block:: c++

        void TeleopPeriodic() override {
            // Arcade drive with a given forward and turn rate
            myDrive.ArcadeDrive(-driveStick.GetY(), -driveStick.GetX());
        }

    .. code-block:: python

       def teleopPeriodic(self):
           # Arcade drive with a given forward and turn rate
           self.myDrive.arcadeDrive(-self.driveStick.getY(), -self.driveStick.getX())

The code calls the ``DifferentialDrive.arcadeDrive(xSpeed, zRotation)`` method, with values it gets from the ``Joystick`` class:

- The first argument is ``xSpeed``

    - Robot: ``xSpeed`` is the speed along the robot's X axis, which is forward/backward.
    - Joystick: The driver sets forward/backward speed by rotating the joystick along its Y axis, which is pushing the joystick forward/backward.
    - Code: Moving the joystick forward is negative Y rotation, whereas robot forward is along the positive X axis. This means the joystick value needs to be inverted by placing a - (minus sign) in front of the value.

- The second argument is ``zRotation``

    - Robot: ``zRotation`` is the speed of rotation along the robot's Z axis, which is rotating left/right.
    - Joystick: The driver sets rotation speed by rotating the joystick along its X axis, which is pushing the joystick left/right.
    - Code: Moving the joystick to the right is positive X rotation, whereas robot rotation is CCW positive. This means the joystick value needs to be inverted by placing a - (minus sign) in front of the value.

Mecanum drivetrain example
^^^^^^^^^^^^^^^^^^^^^^^^^^

Mecanum drivetrains are holonomic, meaning they have the ability to move side-to-side. This type of drivetrain can move forward/backward and rotate around the Z axis like non-holonomic drivetrains, but it can also move side-to-side along the robot's Y axis. Consider a common arcade drive scheme using a single joystick where the driver pushes the joystick forward/backward for forward/backward robot movement, pushes the joystick left/right to move side-to-side, and twists the joystick to rotate the robot.

.. tab-set-code::

    .. code-block:: java

        public void teleopPeriodic() {
            // Drive using the X, Y, and Z axes of the joystick.
            m_robotDrive.driveCartesian(-m_stick.getY(), -m_stick.getX(), -m_stick.getZ());
        }

    .. code-block:: c++

        void TeleopPeriodic() override {
            // Drive using the X, Y, and Z axes of the joystick.
            m_robotDrive.driveCartesian(-m_stick.GetY(), -m_stick.GetX(), -m_stick.GetZ());
        }

    .. code-block:: python

       def teleopPeriodic(self):
           // Drive using the X, Y, and Z axes of the joystick.
           self.robotDrive.driveCartesian(-self.stick.getY(), -self.stick.getX(), -self.stick.getZ())

The code calls the ``MecanumDrive.driveCartesian(xSpeed, ySpeed, zRotation)`` method, with values it gets from the ``Joystick`` class:

- The first argument is ``xSpeed``

    - Robot: ``xSpeed`` is the speed along the robot's X axis, which is forward/backward.
    - Joystick: The driver sets forward/backward speed by rotating the joystick along its Y axis, which is pushing the joystick forward/backward.
    - Code: Moving the joystick forward is negative Y rotation, whereas robot forward is along the positive X axis. This means the joystick value needs to be inverted by placing a - (minus sign) in front of the value.


- The second argument is ``ySpeed``

    - Robot: ``ySpeed`` is the speed along the robot's Y axis, which is left/right.
    - Joystick: The driver sets left/right speed by rotating the joystick along its X axis, which is pushing the joystick left/right.
    - Code: Moving the joystick to the right is positive X rotation, whereas robot right is along the negative Y axis. This means the joystick value needs to be inverted by placing a - (minus sign) in front of the value.

- The third argument is ``zRotation``

    - Robot: ``zRotation`` is the speed of rotation along the robot's Z axis, which is rotating left/right.
    - Joystick: The driver sets rotation speed by twisting the joystick along its Z axis, which is twisting the joystick left/right.
    - Code: Twisting the joystick to the right is positive Z rotation, whereas robot rotation is CCW positive. This means the joystick value needs to be inverted by placing a - (minus sign) in front of the value.

Swerve drivetrain example
^^^^^^^^^^^^^^^^^^^^^^^^^^

Like mecanum drivetrains, swerve drivetrains are holonomic and have the ability to move side-to-side. Joystick control can be handled the same way for all holonomic drivetrains, but WPILib doesn't have a built-in robot drive class for swerve. Swerve coding is described in other sections of this documentation, but an example of using joystick input to set ``ChassisSpeeds`` values is included below. Consider the same common arcade drive scheme described in the mecanum section above. The scheme uses a single joystick where the driver pushes the joystick forward/backward for forward/backward robot movement, pushes the joystick left/right to move side-to-side, and twists the joystick to rotate the robot.

.. tab-set-code::

   .. code-block:: java

      // Drive using the X, Y, and Z axes of the joystick.
      var speeds = new ChassisSpeeds(-m_stick.getY(), -m_stick.getX(), -m_stick.getZ());

   .. code-block:: c++

      // Drive using the X, Y, and Z axes of the joystick.
      frc::ChassisSpeeds speeds{-m_stick.GetY(), -m_stick.GetX(), -m_stick.GetZ()};

   .. code-block:: python

      // Drive using the X, Y, and Z axes of the joystick.
      speeds = ChassisSpeeds(-self.stick.getY(), -self.stick.getX(), -self.stick.getZ())

The three arguments to the ``ChassisSpeeds`` constructor are the same as ``driveCartesian`` in the mecanum section above; ``xSpeed``, ``ySpeed``, and ``zRotation``. See the description of the arguments, and their joystick input in the section above.
