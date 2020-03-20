Creating A Widget
=================
Widgets allow us to view, change, and interact with data published through the NetworkTables. The CameraServer, NetworktTables, and Base plugins provide the widgets to control basic
data types (including FRC-Specific data types). However, custom widgets allow us to control our custom data type we made in the previous sections or Java Objects. 

The basic ``Widget`` interface inherits from the ``Component`` and ``Sourced`` interfaces. Both are basic building blocks towards making widgets and allows us to modify and display data.
A good widget allows the end-user to modify the widget to suit their needs. An example could be to allow the user to control the range of the number slider, that is, its maximum and minimum or the 
orientation of the slider itself. The view of the widget or how it looks is defined using FXML. ``FXML`` is an XML based language that allows us to build the widget interface.

Defining a Widgets FXML
-----------------------
In this example, we will create 2 slider to help us control the X and Y coordinates of our Point2D data type we created in previous sections. 
In order to create an empty, blank window for our widget, we need to create a ``Pane``. In simple terms a Pane is a "Parent" UI elements that contains other "Child" UI elements, in this case, 2 sliders.
There are many different types of Pane, they are as noted:

- Stack Pane

    - Stack Panes allow elements to be placed ontop of each other.

- Grid Pane
 
    - Grid Panes are extremely useful defining child elements using a coordinate system by creating a felxiable grid of rows and columns on the pane.

- Flow Pane/Tile Pane

    - Flow/Tile Panes place elements in the same order they were added to the pane.

- Anchor Pane

    - Anchor Panes allow child elements to be placed in the top, bottom, left side, right side, or center of the pane.

In this example, it would be sensible to use a stack pane to place the slider ontop of each other. If we wanted the sliders to be at specific positions, it would make sense to use an Anchor or Grid Pane.

The basic syntax for defining a Pane uing FXML would be as the following:

.. code-block:: xml

    <?import javafx.scene.layout.*?>
    <StackPane xmlns:fx="http://javafx.com/fxml/1" fx:controller="Path To Widget Class" fx:id="name of pane">
        ...
    </StackPane>

Creating A Widget Class
-----------------------

Now that we have a Pane, we can now add child elements to that pane. In this example, we can add 2 slider objects. Remember to add an ``fx:id`` to each element so they can be reference in our java class we will make later on.

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

If you are not using a custom data type, you can reference any java data type (ie. double.class) or if the widget does not need data binding you can pass ``NoneType.class``.
Now that we have created our class we can create Java Objects for the widgets we declared in our FXML file using the ``@FXML`` annotation. For our two slider, an example would be:

 .. code-block:: java

    import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;
    import javafx.fxml.FXML;
    import edu.wpi.first.shuffleboard.api.widget.Description;
    import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;

    @Description(name = "MyPoint2D", dataTypes = MyPoint2D.class)
    @ParamatrizedController("Point2DWidget.fxml")
    public final class Point2DWidget extends SimpleAnnotatedWidget<MyPoint2D> {

    //Our first slider
    @FXML
    private Slider slider1;

    //Our second slider
    @FXML 
    private Slider slider2;
    }