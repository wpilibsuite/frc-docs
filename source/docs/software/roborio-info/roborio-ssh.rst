.. include:: <isonum.txt>

# roboRIO User Accounts and SSH

.. note:: This document contains advanced topics not required for typical FRC\ |reg| programming

The roboRIO image contains a number of accounts, this article will highlight the two used  for FRC and provide some detail about their purpose. It will also describe how to connect  to the roboRIO over SSH.

## roboRIO User Accounts
The roboRIO image contains a number of user accounts, but there are two of primary interest for FRC.

### admin
The "admin" account has root access to the system and can be used to manipulate OS files or settings. Teams should take caution when using this account as it allows for the modification of settings and files that may corrupt the operating system of the roboRIO. The credentials for this account are:

``Username: admin``

``Password:``

.. note:: The password is intentionally blank.

### lvuser
The "lvuser" account is the account used to run user code for all three languages. The credentials for this account should not be changed. Teams may wish to use this account (via ssh or sftp) when working with the roboRIO to ensure that any files or settings changes are being made on the same account as their code will run under.

.. danger:: Changing the default ssh passwords for either "lvuser" or "admin" will prevent C++, Java, and Python teams from uploading code.

## SSH
SSH (Secure SHell) is a protocol used for secure data communication. When broadly referred to regarding a Linux system (such as the one running on the roboRIO) it generally refers to accessing the command line console using the SSH protocol. This can be used to execute commands on the remote system. OpenSSH is included by default on Windows, macOS, and Linux.

### Connect via SSH

To connect to the roboRIO, open a terminal or command prompt and run:

.. code-block:: shell

   ssh admin@roboRIO-TEAM-frc.local

Replace ``TEAM`` with your team number (e.g., ``ssh admin@roboRIO-40-frc.local`` for team 40).

If you are connected over USB you can use ``172.22.11.2`` as the hostname:

.. code-block:: shell

   ssh admin@172.22.11.2

If your roboRIO is set to a static IP you can use that IP as the hostname if connected over Ethernet/wireless.

### Log In

When you see the password prompt, press enter (the password for both accounts is blank). You can also connect as the ``lvuser`` account by replacing ``admin`` with ``lvuser`` in the commands above.

If you see a prompt about host authenticity when connecting for the first time, type ``yes`` and press enter to continue.
