Custom Themes
=============

Since shuffleboard is a JavaFX application, it has support for custom themes via Cascading Stylesheets (**CSS** for short). These are commonly used on webpages for making HTML look nice, but JavaFX also has ,support, albeit for a different language subset (see `here <https://openjfx.io/javadoc/11/javafx.graphics/javafx/scene/doc-files/cssref.html>`_ for documentation on how to use it).

Shuffleboard comes with three themes by default: Material Light, Material Dark, and Midnight. These are color variations on the same material design stylesheet. In addition, they inherit from a ``base.css`` stylesheet that defines styles for the custom components ,defined in shuffleboard or libraries that it uses; the base material design stylesheet only applies to the UI components built into JavaFX.

There are two ways to define a custom theme: place the stylesheets in a directory with the name of the theme in ``~/Shuffleboard/themes``; for example, a theoretical "Yellow" theme could be placed in

::

   ~/Shuffleboard/themes/Yellow/yellowtheme.css

All the stylesheets in the directory will be treated as part of the
theme.

Loading Themes via Plugins
--------------------------

Custom themes can also be defined by plugins. This makes them easier to share and bundle with custom widgets, but are slightly more difficult to define. The theme object will need a reference to a class defined in the plugin so that the plugin loader can determine where the stylesheets are located. If a class is passed that is *not* present in the JAR that the plugin is in, the theme will not be able to be used.

.. code:: java

   @Description(group = "com.example", name = "My Plugin", version = "1.2.3", summary = "")
   class MyPlugin extends Plugin {

     private static final Theme myTheme = new Theme(MyPlugin.class, "My Theme Name", "/path/to/stylesheet", "/path/to/stylesheet", ...);

     @Override
     public List<Theme> getThemes() {
       return ImmutableList.of(myTheme);
     }

   }

Modifying or Extending Shuffleboard’s Default Themes
----------------------------------------------------

Shuffleboard’s Material Light and Material Dark themes provide a lot of the framework for light and dark themes, respectively, as well as many styles specific to shuffleboard, ControlsFX, and Medusa UI components to fit with the material-style design.

Themes that want to modify these themes need to add ``import`` statements for these stylesheets:

.. code:: css

   @import "/edu/wpi/first/shuffleboard/api/material.css"; /* Material design CSS for JavaFX components */
   @import "/edu/wpi/first/shuffleboard/api/base.css";  /* Material design CSS for shuffleboard components */
   @import "/edu/wpi/first/shuffleboard/app/light.css"; /* CSS for the Material Light theme */
   @import "/edu/wpi/first/shuffleboard/app/dark.css";  /* CSS for the Material Dark theme */
   @import "/edu/wpi/first/shuffleboard/app/midnight.css";  /* CSS for the Midnight theme */

Note that ``base.css`` internally imports ``material.css``, and ``light.css``, ``dark.css``, and ``midnight.css`` all import ``base.css``, so importing ``light.css`` will implicitly import both ``base.css`` and ``material.css`` as well.

Source Code for the CSS Files
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

-  _material.css: https://github.com/wpilibsuite/shuffleboard/blob/main/api/src/main/resources/edu/wpi/first/shuffleboard/api/material.css
-  _base.css: https://github.com/wpilibsuite/shuffleboard/blob/main/api/src/main/resources/edu/wpi/first/shuffleboard/api/base.css
-  _light.css: https://github.com/wpilibsuite/shuffleboard/blob/main/app/src/main/resources/edu/wpi/first/shuffleboard/app/light.css
-  _dark.css: https://github.com/wpilibsuite/shuffleboard/blob/main/app/src/main/resources/edu/wpi/first/shuffleboard/app/dark.css
-  _midnight.css: https://github.com/wpilibsuite/shuffleboard/blob/main/app/src/main/resources/edu/wpi/first/shuffleboard/app/midnight.css

Material Design Color Swatches
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The material design CSS uses color swatch variables for almost everything. These variables can be set from custom CSS files, reducing the amount of custom code needed.

The ``-swatch-<100|200|300|400|500>`` variables define progressively darker shades of the same primary color. The light theme uses the default shades of blue set in ``material.css``, but the dark theme overrides these with shades of red. ``-swatch-<|light|dark>-gray`` defines three levels of gray to use for various background or text colors.

Overriding the Swatch Colors
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Replacing blue with red (light)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

   @import "/edu/wpi/first/shuffleboard/app/light.css"

   .root {
       -swatch-100: hsb(0, 80%, 98%);
       -swatch-200: hsb(0, 80%, 88%);
       -swatch-300: hsb(0, 80%, 78%);
       -swatch-400: hsb(0, 80%, 68%);
       -swatch-500: hsb(0, 80%, 58%);
   }

Replacing red with blue (dark)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

   @import "/edu/wpi/first/shuffleboard/app/dark.css"

   .root {
       -swatch-100: #BBDEFB;
       -swatch-200: #90CAF9;
       -swatch-300: #64BEF6;
       -swatch-400: #42A5F5;
       -swatch-500: #2196F3;
   }
