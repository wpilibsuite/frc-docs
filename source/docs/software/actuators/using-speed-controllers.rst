.. _using-speed-controllers:

Using Motor Controllers in Code
================================
Motor controllers come in two main flavors: CAN and PWM. A
CAN controller can send more detailed status information
back to the roboRIO, whereas a PWM controller can only be
set to a value. For information on using these motors with
the WPI drivetrain classes, see :ref:`wpi_drive`.

Using PWM Speed Controllers
---------------------------
PWM speed controllers can be controlled in the same was as a CAN speed controller.
For a more detailed background on *how* they work, see
:ref:`pwm_theory`. To use a PWM speed controller, simply use the
appropriate
speed controller class provided by WPI
and supply it the port the speed controller(s) are plugged into on the roboRIO.
All approved motor controllers have WPI classes provided for them.

.. tabs::

   .. code-tab:: java

      Spark spark = new Spark(
         // The RIO PWM port this is connected to
         0
      );

      spark.set(
         // the output of the motor, between -1 and 1
         -0.75
      );

      VictorSP victor = new VictorSP(
         // The RIO PWM port this is connected to
         0
      );

      victor.set(
         // the output of the motor, between -1 and 1
         0.6
      );

   .. code-tab:: c++

      // idk c++


CAN Motor Controllers
---------------------
A handful of CAN speed controllers are available through vendors such as CTR Electronics
and REV Robotics.

SPARK MAX
^^^^^^^^^
For information regarding the SparkMAX CAN Speed Controller, which can be
used in either CAN or PWM mode, please refer to the SparkMAX `software resources <http://www.revrobotics.com/sparkmax-software/>`_
and `example code. <https://github.com/REVrobotics/SPARK-MAX-Examples>`_

CTRE CAN Motor Controllers
^^^^^^^^^^^^^^^^^^^^^^^^^^
Please refer to the third party CTR documentation on the
Phoenix software for more detailed information. The documentation
is available `here. <https://phoenix-documentation.readthedocs.io/en/latest/>`_
