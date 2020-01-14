Tuning a PID Controller
=======================

These steps apply to position PID controllers. Velocity PID controllers typically don't need :math:`K_d`.

1. Set :math:`K_p`, :math:`K_i`, and :math:`K_d` to zero.
2. Increase :math:`K_p` until the :term:`output` starts to oscillate around the :term:`setpoint`.
3. Increase :math:`K_d` as much as possible without introducting jittering in the :term:`system response`.

Plot the position :term:`setpoint`, velocity :term:`setpoint`, measured position, and measured velocity. The velocity :term:`setpoint` can be obtained via numerical differentiation of the position :term:`setpoint` (i.e., :math:`v_{desired,k} = \frac{r_k - r_{k-1}}{\Delta t}`). Increase :math:`K_p` until the position tracks well, then increase :math:`K_d` until the velocity tracks well.

If the :term:`controller` settles at an :term:`output` above or below the :term:`setpoint`, one can increase :math:`K_i` such that the :term:`controller` reaches the :term:`setpoint` in a reasonable amount of time. However, a steady-state feedforward is strongly preferred over integral control (especially for PID control).

.. important:: Adding an integral gain to the :term:`controller` is an incorrect way to eliminate :term:`steady-state error`. A better approach would be to tune it with an integrator added to the :term:`plant`, but this requires a :term:`model`. Since we are doing output-based rather than model-based control, our only option is to add an integrator to the :term:`controller`.

Beware that if :math:`K_i` is too large, integral windup can occur. Following a large change in :term:`setpoint`, the integral term can accumulate an error larger than the maximal :term:`control input`. As a result, the system overshoots and continues to increase until this accumulated error is unwound.

.. note:: The :ref:`frc-characterization toolsuite <docs/software/wpilib-tools/robot-characterization/index:Robot Characterization>` can be used to model your system and give accurate Proportional and Derivative values. This is preferred over tuning the controller yourself.

Actuator Saturation
-------------------

A controller calculates its output based on the error between the :term:`reference` and the current :term:`state`. :term:`Plant <plant>` in the real world don't have unlimited control authority available for the controller to apply. When the actuator limits are reached, the controller acts as if the gain has been termporarily reduced.

We'll try to explain this through a bit of math. Let's say we have a controller :math:`u = k(r - x)` where :math:`u` is the :term:`control effort`, :math:`k` is the gain, :math:`r` is the :term:`reference`, and :math:`x` is the current state. Let :math:`u_{max}` be the limit of the actuator's output which is less than the uncapped value of :math:`u` and :math:`k_{max}` be the associated maximum gain. We will now compare the capped and uncapped controllers for the same :term:`reference` and current :term:`state`.

.. math::
   u_{max} &< u \\
   k_{max}(r - x) &< k(r - x) \\
   k_{max} &< k

For the inequality to hold, :math:`k_{max}` must be less than the original value for :math:`k`. This reduced gain is evident in a :term:`system response` when there is a linear change in state instead of an exponetial one as it approaches the :term:`reference`. This is due to the :term:`control effort` no longer following a decaying exponential plot. Onnce the :term:`system` is closer to the :term:`reference`, the controller will stop saturating and produce realistic controller values again.
