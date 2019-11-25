Motion Profiling through TrapezoidProfileSubsystems and TrapezoidProfileCommands
================================================================================

.. note:: For a description of the WPILib motion profiling features used by these command-based wrappers, see :ref:`docs/software/advanced-control/trapezoidal-profiles:Trapezoidal Motion Profiles in WPILib`.

.. note:: The ``TrapezoidProfile`` command wrappers are generally intended for composition with custom or external controllers.  For combining trapezoidal motion profiling with WPILib's ``PIDController``, consider instead using the <TODO: link to ProfiledPIDSubsystem/Command article>.

When controlling a mechanism, is often desirable to move it smoothly between two positions, rather than to abruptly change its setpoint.  This is called "motion-profiling," and is supported in WPILib through the ``TrapezoidProfile`` class (`Java <https://first.wpi.edu/FRC/roborio/development/docs/java/edu/wpi/first/wpilibj/trajectory/TrapezoidProfile.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/development/docs/cpp/classfrc_1_1TrapezoidProfile.html>`__).

To further help teams integrate motion profiling into their command-based robot projects, WPILib includes two convenience wrappers for the ``TrapezoidProfile`` class: ``TrapezoidProfileSubsystem``, which automatically generates and executes motion profiles in its ``periodic()`` method, and the ``TrapezoidProfileCommand``, which executes a single user-provided ``TrapezoidProfile``.

``TrapezoidProfileSubsystem``
-----------------------------

The ``TrapezoidProfileSubsystem`` class will automatically create and execute trapezoidal motion profiles to reach the user-provided goal state.  
