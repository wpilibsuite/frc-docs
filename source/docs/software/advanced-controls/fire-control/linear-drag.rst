Linear Drag (First-Order Air Friction)
======================================

.. note:: At higher velocities, drag force is better-modeled as including quadratic (squared) velocity term, in addition to the linear one.  This is a more accurate model, but it is also more complex to compute.  We will not cover that model here, but you can read more about it in the [Drag (physics)](https://en.wikipedia.org/wiki/Drag_%28physics%29#Low_Reynolds_numbers:_Stokes'_drag) article on Wikipedia.  Most FRC game projectiles are small enough and slow enough that the linear drag model is a good approximation.

The previous articles assumed that over a time interval :math:`\tau`, the platform (robot) displacement due to its velocity :math:`\mathbf{v}` is simply :math:`\mathbf{v}\,\tau` — Galilean relativity.  That is exact in vacuum.  If the projectile or the motion-adjustment is instead modeled with **linear drag** (Stokes drag), the effective displacement over time :math:`\tau` takes a different form.

But Don't We Already Account for Drag?
--------------------------------------

One of the benefits of using a firing table rather than a mathematical model is that it automatically accounts for the effect of drag (so long as we have populated it by firing shots at different distances and tuning the table entries until the shots go in).  You may then wonder - why do we need a drag adjustment at all?

While the firing table accounts for the effect of drag induced by the motion of the projectile, it does *not* account for **induced windage** - the effect of the platform's motion on the projectile's drag.

Fortunately, because we are only considering *linear* drag, the effect of the induced windage is strictly additive; it does not interact with the "free" drag adjustment that we already have implicit in our firing table.  Since we are already displacing the target by a distance depending on our time of flight, it would be convenient if we could simply adjust that displacement in a simple way that correctly accounts for the induced windage without having to modify the firing table.

It turns out, we can do exactly that - the adjustment is simple, elegant, and introduces only a single new parameter: the drag constant :math:`k`.

Platform-Induced Motion under Linear Drag
-----------------------------------------

Both of our methods for solving the dynamic shooting problem require us to compute the platform-induced displacement over time :math:`\tau`.  Recall that, not taking into account the drag, the displacement is simply :math:`\mathbf{v}\,\tau`.

Under linear drag, displacement over time is not simply linear; it decays exponentially at a rate determined by the drag constant :math:`k`:

.. math::

   \Delta\mathbf{x} \;=\; \mathbf{v}\;\frac{1 - e^{-k \tau}}{k}

So instead of :math:`\mathbf{v}\,\tau`, we have :math:`\mathbf{v}\,\alpha(\tau)` with an **effective time-of-flight**:

.. math::

   \alpha(\tau) \;=\; \frac{1 - e^{-k \tau}}{k}

In the case of short flight times or low drag constants, :math:`\alpha(\tau) \approx \tau`, so the effective time-of-flight is approximately the original time-of-flight.  This is our original Galilean displacement.

As :math:`\tau` increases, :math:`\alpha(\tau)` approaches :math:`\frac{1}{k}`.  This asymptote represents the limit of the effect of the platform's motion on the projectile; once the platform-induced velocity has decayed to zero, further flight time does not cause any additional platform-induced displacement.

This effective time-of-flight is easy to compute, and can be applied to both the fixed-point iteration and Newton's method.

Fixed-Point Iteration with Linear Drag (TOF Recursion)
------------------------------------------------------

The recursion is unchanged in form: we repeatedly look up the TOF for the current virtual distance and use that TOF to update the virtual target:

1. Given a TOF guess :math:`\tau_n`, form the effective time-of-flight :math:`\alpha(\tau_n)`
2. Calculate the virtual target offset using the effective time-of-flight: :math:`\mathbf{v}\,\alpha(\tau_n)`
3. Look up the time-of-flight for the distance to the virtual target in the look-up table, and repeat until converged.

There's no need to modify the look-up table or change any other step in the recursion; the **only** change is to use the effective time-of-flight instead of the original time-of-flight when computing the virtual target offset.

Newton's Method with Linear Drag
--------------------------------

The same substitution applies, but we need to be intentional about where we apply it - we need to adjust both the residual (by computing it from the drag-adjusted virtual distance) and the derivative (by computing it from the drag-adjusted virtual distance's derivative).  Define the TOF error as before, but with the drag-adjusted virtual distance:

.. math::

   E(\tau) \;=\; \tau \;-\; \tau\!\bigl(D(\tau)\bigr)
   \qquad\text{where}\qquad
   \mathbf{d}(\tau) \;=\; (\mathbf{g} - \mathbf{r}) \;-\; \mathbf{v}\,\alpha(\tau)
   \,,\quad D(\tau) \;=\; \lvert\mathbf{d}(\tau)\rvert

Newton's method still iterates :math:`\tau_{n+1} = \tau_n - E(\tau_n)/E'(\tau_n)`.  The derivative :math:`E'(\tau)` now includes the effect of :math:`\alpha(\tau)`.  Since :math:`d\mathbf{d}/d\tau = -\mathbf{v}\,\alpha'(\tau)`:

.. math::

   \frac{dD}{d\tau}
   \;=\; \frac{\mathbf{d} \cdot (-\mathbf{v}\,\alpha'(\tau))}{D}
   \;=\; -\alpha'(\tau)\;\frac{d_x\, v_x + d_y\, v_y}{D}

So the error derivative is (chain rule, same as before but with the extra :math:`\alpha'(\tau)` factor):

.. math::

   E'(\tau) \;=\; 1 \;-\; \tau'(D)\,\frac{dD}{d\tau}
            \;=\; 1 \;+\; \tau'(D)\,\alpha'(\tau)\;\frac{d_x\, v_x + d_y\, v_y}{D}

With the constant-velocity proxy :math:`\tau'(D) \approx 1/v_p`:

.. math::

   E'(\tau) \;=\; 1 \;+\; \alpha'(\tau)\;\frac{d_x\, v_x + d_y\, v_y}{v_p\; D}

For linear drag, :math:`\alpha(\tau) = (1 - e^{-k\tau})/k`, so:

.. math::

   \alpha'(\tau) \;=\; e^{-k\tau}

and the Newton step is fully explicit: residual uses your LUT (and :math:`\alpha(\tau)` in :math:`D(\tau)`), denominator uses :math:`1/v_p` and :math:`\alpha'(\tau) = e^{-k\tau}`.

This gives us a correct drag-adjusted convergence target (because our residual is computed from the drag-adjusted virtual distance) and a faster-converging Newton step (because the derivative is computed from the drag-adjusted virtual distance's derivative).

The Drag Constant :math:`k`
---------------------------

Our linear drag adjustment in either case introduces a single new parameter: the drag constant :math:`k`.  This corresponds to the "time constant" of the linear drag decay: after time :math:`\tau = 1/k`, the velocity has decayed to :math:`e^{-1} \approx 0.368` of its initial value (and the displacement over that time is :math:`\mathbf{v}\,\alpha(1/k) = \mathbf{v}\,(1 - e^{-1})/k`).

For FRC gamepieces, which travel at low speed and typically have a fair amount of linear drag, it is pretty easy to "eyeball" the drag constant by simply counting the seconds for a launched projectile to lose a bit more than half its initial velocity.  The reciprocal of this time is the drag constant :math:`k`.

Alternatively, you can simply tune the drag constant until the shots go in at high platform speeds (remember, the firing table should already account for the effect of drag on stationary shots, so you are tuning for the induced windage effect alone).




