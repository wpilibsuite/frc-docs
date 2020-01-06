Adding More Data
================

These steps detail how to record a new video, upload it to Supervisely, and label the frames. You can skip this article if you want to use the WPILib dataset directly.

.. note:: If you cannot access Supervisely, you can use the WPILib dataset directly in later steps.

Record a video to label
-----------------------

1. Prepare to record a video of objects you want your robot to detect. You will want to get multiple angles and locations of the objects.
2. Plug a USB Camera into your laptop, point the camera at your chosen object, and run `record_video.py <https://github.com/wpilibsuite/DetectCoral/blob/master/utils/record_video.py>`__, which records an MP4. This script records small (640x480) images.
3. Click on the workspace, then the WPILib project that you imported in the :ref:`Setting Up the Data <docs/software/examples-tutorials/machine-learning/setting-up-the-data:Getting Data>` article.
4. Upload your own video to your workspace. Click 'UPLOAD' when inside of your workspace, change your import plugin to video, drag in your video, give the project a name, and click import. The default configuration, seen in the picture below, is fine.

.. image:: images/supervisely-custom-upload.png
   :alt: Custom upload dialog on Supervisely

5. Click into your newly import Dataset. Use the ``rectangle tool`` to draw appropriate boxes around the objects which you wish to label. Make sure to choose the correct class while you are labelling. The class selector is in the top left of your screen.

.. image:: images/supervisely-labeling.png
   :alt: Custom upload dialog on Supervisely
