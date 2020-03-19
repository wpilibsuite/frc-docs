Creating a Plugin
=================

Overview
--------
Plugins provide the ability to create custom widgets, layouts, data sources/types, and custom themes. Shuffleboard provides the following plugins:
- NetworkTables Plugin: To view data published on the NetworkTables
- Base Plugin: To display custom FRC data types in custom widgets
- CameraServer Plugin: To view streams from the CameraServer

Create a Custom Plugin
----------------------
In order to define a plugin, the plugin class must be a sublclass of `edu.wpi.first.shuffleboard.api.Plugin <https://github.com/wpilibsuite/shuffleboard/blob/master/api/src/main/java/edu/wpi/first/shuffleboard/api/plugin/Plugin.java>`_. An example of a plugin class would be as following.

.. tabs::

    .. code-tab:: java

        @Description(group = "com.example", name = "Good Plugin", version = "1.2.3", summary = "A good plugin")
        public class GoodPlugin extends Plugin {

        }