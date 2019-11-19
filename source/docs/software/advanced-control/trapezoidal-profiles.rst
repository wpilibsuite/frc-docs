Trapezoidal Motion Profiles in WPILib
=====================================

.. todo:: link to conceptual motion profiling article

.. todo:: link to matching command article

.. note:: This article covers the in-code generation of trapezoidal motion profiles.  For an explanation of the concepts involved in motion profiling, see <TODO: link>.

While feedforward and feedback control offer convenient ways to achieve a given setpoint, we are often still faced with the problem of generating setpoints for our mechanisms.  While the naive approach of immediately commanding a mechanism to its desired state may work, it is often suboptimal.  To improve the handling of our mechanisms, we often wish to command mechanisms to a *sequence* of setpoints that smoothly interpolate between its current state, and its desired goal state.

To help users do this, WPILib provides a ``TrapezoidProfile`` class (`Java <https://first.wpi.edu/FRC/roborio/development/docs/java/edu/wpi/first/wpilibj/trajectory/TrapezoidProfile.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/development/docs/cpp/classfrc_1_1TrapezoidProfile.html>`__).

Creating a ``TrapezoidProfile``
-------------------------------

Constraints
^^^^^^^^^^^

.. note:: The maximum velocity and acceleration that are simultaneously achievable by a mechanism can often be inferred from the feedforward equation for that mechanism.

In order to create a trapezoidal motion profile, we must first impose some constraints on the desired motion.  Namely, we must specify a maximum velocity and acceleration that the mechanism will be expected to achieve during the motion.
