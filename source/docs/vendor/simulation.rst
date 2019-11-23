Vendor Simulation Support
=========================

Desktop simulation (see :ref:`Introduction to Robot Simulation`) is an extremely useful tool for teams, as it provides them with the ability to run robot code on the desktop without the need for a RoboRIO.

Vendor support for simulation is necessary for teams using vendor devices to link (C++) or run (Java) desktop simulation of their robot code. At a minimum, for C++ and JNI, vendors need to provide compiled shared libraries for all desktop platforms (Windows, Mac, and Linux).

Simulation GUI - Vendor Hooks
-----------------------------

The WPILib simulation GUI is written in C++ using `Dear ImGui <https://github.com/ocornut/imgui>` as the GUI framework.

There are two ways for vendors to utilize the GUI:

1. Use the HAL SimDevice framework

2. Implement custom GUI windows

Using the HAL SimDevice framework is the best starting point for most devices. This framework enables creating simulation-only variables for higher level device access. For example, a device such as a SPI gyro can expose angle and rate variables to enable direct access from simulation extensions or user test code instead of requiring that the SPI bit-level protocol be implemented in the simulation code. 

SimDevice Framework
^^^^^^^^^^^^^^^^^^^

The SimDevice framework can be thought of as a very simplified version of LiveWindow/SmartDashboard. Each named device can create a set of key/value pairs (variables) where the values can be double, enum, or boolean. Each value can be marked as either read-only or writable by the user. The RoboRIO HAL layer implements stubs for the SimDevice functions that always return invalid handles. The simulated HAL returns valid handles. Handle validity is used by the user-facing code to either access the simulated value (if the handle is valid) or access the real hardware (if the handle is invalid).

An example usage of SimDevice can be seen in the :code:`ADXRS450_Gyro` class (`Java <https://github.com/wpilibsuite/allwpilib/blob/master/wpilibj/src/main/java/edu/wpi/first/wpilibj/ADXRS450_Gyro.java>`). This gyro uses an SPI interface. From a design perspective, the variables should be at a level the user would find useful for testing their code--typically this means there should be a variable for major functions--since the :code:`ADXRS450_Gyro` class provides :code:`getAngle()`, :code:`getRate()`, and :code:`isConnected()` functions, for simulation we want to provide angle, rate, and connected variables. When the user changes these variables we want the respective functions to return the user-set values.

The :code:`ADXRS450_Gyro` class has the following variables. Note they default to invalid / null.

.. tabs::

    .. code-tab:: java

        private SimDevice m_simDevice;
        private SimBoolean m_simConnected;
        private SimDouble m_simAngle;
        private SimDouble m_simRate;

    .. code-tab:: c++

        hal::SimDevice m_simDevice;
        hal::SimDouble m_simAngle;
        hal::SimDouble m_simRate;

In the ADXRS450_Gyro constructor there is the following code to initialize these variables.

.. tabs::

    .. code-tab:: java

        m_simDevice = SimDevice.create("ADXRS450_Gyro", port.value);
        if (m_simDevice != null) {
          m_simConnected = m_simDevice.createBoolean("Connected", false, true);
          m_simAngle = m_simDevice.createDouble("Angle", false, 0.0);
          m_simRate = m_simDevice.createDouble("Rate", false, 0.0);
        }

    .. code-tab:: c++

        ADXRS450_Gyro::ADXRS450_Gyro(SPI::Port port)
            : m_spi(port), m_simDevice("ADXRS450_Gyro", port) {
          if (m_simDevice) {
            m_simAngle = m_simDevice.CreateDouble("Angle", false, 0.0);
            m_simRate = m_simDevice.CreateDouble("Rate", false, 0.0);
          }
          ...
        }

On the RoboRIO HAL, :code:`SimDevice.create()` will return null; on the desktop it will return a valid SimDevice object. Thus, functions such as :code:`getAngle()` can be written to use the SimDevice functionality only on desktop, with essentially no overhead on the RoboRIO.

.. tabs::

    .. code-tab:: java

        public double getAngle() {
          if (m_simAngle != null) {
            return m_simAngle.get();
          }
          if (m_spi == null) {
            return 0.0;
          }
          return m_spi.getAccumulatorIntegratedValue() * kDegreePerSecondPerLSB;
        }

    .. code-tab:: c++

        double ADXRS450_Gyro::GetAngle() const {
          if (m_simAngle) return m_simAngle.Get();
          return m_spi.GetAccumulatorIntegratedValue() * kDegreePerSecondPerLSB;
        }

SimDevice also supports "overriding" other IO such as analog inputs. This marks them as used by a device in the simulation GUI. An example of this can be found in :code:`Ultrasonic`:

.. tabs::

    .. code-tab:: java

        if (m_simDevice != null) {
          m_simRangeValid = m_simDevice.createBoolean("Range Valid", false, true);
          m_simRange = m_simDevice.createDouble("Range (in)", false, 0.0);
          m_pingChannel.setSimDevice(m_simDevice);
          m_echoChannel.setSimDevice(m_simDevice);
        }

    .. code-tab:: c++

        if (m_simDevice) {
          m_simRangeValid = m_simDevice.CreateBoolean("Range Valid", false, true);
          m_simRange = m_simDevice.CreateDouble("Range (in)", false, 0.0);
          m_pingChannel->SetSimDevice(m_simDevice);
          m_echoChannel->SetSimDevice(m_simDevice);
        }

This causes the :code:`pingChannel` and :code:`echoChannel` (both :code:`DigitalInput`s) to be marked as used by the corresponding :code:`Ultrasonic` device.

SimDevices appear in the Devices window of the simulation GUI. Putting content into a separate window requires a custom C++ implementation of the window; see the following section.

Custom Simulation GUI Windows
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The simulation GUI can be customized further by writing C++ code to implement custom windows and/or devices. Custom windows will appear the same way as other windows for built-in devices such as DIO or Analog Inputs. Custom devices will appear in the Devices window (this is basically a more advanced/simulation side version of SimDevice). Vendors can also customize the GUI by adding main menu items and adding to the Option menu.

The C++ code must be compiled into a shared library (HALSIM extension) that is linked against the halsim_gui shared library. It can be either part of the main desktop library for simulation, or be a separate library. The halsim_gui shared library `provides several APIs for vendor use <https://github.com/wpilibsuite/allwpilib/tree/master/simulation/halsim_gui/src/main/native/include>`.

Within the callbacks provided to these APIs, the code needs to use Dear ImGui functions to actually create the GUI elements. Each of the built-in devices are implemented using the same functions provided to vendors, so there are numerous examples to choose from in the `built-in device GUI implementations <https://github.com/wpilibsuite/allwpilib/tree/master/simulation/halsim_gui/src/main/native/cpp>`.

.. note:: A complete demo and reference of all the available Dear ImGui widgets can be found at the `Dear ImGui GitHub <https://github.com/ocornut/imgui>` (see the imgui.h and imgui_demo.cpp files in particular).

Dear ImGui is an immediate-mode GUI. This means the various callback functions are called on every GUI frame to generate the complete GUI (all visible elements). They should return as quickly as possible and *not* block or delay (blocking will freeze the entire GUI).

A save/restore mechanism is provided by the Dear ImGui framework to save window positions and other settings. Several of the built-in modules hook into this framework; for a simple example of this see `AddressableLEDGui <https://github.com/wpilibsuite/allwpilib/blob/master/simulation/halsim_gui/src/main/native/cpp/AddressableLEDGui.cpp>`.

