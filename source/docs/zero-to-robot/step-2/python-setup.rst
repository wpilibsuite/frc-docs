Python Installation Guide
=========================

This guide is intended for Python teams. LabVIEW teams can skip to :doc:`labview-setup` and Java/C++ teams can skip to :doc:`wpilib-setup`.

From now on, the Python version will be referred to as :guilabel:`RobotPy`

Prerequisites
-------------

Supported Operating Systems and Architectures:
 * Windows 10 or higher, 32 bit or 64 bit. Arm version also supported
 * Ubuntu 22.04 or higher, 64 bit. Fedora 36+ and Arch Linux are also known to work
 * macOS 11 or higher

Python 3.7 or higher must be installed
 * `Python for Windows <https://www.python.org/downloads/windows/>`__
 * `Python for macOS <https://www.python.org/downloads/macos/>`__
 * Python should already be installed for Linux users

Updating the RobotPy version will overwrite the previously installed one. Consider using `Virtualenv <https://virtualenv.pypa.io/en/latest/index.html>`__ if you want to keep distinct versions.

Downloading
-----------

.. tabs::

   .. group-tab:: Windows 10+

      .. warning:: On Windows, the `Visual Studio 2019 redistributable package <https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads>`__ is required to be installed.

      Run the following command from cmd or Powershell to install RobotPy with all its optional and vendor packages:

      .. code-block:: sh

         py -3 -m pip install robotpy[all]

      To upgrade, you can run this:

      .. code-block:: sh

         py -3 -m pip install --upgrade robotpy[all]

      If you don't have administrative rights on your computer, either use `virtualenv/virtualenvwrapper-win <http://docs.python-guide.org/en/latest/dev/virtualenvs/>`__, or you can install to the user site-packages directory:

      .. code-block:: sh

         py -3 -m pip install --user robotpy

   .. group-tab:: Linux/macOS

      On a Linux or macOS system that has pip installed, just run the following command from the Terminal application (may require admin rights):

      .. code-block:: sh

         pip3 install robotpy[all]

      This will install RobotPy with all its optional and vendor packages.

      To upgrade, you can run this:

      .. code-block:: sh

         pip3 install --upgrade robotpy[all]

      If you don't have administrative rights on your computer, either use `virtualenv/virtualenvwrapper <http://docs.python-guide.org/en/latest/dev/virtualenvs/>`__, or you can install to the user site-packages directory:

      .. code-block:: sh

         pip3 install --user robotpy


Visual Studio Code Setup
------------------------

The preferred editor is Visual Studio Code, due to the ease of use and some useful Python development tools, such as IntelliSense and Linting.
Download and install the version for your OS `here <https://code.visualstudio.com/download>`__.

Once installed, access the Extension menu on the left pane. Search for Python and install the official extension from Microsoft. You should restart VS Code once the installation is done.

From this point, all should be set to create your robot code! You can also `start from a template <https://github.com/robotpy/examples>`__.


Troubleshooting
---------------

In case the installer fails, please open an issue on the robotpy-wpilib repository. A link is available `here <https://github.com/robotpy/robotpy-wpilib/issues>`__. Include the output of the terminal for the failing step.
