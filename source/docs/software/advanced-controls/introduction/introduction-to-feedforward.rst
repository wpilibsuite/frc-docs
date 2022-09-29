Introduction to DC Motor Feedforward
====================================

.. note:: For a guide on implementing PID control in code with WPILib, see :ref:`docs/software/advanced-controls/controllers/feedforward:Feedforward Control in WPILib`.

This page explains the conceptual and mathematical workings of WPILib's SimpleMotorFeedforward (and the other related classes).

The Permanent-Magnet DC Motor Feedforward Equation
--------------------------------------------------

Recall from earlier that the point of a feedforward controller is to use the known dynamics of a mechanism to make a best guess at the :term:`control effort` required to put the mechanism in the state you want.  In order to do this, we need to have some idea of what kind of mechanism we are controlling - that will determine the relationship between :term:`control effort` and :term:`output`, and let us guess at what value of the former will give us the desired value of the latter.

In FRC, the most common system that we're interested in controlling is the :term:`permanent-magnet DC motor`.

These motors have a number of convenient properties that make them particularly easy to control, and ideal for FRC tasks.  In particular, they obey a particular relationship between applied voltage, rotor velocity, and rotor acceleration known as a "voltage balance equation".

.. math:: V = K_s \cdot sgn(\dot{d}) + K_v \cdot \dot{d} + K_a \cdot \ddot{d}

where :math:`V` is the applied voltage, :math:`d` is the displacement (position) of the motor, :math:`\dot{d}` is its velocity, and :math:`\ddot{d}` is its acceleration (the "overdot" notation traditionally denotes the :term:`derivative` with respect to time).

We can interpret the coefficients in the above equation as follows:

:math:`K_s` is the voltage needed to overcome the motor's static friction, or in other words to just barely get it moving; it turns out that this static friction (because it’s, well, static) has the same effect regardless of velocity or acceleration. That is, no matter what speed you’re going or how fast you're accelerating, some constant portion of the voltage you've applied to your motor (depending on the specific mechanism assembly) will be going towards overcoming the static friction in your gears, bearings, etc; this value is your kS.  Note the presence of the :term:`signum function` because friction force always opposes the direction-of-motion.

:math:`K_v` describes how much voltage is needed to hold (or "cruise") at a given constant velocity while overcoming the :term:`counter-electromotive force` and any additional friction that increases with speed (including :term:`viscous drag` and some :term:`churning losses`). The relationship between speed and voltage (at constant acceleration) is almost entirely linear (for FRC-legal components) because of how permanent-magnet DC motors work.

:math:`K_a` describes the voltage needed to induce a given acceleration in the motor shaft. As with ``kV``, the relationship between voltage and acceleration (at constant velocity) is almost perfectly linear for FRC components.

For more information, see `this paper <https://www.chiefdelphi.com/uploads/default/original/3X/f/7/f79d24101e6f1487e76099774e4ba60683e86cda.pdf>`__.


Variants of the Feedforward Equation
------------------------------------

Some of WPILib's other feedforward classes introduce additional terms into the above equation to account for known differences from the simple case described above - details for each tool can be found below:

Elevator Feedforward
~~~~~~~~~~~~~~~~~~~~

An elevator consists of a permanent-magnet DC motor attached to a mass under the force of gravity.  Compared to the feedforward equation for an unloaded motor, it differs only in the inclusion of a constant :math:`K_g` term that accounts for the action of gravity:

.. math:: V = K_g + K_s \cdot sgn(\dot{d}) + K_v \cdot \dot{d} + K_a \cdot \ddot{d}

where :math:`V` is the applied voltage, :math:`d` is the displacement (position) of the drive, :math:`\dot{d}` is its velocity, and :math:`\ddot{d}` is its acceleration.

Arm Feedforward
~~~~~~~~~~~~~~~

An arm consists of a permanent-magnet DC motor attached to a mass on a stick held under the force of gravity.  Like the elevator feedforward, it includes a :math:`K_g` term to account for the effect of gravity - unlike the elevator feedforward, however, this term is multiplied by the cosine of the arm angle (since the gravitational force does not act directly on the motor):

.. math:: V = K_g \cdot cos(\theta) + K_s \cdot sgn(\dot{\theta}) + K_v \cdot \dot{\theta} + K_a \cdot \ddot{\theta}

where :math:`V` is the applied voltage, :math:`\theta` is the angular displacement (position) of the arm, :math:`\dot{\theta}` is its angular velocity, and :math:`\ddot{\theta}` is its angular acceleration.

Using the Feedforward
---------------------

In order to use the feedforward, we need to plug in values for each unknown in the above voltage-balance equation *other than the voltage*.  As mentioned :ref:`earlier <docs/software/advanced-controls/introduction/picking-control-strategy:Obtaining Models for Your Mechanisms>`, the values of the gains :math:`K_s` etc. can be obtained either through theoretical modeling with `ReCalc <https://www.reca.lc/>`__ or explicit measurement with :doc:`SysId </docs/software/pathplanning/system-identification/introduction>`.  That leaves us needing values for velocity, acceleration, and (in the case of the arm feedforward) position.

Typically, these come from our setpoints - remember that with feedforward we are making a "guess" as to the output we need based on where we want the system to be.

For velocity control, this does not pose a problem - we can take the velocity value from our setpoint directly, and if necessary (it can often be omitted in practice) we can infer the acceleration from the difference between the current and previous velocity setpoints.

For position control, however, this can be difficult - except for the arm controller, there's no direct term in the feedforward equation for position.  We often have no choice but to calculate our velocity from the difference between the current and previous setpoint positions, and to ignore acceleration entirely.  In order to do better, we need to ensure that our setpoints vary *smoothly* according to some set of constraints - this is usually accomplished with a :ref:`motion profile <docs/software/advanced-controls/controllers/trapezoidal-profiles:Trapezoidal Motion Profiles in WPILib>`.
