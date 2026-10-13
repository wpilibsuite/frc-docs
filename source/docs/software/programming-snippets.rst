# Programming Snippets

Quick, copy-paste code for common tasks. Each snippet links to the full
reference page for more detail.

.. rubric:: Motors

Control a PWM motor with a joystick. These excerpts come from the maintained
WPILib Motor Controller example and show the imports, hardware objects, and
periodic control method together.

.. tab-set::

   .. tab-item:: Java
      :sync: java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/83df3ee3ce1e892f76970ec21c8efdc00a104d4a/wpilibjExamples/src/main/java/org/wpilib/snippets/motorcontrol/Robot.java
         :language: java
         :lines: 7-9,28-41,65-69

   .. tab-item:: Blocks
      :sync: blocks

      .. admonition:: Coming Soon

         A Blocks version of this single-motor snippet will be added here.

      .. _blocks-drivetrain-samples:

      .. rubric:: Complete Drivetrain Samples

      The Blocks interface includes complete drivetrain projects. Select
      :guilabel:`Samples...`, choose a project, then select
      :guilabel:`Create New Project From Sample` to make an editable copy.

      .. tab-set::

         .. tab-item:: Differential A301

            ``DifferentialDrive301`` demonstrates a two-motor A301 drivetrain
            controlled by a gamepad.

            .. image:: images/programming-snippets/differential-drive-blocks-sample.png
               :alt: The DifferentialDrive301 sample's SimpleDriveTeleop blocks, which use gamepad axes to drive an A301 differential drivetrain.
               :width: 900

            `View the DifferentialDrive301 source
            <https://github.com/wpilibsuite/systemcore-blocks-interface/tree/main/frontend/samples/DifferentialDrive301>`_.

         .. tab-item:: Mecanum A301

            ``MecanumRobot301`` demonstrates a four-motor mecanum drivetrain
            using A301 motor controllers.

            .. image:: images/programming-snippets/mecanum-301-blocks-sample.png
               :alt: The MecanumRobot301 Teleop blocks, which use three gamepad axes to drive and rotate an A301 mecanum drivetrain.
               :width: 900

            `View the MecanumRobot301 source
            <https://github.com/wpilibsuite/systemcore-blocks-interface/tree/main/frontend/samples/MecanumRobot301>`_.

         .. tab-item:: Mecanum Expansion Hub

            ``MecanumRobotExpansionHub`` demonstrates a four-motor mecanum
            drivetrain using motors connected to a REV Expansion Hub.

            .. image:: images/programming-snippets/mecanum-expansion-hub-blocks-sample.png
               :alt: The MecanumRobotExpansionHub Teleop blocks, which use three gamepad axes to drive and rotate an Expansion Hub mecanum drivetrain.
               :width: 900

            `View the MecanumRobotExpansionHub source
            <https://github.com/wpilibsuite/systemcore-blocks-interface/tree/main/frontend/samples/MecanumRobotExpansionHub>`_.

   .. tab-item:: C++
      :sync: c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/83df3ee3ce1e892f76970ec21c8efdc00a104d4a/wpilibcExamples/src/main/cpp/snippets/MotorControl/cpp/Robot.cpp
         :language: c++
         :lines: 7-9,28-30,55-59

   .. tab-item:: Python
      :sync: python

      .. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/mostrobotpy/b8826c262e021d055f3654b518a4168168a2e536/snippets/robot/MotorControl/robot.py
         :language: python
         :lines: 9-10,15,31-42,60-61

   .. tab-item:: LabVIEW
      :sync: labview

      .. admonition:: Coming Soon

         A LabVIEW version of this snippet will be added here.

See :doc:`Using Motor Controllers </docs/software/hardware-apis/motors/using-motor-controllers>`
for the full guide, including CAN motor controllers and where to put this
code in Command-Based vs. TimedRobot programs.

.. rubric:: Sensors

Read a digital input (limit switch, beam break, etc.):

.. tab-set::

   .. tab-item:: Java
      :sync: java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-6/wpilibjExamples/src/main/java/org/wpilib/snippets/digitalinput/Robot.java
         :language: java
         :lines: 15-16,20-21

   .. tab-item:: Blocks
      :sync: blocks

      .. admonition:: Coming Soon

         A Blocks (Blockly) version of this snippet will be added here.

   .. tab-item:: C++
      :sync: c++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2027.0.0-alpha-6/wpilibcExamples/src/main/cpp/snippets/DigitalInput/cpp/Robot.cpp
         :language: c++
         :lines: 15-17,21-22

   .. tab-item:: Python
      :sync: python

      .. admonition:: Coming Soon

         A Python version of this snippet will be added here.

   .. tab-item:: LabVIEW
      :sync: labview

      .. admonition:: Coming Soon

         A LabVIEW version of this snippet will be added here.

See :doc:`Digital Inputs </docs/software/hardware-apis/sensors/digital-inputs-software>`
for the full guide, plus analog inputs, encoders, and gyros.

.. rubric:: Autonomous & Loops

.. admonition:: Coming Soon

   Common autonomous and loop patterns (timed sequences, state machines,
   command groups) will be added here.

.. rubric:: More WPILib Examples

Need more than a short snippet? WPILib includes complete example projects in
VS Code. Press :kbd:`Ctrl+Shift+P`, select
:guilabel:`WPILib: Create a new project`, and choose
:guilabel:`Example` to open one.

.. warning::

   Example projects demonstrate an idea; they are not ready to deploy to
   every robot unchanged. Check motor ports, controller ports, inversion,
   dimensions, gains, and other robot-specific constants before running one.

.. grid:: 1 1 3 3
   :gutter: 3

   .. grid-item-card:: Start with Driving
      :link: wpilib-basic-examples
      :link-type: ref
      :class-card: sw-card-shared

      **Beginner projects**
      ^^^
      Arcade drive, tank drive, mecanum drive, and a simple timed
      autonomous routine.

   .. grid-item-card:: Build a Command Robot
      :link: wpilib-command-based-examples
      :link-type: ref
      :class-card: sw-card-shared

      **Complete project patterns**
      ^^^
      Button bindings, subsystems, commands, autonomous movement, and
      complete Inlined and Traditional Hatchbot projects.

   .. grid-item-card:: Add One Feature
      :link: wpilib-snippet-examples
      :link-type: ref
      :class-card: sw-card-shared

      **Focused examples**
      ^^^
      LEDs, motor control, solenoids, vision, digital communication,
      power monitoring, and other single-feature examples.

Good next examples for a new team include:

- **Motor Controller** for joystick-controlled motor movement.
- **Encoder** and **Gyro** for reading drivetrain sensors.
- **Solenoids** for basic pneumatics.
- **Addressable LED** for robot status and driver feedback.
- **Getting Started** for a two-second autonomous movement.
- **Inlined Hatchbot** for a complete command-based robot without a separate
  command subclass for every action.

See :doc:`WPILib Example Projects
</docs/software/examples-tutorials/wpilib-examples>` for the complete catalog,
including controls, pose estimation, state-space, and simulation examples.

.. toctree::
   :maxdepth: 1
   :hidden:
