# Binding Commands to Triggers

Apart from autonomous commands, which are scheduled at the start of the autonomous period, and default commands, which are automatically scheduled whenever their subsystem is not currently in-use, the most common way to run a command is by binding it to a triggering event, such as a button being pressed by a human operator. The command-based paradigm makes this extremely easy to do.

As mentioned earlier, command-based is a :term:`declarative programming` paradigm. Accordingly, binding buttons to commands is done declaratively; the association of a button and a command is "declared" once, during robot initialization. The library then does all the hard work of checking the button state and scheduling (or canceling) the command as needed, behind-the-scenes. Users only need to worry about designing their desired UI setup - not about implementing it!

Command binding is done through the ``Trigger`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/button/Trigger.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_trigger.html)).

## Getting a Trigger Instance

To bind commands to conditions, we need a ``Trigger`` object. There are three ways to get a Trigger object:

### HID Factories

The command-based HID classes contain factory methods returning a ``Trigger`` for a given button. ``CommandGenericHID`` has an index-based ``button(int)`` factory ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/button/CommandGenericHID.html#button(int)), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_generic_h_i_d.html#a661f49794a913615c94fba927e1072a8)), and its subclasses ``CommandXboxController`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/button/CommandXboxController.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_xbox_controller.html)), ``CommandPS4Controller`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/button/CommandPS4Controller.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_p_s4_controller.html)), and ``CommandJoystick`` ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/button/CommandJoystick.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_command_joystick.html)) have named factory methods for each button.

.. tab-set-code::

  ```java
  CommandXboxController exampleCommandController = new CommandXboxController(1); // Creates a CommandXboxController on port 1.
  Trigger xButton = exampleCommandController.x(); // Creates a new Trigger object for the `X` button on exampleCommandController
  ```

  ```c++
  frc2::CommandXboxController exampleCommandController{1} // Creates a CommandXboxController on port 1
  frc2::Trigger xButton = exampleCommandController.X() // Creates a new Trigger object for the `X` button on exampleCommandController
  ```

### JoystickButton

Alternatively, the :ref:`regular HID classes <docs/software/basic-programming/joystick:Joysticks>` can be used and passed to create an instance of ``JoystickButton`` [Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/button/JoystickButton.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc2_1_1_joystick_button.html)), a constructor-only subclass of ``Trigger``:

.. tab-set-code::

  ```java
  XboxController exampleController = new XboxController(2); // Creates an XboxController on port 2.
  Trigger yButton = new JoystickButton(exampleController, XboxController.Button.kY.value); // Creates a new JoystickButton object for the `Y` button on exampleController
  ```

  ```c++
  frc::XboxController exampleController{2} // Creates an XboxController on port 2
  frc2::JoystickButton yButton(&exampleStick, frc::XboxController::Button::kY); // Creates a new JoystickButton object for the `Y` button on exampleController
  ```

### Arbitrary Triggers

While binding to HID buttons is by far the most common use case, users may want to bind commands to arbitrary triggering events. This can be done inline by passing a lambda to the constructor of ``Trigger``:

.. tab-set-code::

  ```java
  DigitalInput limitSwitch = new DigitalInput(3); // Limit switch on DIO 3
  Trigger exampleTrigger = new Trigger(limitSwitch::get);
  ```

  ```c++
  frc::DigitalInput limitSwitch{3}; // Limit switch on DIO 3
  frc2::Trigger exampleTrigger([&limitSwitch] { return limitSwitch.Get(); });
  ```

## Trigger Bindings

.. note:: The C++ command-based library offers two overloads of each button binding method - one that takes an [rvalue reference](https://learn.microsoft.com/en-us/cpp/cpp/rvalue-reference-declarator-amp-amp?view=msvc-170) (``CommandPtr&&``), and one that takes a raw pointer (``Command*``).  The rvalue overload moves ownership to the scheduler, while the raw pointer overload leaves the user responsible for the lifespan of the command object.  It is recommended that users preferentially use the rvalue reference overload unless there is a specific need to retain a handle to the command in the calling code.

There are a number of bindings available for the ``Trigger`` class. All of these bindings will automatically schedule a command when a certain trigger activation event occurs - however, each binding has different specific behavior.

``Trigger`` objects *do not need to survive past the call to a binding method*, so the binding methods may be simply called on a temp. Remember that button binding is *declarative*: bindings only need to be declared once, ideally some time during robot initialization. The library handles everything else.

.. note:: The ``Button`` subclass is deprecated, and usage of its binding methods should be replaced according to the respective deprecation messages in the API docs.

### onTrue

This binding schedules a command when a trigger changes from ``false`` to ``true`` (or, accordingly, when a button changes is initially pressed). The command will be scheduled on the iteration when the state changes, and will not be scheduled again unless the trigger becomes ``false`` and then ``true`` again (or the button is released and then re-pressed).

.. tab-set-code::


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/RapidReactCommandBot.java
      :language: java
      :lines: 65-66
      :lineno-match:


    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/cpp/RapidReactCommandBot.cpp
      :language: c++
      :lines: 28-29
      :lineno-match:

The ``onFalse`` binding is identical, only that it schedules on ``false`` instead of on ``true``.

### whileTrue

This binding schedules a command when a trigger changes from ``false`` to ``true`` (or, accordingly, when a button is initially pressed) and cancels it when the trigger becomes ``false`` again (or the button is released). The command will *not* be re-scheduled if it finishes while the trigger is still ``true``. For the command to restart if it finishes while the trigger is ``true``, wrap the command in a ``RepeatCommand``, or use a ``RunCommand`` instead of an ``InstantCommand``.

.. tab-set-code::

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/templates/commandbased/RobotContainer.java
    :language: java
    :lines: 49-51
    :lineno-match:

  .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/templates/commandbased/cpp/RobotContainer.cpp
    :language: c++
    :lines: 27-29
    :lineno-match:

The ``whileFalse`` binding is identical, only that it schedules on ``false`` and cancels on ``true``.

### toggleOnTrue

This binding toggles a command, scheduling it when a trigger changes from ``false`` to ``true`` (or a button is initially pressed), and canceling it under the same condition if the command is currently running. Note that while this functionality is supported, toggles are not a highly-recommended option for user control, as they require the driver to keep track of the robot state.  The preferred method is to use two buttons; one to turn on and another to turn off.  Using a [StartEndCommand](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/StartEndCommand.html) or a [ConditionalCommand](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj2/command/ConditionalCommand.html) is a good way to specify the commands that you want to be want to be toggled between.

.. tab-set-code::

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/rapidreactcommandbot/RapidReactCommandBot.java
      :language: java
      :lines: 78-79
      :lineno-match:

    .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/RapidReactCommandBot/cpp/RapidReactCommandBot.cpp
      :language: c++
      :lines: 41-43
      :lineno-match:

The ``toggleOnFalse`` binding is identical, only that it toggles on ``false`` instead of on ``true``.

## Chaining Calls

It is useful to note that the command binding methods all return the trigger that they were called on, and thus can be chained to bind multiple commands to different states of the same trigger. For example:

.. tab-set-code::

  ```java
  exampleButton
      // Binds a FooCommand to be scheduled when the button is pressed
      .onTrue(new FooCommand())
      // Binds a BarCommand to be scheduled when that same button is released
      .onFalse(new BarCommand());
  ```

  ```c++
  exampleButton
      // Binds a FooCommand to be scheduled when the button is pressed
      .OnTrue(FooCommand().ToPtr())
      // Binds a BarCommand to be scheduled when that same button is released
      .OnFalse(BarCommand().ToPtr());
  ```

## Composing Triggers

The ``Trigger`` class can be composed to create composite triggers through the ``and()``, ``or()``, and ``negate()`` methods (or, in C++, the ``&&``, ``||``, and ``!`` operators). For example:

.. tab-set-code::

  ```java
  // Binds an ExampleCommand to be scheduled when both the 'X' and 'Y' buttons of the driver gamepad are pressed
  exampleCommandController.x()
      .and(exampleCommandController.y())
      .onTrue(new ExampleCommand());
  ```

  ```c++
  // Binds an ExampleCommand to be scheduled when both the 'X' and 'Y' buttons of the driver gamepad are pressed
  (exampleCommandController.X()
      && exampleCommandController.Y())
      .OnTrue(ExampleCommand().ToPtr());
  ```

## Debouncing Triggers

To avoid rapid repeated activation, triggers (especially those originating from digital inputs) can be debounced with the :ref:`WPILib Debouncer class <docs/software/advanced-controls/filters/debouncer:Debouncer>` using the `debounce` method:

.. tab-set-code::

  ```java
  // debounces exampleButton with a 0.1s debounce time, rising edges only
  exampleButton.debounce(0.1).onTrue(new ExampleCommand());
  // debounces exampleButton with a 0.1s debounce time, both rising and falling edges
  exampleButton.debounce(0.1, Debouncer.DebounceType.kBoth).onTrue(new ExampleCommand());
  ```

  ```c++
  // debounces exampleButton with a 100ms debounce time, rising edges only
  exampleButton.Debounce(100_ms).OnTrue(ExampleCommand().ToPtr());
  // debounces exampleButton with a 100ms debounce time, both rising and falling edges
  exampleButton.Debounce(100_ms, Debouncer::DebounceType::Both).OnTrue(ExampleCommand().ToPtr());
  ```

