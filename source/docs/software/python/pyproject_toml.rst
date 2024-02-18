pyproject.toml usage
====================

.. note:: RobotPy projects are not required to have a ``pyproject.toml``, but when you run ``robotpy sync`` one will automatically be created for you.

``pyproject.toml`` has become a standard way to store build and tooling configuration for Python projects. The ``[tool.XXX]`` section(s) of the `TOML <https://toml.io>`__ file is a place where tools can store their configuration information.

Currently RobotPy only stores deployment related information in ``pyproject.toml``, in the ``[tool.robotpy]`` section. Users can customize the other sections however they want, and ``robotpy`` will ignore them.

The ``pyproject.toml`` file looks something like this:

.. code-block:: toml

    #
    # Use this configuration file to control what RobotPy packages are installed
    # on your RoboRIO
    #

    [tool.robotpy]

    # Version of robotpy this project depends on
    robotpy_version = "2024.2.1.0"

    # Which extra RobotPy components should be installed
    # -> equivalent to `pip install robotpy[extra1, ...]
    robotpy_extras = [
        # "all"
        # "apriltag"
        # "commands2"
        # "cscore"
        # "navx"
        # "pathplannerlib"
        # "phoenix5"
        # "phoenix6"
        # "playingwithfusion"
        # "rev"
        # "romi"
        # "sim"
    ]

    # Other pip packages to install
    requires = []

Each of the following will instruct the deploy process to install packages to the roboRIO:

``robotpy_version`` is the version of the ``robotpy`` PyPI package that this robot code depends on.

``robotpy_extras`` defines extra RobotPy components that can be installed, as only the core RobotPy libraries are installed by default.

``requires`` is a list of strings, and each item is equivalent to a line of a `requirements.txt <https://pip.pypa.io/en/stable/reference/requirements-file-format/>`__ file. You can install any pure python packages on the roboRIO and they will likely work, but any packages that have binary dependencies must be cross-compiled for the roboRIO. For example, if you needed to use ``numpy`` in your robot code:

.. code-block:: toml

    [tool.robotpy]

    ...

    requires = ["numpy"]


The packages that can be installed are stored on the `WPILib Artifactory server <https://wpilib.jfrog.io/ui/native/wpilib-python-release-2024/>`__.
If you find that you need a package that isn't available on artifactory, consult the `roborio-wheels <https://github.com/robotpy/roborio-wheels>`_ repository.
