Dimensional Analysis in Robot Programming
=========================================

One of the most important parts of controls engineering is *getting the units right*.  A control algorithm can be implemented perfectly, but if the code surrounding it handles the units wrongly (e.g. mistaking feet for meters) the results can be catastrophic.  Unit conversion errors have `crashed spacecraft <https://www.simscale.com/blog/nasa-mars-climate-orbiter-metric/>`__, and are by far the biggest initial stumbling block for students learning to apply control algorithms on real robots.

What is Dimensional Analysis?
-----------------------------

`Dimensional analysis <https://en.wikipedia.org/wiki/Dimensional_analysis>`__ is the study of how we measure quantity, and how measurements of different quantities interact through our mathematical operations.

Dimensional analysis is based on two core notions: *dimension* and *unit*.

A "dimension" is a physical interpretation of a numeric quantity (alternatively, we could say numbers are formal or symbolic representations of physical dimensions).  For example, a real number (or a rational approximation of a real number on a computer) can represent *length*, *mass*, *electric charge*, or *sandwiches eaten by the author last Wednesday* - all of these are different dimensions.  Quantities that have a dimension attached to them are called "dimensioned quantities".

A "unit" (or "unit of measure") is a *specific numeric scale for a dimension.*  For example, we can represent length with *feet*, *meters*, *lightyears*, or *potassium atom radii* - all of these are different *units* for the same *dimension.*  Most units take the form of a "reference size", and define a `linear <https://en.wikipedia.org/wiki/Linearity>`__ scale for the dimension.  Nonlinear units do exist, however (such as *decibels*, which measure sound amplitude and are logarithmically-scaled).

Some quantities have no unit or dimension within a given system - we call these "dimensionless quantities".  Abstract mathematical constants (like :math:`e` and :math:`\pi`) are typically dimensionless, as are certain physical constants.  For reasons we'll cover later, the ratio of any two quantities of the same dimension is dimensionless, and certain mathematical expressions (such as the `exponential function <https://en.wikipedia.org/wiki/Exponential_function>`__) can only be interpreted when their arguments are dimensionless.

Sometimes, it's a bit hard to tell whether a quantity is dimensionless.  We can interpret an angle as the ratio of an arc length to a radius - which should be a dimensionless quantity - but we can still measure it with different units (e.g. degrees, radians, rotations).  Dealing with these sorts of quantities can be tricky, but generally it is safe to just treat them as if they were dimensioned quantities with ordinary units.

Doing Arithmetic with Units
---------------------------

The equations we use to control our robots generally operate on quantities that have dimensions.  To understand what our robot code is doing, we have to understand what units of measurement the code is using throughout the calculations it performs.  This means we have to understand how units of measure "propagate" through our mathematical operations.

Below, we'll go through the rules that govern how units interact with our two basic arithmetic operations: addition and multiplication.

Adding Dimensioned Quantities
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

There are two rules that govern addition of dimensioned quantities:

1. Two quantities can only be summed if they have the same dimension.  It fundamentally does not make sense to add length to mass, or sandwiches to electron-volts.  We can only combine two of the same *sort* of quantity - anything else can no longer be represented by a simple, single value.
2. The *numeric values* of two quantities of the same dimension can only be summed if they have the same *unit*.  We can sensibly talk about adding 5 feet to 3 meters - but it is not valid to add 5 to 3 to compute the result.  In order to actually carry forward with a numerical calculation, we must first put all our values of the same dimension into the same unit.

That's it.  The same two rules hold for subtraction in exactly the same way (recall that we can think of subtraction as just addition of a negative value).

Multiplying Dimensioned Quantities
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Multiplication of dimensioned quantities is a bit more subtle than addition.  While the rules governing dimensioned addition are fairly strict (we cannot add values unless they're compatible), the rules governing dimensioned multiplication are fairly loose:

1. It is valid to multiply or divide any two quantities, regardless of dimensionality.
2. When we multiply or divide quantities, their dimensions and units multiply or divide along with them to form *compound dimensions* and *compound units*.  A :math:`length` times a :math:`length` has units of :math:`length * length` or :math:`length^2`.  A quantity of :math:`miles` divided by a quantity of :math:`hours` has units of :math:`\frac{miles}{hours}`.
3. The ratio of any two equivalent quantities is dimensionless and equal to :math:`1`.
4. Multiplying or dividing a dimensioned quantity by a dimensionless quantity does not change its dimension or unit.

Converting to Consistent Units
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It might be easy to understand the rules in the sections above, but even following these rules we can get stuck if all the terms in our calculation that have the same dimension do not share the same units.  It makes sense to write "5 feet + 3 meters" on a piece of paper, but to actually do this calculation on a computer we cannot just add 5 to 3 or we get nonsense.

We can systematically deal with this by *converting to common units before performing calculation*.  Remember from the rules above that the ratio of any two equivalent quantities is equal to 1.  We can exploit this to convert values from one unit to another.  For example:

:math:`5 feet + 3 meters = 5 feet + 3 meters * \frac{3.28 feet}{1 meter} = 5 feet + 9.84 feet = 14.84 feet`

The term :math:`\frac{3.28 feet}{1 meter}` is a "conversion ratio" - a ratio of the same quantity expressed in two different units.  It is a dimensionless constant equal to 1, so we may freely multiply by it without changing the meaning of our equation, and it allows us to cancel out the "undesired" units to leave us with an equation in terms of only a single unit (or set of units).

Handing Units in Code
---------------------

It can be tricky to handle units consistently in code unless we help ourselves with code standards and/or tooling.  Here are some helpful standards for keeping units straight, regardless of programming language:

 * Use telemetry and logs.
    - The easiest way to track down a conversion error is to find where in code the values stop making physical sense.  This means we have to log all of our relevant code values.  WPILib includes :ref:`telemetry tooling <docs/software/telemetry/telemetry:Adding Telemetry to Robot Code>` to help record and display robot state.
 * Break up long expressions with complicated units.
    - Some unit conversion factors used in robot code (especially those concerning translating from motor rotations to real-world distances) can include many parts and be pretty ugly.  Always try to define the parts of these expressions separately, building up the final conversion ratio from the individually-defined parts.
 * *Never* blindly assume you can compensate with an empirical "fudge factor".
    - Sometimes, it can be tempting to bypass a known-but-lengthy chain of unit conversions by taking an "empirical shortcut".  For example, we might be tempted to get the conversion ratio from drive motor rotations to wheel distance by simply running the drive, measuring the displacement and the motor rotation, and dividing the two.  This can work, but only in some cases and at the cost of code clarity and maintainability, since these "shortcut" conversion factors are dimensionally-complex (see previous bullet-point) and externally inscrutable.  In some cases this methodology will not work at all, because the mathematical relationship be more complicated than imagined.
    - It is still appropriate to use more-accurate empirically-measured conversion ratios *in place of* approximate theoretical ones.  For example, wheel diameter as reported on product sheets is usually nominal and does not reflect the rolling diameter of the wheel on FRC carpet to great accuracy.  To compensate for this, it is a good idea to use an empirically-measured value for the wheel diameter, calculated from a test routine like the one described above.  This is fine as long as the units of the empirically-measured factor are simple, and there is a known theoretical value that it is replacing.

Handling Units in C++
^^^^^^^^^^^^^^^^^^^^^

For details on managing units and dimensions in C++, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

Handling Units in Java
^^^^^^^^^^^^^^^^^^^^^^

Because Java's type system is not really capable of enforcing dimensional correctness at compile-time without major runtime cost and syntax bloat, there's no units library included as part of WPILibJ.  This makes managing units in Java somewhat difficult, and even experienced developers will sometimes make mistakes.

While there's no sure way to avoid unit conversion errors in Java, there are a number of strategies you can use to make them less likely:

 * Denote the unit of measure in your variable names.
    - Instead of `error`, consider `errorMeters`.
    - Arguments and method locals can often just be named after the unit, and the rest will be clear from context.  For example, `wait(double seconds)` is a much better method signature than `wait(double t)`.
 * Denote the unit of measure of your function returns in your function names.
    - Instead of `arm.getPosition()`, consider `arm.getPositionRadians()` or even just `arm.getRadians()`.
