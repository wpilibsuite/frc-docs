Common Control Loop Tuning Issues
=================================

There are a number of common issues which can arise while tuning feedforward and feedback controllers.

Integral Term Windup
--------------------

Beware that if :math:`K_i` is too large, integral windup can occur. Following a large change in :term:`setpoint`, the integral term can accumulate an error larger than the maximal :term:`control effort`. As a result, the system overshoots and continues to increase until this accumulated error is unwound.

There are a few ways to mitigate this:

1. Decrease the value of :math:`K_i`, down to zero if possible.
2. Add logic to reset the integrator term to zero if the :term:`output` is too far from the :term:`setpoint`. Some smart motor controllers implement this with a ``setIZone()`` method.
3. Cap the integrator at some maximum value. WPILib's ``PIDController`` implements this with the ``setIntegratorRange()`` method.

.. important:: Most mechanisms in FRC do not require any integral control, and systems that seem to require integral control to respond well probably have an inaccurate feedforward model.

Voltage Sag
-----------

When we operate mechanisms on our robot, we draw current from its battery.  This causes the available "bus voltage" that all the robot mechanisms operate off of to drop.  This means that the performance of our mechanisms will vary depending on the loading and action of the robot - this is not ideal.

To fix this, most voltage controllers offer a "voltage compensation" setting for their internal control loops that keep the output voltage of the control loops constant despite changes in the bus voltage.  The WPILib ``MotorController`` class offers a ``setVoltage`` method can do the same thing if the control loops are being run on the RIO (provided you call it every robot loop iteration).

Keep in mind that voltage compensation cannot increase the voltage applied to the motor beyond what is available on the bus - if your actuator is saturating (described below), you'll have to account for that separately.

Actuator Saturation
-------------------

A controller calculates its output based on the error between the :term:`setpoint` and the current :term:`state`. :term:`Plant <plant>` in the real world don't have unlimited control authority available for the controller to apply - that is to say, real mechanisms have some maximum achievable torque/acceleration and velocity.

If our control gains are too aggressive, our control algorithm might try to move the mechanism faster than it is capable of actually going.  In this case, the mechanism will "saturate", and behave as if the control gains were smaller than they are.  This might adversely affect control response (i.e., result in errors and instability).

If you are encountering problems with actuator saturation, consider modifying your mechanism gearing or powering it with a bigger motor.
