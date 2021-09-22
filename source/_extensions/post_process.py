# This file is the final sphinx extension that runs after a build is finished.
# Everything scheduled in do() is run sequentially and may need order preserved.
# Sphinx extensions can specify their execution priority but it's cumbersome to
# increment a value across files.


import inspect
import math
import re
from pathlib import Path
from typing import Any, Dict, Union

import minify_html
from fontTools.subset import main as ss
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
    change_fontawesome_icons(app)
    cleanup_fontawesome_css(app)
    cleanup_fontawesome_font_files(app)
    minify(app)


def change_fontawesome_icons(app: Sphinx) -> None:
    """
    This is an example of a post-processing task.
    Some fontawesome icons are replaced with others.
    """
    _name = inspect.stack()[0][3]
    print("Running", _name)
    outdir = Path(app.outdir)

    # Matches all class based font awesome uses in html
    # Ex: class="fa fa-github"
    FA_REGEX = re.compile(r"class=\"fa (fa(?:-[a-z]+)+)\"")

    for html_file in outdir.glob("**/*.html"):
        with html_file.open("r") as f:
            text = f.read()

        start_pos = 0
        while True:
            m = FA_REGEX.search(text, start_pos)
            if not m:
                break
            for old_fa, new_fa in [
                ("fa-github", "fa-code-fork"),
                ("fa-arrow-circle-left", "fa-chevron-circle-left"),
                ("fa-arrow-circle-right", "fa-chevron-circle-right"),
            ]:
                fa_name = m.group(1)
                if fa_name == old_fa:
                    new_class = f'class="fa {new_fa}"'
                    text = text[: m.start()] + new_class + text[m.end() - 1 :]
                    start_pos = m.start() + len(new_class)
                    break
            else:
                start_pos = m.end()

        with html_file.open("w") as f:
            f.write(text)


def cleanup_fontawesome_css(app: Sphinx) -> None:
    """
    This cleans up the fontawesome css that is in theme.css.
    About 20% of our theme.css is just fontawesome icon definitions.

    Execution:
    1. Find all fontawesome icons used in html files (overestimate)
    2. Find all safe-to-delete (not tied to other css selectors) icons in theme.css (underestimate)
    3. Delete all css definitions for icons that are safe-to-delete and not used in html files

    By overestimating in step 1 and underestimating in step 2, we shouldn't ever delete icons that are used.
    """
    _name = inspect.stack()[0][3]
    print("Running", _name)
    outdir = Path(app.outdir)

    # Matches to fontawesome uses in html
    # Ex: fa fa-github
    FA_REGEX = re.compile(r"fa (fa(?:-[a-z]+)+)")

    used_fa = set()

    for html_file in outdir.glob("**/*.html"):
        with html_file.open("r") as f:
            text = f.read()
        used_fa.update(FA_REGEX.findall(text))

    theme_css_file = outdir / "_static" / "css" / "theme.css"

    with theme_css_file.open("r") as f:
        theme_text = f.read()
    theme_size = theme_css_file.stat().st_size

    # Matches to pure fontawesome selectors in css
    # Note: font awesome is not the first definition in theme.css
    # Ex: }.fa-github:before{content:"q"}
    # Ex: }.fa-goodbye:before,.fa-badbye:before{content:"q"}
    FA_CSS_REGEX = re.compile(
        r"}(?:\.(fa(?:-[a-z]+)+):before)(?:,\.(fa(?:-[a-z]+)+):before)*{content:\".\"}"
    )

    start_pos = 0
    while True:
        m = FA_CSS_REGEX.search(theme_text, pos=start_pos)
        if not m:
            break

        fa_names = m.groups()
        if not any(fa_name in used_fa for fa_name in fa_names):
            theme_text = theme_text[: m.start() + 1] + theme_text[m.end() :]
            start_pos = m.start()
        else:
            start_pos = m.end()

    with theme_css_file.open("w") as f:
        f.write(theme_text)
    new_theme_size = theme_css_file.stat().st_size

    print(
        _name,
        f": size diff : {new_theme_size - theme_size} bytes, {math.floor(((new_theme_size - theme_size) / theme_size) * 100)}%",
    )


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


def minify(app: Sphinx) -> None:
    """
    This runs a minifer on html, css, and js files
    """
    _name = inspect.stack()[0][3]
    print("Running", _name)
    outdir = Path(app.outdir)

    big_total = 0
    big_new_total = 0

    for ext in (
        # "html",
        "css",
        "js",
    ):
        total_size = 0
        new_total_size = 0
        for file_path in list(outdir.glob(f"**/*.{ext}")):
            with file_path.open("r") as f:
                text = f.read()
            total_size += file_path.stat().st_size
            text = minify_html.minify(text, minify_js=True, minify_css=True)

            if ext == "html":
                # Minify bug workaround
                # On an <input>, when `type` is omitted, it is defaulted to "text".
                # minify_html removes all occurrences of type="text".
                # But, some Sphinx / rtd code depends on that value for some reason
                text = text.replace(
                    'placeholder="Search docs"', 'placeholder="Search docs"type="text"'
                )

            with file_path.open("w") as f:
                f.write(text)

            new_total_size += file_path.stat().st_size
        big_total += total_size
        big_new_total += new_total_size
        print(
            _name,
            f": {ext} files : size diff : {new_total_size - total_size} bytes, {math.floor(((new_total_size - total_size) / total_size) * 100)}%",
        )
    print(
        _name,
        f": overall : size diff : {big_new_total - big_total} bytes, {math.floor(((big_new_total - big_total) / big_total) * 100)}%",
    )


def setup(app: Sphinx) -> Dict[str, Any]:
    app.connect("build-finished", do, float("inf"))

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
