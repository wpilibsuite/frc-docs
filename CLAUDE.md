# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

frc-docs is the official documentation repository for the FIRST Robotics Competition Control System, built using Sphinx. The documentation is written primarily in reStructuredText (.rst) files with custom extensions, and supports multiple output formats (HTML and PDF) as well as multiple language translations.

**Published URLs:**
- https://docs.wpilib.org/en/latest/ (preferred)
- https://frcdocs.wpi.edu/en/latest/
- https://frc-docs.readthedocs.io/en/latest/

## Development Setup

This project uses Poetry for Python dependency management.

```bash
# Install dependencies
pip install -r source/requirements.txt

# Or use Poetry
poetry install
```

## Common Build Commands

### Building Documentation

```bash
# Build HTML documentation
make html

# Build PDF documentation
make latexpdf

# Build for a specific language (e.g., Spanish)
sphinx-build -D language=es -b html source build/html
```

**Build output location:** `build/` directory

### Quality Checks

```bash
# Run all linting checks
make lint

# Check image sizes (max 500KB)
make sizecheck

# Check Python code formatting
black --check .

# Format Python code
black .

# Check redirects
make rediraffecheckdiff
```

## Architecture

### Directory Structure

- **source/**: Main documentation source
  - **docs/**: All documentation content organized by topic
    - **software/**: Programming guides, APIs, examples
    - **hardware/**: Hardware setup and wiring
    - **controls-overviews/**: Control system overviews
    - **zero-to-robot/**: Getting started guides
    - **yearly-overview/**: Season-specific changes
  - **_extensions/**: Custom Sphinx extensions
  - **_static/**: Static assets (CSS, JS)
  - **_templates/**: Sphinx templates
  - **conf.py**: Sphinx configuration
- **scripts/**: Utility scripts for linting and validation
- **build/**: Generated documentation (not in git)

### Custom Sphinx Extensions

Located in `source/_extensions/`:

1. **redown.py**: Converts Markdown-like syntax to reStructuredText at build time
   - Supports ``` code blocks → .. code-block::
   - Supports # headings → RST underlines
   - Supports [text](link) → RST link syntax
   - Supports $math$ → :math: roles
   - Preserves existing RST code blocks

2. **localization.py**: Manages multi-language support (en, es, fr, he, pt, tr, zh_CN)

3. **controls_js_sim/**: JavaScript control system simulations

4. **wpilib_release.py**: WPILib version management

5. **rtd_patch.py**: ReadTheDocs-specific patches

6. **default_latex_image_settings.py**: PDF image handling

### Build Configuration

**Source:** `source/conf.py`

Key settings:
- Theme: Furo
- Sphinx version: 7.4.7
- Python requirement: >=3.9, <3.13
- Current documentation version: 2027 (for SystemCore Alpha Test)
- Main/stable branch: main

### CI/CD Workflow

**GitHub Actions jobs** (see `.github/workflows/CI.yml`):
1. **build-html**: Builds HTML documentation
2. **build-pdf**: Builds PDF with LaTeX
3. **build-html-translation**: Tests translation builds
4. **check-linting**: Runs doc8 linter with redown support
5. **check-image-size**: Validates image file sizes (max 500KB)
6. **check-spelling**: US English spell checking
7. **check-redirects**: Validates redirect rules
8. **check-formatting**: Black formatting checks

### Documentation Content Guidelines

1. **File Format**: Documentation is written in reStructuredText (.rst)
   - However, some Markdown syntax is supported via the redown extension
   - Code blocks can use ``` syntax or .. code-block:: directive

2. **Images**: Keep image sizes under 500KB (exclusions defined in conf.py:IMAGE_SIZE_EXCLUSIONS)

3. **Redirects**: Managed in `source/redirects.txt` (append-only, never modify existing lines)

4. **Python Code**: Examples and utilities should follow Black formatting

5. **Translations**: Managed in separate frc-docs-translations repository

## Running Individual Tests

```bash
# Lint a specific file or directory
python3 scripts/doc8_redown.py --ignore D001 source/docs/software/

# Check size of specific images
python3 -m scripts.imagesizechecker source/docs/hardware/ 500 --exclude-file source/conf.py

# Build only changed files (for faster iteration)
make BUILDER_ARGS="source/path/to/file.rst" html
```

## Important Notes

- **Warnings as Errors**: Sphinx is configured with `-W` (treat warnings as errors) for CI builds
- **LaTeX Requirements**: PDF builds require full TeXLive installation
- **Git Depth**: CI fetches full history (fetch-depth: 0) for git-based extensions
- **Python Version**: Use Python 3.10 for consistency with CI (3.9-3.12 supported)
- **Line Wrapping**: Doc8 linter ignores D001 (line length) warnings
- **GitHub Token**: Set GITHUB_TOKEN env var to avoid API rate limits with extensions

## Key Dependencies

- sphinx 7.4.7
- furo (theme)
- sphinx_design (grid layouts)
- sphinx-tabs (tabbed content)
- sphinxext-rediraffe (redirect management)
- sphinxext-remoteliteralinclude (remote code inclusion)
- frccontrol (FRC-specific control theory)
- numpy, scipy (for control system examples)
- Make sure all documentation adheres to the style guide