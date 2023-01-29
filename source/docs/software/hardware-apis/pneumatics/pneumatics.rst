.. include:: <isonum.txt>

Operating pneumatic cylinders
=============================

Using the FRC Control System to control Pneumatics
--------------------------------------------------

There are two options for operating solenoids to control pneumatic cylinders, the CTRE Pneumatics Control Module and the REV Robotics Pneumatics Hub.

.. image:: /docs/controls-overviews/images/control-system-hardware/pneumatics-control-module.png
    :alt: The Pneumatics Control Module (PCM)
    :width: 400

The CTRE Pneumatics Control Module (PCM) is a CAN-based device that provides control over the compressor and up to 8 solenoids per module.

.. image:: /docs/controls-overviews/images/control-system-hardware/pneumatic-hub.png
    :alt: The Pneumatic Hub (PH)
    :width: 400

The REV Pneumatic Hub (PH) is a CAN-based device that provides control over the compressor and up to 16 solenoids per module.

These devices are integrated into WPILib through a series of classes that make them simple to use. The closed loop control of the Compressor and Pressure switch is handled by the PCM hardware and the Solenoids are handled by the ``Solenoid`` class that controls the solenoid channels.
These modules are responsible for regulating the robot's pressure using a pressure switch and a compressor and switching solenoids on and off. They communicate with the roboRIO over CAN. For more information, see :doc:`/docs/controls-overviews/control-system-hardware`

Module Numbers
--------------

CAN Devices are identified by their Node ID. The default Node ID for PCMs is 0. The default Node ID for PHs is 1. If using a single module on the bus it is recommended to leave it at the default Node ID. Additional modules can be used where the modules corresponding solenoids are differentiated by the module number in the constructors of the ``Solenoid`` and ``Compressor`` classes.


Generating and Storing Pressure
-------------------------------

Pressure is created using a pneumatic compressor and stored in pneumatic tanks. The compressor must be on the robot and powered by the robot's pneumatics module. The "Closed Loop" mode on the Compressor is enabled by default, and it is *not* recommended that teams change this setting. When closed loop control is enabled the pneumatic module will automatically turn the compressor on when the digital pressure switch is closed (below the pressure threshold) and turn it off when the pressure switch is open (~120PSI). When closed loop control is disabled the compressor will not be turned on. Using the ``Compressor`` (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/Compressor.html>`__ / `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_compressor.html>`__) class, users can query the status of the compressor. The state (currently on or off), pressure switch state, and compressor current can all be queried from the Compressor object, as shown by the following code from the Solenoid example project (`Java <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid>`__, `C++ <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibcExamples/src/main/cpp/examples/Solenoid>`__):

.. note:: The Compressor object is only needed if you want the ability to turn off the compressor, change the pressure sensor (PH only), or query compressor status.

.. tabs::

    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 48-49
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 138-139, 143-144, 147-151, 154-160
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 82-85, 96-97, 135-136

    .. group-tab:: C++ (Header)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
          :language: c++
          :lines: 55-56

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 75-76, 80-82, 85-90, 93-100
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 19-23, 31-33, 72-73


The Pneumatic Hub also has methods for enabling compressor control using the REV Analog Pressure Sensor (``enableAnalog`` method).

Solenoid Control
----------------

FRC teams can use a :term:`solenoid valve` as part of performing a variety of tasks, including shifting gearboxes and moving robot mechanisms. A solenoid valve is used to electronically switch a pressurized air line "on" or "off". Solenoids are controlled by a robot's Pneumatics Control Module, or Pneumatic Hub, which is in turn connected to the robot's roboRIO via CAN. The easiest way to see a solenoid's state is via the LEDs on the PCM or PH (which indicates if the valve is "on" or not). When un-powered, solenoids can be manually actuated with the small button on the valve body.

Single acting solenoids apply or vent pressure from a single output port. They are typically used either when an external force will provide the return action of the cylinder (spring, gravity, separate mechanism) or in pairs to act as a double solenoid. A double solenoid switches air flow between two output ports (many also have a center position where neither output is vented or connected to the input). Double solenoid valves are commonly used when you wish to control both the extend and retract actions of a cylinder using air pressure. Double solenoid valves have two electrical inputs which connect back to two separate channels on the solenoid breakout.

Single Solenoids in WPILib
--------------------------

Single solenoids in WPILib are controlled using the ``Solenoid`` class (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/Solenoid.html>`__ / `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_solenoid.html>`__). To construct a Solenoid object, simply pass the desired port number (assumes default CAN ID) and pneumatics module type or CAN ID, pneumatics module type, and port number to the constructor. To set the value of the solenoid call set(true) to enable or set(false) to disable the solenoid output.

.. tabs::

    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 39-41
          :linenos:
          :lineno-start: 38
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 116-121
          :linenos:
          :lineno-start: 112

    .. group-tab:: C++ (Header)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
          :language: c++
          :lines: 45-48
          :linenos:
          :lineno-start: 45

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 52-57
          :linenos:
          :lineno-start: 52


Double Solenoids in WPILib
--------------------------

Double solenoids are controlled by the ``DoubleSolenoid`` class in WPILib (`Java <https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/DoubleSolenoid.html>`__ / `C++ <https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_double_solenoid.html>`__). These are constructed similarly to the single solenoid but there are now two port numbers to pass to the constructor, a forward channel (first) and a reverse channel (second). The state of the valve can then be set to `kOff` (neither output activated), `kForward` (forward channel enabled) or `kReverse` (reverse channel enabled). Additionally, the CAN ID can be passed to the DoubleSolenoid if teams have a non-standard CAN ID.

.. tabs::

    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 7-11
          :linenos:
          :lineno-start: 7
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 43-46
          :linenos:
          :lineno-start: 43
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 128-128, 130-130
          :linenos:
          :lineno-start: 128

    .. group-tab:: C++ (Header)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
          :language: c++
          :lines: 50-53
          :linenos:
          :lineno-start: 50

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 64-64, 66-66
          :linenos:
          :lineno-start: 64

Toggling Solenoids
------------------

Solenoids can be switched from one output to the other (known as toggling) by using the `.toggle()` method.

.. note::
   Since a DoubleSolenoid defaults to off, you will have to set it before it can be toggled.

.. tabs::

   .. code-tab:: java

      Solenoid exampleSingle = new Solenoid(PneumaticsModuleType.CTREPCM, 0);
      DoubleSolenoid exampleDouble = new DoubleSolenoid(PneumaticsModuleType.CTREPCM, 1, 2);

      // Initialize the DoubleSolenoid so it knows where to start.  Not required for single solenoids.
      exampleDouble.set(kReverse);

      if (m_controller.getYButtonPressed()) {
         exampleSingle.toggle();
         exampleDouble.toggle();
      }

   .. code-tab:: c++

      frc::Solenoid exampleSingle{frc::PneumaticsModuleType::CTREPCM, 0};
      frc::DoubleSolenoid exampleDouble{frc::PneumaticsModuleType::CTREPCM, 1, 2};

      // Initialize the DoubleSolenoid so it knows where to start.  Not required for single solenoids.
      exampleDouble.Set(frc::DoubleSolenoid::Value::kReverse);

      if (m_controller.GetYButtonPressed()) {
         exampleSingle.Toggle();
         exampleDouble.Toggle();
      }

Pressure Transducers
--------------------

A pressure transducer is a sensor where analog voltage is proportial to the measured pressure.

Pneumatic Hub
^^^^^^^^^^^^^

The Pneumatic Hub has analog inputs that may be used to read a pressure transducer using the Compressor class.


.. tabs::
    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 48-49
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 82-85

    .. group-tab:: C++ (Header)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
          :language: c++
          :lines: 55-56

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 19-23

roboRIO
^^^^^^^

A pressure transducer can be connected to the Analog Input ports on the roboRIO, and can be read by the ``AnalogInput`` or ``AnalogPotentiometer`` classes in WPILib.

.. tabs::

    .. group-tab:: Java
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 51-59
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/solenoid/Robot.java
          :language: java
          :lines: 90-91

    .. group-tab:: C++ (Header)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/include/Robot.h
          :language: c++
          :lines: 58-66

    .. group-tab:: C++ (Source)
       .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ed7efedd3edce0636b87c22592363a3923cf898e/wpilibcExamples/src/main/cpp/examples/Solenoid/cpp/Robot.cpp
          :language: c++
          :lines: 26-28
