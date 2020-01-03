Simple Subsystems
=================

.. important:: This documentation describes the use of the legacy command-based library. While this documentation has been preserved to help teams that have yet to do so, teams are strongly encouraged to migrate to the :ref:`new command-based library <docs/software/commandbased/index:Command-Based Programming>`.

Subsystems are the parts of your robot that are independently controlled like collectors, shooters, drive bases, elevators, arms, wrists, grippers, etc. Each subsystem is coded as an instance of the Subsystem class. Subsystems should have methods that define the operation of the actuators and sensors but not more complex behavior that happens over time.

Creating a Subsystem
--------------------

.. tabs::

   .. code-tab:: java

      import edu.wpi.first.wpilibj.DigitalInput;
      import edu.wpi.first.wpilibj.Victor;
      import edu.wpi.first.wpilibj.command.Subsystem;

      /**
       * The claw subsystem is a simple system with a motor for opening and closing.
       * If using stronger motors, you should probably use a sensor so that the motors
       * don't stall.
       */
      public class Claw extends Subsystem {
        private final Victor m_motor = new Victor(7);
        private final DigitalInput m_contact = new DigitalInput(5);

        /**
         * Create a new claw subsystem.
         */
        public Claw() {
          super();
        }

        @Override
        public void initDefaultCommand() {
        }

        /**
         * Set the claw motor to move in the open direction.
         */
        public void open() {
          m_motor.set(-1);
        }

        /**
         * Set the claw motor to move in the close direction.
         */
        @Override
        public void close() {
          m_motor.set(1);
        }

        /**
         * Stops the claw motor from moving.
         */
        public void stop() {
          m_motor.set(0);
        }

        /**
         * Return true when the robot is grabbing an object hard enough to trigger
         * the limit switch.
         */
        public boolean isGrabbing() {
          return m_contact.get();
        }
      }

   .. code-tab:: cpp

      #include "subsystems/Claw.h"

      Claw::Claw() : frc::Subsystem("Claw") {
        // Let's show everything on the LiveWindow
        AddChild("Motor", m_motor);
      }

      void Claw::InitDefaultCommand() {}

      /**
       * Set the claw motor to move in the open direction.
       */
      void Claw::Open() { m_motor.Set(-1); }

      /**
       * Set the claw motor to move in the close direction.
       */
      void Claw::Close() { m_motor.Set(1); }

      /**
       * Stops the claw motor from moving.
       */
      void Claw::Stop() { m_motor.Set(0); }

      /**
       * Return true when the robot is grabbing an object hard enough to trigger
       * the limit switch.
       */
      bool Claw::IsGripping() { return m_contact.Get(); }


This is an example of a fairly straightforward subsystem that operates a claw on a robot. The claw mechanism has a single motor to open or close the claw and no sensors (not necessarily a good idea in practice, but works for the example). The idea is that the open and close operations are simply timed. There are three methods, open(), close(), and stop() that operate the claw motor. Notice that there is not specific code that actually checks if the claw is opened or closed. The open method gets the claw moving in the open direction and the close method gets the claw moving in the close direction. Use a command to control the timing of this operation to make sure that the claw opens and closes for a specific period of time.

Operating the Claw with a Command
---------------------------------

.. tabs::

   .. code-tab:: java

      package org.usfirst.frc.team1.robot.commands;

      import edu.wpi.first.wpilibj.command.Command;
      import org.usfirst.frc.team1.robot.Robot;

      public class OpenClaw extends Command {

         public OpenClaw() {
             requires(Robot.claw);
             setTimeout(.9);
         }

         protected void initialize() {
            Robot.claw.open()
         }

         protected void execute() {
         }

         protected boolean isFinished() {
             return isTimedOut();
         }

         protected void end() {
            Robot.claw.stop();
         }

         protected void interrupted() {
            end();
         }
      }

   .. code-tab:: cpp

      #include "commands/OpenClaw.h"

      #include "Robot.h"

      OpenClaw::OpenClaw() : frc::Command("OpenClaw") {
        Requires(&Robot::claw);
        SetTimeout(1);
      }

      // Called just before this Command runs the first time
      void OpenClaw::Initialize() { Robot::claw.Open(); }

      // Make this return true when this Command no longer needs to run execute()
      bool OpenClaw::IsFinished() { return IsTimedOut(); }

      // Called once after isFinished returns true
      void OpenClaw::End() { Robot::claw.Stop(); }

Commands provide the timing of the subsystems operations. Each command would do a different operation with the subsystem, the Claw in this case. The commands provides the timing for opening or closing. Here is an example of a simple Command that controls the opening of the claw.  Notice that a timeout is set for this command (0.9 seconds) to time the opening of the claw and a check for the time in the isFinished() method. You can find more details in the article about :doc:`using commands <../commands/creating-simple-commands>`.
