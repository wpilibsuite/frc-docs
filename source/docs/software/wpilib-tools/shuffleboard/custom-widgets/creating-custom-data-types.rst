Creating Custom Data Types
==========================

Widgets can allows us to control and visualize different types of data. This data can be numerical in the form to integers, double, longs, etc..., or less primative forms of data,
such as java objects, or data involving multiple fields. In order to display these types of data using widgets, it is helpful to create a container class for them.
It is not nessecary to create your own Data Class if the widget will handle single fieled data types such as doubles, arrays, or strings.

Creating The Data Class
-----------------------

In this example, we will create a custom data type for a 2D Point and its x and y coordinates. In order to create a custom data type class,
it must extend the abstract class `ComplexData <https://github.com/wpilibsuite/shuffleboard/blob/master/api/src/main/java/edu/wpi/first/shuffleboard/api/data/ComplexData.java>`_. Your
custom data class must also implement the ``asMap()`` method that returns the represented data as a simple map as noted below with the ``@Override`` annotation:

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.data.ComplexData;

   import java.util.Map;

   public class MyPoint2D extends ComplexData<MyPoint2D> {

      private final double x;
      private final double y;

      //Constructor should take all the different fields needed and assign them their corresponding instance variables.
      public MyPoint2D(double x, double y) {
         this.x = x;
         this.y = y;
      }

      @Override
      public Map<String, Object> asMap() {
         return null;
      }
   }

It is also good practise to override the default ``equals`` and ``hashcode`` methods to ensure that different objects are considered equivalent when their fields are the same.
The ``asMap()`` method should return the data represented in a simple Map object as it will be mapped to the NetworkTable entry it corresponds to. In this case, we can represent the point as its X and Y coordinates and return a ``Map`` containing them.

.. code-block:: java

   import edu.wpi.first.shuffleboard.api.data.ComplexData;

   import java.util.Map;

   public class MyPoint2D extends ComplexData<MyPoint2D> {

      private final double x;
      private final double y;

      //Constructor should take all the different fields needed and assign them to their corresponding instance variables.
      public Point(double x, double y) {
         this.x = x;
         this.y = y;
      }

      @Override
      public Map<String, Object> asMap() {
         return Map.of("x", this.x, "y", this.y);
      }

      @Override
      public boolean equals(MyPoint2D point) {
         // Checks if the x and y values are the same in the point being passed in and the object this method is performed on.
         // The equals method checks to make sure the content of the objects is the same, whereas the == operator checks if they point to the same memory location.
         if (this.x == point.asMap().get("x") && this.y == point.asMap().get("y")) {
            return true;
         } else {
            return false;
         }
      }
    }

Other methods can be added to retrieve or edit fields and instance variables, however, it is good practise to make these classes immutable to prevent changing the source data objects.
Instead, you can make a new copy object instead of manipulating the existing object. For example, if we wanted to change the y coordinate of our point, we can define the following method:

.. code-block:: java

   public MyPoint2D withX(double newY) {
      return new MyPoint2D(this.x, newY);
   }

This creates a new ``MyPoint2D`` object and returns it with the new y-coordinate.

Creating a Data Types
---------------------
There are two different data types that can be made, Simple data types involve data that contains only one field (ie. a single number or string) whereas Complex data types require multiple data fields (ie. multiple strings, multiple numbers).

In order to define a simple data type, the class must extend the ``SimpleDataType<DataType>`` class with the data type needed and implement the ``getDefaultValue()`` method. In this example, we will use a double as our simple data type.

.. code-block:: java

   public final class MyDataType extends SimpleDataType<double> {

      private static final String NAME = "double";

      private MyDataType() {
         super(NAME, double.class);
      }

      @Override
      public double getDefaultValue() {
         return 0.0;
      }

   }

In the class constructor is set to private to ensure that only a single instance of the data type will exist.

In order to define a complex data type, the class must extend the ``ComplexDataType`` class and implement the ``fromMap()``
and ``getDefaultValue()`` methods. We will use our MyPoint2D class as an example to what a complex data type class would look like.

.. code-block:: java

   public final class PointDataType extends ComplexDataType<MyPoint2D> {

      private static final String NAME = "MyPoint2D";
      public static final PointDataType Instance = new PointDataType();

      public PointDataType() {
         super(NAME, MyPoint2D.class);
      }

      @Override
      public Function<Map<String, Object>, MyPoint2D> fromMap() {
         return map -> {
               return new MyPoint2D((double) map.getOrDefault("x", 0.0), (double) map.getOrDefault("y", 0.0));
         };
      }

      @Override
      public MyPoint2D getDefaultValue() {
         // use default values of 0 for X and Y coordinate
         return new MyPoint2D(0, 0);
      }

   }

The following code above works as noted:

The ``fromMap()`` method creates a new MyPoint2D using the values in the NetworkTable entry it is binded to. The
``getOrDefault`` method will return 0.0 if it cannot get the entry values. The ``getDefaultValue`` will return a new ``MyPoint2D``
object if no source is present.

Exporting Data Type To Plugin
-----------------------------
In order to have the data type be recognized by the Shuffleboard, the plugin must export them by overriding the ``getDataTypes`` method.
For example,

.. code-block:: java

   public class MyPlugin extends Plugin {

      @Override
      public List<DataType> getDataTypes() {
         ImmutableList.of(PointDataType.Instance);
      }

   }
