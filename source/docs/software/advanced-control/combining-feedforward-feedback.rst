Combining Feedforward and PID Control
=====================================

.. todo:: link to conceptual article when available

.. note:: This article covers the in-code implementation of combined feedforward/PID control with WPILib's provided library classes.  For an explanation of the concepts involved, see <TODO: link>.

Feedforward and feedback controllers can each be used in isolation, but are most effective when combined together.  Thankfully, combining these two control methods is *exceedingly* simple - one simply adds their outputs together.

Using Feedforward with a PIDController
--------------------------------------

Users familiar with the old ``PIDController`` class may notice the lack of any feedforward gain in the new controller.  As users are expected to use the controller output themselves, there is no longer any need for the ``PIDController`` to implement feedforward - users may simply add any feedforward they like to the output of the controller before sending it to their motors:

.. tabs::

  .. code-tab:: java

    // Adds a feedforward to the loop output before sending it to the motor
    motor.setVoltage(pid.calculate(encoder.getDistance(), setpoint) + feedforward);

  .. code-tab:: c++

    // Adds a feedforward to the loop output before sending it to the motor
    motor.SetVoltage(pid.Calculate(encoder.GetDistance(), setpoint) + feedforward);

Moreover, feedforward is a separate feature entirely from feedback, and thus has no reason to be handled in the same controller object, as this violates separation of concerns.  WPILib comes with several helper classes to compute accurate feedforward voltages for common FRC mechanisms - for more information, see :ref:`docs/software/advanced-control/feedforward:Feedforward Control in WPILib`.

Using Feedforward Components with PID
-------------------------------------

.. note:: Since feedforward voltages are physically meaningful, it is best to use the ``setVoltage()`` (`Java <https://first.wpi.edu/FRC/roborio/development/docs/java/edu/wpi/first/wpilibj/SpeedController.html#setVoltage(double)>`__, `C++ <https://first.wpi.edu/FRC/roborio/development/docs/cpp/classfrc_1_1SpeedController.html#a8252b1dbd027218c7966b15d0f9faff7>`__) method when applying them to motors to compensate for "voltage sag" from the battery.

What might a more complete example of combined feedforward/PID control look like?  Consider the :ref:`drive example <docs/software/advanced-control/feedforward:Using Feedforward to Control Mechanisms>` from the feedforward page.  We can easily modify this to include feedback control (with a ``SimpleMotorFeedforward`` component):

.. tabs::

  .. code-tab:: java

    public void tankDriveWithFeedforward(double leftVelocity, double rightVelocity) {
      leftMotor.setVoltage(feedforward.calculate(leftVelocity)
          + leftPID.calculate(leftEncoder.getRate(), leftVelocity);
      rightMotor.setVoltage(feedForward.calculate(rightVelocity)
          + rightPID.calculate(rightEncoder.getRate(), rightVelocity);
    }

  .. code-tab:: c++

    void TankDriveWithFeedforward(units::meters_per_second_t leftVelocity,
                                  units::meters_per_second_t rightVelocity) {
      leftMotor.SetVoltage(feedforward.Calculate(leftVelocity)
          + leftPID.Calculate(leftEncoder.getRate(), leftVelocity.to<double>());
      rightMotor.SetVoltage(feedforward.Calculate(rightVelocity)
          + rightPID.Calculate(rightEncoder.getRate(), rightVelocity.to<double>());
    }

Other mechanism types can be handled similarly.
