Trapezoidal Motion Profiles in WPILib
=====================================

.. todo:: link to conceptual motion profiling article

.. todo:: link to matching command article

.. note:: This article covers the in-code generation of trapezoidal motion profiles.  For an explanation of the concepts involved in motion profiling, see <TODO: link>.

While feedforward and feedback control offer convenient ways to achieve a given setpoint, we are often still faced with the problem of generating setpoints for our mechanisms.  While the naive approach of immediately commanding a mechanism to its desired state may work, it is often suboptimal.  To improve the handling of our mechanisms, we often wish to command mechanisms to a *sequence* of setpoints that smoothly interpolate between its current state, and its desired goal state.

To help users do this, WPILib provides a ``TrapezoidProfile`` class (`Java <https://first.wpi.edu/FRC/roborio/development/docs/java/edu/wpi/first/wpilibj/trajectory/TrapezoidProfile.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/development/docs/cpp/classfrc_1_1TrapezoidProfile.html>`__).

Creating a ``TrapezoidProfile``
-------------------------------

.. note:: In C++, the ``SimpleMotorFeedforward`` class is templated on the unit type used for distance measurements, which may be angular or linear.  The passed-in values *must* have units consistent with the distance units, or a compile-time error will be thrown.  For more information on C++ units, see :ref:`docs/software/basic-programming/cpp-units:The C++ Units Library`.

Constraints
^^^^^^^^^^^

.. note:: The various :ref:`feedforward helper classes <docs/software/advanced-control/feedforward:Feedforward Control in WPILib>` provide methods for calculating the maximum simultaneously-achievable velocity and acceleration of a mechanism.  These can be very useful for calculating appropriate motion constraints for your ``TrapezoidProfile``.

In order to create a trapezoidal motion profile, we must first impose some constraints on the desired motion.  Namely, we must specify a maximum velocity and acceleration that the mechanism will be expected to achieve during the motion.  To do this, we create an instance of the ``TrapezoidProfile.Constraints`` class (`Java <https://first.wpi.edu/FRC/roborio/development/docs/java/edu/wpi/first/wpilibj/trajectory/TrapezoidProfile.Constraints.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/development/docs/cpp/classfrc_1_1TrapezoidProfile_1_1Constraints.html>`__):

.. tabs::

  .. code-tab:: java

    // Creates a new set of trapezoidal motion profile constraints
    // Max velocity of 10 meters per second
    // Max acceleration of 20 meters per second squared
    new TrapezoidProfile.Constraints(10, 20);

  .. code-tab:: c++

    // Creates a new set of trapezoidal motion profile constraints
    // Max velocity of 10 meters per second
    // Max acceleration of 20 meters per second squared
    TrapezoidProfile<units::meter>::Constraints{10_mps, 20_mps_sq);

Start and End States
^^^^^^^^^^^^^^^^^^^^

Next, we must specify the desired starting and ending states for our mechanisms using the ``TrapezoidProfile.State`` class.  Each state has a position and an acceleration:

.. tabs::

  .. code-tab:: java

    // Creates a new state 
