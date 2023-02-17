Creating A Widget
=================
Widgets allow us to view, change, and interact with data published through different data sources. The CameraServer, NetworkTables, and Base plugins provide the widgets to control basic data types (including FRC-specific data types). However, custom widgets allow us to control our custom data types we made in the previous sections or Java Objects.

The basic ``Widget`` interface inherits from the ``Component`` and ``Sourced`` interfaces. ``Component`` is the most basic building block of components that be displayed in Shuffleboard. ``Sourced`` is an interface for things that can handle and interface with data sources to display or modify data. Widgets that don't support data bindings but simply have child nodes would not use the ``Sourced`` interface but simply the ``Component`` interface. Both are basic building blocks towards making widgets and allows us to modify and display data.

A good widget allows the end-user to customize the widget to suit their needs. An example could be to allow the user to control the range of the number slider, that is, its maximum and minimum or the orientation of the slider itself. The view of the widget or how it looks is defined using FXML. ``FXML`` is an XML based language that is useful for defining the static layout of the widget (Panes, Labels and Controls).

More about FXML can be found `here <https://openjfx.io/javadoc/11/javafx.fxml/javafx/fxml/doc-files/introduction_to_fxml.html>`_.

Defining a Widget's FXML
------------------------
In this example, we will create two sliders to help us control the X and Y coordinates of our Point2D data type we created in previous sections. It is helpful to place the FXML file in the same package as the Java class.

In order to create an empty, blank window for our widget, we need to create a ``Pane``. A Pane is a parent node that contains other child nodes, in this case, 2 sliders.
There are many different types of Pane, they are as noted:

- Stack Pane

   - Stack Panes allow elements to be overlaid. Also, StackPanes by default center child nodes.

- Grid Pane

   - Grid Panes are extremely useful defining child elements using a coordinate system by creating a flexible grid of rows and columns on the pane.

- Flow Pane

   - Flow Panes wrap all child nodes at a boundary set. Child nodes can flow vertically (wrapped at the height boundary for the pane) or horizontally (wrapped at the width boundary of the pane).

- Anchor Pane

   - Anchor Panes allow child elements to be placed in the top, bottom, left side, right side, or center of the pane.

Layout panes are also extremely useful for placing child nodes in one horizontal row using a `HBox <https://openjfx.io/javadoc/11/javafx.graphics/javafx/scene/layout/HBox.html>`_ or one vertical column using a `VBox <https://openjfx.io/javadoc/11/javafx.graphics/javafx/scene/layout/VBox.html>`_.

The basic syntax for defining a Pane using FXML would be as the following:

.. code-block:: xml

   <?import javafx.scene.layout.*?>
   <StackPane xmlns:fx="http://javafx.com/fxml/1" fx:controller="/path/to/widget/class" fx:id="root">
      ...
   </StackPane>

The ``fx:controller`` attribute contains the name of the widget class. An instance of this class is created when the FXML file is loaded. For this to work, the controller class must have a no-argument constructor.

Creating A Widget Class
-----------------------

Now that we have a Pane, we can now add child elements to that pane. In this example, we can add two slider objects. Remember to add an ``fx:id`` to each element so they can be referenced in our Java class we will make later on. We will use a ``VBox`` to position our slider on top of each other.

.. code-block:: xml

   <?import javafx.scene.layout.*?>
   <StackPane xmlns:fx="http://javafx.com/fxml/1" fx:controller="/path/to/widget/class" fx:id="root">

      <VBox>
         <Slider fx:id = "xSlider"/>
         <Slider fx:id = "ySlider"/>
      </VBox>

   </StackPane>

Now that we have finished creating our FXML file, we can now create a widget class. The widget class should include a ``@Description`` annotation that states the supported data types of the widget and the name of the widget. If a ``@Description`` annotation is not present, the plugin class must implement the ``get()`` method to return its widgets.

It also must include a ``@ParametrizedController`` annotation that points to the FXML file containing the layout of the widget. If the class that only supports one data source it must extend the ``SimpleAnnotatedWidget`` class. If the class supports multiple data sources, it must extend the ``ComplexAnnotatedWidget`` class. For more information, see :doc:`widget-types`.

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.widget.Description;
   import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;
   import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;

   /*
    * If the FXML file and Java file are in the same package, that is the Java file is in src/main/java and the
    * FXML file is under src/main/resources or your code equivalent package, the relative path will work
    * However, if they are in different packages, an absolute path will be required.
   */

   @Description(name = "MyPoint2D", dataTypes = MyPoint2D.class)
   @ParametrizedController("Point2DWidget.fxml")
   public final class Point2DWidget extends SimpleAnnotatedWidget<MyPoint2D> {

   }

If you are not using a custom data type, you can reference any Java data type (ie. ``Double.class``), or if the widget does not need data binding you can pass ``NoneType.class``.

Now that we have created our class we can create fields for the widgets we declared in our FXML file using the ``@FXML`` annotation. For our two sliders, an example would be:

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.widget.Description;
   import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;
   import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;
   import javafx.fxml.FXML;

   @Description(name = "MyPoint2D", dataTypes = MyPoint2D.class)
   @ParametrizedController("Point2DWidget.fxml")
   public final class Point2DWidget extends SimpleAnnotatedWidget<MyPoint2D> {

      @FXML
      private Pane root;

      @FXML
      private Slider xSlider;

      @FXML
      private Slider ySlider;
   }

In order to display our pane on our custom widget we need to override the ``getView()`` method and return our ``StackPane``.

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.widget.Description;
   import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;
   import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;
   import javafx.fxml.FXML;

   @Description(name = "MyPoint2D", dataTypes = MyPoint2D.class)
   @ParametrizedController("Point2DWidget.fxml")
   public final class Point2DWidget extends SimpleAnnotatedWidget<MyPoint2D> {

      @FXML
      private StackPane root;

      @FXML
      private Slider xSlider;

      @FXML
      private Slider ySlider;

      @Override
      public Pane getView() {
         return root;
      }

   }

Binding Elements and Adding Listeners
-------------------------------------
Binding is a mechanism that allows JavaFX widgets to express direct relationships with the data source. For example, changing a widget will change its related NetworkTableEntry and vise versa.

An example, in this case, would be changing the X and Y coordinate of our 2D point by changing the values of xSlider and ySlider respectively.

A good practice is to set bindings in the ``initialize()`` method tagged with the ``@FXML`` annotation which is required to call the method from FXML if the method is not ``public``.

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.widget.Description;
   import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;
   import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;
   import javafx.fxml.FXML;

   @Description(name = "MyPoint2D", dataTypes = MyPoint2D.class)
   @ParametrizedController("Point2DWidget.fxml")
   public final class Point2DWidget extends SimpleAnnotatedWidget<MyPoint2D> {

      @FXML
      private StackPane root;

      @FXML
      private Slider xSlider;

      @FXML
      private Slider ySlider;

      @FXML
      private void initialize() {
         xSlider.valueProperty().bind(dataOrDefault.map(MyPoint2D::getX));
         ySlider.valueProperty().bind(dataOrDefault.map(MyPoint2D::getY));
      }

      @Override
      public Pane getView() {
         return root;
      }

    }

The above ``initialize`` method binds the slider's value property to the ``MyPoint2D`` data class' corresponding X and Y value. Meaning, changing the slider will change the coordinate and vise versa.
The ``dataOrDefault.map()`` method will get the data source's value, or, if no source is present, will return the default value.

Using a listener is another way to change values when the slider or data source has changed. For example a listener for our slider would be:

.. code-block:: java

   xSlider.valueProperty().addListener((observable, oldValue, newValue) -> setData(getData().withX(newValue));

In this case, the ``setData()`` method sets the value in the data source of the widget to the ``newValue``.

Exploring Custom Components
---------------------------
Widgets are not automatically discovered when loading plugins; the defining plugin must explicitly export it for it to be usable. This approach is taken to allow multiple plugins to be defined in the same JAR.

.. code-block:: java

   @Override
   public List<ComponentType> getComponents() {
     return List.of(WidgetType.forAnnotatedWidget(Point2DWidget.class));
   }

Set Default Widget For Data type
--------------------------------
In order to set your widget as default for your custom data type, you can override the ``getDefaultComponents()`` in your plugin class that stores a Map for all default widgets as noted below:

.. code-block:: java

   @Override
   public Map<DataType, ComponentType> getDefaultComponents() {
      return Map.of(Point2DType.Instance, WidgetType.forAnnotatedWidget(Point2DWidget.class));
   }
