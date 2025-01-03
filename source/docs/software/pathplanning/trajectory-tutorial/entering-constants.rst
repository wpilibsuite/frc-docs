# Step 2: Entering the Calculated Constants

.. note:: In C++, it is important that the feedforward constants be entered as the correct unit type.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

Now that we have our system constants, it is time to place them in our code.  The recommended place for this is the ``Constants`` file of the :ref:`standard command-based project structure <docs/software/commandbased/structuring-command-based-project:Constants>`.

The relevant parts of the constants file from the RamseteCommand Example Project ([Java](https://github.com/wpilibsuite/allwpilib/tree/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand), [C++](https://github.com/wpilibsuite/allwpilib/tree/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand)) can be seen below.

## Feedforward/Feedback Gains

Firstly, we must enter the feedforward and feedback gains which we obtained from the identification tool.

.. note:: Feedforward and feedback gains do *not*, in general, transfer across robots.  Do *not* use the gains from this tutorial for your own robot.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/Constants.java
      :language: java
      :lines: 39-49
      :lineno-match:

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/Constants.h
      :language: c++
      :lines: 47-57
      :lineno-match:

## DifferentialDriveKinematics

Additionally, we must create an instance of the ``DifferentialDriveKinematics`` class, which allows us to use the trackwidth (i.e. horizontal distance between the wheels) of the robot to convert from chassis speeds to wheel speeds.  As elsewhere, we keep our units in meters.

.. tab-set-code::

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/Constants.java
    :language: java
    :lines: 29-31
    :lineno-match:

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/Constants.h
    :language: c++
    :lines: 38-39
    :lineno-match:

## Max Trajectory Velocity/Acceleration

We must also decide on a nominal max acceleration and max velocity for the robot during path-following.  The maximum velocity value should be set somewhat below the nominal free-speed of the robot.  Due to the later use of the ``DifferentialDriveVoltageConstraint``, the maximum acceleration value is not extremely crucial.

.. warning:: Max velocity and acceleration, as defined here, are applied only during trajectory generation.  They do not limit the ``RamseteCommand`` itself, which may give values to the ``DriveSubsystem`` that can cause the robot to greatly exceed these velocities and accelerations.

.. tab-set-code::

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/Constants.java
    :language: java
    :lines: 57-58
    :lineno-match:

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/Constants.h
    :language: c++
    :lines: 61-62
    :lineno-match:

## Ramsete Parameters

Finally, we must include a pair of parameters for the RAMSETE controller.  The values ``b`` and ``zeta`` shown below should work well for most robots, provided distances have been correctly measured in meters.

Larger values of ``b`` make convergence more aggressive like a proportional term whereas larger values of ``zeta`` provide more damping in the response. These controller gains only dictate how the controller will output adjusted velocities. It does NOT affect the actual velocity tracking of the robot. This means that these controller gains are generally robot-agnostic.

.. note:: Gains of ``2.0`` and ``0.7`` for ``b`` and ``zeta`` have been tested repeatedly to produce desirable results when all units were in meters. As such, a zero-argument constructor for ``RamseteController`` exists with gains defaulted to these values.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/Constants.java
      :language: java
      :lines: 60-62
      :lineno-match:

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/Constants.h
      :language: c++
      :lines: 64-67
      :lineno-match:
