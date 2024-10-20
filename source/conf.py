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

from pathlib import Path
import sys
import os

sys.path.append(os.path.abspath("."))
sys.path.append(os.path.abspath("./frc-docs/source"))

# -- Project information -----------------------------------------------------

project = "FIRST Robotics Competition"
copyright = "2024, FIRST and other WPILib Contributors. This work is licensed under a Creative Commons Attribution 4.0 International License"
author = "WPILib"
version = "2024"


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    "sphinx_design",
    "sphinx.ext.mathjax",
    "sphinx.ext.todo",
    "sphinx.ext.autosectionlabel",
    "sphinx.ext.intersphinx",
    "sphinxcontrib.rsvgconverter",
    "sphinxcontrib.video",
    "sphinxext.delta",
    "sphinxext.opengraph",
    "sphinxext.photofinish",
    "sphinxext.rediraffe",
    "sphinxext.remoteliteralinclude",
    "sphinxext.toptranslators",
    "sphinxext.mimictoc",
    "sphinxext.presentations",
    "hoverxref.extension",
    "notfound.extension",
    "versionwarning.extension",
    "sphinx.ext.viewcode",
    "sphinx-prompt",
    "sphinx_toolbox.collapse",
    "sphinx_copybutton",
]

local_extensions = [
    "_extensions.post_process",
    "_extensions.rtd_patch",
    "_extensions.localization",
    "_extensions.controls_js_sim",
    "_extensions.wpilib_release",
    "_extensions.default_latex_image_settings",
    "_extensions.redown",
]

extensions += local_extensions

versionwarning_messages = {
    "latest": """
        The documentation you are currently viewing is for upcoming changes to WPILib.
        Please see the <a href="https://docs.wpilib.org" id="versionwarning_href">stable</a> version for the current release of WPILib.
        <script>
            document.getElementById("versionwarning_href").setAttribute("href", location.href.replace("/latest/", "/stable/"))
        </script>
        """
}


versionwarning_admonition_type = "warning"
versionwarning_banner_title = "Warning!"
versionwarning_body_selector = 'div[class="document"]'

# List of languages that frc-docs supports
localization_languages = [
    "en",
    "es",
    "fr",
    "he",
    "pt",
    "tr",
    "zh_CN",
]

# Redirect branch
rediraffe_branch = "origin/main"

# File containing redirects
rediraffe_redirects = "redirects.txt"

# Required accuracy for redirect writer
rediraffe_auto_redirect_perc = 80

# Configure OpenGraph support
ogp_site_url = "https://docs.wpilib.org/en/stable/"
ogp_site_name = "FIRST Robotics Competition Documentation"
ogp_image = "https://raw.githubusercontent.com/wpilibsuite/branding/main/export/png/wpilib-icon-256.png"

# Configure photofinish ci mode
photofinish_ci_only = True

# Enables ChiefDelphi support
ogp_custom_meta_tags = [
    '<meta property="og:ignore_canonical" content="true" />',
    '<meta name="theme-color" content="#003974" />',
    '<meta name="google-site-verification" content="xcmdxM0KzMYiAOeJzyF_l2Tn3AHGzPICs9_vX6q2nwM" />',
]

# Set location of pages to be indexed by delta
delta_doc_path = "source"

# Enable hover content on glossary term
hoverxref_roles = ["term"]
hoverxref_role_types = {"term": "tooltip"}

# TODO Directives omit a warning
todo_emit_warnings = False

# TODO Directives are not shown in output
todo_include_todos = False

# Disable following anchors in URLS for linkcheck
linkcheck_anchors = True

# Linkcheck Exclusions
linkcheck_ignore = [
    #    r".*kauailabs.com.*",
    r".*wpilibpi.local.*",
    #    r".*andymark.com.*",
    #    r".*ti.com/lit/an/spma033a/spma033a.pdf.*",
    r".*java.com.*",
    r".*playingwithfusion.com/contactus.php.*",
    #    r".*vexrobotics.com/docs/.*",
    r".*forums.firstinspires.org.*",
    r".*digikey.com.*",
    r".*chiefdelphi.com.*",
    r".*raspberrypi.com.*",
    r".*stackoverflow.com.*",
    r".*allaboutcircuits.com.*",
    r".*knowledge.ni.com.*",
]

linkcheck_anchors_ignore_for_url = [
    r".*github.com.*",
    r".*ni.com/en/support/downloads/drivers/download.frc-game-tools.html.*",
]

# Sets linkcheck timeout in seconds
linkcheck_timeout = 30
linkcheck_retries = 3
linkcheck_workers = 1

# Specify a standard user agent, as Sphinx default is blocked on some sites
user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"

# Autosection labels prefix document path and filename
autosectionlabel_prefix_document = True

# Add any paths that contain templates here, relative to this directory.
templates_path = ["_templates"]

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = [
    "docs/yearly-overview/2020-Game-Data.rst",
]

# Specify the master doc file, AKA our homepage
master_doc = "index"

# Specify files to ignore during SizeCheck
IMAGE_SIZE_EXCLUSIONS = [
    "docs/networking/networking-introduction/diagrams/mixing-static-dynamic.drawio.svg",
    "docs/software/vision-processing/wpilibpi/diagrams/vision-code-on-a-coprocessor.drawio.svg",
    "docs/software/vision-processing/introduction/diagrams/vision-code-on-a-coprocessor.drawio.svg",
    "docs/controls-overviews/images/frc-control-system-layout.svg",
    "docs/controls-overviews/images/frc-control-system-layout-rev.svg",
]

# Required to display LaTeX in hover content
hoverxref_mathjax = True

# Use MathJax3 for better page loading times
mathjax_path = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = "sphinx_rtd_theme"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ["_static"]

# Sidebar logo
html_logo = "assets/wpilibDocsLogo.png"

# URL favicon
html_favicon = "assets/FIRSTicon_RGB_withTM.ico"

# Specify canonical root
# This tells search engines that this domain is preferred
html_baseurl = "https://docs.wpilib.org/en/stable/"

html_theme_options = {
    "collapse_navigation": False,
    "sticky_navigation": False,
    "titles_only": True,
    # "flyout_display": "attached",
}

user_options = [
    ("warning-is-error", True),
]


def setup(app):
    app.add_css_file("css/frc-rtd.css")

    # Local Api Docs support
    app.add_js_file("js/api-docs-redirect.js")

    # Right-to-left support
    is_rtl = app.config.language in rtl_locale
    app.config.hoverxref_tooltip_side = "left" if is_rtl else "right"
    if is_rtl:
        app.add_css_file("css/frc-rtl.css")

    # Fix rtd version/language menu on iOS
    app.add_js_file("js/fix-rtd-menu-ios.js")

    # Launch external links in a new tab/window
    app.add_js_file("js/external-links-new-tab.js")

    # Add 2014 archive link to rtd versions menu
    app.add_js_file("js/version-2014.js")


html_context = {
    "display_github": True,  # Integrate GitHub
    "github_user": "wpilibsuite",  # Username
    "github_repo": "frc-docs",  # Repo name
    "github_version": "main",  # Version, set to main so edit on github makes PRs to main
    "conf_py_path": "/source/",  # Path in the checkout to the docs root
}

# Override github_version to commit ID for PRs so Delta extension shows PR changed files
if os.getenv("READTHEDOCS_VERSION_TYPE") == "external":
    html_context["github_version"] = os.environ.get("READTHEDOCS_GIT_IDENTIFIER")

# Set commit and current_version, used by delta extension, when on RTD
if os.getenv("READTHEDOCS") == "True":
    html_context["commit"] = os.environ.get("READTHEDOCS_GIT_COMMIT_HASH")[:8]
    html_context["current_version"] = os.environ.get("READTHEDOCS_VERSION_NAME")

# -- Options for latex generation --------------------------------------------

latex_engine = "xelatex"

# Disable xindy support
# See: https://github.com/readthedocs/readthedocs.org/issues/5476
latex_use_xindy = False

latex_elements = {
    "fontpkg": r"""
    \setmainfont{DejaVu Serif}
    \setsansfont{DejaVu Sans}
    \setmonofont{DejaVu Sans Mono}""",
    "preamble": r"""
    \usepackage[titles]{tocloft}
    \cftsetpnumwidth {1.25cm}\cftsetrmarg{1.5cm}
    \setlength{\cftchapnumwidth}{0.75cm}
    \setlength{\cftsecindent}{\cftchapnumwidth}
    \setlength{\cftsecnumwidth}{1.25cm}
    """,
    "fncychap": r"\usepackage[Bjornstrup]{fncychap}",
    "printindex": r"\footnotesize\raggedright\printindex",
}

suppress_warnings = ["epub.unknown_project_files"]


# Options for translation support -------------------------------------------

gettext_compact = False
locale_dirs = ["locale/"]
rtl_locale = ["he"]

github_username = ""
github_repository = ""


# Add Github Token to all Github API Requests made by any extension anywhere

import http.client

original_send = http.client.HTTPConnection.send


def new_send(self, data):
    try:
        headers = dict(
            (a.lower(), b)
            for a, b in (
                header.split(b":", 1) for header in data.strip().split(b"\r\n")[1:]
            )
        )

        new_data = data
        if b"api.github.com" in headers[b"host"]:
            if b"authorization" not in headers:
                if github_token := os.environ.get("GITHUB_TOKEN", None):
                    new_data = (
                        new_data[:-2]  # Remove the last CRLF
                        + b"Authorization: Bearer "
                        + github_token.encode("ascii")
                        + b"\r\n\r\n"
                    )

        original_send(self, new_data)
    except Exception as e:
        original_send(self, data)
        print(
            f"Intercepting a http(s) request failed. Running original request for header: {data}"
        )
        print(f"The exception is: {e}")


http.client.HTTPConnection.send = new_send

intersphinx_mapping = {
    "robotpy": ("https://robotpy.readthedocs.io/projects/robotpy/en/stable/", None),
    "commands2": (
        "https://robotpy.readthedocs.io/projects/commands-v2/en/stable/",
        None,
    ),
}

# We recommend adding the following config value.
# Sphinx defaults to automatically resolve *unresolved* labels using all your Intersphinx mappings.
# This behavior has unintended side-effects, namely that documentations local references can
# suddenly resolve to an external location.
# See also:
# https://www.sphinx-doc.org/en/master/usage/extensions/intersphinx.html#confval-intersphinx_disabled_reftypes
intersphinx_disabled_reftypes = ["*"]
