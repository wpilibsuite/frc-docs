State-Space Glossary
====================

.. glossary::

    dynamics
        A branch of physics concerned with the motion of bodies under the action of forces. In modern control, systems evolve according to their dynamics.

    control law
        A mathematical formula that generates :term:`inputs <input>` to drive a :term:`system` to a desired :term:`state`, given the current :term:`state`. A common example is the control law :math:`\mathbf{u} = \mathbf{K(r - x)}`

    gain
        A proportional value that relates the magnitude of an input signal to the magnitude of an output signal. In the signal-dimensional case, gain can be thought of as the proportional term of a PID controller. A gain greater than one would amplify an input signal, while a gain less than one would dampen an input signal. A negative gain would negate the input.

    hidden state
        A :term:`state` that cannot be directly measured, but whose :term:`dynamics` can be related to other states.

    measurement
        Measurements are :term:`outputs <output>` that are measured from a :term:`plant`, or physical system, using sensors.

    system identification
        The process of capturing a :term:`systems <system>` :term:`dynamics` in a mathematical model using measured data. The characterization toolsuite uses system identification to find kS, kV and kA terms.

    x-dot
        :math:`\dot{\mathbf{x}}`, or x-dot: the derivative of the :term:`state` vector :math:`\mathbf{x}`. If the :term:`system` had just a velocity :term:`state`, then :math:`\dot{\mathbf{x}}` would represent the :term:`system`\'s acceleration.

    x-hat
        :math:`\hat{\mathbf{x}}`, or x-hat: the estimated :term:`state` of a system, as estimated by an :term:`observer`.
