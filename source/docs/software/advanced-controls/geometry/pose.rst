Translation, Rotation, and Pose
===============================

Translation
-----------

Translation in 2 dimensions is represented by WPILib's :code:`Translation2d` class. This class has an x and y component, representing a point or a vector on a 2 dimensional coordinate system.

For example, :code:`Translation2d(2, 1)` can describe a point 2 meters along the positive x-axis and 1 meter along the positive y-axis of your coordinate system, or it could describe the vector :math:`\begin{bmatrix}2 \\ 1\end{bmatrix}`.

You can get the distance to another :code:`Translation2d` object by using the :code:`getDistance(Translation2d other)`, which returns the distance to another Translation2d by using the Pythagorean theorem.

.. note:: :code:`Translation2d` uses the C++ Units library. If you're planning on using other WPILib classes that use :code:`Translation2d` in Java, such as the trajectory generator, make sure to use meters.

Rotation
--------

Rotation in 2 dimensions is representated by WPILib's :code:`Rotation2d` class. This class has an angle component, which represents the robot's rotation relative to an axis on a 2 dimensional coordinate system.

.. note:: :code:`Rotation2d` uses the C++ Units library. The contructor in Java accepts either the angle in radians, or the sine and cosine of the angle, but the :code:`fromDegrees` method will construct a :code:`Rotation2d` object from degrees.

Pose
----

Pose is the combination of both translation and rotation, and is represented by the :code:`Pose2d` class. It can be used to describe the pose of your robot in the field coordinate system, or the pose of objects, such as vision targets, relative to your robot in the robot coordinate system.
