Using CameraServer
==================

Grabbing frames from CameraServer
---------------------------------

The FRCVision image comes with all the necessary libraries to make your own vision processing system. In order to get the current frame from the camera, you can use the CameraServer library. For information about CameraServer, the :ref:`docs/software/vision-processing/introduction/cameraserver-class:Read and Process Video: CameraServer Class`.

.. tabs::

   .. code-tab:: py

      from cscore import CameraServer
      import cv2
      import numpy as np

      cs = CameraServer.getInstance()
      cs.enableLogging()

      camera = cs.startAutomaticCapture()
      camera.setResolution(width, height)

      sink = cs.getVideo()

      # Preallocate memory so we don't have to allocate memory each iteration
      input_img = np.zeros(shape=(width, height, 3), dtype=np.int8)

      while True:
         time, input_img = cvSink.grabFrame(input_img)

         if time == 0: # There is an error
            continue
.. note::
   OpenCV reads in the image as **BGR**, not **RGB** for historical reasons. Use ``cv2.cvtColor`` if you want to change it to RGB.

Sending frames to CameraServer
------------------------------

Sometimes, you may want to send processed video frames back to the CameraServer instance for debugging purposes, or viewing in a dashboard application like Shuffleboard.

.. tabs::

   .. code-tab:: py

      #
      # CameraServer initialization code here
      #

      # Preallocate memory so we don't have to allocate memory each iteration
      output = cs.putVideo("Name", width, height)
      output_img = np.zeros(shape=(width, height, 3), dtype=np.uint8)

      while True:
         time, input_img = cvSink.grabFrame(input_img)

         if time == 0: # There is an error
            output.notifyError(sink.getError())
            continue

         #
         # Insert processing code here
         #

         output.putFrame(processed_img)

As an example, the processing code could outline the target in red, and show the corners in yellow for debugging purposes.
