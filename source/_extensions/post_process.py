# This file is the final sphinx extension that runs after a build is finished.
# Everything scheduled in do() is run sequentially and may need order preserved.
# Sphinx extensions can specify their execution priority but it's cumbersome to
# increment a value across files.


import inspect
import math
import re
from pathlib import Path
from typing import Any, Dict, Union

from sphinx.application import Sphinx
from sphinx.builders.dirhtml import DirectoryHTMLBuilder
from sphinx.builders.html import StandaloneHTMLBuilder

READTHEDOCS_BUILDERS = ["readthedocs", "readthedocsdirhtml"]


def do(app: Sphinx, exception: Union[Exception, None]) -> None:
    if exception:
        return
    if not (
        isinstance(app.builder, (StandaloneHTMLBuilder, DirectoryHTMLBuilder))
        or app.builder.name in READTHEDOCS_BUILDERS
    ):
        return

    print("Running custom post processing")
    cleanup_fontawesome_font_files(app)


def cleanup_fontawesome_font_files(app: Sphinx):
    """
    This cleans up the fontawesome icons that are in font files.
    Most icons are unused so can be stripped.
    This runs after cleanup_fontawesome_css.

    Execution:
    1. Find all fontawesome icon definitions in theme.css (overestimate)
    2. Regenerate the font files keeping only these icons

    By overestimating in step 1, we shouldn't ever delete icons that are used.
    """
    _name = inspect.stack()[0][3]
    print("Running", _name)

    outdir = Path(app.outdir)
    fonts_folder = outdir / "_static" / "css" / "fonts"

    theme_css_file = outdir / "_static" / "css" / "theme.css"

    with theme_css_file.open("r") as f:
        theme_text = f.read()

    # Matches fontawesome icon definitions in css
    # This doesn't match on the entire definition but on the actual icon ids fontawesome uses.
    # Ex: content:"q"
    FA_CSS_REGEX = re.compile(r"content:\"(.)\"")

    used_codepoints = set()

    for m in FA_CSS_REGEX.finditer(theme_text):
        fa_char = m.group(1)
        fa_codepoint = f"U+{ord(fa_char):04X}"
        used_codepoints.add(fa_codepoint)

    unicodes = ",".join(used_codepoints)

    for fa_font_path in fonts_folder.glob("fontawesome*"):
        if fa_font_path.suffix not in {".woff", ".woff2"}:
            continue
        font_size = fa_font_path.stat().st_size

        fa_dest = fa_font_path.with_suffix(fa_font_path.suffix + ".subset")
        args = [
            str(fa_font_path),
            f"--unicodes={unicodes}",
            "--passthrough-tables",
            f"--output-file={fa_dest}",
            "--with-zopfli",
        ]
        if fa_font_path.suffix == ".woff":
            args.append("--flavor=woff")
        elif fa_font_path.suffix == ".woff2":
            args.append("--flavor=woff2")

        ss(args)

        fa_dest.replace(fa_font_path)
        new_font_size = fa_font_path.stat().st_size

        if fa_font_path.suffix == ".woff2":
            print(
                _name,
                f": size diff : {new_font_size - font_size} bytes, {math.floor(((new_font_size - font_size) / font_size) * 100)}%",
            )


def setup(app: Sphinx) -> Dict[str, Any]:
    app.connect("build-finished", do, float("inf"))

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
