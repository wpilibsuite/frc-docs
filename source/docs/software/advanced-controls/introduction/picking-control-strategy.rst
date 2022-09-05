Picking a Control Strategy
==========================

.. note:: This article includes sections of `Controls Engineering in FRC <https://file.tavsys.net/control/controls-engineering-in-frc.pdf>`__ by Tyler Veness with permission.

When designing a control algorithm for a robot mechanism, there are a number of different approaches to take. These range from very simple approaches, to advanced and complex ones. Each has *tradeoffs*. Some will work better than others in different situations, some require more mathematical analysis than others.

Teams should prioritize picking the easiest strategy which enables success on the field. However, as you do experiments, keep in mind there is almost always a "next-step" to take to improve your field performance.

There are two fundamental types of mechanism controller that we will cover here:

.. note:: These are not strict definitions - some control strategies are not easily classifiable and incorporate elements of both feedforward and feedback controllers.  However, it is still a useful distinction in most FRC applications.

**Feedforward control** (or "open-loop control") refers to the class of algorithms which incorporate knowledge of how the mechanism under control is *expected* to operate. Using this "model" of operation, the control input is chosen to make the mechanism get close to where it should be.

**Feedback control** (or "closed-loop control") refers to the class of algorithms which use sensors to *measure* what a mechanism is doing, and issue corrective commands to move a mechanism from where it actually is, to where you want it to be.

These are not mutually exclusive, and in fact it is usually best to use both.  The tutorial pages that follow will cover three types of mechanism (turret, flywheel, and vertical arm), and allow you to experiment with how each type of system responds to each type of control strategy, both individually and combined.

Feedforward Control: Making a Best Guess
----------------------------------------

"Feedforward control" means providing the mechanism with the control signal you think it needs to make the mechanism do what you want, without any knowledge of where the mechanism currently is.  A feedforward controller feeds information we already know about the system *forward* into an estimate of the required :term:`control effort`.  The feedforward controller does *not* adjust this in response to the measured behavior of the system to try to correct for errors from the guess.

Feedforward control is also sometimes referred to as "open-loop control", because if you draw out a block diagram of the controlled system it consists of only a line from the controller to the plant, with no connection from the measured plant output back into the controller (hence an "open" loop, which really isn't a loop at all).

This is the type of control you are implicitly using whenever you use a joystick to "directly" control the speed of a motor through the applied voltage.  It is the simplest and most straightforward type of control, and is probably the one you encountered first when programming a FRC motor, though it may not have been referred to by name.

When Do We Need Feedforward Control?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In general, feedforward control is *required* whenever the system requires some constant control signal to remain at the desired setpoint (such as position control of a vertical arm where gravity will cause the arm to fall, or velocity control where internal motor dynamics and friction will cause the motor to slow down over time).  Feedback controllers naturally fall to zero output when they achieve their setpoint, and so a feedforward controller is needed to provide the signal to *keep* the mechanism where we want it.

Some control strategies instead account for this in the feedback controller with integral gain - however, this is slow and prone to oscillation.  It is almost always better to use a feedforward controller to account for the output needed to maintain the setpoint.

Feedforward and Position Control
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The WPILib feedforward classes require velocity and acceleration setpoints to generate an estimated control voltage.  This is because the equations-of-motion of a permanent-magnet DC motor relate the applied voltage to velocity and acceleration; it is a fact of physics that we cannot change.

But what if we want to control position?  When controlling a DC motor, there's no immediate relation between position and control signal.  In order to use feedforward effectively for position control, we need to come up with a sequence of velocities that will take the robot mechanism to the desired position.  This is called a :ref:`motion profile <docs/software/advanced-controls/controllers/trapezoidal-profiles:Trapezoidal Motion Profiles in WPILib>`.

Many teams do not wish to incur the extra technical cost of using a motion profile when doing position control, and instead omit the feedforward controller entirely and opt to use only feedback control.  As we will discuss later, this may work in *some* situations, but has some important caveats.

Most FRC mechanisms are well-described by WPILib's feedforward classes, though pure feedforward control typically only yields acceptable results for velocity control of mechanisms with little external load.  In other cases, errors from the system model will be unavoidable and a feedback controller will be necessary to correct for them.

Feedback Control: Correcting for Errors and Disturbances
--------------------------------------------------------

Even with unlimited study, it is impossible to know every force that will be exerted on a robot's mechanism in perfect detail. For example, in a flywheel shooter, the timing and exact forces associated with a ball being put through the mechanism are extremely difficult to measure accurately. For another example, consider the fact that gearboxes gradually throw off grease as they operate, increasing their internal friction over time. This is a *very* complex process to model well.

In practice, this means that the "guess" made by our feedforward controller will never be perfect.  There will always be some error - that is, some lingering difference between the state we want our mechanism to be in, and the state the feedforward controller leaves it in.  In many situations, this error is large enough that we need to adjust our output to correct it; this is the job of the feedback controller.  Feedback controllers are also called "closed-loop" controllers, because the flow of information about the current state *back* through the system "closes" the loop in the system's block diagram.

The simplest feedback controller possible is a "proportional controller", which responds proportionally to the current error (i.e. difference between the desired state and measured state).  More advanced controllers (such as the PID controller) add response to the rate-of-change of the error and to the total accumulated error.  All of these operate on the principle that the system response is roughly linear, in order to "nudge" the system towards the setpoint based on local measurements of the error.

When Do We Need Feedback Control?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In general, there are two scenarios in which we *need* feedback control:

1. We are controlling the position of the system, so errors accumulate over time
2. There are a lot of difficult-to-dynamic external forces interacting with the mechanism that the feedforward loop cannot account for (e.g. a flywheel that is launching game pieces).

In each of these situations, the *best* solution is to combine a feedforward controller and a feedback controller by adding their outputs together.  However, in the case of a simple position controller with no external loading, a pure feedback controller can work acceptably.

Feedback-Only Control
~~~~~~~~~~~~~~~~~~~~~

Feedforward controllers are extremely helpful and quite simple, but they require *explicit* knowledge of the system behavior in order to generate a guess at the required control signal.  In many controls textbooks, you may see a set of techniques which rely on feedback control only. These are very common in industry, and works well in many cases, especially when the underlying system behavior is not easy to explicitly model, or when you want to quickly reach a "good enough" solution without spending the time to thoroughly investigate your system behavior.

Feedback-only control typically only works well in situations where:

1. The motors are fairly overpowered relative to loading.
2. The mechanism's position (not velocity) is being controlled.
3. There are no substantial or varying external forces on the mechanism.

When these criteria are met (such as in the turret tuning tutorial), feedback-only control can yield acceptable results.  In other situations, it is necessary to use a feedforward model to reduce the amount of work done by the feedback controller.  In FRC, our systems are almost all modeled by well-understood equations with working code support, so it is almost always a good idea to include a feedforward controller.

Modeling: How do you expect your system to behave?
--------------------------------------------------

It's easiest to control a system if we have some prior knowledge of how the system responds to inputs.  Even the "pure feedback" strategy described above implicitly assumes things about the system response (e.g. that it is approximately linear), and consequently won't work in cases where the system does not respond in the expected way.  To control our system *optimally*, we need some way to reliably predict how it will respond to inputs.

This can be done by combining several concepts you may be familiar with from physics: drawing free body diagrams of the forces that act on the mechanism, taking measurements of mass and moment of inertia from your CAD models, applying standard equations of how DC motors or pneumatic cylinders convert energy into mechanical force and motion, etc.

The act of creating a consistent mathematical description of your system is called *modeling* your system's behavior. The resulting set of equations are called a *model* of how you expect the system to behave.  Not every system requires an explicit model to be controlled (we will see in the turret tutorial that a pure, manually-tuned feedback controller is satisfactory *in some cases*), but an explicit model is *always* helpful.

Note that models do not have to be perfectly accurate to be useful. As we will see in later tuning exercises, even using a simple model of a mechanism can make the tuning effort much simpler.

Obtaining Models for Your Mechanisms
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If modeling your mechanism seems daunting, don't worry!  Most mechanisms in FRC are modeled by well-studied equations and code for interacting with those models is included in WPILib.  Usually, all that is needed is to determine a set of physical parameters (sometimes called "tuning constants" or "gains") that depend on the specific details of your mechanism/robot.  These can be estimated theoretically from other known parameters of your system (such as mass, length, and choice of motor/gearbox), or measured from your mechanism's actual behavior through a system identification routine.

When in doubt, ask a mentor or :ref:`support resource <docs/software/support/support-resources:Support Resources>`!

Theoretical Modeling
^^^^^^^^^^^^^^^^^^^^

`ReCalc is an online calculator <https://www.reca.lc/>`__ which estimates physical parameters for a number of common FRC mechanisms.  Importantly, it can generate estimate the ``kV``, ``kA``, and ``kG`` gains for the WPILib feedforward classes.

The :doc:`WPILib system identification tool </docs/software/pathplanning/system-identification/introduction>` supports a "theoretical mode" that can be used to determine PID gains for feedback control from the ``kV`` and ``kA`` gains from ReCalc, enabling (in theory) full tuning of a control loop without running any test routines.

Remember, however, that theory is not reality and purely theoretical gains are not guaranteed to work well.  There is *never* a substitute for testing.

System Identification
^^^^^^^^^^^^^^^^^^^^^

A good way to improve the accuracy of a simple physics model is to perform experiments on the real mechanism, record data, and use the data to *derive* the constants associated with different parts of the model. This is very useful for physical quantities which are difficult or impossible to predict, but easy to measure (ex: friction in a gearbox).

:doc:`WPILib's system identification tool </docs/software/pathplanning/system-identification/introduction>` supports some common FRC mechanisms, including drivetrain. It deploys its own code to the robot to exercise the mechanism, record data, and derive gains for both feedforward and feedback control schemes.

Manual Tuning: What to Do with No Explicit Model
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Sometimes, you have to tune a system without at an explicit model.  Maybe the system is uniquely complicated, or maybe you're under time constraints and need something that works quickly, even if it doesn't work optimally.  Model-based control requires a correct mathematical model of the system, and for better or for worse, we do not always have one.

In such cases, the physical parameters of the control algorithm can be tuned *manually*.  This is generally done by systematically "sweeping" the controller gains by hand until the mechanism behaves as expected.  Manual tuning can work quickly in cases where only one or two parameters (such as `kV` and `kP`) need to be adjusted - however, in more-complicated scenarios it can become a very involved and difficult process.

One common problem with manual tuning is that it can be hard to distinguish a well-founded controller architecture that is not yet tuned properly, from an inappropriate controller architecture that cannot work (for example, it is generally not possible to tune a velocity controller or vertical arm position controller that functions well without a feedforward).  In such a case, we can waste a lot of time searching for correct gains, when no such correct gains exist.  There is no substitute for understanding the mechanics of the systems being controlled well enough to determine a correct controller architecture for the mechanism, *even if* we do not explicitly use any model-based control methodologies.

The tutorials that follow include simulations that will allow you to perform the manual tuning process on several typical FRC mechanisms.  The fundamental concepts that govern which control strategies are valid for each mechanism are covered on the individual mechanism pages; pay close attention to this as you work through the tutorials!
