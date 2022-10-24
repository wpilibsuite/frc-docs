Bang-Bang Control with BangBangController
=========================================

The :term:`bang-bang control` algorithm is a control strategy that employs only two states: on (when the measurement is below the setpoint) and off (otherwise).  This is roughly equivalent to a proportional loop with infinite gain.

This may initially seem like a poor control strategy, as PID loops are known to become unstable as the gains become large - and indeed, it is a *very bad idea to use a bang-bang controller on anything other than velocity control of a high-inertia mechanism*.

However, when controlling the velocity of high-inertia mechanisms under varying loads (like a shooter flywheel), a bang-bang controller can yield faster recovery time and thus better/more consistent performance than a proportional controller.  Unlike an ordinary P loop, a bang-bang controller is *asymmetric* - that is, the controller turns on when the process variable is below the setpoint, and does nothing otherwise.  This allows the control effort in the forward direction to be made as large as possible without risking destructive oscillations as the control loop tries to correct a resulting overshoot.

Asymmetric bang-bang control is provided in WPILib by the BangBangController class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/development/java/edu/wpi/first/math/controller/BangBangController.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/development/cpp/classfrc_1_1_bang_bang_controller.html>`__).

Constructing a BangBangController
---------------------------------

Since a bang-bang controller does not have any gains, it does not need any constructor arguments (one can optionally specify the controller tolerance used by ``atSetpoint``, but it is not required).

.. tabs::

  .. code-tab:: java

    // Creates a BangBangController
    BangBangController controller = new BangBangController();

  .. code-tab:: c++

    // Creates a BangBangController
    frc::BangBangController controller;

Using a BangBangController
--------------------------

.. warning:: Bang-bang control is an extremely aggressive algorithm that relies on response asymmetry to remain stable.  Be *absolutely certain* that your motor controllers have been set to "coast mode" before attempting to control them with a bang-bang controller, or else the braking action will fight the controller and cause potentially destructive oscillation.

Using a bang-bang controller is easy:

.. tabs::

  .. code-tab:: java

    // Controls a motor with the output of the BangBang controller
    motor.set(controller.calculate(encoder.getRate(), setpoint));

  .. code-tab:: c++

    // Controls a motor with the output of the BangBang controller
    motor.Set(controller.Calculate(encoder.GetRate(), setpoint));

Combining Bang Bang Control with Feedforward
--------------------------------------------

Like a PID controller, best results are obtained in conjunction with a :ref:`feedforward <docs/software/advanced-controls/controllers/feedforward:Feedforward Control in WPILib>` controller that provides the necessary voltage to sustain the system output at the desired speed, so that the bang-bang controller is only responsible for rejecting disturbances.  Since the bang-bang controller can *only* correct in the forward direction, however, it may be preferable to use a slightly conservative feedforward estimate to ensure that the shooter does not over-speed.

.. tabs::

  .. code-tab:: java

    // Controls a motor with the output of the BangBang controller and a feedforward
    // Shrinks the feedforward slightly to avoid overspeeding the shooter
    motor.setVoltage(controller.calculate(encoder.getRate(), setpoint) * 12.0 + 0.9 * feedforward.calculate(setpoint));

  .. code-tab:: c++

    // Controls a motor with the output of the BangBang controller and a feedforward
    // Shrinks the feedforward slightly to avoid overspeeding the shooter
    motor.SetVoltage(controller.Calculate(encoder.GetRate(), setpoint) * 12.0 + 0.9 * feedforward.Calculate(setpoint));
