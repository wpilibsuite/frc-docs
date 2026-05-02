.. include:: <isonum.txt>

# Basic Feedforward

Feedforward control predicts the output needed to achieve a desired state, improving control system performance when combined with PID.

## What is Feedforward?

Feedforward:

- Predicts required motor output
- Reduces PID workload
- Improves tracking performance
- Enables better control

## Common Feedforward Models

- **Simple Motor Feedforward**: kS, kV, kA gains
- **Arm Feedforward**: Adds gravity compensation (kG)
- **Elevator Feedforward**: Similar to arm

For detailed information, see :doc:`/docs/software/advanced-controls/controllers/feedforward`.

## Using Feedforward

Combine with PID for optimal control:

.. code-block:: text

   output = feedforward.calculate(setpoint) + pid.calculate(measurement)

## Feedforward Gains

### kS (Static Gain)

- Voltage needed to overcome static friction
- Gets mechanism moving from rest

### kV (Velocity Gain)

- Voltage needed to maintain constant velocity
- Proportional to desired velocity

### kA (Acceleration Gain)

- Voltage needed to accelerate
- Proportional to desired acceleration

### kG (Gravity Gain)

- Voltage needed to hold position against gravity
- Only for arms and elevators

## System Identification

Use the SysId tool to characterize your mechanisms and find feedforward gains automatically.

See :doc:`/docs/software/wpilib-tools/wpical/index` for details.

## Additional Resources

- :doc:`/docs/software/advanced-controls/index` - Complete controls documentation
- :doc:`/docs/user-manual/mechanism-control/index` - Mechanism control in User Manual
