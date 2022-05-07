Approaches to Control Systems
=============================

.. note:: This article includes sections of `Controls Engineering in FRC <https://file.tavsys.net/control/controls-engineering-in-frc.pdf>`__ by Tyler Veness with permission.

When desigining a control system for your robot, there are a number of different approaches to take. They range from very simple approaches, to advanced and complex ones. Each has *tradeoffs*. Some will work better than others in different situations, some require more mathematical analysis than others.

Teams should prioritize picking the easiest strategy which enables success on the field. However, as you do experiemnts, keep in mind there is almost always a "next-step" to take to improve your field performance.

FeedForward vs. FeedBack
------------------------

There are two broad categories of strategies in control system design:

**Feed-Forward** refers to the class of algorithms which incorporate knowledge of how the mechanism under control is *expected* to operate. Using this "model" of operation, the control input is chosen to make the mechanism get close to where it should be.

**Feed-Back** refers to the class of algorithms which use sensors to *measure* what a mechanism is doing, and issue corrective commands to move a mechnaism from where it actually is, to where you want it to be.

They are not mutually exclusive - the most advanced techniques will incorporate both of these concepts simultaneously.

Start with FeedForward
-----------------------

Because most FRC mechanisms can be manufactured to be have well-defined behavior and can be easily modeled, it's generally encouraged to look into feed-forward techniques first. 

First-Principles - How do you expect your system to behave?
```````````````````````````````````````````````````````````

The first step in designing a control system is writing down information on how you expect your mechanism to behave.

This step is done by combining one or more concepts you may be familiar with from Physics: drawing free body diagrams of the forces that act on the mechanism, taking measurements of mass and moment of inertia from your CAD models, applying standard models of how DC motors or pneumatic cylinders convert energy into mechanical force and motion, etc.

Models do not have to be extremely accurate to be useful. For example, a very simple model of a motor is that its speed is proportional to the voltage applied. A motor which spins at 3000 RPM at 12v will spin near 1500RPM at 6V. If you know you want your motor to be spinning at 1254 RPM, you can use the proportionality to calculate the amount of voltage to send to the motor.

`ReCalc is an online calculator <https://www.reca.lc/>` which helps take care of some of these physics model calcualtions for common FRC mechanisms.

System Identification
`````````````````````

A key way to improve the accuracy of a First-Principles physics model is to perform experiments on it, record data, and use the data to *derive* the constants associated with different parts of the model.

This is useful if CAD models are not perfectly accurate, or parts of the model are not easily predicted (ex: friction in a gearbox).

`FRC's system identification tool (sysid)<link me>` supports some common FRC mechanisms, including drivetrains. It can be configured to load custom code onto a robot, exercise the mechanism and record data, and derive relevant constants to build a more accurate model of the system behavior.

Combining Feedback and FeedForward
``````````````````````````````````

Even with lots of experiments and study, it is not possible to know every force that will be exerted on a robot's mechanism with great detail. For example, in a flywheel shooter, the timing and exact forces associated with a ball being put through the mechanism are not easy to define accurately. For another example, consider the fact that gearboxes can be greased to reduce friction, but throw off grease over time and get more friction. This is a complex process to model well.

In cases where not everything can be known, incorporating sensors and *feedback* control is useful to account for inaccuracies in the model of system behavior.


Incorporating FeedBack
----------------------

Let's say we are controlling a DC brushed motor. With just a mathematical model and knowledge of all the current states of the system (i.e., angular velocity), we can predict all future states given the future voltage inputs. Why then do we need feedback control? If the system is disturbed in any way that isn't modeled by our equations, like a load was applied, or voltage sag in the rest of the circuit caused the commanded voltage to not match the applied voltage, the angular velocity of the motor will deviate from the model over time.

To combat this, we can take measurements of the system and the environment to detect this deviation and account for it. For example, we could measure the current position and estimate an angular velocity from it. We can then give the motor corrective commands as well as steer our model back to reality. This feedback allows us to account for uncertainty and be robust to it.


Feedback-Only Techniques
------------------------

In may controls textbooks, you may see a set of techniques which rely on feedback control only. These are very common in industry, and works well in many cases, especially when the underlying system behavior is not easy to model.

For most FRC mechanisms, they may produce good results in some cases. However, they all have limits. Avoiding them if possible is recommended.

Bang-Bang
`````````

A ``BangBang`` controller applies either zero control effort, or 100% control effort, depending on whether the system is at the setpoint or not.

It may work well for flywheels, or very simple autonomous "drive distance" routines. However, it will likely not work for elevators, arms, turrets, or more complex drivetrain motion.



PID
```

The Propriotnal integral derivative controller...
