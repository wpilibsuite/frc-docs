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

project = 'FIRST Robotics Documentation'
copyright = '2019, FIRST Community'
author = 'FIRST Community'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx_tabs.tabs',
    'sphinx.ext.imgmath',
    'sphinx.ext.todo',
    'sphinx.ext.graphviz',
    'sphinx.ext.autosectionlabel'
]

# TODO Directives omit a warning
todo_emit_warnings = True

# TODO Directives are not shown in output
todo_include_todos = False

# Autosection labels prefix document path and filename
autosectionlabel_prefix_document = True

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['.png', '.jpg']

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
html_static_path = []

html_theme_options = {
	'collapse_navigation': False,
	'sticky_navigation': False
}

user_options = [
        ('warning-is-error', True),
]
