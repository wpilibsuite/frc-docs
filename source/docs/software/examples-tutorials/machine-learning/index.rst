Machine Learning
================

.. Warning:: 
    We apologize for delay in getting the procedures to train a network to you.  AWS Educate ran into a problem with the ability to run Sagemaker on their systems at the same time build season was starting.  We have come up with a new solution below to get you going.

    A mentor from the team will need to email us the information below, we will setup an account for them and email instructions on how to setup accounts for the students. Then continue following the instructions in this documentation.

    Please email the following information to ML @ WPILib.org:

    * Team number
    * Mentors name
    * Mentors email that has not been used for an AWS account before

This technology experiment is a way for teams to automatically detect game pieces and other interesting objects with machine learning. It uses Amazon Web Services to train and test, so teams do not need to own especially powerful computers.

This document describes the steps needed to use a provided set of labeled images and make a trained model to deploy on a RasberryPi with a Google Coral. The basic steps are: create and upload your data, train your model, test your model, run inference on a coprocessor, and use that data meaningfully.

.. image:: images/inference-screenshot.png
   :alt: Example inference screenshot

Table of Contents
-----------------

.. toctree::
   :maxdepth: 1

   setting-up-the-data
   adding-more-data
   uploading-data-to-aws-s3
   training
   testing
   inference
   using-inference-output
   how-it-works
   understanding-precision

Hardware Requirement
--------------------

- Rasberry Pi 3 or newer
- `Google Coral USB Accelerator <https://www.amazon.com/dp/B07S214S5Y>`__
