Camera Settings
===============
It is very difficult to achieve good image processing results without good images. With a light mounted near the camera
lens, you should be able to use the provided examples, the dashboard or SmartDashboard, NI Vision Assistant or a web
browser to view camera images and experiment with camera settings.

Changing Camera Settings
------------------------
.. image::images/camera-settings/changing-camera-settings.png

To change the camera settings on any of the supported Axis cameras (206, M1011, M1013), browse to the camera's webpage by
entering it's address (usually 10.TE.AM.11) in a web browser. Click Setup near the top right corner of the page. On the
M1013, the settings listed below are split between the Video Stream page and the Camera Settings page, both listed under
the Video section.

Focus
-----
The Axis M1011 has a fixed-focus lens and no adjustment is needed. The Axis 206 camera has a black bezel around the lens
that rotates to move the lens in and out and adjust focus. The Axis M103 has a silver and black bezel assembly around the
lens to adjust the focus. Ensure that the images you are processing are relatively sharp and focused for the distances
needed on your robot.

Compression
-----------
.. image::images/camera-settings/compression.png

The Axis camera returns images in BMP, JPEG, or MJPG format. BMP images are quite large and take more time to transmit to
the cRIO and laptop. Therefore the WPILib implementations typically use MJPG motion JPEG. The compression setting ranges
form 0 to 100, with 0 being very high quality images with very little compression, and 100 being very low quality images
with very high compression. The camera default is 30, and it is a good compromise, with few artifacts that will degrade
image processing. Due to implementation details within the VxWorks memory manager, you may notice a performance benefit if
you keep the image sizes consistently below 16 kBytes. **Teams are advised to consider how the compression setting on the
camera affects bandwidth if performing processing on the Driver Station computer, see the FMS Whitepaper for more details.**

Resolution
----------
.. image::images/camera-settings/resolution.png

Image sizes shared by the supported cameras are 160x120, 320x240, and 640x480. The M1011 and 1013 have additional sizes,
but they aren’t built into WPILib. The largest image size has four times as many pixels that are one-fourth the size of
the middle size image. The large image has sixteen times as many pixels as the small image.

The tape used on the target is 4 inches wide, and for good processing, you will want that 4 inch feature to be at least
two pixels wide. Using the distance equations above, we can see that a medium size image should be fine up to the point
where the field of view is around 640 inches, a little over 53 feet, which is nearly double the width of the FRC field.
This occurs at around 60 feet away, longer than the length of the field. The small image size should be usable for
processing to a distance of about 30 feet or a little over mid-field.

Image size also impacts the time to decode and to process. Smaller images will be roughly four times faster than the next
size up. If the robot or target is moving, it is quite important to minimize image processing time since this will add
to the delay between the target location and perceived location. If both robot and target are stationary, processing time
is typically less important.

    Note: When requesting images using LabVIEW (either the Dashboard or Robot Code), the resolution and Frame Rate settings
    of the camera will be ignored. The LabVIEW code specifies the framerate and resolution as part of the stream request
    (this does not change the settings stored in the camera, it overrides that setting for the specific stream). The
    SmartDashboard and robot code in C++ or Java will use the resolution and framerate stored in the camera.

Frame Rate
----------
.. image::images/camera-settings/frame-rate.png

The Axis Cameras have a max framerate of 30 frames per second. If desired, a limit can be set lower to reduce bandwidth
consumption.

Color Enable
------------
The Axis cameras typically return color images, but are capable of disabling color and returning a monochrome or grayscale
image. The resulting image is a bit smaller in file size, and considerably quicker to decode. If processing is carried out
only on the brightness or luminance of the image, and the color of the ring light is not used, this may be a useful
technique for increasing the frame rate or lowering the CPU usage.

White Balance
-------------
.. image::images/camera-settings/white-balance.png

If the color of the light shine is being used to identify the marker, be sure to control the camera settings that affect
the image coloring. The most important setting is white balance. It controls how the camera blends the component colors
of the sensor in order to produce an image that matches the color processing of the human brain. The camera has five or
six named presets, an auto setting that constantly adapts to the environment, and a hold setting -- for custom calibration.

The easiest approach is to use a named preset, one that maintains the saturation of the target and doesn’t introduce
problems by tinting neutral objects with the color of the light source.

To custom-calibrate the white balance, place a known neutral object in front of the camera. A sheet of white paper is a
reasonable object to start with. Set the white balance setting to auto, wait for the camera to update its filters (ten
seconds or so), and switch the white balance to hold.

Exposure
--------
.. image::images/camera-settings/exposure.png

The brightness or exposure of the image also has an impact on the colors being reported. The issue is that as overall
brightness increases, color saturation will start to drop. Lets look at an example to see how this occurs. A saturated
red object placed in front of the camera will return an RGB measurement high in red and low in the other two e.g. (220,
20, 30). As overall white lighting increases, the RGB value increases to (240, 40, 50), then (255, 80, 90), then (255,
120, 130), and then (255, 160, 170). Once the red component is maximized, additional light can only increase the blue and
green, and acts to dilute the measured color and lower the saturation. If the point is to identify the red object, it is
useful to adjust the exposure to avoid diluting your principle color. The desired image will look somewhat dark except for
the colored shine.

There are two approaches to control camera exposure times. One is to allow the camera to compute the exposure settings
automatically, based on its sensors, and then adjust the camera’s brightness setting to a small number to lower the
exposure time. The brightness setting acts similar to the exposure compensation setting on SLR cameras. The other approach
is to calibrate the camera to use a custom exposure setting. To do this on a 206 or M1011, change the exposure setting to
auto, expose the camera to bright lights so that it computes a short exposure, and then change the exposure setting to
hold. Both approaches will result in an overall dark image with bright saturated target colors that stand out from the
background and are easier to mask.

The M1013 exposure settings look a little different. The Enable Backlight compensation option is similar to the Auto
exposure settings of the M1011 and 206 and you will usually want to un-check this box. Adjust the Brightness and Exposure
value sliders until your image looks as desired. The Exposure Priority should generally be set to Motion. This will
prioritize framerate over image quality. Note that even with these settings the M1013 camera still performs some auto
exposure compensation so it is recommended to check calibration frequently to minimize any impact lighting changes may
have on image processing. See the article on Calibration for more details. 
