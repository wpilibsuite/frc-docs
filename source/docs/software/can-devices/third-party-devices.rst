.. include:: <isonum.txt>

# Third-Party CAN Devices

A number of FRC\ |reg| vendors offer their own :term:`CAN` peripherals.  As CAN devices
offer expansive feature-sets, vendor CAN devices require similarly
expansive code libraries to operate.  As a result, these libraries are
not maintained as an official part of WPILib, but are instead maintained
by the vendors themselves.  For a guide to installing third-party
libraries, see :ref:`3rd Party Libraries <docs/software/vscode-overview/3rd-party-libraries:3rd Party Libraries>`

A list of common third-party CAN devices from various vendors, along with links to corresponding external documentation, is provided below:

## CTR Electronics

CTR Electronics (CTRE) offers several CAN peripherals with external libraries. General resources for all CTRE devices include:

[Phoenix Device Software Documentation](https://docs.ctr-electronics.com/)

### CTRE Motor Controllers

- **Talon FX (with Falcon 500 Motor, Kraken x60 motor, and Kraken x44)**
    - API Documentation (v6: [Java](https://api.ctr-electronics.com/phoenix6/stable/java/com/ctre/phoenix6/hardware/TalonFX.html), [C++](https://api.ctr-electronics.com/phoenix6/stable/cpp/classctre_1_1phoenix6_1_1hardware_1_1_talon_f_x.html))
    - Hardware User's Manual ([Falcon 500](https://ctre.download/files/user-manual/Falcon%20500%20v3%20User's%20Guide.pdf), [Kraken x60](https://docs.wcproducts.com/kraken-x60), [Kraken x44](https://docs.wcproducts.com/kraken-x44))
    - [Software Documentation](https://v6.docs.ctr-electronics.com/en/stable/docs/hardware-reference/talonfx/index.html)

- **Talon SRX**
    - API Documentation ([Java](https://api.ctr-electronics.com/phoenix/stable/java/com/ctre/phoenix/motorcontrol/can/WPI_TalonSRX.html), [C++](https://api.ctr-electronics.com/phoenix/stable/cpp/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_w_p_i___talon_s_r_x.html))
    - [Hardware User's Manual](https://ctre.download/files/user-manual/Talon%20SRX%20User's%20Guide.pdf)
    - [Software Documentation](https://v5.docs.ctr-electronics.com/en/stable/ch13_MC.html)

- **Victor SPX**
    - API Documentation ([Java](https://api.ctr-electronics.com/phoenix/stable/java/com/ctre/phoenix/motorcontrol/can/WPI_VictorSPX.html), [C++](https://api.ctr-electronics.com/phoenix/stable/cpp/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_w_p_i___victor_s_p_x.html))
    - [Hardware User's Manual](https://ctre.download/files/user-manual/Victor%20SPX%20User's%20Guide.pdf)
    - [Software Documentation](https://v5.docs.ctr-electronics.com/en/stable/ch13_MC.html)

### CTRE Sensors

- **CANcoder**
    - API Documentation (v6: [Java](https://api.ctr-electronics.com/phoenix6/stable/java/com/ctre/phoenix6/hardware/CANcoder.html), [C++](https://api.ctr-electronics.com/phoenix6/stable/cpp/namespacectre_1_1phoenix_1_1platform.html#ad0cac06e0817cbcfe20851a8619a19a8a13b25ca6c3f7037c0f6e13b59cc1e571))
    - [Hardware User's Manual](https://ctre.download/files/user-manual/CANCoder%20User's%20Guide.pdf)
    - [Software Documentation](https://v6.docs.ctr-electronics.com/en/stable/docs/hardware-reference/cancoder/index.html)

- **Pigeon 2.0**
    - API Documentation (v6: [Java](https://api.ctr-electronics.com/phoenix6/stable/java/com/ctre/phoenix6/hardware/Pigeon2.html), [C++](https://api.ctr-electronics.com/phoenix6/stable/cpp/namespacectre_1_1phoenix_1_1platform.html#ad0cac06e0817cbcfe20851a8619a19a8a7bd5c8d59e1daa07d31aa1d7116c5c64))
    - [Hardware User's Manual](https://ctre.download/files/user-manual/Pigeon2%20User's%20Guide.pdf)
    - [Software Documentation6](https://v6.docs.ctr-electronics.com/en/stable/docs/hardware-reference/pigeon2/index.html)

- **Pigeon IMU**
    - API Documentation ([Java](https://api.ctr-electronics.com/phoenix/stable/java/com/ctre/phoenix/sensors/WPI_PigeonIMU.html), [C++](https://api.ctr-electronics.com/phoenix/stable/cpp/classctre_1_1phoenix_1_1sensors_1_1_w_p_i___pigeon_i_m_u.html))
    - [Hardware User's Manual](https://ctre.download/files/user-manual/Pigeon%20IMU%20User's%20Guide.pdf)
    - [Software Documentation](https://v5.docs.ctr-electronics.com/en/stable/ch11_BringUpPigeon.html)

- **CANifier**
    - API Documentation ([Java](https://api.ctr-electronics.com/phoenix/stable/java/com/ctre/phoenix/CANifier.html), [C++](https://api.ctr-electronics.com/phoenix/stable/cpp/classctre_1_1phoenix_1_1_c_a_nifier.html))
    - [Hardware User's Manual](https://ctre.download/files/user-manual/CANifier%20User's%20Guide.pdf)
    - [Software Documentation](https://v5.docs.ctr-electronics.com/en/stable/ch12_BringUpCANifier.html)

### CTRE Other CAN Devices

- **CANdle LED Controller**
    - API Documentation ([Java](https://api.ctr-electronics.com/phoenix/stable/java/com/ctre/phoenix/led/CANdle.html), [C++](https://api.ctr-electronics.com/phoenix/stable/cpp/classctre_1_1phoenix_1_1led_1_1_c_a_ndle.html))
    - [Hardware User's Manual](https://ctre.download/files/user-manual/CANdle%20User's%20Guide.pdf)
    - [Software Documentation](https://v5.docs.ctr-electronics.com/en/stable/ch12b_BringUpCANdle.html)

## REV Robotics

REV Robotics currently offers the SPARK MAX and SPARK Flex motor controllers which can be used for brushed and REV brushless (NEO, NEO 550, and NEO Vortex) motors.

### REV Motor Controllers

- **SPARK MAX**
    - API Documentation ([Java](https://codedocs.revrobotics.com/java/com/revrobotics/spark/sparkmax), [C++](https://codedocs.revrobotics.com/cpp/classrev_1_1spark_1_1_spark_max.html))
    - [Technical Manual](https://docs.revrobotics.com/brushless/spark-max/overview)

- **SPARK Flex**
    - API Documentation ([Java](https://codedocs.revrobotics.com/java/com/revrobotics/spark/sparkflex), [C++](https://codedocs.revrobotics.com/cpp/classrev_1_1spark_1_1_spark_flex.html))
    - [Technical Manual](https://docs.revrobotics.com/brushless/spark-flex/overview)

## Playing With Fusion

Playing With Fusion (PWF) offers the Venom integrated motor/controller as well as a Time-of-Flight distance sensor:

### PWF Motor Controllers

- **Venom**
    - API Documentation ([Java](https://www.playingwithfusion.com/frc/2020/javadoc/com/playingwithfusion/package-summary.html), [C++](https://www.playingwithfusion.com/frc/2020/cppdoc/html/annotated.html))
    - [Technical Manual](https://www.playingwithfusion.com/include/getfile.php?fileid=7086)

### PWF Sensors

- **Time of Flight Sensor**
    - API Documentation ([Java](https://www.playingwithfusion.com/frc/2020/javadoc/com/playingwithfusion/package-summary.html), [C++](https://www.playingwithfusion.com/frc/2020/cppdoc/html/annotated.html))
    - [Technical Manual](https://www.playingwithfusion.com/include/getfile.php?fileid=7091)

## Redux Robotics

.. warning:: Redux Robotics is shutting down. While their devices remain legal for FRC use and software support will be provided for the 2026 season, no new hardware will be available.

Redux Robotics offers the HELIUM Canandmag :term:`CAN` + :term:`PWM` magnetic encoder and the BORON Canandgyro :term:`CAN`-enabled gyro.

### Redux Sensors

- **HELIUM Canandmag**
    - API Documentation ([Java](https://apidocs.reduxrobotics.com/current/java/com/reduxrobotics/sensors/canandmag/package-summary), [C++](https://apidocs.reduxrobotics.com/current/cpp/namespaceredux_1_1sensors_1_1canandmag))
    - [Technical Manual](https://docs.reduxrobotics.com/canandmag)

- **BORON Canandgyro**
    - API Documentation ([Java](https://apidocs.reduxrobotics.com/current/java/com/reduxrobotics/sensors/canandgyro/package-summary), [C++](https://apidocs.reduxrobotics.com/current/cpp/namespaceredux_1_1sensors_1_1canandgyro))
    - [Technical Manual](https://docs.reduxrobotics.com/canandgyro/)

## Grapple Robotics

Grapple Robotics currently offers the LaserCAN :term:`CAN`-enabled range finding sensor

### Grapple Sensors

- **LaserCAN**
    - API Documentation ([Java](https://github.com/GrappleRobotics/LaserCAN/blob/master/docs/example-java.md), [C++](https://github.com/GrappleRobotics/LaserCAN/blob/master/docs/example-cpp.md))
    - [Technical Manual](https://github.com/GrappleRobotics/LaserCAN/blob/master/docs/getting-started.md)
