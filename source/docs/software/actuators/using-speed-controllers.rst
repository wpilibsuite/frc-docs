Using Motor Controllers in Code
================================

Motor controllers come in two main flavors: CAN and PWM. A
CAN controller can send more detailed status information
back to the RoboRIO, whereas a PWM controller can only be
set to a value. For information on using these motors with
the WPI drivetrain classes, see TODO LINK.

Using CAN Speed Controllers
---------------------------

Cross The Road Electronics CAN Speed Controllers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To use a CAN Speed controller from CTRE, simply instantiate
it using the built in WPI classes. For more information on
the CAN bus protocol, see the CAN addressing article (TODO Link).
Furthermore, while CTRE supplies TalonSRX classes, it is recommended
that teams use the WPI versions to take advantage of built
in safety features.
For example,


.. tabs::

   .. code-tab:: java

      WPI_TalonSRX talon = new WPI_TalonSRX(
         // the CAN device number of the talon
         1
      );

      WPI_VictorSPX victor = new WPI_VictorSPX(
         // the CAN device number of the talon
         1
      );

      talon.set(
         // reverse Half Speed
         -0.5
      );


      victor.set(
         // 100% Speed
         1
      );

   .. code-tab:: c++

      // idk c++

Using PWM Speed Controllers
---------------------------

PWM speed controllers can be controlled in the same was as a CAN speed controller.
For a more detailed background on _how_ they work, see How does PWM Work? (TODO LINK)
Simply use the appropriate speed controller class provided by WPI
and supply it the port the speed controller(s) are plugged into on the RoboRIO.
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

REV Robotics SparkMAX
---------------------

For information regarding the SparkMAX CAN Speed Controller, which can be
used in either CAN or PWM mode, please refer to the SparkMAX `software resorces <http://www.revrobotics.com/sparkmax-software/>`_
and `example code. <https://github.com/REVrobotics/SPARK-MAX-Examples>`_  


CTRE Motor Controllers
----------------------

Please refer to the third party CTR documentation on the
Phoenix software for more detailed information. The documentation
is availible `here. <https://phoenix-documentation.readthedocs.io/en/latest/>`_ 
