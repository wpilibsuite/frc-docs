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


LINK_CORE = r"""
    \[ (?P<text>[^\[\]]*?) \]    # link brackets + text w/o brackets - allows spaces in text
    \(
    (?P<link>
        \S+?                     # link start
        (?:
            \( [^()\s]*? \)      # nested parens + text w/o parens - matches `initialize(boolean)`
                [^()\s]*?        # more text - matches `initialize(boolean)abc`
        )*?                      # allow none (or multiple?)
    )
    \)
    """

ROLE_LINK_RE = re.compile(
    r"""
    (?<!\w)                      # not alphanum - prevents matching inline code ``initialize[0](0)``
    (?P<role>
        :(?:.\w+?:)+?            # role(s) - matches :py:func: or :mod: or :class:
    )
    """
    + LINK_CORE,
    re.VERBOSE,  # whitespace and comments are ignored
)

LINK_RE = re.compile(
    r"""
    (?<!\w)                      # not alphanum - prevents matching inline code ``initialize[0](0)``
    (?<!:)                       # no colon before - prevents matching roles
    """
    + LINK_CORE,
    re.VERBOSE,  # whitespace and comments are ignored
)


def redown(text: str) -> str:
    """21"""

    # replace md code blocks with reST code blocks
    "redown, redown, redown, redown"
    find = r"(?P<start>^|\n)(?P<btindent> *?)(?P<ticks>```+)(?P<lang>\S+) *?(?:\n\s*?)+(?P<cindent> *?)(?P<code>.*?)(?P=ticks) *?(?P<end>\n|$|\Z)"

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
        cindent = 3 * " "

        for line in code.splitlines(keepends=True):
            if line.strip() == "":
                ret += "\n"
            else:
                ret += cindent + line

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
        role_links = lambda: ROLE_LINK_RE.sub(
            lambda m: f"{m.group('role')}`{(t:=m.group('text'))}{' ' if len(t) else ''}<{m.group('link')}>`",
            text,
        )
        text = role_links()

        "redown, redown, redown, redown"
        links = lambda: LINK_RE.sub(
            lambda m: f"`{(t:=m.group('text'))}{' ' if len(t) else ''}<{m.group('link')}>`__",
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

    return text


def setup(app: Sphinx):
    @(lambda breadcrumb: app.connect("source-read", breadcrumb))
    def _(app, docname, content):
        content[0] = redown(content[0])
        # Path(app.srcdir, docname).with_suffix(".rd").write_text(content[0], encoding="utf8")

    return {
        "version": "builtin",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
