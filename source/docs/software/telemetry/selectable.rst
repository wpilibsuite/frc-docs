# Choosing Options with Selectable

``Selectable`` presents named options on a dashboard and returns the robot-side value associated with the selected name. It replaces ``SendableChooser``. Use it for autonomous routines, drive modes, or other configuration choices. Publish it through :doc:`tunables`, since the selection is dashboard input.

## Creating a Selection

Create the selectable as a robot or subsystem member, add options, and publish it once during initialization:

.. tab-set-code::
   ```java
   import org.wpilib.tunable.Selectable;
   import org.wpilib.tunable.Tunables;

   private enum DriveMode { FIELD_RELATIVE, ROBOT_RELATIVE }
   private final Selectable<DriveMode> m_driveMode = new Selectable<>();

   // In initialization:
   m_driveMode.addDefault("Field Relative", DriveMode.FIELD_RELATIVE);
   m_driveMode.add("Robot Relative", DriveMode.ROBOT_RELATIVE);
   Tunables.publish("Drive/mode", m_driveMode);

   // When using the selection:
   DriveMode mode = m_driveMode.getSelected();
   ```

   ```c++
   #include <wpi/tunables/Selectable.hpp>
   #include <wpi/tunables/Tunables.hpp>

   enum class DriveMode { FIELD_RELATIVE, ROBOT_RELATIVE };
   wpi::tunables::Selectable<DriveMode> m_driveMode;

   // In initialization:
   m_driveMode.AddDefault("Field Relative", DriveMode::FIELD_RELATIVE);
   m_driveMode.Add("Robot Relative", DriveMode::ROBOT_RELATIVE);
   wpi::tunables::Publish("Drive/mode", m_driveMode);

   // When using the selection:
   DriveMode mode = m_driveMode.GetSelected();
   ```

   ```python
   from enum import Enum, auto
   import tunables

   class DriveMode(Enum):
       FIELD_RELATIVE = auto()
       ROBOT_RELATIVE = auto()

   # In initialization:
   self.drive_mode = tunables.Selectable[DriveMode]()
   self.drive_mode.add_default("Field Relative", DriveMode.FIELD_RELATIVE)
   self.drive_mode.add("Robot Relative", DriveMode.ROBOT_RELATIVE)
   tunables.publish("Drive/mode", self.drive_mode)

   # When using the selection:
   mode = self.drive_mode.get_selected()
   ```

With the default backend, the selectable appears at ``/Tunables/Drive/mode``. The dashboard displays option names, while the associated enum values or objects stay in robot code. Selectable does not run an action just because it was selected.

``getSelected()`` / ``GetSelected()`` / ``get_selected()`` returns the selected option, falling back to the default if the selected name is absent or invalid. If neither resolves to an option, Java returns ``null``, Python returns ``None``, and C++ returns a value-initialized value (for example, zero for integers or ``nullptr`` for pointers). Set a default or handle the missing-selection case before using the result.

## Selecting an Autonomous Command

For a :doc:`Commands v2 </docs/software/commandbased/commands-v2/index>` robot, a selectable can hold commands. The following snippets assume the command objects already exist and remain alive for the duration of the selection:

.. tab-set-code::
   ```java
   import org.wpilib.command2.Command;

   private final Selectable<Command> m_auto = new Selectable<>();
   private Command m_autonomousCommand;

   // In initialization:
   m_auto.addDefault("Drive Straight", m_driveStraight);
   m_auto.add("Score Preload", m_scorePreload);
   Tunables.publish("Auto", m_auto);

   @Override
   public void autonomousInit() {
     m_autonomousCommand = m_auto.getSelected();
     if (m_autonomousCommand != null) {
       m_autonomousCommand.schedule();
     }
   }

   @Override
   public void teleopInit() {
     if (m_autonomousCommand != null) {
       m_autonomousCommand.cancel();
     }
   }
   ```

   ```c++
   #include <wpi/commands2/Command.hpp>
   #include <wpi/commands2/CommandScheduler.hpp>

   wpi::tunables::Selectable<wpi::cmd::Command*> m_auto;
   wpi::cmd::Command* m_autonomousCommand = nullptr;

   // In initialization; m_driveStraight and m_scorePreload are command members.
   m_auto.AddDefault("Drive Straight", &m_driveStraight);
   m_auto.Add("Score Preload", &m_scorePreload);
   wpi::tunables::Publish("Auto", m_auto);

   void AutonomousInit() override {
     m_autonomousCommand = m_auto.GetSelected();
     if (m_autonomousCommand) {
       wpi::cmd::CommandScheduler::GetInstance().Schedule(m_autonomousCommand);
     }
   }

   void TeleopInit() override {
     if (m_autonomousCommand) {
       m_autonomousCommand->Cancel();
     }
   }
   ```

   ```python
   import commands2

   # In initialization:
   self.auto = tunables.Selectable[commands2.Command]()
   self.auto.add_default("Drive Straight", self.drive_straight)
   self.auto.add("Score Preload", self.score_preload)
   tunables.publish("Auto", self.auto)
   self.autonomous_command = None

   def autonomous_init(self):
       self.autonomous_command = self.auto.get_selected()
       if self.autonomous_command is not None:
           self.autonomous_command.schedule()

   def teleop_init(self):
       if self.autonomous_command is not None:
           self.autonomous_command.cancel()
   ```

Read and save the selection when autonomous starts. This ensures a later dashboard selection change does not change which command is canceled when teleop starts. Continue running the Commands v2 scheduler from the robot's periodic method as usual.

C++ ``Selectable<T>`` requires a copy-constructible, default-initializable value type. A ``CommandPtr`` owns its command and is not copyable, so retain the ``CommandPtr`` in robot code and add its ``.get()`` pointer to a ``Selectable<Command*>``. Do not add pointers to temporary commands. If the selectable stores ``std::shared_ptr<T>``, ``GetSelected()`` returns ``std::weak_ptr<T>``.

For robots using :doc:`/docs/software/basic-programming/opmodes`, multiple autonomous opmodes can instead be selected directly through the Driver Station.

## Changing Options and Handling Changes

Use ``remove()`` / ``Remove()`` / ``remove()`` to remove an option, ``setDefault()`` / ``SetDefault()`` / ``set_default()`` to choose an existing default by name, and ``clear()`` / ``Clear()`` / ``clear()`` to remove all options. These changes update an already-published selectable.

An optional ``onChange()`` / ``OnChange()`` / ``on_change()`` listener receives the selected value when a dashboard selection change is applied. Only one listener can be registered; registering another replaces it. It runs during the tunable registry update, normally on the main robot thread. For autonomous routines, schedule the selected command in autonomous initialization rather than from this callback.

.. note:: Selectable uses a different dashboard protocol from SendableChooser. Use a dashboard version that supports Selectable; Elastic requires 2027 alpha 9 or newer. Existing chooser widgets and saved paths may need to be recreated for ``/Tunables``.
