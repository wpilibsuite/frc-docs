Repeatable Low Power Movement - Controlling Servos with WPILib
==============================================================

Servo motors are a type of motor which integrates positional feedback into the motor in order to allow a single motor to perform repeatable, controllable movement, taking position as the input signal. WPILib provides the capability to control servos which match the common hobby input specification (Pulse Width Modulation (PWM) signal, 0.6 ms - 2.4 ms pulse width)

Constructing a Servo object
---------------------------

.. tabs::

    .. code-tab:: java

        Servo exampleServo = new Servo(1);

    .. code-tab:: c++

        frc::Servo exampleServo {1};

    .. code-tab:: python

       exampleServo = wpilib.Servo(1)

A servo object is constructed by passing a channel.

Setting Servo Values
--------------------

.. tabs::

    .. code-tab:: java

        exampleServo.set(.5);
        exampleServo.setAngle(75);

    .. code-tab:: c++

        exampleServo.Set(.5);
        exampleServo.SetAngle(75);

    .. code-tab:: python

       exampleServo.set(.5)
       exampleServo.setAngle(75)

There are two methods of setting servo values in WPILib:

- Scaled Value - Sets the servo position using a scaled 0 to 1.0 value. 0 corresponds to one extreme of the servo and 1.0 corresponds to the other

- Angle - Set the servo position by specifying the angle, in degrees from 0 to 180. This method will work for servos with the same range as the Hitec HS-322HD servo . Any values passed to this method outside the specified range will be coerced to the boundary.
