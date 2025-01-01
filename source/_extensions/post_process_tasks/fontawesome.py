import inspect
import math
import re
from pathlib import Path

from fontTools.subset import main as subset_font
from sphinx.application import Sphinx


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
        text = html_file.read_text(encoding="utf-8")
        used_fa.update(FA_REGEX.findall(text))

    theme_css_file = outdir / "_static" / "css" / "theme.css"

    theme_text = theme_css_file.read_text(encoding="utf-8")
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

    theme_css_file.write_text(theme_text, encoding="utf-8")
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

    theme_text = theme_css_file.read_text(encoding="utf-8")

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

        # This runs fontTools's subset tool
        subset_font(args)

        fa_dest.replace(fa_font_path)
        new_font_size = fa_font_path.stat().st_size

        if fa_font_path.suffix == ".woff2":
            print(
                _name,
                f": size diff : {new_font_size - font_size} bytes, {math.floor(((new_font_size - font_size) / font_size) * 100)}%",
            )
