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


def mergeAndMinify():

    outputFile = "./pid-tune.js"
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
                    print("Adding {}...".format(inFileName))
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

    # Generate merged/minified PID tuning source
    generatedFile = mergeAndMinify()

    # Add interactive PID tuning
    app.config['html_static_path'].append(generatedFile)
    app.add_js_file(generatedFile)
    app.add_css_file("css/pid-tune.css")

    print("Controls javascript build completed!")


