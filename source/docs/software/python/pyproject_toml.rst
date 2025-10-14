# pyproject.toml usage

.. note:: RobotPy projects are not required to have a ``pyproject.toml``, but when you run ``robotpy sync`` one will automatically be created for you.

``pyproject.toml`` has become a standard way to store build and tooling configuration for Python projects. The ``[tool.XXX]`` section(s) of the [TOML](https://toml.io) file is a place where tools can store their configuration information.

Currently RobotPy only stores deployment related information in ``pyproject.toml``, in the ``[tool.robotpy]`` section. Users can customize the other sections however they want, and ``robotpy`` will ignore them.

The ``pyproject.toml`` file looks something like this:

```toml
#
# Use this configuration file to control what RobotPy packages are installed
# on your RoboRIO
#
[tool.robotpy]
# Version of robotpy this project depends on
robotpy_version = "2024.2.1.0"
# Which core WPILib components should be installed
# -> equivalent to `pip install robotpy[extra1, ...]
components = [
    # "all"
    # "apriltag"
    # "commands2"
    # "cscore"
    # "romi"
    # "sim"
    # "xrp"
]
# Other pip packages to install (including vendor packages)
requires = [
    # Vendor packages (examples):
    # "robotpy-navx"
    # "robotpy-pathplannerlib"
    # "robotpy-ctre"  # Phoenix 5
    # "phoenix6"
    # "robotpy-playingwithfusion"
    # "robotpy-rev"
]
```

Each of the following will instruct the deploy process to install packages to the roboRIO:

``robotpy_version`` is the version of the ``robotpy`` PyPI package that this robot code depends on.

``components`` defines which optional core WPILib packages should be installed (equivalent to ``pip install robotpy[component1, ...]``). Only core WPILib packages can be specified here; vendor packages must be listed in ``requires``.

``requires`` is a list of strings, and each item is equivalent to a line of a [requirements.txt](https://pip.pypa.io/en/stable/reference/requirements-file-format/) file. You can install any pure python packages on the roboRIO and they will likely work, but any packages that have binary dependencies must be cross-compiled for the roboRIO. For example, if you needed to use ``numpy`` in your robot code:

```toml
[tool.robotpy]
...
requires = ["numpy"]
```

The packages that can be installed are stored on the [WPILib Artifactory server](https://wpilib.jfrog.io/ui/native/wpilib-python-release-2025/).
If you find that you need a package that isn't available on artifactory, consult the [roborio-wheels](https://github.com/robotpy/roborio-wheels) repository.
