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
        import edu.wpi.first.shuffleboard.api.plugin.Description;
        import edu.wpi.first.shuffleboard.api.plugin.Plugin;

        @Description(group = "com.example", name = "MyPlugin", version = "1.2.3", summary = "An example plugin")
        public class MyPlugin extends Plugin {

        }

Note the ``@Description`` annotation which is needed to tell the plugin loader the properties of the custom plugin class.
Plugin classes are permitted to have a defualt constructor but it cannot take any arguments.

Building plugin
---------------
Plugins require the usuage of the `Shuffleboard API Library <https://frcmaven.wpi.edu/artifactory/release/edu/wpi/first/shuffleboard/api/>`_. These dependencies can be resolved in the 
`build.gradle` file or using maven. The dependencies would be as follows:

For Gradle:

.. code-block:: groovy

    dependencies {
        api files("path/to/shuffleboard.jar")
    } 

Plugins are allowed to have dependencies on other plugins and libraries, however, they must be included correctly in the maven or gradle build file. 
When having Plugin dependencies to other plugins, it is good practise to define those dependencies so the plugin does not load when the dependencies do not load as well.
This can be done using the ``@Requires`` annotation as shown below:

.. code-block:: java

    @Requires(group = "com.example", name = "Good Plugin", minVersion = "1.2.3")
    @Requires(group = "edu.wpi.first.shuffleboard", "Base", minVersion = "1.0.0")
    @Description(group = "com.example", name = "MyPlugin", version = "1.2.3", summary = "An example plugin")
    public class MyPlugin extends Plugin {

    }

Deploying Plugin To Shuffleboard
--------------------------------
In order to load a plugin to the shuffleboard, you will need to generate a jar file of the plugin and put it in the `~/Shuffleboard/plugins` folder. This can be down automatically
from gradle as noted:

.. code-block::groovy

    task deployWidget (type: Copy, group: "...", description: "...", dependsOn: "build") {
        from "build/libs"
        into "path/to/Shuffleboard/plugins"
        include "*.jar"
    }

        
The ``deployWidget`` task takes 4 parameters, ``type: Copy`` parameter makes the task implement the `CopySpec <https://docs.gradle.org/current/javadoc/org/gradle/api/file/CopySpec.html>`_ interface
specifying what to copy. The group and description parameters to specifiy what the Group ID of the plugin is and a short descriptive description to what the Plugin does. 

In the body, the ``from`` field specifies from where the file is to be copied from, followed by the ``into`` field specifying the destination to where the file needs to be copied.
Finally, the ``include`` field ensures the ``.jar`` extention is also copied.

By running ``gradle deployWidget`` from the command line, the jar file will automatically placed into the shuffleboard plugin folder.

Manually Adding Plugin
----------------------
The other way to add a plugin to Shuffleboard is to compile it to a jar file and add it from Shuffleboard.
First, compile your plugin into a .jar file using Maven or Gradle. Then, open Shuffleboard, click on the file tab in the top left, and choose Plugins from the drop down menu.
From the plugins window, choose the "Load plugin" button in the bottom right, and select your jar file. 



