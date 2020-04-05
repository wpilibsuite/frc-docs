Working with Contours
=====================

After thresholding and removing noise with morphological operations, you are now ready to use OpenCV's ``findContours`` method. This method allows you to generate contours based on your binary image.

Finding and Filtering Contours
______________________________

.. tabs::

   .. code-tab:: py

      _, contours, _ = cv2.findContours(binary_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

In most cases, you want only one contour which is the retroreflective target. However, if there is noise that was not filtered out by morphological operations, you could end up with more in your contour list. A common way to select which contour to use is to simply use the largest.

.. tabs::

   .. code-tab:: py

      if len(contours) > 0:
         largest = contours[0]
         for contour in contours:
            if cv2.contourArea(contour) > cv2.contourArea(largest):
               largest = contour

         #
         # Contour processing code
         #

Extracting Information from Contours
____________________________________

Now that you've found the contour(s) that you want, you now want to get information about it, such as the center, corners, and rotation.

Center
^^^^^^

There are multiple ways to find the center of the contour. In this example, we will use the simple method of finding the center of the bounding rectangle. The center's position can be used to estimate the angle of the target to your robot.

.. tabs::

   .. code-tab:: py

      rect = cv2.minAreaRect(contour)
      center, _, _ = rect
      center_x, center_y = rect

Corners
^^^^^^^

We will use a convex hull and then polygon approxmation to find the corners of the contour.

.. tabs::

   .. code-tab:: py

      corners = cv2.convexHull(contour)
      corners = cv2.approxPolyDP(corners, 0.1 * cv2.arcLength(contour), True)

Rotation
^^^^^^^^

We will use an ellipse and find its rotation to find the rotation of the contour.

.. tabs::

   .. code-tab:: py

      _, _, rotation = cv2.fitEllipse(contour)
