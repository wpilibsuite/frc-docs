# Build Instructions

This document contains information on how to build the HTML, PDF, and EPUB versions of the frc-docs site. frc-docs uses Sphinx as the documentation generator. This document also assumes you have basic knowledge of [Git](https://git-scm.com/) and console commands.

## Prerequisites

Ensure that [Git](https://git-scm.com/) is installed and that the frc-docs repository is cloned by using ``git clone https://github.com/wpilibsuite/frc-docs.git``.

You will need to install [uv](https://docs.astral.sh/uv/), a Python package and project manager. Follow the [installation instructions](https://docs.astral.sh/uv/getting-started/installation/) for your operating system.

### Text Editors / IDE

For development, we recommend that you use VS Code along with the [reStructuredText extension](https://marketplace.visualstudio.com/items?itemName=lextudio.restructuredtext). However, any text editor will work.

By default, the reStructuredText extension enables linting with all doc8 features enabled. As frc-docs does not follow the line length lint, add the following to your VS Code ``settings.json`` to disable line length linting.

```json
"restructuredtext.linter.doc8.extraArgs": [
   "--ignore D001"
]
```

### Windows

.. note:: MikTeX and ``rsvg-convert`` are not required for building HTML, they are only required for Windows PDF builds.

- [Python 3.9](https://www.python.org/downloads/)
- [Perl](https://strawberryperl.com/)
- [MiKTeX](https://miktex.org/download) (Only needed for PDF builds)
- [rsvg-convert](https://community.chocolatey.org/packages/rsvg-convert) (Only needed for PDF builds)

Ensure that Python is in your Path by selecting the **Add Python to PATH** toggle when installing Python.

.. image:: images/python-path.png
    :alt: Showing where to click the box to add Python to PATH.

Install the missing MikTex packages by navigating to the frc-docs directory, then running the following command from Powershell: ``miktex --verbose packages require --package-id-file miktex-packages.txt``

### Linux (Ubuntu)

```console
$ sudo apt update
$ sudo apt install python3
$ sudo apt install -y texlive-latex-recommended texlive-fonts-recommended texlive-latex-extra latexmk texlive-lang-greek texlive-luatex texlive-xetex texlive-fonts-extra dvipng librsvg2-bin
```

## Building

Open up a Powershell Window or terminal and navigate to the frc-docs directory that was cloned.

```console
PS > cd "%USERPROFILE%\Documents"
PS C:\Users\Example\Documents> git clone https://github.com/wpilibsuite/frc-docs.git
Cloning into 'frc-docs'...
remote: Enumerating objects: 217, done.
remote: Counting objects: 100% (217/217), done.
remote: Compressing objects: 100% (196/196), done.
remote: Total 2587 (delta 50), reused 68 (delta 21), pack-reused 2370
Receiving objects: 100% (2587/2587), 42.68MiB | 20.32 MiB/s, done.
Receiving deltas: 100% (1138/1138), done/
PS C:\Users\Example\Documents> cd frc-docs
PS C:\Users\Example\Documents\frc-docs>
```

### Lint Check

.. note:: Lint Check will not check line endings on Windows due to a bug with line endings. See [this issue](https://bugs.launchpad.net/doc8/+bug/1756704) for more information.

It's encouraged to check any changes you make with the linter. This **will** fail CI if it does not pass. To check, run ``uv run .\make.bat lint``

### Link Check

The link checker makes sure that all links in the documentation resolve. This **will** fail CI if it does not pass. To check, run ``uv run .\make.bat linkcheck``

### Image Size Check

Please run ``uv run .\make.bat sizecheck`` to verify that all images are below 500KB. This check **will** fail CI if it fails. Exclusions are allowed on a case by case basis and are added to the ``IMAGE_SIZE_EXCLUSIONS`` list in the configuration file.

### Redirect Check

Files that have been moved or renamed must have their new location (or replaced with 404) in the ``redirects.txt`` file in ``source``.

The redirect writer will automatically add renamed/moved files to the redirects file. Run ``uv run .\make.bat rediraffewritediff``.

.. note:: if a file is both moved and substantially changed, the redirect writer will not add it to the ``redirects.txt`` file, and the ``redirects.txt`` file will need to be manually updated.

The redirect checker makes sure that there are valid redirects for all files. This **will** fail CI if it does not pass. To check, run ``uv run .\make.bat rediraffecheckdiff`` to verify all files are redirected. Additionally, an HTML build may need to be ran to ensure that all files redirect properly.

### Building HTML

Type the command ``uv run .\make.bat html`` to generate HTML content. The content is located in the ``build/html`` directory at the root of the repository.

### Building PDF

.. warning:: Please note that PDF build on Windows may result in distorted images for SVG content. This is due to a lack of librsvg2-bin support on Windows.

Type the command ``uv run .\make.bat latexpdf`` to generate PDF content. The PDF is located in the ``build/latex`` directory at the root of the repository.

### Building EPUB

Type the command ``uv run .\make.bat epub`` to generate EPUB content. The EPUB is located in the ``build/epub`` directory at the root of the repository.

## Adding Python Third-Party libraries

.. important:: After modifying frc-docs dependencies in any way, ``requirements.txt`` must be regenerated by running ``uv export --frozen --no-dev --no-editable -o source/requirements.txt`` from the root of the repo.

### Adding a Dependency

Add the dependency to the ``dependencies`` array in ``pyproject.toml``. Make sure to specify an exact version. Then, run the following command: ``uv lock``.

### Updating a Top-Level Dependency

Update the dependency's version in the ``dependencies`` array in ``pyproject.toml``. Then, run the following command: ``uv lock``.

### Updating All Hidden Dependencies

Run the following command: ``uv lock --upgrade``.

### Updating a Specific Hidden Dependency

Run the following command: ``uv lock --upgrade-package <package>``.
