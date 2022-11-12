Binding Commands to Triggers
============================

Apart from autonomous commands, which are scheduled at the start of the autonomous period, and default commands, which are automatically scheduled whenever their subsystem is not currently in-use, the most common way to run a command is by binding it to a triggering event, such as a button being pressed by a human operator. The command-based paradigm makes this extremely easy to do.

As mentioned earlier, command-based is a :term:`declarative programming` paradigm. Accordingly, binding buttons to commands is done declaratively; the association of a button and a command is "declared" once, during robot initialization. The library then does all the hard work of checking the button state and scheduling (or canceling) the command as needed, behind-the-scenes. Users only need to worry about designing their desired UI setup - not about implementing it!

Command binding is done through the ``Trigger`` class (`Java <https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/button/Trigger.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/beta/cpp/classfrc2_1_1_trigger.html>`__).

Trigger Bindings
-----------------------

.. note:: The C++ command-based library offers two overloads of each button binding method - one that takes an `rvalue reference <http://thbecker.net/articles/rvalue_references/section_01.html>`__ (``CommandPtr&&``), and one that takes a raw pointer (``Command*``).  The rvalue overload moves ownership to the scheduler, while the raw pointer overload leaves the user responsible for the lifespan of the command object.  It is recommended that users preferentially use the rvalue reference overload unless there is a specific need to retain a handle to the command in the calling code.

There are a number of bindings available for the ``Trigger`` class. All of these bindings will automatically schedule a command when a certain trigger activation event occurs - however, each binding has different specific behavior.

.. note:: The ``Button`` subclass is deprecated, and usage of its binding methods should be replaced according to the respective deprecation messages in the API docs.

onTrue
^^^^^^

This binding schedules a command when a trigger changes from ``false`` to ``true`` (or, accordingly, when a button changes is initially pressed). The command will be scheduled on the iteration when the state changes, and will not be scheduled again unless the trigger becomes ``false`` and then ``true`` again (or the button is released and then re-pressed).

The ``onFalse`` binding is identical, only that it schedules on ``false`` instead of on ``true``.

whileTrue
^^^^^^^^^

This binding schedules a command when a trigger changes from ``false`` to ``true`` (or, accordingly, when a button is initially pressed) and cancels it when the trigger becomes ``false`` again (or the button is released). The command will *not* be re-scheduled if it finishes while the trigger is still ``true``. For the command to restart if it finishes while the trigger is ``true``, wrap the command in a ``RepeatCommand``, or use a ``RunCommand`` instead of an ``InstantCommand``.

The ``whileFalse`` binding is identical, only that it schedules on ``false`` and cancels on ``true``.

toggleOnTrue
^^^^^^^^^^^^

This binding toggles a command, scheduling it when a trigger changes from ``false`` to ``true`` (or a button is initially pressed), and canceling it under the same condition if the command is currently running. Note that while this functionality is supported, toggles are not a highly-recommended option for user control, as they require the driver to keep track of the robot state.  The preferred method is to use two buttons; one to turn on and another to turn off.  Using a `StartEndCommand <https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/StartEndCommand.html>`__ or a `ConditionalCommand <https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/ConditionalCommand.html>`__ is a good way to specify the commands that you want to be want to be toggled between.

.. tabs::

  .. code-tab:: java

    myButton.toggleOnTrue(Commands.startEnd(mySubsystem::onMethod,
        mySubsystem::offMethod,
        mySubsystem));

  .. code-tab:: c++

    myButton.ToggleOnTrue(frc2::cmd::StartEnd([&] { mySubsystem.OnMethod(); },
        [&] { mySubsystem.OffMethod(); },
        {&mySubsystem}));

The ``toggleOnFalse`` binding is identical, only that it toggles on ``false`` instead of on ``true``.

Binding a command to a joystick button
--------------------------------------

The most-common way to trigger a command is to bind a command to a button on a joystick or other HID (human interface device). For this, we use ``Trigger`` (`Java <https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/button/Trigger.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/beta/cpp/classfrc2_1_1_trigger.html>`__) or its ``JoystickButton`` subclass (`Java <https://github.wpilib.org/allwpilib/docs/beta/java/edu/wpi/first/wpilibj2/command/button/JoystickButton.html>`__, `C++ <https://github.wpilib.org/allwpilib/docs/beta/cpp/classfrc2_1_1_joystick_button.html>`__).

There are two ways to do this: ``Trigger``-returning factory methods on the Command HID classes, or the ``JoystickButton`` subclass with the regular HID classes. The former is recommended, as it provides a cleaner syntax.

Getting a Trigger instance
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: The ``XboxController``/``CommandXboxController`` classes for an Xbox controller will be used here as an example, but similar classes exist for PS4 controllers (``PS4Controller``/``CommandPS4Controller``), flight joysticks (``Joystick``/``CommandJoystick``), and generic HID devices (``GenericHID``/``CommandGenericHID``).

First, we first need an object representing our HID device.

.. tabs::

  .. code-tab:: java

    CommandXboxController exampleCommandController = new XboxController(1); // Creates an CommandXboxController on port 1.
    XboxController exampleController = new XboxController(2); // Creates an XboxController on port 2.

  .. code-tab:: c++

    frc2::CommandXboxController exampleCommandController{1} // Creates an CommandXboxController on port 1
    frc::XboxController exampleController{2} // Creates an XboxController on port 2

Now, we can get a ``Trigger`` from our command HID object or pass the regular HID object to a ``JoystickButton``:

.. tabs::

  .. code-tab:: java

    Trigger xButton = exampleCommandController.x(); // Creates a new Trigger object for the `X` button on exampleCommandController

    Trigger yButton = new JoystickButton(exampleController, XboxController.Button.kY.value); // Creates a new JoystickButton object for the `Y` button on exampleController

  .. code-tab:: c++

    frc2::Trigger xButton = exampleCommandController.X() // Creates a new Trigger object for the `X` button on exampleCommandController

    frc2::JoystickButton yButton(&exampleStick, frc::XboxController::Button::kY); // Creates a new JoystickButton object for the `Y` button on exampleController

Binding a Command to a JoystickButton
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note:: ``Trigger`` objects *do not need to survive past the call to a binding method*, so the binding methods may be simply called on a temp.

Putting it all together, it is very simple to bind a command to a button:

.. tabs::

  .. code-tab:: java

    // Binds an ExampleCommand to be scheduled when the trigger of the example joystick is pressed
    exampleButton.onTrue(new ExampleCommand());

  .. code-tab:: c++

    // Binds an ExampleCommand to be scheduled when the trigger of the example joystick is pressed
    exampleButton.OnTrue(ExampleCommand().ToPtr());

It is useful to note that the command binding methods all return the trigger that they were called on, and thus can be chained to bind multiple commands to different states of the same button. For example:

.. tabs::

  .. code-tab:: java

    exampleButton
        // Binds a FooCommand to be scheduled when the button is pressed
        .onTrue(new FooCommand())
        // Binds a BarCommand to be scheduled when that same button is released
        .onFalse(new BarCommand());

  .. code-tab:: c++

    exampleButton
        // Binds a FooCommand to be scheduled when the button is pressed
        .OnTrue(FooCommand().ToPtr())
        // Binds a BarCommand to be scheduled when that same button is released
        .OnFalse(BarCommand().ToPtr());

Remember that button binding is *declarative*: bindings only need to be declared once, ideally some time during robot initialization. The library handles everything else.

Composing Triggers
------------------

The ``Trigger`` class can be composed to create composite triggers through the ``and()``, ``or()``, and ``negate()`` methods (or, in C++, the ``&&``, ``||``, and ``!`` operators). For example:

.. tabs::

  .. code-tab:: java

    // Binds an ExampleCommand to be scheduled when both the 'X' and 'Y' buttons of the driver gamepad are pressed
    exampleCommandController.x()
        .and(exampleCommandController.y())
        .onTrue(new ExampleCommand());

  .. code-tab:: c++

    // Binds an ExampleCommand to be scheduled when both the 'X' and 'Y' buttons of the driver gamepad are pressed
    (exampleCommandController.X()
        && exampleCommandController.Y())
        .OnTrue(ExampleCommand().ToPtr());

Debouncing Triggers
-------------------

To avoid rapid repeated activation, triggers (especially those originating from digital inputs) can be debounced with the :ref:`WPILib Debouncer class <docs/software/advanced-controls/filters/debouncer:Debouncer>` using the `debounce` method:

.. tabs::

  .. code-tab:: java

    // debounces exampleButton with a 0.1s debounce time, rising edges only
    exampleButton.debounce(0.1).onTrue(new ExampleCommand());

    // debounces exampleButton with a 0.1s debounce time, both rising and falling edges
    exampleButton.debounce(0.1, Debouncer.DebounceType.kBoth).onTrue(new ExampleCommand());

  .. code-tab:: c++

    // debounces exampleButton with a 100ms debounce time, rising edges only
    exampleButton.Debounce(100_ms).OnTrue(ExampleCommand().ToPtr());

    // debounces exampleButton with a 100ms debounce time, both rising and falling edges
    exampleButton.Debounce(100_ms, Debouncer::DebounceType::Both).OnTrue(ExampleCommand().ToPtr());

Creating Your Own Custom Trigger
--------------------------------

While binding to HID buttons is by far the most common use case, advanced users may occasionally want to bind commands to arbitrary triggering events. This can also be done inline by passing a lambda to the constructor of ``Trigger``:

.. tabs::

  .. code-tab:: java

    // Here it is assumed that "condition" is an object with a method "get" that returns whether the trigger should be true
    Trigger exampleTrigger = new Trigger(condition::get);

  .. code-tab:: c++

    // Here it is assumed that "condition" is a boolean that determines whether the trigger should be true
    frc2::Trigger exampleTrigger([&condition] { return condition; });
