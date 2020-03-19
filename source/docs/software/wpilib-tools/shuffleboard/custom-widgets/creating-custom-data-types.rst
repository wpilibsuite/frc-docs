Creating Custom Data Types
==========================

Widgets can allows us to control and visualize different types of data. This data can be numerical in the form to integers, double, longs, etc..., or less primative forms of data,
such as java objects, or data involving multiple fields. In order to display these types of data using widgets, it is helpful to create a container class for them.


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
        public Point(double x, double y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public Map<String, Object> asMap() {
            return null;
        }
    }

It is also good practise to override the default ``equals`` and ``hashcode`` methods to ensure that different objects are considered equivalent when their fields are the same. 
The ``asMap()`` method should return the data represented in a simple Map object. In this case, we can represent the point as its X and Y coordinates and return a ``Map`` containing them.

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

In order to define a simple data type