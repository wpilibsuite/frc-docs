New to WPILib
==============

Already know how to write code? Start here to learn how a WPILib robot
program is organized. WPILib provides the classes you use to control motors,
read sensors, and communicate with the Driver Station.

.. tip::

   **New to programming too?** Start with :doc:`Zero to Robot <introduction>`.
   Follow the setup steps, then write and run your first robot program.

.. rubric:: How the Pieces Fit Together
   :class: wl-shared-text

These are the main pieces you'll encounter in WPILib code, plus a comparison
with FTC SDK OpModes.

.. grid:: 1 2 3 5
   :gutter: 3

   .. grid-item-card:: Robot Class

      Defines what runs when the robot
      is enabled, disabled, or switches modes.

   .. grid-item-card:: Mechanisms

      Groups the code for a mechanism, such as a drivetrain, arm, or intake.
      It owns the mechanism's motors and sensors.

   .. grid-item-card:: Commands

      Defines an action, such as driving forward or raising an arm.
      The command scheduler runs the action and manages which commands
      can use each subsystem.

   .. grid-item-card:: OpModes

      If you've used the FTC SDK, you've written OpModes. In WPILib,
      the Robot Class defines what runs in each robot mode.

   .. grid-item-card:: Hardware APIs

      The classes for motor controllers, encoders, and other devices.
      Use them to set motor outputs and read sensor values.

.. rubric:: Where FRC and FTC Differ
   :class: wl-shared-text

The Driver Station and motor connections differ between FRC and FTC.
FRC uses the FRC Driver Station, with motor
controllers wired into the FRC control system. FTC uses its own Driver Station
software, and motors connect through Motioncore. Servos will not be supported
for FTC on Systemcore.

The programming building blocks above apply to both programs; the
:doc:`Zero to Robot guide <introduction>` identifies the program-specific
steps.

.. tip::

   **Still setting up the hardware?** Use the
   :doc:`hardware overview </docs/hardware/hardware-basics/hardware-overview>`
   to identify the controllers, power distribution, and connections on your robot.

.. container:: sw-nav

   .. container:: sw-next

      :doc:`Continue to Zero to Robot → <introduction>`
