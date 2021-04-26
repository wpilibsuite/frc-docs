Robots Shouldn't Quit, But Yours Did!
=====================================

When your robot code hits an *unexpected error*, you will see this message show up in some console output (Driver Station or rioLog). You'll probably also notice your robot abruptly stop, or possibly never move.

These unexpected errors are called "unhandled exceptions".

When this occurs, it means that your code has one or more bugs which need to be fixed!

This article will explore some of the tools and techniques involved in finding those bugs.

What's a Stack Trace?
---------------------

The ``robots don't quit`` message is your signal that a *stack trace* has been printed out. 

In C++ and Java, a `stack <https://en.wikipedia.org/wiki/Call_stack>`_ data structure is used to store information about which function or method is currently being executed.



A *stack trace* prints information about what was on this stack when the unhandled exception occurred.

This points you to the last lines of code which were run before the unhandled exception occurred.

While it doesn't always point you to the exact *root cause* of your issue, it's usually the best place to start looking.

What's an "Unhandled Exception"?
--------------------------------

An unrecoverable error is any condition which arises where the processor cannot continue executing code. It almost always implies that, even though the code compiled and started running, it no longer makes sense for execution to continue.

In almost all cases, the root cause of an unhandled exception is code that isn't correctly implemented. It almost never implies that any hardware has malfunctioned.

Common Examples & Patterns
^^^^^^^^^^^^^^^^^^^^^^^^^^

There are a number of common issues which result in runtime exceptions. 

Null 
""""

Both C++ and Java have the concept of "null" - a reference which has not yet been initialized, and does not refer to anything meaningful.

Manipulating a "null" reference will produce a runtime error.

For example, consider the following code:


This will produce the following stack trace:



Generally, you will want to ensure each reference has been initialized before using it.

Divide by Zero
""""""""""""""

It is not generally possible to divide an integer by zero, and expect reasonable results. Most processors (including the RoboRIO) will cause an Unhandled Exception.

HAL Resource Already Allocated
""""""""""""""""""""""""""""""

A very common FRC-specific error occurs when the code attempts to put two hardware-related 


So How Do I Fix My Issue?
-------------------------

Reading the Stack Trace
^^^^^^^^^^^^^^^^^^^^^^^

Code Analysis
^^^^^^^^^^^^^


Single Step Debugger
^^^^^^^^^^^^^^^^^^^^

Searching for More Information
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Seeking Help
^^^^^^^^^^^^
