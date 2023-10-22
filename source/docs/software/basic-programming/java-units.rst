The Java Units Library
======================

The units library is intended to reduce the number of unit-related bugs in robot programs by making all unit conversions explicitly required when units are used. Users can define measurements using values directly from CAD software or physical measuring tools without needing to worry about storing everything in terms of the same unit.

.. code-block:: java

   Measure<Mass> kArmMass = Kilograms.of(1.423); // value taken from CAD
   Measure<Distance> kArmLength = Inches.of(32.25); // value taken from physical measurement
   Measure<Angle> kMinArmAngle = Degrees.of(5);
   Measure<Angle> kArmMaxTravel = Rotations.of(0.45);

Using the Units Library
-----------------------

The Java units library is available in the ``edu.wpi.first.units`` package. The most relevant classes are `edu.wpi.first.units.Units <https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/units/Units.html>`__, which contains a set of predefined units; and `edu.wpi.first.units.Measure <https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/units/Measure.html>`__, which is used to tag a value with a unit. It is recommended to static import ``edu.wpi.first.units.Units.*`` to get full access to all the predefined units.

The library comes with predefined SI and imperial units for distance, angle, time, velocity and acceleration (both linear and angular), mass, voltage, current, power, energy, and temperature.

New ``Measure`` objects can be created by calling the ``Unit#of`` method on the appropriate unit object, such as ``Inches.of(8)`` or ``Volts.of(13.5)``.
``Measure`` is a generic type that contains what type of unit the measurement uses, such as ``Angle`` or ``Distance``; for example: ``Measure<Distance> wheelDiameter = Inches.of(6)``.

.. code-block:: java

   import edu.wpi.first.units.Distance;
   import edu.wpi.first.units.Measure;
   import static edu.wpi.first.units.Units.*;

   public class Constants {
     public static class DriveConstants {
       /** The distance between the front and rear axles. **/
       public static final Measure<Distance> kWheelBase = Inches.of(28);

       /** The distance between left and right wheels. **/
       public static final Measure<Distance> kTrackWidth = Inches.of(26);
     }
   }

Because the ``Measure`` objects are Java objects, arithmetic must be done by calling methods on the objects. Note that each operation will return a new ``Measure`` object.

.. code-block:: java

   Measure<Distance> wheelDiameter = Inches.of(3);
   double gearRatio = 10.48;
   Measure<Distance> distancePerRotation = wheelDiameter.times(Math.PI).divide(gearRatio);

Arithmetic can also be performed with multiple ``Measure`` objects together:

.. code-block:: java

   Measure<Distance> armLength = Feet.of(3).plus(Inches.of(4.25));
   Measure<Distance> endEffectorX = armLength.times(Math.cos(getArmAngle().in(Radians));
   Measure<Distance> endEffectorY = armLength.times(Math.sin(getArmAngle().in(Radians));

Unit conversions can be done by calling ``Measure#in(Unit)``. The Java type system will prevent units from being converted between incompatible types, such as distances to angles. The returned values will be bare ``double`` values without unit information - it is up to you, the programmer, to interpret them correctly!

.. code-block:: java

   Measure<Velocity<Distance>> kMaxVelocity = FeetPerSecond.of(12.5);
   Measure<Velocity<Velocity<Distance>>> kMaxAcceleration = FeetPerSecond.per(Second).of(22.9);

   // The WPILib math libraries use SI metric units, so we have to convert to meters:
   TrapezoidProfile.Constraints kDriveConstraints = new TrapezoidProfile.Constraints(
     maxVelocity.in(MetersPerSecond),
     maxAcceleration.in(MetersPerSecondSquared)
   );

Memory Usage and the Garbage Collector
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The roboRIO is a severely memory-constrained runtime environment and the Java garbage collector has to run to keep memory usage to a reasonable level. The garbage collector will have to pause the robot program in order to free unused objects, which manifests as loop overruns and potentially jittery controls. To avoid this issue, allocate as few ``Measure`` objects as possible in areas of code that will run periodically, such as in a Command's ``execute`` or a Subsystem's ``periodic`` method.
If you still want to use units in hot areas of the code, a special ``MutableMeasure`` class is available. ``MutableMeasure`` allows the internal state of the object to be updated (such as with the results arithmetic operations) to avoid allocating new objects. If the object will be exposed as part of a public API method, have that method return a regular ``Measure`` in its signature to prevent other areas of the code (or users, if it's part of a library) from modifying your internal state.

Revisiting the arm example from above:

.. code-block:: java

   import edu.wpi.first.units.Measure;
   import edu.wpi.first.units.MutableMeasure;
   import static edu.wpi.first.units.Units.*;

   public class Arm {
     // Note the two ephemeral object allocations for the Feet.of and Inches.of calls.
     // Because this is a constant value computed just once, they will easily be garbage collected without
     // any problems with memory use or loop timing jitter.
     private static final Measure<Distance> kArmLength = Feet.of(3).plus(Inches.of(4.25));

     // Angle and X/Y locations will likely be called in the main robot loop, let's store them in a MutableMeasure
     // to avoid allocating lots of short-lived objects
     private final MutableMeasure<Angle> m_angle = MutableMeasure.zero(Degrees);
     private final MutableMeasure<Distance> m_endEffectorX = MutableMeasure.zero(Feet);
     private final MutableMeasure<Distance> m_endEffectorY = MutableMeasure.zero(Feet);

     private final Encoder m_encoder = new Encoder(...);

     public Measure<Angle> getAngle() {
       double rawAngle = m_encoder.getPosition();
       m_angle.mut_replace(rawAngle, Degrees); // NOTE: the encoder must be configured with distancePerPulse in terms of degrees!
       return m_angle;
     }

     public Measure<Distance> getEndEffectorX() {
       m_endEffectorX.mut_replace(
         Math.cos(getAngle().in(Radians)) * kArmLength.in(Feet), // the new magnitude to store
         Feet // the units of the new magnitude
       );
       // Or, if you *really* want to avoid unpacking and repacking the length units:
       // m_endEffectorX.mut_replace(kArmLength);
       // m_endEffectorX.mut_times(Math.cos(getAngle().in(Radians));
       return m_endEffectorX;
     }

     public Measure<Distance> getEndEffectorY() {
       m_endEffectorY.mut_replace(
         Math.sin(getAngle().in(Radians)) * kArmLength.in(Feet),
         Feet
       );
       return m_endEffectorY;
     }
   }

Other methods are available on ``MutableMeasure`` for updating the internal value. Note that these methods all begin with the ``mut_`` prefix - this is to make it obvious that these methods will be mutating the object and are potentially unsafe!
For the full list of methods and API documentation, see `the MutableMeasure API documentation <https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/units/MutableMeasure.html>`__

+-------------------------------+--------------------------------------------------------------------------------------------+
| ``mut_plus(double)``          | Increments the internal value by a raw number, in terms of the preexisting unit.           |
+-------------------------------+--------------------------------------------------------------------------------------------+
| ``mut_plus(Measure)``         | Increments the internal value by another measurement. The internal unit will stay the same |
+-------------------------------+--------------------------------------------------------------------------------------------+
| ``mut_minus(double)``         | Decrements the internal value by a raw number, in terms of the preexisting unit.           |
+-------------------------------+--------------------------------------------------------------------------------------------+
| ``mut_minus(Measure)``        | Decrements the internal value by another measurement. The internal unit will stay the same |
+-------------------------------+--------------------------------------------------------------------------------------------+
| ``mut_times(double)``         | Multiplies the internal value by a scalar                                                  |
+-------------------------------+--------------------------------------------------------------------------------------------+
| ``mut_divide(double)``        | Divides the internal value by a scalar                                                     |
+-------------------------------+--------------------------------------------------------------------------------------------+
| ``mut_replace(double, Unit)`` | Overrides the internal state and sets it to equal the given value and unit                 |
+-------------------------------+--------------------------------------------------------------------------------------------+
| ``mut_replace(Measure)``      | Overrides the internal state to make it identical to the given measurement                 |
+-------------------------------+--------------------------------------------------------------------------------------------+
| ``mut_setMagnitude(double)``  | Overrides the internal value, keeping the internal unit. Be careful when using this!       |
+-------------------------------+--------------------------------------------------------------------------------------------+

Defining New Units
------------------

There are four ways to define a new unit that isn't already present in the library:

- Using the ``Unit#per`` or ``Unit#mult`` methods to create a composite of two other units;
- Using the ``Milli``, ``Micro``, and ``Kilo`` helper methods;
- Using the ``derive`` method and customizing how the new unit relates to the base unit;
- Subclassing ``Unit`` to define a new type of unit

New units can be defined as combinations of existing units using the ``Unit#mult`` and ``Unit#per`` methods:

.. code-block:: java

   Per<Voltage, Distance> VoltsPerInch = Volts.per(Inch);
   Velocity<Mass> KgPerSecond = Kilograms.per(Second);
   Mult<Mass, Velocity<Velocity<Distance>> Newtons = Kilograms.mult(MetersPerSecondSquared);

Using ``mult`` and ``per`` will store the resulting unit. Every call will return the same object to avoid unnecessary allocations and garbage collector pressure.

.. code-block:: java

   @Override
   public void robotPeriodic() {
     // Feet.per(Millisecond) creates a new unit on the first loop,
     // which will be reused on every successive loop
     SmartDashboard.putNumber("Speed", m_drivebase.getSpeed().in(Feet.per(Millisecond));
   }

.. note:: Calling ``Unit#per(Time)`` will return a ``Velocity`` unit, which is different from and incompatible with a ``Per`` unit!

New unit types can also be created by subclassing ``Unit`` and implementing the two constructors:

.. code-block:: java

   public class ElectricCharge extends Unit<ElectricCharge> {
     public ElectricCharge(double baseUnitEquivalent, String name, String symbol) {
       super(ElectricCharge.class, baseUnitEquivalent, name, symbol);
     }

     // required for derivation with Milli, Kilo, etc.
     public ElectricCharge(UnaryFunction toBaseConverter, UnaryFunction fromBaseConverter, String name, String symbol) {
        super(ElectricCharge.class, toBaseConverter, fromBaseConverter, name, symbol);
     }
   }

   public static final ElectricCharge Coulomb = new ElectricCharge(1, "Coulomb", "C");
   public static final ElectricCharge ElectronCharge = new ElectricCharge(1.60217646e-19, "Electron Charge", "e");
   public static final ElectricCharge AmpHour = new ElectricCharge(3600, "Amp Hour", "Ah");
   public static final ElectricCharge MilliampHour = Milli(AmpHour);
