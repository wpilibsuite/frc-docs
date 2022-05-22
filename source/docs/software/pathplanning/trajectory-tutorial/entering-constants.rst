Step 2: Entering the Calculated Constants
=========================================

.. note:: In C++, it is important that the feedforward constants be entered as the correct unit type.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

Now that we have our system constants, it is time to place them in our code.  The recommended place for this is the ``Constants`` file of the :ref:`standard command-based project structure <docs/software/commandbased/structuring-command-based-project:Constants>`.

The relevant parts of the constants file from the RamseteCommand Example Project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/RamseteCommand>`__) can be seen below.

Feedforward/Feedback Gains
--------------------------

Firstly, we must enter the feedforward and feedback gains which we obtained from the identification tool.

.. note:: Feedforward and feedback gains do *not*, in general, transfer across robots.  Do *not* use the gains from this tutorial for your own robot.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2020.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/Constants.java
      :language: java
      :lines: 44-54
      :linenos:
      :lineno-start: 44

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2020.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/Constants.h
      :language: c++
      :lines: 46-56
      :linenos:
      :lineno-start: 46

DifferentialDriveKinematics
---------------------------

Additionally, we must create an instance of the ``DifferentialDriveKinematics`` class, which allows us to use the trackwidth (i.e. horizontal distance between the wheels) of the robot to convert from chassis speeds to wheel speeds.  As elsewhere, we keep our units in meters.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2020.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/Constants.java
      :language: java
      :lines: 32-34
      :linenos:
      :lineno-start: 32

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2020.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/Constants.h
      :language: c++
      :lines: 35-36
      :linenos:
      :lineno-start: 35

Max Trajectory Velocity/Acceleration
------------------------------------

We must also decide on a nominal max acceleration and max velocity for the robot during path-following.  The maximum velocity value should be set somewhat below the nominal free-speed of the robot.  Due to the later use of the ``DifferentialDriveVoltageConstraint``, the maximum acceleration value is not extremely crucial.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ffc69d406cdba3890a2eb4d6c2fbaa07e4497d56/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/Constants.java
      :language: java
      :lines: 57-58
      :linenos:
      :lineno-start: 57

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ffc69d406cdba3890a2eb4d6c2fbaa07e4497d56/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/Constants.h
      :language: c++
      :lines: 61-62
      :linenos:
      :lineno-start: 61

Ramsete Parameters
------------------

Finally, we must include a pair of parameters for the RAMSETE controller.  The values shown below should work well for most robots, provided distances have been correctly measured in meters - for more information on tuning these values (if it is required), see :ref:`docs/software/advanced-controls/trajectories/ramsete:Constructing the Ramsete Controller Object`.

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2020.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/ramsetecommand/Constants.java
      :language: java
      :lines: 65-67
      :linenos:
      :lineno-start: 65

  .. group-tab:: C++ (Header)

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2020.3.2/wpilibcExamples/src/main/cpp/examples/RamseteCommand/include/Constants.h
      :language: c++
      :lines: 63-66
      :linenos:
      :lineno-start: 63
