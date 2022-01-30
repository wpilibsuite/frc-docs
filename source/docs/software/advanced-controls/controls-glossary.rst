Controls Glossary
=================

.. glossary::

   control effort
      A term describing how much force, pressure, etc. an actuator is exerting.

   control input
      The input of a :term:`plant` used for the purpose of controlling it

   control law
      A mathematical formula that generates :term:`inputs <input>` to drive a :term:`system` to a desired :term:`state`, given the current :term:`state`. A common example is the control law :math:`\mathbf{u} = \mathbf{K(r - x)}`

   controller
      Used in position or negative feedback with a :term:`plant` to bring about a desired :term:`system state <state>` by driving the difference between a :term:`reference` signal and the :term:`output` to zero.

   dynamics
      A branch of physics concerned with the motion of bodies under the action of forces. In modern control, systems evolve according to their dynamics.

   error
      :term:`Reference <reference>` minus an :term:`output` or :term:`state`.

   gain
      A proportional value that relates the magnitude of an input signal to the magnitude of an output signal. In the signal-dimensional case, gain can be thought of as the proportional term of a PID controller. A gain greater than one would amplify an input signal, while a gain less than one would dampen an input signal. A negative gain would negate the input signal.

   hidden state
      A :term:`state` that cannot be directly measured, but whose :term:`dynamics` can be related to other states.

   input
      An input to the :term:`plant` (hence the name) that can be used to change the :term:`plant's <plant>` :term:`state`.

         - Ex. A flywheel will have 1 input: the voltage of the motor driving it.
         - Ex. A drivetrain might have 2 inputs: the voltages of the left and right motors.

      Inputs are often represented by the variable :math:`\mathbf{u}`, a column vector with one entry per :term:`input` to the :term:`system`.

   measurement
      Measurements are :term:`outputs <output>` that are measured from a :term:`plant`, or physical system, using sensors.


   model
      A set of mathematical equations that reflects some aspect of a physical :term:`system's <system>` behavior.

   moment of inertia
      A measurement of a rotating body's resistance to angular acceleration or deceleration. Angular moment of inertia can be thought of as angular mass. See also: `Moment of inertia <https://en.wikipedia.org/wiki/Moment_of_inertia>`__.

   observer
      In control theory, a system that provides an estimate of the internal :term:`state` of a given real :term:`system` from measurements of the :term:`input` and :term:`output` of the real :term:`system`. WPILib includes a Kalman Filter class for observing linear systems, and ExtendedKalmanFilter and UnscentedKalmanFilter classes for nonlinear systems.

   output
      Measurements from sensors. There can be more measurements then states. These outputs are used in the "correct" step of Kalman Filters.

         - Ex. A flywheel might have 1 :term:`output` from a encoder that measures it's velocity.
         - Ex. A drivetrain might use solvePNP and V-SLAM to find it's x/y/heading position on the field. It's fine that there are 6 measurements (solvePNP x/y/heading and V-SLAM x/y/heading) and 3 states (robot x/y/heading).

      Outputs of a :term:`system` are often represented using the variable :math:`\mathbf{y}`, a column vector with one entry per :term:`output` (or thing we can measure). For example, if our :term:`system` had states for velocity and acceleration but our sensor could only measure velocity, our, our :term:`output` vector would only include the :term:`system`\'s velocity.

   plant
      The :term:`system` or collection of actuators being controlled.

   process variable
      The term used to describe the output of a :term:`plant` in the context of PID control.

   reference
      The desired state. This value is used as the reference point for a controller's error calculation.

   rise time
      The time a :term:`system` takes to initially reach the :term:`reference` after applying a :term:`step input`.

   setpoint
      The term used to describe the :term:`reference` of a PID controller.

   settling time
      The time a :term:`system` takes to settle at the :term:`reference` after a :term:`step input` is applied.

   state
      A characteristic of a :term:`system` (e.g., velocity) that can be used to determine the :term:`system's <system>` future behavior. In state-space notation, the state of a system is written as a column vector describing it's position in state-space.

         - Ex. A drivetrain system might have the states :math:`\begin{bmatrix}x \\ y \\ \theta \end{bmatrix}` to describe it's position on the field.
         - Ex. An elevator system might have the states :math:`\begin{bmatrix} \text{position} \\ \text{velocity} \end{bmatrix}` to describe its current height and velocity.

      A :term:`system's <system>` state is often represented by the variable :math:`\mathbf{x}`, a column vector with one entry per :term:`state`.

   steady-state error
      :term:`Error <error>` after :term:`system` reaches equilibrium.

   step input
      A :term:`system` :term:`input` that is :math:`0` for :math:`t < 0` and a constant greater than :math:`0` for :math:`t \geq 0`. A step input that is :math:`1` for :math:`t \geq 0` is called a unit step input.

   step response
      The response of a :term:`system` to a :term:`step input`.

   system
      A term encompassing a :term:`plant` and it's interaction with a :term:`controller` and :term:`observer`, which is treated as a single entity. Mathematically speaking, a :term:`system` maps :term:`inputs <input>` to :term:`outputs <output>` through a linear combination of :term:`states <state>`.

   system identification
        The process of capturing a :term:`systems <system>` :term:`dynamics` in a mathematical model using measured data. The SysId toolsuite uses system identification to find kS, kV and kA terms.

   system response
      The behavior of a :term:`system` over time for a given :term:`input`.

   x-dot
      :math:`\dot{\mathbf{x}}`, or x-dot: the derivative of the :term:`state` vector :math:`\mathbf{x}`. If the :term:`system` had just a velocity :term:`state`, then :math:`\dot{\mathbf{x}}` would represent the :term:`system`\'s acceleration.

   x-hat
      :math:`\hat{\mathbf{x}}`, or x-hat: the estimated :term:`state` of a system, as estimated by an :term:`observer`.
