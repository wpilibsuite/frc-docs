# Operating pneumatic cylinders

## Solenoid control
FRC teams use solenoids to preform a variety of tasks, from shifting gearboxes to operating robot mechanisms. A solenoid is a valve used to electronically switch a pressurised air line "on" or "off". For more information on solenoids, see [this wikipedia article](https://en.wikipedia.org/wiki/Solenoid_valve). Solenoids are controlled by a robot's Pneumatics Control Module, or PCM, which is in turn connected to the robot's RoboRIO via CAN. The easiest way to see a solenoid's state is via the small red LED (which indicates if the valve is "on" or not), and solenoids can be manually actuated when un-powered with the small button adjacent to the LED. 

Single acting solenoids apply or vent pressure from a single output port. They are typically used either when an external force will provide the return action of the cylinder (spring, gravity, separate mechanism) or in pairs to act as a double solenoid. A double solenoid switches air flow between two output ports (many also have a center position where neither output is vented or connected to the input). Double solenoid valves are commonly used when you wish to control both the extend and retract actions of a cylinder using air pressure. Double solenoid valves have two electrical inputs which connect back to two separate channels on the solenoid breakout.

PCM Modules are identified by their CAN Device ID. The default CAN ID for PCMs is 0. If using a single PCM on the bus it is recommended to leave it at the default CAN ID. This ID can be changed with the Phoenix Tuner application, in addition to other debug information. (TODO Link Phoenix tuner atricle) TODO FIX THIS LINK: For more information about setting PCM Node IDs see Updating and Configuring Pneumatics Control Module and Power Distribution Panel.

## Single Solenoids in WPILib 
### Using a single acting solenoid


Single solenoids in WPILib are controlled using the Solenoid class. To construct a Solenoid object, simply pass the desired port number (assumes Node ID 0) or Node ID and port number to the constructor. To set the value of the solenoid call set(true) to enable or set(false) to disable the solenoid output.

C++

```
frc::Solenoid exampleSolenoid {1};

exampleSolenoid.Set(true);
exampleSolenoid.Set(false);
```


Java

```
Solenoid exampleSolenoid = new Solenoid(1);

exampleSolenoid.set(true);
exampleSolenoid.set(false);
```



### Double Solenoids in WPILib

Double solenoids are controlled by the DoubleSolenoid class in WPILib. These are constructed similarly to the single solenoid but there are now two port numbers to pass to the constructor, a forward channel (first) and a reverse channel (second). The state of the valve can then be set to kOff (neither output activated), kForward (forward channel enabled) or kReverse (reverse channel enabled). Additionally, the PCM CAN ID can be passed to the DoubleSolenoid if teams have a non-standard PCM CAN ID

C++
```
frc::DoubleSolenoid exampleDouble {1, 2};
frc::DoubleSolenoid exampleDouble {/* The PCM CAN ID */ 9, 1, 2};

exampleDouble.Set(frc::DoubleSolenoid::Value::kOff);
exampleDouble.Set(frc::DoubleSolenoid::Value::kForward);
exampleDouble.Set(frc::DoubleSolenoid::Value::kReverse);
```

Java
```
import static edu.wpi.first.wpilibj.DoubleSolenoid.Value.*;

DoubleSolenoid exampleDouble = new DoubleSolenoid(1, 2);
DoubleSolenoid anotherDoubleSolenoid = new DoubleSolenoid(/* The PCM CAN ID */ 9, 4, 5);


exampleDouble.set(kOff);
exampleDouble.set(kForward);
exampleDouble.set(kReverse);
```

