Using Motor Controllers in Code
================================

Motor controllers come in two main flavors: CAN and PWM. A CAN controller can send more detailed status information back to the roboRIO, whereas a PWM controller can only be set to a value. For information on using these motors with the WPI drivetrain classes, see :doc:`wpi-drive-classes`.

Using PWM Motor Controllers
---------------------------

PWM motor controllers can be controlled in the same way as a CAN motor controller. For a more detailed background on *how* they work, see :doc:`pwm-controllers`. To use a PWM motor controller, simply use the appropriate motor controller class provided by WPI and supply it the port the motor controller(s) are plugged into on the roboRIO. All approved motor controllers have WPI classes provided for them.

.. note:: The ``Spark`` and ``VictorSP`` classes are used here as an example; other PWM motor controller classes have exactly the same API.

.. tabs::

   .. code-tab:: java

      Spark spark = new Spark(0); // 0 is the RIO PWM port this is connected to

      spark.set(-0.75); // the % output of the motor, between -1 and 1

      VictorSP victor = new VictorSP(0); // 0 is the RIO PWM port this is connected to

      victor.set(0.6); // the % output of the motor, between -1 and 1

   .. code-tab:: c++

      frc::Spark spark{0}; // 0 is the RIO PWM port this is connected to

      spark.Set(-0.75); // the % output of the motor, between -1 and 1

      frc::VictorSP victor{0}; // 0 is the RIO PWM port this is connected to

      victor.Set(0.6); // the % output of the motor, between -1 and 1

   .. code-tab:: python

      spark = wpilib.Spark(0) # 0 is the RIO PWM port this is connected to

      spark.set(-0.75) # the % output of the motor, between -1 and 1

      victor = wpilib.VictorSP(0) # 0 is the RIO PWM port this is connected to

      victor.set(0.6) # the % output of the motor, between -1 and 1


CAN Motor Controllers
---------------------

A handful of CAN motor controllers are available through vendors such as CTR Electronics and REV Robotics.

SPARK MAX
^^^^^^^^^

For information regarding the SPARK MAX CAN Motor Controller, which can be used in either CAN or PWM mode, please refer to the SPARK MAX `software resources <https://www.revrobotics.com/sparkmax-software/>`_ and `example code. <https://github.com/REVrobotics/SPARK-MAX-Examples>`_

CTRE CAN Motor Controllers
^^^^^^^^^^^^^^^^^^^^^^^^^^

Please refer to the third party CTRE documentation on the Phoenix software for more detailed information. The documentation is available `here. <https://docs.ctre-phoenix.com/>`_
