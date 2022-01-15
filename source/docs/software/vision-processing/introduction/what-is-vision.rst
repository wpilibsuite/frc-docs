.. include:: <isonum.txt>

What is Vision?
===============

Vision in FRC\ |reg| uses a camera connected to the robot in order to help teams score and drive, during both the autonomous and teleoperated periods.

Vision Methods
--------------

There are two main method that most teams use for vision in FRC.

Streaming
^^^^^^^^^

This method involves streaming the camera to the Driver Station so that the driver and manipulator can get visual information from the robot's point of view. This method is simple and takes little time to implement, making it a good option if you do not need features of vision processing.

- :ref:`Streaming using the roboRIO <docs/software/vision-processing/roborio/using-the-cameraserver-on-the-roborio:Using the CameraServer on the roboRIO>`

Processing
^^^^^^^^^^

Instead of only streaming the camera to the Driver Station, this method involves using the frames captured by the camera to compute information, such as a game piece's or target's angle and distance from the camera. This method requires more technical knowledge and time in order to implement, as well as being more computationally expensive. However, this method can help improve autonomous performance and assist in "auto-scoring" operations during the teleoperated period. This method can be done using the roboRIO or a coprocessor such as the Raspberry Pi using either OpenCV or programs such as GRIP.

- :ref:`Vision Processing with Raspberry Pi <docs/software/vision-processing/wpilibpi/index:Vision with WPILibPi>`
- :ref:`Vision Processing with GRIP <docs/software/vision-processing/grip/index:Vision with GRIP>`
- :ref:`Vision Processing with the roboRIO <docs/software/vision-processing/roborio/using-the-cameraserver-on-the-roborio:Advanced Camera Server Program>`

For additional information on the pros and cons of using a coprocessor for vision processing, see the next page, :ref:`docs/software/vision-processing/introduction/strategies-for-vision-programming:Strategies for Vision Programming`.
