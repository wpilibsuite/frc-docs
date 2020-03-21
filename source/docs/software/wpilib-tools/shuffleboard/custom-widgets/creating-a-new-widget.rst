Creating A Widget
=================
Widgets allow us to view, change, and interact with data published through NetworkTables. The CameraServer, NetworkTables, and Base plugins provide the widgets to control basic data types (including FRC-specific data types). However, custom widgets allow us to control our custom data types we made in the previous sections or Java Objects.

The basic ``Widget`` interface inherits from the ``Component`` and ``Sourced`` interfaces. ``Component`` is the most basic building block of components that be displayed in shuffleboard. ``Sourced`` is an interface for things that can handle and interface with data sources to display or modify data. Both are basic building blocks towards making widgets and allows us to modify and display data.

A good widget allows the end-user to modify the widget to suit their needs. An example could be to allow the user to control the range of the number slider, that is, its maximum and minimum or the orientation of the slider itself. The view of the widget or how it looks is defined using FXML. ``FXML`` is an XML based language that allows us to build the widget interface.

More about FXML can be found `here <https://docs.oracle.com/javase/8/javafx/api/javafx/fxml/doc-files/introduction_to_fxml.html>`_.

Defining a Widgets FXML
-----------------------
In this example, we will create 2 sliders to help us control the X and Y coordinates of our Point2D data type we created in previous sections. It is helpful to place the FXML file in the same package as the Java class. 

In order to create an empty, blank window for our widget, we need to create a ``Pane``. In simple terms a Pane is a "Parent" UI element that contains other "Child" UI elements, in this case, 2 sliders.
There are many different types of Pane, they are as noted:

- Stack Pane

   - Stack Panes allow elements to be placed on top of each other.

- Grid Pane

   - Grid Panes are extremely useful defining child elements using a coordinate system by creating a flexible grid of rows and columns on the pane.

- Flow Pane/Tile Pane

   - Flow/Tile Panes place elements in the same order they were added to the pane.

- Anchor Pane

   - Anchor Panes allow child elements to be placed in the top, bottom, left side, right side, or center of the pane.

In this example, it would be sensible to use a stack pane to place the slider on top of each other. If we wanted the sliders to be at specific positions, it would make sense to use an Anchor or Grid Pane.

The basic syntax for defining a Pane uing FXML would be as the following:

.. code-block:: xml

   <?import javafx.scene.layout.*?>
   <StackPane xmlns:fx="http://javafx.com/fxml/1" fx:controller="Path To Widget Class" fx:id="name of pane">
      ...
   </StackPane>

Creating A Widget Class
-----------------------

Now that we have a Pane, we can now add child elements to that pane. In this example, we can add 2 slider objects. Remember to add an ``fx:id`` to each element so they can be reference in our Java class we will make later on.

.. code-block:: xml

   <?import javafx.scene.layout.*?>
   <StackPane xmlns:fx="http://javafx.com/fxml/1" fx:controller="Path To Widget Class" fx:id="name of pane">

      <Slider fx:id = "slider1"/>
      <Slider fx:id = "slider2"/>

   </StackPane>

Now that we have finished creating our FXML file, we can now create a widget class. The widget class must include a ``@Description`` annotation that states the supported data types of the widget and the name of the widget.

It also must include a ``@ParamatrizedController`` annotation that points to the FXML file containing the layout of the widget. Finally, the class must extend the ``SimpleAnnotatedWidget`` class.

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;
   import edu.wpi.first.shuffleboard.api.widget.Description;
   import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;

   @Description(name = "MyPoint2D", dataTypes = MyPoint2D.class)
   @ParamatrizedController("Point2DWidget.fxml")
   public final class Point2DWidget extends SimpleAnnotatedWidget<MyPoint2D> {

   }

If you are not using a custom data type, you can reference any Java data type (ie. double.class) or if the widget does not need data binding you can pass ``NoneType.class``.

Now that we have created our class we can create Java Objects for the widgets we declared in our FXML file using the ``@FXML`` annotation. For our two slider, an example would be:

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;
   import javafx.fxml.FXML;
   import edu.wpi.first.shuffleboard.api.widget.Description;
   import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;

   @Description(name = "MyPoint2D", dataTypes = MyPoint2D.class)
   @ParametrizedController("Point2DWidget.fxml")
   public final class Point2DWidget extends SimpleAnnotatedWidget<MyPoint2D> {

      //Pane
      @FXML
      private StackPane pane;

      //First slider
      @FXML
      private Slider slider1;

      //Second slider
      @FXML
      private Slider slider2;
   }

In order to display our pane on our custom widget we need to override the ``getView()`` method and return our ``StackedPane``.

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;
   import javafx.fxml.FXML;
   import edu.wpi.first.shuffleboard.api.widget.Description;
   import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;

   @Description(name = "MyPoint2D", dataTypes = MyPoint2D.class)
   @ParamatrizedController("Point2DWidget.fxml")
   public final class Point2DWidget extends SimpleAnnotatedWidget<MyPoint2D> {

      //Pane
      @FXML
      private StackPane pane;

      //First slider
      @FXML
      private Slider slider1;

      //Second slider
      @FXML
      private Slider slider2;

      @Override
      public Pane getView() {
         return pane;
      }

   }

Binding Elements and Adding Listeners
-------------------------------------
Binding is a mechanism that allows JavaFX widgets to express direct relationships with NetworkTableEntries. For example, changing a widget will change its related NetworkTableEntry and vise versa.

An example, in this case, would be changing the X and Y coordinate of our 2D point by changing slider1 and slider2 respectively.

A good practise is to set binding in the overidden ``initalize()`` method tagged with the ``@FXML`` annotation.

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;
   import javafx.fxml.FXML;
   import edu.wpi.first.shuffleboard.api.widget.Description;
   import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;

   @Description(name = "MyPoint2D", dataTypes = MyPoint2D.class)
   @ParamatrizedController("Point2DWidget.fxml")
   public final class Point2DWidget extends SimpleAnnotatedWidget<MyPoint2D> {

      //Pane
      @FXML
      private StackPane pane;

      //First slider
      @FXML
      private Slider slider1;

      //Second slider
      @FXML
      private Slider slider2;

      @FXML
      private void initialize() {
         slider.valueProperty().bind(dataOrDefault.map(MyPoint2D::getX));
         slider2.valueProperty().bind(dataOrDefault.map(MyPoint2D::getY));
      }

      @Override
      public Pane getView() {
         return pane;
      }

    }

The above ``initalize`` method binds the slider's value property to the ``MyPoint2D`` data class' corresponding X and Y value. Meaning, changing the slider will change the coordinate and vise versa.
The ``dataOrDefault.map()`` method will get the data source's value, or, if no source is present, will get the default value we set.

Using a listener is another way to change values when the slider or data source has changed. One key difference is that a listener does not tell you `what` has changed, simply that the controller `has` changed.
However, by overiding the ``changed`` method in the listener, you can access the changed property, its previous value, and its new value. For example a listener for our slider would be:

.. code-block:: java

   slider1.valueProperty().addListener(new ChangeListener<MyPoint2D>() {

      @Override
      public void changed(ObservableValue<? extends MyPoint2D> observable, MyPoint2D oldValue, MyPoint2D newValue) {
         setData(newValue);
      }
   });

In this case, the ``setData()`` method is inherited and sets the value of the data source of the widget to the ``newValue``. One downside to using listeners is that is it notourious for memory leaks if not handled properly.


Set Default Widget For Data type
--------------------------------
In order to set your widget as default for your custom data type, you can overide the ``getDefaultComponents()`` in your plugin class that stores a Map for all default widgets as noted below:

.. code-block:: java

   @Override
   public Map<DataType, ComponentType> getDefaultComponents() {
      return Map.of(Point2DType.Instance, WidgetType.forAnnotatedWidget(Point2DWidget.class));
   }




