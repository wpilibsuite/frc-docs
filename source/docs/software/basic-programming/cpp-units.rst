The C++ Units Library
=====================
The 2020 release of WPILib is coupled with a `Units <https://github.com/nholthaus/units>`_ library for C++ teams. The units library allows for users to define a unit, convert between units, and perform operations on units (dimensional analysis) at compile-time without any runtime costs. Several new features in wpilibc now use this units library.

Using the Units Library
-----------------------
The units library is a header-only library. You must include the ``units.h`` header in your code files.

.. code-block:: c++

   #include <units/units.h>

Creating Instances of Units
^^^^^^^^^^^^^^^^^^^^^^^^^^^
The ``units`` namespace contains various types for different types of units. These types have a suffix of ``_t``. See the `documentation <http://nholthaus.github.io/units/namespaces.html>`_ for the complete list of types.

.. code-block:: c++

   // The variable speed has a value of 5 meters per second.
   units::meter_per_second_t speed{5.0};

Alternatively, automatic type deduction using ``auto`` and literals can be used. This method is less verbose and recommended.

.. code-block:: c++

   // The variable speed has a value of 5 meters per second.
   auto speed = 5_mps;

Units can also be initialized using a value of an another unit type, as long as the types can be converted between one another. For example, a ``meter_t`` value can be created from a ``foot_t`` value.

.. code-block:: c++

   auto feet = 6_ft;
   units::meter_t meters{feet};


``<cmath>`` Functions
^^^^^^^^^^^^^^^^^^^^^
The units library's ``units::math`` namespace contains several ``cmath`` functions that accept units. Examples of such functions include ``sqrt``, ``pow``, etc.

.. code-block:: c++

   auto area = 36_sq_m;
   units::meter_t sideLength = units::math::sqrt(area);

Performing Unit Operations
^^^^^^^^^^^^^^^^^^^^^^^^^^
The units library can also be used to perform operations between units, such as addition and multiplication.

.. code-block:: c++

   // Add two meter_t values together
   auto one = 5_m;
   auto two = 7_m;
   units::meter_t sum = one + two; // sum is 12_m

.. code-block:: c++

   // Multiply two meter_t values to create a square_meter_t
   auto one = 5_m;
   auto two = 7_m;
   units::square_meter_t product = one * two; // product is 35_sq_m

.. code-block:: c++

   // Divide a meter_t value by a second_t value to create a speed.
   auto distance = 6_m;
   auto time = 0.5_s;

   units::meter_per_second_t speed = distance / time; // speed is 12_mps

.. note:: When the calculation is made, ``auto`` is not used to ensure the validity of the calculation. When we divide distance by time, we want to make sure that a speed object (i.e. ``units::meter_per_second_t``) is being created. If the rvalue is not of type ``meter_per_second_t``, the compiler will throw an error. If ``auto`` is used, this check will not be made.

Removing the Unit Wrapper
^^^^^^^^^^^^^^^^^^^^^^^^^
To expose the underlying type of the unit object, the ``to<..>()`` method can be used, where the template argument is the underlying type.

.. code-block:: c++

   units::meter_t distance = 6.5_m;
   double distanceMeters = distance.to<double>();


Example of the Units Library in WPILib Code
-------------------------------------------
Several arguments for methods in new features of WPILib (ex. :ref:`kinematics <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is kinematics?>`) use the Units library. Here is an example of :ref:`sampling a trajectory <docs/software/advanced-control/trajectories/manipulating-trajectories:Sampling the trajectory>`.

.. code-block:: c++

   // Sample the trajectory at 1.2 seconds. This represents where the robot
   // should be after 1.2 seconds of traversal.
   Trajectory::State point = trajectory.Sample(1.2_s);

The code above is equivalent to the following.

.. code-block:: c++

  Trajectory::State point = trajectory.Sample(1200_ms);

.. note:: This conversion from milliseconds to seconds is performed at compile-time, meaning that there is no penalty for using any unit that measures time.

For more detailed documentation and defining custom units, please visit the official `GitHub page <https://github.com/nholthaus/units>`_ for the units library.
