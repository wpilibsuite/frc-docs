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

Axon provides an excellent UI for doing transfer learning with a quantised COCO-trained MobileNet V2.

