Programming Your Robot
======================

It's time to finally start programming your robot! This article will introduce you into controlling your differential drive robot with a gamepad or joystick. A "Differential Drive" is a type of drivetrain where each side of the robot is controlled independently. Usually in a linear fashion (left and right can only go forward and backwards).

Go ahead and dive into ``Robot.java`` or ``Robot.cpp``.

Creating Necessary Objects
--------------------------

Go ahead and create the following objects at the top of your ``Robot`` class.

.. tabs::

   .. group-tab:: Java

      .. tabs::

         .. group-tab:: CTRE

            .. code-block:: java

               // todo

         .. group-tab:: REV

            .. code-block:: java

               // todo

   .. group-tab:: C++

      .. tabs::

         .. group-tab:: CTRE

            .. code-block:: cpp

               // todo

         .. group-tab:: REV

            .. code-block:: cpp

               // todo

In the above example, we created a couple of core essential objects.

- ``Joystick`` is the object that gives us access to our joystick or gamepad inputs.
- ``MotorLeft`` and ``MotorRight`` is the object that gives access to feed our motor values.
- ``DifferentialDrive`` is the class that takes our two motors and handles movement.

Using Our Objects to Drive
--------------------------

Now that we have the necessary objects created, we want to "drive" our robot using ``DifferentialDrive`` and ``Joystick``. In the below example, we are assuming that the joystick is an XBox controller. You can also use ``getRawAxis`` to retrieve an axis instead!

Create the following snippet inside of your ``teleopPeriodic()`` function.

.. tabs::

   .. group-tab:: Java

      .. tabs::

         .. group-tab:: CTRE

            .. code-block:: java

               // todo

         .. group-tab:: REV

            .. code-block:: java

               // todo

   .. group-tab:: C++

      .. tabs::

         .. group-tab:: CTRE

            .. code-block:: cpp

               // todo

         .. group-tab:: REV

            .. code-block:: cpp

               // todo

.. note:: While standard gamepad convention uses forward/back Y and left/right X, it's standard for mathematics to have left/right X and forward/back Y. Other sections that use advanced mathematics to drive your robot (such as trajectory following) will assume this!

This snippet takes the left Y axis (forward and back) and the right X axis (left and right) and puts them into ``m_forward`` and ``m_turn`` variables.
