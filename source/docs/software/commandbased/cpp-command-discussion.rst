# A Technical Discussion on C++ Commands
.. note:: This article assumes that you have a fair understanding of advanced C++ concepts, including templates, smart pointers, inheritance, rvalue references, copy semantics, move semantics, and CRTP.  You do not need to understand the information within this article to use the command-based framework in your robot code.

This article will help you understand the reasoning behind some of the decisions made in the 2020 command-based framework (such as the use of ``std::unique_ptr``, CRTP in the form of ``CommandHelper<Base, Derived>``, etc.).  You do not need to understand the information within this article to use the command-based framework in your robot code.

.. note:: The model was further changed in 2023, as described :ref:`below <docs/software/commandbased/cpp-command-discussion:2023 Updates>`.

## Ownership Model
The old command-based framework employed the use of raw pointers, meaning that users had to use ``new`` (resulting in manual heap allocations) in their robot code. Since there was no clear indication on who owned the commands (the scheduler, the command groups, or the user themselves), it was not apparent who was supposed to take care of freeing the memory.

Several examples in the old command-based framework involved code like this:

```c++
#include "PlaceSoda.h"
#include "Elevator.h"
#include "Wrist.h"
PlaceSoda::PlaceSoda() {
  AddSequential(new SetElevatorSetpoint(Elevator::TABLE_HEIGHT));
  AddSequential(new SetWristSetpoint(Wrist::PICKUP));
  AddSequential(new OpenClaw());
}
```

In the command-group above, the component commands of the command group were being heap allocated and passed into ``AddSequential`` all in the same line. This meant that user had no reference to that object in memory and therefore had no means of freeing the allocated memory once the command group ended. The command group itself never freed the memory and neither did the command scheduler. This led to memory leaks in robot programs (i.e. memory was allocated on the heap but never freed).

This glaring problem was one of the reasons for the rewrite of the framework. A comprehensive ownership model was introduced with this rewrite, along with the usage of smart pointers which will automatically free memory when they go out of scope.

Default commands are owned by the command scheduler whereas component commands of command compositions are owned by the command composition. Other commands are owned by whatever the user decides they should be owned by (e.g. a subsystem instance or a ``RobotContainer`` instance). This means that the ownership of the memory allocated by any commands or command compositions is clearly defined.

### ``std::unique_ptr`` vs. ``std::shared_ptr``
Using ``std::unique_ptr`` allows us to clearly determine who owns the object. Because an ``std::unique_ptr`` cannot be copied, there will never be more than one instance of a ``std::unique_ptr`` that points to the same block of memory on the heap. For example, a constructor for ``SequentialCommandGroup`` takes in a ``std::vector<std::unique_ptr<Command>>&&``. This means that it requires an rvalue reference to a vector of ``std::unique_ptr<Command>``. Let's go through some example code step-by-step to understand this better:

```c++
// Let's create a vector to store our commands that we want to run sequentially.
std::vector<std::unique_ptr<Command>> commands;
// Add an instant command that prints to the console.
commands.emplace_back(std::make_unique<InstantCommand>([]{ std::cout << "Hello"; }, requirements));
// Add some other command: this can be something that a user has created.
commands.emplace_back(std::make_unique<MyCommand>(args, needed, for, this, command));
// Now the vector "owns" all of these commands. In its current state, when the vector is destroyed (i.e.
// it goes out of scope), it will destroy all of the commands we just added.
// Let's create a SequentialCommandGroup that will run these two commands sequentially.
auto group = SequentialCommandGroup(std::move(commands));
// Note that we MOVED the vector of commands into the sequential command group, meaning that the
// command group now has ownership of our commands. When we call std::move on the vector, all of its
// contents (i.e. the unique_ptr instances) are moved into the command group.
// Even if the vector were to be destroyed while the command group was running, everything would be OK
// since the vector does not own our commands anymore.
```

With ``std::shared_ptr``, there is no clear ownership model because there can be multiple instances of a ``std::shared_ptr`` that point to the same block of memory. If commands were in ``std::shared_ptr`` instances, a command group or the command scheduler cannot take ownership and free the memory once the command has finished executing because the user might still unknowingly still have a ``std::shared_ptr`` instance pointing to that block of memory somewhere in scope.

## Use of CRTP
You may have noticed that in order to create a new command, you must extend ``CommandHelper``, providing the base class (usually ``frc2::Command``) and the class that you just created. Let's take a look at the reasoning behind this:

### Command Decorators
The new command-based framework includes a feature known as "command decorators", which allows the user to something like this:

```c++
auto task = MyCommand().AndThen([] { std::cout << "This printed after my command ended."; },
  requirements);
```

When ``task`` is scheduled, it will first execute ``MyCommand()`` and once that command has finished executing, it will print the message to the console. The way this is achieved internally is by using a sequential command group.

Recall from the previous section that in order to construct a sequential command group, we need a vector of unique pointers to each command. Creating the unique pointer for the print function is pretty trivial:

```c++
temp.emplace_back(
   std::make_unique<InstantCommand>(std::move(toRun), requirements));
```

Here ``temp`` is storing the vector of commands that we need to pass into the ``SequentialCommandGroup`` constructor. But before we add that ``InstantCommand``, we need to add ``MyCommand()`` to the ``SequentialCommandGroup``. How do we do that?

```c++
temp.emplace_back(std::make_unique<MyCommand>(std::move(*this));
```

You might think it would be this straightforward, but that is not the case. Because this decorator code is in the ``Command`` class, ``*this`` refers to the ``Command`` in the subclass that you are calling the decorator from and has the type of ``Command``. Effectively, you will be trying to move a ``Command`` instead of ``MyCommand``. We could cast the ``this`` pointer to a ``MyCommand*`` and then dereference it but we have no information about the subclass to cast to at compile-time.

### Solutions to the Problem

Our initial solution to this was to create a virtual method in ``Command`` called ``TransferOwnership()`` that every subclass of ``Command`` had to override. Such an override would have looked like this:

```c++
std::unique_ptr<Command> TransferOwnership() && override {
  return std::make_unique<MyCommand>(std::move(*this));
}
```

Because the code would be in the derived subclass, ``*this`` would actually point to the desired subclass instance and the user has the type info of the derived class to make the unique pointer.

After a few days of deliberation, a CRTP method was proposed. Here, an intermediary derived class of ``Command`` called ``CommandHelper`` would exist. ``CommandHelper`` would have two template arguments, the original base class and the desired derived subclass. Let's take a look at a basic implementation of ``CommandHelper`` to understand this:

```c++
// In the real implementation, we use SFINAE to check that Base is actually a
// Command or a subclass of Command.
template<typename Base, typename Derived>
class CommandHelper : public Base {
  // Here, we are just inheriting all of the superclass (base class) constructors.
  using Base::Base;
  // Here, we will override the TransferOwnership() method mentioned above.
  std::unique_ptr<Command> TransferOwnership() && override {
    // Previously, we mentioned that we had no information about the derived class
    // to cast to at compile-time, but because of CRTP we do! It's one of our template
    // arguments!
    return std::make_unique<Derived>(std::move(*static_cast<Derived*>(this)));
  }
};
```

Thus, making your custom commands extend ``CommandHelper`` instead of ``Command`` will automatically implement this boilerplate for you and this is the reasoning behind asking teams to use what may seem to be a rather obscure way of doing things.

Going back to our ``AndThen()`` example, we can now do the following:

```c++
// Because of how inheritance works, we will call the TransferOwnership()
// of the subclass. We are moving *this because TransferOwnership() can only
// be called on rvalue references.
temp.emplace_back(std::move(*this).TransferOwnership());
```

## Lack of Advanced Decorators
Most of the C++ decorators take in ``std::function<void()>`` instead of actual commands themselves. The idea of taking in actual commands in decorators such as ``AndThen()``, ``BeforeStarting()``, etc. was considered but then abandoned due to a variety of reasons.

### Templating Decorators
Because we need to know the types of the commands that we are adding to a command group at compile-time, we will need to use templates (variadic for multiple commands). However, this might not seem like a big deal. The constructors for command groups do this anyway:

```c++
template <class... Types,
         typename = std::enable_if_t<std::conjunction_v<
             std::is_base_of<Command, std::remove_reference_t<Types>>...>>>
explicit SequentialCommandGroup(Types&&... commands) {
  AddCommands(std::forward<Types>(commands)...);
}
template <class... Types,
         typename = std::enable_if_t<std::conjunction_v<
             std::is_base_of<Command, std::remove_reference_t<Types>>...>>>
void AddCommands(Types&&... commands) {
  std::vector<std::unique_ptr<Command>> foo;
  ((void)foo.emplace_back(std::make_unique<std::remove_reference_t<Types>>(
       std::forward<Types>(commands))),
   ...);
  AddCommands(std::move(foo));
}
```

.. note:: This is a secondary constructor for ``SequentialCommandGroup`` in addition to the vector constructor that we described above.

However, when we make a templated function, its definition must be declared inline. This means that we will need to instantiate the ``SequentialCommandGroup`` in the ``Command.h`` header, which poses a problem. ``SequentialCommandGroup.h`` includes ``Command.h``. If we include ``SequentialCommandGroup.h`` inside of ``Command.h``, we have a circular dependency. How do we do it now then?

We use a forward declaration at the top of ``Command.h``:

```c++
class SequentialCommandGroup;
class Command { ... };
```

And then we include ``SequentialCommandGroup.h`` in ``Command.cpp``. If these decorator functions were templated however, we cannot write definitions in the ``.cpp`` files, resulting in a circular dependency.

### Java vs C++ Syntax
These decorators usually save more verbosity in Java (because Java requires raw ``new`` calls) than in C++, so in general, it does not make much of a syntanctic difference in C++ if you create the command group manually in user code.

## 2023 Updates

After a few years in the new command-based framework, the recommended way to create commands increasingly shifted towards inline commands, decorators, and factory methods. With this paradigm shift, it became evident that the C++ commands model introduced in 2020 and described above has some pain points when used according to the new recommendations.

A significant root cause of most pain points was commands being passed by value in a non-polymorphic way. This made object slicing mistakes rather easy, and changes in composition structure could propagate type changes throughout the codebase: for example, if a ``ParallelRaceGroup`` were changed to a ``ParallelDeadlineGroup``, those type changes would propagate through the codebase. Passing around the object as a ``Command`` (as done in Java) would result in object slicing.

Additionally, various decorators weren't supported in C++ due to reasons described :ref:`above <docs/software/commandbased/cpp-command-discussion:Templating Decorators>`. As long as decorators were rarely used and were mainly to reduce verbosity (where Java was more verbose than C++), this was less of a problem. Once heavy usage of decorators was recommended, this became more of an issue.

### ``CommandPtr``

Let's recall the mention of ``std::unique_ptr`` far above: a value type with only move semantics. This is the ownership model we want!

However, plainly using ``std::unique_ptr<Command>`` had some drawbacks. Primarily, implementing decorators would be impossible: ``unique_ptr`` is defined in the standard library so we can't define methods on it, and any methods defined on ``Command`` wouldn't have access to the owning ``unique_ptr``.

The solution is ``CommandPtr``: a move-only value class wrapping ``unique_ptr``, that we can define methods on.

Commands should be passed around as ``CommandPtr``, using ``std::move``. All decorators, including those not supported in C++ before, are defined on ``CommandPtr`` with rvalue-this. The use of rvalues, move-only semantics, and clear ownership makes it very easy to avoid mistakes such as adding the same command instance to more than one :doc:`command composition <command-compositions>`.

In addition to decorators, ``CommandPtr`` instances also define utility methods such as ``Schedule()``, ``IsScheduled()``. ``CommandPtr`` instances can be used in nearly almost every way command objects can be used in Java: they can be moved into trigger bindings, default commands, and so on. For the few things that require a ``Command*`` (such as non-owning trigger bindings), a raw pointer to the owned command can be retrieved using ``get()``.

There are multiple ways to get a ``CommandPtr`` instance:

- ``CommandPtr``-returning factories are present in the ``frc2::cmd`` namespace in the ``Commands.h`` header for almost all command types. For multi-command compositions, there is a vector-taking overload as well as a variadic-templated overload for multiple ``CommandPtr`` instances.

- All decorators, including those defined on ``Command``, return ``CommandPtr``. This has allowed defining almost all decorators on ``Command``, so a decorator chain can start from a ``Command``.

- A ``ToPtr()`` method has been added to the CRTP, akin to ``TransferOwnership``. This is useful especially for user-defined command classes, as well as other command classes that don't have factories.

For instance, consider the following from the [HatchbotInlined example project](https://github.com/wpilibsuite/allwpilib/blob/v2023.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/):

.. rli:: https://github.com/wpilibsuite/allwpilib/raw/v2026.2.1/wpilibcExamples/src/main/cpp/examples/HatchbotInlined/cpp/commands/Autos.cpp
   :language: c++
   :lines: 33-73
   :lineno-match:

To avoid breakage, command compositions still use ``unique_ptr<Command>``, so ``CommandPtr`` instances can be destructured into a ``unique_ptr<Command>`` using the ``Unwrap()`` rvalue-this method. For vectors, the static ``CommandPtr::UnwrapVector(vector<CommandPtr>)`` function exists.
