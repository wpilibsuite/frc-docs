.. include:: <isonum.txt>

What is WPILib?
===============

The WPI Robotics Library (WPILib) is the standard :term:`software library` provided for teams to write code for their FRC\ |reg| robots. WPILib contains a set of useful classes and subroutines for interfacing with various parts of the FRC control system (such as sensors, motor controllers, and the driver station), as well as an assortment of other utility functions.

Supported languages
-------------------

There are two versions of WPILib, one for each of the two officially-supported text-based languages: WPILibJ for Java, and WPILibC for C++.  A considerable effort is made to maintain feature-parity between these two languages - library features are not added unless they can be reasonably supported for both Java and C++, and when possible the class and method names are kept identical or highly-similar.  While unofficial community-built support is available for some other languages, notably `python <https://robotpy.readthedocs.io/en/stable/>`__, this documentation will only cover Java and C++.  Java and C++ were chosen for the officially-supported languages due to their appropriate level-of-abstraction and ubiquity in both industry and high-school computer science classes.

In general, C++ offers better high-end performance, at the cost of increased user effort (memory must be handled manually, and the C++ compiler does not do much to ensure user code will not crash at runtime).  Java offers lesser performance, but much greater convenience.  New/inexperienced users are strongly encouraged to use Java.

Source code and documentation
-----------------------------

WPILib is an open-source library - the entirety of its source code is available online on the WPILib GitHub Page:

 - `Official WPILib GitHub <https://github.com/wpilibsuite/allwpilib>`__

The Java and C++ source code can be found in the WPILibJ and WPILibC source directories:

 - `Java source code <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibj/src/main/java/edu/wpi/first/wpilibj>`__

 - `C++ source code <https://github.com/wpilibsuite/allwpilib/tree/main/wpilibc/src/main/native/cpp>`__

While users are strongly encouraged to read the source code to resolve detailed questions about library functionality, more-concise documentation can be found on the official documentation pages for WPILibJ and WPILibC:

 - `Java documentation <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/>`__

 - `C++ documentation <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/>`__
