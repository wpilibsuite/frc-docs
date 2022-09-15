Widget Types
============

While ``Widget`` is pretty straightforward as far as the interface is concerned, there are several intermediate implementations to make it easier to define the widget.

+-----------------------------------+-----------------------------------+
| Class                             | Description                       |
+===================================+===================================+
| ``AbstractWidget``                | Implements ``getProperties()``,   |
|                                   | ``getSources()``, and             |
|                                   | ``titleProperty()``               |
+-----------------------------------+-----------------------------------+
| ``SingleTypeWidget<T>``           | Adds properties for widgets that  |
|                                   | only support a single data type   |
+-----------------------------------+-----------------------------------+
| ``AnnotatedWidget``               | Adds default implementations for  |
|                                   | ``getName()`` and                 |
|                                   | ``getDataTypes()`` for widgets    |
|                                   | with a ``@Description``           |
|                                   | annotation                        |
+-----------------------------------+-----------------------------------+
| ``SingleSourceWidget``            | For widgets with only a single    |
|                                   | source (by default, widgets       |
|                                   | support multiple sources)         |
+-----------------------------------+-----------------------------------+
| ``SimpleAnnotatedWidget<T>``      | Combines ``SingleTypeWidget<T>``, |
|                                   | ``AnnotatedWidget``, and          |
|                                   | ``SingleSourceWidget``            |
+-----------------------------------+-----------------------------------+

There are also two annotations to help define widgets:

+-----------------------------------+-----------------------------------+
| Name                              | Description                       |
+===================================+===================================+
| ``@ParametrizedController``       | Allows widgets to be FXML         |
|                                   | controllers for JavaFX views      |
|                                   | defined via FXML                  |
+-----------------------------------+-----------------------------------+
| ``@Description``                  | Lets the name and supported data  |
|                                   | types be defined in a single line |
+-----------------------------------+-----------------------------------+

AbstractWidget
--------------

This class implements ``getProperties()``, ``getSources()``, ``addSource()``, and ``titleProperty()``. It also defines a method ``exportProperties(Property<?>...)`` method so subclasses can easy add custom widget properties, or properties for the JavaFX components in the widget. Most of the `widgets in the base plugin <https://github.com/wpilibsuite/shuffleboard/tree/main/plugins/base/src/main/java/edu/wpi/first/shuffleboard/plugin/base/widget>`_ use this.

SingleTypeWidget
----------------

A type of widget that only supports a single data type. This interface is parametrized and has methods for setting or getting the data, as well as a method for getting the (single) data type of the widget.

AnnotatedWidget
---------------

This interface implements ``getDataTypes()`` and ``getName()`` by looking at the ``@Description`` annotation on the implementing class. This *requires* the annotation to be present, or the widget will not be able to be loaded and used.

.. code:: java

   // No @Description annotation!
   public class WrongImplementation implements AnnotatedWidget {
     // ...
   }

.. code:: java

   @Description(name = ..., dataTypes = ...)
   public class CorrectImplementation implements AnnotatedWidget {
     // ...
   }

SingleSourceWidget
------------------

A type of widget that only uses a single source.

SimpleAnnotatedWidget
---------------------

A combination of ``SingleTypeWidget<T>``, ``AnnotatedWidget``, and ``SingleSourceWidget``. Most widgets in the base plugin extend from this class. This also has a ``protected`` field called ``dataOrDefault`` that lets subclasses use a default data value if the widget doesn’t have a source, or if the source is providing ``null``.

@ParametrizedController
-----------------------

This annotation can be placed on a widget class to let shuffleboard know that it’s an FXML controller for a JavaFX view defined via FXML. The annotation takes a single parameter that defines where the FXML file *in relation to the class on which it is placed*. For example, a widget in the directory ``src/main/java/com/acme`` that is an FXML controller for a FXML file in ``src/main/resources/com/acme`` can use the annotation as either

.. code:: java

   @ParametrizedController("MyWidget.fxml")

or as

.. code:: java

   @ParametrizedController("/com/acme/MyWidget.fxml")

@Description
------------

This allows widgets to have their name and supported data types defined by a single annotation, when used alongside `AnnotatedWidget`_.
