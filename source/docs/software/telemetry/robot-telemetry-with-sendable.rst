Robot Telemetry with Sendable
=============================

While the WPILib dashboard APIs allow users to easily send small pieces of data from their robot code to the dashboard, it is often tedious to manually write code for publishing telemetry values from the robot code's operational logic.

A cleaner approach is to leverage the existing object-oriented structure of user code to mark important data fields for telemetry logging in a :term:`declarative programming` style.  The WPILib framework can then handle the tedious/tricky part of correctly reading from (and, potentially, *writing to*) those fields for you, greatly reducing the total amount of code the user has to write and improving readability.

WPILib provides this functionality with the ``Sendable`` interface.  Classes that implement ``Sendable`` are able to register value listeners that automatically send data to the dashboard - and, in some cases, receive values back.  These classes can be declaratively sent to any of the WPILib dashboards (as one would an ordinary data field), removing the need for teams to write their own code to send/poll for updates.

What is Sendable?
-----------------

``Sendable`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/util/sendable/Sendable.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classwpi_1_1_sendable.html>`__) is an interface provided by WPILib to facilitate robot telemetry.  Classes that implement ``Sendable`` can declaratively send their state to the dashboard - once declared, WPILib will automatically send the telemetry values every robot loop.  This removes the need for teams to handle the iteration-to-iteration logic of sending and receiving values from the dashboard, and also allows teams to separate their telemetry code from their robot logic.

Many WPILib classes (such as :ref:`Commands <docs/software/dashboards/shuffleboard/advanced-usage/shuffleboard-commands-subsystems:Commands and Subsystems>`) already implement ``Sendable``, and so can be sent to the dashboard without any user modification.  Users are also able to easily extend their own classes to implement ``Sendable``.

The ``Sendable`` interface contains only one method: ``initSendable``.  Implementing classes override this method to perform the binding of in-code data values to structured :term:`JSON` data, which is then automatically sent to the robot dashboard via NetworkTables.  Implementation of the ``Sendable`` interface is discussed in the :ref:`next article<docs/software/telemetry/writing-sendable-classes:Writing Your Own Sendable Classes>`.

Sending a Sendable to the Dashboard
-----------------------------------

.. note:: Unlike simple data types, Sendables are automatically kept up-to-date on the dashboard by WPILib, without any further user code - "set it and forget it".  Accordingly, they should usually be sent to the dashboard in an initialization block or constructor, *not* in a periodic function.

To send a ``Sendable`` object to the dashboard, simply use the dashboard's ``putData`` method.  For example, an "arm" class that uses a :ref:`PID Controller <docs/software/advanced-controls/controllers/pidcontroller:PID Control in WPILib>` can automatically log telemetry from the controller by calling the following in its constructor:

.. tabs::

    .. code-tab:: java

        SmartDashboard.putData("Arm PID", armPIDController);

    .. code-tab:: cpp

        frc::SmartDashboard::PutData("Arm PID", &armPIDController);

Additionally, some ``Sendable`` classes bind setters to the data values sent *from the dashboard to the robot*, allowing remote tuning of robot parameters.
