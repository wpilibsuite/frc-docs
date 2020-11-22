Feedforward Control in WPILib
=============================

So far, we've used feedback control for reference tracking (making a system's output follow a desired reference signal). While this is effective, it's a reactionary measure; the system won't start applying control effort until the system is already behind. If we could tell the controller about the desired movement and required input beforehand, the system could react quicker and the feedback controller could do less work. A controller that feeds information forward into the plant like this is called a feedforward controller.

A feedforward controller injects information about the system’s dynamics (like a mathematical model does) or the intended movement. Feedforward handles parts of the control actions we already know must be applied to make a system track a reference, then feedback compensates for what we do not or cannot know about the system’s behavior at runtime.

There are two types of feedforwards: model-based feedforward and feedforward for unmodeled dynamics. The first solves a mathematical model of the system for the inputs required to meet desired velocities and accelerations. The second compensates for unmodeled forces or behaviors directly so the feedback controller doesn't have to. Both types can facilitate simpler feedback controllers. We'll cover several examples below.

.. note:: The WPILib feedforward classes closely match the available mechanism characterization tools available in the :ref:`frc-characterization toolsuite <docs/software/wpilib-tools/robot-characterization/introduction:Introduction to Robot Characterization>` - the characterization toolsuite can be used to quickly and effectively determine the correct gains for each type of feedforward.  The toolsuite will indicate the appropriate units for each of the gains.

WPILib provides a number of classes to help users implement accurate feedforward control for their mechanisms.  In many ways, an accurate feedforward is more important than feedback to effective control of a mechanism.  Since most FRC mechanisms closely obey well-understood system equations, starting with an accurate feedforward is both easy and hugely beneficial to accurate and robust mechanism control.

WPILib currently provides the following three helper classes for feedforward control:

* `SimpleMotorFeedforward`_ (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/controller/SimpleMotorFeedforward.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1SimpleMotorFeedforward.html>`__)
* `ArmFeedforward`_ (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/controller/ArmFeedforward.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1ArmFeedforward.html>`__)
* `ElevatorFeedforward`_ (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/controller/ElevatorFeedforward.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1ElevatorFeedforward.html>`__)

SimpleMotorFeedforward
----------------------

.. note:: In C++, the ``SimpleMotorFeedforward`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in gains *must* have units consistent with the distance units, or a compile-time error will be thrown.  ``kS`` should have units of ``volts``, ``kV`` should have units of ``volts * seconds / distance``, and ``kA`` should have units of ``volts * seconds^2 / distance``.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

.. note:: The Java feedforward components will calculate outputs in units determined by the units of the user-provided feedforward gains.  Users *must* take care to keep units consistent, as WPILibJ does not have a type-safe unit system.

The ``SimpleMotorFeedforward`` class calculates feedforwards for mechanisms that consist of permanent-magnet DC motors with no external loading other than friction and inertia, such as flywheels and robot drives.

To create a ``SimpleMotorFeedforward``, simply construct it with the required gains:

.. note:: The ``kA`` gain can be omitted, and if it is, will default to a value of zero.  For many mechanisms, especially those with little inertia, it is not necessary.

.. tabs::

  .. code-tab:: java

    // Create a new SimpleMotorFeedforward with gains kS, kV, and kA
    SimpleMotorFeedforward feedforward = new SimpleMotorFeedforward(kS, kV, kA);

  .. code-tab:: c++

    // Create a new SimpleMotorFeedforward with gains kS, kV, and kA
    // Distance is measured in meters
    frc::SimpleMotorFeedforward<units::meters> feedforward(kS, kV, kA);

To calculate the feedforward, simply call the ``calculate()`` method with the desired motor velocity and acceleration:

.. note:: The acceleration argument may be omitted from the ``calculate()`` call, and if it is, will default to a value of zero.  This should be done whenever there is not a clearly-defined acceleration setpoint.

.. tabs::

  .. code-tab:: java

    // Calculates the feedforward for a velocity of 10 units/second and an acceleration of 20 units/second^2
    // Units are determined by the units of the gains passed in at construction.
    feedforward.calculate(10, 20);

  .. code-tab:: c++

    // Calculates the feedforward for a velocity of 10 meters/second and an acceleration of 20 meters/second^2
    // Output is in volts
    feedforward.Calculate(10_mps, 20_mps_sq);

ArmFeedforward
--------------

.. note:: In C++, the ``ArmFeedforward`` class assumes distances are angular, not linear.  The passed-in gains *must* have units consistent with the angular unit, or a compile-time error will be thrown.  ``kS`` and ``kCos`` should have units of ``volts``, ``kV`` should have units of ``volts * seconds / radians``, and ``kA`` should have units of ``volts * seconds^2 / radians``.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

.. note:: The Java feedforward components will calculate outputs in units determined by the units of the user-provided feedforward gains.  Users *must* take care to keep units consistent, as WPILibJ does not have a type-safe unit system.

The ``ArmFeedforward`` class calculates feedforwards for arms that are controlled directly by a permanent-magnet DC motor, with external loading of friction, inertia, and mass of the arm.  This is an accurate model of most arms in FRC.

To create an ``ArmFeedforward``, simply construct it with the required gains:

.. note:: The ``kA`` gain can be omitted, and if it is, will default to a value of zero.  For many mechanisms, especially those with little inertia, it is not necessary.

.. tabs::

  .. code-tab:: java

    // Create a new ArmFeedforward with gains kS, kCos, kV, and kA
    ArmFeedforward feedforward = new ArmFeedforward(kS, kCos, kV, kA);

  .. code-tab:: c++

    // Create a new ArmFeedforward with gains kS, kCos, kV, and kA
    frc::ArmFeedforward feedforward(kS, kCos, kV, kA);

To calculate the feedforward, simply call the ``calculate()`` method with the desired arm position, velocity, and acceleration:

.. note:: The acceleration argument may be omitted from the ``calculate()`` call, and if it is, will default to a value of zero.  This should be done whenever there is not a clearly-defined acceleration setpoint.

.. tabs::

  .. code-tab:: java

    // Calculates the feedforward for a position of 1 units, a velocity of 2 units/second, and
    // an acceleration of 3 units/second^2
    // Units are determined by the units of the gains passed in at construction.
    feedforward.calculate(1, 2, 3);

  .. code-tab:: c++

    // Calculates the feedforward for a position of 1 radians, a velocity of 2 radians/second, and
    // an acceleration of 3 radians/second^2
    // Output is in volts
    feedforward.Calculate(1_rad, 2_rad_per_s, 3_rad/(1_s * 1_s));

ElevatorFeedforward
-------------------

.. note:: In C++, the ``ElevatorFeedforward`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in gains *must* have units consistent with the distance units, or a compile-time error will be thrown.  ``kS`` and ``kG`` should have units of ``volts``, ``kV`` should have units of ``volts * seconds / distance``, and ``kA`` should have units of ``volts * seconds^2 / distance``.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

.. note:: The Java feedforward components will calculate outputs in units determined by the units of the user-provided feedforward gains.  Users *must* take care to keep units consistent, as WPILibJ does not have a type-safe unit system.

The ``ElevatorFeedforward`` class calculates feedforwards for elevators that consist of permanent-magnet DC motors loaded by friction, inertia, and the mass of the elevator.  This is an accurate model of most elevators in FRC.

To create a ``ElevatorFeedforward``, simply construct it with the required gains:

.. note:: The ``kA`` gain can be omitted, and if it is, will default to a value of zero.  For many mechanisms, especially those with little inertia, it is not necessary.

.. tabs::

  .. code-tab:: java

    // Create a new ElevatorFeedforward with gains kS, kG, kV, and kA
    ElevatorFeedforward feedforward = new ElevatorFeedforward(kS, kG, kV, kA);

  .. code-tab:: c++

    // Create a new ElevatorFeedforward with gains kS, kV, and kA
    // Distance is measured in meters
    frc::ElevatorFeedforward<units::meters> feedforward(kS, kG, kV, kA);

To calculate the feedforward, simply call the ``calculate()`` method with the desired motor velocity and acceleration:

.. note:: The acceleration argument may be omitted from the ``calculate()`` call, and if it is, will default to a value of zero.  This should be done whenever there is not a clearly-defined acceleration setpoint.

.. tabs::

  .. code-tab:: java

    // Calculates the feedforward for a position of 10 units, velocity of 20 units/second,
    // and an acceleration of 30 units/second^2
    // Units are determined by the units of the gains passed in at construction.
    feedforward.calculate(10, 20, 30);

  .. code-tab:: c++

    // Calculates the feedforward for a position of 10 meters, velocity of 20 meters/second,
    // and an acceleration of 30 meters/second^2
    // Output is in volts
    feedforward.Calculate(10_m, 20_mps, 30_mps_sq);

Using Feedforward to Control Mechanisms
---------------------------------------

.. note:: Since feedforward voltages are physically meaningful, it is best to use the ``setVoltage()`` (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/SpeedController.html#setVoltage(double)>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1SpeedController.html#a8252b1dbd027218c7966b15d0f9faff7>`__) method when applying them to motors to compensate for "voltage sag" from the battery.

Feedforward control can be used entirely on its own, without a feedback controller.  This is known as "open-loop" control, and for many mechanisms (especially robot drives) can be perfectly satisfactory.  A ``SimpleMotorFeedforward`` might be employed to control a robot drive as follows:

.. tabs::

  .. code-tab:: java

    public void tankDriveWithFeedforward(double leftVelocity, double rightVelocity) {
      leftMotor.setVoltage(feedforward.calculate(leftVelocity));
      rightMotor.setVoltage(feedForward.calculate(rightVelocity));
    }

  .. code-tab:: c++

    void TankDriveWithFeedforward(units::meters_per_second_t leftVelocity,
                                  units::meters_per_second_t rightVelocity) {
      leftMotor.SetVoltage(feedforward.Calculate(leftVelocity));
      rightMotor.SetVoltage(feedforward.Calculate(rightVelocity));
    }
