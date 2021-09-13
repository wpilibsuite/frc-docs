Inferencing on a Raspberry Pi
=============================

Hardware Requirements
---------------------

This section requires a Romi or a Raspberry Pi that is running the WPILibPi Image.

Instructions to setup WPILibPi can be found :ref:`here <docs/software/vision-processing/wpilibpi/walkthrough-video:A Video Walkthrough of using WPILibPi with the Raspberry Pi>`.

Other hardware that is required is:

-   A USB Camera
-   A Coral TPU (Highly Recommended)

.. note:: A Coral Edge TPU is a USB Accelerator that the Raspberry Pi uses as a co-processor to improve its performance while inferencing. In our experience it has shown to improve performance by around 9 times.


Uploading the Model to the Pi
-----------------------------

To upload your tflite model to the Raspberry Pi, you must connect to it and open the Web-interface. Select the :guilabel:`Application` tab, go to the :guilabel:`File Upload` section and turn the :guilabel:`Extract` slider on.

.. image:: images/inferencing/extract.png
  :alt: Click the Extract Slider

Once this is checked, you can upload the zip that you downloaded from Axon onto the Pi.

Inferencing
-----------

Once the model has been uploaded, now the Pi needs python code to utilize it. Here is a link to the provided inference script through the release page: `Github <https://github.com/wpilibsuite/Axon/releases/>`__

Once this is downloaded, utilize the :guilabel:`Vision Application Configuration` section to upload the python file.

.. image:: images/inferencing/upload.png
  :alt: Upload file

Once uploaded, utilize the :guilabel:`Vision Status` tab to check on the state of the script. You should be able to see an update with a framerate indicating that everything is working.

.. image:: images/inferencing/console.png
  :alt: Status Console

Head to the :guilabel:`Vision Settings` tab. First click on the camera stream and change the resolution to be greater than 300 pixels by 300 pixels (e.g. 640 by 480).

.. image:: images/inferencing/settings.png
  :alt: Resolution settings

Then click on :guilabel:`Open Stream` to view the camera stream. Increase the port number at the top by one each time to move through the various camera streams until you arrive at the desired one. The default port is always at 1181, and the additional streams will start at 1182.

.. image:: images/inferencing/port.png
  :alt: Changing Ports

Then you can see the output stream from the Machine Learning Model. You should be able to see the Raspberry Pi identifying objects!

.. image:: images/inferencing/inference.png
  :alt: Coffee Inference

Network Tables
--------------

.. note:: When using a Romi, robot code must be running on the simulator to receive network tables data.

The python script from the releases page that is responsible for inferencing, also pushes that data to network tables. To see the results, one can use the :ref:`OutlineViewer <docs/software/wpilib-tools/outlineviewer/index:OutlineViewer>` tool.

.. image:: images/inferencing/outline.png
  :alt: Outline Viewer
.. note:: Use Server Location ``localhost`` when running on a Romi
