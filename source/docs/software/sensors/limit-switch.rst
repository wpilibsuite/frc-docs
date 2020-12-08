Programming Limit Switches
==========================

Limit switches are often used to control mechanisms on robots. While limit switches are simple to use, they only can sense a single position of a moving part. This makes them ideal for ensuring that movement doesn't exceed some limit but not so good at controlling the speed of the movement as it approaches the limit. For example, a rotational shoulder joint on a robot arm would best be controlled using a potentiometer or an absolute encoder, the limit switch could make sure that if the potentiometer ever failed, the limit switch would stop the robot from going to far and causing damage.

Values Provided
---------------

.. image:: images/using-limit-switches/image1.png

Limit switches can have "normally opened" or "normally closed" outputs. Normally open means that the switch will report low (0 value) until the switch is closed and then it will output high (1 value).  Normally closed works in the opposite way (high until closed then low).  The usual way of wiring the switch is between a digital input signal connection and ground. The digital input has pull-up resistors that will make the input be high (1 value) when the switch is open, but when the switch closes the value goes to 0 since the input is now connected to ground. The switch shown here has both normally open and normally closed outputs.  To learn more about limit switch hardware see this :ref:`article <docs/hardware/sensors/proximity-switches:Mechanical Proximity Switches ("limit switches")>`.

Controlling a Motor with Two Limit Switches
-------------------------------------------

.. tabs::

   .. code-tab:: java

     public void robotInit() {
          var toplimitSwitch = new DigitalInput(0);
          var bottomlimitSwitch = new DigitalInput(1);
          var motor = new PWMSpeedController​(0);
     }

     public void teleopPeriodic() {
          public void setMotorSpeed(double speed)) {
               if (speed > 0) {
                    if (toplimitSwitch.get()){
                         // We are going up and top limit is tripped so stop
                         motor.set(0);
                    }
                    else {
                         // We are going up but top limit is not tripped so go at commanded speed
                         motor.set(speed);
                    }
               }
               else {
                    if (bottomlimitSwitch.get()){
                         // We are going down and bottom limit is tripped so stop
                         motor.set(0);
                    }
                    else {
                         // We are going down but bottom limit is not tripped so go at commanded speed
                         motor.set(speed);
                    }
               }
          }
     }

   .. code-tab:: cpp

     // HELP PLZ
