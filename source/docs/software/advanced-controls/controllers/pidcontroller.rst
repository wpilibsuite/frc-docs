# PID Control in WPILib

.. note:: This article focuses on in-code implementation of PID control in WPILib. For a conceptual explanation of the working of a PIDController, see :ref:`docs/software/advanced-controls/introduction/introduction-to-pid:Introduction to PID`

.. note:: For a guide on implementing PID control through the :ref:`command-based framework <docs/software/commandbased/what-is-command-based:What Is "Command-Based" Programming?>`, see :ref:`docs/software/commandbased/pid-subsystems-commands:PID Control in Command-based`.

WPILib supports PID control of mechanisms through the ``PIDController`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/math/controller/PIDController.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_p_i_d_controller.html), :external:py:class:`Python <wpimath.controller.PIDController>`).  This class handles the feedback loop calculation for the user, as well as offering methods for returning the error, setting tolerances, and checking if the control loop has reached its setpoint within the specified tolerances.

## Using the PIDController Class

### Constructing a PIDController

.. note:: While ``PIDController`` may be used asynchronously, it does *not* provide any thread safety features - ensuring threadsafe operation is left entirely to the user, and thus asynchronous usage is recommended only for advanced teams.

In order to use WPILib's PID control functionality, users must first construct a ``PIDController`` object with the desired gains:

.. tab-set-code::

  ```java
  // Creates a PIDController with gains kP, kI, and kD
  PIDController pid = new PIDController(kP, kI, kD);
  ```

  ```c++
  // Creates a PIDController with gains kP, kI, and kD
  frc::PIDController pid{kP, kI, kD};
  ```

  ```python
  from wpimath.controller import PIDController
    # Creates a PIDController with gains kP, kI, and kD
  pid = PIDController(kP, kI, kD)
  ```

An optional fourth parameter can be provided to the constructor, specifying the period at which the controller will be run.  The ``PIDController`` object is intended primarily for synchronous use from the main robot loop, and so this value is defaulted to 20ms.

### Using the Feedback Loop Output

.. note:: The ``PIDController`` assumes that the ``calculate()`` method is being called regularly at an interval consistent with the configured period.  Failure to do this will result in unintended loop behavior.

Using the constructed ``PIDController`` is simple: simply call the ``calculate()`` method from the robot's main loop (e.g. the robot's ``autonomousPeriodic()`` method):

.. tab-set-code::

  ```java
  // Calculates the output of the PID algorithm based on the sensor reading
  // and sends it to a motor
  motor.set(pid.calculate(encoder.getDistance(), setpoint));
  ```

  ```c++
  // Calculates the output of the PID algorithm based on the sensor reading
  // and sends it to a motor
  motor.Set(pid.Calculate(encoder.GetDistance(), setpoint));
  ```

  ```python
  # Calculates the output of the PID algorithm based on the sensor reading
  # and sends it to a motor
  motor.set(pid.calculate(encoder.getDistance(), setpoint))
  ```

### Checking Errors

.. note:: ``getPositionError()`` and ``getVelocityError()`` are named assuming that the loop is controlling a position - for a loop that is controlling a velocity, these return the velocity error and the acceleration error, respectively.

The current error of the measured process variable is returned by the ``getPositionError()`` function, while its derivative is returned by the ``getVelocityError()`` function:

### Specifying and Checking Tolerances

.. note:: If only a position tolerance is specified, the velocity tolerance defaults to infinity.

.. note:: As above, "position" refers to the process variable measurement, and "velocity" to its derivative - thus, for a velocity loop, these are actually velocity and acceleration, respectively.

.. todo:: link to article on motion profiles

Occasionally, it is useful to know if a controller has tracked the setpoint to within a given tolerance - for example, to determine if a command should be ended, or (while following a motion profile) if motion is being impeded and needs to be re-planned.

To do this, we first must specify the tolerances with the ``setTolerance()`` method; then, we can check it with the ``atSetpoint()`` method.

.. tab-set-code::

  ```java
  // Sets the error tolerance to 5, and the error derivative tolerance to 10 per second
  pid.setTolerance(5, 10);
    // Returns true if the error is less than 5 units, and the
  // error derivative is less than 10 units
  pid.atSetpoint();
  ```

  ```c++
  // Sets the error tolerance to 5, and the error derivative tolerance to 10 per second
  pid.SetTolerance(5, 10);
    // Returns true if the error is less than 5 units, and the
  // error derivative is less than 10 units
  pid.AtSetpoint();
  ```

  ```python
  # Sets the error tolerance to 5, and the error derivative tolerance to 10 per second
  pid.setTolerance(5, 10)
    # Returns true if the error is less than 5 units, and the
  # error derivative is less than 10 units
  pid.atSetpoint()
  ```

### Resetting the Controller

It is sometimes desirable to clear the internal state (most importantly, the integral accumulator) of a ``PIDController``, as it may be no longer valid (e.g. when the ``PIDController`` has been disabled and then re-enabled).  This can be accomplished by calling the ``reset()`` method.

### Setting a Max Integrator Value

.. note:: Integrators introduce instability and hysteresis into feedback loop systems.  It is strongly recommended that teams avoid using integral gain unless absolutely no other solution will do - very often, problems that can be solved with an integrator can be better solved through use of a more-accurate :ref:`feedforward <docs/software/advanced-controls/controllers/feedforward:Feedforward Control in WPILib>`.

A typical problem encountered when using integral feedback is excessive "wind-up" causing the system to wildly overshoot the setpoint.  This can be alleviated in a number of ways - the WPILib ``PIDController`` class enforces an integrator range limiter to help teams overcome this issue.

By default, the total output contribution from the integral gain is limited to be between -1.0 and 1.0.

The range limits may be increased or decreased using the ``setIntegratorRange()`` method.

.. tab-set-code::

  ```java
  // The integral gain term will never add or subtract more than 0.5 from
  // the total loop output
  pid.setIntegratorRange(-0.5, 0.5);
  ```

  ```c++
  // The integral gain term will never add or subtract more than 0.5 from
  // the total loop output
  pid.SetIntegratorRange(-0.5, 0.5);
  ```

  ```python
  # The integral gain term will never add or subtract more than 0.5 from
  # the total loop output
  pid.setIntegratorRange(-0.5, 0.5)
  ```

### Disabling Integral Gain if the Error is Too High

Another way integral "wind-up" can be alleviated is by limiting the error range where integral gain is active. This can be achieved by setting ``IZone``. If the error is more than ``IZone``, the total accumulated error is reset, disabling integral gain. When the error is equal to or less than IZone, integral gain is enabled.

By default, ``IZone`` is disabled.

``IZone`` may be set using the ``setIZone()`` method. To disable it, set it to infinity.

.. tab-set-code::

  ```java
  // Disable IZone
  pid.setIZone(Double.POSITIVE_INFINITY);
    // Integral gain will not be applied if the absolute value of the error is
  // more than 2
  pid.setIZone(2);
  ```

  ```c++
  // Disable IZone
  pid.SetIZone(std::numeric_limits<double>::infinity());
    // Integral gain will not be applied if the absolute value of the error is
  // more than 2
  pid.SetIZone(2);
  ```

  ```python
  # Disable IZone
  pid.setIZone(math.inf)
    # Integral gain will not be applied if the absolute value of the error is
  # more than 2
  pid.setIZone(2)
  ```

### Setting Continuous Input

.. warning:: If your mechanism is not capable of fully continuous rotational motion (e.g. a turret without a slip ring, whose wires twist as it rotates), *do not* enable continuous input unless you have implemented an additional safety feature to prevent the mechanism from moving past its limit!

Some process variables (such as the angle of a turret) are measured on a circular scale, rather than a linear one - that is, each "end" of the process variable range corresponds to the same point in reality (e.g. 360 degrees and 0 degrees).  In such a configuration, there are two possible values for any given error, corresponding to which way around the circle the error is measured.  It is usually best to use the smaller of these errors.

To configure a ``PIDController`` to automatically do this, use the ``enableContinuousInput()`` method:

.. tab-set-code::

  ```java
  // Enables continuous input on a range from -180 to 180
  pid.enableContinuousInput(-180, 180);
  ```

  ```c++
  // Enables continuous input on a range from -180 to 180
  pid.EnableContinuousInput(-180, 180);
  ```

  ```python
  # Enables continuous input on a range from -180 to 180
  pid.enableContinuousInput(-180, 180)
  ```

## Clamping Controller Output

.. tab-set-code::

  ```java
  // Clamps the controller output to between -0.5 and 0.5
  MathUtil.clamp(pid.calculate(encoder.getDistance(), setpoint), -0.5, 0.5);
  ```

  ```c++
  // Clamps the controller output to between -0.5 and 0.5
  std::clamp(pid.Calculate(encoder.GetDistance(), setpoint), -0.5, 0.5);
  ```

  ```python
  # Python doesn't have a builtin clamp function
  def clamp(v, minval, maxval):
      return max(min(v, maxval), minval)
    # Clamps the controller output to between -0.5 and 0.5
  clamp(pid.calculate(encoder.getDistance(), setpoint), -0.5, 0.5)
  ```

