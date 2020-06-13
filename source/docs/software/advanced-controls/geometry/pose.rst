Translation, Rotation, and Pose
===============================

Translation
-----------

Translation in 2 dimensions is represented by WPILib's :code:`Translation2d` class. This class has an x and y component, representing a point or a vector on a 2 dimensional coordinate system. 

For example, :code:`Translation2d(2, 1)` can describe a point 2 meters along the positive x-axis and 1 meter along the positive y-axis of your coordinate system, or it could describe the vector :math:`\begin{bmatrix}2 \\ 1\end{bmatrix}`.

You can get the distance to another :code:`Translation2d` object by using the :code:`getDistance(Translation2d other)`, which returns the distance to another Translation2d by using the Pythagorean theorem.

.. note:: Translation2d uses the C++ Units library. If you're planning on using other WPILib classes that accept Translation2d in Java, such as the trajectory generator, make sure to use meters.

Rotation
--------

Rotation in 2 dimensions is representated by WPILib's :code:`Rotation2d` class. This class has an angle component, which represents the robot's rotation relative to an axis on a 2 dimensional coordinate system. 

For example, :code:`Rotation2d(60)`
