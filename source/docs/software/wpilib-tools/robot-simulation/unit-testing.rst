Unit Testing
============

Unit testing is a method of testing code by dividing the code into the smallest "units" possible and testing each unit. In robot code, this can mean testing the code for each subsystem individually.
There are many unit testing frameworks for most languages. Java robot projects have `JUnit 4<https://junit.org/junit4/>`__ available by default, and C++ robot projects have `Google Test<https://github.com/google/googletest/blob/master/docs/primer.md>`__.

Let's write our subsystem code, and then we'll write a test for it.

Our subsystem will be an Infinite Recharge intake mechanism containing a piston and a motor: the piston deploys/retracts the intake, and the motor will pull the Power Cells inside. Since it won't do anything, we don't want the motor to run if the intake mechanism isn't deployed.
To provide a "clean slate" for each test, we need to implement a function to destroy the object and free all hardware allocations. In Java, this is done by implementing `AutoCloseable` and `.close()`. In C++, this is done with a destructor. Inside this function, we destroy each hardware object by calling its `.close()` method in Java or its destructor in C++.

.. note:: This example can be easily adapted to the command-based paradigm by having ``Intake`` inherit from ``SubsystemBase``.

.. tabs::
   .. code-tab:: Java
   // src/main/frc/robot/subsystems/Intake.java

   public class Intake implements AutoCloseable {
    private PWMSparkMax motor;
    private DoubleSolenoid piston;

    public Intake() {
      motor = new PWMSparkMax(IntakeConstants.MOTOR_PORT);
      piston = new DoubleSolenoid(IntakeConstants.PISTON_FWD, IntakeConstants.PISTON_REV);
    }

    public void deploy() {
      piston.set(DoubleSolenoid.Value.kForward);
    }

    public void retract() {
      piston.set(DoubleSolenoid.Value.kReverse);
      motor.set(0); // turn off the motor
    }

    public void activate(double speed) {
      if(piston.get() == DoubleSolenoid.Value.kForward) {
        motor.set(speed);
      else { // if piston isn't open, do nothing
        motor.set(0);
      }
    }

    public void close() throws Exception {
      piston.close();
      motor.close();
    }
   }

   .. code-tab:: C++
   // TODO


Now let's write the unit test to assert that everything works:

.. note:: Comparison of floating-point values isn't accurate, so comparing them should be done with an acceptable error parameter (``DELTA``).

.. tabs::
   .. code-tab:: Java
   // src/test/frc/robot/subsystems/IntakeTest.java

   public class IntakeTest {
    public static final DELTA = 1e-2; // acceptable difference
    Intake intake;
    PWMSim simMotor;
    PCMSim simPcm;

    @Before // this method will run before each test
    void setup() {
      assert HAL.initialize(500, 0); // initialize the HAL, crash if failed
      intake = new Intake(); // create our intake
      simMotor = new PWMSim(IntakeConstants.MOTOR_PORT); // create our simulation PWM
      simPcm = new PCMSim(); // default PCM
    }

    @After // this method will run after each test
    void shutdown() {
      intake.close(); // destroy our intake object
      simMotor.resetData();
      simPcm.resetData();
    }


    @Test // marks this method as a test
    void doesntWorkWhenClosed() {
     intake.retract(); // close the intake
     intake.activate(0.5); // try to activate the motor
     assertEquals(0.0, simMotor.get(), DELTA); // make sure that the value set to the motor is 0
    }

    @Test
    void worksWhenOpen() {
      intake.deploy();
      intake.activate(0.5);
      assertEquals(0.5, simMotor.get(), DELTA);
    }
   }

   .. code-tab:: C++
   // TODO


Each test contains at least one assertion (``assert*()``/``EXPECT_*()``). These assertions verify a condition and fail the test if the condition isn't met.

Both JUnit and GoogleTest have multiple __assertion__ types, but the most common is equality: ``assertEquals(expected, actual)``/``EXPECT_EQ(expected, actual)``. When comparing numbers, a third parameter - ``delta``, the acceptable error, can be given.
