# Tuning a Vertical Elevator with Motion Profiling

In this section, we will tune a simple position controller for a vertical elevator.  In addition, we will discuss the advantages of using motion profiling for this situation.

## About the Profiler

A *Motion Profiler* is the software logic which, given a goal, commands a changing position, velocity, acceleration which are physically realistic for how a mechanism can move. These position/velocity/acceleration commands can be passed to feedforward and feedback controllers to cause the mechanism to actually achieve the commands.

In this specific example: We assume there are one or more *fixed positions* that our elevator needs to move to. The operator commands which position is desired.

In one periodic loop, the operator's commanded position might instantly snap from one value to a different one. Naturally, we don't expect the elevator to physically move that fast.

Since it is not physically plausible for the elevator to move in that manner, using a motion profiler is useful.

Constraining to realistic motion is a generally good principle for robust controls: don't ask the physical system to do something it physically can't. Having desired velocity and acceleration signals are also useful for supporting a more complex feedforward model.

The result is now two :term:`setpoint` concepts: An "unprofiled" input setpoint which is allowed to change freely, and a "profiled" intermediate setpoint which is constrained to move in a more physically realistic manner.

## Elevator Model Description

Vertical elevators are commonly used to lift gamepieces from the ground up to a scoring position. Other similar examples include shooter hoods and vertical arms.

Our "vertical elevator" consists of:

* A mass on a carriage, under the force of gravity, traveling up and down in a constrained vertical path
* A motor and gearbox driving a linear chain, to which the mass-on-a-carriage is attached

The simulation assumes the plant (the elevator itself) is controlled by motion profiling, feedforward and feedback controllers, composed in this fashion:

.. image:: images/control-system-basics-ctrl-plus-plant-plus-profiler.drawio.svg
   :alt: Tuning Exercise Block Diagrams showing feedforward and feedback block, a profiler, controlling a plant.

Where:

* The plant's :term:`output` :math:`y(t)` is the elevator's height
* The controller's :term:`setpoint` :math:`r_f(t)` is the unprofiled, **final** desired height of the elevator
* The Motion Profiler's position :term:`setpoint` :math:`r(t)` is where the elevator should currently be positioned
* The Motion Profiler's velocity :term:`setpoint` :math:`r'(t)` is how fast the elevator should currently be moving
* The Motion Profiler's accelerator :term:`setpoint` :math:`r''(t)` is how fast the elevator should currently be accelerating
* The controller's :term:`control effort`, :math:`u(t)` is the voltage applied to the motor driving the elevator


## Picking the Control Strategy for a Vertical Elevator

Applying voltage to the motor causes a force on the mechanism that drives the elevator up or down. If there is no voltage, gravity still acts on the elevator to pull it downward.  Generally, it is desirable to fight this effect, and keep the elevator at a specific height.

The tutorials below will demonstrate the behavior of the system under just feedback (PID), and then combined feedforward-feedback with motion profiling control strategies.  Follow the instructions to learn how to manually tune these controllers, and expand the "tuning solution" to view an optimal model-based set of tuning parameters.  Even though WPILib tooling can provide you with optimal gains, it is worth going through the manual tuning process to see how the different control strategies interact with the mechanism.

### Feedback Only Control

Interact with the simulation below to examine how the vertical elevator system responds when controlled only by a feedback (PID) controller.

.. note:: To change the elevator setpoint, click on the desired height along the vertical support.

.. raw:: html

    <div class="viz-div" id="elevator_feedback_container">
      <div >
         <div class="col" id="elevator_feedback_plotVals"></div>
         <div class="col" id="elevator_feedback_plotVolts"></div>
      </div>
      <div class="flex-grid">
         <div class="col" id="elevator_feedback_viz"></div>
         <div id="elevator_feedback_ctrls"></div>
      </div>
      <script>
         arm_pidf = new VerticalElevatorPIDF("elevator_feedback", "feedback");
      </script>
    </div>

Perform the following:

1. Set :math:`K_p`, :math:`K_i`, and :math:`K_d` to zero.
2. Increase :math:`K_p` until the mechanism responds to a sudden change in setpoint by moving sharply to the new position.  If the controller oscillates too much around the setpoint, reduce :math:`K_p` until it stops.
3. Increase :math:`K_i` when the :term:`output` gets "stuck" before converging to the :term:`setpoint`.
4. Increase :math:`K_d` to help the system track smoothly-moving setpoints and further reduce oscillation.

.. note:: Feedback-only control is not a good control scheme for vertical elevators!  Do not be surprised if/when the simulation below does not behave consistently, even when the "correct" constants are used.

.. collapse:: Tuning solution

   There is no perfect tuning solution for this control strategy.  Values of :math:`K_p = 10.0`,  :math:`K_i = 2.5` and and :math:`K_d = 0.0` yield a possible solution, but with overshoot and large settling times. Additionally, it will act very differently depending on the setpoint - aggressively overshooting at the top and undershooting at the bottom.


### Motion Profiled, Feedforward, and Feedback Control

Interact with the simulation below to initially examine how the elevator system responds when controlled only by a feedforward controller and then transition to using a little bit of feedback to correct any leftover error.

.. note:: To change the elevator setpoint, click on the desired height along the vertical support.

.. raw:: html

    <div class="viz-div" id="elevator_feedforward_container">
      <div >
         <div class="col" id="elevator_feedforward_plotVals"></div>
         <div class="col" id="elevator_feedforward_plotVolts"></div>
      </div>
      <div class="flex-grid">
         <div class="col" id="elevator_feedforward_viz"></div>
         <div id="elevator_feedforward_ctrls"></div>
      </div>
      <script>
         arm_pidf = new VerticalElevatorPIDF("elevator_feedforward", "both");
      </script>
    </div>


To tune the feedforward controller, perform the following:

1. Start with fairly slow maximum velocity and maximum acceleration. 0.3 for both is a good guess.
2. Set :math:`K_g`, :math:`K_v`, :math:`K_a`, :math:`K_p`, :math:`K_i`, and :math:`K_d` to zero.
3. Increase :math:`K_g` as much as you can without the elevator moving upward. You will have to zero in on :math:`K_g` fairly precisely (at least two decimal places).
4. Increase the velocity feedforward gain :math:`K_v` until the straight segments of the elevator actual motion have the same *slope* as the desired motion.
5. Increase the acceleration feedforward gain :math:`K_a` until the curved segments of the elevator actual motion have the same *curvature* as the desired motion.

At this point, note how with *no sensors involved*, the elevator motion is fairly consistent. With the exception of a small amount of error, we are almost controlling the mechanism without issue.

Only as a last step, add in a bit of feedback gain.

6. Increase :math:`K_p` until the actual position starts to overshoot the target, then back it off by 20%.

Finally, start to increase the maximum velocity and acceleration. Tweak your feed forward gains if needed.

.. collapse:: Tuning solution

   :math:`K_g = 2.28`, :math:`K_v = 3.07`, :math:`K_a = 0.41`,  :math:`K_p = 2.0` will behave quite well for a range of acceleration, velocities, and setpoints, even in the presence of system noise.


## A Note on Feedforward and Static Friction

For the sake of simplicity, the simulations above omit the :math:`K_s` term from the WPILib SimpleMotorFeedforward equation.  On actual mechanisms, however, this can be important - especially if there's a lot of friction in the mechanism gearing.

In the case of a vertical arm or elevator, :math:`K_s` can be somewhat tedious to estimate separately from :math:`K_g`.  If your arm or elevator has enough friction for :math:`K_s` to be important, it is recommended that you use the :doc:`WPILib system identification tool </docs/software/advanced-controls/system-identification/introduction>` to determine your system gains.
