Tuning a Vertical Arm Position Controller
=========================================

For additional information on tuning PID controllers, check out :ref:`the tuning exercise for a flywheel <docs/software/advanced-controls/introduction/tuning-flywheel:Tuning a Flywheel Speed Controller>`.

Arm Mechanism Description
~~~~~~~~~~~~~~~~~~~~~~~~~

The "Vertical Arm" is:

  * A mass on a stick
  * A gearbox which drives the stick in circles
  * A motor which drives the gearbox.

Vertical arms are commonly used to lift gamepieces from the ground, up to a scoring position.

Applying voltage to the motor causes a force on the mechanism that drives the arm up or down. If there is no voltage, gravity still acts on the arm to pull it downward.

To consistently place a gamepiece, the arm must move from its current location to a specific angle which puts the gamepiece at the right height.

This design drives the controls goal we will use in this example: Put the correct amount of voltage into the motor to get the arm to a certain angle, and then keep it there.

Gearbox inefficiencies and sensor delay are included in this model.

The plant and controller are connected together in this fashion:

.. image:: images/control-system-basics-ctrl-plus-plant.png
   :alt: Tuning Exercise Block Diagrams showing feedforward and feedback blocks, controlling a plant.

Where:

* The plant's :term:`output` :math:`y(t)` is the arm's angular position
* The controller's :term:`setpoint` :math:`r(t)` is the desired angular position of the arm.
* The controller's :term:`control effort`, :math:`u(t)` is the voltage applied to the motor driving the arm's motion.


Simulation - Vertical Arm
~~~~~~~~~~~~~~~~~~~~~~~~~

.. raw:: html

    <div class="viz-div">
      <div id="arm_pid_container">
         <div class="col" id="arm_pid_plotVals"></div>
         <div class="col" id="arm_pid_plotVolts"></div>
      </div>
      <div class="flex-grid">
         <div class="col" id="arm_pid_viz"></div>
         <div id="arm_pid_ctrls"></div>
      </div>
      <script>
         arm_pidf = new VerticalArmPIDF("arm_pid");
         arm_pidf.runSim();
      </script>
    </div>

Arm Tuning Step 1: Feedback-Only
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Again, we will first attempt to tune this mechanism with using only feedback terms :math:`K_p`, :math:`K_i`, and :math:`K_d`.

Perform the following:

1. Set :math:`K_p`, :math:`K_i`, :math:`K_d`, and :math:`K_g` to zero.
2. Increase :math:`K_p` until the :term:`output` starts to oscillate. You likely won't be able to push it much higher.
3. Increase :math:`K_i` when the :term:`output` gets "stuck" before converging to the :term:`setpoint`.
4. Increase :math:`K_d` as much as possible without introducing jittering in the :term:`system response`. It should help reduce some of the oscillation.

Note that you will likely have trouble finding a set of tunes that behaves acceptably. If you think you have a set, try adjusting the setpoint to be a bit different. You'll likely see the arm behave very differently for small changes in setpoints.

.. raw:: html

   <details>
     <summary>Tuning Solution</summary><br>


In this particular example, for a setpoint of 0.1, values of :math:`K_p = 12.0`, :math:`K_i = 6.0`, and :math:`K_d = 3.0` will produce somewhat reasonable results. It won't be great for other setpoints.

.. raw:: html

   </details> <br>

This is a case where feedback control alone is insufficient to achieve good behavior with the system.

Arm Tuning Step 2: Feedforward, then Feedback
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The core reason for why PID behaves poorly without feed forward is gravity. In this mechanism, depending on the arm's angle, gravity will pull with a different force.

To counteract this, we introduce a feedforward term which is also proportional to the cosine of the angle.

.. math::
   V_{ff} = K_g * cos(\theta_{arm})

:math:`K_g` :ref:`could be calculated <docs/software/advanced-controls/introduction/approaches-to-ctrl-sys-design:Start with Feedforward>` if all the mechanical and physical properties of the system are known. However, since a lot of these are hard to model accurately, we will determine it experimentally.

Perform the following:

1. Set :math:`K_p`, :math:`K_i`, :math:`K_d`, and :math:`K_g` to zero.
2. Increase and decrease :math:`K_g` until the arm can hold its position with as little movement as possible. In this simulation, you'll want to go out to at least four decimal points.
3. Increase :math:`K_p` until the :term:`output` starts approaches the :term:`setpoint`.
4. Increase :math:`K_d` as much as possible without introducing jittering in the :term:`system response`. It should help reduce some of the :term:`output` oscillation if present.

Adjust the setpoint up and down. Now, the arm should exhibit good behavior - quickly and precisely approaching the :term:`setpoint`.

.. raw:: html

   <details>
     <summary>Tuning Solution</summary><br>


In this particular example, reasonable values for the constants are :math:`K_g = 5.92465`, :math:`K_p = 6.0`, and :math:`K_d = 2.0`. These should produce good results at all setpoints.

.. raw:: html

   </details> <br>


This shows how adding a carefully-chosen feedforward not only simplifies the calibration process, but produces better behavior at a wide range of setpoints.
