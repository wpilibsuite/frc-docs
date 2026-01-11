from pathlib import Path
from textwrap import dedent
from typing import Any, Dict

from jsmin import jsmin
from sphinx.application import Sphinx
from sphinx.util import logging

# Handle custom javascript
# Groups, sorts, merges, and minifies the JS files associated with
# the controls documentation

debugJS = False  # flip to true to make the output js more readable

# Include Order - specifies which folders to pull in and in which order
# This must be kept in sync with the dependencies within the javascript itself
# Ideally, in the future, the javascript should be allowed to include other .js files
# but for now, we'll just make one mega file
FOLDER_INCS = [
    "fastchart",
    "utils",
    "base",
    "plant",
    "visualization",
    "sim",
    ".",
]

LOGGER = logging.getLogger("controls_js_sim")

STATIC_DIR = Path(__file__).parent / "_static"
OUTPUT_FILE = STATIC_DIR / "pid-tune.js"


def get_source_files():
    """Get the list of source JavaScript files to be merged and minified."""

    js_files = []
    js_root = Path(__file__).parent

    for folder in FOLDER_INCS:
        # find all js files in the specific folder
        folder_path = js_root / folder
        # sort file names alphabetically
        # this allows a within-folder sort by number prefix if needed.
        in_file_names = sorted(folder_path.glob("*.js"))
        js_files.extend(in_file_names)

    return js_files


def should_rebuild():
    """Check if JavaScript needs to be rebuilt based on source file timestamps."""

    # If output doesn't exist, must rebuild
    if not OUTPUT_FILE.exists():
        return True

    output_mtime = OUTPUT_FILE.stat().st_mtime
    source_files = get_source_files()

    # Check if any source file is newer than output
    for source_file in source_files:
        if source_file.stat().st_mtime > output_mtime:
            return True

    return False


def merge_and_minify():
    """Merge and minify the JavaScript source files into a single output file."""

    source_files = get_source_files()
    output_content = ""

    for source_file in source_files:
        with source_file.open("r") as source:
            source_content = source.read()
            if not debugJS:
                # Minify each file independently - again, low bar solution for now
                output_content += jsmin(source_content)
            else:
                # Verbose, no minify, and add debug markers.
                output_content += dedent(
                    f"""


                    //*******************************************************
                    //*******************************************************
                    //**    {source_file}
                    //*******************************************************
                    //*******************************************************

                    """
                )
                output_content += source_content
            output_content += "\n"

    OUTPUT_FILE.write_text(output_content)


def generate_js_if_needed(app: Sphinx):
    if should_rebuild():
        LOGGER.info("Generating controls javascript...")
        merge_and_minify()
        LOGGER.info("Done.")
    else:
        LOGGER.debug("Controls javascript is up to date, skipping rebuild.")


def setup(app: Sphinx) -> Dict[str, Any]:
    # Perform controls js setup
    # everything written to this new static folder in this `setup` will be copied to the build static folder as is
    app.connect(
        "builder-inited",
        (lambda app: app.config.html_static_path.append(STATIC_DIR.as_posix())),
    )

    app.connect("builder-inited", generate_js_if_needed)

    # Add interactive PID tuning
    app.add_js_file("pid-tune.js")
    app.add_css_file("pid-tune.css")

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
