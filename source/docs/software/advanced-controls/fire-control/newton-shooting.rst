Newton's Method for Dynamic Shooting
=====================================

The previous article described the time-of-flight recursion — a fixed-point iteration that converges to the correct shot by repeatedly looking up the TOF from the adjusted target position.  This works well and is simple to implement, but the fixed-point iteration can be slow to converge for certain robot velocities (as we saw in the convergence fractal).  This article describes a Newton's method reformulation that converges much faster — and discusses why faster convergence does not necessarily mean better shots.

The Reformulation
-----------------

We first introduce notation.  Let:

- :math:`\mathbf{r}` — robot position
- :math:`\mathbf{g}` — goal (target) position
- :math:`\mathbf{v} = (v_x,\; v_y)` — robot velocity
- :math:`v_p` — horizontal projectile speed
- :math:`\tau` — time of flight

As the robot moves, the *virtual target* shifts opposite to the robot's velocity.  The firing table maps distance to time of flight; call this mapping :math:`\tau(D)`.  It may be the constant-velocity model :math:`\tau(D) = D / v_p`, or an empirical lookup table (LUT).  The fixed-point iteration is :math:`\tau_{n+1} = \tau(D(\tau_n))` — we converge to the TOF that the table implies for the current geometry.  To use Newton's method instead, we define the *TOF error* :math:`E(\tau) = \tau - \tau(D(\tau))` and iterate:

.. math::

   \tau_{n+1} \;=\; \tau_n \;-\; \frac{E(\tau_n)}{E'(\tau_n)}

The rest of this section is a recipe for computing :math:`E` and :math:`E'` at the current guess :math:`\tau_n`, so you can plug them into the equation above.  We will adopt the strategy of using the exact LUT residual :math:`E` and a constant-velocity approximation for the derivative :math:`E'`, as this gives us the best of both worlds: it converges quickly and is relatively insensitive to noise.

Step 1 — Geometry at the current guess
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

At the current TOF guess :math:`\tau_n`, compute the displacement to the virtual target and its distance:

.. math::

   d_x \;=\; (g_x - r_x) \;-\; v_x\,\tau_n
   \qquad
   d_y \;=\; (g_y - r_y) \;-\; v_y\,\tau_n
   \qquad
   D \;=\; \sqrt{d_x^2 + d_y^2}

(Equivalently, :math:`\mathbf{d} = (\mathbf{g} - \mathbf{r}) - \mathbf{v}\,\tau_n` and :math:`D = \lvert\mathbf{d}\rvert`.)

Step 2 — The error (residual)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Compute the TOF error.  The table says that distance :math:`D` corresponds to time of flight :math:`\tau(D)`; we want that to equal our guess, so the error is:

.. math::

   E \;=\; \tau_n \;-\; \tau(D)

- **Exact LUT residual:** We use the empirical residual at this step: look up :math:`\tau(D)` in your table (or interpolate); :math:`E = \tau_n - \tau_{\mathrm{LUT}}(D)`.  This ensures that we converge to the correct (empirical) TOF, rather than the TOF implied by the constant-velocity model.

Step 3 — Rate of change of distance with respect to :math:`\tau`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In order to compute the error derivative, we need to know how the distance changes with respect to the TOF.

As we increase the TOF guess, the virtual target moves; :math:`d_x` and :math:`d_y` each change by :math:`-v_x` and :math:`-v_y` per unit :math:`\tau`.  So the rate at which :math:`D` changes is:

.. math::

   \frac{dD}{d\tau} \;=\; -\frac{d_x\, v_x + d_y\, v_y}{D}

(This is negative when the robot has a component of velocity toward the target — increasing :math:`\tau` shortens the distance.)  In vector form, the same quantity is :math:`\mathbf{d} \cdot (-\mathbf{v}) / D`.

Step 4 — The error derivative :math:`E'`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Now, to find the error derivative we can use the chain rule, :math:`E' = 1 - \tau'(D)\,(dD/d\tau)`.  We need :math:`\tau'(D)`, which we can find by differentiating :math:`\tau(D) = D/v_p` with respect to :math:`D`:

.. math::

   \tau'(D) \;=\; \frac{d}{dD} \left( \frac{D}{v_p} \right) \;=\; \frac{1}{v_p}

So, the error derivative is:

.. math::

   E' \;=\; 1 \;-\; \frac{1}{v_p} \cdot \left( -\frac{d_x\, v_x + d_y\, v_y}{D} \right) \;=\; 1 \;+\; \frac{d_x\, v_x + d_y\, v_y}{v_p\, D}

- **Constant-velocity approximation:** The derivative is used to determine the step size for the Newton update; to reduce noise-sensitivity, we use an approximate derivative :math:`\tau'(D) \approx 1/v_p` instead of the exact derivative (which would require differentiating the firing table).  Because we use the empirical residual, this approximation will still converge to the correct TOF; using the exact derivative would potentially speed up convergence slightly, but at the cost of introducing noise amplification.

Step 5 — Newton update
^^^^^^^^^^^^^^^^^^^^^^

Using the values of :math:`E` and :math:`E'` from the steps above:

.. math::

   \tau_{n+1} \;=\; \tau_n \;-\; \frac{E}{E'}

Repeat from Step 1 with :math:`\tau_{n+1}` as the new guess until converged.

Picking an Initial Guess
------------------------

Our fixed-point recursion started with a guess of the time of flight to the target from a non-moving platform.  One benefit of the "naive" fixed-point recursion is that it is relatively insensitive to this initial guess; there's not much benefit to picking a better initial guess, because doing so would only help in regions where the convergence is garbage anyway.

Newton's method is more powerful, but at a cost: it is more sensitive to the initial guess than the simpler fixed-point iteration.  If the initial guess is too far from the true solution, the iteration may converge to an inappropriate solution.  The time of flight error function above in fact has *two* roots (because there are two possible solutions to the shot-geometry problem); which one we converge to depends on the initial guess.

For example, if we sprint towards the target at a speed greater than the projectile speed, the initial guess from our fixed-point recursion will force us to converge to a virtual target that is *behind* the platform.  This is a "correct" solution, but it is not the one we want.

To avoid this, we need to pick an initial guess that is close to the true solution.  We can do this by using our constant-projectile-velocity model to direct-solve the case of motion directly towards or away from the target in terms of platform and projectile velocities:

.. math::

   \tau = \frac{D}{v_p + |\mathbf{v}|}

We can use this formula for a general platform velocity by projecting the platform velocity onto the direction of the target:

.. math::

   \tau = \frac{D}{v_p + |\mathbf{v}|\cos(\theta)}

where :math:`\theta` is the angle between the platform velocity and the target.

This gives us an initial guess that is close to the desired solution regardless of the platform velocity, and guarantees good convergence behavior across the entire region of reachable velocity space.

Interactive Visualization
-------------------------

Use the visualization below to compare Newton's method to the fixed-point iteration.  The two **Simulation** modes let you drag the robot velocity vector and step through iterations for each solver; **Fractal (Newton)** and **Fractal (Fixed-Point)** show convergence heatmaps.

.. note:: The color scale differs between methods: Newton typically converges in 1-3 iterations, while the fixed-point iteration may take hundreds.  The legend adjusts automatically.  In both fractals, the same geodesic (purple) and convergence envelope (blue) are overlaid.

.. raw:: html

    <div class="viz-div" id="newton_shooting_container">
      <div class="flex-grid">
         <div class="col" id="newton_shooting_viz"></div>
         <div id="newton_shooting_ctrls"></div>
      </div>
      <script>
         newton_shooting = new NewtonShootingWidget("newton_shooting");
      </script>
    </div>

Toggle between **Fractal (Newton)** and **Fractal (Fixed-Point)** to see the dramatic reduction in iteration count.  The fixed-point fractal's intricate banding structure — hundreds of iterations near the Mach cone boundary — collapses to a near-uniform 2–3 iterations under Newton's method.  The convergence envelope (blue) also expands significantly: Newton converges in regions where fixed-point iteration fails entirely within the same iteration budget.

Convergence Does Not Equal Quality
-----------------------------------

Newton's method converges to the correct geometric solution in very few iterations.  But the "correct geometric solution" in the ill-conditioned region of velocity space is still ill-conditioned.  Newton finds it faster; it doesn't make it less fragile.

The fixed-point fractal was warning you about the physics, not the numerics.  The fine structure of the convergence bands reflects the sensitivity of the time-of-flight to small changes in robot velocity — a property of the problem geometry, not the solver.  A shot that takes 500 fixed-point iterations to converge takes 3 Newton iterations to reach the same answer, but that answer is equally sensitive to velocity error.

Where Newton does genuinely help is in preventing a *bad failure mode*: in a real-time control loop with a hard iteration budget, the fixed-point iteration in the ill-conditioned region might be cut off mid-oscillation, producing a qualitatively wrong firing solution (the turret points the wrong way entirely).  Newton, by converging quickly, ensures that the solver is not the reason you miss — the miss, if it happens, is the physics' fault, not the numerics'.

Proxy Derivatives for Empirical Tables
---------------------------------------

As derived above, the *middleground* for empirical tables is: residual :math:`E(\tau) = \tau - \tau_{\mathrm{LUT}}(D(\tau))` (so the fixed point is the table's TOF), derivative :math:`E'(\tau) = 1 + (d_x v_x + d_y v_y)/(v_p D)` using the constant-velocity proxy :math:`\tau'(D) \approx 1/v_p` (so the table is never differentiated).  In the constant-velocity model, :math:`\tau'(D) = 1/v_p` is exact and Newton achieves quadratic convergence.  With a LUT, using :math:`1/v_p` as a proxy gives a quasi-Newton iteration that:

- Converges faster than fixed-point (the proxy provides a damped Newton correction)
- Does not require differentiating the firing table (no noise amplification)
- Degrades gracefully: for drag, the true :math:`\tau'(D) > 1/v_p`, so the proxy undershoots the correction — a *stabilizing* error that slows convergence slightly but never causes divergence

The convergence rate of this proxy-Newton approach sits between linear (fixed-point) and quadratic (exact Newton), with the gap depending on how much drag distorts :math:`\tau'(D)` from :math:`1/v_p`.  For FRC-class projectiles where drag is modest, the distortion is small and you get nearly the full Newton speedup for free.

Shot Quality in Practice
-------------------------

Newton's method converges to the correct solution in a few iterations even in the Mach cone region, but it does not change the physics: the shot is still fragile there if the robot velocity is wrong.

Therefore, the shot quality metrics discussed in the previous article are still important to consider when making a shot, and it can be useful to run a few iterations of fixed-point iteration to get a sense of the shot stability, *even when your shot solution comes from Newton's method*.
