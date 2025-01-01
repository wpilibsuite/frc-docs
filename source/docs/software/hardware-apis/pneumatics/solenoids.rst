.. include:: <isonum.txt>

# Operating Pneumatic Cylinders

FRC teams can use a :term:`solenoid valve` as part of performing a variety of tasks, including shifting gearboxes and moving robot mechanisms. A solenoid valve is used to electronically switch a pressurized air line "on" or "off". Solenoids are controlled by a robot's Pneumatics Control Module, or Pneumatic Hub, which is in turn connected to the robot's roboRIO via :term:`CAN`. The easiest way to see a solenoid's state is via the LEDs on the PCM or PH (which indicates if the valve is "on" or not). When un-powered, solenoids can be manually actuated with the small button on the valve body.

Single acting solenoids apply or vent pressure from a single output port. They are typically used either when an external force will provide the return action of the cylinder (spring, gravity, separate mechanism) or in pairs to act as a double solenoid. A double solenoid switches air flow between two output ports (many also have a center position where neither output is vented or connected to the input). Double solenoid valves are commonly used when you wish to control both the extend and retract actions of a cylinder using air pressure. Double solenoid valves have two electrical inputs which connect back to two separate channels on the solenoid breakout.

## Single Solenoids in WPILib

Single solenoids in WPILib are controlled using the ``Solenoid`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/Solenoid.html) / [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_solenoid.html)). To construct a Solenoid object, simply pass the desired port number (assumes default CAN ID) and pneumatics module type or CAN ID, pneumatics module type, and port number to the constructor. To set the value of the solenoid call ``set(true)`` to enable or ``set(false)`` to disable the solenoid output.

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 30-32
          :lineno-match:
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 88-93
          :lineno-match:

    .. tab-item:: C++ (Header)
       :sync: C++ (Header)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
          :language: c++
          :lines: 44-47
          :lineno-match:

    .. tab-item:: C++ (Source)
       :sync: C++ (Source)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 42-47
          :lineno-match:


## Double Solenoids in WPILib

Double solenoids are controlled by the ``DoubleSolenoid`` class in WPILib ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/DoubleSolenoid.html) / [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_double_solenoid.html)). These are constructed similarly to the single solenoid but there are now two port numbers to pass to the constructor, a forward channel (first) and a reverse channel (second). The state of the valve can then be set to ``kOff`` (neither output activated), ``kForward`` (forward channel enabled) or ``kReverse`` (reverse channel enabled). Additionally, the CAN ID can be passed to the DoubleSolenoid if teams have a non-default CAN ID.

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 34-37
          :lineno-match:
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 100, 102
          :linenos:
          :lineno-start: 100

    .. tab-item:: C++ (Header)
       :sync: C++ (Header)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
          :language: c++
          :lines: 49-52
          :lineno-match:

    .. tab-item:: C++ (Source)
       :sync: C++ (Source)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 54, 56
          :linenos:
          :lineno-start: 54

## Toggling Solenoids

Solenoids can be switched from one output to the other (known as toggling) by using the ``.toggle()`` method.

.. note::
   Since a DoubleSolenoid defaults to off, you will have to set it before it can be toggled.

.. tab-set-code::

   ```java
   Solenoid exampleSingle = new Solenoid(PneumaticsModuleType.CTREPCM, 0);
   DoubleSolenoid exampleDouble = new DoubleSolenoid(PneumaticsModuleType.CTREPCM, 1, 2);
   // Initialize the DoubleSolenoid so it knows where to start.  Not required for single solenoids.
   exampleDouble.set(kReverse);
   if (m_controller.getYButtonPressed()) {
      exampleSingle.toggle();
      exampleDouble.toggle();
   }
   ```

   ```c++
   frc::Solenoid exampleSingle{frc::PneumaticsModuleType::CTREPCM, 0};
   frc::DoubleSolenoid exampleDouble{frc::PneumaticsModuleType::CTREPCM, 1, 2};
   // Initialize the DoubleSolenoid so it knows where to start.  Not required for single solenoids.
   exampleDouble.Set(frc::DoubleSolenoid::Value::kReverse);
   if (m_controller.GetYButtonPressed()) {
      exampleSingle.Toggle();
      exampleDouble.Toggle();
   }
   ```

