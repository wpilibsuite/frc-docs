# Addressable LEDs

LED strips have been commonly used by teams for several years for a variety of reasons. They allow teams to debug robot functionality from the audience, provide a visual marker for their robot, and can simply add some visual appeal. WPILib has an API for controlling WS2812 LEDs with their data pin connected via :term:`PWM`.

.. note:: LEDs can be controlled through this API while the robot is disabled.

## Instantiating the AddressableLED Object

You first create an ``AddressableLED`` object that takes the PWM port as an argument. It *must* be a PWM header on the roboRIO. Then you set the number of LEDs located on your LED strip, which can be done with the ``setLength()`` function.

.. warning:: It is important to note that setting the length of the LED header is an expensive task and it's **not** recommended to run this periodically.

After the length of the strip has been set, you'll have to create an ``AddressableLEDBuffer`` object that takes the number of LEDs as an input. You'll then call ``myAddressableLed.setData(myAddressableLEDBuffer)`` to set the led output data. Finally, you can call ``myAddressableLed.start()`` to write the output continuously. Below is a full example of the initialization process.

.. note:: C++ does not have an AddressableLEDBuffer, and instead uses an Array.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/addressableled/Robot.java
         :language: java
         :lines: 32-47
         :linenos:
         :lineno-start: 34

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/examples/AddressableLED/include/Robot.h
         :language: c++
         :lines: 12-12, 18-27
         :linenos:
         :lineno-start: 11

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/examples/AddressableLED/cpp/Robot.cpp
         :language: c++
         :lines: 7-13
         :linenos:
         :lineno-start: 7

.. note:: The roboRIO only supports only 1 ``AddressableLED`` object. As WS2812B LEDs are connected in series, you can drive several strips connected in series from from ``AddressableLED`` object.

## Controlling Sections of an LED Strip

The roboRIO can only control a single addressable LED output at a time, but there are often multiple physical LED strips daisy-chained around a robot, or a single flexible LED strip wrapped around structures on a robot. Individual sections can be accessed in Java using ``AddressableLEDBufferView``. Buffer views behave like subsections of the larger buffer, and can be accessed using indices in the typical [0, length) range. They can also be reversed, to allow for parallel serpentine sections to be animated in the same physical orientation (i.e. both sections would animate "forward" in the same direction, even if the strips are physically tip-to-tail).

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      ```Java
      // Create the buffer
      AddressableLEDBuffer m_buffer = new AddressableLEDBuffer(120);

      // Create the view for the section of the strip on the left side of the robot.
      // This section spans LEDs from index 0 through index 59, inclusive.
      AddressableLEDBufferView m_left = m_buffer.createView(0, 59);

      // The section of the strip on the right side of the robot.
      // This section spans LEDs from index 60 through index 119, inclusive.
      // This view is reversed to cancel out the serpentine arrangement of the
      // physical LED strip on the robot.
      AddressableLEDBufferView m_right = m_buffer.createView(60, 119).reversed();
      ```

   .. tab-item:: C++
      :sync: C++

      ```C++
      // Create the buffer
      std::array<frc::AddressableLED::LEDData, 120> m_buffer;

      // Create the view for the section of the strip on the left side of the robot.
      // This section spans LEDs from index 0 through index 59, inclusive.
      std::view<frc::AddressableLED::LEDData> m_left =
         std::ranges::take_view(m_buffer, 60);

      // The section of the strip on the right side of the robot.
      // This section spans LEDs from index 60 through index 119, inclusive.
      // This view is reversed to cancel out the serpentine arrangement of the
      // physical LED strip on the robot.
      std::view<frc::AddressableLED::LEDData> m_right =
         std::ranges::reverse_view(
            std::ranges::drop_view(m_buffer, 60));
      ```

## Setting the Entire Strip to One Color

Color can be set to an individual led on the strip using two methods. ``setRGB()`` which takes RGB values as an input and ``setHSV()`` which takes HSV values as an input.

### Using RGB Values

RGB stands for Red, Green, and Blue. This is a fairly common color model as it's quite easy to understand. LEDs can be set with the ``setRGB`` method that takes 4 arguments: index of the LED, amount of red, amount of green, amount of blue. The amount of Red, Green, and Blue are integer values between 0-255.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      ```Java
      for (var i = 0; i < m_ledBuffer.getLength(); i++) {
         // Sets the specified LED to the RGB values for red
         m_ledBuffer.setRGB(i, 255, 0, 0);
      }
      m_led.setData(m_ledBuffer);
      ```

   .. tab-item:: C++
      :sync: C++

      ```C++
      for (int i = 0; i < kLength; i++) {
         m_ledBuffer[i].SetRGB(255, 0, 0);
      }
      m_led.SetData(m_ledBuffer);
      ```

### Using Solid Color Patterns

The ``LEDPattern`` API simplifies setting LED data. Rather than needing to manually loop over every LED index, you can apply a pattern object to the data buffer directly. LED patterns are stateless, and can safely be applied to multiple buffers or views.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      ```Java
      // Create an LED pattern that sets the entire strip to solid red
      LEDPattern red = LEDPattern.solid(Color.kRed);

      // Apply the LED pattern to the data buffer
      red.applyTo(m_ledBuffer);

      // Write the data to the LED strip
      m_led.setData(m_ledBuffer);
      ```

   .. tab-item:: C++
      :sync: C++

      ```C++
      // Create an LED pattern that sets the entire strip to solid red
      LEDPattern red = LEDPattern.Solid(Color::kRed);

      // Apply the LED pattern to the data buffer
      red.ApplyTo(m_ledBuffer);

      // Write the data to the LED strip
      m_led.SetData(m_ledBuffer);
      ```

### Using HSV Values

HSV stands for Hue, Saturation, and Value. Hue describes the color or tint, saturation being the amount of gray, and value being the brightness. In WPILib, Hue is an integer from 0 - 180. Saturation and Value are integers from 0 - 255. If you look at a color picker like [Google's](https://www.google.com/search?q=color+picker), Hue will be 0 - 360 and Saturation and Value are from 0% to 100%. This is the same way that OpenCV handles HSV colors. Make sure the HSV values entered to WPILib are correct, or the color produced might not be the same as was expected.

.. image:: images/hsv-models.png
   :alt: HSV models picture

LEDs can be set with the ``setHSV`` method that takes 4 arguments: index of the LED, hue, saturation, and value. An example is shown below for setting the color of an LED strip to red (hue of 0).

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      ```Java
      for (var i = 0; i < m_ledBuffer.getLength(); i++) {
         // Sets the specified LED to the HSV values for red
         m_ledBuffer.setHSV(i, 0, 100, 100);
      }
      m_led.setData(m_ledBuffer);
      ```

   .. tab-item:: C++
      :sync: C++

      ```C++
      for (int i = 0; i < kLength; i++) {
         m_ledBuffer[i].SetHSV(0, 100, 100);
      }
      m_led.SetData(m_ledBuffer);
      ```

## Creating a Rainbow Effect

Using the built in ``LEDPattern.rainbow`` method, we can create a pattern that displays a full rainbow across an entire LED strip. Then, by calling ``scrollAtAbsoluteSpeed`` we can make it animate and cycle around the strip. ``rainbow`` accepts two arguments - one for the saturation and one for the value, expressed as a number from 0 to 255.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/addressableled/Robot.java
         :language: java
         :lines: 21-31
         :linenos:
         :lineno-start: 21

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/examples/AddressableLED/include/Robot.h
         :language: c++
         :lines: 27-37
         :linenos:
         :lineno-start: 27

Now that the rainbow pattern is defined, we only need to apply it.

.. tab-set::

   .. tab-item:: Java
      :sync: Java

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/addressableled/Robot.java
         :language: java
         :lines: 50-56
         :linenos:
         :lineno-start: 50

   .. tab-item:: C++
      :sync: C++

      .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/wpilibcExamples/src/main/cpp/examples/AddressableLED/cpp/Robot.cpp
         :language: c++
         :lines: 15-20
         :linenos:
         :lineno-start: 15

.. image:: images/rainbow.gif
   :alt: Scrolling rainbow pattern running in simulation
