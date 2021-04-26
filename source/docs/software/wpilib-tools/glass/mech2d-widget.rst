The Mechanism2d Widget
==================

Glass supports displaying stick-figure representations of your robot's mechanisms using the :guilabel:`Mechanism2d` widget. An instance of the ``Mechanism2d`` class should be created and populated, sent over NetworkTables, and updated periodically with the latest mechanism states in your robot code.

Creating and Configuring the Mechanism2d Instance
-------------------------------------------------

The ``Mechanism2d`` object is the base of the mechanism. To get a root node (represented by a ``MechanismRoot2d`` object), call ``getRoot(name, x, y)`` on the container ``Mechanism2d`` object.

.. tabs::

  .. group-tab:: Java

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mechanism2d/Robot.java
        :language: java
        :lines: 41-44
        :linenos:
        :lineno-start: 36

  .. group-tab:: C++

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.3.2/wpilibcExamples/src/main/cpp/examples/Mechanism2d/cpp/Robot.cpp
        :language: cpp
        :lines: 56-59
        :linenos:
        :lineno-start: 36


Each ``MechanismLigament2d`` object represents a stage of the mechanism. Call ``append()``/``Append()`` on a root node or ligament node to add another node to the figure. In Java, pass a constructed ``MechanismLigament2d`` object to add it. In C++, pass the construction parameters in order to construct and add a ligament.

.. tabs::

  .. group-tab:: Java

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mechanism2d/Robot.java
        :language: java
        :lines: 46-49
        :linenos:
        :lineno-start: 36

  .. group-tab:: C++

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.3.2/wpilibcExamples/src/main/cpp/examples/Mechanism2d/cpp/Robot.cpp
        :language: cpp
        :lines: 60-65
        :linenos:
        :lineno-start: 36

Then, publish the ``Mechanism2d`` object to NetworkTables:

.. tabs::

  .. group-tab:: Java

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mechanism2d/Robot.java
        :language: java
        :lines: 51-52
        :linenos:
        :lineno-start: 36

  .. group-tab:: C++

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.3.2/wpilibcExamples/src/main/cpp/examples/Mechanism2d/cpp/Robot.cpp
        :language: cpp
        :lines: 34
        :linenos:
        :lineno-start: 36

.. note:: The ``Mechanism2d`` instance can also be sent using a lower-level NetworkTables API or using the :ref:`Shuffleboard API <docs/software/wpilib-tools/shuffleboard/getting-started/shuffleboard-displaying-data:Displaying data from your robot>`. In this case, the ``SmartDashboard`` API was used, meaning that the :guilabel:`Mechanism2d` widget will appear under the ``SmartDashboard`` table name.

To manipulate a ligament's angle or length, call ``setLength()`` or ``setAngle()`` on the ``MechanismLigament2d`` object. When manipulating ligament length based off of sensor measurements, make sure to add the minimum length to prevent 0-length (and therefore invisible) ligaments. Ligament angles are relative to the parent ligament. 

.. tabs::

  .. group-tab:: Java

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/mechanism2d/Robot.java
        :language: java
        :lines: 55-60
        :linenos:
        :lineno-start: 36

  .. group-tab:: C++

     .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2021.3.2/wpilibcExamples/src/main/cpp/examples/Mechanism2d/cpp/Robot.cpp
        :language: cpp
        :lines: 37-42
        :linenos:
        :lineno-start: 36

Viewing the Mechanism2d widget in Glass is very similar to :ref:`viewing the Field2d widget<field2d-widget:Viewing the Robot Pose in Glass>`.