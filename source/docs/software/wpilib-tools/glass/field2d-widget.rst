The Field2d Widget
==================

Glass supports displaying your robot's position on the field using the :guilabel:`Field2d` widget. An instance of the ``Field2d`` class should be created, sent over NetworkTables, and updated periodically with the latest robot pose in your robot code.

Sending Robot Pose from User Code
---------------------------------

To send your robot's position (usually obtained by :ref:`odometry <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is odometry?>` or a pose estimator), a ``Field2d`` instance must be created in robot code and sent over NetworkTables. The instance must then be updated periodically with the latest robot pose.

.. tabs::
   .. code-tab:: java

      private final Field2d m_field = new Field2d();

      public Drivetrain() {
        ...
        SmartDashboard.putData("Field", m_field);
      }

      ...

      public void periodic() {
        ...
        m_field.setRobotPose(m_odometry.getPoseMeters());
      }

   .. code-tab:: c++

      #include <frc/smartdashboard/Field2d.h>
      #include <frc/smartdashboard/SmartDashboard.h>

      frc::Field2d m_field;

      Drivetrain() {
        ...
        frc::SmartDashboard::PutData("Field", &m_field);
      }

      ...

      void Periodic() {
        ...
        m_field.SetRobotPose(m_odometry.GetPose());
      }

.. note:: The ``Field2d`` instance can also be sent using a lower-level NetworkTables API or using the :ref:`Shuffleboard API <docs/software/wpilib-tools/shuffleboard/getting-started/shuffleboard-displaying-data:Displaying data from your robot>`. In this case, the ``SmartDashboard`` API was used, meaning that the :guilabel:`Field2d` widget will appear under the ``SmartDashboard`` table name.

Viewing the Robot Pose in Glass
-------------------------------

After sending the ``Field2d`` instance over NetworkTables, the :guilabel:`Field2d` widget can be added to Glass by selecting :guilabel:`NetworkTables` in the menu bar, choosing the table name that the instance was sent over, and then clicking on the :guilabel:`Field` button.

.. image:: images/select-field2d.png

Once the widget appears, you can resize and place it on the Glass workspace as you desire. Right-clicking the top of the widget will allow you to customize the name of the widget, select a custom field image, select a custom robot image, and choose the dimensions of the field and robot.

When selecting :guilabel:`Choose image...` you can choose to either select an image file or a PathWeaver JSON file as long as the image file is in the same directory.  Choosing the JSON file will automatically import the correct location of the field in the image and the correct size of the field.

.. note:: You can retrieve the latest field image and JSON files from `here <https://github.com/wpilibsuite/PathWeaver/tree/main/src/main/resources/edu/wpi/first/pathweaver>`__. This is the same image and JSON that are used when generating paths using :ref:`PathWeaver <docs/software/wpilib-tools/pathweaver/introduction:Introduction to PathWeaver>`.

.. image:: images/field2d-options.png
