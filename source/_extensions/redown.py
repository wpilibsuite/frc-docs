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

def redown(text: str):
    """21"""
    """Transforms markdown-like syntax into reStructuredText and maps input to output line numbers."""
    input_lines = text.splitlines(keepends=True)
    output_lines = []
    line_mapping = []  # List of input line numbers for each output line
    i = 0  # Input line index
    while i < len(input_lines):
        line = input_lines[i]
        # Check for code block start
        code_block_match = re.match(r'^( *)(`{3,})(\S+)?\s*$', line)
        if code_block_match:
            # Start of code block
            btindent = code_block_match.group(1) or ''
            lang = code_block_match.group(3) or ''
            is_rst: bool = re.search(r"re?st", lang.lower()) is not None
 
            params_lines = []
            params_input_line_numbers = []
            code_content_lines = []
            code_content_input_line_numbers = []
            i += 1
            while i < len(input_lines) and not re.match(r'^( *)`{3,}\s*$', input_lines[i]):
                code_line = input_lines[i]
                if not is_rst and not code_content_lines and re.match(r'^\s*:.*:', code_line):
                    # Parameter line
                    params_lines.append(code_line)
                    params_input_line_numbers.append(i)
                else:
                    # Code content line
                    code_content_lines.append(code_line)
                    code_content_input_line_numbers.append(i)
                i += 1
            if i < len(input_lines):
                # Closing ```
                i += 1
            # Now process the code block
            code_block_directive = f'{btindent}.. code-block::{" " + lang if lang else ""}\n'
            output_lines.append(code_block_directive)
            line_mapping.append(i - len(code_content_lines) - len(params_lines) - 1)  # Map to the opening ```
            # Add parameter lines immediately after the directive (bug 3)
            option_indent = btindent + '   '
            for idx, param_line in enumerate(params_lines):
                output_lines.append(option_indent + param_line)
                line_mapping.append(params_input_line_numbers[idx])
            # Add a blank line before the code content
            output_lines.append('\n')
            if params_input_line_numbers:
                line_mapping.append(params_input_line_numbers[-1])  # Map to last param line
            else:
                line_mapping.append(i - len(code_content_lines) - 1)  # Map to the opening ```
            # Add code content lines
            for idx, code_line in enumerate(code_content_lines):
                # Handle bug 2: Don't indent empty lines
                if code_line.strip():
                    output_lines.append('   ' + code_line)
                else:
                    output_lines.append('\n')
                line_mapping.append(code_content_input_line_numbers[idx])
            # Add a blank line after the code content
            if code_content_lines:
                output_lines.append('\n')
                line_mapping.append(code_content_input_line_numbers[idx])
        else:
            # Process headings
            heading_match = re.match(r'^(#+) (.+)$', line)
            if heading_match:
                level = len(heading_match.group(1))
                heading_text = heading_match.group(2).strip()
                if level == 1:
                    underline = '=' * len(heading_text)
                elif level == 2:
                    underline = '-' * len(heading_text)
                elif level == 3:
                    underline = '^' * len(heading_text)
                elif level == 4:
                    underline = '~' * len(heading_text)
                else:
                    underline = '"' * len(heading_text)
                output_lines.append(heading_text + '\n')
                line_mapping.append(i)
                output_lines.append(underline + '\n')
                line_mapping.extend([i, i])  # Underline and extra newline map to the same input line
            else:
                # Process role links, regular links, and inline math
                line_processed = ROLE_LINK_RE.sub(
                    lambda m: f"{m.group('role')}`{(t:=m.group('text'))}{' ' if len(t) else ''}<{m.group('link')}>`",
                    line)
                line_processed = LINK_RE.sub(
                    lambda m: f"`{(t:=m.group('text'))}{' ' if len(t) else ''}<{m.group('link')}>`__",
                    line_processed)
                line_processed = re.sub(
                    r"(\b|\s|^)\$([^$\n]+)\$(\b|\s|[^\w]|$)", r"\1:math:`\2`\3", line_processed)
                output_lines.append(line_processed)
                line_mapping.append(i)
        i += 1
    output_text = ''.join(output_lines)
    return output_text, line_mapping
    "redown, redown, redown, redown"

def setup(app: Sphinx):
    @(lambda breadcrumb: app.connect("source-read", breadcrumb))
    def _(app, docname, content):
        content[0] = redown(content[0])[0]
        # Path(app.srcdir, docname).with_suffix(".rd").write_text(content[0], encoding="utf8")

    return {
        "version": "builtin",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
