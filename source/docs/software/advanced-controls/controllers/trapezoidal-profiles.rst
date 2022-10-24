Trapezoidal Motion Profiles in WPILib
=====================================

.. todo:: link to conceptual motion profiling article

.. note:: This article covers the in-code generation of trapezoidal motion profiles.  Documentation describing the involved concepts in more detail is forthcoming.

.. note:: For a guide on implementing the ``TrapezoidProfile`` class in the :ref:`command-based framework <docs/software/commandbased/what-is-command-based:What Is "Command-Based" Programming?>` framework, see :ref:`docs/software/commandbased/profile-subsystems-commands:Motion Profiling through TrapezoidProfileSubsystems and TrapezoidProfileCommands`.

.. note:: The ``TrapezoidProfile`` class, used on its own, is most useful when composed with a custom controller (such as a "smart" motor controller with a built-in PID functionality).  To integrate it with a WPILib ``PIDController``, see :doc:`profiled-pidcontroller`.

While feedforward and feedback control offer convenient ways to achieve a given setpoint, we are often still faced with the problem of generating setpoints for our mechanisms.  While the naive approach of immediately commanding a mechanism to its desired state may work, it is often suboptimal.  To improve the handling of our mechanisms, we often wish to command mechanisms to a *sequence* of setpoints that smoothly interpolate between its current state, and its desired goal state.

To help users do this, WPILib provides a ``TrapezoidProfile`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/math/trajectory/TrapezoidProfile.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_trapezoid_profile.html>`__).

Creating a TrapezoidProfile
---------------------------

.. note:: In C++, the ``TrapezoidProfile`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

Constraints
^^^^^^^^^^^

.. note:: The various :ref:`feedforward helper classes <docs/software/advanced-controls/controllers/feedforward:Feedforward Control in WPILib>` provide methods for calculating the maximum simultaneously-achievable velocity and acceleration of a mechanism.  These can be very useful for calculating appropriate motion constraints for your ``TrapezoidProfile``.

In order to create a trapezoidal motion profile, we must first impose some constraints on the desired motion.  Namely, we must specify a maximum velocity and acceleration that the mechanism will be expected to achieve during the motion.  To do this, we create an instance of the ``TrapezoidProfile.Constraints`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/math/trajectory/TrapezoidProfile.Constraints.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_trapezoid_profile_1_1_constraints.html>`__):

.. tabs::

  .. code-tab:: java

    // Creates a new set of trapezoidal motion profile constraints
    // Max velocity of 10 meters per second
    // Max acceleration of 20 meters per second squared
    new TrapezoidProfile.Constraints(10, 20);

  .. code-tab:: c++

    // Creates a new set of trapezoidal motion profile constraints
    // Max velocity of 10 meters per second
    // Max acceleration of 20 meters per second squared
    frc::TrapezoidProfile<units::meters>::Constraints{10_mps, 20_mps_sq};

Start and End States
^^^^^^^^^^^^^^^^^^^^

Next, we must specify the desired starting and ending states for our mechanisms using the ``TrapezoidProfile.State`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/math/trajectory/TrapezoidProfile.State.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_trapezoid_profile_1_1_state.html>`__).  Each state has a position and a velocity:

.. tabs::

  .. code-tab:: java

    // Creates a new state with a position of 5 meters
    // and a velocity of 0 meters per second
    new TrapezoidProfile.State(5, 0);

  .. code-tab:: c++

    // Creates a new state with a position of 5 meters
    // and a velocity of 0 meters per second
    frc::TrapezoidProfile<units::meters>::State{5_m, 0_mps};

Putting It All Together
^^^^^^^^^^^^^^^^^^^^^^^

.. note:: C++ is often able to infer the type of the inner classes, and thus a simple initializer list (without the class name) can be sent as a parameter.  The full class names are included in the example below for clarity.

Now that we know how to create a set of constraints and the desired start/end states, we are ready to create our motion profile.  The ``TrapezoidProfile`` constructor takes 3 parameters, in order: the constraints, the goal state, and the initial state.

.. tabs::

  .. code-tab:: java

    // Creates a new TrapezoidProfile
    // Profile will have a max vel of 5 meters per second
    // Profile will have a max acceleration of 10 meters per second squared
    // Profile will end stationary at 5 meters
    // Profile will start stationary at zero position
    TrapezoidProfile profile = new TrapezoidProfile(new TrapezoidProfile.Constraints(5, 10),
                                                    new TrapezoidProfile.State(5, 0),
                                                    new TrapezoidProfile.State(0, 0));

  .. code-tab:: c++

    // Creates a new TrapezoidProfile
    // Profile will have a max vel of 5 meters per second
    // Profile will have a max acceleration of 10 meters per second squared
    // Profile will end stationary at 5 meters
    // Profile will start stationary at zero position
    frc::TrapezoidProfile<units::meters> profile{
      frc::TrapezoidProfile<units::meters>::Constraints{5_mps, 10_mps_sq},
      frc::TrapezoidProfile<units::meters>::State{5_m, 0_mps},
      frc::TrapezoidProfile<units::meters>::State{0_m, 0_mps}};

Using a ``TrapezoidProfile``
----------------------------

Sampling the Profile
^^^^^^^^^^^^^^^^^^^^

Once we've created a ``TrapezoidProfile``, using it is very simple: to get the profile state at the given time after the profile has started, call the ``calculate()`` method:

.. tabs::

  .. code-tab:: java

    // Returns the motion profile state after 5 seconds of motion
    profile.calculate(5);

  .. code-tab:: c++

    // Returns the motion profile state after 5 seconds of motion
    profile.Calculate(5_s);

Using the State
^^^^^^^^^^^^^^^

The ``calculate`` method returns a ``TrapezoidProfile.State`` class (the same one that was used to specify the initial/end states when constructing the profile).  To use this for actual control, simply pass the contained position and velocity values to whatever controller you wish (for example, a PIDController):

.. tabs::

  .. code-tab:: java

    var setpoint = profile.calculate(elapsedTime);
    controller.calculate(encoder.getDistance(), setpoint.position);

  .. code-tab:: c++

    auto setpoint = profile.Calculate(elapsedTime);
    controller.Calculate(encoder.GetDistance(), setpoint.position.value());

Complete Usage Example
----------------------

.. note:: In this example, the profile is re-computed every timestep.  This is a somewhat different usage technique than is detailed above, but works according to the same principles - the profile is sampled at a time corresponding to the loop period to get the setpoint for the next loop iteration.

A more complete example of ``TrapezoidProfile`` usage is provided in the ElevatorTrapezoidProfile example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatortrapezoidprofile>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/ElevatorTrapezoidProfile/cpp>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatortrapezoidprofile/Robot.java
      :language: java
      :lines: 5-
      :linenos:
      :lineno-start: 5

  .. group-tab:: C++

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2023.1.1-beta-1/wpilibcExamples/src/main/cpp/examples/ElevatorTrapezoidProfile/cpp/Robot.cpp
      :language: c++
      :lines: 5-
      :linenos:
      :lineno-start: 5
