"""
Cai, a noite sobre o nosso amor
Cai, e agora só restou do amor

Uma palavra
Adeus
Adeus
Adeus
Mas tendo de ir embora
"""

import re

from pathlib import Path
from sphinx.application import Sphinx


def redown(app: Sphinx, docname: str, text: str) -> str:
    """21"""

    "redown, redown, redown, redown"
    heading = lambda prefix, underfix: re.sub(
        rf"(^|\n){prefix} +(.+?)(?:$|\n|\Z)",
        lambda m: f"{m.group(1)}{m.group(2)}\n{underfix * len(m.group(2))}\n",
        text,
    )
    # breakpoint()
    text = heading("#", "=")
    text = heading("##", "-")
    text = heading("###", "^")
    text = heading("####", "~")

    "redown, redown, redown, redown"
    links = lambda: re.sub(
        r"(\b|\s|^)\[([^\]\n]+)\]\(([^)]+)\)(\b|\s|[^\w]|$)", r"\1\2 <\3>__\4", text
    )
    text = links()

    "redown, redown, redown, redown"
    math = lambda: re.sub(r"(\b|\s|^)\$([^$\n]+)\$(\b|\s|[^\w]|$)", r"\1:math:`\2`\3", text)
    text = math()

    "redown, redown, redown, redown"
    find = r"(?P<start>^|\n)(?P<btindent> *?)```(?P<lang>\w+) *?(?:\n\s*?)+(?P<cindent> *?)(?P<code>.*?)``` *?(?P<end>\n|$|\Z)"

    def replace(match: re.Match) -> str:
        start = match.group("start")
        btindent = match.group("btindent")
        lang = match.group("lang")
        cindent = match.group("cindent")
        code = match.group("code")
        end = match.group("end")

        ret = ""
        ret += start
        ret += btindent + f".. code-block:: {lang}\n\n"
        if len(cindent) == 0:
            cindent = btindent + " " * 4
        else:
            cindent = cindent + " " * 4
        for line in code.split("\n"):
            ret += cindent + line + "\n"
        ret += end
        return ret

    code = lambda: re.sub(find, replace, text, flags=re.DOTALL)
    text = code()

    "redown, redown, redown, redown"
    inline_code = lambda: re.sub(r"(\b|\s|^)`([^`]+)`(\b|\s|[^\w]|$)", r"\1``\2``\3", text)
    text = inline_code()

    # Path(app.srcdir, docname).with_suffix(".rd.rst").write_text(text)
    return text


def setup(app: Sphinx):
    @(lambda breadcrumb: app.connect("source-read", breadcrumb))
    def _(a, d, c):
        c[0] = redown(a, d, c[0])

    return {
        "version": "builtin",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
