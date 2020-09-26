Introduction to State-Space Control
===================================

.. note:: This article is from `Controls Engineering in FRC <https://file.tavsys.net/control/controls-engineering-in-frc.pdf>`__ by Tyler Veness with permission.

From PID to Model-Based Control
-------------------------------

When tuning PID controllers, we focus on fiddling with controller parameters relating to the current, past, and future :term:`error` (P, I and D terms) rather than the underlying system states. While this approach works in a lot of situations, it is an incomplete view of the world.

Model-based control focus on developing an accurate model of the system they are trying to control. These models help inform :term:`gains <gain>` picked for feedback controllers based on the physical responses of the system, rather than an arbitrary proportional :term:`gain` derived through testing. This allows us not only to predict ahead of time how a system will react, but also test our controllers without a physical robot and save time debugging simple bugs.

.. note:: State-space control makes extensive use of linear algebra. More on linear algebra in modern control theory, including an introduction to linear algebra and resources, can be found in Chapter 4 of `Controls Engineering in FRC <https://file.tavsys.net/control/controls-engineering-in-frc.pdf>`__.

If you've used WPILib's feedforward classes for ``SimpleMotorFeedforward`` or its sister classes, or used FRC-Characterization to pick PID :term:`gains <gain>` for you, you're already familiar with model-based control! The ``kv`` and ``ka`` :term:`gains <gain>` can be used to describe how a motor (or arm, or drivetrain) will react to voltage. We can put these constants into standard state-space notation using WPILib's ``LinearSystem``, something we will do in a later article.

Vocabulary
----------

For the background vocabulary that will be used throughout this article, see the :ref:`Glossary <docs/software/advanced-controls/state-space/state-space-glossary:State-Space Glossary>`.

What is State-Space?
--------------------

Recall that 2D space has two axes: x and y. We represent locations within this space as a pair of numbers packaged in a vector, and each coordinate is a measure of how far to move along the corresponding axis. State-space is a `Cartesian coordinate system <https://en.wikipedia.org/wiki/Cartesian_coordinate_system>`__ with an axis for each state variable, and we represent locations within it the same way we do for 2D space: with a list of numbers in a vector. Each element in the vector corresponds to a state of the system. This example shows two example state vectors in the state-space of an elevator model with the states :math:`[\text{position}, \text{velocity}]`:

.. image:: images/state-space-graph.png

In this image, the vectors representing states in state-space are arrows. From now on these vectors will be represented simply by a point at the vector's tip, but remember that the rest of the vector is still there.

In addition to the :term:`state`, :term:`inputs <input>` and :term:`outputs <output>` are represented as vectors. Since the mapping from the current states and inputs to the change in state is a system of equations, it’s natural to write it in matrix form. This matrix equation can be written in state-space notation.

What is State-Space Notation?
-----------------------------

State-space notation is a set of matrix equations which describe how a system will evolve over time. These equations relate the change in state :math:`\dot{\mathbf{x}}`, and the :term:`output` :math:`\mathbf{y}`, to linear combinations of the current state vector :math:`\mathbf{x}` and :term:`input` vector :math:`\mathbf{u}`. See section 4.2 of `Controls Engineering in FRC <https://file.tavsys.net/control/controls-engineering-in-frc.pdf>`__ for an introduction to linear combinations. The core idea of linear transformations is that we are simply summing or scaling the elements of :math:`\mathbf{x}` and :math:`\mathbf{u}`. For example, an operation involving an exponent or trigonometric function would not be considered a linear transformation.

State-space control can deal with continuous-time and discrete-time systems. A continuous-time system is modeled by a system of differential equations (as seen in the continuous-time case below). However, modern computer processors such as the RoboRIO run in discrete "steps," making it impossible to precisely model a system that is constantly evaluated. A continuous-time state-space system can be converted into a discrete-time system through a process called discretization. A discrete-time system expresses the state of the system at our next timestep based on the previous state and inputs, as opposed to the state derivative :math:`\dot{\mathbf{x}}`.

The following two sets of equations are the standard form of continuous-time and discrete-time state-space notation:

.. math::
    \text{Continuous: }
    \dot{\mathbf{x}} &= \mathbf{A}\mathbf{x} + \mathbf{B}\mathbf{u} \\
    \mathbf{y} &= \mathbf{C}\mathbf{x} + \mathbf{D}\mathbf{u} \\
    \nonumber \\
    \text{Discrete: }
    \mathbf{x}_{k+1} &= \mathbf{A}\mathbf{x}_k + \mathbf{B}\mathbf{u}_k \\
    \mathbf{y}_k &= \mathbf{C}\mathbf{x}_k + \mathbf{D}\mathbf{u}_k

.. math::
    \begin{array}{llll}
      \mathbf{A} & \text{system matrix}      & \mathbf{x} & \text{state vector} \\
      \mathbf{B} & \text{input matrix}       & \mathbf{u} & \text{input vector} \\
      \mathbf{C} & \text{output matrix}      & \mathbf{y} & \text{output vector} \\
      \mathbf{D} & \text{feedthrough matrix} &  &  \\
    \end{array}

Note that while a system's continuous-time and discrete-time matrices A, B, C, and D have the same names, they are not equivalent. The continuous-time matrices describes the rate of change of the state, :math:`\mathbf{\hat{x}}`, while the discrete-time matrices describe the system's state and the next timestep as a function of the current state and input. The discrete-time form is often used on robots so that we can easily find the next state of our system given the current state. Systems are often modeled first as continuous-time systems, and later converted to discrete-time systems.

.. important:: WPILib's LinearSystem takes continuous-time system matrices, and converts them internally where necessary.

.. note:: In the discrete-time form, the system's state is held constant between updates. This means that we can only react to disturbances as quickly as our state estimate is updated. Updating our estimate more quickly can help improve performance, up to a point. WPILib's ``Notifier`` class can be used if updates faster than the main robot loop are desired.

State-space Notation Example: Flywheel from kV and kA
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

:ref:`Recall <docs/software/advanced-controls/controllers/feedforward:SimpleMotorFeedforward>` that we can model the motion of a flywheel connected to a brushed DC motor with the equation :math:`V = kV \cdot v + kA \cdot a`, where V is voltage output, v is the flywheel's angular velocity and a is its angular acceleration. This equation can be rewritten as :math:`a = \frac{V - kV \cdot v}{kA}`, or :math:`a = \frac{-kV}{kA} \cdot v + \frac{1}{kA} \cdot V`. Notice anything familiar? This equation relates the angular acceleration of the flywheel to its angular velocity and the voltage applied.

We can convert this equation to state-space notation. We can create a system with one state (velocity), one :term:`input` (voltage), and one :term:`output` (velocity). Recalling that the first derivative of velocity is acceleration, we can write our equation as follows, replacing velocity with :math:`\mathbf{x}`, acceleration with :math:`\mathbf{\dot{x}}`, and voltage :math:`\mathbf{V}` with :math:`\mathbf{u}`:

.. math::
    \mathbf{\dot{x}} = \begin{bmatrix}\frac{-kV}{kA}\end{bmatrix} \mathbf{x} + \begin{bmatrix}\frac{1}{kA}\end{bmatrix} u

That's it! That's the state-space model of a system for which we have the kV and kA constants. This same math is use in FRC-Characterization to model flywheels and drivetrain velocity systems.

Visualizing State-Space Responses: Phase Portrait
-------------------------------------------------

A `phase portrait <https://en.wikipedia.org/wiki/Phase_portrait>`__ can help give a visual intuition for the response of a system in state-space. The vectors on the graph have their roots at some point :math:`\mathbf{x}` in state-space, and point in the direction of :math:`\mathbf{\dot{x}}`, the direction that the system will evolve over time. This example shows a model of a pendulum with the states of angle and angular velocity.

.. .. raw:: html

..     <div style="text-align: center; margin-bottom: 2em;">
..     <iframe width="100%" height="350" src="https://raw.githubusercontent.com/mcm001/state-space-animations/master/videos/phase-space/720p30/PendulumCirclingOrigin.mp4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
..     </div>


To trace a potential trajectory that a system could take through state-space, choose a point to start at and follow the arrows around. In this example, we might start at :math:`[-2, 0]`. From there, the velocity increases as we swing through vertical and starts to decrease until we reach the opposite extreme of the swing. This cycle of spinning about the origin repeats indefinitely.

.. image:: images/pendulum-markedup.jpg

Note that near the edges of the phase portrait, the X axis wraps around as a rotation of :math:`\pi` radians counter clockwise and a rotation of :math:`\pi` radians clockwise will end at the same point.

For more on differential equations and phase portraits, see `3Blue1Brown's Differential Equations video <https://www.youtube.com/watch?v=p_di4Zn4wz4>`__ -- they do a great job of animating the pendulum phase space at around 15:30.

Visualizing Feedforward
~~~~~~~~~~~~~~~~~~~~~~~

This phase portrait shows the "open loop" responses of the system -- that is, how it will react if we were to let the state evolve naturally. If we want to, say, balance the pendulum horizontal (at :math:`(\frac{\pi}{2}, 0)` in state space), we would need to somehow apply a control :term:`input` to counteract the open loop tendency of the pendulum to swing downward. This is what feedforward is trying to do -- make it so that our phase portrait will have an equilibrium at the :term:`reference` position (or setpoint) in state-space. Looking at our phase portrait from before, we can see that at :math:`(\frac{\pi}{2}, 0)` in state space, gravity is pulling the pendulum down with some torque T, and producing some downward angular acceleration with magnitude :math:`\frac{\tau}{i}`, where I is angular `moment of inertia <https://en.wikipedia.org/wiki/Moment_of_inertia>`__ of the pendulum. If we want to create an equilibrium at our :term:`reference` of :math:`(\frac{\pi}{2}, 0)`, we would need to apply an :term:`input` that produces a :math:`\mathbf{\dot{x}}` is equal in magnitude and opposite in direction to the :math:`\mathbf{\dot{x}}` produced by the system's open-loop response to due to gravity. The math for this will be presented later. Here is the phase portrait where we apply a constant :term:`input` that opposes the force of gravity at :math:`(\frac{\pi}{2}, 0)`:

.. image:: images/pendulum-balance.png

Feedback Control and LQR
------------------------

Feedback Control
~~~~~~~~~~~~~~~~

In the case of a DC motor, with just a mathematical model and knowledge of all current states of the system (i.e., angular velocity), we can predict all future states given the future voltage inputs. But if the system is disturbed in any way that isn’t modeled by our equations, like a load or unexpected friction, the angular velocity of the motor will deviate from the model over time. To combat this, we can give the motor corrective commands using a feedback controller. 

A PID controller is a form of feedback control. State-space control often uses the :term:`control law` :math:`\mathbf{u} = \mathbf{K(r - x)}`, where K is some controller :term:`gain` matrix, r is the :term:`reference` state and x is the current state in state-space. The difference between these two vectors, :math:`r - x`, is known as :term:`error`. 

.. note:: A :term:`control law` is just an equation that tells us what our :term:`input` should be, given the system's :term:`state` and :term:`reference`. 

This :term:`control law` is essentially a multidimensional proportional controller, as our input is related to our error by a proportional :term:`gain`. In the case that the system being controlled has position and velocity states, the :term:`control law` above will behave as a PD controller, which also tries to drive position and velocity error to zero.

Let's show an example of this control law in action. We'll use the pendulum system from above, where the swinging pendulum circled the origin in state-space. The case where :math:`\mathbf{K}` is the zero matrix (a matrix with all zeros) would be like picking P and D gains of zero -- no control :term:`input` would be applied, and the phase portrait would look identical to the one above. 

To add some feedbac, we arbitrarily pick a :math:`\mathbf{K}` of [2, 2], where our :term:`input` to the pendulum is angular acceleration. This K would mean that for every radian of position :term:`error`, the angular acceleration would be 2 radians per second squared; similarly, we accelerate by 2 radians per second squared for every radian per second of :term:`error`. Try following an arrow from somewhere in state-space inwards -- no matter the initial conditions, the state will settle at the :term:`reference` rather than circle endlessly with pure feedforward.

.. image:: images/pendulum-closed-loop.png

But how can we choose an optimal :term:`gain` matrix K for our system? While we can manually choose :term:`gains <gain>` and simulate the system response, or tune it on-robot like a PID controller might be, modern control theory has a better answer: the Linear-Quadratic Regulator (LQR).

The Linear-Quadratic Regulator
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Because model-based control means that we can predict the future states of a system given an initial condition and future control inputs, we can pick a mathematically optimal :term:`gain` matrix :math:`\mathbf{K}`. To do this, we first have to define what a "good" or "bad" :math:`\mathbf{K}` would look like. We do this by summing the square of error and control input over time, which gives us a number representing how "bad" our control law will be. If we minimize this sum, we will have arrived at the optimal control law.

LQR: Definition
~~~~~~~~~~~~~~

Linear-Quadratic Regulators work by finding a :term:`control law` that minimizes the following cost function, which weights the sum of :term:`error` and :term:`control effort` over time, subject to the linear :term:`system` dynamics :math:`\mathbf{\dot{x} = Ax + Bu}`.

.. math::
    J = \int\limits_0^\infty \left(\mathbf{x}^T\mathbf{Q}\mathbf{x} +
    \mathbf{u}^T\mathbf{R}\mathbf{u}\right) dt

The :term:`control law` that minimizes :math:`\mathbf{J}` can be written as :math:`\mathbf{u = K(r - x)}`, where :math:`r-x` is the :term:`error`.

.. note:: LQR design's :math:`\mathbf{Q}` and :math:`\mathbf{R}` matrices don't need discretization, but the :math:`\mathbf{K}` calculated for continuous-time and discrete time :term:`systems <system>` will be different.

LQR: tuning
~~~~~~~~~~

Like PID controllers can be tuned by adjusting their gains, we also want to change how our control law balances our error and input. For example, a spaceship might want to minimize the fuel it expends to reach a given reference, while a high-speed robotic arm might need to react quickly to disturbances.

We can weight error and control effort in our LQR with :math:`\mathbf{Q}` and :math:`\mathbf{R}` matrices. In our cost function (which describes how "bad" our control law will perform), :math:`\mathbf{Q}` and :math:`\mathbf{R}` weight our error and control input relative to each other. In the spaceship example from above, we might use a :math:`\mathbf{Q}` with relatively small numbers to show that we don't want to highly penalize error, while our :math:`\mathbf{R}` might be large to show that expending fuel is undesirable.

With WPILib, the LQR class takes a vector of desired maximum state excursions and control efforts and converts them internally to full Q and R matrices with Bryson's rule. We often use lowercase :math:`\mathbf{q}` and :math:`\mathbf{r}` to refer to these vectors, and :math:`\mathbf{Q}` and :math:`\mathbf{R}` to refer to the matrices.

Increasing the :math:`\mathbf{q}` elements would make the LQR less heavily weight large errors, and the resulting :term:`control law` will behave more conservatively. This This has a similar effect to penalizing :term:`control effort` more heavily by decreasing :math:`\mathbf{q}`\'s elements.

Similarly, decreasing the :math:`\mathbf{q}` elements would make the LQR penalize large errors more heavily, and the resulting :term:`control law` will behave more aggressively. This has a similar effect to penalizing :term:`control effort` less heavily by increasing :math:`\mathbf{q}` elements.

For example, we might use the following Q and R for an elevator system with position and velocity states.

.. tabs::

   .. group-tab:: Java

      .. code-block:: Java

         // q's elements
         Vector<2> qElms = VecBuilder.fill(0.1, 0.5);

         // r's elements
         Vector<1> rElms = VecBuilder.fill(12.0);

   .. group-tab:: C++

      .. code-block:: C++

         // q's elements
         std::array<double, 2> qElms{0.1, 0.5);

         // r's elements
         std::array<double, 1> rElms{12.0};

LQR: example application
^^^^^^^^^^^^^^^^^^^^^^^^

Let's apply a Linear-Quadratic Regulator to a real-world example. Say we have a flywheel velocity system determined through system identification to have :math:`kV = 1 \frac{\text{volts}}{\text{radian per second}}` and :math:`kA = 1.5 \frac{\text{volts}}{\text{radians per second squared}}`. Using the flywheel example above, we have the following linear :term:`system`:

.. math::
    \mathbf{\dot{x}} = \begin{bmatrix}\frac{-kV}{kA}\end{bmatrix} v + \begin{bmatrix}\frac{1}{kA}\end{bmatrix} V

We arbitrarily choose a desired state excursion of :math:`q = [0.1 \text{rad/sec}]`, and an :math:`\mathbf{r}` of :math:`[12 \text{volts}]`. After discretization with a timestep of 20ms, we find a :term:`gain` of K = ~81. This K :term:`gain` acts as the proportional component of a PID loop on flywheel's velocity.

Let's adjust :math:`q` and :math:`r`. We know that increasing the q elements or decreasing the r elements we give Bryson's rule would make our controller more heavily penalize :term:`control effort`, analogous to trying to conserve fuel in a space ship or drive a car more conservatively. In fact, if we increase our :term:`error` tolerance q from 0.1 to 1.0, our :term:`gain` K drops from ~81 to ~11. Similarly, decreasing our maximum voltage :math:`r` to 1.2 from 12.0 produces the same resultant :math:`\mathbf{K}`.

.. image:: images/flywheel-lqr-ex.jpg

LQR and Measurement Latency Compensation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Oftentimes, our sensors have a delay associated with their measurements. This is especially apparent with some brushless motor controllers such as the NEO, which use a 40-tap FIR filter with a delay of 19.5ms. Furthermore, accessing sensor readings over CAN adds additional overhead, as we have to wait for status frames from motor controllers. However, this has an upper limit somewhere near 10ms between frames. As such, we can expect a CAN motor controller to have somewhere between 10ms and 30ms of lag associated with it in the worst case.

This lag means that our LQR is generating voltage commands based on state estimates from the past. This often has the effect of introducing instability and oscillations into our system, as shown in the graph below. However, we can model our controller to control where the system's :term:`state` is delayed into the future. This will reduce the LQR's :term:`gain` matrix :math:`\mathbf{K}`, trading off controller performance for stability. The below formula, which adjusts the :term:`gain` matrix to account for delay, is also used in frc-characterization.

.. math::
    \mathbf{K_{compensated}} = \mathbf{K} \cdot \left(\mathbf{A} - \mathbf{BK}\right)^{\text{delay} / dt}

Multiplying :math:`\mathbf{K}` by :math:`\mathbf{A} - \mathbf{BK}` essentially advances the gains by one timestep. In this case, we multiply by :math:`\left(\mathbf{A} - \mathbf{BK}\right)^{\text{delay} / dt}` to advance the gains by measurement's delay.

.. image:: images/latency-comp-lqr.jpg

.. note:: This can have the effect of reducing :math:`\mathbf{K}` to zero, effectively disabling feedback control. 

Linearization
-------------

Linearization is a tool used to approximate nonlinear functions and state-space systems using linear ones. In two-dimensional space, linear functions are straight lines while nonlinear functions curve. A common example of a nonlinear function and its corresponding linear approximation is :math:`y=\sin{x}`. This function can be approximated by :math:`y=x` near zero. This approximation is accurate while near :math:`x=0`, but looses accuracy as we stray further from the linearization point. For example, the approximation :math:`\sin{x} \approx x` is accurate to within 0.02 within 0.5 radians of :math:`y = 0`, but quickly loses accuracy past that. In the following picture, blue shows :math:`y =\sin{x}`, orange shows :math:`y=x`, and green shows the difference between the two functions.

.. image:: images/linear-sin-x.jpg

We can also linearize state-space systems with nonlinear :term:`dynamics`. We do this by picking a point :math:`\mathbf{x}` in state-space and using this as the input to our nonlinear functions. Like in the above example, this works well for states near the point about which the system was linearized, but can quickly diverge further from that state.

WPILib's LinearSystemLoop
-------------------------

WPILib's state-space control is based on the ``LinearSystemLoop`` class. This class contains all the components needed to control a mechanism using state-space control. It contains the following members:

- A ``LinearSystem`` representing the continuous-time state-space equations of the :term:`system`.
- A :ref:`Kalman Filter <docs/software/advanced-controls/state-space/state-space-observers:State Observers and Kalman Filters>`, used to filter noise from sensor :term:`measurements <measurement>`.
- A Linear-Quadratic Regulator, which combines feedback and feedforward to generate :term:`inputs <input>`.

As the system being controlled is in discrete domain, we follow the following steps at each update cycle:

- ``correct(measurement, nextReference)`` "fuses" the measurement and Kalman Filter :math:`\hat{\mathbf{x}}` (:term:`x-hat`) to steer the estimated state back to reality using :term:`measurements <measurement>` of what the :term:`plant` is actually doing. This updated state estimate is used by the Linear-Quadratic Regulator to generate an updated :term:`input` :math:`\mathbf{u}` to drive the system towards the next :term:`reference`.

- ``predict()`` uses the state-space model to predict where the the :term:`system`\'s :term:`state` :math:`\hat{\mathbf{x}}` (:term:`x-hat`) will be in the future based on applied inputs. The predict step is analogous to estimating a pendulum's (or other :term:`systems <system>`) next state by following the arrows in a phase portrait.

- The updated :term:`input` is set to motors or other physical actuator.
