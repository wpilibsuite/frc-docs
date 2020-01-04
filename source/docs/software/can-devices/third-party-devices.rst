Third-Party CAN Devices
=======================

A number of FRC vendors offer their own CAN peripherals.  As CAN devices
offer expansive feature-sets, vendor CAN devices require similarly
expansive code libraries to operate.  As a result, these libraries are
not maintained as an official part of WPILib, but are instead maintained
by the vendors themselves.  For a guide to installing third-party
libraries, see :ref:`3rd Party Libraries <docs/software/wpilib-overview/3rd-party-libraries:3rd Party Libraries>`

A list of common third-party CAN devices from various vendors, along with links to corresponding external documentation, is provided below:

Cross-the-Road Electronics
--------------------------

Cross-the-Road Electronics (CTRE) offers several CAN peripherals with external libraries:

CTRE Motor Controllers
^^^^^^^^^^^^^^^^^^^^^^

- **Talon SRX**

    - API Documentation (`Java <https://www.ctr-electronics.com/downloads/api/java/html/classcom_1_1ctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_talon_s_r_x.html>`__, `C++ <https://www.ctr-electronics.com/downloads/api/cpp/html/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_talon_s_r_x.html>`__)
    - `Technical Manual <https://www.ctr-electronics.com/Talon%20SRX%20User's%20Guide.pdf>`__

- **Victor SPX**

    - API Documentation (`Java <https://www.ctr-electronics.com/downloads/api/java/html/classcom_1_1ctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_victor_s_p_x.html>`__, `C++ <https://www.ctr-electronics.com/downloads/api/cpp/html/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_victor_s_p_x.html>`__)
    - `Technical Manual <https://www.ctr-electronics.com/downloads/pdf/Victor%20SPX%20User's%20Guide.pdf>`__

CTRE Sensors
^^^^^^^^^^^^

- **Pigeon IMU**

    - API Documentation(`Java <https://www.ctr-electronics.com/downloads/api/java/html/classcom_1_1ctre_1_1phoenix_1_1sensors_1_1_pigeon_i_m_u.html>`__, `C++ <https://www.ctr-electronics.com/downloads/api/cpp/html/classctre_1_1phoenix_1_1sensors_1_1_pigeon_i_m_u.html>`__)
    - `Technical Manual <https://www.ctr-electronics.com/downloads/pdf/Pigeon%20IMU%20User's%20Guide.pdf>`__

- **CANifier**

    - API Documentation (`Java <https://www.ctr-electronics.com/downloads/api/java/html/classcom_1_1ctre_1_1phoenix_1_1_c_a_nifier.html#ad9a05fae7065d3f39f7bc8a86f15b0a1>`__, `C++ <https://www.ctr-electronics.com/downloads/api/cpp/html/classctre_1_1phoenix_1_1_c_a_nifier.html#a706308fce1dea96785bf3ac845bafc02>`__)
    - `Technical Manual <https://www.ctr-electronics.com/downloads/pdf/CANifier%20User's%20Guide.pdf>`__

REV Robotics
------------

REV Robotics currently offers the SPARK MAX motor controller, which has a similar feature-set to the Talon SRX.

REV Motor Controllers
^^^^^^^^^^^^^^^^^^^^^

- **SPARK MAX**

    - API Documentation (`Java <https://www.revrobotics.com/content/sw/max/sw-docs/java/com/revrobotics/CANSparkMax.html>`__, `C++ <https://www.revrobotics.com/content/sw/max/sw-docs/cpp/classrev_1_1_c_a_n_spark_max.html>`__)
    - `Technical Manual <https://www.revrobotics.com/sparkmax-users-manual/>`__

Playing With Fusion
-------------------

Playing With Fusion (PWF) offers the Venom integrated motor/controller as well as a Time-of-Flight distance sensor:

PWF Motor Controllers
^^^^^^^^^^^^^^^^^^^^^

- **Venom**

    - API Documentation (`Java <https://www.playingwithfusion.com/frc/2020/javadoc/com/playingwithfusion/package-summary.html>`__, `C++ <https://www.playingwithfusion.com/frc/2020/cppdoc/html/annotated.html>`__)
    - `Technical Manual <https://www.playingwithfusion.com/include/getfile.php?fileid=7086>`__

PWF Sensors
^^^^^^^^^^^

- **Time of Flight Sensor**

    - API Documentation(`Java <https://www.playingwithfusion.com/frc/2020/javadoc/com/playingwithfusion/package-summary.html>`__, `C++ <https://www.playingwithfusion.com/frc/2020/cppdoc/html/annotated.html>`__)
    - `Technical Manual <https://www.playingwithfusion.com/include/getfile.php?fileid=7091>`__
