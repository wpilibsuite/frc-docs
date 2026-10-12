.. include:: <isonum.txt>

# Systemcore SSH

.. note:: This document contains advanced topics not required for typical WPILib programming

## SSH
SSH (Secure SHell) is a protocol used for secure data communication. When broadly referred to regarding a Linux system (such as the one running on the Systemcore) it generally refers to accessing the command line console using the SSH protocol. This can be used to execute commands on the remote system. OpenSSH is included by default on Windows, macOS, and Linux.

.. danger:: Changing the default ssh passwords will prevent C++, Java, and Python teams from uploading code.

### Connect via SSH

To connect to the Systemcore, open a terminal or command prompt and run:

.. code-block:: shell

   ssh systemcore@robot.local

You can also use the IP address of the Systemcore instead of the mDNS name. The default IP addresses for the Systemcore are:

+----------------------------------+----------------+
| Connection Method                | Default IP     |
+==================================+================+
| Systemcore Wi-Fi Access Point IP | ``172.30.0.1`` |
+----------------------------------+----------------+
| Systemcore USB IP (Windows)      | ``172.26.0.1`` |
+----------------------------------+----------------+
| Systemcore USB IP (Linux, Mac)   | ``172.27.0.1`` |
+----------------------------------+----------------+
| Systemcore Ethernet IP           | Check display  |
+----------------------------------+----------------+

Utilize the IP Address that corresponds to the connection method you are using. For example, if you are connected to the Systemcore via Wi-Fi, use the Wi-Fi Access Point IP address.

.. code-block:: shell

   ssh systemcore@172.30.0.1

If your Systemcore is set to a static IP you can use that IP as the hostname.

### Log In

When you see the password prompt, enter ``systemcore`` and press enter. You should now be logged in to the Systemcore.

If you see a prompt about host authenticity when connecting for the first time, type ``yes`` and press enter to continue.
