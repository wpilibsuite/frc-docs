Step 4: Creating and Following a Trajectory
===========================================

With our drive subsystem written, it is now time to generate a trajectory and write an autonomous command to follow it.

As per the :ref:`standard command-based project structure <docs/software/commandbased/structuring-command-based-project:Structuring a Command-Based Robot Project>`, we will do this in the ``getAutonomousCommand`` method of the ``RobotContainer`` class.  The full method from the RamseteCommand Example Project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/RamseteCommand>`__) can be seen below.  The rest of the article will break down the different parts of the method in more detail.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/1f7c9adeeb148d044e6cccf1505f1512229241bd/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 75-137
      :linenos:
      :lineno-start: 75

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/1f7c9adeeb148d044e6cccf1505f1512229241bd/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 47-92
      :linenos:
      :lineno-start: 47

Configuring the Trajectory Constraints
--------------------------------------

First, we must set some configuration parameters for the trajectory which will ensure that the generated trajectory is followable.

Creating a Voltage Constraint
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The first piece of configuration we will need is a voltage constraint.  This will ensure that the generated trajectory never commands the robot to go faster than it is capable of achieving with the given voltage supply:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 89-96
      :linenos:
      :lineno-start: 89

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/1f7c9adeeb148d044e6cccf1505f1512229241bd/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 48-52
      :linenos:
      :lineno-start: 48

Notice that we set the maximum voltage to 10V, rather than the nominal battery voltage of 12V.  This gives us some "headroom" to deal with "voltage sag" during operation.

Creating the Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^

Now that we have our voltage constraint, we can create our ``TrajectoryConfig`` instance, which wraps together all of our path constraints:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 98-105
      :linenos:
      :lineno-start: 98

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/1f7c9adeeb148d044e6cccf1505f1512229241bd/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 54-60
      :linenos:
      :lineno-start: 54

Generating the Trajectory
-------------------------

With our trajectory configuration in hand, we are now ready to generate our trajectory.  For this example, we will be generating a "clamped cubic" trajectory - this means we will specify full robot poses at the endpoints, and positions only for interior waypoints (also known as "knot points").  As elsewhere, all distances are in meters.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 108-120
      :linenos:
      :lineno-start: 108

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/1f7c9adeeb148d044e6cccf1505f1512229241bd/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 62-71
      :linenos:
      :lineno-start: 62

.. note:: Instead of generating the trajectory on the roboRIO as outlined above, one can also :ref:`import a PathWeaver JSON <docs/software/pathplanning/pathweaver/integrating-robot-program:Importing a PathWeaver JSON>`.

Creating the RamseteCommand
---------------------------

We will first reset our robot's pose to the starting pose of the trajectory. This ensures that the robot's location on the coordinate system and the trajectory's starting position are the same.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 137-139
      :linenos:
      :lineno-start: 137

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/1f7c9adeeb148d044e6cccf1505f1512229241bd/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 86-87
      :linenos:
      :lineno-start: 86


It is very important that the initial robot pose match the first pose in the trajectory.  For the purposes of our example, the robot will be reliably starting at a position of ``(0,0)`` with a heading of ``0``.  In actual use, however, it is probably not desirable to base your coordinate system on the robot position, and so the starting position for both the robot and the trajectory should be set to some other value.  If you wish to use a trajectory that has been defined in robot-centric coordinates in such a situation, you can transform it to be relative to the robot's current pose using the ``transformBy`` method (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/trajectory/Trajectory.html#transformBy(edu.wpi.first.math.geometry.Transform2d)>`_,  `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_trajectory.html#a8edfbd82347bbf32ddfb092679336cd8>`_).  For more information about transforming trajectories, see :ref:`docs/software/advanced-controls/trajectories/transforming-trajectories:Transforming Trajectories`.

Now that we have a trajectory, we can create a command that, when executed, will follow that trajectory.  To do this, we use the ``RamseteCommand`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/RamseteCommand.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_ramsete_command.html>`__)

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 122-136
      :linenos:
      :lineno-start: 122

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/1f7c9adeeb148d044e6cccf1505f1512229241bd/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 73-84
      :linenos:
      :lineno-start: 73

This declaration is fairly substantial, so we'll go through it argument-by-argument:

1. The trajectory: This is the trajectory to be followed; accordingly, we pass the command the trajectory we just constructed in our earlier steps.
2. The pose supplier: This is a method reference (or lambda) to the :ref:`drive subsystem method that returns the pose <docs/software/pathplanning/trajectory-tutorial/creating-drive-subsystem:Odometry Accessor Method>`.  The RAMSETE controller needs the current pose measurement to determine the required wheel outputs.
3. The RAMSETE controller: This is the ``RamseteController`` object (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/controller/RamseteController.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_ramsete_controller.html>`__) that will perform the path-following computation that translates the current measured pose and trajectory state into a chassis speed setpoint.
4. The drive feedforward: This is a ``SimpleMotorFeedforward`` object (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/controller/SimpleMotorFeedforward.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_simple_motor_feedforward.html>`__) that will automatically perform the correct feedforward calculation with the feedforward gains (``kS``, ``kV``, and ``kA``) that we obtained from the drive identification tool.
5. The drive kinematics: This is the ``DifferentialDriveKinematics`` object (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/kinematics/DifferentialDriveKinematics.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_differential_drive_kinematics.html>`__) that we constructed earlier in our constants file, and will be used to convert chassis speeds to wheel speeds.
6. The wheel speed supplier: This is a method reference (or lambda) to the :ref:`drive subsystem method that returns the wheel speeds <docs/software/pathplanning/trajectory-tutorial/creating-drive-subsystem:Encoder Accessor Method>`
7. The left-side PIDController: This is the ``PIDController`` object (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/controller/PIDController.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_p_i_d_controller.html>`__) that will track the left-side wheel speed setpoint, using the P gain that we obtained from the drive identification tool.
8. The right-side PIDController: This is the ``PIDController`` object (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/controller/PIDController.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_p_i_d_controller.html>`__) that will track the right-side wheel speed setpoint, using the P gain that we obtained from the drive identification tool.
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
