# Using Lambda Functions

Lambda functions are a way of passing code to a function for *that* function to execute when it needs it. Java allows any object that could be an interface with a single method (a so-called "functional interface") to be written instead using a lambda function to improve readability and performance.

Commands v3 uses lambda functions heavily because command builders need to be supplied with behavior to execute. Note that a command created with a builder does not run its lambdas immediately, but stores them for the command to execute once it is scheduled.

.. note:: For a general introduction to treating functions as data in Java, including the evolution of callbacks, lambda syntax, and language shorthand rules, see :doc:`/docs/software/basic-programming/functions-as-data`.

The commonly used functional interfaces in v3 are:

- ``Consumer<Coroutine>`` - a function that accepts a ``Coroutine`` input with no return value. Used when defining command bodies with the builder API. Every occurrence of ``run(coroutine -> ... )`` is a ``Consumer<Coroutine>``.
- ``Runnable`` - a function with no inputs and no return value. Used when setting ``whenCanceled``, ``whenExited``, and for ``runRepeatedly(() -> ... )``.
- ``BooleanSupplier`` - a function with no inputs that returns a ``boolean`` value. Heavily used by :doc:`triggers` and for coroutine ``waitUntil(() -> ...)``.

```java
public Command countingCommand(int count) {
  return Command.noRequirements(coroutine -> {
    // The command body is written as a lambda function accepting a Coroutine argument.
    // The lambda function will execute after the command is scheduled.
    for (int i = 1; i <= count; i++) {
      System.out.println("Counted to " + i);
      coroutine.yield();
    }
  }).named("Count to " + count);
}
```

## How Commands Use Lambda Functions

Command builders are based around providing a lambda function for the logic that the command will run. ``Command.noRequirements()`` and ``Command.requiring(...).executing()`` both accept lambda functions for the command logic. These lambda functions accept a single ``Coroutine`` argument and perform whatever command logic is needed.

.. note:: If a command does not need the coroutine parameter, name it ``_`` to make that clear to readers and to the compiler.

```java
public Command printingCommand(String output) {
  // This command doesn't need the Coroutine parameter, so we name it with an underscore to keep
  // our code concise.
  return Command.noRequirements(_ -> System.out.println(output))
           .named("Debug Print");
}
```

The optional ``whenCanceled()`` and ``whenExited()`` builder methods also accept lambda functions (as ``Runnable`` instances) with no arguments:

```java
public Command driveDistance(double distance) {
  return run(coroutine -> {
    while (encoder.getDistance() < distance) {
      motor.setVoltage(8);
      coroutine.yield();
    }
  }).whenExited(() -> motor.setVoltage(0))
    .named("Drive Distance: " + distance);
}
```
