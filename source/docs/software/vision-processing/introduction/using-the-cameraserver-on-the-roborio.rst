Using the CameraServer on the roboRIO
=====================================

Simple CameraServer Program
---------------------------

The following program starts automatic capture of a USB camera like the Microsoft LifeCam that is connected to the roboRIO. In this mode, the camera will capture frames and send them to the dashboard. To view the images, create a CameraServer Stream Viewer widget using the "View", then "Add" menu in the dashboard. The images are unprocessed and just forwarded from the camera to the dashboard.

.. image:: images/using-the-cameraserver-on-the-roborio/simple-cameraserver-program.png

.. tabs::

    .. tab:: Java

       .. literalinclude:: examples/using-the-cameraserver-on-the-roborio-1/java/Robot.java
          :language: java
          :lines: 21-24
          :linenos:
          :lineno-start: 21

    .. tab:: C++

        .. literalinclude:: examples/using-the-cameraserver-on-the-roborio-1/cpp/Robot.cpp
           :language: cpp
           :lines: 11-15
           :linenos:
           :lineno-start: 11


Advanced Camera Server Program
------------------------------

In the following example a thread created in ``robotInit()`` gets the Camera Server instance. Each frame of the video is individually processed, in this case converting a color image (BGR) to gray scale using the OpenCV ``cvtColor()`` method. The resultant images are then passed to the output stream and sent to the dashboard. You can replace the cvtColor operation with any image processing code that is necessary for your application. You can even annotate the image using OpenCV methods to write targeting information onto the image being sent to the dashboard.

.. tabs::

    .. tab:: Java

       .. literalinclude:: examples/using-the-cameraserver-on-the-roborio-2/java/Robot.java
          :language: java
          :lines: 27-47
          :linenos:
          :lineno-start: 27

    .. tab:: C++

       .. literalinclude:: examples/using-the-cameraserver-on-the-roborio-2/cpp/Robot.cpp
          :language: cpp
          :lines: 11-35
          :linenos:
          :lineno-start: 11

Notice that in these examples, the ``PutVideo()`` method writes the video to a named stream. To view that stream on Shuffleboard, select that named stream. In this case that is "Blur" for the Java program and "Gray" for the C++ sample.
