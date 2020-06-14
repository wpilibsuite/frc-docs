Translation, Rotation, and Pose
===============================

Translation
-----------

Translation in 2 dimensions is represented by WPILib's ``Translation2d`` class. This class has an x and y component, representing the point :math:`(x, y)` or the vector :math:`\begin{bmatrix}x \\ y \end{bmatrix}` on a 2 dimensional coordinate system.

You can get the distance to another ``Translation2d`` object by using the ``getDistance(Translation2d other)``, which returns the distance to another Translation2d by using the Pythagorean theorem.

.. note:: ``Translation2d`` uses the C++ Units library. If you're planning on using other WPILib classes that use ``Translation2d`` in Java, such as the trajectory generator, make sure to use meters.

Rotation
--------

Rotation in 2 dimensions is representated by WPILib's ``Rotation2d`` class. This class has an angle component, which represents the robot's rotation relative to an axis on a 2 dimensional coordinate system.

.. note:: ``Rotation2d`` uses the C++ Units library. The contructor in Java accepts either the angle in radians, or the sine and cosine of the angle, but the ``fromDegrees`` method will construct a ``Rotation2d`` object from degrees.

Pose
----

Pose is the combination of both translation and rotation, and is represented by the ``Pose2d`` class. It can be used to describe the pose of your robot in the field coordinate system, or the pose of objects, such as vision targets, relative to your robot in the robot coordinate system. ``Pose2d`` can also represent the vector :math:`\begin{bmatrix}x \\ y \\ \theta\end{bmatrix}`.
