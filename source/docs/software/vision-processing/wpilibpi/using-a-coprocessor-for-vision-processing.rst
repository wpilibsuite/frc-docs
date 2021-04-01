.. include:: <isonum.txt>

Using a Coprocessor for vision processing
=========================================
Vision processing using libraries like OpenCV for recognizing field targets or game pieces can often be a CPU intensive process.
Often the load isn't too significant and the processing can easily be handled by the roboRIO. In cases where there are more camera
streams or the image processing is complex, it is desirable to off-load the roboRIO by putting the code and the camera connection
on a different processor. There are a number of choices of processors that are popular in FRC\ |reg| such as the Raspberry PI, the
intel-based Kangaroo, the LimeLight for the ultimate in simplicity, or for more complex vision code a graphics accelerator such as
one of the nVidia Jetson models.

Strategy
--------
Generally the idea is to set up the coprocessor with the required software that generally includes:

-   OpenCV - the open source computer vision library
-   :term:`NetworkTables` - to commute the results of the image processing to the roboRIO program
-   Camera server library - to handle the camera connections and publish streams that can be viewed on a dashboard
-   The language library for whatever computer language is used for the vision program
-   The actual vision program that does the object detection

The coprocessor is connected to the roboRIO network by plugging it into the extra ethernet port on the network router or,
for more connections, adding a small network switch to the robot. The cameras are plugged into the coprocessor, it acquires the
images, processes them, and publishes the results, usually target location information, to NetworkTables so it is can be consumed
by the robot program for steering and aiming.

.. image:: diagrams/vision-code-on-a-coprocessor.drawio.svg
   :alt: Network diagram with the coprocessor and roboRIO on the same network.

Streaming camera data to the dashboard
--------------------------------------
It is often desirable to simply stream the camera data to the dashboard over the robot network. In this case one or more camera
connections can be sent to the network and viewed on a dashboard such as Shuffleboard or a web browser. Using Shuffleboard has
the advantage of having easy controls to set the camera resolution and bit rate as well as integrating the camera streams with
other data sent from the robot.

It is also possible to process images and add annotation to the image, such as target lines or boxes showing what the image
processing code has detected then send it forward to the dashboard to make it easier for operators to see a clear picture of
what's around the robot.
