Tuning a Flywheel Speed Controller
==================================

In this section, we will calibrate controllers for a gamepiece-launching flywheel.

Flywheel Mechanism Description
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The "Flywheel" is nothing more than:

  * A thin, cylindrical mass
  * A gearbox driving the mass
  * A motor driving the gearbox

A more detailed description of the mathematics of the system :ref:`can be found here<docs/software/advanced-controls/state-space/state-space-flywheel-walkthrough:Modeling Our Flywheel>`.

In general: the more voltage that is applied to the motor, the faster the flywheel will spin. Once voltage is removed, friction slowly decreases the spinning until the flywheel stops.

Flywheels are commonly used to propel game pieces through the air, toward a target. In this simulation, a gamepiece is injected into the flywheel about halfway through the simulation. [1]_

To consistently launch a gamepiece, a good first step is to make sure it is spinning at a particular speed before putting a gamepiece into it.

This design drives the controls goal we will use in this example: Put the correct amount of voltage into the motor to get the flywheel to a certain speed, and then keep it there.

Gearbox inefficiencies and sensor delay are included in this model.

The plant and controller are connected together in this fashion:

.. image:: images/control-system-basics-ctrl-plus-plant.png
   :alt: Tuning Exercise Block Diagrams showing feedforward and feedback blocks, controlling a plant.

Where:

* The plant's :term:`output` :math:`y(t)` is the flywheel rotational velocity
* The controller's :term:`setpoint` :math:`r(t)` is the desired velocity of the flywheel
* The controller's :term:`control effort`, :math:`u(t)` is the voltage applied to the motor driving the flywheel's motion

Bang-Bang Control
~~~~~~~~~~~~~~~~~

The "Bang-Bang" controller is a simple controller which applies a binary (present/not-present) force to a mechanism to try to get it closer to a setpoint.

:ref:`WPILib provides an implementation <docs/software/advanced-controls/controllers/bang-bang:Bang-Bang Control with BangBangController>` for bang-bang control as well. This page includes a more in-depth description.

Bang-Bang controllers do not have any parameters to tune.

The only task users have to do implement and test the system to ensure it is functional.

Working with a Bang-Bang Controller
-----------------------------------

Use this interactive simulation to explore bang-bang controller concepts:

.. raw:: html

    <div class="viz-div">
      <div id="flywheel_bb_container">
         <div class="col" id="flywheel_bb_plotVals"></div>
         <div class="col" id="flywheel_bb_plotVolts"></div>
      </div>
      <div class="flex-grid">
         <div class="col" id="flywheel_bb_viz"></div>
         <div id="flywheel_bb_ctrls"></div>
      </div>
      <script>
         flywheel_bb = new FlywheelBangBang("flywheel_bb");
         flywheel_bb.runSim();
      </script>
    </div>

A Bang-Bang controller is most well known for its simplicity - there is nothing to tune!

Try adjusting the setpoint up and down. You should see that for almost all values, the output converges to be somewhat near the setpoint.

Note it's not perfect: Sensor delay in the system prevents the control effort from turning on and off at exactly the right time. The roboRIO only updates its output periodically (usually, every 20ms). Motor controllers can't turn on and off their power output instantaneously.

Collectively, these cause a cycle of "overshoot" and "undershoot", as the output repeatedly goes above and below the setpoint.

Bang-Bang Controller Software Implementation
--------------------------------------------

If you are interested in implementing a Bang-Bang controller on your robot, check out :ref:`the documentation on the WPILib classes which can help <docs/software/advanced-controls/controllers/bang-bang:Bang-Bang Control with BangBangController>`.

Common Issues with Bang-Bang Controllers
----------------------------------------

The guarantee of oscillation in steady state described above is one common issue with bang-bang control.

Additionally, rapid on/off cycling of the control effort can issues. The cycles of rapidly applying and removing forces can loosen bolts and joints, and put a lot of stress on gearboxes.

The abrupt changes in control effort can cause abrupt changes in current draw. This may stress motor control hardware, and cause eventual damage or failure.

Finally, this technique only works for mechanisms that accelerate relatively slowly. A more in-depth discussion of the details :ref:`can be found here <docs/software/advanced-controls/controllers/bang-bang:Bang-Bang Control with BangBangController>`.

PID Control
~~~~~~~~~~~

As seen in :ref:`the introduction to PID <docs/software/advanced-controls/introduction/introduction-to-pid:Introduction to PID>`, a PID controller has three *tuned* constants. The numeric values for these constants must be picked carefully for the specific mechanism under control. These constants will generally have different values on different robots.

There are multiple methods for determining the values for these constants on your particular mechanism.

`ReCalc is an online calculator <https://www.reca.lc/>`__ which can help model your system's behavior, and provide an estimate of controller constants.

The :ref:`SysId toolsuite <docs/software/pathplanning/system-identification/index:System Identification>` can be used to model your system and give accurate Proportional and Derivative values. This is preferred for supported mechanism types.

.. note::
   Throughout the WPILib documentation, you'll see two ways of writing the tunable constants of the PID controller.

   For example, for the proportional gain:

      * :math:`K_p` is the standard math-equation-focused way to notate the constant.
      * ``kP`` is a common way to see it written as a variable in software.

   Despite the differences in capitalization, the two formats refer to the same concept.


In this section, we'll go through some techniques to manually find reasonable values for the gains in a PID controller.

This is useful if you are not using the :ref:`SysId toolsuite <docs/software/pathplanning/system-identification/index:System Identification>`. Additionally, even if you are using it, it is useful to see and understand the behavior of changing the values of the constants in different situations.

Working with PID Controllers
----------------------------

Use this interactive simulation to explore tuning concepts:

.. raw:: html

    <div class="viz-div">
      <div id="flywheel_pid_container">
         <div class="col" id="flywheel_pid_plotVals"></div>
         <div class="col" id="flywheel_pid_plotVolts"></div>
      </div>
      <div class="flex-grid">
         <div class="col" id="flywheel_pid_viz"></div>
         <div id="flywheel_pid_ctrls"></div>
      </div>
      <script>
         flywheel_pid = new FlywheelPIDF("flywheel_pid");
         flywheel_pid.runSim();
      </script>
    </div>

Flywheel Tuning Step 1: Feedback-Only
-------------------------------------

We will first attempt to tune the flywheel using only the feedback terms :math:`K_p`, :math:`K_i`, and :math:`K_d`.

Perform the following:

1. Set :math:`K_p`, :math:`K_i`, :math:`K_d`, and :math:`K_v` to zero.
2. Increase :math:`K_p` until the :term:`output` starts to oscillate around the :term:`setpoint`.
3. Increase :math:`K_d` as much as possible without introducing jittering in the :term:`system response`.
4. *In some cases*, increase :math:`K_i` if :term:`output` gets "stuck" before converging to the :term:`setpoint`.

.. important:: Adding an integral gain to the :term:`controller` is often a sub-optimal way to eliminate :term:`steady-state error`. As we will see soon, a better approach is to incorporate feedforward.

.. note:: When "increasing" a value, multiply it by two until the expected effect is observed. Similarly, when "decreasing" a value, divide by two. Once you find the point where the expected effect starts or stops, switch to "bumping" the value up and down by ~10% until the behavior is good enough.

.. raw:: html

   <details>
     <summary>Tuning Solution</summary><br>


In this particular example, for a setpoint of 300, values of :math:`K_p = 0.13`, :math:`K_i = 0.0`, and :math:`K_d = 0.002` will produce somewhat reasonable results. It will get better or worse as you change the setpoint.

.. raw:: html

   </details> <br>

Because a non-zero amount of :term:`control effort` is required to keep the flywheel spinning, even when the :term:`output` and :term:`setpoint` are equal, this feedback-only strategy is flawed.

Flywheel Tuning Step 2: Feedforward, then Feedback
--------------------------------------------------

Tuning with only feedback can produce reasonable results in cases where no :term:`control effort` is required to keep the :term:`output` at the :term:`setpoint`. This may work for mechanisms like turrets, or swerve drive steering. However, it won't work well for flywheels, elevators, or vertical arms. Approaches incorporating feedforward are required for these situations.

To illustrate, start by calibrating a simple feedforward for a flywheel.

Perform the following:

1. Set :math:`K_p`, :math:`K_i`, :math:`K_d`, and :math:`K_v` to zero.
2. Increase :math:`K_v` until the :term:`output` gets fairly close to the :term:`setpoint` as time goes on. You don't have to be perfect, but try to get somewhat close.
3. Increase :math:`K_p` until the :term:`output` starts to oscillate around the :term:`setpoint`.

You may also desire to pull in a small amount of :math:`K_d` to prevent oscillation.

.. raw:: html

   <details>
     <summary>Tuning Solution</summary><br>


In this particular example, for a setpoint of 300, values of :math:`K_v = 0.0075` and :math:`K_p = 0.1`  will produce very good results. Other setpoints should work nearly as well too.

.. raw:: html

   </details> <br>

In general, this technique should have a much larger range of :math:`K_p` and :math:`K_d` values which produce reasonable results. Additionally, you should not have to use a non-zero :math:`K_i` at all.

PID Control Software Implementation
-----------------------------------

If you are interested in implementing a PID controller on your robot, check out :ref:`the documentation on the WPILib classes which can help <docs/software/advanced-controls/controllers/pidcontroller:Using the PIDController Class>`.

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

.. important:: Most mechanisms in FRC do not require any integral control, and systems that seem to require integral control to respond well probably have an inaccurate feedforward model.

Actuator Saturation
^^^^^^^^^^^^^^^^^^^

A controller calculates its output based on the error between the :term:`reference` and the current :term:`state`. :term:`Plant <plant>` in the real world don't have unlimited control authority available for the controller to apply. When the actuator limits are reached, the controller acts as if the gain has been temporarily reduced.

Mathematically, suppose we have a controller :math:`u = k(r - x)` where :math:`u` is the :term:`control effort`, :math:`k` is the gain, :math:`r` is the :term:`reference`, and :math:`x` is the current state. Let :math:`u_{max}` be the limit of the actuator's output which is less than the uncapped value of :math:`u` and :math:`k_{max}` be the associated maximum gain. We will now compare the capped and uncapped controllers for the same :term:`reference` and current :term:`state`.

.. math::
   u_{max} &< u \\
   k_{max}(r - x) &< k(r - x) \\
   k_{max} &< k

For the inequality to hold, :math:`k_{max}` must be less than the original value for :math:`k`. This reduced gain is evident in a :term:`system response` when there is a linear change in state instead of an exponential one as it approaches the :term:`reference`. This is due to the :term:`control effort` no longer following a decaying exponential plot. Once the :term:`system` is closer to the :term:`reference`, the controller will stop saturating and produce realistic controller values again.


Footnotes
---------

.. [1] For this simulation, we model a ball being injected to the flywheel as a velocity-dependant (frictional) torque fighting the spinning of the wheel for one quarter of a wheel rotation, right around the 5 second mark. This is a very simplistic way to model the ball, but is sufficient to illustrate the controller's behavior under a sudden load. It would not be sufficient to predict the ball's trajectory, or the actual "pulldown" in :term:`output` for the system.
