Step 4: Creating and Following a Trajectory
===========================================

With our drive subsystem written, it is now time to generate a trajectory and write an autonomous command to follow it.

As per the :ref:`standard command-based project structure <docs/software/commandbased/structuring-command-based-project:Structuring a Command-Based Robot Project>`, we will do this in the ``getAutonomousCommand`` method of the ``RobotContainer`` class.  The full method from the RamseteCommand Example Project ([Java](https://github.com/wpilibsuite/allwpilib/tree/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand), [C++](https://github.com/wpilibsuite/allwpilib/tree/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand)) can be seen below.  The rest of the article will break down the different parts of the method in more detail.

.. tab-set::

  .. tab-item:: Java
    :sync: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 74-135
      :linenos:
      :lineno-start: 74

  .. tab-item:: C++ (Source)
    :sync: C++ (Source)


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 45-94
      :linenos:
      :lineno-start: 45

Configuring the Trajectory Constraints
--------------------------------------

First, we must set some configuration parameters for the trajectory which will ensure that the generated trajectory is followable.

Creating a Voltage Constraint
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The first piece of configuration we will need is a voltage constraint.  This will ensure that the generated trajectory never commands the robot to go faster than it is capable of achieving with the given voltage supply:

.. tab-set::

  .. tab-item:: Java
    :sync: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 80-88
      :linenos:
      :lineno-start: 80

  .. tab-item:: C++ (Source)
    :sync: C++ (Source)


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 46-50
      :linenos:
      :lineno-start: 46

Notice that we set the maximum voltage to 10V, rather than the nominal battery voltage of 12V.  This gives us some "headroom" to deal with "voltage sag" during operation.

Creating the Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^

Now that we have our voltage constraint, we can create our ``TrajectoryConfig`` instance, which wraps together all of our path constraints:

.. tab-set::

  .. tab-item:: Java
    :sync: Java


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 90-98
      :linenos:
      :lineno-start: 90

  .. tab-item:: C++ (Source)
    :sync: C++ (Source)


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 52-58
      :linenos:
      :lineno-start: 52

Generating the Trajectory
-------------------------

With our trajectory configuration in hand, we are now ready to generate our trajectory.  For this example, we will be generating a "clamped cubic" trajectory - this means we will specify full robot poses at the endpoints, and positions only for interior waypoints (also known as "knot points").  As elsewhere, all distances are in meters.

.. tab-set::

  .. tab-item:: Java
    :sync: Java


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 100-110
      :linenos:
      :lineno-start: 100

  .. tab-item:: C++ (Source)
    :sync: C++ (Source)


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 60-69
      :linenos:
      :lineno-start: 60

.. note:: Instead of generating the trajectory on the roboRIO as outlined above, one can also :ref:`import a PathWeaver JSON <docs/software/pathplanning/pathweaver/integrating-robot-program:Importing a PathWeaver JSON>`.

Creating the RamseteCommand
---------------------------

We will first reset our robot's pose to the starting pose of the trajectory. This ensures that the robot's location on the coordinate system and the trajectory's starting position are the same.

.. tab-set::

  .. tab-item:: Java
    :sync: Java


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 129-131
      :linenos:
      :lineno-start: 129

  .. tab-item:: C++ (Source)
    :sync: C++ (Source)


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 84-86
      :linenos:
      :lineno-start: 84


It is very important that the initial robot pose match the first pose in the trajectory.  For the purposes of our example, the robot will be reliably starting at a position of ``(0,0)`` with a heading of ``0``.  In actual use, however, it is probably not desirable to base your coordinate system on the robot position, and so the starting position for both the robot and the trajectory should be set to some other value.  If you wish to use a trajectory that has been defined in robot-centric coordinates in such a situation, you can transform it to be relative to the robot's current pose using the ``transformBy`` method ([Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/math/trajectory/Trajectory.html#transformBy(edu.wpi.first.math.geometry.Transform2d)), [C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc_1_1_trajectory.html#a8edfbd82347bbf32ddfb092679336cd8)).  For more information about transforming trajectories, see :ref:`docs/software/advanced-controls/trajectories/transforming-trajectories:Transforming Trajectories`.

Now that we have a trajectory, we can create a command that, when executed, will follow that trajectory.  To do this, we use the ``RamseteCommand`` class ([Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/wpilibj2/command/RamseteCommand.html), [C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc2_1_1_ramsete_command.html))

.. tab-set::

  .. tab-item:: Java
    :sync: Java


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 112-127
      :linenos:
      :lineno-start: 112

  .. tab-item:: C++ (Source)
    :sync: C++ (Source)


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 71-82
      :linenos:
      :lineno-start: 71

This declaration is fairly substantial, so we'll go through it argument-by-argument:

1. The trajectory: This is the trajectory to be followed; accordingly, we pass the command the trajectory we just constructed in our earlier steps.
2. The pose supplier: This is a method reference (or lambda) to the :ref:`drive subsystem method that returns the pose <docs/software/pathplanning/trajectory-tutorial/creating-drive-subsystem:Odometry Accessor Method>`.  The RAMSETE controller needs the current pose measurement to determine the required wheel outputs.
3. The RAMSETE controller: This is the ``RamseteController`` object ([Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/math/controller/RamseteController.html), [C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc_1_1_ramsete_controller.html)) that will perform the path-following computation that translates the current measured pose and trajectory state into a chassis speed setpoint.
4. The drive feedforward: This is a ``SimpleMotorFeedforward`` object ([Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/math/controller/SimpleMotorFeedforward.html), [C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc_1_1_simple_motor_feedforward.html)) that will automatically perform the correct feedforward calculation with the feedforward gains (``kS``, ``kV``, and ``kA``) that we obtained from the drive identification tool.
5. The drive kinematics: This is the ``DifferentialDriveKinematics`` object ([Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/math/kinematics/DifferentialDriveKinematics.html), [C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc_1_1_differential_drive_kinematics.html)) that we constructed earlier in our constants file, and will be used to convert chassis speeds to wheel speeds.
6. The wheel speed supplier: This is a method reference (or lambda) to the :ref:`drive subsystem method that returns the wheel speeds <docs/software/pathplanning/trajectory-tutorial/creating-drive-subsystem:Encoder Accessor Method>`
7. The left-side PIDController: This is the ``PIDController`` object ([Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/math/controller/PIDController.html), [C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc_1_1_p_i_d_controller.html)) that will track the left-side wheel speed setpoint, using the P gain that we obtained from the drive identification tool.
8. The right-side PIDController: This is the ``PIDController`` object ([Java](https://github.wpilib.org/allwpilib/docs/development/java/edu/wpi/first/math/controller/PIDController.html), [C++](https://github.wpilib.org/allwpilib/docs/development/cpp/classfrc_1_1_p_i_d_controller.html)) that will track the right-side wheel speed setpoint, using the P gain that we obtained from the drive identification tool.
9. The output consumer: This is a method reference (or lambda) to the :ref:`drive subsystem method that passes the voltage outputs to the drive motors <docs/software/pathplanning/trajectory-tutorial/creating-drive-subsystem:Voltage-Based Drive Method>`.
10. The robot drive: This is the drive subsystem itself, included to ensure the command does not operate on the drive at the same time as any other command that uses the drive.

Finally, note that we append a final "stop" command in sequence after the path-following command, to ensure that the robot stops moving at the end of the trajectory.

Video
-----

If all has gone well, your robot's autonomous routine should look something like this:

.. raw:: html

  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;"> <iframe src="https://www.youtube-nocookie.com/embed/yVmJDOE3M2Y" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe> </div>

.. raw:: html

  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;"> <iframe src="https://www.youtube-nocookie.com/embed/FLn1bFqlkL0" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe> </div>
