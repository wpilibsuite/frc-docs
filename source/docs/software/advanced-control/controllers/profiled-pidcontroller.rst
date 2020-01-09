Combining Motion Profiling and PID Control with ProfiledPIDController
=====================================================================

.. note:: For a guide on implementing the ``ProfiledPIDController`` class in the :ref:`command-based framework <docs/software/commandbased/what-is-command-based:What Is "Command-Based" Programming?>` framework, see :ref:`docs/software/commandbased/profilepid-subsystems-commands:Combining Motion Profiling and PID in Command-Based`.

In the previous article, we saw how to use the ``TrapezoidProfile`` class to create and use a trapezoidal motion profile.  The example code from that article demonstrates manually composing the ``TrapezoidProfile`` class with the external PID control feature of a "smart" motor controller.

This combination of functionality (a motion profile for generating setpoints combined with a PID controller for following them) is extremely common.  To facilitate this, WPILib comes with a ``ProfiledPIDController`` class (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/controller/ProfiledPIDController.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1ProfiledPIDController.html>`__) that does most of the work of combining these two functionalities.  The API of the ``ProfiledPIDController`` is very similar to that of the ``PIDController``, allowing users to add motion profiling to a PID-controlled mechanism with very few changes to their code.

Using the ProfiledPIDController class
-------------------------------------

.. note:: In C++, the ``ProfiledPIDController`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

.. note:: Much of the functionality of ``ProfiledPIDController`` is effectively identical to that of ``PIDController``.  Accordingly, this article will only cover features that are substantially-changed to accomodate the motion profiling functionality.  For information on standard ``PIDController`` features, see :ref:`docs/software/advanced-control/controllers/pidcontroller:PID Control in WPILib`.


Constructing a ProfiledPIDController
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: C++ is often able to infer the type of the inner classes, and thus a simple initializer list (without the class name) can be sent as a parameter.  The full class name is included in the example below for clarity.

Creating a ``ProfiledPIDController`` is nearly identical to :ref:`creating a PIDController <docs/software/advanced-control/controllers/pidcontroller:Constructing a PIDController>`.  The only difference is the need to supply a set of :ref:`trapezoidal profile constraints <docs/software/advanced-control/controllers/trapezoidal-profiles:Constraints>`, which will be automatically forwarded to the internally-generated ``TrapezoidProfile`` instances:

.. tabs::

  .. code-tab:: java

    // Creates a ProfiledPIDController
    // Max velocty is 5 meters per second
    // Max acceleration is 10 meters per second
    ProfiledPIDController controller = new ProfiledPIDController(
      kP, kI, kD,
      new TrapezoidProfile.Constraints(5, 10));

  .. code-tab:: c++

    // Creates a ProfiledPIDController
    // Max velocty is 5 meters per second
    // Max acceleration is 10 meters per second
    frc::ProfiledPIDController<units::meters> controller(
      kP, kI, kD,
      frc::TrapezoidProfile<units::meters>::Constraints{5_mps, 10_mps_sq});

Goal vs Setpoint
^^^^^^^^^^^^^^^^

A major difference between a standard ``PIDController`` and a ``ProfiledPIDController`` is that the actual *setpoint* of the control loop is not directly specified by the user.  Rather, the user specifies a *goal* position or state, and the setpoint for the controller is computed automatically from the generated motion profile between the current state and the goal.  So, while the user-side call looks mostly identical:

.. tabs::

  .. code-tab:: java

    // Calculates the output of the PID algorithm based on the sensor reading
    // and sends it to a motor
    motor.set(controller.calculate(encoder.getDistance(), goal));

  .. code-tab:: c++

    // Calculates the output of the PID algorithm based on the sensor reading
    // and sends it to a motor
    motor.Set(controller.Calculate(encoder.GetDistance(), goal));

The specified ``goal`` value (which can be either a position value or a ``TrapezoidProfile.State``, if nonzero velocity is desired) is *not* necessarily the *current* setpoint of the loop - rather, it is the *eventual* setpoint once the generated profile terminates.

Getting/Using the Setpoint
~~~~~~~~~~~~~~~~~~~~~~~~~~

Since the ``ProfiledPIDController`` goal differs from the setpoint, is if often desirable to poll the current setpoint of the controller (for instance, to get values to use with :ref:`feedforward <docs/software/advanced-control/controllers/combining-feedforward-feedback:Using Feedforward Components with PID>`).  This can be done with the ``getSetpoint()`` method.

The returned setpoint might then be used as in the following example:

.. tabs::

  .. code-tab:: java

    // Controls a simple motor's position using a SimpleMotorFeedforward
    // and a ProfiledPIDController
    public void goToPosition(double goalPosition) {
      motor.setVoltage(
          controller.calculate(encoder.getDistance(), goalPosition)
          + feedforward.calculate(controller.getSetpoint().position,
                                  controller.getSetpoint().velocity));
    }

  .. code-tab:: c++

    // Controls a simple motor's position using a SimpleMotorFeedforward
    // and a ProfiledPIDController
    void goToPosition(units::meter_t goalPosition) {
      motor.setVoltage(
          controller.Calculate(units::meter_t(encoder.GetDistance()), goalPosition)
          + feedforward.Calculate(controller.GetSetpoint().position,
                                  controller.GetSetpoint().velocity));
    }

Complete Usage Example
----------------------

A more complete example of ``ProfiledPIDController`` usage is provided in the ElevatorProfilePID example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorprofiledpid>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/master/wpilibcExamples/src/main/cpp/examples/ElevatorProfiledPID/cpp>`__):

.. tabs::

  .. group-tab:: Java

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorprofiledpid/Robot.java
      :language: java
      :lines: 8-
      :linenos:
      :lineno-start: 8

  .. group-tab:: C++

    .. remoteliteralinclude:: https://github.com/wpilibsuite/allwpilib/raw/master/wpilibcExamples/src/main/cpp/examples/ElevatorProfiledPID/cpp/Robot.cpp
      :language: c++
      :lines: 8-
      :linenos:
      :lineno-start: 8
