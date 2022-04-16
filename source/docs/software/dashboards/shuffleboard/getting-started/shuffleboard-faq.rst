Shuffleboard FAQ, issues, and bugs
==================================

.. warning:: Shuffleboard as well as most of the other control system components were developed with Java 11 and will not work with Java 8. Be sure before reporting problems that your computer has Java 11 installed and is set as the default Java Environment.

Frequently Asked Questions
--------------------------

How do I report issues, bugs or feature requests with Shuffleboard?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Bugs, issues, and feature requests can be added on the Shuffleboard GitHub page by creating an issue. We will try to address them as they are entered into the system. Please try to look at existing issues before creating new ones to make sure you aren't duplicating something that has already been reported or work that is planned. You can find the issues on the `Shuffleboard GitHub page <https://github.com/wpilibsuite/shuffleboard>`__.

How can I add my own widgets or other extensions to Shuffleboard?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

:doc:`Custom Widgets</docs/software/dashboards/shuffleboard/custom-widgets/index>` has a large amount of documentation on extending the program with custom plugins. Sample plugin projects that can be used for additional custom widgets and themes can be found on the `Shuffleboard GitHub page <https://github.com/wpilibsuite/shuffleboard/tree/main/example-plugins>`__.

How can I build Shuffleboard from the source code?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can get the source code by downloading, cloning, or forking the repository on the GitHub site. To build and run Shuffleboard from the source, make sure that the current directory is the top level source code and use one of these commands:

+---------------+----------------+
| Application   | Command (for   |
|               | Windows        |
|               | systems run    |
|               | the            |
|               | gradlew.bat    |
|               | file)          |
+===============+================+
| Running       | ./gradlew      |
| Shuffleboard  | :app:run       |
+---------------+----------------+
| Building the  | ./gradlew      |
| APIs and      | :api:shadowJar |
| utility       |                |
| classes for   |                |
| plugin        |                |
| creation      |                |
+---------------+----------------+
| Building the  | ./gradlew      |
| complete      | :app:shadowJar |
| application   |                |
| jar file      |                |
+---------------+----------------+
