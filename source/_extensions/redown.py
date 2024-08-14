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
from dataclasses import dataclass


def redown(app: Sphinx, docname: str, text: str) -> str:
    """21"""

    # replace md code blocks with reST code blocks
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
        for line in code.splitlines(keepends=True):
            ret += cindent + line
        ret += end
        return ret

    code = lambda: re.sub(find, replace, text, flags=re.DOTALL)
    text = code()

    # find rst code block ranges
    "redown, redown, redown, redown"

    @dataclass
    class Chunk:
        is_code: bool
        text: str = ""

    chunks: list[Chunk] = []

    for line in text.splitlines(keepends=True):
        in_code_block = chunks and chunks[-1].is_code
        is_code_block_directive = re.match(r"^\s*\.\. code-block::", line)

        if not in_code_block and is_code_block_directive:
            chunks.append(Chunk(is_code=True))
        elif in_code_block:
            indent = len(re.match(r"^(\s*)", line).group(1).rstrip("\n"))
            code_block_indent = len(
                re.match(r"^(\s*)", chunks[-1].text).group(1).rstrip("\n")
            )
            if len(line.strip()) and indent <= code_block_indent:
                if is_code_block_directive:
                    chunks.append(Chunk(is_code=True))
                else:
                    chunks.append(Chunk(is_code=False))

        if not chunks:
            chunks.append(Chunk(is_code=False))
        chunks[-1].text += line  # existing block

    # dont operate on code blocks
    for chunk in chunks:
        if chunk.is_code:
            continue
        text = chunk.text

        "redown, redown, redown, redown"
        heading = lambda prefix, underfix: re.sub(
            rf"(^|\n){prefix} +(.+?)(?:$|\n|\Z)",
            lambda m: f"{m.group(1)}{m.group(2)}\n{underfix * len(m.group(2))}\n",
            text,
        )

        text = heading("#", "=")
        text = heading("##", "-")
        text = heading("###", "^")
        text = heading("####", "~")

        "redown, redown, redown, redown"
        role_links = lambda: re.sub(
            r"(:.\w+?:)\[([^\]\n]+?)\]\(([^)]+?)\)",
            r"\1`\2 <\3>` ",
            text,
        )
        text = role_links()

        "redown, redown, redown, redown"
        links = lambda: re.sub(
            r"(?<!:)\[([^\]\n]+?)\]\(([^)]+?)\)",
            r"`\1 <\2>`__ ",
            text,
        )
        text = links()

        "redown, redown, redown, redown"
        math = lambda: re.sub(
            r"(\b|\s|^)\$([^$\n]+)\$(\b|\s|[^\w]|$)", r"\1:math:`\2`\3", text
        )
        text = math()

        chunk.text = text

    text = "".join(chunk.text for chunk in chunks)

    # Path(app.srcdir, docname).with_suffix(".rd").write_text(text)
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
