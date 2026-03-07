Static Shooting via Look-Up Table
==================================

This section describes how to use a look-up table to aim at a stationary target from a stationary robot.  This kind of a look-up table is called a `firing table <https://en.wikipedia.org/wiki/Artillery_fire_control#Firing_table>`_, and has been used for hundreds of years because it is simple and effective.

The Problem
-----------

We ultimately want to launch the game piece on a trajectory that will end up in the goal.  But:

1. Robots have a wide variety of shooting mechanisms, each with a specific relationship between their control variables (e.g. flywheel speed, hood angle, catapult release angle, etc.) and the trajectory of the game piece.  In general, these relationships are nonlinear and complex.
2. Calculating an exact trajectory for the gamepiece is in general *also* nonlinear and complex, due to factors such as air resistance, spin effects, and other gamepiece-specific properties.

We could build mathematical models of both the shooting mechanism and the gamepiece's trajectory, and then solve the problem directly.  But, it is much simpler to just use a static record of empirical solutions to this problem, as experimentally determined by a human operator - a **look-up table**.  This collapses the complexity of both models into the behavior of the values in the table, effectively pre-computing the relevant physics of the problem in a way that removes the need for any further physical modeling in the runtime robot code.

Building the Look-Up Table
--------------------------

To build the look-up table, we need to:

1. Pick a set of distances to the target that we will experimentally shoot from.  This is setting the resolution of your table; in reality, your robot will never be exactly at a distance that you recorded in the table, and you will have to interpolate between the recorded distances.  The higher the resolution of the table, the more accurate your shooting will be, but the more data you will need to collect and the more time it will take to build the table.  Generally, it is a good idea to start with a low resolution and increase it only if you observe that it is not sufficiently accurate.
2. "Dial in" the control variables that successfully score the game piece from each of the starting distances.  Note that if your shooter is not consistent at this stage, then there is nothing the software can do to compensate for it; the mechanical quality of your shooter is always more important than the subtlety of the control software.
3. (Optional) Measure the time-of-flight of the gamepiece to the goal from each of the starting distances, and record it in the table along with the control variables.  This is needed later, when we discuss shooting at moving targets or from a moving robot; recording this ahead-of-time reduces the amount of computation required at runtime, and improves the accuracy of the shoot-on-the-move algorithm.

Using the Firing Table
-----------------------

To use the firing table, we:

1. Determine the distance to the target from the robot.  This tells us where on the look-up table to find the corresponding control variables for the shot.  This will likely require some amount of vision processing or other sensor input.
2. Interpolate between the nearest recorded distances in the look-up table to find the corresponding control variables for the shot.
3. Set the control variables to the values found in the look-up table.
4. Shoot the game piece.

That's it.  This might seem like a crude approach, but for most problems it works very well.  Most shooting mechanisms have governing equations that, while complex, are still well-behaved enough (i.e., not chaotic, slowly-changing, etc.) that interpolating the look-up table is in fact a very good approximation of the exact solution.

Choosing a Firing Strategy
--------------------------

When we populate our look-up table, we are implicitly fixing a "firing strategy" for the robot.  This is the set of control variables that we will use to shoot the game piece, for a given position, into the target.  In general, there are *multiple* valid firing strategies for a given position, each with a different time-of-flight.  We need to choose a firing strategy that is appropriate for the robot and the target.

For the stationary shot problem, the firing strategy determines how long the projectile will take to reach the target, and the amount of energy it will arrive with.  Both of these may matter for the success of the shot, and so this should be chosen intentionally rather than haphazardly.  Try multiple different firing strategies from each distance, and see which one works best for your robot and target.

The firing strategy may be different at different distances; there is no hard rule that says we must follow any particular pattern.  However, if the firing strategy varies wildly with distance, it may be difficult to interpolate the look-up table accurately, and the resulting shooting accuracy will be poor.  Therefore, you should be careful to choose firing strategies at each distance such that the shooter parameters are "nearby" those of neighboring points in the look-up table - essentially, the shooter parameters should be continuous and smooth as a function of distance.

As we will see in the next section, the firing strategy also has a profound effect on the behavior of motion compensation, since the amount of required motion compensation in the aiming of the shot varies with the amount of time the shot takes to reach the target (the longer the shot takes, the further offset the aim must be to compensate for motion).
