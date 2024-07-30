Using the CameraServer on the roboRIO
=====================================

Simple CameraServer Program
---------------------------

The following program starts automatic capture of a USB camera like the Microsoft LifeCam that is connected to the roboRIO. In this mode, the camera will capture frames and send them to the dashboard. To view the images, create a CameraServer Stream Viewer widget using the "View", then "Add" menu in the dashboard. The images are unprocessed and just forwarded from the camera to the dashboard.

.. image:: images/using-the-cameraserver-on-the-roborio/simple-cameraserver-program.png
  :alt: By going to View then "Add..." then "CameraServer Stream Viewer" SmartDashboard adds a stream viewer widget.

.. tab-set-code::

   .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/quickvision/Robot.java
      :language: java
      :lines: 7-20
      :linenos:
      :lineno-start: 7

   .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/QuickVision/cpp/Robot.cpp
      :language: c++
      :lines: 7-8, 16-18, 20, 25-31

   .. rli:: https://raw.githubusercontent.com/robotpy/examples/d89b0587a1e1111239728140466c7dc4324d4005/QuickVision/robot.py
      :language: python
      :lines: 8-17
      :linenos:


Advanced Camera Server Program
------------------------------

In the following example a thread created in robotInit() gets the Camera Server instance. Each frame of the video is individually processed, in this case drawing a rectangle on the image using the OpenCV ``rectangle()`` method. The resultant images are then passed to the output stream and sent to the dashboard. You can replace the ``rectangle`` operation with any image processing code that is necessary for your application. You can even annotate the image using OpenCV methods to write targeting information onto the image being sent to the dashboard.

.. tab-set::

   .. tab-item:: Java
      :sync: tabcode-java

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/intermediatevision/Robot.java
         :language: java
         :lines: 7-65
         :linenos:
         :lineno-start: 7

   .. tab-item:: c++
      :sync: tabcode-c++

      .. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2024.3.2/wpilibcExamples/src/main/cpp/examples/IntermediateVision/cpp/Robot.cpp
         :language: c++
         :lines: 5-20, 23-56, 58-61, 63-64, 69-76

   .. tab-item:: PYTHON
      :sync: tabcode-python

      Image processing on the roboRIO when using Python is slightly different from C++/Java. Instead of using a separate thread, we need to launch the image processing code in a completely separate process.

      .. warning:: Image processing is a CPU intensive task, and because of the Python Global Interpreter Lock (GIL) **we do NOT recommend using cscore directly in your robot process**. Don't do it. Really.

                   For more information on the GIL and its effects, you may wish to read the following resources:

                   * `Python Wiki: Global Interpreter Lock <https://wiki.python.org/moin/ GlobalInterpreterLock>`_
                   * `Efficiently Exploiting Multiple Cores with Python <http://python-notes.curiousefficiency.org/en/latest/python3/multicore_python.html>`_

      This introduces a number of rules that your image processing code must follow to efficiently and safely run on the RoboRIO:

      * Your image processing code must be in its own file. It's easiest to just place it next to your ``robot.py``
      * Never import the ``cscore`` package from your robot code, it will just waste memory
      * Never import the ``wpilib`` or ``hal`` packages from your image processing file
      * The camera code will be killed when the ``robot.py`` program exits. If you wish to perform cleanup, you should register an atexit handler.
      * ``robotpy-cscore`` is not installed on the roboRIO by default, you need to update your ``pyproject.toml`` file to install it

      .. warning:: ``wpilib`` may not be imported from two programs on the RoboRIO. If this happens, the second program will attempt to kill the first program.

      Here's what your ``robot.py`` needs to contain to launch the image processing process:

      .. rli:: https://raw.githubusercontent.com/robotpy/examples/d89b0587a1e1111239728140466c7dc4324d4005/IntermediateVision/robot.py
         :language: python
         :lines: 8-17
         :linenos:

      The ``launch("vision.py")`` function says to launch ``vision.py`` and call the ``run`` function in that file. Here's what is in ``vision.py``:

      .. rli:: https://raw.githubusercontent.com/robotpy/examples/d89b0587a1e1111239728140466c7dc4324d4005/IntermediateVision/vision.py
         :language: python
         :lines: 12-55
         :linenos:

      You need to update ``pyproject.toml`` contents to include cscore in the robotpy-extras key (this only shows the portions you need to update):

      .. code-block:: toml

         [tool.robotpy]

         ...

         # Add cscore to the robotpy-extras list
         robotpy_extras = ["cscore"]

Notice that in these examples, the ``PutVideo()`` method writes the video to a named stream. To view that stream on SmartDashboard or Shuffleboard, select that named stream. In this case that is "Rectangle".
