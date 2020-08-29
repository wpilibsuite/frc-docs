State-Space Glossary
====================

.. glossary::

    Dynamics
        A branch of physics concerned with the motion of bodies under the action of forces. In modern control, systems evolve according to their dynamics.

    Control Effort
        A term describing how much force, pressure, etc. an actuator is exerting

    Controller
        Applies an :term:`input` to a :term:`plant` to drive the difference between a :term:`reference` and :term:`output`, or :term:`error`, to zero.

    Control Law
        A mathematical formula that generates :term:`inputs <input>` to drive a :term:`system` to a desired :term:`state`.

    Error
        :term:`Reference` minus an output or state.

    Gain
        A proportional value that relates the magnitude of an input signal to the magnitude of an output signal. In the signal-dimensional case, gain can be thought of as the proportional term of a PID controller. A gain greater than one would amplify an input signal, while a gain less than one would dampen an input signal. A gain less than one would negate the input.

    Hidden State
        A :term:`state` that cannot be directly measured, but whose :term:`Dynamics` can be related to other states.

    Input
        Any :term:`input` to the :term:`plant` (or physical system) that can change the :term:`plant`\'s state. Think about inputs as being put *into* the physical system being controlled.

            - Ex. A flywheel will have 1 input: the voltage of the motor driving it.
            - Ex. A drivetrain might have 2 inputs: the voltages of the left and right motors.

        Inputs are often represented by the variable :math:`\mathbf{u}`, a column vector with one entry per :term:`input` to the :term:`system`.

    Observer
        In control theory, a system that provides an estimate of the internal :term:`state` of a given real :term:`system` from measurements of the :term:`input` and :term:`output` of the real :term:`system`. WPILib includes a Kalman Filter class for observing linear systems, and ExtendedKalmanFilter and UnscentedKalmanFilter classes for nonlinear systems.

    Output
        Measurements from sensors. Think about this as information coming *out* of the physical system being controlled. There can be more measurements then states. These outputs are used to "correct"

            - Ex. A flywheel might have 1 :term:`output` from a encoder that measures it's velocity.
            - Ex. A drivetrain might use solvePNP and V-SLAM to find it's x/y/heading position on the field. It's fine that there are 6 measurements (solvePNP x/y/heading and V-SLAM x/y/heading) and 3 states (robot x/y/heading).

        Outputs of a :term:`system` are often represented using the variable :math:`\mathbf{y}`, a column vector with one entry per :term:`output` (or thing we can measure). For example, if our :term:`system` had states for velocity and acceleration but our sensor could only measure velocity, our, our :term:`output` vector would only include the :term:`system`\'s velocity.

    Measurement
        Measurements are :term:`outputs <output>` that are measured from a :term:`plant`, or physical system, using sensors.

    Model
        A mathematical representation of a physical :term:`system`.

    Plant
        The system or collection of actuators being controlled.

    Reference
        The desired :term:`state`. This value is used as the reference point for a :term:`controller` 's :term:`error` calculation.

    System
        The physical thing being controlled. Has States, Inputs and Outputs associated with it. In state-space control, a System refers to a :term:`plant` as well as it's interactions with a controller and observer. Mathematically, a system maps inputs to outputs through a linear combination of :term:`states <state>`.

    State
        A characteristic of a system that can be used to determine the system's future behavior. In state-space notation, the state of a system is written as a column vector describing it's position in state-space.

            - Ex. A drivetrain system might have the states :math:`\begin{bmatrix}x \\ y \\ \theta \end{bmatrix}` to describe it's position on the field.
            - Ex. An elevator system might have the states :math:`\begin{bmatrix}position \\ velocity \end{bmatrix}` to describe its current height and velocity.

        A :term:`system's <system>` state is often represented by the variable :math:`\mathbf{x}`, a column vector with one entry per :term:`state`.

    System Identification
        The process of capturing a :term:`systems <system>` :term:`Dynamics` in a mathematical model using measured data. The characterization toolsuite uses system identification to find kS, kV and kA terms.

    Observer
        In control theory, a system that provides an estimate of the internal :term:`state` of a given real :term:`system` from measurements of the :term:`input` and :term:`output` of the real :term:`system`. WPILib includes a Kalman Filter class for observing linear systems, and ExtendedKalmanFilter and UnscentedKalmanFilter classes for nonlinear systems.

    x-dot
        :math:`\dot{\mathbf{x}}`, or x-dot: the derivative of the :term:`state` vector :math:`\mathbf{x}`. If the :term:`system` had just a velocity :term:`state`, then :math:`\dot{\mathbf{x}}` would represent the :term:`system`\'s acceleration.

    x-hat
        :math:`\hat{\mathbf{x}}`, or x-hat: the estimated :term:`state` of a system, as estimated by an :term:`observer`.
