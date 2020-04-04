Thresholding an Image
=====================

In order to turn a colored image, such as the one captured by your camera, into a binary image, with the target as the "foreground", we need to threshold the image using the hue, saturation, and value of each pixel.


HSV Model
_________

Unlike RGB, HSV allows us to not only filter based on the colors of the pixels, but also by the intensity of color and the brightness.

* Hue: Measures the color of the pixel.
* Saturation: Measures the intensity of color of the pixel.
* Value: Measures the brighness of the pixel.

.. note::
   OpenCV's hue range is from 1° to 180° instead of the common 1° to 360°. In order to convert a common hue value to OpenCV, divide by 2. 