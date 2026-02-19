Fire Control
============

.. note:: Fire control is a difficult problem, and depends on the shooting mechanism and the gamepiece.  This sequence of articles covers one approach to solving fire-control in a "soft" conceptual manner that can apply to many different shooting mechanisms and gamepieces.  We do not provide example code; the core concept is so simple that working example code would be 90% distracting details of the assumed game context, and 10% fire-control algorithm.  If you understand the concepts presented here, you will be able to apply them to your own robot and gamepiece.

This section describes software approaches for aiming a robot's shooting mechanism at a goal.  Technical literature calls this "fire control", as it was first (and remains primarily) studied in the context of aiming artillery.

While it is possible to solve fire control problems directly from a mathematical model of the shooting mechanism and gamepiece, we do not cover that approach here.  Instead, we cover a simpler approach that is more general and easier to understand, and which can be applied to many different shooting mechanisms and gamepieces: recursion.

Fire control by recursion follows the pattern of "lead-and-adjust":
1. We start with a guess at the time of flight to the target.
2. We use this guess to **lead** our shot by offsetting the target position by the predicted platform motion over the time of flight.
3. Our new 'virtual target' will have its own time of flight, so we need to **adjust** our lead accordingly.
4. We repeat this process until the time of flight stops changing; at this point, the shot solution has converged and shooting at the 'virtual target' should hit the real one.

Chances are, if you've ever thrown a ball at a moving target, you've already done this kind of "lead-and-adjust" in your head.

In addition to conceptual simplicity, recursion has another advantage: it provides its own error analysis.  By watching how the recursion converges, we can see how accurate the solution is likely to be.  The interactive visualization in the dynamic shooting article allows you to explore this behavior graphically.

.. toctree::
   :maxdepth: 1

   static-shooting
   dynamic-shooting
   newton-shooting
