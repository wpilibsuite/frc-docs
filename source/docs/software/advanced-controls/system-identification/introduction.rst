.. include:: <isonum.txt>

Introduction to System Identification
=====================================

What is "System Identification?"
--------------------------------

In Control Theory, :term:`system identification` is the process of determining a mathematical model for the behavior of a system through statistical analysis of its inputs and outputs.

This model is a rule describing how input voltage affects the way our measurements (typically encoder data) evolve in time.  A "system identification" routine takes such a model and a dataset and attempts to fit parameters which would make your model most closely-match the dataset.  Generally, the model is not perfect - the real-world data are polluted by both measurement noise (e.g. timing errors, encoder resolution limitations) and system noise (unmodeled forces acting on the system, like vibrations).  However, even an imperfect model is usually "good enough" to give us accurate :ref:`feedforward control <docs/software/advanced-controls/controllers/feedforward:Feedforward Control in WPILib>` of the mechanism, and even to estimate  optimal gains for :ref:`feedback control <docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib>`.

Assumed Behavioral Model
------------------------

If you haven't yet, read the full explanation of the feedforward equations used by the WPILib toolsuite in :ref:`docs/software/advanced-controls/introduction/introduction-to-feedforward:The Permanent-Magnet DC Motor Feedforward Equation`.

The process of System Identification is to determine concrete values for the coefficients in the model that best-reflect the behavior of *your particular* real-world system.

To determine numeric values for each coefficient in our model, a curve-fitting technique (such as :term:`least-squares regression`) is applied to measurements taken from the real mechanism. Careful selection of the data-producing experiments helps improve the accuracy of the curve-fitting.

Once these coefficients have been determined, we can then take a given desired velocity and acceleration for the motor and calculate the voltage that should be applied to achieve it.  This is very useful - not only for, say, following motion profiles, but also for making mechanisms more controllable in open-loop control, because your joystick inputs will more closely match the actual mechanism motion.

Some of the tools in this toolsuite introduce additional terms into the above equation to account for known differences from the simple case described above - details for each tool can be found below:

The WPILib System Identification Tool (SysId)
---------------------------------------------

The WPILib system identification tool consists of the SysId application that runs on the user's PC and a routine that lives in the code running on the user's robot. The routine will generate control signals which user-defined callbacks will send to the motors being characterized, while the robot records data into a log file. After the routine completes, the user will retrieve this file from the roboRIO and load it into SysId. SysId then processes the data and determines model parameters for the user's robot mechanism, as well as producing diagnostic plots.

Included Tools
^^^^^^^^^^^^^^

.. note:: With a bit of ingenuity, these tools can be used to accurately characterize a surprisingly large variety of robot mechanisms.  Even if your mechanism does not seem to obviously match any of the tools, an understanding of the system equations often reveals that one of the included routines will do.

The System Identification toolsuite currently supports:

- Simple Motor Setups
- Elevators
- Arms

Several of these options use nearly identical robot-side code, and differ only in the analysis used by SysId to interpret the data.

Simple Motor Identification
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The simple motor identification tool determines the best-fit parameters for the equation:

.. math:: V = kS \cdot sgn(\dot{d}) + kV \cdot \dot{d} + kA \cdot \ddot{d}

where :math:`V` is the applied voltage, :math:`d` is the displacement (position) of the drive, :math:`\dot{d}` is its velocity, and :math:`\ddot{d}` is its acceleration.  This is the model for a permanent-magnet dc motor with no loading other than friction and inertia, as mentioned above, and is an accurate model for flywheels, turrets, and horizontal linear sliders.

Elevator Identification
~~~~~~~~~~~~~~~~~~~~~~~

The elevator identification tool determines the best-fit parameters for the equation:

.. math:: V = kG + kS \cdot sgn(\dot{d}) + kV \cdot \dot{d} + kA \cdot \ddot{d}

where :math:`V` is the applied voltage, :math:`d` is the displacement (position) of the elevator, :math:`\dot{d}` is its velocity, and :math:`\ddot{d}` is its acceleration.  The constant term (:math:`kG`) is added to correctly account for the effect of gravity.

Arm Identification
~~~~~~~~~~~~~~~~~~

The arm identification tool determines the best-fit parameters for the equation:

.. math:: V = kG \cdot cos(\theta) + kS \cdot sgn(\dot{\theta}) + kV \cdot \dot{\theta} + kA \cdot \ddot{\theta}

where :math:`V` is the applied voltage, :math:`\theta` is the angular displacement (position) of the arm, :math:`\dot{\theta}` is its angular velocity, and :math:`\ddot{\theta}` is its angular acceleration.  The cosine term (:math:`kG`) is added to correctly account for the effect of gravity.

Installing SysId
-----------------------------------------

SysId is included with the WPILib Installer.

.. note:: The old Python characterization tool from previous years is no longer supported.

Launching the SysId Tool
----------------------------------------

The system identification tool can be opened from the ``Start Tool`` option in VS Code or by using the shortcut inside the WPILib Tools desktop folder (Windows).
