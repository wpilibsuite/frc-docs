Controls Glossary
=================

.. glossary::

   reference
      The desired state. This value is used as the reference point for a controller's error calculation.

   input
      An input to the :term:`plant` (hence the name) that can be used to change the :term:`plant's <plant>` :term:`state`.

            - Ex. A flywheel will have 1 input: the voltage of the motor driving it.
            - Ex. A drivetrain might have 2 inputs: the voltages of the left and right motors.

        Inputs are often represented by the variable :math:`\mathbf{u}`, a column vector with one entry per :term:`input` to the :term:`system`.

   output
      Measurements from sensors. There can be more measurements then states. These outputs are used in the "correct" step of Kalman Filters.

            - Ex. A flywheel might have 1 :term:`output` from a encoder that measures it's velocity.
            - Ex. A drivetrain might use solvePNP and V-SLAM to find it's x/y/heading position on the field. It's fine that there are 6 measurements (solvePNP x/y/heading and V-SLAM x/y/heading) and 3 states (robot x/y/heading).

        Outputs of a :term:`system` are often represented using the variable :math:`\mathbf{y}`, a column vector with one entry per :term:`output` (or thing we can measure). For example, if our :term:`system` had states for velocity and acceleration but our sensor could only measure velocity, our, our :term:`output` vector would only include the :term:`system`\'s velocity.

   process variable
      The term used to describe the output of a :term:`plant` in the context of PID control.

   setpoint
      The term used to describe the :term:`reference` of a PID controller.

   error
      :term:`Reference <reference>` minus an :term:`output` or :term:`state`.

   state
      A characteristic of a :term:`system` (e.g., velocity) that can be used to determine the :term:`system's <system>` future behavior. In state-space notation, the state of a system is written as a column vector describing it's position in state-space.

            - Ex. A drivetrain system might have the states :math:`\begin{bmatrix}x \\ y \\ \theta \end{bmatrix}` to describe it's position on the field.
            - Ex. An elevator system might have the states :math:`\begin{bmatrix}position \\ velocity \end{bmatrix}` to describe its current height and velocity.

        A :term:`system's <system>` state is often represented by the variable :math:`\mathbf{x}`, a column vector with one entry per :term:`state`.

   system
      A term encompassing a :term:`plant` and it's interaction with a :term:`controller` and :term:`observer`, which is treated as a single entity. Mathematically speaking, a :term:`system` maps :term:`inputs <input>` to :term:`outputs <output>` through a linear combination of :term:`states <state>`.

   plant
      The :term:`system` or collection of actuators being controlled.

   controller
      Used in position or negative feedback with a :term:`plant` to bring about a desired :term:`system state <state>` by driving the difference between a :term:`reference` signal and the :term:`output` to zero.

   observer
      In control theory, a system that provides an estimate of the internal :term:`state` of a given real :term:`system` from measurements of the :term:`input` and :term:`output` of the real :term:`system`. WPILib includes a Kalman Filter class for observing linear systems, and ExtendedKalmanFilter and UnscentedKalmanFilter classes for nonlinear systems.

   control input
      The input of a :term:`plant` used for the purpose of controlling it

   control effort
      A term describing how much force, pressure, etc. an actuator is exerting.

   steady-state error
      :term:`Error <error>` after :term:`system` reaches equilibrium.

   step response
      The response of a :term:`system` to a :term:`step input`.

   step input
      A :term:`system` :term:`input` that is :math:`0` for :math:`t < 0` and a constant greater than :math:`0` for :math:`t \geq 0`. A step input that is :math:`1` for :math:`t \geq 0` is called a unit step input.

   rise time
      The time a :term:`system` takes to initially reach the :term:`reference` after applying a :term:`step input`.

   settling time
      The time a :term:`system` takes to settle at the :term:`reference` after a :term:`step input` is applied.

   system response
      The behavior of a :term:`system` over time for a given :term:`input`.

   model
      A set of mathematical equations that reflects some aspect of a physical :term:`system's <system>` behavior.
