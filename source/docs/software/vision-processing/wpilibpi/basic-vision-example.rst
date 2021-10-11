Basic Vision Example
====================

This is an example of a basic vision setup that posts the target's location in the aiming coordinate system described :ref:`here <docs/software/vision-processing/introduction/identifying-and-processing-the-targets:Measurements>` to NetworkTables, and uses CameraServer to display a bounding rectangle of the contour detected. This example will display the framerate of the processing code on the images sent to CameraServer.

.. tabs::

   .. code-tab:: py

      from cscore import CameraServer
      from networktables import NetworkTables

      import cv2
      import json
      import numpy as np
      import time

      def main():
         with open('/boot/frc.json') as f:
            config = json.load(f)
         camera = config['cameras'][0]

         width = camera['width']
         height = camera['height']

         CameraServer.startAutomaticCapture()

         input_stream = CameraServer.getVideo()
         output_stream = CameraServer.putVideo('Processed', width, height)

         # Table for vision output information
         vision_nt = NetworkTables.getTable('Vision')

         # Allocating new images is very expensive, always try to preallocate
         img = np.zeros(shape=(240, 320, 3), dtype=np.uint8)

         # Wait for NetworkTables to start
         time.sleep(0.5)

         while True:
            start_time = time.time()

            frame_time, input_img = input_stream.grabFrame(img)
            output_img = np.copy(input_img)

            # Notify output of error and skip iteration
            if frame_time == 0:
               output_stream.notifyError(input_stream.getError())
               continue

            # Convert to HSV and threshold image
            hsv_img = cv2.cvtColor(input_img, cv2.COLOR_BGR2HSV)
            binary_img = cv2.inRange(hsv_img, (65, 65, 200), (85, 255, 255))

            _, contour_list, _ = cv2.findContours(binary_img, mode=cv2.RETR_EXTERNAL, method=cv2.CHAIN_APPROX_SIMPLE)

            x_list = []
            y_list = []

            for contour in contour_list:

               # Ignore small contours that could be because of noise/bad thresholding
               if cv2.contourArea(contour) < 15:
                  continue

               cv2.drawContours(output_img, contour, -1, color = (255, 255, 255), thickness = -1)

               rect = cv2.minAreaRect(contour)
               center, size, angle = rect
               center = tuple([int(dim) for dim in center]) # Convert to int so we can draw

               # Draw rectangle and circle
               cv2.drawContours(output_img, [cv2.boxPoints(rect).astype(int)], -1, color = (0, 0, 255), thickness = 2)
               cv2.circle(output_img, center = center, radius = 3, color = (0, 0, 255), thickness = -1)

               x_list.append((center[0] - width / 2) / (width / 2))
               x_list.append((center[1] - width / 2) / (width / 2))

            vision_nt.putNumberArray('target_x', x_list)
            vision_nt.putNumberArray('target_y', y_list)

            processing_time = time.time() - start_time
            fps = 1 / processing_time
            cv2.putText(output_img, str(round(fps, 1)), (0, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255))
            output_stream.putFrame(output_img)

      main()
