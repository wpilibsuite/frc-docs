Tuning a PID Controller
=======================

As seen in :ref:`Introduction to PID <docs/software/advanced-controls/introduction/introduction-to-pid.rst>`, a PID controller has three *tuned* constants. The numeric values for these constants must be picked carefully for the specific mechanism under control. These constants will generally have different values on different robots. 

There are multiple methods for determining the values for these constants on your particular mechanism.

The :ref:`SysId toolsuite <docs/software/pathplanning/system-identification/index:System Identification>` can be used to model your system and give accurate Proportional and Derivative values. This is preferred for supported mechanism types.

Manual PID Tuning
-----------------

In this section, we'll go through some techniques to manually find reasonable values for the gains in a PID controller.

This is useful if you are not using the :ref:`SysId toolsuite <docs/software/pathplanning/system-identification/index:System Identification>`. Additionally, even if you are using it, it is useful to see and understand the behavior of changing the values of the constants in different situations.

Prerequisites
^^^^^^^^^^^^^

Evaluating the performance of a particular PID gain set is best done by analyzing a plot of :term:`output` and :term:`setpoint`. Additionally, plotting the :term:`output` "control effort" can be useful to determine if the system has reached its maximum ability to exert force.

General Techniques
^^^^^^^^^^^^^^^^^^

Most PID tuning will follow the following steps:

1. Set :math:`K_p`, :math:`K_i`, and :math:`K_d` to zero.
2. Increase :math:`K_p` until the :term:`output` starts to oscillate around the :term:`setpoint`.
3. Increase :math:`K_d` as much as possible without introducing jittering in the :term:`system response`.
4. *In some cases*, increase :math:`K_i` if :term:`output` gets "stuck" before convergin to the :term:`setpoint`.

.. important:: Adding an integral gain to the :term:`controller` is often a sub-optimal way to eliminate :term:`steady-state error`. A better approach would be to tune it with an integrator added to the :term:`plant`, but this requires a :term:`model`. 

.. note:: When "increasing" a value, multiply it by two until the expected effect is observed. Similarly, when "decreasing" a value, divide by two. Once you find the point where the expected effect starts or stops, switch to "bumping" the value up and down by ~10% until the behavior is good enough.

Mechanism Walkthrough - Flywheel 
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. raw:: html

    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;">
      <div class="col" id="flywheel_pid_plot"></div>
      <div class="flex-grid">
         <div class="col" id="flywheel_pid_viz"></div> 
         <div id="flywheel_pid_ctrls"></div>
      </div>
      <script>
         flywheel_pid = new FlywheelPIDF("flywheel_pid");  
         flywheel_pid.runSim(); 
      </script> 
    </div>


Mechanism Walkthrough - Vertical Arm 
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. raw:: html

    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;">
      <div class="col" id="arm_pid_plot"></div>
      <div class="flex-grid">
         <div class="col" id="arm_pid_viz"></div> 
         <div id="arm_pid_ctrls"></div> 
      </div>
      <script>
         arm_pidf = new VerticalArmPIDF("arm_pid");
         arm_pidf.runSim(); 
      </script> 
    </div>



Common Issues
-------------

There are a number of common issues which can arise while tuning PID controllers.

Integral Term Windup
^^^^^^^^^^^^^^^^^^^^

Beware that if :math:`K_i` is too large, integral windup can occur. Following a large change in :term:`setpoint`, the integral term can accumulate an error larger than the maximal :term:`control input`. As a result, the system overshoots and continues to increase until this accumulated error is unwound.

There are a few ways to mitigate this:

1. Decrease the value of :math:`K_i`, down to zero if possible.
2. Add logic to reset the integrator term to zero if the :term:`output` is too far from the :term:`setpoint`. Some smart motor controllers implement this with a ^^setIZone()^^ method.
3. Cap the integrator at some maximum value. WPILib's ^^PIDController^^ implements this with the ^^setIntegratorRange()^^ method.

Actuator Saturation
^^^^^^^^^^^^^^^^^^^

A controller calculates its output based on the error between the :term:`reference` and the current :term:`state`. :term:`Plant <plant>` in the real world don't have unlimited control authority available for the controller to apply. When the actuator limits are reached, the controller acts as if the gain has been temporarily reduced.

Mathematically, suppose we have a controller :math:`u = k(r - x)` where :math:`u` is the :term:`control effort`, :math:`k` is the gain, :math:`r` is the :term:`reference`, and :math:`x` is the current state. Let :math:`u_{max}` be the limit of the actuator's output which is less than the uncapped value of :math:`u` and :math:`k_{max}` be the associated maximum gain. We will now compare the capped and uncapped controllers for the same :term:`reference` and current :term:`state`. 

.. math::
   u_{max} &< u \\
   k_{max}(r - x) &< k(r - x) \\
   k_{max} &< k

For the inequality to hold, :math:`k_{max}` must be less than the original value for :math:`k`. This reduced gain is evident in a :term:`system response` when there is a linear change in state instead of an exponential one as it approaches the :term:`reference`. This is due to the :term:`control effort` no longer following a decaying exponential plot. Once the :term:`system` is closer to the :term:`reference`, the controller will stop saturating and produce realistic controller values again. 
