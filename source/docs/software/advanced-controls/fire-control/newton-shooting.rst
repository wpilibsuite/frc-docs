Newton's Method for Dynamic Shooting
=====================================

The previous article described the time-of-flight recursion — a fixed-point iteration that converges to the correct shot by repeatedly looking up the TOF from the adjusted target position.  This works well and is simple to implement, but the fixed-point iteration can be slow to converge for certain robot velocities (as we saw in the convergence fractal).  This article describes a Newton's method reformulation that converges much faster — and discusses why faster convergence does not necessarily mean better shots.

The Reformulation
-----------------

We first introduce notation.  Let:

- :math:`\mathbf{r}` — robot position
- :math:`\mathbf{g}` — goal (target) position
- :math:`\mathbf{v} = (v_x,\; v_y)` — robot velocity
- :math:`v_p` — projectile speed (constant)
- :math:`\tau` — time of flight (the unknown we solve for)

As the robot moves, the *virtual target* shifts opposite to the robot's velocity.  The displacement from the robot to the virtual target at a given TOF guess :math:`\tau` is:

.. math::

   \mathbf{d}(\tau) \;=\; (\mathbf{g} - \mathbf{r}) \;-\; \mathbf{v}\,\tau

with components :math:`d_x(\tau) = (g_x - r_x) - v_x \tau` and :math:`d_y(\tau) = (g_y - r_y) - v_y \tau`.  The distance to the virtual target is :math:`D(\tau) = \lvert\mathbf{d}(\tau)\rvert = \sqrt{d_x^2 + d_y^2}`.

The firing table maps distance to time of flight.  In the constant-velocity model this is simply :math:`\operatorname{tof}(D) = D / v_p`.  The fixed-point iteration from the previous article is then :math:`\tau_{n+1} = \operatorname{tof}\!\bigl(D(\tau_n)\bigr)`.

To apply Newton's method, we rewrite the fixed-point condition as a root-finding problem.  Define the *TOF error*:

.. math::

   E(\tau) \;=\; \tau \;-\; \operatorname{tof}\!\bigl(D(\tau)\bigr)

At the solution, :math:`E(\tau^*) = 0` — the guessed TOF equals the TOF the geometry demands.  Newton's method iterates:

.. math::

   \tau_{n+1} \;=\; \tau_n \;-\; \frac{E(\tau_n)}{E'(\tau_n)}

The derivative :math:`E'` requires the chain rule through the distance function.  Differentiating :math:`D` with respect to :math:`\tau`:

.. math::

   \frac{dD}{d\tau} \;=\; \frac{\mathbf{d} \cdot (-\mathbf{v})}{D} \;=\; -\,\frac{d_x\, v_x + d_y\, v_y}{D}

This is the rate at which the virtual target distance changes per unit change in TOF guess; it is negative when the robot velocity has a component toward the target (increasing :math:`\tau` moves the virtual target closer).

Using :math:`\operatorname{tof}'(D) = 1/v_p`, the error derivative becomes:

.. math::

   E'(\tau) \;=\; 1 \;-\; \frac{1}{v_p}\,\frac{dD}{d\tau} \;=\; 1 \;+\; \frac{d_x\, v_x + d_y\, v_y}{v_p\; D}

(the two negatives — one from differentiating :math:`E = \tau - \operatorname{tof}`, one from :math:`dD/d\tau` — combine to a positive term.)

Substituting into the Newton update rule :math:`\tau_{n+1} = \tau_n - E/E'`:

.. math::

   \tau_{n+1} \;=\; \tau_n \;-\; \frac{\tau_n - D / v_p}{\;1 \;+\; \dfrac{d_x\, v_x + d_y\, v_y}{v_p\; D}\;}

where :math:`d_x`, :math:`d_y`, and :math:`D` are all evaluated at :math:`\tau_n`.

Interactive Visualization
-------------------------

Use the visualization below to compare Newton's method to the fixed-point iteration.  The two **Simulation** modes let you drag the robot velocity vector and step through iterations for each solver; **Fractal (Newton)** and **Fractal (Fixed-Point)** show convergence heatmaps.

.. note:: The color scale differs between methods: Newton typically converges in 2–5 iterations, while the fixed-point iteration may take hundreds.  The legend adjusts automatically.  In both fractals, the same geodesic (purple) and convergence envelope (blue) are overlaid.

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

.. note:: In the Newton modes, the convergence envelope may show a narrow dip along the ray directly toward the target.  This is a *point singularity* of :math:`E'(\tau)`: when the robot speed toward the target exactly equals :math:`v_p`, the virtual target distance :math:`D(\tau)` momentarily passes through zero, causing :math:`E'` to diverge.  The envelope's ray-casting algorithm detects this as a convergence failure, but it is a measure-zero event — the heatmap's finite grid steps over it, and convergence recovers immediately on either side.  The singularity is an artifact of the envelope search, not a practical concern for the algorithm.  However, a robot moving directly towards the target at-or-above the projectile speed will collide with the target at or before the projectile lands.

Convergence Does Not Equal Quality
-----------------------------------

Newton's method converges to the correct geometric solution in very few iterations.  But the "correct geometric solution" in the ill-conditioned region of velocity space is still ill-conditioned.  Newton finds it faster; it doesn't make it less fragile.

The fixed-point fractal was warning you about the physics, not the numerics.  The fine structure of the convergence bands reflects the sensitivity of the time-of-flight to small changes in robot velocity — a property of the problem geometry, not the solver.  A shot that takes 500 fixed-point iterations to converge takes 3 Newton iterations to reach the same answer, but that answer is equally sensitive to velocity error.

Where Newton does genuinely help is in preventing a *bad failure mode*: in a real-time control loop with a hard iteration budget, the fixed-point iteration in the ill-conditioned region might be cut off mid-oscillation, producing a qualitatively wrong firing solution (the turret points the wrong way entirely).  Newton, by converging quickly, ensures that the solver is not the reason you miss — the miss, if it happens, is the physics' fault, not the numerics'.

Proxy Derivatives for Empirical Tables
---------------------------------------

In the constant-velocity model above, :math:`\operatorname{tof}'(D) = 1/v_p` is known exactly and Newton's method achieves quadratic convergence.  With an empirical firing table (where :math:`\operatorname{tof}(D)` is a measured lookup rather than an analytical formula), the true derivative must be estimated numerically — and differentiating noisy data amplifies that noise.

A practical compromise: use the constant-velocity derivative :math:`1/v_p` as a *proxy*, even when the firing table accounts for drag or other effects.  This gives a quasi-Newton iteration that:

- Converges faster than fixed-point (the proxy provides a damped Newton correction)
- Does not require differentiating the firing table (no noise amplification)
- Degrades gracefully: for drag, the true :math:`\operatorname{tof}'(D) > 1/v_p`, so the proxy undershoots the correction — a *stabilizing* error that slows convergence slightly but never causes divergence

The convergence rate of this proxy-Newton approach sits between linear (fixed-point) and quadratic (exact Newton), with the gap depending on how much drag distorts :math:`\operatorname{tof}'(D)` from :math:`1/v_p`.  For FRC-class projectiles where drag is modest, the distortion is small and you get nearly the full Newton speedup for free.

Shot Quality in Practice
-------------------------

Newton's method converges to the correct solution in a few iterations even in the Mach cone region, but it does not change the physics: the shot is still fragile there if the robot velocity is wrong.  The fixed-point iteration's contraction rate gives you a *shot quality metric* that Newton alone does not.  Because the extra work is cheap, use both.

**In practice:**

1. **Newton's method** (with proxy derivative) produces the *firing solution*.  Use it so the solver always converges quickly.
2. **Fixed-point quality metric.**  Run a short fixed-point sequence (e.g. :math:`1 + n` steps with your iteration budget :math:`n`) from the same initial guess.  Form the ratio of the last two TOF steps to get the contraction factor :math:`|\phi'|` in :math:`[0,1]`.  This is nonparametric: you do not need to know your velocity or shooter error; it tells you how fragile the shot is.  When :math:`|\phi'| \approx 0` (e.g. along the geodesic), platform and shooter errors decouple; when :math:`|\phi'|` is large, they amplify and interact.
3. **First-order platform miss.**  Combine with an estimate of velocity uncertainty :math:`|\delta\mathbf{v}|`: the leading miss from platform error is :math:`\tau \times |\delta\mathbf{v}|`.  Use your solved :math:`\tau`; no extra iterations needed.
4. **Advisory UI.**  Display both metrics separately (and optionally a combined warning), not only a single fused value.  Show the first-order platform miss :math:`\tau \times |\delta\mathbf{v}|` (e.g. expected miss in meters) and the interaction indicator :math:`|\phi'|` (e.g. fragility 0–1) as distinct readouts.  When the operator is constrained to move fast, they may care mainly about the margins (first-order); in other situations both matter.  Suppress or warn when either exceeds a threshold, but let the operator see both values and override when the situation warrants (e.g. a marginal shot with little time left).  Prefer approach velocities along or near the geodesic when possible.

This separates *solver convergence* from *shot quality*, so convergence-based shot suppression becomes an overridable advisory.  The algorithm provides the information; the human makes the call.
