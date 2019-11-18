PID Control in WPILib
=====================

.. todo:: Link to conceptual PID article when it's finished

.. note:: This article covers the in-code implementation of PID Control with WPILib's provided library classes.  For a conceptual overview of the concepts involved in PID control, see <TODO: link>.

WPILib supports PID control of mechanisms through the ``PIDController`` class (`Java <https://first.wpi.edu/FRC/roborio/development/docs/java/edu/wpi/first/wpilibj/controller/PIDController.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/development/docs/cpp/classfrc2_1_1PIDController.html>`__).  This class handles the feedback loop calculation for the user, as well as offering methods for returning the error, setting tolerances, and checking if the control loop has reached its setpoint within the specified tolerances.

Using the ``PIDController`` Class
---------------------------------

.. note:: The ``PIDController`` class in the ``frc`` namespace is deprecated - C++ teams should use the one in the ``frc2`` namespace, instead.  Likewise, Java teams should use the class in the ``WPIlibj.controller`` package.

Constructing a ``PIDController``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: While ``PIDController`` may be used asynchronously, it does *not* provide any thread safety features - ensuring threadsafe operation is left entirely to the user, and thus asynchronous usage is recommended only for advanced teams.

In order to use WPILib's PID control functionality, users must first construct a ``PIDController`` object with the desired gains:

.. tabs::

  .. code-tab:: java

    // Creates a PIDController with gains kP, kI, and kD
    PIDController pid = new PIDController(kP, kI, kD);

  .. code-tab:: c++

    // Creates a PIDController with gains kP, kI, and kD
    frc2::PIDController pid(kP, kI, kD);

An optional fourth parameter can be provided to the constructor, specifying the period at which the controller will be run.  The ``PIDController`` object is intended primarily for synchronous use from the main robot loop, and so this value is defaulted to 20ms.

Using the Feedback Loop Output
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: The ``PIDController`` assumes that the ``calculate()`` method is being called regularly at an interval consistent with the configured period.  Failure to do this will result in unintended loop behavior.

.. warning:: Unlike the old ``PIDController``, the new PIDController does not automatically control an output from its own thread - users are required to call ``calculate()`` and use the resulting output in their own code.

Using the constructed ``PIDController`` is simple: simply call the ``calculate()`` method from the robot's main loop (e.g. the robot's ``autonomousPeriodic()`` method, or from the ``execute()`` method of a :ref:`command <docs/software/commandbased/commands:Commands>` (the :ref:`PIDCommand and PIDSubsystem <docs/software/commandbased/pid-subsystems-commands:PID Control through PIDSubsystems and PIDCommands>` classes do this for you!):

.. tabs::

  .. code-tab:: java

    // Calculates the output of the PID algorithm based on the sensor reading
    // and sends it to a motor
    motor.set(pid.calculate(encoder.getDistance(), setpoint));

  .. code-tab:: c++

    // Calculates the output of the PID algorithm based on the sensor reading
    // and sends it to a motor
    motor.Set(pid.Calculate(encoder.GetDistance(), setpoint));

