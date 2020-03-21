Creating A Widget
=================

Overview
--------
Shuffleboard widgets are used to interact with Shuffleboard and view/edit data. For example, 

Creating a Custom Widget
------------------------
To define a custom widget, the widget class must be a subclass of `edu.wpi.first.shuffleboard.api.widget.Widget <https://github.com/wpilibsuite/shuffleboard/blob/master/api/src/main/java/edu/wpi/first/shuffleboard/api/widget/Widget.java>`_ or one of its subclasses.
For example, `edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget <https://github.com/wpilibsuite/shuffleboard/blob/master/api/src/main/java/edu/wpi/first/shuffleboard/api/widget/SimpleAnnotatedWidget.java>`_.

.. tabs::

    .. code-tab:: java
        package edu.wpi.example;

        import edu.wpi.first.shuffleboard.api.widget.SimpleAnnotatedWidget;
        import edu.wpi.first.shuffleboard.api.widget.Description;
        import edu.wpi.first.shuffleboard.api.widget.ParametrizedController;

        @Description(dataTypes = { }, name = "My Widget")
        @ParametrizedController(value = "MyWidget.fxml")
        class MyWidget extends SimpleAnnotatedWidget {

        }

The widget must be annotated with ``@Description`` to define the properties of the widget for the plugin loader and the widget's data types.
``@ParametrizedController`` is required to define the path to the widget's corresponding FXML file.

Defining Widget FXML
--------------------
Each widget must also have a corresponding FXML file, to define the plugin's inputs and views. 
With your code located in the ``src/main/java/edu/wpi/example`` directory, each widget's FXML file would be located in the ``src/main/resources/edu/wpi/example`` directory.

This is an example file, ``MyWidget.fxml``, that includes a button and a text box.

.. tabs::

    .. code-tab:: xml
        <?xml version="1.0" encoding="UTF-8"?>

        <?import javafx.scene.layout.GridPane?>
        <?import javafx.scene.control.Button ?>
        <?import javafx.scene.control.Label?>

        <GridPane xmlns:fx="http://javafx.com/fxml/1" fx:controller="edu.wpi.example" fx:id="_pane">
            <Button text="Push Me" GridPane.ColumnIndex="0" GridPane.RowIndex="0" GridPane.RowSpan="2" onAction="#onButtonPress"/>
	        <Label text="Textbox" fx:id="_textbox" GridPane.RowIndex="0" GridPane.ColumnIndex="1"/>
        </GridPane> 

Binding FXML to Widget
----------------------
Now there is a class for a widget, and an FXML file for the widget, but they haven't been tied together yet. 
First, make the the value of the ``@ParametrizedController`` annotation in your code point to the location of your FXML file. For example, if your code is in ``src/main/java/edu/wpi/example`` and your FXML is in ``src/main/resources/edu/wpi/example``, you would set the value to ``MyWidget.fxml``.

Next, to use XML elements as objects in your code, import ``javafx.fxml.FXML``, ``javafx.scene.layout.Pane``, ``javafx.event.ActionEvent``, and ``javafx.scene.control.Label``.
To bind each element to an object, annotate them with ``@FXML`` and give them the same name as their IDs in the FXML file. For example:

.. tabs::

    .. code-tab:: java
        import javafx.fxml.FXML;
        import javafx.scene.layout.Pane;
        import javafx.scene.control.Label;
        import javafx.event.ActionEvent;

        @Description(dataTypes = { }, name = "My Widget")
        @ParametrizedController(value = "MyWidget.fxml")
        class MyWidget extends SimpleAnnotatedWidget {
            // FXML elements
            @FXML
            protected Pane _pane;
            @FXML
            protected Label _textbox;

            // The getView method is required by the Shuffleboard API
            public Pane getView() {
                return _pane;
            }

            // This method is named the same as the action in the onAction tag in the button FXML
            @FXML
            protected void onButtonPress (ActionEvent e) {
                _textbox.setText("button press");
            }

        }

Now, the label will be set to the text "button press" whenever the button is clicked, since the onButtonPress method is the same as the action in the button's XML tag.
More methods and elements can be added, as long as their names continue to correspond to their IDs in the FXML and they are annotated properly.
