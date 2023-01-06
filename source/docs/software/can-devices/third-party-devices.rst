.. include:: <isonum.txt>

Third-Party CAN Devices
=======================

A number of FRC\ |reg| vendors offer their own CAN peripherals.  As CAN devices
offer expansive feature-sets, vendor CAN devices require similarly
expansive code libraries to operate.  As a result, these libraries are
not maintained as an official part of WPILib, but are instead maintained
by the vendors themselves.  For a guide to installing third-party
libraries, see :ref:`3rd Party Libraries <docs/software/vscode-overview/3rd-party-libraries:3rd Party Libraries>`

A list of common third-party CAN devices from various vendors, along with links to corresponding external documentation, is provided below:

CTR Electronics
--------------------------

CTR Electronics (CTRE) offers several CAN peripherals with external libraries. General resources for all CTRE devices include:

  `Phoenix Device Software Documentation <https://docs.ctr-electronics.com/>`__

CTRE Motor Controllers
^^^^^^^^^^^^^^^^^^^^^^

- **Talon FX (with Falcon 500 Motor)**

    - API Documentation (v5: `Java <https://api.ctr-electronics.com/phoenix/release/java/com/ctre/phoenix/motorcontrol/can/WPI_TalonFX.html>`__, `C++ <https://api.ctr-electronics.com/phoenix/release/cpp/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_w_p_i___talon_f_x.html>`__ | Pro: `Java <https://api.ctr-electronics.com/phoenixpro/release/java/com/ctre/phoenixpro/hardware/TalonFX.html>`__, `C++ <https://api.ctr-electronics.com/phoenixpro/release/cpp/classctre_1_1phoenixpro_1_1hardware_1_1_talon_f_x.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/Falcon%20500%20User%20Guide.pdf>`__
    - Software Documentation (`v5 <https://v5.docs.ctr-electronics.com/en/stable/ch13_MC.html>`__, `Pro <https://pro.docs.ctr-electronics.com/en/stable/docs/api-reference/examples/quickstart.html>`__)

- **Talon SRX**

    - API Documentation (`Java <https://api.ctr-electronics.com/phoenix/release/java/com/ctre/phoenix/motorcontrol/can/WPI_TalonSRX.html>`__, `C++ <https://api.ctr-electronics.com/phoenix/release/cpp/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_w_p_i___talon_s_r_x.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/Talon%20SRX%20User's%20Guide.pdf>`__
    - `Software Documentation <https://v5.docs.ctr-electronics.com/en/stable/ch13_MC.html>`__

- **Victor SPX**

    - API Documentation (`Java <https://api.ctr-electronics.com/phoenix/release/java/com/ctre/phoenix/motorcontrol/can/WPI_VictorSPX.html>`__, `C++ <https://api.ctr-electronics.com/phoenix/release/cpp/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_w_p_i___victor_s_p_x.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/Victor%20SPX%20User's%20Guide.pdf>`__
    - `Software Documentation <https://v5.docs.ctr-electronics.com/en/stable/ch13_MC.html>`__

CTRE Sensors
^^^^^^^^^^^^

- **CANcoder**

    - API Documentation (v5: `Java <https://api.ctr-electronics.com/phoenix/release/java/com/ctre/phoenix/sensors/WPI_CANCoder.html>`__, `C++ <https://api.ctr-electronics.com/phoenix/release/cpp/classctre_1_1phoenix_1_1sensors_1_1_w_p_i___c_a_n_coder.html>`__ | Pro: `Java <https://api.ctr-electronics.com/phoenixpro/release/java/com/ctre/phoenixpro/hardware/CANcoder.html>`__, `C++ <https://api.ctr-electronics.com/phoenixpro/release/cpp/classctre_1_1phoenixpro_1_1hardware_1_1_c_a_ncoder.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/CANCoder%20User's%20Guide.pdf>`__
    - Software Documentation (`v5 <https://v5.docs.ctr-electronics.com/en/stable/ch12a_BringUpCANCoder.html>`__, `Pro <https://pro.docs.ctr-electronics.com/en/stable/docs/api-reference/api-usage/index.html>`__)

- **Pigeon 2.0**

    - API Documentation (v5: `Java <https://api.ctr-electronics.com/phoenix/release/java/com/ctre/phoenix/sensors/WPI_Pigeon2.html>`__, `C++ <https://api.ctr-electronics.com/phoenix/release/cpp/classctre_1_1phoenix_1_1sensors_1_1_w_p_i___pigeon2.html>`__ | Pro: `Java <https://api.ctr-electronics.com/phoenixpro/release/java/com/ctre/phoenixpro/hardware/Pigeon2.html>`__, `C++ <https://api.ctr-electronics.com/phoenixpro/release/cpp/classctre_1_1phoenixpro_1_1hardware_1_1_pigeon2.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/Pigeon2%20User's%20Guide.pdf>`__
    - Software Documentation (`v5 <https://v5.docs.ctr-electronics.com/en/stable/ch11a_BringUpPigeon2.html>`__, `Pro <https://pro.docs.ctr-electronics.com/en/stable/docs/api-reference/api-usage/index.html>`__)

- **Pigeon IMU**

    - API Documentation (`Java <https://api.ctr-electronics.com/phoenix/release/java/com/ctre/phoenix/sensors/WPI_PigeonIMU.html>`__, `C++ <https://api.ctr-electronics.com/phoenix/release/cpp/classctre_1_1phoenix_1_1sensors_1_1_w_p_i___pigeon_i_m_u.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/Pigeon%20IMU%20User's%20Guide.pdf>`__
    - `Software Documentation <https://v5.docs.ctr-electronics.com/en/stable/ch11_BringUpPigeon.html>`__

- **CANifier**

    - API Documentation (`Java <https://api.ctr-electronics.com/phoenix/release/java/com/ctre/phoenix/CANifier.html>`__, `C++ <https://api.ctr-electronics.com/phoenix/release/cpp/classctre_1_1phoenix_1_1_c_a_nifier.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/CANifier%20User%27s%20Guide.pdf>`__
    - `Software Documentation <https://v5.docs.ctr-electronics.com/en/stable/ch12_BringUpCANifier.html>`__

CTRE Other CAN Devices
^^^^^^^^^^^^^^^^^^^^^^

- **CANdle LED Controller**

    - API Documentation (`Java <https://api.ctr-electronics.com/phoenix/release/java/com/ctre/phoenix/led/CANdle.html>`__, `C++ <https://api.ctr-electronics.com/phoenix/release/cpp/classctre_1_1phoenix_1_1led_1_1_c_a_ndle.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/CANdle%20User's%20Guide.pdf>`__
    - `Software Documentation <https://v5.docs.ctr-electronics.com/en/stable/ch12b_BringUpCANdle.html>`__

REV Robotics
------------

REV Robotics currently offers the SPARK MAX motor controller, which has a similar feature-set to the Talon SRX.

REV Motor Controllers
^^^^^^^^^^^^^^^^^^^^^

- **SPARK MAX**

    - API Documentation (`Java <https://codedocs.revrobotics.com/java/com/revrobotics/package-summary.html>`__, `C++ <https://codedocs.revrobotics.com/cpp/namespacerev.html>`__)
    - `Technical Manual <https://docs.revrobotics.com/sparkmax/>`__

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

    - API Documentation (`Java <https://www.playingwithfusion.com/frc/2020/javadoc/com/playingwithfusion/package-summary.html>`__, `C++ <https://www.playingwithfusion.com/frc/2020/cppdoc/html/annotated.html>`__)
    - `Technical Manual <https://www.playingwithfusion.com/include/getfile.php?fileid=7091>`__
