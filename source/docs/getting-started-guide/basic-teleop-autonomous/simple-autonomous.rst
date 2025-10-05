.. include:: <isonum.txt>

# Simple Autonomous Routine

Autonomous mode is the 15-second period at the start of each match where your robot operates without driver input. This page covers creating a simple autonomous routine.

## What is Autonomous Mode?

During autonomous:

- Robot runs pre-programmed commands
- No driver input is allowed
- Points are often awarded for completing tasks
- Runs for 15 seconds at match start

## Types of Simple Autonomous

### Time-Based Autonomous

The simplest autonomous routines use timers:

.. tab-set::
   .. tab-item:: Java

      .. code-block:: java

         package frc.robot.commands;

         import edu.wpi.first.wpilibj2.command.SequentialCommandGroup;
         import edu.wpi.first.wpilibj2.command.WaitCommand;
         import frc.robot.subsystems.DriveSubsystem;

         public class SimpleAuto extends SequentialCommandGroup {
           public SimpleAuto(DriveSubsystem drive) {
             addCommands(
               // Drive forward for 2 seconds
               new DriveCommand(drive, () -> 0.5, () -> 0.0)
                   .withTimeout(2.0),

               // Wait 0.5 seconds
               new WaitCommand(0.5),

               // Drive backward for 1 second
               new DriveCommand(drive, () -> -0.5, () -> 0.0)
                   .withTimeout(1.0)
             );
           }
         }

   .. tab-item:: C++

      .. code-block:: cpp

         #include "commands/SimpleAuto.h"

         SimpleAuto::SimpleAuto(DriveSubsystem* drive) {
           AddCommands(
             // Drive forward for 2 seconds
             DriveCommand(drive, [] { return 0.5; }, [] { return 0.0; })
                 .WithTimeout(2.0_s),

             // Wait 0.5 seconds
             frc2::WaitCommand(0.5_s),

             // Drive backward for 1 second
             DriveCommand(drive, [] { return -0.5; }, [] { return 0.0; })
                 .WithTimeout(1.0_s)
           );
         }

   .. tab-item:: Python

      .. code-block:: python

         from commands2 import SequentialCommandGroup, WaitCommand

         class SimpleAuto(SequentialCommandGroup):
             def __init__(self, drive):
                 super().__init__(
                     # Drive forward for 2 seconds
                     DriveCommand(drive, lambda: 0.5, lambda: 0.0)
                         .withTimeout(2.0),

                     # Wait 0.5 seconds
                     WaitCommand(0.5),

                     # Drive backward for 1 second
                     DriveCommand(drive, lambda: -0.5, lambda: 0.0)
                         .withTimeout(1.0)
                 )

### Distance-Based Autonomous

Using encoders for more accurate movement:

.. tab-set::
   .. tab-item:: Java

      .. code-block:: java

         public class DriveDistance extends Command {
           private final DriveSubsystem drive;
           private final double targetDistance;

           public DriveDistance(DriveSubsystem drive, double meters) {
             this.drive = drive;
             this.targetDistance = meters;
             addRequirements(drive);
           }

           @Override
           public void initialize() {
             drive.resetEncoders();
           }

           @Override
           public void execute() {
             drive.arcadeDrive(0.5, 0.0);
           }

           @Override
           public boolean isFinished() {
             return drive.getAverageDistance() >= targetDistance;
           }

           @Override
           public void end(boolean interrupted) {
             drive.stop();
           }
         }

   .. tab-item:: C++

      .. code-block:: cpp

         void DriveDistance::Initialize() {
           m_drive->ResetEncoders();
         }

         void DriveDistance::Execute() {
           m_drive->ArcadeDrive(0.5, 0.0);
         }

         bool DriveDistance::IsFinished() {
           return m_drive->GetAverageDistance() >= m_targetDistance;
         }

         void DriveDistance::End(bool interrupted) {
           m_drive->Stop();
         }

   .. tab-item:: Python

      .. code-block:: python

         def initialize(self):
             self.drive.resetEncoders()

         def execute(self):
             self.drive.arcadeDrive(0.5, 0.0)

         def isFinished(self) -> bool:
             return self.drive.getAverageDistance() >= self.targetDistance

         def end(self, interrupted: bool):
             self.drive.stop()

## Selecting Autonomous in Robot Code

In ``RobotContainer``, create a chooser for autonomous routines:

.. tab-set::
   .. tab-item:: Java

      .. code-block:: java

         private final SendableChooser<Command> autoChooser = new SendableChooser<>();

         public RobotContainer() {
           // Configure autonomous chooser
           autoChooser.setDefaultOption("Simple Auto", new SimpleAuto(driveSubsystem));
           autoChooser.addOption("Do Nothing", new WaitCommand(0));

           // Put chooser on dashboard
           SmartDashboard.putData("Auto Chooser", autoChooser);
         }

         public Command getAutonomousCommand() {
           return autoChooser.getSelected();
         }

   .. tab-item:: C++

      .. code-block:: cpp

         frc::SendableChooser<frc2::Command*> m_autoChooser;

         RobotContainer::RobotContainer() {
           m_autoChooser.SetDefaultOption("Simple Auto",
               new SimpleAuto(&m_driveSubsystem));
           m_autoChooser.AddOption("Do Nothing",
               new frc2::WaitCommand(0_s));

           frc::SmartDashboard::PutData("Auto Chooser", &m_autoChooser);
         }

         frc2::Command* RobotContainer::GetAutonomousCommand() {
           return m_autoChooser.GetSelected();
         }

   .. tab-item:: Python

      .. code-block:: python

         from wpilib import SendableChooser, SmartDashboard

         self.autoChooser = SendableChooser()
         self.autoChooser.setDefaultOption("Simple Auto",
             SimpleAuto(self.driveSubsystem))
         self.autoChooser.addOption("Do Nothing", WaitCommand(0))

         SmartDashboard.putData("Auto Chooser", self.autoChooser)

         def getAutonomousCommand(self):
             return self.autoChooser.getSelected()

## Testing Autonomous

1. **In Simulation**:
   - Run robot simulation
   - Enable autonomous mode
   - Observe robot behavior in simulator

2. **On Real Robot**:
   - Deploy code
   - Select autonomous routine in dashboard
   - Enable autonomous in Driver Station
   - **Use blocks or have space to move!**

## Common Autonomous Tasks

### Leave Starting Zone

Most games award points for leaving the starting area:

.. code-block:: java

   new DriveDistance(driveSubsystem, 2.0); // Drive 2 meters forward

### Score Pre-loaded Game Piece

Release a game piece you start with:

.. code-block:: java

   addCommands(
     new DriveDistance(driveSubsystem, 1.5),
     new ReleaseGamePiece(intakeSubsystem)
   );

### Balance on Charge Station

Drive onto a balancing platform:

.. code-block:: java

   addCommands(
     new DriveDistance(driveSubsystem, 3.0),
     new BalanceCommand(driveSubsystem)
   );

## Next Steps

Once you master simple autonomous:

- Add sensors (gyro, encoders) for better accuracy
- Learn path planning in :doc:`/docs/software/pathplanning/index`
- Explore vision-based autonomous in :doc:`/docs/software/vision-processing/index`
- Use :doc:`/docs/getting-started-guide/next-steps/index` for intermediate topics

## Additional Resources

- :doc:`/docs/software/commandbased/command-compositions` - Command groups and scheduling
- :doc:`/docs/software/pathplanning/index` - Advanced path planning
- :doc:`/docs/software/wpilib-tools/robot-simulation/index` - Testing autonomous in simulation
