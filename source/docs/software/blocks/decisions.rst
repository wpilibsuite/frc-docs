Adjust the KitBot Driver Controls
=================================

Complete :doc:`first-project` before changing controls. Make one change at a time and repeat the raised-wheel check after each change.

Understand the Starting Inputs
------------------------------

Your Teleop periodic call uses Gamepad 0 Left stick Y for ``xSpeed`` and Gamepad 0 Right stick X for ``zRotation``. Each reading is multiplied by 0.25 to reduce the requests for initial testing.

Change an Axis Direction
------------------------

First check the gamepad reading and the physical motor direction. If an axis needs reversing, place a Math negation block around that axis reading. Keep the multiplication by 0.25 connected during initial tests.

An axis-direction change affects a driver request. Motor inversion affects how a controller drives its motor. Use the appropriate setting for the observed problem rather than changing both together.

Change the Drive Layout
-----------------------

To use one-stick arcade drive, change only the rotation input from Right stick X to Left stick X. Keep the forward input on Left stick Y and leave the rest of the drivetrain implementation unchanged. This changes the driving layout, not the motor-controller assignments.

Read :doc:`kitbot-drivetrain` for the leader/follower and DifferentialDrive explanation. A future tank-drive lesson would require two side-speed requests and an appropriate drive method; swapping the rotation axis alone does not create tank drive.

Keep a Working Version
----------------------

Use :doc:`backup-and-restore` before experimenting. After a change, confirm centered-stick behavior, forward/reverse, turning, and stopping when disabled before driving on the floor.
