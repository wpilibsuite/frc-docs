
RobotPy installation on roboRIO
===============================

.. note:: Only needed if you plan to program your robot using Python.

Python libraries are not installed on the roboRIO by default. Each time you format the robotRIO or that you install/update a Python module with :guilabel:`pip install robotpy...`, make sure to run these steps again.

If you install RobotPy on your roboRIO, you are still able to deploy C++ and Java programs without any conflicts.

.. warning:: This guide assumes that your roboRIO has the current legal roboRIO image installed. If you haven't done this yet, see the imaging instructions for the :ref:`roboRIO 1 <docs/zero-to-robot/step-3/imaging-your-roborio:Imaging your roboRIO 1>` or :ref:`roboRIO 2 <docs/zero-to-robot/step-3/roborio2-imaging:Imaging your roboRIO 2>`. To image the roboRIO for RobotPy, you only need to have the latest FRC Game Tools installed.

RobotPy is truly cross platform, and can be installed from Windows, most Linux distributions, and from Mac macOS also. To install/use the installer, you must have Python 3.8+ installed. You should install the installer via pip (requires internet access) by installing the core RobotPy components (see the :ref:`WPILib Installation Guide <docs/zero-to-robot/step-2/wpilib-setup:Additional Steps for Python Installation>` for more details).

Install process
---------------

The roboRIO robot controller is typically not connected to a network that has internet access, so there are two stages to installing RobotPy.

* First, you need to connect your computer to the internet and use the installer to download the packages to your computer.
* Second, disconnect from the internet and connect to the network that the RoboRIO is on.

The details for each stage will be discussed below. You can run the installer via Python. This is slightly different on Windows/macOS/Linux.

Install Python on a roboRIO
---------------------------

.. note:: This step only needs to be done once.

When your computer is connected to Internet, run this next step.

.. tabs::

  .. group-tab:: Windows

      .. code-block:: sh

        py -3 -m robotpy_installer download-python

  .. group-tab:: Linux/macOS

      .. code-block:: sh

        robotpy-installer download-python

Once everything has downloaded, you can switch to your Robot's network, and use the following commands to install.

.. tabs::

  .. group-tab:: Windows

      .. code-block:: sh

        py -3 -m robotpy_installer install-python

  .. group-tab:: Linux/macOS

      .. code-block:: sh

        robotpy-installer install-python

It will ask you a few questions, and copy the right files over to your robot and set things up for you.

Installing RobotPy on a roboRIO
-------------------------------

The RobotPy installer takes care of downloading and installing the Python modules compatible for the roboRIO. The :guilabel:`download` and :guilabel:`install` commands behave similar to the pip command, including allowing use of a 'requirements.txt' file if desired.

As mentioned above, installation needs to be done in two steps (download then install). Once you are connected to the internet:

.. tabs::

  .. group-tab:: Windows

      .. code-block:: sh

        py -3 -m robotpy_installer download robotpy[all]

  .. group-tab:: Linux/macOS

      .. code-block:: sh

        robotpy-installer download robotpy[all]

Once everything has downloaded, you can switch to your Robot's network, and use the following commands to install.

.. tabs::

  .. group-tab:: Windows

      .. code-block:: sh

        py -3 -m robotpy_installer install robotpy[all]

  .. group-tab:: Linux/macOS

      .. code-block:: sh

        robotpy-installer install robotpy[all]

.. note::

  The robotpy installer uses pip to download and install packages, so you can replace robotpy above with the name of a pure python package as published on PyPI.

  If you need Python packages that require compilation, the RobotPy project distributes some commonly used packages. See the roborio-wheels project for more details.
