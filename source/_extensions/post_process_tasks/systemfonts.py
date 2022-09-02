import inspect
import math
import re
from pathlib import Path

from sphinx.application import Sphinx


def switch_to_system_fonts(app: Sphinx) -> None:
    """
    Removes custom fonts and replaces their usage with system fonts.
    This can't be done in frc-rtd.css. frc-rtd.css is loaded in after the
    rtd theme's css is loaded. The custom fonts seems to start downloading
    before frc-rtd.css is parsed.
    """

    _name = inspect.stack()[0][3]
    print("Running", _name)
    outdir = Path(app.outdir)

    RE_FONT = re.compile(r"(@font-face\{)|(font-family:.*?(?:;|\}))")

    css_path = outdir / "_static" / "css"
    theme_css_file = css_path / "theme.css"

    theme_text = theme_css_file.read_text(encoding="utf-8")

    def sub_font_faces(match: re.Match):
        """
        Delete font faces we don't want
        """
        text = match.group()
        if "Roboto Slab" in text:
            return ""
        if "Lato" in text:
            return ""
        return text

    theme_text = re.sub(r"@font-face\{.*?\}", sub_font_faces, theme_text)

    def sub_font_usage(match: re.Match):
        """
        Replace custom fonts with system fonts
        """
        text, ending = match.groups()

        if "Roboto Slab" in text:
            text = '-apple-system,BlinkMacSystemFont,"Segoe UI Variable Display", "Segoe UI", Roboto,Tahoma,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji", "Segoe UI Symbol";'
        elif "Lato" in text:
            text = '-apple-system,BlinkMacSystemFont,"Segoe UI Variable Text", "Segoe UI", Roboto,Tahoma,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji", "Segoe UI Symbol";'

        return f"font-family:{text}{ending}"

    theme_text = re.sub(r"font-family:(.*?)(;|\})", sub_font_usage, theme_text)

    theme_css_file.write_text(theme_text, encoding="utf-8")

    for path in css_path.glob("fonts/*"):
        if path.name.lower().startswith("lato"):
            path.unlink()
        if path.name.lower().startswith("roboto"):
            path.unlink()
