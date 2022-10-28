Transformations
===============

Translation2d
-------------

Operations on a ``Translation2d`` perform operations to the vector represented by the ``Translation2d``.

- Addition: Addition between two ``Translation2d`` a and b can be performed using ``plus`` in Java, or the ``+`` operator in C++. Addition adds the two vectors.
- Subtraction: Subtraction between two ``Translation2d`` can be performed using ``minus`` in Java, or the binary ``-`` operator in C++. Subtraction subtracts the two vectors.
- Multiplication: Multiplication of a ``Translation2d`` and a scalar can be performed using ``times`` in Java, or the ``*`` operator in C++. This multiplies the vector by the scalar.
- Division: Division of a ``Translation2d`` and a scalar can be performed using ``div`` in Java, or the ``/`` operator in C++. This divides the vector by the scalar.
- Rotation: Rotation of a ``Translation2d`` by a counter-clockwise rotation :math:`\theta` about the origin can be performed by using ``rotateBy``. This is equivalent to multiplying the vector by the matrix :math:`\begin{bmatrix} cos\theta & -sin\theta \\ sin\theta & cos\theta \end{bmatrix}`
- Additionally, you can rotate a ``Translation2d`` by 180 degrees by using ``unaryMinus`` in Java, or the unary ``-`` operator in C++.

Rotation2d
----------

Transformations for ``Rotation2d`` are just arithmetic operations on the angle measure represented by the ``Rotation2d``.

- ``plus`` (Java) or ``+`` (C++): Adds the rotation component of ``other`` to this ``Rotation2d``'s rotation component
- ``minus`` (Java) or binary ``-`` (C++): Subtracts the rotation component of ``other`` to this ``Rotation2d``'s rotation component
- ``unaryMinus`` (Java) or unary ``-`` (C++): Multiplies the rotation component by a scalar of -1.
- ``times`` (Java) or ``*`` (C++) : Multiplies the rotation component by a scalar.

Transform2d and Twist2d
-----------------------

WPILib provides 2 classes, ``Transform2d`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/geometry/Transform2d.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/classfrc_1_1_transform2d.html>`__), which represents a transformation to a pose, and ``Twist2d`` (`Java <https://first.wpi.edu/wpilib/allwpilib/docs/beta/java/edu/wpi/first/math/geometry/Twist2d.html>`__, `C++ <https://first.wpi.edu/wpilib/allwpilib/docs/beta/cpp/structfrc_1_1_twist2d.html>`__) which represents a movement along an arc. ``Transform2d`` and ``Twist2d`` all have x, y and :math:`\theta` components.

``Transform2d`` represents a **relative** transformation. It has an translation and a rotation component. Transforming a ``Pose2d`` by a ``Transform2d`` rotates the translation component of the transform by the rotation of the pose, and then adds the rotated translation component and the rotation component to the pose. In other words, ``Pose2d.plus(Transform2d)`` returns :math:`\begin{bmatrix} x_p \\ y_p \\ \theta_p \end{bmatrix}+\begin{bmatrix} cos\theta_p & -sin\theta_p & 0 \\ sin\theta_p & cos\theta_p & 0 \\ 0 & 0 & 1 \end{bmatrix}\begin{bmatrix}x_t \\ y_t \\ \theta_t \end{bmatrix}`

``Twist2d`` represents a change in distance along an arc. Usually, this class is used to represent the movement of a drivetrain, where the x component is the forward distance driven, the y component is the distance driven to the side (left positive), and the :math:`\theta` component is the change in heading. The underlying math behind finding the pose exponential (new pose after moving the pose forward along the curvature of the twist) can be found `here <https://file.tavsys.net/control/controls-engineering-in-frc.pdf>`_ in chapter 10.

.. note:: For nonholonomic drivetrains, the y component of a ``Twist2d`` should always be 0.

Both classes can be used to estimate robot location. Twist2d is used in WPILib's odometry classes to update the robot's pose based on movement, while Transform2d can be used to estimate the robot's global position from vision data.
