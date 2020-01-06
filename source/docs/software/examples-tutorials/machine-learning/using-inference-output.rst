Using Inference Output
======================

The Raspberry Pi writes all detection information to NetworkTables, which can be used by your robot code. Below is a Java example for parsing and using this data.

**NetworkTables Format**

- ``ML`` – The table containing all inference data.

  - ``nb_objects`` – the number (double) of detected objects in the current frame.
  - ``object_classes`` – a string array of the class names of each object. These are in the same order as the coordinates.
  - ``boxes`` – a double array containg the coordinates of every detected object. The coordinates are in the following format: [top_left__x1, top_left_y1, bottom_right_x1, bottom_right_y1, top_left_x2, top_left_y2, ... ]. There are four coordinates per box. A way to parse this array in Java is shown below.

The below ``VisionSubsystem`` Java class parses the data from NetworkTables and stores it in a usable way.

Example code coming soon!

.. todo:: Code example should be in allwpilib

Using the arrays created by the ``VisionSubsystem``, one can make a simple command to turn to face a game piece. In this example, a hatch is used. One thing to note is the ~15fps of inference attained by a Google Coral is not fast enough for PID input directly, however calculating the relative heading of a game piece and then turning to that heading works accurately.

Example code coming soon!

.. todo:: Code example should be in allwpilib
