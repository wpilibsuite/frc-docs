.. include:: <isonum.txt>

# Systemcore User Accounts and SSH

.. note:: This document contains advanced topics not required for typical FRC\ |reg| programming

The Systemcore image contains a number of accounts, this article will highlight the main on used for FRC and provide some detail about its purpose. It will also describe how to connect to the Systemcore over SSH.

### systemcore
The "systemcore" account has root access to the system and can be used to manipulate OS files or settings. Teams should take caution when using this account as it allows for the modification of settings and files that may corrupt the operating system of the Systemcore. The credentials for this account are:

``Username: systemcore``

``Password: systemcore``

.. danger:: Changing the default ssh passwords for the "systemcore" account will prevent C++, Java, and Python teams from uploading code.

## SSH
SSH (Secure SHell) is a protocol used for secure data communication. When broadly referred to regarding a Linux system (such as the one running on the Systemcore) it generally refers to accessing the command line console using the SSH protocol. This can be used to execute commands on the remote system. OpenSSH is included by default on Windows, macOS, and Linux.

### Connect via SSH

To connect to the Systemcore, open a terminal or command prompt and run:

.. code-block:: shell

   ssh systemcore@robot.local

If you are connected over USB you can use ``172.22.11.2`` as the hostname:

.. code-block:: shell

   ssh systemcore@172.22.11.2

If your Systemcore is set to a static IP you can use that IP as the hostname if connected over Ethernet/wireless.

### Log In

When you see the password prompt, type ``systemcore``, then enter. You will not be able to view the password as you are entering it.

If you see a prompt about host authenticity when connecting for the first time, type ``yes`` and press enter to continue.
