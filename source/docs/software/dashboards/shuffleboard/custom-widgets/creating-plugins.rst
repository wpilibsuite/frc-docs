.. include:: <isonum.txt>

Creating a Plugin
=================

Overview
--------
Plugins provide the ability to create custom widgets, layouts, data sources/types, and custom themes. Shuffleboard provides the following :ref:`built-in plugins <docs/software/dashboards/shuffleboard/custom-widgets/builtin-plugins:Built-in Plugins>`.

- NetworkTables Plugin: To connect to data published over NetworkTables
- Base Plugin: To display custom FRC\ |reg| data types in custom widgets
- CameraServer Plugin: To view streams from the CameraServer

.. tip:: An example custom Shuffleboard plugin which creates a custom data type and a simple widget for displaying it can be found `here <https://github.com/wpilibsuite/shuffleboard/tree/main/example-plugins/custom-data-and-widget>`__.

Create a Custom Plugin
----------------------
In order to define a plugin, the plugin class must be a subclass of `edu.wpi.first.shuffleboard.api.Plugin <https://github.com/wpilibsuite/shuffleboard/blob/main/api/src/main/java/edu/wpi/first/shuffleboard/api/plugin/Plugin.java>`_ or one of its subclasses. An example of a plugin class would be as following.

.. tabs::

   .. code-tab:: java

      import edu.wpi.first.shuffleboard.api.plugin.Description;
      import edu.wpi.first.shuffleboard.api.plugin.Plugin;

      @Description(group = "com.example", name = "MyPlugin", version = "1.2.3", summary = "An example plugin")
      public class MyPlugin extends Plugin {

      }

Additional explanations on how these attributes are used, including version numbers can be found `here <https://semver.org/>`_.

Note the ``@Description`` annotation is needed to tell the plugin loader the properties of the custom plugin class.
Plugin classes are permitted to have a default constructor but it cannot take any arguments.

Building plugin
---------------

The easiest way to build plugins is to utlize the `example-plugins` folder in the shufflebloard source tree. Clone Shuffleboard with ``git clone https://github.com/wpilibsuite/shuffleboard.git``, and checkout the version that corresponds to the WPILib version you have installed (e.g. 2023.2.1). ``git checkout v2023.2.1``

Put your plugin in the ``example-plugins\PLUGIN-NAME`` directory.
Copy the ``custom-data-and-widget.gradle`` from ``example-plugins\custom-data-and-widget`` and rename to match your plugin name.
Edit ``settings.gradle`` in the shuffleboard root directory to add ``include "example-plugins:PLUGIN-NAME"``

.. note::replace ``PLUGIN-NAME`` with the name of your plugin

Plugins are allowed to have dependencies on other plugins and libraries, however, they must be included correctly in the maven or gradle build file. When a plugin depends on other plugins, it is good practice to define those dependencies so the plugin does not load when the dependencies do not load as well. This can be done using the ``@Requires`` annotation as shown below:

.. code-block:: java

   @Requires(group = "com.example", name = "Good Plugin", minVersion = "1.2.3")
   @Requires(group = "edu.wpi.first.shuffleboard", name = "Base", minVersion = "1.0.0")
   @Description(group = "com.example", name = "MyPlugin", version = "1.2.3", summary = "An example plugin")
   public class MyPlugin extends Plugin {

   }

The ``minVersion`` specifies the minimum allowable version of the plugin that can be loaded. For example, if the ``minVersion`` is 1.4.5, and the plugin with the version 1.4.7 is loaded, it will be allowed to do so. However, if the plugin with the version 1.2.4 is loaded, it will not be allowed to since it is less than the ``minVersion``.

Deploying Plugin To Shuffleboard
--------------------------------
In order to load a plugin in Shuffleboard, you will need to generate a jar file of the plugin and put it in the ``~/Shuffleboard/plugins`` folder. This can be done automatically
by running from the shuffleboard root ``gradlew :example-plugins:PLUGIN-NAME:installPlugin``

After deploying, Shuffleboard will cache the path of the plugin so it can be automatically loaded the next time Shuffleboard loads. It may be necessary to click on ``Clear Cache`` under the plugins menu to remove a plugin or reload a plugin into Shuffleboard.

Manually Adding Plugin
----------------------
The other way to add a plugin to Shuffleboard is to compile it to a jar file and add it from Shuffleboard. The jar file is located in ``example-plugins\PLUGIN-NAME\build\libs`` after running ``gradlew build`` in the shuffleboard root
Open Shuffleboard, click on the file tab in the top left, and choose Plugins from the drop down menu.

.. image:: images/loading-plugin.png
   :alt: Manually adding custom plugins

From the plugins window, choose the "Load plugin" button in the bottom right, and select your jar file.
