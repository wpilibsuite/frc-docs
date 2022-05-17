Tuning a PID Controller
=======================

As seen in :ref:`the introduction to PID controller <docs/software/advanced-controls/introduction/introduction-to-pid:Introduction to PID>`, a PID controller has three *tuned* constants. The numeric values for these constants must be picked carefully for the specific mechanism under control. These constants will generally have different values on different robots. 

There are multiple methods for determining the values for these constants on your particular mechanism.

The :ref:`SysId toolsuite <docs/software/pathplanning/system-identification/index:System Identification>` can be used to model your system and give accurate Proportional and Derivative values. This is preferred for supported mechanism types.

Manual PID Tuning
-----------------

In this section, we'll go through some techniques to manually find reasonable values for the gains in a PID controller.

This is useful if you are not using the :ref:`SysId toolsuite <docs/software/pathplanning/system-identification/index:System Identification>`. Additionally, even if you are using it, it is useful to see and understand the behavior of changing the values of the constants in different situations.

Mechanism Walkthrough - Flywheel 
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

For this walkthrough, use this interactive simulation to explore tuning concepts:

.. raw:: html

    <div class="viz-div">
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

Mechanism Description
~~~~~~~~~~~~~~~~~~~~~
The "Flywheel" is nothing more than a circular mass, attached to a gearbox, and driven by a motor. They're commonly used to propel game pieces through the air, into a target. 

In general: the more voltage that is applied to the motor, the faster the flywheel will spin. Once voltage is removed, friction slowly decreases the spinning until the flywheel stops.

To consistently launch a gamepiece, a good first step is to make sure it is spinning at a particular speed before putting a gamepiece into it. 

This design drives the controls goal we will use in this example: Put the correct amount of voltage into the motor to get the flywheel to a certain speed, and then keep it there.

As a test, a gamepiece is injected into the flywheel about halfway through the simulation.

Gearbox inefficiencies and sensor delay is included in this model.

Step 1: Feedback-Only
~~~~~~~~~~~~~~~~~~~~~

We will first attempt to tune the flywheel using only the feedback terms :math:`K_p`, :math:`K_i`, and :math:`K_d`. 

Perform the following:

1. Set :math:`K_p`, :math:`K_i`, :math:`K_d`, and :math:`K_v` to zero.
2. Increase :math:`K_p` until the :term:`output` starts to oscillate around the :term:`setpoint`.
3. Increase :math:`K_d` as much as possible without introducing jittering in the :term:`system response`.
4. *In some cases*, increase :math:`K_i` if :term:`output` gets "stuck" before converging to the :term:`setpoint`.

.. important:: Adding an integral gain to the :term:`controller` is often a sub-optimal way to eliminate :term:`steady-state error`. A better approach would be to tune it with an integrator added to the :term:`plant`, but this requires a :term:`model`. 

.. note:: When "increasing" a value, multiply it by two until the expected effect is observed. Similarly, when "decreasing" a value, divide by two. Once you find the point where the expected effect starts or stops, switch to "bumping" the value up and down by ~10% until the behavior is good enough.

.. raw:: html

   <details>
     <summary>Tuning Solution</summary>


In this particular example, for a setpoint of 1000, values of :math:`K_p = 2.0`, :math:`K_i = 0.0`, and :math:`K_d = 0.04` will produce somewhat reasonable results. It will get better or worse as you change the setpoint.
   
.. raw:: html

   </details> <br>


Step 2: Feed-Forward, then FeedBack
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Tuning with only feedback can produce reasonable results in many cases. However, there is an easier way. Rather than starting with feedback, start by 

Perform the following:

1. Set :math:`K_p`, :math:`K_i`, :math:`K_d`, and :math:`K_v` to zero.
2. Increase :math:`K_v` until the :term:`output` gets fairly close to the :term:`setpoint` as time goes on. You don't have to be perfect, but try to get somewhat close.
3. Increase :math:`K_p` until the :term:`output` starts to oscillate around the :term:`setpoint`.

You may also desire to pull in a small amount of :math:`K_d` to prevent oscillation.

.. raw:: html

   <details>
     <summary>Tuning Solution</summary>


In this particular example, for a setpoint of 1000, values of :math:`K_v = 0.0075` and :math:`K_p = 1.0`  will produce very good results. Other setpoints should work nearly as well too.
   
.. raw:: html

   </details> <br>

In general, this technique should have a much larger range of :math:`K_p` and :math:`K_d` values which produce reasonable results. Additionally, you should not have to use a non-zero :math:`K_i` at all. For these reasons, and many more that will be presented later, Feed-Forward is recommended over :math:`K_i`.


Mechanism Walkthrough - Vertical Arm
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. raw:: html

    <div class="viz-div">
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

Mechanism Description
~~~~~~~~~~~~~~~~~~~~~
The "Vertical Arm" is a mass on a stick, moved up and down by a gearbox, and driven by a motor. They're commonly used to lift gamepieces from the ground, and up higher to place and score them.

Applying voltage to the motor causes a force on the mechanism that drives the arm up or down. If there is no voltage, gravity still acts on the arm to pull it downward.

To consistently place a gamepiece, the arm must move from wherever it is at, to a specific angle which puts the gamepiece at the right height. 

This design drives the controls goal we will use in this example: Put the correct amount of voltage into the motor to get the arm to a certain angle, and then keep it there.

Gearbox inefficiencies and sensor delay is included in this model.


Step 1: Feedback-Only
~~~~~~~~~~~~~~~~~~~~~

Again, we will first attempt to tune this mechanism with using only feedback terms :math:`K_p`, :math:`K_i`, and :math:`K_d`. 

Perform the following:

1. Set :math:`K_p`, :math:`K_i`, :math:`K_d`, and :math:`K_{cosFF}` to zero.
2. Increase :math:`K_p` until the :term:`output` starts to oscillate. You likely won't be able to push it much higher.
3. Increase :math:`K_i` when the :term:`output` gets "stuck" before converging to the :term:`setpoint`.
4. Increase :math:`K_d` as much as possible without introducing jittering in the :term:`system response`. It should help reduce some of the oscillation.

Note that you will likely have trouble finding a set of tunes that behaves acceptably. If you think you have a set, try adjusting the setpoint to be a bit different. You'll likely see the arm behave very differently for small changes in setpoints.

.. raw:: html

   <details>
     <summary>Tuning Solution</summary>


In this particular example, for a setpoint of 0.1, values of :math:`K_p = 12.0`, :math:`K_i = 6.0`, and :math:`K_d = 3.0` will produce somewhat reasonable results. It won't be great for other setpoints.
   
.. raw:: html

   </details> <br>

This is a case where feedback control alone is insufficient to achieve good behavior with the system.

Step 2: Feed-Forward, then FeedBack
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The core reason for this is that gravity pulls on the arm in a :term:`non-linear` fashion. That is to say, the amount of :term:`torque` that gravity exerts on our arm is proportional to the *cosine* of the current angle.

To counteract this, we introduce a feed-forward term which is also proportional to the cosine of the angle. 

.. math::
   V_{ff} = K_{cosFF} * cos(\theta_{arm})

:math:`K_{cosFF}` could be calculated if all the mechanical and physical properties of the system are known. However, since a lot of these are hard to model accurately, we will determine it experimentally.

Perform the following:

1. Set :math:`K_p`, :math:`K_i`, :math:`K_d`, and :math:`K_{cosFF}` to zero.
2. Increase and decrease :math:`K_{cosFF}` until the arm can hold its position with as little movement as possible. In this simulation, you'll want to go out to at least four decimal points.
3. Increase :math:`K_p` until the :term:`output` starts approaches the :term:`setpoint`.
4. Increase :math:`K_d` as much as possible without introducing jittering in the :term:`system response`. It should help reduce some of the if present.

Adjust the setpoint up and down. Now, the arm should exhibit good behavior - quickly and precisely approaching the :term:`setpoint`.

.. raw:: html

   <details>
     <summary>Tuning Solution</summary>


In this particular example, reasonable values for the constants are :math:`K_{cosFF} = 5.92465`, :math:`K_p = 6.0`, and :math:`K_d = 2.0`. These should produce good results at all setpoints.
   
.. raw:: html

   </details> <br>


This shows how adding a carefully-chosen feed forward not only simplifies the calibration process, but produces better behavior at a wide range of setpoints.

Common Issues
-------------

There are a number of common issues which can arise while tuning PID controllers.

Integral Term Windup
^^^^^^^^^^^^^^^^^^^^

Beware that if :math:`K_i` is too large, integral windup can occur. Following a large change in :term:`setpoint`, the integral term can accumulate an error larger than the maximal :term:`control input`. As a result, the system overshoots and continues to increase until this accumulated error is unwound.

There are a few ways to mitigate this:

1. Decrease the value of :math:`K_i`, down to zero if possible.
2. Add logic to reset the integrator term to zero if the :term:`output` is too far from the :term:`setpoint`. Some smart motor controllers implement this with a ``setIZone()`` method.
3. Cap the integrator at some maximum value. WPILib's ``PIDController`` implements this with the ``setIntegratorRange()`` method.

Actuator Saturation 
^^^^^^^^^^^^^^^^^^^

A controller calculates its output based on the error between the :term:`reference` and the current :term:`state`. :term:`Plant <plant>` in the real world don't have unlimited control authority available for the controller to apply. When the actuator limits are reached, the controller acts as if the gain has been temporarily reduced.

Mathematically, suppose we have a controller :math:`u = k(r - x)` where :math:`u` is the :term:`control effort`, :math:`k` is the gain, :math:`r` is the :term:`reference`, and :math:`x` is the current state. Let :math:`u_{max}` be the limit of the actuator's output which is less than the uncapped value of :math:`u` and :math:`k_{max}` be the associated maximum gain. We will now compare the capped and uncapped controllers for the same :term:`reference` and current :term:`state`. 

.. math::
   u_{max} &< u \\
   k_{max}(r - x) &< k(r - x) \\
   k_{max} &< k

For the inequality to hold, :math:`k_{max}` must be less than the original value for :math:`k`. This reduced gain is evident in a :term:`system response` when there is a linear change in state instead of an exponential one as it approaches the :term:`reference`. This is due to the :term:`control effort` no longer following a decaying exponential plot. Once the :term:`system` is closer to the :term:`reference`, the controller will stop saturating and produce realistic controller values again. 
