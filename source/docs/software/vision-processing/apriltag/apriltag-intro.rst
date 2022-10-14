.. include:: <isonum.txt>

What Are AprilTags?
===================

AprilTags are a system of visual tags developed by researchers at the University of Michigan to provide low overhead, high accuracy localization for many different applications.

Application to FRC
------------------

In the context of FRC, AprilTags are useful for helping your robot know where it is at on the field, so it can align itself to some goal position.

AprilTags have been in development since 2011, and have been refined over the years to increase the robustness and speed of detection.

Starting in 2023, FIRST is providing a number of tags, scattered throughout the field, each at a known :term:`pose`.

All of the tags are from the 36H11 family, which means that:

1) Each tag carries 36 bits of information
2) It would take at least 11 bit "flips" before one tag could be mistaken for another.

All tags will be printed such that their outer black border is 200mm on a side.

For home usage, `these pdf files <https://github.com/rgov/apriltag-pdfs/tree/main/tag36h11>`_ may be printed off and placed around your practice area. Mount them to a rigid backing material to ensure the tag stays flat, as the processing algorithm assumes the tags are flat.

Software Support
----------------

The main repository for the source code that detects and decodes AprilTags `can be found here <https://github.com/AprilRobotics/apriltag>`_.

WPILib has forked the repository to add new features for FRC. These include:

1. Building the source code for common FRC targets, including the roboRIO and Raspberry Pi.
2. Adding Java Native Interface (JNI) support to allow invoking its functionality from Java
3. Gradle & Maven publishing support

TODO: this is actually what photonvision did. wpilib...?

Processing Technique
--------------------

While most FRC teams should not have to implement their own code to identify AprilTags in a camera image, it is useful to know the basics of how the underlying libraries function.

Processing is done in three steps:

Detection
^^^^^^^^^

An image from a camera is simply an array of values, corresponding to the color and brigness of each pixel. The first step is to determine which pixels, if any, represent an AprilTag. The algorithm to do this is:

* Convert the image to a greyscale (birghtness-only) image. 
    * Color information is not needed to detect the black-and-white tags.
* Convert the image to a lower resolution. 
    * Working with fewer pixels helps the algorith work faster. 
    * The full-resolution image will be used later to refine early estimates.
* Apply an adaptive thresholding algorithm to classify each pixel as "definitely light", "definitely dark", or "not sure".
    * The threshold is calculated by looking at the pixel's brightness, compared to a small neighborhood of pixels around it.
* Analyze the known pixels to "clump" them together.
    * Discard any clumps which are too small to reasonably be a meaningful part of a tag.
* Fit a quadralaterial to each clump
  * Identify likely "corner" candiadtes by pixels which are outliers in both dimensions.
  * Iterate through all possible combindations of corners, evaluating the fit each time
  * Pick the best-fit quadralateral
* Identify a suspect set of quadralaterals which is likely a tag.
  * For example, a single large exterior quadralateral with many interior quadralterals is likely a good candidate

If all has gone well so far, we are left with a four-sided region of pixels that is likely a valid tag.

Decoding
^^^^^^^^

Now that we have one or more regions of pixels which we believe to be a valid AprilTag, we need to identify which tag we are looking at. This is done by "decoding" the pattern of light and dark squares on the inside.

* Calculate the expected interior pixel coordinates where the center of each bit should be
* Mark each location as "1" or "0" by comparing the pixel intensity to a threshold
* Find the tag ID which most closely matches what was seen in the image, allowing for one or two bit errors.

It is possible there is no valid tag ID which matches the suspect tag. In this case, the decoding process stops.

Edge Refinement 
^^^^^^^^^^^^^^^

Now that we have a tag ID for the region of pixels, we need to do something useful with it.

For most FRC applications, we care about knowing the precise location of the corners of the tag, or its center. In both cases, we expect the resolution-lowering operation we did at the begnning to have distorted the image, and we want to undo those effects. 

The algorithm to do this is:

* Use the detected tag location to define a region of interest in the origional-resolution image
* Calculate the :term:`gradient` at pre-defined points in the region of interest to detect where the image most sharply transitions between black to white
* Use these gradient measurements to rapidly re-fit an exterior quadralateral at full resolution
* Use geometry to calcualte the exact center of the re-fit quadralateral

Note that this step is optional, and can be skipped for faster image processing. However, skipping it can induce signifigant errors into your robot's behavior, depending on how you are using the tag outputs.

Visualization
^^^^^^^^^^^^^

Here is a visualization of the steps involved:

.. tabs::

   .. tab:: Origional Image

      :image:`images/orig_img.png`

   .. tab:: Remove Colors

      :image:`images/bw_img.png`

   .. tab:: Decimate

      :image:`images/decimate.png`

   .. tab:: Adaptive Threshold

      :image:`images/adaptive_threshold.png`

   .. tab:: Segementation

      :image:`images/segmentation.png`

   .. tab:: Tag Detection

      :image:`images/tag_detection.png`

   .. tab:: Fit External Quad

      :image:`images/fit_ext_quad.png`

   .. tab:: Homography

      :image:`images/homography.png`


Usage
-----

2D Alignment
^^^^^^^^^^^^

A simple strategy for using targets is to move the robot until the target is centered in the image. Assuming the field and robot are constructed such that the gamepiece, scoring location, vision target, and camera are all aligned, this method should proved a straightforward method to automatically align the robot to the scoring position.

Using a camera, identify the _centroid_ of the apriltags in view. If the tag's ID is correct, apply drivetrain commands to rotate the robot left or right until the tag is centered in the camera image.

This method does not require calibrating the camera or performing the homography step.

TODO: Code samples? Specifics?

3D Alignment
^^^^^^^^^^^^

A more advanced usage of AprilTags is to use their corner locations to help perform on-field localization.

This method requires calibrating the camera to measure how its optics distort 3d space onto the 2d sensor.

Once calibrated, each image is searched for AprilTags using the above algorithm. 

Given each tag's ID, the position of the tag on the field can be identified.

TODO: Code Snippet

Using the information about the camera's distortion, along with the known size of the tag, an estimate of the camera's position relative to the tag is calcualted.

TODO: Code Snippet

In turn, using the `Pose3d` classes and the known positions of tags on the field, the robot's position on the field may be estimate.

These estimates can be incorporated into the WPILib pose estimation classes.

TODO: code snippets

Adjustable Parameters
---------------------

blur, decimation, threads, whatever else

blur - don't use it bad bad bad apriltag 3 shouldn't use it

Decimation factor - should only impact speed and reliaability of either seeing or not seeing a tag. Should not impact corner detection.

Threads - idk need ot look it up. ALign to number of cores?

TODO: What does the github library actually expose to end users?

Further Learning
----------------

The three major versions of AprilTags are described in three academic papers. It's recommended to read them in order, as each builds upon the previous:

* :download:`AprilTags v1 <files/olson2011tags.pdf>`
* :download:`AprilTags v2 <files/wang2016iros.pdf>`
* :download:`AprilTags v3 <files/krogius2019iros.pdf>`

Additioanl information about the tag system and its creators `can be found on their website <https://april.eecs.umich.edu/software/apriltag>`_
