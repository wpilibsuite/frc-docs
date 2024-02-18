Sending data
============
Unlike SmartDashboard, data cannot be sent directly to Shuffleboard without first specifying what tab the data should be placed in.

Sending simple data
-------------------
Sending simple data (numbers, strings, booleans, and arrays of these) is done by calling ``add`` on a tab. This method will set the value if not already present, but will not overwrite an existing value.

.. tab-set-code::

   .. code-block:: java

       Shuffleboard.getTab("Numbers")
            .add("Pi", 3.14);

   .. code-block:: c++

       frc::Shuffleboard::GetTab("Numbers")
            .Add("Pi", 3.14);

   .. code-block:: python

      from wpilib.shuffleboard import Shuffleboard

      Shuffleboard.getTab("Tab Title").add("Pi", 3.14)

If data needs to be updated (for example, the output of some calculation done on the robot), call ``getEntry()`` after defining the value, then update it when needed or in a ``periodic`` function

.. tab-set-code::

   .. code-block:: java

      class VisionCalculator {
         private ShuffleboardTab tab = Shuffleboard.getTab("Vision");
         private GenericEntry distanceEntry =
            tab.add("Distance to target", 0)
               .getEntry();

         public void calculate() {
         double distance = ...;
         distanceEntry.setDouble(distance);
         }
      }

   .. code-block:: python

      from wpilib.shuffleboard import Shuffleboard

      def robotInit(self):
         tab = Shuffleboard.getTab("Vision")
         self.distanceEntry = tab.add("Distance to target", 0).getEntry()

      def teleopPeriodic(self):
         distance = self.encoder.getDistance()
         self.distanceEntry.setDouble(distance)

Making choices persist between reboots
--------------------------------------

When configuring a robot from the dashboard, some settings may want to persist between robot or driverstation reboots instead of having drivers remember (or forget) to configure the settings before each match.

Simply using `addPersistent` instead of `add` will make the value saved on the roboRIO and loaded when the robot program starts.

.. note:: This does not apply to sendable data such as choosers or motor controllers.

.. tab-set-code::

   .. code-block:: java

       Shuffleboard.getTab("Drive")
            .addPersistent("Max Speed", 1.0);

   .. code-block:: c++

       frc::Shuffleboard::GetTab("Drive")
            .AddPersistent("Max Speed", 1.0);

   .. code-block:: python

      from wpilib.shuffleboard import Shuffleboard

      (Shuffleboard.getTab("Drive")
            .addPersistent("Max Speed", 1.0))

Sending sensors, motors, etc
----------------------------

Analogous to ``SmartDashboard.putData``, any ``Sendable`` object (most sensors, motor controllers, and SendableChoosers) can be added to any tab

.. tab-set-code::

   .. code-block:: java

       Shuffleboard.getTab("Tab Title")
            .add("Sendable Title", mySendable);

   .. code-block:: c++

       frc::Shuffleboard::GetTab("Tab Title")
            .Add("Sendable Title", mySendable);

   .. code-block:: python

      from wpilib.shuffleboard import Shuffleboard

      (Shuffleboard.getTab("Tab Title")
            .add("Sendable Title", mySendable))
