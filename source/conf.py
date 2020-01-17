# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# http://www.sphinx-doc.org/en/master/config

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))


# -- Project information -----------------------------------------------------

project = 'FIRST Robotics Competition'
copyright = '2020, FIRST'
author = 'WPILib'
version = '2020'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx_tabs.tabs',
    'sphinx.ext.imgmath',
    'sphinx.ext.todo',
    'sphinx.ext.graphviz',
    'sphinx.ext.autosectionlabel',
    'sphinxcontrib.ghcontributors',
    'sphinxcontrib.remoteliteralinclude',
    'notfound.extension'
]

# TODO Directives omit a warning
todo_emit_warnings = False

# TODO Directives are not shown in output
todo_include_todos = False

# Disable following anchors in URLS for linkcheck
linkcheck_anchors = False

# Linkcheck Exclusions
linkcheck_ignore = [r'.*kauailabs.com.*', r'.*frcvision.local.*']

# Sets linkcheck timeout in seconds
linkcheck_timeout = 5
linkcheck_retries = 3

# Autosection labels prefix document path and filename
autosectionlabel_prefix_document = True

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['.png', '.jpg', 'docs/beta/*']

# Specify the master doc file, AKA our homepage
master_doc = "index"


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = "sphinx_rtd_theme"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

# Sidebar logo
html_logo = "assets/wpilibDocsLogo.png"

# URL favicon
html_favicon = "assets/FIRSTicon_RGB_withTM.ico"

html_theme_options = {
	'collapse_navigation': True,
	'sticky_navigation': False,
	'titles_only': True
}

user_options = [
        ('warning-is-error', True),
]

def setup(app):
  app.add_stylesheet('css/frc-rtd.css')

# -- Options for latex generation --------------------------------------------

latex_engine = 'xelatex'

# Disable xindy support
# See: https://github.com/readthedocs/readthedocs.org/issues/5476
latex_use_xindy = False

latex_elements = {
    'fontpkg': r'''
	\setmainfont{DejaVu Serif}
	\setsansfont{DejaVu Sans}
	\setmonofont{DejaVu Sans Mono}''',
    'preamble': r'''
	\usepackage[titles]{tocloft}
	\cftsetpnumwidth {1.25cm}\cftsetrmarg{1.5cm}
	\setlength{\cftchapnumwidth}{0.75cm}
	\setlength{\cftsecindent}{\cftchapnumwidth}
	\setlength{\cftsecnumwidth}{1.25cm}
	''',
    'fncychap': r'\usepackage[Bjornstrup]{fncychap}',
    'printindex': r'\footnotesize\raggedright\printindex',
}

suppress_warnings = ['epub.unknown_project_files']

sphinx_tabs_valid_builders = ['epub', 'linkcheck']
