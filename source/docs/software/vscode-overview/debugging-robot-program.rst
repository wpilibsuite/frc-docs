Debugging a Robot Program
=========================

Inevitably, a program will not behave in the way we expect it to behave.  When this occurs, it becomes necessary to figure out why the program is doing what it is doing, so that we can make it do what we want it to do, instead.  Such an undesired program behavior is called a "bug," and this process is called "debugging."

A debugger is a tool used to control program flow and monitor variables in order to assist in debugging a program. This section will describe how to set up a debug session for an FRC robot program.

.. note:: For beginning users who need to debug their programs but do not know/have time to learn how to use a debugger, it is often possible to debug a program simply by printing the relevant program state to the console.  However, it is strongly recommended that students eventually learn to use a debugger.

Running the Debugger
--------------------

|Start Debugging|

Press Ctrl+Shift+P and type WPILib or click on the WPILib Menu item to open the Command palette with WPILib pre-populated. Type Debug and select the Debug Robot Code menu item to start debugging. The code will download to the roboRIO and begin debugging.

Breakpoints
-----------

A "breakpoint" is a line of code at which the debugger will pause the program execution so that the user can examine the program state.  This is extremely useful while debugging, as it allows the user to pause the program at specific points in problematic code to determine where exactly the program is deviating from the expected behavior.

The debugger will automatically pause at the first breakpoint it encounters.

Setting a Breakpoint
~~~~~~~~~~~~~~~~~~~~

|Setting a Breakpoint|

Click in the left margin of the source code window (to the left of the line number) to set a breakpoint in your user program: A small red circle indicates the breakpoint has been set on the corresponding line.

Debugging with Console
----------------------
Another way to debug your program is to use print statements in your code and view them using the RioLog in Visual Studio Code or the Driver Station.

.. tabs::

    .. code-tab:: java

        System.out.print("example");      

    .. code-tab:: c++

        void RobotInit() {}

Learn More
----------

To learn more about debugging with VS Code see this `link <https://code.visualstudio.com/docs/editor/debugging>`__.

.. |Setting a Breakpoint| image:: images/debugging-robot-program/setting-a-breakpoint.png
.. |Start Debugging| image:: images/debugging-robot-program/start-debugging.png
