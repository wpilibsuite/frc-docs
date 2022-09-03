.. include:: <isonum.txt>

Joysticks
=========

A joystick can be used with the Driver Station program to control the robot.  Almost any "controller" that can be recognized by Windows can be used as a joystick.  Joysticks are accessed using the ``GenericHID`` class.  This class has three relevant subclasses for preconfigured joysticks.  You may also implement your own for other controllers by extending ``GenericHID``.  The first is ``Joystick`` which is useful for standard flight joysticks.  The second is ``XboxController`` which works for the Xbox 360, Xbox One, or Logitech F310 (in XInput mode).  Finally, the ``PS4Controller`` class is ideal for using that controller.  Each axis of the controller ranges from -1 to 1.

The command based way to use the these classes is detailed in the section: :ref:`docs/software/commandbased/binding-commands-to-triggers:Binding Commands to Triggers`.

Driver Station Joysticks
------------------------

.. image:: /docs/software/driverstation/images/driver-station/ds-usb-tab.png
   :alt: The 4th tab down on the left hand side is the USB devices tab.

The :ref:`USB Devices Tab <docs/software/driverstation/driver-station:USB Devices Tab>` of the Driver Station is used to setup and configure the joystick for use with the robot.  Pressing a button on a joystick will cause its entry in the table to light up green.  Selecting the joystick will show the values of axes, buttons and the POV that can be used to determine the mapping between physical joystick features and axis or button numbers.

.. image:: images/joystick/lights.jpg
   :alt: On the USB tab the indicators light up to show what is currently being pressed.

The USB Devices Tab also assigns a joystick index to each joystick.  To reorder the joysticks simply click and drag.  The Driver Station software will try to preserve the ordering of devices between runs.  It is a good idea to note what order your devices should be in and check each time you start the Driver Station software that they are correct.

When the Driver Station is in disabled mode, it is routinely looking for status changes on the joystick devices.  Unplugged devices are removed from the list and new devices are opened and added. When not connected to the FMS, unplugging a joystick will force the Driver Station into disabled mode. To start using the joystick again: plug the joystick in, check that it shows up in the right spot, then re-enable the robot. While the Driver Station is in enabled mode, it will not scan for new devices.  This is a time consuming operation and timely update of signals from attached devices takes priority.

.. note:: For some joysticks the startup routine will read whatever position the joysticks are in as the center position, therefore, when the computer is turned on (or when the joystick is plugged in) the joysticks should be at their center position.

When the robot is connected to the Field Management System at competition, the Driver Station mode is dictated by the :term:`FMS`. This means that you cannot disable your robot and the DS cannot disable itself in order to detect joystick changes. A manual complete refresh of the joysticks can be initiated by pressing the F1 key on the keyboard. Note that this will close and re-open all devices, so all devices should be in their center position as noted above.

``Joystick`` Class
------------------

.. image:: images/joystick/joystick.png
   :alt: A Logitech flight stick with an explanation of the axis values and buttons.


.. tabs::

   .. code-tab:: java

      Joystick exampleJoystick = new Joystick(0); // 0 is the USB Port to be used as indicated on the Driver Station

   .. code-tab:: c++

      Joystick exampleJoystick{0}; // 0 is the USB Port to be used as indicated on the Driver Station

   .. code-tab:: python

      exampleJoystick = wpilib.Joystick(0) # 0 is the USB Port to be used as indicated on the Driver Station

The ``Joystick`` class is designed to make using a flight joystick to operate the robot significantly easier.  Depending on the flight joystick, the user may need to set the specific X, Y, Z, and Throttle channels that your flight joystick uses.  This class offers special methods for accessing the angle and magnitude of the flight joystick.

``XboxController`` Class
------------------------

.. image:: images/joystick/xbox.jpg
   :alt: Original Xbox Controller.

.. tabs::

   .. code-tab:: java

      XboxController exampleXbox = new XboxController(0); // 0 is the USB Port to be used as indicated on the Driver Station

   .. code-tab:: c++

      XboxController exampleXbox{0}; // 0 is the USB Port to be used as indicated on the Driver Station

   .. code-tab:: python

      exampleXbox = wpilib.XboxController(0) # 0 is the USB Port to be used as indicated on the Driver Station

An example of how to use buttons on the ``XboxController``.

.. tabs::

   .. group-tab:: Java

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gearsbot/RobotContainer.java
         :language: java
         :lines: 39,85-88,96-99
         :linenos:
         :lineno-start: 39

   .. group-tab:: C++

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/examples/GearsBot/cpp/RobotContainer.cpp
         :language: cpp
         :lines: 41-48
         :linenos:
         :lineno-start: 41

The ``XboxController`` class provides named indices for each of the buttons that you can access with ``XboxController.Button.kX.value``.  The rumble feature of the controller can be controlled by using ``XboxController.setRumble(GenericHID.RumbleType.kRightRumble, value)``.  Many users do a split stick arcade drive that uses the left stick for just forwards / backwards and the right stick for left / right turning.

``PS4Controller`` Class
-----------------------

.. image:: images/joystick/ps4.jpg
   :alt: PlayStation 4 controller.


.. tabs::

   .. code-tab:: java

      PS4Controller examplePS4 = new PS4Controller(0); // 0 is the USB Port to be used as indicated on the Driver Station

   .. code-tab:: c++

      PS4Controller examplePS4{0}; // 0 is the USB Port to be used as indicated on the Driver Station

   .. code-tab:: python

      examplePS4 = wpilib.PS4Controller(0) # 0 is the USB Port to be used as indicated on the Driver Station

The ``PS4Controller`` class provides named indices for each of the buttons. These buttons can accessed with ``PS4Controller.Button.kSquare.value``.  The rumble feature of the controller can be controlled by using ``PS4Controller.setRumble(GenericHID.RumbleType.kRightRumble, value)``.

POV
---

.. image:: images/joystick/dpadangles.png
   :alt: The angles used by the code of the POV/D-pad with 0 at the top and continuing clockwise.


On joysticks, the POV is a directional hat that can select one of 8 different angles or read -1 for unpressed.  The XboxController D-pad works the same as a POV.  Be careful when using a POV with exact angle requirements as it is hard for the user to ensure they select exactly the angle desired.

``GenericHID`` Usage
--------------------

An axis can be used with ``.getRawAxis(0)`` (if not using any of the classes above) that returns the current value.  Zero and one in this example are each the index of an axis as found in the Driver Station mentioned above.

.. tabs::

   .. code-tab:: java

      private final PWMSparkMax m_leftMotor = new PWMSparkMax(0);
      private final PWMSparkMax m_rightMotor = new PWMSparkMax(1);
      private final DifferentialDrive m_robotDrive = new DifferentialDrive(m_leftMotor, m_rightMotor);
      private final GenericHID m_stick = new GenericHID(0);

      m_robotDrive.arcadeDrive(-m_stick.getRawAxis(0), m_stick.getRawAxis(1));

   .. code-tab:: c++

      frc::PWMVictorSPX m_leftMotor{0};
      frc::PWMVictorSPX m_rightMotor{1};
      frc::DifferentialDrive m_robotDrive{m_leftMotor, m_rightMotor};
      frc::GenericHID m_stick{0};

      m_robotDrive.ArcadeDrive(-m_stick.GetRawAxis(0), m_stick.GetRawAxis(1));

   .. code-tab:: python

      leftMotor = wpilib.PWMVictorSPX(0)
      rightMotor = wpilib.PWMVictorSPX(1)
      self.robotDrive = wpilib.drive.DifferentialDrive(leftMotor, rightMotor)
      self.stick = wpilib.GenericHID(0)

      self.robotDrive.arcadeDrive(-self.stick.getRawAxis(0), self.stick.getRawAxis(1))


Button Usage
------------

Unlike an axis, you will usually want to use the ``pressed`` and ``released`` methods to respond to button input.  These will return true if the button has been activated since the last check.  This is helpful for taking an action once when the event occurs but not having to continuously do it while the button is held down.

.. tabs::

   .. code-tab:: java

      if (joystick.getRawButtonPressed(0)) {
         turnIntakeOn(); // When pressed the intake turns on
      }
      if (joystick.getRawButtonReleased(0)) {
         turnIntakeOff(); // When released the intake turns off
      }

      OR

      if (joystick.getRawButton(0)) {
         turnIntakeOn();
      } else {
         turnIntakeOff();
      }

   .. code-tab:: c++

      if (joystick.GetRawButtonPressed(0)) {
         turnIntakeOn(); // When pressed the intake turns on
      }
      if (joystick.GetRawButtonReleased(0)) {
         turnIntakeOff(); // When released the intake turns off
      }

      OR

      if (joystick.GetRawButton(0)) {
         turnIntakeOn();
      } else {
         turnIntakeOff();
      }

   .. code-tab:: python

      if joystick.getRawButtonPressed(0):
         turnIntakeOn() # When pressed the intake turns on

      if joystick.getRawButtonReleased(0):
         turnIntakeOff() # When released the intake turns off

      # OR

      if joystick.getRawButton(0):
         turnIntakeOn()
      else:
         turnIntakeOff()

A common request is to toggle something on and off with the press of a button.  Toggles should be used with caution, as they require the user to keep track of the robot state.

.. tabs::

   .. code-tab:: java

      boolean toggle = false;

      if (joystick.getRawButtonPressed(0)) {
         if (toggle) {
            // Current state is true so turn off
            retractIntake();
            toggle = false;
         } else {
            // Current state is false so turn on
            deployIntake();
            toggle = true;
         }
      }

   .. code-tab:: c++

      bool toggle{false};

      if (joystick.GetRawButtonPressed(0)) {
         if (toggle) {
            // Current state is true so turn off
            retractIntake();
            toggle = false;
         } else {
            // Current state is false so turn on
            deployIntake();
            toggle = true;
         }
      }

   .. code-tab:: python

      toggle = False

      if joystick.getRawButtonPressed(0):
         if toggle:
            # current state is True so turn off
            retractIntake()
            toggle = False
         else:
            # Current state is False so turn on
            deployIntake()
            toggle = True
