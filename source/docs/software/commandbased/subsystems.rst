Subsystems
==========

Subsystems are the basic unit of robot organization in the command-based
paradigm. A subsystem is an abstraction for a collection of robot
hardware that *operates together as a unit*. Subsystems
`encapsulate <https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)>`__
this hardware, “hiding” it from the rest of the robot code
(e.g. commands) and restricting access to it except through the
subsystem’s public methods. Restricting the access in this way provides
a single convenient place for code that might otherwise be duplicated in
multiple places (such as scaling motor outputs or checking limit
switches) if the subsystem internals were exposed. It also allows
changes to the specific details of how the subsystem works (the
“implementation”) to be isolated from the rest of robot code, making it
far easier to make substantial changes if/when the design constraints
change.

Subsystems also serve as the backbone of the ``CommandScheduler``\ ’s
resource management system. Commands may declare resource requirements
by specifying which subsystems they interact with; the scheduler will
never concurrently schedule more than one command that requires a given
subsystem. An attempt to schedule a command that requires a subsystem
that is already-in-use will either interrupt the currently-running
command (if the command has been scheduled as interruptible), or else be
ignored.

Subsystems can be associated with “default commands” that will be
automatically scheduled when no other command is currently using the
subsystem. This is useful for continuous “background” actions such as
controlling the robot drive, or keeping an arm held at a setpoint.
Similar functionality can be achieved in the subsystem’s ``periodic()``
method, which is run once per run of the scheduler; teams should try to
be consistent within their codebase about which functionality is
achieved through either of these methods.

Creating a subsystem
--------------------

The recommended method to create a subsystem for most users is to
subclass the abstract ``SendableSubsystemBase`` class:

.. code-block:: java

   import edu.wpi.first.wpilibj.experimental.command.SendableSubsystemBase;

   public class ExampleSubsystem extends SendableSubsystemBase {
     // Your subsystem code goes here!
   }

This class contains a few convenience features on top of the basic
``Subsystem`` interface: it automatically calls the ``register()``
method in its constructor to register the subsystem with the scheduler
(this is necessary for the ``periodic()`` method to be called when the
scheduler runs), and also implements the ``Sendable`` interface so that
it can be sent to the dashboard to display/log relevant status
information.

This is not required, however; advanced users seeking more flexibility
are able to simply create a class that implements the ``Subsystem``
interface:

.. code-block:: java

   import edu.wpi.first.wpilibj.experimental.command.Subsystem;

   public class ExampleSubsystem implements Subsystem {
     // Your subsystem code goes here!
     
     public ExampleSubsystem() {
       register(); // Registers this subsystem with the scheduler so that its periodic method will be called.
     }
   }

Simple subsystem example
------------------------

What might a functional subsystem look like in practice? Below is a
simple pneumatically-actuated hatch mechanism from the HatchBot example
project (TODO: link to it):

.. code-block:: java

   package edu.wpi.first.wpilibj.examples.hatchbottraditional.subsystems;

   import edu.wpi.first.wpilibj.DoubleSolenoid;
   import edu.wpi.first.wpilibj.experimental.command.SendableSubsystemBase;

   import static edu.wpi.first.wpilibj.DoubleSolenoid.Value.*;
   import static edu.wpi.first.wpilibj.examples.hatchbottraditional.Constants.HatchConstants.*;

   /**
    * A hatch mechanism actuated by a single {@link DoubleSolenoid}.
    */
   public class HatchSubsystem extends SendableSubsystemBase {

     private final DoubleSolenoid m_hatchSolenoid =
         new DoubleSolenoid(kHatchSolenoidModule, kHatchSolenoidPorts[0], kHatchSolenoidPorts[1]);

     /**
      * Grabs the hatch.
      */
     public void grabHatch() {
       m_hatchSolenoid.set(kForward);
     }

     /**
      * Releases the hatch.
      */
     public void releaseHatch() {
       m_hatchSolenoid.set(kReverse);
     }
   }

Notice that the subsystem hides the presence of the DoubleSolenoid from
outside code (it is declared ``private``), and instead publicly exposes
two higher-level, descriptive robot actions: ``grabHatch()`` and
``releaseHatch()``. It is extremely important that “implementation
details” such as the double solenoid be “hidden” in this manner; this
ensures that code outside the subsystem will never cause the solenoid to
be in an unexpected state. It also allows the user to change the
implementation (for instance, a motor could be used instead of a
pneumatic) without any of the code outside of the subsystem having to
change with it.

Setting default commands
------------------------

Setting a default command for a subsystem is very easy; one simply calls
``Scheduler.getInstance().setDefaultCommand()``, or, more simply, the
``setDefaultCommand()`` method of the ``Subsystem`` interface:

.. code-block:: java

   Scheduler.getInstance().setDefaultCommand(driveSubsystem, defaultDriveCommand);

.. code-block:: java

   driveSubsystem.setDefaultCommand(defaultDriveCommand);