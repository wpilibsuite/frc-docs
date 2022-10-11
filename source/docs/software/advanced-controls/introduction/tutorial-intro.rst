Introduction To Controls Tuning Tutorials
=========================================

The WPILib docs include three interactive tuning simulations. Their goal is to allow students to learn how tuning parameters impact system behavior, without having to deal with software bugs or other real-world behavior.

Even though WPILib tooling can provide you with optimal gains, it is worth going through the manual tuning process to see how the different control strategies interact with the mechanism.

Ultimately, students should use the examples to build intuition and make their time on the robot more productive.

This page details a few tips while working with the tutorials.

Parameter Exponential Search
----------------------------

While interacting with the simulations, you will get instructions to "increase" or "decrease" different parameters.

When "increasing" a value, multiply it by two until the expected effect is observed.  After the first time the value becomes too large (i.e. the behavior is unstable or the mechanism overshoots), reduce the value to halfway between the first too-large value encountered and the previous value tested before that.  Continue iterating this "split-half" procedure to zero in on the optimal value (if the response undershoots, pick the halfway point between the new value and the last value immediately above it - if it overshoots, pick the halfway point between the new value and the last value immediately below it). This is called an term:`exponential search`, and is a very efficient way to find positive values of unknown scale.

System Noise
------------

The "system noise" option introduces random, gaussian error into the plant to provide a more realistic situation of system behavior.

Leave the setting turned off at first to learn the system's ideal behavior. Later, turn it on to see how your tuning works in the presence of real-world effects.

Be Systematic
-------------

As seen in :ref:`the introduction to PID <docs/software/advanced-controls/introduction/introduction-to-pid:Introduction to PID>`, a PID controller has *three* tuned constants.Feedforward components will add even more. This means searching for the "correct" constants manually can be quite difficult - it is therefore necessary to approach the tuning procedure systematically.

Follow the order of tuning presented in the tutorials - it will maximize your chances of success.

Resist checking the tuning solutions until you believe your solution is close to correct. Then check your answer, and try the provided one to compare against your own results.

Furthermore, work from easy to difficult.:ref:`Flywheel mechanisms <docs/software/advanced-controls/introduction/tuning-flywheel:Tuning a Flywheel Velocity Controller>` are the easiest to tune. After that, look into the :ref:`turret tuning <docs/software/advanced-controls/introduction/tuning-turret:Tuning a Turret Position Controller>`. Then, finish off with the :ref:`vertical arm example<docs/software/advanced-controls/introduction/tuning-vertical-arm:Tuning a Vertical Arm Position Controller>`.
