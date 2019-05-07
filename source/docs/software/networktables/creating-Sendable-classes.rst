.. _creating-Sendable-classes:


Using the Sendable interface
============================

What is Sendable?
-----------------

Sendable is the base class that allows something to be sent
over NetworkTables for debugging through programs such as
OutlineViewer, ShuffleBoard and SmartDashboard. Base WPI
classes such as Command and Subsystem, as well as actuator
classes such as DoubleSolenoid, implement the Sendable
interface. The WPI documentation of the Sendable interface,
as well as a full list of WPI classes which implement Sendable,
can be found on the WPI docs for Sendable(`Java
<https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/Sendable.html>`_,
`C++
<https://first.wpi.edu/FRC/roborio/release/docs/cpp/classSendable.html>`_).

Putting a Sendable on NetworkTables
-----------------------------------

Adding the current state of a Sendable class to NetworkTables
is as simple as adding it's entry using the putData() method.

.. tabs::

    .. code-tab:: c++

        // put a class which implements Sendable on SmartDashboard
        frc::SmartDashboard::PutData(m_SendableClass)	

    .. code-tab:: java

        // put a class which implements Sendable on SmartDashboard
        SmartDashboard.putData(m_SendableClass)

Interacting with Sendable classes
---------------------------------

Sendable classes are published via NetworkTables for users
to view using WPILIb through programs such as OutlineViewer,
ShuffleBoard and SmartDashboard. These programs allow users
to not only view the current state, such as solenoid state,
motor output, or PIDSubsystem/PIDCommand's current PID
constants, but to actually modify or send data the other
direction to the RoboRIO to do things like manually start
and stop commands. 

Creating a new Sendable class
-----------------------------

To create a new Sendable class, one must create an implementation of the
initSendable() method of the Sendable interface. Teams may, using the
injected SendableBuilder(`Java
<https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/smartdashboard/SendableBuilder.html>`_
`C++
<https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1SendableBuilder.html>`_
),
add properties such as Booleans, Doubles/DoubleArrays and even treat the
class as an actuator. The following is an example implementation from
WPILib's DifferentialDrive class, which implements Sendable. For more
information on the DifferentialDrive class, see :ref:`wpi_differential_drive`.

.. tabs::

    .. code-tab:: c++

        void DifferentialDrive::InitSendable(SendableBuilder& builder) {
            builder.SetSmartDashboardType("DifferentialDrive");
            builder.SetActuator(true);
            builder.SetSafeState([=] { StopMotor(); });
            builder.AddDoubleProperty("Left Motor Speed",
                                    [=]() { return m_leftMotor.Get(); },
                                    [=](double value) { m_leftMotor.Set(value); });
            builder.AddDoubleProperty(
                "Right Motor Speed",
                [=]() { return m_rightMotor.Get() * m_rightSideInvertMultiplier; },
                [=](double value) {
                m_rightMotor.Set(value * m_rightSideInvertMultiplier);
                });
        }

    .. code-tab:: java

        @Override
        public void initSendable(SendableBuilder builder) {
            builder.setSmartDashboardType("DifferentialDrive");
            builder.setActuator(true);
            builder.setSafeState(this::stopMotor);
            builder.addDoubleProperty("Left Motor Speed", m_leftMotor::get, m_leftMotor::set);
            builder.addDoubleProperty(
                "Right Motor Speed",
                () -> m_rightMotor.get() * m_rightSideInvertMultiplier,
                x -> m_rightMotor.set(x * m_rightSideInvertMultiplier));
        }