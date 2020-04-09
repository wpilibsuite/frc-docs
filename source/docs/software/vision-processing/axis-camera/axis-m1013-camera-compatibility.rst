.. include:: <isonum.txt>

Axis M1013 Camera Compatibility
===============================

The Axis M1011 camera has been discontinued and superseded by the Axis M1013 camera. This document details the differences between the two cameras when used with WPILib and the provided sample vision programs.

Optical Differences
-------------------

The Axis M1013 camera has a few major optical differences from the M1011 camera:

1. The M1013 is an adjustable focus camera. Make sure to focus your M1013 camera by turning the grey and black lens housing to make sure you have a clear image at your desired viewing distance.
2. The M1013 has a wider view angle (67\ |deg|) compared to the M1011 (47\ |deg|). This means that for a feature of a fixed size, the image of that feature will span a smaller number of pixels

Using the M1013 with WPILib
---------------------------

The M1013 camera has been tested with all of the available WPILib parameters and the following performance exceptions were noted:

1. The M1013 does not support the 160x120 resolution. Requesting a stream of this resolution will result in no images being returned or displayed.
2. The M1013 does not appear to work with the Color Enable parameter exposed by WPILib. Regardless of the setting of this parameter a full color image was returned.

All other WPILib camera parameters worked as expected. If any issues not noted here are discovered, please file a bug report on GitHub.
