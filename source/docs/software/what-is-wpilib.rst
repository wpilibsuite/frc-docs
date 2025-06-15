.. include:: <isonum.txt>

# What is WPILib?

.. figure:: /assets/wpilib-generic.svg
   :alt: The logo for the WPI Robotics Library.
   :target: http://wpilib.org
   :width: 500

The WPI Robotics Library ([WPILib](https://wpilib.org)) is the standard :term:`software library` provided for teams to write code for their FRC\ |reg| robots. WPILib contains a set of useful classes and subroutines for interfacing with various parts of the FRC control system (such as sensors, motor controllers, and the driver station), as well as an assortment of other utility functions.

.. image:: /assets/wpi-logo.png
   :alt: The Worcester Polytechnic Institute (WPI) logo.
   :target: http://wpi.edu
   :width: 500

## Supported languages

There are three versions of WPILib, one for each of the three officially-supported text-based languages: WPILibJ for Java, and WPILibC for C++, and RobotPy for Python. A considerable effort is made to maintain feature-parity between these languages - library features are not added unless they can be reasonably supported for both Java and C++ (with the C++ able to be wrapped by pybind for Python), and when possible the class and method names are kept identical or highly-similar. Java, C++, and Python were chosen for the officially-supported languages due to their appropriate level-of-abstraction and ubiquity in both industry and high-school computer science classes.

In general, C++ offers better high-end performance, at the cost of increased user effort (memory must be handled manually, and the C++ compiler does not do much to ensure user code will not crash at runtime). Java and Python offer lesser performance, but much greater convenience. Python users should take care to test their program to ensure that typos and other issues don't cause robot crashes, as Python is interpreted. New/inexperienced users are encouraged to use Java.

## Source code and documentation

WPILib is an open-source library - the C++ and Java source code is in the [allwpilib](https://github.com/wpilibsuite/allwpilib) mono-repo and python source code is in the [mostrobotpy](https://github.com/robotpy/mostrobotpy) mono-repo.  The Java and C++ source code can be found in the WPILibJ and WPILibC source directories:

The Java and C++ source code can be found in the WPILibJ and WPILibC source directories:

- [Java source code](https://github.com/wpilibsuite/allwpilib/tree/2027/wpilibj/src/main/java/edu/wpi/first/wpilibj)

- [C++ source code](https://github.com/wpilibsuite/allwpilib/tree/2027/wpilibc/src/main/native/cpp)

- [Python source code](https://github.com/robotpy/mostrobotpy)

While users are strongly encouraged to read the source code to resolve detailed questions about library functionality, more-concise documentation can be found on the official documentation pages for WPILibJ and WPILibC and RobotPy:

- [Java documentation](https://github.wpilib.org/allwpilib/docs/release/java/)

- [C++ documentation](https://github.wpilib.org/allwpilib/docs/release/cpp/)

- [Python documentation](https://robotpy.readthedocs.io/projects/robotpy/en/stable/)

## Development Timeline

WPILib development happens on branches for individual years, as opposed to one main branch. Development and support for both FRC and FTC happen during different periods to support both FRC and FTC needs. These periods overlap with each other between years, so the following timeline visualizes these overlapping periods to make it easy to understand.

.. image:: /assets/dev_timeline.svg
  :alt: A timeline showing the different periods of WPILib's development for the next 4 years and how the different periods overlap between different, starting with development from FRC Kickoff to September, FRC beta from September to the next FRC Kickoff, FRC Support from FRC Kickoff to Champs, Updates/FTC Beta from Champs to FTC Kickoff, and FTC Support from FTC Kickoff to the next Champs.

For year N, WPILib will create a branch for year N - 1, and actively do development on it until around October, when it enters the beta testing period for FRC, which continues until FRC Kickoff for year N, which is when the first stable release is published. FRC will receive active support until the FIRST Championship ends, which then begins the FTC beta testing period, which lasts until FTC Kickoff in September of year N. FTC will then receive active support until the next FIRST Championship ends, and then the branch will no longer be supported.
