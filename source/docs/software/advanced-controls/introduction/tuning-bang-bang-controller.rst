Tuning a Bang-Bang Controller
=============================

As seen in :ref:`Introduction to PID <docs/software/advanced-controls/introduction/introduction-to-pid.rst>`, a Bang-Bang controller is a simple construct for applying a binary (present/not-present) force to a mechanism to try to get it closer to a setpoint. 

It is simple because it requires no calibration. The simplicity comes at a cost though: it only works well for some mechanisms.

General Tuning Techniques
^^^^^^^^^^^^^^^^^^^^^^^^^^

Bang-Bang controllers do not have any parameters to tune. They either push the mechanism toward the setpoint from the "too-low" side, or allow it to drift back toward the setpoint from the "too-high" side.

Mechanism Walkthrough - Flywheel
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. raw:: html

    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; height: auto;">
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


Mechanism Walkthrough - Vertical Arm
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



Common Issues
-------------

bang bang in imprecise

excessive motor and gearbox wear

abrupt changes big current draw bad