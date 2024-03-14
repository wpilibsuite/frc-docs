Combining Motion Profiling and PID Control with ProfiledPIDController
=====================================================================

.. note:: For a guide on implementing the ``ProfiledPIDController`` class in the :ref:`command-based framework <docs/software/commandbased/what-is-command-based:What Is "Command-Based" Programming?>` framework, see :ref:`docs/software/commandbased/profilepid-subsystems-commands:Combining Motion Profiling and PID in Command-Based`.

In the previous article, we saw how to use the ``TrapezoidProfile`` class to create and use a trapezoidal motion profile.  The example code from that article demonstrates manually composing the ``TrapezoidProfile`` class with the external PID control feature of a "smart" motor controller.

This combination of functionality (a motion profile for generating setpoints combined with a PID controller for following them) is extremely common.  To facilitate this, WPILib comes with a ``ProfiledPIDController`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/math/controller/ProfiledPIDController.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_profiled_p_i_d_controller.html>`__, :external:py:class:`Python <wpimath.controller.ProfiledPIDController>`) that does most of the work of combining these two functionalities.  The API of the ``ProfiledPIDController`` is very similar to that of the ``PIDController``, allowing users to add motion profiling to a PID-controlled mechanism with very few changes to their code.

Using the ProfiledPIDController class
-------------------------------------

.. note:: In C++, the ``ProfiledPIDController`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

.. note:: Much of the functionality of ``ProfiledPIDController`` is effectively identical to that of ``PIDController``.  Accordingly, this article will only cover features that are substantially-changed to accommodate the motion profiling functionality.  For information on standard ``PIDController`` features, see :ref:`docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib`.


Constructing a ProfiledPIDController
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: C++ is often able to infer the type of the inner classes, and thus a simple initializer list (without the class name) can be sent as a parameter.  The full class name is included in the example below for clarity.

Creating a ``ProfiledPIDController`` is nearly identical to :ref:`creating a PIDController <docs/software/advanced-controls/controllers/pidcontroller:Constructing a PIDController>`.  The only difference is the need to supply a set of :ref:`trapezoidal profile constraints <docs/software/advanced-controls/controllers/trapezoidal-profiles:Constraints>`, which will be automatically forwarded to the internally-generated ``TrapezoidProfile`` instances:

.. tab-set-code::

  .. code-block:: java

    // Creates a ProfiledPIDController
    // Max velocity is 5 meters per second
    // Max acceleration is 10 meters per second
    ProfiledPIDController controller = new ProfiledPIDController(
      kP, kI, kD,
      new TrapezoidProfile.Constraints(5, 10));

  .. code-block:: c++

    // Creates a ProfiledPIDController
    // Max velocity is 5 meters per second
    // Max acceleration is 10 meters per second
    frc::ProfiledPIDController<units::meters> controller(
      kP, kI, kD,
      frc::TrapezoidProfile<units::meters>::Constraints{5_mps, 10_mps_sq});

  .. code-block:: python

    from wpimath.controller import ProfiledPIDController
    from wpimath.trajectory import TrapezoidProfile

    # Creates a ProfiledPIDController
    # Max velocity is 5 meters per second
    # Max acceleration is 10 meters per second
    controller = ProfiledPIDController(
      kP, kI, kD,
      TrapezoidProfile.Constraints(5, 10))

Goal vs Setpoint
^^^^^^^^^^^^^^^^

A major difference between a standard ``PIDController`` and a ``ProfiledPIDController`` is that the actual *setpoint* of the control loop is not directly specified by the user.  Rather, the user specifies a *goal* position or state, and the setpoint for the controller is computed automatically from the generated motion profile between the current state and the goal.  So, while the user-side call looks mostly identical:

.. tab-set-code::

  .. code-block:: java

    // Calculates the output of the PID algorithm based on the sensor reading
    // and sends it to a motor
    motor.set(controller.calculate(encoder.getDistance(), goal));

  .. code-block:: c++

    // Calculates the output of the PID algorithm based on the sensor reading
    // and sends it to a motor
    motor.Set(controller.Calculate(encoder.GetDistance(), goal));

  .. code-block:: python

    # Calculates the output of the PID algorithm based on the sensor reading
    # and sends it to a motor
    motor.set(controller.calculate(encoder.getDistance(), goal))

The specified ``goal`` value (which can be either a position value or a ``TrapezoidProfile.State``, if nonzero velocity is desired) is *not* necessarily the *current* setpoint of the loop - rather, it is the *eventual* setpoint once the generated profile terminates.

Getting/Using the Setpoint
~~~~~~~~~~~~~~~~~~~~~~~~~~

Since the ``ProfiledPIDController`` goal differs from the setpoint, is if often desirable to poll the current setpoint of the controller (for instance, to get values to use with :ref:`feedforward <docs/software/advanced-controls/controllers/combining-feedforward-feedback:Using Feedforward Components with PID>`).  This can be done with the ``getSetpoint()`` method.

The returned setpoint might then be used as in the following example:

.. tab-set-code::

  .. code-block:: java

    double lastSpeed = 0;
    double lastTime = Timer.getFPGATimestamp();

    // Controls a simple motor's position using a SimpleMotorFeedforward
    // and a ProfiledPIDController
    public void goToPosition(double goalPosition) {
      double pidVal = controller.calculate(encoder.getDistance(), goalPosition);
      double acceleration = (controller.getSetpoint().velocity - lastSpeed) / (Timer.getFPGATimestamp() - lastTime);
      motor.setVoltage(
          pidVal
          + feedforward.calculate(controller.getSetpoint().velocity, acceleration));
      lastSpeed = controller.getSetpoint().velocity;
      lastTime = Timer.getFPGATimestamp();
    }

  .. code-block:: c++

    units::meters_per_second_t lastSpeed = 0_mps;
    units::second_t lastTime = frc2::Timer::GetFPGATimestamp();

    // Controls a simple motor's position using a SimpleMotorFeedforward
    // and a ProfiledPIDController
    void GoToPosition(units::meter_t goalPosition) {
      auto pidVal = controller.Calculate(units::meter_t{encoder.GetDistance()}, goalPosition);
      auto acceleration = (controller.GetSetpoint().velocity - lastSpeed) /
          (frc2::Timer::GetFPGATimestamp() - lastTime);
      motor.SetVoltage(
           pidVal +
          feedforward.Calculate(controller.GetSetpoint().velocity, acceleration));
      lastSpeed = controller.GetSetpoint().velocity;
      lastTime = frc2::Timer::GetFPGATimestamp();
    }

  .. code-block:: python

    from wpilib import Timer
    from wpilib.controller import ProfiledPIDController
    from wpilib.controller import SimpleMotorFeedforward


    def __init__(self):

        # Assuming encoder, motor, controller are already defined
        self.lastSpeed = 0
        self.lastTime = Timer.getFPGATimestamp()

        # Assuming feedforward is a SimpleMotorFeedforward object
        self.feedforward = SimpleMotorFeedforward(ks=0.0, kv=0.0, ka=0.0)

    def goToPosition(self, goalPosition: float):

        pidVal = self.controller.calculate(self.encoder.getDistance(), goalPosition)
        acceleration = (self.controller.getSetpoint().velocity - self.lastSpeed) / (Timer.getFPGATimestamp() - self.lastTime)

        self.motor.setVoltage(
            pidVal
            + self.feedforward.calculate(self.controller.getSetpoint().velocity, acceleration))

        self.lastSpeed = controller.getSetpoint().velocity
        self.lastTime = Timer.getFPGATimestamp()

Complete Usage Example
----------------------

A more complete example of ``ProfiledPIDController`` usage is provided in the ElevatorProfilePID example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorprofiledpid>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/ElevatorProfiledPID/cpp>`__, `Python <https://github.com/robotpy/examples/tree/main/ElevatorProfiledPID>`__):

.. tab-set-code::

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/elevatorprofiledpid/Robot.java
    :language: java
    :lines: 5-
    :linenos:
    :lineno-start: 5

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/ElevatorProfiledPID/cpp/Robot.cpp
    :language: c++
    :lines: 5-
    :linenos:
    :lineno-start: 5

  .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/d89b0587a1e1111239728140466c7dc4324d4005/ElevatorProfiledPID/robot.py
    :language: python
    :lines: 8-
    :linenos:
    :lineno-start: 8
