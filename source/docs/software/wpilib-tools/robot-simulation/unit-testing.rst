# Unit Testing

Unit testing is a method of testing code by dividing the code into the smallest "units" possible and testing each unit. In robot code, this can mean testing the code for each subsystem individually. There are many unit testing frameworks for most languages. Java robot projects have [JUnit 5](https://junit.org/junit5/) available by default, and C++ robot projects have [Google Test](https://github.com/google/googletest/blob/main/docs/primer.md).

### Writing Testable Code

.. note:: This example can be easily adapted to the command-based paradigm by having ``Intake`` inherit from ``SubsystemBase``.

Our subsystem will be an Infinite Recharge intake mechanism containing a piston and a motor: the piston deploys/retracts the intake, and the motor will pull the Power Cells inside. We don't want the motor to run if the intake mechanism isn't deployed because it won't do anything.

To provide a "clean slate" for each test, we need to have a function to destroy the object and free all hardware allocations. In Java, this is done by implementing the ``AutoCloseable`` interface and its ``.close()`` method, destroying each member object by calling the member's ``.close()`` method - an object without a ``.close()`` method probably doesn't need to be closed. In C++, the default destructor will be called automatically when the object goes out of scope and will call destructors of member objects.

.. note:: Vendors might not support resource closing identically to the way shown here. See your vendor's documentation for more information as to what they support and how.

.. tab-set::
   .. tab-item:: Java
      :sync: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2026.1.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/unittest/subsystems/Intake.java
         :language: java
         :lines: 7-

   .. tab-item:: C++ (Header)
      :sync: C++


      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2026.1.1/wpilibcExamples/src/main/cpp/examples/UnitTest/include/subsystems/Intake.h
         :language: c++
         :lines: 7-

   .. tab-item:: C++ (Source)
      :sync: C++ (Source)

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2026.1.1/wpilibcExamples/src/main/cpp/examples/UnitTest/cpp/subsystems/Intake.cpp
         :language: c++
         :lines: 5-

### Writing Tests

.. important:: Tests are placed inside the ``test`` source set: ``/src/test/java/`` and ``/src/test/cpp/`` for Java and C++ tests, respectively. Files outside that source root do not have access to the test framework - this will fail compilation due to unresolved references.

In Java, each test class contains at least one test method marked with ``@org.junit.jupiter.api.Test``, each method representing a test case. Additional methods for opening resources (such as our ``Intake`` object) before each test and closing them after are respectively marked with ``@org.junit.jupiter.api.BeforeEach`` and ``@org.junit.jupiter.api.AfterEach``. In C++, test fixture classes inheriting from ``testing::Test`` contain our subsystem and simulation hardware objects, and test methods are written using the ``TEST_F(testfixture, testname)`` macro. The ``SetUp()`` and ``TearDown()`` methods can be overridden in the test fixture class and will be run respectively before and after each test.

Each test method should contain at least one *assertion* (``assert*()`` in Java or ``EXPECT_*()`` in C++). These assertions verify a condition at runtime and fail the test if the condition isn't met. If there is more than one assertion in a test method, the first failed assertion will crash the test - execution won't reach the later assertions.

Both JUnit and GoogleTest have multiple assertion types; the most common is equality: ``assertEquals(expected, actual)``/``EXPECT_EQ(expected, actual)``. When comparing numbers, a third parameter - ``delta``, the acceptable error, can be given. In JUnit (Java), these assertions are static methods and can be used without qualification by adding the static star import ``import static org.junit.jupiter.api.Assertions.*``. In Google Test (C++), assertions are macros from the ``<gtest/gtest.h>`` header.

.. note:: Comparison of floating-point values isn't accurate, so comparing them should be done with an acceptable error parameter (``DELTA``).

.. tab-set::
   .. tab-item:: Java
      :sync: Java

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2026.1.1/wpilibjExamples/src/test/java/edu/wpi/first/wpilibj/examples/unittest/subsystems/IntakeTest.java
         :language: java
         :lines: 7-

   .. tab-item:: C++
      :sync: C++

      .. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2026.1.1/wpilibcExamples/src/test/cpp/examples/UnitTest/cpp/subsystems/IntakeTest.cpp
         :language: c++
         :lines: 5-

For more advanced usage of JUnit and Google Test, see the framework docs.

### Running Tests

.. note:: Tests will always be run in simulation on your desktop. For prerequisites and more info, see :doc:`the simulation introduction <introduction>`.

For Java tests to run, make sure that your ``build.gradle`` file contains the following block:

.. rli:: https://raw.githubusercontent.com/wpilibsuite/vscode-wpilib/v2026.2.1/vscode-wpilib/resources/gradle/java/build.gradle
   :language: groovy
   :lines: 78-81
   :lineno-match:

Use :guilabel:`Test Robot Code` from the Command Palette to run the tests. Results will be reported in the terminal output, each test will have a ``FAILED`` or ``PASSED``/``OK`` label next to the test name in the output. JUnit (Java only) will generate a HTML document in ``build/reports/tests/test/index.html`` with a more detailed overview of the results; if there are any failed tests a link to render the document in your browser will be printed in the terminal output.

By default, Gradle runs the tests whenever robot code is built, including deploys. This will increase deploy time, and failing tests will cause the build and deploy to fail. To prevent this from happening, you can use :guilabel:`Change Skip Tests On Deploy Setting` from the Command Palette to configure whether to run tests when deploying.
