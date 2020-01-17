The C++ Units Library
=====================

The 2020 release of WPILib is coupled with a `Units <https://github.com/nholthaus/units>`_ library for C++ teams.  This library leverages the C++ `type system <https://docs.microsoft.com/en-us/cpp/cpp/cpp-type-system-modern-cpp?view=vs-2019>`__ to enforce proper dimensionality for method parameters, automatically perform unit conversions, and even allow users to define arbitrary defined unit types.  Since the C++ type system is enforced at compile-time, the library has essentially no runtime cost.

Using the Units Library
-----------------------

The units library is a header-only library. You must include the ``units.h`` header in your code files.

.. code-block:: c++

   #include <units/units.h>

Unit Types and Container Types
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The C++ units library is based around two sorts of type definitions: unit types and container types.

Unit Types
~~~~~~~~~~

Unit types correspond to the abstract concept of a unit, without any actual stored value.  Unit types are the fundamental "building block" of the units library - all unit types are defined constructively (using the ``compound_unit`` template) from a small number of "basic" unit types (such as ``meters``, ``seconds``, etc).

While unit types cannot contain numerical values, their use in building other unit types means that when a type or method uses a `template parameter <http://www.cplusplus.com/doc/oldtutorial/templates/>`__ to specify its dimensionality, that parameter will be a unit type.

Container Types
~~~~~~~~~~~~~~~

Container types correspond to an actual quantity dimensioned according to some unit - that is, they are what actually hold the numerical value. Container types are constructed from unit types with the ``unit_t`` template.  Most unit types have a corresponding container type that has the same name suffixed by ``_t`` - for example, the unit type ``units::meter`` corresponds to the container type ``units::meter_t``.

Whenever a specific quantity of a unit is used (as a variable or a method parameter), it will be an instance of the container type.  By default, container types will store the actual value as a ``double`` - advanced users may change this by calling the ``unit_t`` template manually.

A full list of unit and container types can be found in the `documentation <https://nholthaus.github.io/units/namespaces.html>`__.

Creating Instances of Units
^^^^^^^^^^^^^^^^^^^^^^^^^^^

To create an instance of a specific unit, we create an instance of its container type:

.. code-block:: c++

   // The variable speed has a value of 5 meters per second.
   units::meter_per_second_t speed{5.0};

Alternatively, the units library has `type literals <https://en.cppreference.com/w/cpp/language/user_literal>`__ defined for some of the more common container types.  These can be used in conjunction with type inference via ``auto`` to define a unit more succinctly:

.. code-block:: c++

   // The variable speed has a value of 5 meters per second.
   auto speed = 5_mps;

Units can also be initialized using a value of an another container type, as long as the types can be converted between one another. For example, a ``meter_t`` value can be created from a ``foot_t`` value.

.. code-block:: c++

   auto feet = 6_ft;
   units::meter_t meters{feet};

In fact, all container types representing convertible unit types are *implicitly convertible*.  Thus, the following is perfectly legal:

.. code-block:: c++

   units::meter_t distance = 6_ft;

In short, we can use *any* unit of length in place of *any other* unit of length, anywhere in our code; the units library will automatically perform the correct conversion for us.

Performing Arithmetic with Units
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Container types support all of the ordinary arithmetic operations of their underlying data type, with the added condition that the operation must be *dimensionally* sound.  Thus, addition must always be performed on two compatible container types:

.. code-block:: c++

   // Add two meter_t values together
   auto sum = 5_m + 7_m; // sum is 12_m

   // Adds meters to feet; both are length, so this is fine
   auto sum = 5_m + 7_ft;

   // Tries to add a meter_t to a second_t, will throw a compile-time error
   auto sum = 5_m + 7_s;

Multiplication may be performed on any pair of container types, and yields the container type of a compound unit:

.. note:: When a calculation yields a compound unit type, this type will only be checked for validity at the point of operation if the result type is specified explicitly.  If ``auto`` is used, this check will not occur.  For example, when we divide distance by time, we may want to ensure the result is, indeed, a velocity (i.e. ``units::meter_per_second_t``). If the return type is declared as ``auto``, this check will not be made.

.. code-block:: c++

   // Multiply two meter_t values, result is square_meter_t
   auto product = 5_m * 7_m; // product is 35_sq_m

.. code-block:: c++

   // Divide a meter_t value by a second_t, result is a meter_per_second_t
   units::meter_per_second_t speed = 6_m / 0.5_s; // speed is 12_mps

``<cmath>`` Functions
^^^^^^^^^^^^^^^^^^^^^

Some ``std`` functions (such as ``clamp``) are templated to accept any type on which the arithmetic operations can be performed.  Quantities stored as container types will work with these functions without issue.

However, other ``std`` functions work only on ordinary numerical types (e.g. ``double``).  The units library's ``units::math`` namespace contains wrappers for several of these functions that accept units. Examples of such functions include ``sqrt``, ``pow``, etc.

.. code-block:: c++

   auto area = 36_sq_m;
   units::meter_t sideLength = units::math::sqrt(area);

Removing the Unit Wrapper
^^^^^^^^^^^^^^^^^^^^^^^^^

To convert a container type to a raw numeric value, the ``to<..>()`` method can be used, where the template argument is the underlying type.

.. code-block:: c++

   units::meter_t distance = 6.5_m;
   double distanceMeters = distance.to<double>();


Example of the Units Library in WPILib Code
-------------------------------------------
Several arguments for methods in new features of WPILib (ex. :ref:`kinematics <docs/software/kinematics-and-odometry/intro-and-chassis-speeds:What is kinematics?>`) use the units library. Here is an example of :ref:`sampling a trajectory <docs/software/advanced-control/trajectories/manipulating-trajectories:Sampling the trajectory>`.

.. code-block:: c++

   // Sample the trajectory at 1.2 seconds. This represents where the robot
   // should be after 1.2 seconds of traversal.
   Trajectory::State point = trajectory.Sample(1.2_s);

   // Since units of time are implicitly convertible, this is exactly equivalent to the above code
   Trajectory::State point = trajectory.Sample(1200_ms);

Some WPILib classes represent objects that could naturally work with multiple choices of unit types - for example, a motion profile might operate on either linear distance (e.g. meters) or angular distance (e.g. radians).  For such classes, the unit type is required as a template parameter:

.. code-block:: c++

   // Creates a new set of trapezoidal motion profile constraints
   // Max velocity of 10 meters per second
   // Max acceleration of 20 meters per second squared
   frc::TrapezoidProfile<units::meters>::Constraints{10_mps, 20_mps_sq};

   // Creates a new set of trapezoidal motion profile constraints
   // Max velocity of 10 radians per second
   // Max acceleration of 20 radians per second squared
   frc::TrapezoidProfile<units::radians>::Constraints{10_rad_per_s, 20__rad_per_s / 1_s};

For more detailed documentation, please visit the official `GitHub page <https://github.com/nholthaus/units>`_ for the units library.
