# Writing the Code for a Command

Subsystem classes get the mechanisms on your robot moving, but to get it to stop at the right time and sequence through more complex operations you write Commands. Previously in :doc:`writing the code for a subsystem <robotbuilder-writing-subsystem-code>` we developed the code for the `Claw` subsystem on a robot to start the claw opening, closing, or to stop moving. Now we will write the code for a command that will actually run the claw motor for the right time to get the claw to open and close. Our claw example is a very simple mechanism where we run the motor for 1 second to open it or until the limit switch is tripped to close it.

## Close Claw Command in RobotBuilder

.. image:: images/writing-command-code-1.png

This is the definition of the `CloseClaw` command in RobotBuilder. Notice that it requires the `Claw` subsystem. This is explained in the next step.

## Generated CloseClaw Class

.. tab-set::

   .. tab-item:: Java
      :sync: java

      .. literalinclude:: ../resources/RBGearsBot2025Java/src/main/java/frc/robot/commands/CloseClaw.java
         :language: Java
         :lines: 11-
         :emphasize-lines: 43, 54, 60
         :lineno-match:

   .. tab-item:: C++
      :sync: c++

      .. literalinclude:: ../resources/RBGearsBot2025CPP/src/main/cpp/commands/CloseClaw.cpp
         :language: C++
         :lines: 11-
         :emphasize-lines: 21, 31, 36
         :lineno-match:

RobotBuilder will generate the class files for the `CloseClaw` command. The command represents the behavior of the claw, that is the operation over time. To operate this very simple claw mechanism the motor needs to operate in the close direction,. The `Claw` subsystem has methods to start the motor running in the right direction and to stop it. The commands responsibility is to run the motor for the correct time. The lines of code that are shown in the boxes are added to add this behavior.

1. Start the claw motor moving in the closing direction by calling the ``Close()`` method that was added to the `Claw` subsystem in the `CloseClaw` Initialize method.
2. This command is finished when the limit switch in the `Claw` subsystem is tripped.
3. The ``End()`` method is called when the command is finished and is a place to clean up. In this case, the motor is stopped since the time has run out.
