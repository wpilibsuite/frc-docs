
Introduction to Axon
====================

Axon is a tool that brings machine learning to the FIRST robotics competition. Axon provides an interface for training, testing, and exporting a machine learning model.

What is Machine Learning?
-------------------------

Machine learning is a new, exciting field of computer science. Machine learning is a powerful tool that can accomplish computational tasks that traditional algorithms cannot. In the FIRST Robotics Competition, machine learning can be used to detect game pieces, scoring locations, or even other robots.

A machine learning solution is better than traditional computer vision algorithms in many scenarios. The patterns that a machine learning algorithm (in this case, a neural network) can recognize can be much more complex than what an HSV-filtering algorithm can recognize. For example, a neural network could detect the location of a FRC robot within an image, which is an unreasonable challenge for a HSV-filtering algorithm.

Object detection is a field of machine learning that is particularly relevant for the FRC use-case. A neural network can be taught to determine the box that surrounds an object within an image. This box is known as a bounding box. An object detection neural network is given an image, and it provides a set of predictions. Each prediction contains a bounding box, a label of what the object is, and a number representing how confident the neural network is that there is the chosen object within that bounding box.

Features of Axon
----------------

Dataset Viewing
^^^^^^^^^^^^^^^
Axon currently supports Supervisely datasets and OpenImages datasets. Please go to the dataset page to see how to upload a supported dataset format.

Training
^^^^^^^^

Axon provides an excellent UI for doing transfer learning with a quantised COCO-trained MobileNet V2. Real-time metrics are provided, showing the precision of your model.

Testing
^^^^^^^
Axon provides a way to test a trained model before using it on a robot. Simply upload a video to the testing page, and watch the neural network work in real-time. A .mp4 is provided when testing is complete, if so desired.

Exporting
^^^^^^^^^
Axon provides a way to export your model in both a normal TFLite format, as well as a Edge-TPU optimized model. The outputted .zip can be directly uploaded to the WPILib Raspberry Pi image, but the format works on many other platforms.

Inferencing
^^^^^^^^^^^
Axon provides a Python script for running models on a coprocessor. This script will utilize the hardware of a Google Coral Edge TPU if there is one plugged in. The is officially supported on the WPILibPi image. All inference data is outputted over NetworkTables, and an output MJPEG stream is also provided.

Installation
------------

Docker
^^^^^^

Docker is a system that allows for virtual machines to be run in containers. Machine Learning utilizes many difficult to install dependencies, so we have provided docker containers to make this installation painless.

To install docker visit the link and installation instructions provided here: `Docker Desktop <https://www.docker.com/products/docker-desktop>`__

For Windows users an installation of Windows Subsystem for Linux (WSL) is required and can be found `here <https://docs.microsoft.com/en-us/windows/wsl/install-win10>`__

For Mac users, follow these instructions to increase Memory allowance to at least 6GBs of RAM. Instructions can be found `here <https://docs.docker.com/docker-for-mac/#resources>`__

For Linux users, follow these instructions to complete the installation: `Ubuntu Instructions <https://docs.docker.com/engine/install/ubuntu/>`__

Axon Launcher
^^^^^^^^^^^^^

You can download the latest release of the installer from `Github <https://github.com/wpilibsuite/Axon/releases/>`__. Ensure that you download the correct binary for your OS and architecture.

Extract the installer and click the setup executable file to get started.
