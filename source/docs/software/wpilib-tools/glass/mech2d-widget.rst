The Mechanism2d Widget
======================

Glass supports displaying stick-figure representations of your robot's mechanisms using the :guilabel:`Mechanism2d` widget. An instance of the ``Mechanism2d`` class should be created and populated, sent over NetworkTables, and updated periodically with the latest mechanism states in your robot code.

Creating and Configuring the Mechanism2d Instance
-------------------------------------------------

The ``Mechanism2d`` object is the base of the mechanism. To get a root node (represented by a ``MechanismRoot2d`` object), call ``getRoot(name, x, y)`` on the container ``Mechanism2d`` object. Coordinate system follow the same orientation as Field2d - ``(0,0)`` is bottom left.

.. tabs::

  .. group-tab:: Java

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ff52f207ccb685748fb71e1c1726ee98130e4c81/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mechanism2d/Robot.java
        :language: java
        :lines: 41-44
        :linenos:
        :lineno-start: 36

  .. group-tab:: C++

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ff52f207ccb685748fb71e1c1726ee98130e4c81/wpilibcExamples/src/main/cpp/examples/Mechanism2d/cpp/Robot.cpp
        :language: cpp
        :lines: 56-59
        :linenos:
        :lineno-start: 36


Each ``MechanismLigament2d`` object represents a stage of the mechanism. Call ``append()``/``Append()`` on a root node or ligament node to add another node to the figure. In Java, pass a constructed ``MechanismLigament2d`` object to add it. In C++, pass the construction parameters in order to construct and add a ligament.

.. tabs::

  .. group-tab:: Java

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ff52f207ccb685748fb71e1c1726ee98130e4c81/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mechanism2d/Robot.java
        :language: java
        :lines: 46-49
        :linenos:
        :lineno-start: 36

  .. group-tab:: C++

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ff52f207ccb685748fb71e1c1726ee98130e4c81/wpilibcExamples/src/main/cpp/examples/Mechanism2d/cpp/Robot.cpp
        :language: cpp
        :lines: 60-65
        :linenos:
        :lineno-start: 36

Then, publish the ``Mechanism2d`` object to NetworkTables:

.. tabs::

  .. group-tab:: Java

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ff52f207ccb685748fb71e1c1726ee98130e4c81/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mechanism2d/Robot.java
        :language: java
        :lines: 51-52
        :linenos:
        :lineno-start: 36

  .. group-tab:: C++

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ff52f207ccb685748fb71e1c1726ee98130e4c81/wpilibcExamples/src/main/cpp/examples/Mechanism2d/cpp/Robot.cpp
        :language: cpp
        :lines: 34
        :linenos:
        :lineno-start: 36

.. note:: The ``Mechanism2d`` instance can also be sent using a lower-level NetworkTables API or using the :ref:`Shuffleboard API <docs/software/wpilib-tools/shuffleboard/getting-started/shuffleboard-displaying-data:Displaying data from your robot>`. In this case, the ``SmartDashboard`` API was used, meaning that the :guilabel:`Mechanism2d` widget will appear under the ``SmartDashboard`` table name.

To manipulate a ligament angle or length, call ``setLength()`` or ``setAngle()`` on the ``MechanismLigament2d`` object. When manipulating ligament length based off of sensor measurements, make sure to add the minimum length to prevent 0-length (and therefore invisible) ligaments. Ligament angles are relative to the parent ligament, and follow math notation - the same as :ref:`Rotation2d <docs/software/advanced-controls/geometry/pose:Rotation>` (counterclockwise-positive). A ligament based on the root with an angle of zero will point right.

.. tabs::

  .. group-tab:: Java

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ff52f207ccb685748fb71e1c1726ee98130e4c81/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mechanism2d/Robot.java
        :language: java
        :lines: 55-60
        :linenos:
        :lineno-start: 36

  .. group-tab:: C++

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/ff52f207ccb685748fb71e1c1726ee98130e4c81/wpilibcExamples/src/main/cpp/examples/Mechanism2d/cpp/Robot.cpp
        :language: cpp
        :lines: 37-42
        :linenos:
        :lineno-start: 36

Viewing the Mechanism2d widget in Glass is very similar to :ref:`field2d-widget:Viewing the Robot Pose in Glass`.
