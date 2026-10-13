# Treating Functions as Data

Regardless of programming language, one of the first things anyone learns to do when programming a computer is to write a function (also known as a "method" or a "subroutine").  Functions are a fundamental part of organized code - writing functions lets us avoid duplicating the same piece of code over and over again.  Instead of writing duplicated sections of code, we call a single function that contains the code we want to execute from multiple places (provided we named the function well, the function name is also easier to read than the code itself!).  If the section of code needs some additional information about its surrounding context to run, we pass those to the function as "parameters", and if it needs to yield something back to the rest of the code once it finishes, we call that a "return value" (together, the parameters and return value are called the function's "signature");

Sometimes, we need to pass functions from one part of the code to another part of the code.  This might seem like a strange concept, if we're used to thinking of functions as part of a class definition rather than objects in their own right.  But at a basic level, functions are just data - in the same way we can store an ``integer`` or a ``double`` as a variable and pass it around our program, we can do the same thing with a function.  A variable whose value is a function is called a "functional interface" in Java, and a "function pointer" or "functor" in C++.

## Why Would We Want to Treat Functions as Data?

Typically, code that calls a function is coupled to (depends on) the definition of the function. While this occurs all the time, it becomes problematic when the code *calling* the function (for example, WPILib) is developed independently and without direct knowledge of the code that *defines* the function (for example, code from an FRC team). Sometimes we solve this challenge through the use of class interfaces, which define collections of data and functions that are meant to be used together.  However, often we really only have a dependency on a *single function*, rather than on an *entire class*.

For example, WPILib offers several ways for users to execute certain code whenever a joystick button is pressed - one of the easiest and cleanest ways to do this is to allow the user to *pass a function* to one of the WPILib joystick methods.  This way, the user only has to write the code that deals with the interesting and team-specific things (e.g., "move my robot arm") and not the boring, error-prone, and universal thing ("properly read button inputs from a standard joystick").

For another example, the :ref:`Commands v2 framework <docs/software/commandbased/commands-v2/what-is-command-based:What Is "Command-Based" Programming?>` is built on ``Command`` objects that refer to methods defined on various ``Subsystem`` classes.  Many of the included ``Command`` types (such as ``InstantCommand`` and ``RunCommand``) work with *any* function - not just functions associated with a single ``Subsystem``.  To support building commands generically, we need to support passing functions from a ``Subsystem`` (which interacts with the hardware) to a ``Command`` (which interacts with the scheduler).

In these cases, we want to be able to pass a single function as a piece of data, as if it were a variable - it doesn't make sense to ask the user to provide an entire class, when we really just want them to give us a single appropriately-shaped function.

It's important that *passing* a function is not the same as *calling* a function.  When we call a function, we execute the code inside of it and either receive a return value, cause some side-effects elsewhere in the code, or both.  When we *pass* a function, nothing in particular happens *immediately.*  Instead, by passing the function we are allowing some *other* code to call the function *in the future.*  Seeing the name of a function in code does not always mean that the code in the function is being run!

Inside of code that passes a function, we will see some syntax that either refers to the name of an existing function in a special way, or else defines a new function to be passed inside of the call expression.  The specific syntax needed (and the rules around it) depends on which programming language we are using.

## Treating Functions as Data in Java

Java represents functions-as-data as instances of [functional interfaces](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html).  A "functional interface" is a special kind of interface that has only a single abstract method - since Java was originally designed strictly for object-oriented programming, it has no way of representing a single function detached from a class.  Instead, it defines a particular group of classes that *only* represent single functions.  Each type of function signature has its own functional interface, which is an interface with a single function definition of that signature.

This might sound complicated, but in the context of WPILib we don't really need to worry much about defining functional interfaces ourselves - the code that does that is internal to WPILib.  Instead, all we need to know is how to pass a function that we've written to a method that takes a functional interface as a parameter.

### Evolution of Callbacks in Java

To understand why lambda expressions exist, consider a method that accepts a callback to decide when to stop executing:

```java
/**
 * Runs until a user-supplied callback tells us to stop.
 */
public void runUntil(BooleanSupplier stop) {
  int counter = 0;
  while (!stop.getAsBoolean()) {
    counter += 1;
    System.out.println("Still going at iteration " + counter + "!");
  }
}
```

Java has evolved through three main approaches to passing behavior like this:

#### 1. Named Classes (pre-Java 8)

In early versions of Java, passing behavior required defining a named class that implemented the desired interface:

```java
public class RandomCondition implements BooleanSupplier {
  @Override
  public boolean getAsBoolean() {
    return Math.random() >= 0.5;
  }
}

// Usage
runUntil(new RandomCondition());
```

This approach is verbose and requires creating separate top-level or inner classes even for trivial, one-off logic.

#### 2. Anonymous Inner Classes (pre-Java 8)

Java later allowed defining classes inline where they are needed without giving them a name:

```java
runUntil(new BooleanSupplier() {
  @Override
  public boolean getAsBoolean() {
    return Math.random() >= 0.5;
  }
});
```

While this keeps the logic close to the call site, it still introduces boilerplate (repeating the interface name, method signature, and annotations) for what is fundamentally a single expression.

#### 3. Lambda Expressions (Java 8 and later)

Lambda expressions eliminate this boilerplate by focusing entirely on the input parameters and the executable body:

```java
runUntil(() -> Math.random() >= 0.5);
```

Because ``BooleanSupplier`` has only one method that takes no arguments and returns a ``boolean``, the Java compiler can infer all required type information directly from context.

### Passing Existing Methods: Method References

For a simple WPILib example, consider the signature of ``Commands.runOnce`` (which creates an ``InstantCommand`` that, when scheduled, runs the given function once and then terminates):

.. note:: The ``requirements`` parameter is explained in the :ref:`Commands v2 documentation <docs/software/commandbased/commands-v2/commands:getRequirements>`, and will not be discussed here.

```java
public static Command runOnce(Runnable action, Subsystem... requirements)
```

``runOnce`` expects us to give it a ``Runnable`` parameter (named ``action``).  A ``Runnable`` is the standard Java functional interface for a function that takes no parameters and returns no value.  When we call ``runOnce``, we need to give it a function with no parameters and no return value.  There are two ways to do this: we can refer to some existing function using a "method reference", or we can define the function we want inline using a lambda expression.

### Method References

A method reference lets us pass an already-existing function as our ``Runnable``:

```java
// Create an InstantCommand that runs the `resetEncoders` method of the `drivetrain` object
Command disableCommand = runOnce(drivetrain::resetEncoders, drivetrain);
```

The expression ``drivetrain::resetEncoders`` is a reference to the ``resetEncoders`` method of the ``drivetrain`` object.  It is not a method *call* - this line of code does not *itself* reset the encoders of the drivetrain.  Instead, it returns a ``Command`` that will do so *when it is scheduled.*

Remember that in order for this to work, ``resetEncoders`` must match the ``Runnable`` signature: it must take no parameters and return no value:

```java
// void because it returns no value, and has an empty parameter list
public void resetEncoders()
```

If the function signature does not match the functional interface, Java will not be able to interpret the method reference as a ``Runnable`` and the code will not compile.  Note that all we need to do is make sure that the signature matches the signature of the single method in the ``Runnable`` functional interface - we don't need to *explicitly* name it as a ``Runnable``.

### Lambda Expressions in Java

If we do not already have a named function that does what we want, we can define a function inline right inside the call to ``runOnce`` using a lambda expression:

```java
// Create an InstantCommand that runs the drive forward at half speed
Command driveHalfSpeed = runOnce(() -> { drivetrain.arcadeDrive(0.5, 0.0); }, drivetrain);
```

Java calls ``() -> { drivetrain.arcadeDrive(0.5, 0.0); }`` a "lambda expression" (also known as an "arrow function" or "anonymous function"). A lambda expression separates the parameter list from the body using an arrow (``->``):

```java
(param1, param2, ..., paramN) -> {
  ... body ...
  return result;
}
```

Java infers the return type and parameter types automatically based on the functional interface expected by the method being called (its "target type").

#### Capturing State in Java Lambda Expressions

In the above example, our function body references an object that lives outside of the function itself (namely, the ``drivetrain`` object).  This is called a "capture" of a variable from the surrounding code (which is sometimes called the "outer scope" or "enclosing scope").  Usually the captured variables are either local variables from the enclosing method body in which the lambda expression is defined, or else fields of an enclosing class definition in which that method is defined.

In Java capturing state is a fairly safe thing to do in general, with one major caveat: we can only capture state that is "effectively final".  That means it is only legal to capture a variable from the enclosing scope if that variable is never reassigned after initialization.  Note that this does not mean that the captured state cannot change: Remember that Java objects are references, so the object that the reference *points to* may change after capture - but the reference itself cannot be made to point to another object.

This means we can only capture primitive types (like ``int``, ``double``, and ``boolean``) if they're constants.  If we want to capture a state variable that can change, it *must be wrapped in a mutable object*.

### Syntactic Sugar for Java Lambda Expressions

Java provides several shortcuts to make lambda expressions concise and readable:

#### Omitting Function Body Brackets for One-Line Lambdas

If the function body of our lambda expression is only one line, Java lets us omit the curly braces around the function body as well as the trailing semicolon and ``return`` keyword:

```java
// Create an InstantCommand that runs the drive forward at half speed
Command driveHalfSpeed = runOnce(() -> drivetrain.arcadeDrive(0.5, 0.0), drivetrain);
```

#### Omitting Parameter Types

The compiler automatically infers the types of lambda parameters from the functional interface signature, so parameter types can be omitted:

```java
// Explicit parameter types:
(double value) -> Math.sqrt(value)

// Inferred parameter types:
(value) -> Math.sqrt(value)
```

#### Omitting Parentheses around Single Lambda Parameters

If the lambda expression accepts exactly one parameter, parentheses around the parameter name can also be omitted:

```java
// Parameter parentheses omitted:
IntConsumer exampleLambda = a -> System.out.println(a);
```

#### Unused Parameters (``_``)

When a functional interface requires a parameter that is not needed in the lambda body, modern Java allows naming the unused parameter with an underscore (``_``) to indicate to readers and the compiler that it is intentionally ignored:

```java
// Ignoring an unused parameter
DoubleConsumer ignoreInput = _ -> System.out.println("Triggered!");
```

## Treating Functions as Data in C++

C++ has a number of ways to treat functions as data.  For the sake of this article, we'll only talk about the parts that are relevant to using WPILibC.

In WPILibC, function types are represented with the ``std::function`` class (https://en.cppreference.com/w/cpp/utility/functional/function).  This standard library class is templated on the function's signature - that means we have to provide it a [function type](https://stackoverflow.com/questions/17446220/c-function-types) as a template parameter to specify the signature of the function (compare this to :ref:`Java <docs/software/basic-programming/functions-as-data:Treating Functions as Data in Java>` above, where we have a separate interface type for each kind of signature).

This sounds a lot more complicated than it is to use in practice.  Let's look at the call signature of ``cmd::RunOnce`` (which creates an ``InstantCommand`` that, when scheduled, runs the given function once and then terminates):

.. note:: The ``requirements`` parameter is explained in the :ref:`Commands v2 documentation <docs/software/commandbased/commands-v2/commands:getRequirements>`, and will not be discussed here.

```c++
CommandPtr RunOnce(
 std::function<void()> action,
 Requirements requirements);
```

``runOnce`` expects us to give it a ``std::function<void()>`` parameter (named ``action``).  A ``std::function<void()>`` is the C++ type for a ``std::function`` that takes no parameters and returns no value (the template parameter, ``void()``, is a function type with no parameters and no return value).  When we call ``runOnce``, we need to give it a function with no parameters and no return value.  C++ lacks a clean way to refer to existing class methods in a way that can automatically be converted to a ``std::function``, so the typical way to do this is to define a new function inline with a "lambda expression".

### Lambda Expressions in C++

To pass a function to ``runOnce``, we need to write a short inline function expression using a special syntax that resembles ordinary C++ function declarations, but varies in a few important ways:

```c++
// Create an InstantCommand that runs the drive forward at half speed
CommandPtr driveHalfSpeed = cmd::RunOnce([this] { drivetrain.ArcadeDrive(0.5, 0.0); }, {drivetrain});
```

C++ calls ``[captures] (params) { body; }`` a "lambda expression".  It has three parts: a *capture list* (square brackets), an optional *parameter list* (parentheses), and a *function body* (curly brackets).  It may look a little strange, but the only real difference between a lambda expression and an ordinary function (apart from the lack of a function name) is the addition of the capture list.

Since ``RunOnce`` wants a function with no parameters and no return value, our lambda expression has no parameter list and no return statement.  The "lambda expression" here represents a function that calls ``drivetrain.ArcadeDrive`` with a specific set of parameters - note again that the above code does not *call* the function, but merely defines it and passes it to the ``Command`` to be run later when the ``Command`` is scheduled.

#### Capturing State in C++ Lambda Expressions

In the above example, our function body references an object that lives outside of the function itself (namely, the ``drivetrain`` object).  This is called a "capture" of a variable from the surrounding code (which is sometimes called the "outer scope" or "enclosing scope").  Usually the captured variables are either local variables from the enclosing method body in which the lambda expression is defined, or else fields of an enclosing class definition in which that method is defined.

C++ has somewhat more-powerful semantics than Java.  One cost of this is that we generally need to give the C++ compiler some help to figure out *how exactly* we want it to capture state from the enclosing scope.  This is the purpose of the *capture list*.  For the purposes of using the WPILibC Commands v2 framework, it is usually sufficient to use a capture list of ``[this]``, which gives access to members of the enclosing class by capturing the enclosing class's ``this`` pointer by value.

Method locals cannot be captured with the ``this`` pointer, and must be captured explicitly either by reference or by value by including them in the capture list (or by implicitly by instead specifying a default capture semantics).  It is typically safer to capture locals by-value, since a lambda can outlive the lifespan of an object it captures by reference.  For more details, consult the [C++ standard library documentation on capture semantics](https://en.cppreference.com/w/cpp/language/lambda#Lambda_capture).
