Morphological Operations
========================

Sometimes, after getting your binary image, you have unwanted noise. Morphological operations can help remove that noise from the image.

Erosion
_______

Erosion in computer vision is similar to erosion on soil. It takes away the borders of foreground objects.

.. tabs::
   
   .. code-tab:: py

      kernel = np.ones((3, 3), np.uint8)
      binary_img = cv2.erode(binary_img, kernel, iterations = 1)
       

Dialation
_________

Dialation is opposite of erosion. Instead of taking away the borders, it adds to them.

.. tabs::
   
   .. code-tab:: py
      
      kernel = np.ones((3, 3), np.uint8)
      binary_img = cv2.dialate(binary_img, kernel, iterations = 1)


By themselves, these two operations can get rid of noise or holes. However, chaining them together can accomplish that without changing the shape of any features we do not erode or dialate out.


Opening
_______