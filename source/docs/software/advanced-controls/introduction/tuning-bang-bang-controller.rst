Tuning a Bang-Bang Controller
=============================

As seen in :ref:`Introduction to PID <docs/software/advanced-controls/introduction/introduction-to-pid:Introduction to PID>`, a Bang-Bang controller is a simple construct for applying a binary (present/not-present) force to a mechanism to try to get it closer to a setpoint. 

It is simple because it requires no calibration. The simplicity comes at a cost though: it only works well for some mechanisms.

General Tuning Techniques
-------------------------

Bang-Bang controllers do not have any parameters to tune. They either push the mechanism toward the setpoint from the "too-low" side, or allow it to drift back toward the setpoint from the "too-high" side.

.. tabs::

  .. code-tab:: java

     if(setpoint < output){
      ctrlEffort = 1.0;
     } else {
      ctrlEffort = 0.0;
     }

  .. code-tab:: c++

     if(setpoint < output){
      ctrlEffort = 1.0;
     } else {
      ctrlEffort = 0.0;
     }


Mechanism Walkthrough - Flywheel
--------------------------------

For this walkthrough, use this interactive simulation to explore tuning concepts:

.. raw:: html

    <div class="viz-div">
      <div class="col" id="flywheel_bb_plot"></div> 
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

Note it's not perfect: Sensor delay in the system prevents the control effort from turning on and off at exactly the right time. In turn, this causes a cycle of "overshoot" and "undershoot", as the output repeatedly goes above and below the setpoint.

Common Issues
-------------

The imprecision observed is one common issue with bang-bang control.

Additioanlly, the fact the control effort turns on and off quickly, zooming from zero to full, can cause problems. The cycles of rapidly applying and removing forces can loosten bolts and joints, and put a lot of stress on gearboxes.

The abrupt changes in control effort can cause abrupt changes in current draw. Some motor controllers may not last for an extended period of time.

Finally, this technique only works for mechanisms that accelerate relatively slowly, in comparison to the amount of control effort applied. For mechanisms like flywheels, or drivetrain control for simple autonomous, it may be sufficent. 

We will learn about these more-effective and more-precise techniques in :ref:`the next tuning exercise <docs/software/advanced-controls/introduction/introduction-to-pid:Introduction to PID>`.