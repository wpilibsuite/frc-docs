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

Cross-the-Road Electronics
--------------------------

Cross-the-Road Electronics (CTRE) offers several CAN peripherals with external libraries. General resources for all CTRE devices include:

- `Phoenix Device Software Documentation <https://docs.ctre-phoenix.com/>`__

- `Phoenix Device Software Examples <https://github.com/CrossTheRoadElec/Phoenix-Examples-Languages>`__

CTRE Motor Controllers
^^^^^^^^^^^^^^^^^^^^^^

- **Talon FX (with Falcon 500 Motor)**

    - API Documentation (`Java <https://store.ctr-electronics.com/content/api/java/html/classcom_1_1ctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_talon_f_x.html>`__, `C++ <https://store.ctr-electronics.com/content/api/cpp/html/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_talon_f_x.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/Falcon%20500%20User%20Guide.pdf>`__
    - `Software Documentation <https://docs.ctre-phoenix.com/en/stable/ch13_MC.html>`__

- **Talon SRX**

    - API Documentation (`Java <https://store.ctr-electronics.com/content/api/java/html/classcom_1_1ctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_talon_s_r_x.html>`__, `C++ <https://store.ctr-electronics.com/content/api/cpp/html/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_talon_s_r_x.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/Talon%20SRX%20User's%20Guide.pdf>`__
    - `Software Documentation <https://docs.ctre-phoenix.com/en/stable/ch13_MC.html>`__

- **Victor SPX**

    - API Documentation (`Java <https://store.ctr-electronics.com/content/api/java/html/classcom_1_1ctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_victor_s_p_x.html>`__, `C++ <https://store.ctr-electronics.com/content/api/cpp/html/classctre_1_1phoenix_1_1motorcontrol_1_1can_1_1_victor_s_p_x.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/Victor%20SPX%20User's%20Guide.pdf>`__
    - `Software Documentation <https://docs.ctre-phoenix.com/en/stable/ch13_MC.html>`__

CTRE Sensors
^^^^^^^^^^^^

- **CANcoder**

    - API Documentation (`Java <https://store.ctr-electronics.com/content/api/java/html/classcom_1_1ctre_1_1phoenix_1_1sensors_1_1_c_a_n_coder.html>`__, `C++ <https://store.ctr-electronics.com/content/api/cpp/html/classctre_1_1phoenix_1_1sensors_1_1_c_a_n_coder.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/CANCoder%20User's%20Guide.pdf>`__
    - `Software Documentation <https://docs.ctre-phoenix.com/en/stable/ch12a_BringUpCANCoder.html>`__

- **Pigeon IMU**

    - API Documentation (`Java <https://store.ctr-electronics.com/content/api/java/html/classcom_1_1ctre_1_1phoenix_1_1sensors_1_1_pigeon_i_m_u.html>`__, `C++ <https://store.ctr-electronics.com/content/api/cpp/html/classctre_1_1phoenix_1_1sensors_1_1_pigeon_i_m_u.html>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/Pigeon%20IMU%20User's%20Guide.pdf>`__
    - `Software Documentation <https://docs.ctre-phoenix.com/en/stable/ch11_BringUpPigeon.html>`__

- **CANifier**

    - API Documentation (`Java <https://store.ctr-electronics.com/content/api/java/html/classcom_1_1ctre_1_1phoenix_1_1_c_a_nifier.html#ad9a05fae7065d3f39f7bc8a86f15b0a1>`__, `C++ <https://store.ctr-electronics.com/content/api/cpp/html/classctre_1_1phoenix_1_1_c_a_nifier.html#a706308fce1dea96785bf3ac845bafc02>`__)
    - `Hardware User's Manual <https://store.ctr-electronics.com/content/user-manual/CANifier%20User%27s%20Guide.pdf>`__
    - `Software Documentation <https://docs.ctre-phoenix.com/en/stable/ch12_BringUpCANifier.html>`__

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
