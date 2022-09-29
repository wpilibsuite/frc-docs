Programming Limit Switches
==========================

Limit switches are often used to control mechanisms on robots. While limit switches are simple to use, they only can sense a single position of a moving part. This makes them ideal for ensuring that movement doesn't exceed some limit but not so good at controlling the speed of the movement as it approaches the limit. For example, a rotational shoulder joint on a robot arm would best be controlled using a potentiometer or an absolute encoder. A limit switch could make sure that if the potentiometer ever failed, the limit switch would stop the robot from going too far and causing damage.

Limit switches can have "normally open" or "normally closed" outputs.  This will control if a high signal means the switch is opened or closed.  To learn more about limit switch hardware see this :ref:`article <docs/hardware/sensors/proximity-switches:Mechanical Proximity Switches ("limit switches")>`.

Controlling a Motor with Two Limit Switches
-------------------------------------------

.. tabs::

   .. code-tab:: java

     DigitalInput toplimitSwitch = new DigitalInput(0);
     DigitalInput bottomlimitSwitch = new DigitalInput(1);
     PWMVictorSPX motor = new PWMVictorSPX(0);
     Joystick joystick = new Joystick(0);

     @Override
     public void teleopPeriodic() {
         setMotorSpeed(joystick.getRawAxis(2));
     }

     public void setMotorSpeed(double speed) {
         if (speed > 0) {
             if (toplimitSwitch.get()) {
                 // We are going up and top limit is tripped so stop
                 motor.set(0);
             } else {
                 // We are going up but top limit is not tripped so go at commanded speed
                 motor.set(speed);
             }
         } else {
             if (bottomlimitSwitch.get()) {
                 // We are going down and bottom limit is tripped so stop
                 motor.set(0);
             } else {
                 // We are going down but bottom limit is not tripped so go at commanded speed
                 motor.set(speed);
             }
         }
     }

   .. code-tab:: cpp

     frc::DigitalInput toplimitSwitch {0};
     frc::DigitalInput bottomlimitSwitch {1};
     frc::PWMVictorSPX motor {0};
     frc::Joystick joystick {0};

     void TeleopPeriodic() {
         SetMotorSpeed(joystick.GetRawAxis(2));
     }

     void SetMotorSpeed(double speed) {
         if (speed > 0) {
             if (toplimitSwitch.Get()) {
                 // We are going up and top limit is tripped so stop
                 motor.Set(0);
             } else {
                 // We are going up but top limit is not tripped so go at commanded speed
                 motor.Set(speed);
             }
         } else {
             if (bottomlimitSwitch.Get()) {
                 // We are going down and bottom limit is tripped so stop
                 motor.Set(0);
             } else {
                 // We are going down but bottom limit is not tripped so go at commanded speed
                 motor.Set(speed);
             }
         }
     }
