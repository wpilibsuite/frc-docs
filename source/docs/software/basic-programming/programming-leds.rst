Programming LEDs
================

LED strips have been commonly used by teams for several years for a variety of reasons. They allow teams to debug robot functionality from the audience, provide a visual marker for their robot, and can simply add some visual appeal. WPILib has an API for controlling LEDs with their data pin connected via PWM.

Instantiating the AddressableLED Object
---------------------------------------

You first create an ``AddressableLED`` object that takes the PWM port as an argument. It *must* be a PWM header. Then you set the number of LEDs located on your LED strip, with can be done with the ``setLength()`` function.

.. important:: It is important to note that setting the length of the LED header is an expensive task and it's **not** recommended to run this periodically.

After the length of the strip has been set, you'll have to create an ``AddressableLEDBuffer`` object that takes the number of LEDs as an input. You'll then call ``myAddressableLed.setData(myAddressableLEDBuffer)`` to set the led output data. Finally, you can call ``myAddressableLed.start`` to write the output continuously. Below is a full example of the initialization process.

.. note:: C++ does not have an AddressableLEDBuffer, and instead uses an Array.

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/addressableled/Robot.java
         :language: java
         :lines: 8-23
         :linenos:
         :lineno-start: 14

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibcExamples/src/main/cpp/examples/AddressableLED/cpp/Robot.cpp
         :language: cpp
         :lines: 14-23
         :linenos:
         :lineno-start: 14

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibcExamples/src/main/cpp/examples/AddressableLED/cpp/Robot.cpp
         :language: cpp
         :lines: 41-47
         :linenos:
         :lineno-start: 41

Setting the Entire Strip to One Color
-------------------------------------

Color can be set to an individual led on the strip using the ``setHSV()`` method. ``setHSV`` takes four arguments; index of the LED, hue, saturation, and value.

.. tabs::

   .. group-tab:: Java

      .. code-block:: Java

         for (var i = 0; i < m_ledBuffer.getLength(); i++) {
            // Sets the specified LED to the HSV values for red
            m_ledBuffer.setHSV(i, 0, 100, 100);
         }

         m_led.setData(m_ledBuffer);

   .. group-tab:: C++

      .. code-block:: C++

         for (int i = 0; i < kLength; i++) {
            m_ledBuffer[i].SetHSV(0, 255, 255);
         }

         m_led.SetData(m_ledBuffer);

Creating a Rainbow Effect
-------------------------

It's good robot practice to keep the ``robotPeriodic()`` method as clean as possible, so we'll create a method for handling setting our LED data. We'll call this method ``rainbow()`` and call it from ``robotPeriodic()``.

The below method does a couple of important things. Inside of the *for* loop, it equally distributes the hue over the entire length of the strand and stores the individual LED hue to a variable called ``hue``. Then the for loop sets the HSV value of that specified pixel using the ``hue`` value.

Moving outside of the for loop, the ``m_rainbowFirstPixelHue`` then iterates the pixel that contains the "initial" hue creating the rainbow effect. ``m_rainbowFirstPIxelHue`` then checks to make sure that the hue is inside the hue boundaries of 180. This is because HSV hue is a value from 0-180.

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/addressableled/Robot.java
         :language: java
         :lines: 45-58
         :linenos:
         :lineno-start: 45

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibcExamples/src/main/cpp/examples/AddressableLED/cpp/Robot.cpp
         :language: cpp
         :lines: 26-39
         :linenos:
         :lineno-start: 26

Now that we have our ``rainbow`` method created, we have to actually call the method and set the data of the LED.

.. tabs::

   .. group-tab:: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/addressableled/Robot.java
         :language: java
         :lines: 37-43
         :linenos:
         :lineno-start: 37

   .. group-tab:: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/master/wpilibcExamples/src/main/cpp/examples/AddressableLED/cpp/Robot.cpp
         :language: cpp
         :lines: 49-55
         :linenos:
         :lineno-start: 49