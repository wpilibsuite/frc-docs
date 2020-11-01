Scheduling Functions at Custom Frequencies
==========================================
``TimedRobot``'s ``addPeriodic()`` method allows one to run custom methods at a rate faster than the default ``TimedRobot`` periodic update rate (20 ms). Previously, teams had to make a ``Notifier`` to run feedback controllers more often than the ``TimedRobot`` loop period of 20 ms (running ``TimedRobot`` more often than this is not advised). Now, users can run feedback controllers more often than the main robot loop, but synchronously with the ``TimedRobot`` periodic functions, eliminating potential thread safety issues.

The ``addPeriodic()`` (Java) / ``AddPeriodic()`` (C++) method takes in a lambda (the function to run), along with the requested period and an optional offset from the common starting time. The optional third argument is useful for scheduling a function in a different timeslot relative to the other ``TimedRobot`` periodic methods.

.. note:: The units for the period and offset are seconds in Java. In C++, the `units library <docs/software/basic-programming/cpp-units:The C++ Units Library>`_ can be used to specify a period and offset in any time unit.

.. tabs::

    .. group-tab:: Java

        .. code-block:: java

            public class Robot extends TimedRobot {
                private Joystick m_joystick = new Joystick(0);
                private Encoder m_encoder = new Encoder(1, 2);
                private Spark m_motor = new Spark(1);
                private PIDController m_controller = new PIDController(1.0, 0.0, 0.5, 0.01);

                public Robot() {
                    addPeriodic(() -> {
                        m_motor.set(m_controller.calculate(m_encoder.getRate()));
                    }, 0.01, 0.01);
                }

                @Override
                public teleopPeriodic() {
                    if (m_joystick.getRawButtonPressed(1)) {
                        if (m_controller.getSetpoint() == 0.0) {
                            m_controller.setSetpoint(30.0);
                        } else {
                            m_controller.setSetpoint(0.0);
                        }
                    }
                }

    .. group-tab:: C++ (Header)

        .. code-block:: cpp

            class Robot : public frc::TimedRobot {
             private:
              frc::Joystick m_joystick{0};
              frc::Encoder m_encoder{1, 2};
              frc::Spark m_motor{1};
              frc2::PIDController m_controller{1.0, 0.0, 0.5, 10_ms};

              Robot();

              void TeleopPeriodic() override;

    .. group-tab:: C++ (Source)

        .. code-block:: cpp

            void Robot::Robot() {
              AddPeriodic([&] {
                m_motor.Set(m_controller.Calculate(m_encoder.GetRate()));
              }, 10_ms, 10_ms);
            }

            void Robot::TeleopPeriodic() {
              if (m_joystick.GetRawButtonPressed(1)) {
                if (m_controller.GetSetpoint() == 0.0) {
                  m_controller.SetSetpoint(30.0);
                } else {
                  m_controller.SetSetpoint(0.0);
                }
              }
            }

The ``teleopPeriodic()`` method in this example runs every 20 ms, and the controller update is run every 10ms with an offset of 10ms from when ``teleopPeriodic()`` runs so that their timeslots don't conflict.
