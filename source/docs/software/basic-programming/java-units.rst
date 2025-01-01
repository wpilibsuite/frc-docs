# The Java Units Library

.. note:: New for 2025: The units library has been refactored to have unit-specific measurement classes instead of a single generic ``Measure`` class. The new measurement classes have clearer names (``Distance`` instead of ``Measure<Distance>``, or ``LinearAcceleration`` instead of ``Measure<Velocity<Velocity<Distance>>>``), and implement math operations to return the most specific result types possible instead of a wildcard ``Measure<?>``.

The units library is a tool that helps programmers avoid mistakes related to units of measurement. It does this by keeping track of the units of measurement, and by ensuring that all operations are performed with the correct units. This can help to prevent errors that can lead to incorrect results, such as adding a distance in inches to a distance in meters.

An added benefit is readability and maintainability, which also reduces bugs. By making the units of measurement explicit in your code, it becomes easier to read and understand what your code is doing. This can also help to make your code more maintainable, as it is easier to identify and fix errors related to units of measurement.

The units library has a number of features:

- A set of predefined units, such as meters, degrees, and seconds.
- The ability to convert between different units.
- Support for performing arithmetic and comparisons on quantities with units.
- Support for displaying quantities with units in a human-readable format.

## Terminology
Dimension
  Dimensions represent the nature of a physical quantity, such as length, time, or mass. They are independent of any specific unit system. For example, the dimension of meters is length, regardless of whether the length is expressed in meters, millimeters, or inches.

Unit
  Units are specific realizations of dimensions. They are the way of expressing physical quantities. Each dimension has a base unit, such as the meter for length, the second for time, the kilogram for mass. Derived units are formed by combining base units, such as meters per second for velocity.

Measure
 Measures are the specific magnitude of physical quantities, expressed in a particular unit. For example, 5 meters is a measure of distance.

These concepts are used within the Units Library. For example, the **measure** *10 seconds* has a magnitude of 10, the **dimension** is time, and the **unit** is seconds.

## Using the Units Library

The Java units library is available in the ``edu.wpi.first.units`` package. The most relevant classes are:

- The various classes for predefined dimensions, such as [DistanceUnit](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/units/DistanceUnit.html) and [TimeUnit](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/units/TimeUnit.html)
- [Units](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/units/Units.html), which contains a set of predefined units. Take a look a the [Units javadoc](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/units/Units.html) to browse the available units and their types.
- [Measure](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/units/Measure.html), which is used to tag a value with a unit, and the dimension-specific implementations like [Distance](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/units/measure/Distance.html) and [Time](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/units/measure/Time.html)

.. note:: It is recommended to static import ``edu.wpi.first.units.Units.*`` to get full access to all the predefined units.

### Creating Measures

Every dimension has a measurement class with the corresponding name - for example, a ``Distance`` measures distance, ``Time`` measures time, and ``LinearVelocity`` measures linear velocity. To instantiate one of these measurements, call the ``Unit.of`` method on the appropriate unit object. For example, to create a ``Distance`` object representing a distance of 6 inches, you would write:

```java
Distance wheelDiameter = Inches.of(6);
```

Other measures can also be created using their ``Unit.of`` method:

```java
Mass kArmMass = Kilograms.of(1.423);
Distance kArmLength = Inches.of(32.25);
Angle kMinArmAngle = Degrees.of(5);
Angle kArmMaxTravel = Rotations.of(0.45);
LinearVelocity kMaxSpeed = MetersPerSecond.of(2.5);
```

.. warning:: Composite units with ``PerUnit`` and ``MultUnit`` have special requirements, and the ``of`` method is not recommended to be used with them

#### Using Composite Unit Types

Due to requirements of inheritance in Java's type system, ``PerUnit`` and ``MultUnit`` cannot return a normal ``Per`` or ``Mult`` object from their ``of`` factory methods. Instead, they need to return a bounded wildcard ``Measure<? extends PerUnit<...>>`` or ``Measure<? extends MultUnit<...>>`` to allow subclasses like ``LinearVelocity`` to return a compatible type. New ``ofNative`` methods are provided to be able to work with known ``Per`` and ``Mult`` objects

```java
// Using ofNative:
Per<VoltageUnit, DistanceUnit> kP = VoltsPerMeter.ofNative(1);
kP.in(VoltsPerMeter); // 1.0

Measure<VoltageUnit> output = kP.timesDivisor(Meters.of(1));
output.in(Volts); // 1.0

// Without ofNative
Measure<? extends PerUnit<VoltageUnit, DistanceUnit>> kP = VoltsPerMeter.of(1);
kP.in(VoltsPerMeter); // Compilation error!

Measure<?> output = kP.times(Meters.of(1)); // The compiler can't know what unit this is
output.in(Volts); // Compilation error!
```

### Performing Calculations

The ``Measure`` class also supports arithmetic operations, such as addition, subtraction, multiplication, and division. These are done by calling methods on the objects. These operations always ensure that the units are compatible before performing the calculation, and they return a new ``Measure`` object. For example, you can add two ``Distance`` objects together, even if they have different units:

```java
Distance distance1 = Inches.of(10);
Distance distance2 = Meters.of(0.254);
Distance totalDistance = distance1.plus(distance2);
```

In this code, the units library will automatically convert the measures to the same unit before adding the two distances. The resulting ``totalDistance`` object will be a new ``Distance`` object that has a value of 0.508 meters, or 20 inches.

.. note:: Mathematical operations are type safe. It is impossible to add a distance to a time, or subtract an angle from a voltage. However, multiplication and division operations make a best-effort attempt to return results in the most appropriate unit type; dividing a distance by time results in a ``LinearVelocity`` measurement, and multiplying it by time returns a ``Distance``.

This example combines the wheel diameter and gear ratio to calculate the distance per rotation of the wheel:

```java
Distance wheelDiameter = Inches.of(3);
double gearRatio = 10.48;
Distance distancePerRotation = wheelDiameter.times(Math.PI).divide(gearRatio);
```

.. warning:: By default, arithmetic operations create new ``Measure`` instances for their results. See :ref:`Java Garbage Collection<docs/software/basic-programming/java-gc:Java Garbage Collection>` for discussion on creating a large number of short-lived objects. See also, the `Mutability and Object Creation`_ section below for a possible workaround.

### Converting Units

Unit conversions can be done by calling ``Measure.in(Unit)``. The Java type system will prevent units from being converted between incompatible types, such as distances to angles. The returned values will be bare ``double`` values without unit information - it is up to you, the programmer, to interpret them correctly! It is strongly recommended to only use unit conversions when interacting with APIs that do not support the units library.

```java
LinearVelocity kMaxVelocity = FeetPerSecond.of(12.5);
LinearAcceleration kMaxAcceleration = FeetPerSecond.per(Second).of(22.9);
kMaxVelocity.in(MetersPerSecond); // => OK! Returns 3.81
kMaxVelocity.in(RadiansPerSecond); // => Compile error! LinearVelocity cannot be converted to AngularVelocity

// The WPILib math libraries use SI metric units, so we have to convert to meters:
TrapezoidProfile.Constraints kDriveConstraints = new TrapezoidProfile.Constraints(
  maxVelocity.in(MetersPerSecond),
  maxAcceleration.in(MetersPerSecondPerSecond)
);
```

### Usage Example

Pulling all of the concepts together, we can create an example that calculates the end effector position of an arm mechanism:

```java
Distance armLength = Feet.of(3).plus(Inches.of(4.25));
Distance endEffectorX = armLength.times(Math.cos(getArmAngle().in(Radians)));
Distance endEffectorY = armLength.times(Math.sin(getArmAngle().in(Radians)));
```

### Human-readable Formatting

The ``Measure`` class has methods that can be used to get a human-readable representation of the measure. This feature is useful to display a measure on a dashboard or in logs.

- ``toString()`` and ``toShortString()`` return a string representation of the measure in a shorthand form. The symbol of the backing unit is used, rather than the full name, and the magnitude is represented in scientific notation. For example, 1.234e+04 V/m
- ``toLongString()`` returns a string representation of the measure in a longhand form. The name of the backing unit is used, rather than its symbol, and the magnitude is represented in a full string, not scientific notation. For example, 1234 Volt per Meter

## Mutability and Object Creation

To reduce the number of object instances you create, and reduce memory usage, a special ``MutableMeasure`` class is available, with unit-specific subtypes like ``MutDistance`` and ``MutTime``. You may want to consider using mutable objects if you are using the units library repeatedly, such as in the robot's periodic loop. See :ref:`Java Garbage Collection<docs/software/basic-programming/java-gc:Java Garbage Collection>` for more discussion on creating a large number of short-lived objects. Mutable measures can be created in a similar way to regular, immutable measures using the ``Unit.mutable`` method (instead of ``Unit.of``).

``MutableMeasure`` allows the internal state of the object to be updated, such as with the results of arithmetic operations, to avoid allocating new objects. Special care needs to be taken when mutating a measure because it will change the value every place that instance is referenced. If the object will be exposed as part of a public method, have that method return a regular ``Measure`` in its signature to prevent the caller from modifying your internal state.

Extra methods are available on ``MutableMeasure`` for updating the internal value. Note that these methods all begin with the ``mut_`` prefix - this is to make it obvious that these methods will be mutating the object and are potentially unsafe!
For the full list of methods and API documentation, see [the MutableMeasure API documentation](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/units/MutableMeasure.html)

+-------------------------------+--------------------------------------------------------------------------------------------------+
| ``mut_plus(double, Unit)``    | Increments the internal value by an amount in another unit. The internal unit will stay the same |
+-------------------------------+--------------------------------------------------------------------------------------------------+
| ``mut_plus(Measure)``         | Increments the internal value by another measurement. The internal unit will stay the same       |
+-------------------------------+--------------------------------------------------------------------------------------------------+
| ``mut_minus(double, Unit)``   | Decrements the internal value by an amount in another unit. The internal unit will stay the same |
+-------------------------------+--------------------------------------------------------------------------------------------------+
| ``mut_minus(Measure)``        | Decrements the internal value by another measurement. The internal unit will stay the same       |
+-------------------------------+--------------------------------------------------------------------------------------------------+
| ``mut_times(double)``         | Multiplies the internal value by a scalar                                                        |
+-------------------------------+--------------------------------------------------------------------------------------------------+
| ``mut_divide(double)``        | Divides the internal value by a scalar                                                           |
+-------------------------------+--------------------------------------------------------------------------------------------------+
| ``mut_replace(double, Unit)`` | Overrides the internal state and sets it to equal the given value and unit                       |
+-------------------------------+--------------------------------------------------------------------------------------------------+
| ``mut_replace(Measure)``      | Overrides the internal state to make it identical to the given measurement                       |
+-------------------------------+--------------------------------------------------------------------------------------------------+
| ``mut_setMagnitude(double)``  | Overrides the internal value, keeping the internal unit. Be careful when using this!             |
+-------------------------------+--------------------------------------------------------------------------------------------------+

```java
MutDistance measure = Feet.mutable(0);
measure.mut_plus(10, Inches);    // 0.8333 feet
measure.mut_plus(Inches.of(10)); // 1.6667 feet
measure.mut_minus(5, Inches);    // 1.25 feet
measure.mut_minus(Inches.of(5)); // 0.8333 feet
measure.mut_times(6);            // 0.8333 * 6 = 5 feet
measure.mut_divide(5);           // 5 / 5 = 1 foot
measure.mut_replace(6.2, Meters) // 6.2 meters - note the unit changed!
measure.mut_replace(Millimeters.of(14.2)) // 14.2mm - the unit changed again!
measure.mut_setMagnitude(72)     // 72mm
```

Revisiting the arm example from above, we can use ``mut_replace`` - and, optionally, ``mut_times`` - to calculate the end effector position

```java
import edu.wpi.first.units.Measure;
import edu.wpi.first.units.MutableMeasure;
import static edu.wpi.first.units.Units.*;
public class Arm {
  // Note the two ephemeral object allocations for the Feet.of and Inches.of calls.
  // Because this is a constant value computed just once, they will easily be garbage collected without
  // any problems with memory use or loop timing jitter.
  private static final Distance kArmLength = Feet.of(3).plus(Inches.of(4.25));

  // Angle and X/Y locations will likely be called in the main robot loop, let's store them in a MutableMeasure
  // to avoid allocating lots of short-lived objects
  private final MutAngle m_angle = Degrees.mutable(0);
  private final MutDistance m_endEffectorX = Feet.mutable(0);
  private final MutDistance m_endEffectorY = Feet.mutable(0);
  private final Encoder m_encoder = new Encoder(...);

  public Distance getEndEffectorX() {
    return m_endEffectorX.mut_replace(
      Math.cos(getAngle().in(Radians)) * kArmLength.in(Feet), // the new magnitude to store
      Feet // the units of the new magnitude
    );
  }

  public Distance getEndEffectorY() {
    // An alternative approach so we don't have to unpack and repack the units
    m_endEffectorY.mut_replace(kArmLength);
    m_endEffectorY.mut_times(Math.sin(getAngle().in(Radians)));
    return m_endEffectorY;
  }

  public Angle getAngle() {
    double rawAngle = m_encoder.getPosition();
    m_angle.mut_replace(rawAngle, Degrees); // NOTE: the encoder must be configured with distancePerPulse in terms of degrees!
    return m_angle;
  }
}
```

.. warning:: ``MutableMeasure`` objects can - by definition - change their values at any time! It is unsafe to keep a stateful reference to them - prefer to extract a value using the ``Measure.in`` method, or create a copy with ``Measure.copy`` that can be safely stored. For the same reason, library authors must also be careful about methods accepting ``Measure``.

Can you spot the bug in this code?

```java
private Distance m_lastDistance;
public Distance calculateDelta(Distance currentDistance) {
  if (m_lastDistance == null) {
    m_lastDistance = currentDistance;
    return currentDistance;
  } else {
    Distance delta = currentDistance.minus(m_lastDistance);
    m_lastDistance = currentDistance;
    return delta;
  }
}
```

If we run the ``calculateDelta`` method a few times, we can see a pattern:

```java
MutDistance distance = Inches.mutable(0);
distance.mut_plus(10, Inches);
calculateDelta(distance); // expect 10 inches and get 10 - good!
distance.mut_plus(2, Inches);
calculateDelta(distance); // expect 2 inches, but get 0 instead!
distance.mut_plus(8, Inches);
calculateDelta(distance); // expect 8 inches, but get 0 instead!
```

This is because the ``m_lastDistance`` field is a reference to the *same* ``MutDistance`` object as the input! Effectively, the delta is calculated as (currentDistance - currentDistance) on every call after the first, which naturally always returns zero. One solution would be to track ``m_lastDistance`` as a *copy* of the input measure to take a snapshot; however, this approach does incur one extra object allocation for the copy. If you need to be careful about object allocations, ``m_lastDistance`` could also be stored as a ``MutDistance``.

.. tab-set::

   .. tab-item:: Immutable Copies

      ```java
      private Distance m_lastDistance;
      public Distance calculateDelta(Distance currentDistance) {
        if (m_lastDistance == null) {
          m_lastDistance = currentDistance.copy();
          return currentDistance;
        } else {
          var delta = currentDistance.minus(m_lastDistance);
          m_lastDistance = currentDistance.copy();
          return delta;
        }
      }
      ```

   .. tab-item:: Zero-allocation Mutables

      ```java
      private final MutDistance m_lastDistance = Meters.mutable(0);
      private final MutDistance m_delta = Meters.mutable(0);
      public Distance calculateDelta(Distance currentDistance) {
        // m_delta = currentDistance - m_lastDistance
        m_delta.mut_replace(currentDistance);
        m_delta.mut_minus(m_lastDistance);
        m_lastDistance.mut_replace(currentDistance);
        return m_delta;
      }
      ```

## Defining New Units

There are four ways to define a new unit that isn't already present in the library:

- Using the ``Unit.per`` or ``Unit.mult`` methods to create a composite of two other units;
- Using the ``Milli``, ``Micro``, and ``Kilo`` helper methods;
- Using the ``derive`` method and customizing how the new unit relates to the base unit; and
- Subclassing ``Unit`` to define a new dimension.

New units can be defined as combinations of existing units using the ``Unit.mult`` and ``Unit.per`` methods.

```java
PerUnit<VoltageUnit, DistanceUnit> VoltsPerInch = Volts.per(Inch);
VelocityUnit<MassUnit> KgPerSecond = Kilograms.per(Second); // Could also be declared as PerUnit<MassUnit, TimeUnit>
DistanceUnit FootMinutesPerSecond = FeetPerSecond.mult(Minutes);
```

Using ``mult`` and ``per`` will store the resulting unit. Every call will return the same object to avoid unnecessary allocations and garbage collector pressure.

```java
@Override
public void robotPeriodic() {
  // Feet.per(Millisecond) creates a new unit on the first loop,
  // which will be reused on every successive loop
  SmartDashboard.putNumber("Speed", m_drivebase.getSpeed().in(Feet.per(Millisecond)));
}
```

.. note:: Calling ``Unit.per(Time)`` will return a ``Velocity`` unit, which is different from and incompatible with a ``Per`` unit!

New dimensions can also be created by subclassing ``Unit`` and implementing the two constructors. Dimension-specific measurement types are recommended, but take considerable effort to implement all the unit-specific math operations.

```java
public class ElectricChargeUnit extends Unit {
  public ElectricCharge(double baseUnitEquivalent, String name, String symbol) {
    super(ElectricCharge.class, baseUnitEquivalent, name, symbol);
  }
  // required for derivation with Milli, Kilo, etc.
  public ElectricCharge(UnaryFunction toBaseConverter, UnaryFunction fromBaseConverter, String name, String symbol) {
     super(ElectricCharge.class, toBaseConverter, fromBaseConverter, name, symbol);
  }

  @Override
  public ElectricChargeUnit getBaseUnit() {
    // The base method must be overridden in order to return the correct type
    return (ElectricChargeUnit) super.getBaseUnit();
  }

  @Override
  public Measure<ElectricChargeUnit> of(double magnitude) {
    return ImmutableMeasure.ofRelativeUnits(magnitude, this);
  }

  @Override
  public Measure<ElectricChargeUnit> ofBaseUnits(double baseUnitMagnitude) {
    return ImmutableMeasure.ofBaseUnits(baseUnitMagnitude, this);
  }

  @Override
  public Measure<ElectricChargeUnit> zero() {
    return (Measure<ElectricChargeUnit>) super.zero();
  }

  @Override
  public Measure<ElectricChargeUnit> one() {
    return (Measure<ElectricChargeUnit>) super.one();
  }

  @Override
  public MutableMeasure<ElectricChargeUnit> mutable(double magnitude) {
    return new GenericMutableMeasureImpl(magnitude, toBaseUnits(magnitude), this);
  }

  @Override
  public VelocityUnit<ElectricChargeUnit> per(TimeUnit period) {
    // Note: technically, this would return a CurrentUnit, since electric charge per time is current (measured in Amperes)
    return VelocityUnit.combine(this, period);
  }

  public double convertFrom(double magnitude, ElectricChargeUnit otherUnit) {
    return fromBaseUnits(otherUnit.toBaseUnits(magnitude));
  }
}

public static final ElectricCharge Coulomb = new ElectricCharge(1, "Coulomb", "C");
public static final ElectricCharge ElectronCharge = new ElectricCharge(1.60217646e-19, "Electron Charge", "e");
public static final ElectricCharge AmpHour = new ElectricCharge(3600, "Amp Hour", "Ah");
public static final ElectricCharge MilliampHour = Milli(AmpHour);
```

