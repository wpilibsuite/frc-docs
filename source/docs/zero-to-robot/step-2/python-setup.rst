# Python Installation Guide

This guide is intended for Python teams. Java and C++ teams can skip to :doc:`wpilib-setup`.

## Prerequisites

You must install a supported version of Python on a supported operating system. Every year we upgrade RobotPy to the latest available version of Python. In 2025 we support Python 3.9/3.10/3.11/3.12/3.13, but only 3.13 is available for the roboRIO.

Supported Operating Systems and Architectures:
 * Windows 10 & 11, 64 bit only. 32 bit and Arm are not supported
 * macOS 13.3 or higher
 * Ubuntu 22.04 & 24.04, 64 bit. Other Linux distributions with glibc >= 2.35 may work, but are unsupported

On Windows and macOS, we recommend using the official Python installers distributed by python.org.

* [Python for Windows](https://www.python.org/downloads/windows/)
* [Python for macOS](https://www.python.org/downloads/mac-osx/)

## Install RobotPy

Once you have installed Python, you can use pip to install RobotPy on your development computer.

.. tab-set::

   .. tab-item:: Windows
      :sync: windows

      .. note:: If you previously installed a pre-2024 or 2024 beta version of RobotPy, you should first uninstall RobotPy via ``py -m pip uninstall robotpy`` before upgrading.

      .. warning:: On Windows, the [Visual Studio 2022 redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170#latest-supported-redistributable-version) package is required to be installed.

      Run the following command from cmd or Powershell to install the core RobotPy packages:

      ```sh
      py -3 -m pip install robotpy
      ```

      To upgrade, you can run this:

      ```sh
      py -3 -m pip install --upgrade robotpy
      ```

      If you don't have administrative rights on your computer, either use [virtualenv/virtualenvwrapper-win](https://docs.python-guide.org/en/latest/dev/virtualenvs/), or or you can install to the user site-packages directory:

      ```sh
      py -3 -m pip install --user robotpy
      ```

   .. tab-item:: macOS
      :sync: macos

      .. note:: If you previously installed a pre-2024 or 2024 beta version of RobotPy, you should first uninstall RobotPy via ``python3 -m pip uninstall robotpy`` before upgrading.

      On a macOS system that has pip installed, just run the following command from the Terminal application (may require admin rights):

      ```sh
      python3 -m pip install robotpy
      ```

      To upgrade, you can run this:

      ```sh
      python3 -m pip install --upgrade robotpy
      ```

      If you don't have administrative rights on your computer, either use `virtualenv/virtualenvwrapper <http://docs.python-guide.org/en/latest/dev/virtualenvs/>`_, or you can install to the user site-packages directory:

      ```sh
      python3 -m pip install --user robotpy
      ```

   .. tab-item:: Linux
      :sync: linux

      .. note:: If you previously installed a pre-2024 or 2024 beta version of RobotPy, you should first uninstall RobotPy via ``python3 -m pip uninstall robotpy`` before upgrading.

      RobotPy distributes manylinux binary wheels on PyPI. However, installing these requires a distro that has glibc 2.35 or newer, and an installer that implements :pep:`600`, such as pip 20.3 or newer. You can check your version of pip with the following command:

      ```sh
      python3 -m pip --version
      ```

      If you need to upgrade your version of pip, it is highly recommended to use a [virtual environment](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/).

      If you have a compatible version of pip, you can simply run:

      ```sh
      python3 -m pip install robotpy
      ```

      To upgrade, you can run this:

      ```sh
      python3 -m pip install --upgrade robotpy
      ```

      If you manage to install the packages and get the following error or something similar, your system is most likely not compatible with RobotPy::

         OSError: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version `GLIBCXX_3.4.22' not found (required by /usr/local/lib/python3.7/dist-packages/wpiutil/lib/libwpiutil.so)

   .. tab-item:: Linux ARM Coprocessor
      :sync: linux-arm

      We publish prebuilt wheels on artifactory, which can be downloaded by giving the ``--extra-index-url`` option to pip:

      ```sh
      python3 -m pip install --extra-index-url=https://wpilib.jfrog.io/artifactory/api/pypi/wpilib-python-release-2025/simple robotpy
      ```

      **source install**

      Alternatively, if you have a C++20 compiler installed, you may be able to use pip to install RobotPy from source.

      .. warning:: It may take a very long time to install!

      .. warning:: Mixing our pre-built wheels with source installs may cause runtime errors. This is due to internal ABI incompatibility between compiler versions.

         Our ARM wheels are built for Debian 12 (Bookworm) with GCC 12.

      If you need to build with a specific compiler version, you can specify them using the ``CC`` and ``CXX`` environment variables:

      ```sh
      export CC=gcc-12 CXX=g++-12
      ```

## Download RobotPy for roboRIO

After installing the ``robotpy`` project on your computer, there are a variety of commands available that can be ran from the command line via the ``robotpy`` module.

.. seealso:: :doc:`Documentation for robotpy subcommands </docs/software/python/subcommands/index>`

If you already have a RobotPy robot project, you can use that to download the pieces needed to run on the roboRIO. If you don't have a project, running this command in an empty directory will initialize a new robot project:

.. tab-set::

   .. tab-item:: Windows
      :sync: windows

      ```sh
      py -3 -m robotpy init
      ```

   .. tab-item:: macOS
      :sync: macos

      ```sh
      python3 -m robotpy init
      ```

   .. tab-item:: Linux
      :sync: linux

      ```sh
      python3 -m robotpy init
      ```

This will create a ``robot.py`` and ``pyproject.toml`` file. The ``robot.py`` file contains a skeleton structure to help you get started writing your robot code. The ``pyproject.toml`` file should be customized and details the requirements needed to run your robot code, among other things.

.. important:: The ``robotpy deploy`` command requires that you have written working robot code. The generated ``robot.py`` is just a starting point - you cannot deploy to the roboRIO until you have implemented your robot-specific code. See the :doc:`RobotPy Programming Guide </docs/software/python/index>` for information on writing robot code.

.. seealso:: The default ``pyproject.toml`` created for you only contains the version of RobotPy installed on your computer. If you want to enable vendor packages or install other python packages from PyPI, see our :doc:`pyproject.toml documentation </docs/software/python/pyproject_toml>`

Next run the ``robotpy sync`` subcommand, which will:

* Download Python compiled for roboRIO
* Download roboRIO compatible python packages as specified by your ``pyproject.toml``
* Install the packages specified by your ``pyproject.toml`` into your local environment

.. note:: If you aren't using a virtualenv and don't have administrative privileges, the ``robotpy sync`` command accepts a ``--user`` argument to install to the user-specific site-packages directory.

.. tab-set::

   .. tab-item:: Windows
      :sync: windows

      ```sh
      py -3 -m robotpy sync
      ```

   .. tab-item:: macOS
      :sync: macos

      ```sh
      python3 -m robotpy sync
      ```

   .. tab-item:: Linux
      :sync: linux

      ```sh
      python3 -m robotpy sync
      ```

When you deploy your code to the roboRIO, :doc:`the deploy subcommand </docs/software/python/subcommands/deploy>` will automatically install Python (if needed) and your robot project requirements on the roboRIO as part of the deploy process.
