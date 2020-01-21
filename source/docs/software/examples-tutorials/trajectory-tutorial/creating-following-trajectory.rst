Step 4: Creating and Following a Trajectory
===========================================

With our drive subsystem written, it is now time to generate a trajectory and write an autonomous command to follow it.

As per the :ref:`standard command-based project structure <docs/software/commandbased/structuring-command-based-project:Structuring a Command-Based Robot Project>`, we will do this in the ``getAutonomousCommand`` method of the ``RobotContainer`` class.  The full method from the RamseteCommand Example Project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand>`__) can be seen below.  The rest of the article will break down the different parts of the method in more detail.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 82-140
      :linenos:
      :lineno-start: 82

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 46-88
      :linenos:
      :lineno-start: 46

Configuring the Trajectory Constraints
--------------------------------------

First, we must set some configuration parameters for the trajectory which will ensure that the generated trajectory is followable.

Creating a Voltage Constraint
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The first piece of configuration we will need is a voltage constraint.  This will ensure that the generated trajectory never commands the robot to go faster than it is capable of achieving with the given voltage supply:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 89-96
      :linenos:
      :lineno-start: 89

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 47-51
      :linenos:
      :lineno-start: 47

Notice that we set the maximum voltage to 10V, rather than the nominal battery voltage of 12V.  This gives us some "headroom" to deal with "voltage sag" during operation.

Creating the Configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^

Now that we have our voltage constraint, we can create our ``TrajectoryConfig`` instance, which wraps together all of our path constraints:

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 98-105
      :linenos:
      :lineno-start: 98

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 53-59
      :linenos:
      :lineno-start: 53

Generating the Trajectory
-------------------------

With our trajectory configuration in hand, we are now ready to generate our trajectory.  For this example, we will be generating a "clamped cubic" trajectory - this means we will specify full robot poses at the endpoints, and positions only for interior waypoints (also known as "knot points").  As elsewhere, all distances are in meters.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 108-120
      :linenos:
      :lineno-start: 108

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 61-70
      :linenos:
      :lineno-start: 61

.. note:: Instead of generating the trajectory on the roboRIO as outlined above, one can also :ref:`import a PathWeaver JSON <docs/software/wpilib-tools/pathweaver/integrating-robot-program:Importing a PathWeaver JSON>`.

Creating the RamseteCommand
---------------------------

.. todo:: link to ``relativeTo`` api docs once they're uploaded

.. note:: It is very important that the initial robot pose match the first pose in the trajectory.  For the purposes of our example, the robot will be reliably starting at a position of ``(0,0)`` with a heading of ``0``.  In actual use, however, it is probably not desirable to base your coordinate system on the robot position, and so the starting position for both the robot and the trajectory should be set to some other value.  If you wish to use a trajectory that has been defined in robot-centric coordinates in such a situation, you can transform it to be relative to the robot's current pose using the ``transformBy`` method.

.. note:: For more information about transforming trajectories, see :ref:`here <docs/software/advanced-control/trajectories/transforming-trajectories:Transforming Trajectories>`.

Now that we have a trajectory, we can create a command that, when executed, will follow that trajectory.  To do this, we use the ``RamseteCommand`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj2/command/RamseteCommand.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1RamseteCommand.html>`__)

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/RobotContainer.java
      :language: java
      :lines: 122-136
      :linenos:
      :lineno-start: 122

  .. group-tab:: C++ (Source)

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/RamseteCommand/cpp/RobotContainer.cpp
      :language: c++
      :lines: 72-88
      :linenos:
      :lineno-start: 72

This declaration is fairly substantial, so we'll go through it argument-by-argument:

1. The trajectory: This is the trajectory to be followed; accordingly, we pass the command the trajectory we just constructed in our earlier steps.
2. The pose supplier: This is a method reference (or lambda) to the :ref:`drive subsystem method that returns the pose <docs/software/examples-tutorials/trajectory-tutorial/creating-drive-subsystem:Odometry Accessor Method>`.  The RAMSETE controller needs the current pose measurement to determine the required wheel outputs.
3. The RAMSETE controller: This is the ``RamseteController`` object (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/controller/RamseteController.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1RamseteController.html>`__) that will perform the path-following computation that translates the current measured pose and trajectory state into a chassis speed setpoint.
4. The drive feedforward: This is a ``SimpleMotorFeedforward`` object (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/controller/SimpleMotorFeedforward.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1SimpleMotorFeedforward.html>`__) that will automatically perform the correct feedforward calculation with the feedforward gains (``kS``, ``kV``, and ``kA``) that we obtained from the drive characterization tool.
5. The drive kinematics: This is the ``DifferentialDriveKinematics`` object (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/kinematics/DifferentialDriveKinematics.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1DifferentialDriveKinematics.html>`__) that we constructed earlier in our constants file, and will be used to convert chassis speeds to wheel speeds.
6. The wheel speed supplier: This is a method reference (or lambda) to the :ref:`drive subsystem method that returns the wheel speeds <docs/software/examples-tutorials/trajectory-tutorial/creating-drive-subsystem:Encoder Accessor Method>`
7. The left-side PIDController: This is the ``PIDController`` object (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/controller/PIDController.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1PIDController.html>`__) that will track the left-side wheel speed setpoint, using the P gain that we obtained from the drive characterization tool.
8. The right-side PIDController: This is the ``PIDController`` object (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/controller/PIDController.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc2_1_1PIDController.html>`__) that will track the right-side wheel speed setpoint, using the P gain that we obtained from the drive characterization tool.
9. The output consumer: This is a method reference (or lambda) to the :ref:`drive subsystem method that passes the voltage outputs to the drive motors <docs/software/examples-tutorials/trajectory-tutorial/creating-drive-subsystem:Voltage-Based Drive Method>`.
10. The robot drive: This is the drive subsystem itself, included to ensure the command does not operate on the drive at the same time as any other command that uses the drive.

Finally, note that we append a final "stop" command in sequence after the path-following command, to ensure that the robot stops moving at the end of the trajectory.

Video
-----

If all has gone well, your robot's autonomous routine should look something like this:

.. raw:: html

  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;"> <iframe src="https://www.youtube.com/embed/yVmJDOE3M2Y" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe> </div>

.. raw:: html

  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;"> <iframe src="https://www.youtube.com/embed/FLn1bFqlkL0" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe> </div>
