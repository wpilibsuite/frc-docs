Dynamic Shooting via Time-of-Flight Recursion
=============================================

This section extends the look-up table approach we used for the static problem, and expands it with a simple recursion to handle moving targets and/or moving robots.  Crucially, we will use the *time-of-flight* parameter that we recorded ahead-of-time in the look-up table to predict the position of the target at the moment when the gamepiece will arrive.  Because the adjusted shot will in general have its own time-of-flight, this gives us a "feedback" loop that we can use to iteratively refine our shot.  Typically, this converges to the correct shot within a small number (3-5) of iterations.

The Problem
-----------

As before, we want to launch the game piece on a trajectory that will end up in the goal.  But now, the target and/or the robot are moving.  So, it is not enough to just plug the starting position into the look-up table and use the corresponding control variables to reproduce the shot; by the time the gamepiece arrives at the goal, the target will have moved to a new relative position.  We need to adjust our shot to account for the new relative position.

The Solution
------------

We assume we have a look-up table populated as in described in the previous section, including time-of-flight measurements for each entry.  We:

1. Determine the relative position *and velocity* of the target from the robot.  The position tells us where to start in the look-up table, and the velocity tells us how to adjust the shot to account for the relative motion of the robot and the target given the time-of-flight of the shot.
2. Interpolate between the nearest recorded positions in the look-up table to find the corresponding *time-of-flight* for the shot.
3. Use the time-of-flight to predict the relative position of the target at the moment when the gamepiece will arrive.  This is a simple calculation: we multiply the relative velocity vector to the target by the time of flight, and add it to the relative position of the target at the moment when the shot was taken.  This gives us a *new* value to look up in the look-up table, with its own time-of-flight and control variables.
4. Return to step 2, checking the table for the time-of-flight of the *adjusted* shot.  If it has changed substantially, we repeat the process; if it is stable, the iteration has converged and we proceed to the next step.  It typically takes no more than 3-5 iterations to converge.
5. Once the iteration has converged, we use the control variables found in the look-up table to shoot the game piece.

We do not need to involve the control variables for the intermediate steps in the recursion; we iterate *only* on the time-of-flight.  This is a key computational advantage of this approach: it works implicitly on the *geometry* of the look-up table, which *implicitly* encodes the physics of the problem in such a way that the motion-adjustment becomes independent of the specifics of the shooting mechanism physics (except as is latent in the structure of the time-of-flight measurements in the look-up table).

If we did not record the time-of-flight measurements in the look-up table, we would need to calculate the time-of-flight for each shot from the control variables, which would involve a physics model.  Measuring the time-of-flight at the time of table construction gives us enough surplus information to avoid the need for explicit physics modeling at all.

Interactive Visualization
-------------------------

Interact with the simulation below to see how the dynamic shooting recursion algorithm works.  Use **Simulation** mode to drag the robot velocity and step through iterations.  Use **Fractal (Iterations)** to see a heatmap of iterations-to-convergence over velocity space, or **Fractal (Stability)** to see shot stability (0 = stable, 1 = fragile) with the same geodesic and convergence envelope.

.. note:: The view is a top-down 2D game field: the robot is blue, the target orange.  In **Simulation** mode the (draggable) robot velocity vector shows motion.  For each iteration, the virtual target (green) is offset by time-of-flight times robot velocity; the actual trajectory (red) shows where the shot would land.  In **Fractal (Iterations)** the same envelope and geodesic are overlaid on a heatmap of how many iterations until convergence at each velocity (green = fast, red = slow or no convergence).  In **Fractal (Stability)** the heatmap shows the contraction-based stability indicator (darker = more stable).  The purple geodesic is the "maximum stability" curve (orbiting the virtual target).  The dashed blue line is the convergence envelope; the solid blue line is the reachability boundary — outside it the shot is geometrically impossible.

.. raw:: html

    <div class="viz-div" id="dynamic_shooting_container">
      <div class="flex-grid">
         <div class="col" id="dynamic_shooting_viz"></div>
         <div id="dynamic_shooting_ctrls"></div>
      </div>
      <script>
         dynamic_shooting = new DynamicShootingWidget("dynamic_shooting");
      </script>
    </div>

Note that the convergence behavior depends critically on the projectile velocity; as the projectile velocity increases, the convergence envelope expands, and the algorithm becomes more robust to errors in the robot velocity estimate.  Increasing iteration count also increases the convergence envelope, but this rapidly "saturates" and the difference between 5 and 10 iterations is quite small.

The "inverted NASA logo" shape of the convergence envelope generally follows the shape of the "maximum recursion stability" geodesic, which *under the assumptions of this simulation* (constant horizontal projectile velocity, no drag) follows the equation :math:`v_r = v_p \cot(\theta)`.  For velocities along this geodesic, the robot is in an instantaneous orbit around the virtual target, meaning the time-of-flight of the shot is not changing as the robot moves.  Perhaps surprisingly, under these assumptions, the curve does not depend on the distance to the target.

Convergence is worst in a direct sprint towards or away from the target - in these cases, shot solution is maximally-sensitive to errors in the robot velocity estimate.  Direct lateral motion is also not great.  Along the "maximum stability" geodesic, there are two "wings" of stable convergence; we can see that it is optimal (in terms of motion-compensation stability) to approach a target diagonally, rather than head-on.

In "fractal" mode, we can see the region of poor convergence visually as a "Mach cone" in the direction of the target.  This is much like the sonic boom of a supersonic aircraft, but in this case the "shock" is caused by the robot velocity exceeding the projectile speed (instead of the speed of sound).

Shot Quality in Practice
-------------------------

While *eventual* convergence is theoretically guaranteed for any velocity vector within the reachability boundary, truncating the iteration in poorly conditioned regions can produce a qualitatively wrong firing solution (the turret points the wrong way entirely).  You can use two complementary ideas to decide when a shot is trustworthy.

**Platform Velocity Magnitude**  The biggest factor in shot quality while moving is, perhaps unsurprisingly, the magnitude of the platform velocity.  When the platform velocity is large, there are two effects working against you:

- The faster the platform moves, the bigger the displacement error caused by a given time-of-flight error.
- The faster the platform moves, the higher the uncertainty in the platform velocity itself.

**Shot Stability**  A second-order effect that is still important to consider when making a shot is the "stability" of the shot solution - how sensitive the shot trajectory is to small changes in the platform velocity.  You can estimate the shot stability by the "contraction rate of the fixed-point iteration":

.. math::

   |\phi'| = \left| \frac{\tau_{n} - \tau_{n-1}}{\tau_{n-1} - \tau_{n-2}} \right|

.. note:: When computing this value from an actual iteration, it is easy to get a divide-by-zero error in this meta-calculation if we iterate too far (even though the iteration itself will still converge) - it is best to use the last two difference terms that are greater than the machine error.

The contraction rate varies between 0 (stable, fast convergence) and 1 (fragile, slow convergence).  We can see in the "stability" mode in the visualization how the most-stable shots are those that are along the "maximum stability" geodesic, and how the most-fragile shots are those that are directly towards or away from the target.  This gives us a way to judge the appropriateness-for-shooting of our *approach angle*, independent of how fast we are moving.

Both of these are **qualitative** metrics - turning them into explicit error bounds requires a physics model and a lot of additional computation.  But they are still useful for guiding the driver's decision-making process, and can be used with tuned thresholds to trigger warnings or withhold shots entirely.  There is no "correct" threshold for these metrics - they are dependent on the specific shooting mechanism and the desired risk tolerance.

The Effect of Firing Strategy
-----------------------------

Whether the "constant horizontal shot velocity" assumption is valid depends on the implicit firing strategy of your look-up table; to achieve a look-up table whose convergence envelope looks *exactly* like the plot above, you would need to choose shots such that the horizontal component of the projectile velocity is constant.  This may not be possible - or optimal - for your particular shooting mechanism; but the general shape of the convergence envelope for a modified shooting strategy will still "rhyme" with the simulation above, unless you adopt a firing strategy that fundamentally changes the problem's ballistic geometry.

It is fairly easy to generate a convergence plot using your actual look-up table, if you wish to know the exact shape of the convergence envelope for your particular shooting strategy - simply run the recursion along a series of rays in velocity space, and plot the maximum velocity that converges within the given number of iterations for each ray (convergence is typically defined as the time-of-flight changing by less than a certain tolerance, though you can also just check that the final landing position is within a certain tolerance of the target).
