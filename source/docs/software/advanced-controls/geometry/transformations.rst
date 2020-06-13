Transformations
===============

Translation2d
-------------

Transformations for :code:`Translation2d` are similar to transformations or operations that can be performed on a vector or point.

- :code:`plus(Translation2d other)`: Translates this Translation2d along the vector represented by :code:`other`. Equivalent to vector addition.
- :code:`minus(Translation2d other)`: Translates this Translation2d along the vector represented by :code:`other` multiplied by a scalar of -1. Equivalent to vector subtraction.
- :code:`unaryMinus()`: Rotates this Translation2d by 180 degrees.
- :code:`rotateBy(Rotation2d other)`: Rotates this point about the origin by the rotation represented by :code:`other` counterclockwise.
- :code:`times(double scalar)`: Multiplies the vector represented by this Translation2d by a scalar.
- :code:`div(double scalar)`: Divides the vector represented by this Translation2d by a scalar.

Rotation2d
----------

Transformations for :code:`Rotation2d` are just arithmetic operations on the angle measure represented by the :code:`Rotation2d`.

- :code:`plus(Rotation2d other)`: Adds the rotation component of :code:`other` to this :code:`Rotation2d`'s rotation component
- :code:`minus(Rotation2d other)`: Subtracts the rotation component of :code:`other` to this :code:`Rotation2d`'s rotation component
- :code:`unaryMinus()`: Multiplies the rotation component by a scalar of -1.
- :code:`times(double scalar)`: Multiplies the rotation component by a scalar.
- :code:`div(double scalar)`: Divides the rotation component by a scalar.

Transform2d and Twist2d
-----------------------

WPILib provides 2 classes to represent transformations to a pose, :code:`Translation2d` and :code:`Twist2d`.

:code:`Translation2d` represents a **relative** transformation. It has an translation and a rotation component. Transforming a :code:`Pose2d` by a :code:`Translation2d` rotates the translation component by the rotation of the pose, and then adds the rotated translation component and the rotation component to the pose.

:code:`Twist2d` represents a change in distance along an arc. Usually, this class is used to represent the movement of a drivetrain, where the x component is the forward distance driven, the y component is the distance driven to the side (left positive), and the θ component is the distance turned.

.. note:: For non-holonomic drivetrains, the y component of a :code:`Twist2d` should always be 0.

Both classes can be used to transform a Pose2d. Twist2d is used in WPILib's odometry classes, while Transform2d can be used to estimate the robot's global position from vision data.
