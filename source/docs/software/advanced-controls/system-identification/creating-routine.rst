# Creating an Identification Routine

## Types of Tests

A standard motor identification routine consists of two types of tests:

- **Quasistatic:** In this test, the mechanism is gradually sped-up such that the voltage corresponding to acceleration is negligible (hence, "as if static").
- **Dynamic:** In this test, a constant 'step voltage' is given to the mechanism, so that the behavior while accelerating can be determined.

Each test type is run both forwards and backwards, for four tests in total. The tests can be run in any order, but running a "backwards" test directly after a "forwards" test is generally advisable (as it will more or less reset the mechanism to its original position). ``SysIdRoutine`` provides command factories that may be used to run the tests, for example as part of an autonomous routine. Previous versions of SysId used a project generator to create and deploy robot code to run these tests, but it proved to be very fragile and difficult to maintain. The user code-based workflow enables teams to use mechanism code they already know works, including soft and hard limits.

## User Code Setup

.. note:: Some familiarity with your language's units library is recommended and knowing how to use Consumers is required. This page assumes you are using the Commands framework.

To assist in creating SysId-compatible identification routines, WPILib provides the ``SysIdRoutine`` class. Users should create a ``SysIdRoutine`` object, which take both a ``Config`` object describing the test settings and a ``Mechanism`` object describing how the routine will control the relevant motors and log the measurements needed to perform the fit.

### Routine Config

The ``Config`` object takes in a a voltage ramp rate for use in Quasistatic tests, a steady state step voltage for use in Dynamic tests, a time to use as the maximum test duration for safety reasons, and a callback method that accepts the current test state (such as "dynamic-forward") for use by a 3rd party logging solution. The constructor may be left blank to default the ramp rate to 1 volt per second and the step voltage to 7 volts.

.. note:: Not all 3rd party loggers will interact with SysIdRoutine directly. CTRE users who do not wish to use SysIdRoutine directly for logging should use the [SignalLogger](https://pro.docs.ctr-electronics.com/en/latest/docs/api-reference/api-usage/signal-logging.html) API and use Tuner X to convert to wpilog. REV users may use Team 6328's [Unofficial REV-Compatible Logger (URCL)](https://docs.advantagescope.org/more-features/urcl). In both cases the log callback should be set to ``null``. Once the log file is in hand, it may be used with SysId just like any other.

The timeout and state callback are optional and defaulted to 10 seconds and null (which will log the data to a normal WPILog file) respectively.

### Declaring the Mechanism

The ``Mechanism`` object takes a voltage consumer, a log consumer, the subsystem being characterized, and the name of the mechanism (to record in the log). The drive callback takes in the routine-generated voltage command and passes it to the relevant motors. The log callback reads the motor voltage, position, and velocity for each relevant motor and adds it to the running log. The subsystem is required so that it may be added to the requirements of the routine commands. The name is optional and will be defaulted to the string returned by getName().

The callbacks can either be created in-place via Lambda expressions or can be their own standalone functions and be passed in via method references. Best practice is to create the routine and callbacks inside the subsystem, to prevent leakage.

.. tab-set-code::

  ```java
  // Creates a SysIdRoutine
  SysIdRoutine routine = new SysIdRoutine(
      new SysIdRoutine.Config(),
      new SysIdRoutine.Mechanism(this::voltageDrive, this::logMotors, this)
  );
  ```

  ```python
  routine =  commands2.sysid.SysIdRoutine(
      commands2.sysid.SysIdRoutine.Config(),
      commands2.sysid.SysIdRoutine.Mechanism(self.voltageDrive, self.logMotors, self),
  )
  ```

### Mechanism Callbacks

The ``Mechanism`` callbacks are essentially just plumbing between the routine and your motors and sensors.

The ``drive`` callback exists so that you can pass the requested voltage directly to your motor controller(s).

The ``log`` callback reads sensors so that the routine can log the voltage, position, and velocity at each timestep.

See the SysIdRoutine ([Java](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/sysidroutine), [C++](https://github.com/wpilibsuite/allwpilib/tree/v2027.0.0-alpha-2/wpilibcExamples/src/main/cpp/examples/SysIdRoutine)) example project for example callbacks.

### Test Factories

To be able to run the tests, SysIdRoutine exposes test "factories", or functions that each return a command that will execute a given test.

.. tab-set-code::

  ```java
  public Command sysIdQuasistatic(SysIdRoutine.Direction direction) {
    return routine.quasistatic(direction);
  }

  public Command sysIdDynamic(SysIdRoutine.Direction direction) {
    return routine.dynamic(direction);
  }
  ```

  ```python
  def sysIdQuasistatic(self, direction:commands2.sysid.SysIdRoutine.Direction) -> commands2.Command:
    return commands2.sysid.SysIdRoutine.quasistatic(direction)

  def sysIdDynamic(self, direction:commands2.sysid.SysIdRoutine.Direction) -> commands2.Command:
    return commands2.sysid.SysIdRoutine.dynamic(direction)
  ```

Either bind the factory methods to either controller buttons or create an autonomous routine with them. It is recommended to bind them to buttons that the user must hold down for the duration of the test so that the user can stop the routine quickly if it exceeds safe limits.
