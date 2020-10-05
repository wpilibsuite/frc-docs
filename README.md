![Documentation Status](https://readthedocs.org/projects/frc-docs/badge/?version=latest)
![CI](https://github.com/wpilibsuite/frc-docs/workflows/CI/badge.svg)
![Link Check](https://github.com/wpilibsuite/frc-docs/workflows/Link%20Check/badge.svg)

# frc-docs
Welcome to frc-docs! This repository contains the various source articles for the frc-docs website. frc-docs is licensed under Creative Commons, with assets such as the FIRST logo under trademark and copyright of [FIRST](https://www.firstinspires.org/).

The website is available under the following domains, it is preferred to use the WPILib domain URL:
- https://docs.wpilib.org/en/latest/
- https://frcdocs.wpi.edu/en/latest/
- https://frc-docs.readthedocs.io/en/latest/

# WPILib Mission
The WPILib Mission is to enable FIRST Robotics teams to focus on writing game-specific software rather than focusing on hardware details - "raise the floor, don't lower the ceiling". We work to enable teams with limited programming knowledge and/or mentor experience to be as successful as possible, while not hampering the abilities of teams with more advanced programming capabilities. We support Kit of Parts control system components directly in the library. We also strive to keep parity between major features of each language (Java, C++, and NI's LabVIEW), so that teams aren't at a disadvantage for choosing a specific programming language. WPILib is an open source project, licensed under the BSD 3-clause license. You can find a copy of the license [here](https://github.com/wpilibsuite/allwpilib/blob/master/LICENSE.txt).

# Building frc-docs
frc-docs uses the Sphinx documentation generator, and documentation is written in [reStructuredText](http://docutils.sourceforge.net/rst.html).

Ensure the repository is cloned with ``git clone --depth 1 https://github.com/wpilibsuite/frc-docs.git``.

## Requirements
- **Windows**
  - [Python 3.6 or greater](https://www.python.org/downloads/)
  - [MiKTeX](https://miktex.org/download)
  - [Perl](http://strawberryperl.com/)

- **Linux (Ubuntu)**
  - ``sudo apt-get install -y python3 python3-pip``
  - ``sudo apt-get install -y texlive-latex-recommended texlive-fonts-recommended texlive-latex-extra latexmk texlive-lang-greek texlive-luatex texlive-xetex texlive-fonts-extra dvipng librsvg2-bin``

Ensure the Python requirements are installed via running ``python3 -m pip install -r source/requirements.txt``

**Note:** Windows users who are building PDF or EPUB versions of the docs *must* run ``mpm --verbose --require=@miktex-packages.txt`` to properly install all of the required MiKTeX packages.

## Building

### Lint Check

``.\make lint`` or ``make lint``

**Note**: Due to a bug with the linter on Windows machines, this command is currently only usable on Linux systems.

### Image Size Check

``.\make sizecheck`` or ``make sizecheck``

This checks all images are under 500KB

### Redirects Check

Files that have been moved or renamed must have their new location (or replaced with 404) in the ``redirects.txt`` file in ``source``. To verify that there are no invalid redirects. Run:

``.\make rediraffecheckdiff`` or ``make rediraffecheckdiff``

Additionally, an HTML build may need to be ran to verify that all redirects build properly.

### Building HTML

``.\make html`` or ``make html``

### Building PDF

``.\make latexpdf`` or ``make latexpdf``

**Note**: Run the ``scripts/install-rsvg-convert.ps1`` script in powershell to ensure ``rsvg-convert`` is installed.

### Building EPUB

``.\make epub`` or ``make epub``

## Additional Note

A web version of these instructions is available at the [frc-docs website](https://docs.wpilib.org/en/latest/docs/contributing/frc-docs/build-instructions.html).
