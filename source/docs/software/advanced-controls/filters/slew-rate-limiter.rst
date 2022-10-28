.. include:: <isonum.txt>

Slew Rate Limiter
=================

A common use for filters in FRC\ |reg| is to soften the behavior of control inputs (for example, the joystick inputs from your driver controls).  Unfortunately, a simple low-pass filter is poorly-suited for this job; while a low-pass filter will soften the response of an input stream to sudden changes, it will also wash out fine control detail and introduce phase lag.  A better solution is to limit the rate-of-change of the control input directly.  This is performed with a *slew rate limiter* - a filter that caps the maximum rate-of-change of the signal.

A slew rate limiter can be thought of as a sort of primitive motion profile.  In fact, the slew rate limiter is the first-order equivalent of the :ref:`Trapezoidal Motion Profile <docs/software/advanced-controls/controllers/trapezoidal-profiles:Trapezoidal Motion Profiles in WPILib>` supported by WPILib - it is precisely the limiting case of trapezoidal motion when the acceleration constraint is allowed to tend to infinity.  Accordingly, the slew rate limiter is a good choice for applying a de-facto motion profile to a stream of velocity setpoints (or voltages, which are usually approximately proportional to velocity).  For input streams that control positions, it is usually better to use a proper trapezoidal profile.

Slew rate limiting is supported in WPILib through the ``SlewRateLimiter`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/filter/SlewRateLimiter.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_slew_rate_limiter.html>`__).

Creating a SlewRateLimiter
--------------------------

.. note:: The C++ ``SlewRateLimiter`` class is templated on the unit type of the input.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

.. note:: Because filters have "memory", each input stream requires its own filter object.  Do *not* attempt to use the same filter object for multiple input streams.

Creating a SlewRateLimiter is simple:

.. tabs::

  .. code-tab:: java

    // Creates a SlewRateLimiter that limits the rate of change of the signal to 0.5 units per second
    SlewRateLimiter filter = new SlewRateLimiter(0.5);

  .. code-tab:: c++

    // Creates a SlewRateLimiter that limits the rate of change of the signal to 0.5 volts per second
    frc::SlewRateLimiter<units::volts> filter{0.5_V / 1_s};

Using a SlewRateLimiter
-----------------------

Once your filter has been created, using it is easy - simply call the ``calculate()`` method with the most recent input to obtain the filtered output:

.. tabs::

  .. code-tab:: java

    // Calculates the next value of the output
    filter.calculate(input);

  .. code-tab:: c++

    // Calculates the next value of the output
    filter.Calculate(input);

Using a SlewRateLimiter with DifferentialDrive
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: The C++ example below templates the filter on ``units::scalar`` for use with doubles, since joystick values are typically dimensionless.

A typical use of a SlewRateLimiter is to limit the acceleration of a robot's drive.  This can be especially handy for robots that are very top-heavy, or that have very powerful drives.  To do this, apply a SlewRateLimiter to a value passed into your robot drive function:

.. tabs::

  .. code-tab:: java

    // Ordinary call with no ramping applied
    drivetrain.arcadeDrive(forward, turn);

    // Slew-rate limits the forward/backward input, limiting forward/backward acceleration
    drivetrain.arcadeDrive(filter.calculate(forward), turn);

  .. code-tab:: c++

    // Ordinary call with no ramping applied
    drivetrain.ArcadeDrive(forward, turn);

    // Slew-rate limits the forward/backward input, limiting forward/backward acceleration
    drivetrain.ArcadeDrive(filter.Calculate(forward), turn);
