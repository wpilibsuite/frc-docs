# The Java Units Library

.. note:: New for 2027: Mutable measures have been removed as Systemcore has significantly more memory and is able to run better garbage collection algorithms.

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

- The various classes for predefined dimensions, such as [DistanceUnit](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/units/DistanceUnit.html) and [TimeUnit](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/units/TimeUnit.html)
- [Units](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/units/Units.html), which contains a set of predefined units. Take a look a the [Units javadoc](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/units/Units.html) to browse the available units and their types.
- [Measure](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/units/Measure.html), which is used to tag a value with a unit, and the dimension-specific implementations like [Distance](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/units/measure/Distance.html) and [Time](https://github.wpilib.org/allwpilib/docs/2027/java/edu/wpi/first/units/measure/Time.html)

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

.. warning:: By default, arithmetic operations create new ``Measure`` instances for their results. See :ref:`Java Garbage Collection<docs/software/basic-programming/java-gc:Java Garbage Collection>` for discussion on creating a large number of short-lived objects.

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

