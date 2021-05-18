Displaying Expressions from a Robot Program
===========================================

.. note:: Often debugging or monitoring the status of a robot involves writing a number of values to the console and watching them stream by. With SmartDashboard you can put values to a GUI that is automatically constructed based on your program. As values are updated, the corresponding GUI element changes value - there is no need to try to catch numbers streaming by on the screen.

Writing Values to SmartDashboard
------------------------------------

.. tabs::

    .. code-tab:: java

        protected void execute() {
          SmartDashboard.putBoolean("Bridge Limit", bridgeTipper.atBridge());
          SmartDashboard.putNumber("Bridge Angle", bridgeTipper.getPosition());
          SmartDashboard.putNumber("Swerve Angle", drivetrain.getSwerveAngle());
          SmartDashboard.putNumber("Left Drive Encoder", drivetrain.getLeftEncoder());
          SmartDashboard.putNumber("Right Drive Encoder", drivetrain.getRightEncoder());
          SmartDashboard.putNumber("Turret Pot", turret.getCurrentAngle());
          SmartDashboard.putNumber("Turret Pot Voltage", turret.getAverageVoltage());
          SmartDashboard.putNumber("RPM", shooter.getRPM());
        }

    .. code-tab:: cpp

        void Command::Execute() {
          frc::SmartDashboard::PutBoolean("Bridge Limit", BridgeTipper.AtBridge());
          frc::SmartDashboard::PutNumber("Bridge Angle", BridgeTipper.GetPosition());
          frc::SmartDashboard::PutNumber("Swerve Angle", Drivetrain.GetSwerveAngle());
          frc::SmartDashboard::PutNumber("Left Drive Encoder", Drivetrain.GetLeftEncoder());
          frc::SmartDashboard::PutNumber("Right Drive Encoder", Drivetrain.GetRightEncoder());
          frc::SmartDashboard::PutNumber("Turret Pot", Turret.GetCurrentAngle());
          frc::SmartDashboard::PutNumber("Turret Pot Voltage", Turret.GetAverageVoltage());
          frc::SmartDashboard::PutNumber("RPM", Shooter.GetRPM());
        }

You can write Boolean, Numeric, or String values to the SmartDashboard by simply calling the correct method for the type and including the name and the value of the data, no additional code is required. Any time in your program that you write another value with the same name, it appears in the same UI element on the screen on the driver station or development computer. As you can imagine this is a great way of debugging and getting status of your robot as it is operating.

Creating Widgets on SmartDashboard
----------------------------------

Widgets are populated on the SmartDashboard automatically, no user intervention is required. Note that the widgets are only populated when the value is first written, you may need to enable your robot in a particular mode or trigger a particular code routine for an item to appear. To alter the appearance of the widget, see the next two sections :doc:`Changing the Display Properties of a Value <changing-display-properties>` and :doc:`Changing the Display Widget Type for a Value <changing-display-widget-type>`.

Stale Data
----------
SmartDashboard uses :term:`NetworkTables` for communicating values between the robot and the driver station laptop. NetworkTables acts as a distributed table of name and value pairs. If a name/value pair is added to either the client (laptop) or server (robot) it is replicated to the other. If a name/value pair is deleted from, say, the robot but the SmartDashboard or OutlineViewer are still running, then when the robot is restarted, the old values will still appear in the SmartDashboard and OutlineViewer because they never stopped running and continue to have those values in their tables. When the robot restarts, those old values will be replicated to the robot.

To ensure that the SmartDashboard and OutlineViewer are showing current values, it is necessary to restart the NetworkTables clients and robot at the same time. That way, old values that one is holding won't get replicated to the others.

This usually isn't a problem if the program isn't constantly changing, but if the program is in development and the set of keys being added to NetworkTables is constantly changing, then it might be necessary to do the restart of everything to accurately see what is current.
