Sending data
============
Unlike SmartDashboard, data cannot be sent directly to Shuffleboard without first specifying what tab the data should be placed in.

Sending simple data
-------------------
Sending simple data (numbers, strings, booleans, and arrays of these) is done by calling ``add`` on a tab. This method will set the value if not already present, but will not overwrite an existing value.

.. tabs::

   .. code-tab:: java

       Shuffleboard.getTab("Numbers")
            .add("Pi", 3.14);

   .. code-tab:: c++

       Shuffleboard::GetTab("Numbers")
            .Add("Pi", 3.14);

If data needs to be updated (for example, the output of some calculation done on the robot), call ``getEntry()`` after defining the value, then update it when needed or in a ``periodic`` function

.. tabs::

   .. code-tab:: java

       class VisionCalculator {
          private ShuffleboardTab tab = Shuffleboard.getTab("Vision");
          private NetworkTableEntry distanceEntry =
              tab.add("Distance to target", 0)
                 .getEntry();

          public void calculate() {
            double distance = ...;
            distanceEntry.setDouble(distance);
          }
        }

Making choices persist between reboots
--------------------------------------

When configuring a robot from the dashboard, some settings may want to persist between robot or driverstation reboots instead of having drivers remember (or forget) to configure the settings before each match.

Simply using `addPersistent` instead of `add` will make the value saved on the roboRIO and loaded when the robot program starts.

.. note:: This does not apply to sendable data such as choosers or motor controllers.

.. tabs::

   .. code-tab:: java

       Shuffleboard.getTab("Drive")
            .addPersistent("Max Speed", 1.0);

Sending sensors, motors, etc
----------------------------

Analogous to ``SmartDashboard.putData``, any ``Sendable`` object (most sensors, motor controllers, and SendableChoosers) can be added to any tab

.. tabs::

   .. code-tab:: java

       Shuffleboard.getTab("Tab Title")
            .add("Sendable Title", mySendable);
