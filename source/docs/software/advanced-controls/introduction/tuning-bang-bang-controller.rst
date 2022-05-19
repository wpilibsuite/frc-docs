Tuning a Bang-Bang Controller
=============================

The "Bang-Bang" controller is a simple controller which applies a binary (present/not-present) force to a mechanism to try to get it closer to a setpoint. 

:ref:`WPILib provides an implementation <docs/software/advanced-controls/controllers/bang-bang:Bang-Bang Control with BangBangController>` for bang-bang control as well. This page includes a more in-depth description.


General Tuning Techniques
-------------------------

Bang-Bang controllers do not have any parameters to tune. 

The only task users have to do implement and test the system to ensure it is functional.

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

Note it's not perfect: Sensor delay in the system prevents the control effort from turning on and off at exactly the right time. The roboRIO only updates its output periodically (usually, every 20ms). Motor controllers can't turn on and off their power output instantaneously. 

Collectively, these cause a cycle of "overshoot" and "undershoot", as the output repeatedly goes above and below the setpoint.

Software Implementation
-----------------------

If you are interested in implementing a Bang-Bang controller on your robot, check out :ref:`the documentation on the WPILib classes which can help <docs/software/advanced-controls/controllers/bang-bang:Bang-Bang Control with BangBangController>`.

Common Issues
-------------

The guarantee of oscillation in steady state described above is one common issue with bang-bang control.

Additionally, rapid on/off cycling of the control effort can issues. The cycles of rapidly applying and removing forces can loosen bolts and joints, and put a lot of stress on gearboxes.

The abrupt changes in control effort can cause abrupt changes in current draw. This may stress motor control hardware, and cause eventual damage or failure.

Finally, this technique only works for mechanisms that accelerate relatively slowly. A more in-depth discussion of the details :ref:`can be found here <docs/software/advanced-controls/controllers/bang-bang:Bang-Bang Control with BangBangController>`.

We will learn about these more-effective and more-precise techniques in :ref:`the next tuning exercise <docs/software/advanced-controls/introduction/introduction-to-pid:Introduction to PID>`.
