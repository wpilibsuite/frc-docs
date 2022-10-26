PID Control in WPILib
=====================

.. note:: This article focuses on in-code implementation of PID control in WPILib. For a conceptual explanation of the working of a PIDController, see :ref:`docs/software/advanced-controls/introduction/introduction-to-pid:Introduction to PID`

.. note:: For a guide on implementing PID control through the :ref:`command-based framework <docs/software/commandbased/what-is-command-based:What Is "Command-Based" Programming?>`, see :ref:`docs/software/commandbased/pid-subsystems-commands:PID Control through PIDSubsystems and PIDCommands`.

WPILib supports PID control of mechanisms through the ``PIDController`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/controller/PIDController.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_p_i_d_controller.html>`__).  This class handles the feedback loop calculation for the user, as well as offering methods for returning the error, setting tolerances, and checking if the control loop has reached its setpoint within the specified tolerances.

Using the PIDController Class
-----------------------------

.. note:: The ``PIDController`` class in the ``frc`` namespace is deprecated - C++ teams should use the one in the ``frc2`` namespace, instead.  Likewise, Java teams should use the class in the ``edu.wpi.first.math.controller`` package.

Constructing a PIDController
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: While ``PIDController`` may be used asynchronously, it does *not* provide any thread safety features - ensuring threadsafe operation is left entirely to the user, and thus asynchronous usage is recommended only for advanced teams.

In order to use WPILib's PID control functionality, users must first construct a ``PIDController`` object with the desired gains:

.. tabs::

  .. code-tab:: java

    // Creates a PIDController with gains kP, kI, and kD
    PIDController pid = new PIDController(kP, kI, kD);

  .. code-tab:: c++

    // Creates a PIDController with gains kP, kI, and kD
    frc2::PIDController pid{kP, kI, kD};

An optional fourth parameter can be provided to the constructor, specifying the period at which the controller will be run.  The ``PIDController`` object is intended primarily for synchronous use from the main robot loop, and so this value is defaulted to 20ms.

Using the Feedback Loop Output
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: The ``PIDController`` assumes that the ``calculate()`` method is being called regularly at an interval consistent with the configured period.  Failure to do this will result in unintended loop behavior.

.. warning:: Unlike the old ``PIDController``, the new PIDController does not automatically control an output from its own thread - users are required to call ``calculate()`` and use the resulting output in their own code.

Using the constructed ``PIDController`` is simple: simply call the ``calculate()`` method from the robot's main loop (e.g. the robot's ``autonomousPeriodic()`` method):

.. tabs::

  .. code-tab:: java

    // Calculates the output of the PID algorithm based on the sensor reading
    // and sends it to a motor
    motor.set(pid.calculate(encoder.getDistance(), setpoint));

  .. code-tab:: c++

    // Calculates the output of the PID algorithm based on the sensor reading
    // and sends it to a motor
    motor.Set(pid.Calculate(encoder.GetDistance(), setpoint));

Checking Errors
^^^^^^^^^^^^^^^

.. note:: ``getPositionError()`` and ``getVelocityError()`` are named assuming that the loop is controlling a position - for a loop that is controlling a velocity, these return the velocity error and the acceleration error, respectively.

The current error of the measured process variable is returned by the ``getPositionError()`` function, while its derivative is returned by the ``getVelocityError()`` function:

Specifying and Checking Tolerances
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: If only a position tolerance is specified, the velocity tolerance defaults to infinity.

.. note:: As above, "position" refers to the process variable measurement, and "velocity" to its derivative - thus, for a velocity loop, these are actually velocity and acceleration, respectively.

.. todo:: link to article on motion profiles

Occasionally, it is useful to know if a controller has tracked the setpoint to within a given tolerance - for example, to determine if a command should be ended, or (while following a motion profile) if motion is being impeded and needs to be re-planned.

To do this, we first must specify the tolerances with the ``setTolerance()`` method; then, we can check it with the ``atSetpoint()`` method.

.. tabs::

  .. code-tab:: java

    // Sets the error tolerance to 5, and the error derivative tolerance to 10 per second
    pid.setTolerance(5, 10);

    // Returns true if the error is less than 5 units, and the
    // error derivative is less than 10 units
    pid.atSetpoint();

  .. code-tab:: c++

    // Sets the error tolerance to 5, and the error derivative tolerance to 10 per second
    pid.SetTolerance(5, 10);

    // Returns true if the error is less than 5 units, and the
    // error derivative is less than 10 units
    pid.AtSetpoint();

Resetting the Controller
^^^^^^^^^^^^^^^^^^^^^^^^

It is sometimes desirable to clear the internal state (most importantly, the integral accumulator) of a ``PIDController``, as it may be no longer valid (e.g. when the ``PIDController`` has been disabled and then re-enabled).  This can be accomplished by calling the ``reset()`` method.

Setting a Max Integrator Value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: Integrators introduce instability and hysteresis into feedback loop systems.  It is strongly recommended that teams avoid using integral gain unless absolutely no other solution will do - very often, problems that can be solved with an integrator can be better solved through use of a more-accurate :ref:`feedforward <docs/software/advanced-controls/controllers/feedforward:Feedforward Control in WPILib>`.

A typical problem encountered when using integral feedback is excessive "wind-up" causing the system to wildly overshoot the setpoint.  This can be alleviated in a number of ways - the WPILib ``PIDController`` class enforces an integrator range limiter to help teams overcome this issue.

By default, the total output contribution from the integral gain is limited to be between -1.0 and 1.0.

The range limits may be increased or decreased using the ``setIntegratorRange()`` method.

.. tabs::

  .. code-tab:: java

    // The integral gain term will never add or subtract more than 0.5 from
    // the total loop output
    pid.setIntegratorRange(-0.5, 0.5);

  .. code-tab:: c++

    // The integral gain term will never add or subtract more than 0.5 from
    // the total loop output
    pid.SetIntegratorRange(-0.5, 0.5);

Setting Continuous Input
^^^^^^^^^^^^^^^^^^^^^^^^

.. warning:: If your mechanism is not capable of fully continuous rotational motion (e.g. a turret without a slip ring, whose wires twist as it rotates), *do not* enable continuous input unless you have implemented an additional safety feature to prevent the mechanism from moving past its limit!

.. warning:: The continuous input function does *not* automatically wrap your input values - be sure that your input values, when using this feature, are never outside of the specified range!

Some process variables (such as the angle of a turret) are measured on a circular scale, rather than a linear one - that is, each "end" of the process variable range corresponds to the same point in reality (e.g. 360 degrees and 0 degrees).  In such a configuration, there are two possible values for any given error, corresponding to which way around the circle the error is measured.  It is usually best to use the smaller of these errors.

To configure a ``PIDController`` to automatically do this, use the ``enableContinuousInput()`` method:

.. tabs::

  .. code-tab:: java

    // Enables continuous input on a range from -180 to 180
    pid.enableContinuousInput(-180, 180);

  .. code-tab:: c++

    // Enables continuous input on a range from -180 to 180
    pid.EnableContinuousInput(-180, 180);

Clamping Controller Output
--------------------------

Unlike the old ``PIDController``, the new controller does not offer any output clamping features, as the user is expected to use the loop output themselves.  Output clamping can be easily achieved by composing the controller with WPI's ``clamp()`` function (or ``std::clamp`` in c++):

.. tabs::

  .. code-tab:: java

    // Clamps the controller output to between -0.5 and 0.5
    MathUtil.clamp(pid.calculate(encoder.getDistance(), setpoint), -0.5, 0.5);

  .. code-tab:: c++

    // Clamps the controller output to between -0.5 and 0.5
    std::clamp(pid.Calculate(encoder.GetDistance(), setpoint), -0.5, 0.5);
