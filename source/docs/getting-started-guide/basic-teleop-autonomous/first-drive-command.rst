.. include:: <isonum.txt>

# Writing Your First Drive Command

This page shows you how to create a basic drive command that allows you to control your robot with a joystick during teleop.

## What is a Drive Command?

A drive command controls your robot's drivetrain motors based on joystick input. The most common implementation is "arcade drive" or "tank drive":

- **Arcade Drive**: One joystick for forward/backward, another for turning
- **Tank Drive**: Left joystick controls left side motors, right joystick controls right side

## Prerequisites

Before creating a drive command, you should have:

- A drivetrain subsystem defined in your code
- Motor controllers properly configured
- Joystick or controller connected to Driver Station

## Creating a Drive Subsystem

First, create a ``DriveSubsystem`` class that controls your motors:

.. tab-set::
   .. tab-item:: Java

      .. code-block:: java

         package frc.robot.subsystems;

         import edu.wpi.first.wpilibj2.command.SubsystemBase;
         import edu.wpi.first.wpilibj.drive.DifferentialDrive;
         import edu.wpi.first.wpilibj.motorcontrol.PWMSparkMax;

         public class DriveSubsystem extends SubsystemBase {
           private final PWMSparkMax leftMotor = new PWMSparkMax(0);
           private final PWMSparkMax rightMotor = new PWMSparkMax(1);
           private final DifferentialDrive drive = new DifferentialDrive(leftMotor, rightMotor);

           public DriveSubsystem() {
             // Invert one side if needed
             rightMotor.setInverted(true);
           }

           public void arcadeDrive(double forward, double turn) {
             drive.arcadeDrive(forward, turn);
           }

           public void stop() {
             drive.stopMotor();
           }
         }

   .. tab-item:: C++

      .. code-block:: cpp

         #include "subsystems/DriveSubsystem.h"

         DriveSubsystem::DriveSubsystem()
             : leftMotor(0), rightMotor(1), drive(leftMotor, rightMotor) {
           rightMotor.SetInverted(true);
         }

         void DriveSubsystem::ArcadeDrive(double forward, double turn) {
           drive.ArcadeDrive(forward, turn);
         }

         void DriveSubsystem::Stop() {
           drive.StopMotor();
         }

   .. tab-item:: Python

      .. code-block:: python

         from commands2 import SubsystemBase
         from wpilib.drive import DifferentialDrive
         from wpilib import PWMSparkMax

         class DriveSubsystem(SubsystemBase):
             def __init__(self):
                 super().__init__()
                 self.leftMotor = PWMSparkMax(0)
                 self.rightMotor = PWMSparkMax(1)
                 self.rightMotor.setInverted(True)
                 self.drive = DifferentialDrive(self.leftMotor, self.rightMotor)

             def arcadeDrive(self, forward: float, turn: float):
                 self.drive.arcadeDrive(forward, turn)

             def stop(self):
                 self.drive.stopMotor()

## Creating the Drive Command

Next, create a command that uses joystick input to call the drive subsystem:

.. tab-set::
   .. tab-item:: Java

      .. code-block:: java

         package frc.robot.commands;

         import edu.wpi.first.wpilibj2.command.Command;
         import frc.robot.subsystems.DriveSubsystem;
         import java.util.function.DoubleSupplier;

         public class DriveCommand extends Command {
           private final DriveSubsystem driveSubsystem;
           private final DoubleSupplier forwardSupplier;
           private final DoubleSupplier turnSupplier;

           public DriveCommand(DriveSubsystem subsystem,
                               DoubleSupplier forward,
                               DoubleSupplier turn) {
             driveSubsystem = subsystem;
             forwardSupplier = forward;
             turnSupplier = turn;
             addRequirements(subsystem);
           }

           @Override
           public void execute() {
             driveSubsystem.arcadeDrive(forwardSupplier.getAsDouble(),
                                        turnSupplier.getAsDouble());
           }

           @Override
           public void end(boolean interrupted) {
             driveSubsystem.stop();
           }
         }

   .. tab-item:: C++

      .. code-block:: cpp

         #include "commands/DriveCommand.h"

         DriveCommand::DriveCommand(DriveSubsystem* subsystem,
                                    std::function<double()> forward,
                                    std::function<double()> turn)
             : m_driveSubsystem(subsystem), m_forward(forward), m_turn(turn) {
           AddRequirements(subsystem);
         }

         void DriveCommand::Execute() {
           m_driveSubsystem->ArcadeDrive(m_forward(), m_turn());
         }

         void DriveCommand::End(bool interrupted) {
           m_driveSubsystem->Stop();
         }

   .. tab-item:: Python

      .. code-block:: python

         from commands2 import Command
         from typing import Callable

         class DriveCommand(Command):
             def __init__(self, subsystem, forward: Callable[[], float],
                         turn: Callable[[], float]):
                 super().__init__()
                 self.driveSubsystem = subsystem
                 self.forward = forward
                 self.turn = turn
                 self.addRequirements(subsystem)

             def execute(self):
                 self.driveSubsystem.arcadeDrive(self.forward(), self.turn())

             def end(self, interrupted: bool):
                 self.driveSubsystem.stop()

## Using the Command

Set the drive command as the default command for your drivetrain in ``RobotContainer``:

.. tab-set::
   .. tab-item:: Java

      .. code-block:: java

         driveSubsystem.setDefaultCommand(
           new DriveCommand(
             driveSubsystem,
             () -> -driverController.getLeftY(),  // Forward/backward
             () -> -driverController.getRightX()  // Turn
           )
         );

   .. tab-item:: C++

      .. code-block:: cpp

         driveSubsystem.SetDefaultCommand(DriveCommand(
           &driveSubsystem,
           [this] { return -driverController.GetLeftY(); },
           [this] { return -driverController.GetRightX(); }
         ));

   .. tab-item:: Python

      .. code-block:: python

         self.driveSubsystem.setDefaultCommand(
             DriveCommand(
                 self.driveSubsystem,
                 lambda: -self.driverController.getLeftY(),
                 lambda: -self.driverController.getRightX()
             )
         )

## Testing Your Drive Command

1. Deploy code to robot
2. Enable teleop mode in Driver Station
3. Move joysticks to drive the robot
4. Verify motors respond correctly to inputs

## Next Steps

- See :doc:`joystick-mapping` to learn about button mapping
- Learn about :doc:`simple-autonomous` for basic autonomous routines
- Explore :doc:`/docs/user-manual/subsystems-commands/index` for advanced command patterns

## Additional Resources

- :doc:`/docs/software/commandbased/subsystems` - Detailed subsystem documentation
- :doc:`/docs/software/commandbased/commands` - Comprehensive command guide
- :doc:`/docs/software/hardware-apis/motors/index` - Motor controller APIs
