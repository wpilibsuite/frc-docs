The SimDevice API
=================

WPILib provides a way to manage simulation device data. This is in the form of the SimDevice API.

Device Wrapper Classes
----------------------

Most WPILib base device classes (i.e Encoder, Ultrasonic, etc.) have wrapper classes named `EncoderSim`, `UltrasonicSim`, and the like. These classes allow interactions with the device data that wouldn't be possible or valid outside of simulation.

.. note: This example will use the `EncoderSim` class as an example. Use of other simulation classes will be almost identical.

.. important: These classes will do nothing on a real robot.

Creating Simulation Device objects
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

All simulation device classes have a constructor that accepts the regular object.

.. tabs::
    .. code-tab:: Java
    // create a real encoder object on DIO 2,3
    Encoder encoder = new Encoder(2, 3);
    // create a sim controller for the encoder
    EncoderSim simEncoder = new EncoderSim(encoder);

    .. code-tab:: C++
    // create a real encoder object on DIO 2,3
    Encoder encoder {2, 3};
    // create a sim controller for the encoder
    EncoderSim simEncoder {encoder};

Reading and Writing Device Data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Each simulation class has getter (`getXxx()`/`GetXxx()`) and setter (`setXxx(value)`) functions for each field `Xxx`. The getter functions will return the same as the getter of the regular device class.

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
~~~~~~~~~~~~~~~~~~~~~

In addition to the getters and setters, each field also has a `registerXxxCallback()` function that registers a callback to be run whenever the field value changes. These functions return a `CallbackStore` object, the callback can be canceled by calling `close()`.
The callbacks accept a string parameter of the name of the field and a `HALValue` object containing the value. The value can be retrieved with `getInt()` etc.

.. warning: The `HALValue.getType()` methods are **not** typesafe! For example, calling `getInt()` on a `HALValue` containing a `double` will return garbage.

.. important: Make sure to keep a reference to the `CallbackStore` object to prevent it being garbage-collected, canceling the callback.

.. tabs::
    .. code-tab:: Java
    NotifyCallback callback = (String name, HALValue value) -> {
        System.out.println("Value of " + name + " is " + value.getInt());
    }
    simEncoder.registerCountCallback(callback);

    .. code-tab:: C++
    // TODO

Resetting Simulation Data
~~~~~~~~~~~~~~~~~~~~~~~~~

All data of a simulation object can be reset with the `resetData()` method.

The SimDeviceSim class
----------------------

The `SimDeviceSim` class is practically a generic device simulation object.