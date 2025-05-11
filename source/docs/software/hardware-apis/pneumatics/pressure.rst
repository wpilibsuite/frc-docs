# Generating and Storing Pressure

Pressure is created using a pneumatic compressor and stored in pneumatic tanks. The compressor must be on the robot and powered by the robot's pneumatics module. The "Closed Loop" mode on the Compressor is enabled by default, and it is *not* recommended that teams change this setting. When closed loop control is enabled the pneumatic module will automatically turn the compressor on when the digital pressure switch is closed (below the pressure threshold) and turn it off when the pressure switch is open (~120PSI). When closed loop control is disabled the compressor will not be turned on. Using the ``Compressor`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/Compressor.html) / [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_compressor.html)) class, users can query the status of the compressor. The state (currently on or off), pressure switch state, and compressor current can all be queried from the Compressor object, as shown by the following code from the Solenoid example project ([Java](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid), [C++](https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/Solenoid)):

.. note:: The Compressor object is only needed if you want the ability to turn off the compressor, change the pressure sensor (PH only), or query compressor status.

Construct a ``Compressor`` object:

.. tab-set::
    .. tab-item:: REV Pneumatic Hub (PH)

        .. tab-set::
            .. tab-item:: Java
               :sync: Java

               .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
                  :language: java
                  :lines: 39-40

            .. tab-item:: C++ (Header)
               :sync: C++ (Header)

               .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
                  :language: c++
                  :lines: 54-55
    .. tab-item:: CTRE Pneumatics Control Module (PCM)

        .. tab-set::
           .. tab-item:: Java
               :sync: Java

               .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Pneumatics.java
                  :language: java
                  :lines: 26-27

           .. tab-item:: C++ (Header)
              :sync: C++ (Header)

              .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/include/subsystems/Pneumatics.h
                 :language: c++
                 :lines: 41-42


Querying compressor current and state:

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 67-68, 73-74, 79-81

    .. tab-item:: C++ (Source)
       :sync: C++ (Source)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 26-28, 31-32, 35-37


Enable/disable digital closed-loop compressor control (enabled by default):

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Pneumatics.java
          :language: java
          :lines: 54-55, 58-61

    .. tab-item:: C++ (Source)
       :sync: C++ (Source)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/cpp/subsystems/Pneumatics.cpp
          :language: c++
          :lines: 12-13, 16-19

The Pneumatic Hub also has methods for enabling compressor control using the REV Analog Pressure Sensor:

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 120-124, 127-133

    .. tab-item:: C++ (Source)
       :sync: C++ (Source)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 76-81, 84-90


## Pressure Transducers

A pressure transducer is a sensor where analog voltage is proportial to the measured pressure.

### Pneumatic Hub

The Pneumatic Hub has analog inputs that may be used to read a pressure transducer using the Compressor class.

.. tab-set::
    .. tab-item:: Java
       :sync: Java

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 39-40
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-3/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 59-62

    .. tab-item:: C++ (Header)
       :sync: C++ (Header)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
          :language: c++
          :lines: 54-55

    .. tab-item:: C++ (Source)
       :sync: C++ (Source)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 19-23

### roboRIO

A pressure transducer can be connected to the Analog Input ports on the roboRIO, and can be read by the ``AnalogInput`` or ``AnalogPotentiometer`` classes in WPILib.

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Pneumatics.java
          :language: java
          :lines: 16-24
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Pneumatics.java
          :language: java
          :lines: 40-41

    .. tab-item:: C++ (Header)
       :sync: C++ (Header)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/include/subsystems/Pneumatics.h
          :language: c++
          :lines: 31-40

    .. tab-item:: C++ (Source)
       :sync: C++ (Source)

       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.1.1-beta-4/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/cpp/subsystems/Pneumatics.cpp
          :language: c++
          :lines: 24-26
