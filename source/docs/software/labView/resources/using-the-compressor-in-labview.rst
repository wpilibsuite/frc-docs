Using the Compressor in LabVIEW
===============================

.. image::images/ni-logo.png

This snippet shows how to set up your roboRIO project to use the Pneumatic Control Module (PCM).  The PCM automatically starts and stops the compressor when specific pressures are measured in the tank. In your roboRIO program, you will need to add the following VIs.

For more information, check out the following links:

`FRC Pneumatics Manual <https://rps01.usfirst.org/frc/manual/2015/2015FRCPneumaticsManual.pdf>`__

`PCM User's Guide <http://crosstheroadelectronics.com/PCM%20User's%20Guide.pdf>`__

`Pneumatics Step by Step for the roboRIO <http://team358.org/files/pneumatic/Pneumatics-StepByStep-roboRIO.pdf>`__

Begin VI
--------

Place this snippet in the Begin.vi.

.. image::images/using-the-compressor-in-labview/begin.png

Teleop VI
---------

Place this snippet in the Teleop.vi. This portion is only required if you are using the outputs for other processes.

.. image::images/using-the-compressor-in-labview/teleop.png

Finish VI
---------

Place this snippet in Close Refs, save data, etc. frame of the Finish.vi.

.. image::images/using-the-compressor-in-labview/finish.png
