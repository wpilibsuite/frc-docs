# Writing the Code for a Subsystem

Adding code to create an actual working subsystem is very straightforward. For simple subsystems that don't use feedback it turns out to be extremely simple. In this section we will look at an example of a `Claw` subsystem. The `Claw` subsystem also has a limit switch to determine if an object is in the grip.

## RobotBuilder Representation of the Claw Subsystem

.. image:: images/writing-subsystem-code-1.png

The claw at the end of a robot arm is a subsystem operated by a single VictorSPX Motor Controller. There are three things we want the motor to do, start opening, start closing, and stop moving. This is the responsibility of the subsystem. The timing for opening and closing will be handled by a command later in this tutorial. We will also define a method to get if the claw is gripping an object.

## Adding Subsystem Capabilities

.. tab-set::

   .. tab-item:: Java
      :sync: java

      .. literalinclude:: ../resources/RBGearsBot2025Java/src/main/java/frc/robot/subsystems/Claw.java
         :language: Java
         :lines: 11-
         :emphasize-lines: 63-77
         :lineno-match:

   .. tab-item:: C++
      :sync: c++

      .. literalinclude:: ../resources/RBGearsBot2025CPP/src/main/cpp/subsystems/Claw.cpp
         :language: C++
         :lines: 11-
         :emphasize-lines: 42-56
         :lineno-match:



Add methods to the ``claw.java`` or ``claw.cpp`` that will open, close, and stop the claw from moving and get the claw limit switch. Those will be used by commands that actually operate the claw.

Notice that member variable called ``motor`` and ``limitswitch`` are created by RobotBuilder so it can be used throughout the subsystem. Each of your dragged-in palette items will have a member variable with the name given in RobotBuilder.

## Adding the Method Declarations to the Header File (C++ Only)

.. tab-set::

   .. tab-item:: C++
      :sync: c++

      .. literalinclude:: ../resources/RBGearsBot2025CPP/src/main/include/subsystems/Claw.h
         :language: C++
         :lines: 11-
         :emphasize-lines: 30-33
         :lineno-match:

In addition to adding the methods to the class implementation file, ``Claw.cpp``, the declarations for the methods need to be added to the header file, ``Claw.h``. Those declarations that must be added are shown here.

To add the behavior to the claw subsystem to handle opening and closing you need to :doc:`define commands <../introduction/robotbuilder-creating-command>`.
