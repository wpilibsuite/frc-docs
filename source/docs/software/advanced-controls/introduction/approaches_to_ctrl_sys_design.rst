Approaches to Control Systems
=============================

.. note:: This article includes sections of `Controls Engineering in FRC <https://file.tavsys.net/control/controls-engineering-in-frc.pdf>`__ by Tyler Veness with permission.


FeedForward vs. FeedBack
------------------------

Feed-Forward is assigning control efforts based on an assumed model of how the mechanism should work.

Feed-Back is using sensors to detect what actually happened to the mechanism, and apply a correction factor.


Start with FeedForward
-----------------------

First-Principles - How do you expect your system to behave?
```````````````````````````````````````````````````````````

ReCalc

Physics and FIrst Principles


Combining Feedback and FeedForward
``````````````````````````````````

Feedback useful when FeedForward cannot fully describe everything int he system.

Ex: Ball injected into shooter.

Ex: Gearbox was regreased

Model Based & System Identification
```````````````````````````````````

tools available to inject testcases into the mechanism to derive constants

can derive constants assocaited with feed forward, as well as inform feedback decisions

Incorporating FeedBack
----------------------

Let's say we are controlling a DC brushed motor. With just a mathematical model and knowledge of all the current states of the system (i.e., angular velocity), we can predict all future states given the future voltage inputs. Why then do we need feedback control? If the system is disturbed in any way that isn't modeled by our equations, like a load was applied, or voltage sag in the rest of the circuit caused the commanded voltage to not match the applied voltage, the angular velocity of the motor will deviate from the model over time.

To combat this, we can take measurements of the system and the environment to detect this deviation and account for it. For example, we could measure the current position and estimate an angular velocity from it. We can then give the motor corrective commands as well as steer our model back to reality. This feedback allows us to account for uncertainty and be robust to it.



Feedback-Only Techniques
------------------------

In may controls textbooks, you may see a set of techniques which rely on Feedback only. These are very common in industry, and work surprisingly well in many cases, even when the underlying system behavior is not easy to model.

For most FRC mechanisms, they may produce good results in some cases. However, they all have limits. Avoiding them if possible is recommended.

Bang-Bang
`````````

A ``BangBang`` controller applies either zero control effort, or 100% control effort, depending on whether the system is at the setpoint or not.

It may work well for flywheels, or very simple autonomous "drive distance" routines. However, it will likely not work for elevators, arms, turrets, or 

PID
```

The Propriotnal integral derivative controller...
