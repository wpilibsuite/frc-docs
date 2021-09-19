.. include:: <isonum.txt>

Introduction to Robot Characterization
======================================

The characterization tools consist of an application that runs on the user's PC and matching robot code that runs on the user's robot. The PC application will send control signals to the robot over NetworkTables, while the robot sends data back to the application. The application then processes the data and determines characterization parameters for the user's robot mechanism, as well as producing diagnostic plots. Data can be saved (in JSON format) for future use, if desired.

What is "Characterization?"
---------------------------

"Characterization" - or, more formally, `system identification <https://en.wikipedia.org/wiki/System_identification>`__ - is the process of determining a mathematical model for the behavior of a system through statistical analysis of its inputs and outputs.

In FRC, the most common system that we're interested in characterizing is the `permanent-magnet DC motor <https://en.wikipedia.org/wiki/Brushed_DC_electric_motor#Permanent-magnet_motors>`__.  In particular, we're interested in figuring out which motor *input* (i.e. voltage from the motor controller) is required to achieve our desired *outputs* (i.e. velocity and acceleration of the motor).

Fortunately, it is not so difficult to do this.  A permanent-magnet DC motor (with no load other than friction and inertia) will obey the following "voltage-balance equation" (for more information, see `this paper <https://www.chiefdelphi.com/uploads/default/original/3X/f/7/f79d24101e6f1487e76099774e4ba60683e86cda.pdf>`__):

.. math:: V = kS \cdot sgn(\dot{d}) + kV \cdot \dot{d} + kA \cdot \ddot{d}

where :math:`V` is the applied voltage, :math:`d` is the displacement (position) of the motor, :math:`\dot{d}` is its velocity, and :math:`\ddot{d}` is its acceleration (the "overdot" notation traditionally denotes the `derivative <https://en.wikipedia.org/wiki/Derivative>`__ with respect to time).

Heuristically, we can interpret the coefficients in the above equation as follows:

``kS`` is the voltage needed to overcome the motor's static friction, or in other words to just barely get it moving; it turns out that this static friction (because it’s, well, static) has the same effect regardless of velocity or acceleration. That is, no matter what speed you’re going or how fast you're accelerating, some constant portion of the voltage you've applied to your motor (depending on the specific mechanism assembly) will be going towards overcoming the static friction in your gears, bearings, etc; this value is your kS.  Note the presence of the `signum function <https://en.wikipedia.org/wiki/Sign_function>`__, because friction force always opposes the direction-of-motion.

``kV`` describes how much voltage is needed to hold (or "cruise") at a given constant velocity while overcoming the `electromagnetic resistance in the motor <https://en.wikipedia.org/wiki/Counter-electromotive_force>`__ and any additional friction that increases with speed (known as `viscous drag <https://en.wikipedia.org/wiki/Drag_(physics)#Very_low_Reynolds_numbers:_Stokes'_drag>`__). The relationship between speed and voltage (at constant acceleration) is almost entirely linear (with FRC\ |reg| components, anyway) because of how permanent-magnet DC motors work.

``kA`` describes the voltage needed to induce a given acceleration in the motor shaft. As with ``kV``, the relationship between voltage and acceleration (at constant velocity) is almost perfectly linear for FRC components.

Once these coefficients have been determined (here accomplished by a `multiple linear regression <https://en.wikipedia.org/wiki/Linear_regression>`__), we can then take a given  desired velocity and acceleration for the motor and calculate the voltage that should be applied to achieve it.  This is very useful - not only for, say, following motion profiles, but also for making mechanisms more controllable in open-loop control, because your joystick inputs will more closely match the actual mechanism motion.

Some of the tools in this toolsuite introduce additional terms into the above equation to account for known differences from the simple case described above - details for each tool can be found below:

Included Characterization Tools
-------------------------------

.. note:: Many other types of mechanisms can be characterized by simply adapting the existing code in this library.

The robot characterization toolsuite currently supports characterization for:

- Simple Motor Setups
- Drivetrains
- Arms
- Elevators

Simple Motor Characterization
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The simple motor characterization tool determines the best-fit parameters for the equation:

.. math:: V = kS \cdot sgn(\dot{d}) + kV \cdot \dot{d} + kA \cdot \ddot{d}

where :math:`V` is the applied voltage, :math:`d` is the displacement (position) of the drive, :math:`\dot{d}` is its velocity, and :math:`\ddot{d}` is its acceleration.  This is the model for a permanent-magnet dc motor with no loading other than friction and inertia, as mentioned above, and is an accurate model for flywheels, turrets, and horizontal linear sliders.

Drivetrain Characterization
^^^^^^^^^^^^^^^^^^^^^^^^^^^

The drivetrain characterization tool determines the best-fit parameters for the equation:

.. math:: V = kS \cdot sgn(\dot{d}) + kV \cdot \dot{d} + kA \cdot \ddot{d}

where :math:`V` is the applied voltage, :math:`d` is the displacement (position) of the drive, :math:`\dot{d}` is its velocity, and :math:`\ddot{d}` is its acceleration.  This is the same modeling equation as is used in the simple motor characterization - however, the drivetrain characterizer is specifically set up to run on differential drives, and will characterize each side of the drive independently if desired.

The drivetrain characterizer can also determine the effective trackwidth of your robot using a gyro. More information on how to run the characterization is available in the :ref:`track width characterization <docs/software/pathplanning/robot-characterization/characterization-routine:Running Tests>` article.

Arm Characterization
^^^^^^^^^^^^^^^^^^^^

The arm characterization tool determines the best-fit parameters for the equation:

.. math:: V = kS \cdot sgn(\dot{\theta}) + kCos \cdot cos(\theta) + kV \cdot \dot{\theta} + kA \cdot \ddot{\theta}

where :math:`V` is the applied voltage, :math:`\theta` is the angular displacement (position) of the arm, :math:`\dot{\theta}` is its angular velocity, and :math:`\ddot{\theta}` is its angular acceleration.  The cosine term (:math:`kCos`) is added to correctly account for the effect of gravity.

Elevator Characterization
^^^^^^^^^^^^^^^^^^^^^^^^^

The elevator characterization tool determines the best-fit parameters for the equation:

.. math:: V = kG + kS \cdot sgn(\dot{d}) + kV \cdot \dot{d} + kA \cdot \ddot{d}

where :math:`V` is the applied voltage, :math:`d` is the displacement (position) of the drive, :math:`\dot{d}` is its velocity, and :math:`\ddot{d}` is its acceleration.  The constant term (:math:`kG`) is added to correctly account for the effect of gravity.

Installing the System Identification Tool
-----------------------------------------

The system identification tool (also referred to as ``sysid``) is included with the WPILib Installer.

.. note:: The old Python characterization tool from previous years is no longer supported.

Launching the System Identification Tool
----------------------------------------

The system identification tool can be opened from the ``Start Tool`` option in VS Code or by using the desktop shortcut on Windows.
