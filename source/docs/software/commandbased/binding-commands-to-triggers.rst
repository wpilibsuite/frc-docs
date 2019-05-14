Binding commands to triggers
============================

Apart from autonomous commands, which are scheduled at the start of the
autonomous period, and default commands, which are automatically
scheduled whenever their subsystem is not currently in-use, the most
common way to run a command is by binding it to a triggering event, such
as a button being pressed by a human operator. The command-based
paradigm makes this extremely easy to do.

As mentioned earlier, command-based is a
`declarative <https://en.wikipedia.org/wiki/Declarative_programming>`__
paradigm. Accordingly, binding buttons to commands is done
declaratively; the association of a button and a command is “declared”
once, during robot initialization. The library then does all the hard
work of checking the button state and scheduling (or cancelling) the
command as needed, behind-the-scenes. Users only need to worry about
designing their desired UI setup - not about implementing it!

Command binding is done through the ``Trigger`` class and its various
``Button`` subclasses (TODO: link).

Trigger/Button bindings
-----------------------

There are a number of bindings available for the ``Trigger`` class. All
of these bindings will automatically schedule a command when a certain
trigger activation event occurs - however, each binding has different
specific behavior. ``Button`` and its subclasses have bindings with
identical behaviors, but slightly different names that better-match a
button rather than an arbitrary triggering event.

whenActive/whenPressed
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: java

   trigger.whenActive(Command command)

.. code-block:: java

   button.whenPressed(Command command)

This binding schedules a command when a trigger changes from inactive to
active (or, accordingly, when a button changes is initially pressed).
The command will be scheduled on the iteration when the state changes,
and will not be scheduled again unless the trigger becomes inactive and
then active again (or the button is released and then re-pressed).

whileActiveContinuous/whileHeld
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: java

   trigger.whileActiveContinuous(Command command)

.. code-block:: java

   button.whileHeld(Command command)

This binding schedules a command repeatedly while a trigger is active
(or, accordingly, while a button is held), and cancels it when the
trigger becomes inactive (or when the button is released). Note that
scheduling an already-running command has no effect; but if the command
finishes while the trigger is still active, it will be re-scheduled.

whileActiveOnce/whenHeld
~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: java

   trigger.whileActiveOnce(Command command)

.. code-block:: java

   button.whenHeld(Command command)

This binding schedules a command when a trigger changes from inactive to
active (or, accordingly, when a button is initially pressed) and cancels
it when the trigger becomes inactive again (or the button is released).
The command will *not* be re-scheduled if it finishes while the trigger
is still active.

whenInactive/whenReleased
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: java

   trigger.whenInactive(Command command)

.. code-block:: java

   button.whenReleased(Command command)

This binding schedules a command when a trigger changes from active to
inactive (or, accordingly, when a button is initially released). The
command will be scheduled on the iteration when the state changes, and
will not be re-scheduled unless the trigger becomes active and then
inactive again (or the button is pressed and then re-released).

toggleWhenActive/toggleWhenPressed
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: java

   trigger.toggleWhenActive(Command command)

.. code-block:: java

   button.toggleWhenPressed(Command command)

This binding toggles a command, scheduling it when a trigger changes
from inactive to active (or a button is initially pressed), and
cancelling it under the same condition if the command is currently
running. Note that while this functionality is supported, toggles are
*not* a highly-recommended option for user control, as they require the
driver to mentally keep track of the robot state.

cancelWhenActive/cancelWhenPressed
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: java

   trigger.cancelWhenActive(Command command)

.. code-block:: java

   button.cancelWhenPressed(Command command)

This binding cancels a command when a trigger changes from inactive to
active (or, accordingly, when a button is initially pressed). the
command is canceled on the iteration when the state changes, and will
not be canceled again unless the trigger becomes inactive and then
active again (or the button is released and re-pressed). Note that
cancelling a command that is not currently running has no effect.

Binding a command to a joystick button
--------------------------------------

The most-common way to trigger a command is to bind a command to a
button on a joystick or other HID (human interface device). To do this,
users should use the ``JoystickButton`` class.

Creating a JoystickButton
~~~~~~~~~~~~~~~~~~~~~~~~~

There are two ways to create a ``JoystickButton``. For both, one must
first create an instance of one of the subclasses of ``GenericHID``:

.. code-block:: java

   Joystick leftStick = new Joystick(1); // Creates a joystick on port 1

.. code-block:: java

   XboxController driverController = new XboxController(2); // Creates an XboxController on port 2.

After this is done, users can simply call the ``getButton()`` method on
the HID:

.. code-block:: java

   leftStick.getButton(Joystick.Button.kTrigger.value) // Returns the JoystickButton pbject
                                                       // corresponding to the trigger of leftStick

.. code-block:: java

   driverController.getButton(XboxController.Button.kX.value) // Returns the JoystickButton object 
                                                              // corresponding to the `X` button of driverController

Binding a command to a JoystickButton
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Putting it all together, it is very simple to bind a button to a
JoystickButton:

.. code-block:: java

   // Binds an ExampleCommand to be scheduled when the trigger of the left joystick is pressed
   leftStick.getButton(Joystick.Button.kTrigger.value).whenPressed(new ExampleCommand());

.. code-block:: java

   // Binds an ExampleCommand to be scheduled when the `X` button of the driver gamepad is pressed
   driverController.getButton(XboxController.Button.kX.value).whenPressed(new ExampleCommand());

It is useful to note that the command binding methods all return the
trigger/button that they were initially called on, and thus can be
chained to bind multiple commands to different states of the same
button. For example:

.. code-block:: java

   driverController.getButton(XboxController.Button.kX.value)
       // Binds a FooCommand to be scheduled when the `X` button of the driver gamepad is pressed
       .whenPressed(new FooCommand());
       // Binds a BarCommand to be scheduled when that same button is released
       .whenReleased(new BarCommand());

Remember that button binding is *declarative*: bindings only need to be
declared once, ideally some time during robot initialization. The
library handles everything else.

Composing triggers
------------------

The ``Trigger`` class (including its ``Button`` subclasses) can be
composed to create composite triggers through the ``and()``, ``or()``,
and ``negate()`` methods. For example:

.. code-block:: java

   // Binds an ExampleCommand to be scheduled when both the 'X' and 'Y' buttons of the driver gamepad are pressed
   driverController.getButton(XboxController.Button.kX.value)
       .and(driverController.getButton(XboxController.Button.kY.value))
       .whenActive(new ExampleCommand());

Note that these methods return a ``Trigger``, not a ``Button``, so the
``Trigger`` binding method names must be used even when buttons are
composed.

Creating your own custom trigger
--------------------------------

While binding to HID buttons is by far the most common use case,
advanced users may occasionally want to bind commands to arbitrary
triggering events. This can be easily done by simply writing your own
subclass of trigger:

.. code-block:: java

   public class ExampleTrigger extends Trigger {

     @Override
     public boolean get() {
       // This returns whether the trigger is active
     }
   }