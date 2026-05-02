.. include:: <isonum.txt>

# Basic PID Tuning

PID (Proportional-Integral-Derivative) control is essential for accurate robot control. This page introduces basic PID concepts and tuning.

## What is PID?

PID is a control algorithm that:

- Calculates error between desired and actual values
- Adjusts output to minimize error
- Provides smooth, accurate control

For comprehensive PID documentation, see :doc:`/docs/software/advanced-controls/controllers/pidcontroller`.

## When to Use PID

Common use cases:

- Driving straight
- Turning to specific angles
- Maintaining arm position
- Controlling shooter speed

## Basic Tuning Steps

1. Start with all gains at zero
2. Increase P until system oscillates
3. Add D to reduce oscillations
4. Add I if needed for steady-state error

For detailed tuning guidance, see :doc:`/docs/software/advanced-controls/introduction/introduction-to-pid`.

## PID Components

### Proportional (P)

- Responds to current error
- Larger error = larger correction
- Can cause oscillation if too high

### Integral (I)

- Responds to accumulated error over time
- Eliminates steady-state error
- Can cause overshoot if too high

### Derivative (D)

- Responds to rate of error change
- Dampens oscillations
- Reduces overshoot

## Additional Resources

- :doc:`/docs/software/advanced-controls/index` - Complete controls documentation
- :doc:`/docs/user-manual/mechanism-control/index` - Mechanism control in User Manual
