# Programming Limit Switches

Limit switches are often used to control mechanisms on robots. While limit switches are simple to use, they only can sense a single position of a moving part. This makes them ideal for ensuring that movement doesn't exceed some limit but not so good at controlling the speed of the movement as it approaches the limit. For example, a rotational shoulder joint on a robot arm would best be controlled using a potentiometer or an absolute encoder. A limit switch could make sure that if the potentiometer ever failed, the limit switch would stop the robot from going too far and causing damage.

Limit switches can have "normally open" or "normally closed" outputs.  This will control if a high signal means the switch is opened or closed.  To learn more about limit switch hardware see this :ref:`article <docs/hardware/sensors/proximity-switches:Mechanical Proximity Switches ("limit switches")>`.

## Controlling a Motor with Two Limit Switches

.. tab-set-code::

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/snippets/limitswitch/Robot.java
      :language: java
      :lines: 17-50

   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/snippets/LimitSwitch/cpp/Robot.cpp
      :language: c++
      :lines: 40-43, 17-37

