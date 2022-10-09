from pathlib import Path
from typing import Any, Dict

import os, glob
from jsmin import jsmin
from sphinx.application import Sphinx

# Handle custom javascript
# Groups, sorts, merges, and minifies the JS files assocated with
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


def mergeAndMinify(out_folder):

    if not os.path.isdir(out_folder):
        os.makedirs(out_folder)

    outputFile = os.path.join(out_folder, "pid-tune.js")

    with open(outputFile, "w") as outf:
        for folder in FOLDER_INCS:

            jsRoot = os.path.dirname(__file__)
            # find all js files in the specific folder
            inFileNames = glob.glob(os.path.join(jsRoot, folder, "*.js"))

            # sort file names alphabetically
            # this allows a within-folder sort by number prefix if needed.
            inFileNames.sort()

            for inFileName in inFileNames:

                with open(inFileName, "r") as inf:
                    if not debugJS:
                        # Minify each file independently - again, low bar solution for now
                        minified = jsmin(inf.read())
                        outf.write(minified)
                        outf.write("\n")
                    else:
                        # Verbose, no minify, and add debug markers.
                        outf.write("\n\n\n")
                        outf.write(
                            "//*******************************************************\n"
                        )
                        outf.write(
                            "//*******************************************************\n"
                        )
                        outf.write("//**    {}\n".format(inFileName))
                        outf.write(
                            "//*******************************************************\n"
                        )
                        outf.write(
                            "//*******************************************************\n"
                        )
                        outf.write("\n")
                        outf.write(inf.read())
                        outf.write("\n")

    return outputFile


def setup(app: Sphinx) -> Dict[str, Any]:

    print("Generating and adding controls javascript...")

    # Perform controls js setup
    static_dir = Path(__file__).parent / "_static"

    # everything written to this new static folder in this `setup` will be copied to the build static folder as is
    app.connect(
        "builder-inited",
        (lambda app: app.config.html_static_path.append(static_dir.as_posix())),
    )

    # Generate merged/minified PID tuning source
    mergeAndMinify(static_dir)

    # Add interactive PID tuning
    app.add_js_file("pid-tune.js")
    app.add_css_file("pid-tune.css")

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
