Inferencing on a Raspberry Pi
=============================

Prerequisites
-------------

This section requires a Raspberry Pi that is running the WPILibPi Image. Instructions to the following can be found here :ref:`WPILibPi Setup <docs/software/vision-processing/wpilibpi/index>`. Furthermore, a USB camera needs to be plugged into the Raspberry Pi.

Uploading the Model to the Pi
-------------------

To upload your tflite model to the Raspberry Pi, you must connect to it and open the Web-interface. Select the Application tab, go to the File Upload section and turn the Extract slider on.

.. image:: images/inferencing/extract.png
  :alt: Click the Extract Slider

Once this is checked, you can upload the zip of your tflite model to the Pi.

Inferencing
-----------

Once the tflite model has been uploaded, now the Pi needs python code to utilize it. Here is a link to the provided inference script through the release page: `Github <https://github.com/wpilibsuite/Axon/releases/>`__.

Once this is downloaded, utilize the Vision Application Configuration section to upload the python file.

Once uploaded, utilize the Vision Status tab to check on the state of the script, and the vision settings tab can be used to view the camera stream.



Network Tables
--------------
