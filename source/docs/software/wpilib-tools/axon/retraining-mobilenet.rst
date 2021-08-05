Retraining Mobilenet V2
=======================

Upload a Dataset
----------------

To retrain the mobilenet object detection model using Axon, first upload the dataset you would like to retrain with.

.. image:: images/training/add-dataset.png
  :alt: Create or Upload a Dataset

Once you have uploaded a dataset, you should see it in the tree above this button.

Create a Project
----------------

Next, you must create a project. A project will hold the data from the retraining, and any TFLite exports or tests you create with the retrained model.

To create a project, click the :guilabel:`Add Project` button.

.. image:: images/training/new-project.png
  :alt: Add a Project

A dialog will appear, asking you to name the project. Pick a name and click :guilabel:`Create`. When you create your project, you will see it above the button to the left.

Click on the project, and you will be taken to its page.

Start Retraining
----------------

At the top of the project window, there are several parameters to specify how you want the model to be retrained.

**Epochs**: The number of times the dataset will be passed through the model during training. Generally more epochs are better, and a model should continue to be trained until the performance increase becomes very small or it stops improving.

**Batch Size**: The amount of images to use in each training iteration. A larger batch size will make epochs train faster as there will be less batches, but it will require more memory to load all of the images. Generally we recommend leaving this value at default.

**Evaluation Frequency**: The amount of epochs to run before each evaluation of the models precision. Each evaluation will be viewable so you can check the progress of your model.

**Percent Evaluation**: The percent of the dataset to be reserved exclusively for evaluation of the models precision during training. A higher percent evaluation means that more images are used to test the model. Those images will not be used to train the model so there will be less training data. Generally we recommend leaving this value at default.

**Datasets**: The datasets you would wish to retrain with.
Edit these input parameters to fit your needs, and tick the checkboxes of the desired datasets from the dropdown.

.. image:: images/training/hyperparameters.png
  :alt: Hyperparameters

When you are ready to start the retraining, click the play button to the right of the dataset dropdown.

When an evaluation happens, a checkpoint is produced. This is a copy of the model at a particular point in the training. While the model trains, you will see checkpoints appear as points on the graph.

Exporting a Checkpoint in TFLite Format
---------------------------------------

To export a checkpoint as a TFLite model for use, select the desired checkpoint by clicking the point on the graph.

.. image:: images/training/select-checkpoint.png
  :alt: Select a Checkpoint

This will select the checkpoint. Export this checkpoint by clicking the export button below the graph.

.. image:: images/training/export-button.png
  :alt: Click the Export Button

You will soon see an export appear below the button.

.. image:: images/training/exporting.png
  :alt: Exporting

When the export has completed, you will see the checkpoint appear in the checkpoint menu where you can select and work with any of the exported checkpoints.

.. image:: images/training/export-menu.png
  :alt: Export Menu

You may click the menu to the right of an exported model, providing options to rename, and delete.

.. image:: images/training/rename-checkpoint.png
  :alt: Menu Options

Click the download button, and your browser will download a tarfile containing two TFLite models of the selected checkpoint, one of which is optimized for the Coral TPU. There is also a label map file, for use when converting the model's output to a human-readable format.

.. image:: images/training/download-checkpoint.png
  :alt: Select and Download Checkpoints

Testing an Exported Model
-------------------------

To test an exported model, open the testing dialog by clicking the :guilabel:`Test` button in the menu of the export you would like to test.

.. image:: images/training/test-checkpoint-button.png
  :alt: Test Checkpoint

.. image:: images/training/axon-mobilenet-10.png
  :alt: Test Menu

First, click the :guilabel:`Select Video` box, and click the :guilabel:`+` that will appear to upload a video.

.. image:: images/training/axon-mobilenet-11.png
  :alt: Upload

This will open a window that allows you to upload a ``.mp4`` file.

.. image:: images/training/axon-mobilenet-12.png
  :alt: Save

Drop a ``.mp4`` in the dropzone, or click to select the file. Once the file is in the dropzone, click :guilabel:`Save`.

When uploaded, you will see the video in the dropdown menu, allowing you to select it for the test.

You have the option to change the name of the annotated output video produced by the test.

.. image:: images/training/axon-mobilenet-13.png
  :alt: Press Test

Click the :guilabel:`Test` button, and you will see the test begin.

.. image:: images/training/axon-mobilenet-14.png
  :alt: View the Test

The test uses your model to annotate the video, creating a stream for you to watch as it happens. Click the :guilabel:`View` button, and the stream will open in a separate tab.

When the test completes, you will see it at the bottom of the test dialog.

.. image:: images/training/axon-mobilenet-15.png
  :alt: Test Dialog

You can download the annotated video. Click the download icon next to the test’s name, and your browser will begin the download. The video is currently a ``.mp4`` within a ``.zip``.
