Using PIDSubsystem to Control Actuators
=======================================

.. important:: RobotBuilder has been updated to support the new commandbased framework! Unfortunately, this documentation is outdated and only for the old commandbased framework. Individuals interested in updating this documentation can open a pull request on the `frc-docs <https://github.com/wpilibsuite/frc-docs>`__ repository.

More advanced subsystems will use sensors for feedback to get guaranteed results for operations like setting elevator heights or wrist angles. The PIDSubsystem has a built-in PIDController to automatically set the correct setpoints for these types of mechanisms.

Create a PIDSubsystem
---------------------

.. image:: images/pidsubsystem-actuators-1.png

Creating a subsystem that uses feedback to control the position or speed of a mechanism is very easy.

1. Drag a PIDSubsystem from the palette to the Subsystems folder in the robot description
2. Rename the PID Subsystem to a more meaningful name for the subsystem

Notice that some of the parts of the robot description have turned red. This indicates that these components (the PIDSubsystem) haven't been completed and need to be filled in. The properties that are either missing or incorrect are shown in red.

Adding Sensors and Actuators to the PIDSubsystem
------------------------------------------------

.. image:: images/pidsubsystem-actuators-2.png

Add the missing components for the PIDSubsystem

1. Drag in the actuator (a motor controller) to the particular subsystem - in this case the Elevator
2. Drag the sensor that will be used for feedback to the subsystem, in this case the sensor is a potentiometer that might give elevator height feedback.

Fill in the PIDSubsystem Parameters
-----------------------------------

.. image:: images/pidsubsystem-actuators-3.png

There a number of parameters for the PIDSubsystem but only a few need to be filled in for most cases

1. The Input and Output components will have been filled in automatically from the previous step when the actuator and sensor were dragged into the PIDSubsystem
2. The P, I, and D values need to be filled in to get the desired sensitivity and stability of the component

See :doc:`Writing the Code for a PIDSubsystem <../writing-code/robotbuilder-writing-pidsubsystem-code>`
