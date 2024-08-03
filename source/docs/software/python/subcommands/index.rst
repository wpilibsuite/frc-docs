RobotPy subcommands
===================

When you install RobotPy in your Python installation, it installs a package called ``robotpy-cli``, which provides a ``robotpy`` command that can be used to perform tasks related to your robot and related code.

If you execute the command from the command line, it will show the various subcommands that are available:

.. tab-set::

   .. tab-item:: Windows
      :sync: windows

      .. code-block:: sh

         py -3 -m robotpy

   .. tab-item:: macOS
      :sync: macos

      .. code-block:: sh

         python3 -m robotpy

   .. tab-item:: Linux
      :sync: linux

      .. code-block:: sh

         python3 -m robotpy

.. note:: If you don't see a list of commands but either see a RobotPy logo or an error saying ``No module named robotpy.__main__; 'robotpy' is a package and cannot be directly executed``, you should uninstall the ``robotpy`` module and then reinstall it via pip.

          This only affects users who upgraded from pre-2024 or the 2024 beta.

You can pass the ``--help`` argument to see more information about the subcommand. For example, to see help for the ``sim`` command you can do the following:

.. tab-set::

   .. tab-item:: Windows
      :sync: windows

      .. code-block:: sh

         py -3 -m robotpy sim --help

   .. tab-item:: macOS
      :sync: macos

      .. code-block:: sh

         python3 -m robotpy sim --help

   .. tab-item:: Linux
      :sync: linux

      .. code-block:: sh

         python3 -m robotpy sim --help

This page has more detailed documentation for some of the subcommands:

.. toctree::
   :maxdepth: 2
   :titlesonly:

   deploy
