Binding Commands to Triggers
============================

Apart from autonomous commands, which are scheduled at the start of the autonomous period, and default commands, which are automatically scheduled whenever their subsystem is not currently in-use, the most common way to run a command is by binding it to a triggering event, such as a button being pressed by a human operator. The command-based paradigm makes this extremely easy to do.

As mentioned earlier, command-based is a :term:`declarative programming` paradigm. Accordingly, binding buttons to commands is done declaratively; the association of a button and a command is "declared" once, during robot initialization. The library then does all the hard work of checking the button state and scheduling (or canceling) the command as needed, behind-the-scenes. Users only need to worry about designing their desired UI setup - not about implementing it!

Command binding is done through the ``Trigger`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/button/Trigger.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_trigger.html>`__) and its various ``Button`` subclasses (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/button/Button.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_button.html>`__).

Trigger/Button Bindings
-----------------------

.. note:: The C++ command-based library offers two overloads of each button binding method - one that takes a forwarding reference, and one that takes a raw pointer.  The forwarding reference overload transfers ownership (by either moving or copying depending on if the command is an `rvalue or an lvalue <http://thbecker.net/articles/rvalue_references/section_01.html>`__) to the scheduler, while the raw pointer overload leaves the user responsible for the lifespan of the command object.  It is recommended that users preferentially use the forwarding reference overload unless there is a specific need to retain a handle to the command in the calling code.

There are a number of bindings available for the ``Trigger`` class. All of these bindings will automatically schedule a command when a certain trigger activation event occurs - however, each binding has different specific behavior. ``Button`` and its subclasses have bindings with identical behaviors, but slightly different names that better-match a button rather than an arbitrary triggering event.

whenActive/whenPressed
^^^^^^^^^^^^^^^^^^^^^^

This binding schedules a command when a trigger changes from inactive to active (or, accordingly, when a button changes is initially pressed). The command will be scheduled on the iteration when the state changes, and will not be scheduled again unless the trigger becomes inactive and then active again (or the button is released and then re-pressed).

whileActiveContinuous/whileHeld
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This binding schedules a command repeatedly while a trigger is active (or, accordingly, while a button is held), and cancels it when the trigger becomes inactive (or when the button is released). Note that scheduling an already-running command has no effect; but if the command finishes while the trigger is still active, it will be re-scheduled.

whileActiveOnce/whenHeld
^^^^^^^^^^^^^^^^^^^^^^^^

This binding schedules a command when a trigger changes from inactive to active (or, accordingly, when a button is initially pressed) and cancels it when the trigger becomes inactive again (or the button is released). The command will *not* be re-scheduled if it finishes while the trigger is still active.

whenInactive/whenReleased
^^^^^^^^^^^^^^^^^^^^^^^^^

This binding schedules a command when a trigger changes from active to inactive (or, accordingly, when a button is initially released). The command will be scheduled on the iteration when the state changes, and will not be re-scheduled unless the trigger becomes active and then inactive again (or the button is pressed and then re-released).

toggleWhenActive/toggleWhenPressed
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This binding toggles a command, scheduling it when a trigger changes from inactive to active (or a button is initially pressed), and canceling it under the same condition if the command is currently running. Note that while this functionality is supported, toggles are not a highly-recommended option for user control, as they require the driver to keep track of the robot state.  The preferred method is to use two buttons; one to turn on and another to turn off.  Using a `StartEndCommand <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/StartEndCommand.html>`__ or a `ConditionalCommand <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/ConditionalCommand.html>`__ is a good way to specify the commands that you want to be want to be toggled between.

.. tabs::

  .. code-tab:: java

    myButton.toggleWhenPressed(new StartEndCommand(mySubsystem::onMethod,
        mySubsystem::offMethod,
        mySubsystem));

  .. code-tab:: c++

    myButton.ToggleWhenPressed(StartEndCommand([&] { mySubsystem.OnMethod(); },
        [&] { mySubsystem.OffMethod(); },
        {&mySubsystem}));

cancelWhenActive/cancelWhenPressed
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This binding cancels a command when a trigger changes from inactive to active (or, accordingly, when a button is initially pressed). the command is canceled on the iteration when the state changes, and will not be canceled again unless the trigger becomes inactive and then active again (or the button is released and re-pressed). Note that canceling a command that is not currently running has no effect.

Binding a command to a joystick button
--------------------------------------

The most-common way to trigger a command is to bind a command to a button on a joystick or other HID (human interface device). To do this, users should use the ``JoystickButton`` class.

Creating a JoystickButton
^^^^^^^^^^^^^^^^^^^^^^^^^

In order to create a ``JoystickButton``, we first need a Joystick.  All types of joysticks (including gamepads) are represented in code by the ``GenericHID`` class (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/GenericHID.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_generic_h_i_d.html>`__), or one of its subclasses:

.. tabs::

  .. code-tab:: java

    Joystick exampleStick = new Joystick(1); // Creates a joystick on port 1
    XboxController exampleController = new XboxController(2); // Creates an XboxController on port 2.

  .. code-tab:: c++

    frc::Joystick exampleStick{1}; // Creates a joystick on port 1
    frc::XBoxController exampleController{2} // Creates an XboxController on port 2

.. note:: When creating a ``JoystickButton`` with an XboxController, it is usually a good idea to use the button enum (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj/XboxController.Button.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/structfrc_1_1_xbox_controller_1_1_button.html>`__) to get the button number corresponding to a given button.

After the joystick is instantiated, users can then pass it to a ``JoystickButton`` object (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/button/JoystickButton.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc2_1_1_joystick_button.html>`__):

.. tabs::

  .. code-tab:: java

    JoystickButton exampleButton = new JoystickButton(exampleStick, 1); // Creates a new JoystickButton object for button 1 on exampleStick

  .. code-tab:: c++

    frc2::JoystickButton exampleButton(&exampleStick, 1); // Creates a new JoystickButton object for button 1 on exampleStick

Binding a Command to a JoystickButton
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: In the C++ command-based library, button objects *do not need to survive past the call to a binding method*, and so the binding methods may be simply called on a temp.

Putting it all together, it is very simple to bind a button to a JoystickButton:

.. tabs::

  .. code-tab:: java

    // Binds an ExampleCommand to be scheduled when the trigger of the example joystick is pressed
    exampleButton.whenPressed(new ExampleCommand());

  .. code-tab:: c++

    // Binds an ExampleCommand to be scheduled when the trigger of the example joystick is pressed
    exampleButton.WhenPressed(ExampleCommand());

It is useful to note that the command binding methods all return the trigger/button that they were initially called on, and thus can be chained to bind multiple commands to different states of the same button. For example:

.. tabs::

  .. code-tab:: java

    exampleButton
        // Binds a FooCommand to be scheduled when the `X` button of the driver gamepad is pressed
        .whenPressed(new FooCommand())
        // Binds a BarCommand to be scheduled when that same button is released
        .whenReleased(new BarCommand());

  .. code-tab:: c++

    exampleButton
        // Binds a FooCommand to be scheduled when the `X` button of the driver gamepad is pressed
        .WhenPressed(FooCommand())
        // Binds a BarCommand to be scheduled when that same button is released
        .WhenReleased(BarCommand());

Remember that button binding is *declarative*: bindings only need to be declared once, ideally some time during robot initialization. The library handles everything else.

Composing Triggers
------------------

The ``Trigger`` class (including its ``Button`` subclasses) can be composed to create composite triggers through the ``and()``, ``or()``, and ``negate()`` methods (or, in C++, the ``&&``, ``||``, and ``!`` operators). For example:

.. tabs::

  .. code-tab:: java

    // Binds an ExampleCommand to be scheduled when both the 'X' and 'Y' buttons of the driver gamepad are pressed
    new JoystickButton(exampleController, XBoxController.Button.kX.value)
        .and(new JoystickButton(exampleController, XboxController.Button.kY.value))
        .whenActive(new ExampleCommand());

  .. code-tab:: c++

    // Binds an ExampleCommand to be scheduled when both the 'X' and 'Y' buttons of the driver gamepad are pressed
    (frc2::JoystickButton(&exampleController, frc::XBoxController::Button::kX)
        && JoystickButton(&exampleController, frc::XboxController::Button::kY))
        .WhenActive(new ExampleCommand());

Note that these methods return a ``Trigger``, not a ``Button``, so the ``Trigger`` binding method names must be used even when buttons are composed.

Debouncing Triggers
-------------------

To avoid rapid repeated activation, triggers (especially those originating from digital inputs) can be debounced with the :ref:`WPILib Debouncer class <docs/software/advanced-controls/filters/debouncer:Debouncer>` using the `debounce` method:

.. tabs::

  .. code-tab:: java

    // debounces exampleButton with a 0.1s debounce time, rising edges only
    exampleButton.debounce(0.1).whenActive(new ExampleCommand());

    // debounces exampleButton with a 0.1s debounce time, both rising and falling edges
    exampleButton.debounce(0.1, Debouncer.DebounceType.kBoth).whenActive(new ExampleCommand());

  .. code-tab:: c++

    // debounces exampleButton with a 100ms debounce time, rising edges only
    exampleButton.Debounce(100_ms).WhenActive(new ExampleCommand());

    // debounces exampleButton with a 100ms debounce time, both rising and falling edges
    exampleButton.Debounce(100_ms, Debouncer::DebounceType::Both).WhenActive(new ExampleCommand());

Creating Your Own Custom Trigger
--------------------------------

While binding to HID buttons is by far the most common use case, advanced users may occasionally want to bind commands to arbitrary triggering events. This can be easily done by simply writing your own subclass of ``Trigger`` or ``Button``:

.. tabs::

  .. code-tab:: java

    public class ExampleTrigger extends Trigger {
      @Override
      public boolean get() {
        // This returns whether the trigger is active
      }
    }

  .. code-tab:: c++

    class ExampleTrigger : public frc2::Trigger {
     public:
      bool get() override {
        // This returns whether the trigger is active
      }
    }

Alternatively, this can also be done inline by passing a lambda to the constructor of ``trigger`` or ``button``:

.. tabs::

  .. code-tab:: java

    // Here it is assumed that "condition" is an object with a method "get" that returns whether the trigger should be active
    Trigger exampleTrigger = new Trigger(condition::get);

  .. code-tab:: c++

    // Here it is assumed that "condition" is a boolean that determines whether the trigger should be active
    frc2::Trigger exampleTrigger([&condition] { return condition; });
