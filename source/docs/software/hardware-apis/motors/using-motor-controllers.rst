# Using Motor Controllers in Code

Motor controllers come in two main flavors: :term:`CAN` and :term:`PWM`. A CAN controller can send more detailed status information back to the roboRIO, whereas a PWM controller can only be set to a value. For information on using these motors with the WPILib drivetrain classes, see :doc:`wpi-drive-classes`.

## Using PWM Motor Controllers

For a more detailed background on *how* PWM motor controllers work, see :doc:`pwm-controllers`. To use a PWM motor controller, simply use the appropriate motor controller class provided by WPILib and supply it the port the motor controller(s) are plugged into on the roboRIO.  All approved motor controllers have WPILib classes provided for them.

.. note:: The ``Spark`` and ``VictorSP`` classes are used here as an example; other PWM motor controller classes have exactly the same API.

.. important:: The ``set()`` method accepts values from **-1.0 to 1.0**, where:

   - **-1.0** = full speed reverse
   - **0.0** = stopped
   - **1.0** = full speed forward

### Where to Put This Code

**In Command-Based programs:**

Motor controllers should be declared as member variables in your subsystem class. Create them in the subsystem constructor, and use them in command methods.

.. tab-set-code::

   ```java
   public class IntakeSubsystem extends SubsystemBase {
     private final Spark m_motor = new Spark(0);

     public void runIntake() {
       m_motor.set(0.8);
     }

     public void stopIntake() {
       m_motor.set(0.0);
     }
   }
   ```

   ```c++
   class IntakeSubsystem : public frc2::SubsystemBase {
    public:
     IntakeSubsystem() : m_motor{0} {}

     void RunIntake() {
       m_motor.Set(0.8);
     }

     void StopIntake() {
       m_motor.Set(0.0);
     }

    private:
     frc::Spark m_motor;
   };
   ```

   ```python
   class IntakeSubsystem(commands2.SubsystemBase):
       def __init__(self):
           super().__init__()
           self.motor = wpilib.Spark(0)

       def run_intake(self):
           self.motor.set(0.8)

       def stop_intake(self):
           self.motor.set(0.0)
   ```

**In Timed Robot programs:**

Motor controllers should be declared as member variables in your ``Robot`` class. Create them in ``robotInit()``, and use them in periodic methods or autonomous/teleop methods.

.. tab-set-code::

   ```java
   public class Robot extends TimedRobot {
     private Spark m_intakeMotor;
     private Joystick m_joystick;

     @Override
     public void robotInit() {
       m_intakeMotor = new Spark(0);
       m_joystick = new Joystick(0);
     }

     @Override
     public void teleopPeriodic() {
       // Run intake when button is pressed
       if (m_joystick.getRawButton(1)) {
         m_intakeMotor.set(0.8);
       } else {
         m_intakeMotor.set(0.0);
       }
     }
   }
   ```

   ```c++
   class Robot : public frc::TimedRobot {
    public:
     Robot() : m_intakeMotor{0}, m_joystick{0} {}

     void TeleopPeriodic() override {
       // Run intake when button is pressed
       if (m_joystick.GetRawButton(1)) {
         m_intakeMotor.Set(0.8);
       } else {
         m_intakeMotor.Set(0.0);
       }
     }

    private:
     frc::Spark m_intakeMotor;
     frc::Joystick m_joystick;
   };
   ```

   ```python
   class MyRobot(wpilib.TimedRobot):
       def robotInit(self):
           self.intake_motor = wpilib.Spark(0)
           self.joystick = wpilib.Joystick(0)

       def teleopPeriodic(self):
           # Run intake when button is pressed
           if self.joystick.getRawButton(1):
               self.intake_motor.set(0.8)
           else:
               self.intake_motor.set(0.0)
   ```

### Common Use Cases

Motor controllers are used throughout the robot for many mechanisms:

- **Intakes**: Spin wheels to collect game pieces
- **Shooters**: Spin flywheels to launch game pieces
- **Conveyors**: Move game pieces through the robot
- **Arms/Elevators**: Raise and lower mechanisms (often with position control)
- **Climbers**: Extend or retract climbing mechanisms

For drivetrain usage, see :doc:`wpi-drive-classes`. For more complete examples, see :doc:`/docs/software/examples-tutorials/wpilib-examples`.

## CAN Motor Controllers

CAN motor controllers are available through vendors such as CTR Electronics (Talon FX), REV Robotics (SPARK MAX/FLEX), and others. See :doc:`/docs/software/can-devices/third-party-devices`, :doc:`/docs/software/vscode-overview/3rd-party-libraries`, and :doc:`/docs/software/examples-tutorials/third-party-examples` for more information.
