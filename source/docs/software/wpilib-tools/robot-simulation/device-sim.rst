Device Simulation
=================

WPILib provides a way to manage simulation device data in the form of the SimDevice API.

Simulating Core WPILib Device Classes
-------------------------------------

Core WPILib device classes (i.e ``Encoder``, ``Ultrasonic``, etc.) have simulation classes named ``EncoderSim``, ``UltrasonicSim``, etc. These classes allow interactions with the device data that wouldn't be possible or valid outside of simulation.

.. note:: This example will use the ``EncoderSim`` class as an example. Use of other simulation classes will be almost identical.

.. important:: Simulation classes will do nothing on a real robot!

Creating Simulation Device objects
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

All simulation device classes have a constructor that accepts the regular object, and an additional constructor or factory method to create a simulation object by the ports the device is connected to. The latter is especially useful for :doc:`unit testing <unit-testing>`.

.. tabs::
   .. code-tab:: Java

      // create a real encoder object on DIO 2,3
      Encoder encoder = new Encoder(2, 3);
      // create a sim controller for the encoder
      EncoderSim simEncoder = new EncoderSim(encoder);

     .. code-tab:: C++

       // create a real encoder object on DIO 2,3
       Encoder encoder{2, 3};
       // create a sim controller for the encoder
       EncoderSim simEncoder{encoder};

Reading and Writing Device Data
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Each simulation class has getter (``getXxx()``/``GetXxx()``) and setter (``setXxx(value)``/``SetXxx(value)``) functions for each field ``Xxx``. The getter functions will return the same as the getter of the regular device class.

.. tabs::
   .. code-tab:: Java

      simEncoder.setCount(100);
      encoder.getCount(); // 100
      simEncoder.getCount(); // 100

   .. code-tab:: C++
 
      simEncoder.SetCount(100);
      encoder.GetCount(); // 100
      simEncoder.GetCount(); // 100

Registering Callbacks
^^^^^^^^^^^^^^^^^^^^^

In addition to the getters and setters, each field also has a ``registerXxxCallback()`` function that registers a callback to be run whenever the field value changes. These functions return a ``CallbackStore`` object, the callback can be canceled by calling ``close()`` in Java or by automatic destruction in C++. The callbacks accept a string parameter of the name of the field and a ``HALValue`` object containing the value. The value can be retrieved with ``getInt()`` etc.

.. warning:: In C++, do **not** invoke the destructor explicitly! It is invoked automatically on scope exit and causes undefined behavior if explicitly destroyed earlier.

.. warning:: The ``HALValue.getXxx()`` methods are **not** typesafe! For example, calling ``getInt()`` on a ``HALValue`` containing a ``double`` will produce unpredictable results.

.. important:: Make sure to keep a reference to the ``CallbackStore`` object to prevent it being garbage-collected, which will cancel the callback.

.. tabs::
   .. code-tab:: Java

      NotifyCallback callback = (String name, HALValue value) -> {
         System.out.println("Value of " + name + " is " + value.getInt());
      }
      CallbackStore store = simEncoder.registerCountCallback(callback);

      store.close(); // cancel the callback

   .. code-tab:: C++

      NotifyCallback callback = (String name, HALValue value) {
         wpi::outs() << "Value of " << name << " is " << value.GetInt() << "\n";
      }
      CallbackStore store = simEncoder.RegisterCountCallback(callback);
      // the callback will be canceled when ``store`` goes out of scope

Simulating Other Devices - The SimDeviceSim Class
-------------------------------------------------

.. note:: Vendors might implement their connection to the SimDevice API slightly different than described here. They might also provide a simulation class specific for their device class. See your vendor's documentation for more information as to what they support and how.

.. important:: Do not confuse the ``SimDeviceSim`` class with the ``SimDevice`` class. ``SimDeviceSim`` is intended for team code while ``SimDevice`` is intended for vendors wanting to add simulation capabilities to their device classes.

The ``SimDeviceSim`` class is a general device simulation object for devices that aren't core WPILib devices and therefore don't have specific simulation classes - such as vendor devices. These devices will show up in the ::guilabel:`Other Devices` tab of the :doc:`SimGUI <docs/software/wpilib-tools/robot-simulation/simulation-gui:Modifying ADXRS450 Inputs>`_.

The ``SimDeviceSim`` object is created using a string key identical to the key the vendor used to construct the underlying ``SimDevice`` in their device class. This key is the one that the device shows up with in the ::guilabel:`Other Devices` tab, and is typically of the form ``Prefix:Device Name[index]``. If the key contains ports/index/channel numbers, they can be passed as separate arguments to the ``SimDeviceSim`` constructor.

.. important:: The key includes a prefix that is hidden by default in the SimGUI, it can be shown by selecting the ::guilabel:`Show prefix` option. Not including this prefix in the key passed to ``SimDeviceSim`` will not match the device!

.. tabs::
   .. code-tab:: Java

      SimDeviceSim device = new SimDeviceSim(deviceKey, index);

   .. code-tab:: C++

      SimDeviceSim device{deviceKey, index};

Once we have the ``SimDeviceSim``, we can get ``SimValue`` objects representing the device's fields. Type-specific ``SimDouble``, ``SimInt``, ``SimLong``, ``SimBoolean``, and ``SimEnum`` subclasses also exist, and should be used instead of the type-unsafe ``SimValue`` class. These are constructed from the ``SimDeviceSim`` using a string key identical to the one the vendor used to define the field. This key is the one the field appears as in the SimGUI. Attempting to retrieve a ``SimValue`` object when either the device or field keys are unmatched will return ``null``.

.. tabs::
   .. code-tab:: Java

      SimDouble field = device.getDouble(fieldKey);
      field.get();
      field.set(value);

   .. code-tab:: C++

      SimDouble field = device.GetDouble(fieldKey);
      field.Get();
      field.Set(value);
