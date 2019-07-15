.. _creating-sendable-classes:

Using the Sendable interface
============================

What is Sendable?
-----------------

Sendable is the base class that allows something to be sent over NetworkTables for debugging through programs such as OutlineViewer, Shuffleboard and SmartDashboard. Base WPI classes such as Command and Subsystem, as well as actuator classes such as DoubleSolenoid, implement the Sendable interface. The WPI documentation of the Sendable interface, as well as a full list of WPI classes which implement Sendable, can be found on the WPI docs for Sendable (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/Sendable.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classSendable.html>`__).

Putting a Sendable on NetworkTables
-----------------------------------

Adding the current state of a Sendable class to NetworkTables is as simple as adding its entry using the putData() method.

.. tabs::

    .. code-tab:: c++

        frc::SmartDashboard::PutData(m_SendableClass)
        frc::SmartDashboard::PutData("my sendable", m_SendableClass)

        frc::ShuffleboardTab& m_tab = frc::Shuffleboard::GetTab("tabName");
        m_tab.Add("Motor", m_Motor);

    .. code-tab:: java

        SmartDashboard.putData(m_SendableClass)
        SmartDashboard.putData("my sendable", m_SendableClass)

        ShuffleboardTab m_tab = Shuffleboard.getTab("tabName")
        m_tab.add("Motor", m_Motor);

Interacting with Sendable classes
---------------------------------

Sendable classes are published via NetworkTables for users to view using WPILIb through programs such as OutlineViewer, Shuffleboard and SmartDashboard. These programs allow users to not only view the current state, such as solenoid states, motor output, or PIDSubsystem/PIDCommand's current PID constants, but to actually modify or send data the other direction to the RoboRIO to do things like manually start and stop commands.

What is SendableBuilder?
------------------------

SendableBuilder (`Java <https://first.wpi.edu/FRC/roborio/release/docs/java/edu/wpi/first/wpilibj/smartdashboard/SendableBuilder.html>`__, `C++ <https://first.wpi.edu/FRC/roborio/release/docs/cpp/classfrc_1_1SendableBuilder.html>`__), implemented in SendableBuilderImpl, handles NetworkTable interaction with an instance of a Sendable class. Through the SendableBuilder instance passed in the :code:`initSendable` method of the Sendable interface, Sendable subclasses can quickly publish the relevant information to NetworkTables. The :code:`initSendable` method is called when a user puts the Sendable on SmartDashboard or Shuffleboard, by calling the code shown above. Users may add properties to the SendableBuilder passed into the :code:`initSendable` method, much like the old SmartDashboard methods used to put primatives onto SmartDashboard. The full list of properties which can be published to and retrieved from SmartDashboard can be found on the linked SendableBuilder documentation, and includes:

- Boolean values
- Boolean arrays
- Double values
- Double arrays
- Bytes values
- String values
- String arrays
- NetworkTableValues

The passed SendableBuilder is also used to set the type of system being displayed using the :code:`setSmartDashboardType` method. This allows users to write custom widgets to display their custom data type. Existing implementations of this include :code:`Command` and WPI's :code:`DifferentialDrive` classes. SendableBuilder can also be used to set the actuator flag on or off, add functions to run to set the Sendable into a safe state, set the type of the Sendable displayed on SmartDashboard, or functions to run to update the network table for things other than properties. If a Sendable is configured as an actuator, users will be able to control it directly through Shuffleboard, SmartDashboard or OutlineViewer when the robot is enabled in Test mode.

Adding Data to a Subsystem or other subclass of a Sendable
----------------------------------------------------------

To expose information about a class to users over NetworkTables, one must create an implementation of the initSendable() method of the Sendable interface. The properties added to Sendable classes require a getter and setter for the property. Note that a :code:`null` setter simply means the value can't be changed over NetworkTables, and may be desired in situations where information should only be displayed, but not modified. If the Sendable is configured as an actuator, the setter will be called when the robot is enabled in Test mode when users change its values to test robot functions. Many of WPI's classes, such as :code:`Command` and :code:`Subsystem`, already implement Sendable. To add new data to a Sendable class, such as adding a motor or sensor specific to a Subsystem, teams can simply override the supertype's :code:`initSendable` method. Note that teams must still call the :code:`super.initSendable` method to run the superclass' implementation. For example, Command's implementation of :code:`Sendable` includes code that will configure SmartDashboard or Shuffleboard to display it as a command, and allows users to start and stop the command through these dashboards.

.. tabs::

      .. code-tab:: c++

        void MySubsystem::InitSendable(SendableBuilder& builder) {

            builder.AddDoubleProperty("IntakeSpeed",
                    [=]() { return
                        myMotor.Get(); },
                    [=](double value) {
                        myMotor.Set(value);
                });

                Subsystem.InitSendable(builder);

        }

    .. code-tab:: java

        public class MySubsystem extends Subsystem {

            Spark spark = new Spark(1);
            Solenoid solenoid = new Solenoid(0);

            @Override
            public void initSendable(SendableBuilder builder) {

               builder.addDoubleProperty("IntakeSpeed", spark::get, (value) -> spark.set(value));

               // this call sets up Command specific configuration, including calling setSmartDashboardType("Subsystem")
               // to let Shuffleboard know to treat this as such.
               super.initSendable(builder);
            }

        }

Creating a new Sendable class with SendableBuilder
--------------------------------------------------

Creating an entirely new :code:`Sendable` class follows a similar pattern to the extending the implementation present in subclasses of WPI classes such as :code:`Command` and :code:`Subsystem` as presented above. The main difference is that when creating a new class, teams must explicitly define the Sendable's type. This allows teams to create custom wigets for Shuffleboard to display data. This example shows a data class which holds boolean and double values about an arm's state.

.. tabs::

    .. code-tab:: java

        public class ArmState implement Sendable {

            double armAngle;
            boolean intakeOpen;

            public ArmState(double angle, boolean intakeOpen) {
                this.armAngle = angle;
                this.intakeOpen = intakeOpen;
            }

            public void initSendable(SendableBuilder builder) {

                builder.setSmartDashboardType("ArmState");
                builder.addDoubleProperty("Angle", () -> armAngle, null);
                builder.addBooleanProperty("IsOpen", () -> intakeOpen, null);

                super.initSendable(builder);
            }
        }
      .. code-tab:: c++

          .. todo:: add C++ code



The following example is an example implementation from WPILib's DifferentialDrive class, which implements Sendable. The properties added to the builder in this example expose many features of DifferentialDrive to modification through NetworkTables. The instance of DifferentialDrive is treated as an actuator of type "DifferentialDrive", which means that Test mode can be used to control the drive's outputs, and the name DifferentialDrive will be displayed to the user. When Test mode is enabled or disabled, the actuator will be set to a safe state by calling the :code:`stopMotor` method, which will stop the motors. Finally, a getter and setter for the left motor speed and right motor speed allows the user both to view the current output of both motors, as well as set them to an arbitrary output. For more information on the DifferentialDrive class, see :ref:`wpi_differential_drive`.



.. tabs::

  .. code-tab:: java

      @Override
      public void initSendable(SendableBuilder builder) {
          builder.setSmartDashboardType("Subsystem");
          builder.setActuator(true);
          builder.setSafeState(this::stopMotor);
          builder.addDoubleProperty("Left Motor Speed", m_leftMotor::get, m_leftMotor::set);
          builder.addDoubleProperty(
              "Right Motor Speed",
              () -> m_rightMotor.get() * m_rightSideInvertMultiplier,
              x -> m_rightMotor.set(x * m_rightSideInvertMultiplier));

  .. code-tab:: c++

        void MyClass::InitSendable(SendableBuilder& builder) {
            builder.SetSmartDashboardType("Subsystem");
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
