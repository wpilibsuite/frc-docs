Approaches to Designing Control Systems
=======================================

.. note:: This article includes sections of `Controls Engineering in FRC <https://file.tavsys.net/control/controls-engineering-in-frc.pdf>`__ by Tyler Veness with permission.

When designing a control system for your robot, there are a number of different approaches to take. They range from very simple approaches, to advanced and complex ones. Each has *tradeoffs*. Some will work better than others in different situations, some require more mathematical analysis than others.

Teams should prioritize picking the easiest strategy which enables success on the field. However, as you do experiments, keep in mind there is almost always a "next-step" to take to improve your field performance.

Feedforward vs. Feedback
------------------------

There are two broad categories of strategies in control system design:

**Feedforward** refers to the class of algorithms which incorporate knowledge of how the mechanism under control is *expected* to operate. Using this "model" of operation, the control input is chosen to make the mechanism get close to where it should be.

**Feedback** refers to the class of algorithms which use sensors to *measure* what a mechanism is doing, and issue corrective commands to move a mechanism from where it actually is, to where you want it to be.

They are not mutually exclusive - many techniques will use these concepts simultaneously.

Start with Feedforward
-----------------------

Because most FRC mechanisms can be manufactured to be have well-defined behavior and can be easily modeled, it's generally encouraged to look into feedforward techniques first. 

How do you expect your system to behave?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The first step in designing a control system is writing down information on how you expect your mechanism to behave.

This step is done by combining one or more concepts you may be familiar with from physics: drawing free body diagrams of the forces that act on the mechanism, taking measurements of mass and moment of inertia from your CAD models, applying standard equations of how DC motors or pneumatic cylinders convert energy into mechanical force and motion, etc.

The act of creating these mathematical descriptions is called *modeling* your system's behavior. The resulting set of equations are the *model* of how you expect the system to behave.

Note that models do not have to be perfectly accurate to be useful. As we will see in later tuning exercises, even using a simple model of a mechanism can make the tuning effort much simpler.

`ReCalc is an online calculator <https://www.reca.lc/>`__ which helps take care of some of these physics model calculations for common FRC mechanisms.


System Identification
^^^^^^^^^^^^^^^^^^^^^

A good way to improve the accuracy of a simple physics model is to perform experiments on the real mechanism, record data, and use the data to *derive* the constants associated with different parts of the model. This is very useful for physical quantities which are difficult or impossible to predict, but easy to measure (ex: friction in a gearbox).

:doc:`WPILib's system identification tool </docs/software/pathplanning/system-identification/introduction>` supports some common FRC mechanisms, including drivetrain. It deploys its own code to the robot to exercise the mechanism, record data, and derive relevant constants. These constants can be used to build a more accurate model of the system behavior.


Correcting for Unknowns with Feedback
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Even with lots of experiments and study, it is not possible to know every force that will be exerted on a robot's mechanism with great detail. For example, in a flywheel shooter, the timing and exact forces associated with a ball being put through the mechanism are not easy to define accurately. For another example, consider the fact that gearboxes can be greased to reduce friction, but throw off grease over time and get more friction. This is a complex process to model well.

In cases where not everything can be known, incorporating sensors and *feedback* control is necessary to correct for unknowns in the system's behavior. 

If the unmodeled, unknown behaviors of the system are big enough to prevent a mechanism from working well, feedback control will be necessary to control the system.


Incorporating FeedBack
----------------------

Let's say we are controlling :ref:`a DC Motor </docs/software/pathplanning/system-identification/introduction:How DC Motors Behave>`. With just a mathematical model and knowledge of all the current states of the system (i.e., angular velocity), we can predict all future states given the future voltage inputs. Why then do we need feedback control? If the system is disturbed in any way that isn't modeled by our equations, like a load was applied, or voltage sag in the rest of the circuit caused the commanded voltage to not match the applied voltage, the angular velocity of the motor will deviate from the model over time.

To combat this undesired effect, we can take measurements of the system and the environment to detect this deviation and account for it. For example, we could measure the current position and estimate an angular velocity from it. We can then give the motor corrective commands as well as steer our model back to reality. This feedback allows us to account for uncertainty and be robust to it.

Feedback-Only Techniques
------------------------

In many controls textbooks, you may see a set of techniques which rely on feedback control only. These are very common in industry, and works well in many cases, especially when the underlying system behavior is not easy to model.

For most FRC mechanisms, these feedback-only techniques may produce good results in some cases. However, there will be limits to this success. For most FRC use cases, it is recommended to include feedforward.

Next Steps
----------

To jump right in, check out :ref:`a hands-on example working with a simple Bang-Bang controller <docs/software/advanced-controls/introduction/tuning-bang-bang-controller:Tuning a Bang-Bang Controller>`.

Alternatively, spend some time learning about :ref:`the details of PID controllers <docs/software/advanced-controls/introduction/introduction-to-pid:Introduction to PID>`.