Device Simulation
=================

WPILib provides a way to manage simulation device data in the form of the SimDevice API.

Simulating Core WPILib Device Classes
-------------------------------------

Core WPILib device classes (i.e ``Encoder``, ``Ultrasonic``, etc.) have simulation classes named ``EncoderSim``, ``UltrasonicSim``, and so on. These classes allow interactions with the device data that wouldn't be possible or valid outside of simulation. Constructing them outside of simulation likely won't interfere with your code, but calling their functions and the like is undefined behavior - in the best case they will do nothing, worse cases might crash your code! Place functional simulation code in simulation-only functions (such as ``simulationPeriodic()``) or wrap them with ``RobotBase.isReal()``/ ``RobotBase::IsReal()`` checks (which are ``constexpr`` in C++).

.. note:: This example will use the ``EncoderSim`` class as an example. Use of other simulation classes will be almost identical.

Creating Simulation Device objects
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Simulation device object can be constructed in two ways:

- a constructor that accepts the regular hardware object.
- a constructor or factory method that accepts the port/index/channel number that the device is connected to. These would be the same number that was used to construct the regular hardware object. This is especially useful for :doc:`unit testing <unit-testing>`.

.. tabs::
   .. code-tab:: java

      // create a real encoder object on DIO 2,3
      Encoder encoder = new Encoder(2, 3);
      // create a sim controller for the encoder
      EncoderSim simEncoder = new EncoderSim(encoder);

   .. code-tab:: cpp

       // create a real encoder object on DIO 2,3
       frc::Encoder encoder{2, 3};
       // create a sim controller for the encoder
       frc::sim::EncoderSim simEncoder{encoder};

Reading and Writing Device Data
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Each simulation class has getter (``getXxx()``/``GetXxx()``) and setter (``setXxx(value)``/``SetXxx(value)``) functions for each field ``Xxx``. The getter functions will return the same as the getter of the regular device class.

.. tabs::
   .. code-tab:: java

      simEncoder.setCount(100);
      encoder.getCount(); // 100
      simEncoder.getCount(); // 100

   .. code-tab:: cpp

      simEncoder.SetCount(100);
      encoder.GetCount(); // 100
      simEncoder.GetCount(); // 100

Registering Callbacks
^^^^^^^^^^^^^^^^^^^^^

In addition to the getters and setters, each field also has a ``registerXxxCallback()`` function that registers a callback to be run whenever the field value changes and returns a ``CallbackStore`` object. The callbacks accept a string parameter of the name of the field and a ``HALValue`` object containing the new value. Before retrieving values from a ``HALValue``, check the type of value contained. Possible types are ``HALValue.kBoolean``/``HAL_BOOL``, ``HALValue.kDouble``/``HAL_DOUBLE``, ``HALValue.kEnum``/``HAL_ENUM``, ``HALValue.kInt``/``HAL_INT``, ``HALValue.kLong``/``HAL_LONG``.

In Java, call ``close()`` on the ``CallbackStore`` object to cancel the callback. Keep a reference to the object so it doesn't get garbage-collected - otherwise the callback will be canceled by GC. To provide arbitrary data to the callback, capture it in the lambda or use a method reference.

In C++, save the ``CallbackStore`` object in the right scope - the callback will be canceled when the object goes out of scope and is destroyed. Arbitrary data can be passed to the callbacks via the ``param`` parameter.

.. warning:: Attempting to retrieve a value of a type from a ``HALValue`` containing a different type is undefined behavior.

.. tabs::
   .. code-tab:: java

      NotifyCallback callback = (String name, HALValue value) -> {
        if (value.getType() == HALValue.kInt) {
          System.out.println("Value of " + name + " is " + value.getInt());
        }
      }
      CallbackStore store = simEncoder.registerCountCallback(callback);

      store.close(); // cancel the callback

   .. code-tab:: cpp

      HAL_NotifyCallback callback = [](const char* name, void* param, const HALValue* value) {
        if (value->type == HAL_INT) {
          wpi::outs() << "Value of " << name << " is " << value->data.v_int << '\n';
        }
      };
      frc::sim::CallbackStore store = simEncoder.RegisterCountCallback(callback);
      // the callback will be canceled when ``store`` goes out of scope

Simulating Other Devices - The SimDeviceSim Class
-------------------------------------------------

.. note:: Vendors might implement their connection to the SimDevice API slightly different than described here. They might also provide a simulation class specific for their device class. See your vendor's documentation for more information as to what they support and how.

The ``SimDeviceSim`` (**not** ``SimDevice``!) class is a general device simulation object for devices that aren't core WPILib devices and therefore don't have specific simulation classes - such as vendor devices. These devices will show up in the :guilabel:`Other Devices` tab of the :ref:`SimGUI<docs/software/wpilib-tools/robot-simulation/simulation-gui:Modifying ADXRS450 Inputs>`.

The ``SimDeviceSim`` object is created using a string key identical to the key the vendor used to construct the underlying ``SimDevice`` in their device class. This key is the one that the device shows up with in the :guilabel:`Other Devices` tab, and is typically of the form ``Prefix:Device Name[index]``. If the key contains ports/index/channel numbers, they can be passed as separate arguments to the ``SimDeviceSim`` constructor. The key contains a prefix that is hidden by default in the SimGUI, it can be shown by selecting the :guilabel:`Show prefix` option. Not including this prefix in the key passed to ``SimDeviceSim`` will not match the device!

.. tabs::
   .. code-tab:: java

      SimDeviceSim device = new SimDeviceSim(deviceKey, index);

   .. code-tab:: cpp

      frc::sim::SimDeviceSim device{deviceKey, index};

Once we have the ``SimDeviceSim``, we can get ``SimValue`` objects representing the device's fields. Type-specific ``SimDouble``, ``SimInt``, ``SimLong``, ``SimBoolean``, and ``SimEnum`` subclasses also exist, and should be used instead of the type-unsafe ``SimValue`` class. These are constructed from the ``SimDeviceSim`` using a string key identical to the one the vendor used to define the field. This key is the one the field appears as in the SimGUI. Attempting to retrieve a ``SimValue`` object outside of simulation or when either the device or field keys are unmatched will return ``null`` - this can cause ``NullPointerException`` in Java or undefined behavior in C++.

.. tabs::
   .. code-tab:: java

      SimDouble field = device.getDouble(fieldKey);
      field.get();
      field.set(value);

   .. code-tab:: cpp

      hal::SimDouble field = device.GetDouble(fieldKey);
      field.Get();
      field.Set(value);
