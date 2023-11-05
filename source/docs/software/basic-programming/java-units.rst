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
``Measure`` is a generic type that contains the type of unit the measurement uses, such as ``Angle`` or ``Distance``. For example, ``Measure<Distance> wheelDiameter = Inches.of(6)`` is a measurement object corresponding to a distance of six inches, and ``Measure<Velocity<Angle>> maxRPM = RPM.of(5640)`` is a measurement corresponding to an angular velocity of 5,640 RPM.

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

Unit conversions can be done by calling ``Measure#in(Unit)``. The Java type system will prevent units from being converted between incompatible types, such as distances to angles. The returned values will be bare ``double`` values without unit information - it is up to you, the programmer, to interpret them correctly! It is strongly recommended to only use unit conversions when interacting with APIs that do not support the units library.

.. code-block:: java

   Measure<Velocity<Distance>> kMaxVelocity = FeetPerSecond.of(12.5);
   Measure<Velocity<Velocity<Distance>>> kMaxAcceleration = FeetPerSecond.per(Second).of(22.9);

   kMaxVelocity.in(MetersPerSecond); // => OK! Returns 3.81
   kMaxVelocity.in(RadiansPerSecond); // => Compile error! Velocity<Angle> cannot be converted to Unit<Velocity<Distance>>

   // The WPILib math libraries use SI metric units, so we have to convert to meters:
   TrapezoidProfile.Constraints kDriveConstraints = new TrapezoidProfile.Constraints(
     maxVelocity.in(MetersPerSecond),
     maxAcceleration.in(MetersPerSecondPerSecond)
   );

.. note:: Due to restrictions of the Java type system, acceleration is modeled as ``Velocity<Velocity<X>>>`` instead of having its own class.

Memory Usage and the Garbage Collector
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The roboRIO is a severely memory-constrained runtime environment and the Java garbage collector has to run to keep memory usage to a reasonable level. The garbage collector will have to pause the robot program in order to free unused objects, which manifests as loop overruns and potentially jittery controls. To avoid this issue, allocate as few ``Measure`` objects as possible in areas of code that will run periodically, such as in a Command's ``execute`` or one of TimedRobot's periodic methods.
If you still want to use units in hot areas of the code, a special ``MutableMeasure`` class is available. ``MutableMeasure`` allows the internal state of the object to be updated (such as with the results arithmetic operations) to avoid allocating new objects. If the object will be exposed as part of a public API method, have that method return a regular ``Measure`` in its signature to prevent other areas of the code (or users, if it's part of a library) from modifying your internal state.

Extra methods are available on ``MutableMeasure`` for updating the internal value. Note that these methods all begin with the ``mut_`` prefix - this is to make it obvious that these methods will be mutating the object and are potentially unsafe!
For the full list of methods and API documentation, see `the MutableMeasure API documentation <https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/units/MutableMeasure.html>`__

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

.. code-block:: java

   MutableMeasure<Distance> measure = MutableMeasure.zero(Feet);
   measure.mut_plus(10, Inches);    // 0.8333 feet
   measure.mut_plus(Inches.of(10)); // 1.6667 feet
   measure.mut_minus(5, Inches);    // 1.25 feet
   measure.mut_minus(Inches.of(5)); // 0.8333 feet
   measure.mut_times(6);            // 0.8333 * 6 = 5 feet
   measure.mut_divide(5);           // 5 / 5 = 1 foot
   measure.mut_replace(6.2, Meters) // 6.2 meters - note the unit changed!
   measure.mut_replace(Millimeters.of(14.2)) // 14.2mm - the unit changed again!
   measure.mut_setMagnitude(72)     // 72mm

Revisiting the arm example from above, we can use ``mut_replace`` - and, optionally, ``mut_times`` - to calculate the end effector position

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

     public Measure<Distance> getEndEffectorX() {
       m_endEffectorX.mut_replace(
         Math.cos(getAngle().in(Radians)) * kArmLength.in(Feet), // the new magnitude to store
         Feet // the units of the new magnitude
       );
       return m_endEffectorX;
     }

     public Measure<Distance> getEndEffectorY() {
       // An alternative approach so we don't have to unpack and repack the units
       m_endEffectorY.mut_replace(kArmLength);
       m_endEffectorY.mut_times(Math.sin(getAngle().in(Radians));
       return m_endEffectorY;
     }

     public Measure<Angle> getAngle() {
       double rawAngle = m_encoder.getPosition();
       m_angle.mut_replace(rawAngle, Degrees); // NOTE: the encoder must be configured with distancePerPulse in terms of degrees!
       return m_angle;
     }
   }

.. warning:: ``MutableMeasure`` objects can - by definition - change their values at any time! It is unsafe to keep a stateful reference to them - prefer to extract a value using the ``Measure#in`` method, or create a copy with ``Measure#copy`` that can be safely stored. For the same reason, library authors must also be careful about methods accepting ``Measure``.

Can you spot the bug in this code?

.. code-block:: java

   private Measure<Distance> m_lastDistance;

   public Measure<Distance> calculateDelta(Measure<Distance> currentDistance) {
     if (m_lastDistance == null) {
       m_lastDistance = currentDistance;
       return currentDistance;
     } else {
       Measure<Distance> delta = currentDistance.minus(m_lastDistance);
       m_lastDistance = currentDistance;
       return delta;
     }
   }

If we run the ``calculateDelta`` method a few times, we can see a pattern:

.. code-block:: java

   MutableMeasure<Distance> distance = MutableMeasure.zero(Inches);
   distance.mut_plus(10, Inches);
   calculateDelta(distance); // expect 10 inches and get 10 - good!

   distance.mut_plus(2, Inches);
   calculateDelta(distance); // expect 2 inches, but get 0 instead!

   distance.mut_plus(8, Inches);
   calculateDelta(distance); // expect 8 inches, but get 0 instead!

This is because the ``m_lastDistance`` field is a reference to the *same* ``MutableMeasure`` object as the input! Effectively, the delta is calculated as (currentDistance - currentDistance) on every call after the first, which naturally always returns zero. One solution would be to track ``m_lastDistance`` as a *copy* of the input measure to take a snapshot; however, this approach does incur one extra object allocation for the copy. If you need to be careful about object allocations, ``m_lastDistance`` could also be stored as a ``MutableMeasure``.

.. tab-set::

   .. tab-item:: Immutable Copies

      .. code-block:: java

         private Measure<Distance> m_lastDistance;

         public Measure<Distance> calculateDelta(Measure<Distance> currentDistance) {
           if (m_lastDistance == null) {
             m_lastDistance = currentDistance.copy();
             return currentDistance;
           } else {
             var delta = currentDistance.minus(m_lastDistance);
             m_lastDistance = currentDistance.copy();
             return delta;
           }
         }

   .. tab-item:: Zero-allocation Mutables

      .. code-block:: java

         private final MutableMeasure<Distance> m_lastDistance = MutableMeasure.zero(Meters);
         private final MutableMeasure<Distance> m_delta = MutableMeasure.zero(Meters);

         public Measure<Distance> calculateDelta(Measure<Distance> currentDistance) {
           // m_delta = currentDistance - m_lastDistance
           m_delta.mut_replace(currentDistance);
           m_delta.mut_minus(m_lastDistance);
           m_lastDistance.mut_replace(currentDistance);
           return m_delta;
         }

Defining New Units
------------------

There are four ways to define a new unit that isn't already present in the library:

- Using the ``Unit#per`` or ``Unit#mult`` methods to create a composite of two other units;
- Using the ``Milli``, ``Micro``, and ``Kilo`` helper methods;
- Using the ``derive`` method and customizing how the new unit relates to the base unit;
- Subclassing ``Unit`` to define a new type of unit

New units can be defined as combinations of existing units using the ``Unit#mult`` and ``Unit#per`` methods.

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

New unit types can also be created by subclassing ``Unit`` and implementing the two constructors. Note that ``Unit`` is also a parameterized generic type, where the generic type argument is self-referential; ``Distance`` is a ``Unit<Distance>``. This is what allows us to have stronger guarantees in the type system to prevent conversions between unrelated unit types.

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
