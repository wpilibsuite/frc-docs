Functions as Data
=================

Regardless of programming language, one of the first things anyone learns to do when programming a computer is to write a function (also known as a "method" or a "subroutine").  Functions are a fundamental part of organized code - writing functions lets us avoid duplicating the same piece of code over and over again.  Instead of writing duplicated sections of code, we call a single function that contains the code we want to execute from multiple places.  If the section of code needs some additional information about its surrounding context to run, we pass those to the function as parameters.

Sometimes, we need to pass functions from one part of the code to another part of the code.  This might seem like a strange concept, if we're used to thinking of functions as part of a class definition rather than objects in their own right.  But at a basic level, functions are just data - in the same way we can store an ``integer`` or a ``double`` as a variable and pass it around our program, we can do the same thing with a function.  A variable whose value is a function is called a "functional interface" in Java, and a "function pointer" or "functor" in C++.

Why Would We Want to Treat Functions as Data?
---------------------------------------------

Typically, we have a need to treat functions as data when the function needs to be called from somewhere other than where it was defined in the code.

For example, the Command-based framework <TODO: link> is built on ``Command`` objects that refer to methods defined on various ``Subsystem`` classes.  Many of the included ``Command`` types (such as ``InstantCommand`` and ``RunCommand``) work with *any* function - not just functions associated with a single ``Subsystem``.  To support building commands generically, we need to support passing functions from a ``Subsystem`` (which interacts with the hardware) to a ``Command`` (which interacts with the scheduler).

Treating Functions as Data in Java
----------------------------------

Java represents functions-as-data as instances of "functional interfaces" <TODO: link to docs>.  A functional interface is a special kind of class that has only a single method - since Java was originally designed strictly for object-oriented programming, it has no way of representing a single function detached from a class - instead, it defines a particular group of classes that *only* represent single functions.

This might sound complicated, but in the context of WPILib we don't really need to worry much about using the functional interfaces themselves - the code that does that is internal to WPILib.  Instead, all we need to know is how to pass a function that we've written to a method that takes a functional interface as a parameter.  For a simple example, consider the signature of ``Commands.runOnce`` (which creates an ``InstantCommand`` that, when scheduled, runs the given function once and then terminates):

.. note:: The ``requirements`` parameter is explained in the Command-based documentation, and will not be discussed here <TODO: link>.
.. code-block:: java

   public static CommandBase runOnce(Runnable action, Subsystem... requirements)

``runOnce`` expects us to give it a ``Runnable`` parameter (named ``action``).  A ``Runnable`` is the Java term for a function that takes no parameters and returns no value.  When we call ``runOnce``, we need to give it a function with no parameters and no return value.  There are two ways to do this: we can refer to some existing function using a "method reference", or we can define the function we want inline using a "lambda expression".

Method References
^^^^^^^^^^^^^^^^^

A method reference lets us pass an already-existing function as our ``Runnable``:

.. code-block:: java

   // Create an InstantCommand that runs the `resetEncoders` method of the `drivetrain` object
   Command disableCommand = runOnce(drivetrain::resetEncoders, drivetrain);

The expression ``drivetrain::resetEncoders`` is a reference to the ``resetEncoders`` method of the ``drivetrain`` object.  It is not a method *call* - this line of code does not *itself* reset the encoders of the drivetrain.  Instead, it returns a ``Command`` that will do so *when it is scheduled.*

Remember that in order for this to work, ``resetEncoders`` must be a ``Runnable`` - that is, it must take no parameters and return no value.  So, its signature must look like this:

.. code-block:: java

   // void because it returns no parameters, and has an empty parameter list
   public void resetEncoders()

If the function signature does not match this, Java will not be able to interpret the method reference as a ``Runnable`` and the code will not compile.

Lambda Expressions
^^^^^^^^^^^^^^^^^^

If we do not already have a named function that does what we want, we can define a function "inline" - that means, right inside of the call to ``runOnce``!  We do this by writing our function with a special syntax that uses an "arrow" symbol to link the argument list to the function body:

.. code-block:: java

   // Create an InstantCommand that runs the drive forward at half speed 
   Command disableCommand = runOnce(() -> { drive.arcadeDrive(0.5, 0.0); });

Java calls this a "lambda expression"; it may be less-confusingly called an "arrow function", "inline function", or "anonymous function" (because it has no name).  While this may look a bit funky, it is just another way of writing a function - the parentheses before the arrow are the function's argument list, and the code contained in the brackets is the function body.

Note that our inline function still has to be a ``Runnable`` - notice that it takes no arguments and has no return statement.  If it did not match the ``Runnable`` contract, our code would fail to compile.

Capturing State in Lambda Expressions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In the above example, our function body references an object that lives outside of the function itself (namely, the ``drive`` object).  This is called a "capture" of a variable from the surrounding code (which is sometimes called the "outer scope" or "enclosing scope").  Usually the captured variables are either local variables from the enclosing method body in which the lambda expression is defined, or else fields of an enclosing class definition in which that method is defined.

In Java capturing state is a fairly safe thing to do in general, with one major caveat: we can only capture state that is "effectively final".  That means it is only legal to capture a variable from the enclosing scope if that variable is never reassigned after initialization.  Note that this does not mean that the captured state cannot change: Remember that Java objects are references, so the object that the reference *points to* may change after capture - but the reference itself cannot be made to point to another object.

This means we can only capture primitive types (like ``int``, ``double``, and ``boolean``) if they're constants.  If we want to capture a state variable that can change, it *must be wrapped in a mutable object*.