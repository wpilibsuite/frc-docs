# Sending data
Unlike SmartDashboard, data cannot be sent directly to Shuffleboard without first specifying what tab the data should be placed in.

## Sending simple data
Sending simple data (numbers, strings, booleans, and arrays of these) is done by calling ``add`` on a tab. This method will set the value if not already present, but will not overwrite an existing value.

.. tab-set-code::

   ```java
   Shuffleboard.getTab("Numbers")
        .add("Pi", 3.14);
   ```

   ```c++
   frc::Shuffleboard::GetTab("Numbers")
        .Add("Pi", 3.14);
   ```

   ```python
   from wpilib.shuffleboard import Shuffleboard
   Shuffleboard.getTab("Tab Title").add("Pi", 3.14)
   ```

If data needs to be updated (for example, the output of some calculation done on the robot), use the type-specific methods (``addNumber``, ``addString``, ``addBoolean``) with a lambda function (Java) or callable (Python) that returns the current value. Shuffleboard will automatically call this function periodically to get the latest value.

.. tab-set-code::

   ```java
   class VisionCalculator {
      private ShuffleboardTab tab = Shuffleboard.getTab("Vision");
      private double distanceToTarget = 0;

      public VisionCalculator() {
         tab.addNumber("Distance to target", () -> distanceToTarget);
      }

      public void calculate() {
         distanceToTarget = /* calculate distance */;
      }
   }
   ```

   ```python
   from wpilib.shuffleboard import Shuffleboard
   def robotInit(self):
      tab = Shuffleboard.getTab("Vision")
      tab.addNumber("Distance to target", lambda: self.distanceToTarget)
      self.distanceToTarget = 0
   def teleopPeriodic(self):
      self.distanceToTarget = self.encoder.getDistance()
   ```

.. important:: The NetworkTables entry API (using ``getEntry()`` and ``setDouble()``/``setString()``/etc.) should only be used for reading data *from* Shuffleboard, such as values from sliders, text fields, or number inputs. For sending data *to* Shuffleboard, prefer the lambda/callable approach shown above.

## Making choices persist between reboots

When configuring a robot from the dashboard, some settings may want to persist between robot or driverstation reboots instead of having drivers remember (or forget) to configure the settings before each match.

Simply using `addPersistent` instead of `add` will make the value saved on the roboRIO and loaded when the robot program starts.

.. note:: This does not apply to sendable data such as choosers or motor controllers.

.. tab-set-code::

   ```java
   Shuffleboard.getTab("Drive")
        .addPersistent("Max Speed", 1.0);
   ```

   ```c++
   frc::Shuffleboard::GetTab("Drive")
        .AddPersistent("Max Speed", 1.0);
   ```

   ```python
   from wpilib.shuffleboard import Shuffleboard
   (Shuffleboard.getTab("Drive")
         .addPersistent("Max Speed", 1.0))
   ```

## Sending sensors, motors, etc

Analogous to ``SmartDashboard.putData``, any ``Sendable`` object (most sensors, motor controllers, and SendableChoosers) can be added to any tab

.. tab-set-code::

   ```java
   Shuffleboard.getTab("Tab Title")
        .add("Sendable Title", mySendable);
   ```

   ```c++
   frc::Shuffleboard::GetTab("Tab Title")
        .Add("Sendable Title", mySendable);
   ```

   ```python
   from wpilib.shuffleboard import Shuffleboard
   (Shuffleboard.getTab("Tab Title")
         .add("Sendable Title", mySendable))
   ```

