Using tabs
==========

Shuffleboard is a tabbed interface. Each tab organizes widgets in a logical grouping. By default, Shuffleboard has tabs for the legacy SmartDashboard and LiveWindow - but new tabs can now be created in Shuffleboard directly from a robot program for better organization.

Creating a new tab

.. tabs::

   .. code-tab:: java

        ShuffleboardTab tab = Shuffleboard.getTab("Tab Title");

   .. code-tab:: c++

        ShuffleboardTab& tab = Shuffleboard::GetTab("Tab Title");


Creating a new tab is as simple as calling a single method on the Shuffleboard class, which will create a new tab on Shuffleboard and return a handle for adding your data to the tab. Calling getTab multiple times with the same tab title will return the same handle each time.

Selecting a tab
---------------

.. tabs::

   .. code-tab:: java

        Shuffleboard.selectTab("Tab Title");

   .. code-tab:: c++

        Shuffleboard::SelectTab("Tab Title");


This method lets a tab be selected by title. This is case-sensitive (so "Tab Title" and "Tab title" are two individual tabs), and only works if a tab with that title exists at the time the method is called, so calling ``selectTab("Example")``\ will only have an effect if a tab named "Example" has previously been defined.

This method can be used to select any tab in Shuffleboard, not just ones created by the robot program.

Caveats
-------

Tabs created from a robot program differ in a few important ways from normal tabs created from the dashboard:

- Not saved in the Shuffleboard save file
- No support for autopopulation
- Users are expected to specify the tab contents in their robot program
- Have a special color to differentiate from normal tabs
