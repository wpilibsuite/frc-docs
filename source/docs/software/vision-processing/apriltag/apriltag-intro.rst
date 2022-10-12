.. include:: <isonum.txt>

What Are AprilTags?
===================


blah bla blah

History & Design Goals
----------------------

Info on the history

stuff

Software Support
----------------

Link to Github

what wpilib has added

Processing Technique
--------------------

How they're processed:

* calcualte the gradient at each pixel (magnititude and direction of direvative change)
  * Blur can be added at this step to get rid of noise in the image (which has a bit impact on gradient)
  * This can be done at a lower resolution too
    * Reason both of these work: corders of a quad are much "larger-scale" compared to noise
* Cluster similar gradient pixels together
* fit line segments along the similar clusters such that lighter is on the right
* Search for quads - sets of four line segments which start and end at a "close enough" location to be reasoanble assumed to be a square
  * counter-clockwise "winding order"
  * Corners of the quad are the intersections of the lines that define it (not the pixel locations)


detector

Usage
-----

2D Alignment
^^^^^^^^^^^^

Use centroid

3D Alignment
^^^^^^^^^^^^

Pose blah blah blah

Adjustable Parameters
---------------------

blur, decimation, threads, whatever else

Further Learning
----------------

Academic Papers
