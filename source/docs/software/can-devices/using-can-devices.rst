Using CAN Devices
=================

CAN has many advantages over other methods of connection between the robot controller and peripheral devices.

- CAN connections are daisy-chained from device to device, which often results in much shorter wire runs than having to wire each device to the RIO itself.

- Much more data can be sent over a CAN connection than over a PWM connection - thus, CAN motor controllers are capable of a much more expansive feature-set than are PWM motor controllers.

- CAN is bi-directional, so CAN motor controllers can send data back to the RIO, again facilitating a more expansive feature-set than can be offered by PWM Controllers.

For instructions on wiring CAN devices, see the relevant section of the :ref:`robot wiring guide <docs/zero-to-robot/step-1/how-to-wire-a-robot:CAN Devices>`.

CAN devices generally have their own WPILib classes.  The following sections will describe the use of several of these classes.
