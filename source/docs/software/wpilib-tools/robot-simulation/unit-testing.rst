Unit Testing
============

Unit testing is a method of testing code by dividing the code into the smallest "units" possible and testing each unit. In robot code, this can mean testing the code for each subsystem individually. There are many unit testing frameworks for most languages. Java robot projects have `JUnit 4 <https://junit.org/junit4/>`__ available by default, and C++ robot projects have `Google Test <https://github.com/google/googletest/blob/main/docs/primer.md>`__.

Writing Testable Code
^^^^^^^^^^^^^^^^^^^^^

.. note:: This example can be easily adapted to the command-based paradigm by having ``Intake`` inherit from ``SubsystemBase``.

Our subsystem will be an Infinite Recharge intake mechanism containing a piston and a motor: the piston deploys/retracts the intake, and the motor will pull the Power Cells inside. We don't want the motor to run if the intake mechanism isn't deployed because it won't do anything.

To provide a "clean slate" for each test, we need to have a function to destroy the object and free all hardware allocations. In Java, this is done by implementing the ``AutoCloseable`` interface and its ``.close()`` method, destroying each member object by calling the member's ``.close()`` method - an object without a ``.close()`` method probably doesn't need to be closed. In C++, the default destructor will be called automatically when the object goes out of scope and will call destructors of member objects.

.. note:: Vendors might not support resource closing identically to the way shown here. See your vendor's documentation for more information as to what they support and how.

.. tabs::
   .. group-tab:: Java

      .. code-block:: java

         import edu.wpi.first.wpilibj.DoubleSolenoid;
         import edu.wpi.first.wpilibj.PWMSparkMax;
         import frc.robot.Constants.IntakeConstants;

         public class Intake implements AutoCloseable {
           private PWMSparkMax motor;
           private DoubleSolenoid piston;

           public Intake() {
             motor = new PWMSparkMax(IntakeConstants.MOTOR_PORT);
             piston = new DoubleSolenoid(PneumaticsModuleType.CTREPCM, IntakeConstants.PISTON_FWD, IntakeConstants.PISTON_REV);
           }

           public void deploy() {
             piston.set(DoubleSolenoid.Value.kForward);
           }

           public void retract() {
             piston.set(DoubleSolenoid.Value.kReverse);
             motor.set(0); // turn off the motor
           }

           public void activate(double speed) {
             if (piston.get() == DoubleSolenoid.Value.kForward) {
               motor.set(speed);
             } else { // if piston isn't open, do nothing
               motor.set(0);
             }
           }

           @Override
           public void close() throws Exception {
             piston.close();
             motor.close();
           }
         }

   .. group-tab:: C++ (Header)

      .. code-block:: cpp

         #include <frc2/command/SubsystemBase.h>
         #include <frc/DoubleSolenoid.h>
         #include <frc/PWMSparkMax.h>

         #include "Constants.h"

         class Intake : public frc2::SubsystemBase {
          public:
           void Deploy();
           void Retract();
           void Activate(double speed);

           private:
           frc::PWMSparkMax motor{Constants::Intake::MOTOR_PORT};
           frc::DoubleSolenoid piston{frc::PneumaticsModuleType::CTREPCM, Constants::Intake::PISTON_FWD, Constants::Intake::PISTON_REV};
         };

   .. group-tab:: C++ (Source)

      .. code-block:: cpp

         #include "subsystems/Intake.h"

         void Intake::Deploy() {
             piston.Set(frc::DoubleSolenoid::Value::kForward);
         }

         void Intake::Retract() {
             piston.Set(frc::DoubleSolenoid::Value::kReverse);
             motor.Set(0); // turn off the motor
         }

         void Intake::Activate(double speed) {
             if (piston.Get() == frc::DoubleSolenoid::Value::kForward) {
                 motor.Set(speed);
             } else { // if piston isn't open, do nothing
                 motor.Set(0);
             }
         }

Writing Tests
^^^^^^^^^^^^^

.. important:: Tests are placed inside the ``test`` source set: ``/src/test/java/`` and ``/src/test/cpp/`` for Java and C++ tests, respectively. Files outside that source root do not have access to the test framework - this will fail compilation due to unresolved references.

In Java, each test class contains at least one test method marked with ``@org.junit.Test``, each method representing a test case. Additional methods for opening resources (such as our ``Intake`` object) before each test and closing them after are respectively marked with ``@org.junit.Before`` and ``@org.junit.After``. In C++, test fixture classes inheriting from ``testing::Test`` contain our subsystem and simulation hardware objects, and test methods are written using the ``TEST_F(testfixture, testname)`` macro. The ``SetUp()`` and ``TearDown()`` methods can be overridden in the test fixture class and will be run respectively before and after each test.

Each test method should contain at least one *assertion* (``assert*()`` in Java or ``EXPECT_*()`` in C++). These assertions verify a condition at runtime and fail the test if the condition isn't met. If there is more than one assertion in a test method, the first failed assertion will crash the test - execution won't reach the later assertions.

Both JUnit and GoogleTest have multiple assertion types, but the most common is equality: ``assertEquals(expected, actual)``/``EXPECT_EQ(expected, actual)``. When comparing numbers, a third parameter - ``delta``, the acceptable error, can be given. In JUnit (Java), these assertions are static methods and can be used without qualification by adding the static star import ``import static org.junit.Asssert.*``. In Google Test (C++), assertions are macros from the ``<gtest/gtest.h>`` header.

.. note:: Comparison of floating-point values isn't accurate, so comparing them should be done with an acceptable error parameter (``DELTA``).

.. tabs::
   .. code-tab:: java

      import static org.junit.Assert.*;

      import edu.wpi.first.hal.HAL;
      import edu.wpi.first.wpilibj.DoubleSolenoid;
      import edu.wpi.first.wpilibj.simulation.DoubleSolenoidSim;
      import edu.wpi.first.wpilibj.simulation.PWMSim;
      import frc.robot.Constants.IntakeConstants;
      import org.junit.*;

      public class IntakeTest {
        public static final double DELTA = 1e-2; // acceptable deviation range
        Intake intake;
        PWMSim simMotor;
        DoubleSolenoidSim simPiston;

        @Before // this method will run before each test
        public void setup() {
          assert HAL.initialize(500, 0); // initialize the HAL, crash if failed
          intake = new Intake(); // create our intake
          simMotor = new PWMSim(IntakeConstants.MOTOR_PORT); // create our simulation PWM motor controller
          simPiston = new DoubleSolenoidSim(PneumaticsModuleType.CTREPCM, IntakeConstants.PISTON_FWD, IntakeConstants.PISTON_REV); // create our simulation solenoid
        }

        @After // this method will run after each test
        public void shutdown() throws Exception {
          intake.close(); // destroy our intake object
        }

        @Test // marks this method as a test
        public void doesntWorkWhenClosed() {
          intake.retract(); // close the intake
          intake.activate(0.5); // try to activate the motor
          assertEquals(0.0, simMotor.getSpeed(), DELTA); // make sure that the value set to the motor is 0
        }

        @Test
        public void worksWhenOpen() {
          intake.deploy();
          intake.activate(0.5);
          assertEquals(0.5, simMotor.getSpeed(), DELTA);
        }

        @Test
        public void retractTest() {
          intake.retract();
          assertEquals(DoubleSolenoid.Value.kReverse, simPiston.get());
        }

        @Test
        public void deployTest() {
          intake.deploy();
          assertEquals(DoubleSolenoid.Value.kForward, simPiston.get());
        }
      }

   .. code-tab:: cpp

      #include <gtest/gtest.h>

      #include <frc/DoubleSolenoid.h>
      #include <frc/simulation/DoubleSolenoidSim.h>
      #include <frc/simulation/PWMSim.h>

      #include "subsystems/Intake.h"
      #include "Constants.h"

      class IntakeTest : public testing::Test {
       protected:
        Intake intake; // create our intake
        frc::sim::PWMSim simMotor{Constants::Intake::MOTOR_PORT}; // create our simulation PWM
        frc::sim::DoubleSolenoidSim simPiston{frc::PneumaticsModuleType::CTREPCM, Constants::Intake::PISTON_FWD, Constants::Intake::PISTON_REV}; // create our simulation solenoid
      };

      TEST_F(IntakeTest, DoesntWorkWhenClosed) {
        intake.Retract(); // close the intake
        intake.Activate(0.5); // try to activate the motor
        EXPECT_DOUBLE_EQ(0.0, simMotor.GetSpeed()); // make sure that the value set to the motor is 0
      }

      TEST_F(IntakeTest, WorksWhenOpen) {
        intake.Deploy();
        intake.Activate(0.5);
        EXPECT_DOUBLE_EQ(0.5, simMotor.GetSpeed());
      }

      TEST_F(IntakeTest, RetractTest) {
        intake.Retract();
        EXPECT_EQ(frc::DoubleSolenoid::Value::kReverse, simPiston.Get());
      }

      TEST_F(IntakeTest, DeployTest) {
        intake.Deploy();
        EXPECT_EQ(frc::DoubleSolenoid::Value::kForward, simPiston.Get());
      }

For more advanced usage of JUnit and Google Test, see the framework docs.

Running Tests
^^^^^^^^^^^^^

.. note:: Tests will always be run in simulation on your desktop. For prerequisites and more info, see :doc:`the simulation introduction <introduction>`.

For Java tests to run, make sure that your ``build.gradle`` file contains the following block:

.. code-block:: groovy

  test {
     useJUnit()
  }

Use :guilabel:`Test Robot Code` from the Command Palette to run the tests. Results will be reported in the terminal output, each test will have a ``FAILED`` or ``PASSED``/``OK`` label next to the test name in the output. JUnit (Java only) will generate a HTML document in ``build/reports/tests/test/index.html`` with a more detailed overview of the results; if there are failied test a link to render the document in your browser will be printed in the terminal output.

By default, Gradle runs the tests whenever robot code is built, including deploys. This will increase deploy time, and failing tests will cause the build and deploy to fail. To prevent this from happening, you can use :guilabel:`Change Skip Tests On Deploy Setting` from the Command Palette to configure whether to run tests when deploying.
