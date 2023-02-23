Generating and Storing Pressure
===============================

Pressure is created using a pneumatic compressor and stored in pneumatic tanks. The compressor must be on the robot and powered by the robot's pneumatics module. The "Closed Loop" mode on the Compressor is enabled by default, and it is *not* recommended that teams change this setting. When closed loop control is enabled the pneumatic module will automatically turn the compressor on when the digital pressure switch is closed (below the pressure threshold) and turn it off when the pressure switch is open (~120PSI). When closed loop control is disabled the compressor will not be turned on. Using the ``Compressor`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/Compressor.html>`__ / `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_compressor.html>`__) class, users can query the status of the compressor. The state (currently on or off), pressure switch state, and compressor current can all be queried from the Compressor object, as shown by the following code from the Solenoid example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/Solenoid>`__):

.. note:: The Compressor object is only needed if you want the ability to turn off the compressor, change the pressure sensor (PH only), or query compressor status.

Construct a ``Compressor`` object:

.. tabs::
    .. group-tab:: REV Pneumatic Hub (PH)
        .. tabs::
            .. group-tab:: Java
               .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
                  :language: java
                  :lines: 48-49
            .. group-tab:: C++ (Header)
               .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
                  :language: c++
                  :lines: 55-56
    .. group-tab:: CTRE Pneumatics Control Module (PCM)
        .. tabs::
            .. group-tab:: Java
               .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Pneumatics.java
                  :language: java
                  :lines: 23-24
            .. group-tab:: C++ (Header)
               .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/include/subsystems/Pneumatics.h
                  :language: c++
                  :lines: 42-43


Querying compressor current and state:

.. tabs::

    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 74-75, 80-81, 86-88

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 75-76, 80-82, 85-90, 93-100
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 19-23, 31-33, 72-73


Enable/disable digital closed-loop compressor control (enabled by default):

.. tabs::

    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Pneumatics.java
          :language: java
          :lines: 46-47, 50-53

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/cpp/subsystems/Pneumatics.cpp
          :language: c++
          :lines: 12-13, 16-19

The Pneumatic Hub also has methods for enabling compressor control using the REV Analog Pressure Sensor:

.. tabs::

    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 126-130, 133-139

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 75-76, 80-82, 85-90, 93-100
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 19-23, 31-33, 72-73


Pressure Transducers
--------------------

A pressure transducer is a sensor where analog voltage is proportial to the measured pressure.

Pneumatic Hub
^^^^^^^^^^^^^

The Pneumatic Hub has analog inputs that may be used to read a pressure transducer using the Compressor class.

.. tabs::
    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 48-49
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 82-85

    .. group-tab:: C++ (Header)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
          :language: c++
          :lines: 55-56

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 19-23

roboRIO
^^^^^^^

A pressure transducer can be connected to the Analog Input ports on the roboRIO, and can be read by the ``AnalogInput`` or ``AnalogPotentiometer`` classes in WPILib.

.. tabs::

    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Pneumatics.java
          :language: java
          :lines: 13-21
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/subsystems/Pneumatics.java
          :language: java
          :lines: 31-32

    .. group-tab:: C++ (Header)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/include/subsystems/Pneumatics.h
          :language: c++
          :lines: 31-40

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/573403cc900b744a00aa2f15965db3f6c9f2c919/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/cpp/subsystems/Pneumatics.cpp
          :language: c++
          :lines: 24-26
