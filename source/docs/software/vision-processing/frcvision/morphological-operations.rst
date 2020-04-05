Morphological Operations
========================

Sometimes, after getting your binary image, you have unwanted noise. Morphological operations can help remove that noise from the image.

Erosion
_______

Erosion in computer vision is similar to erosion on soil. It takes away from the borders of foreground objects. This process can remove noise from the background.

.. tabs::

   .. code-tab:: py

      kernel = np.ones((3, 3), np.uint8)
      binary_img = cv2.erode(binary_img, kernel, iterations = 1)


Dialation
_________

Dialation is opposite of erosion. Instead of taking away from the borders, it adds to them. This process can remove small holes inside a larger region.

.. tabs::

   .. code-tab:: py

      kernel = np.ones((3, 3), np.uint8)
      binary_img = cv2.dialate(binary_img, kernel, iterations = 1)


By themselves, these two operations can get rid of noise or holes. However, chaining them together can accomplish that without changing the shape of any features we do not erode or dialate out.


Opening
_______
Opening is erosion followed by dilation. This process removes noise without affecting larger features.

.. tabs::

   .. code-tab:: py

      kernel = np.ones((3, 3), np.uint8)
      binary_img = cv2.morphologyEx(binary_img, cv2.MORPH_OPEN, kernel)


Closing
_______
Closing is dilation followed by erosion. This process removes small holes or breaks without affecting larger features.

.. tabs::

   .. code-tab:: py

      kernel = np.ones((3, 3), np.uint8)
      binary_img = cv2.morphologyEx(binary_img, cv2.MORPH_CLOSE, kernel)
