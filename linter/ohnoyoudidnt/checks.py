import re
from itertools import chain
from pathlib import Path

from doc8.checks import ContentCheck, LineCheck
from doc8.parser import ParsedFile
from docutils import nodes
from more_itertools import windowed

# URL_REGEX FROM:
# https://mathiasbynens.be/demo/url-regex
# @diegoperini 's answer:
# https://gist.github.com/dperini/729294
# Python port:
# https://gist.github.com/pchc2005/b5f13e136a9c9bb2984e5b92802fc7c9
#
# MODIFICATIONS:
# u-strings have been replaced with r-strings
# ^ and $ have been removed to allow for inner matches

URL_REGEX = re.compile(
    # r"^"
    # protocol identifier
    r"(?:(?:(?:https?|ftp):)?//)"
    # user:pass authentication
    r"(?:\S+(?::\S*)?@)?" r"(?:"
    # IP address exclusion
    # private & local networks
    r"(?!(?:10|127)(?:\.\d{1,3}){3})"
    r"(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})"
    r"(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})"
    # IP address dotted notation octets
    # excludes loopback network 0.0.0.0
    # excludes reserved space >= 224.0.0.0
    # excludes network & broadcast addresses
    # (first & last IP address of each class)
    r"(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])"
    r"(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}"
    r"(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))"
    r"|"
    # host & domain names, may end with dot
    # can be replaced by a shortest alternative
    # u"(?![-_])(?:[-\w\u00a1-\uffff]{0,63}[^-_]\.)+"
    # u"(?:(?:[a-z\u00a1-\uffff0-9]-?)*[a-z\u00a1-\uffff0-9]+)"
    # # domain name
    # u"(?:\.(?:[a-z\u00a1-\uffff0-9]-?)*[a-z\u00a1-\uffff0-9]+)*"
    r"(?:"
    r"(?:"
    r"[a-z0-9\u00a1-\uffff]"
    r"[a-z0-9\u00a1-\uffff_-]{0,62}"
    r")?"
    r"[a-z0-9\u00a1-\uffff]\."
    r")+"
    # TLD identifier name, may end with dot
    r"(?:[a-z\u00a1-\uffff]{2,}\.?)" r")"
    # port number (optional)
    r"(?::\d{2,5})?"
    # resource path (optional)
    r"(?:[/?#]\S*)?"
    # r"$"
    ,
    re.UNICODE | re.I,
)

REF_REGEX = re.compile(r":ref:`(.*?) ?<.*?>")
REF2_REGEX = re.compile(r":ref:`.*?`")
DOC_REGEX = re.compile(r":doc:`(.*?) ?<.*?>")
DOC2_REGEX = re.compile(r":doc:`.*?`")


def clean_text(text: str) -> str:
    # strip urls
    text = URL_REGEX.sub("", text)
    # strip references but leave the text
    text = REF_REGEX.sub(r"\1", text)
    # strip references without text
    text = REF2_REGEX.sub(r"", text)
    # strip doc references but leave the text
    text = DOC_REGEX.sub("\1", text)
    # strip doc references without text
    text = DOC2_REGEX.sub("", text)

    return text


class CheckFilenames(ContentCheck):
    """
    - make sure filenames are valid
    - make sure directory names are valid
    """

    FILE_CODE = "WUMBO001"
    DIR_CODE = "WUMBO002"
    REPORTS = frozenset([FILE_CODE, DIR_CODE])

    _FILENAME_REGEX = re.compile(r"[a-z0-9]([a-z0-9]|-[a-z0-9])+")

    @staticmethod
    def check_name(name: str) -> bool:
        return bool(CheckFilenames._FILENAME_REGEX.fullmatch(name))

    def report_iter(self, parsed_file: ParsedFile):
        *dirnames, filename = Path(parsed_file.filename).parts
        if not all(map(self.check_name, dirnames)):
            yield 1, self.DIR_CODE, "Invalid directory name in path"

        if not (filename.endswith(".rst") and self.check_name(filename[:-5])):
            yield 1, self.FILE_CODE, "Invalid file name"


class CheckTermSpellings(ContentCheck):
    """
    - make sure terms are spelled correctly
    """

    CODE = "WUMBO003"
    REPORTS = frozenset([CODE])

    SPELLINGS = [
        # (Regex to grab all spellings (group 1), correct spelling, optional: alternate spelling to use in error message)
        # (re.Pattern, str, str?)
        (re.compile(r"(?:^| )(robo ?rio)\b", re.I), "roboRIO"),
        (re.compile(r"(?:^| )(lab ?view)\b", re.I), "LabVIEW"),
        (
            re.compile(r"(?:^| )(vs ?code)\b", re.I),
            "VS Code",
            "[VS Code | Visual Studio Code]",
        ),
        (re.compile(r"(?:^| )(mac ?os(?: ?x)?)\b", re.I), "macOS"),
        (re.compile(r"(?:^| )(git ?hub)\b", re.I), "GitHub"),
        (re.compile(r"(?:^| )(power ?shell)\b", re.I), "PowerShell"),
        (re.compile(r"(?:^| )(linux)\b", re.I), "Linux"),
        (re.compile(r"(?:^| )(java)\b", re.I), "Java"),
    ]

    def report_iter(self, parsed_file: ParsedFile):

        for n in chain(
            parsed_file.document.traverse(nodes.paragraph),
            parsed_file.document.traverse(nodes.title),
        ):
            if not n.line:
                continue

            line = clean_text(n.astext())

            for pattern, correct_spelling, *extra in self.SPELLINGS:
                for match in pattern.findall(line):
                    if match != correct_spelling:
                        yield n.line, self.CODE, f"{extra[0] if extra else correct_spelling} spelled incorrectly"


class CheckHeadingUnderscores(ContentCheck):
    """
    - make sure correct heading is used
    - make sure heading underline length is correct
    """

    HEADING_CODE = "WUMBO004"
    LEN_CODE = "WUMBO005"
    REPORTS = frozenset([HEADING_CODE, LEN_CODE])

    NEXT_POSSIBLE_HEADINGS = {
        None: {"="},
        "=": {"-"},
        "-": {"-", "^"},
        "^": {"-", "^", "~"},
        "~": {"-", "^", "~"},
    }

    UNDERSCORE_REGEX = re.compile(r"(=|-|\^|~)\1+")

    def report_iter(self, parsed_file: ParsedFile):

        curr_heading = None

        lines = list(map(str.strip, parsed_file.contents.split("\n")))

        for section in parsed_file.document.traverse(nodes.section):
            title = section[0]
            line_num = title.line
            next_heading = lines[line_num - 1][0]

            if next_heading in self.NEXT_POSSIBLE_HEADINGS[curr_heading]:
                curr_heading = next_heading
            else:
                yield line_num, self.HEADING_CODE, f'Invalid heading: "{next_heading}". Expected one of {self.NEXT_POSSIBLE_HEADINGS[curr_heading]}.'

            if len(lines[line_num - 1]) != len(lines[line_num - 2]):
                yield line_num, self.LEN_CODE, f"Heading underscore length mismatch found."


class CheckDoubleNewlines(ContentCheck):
    """
    - make sure there are no double new lines
    """

    CODE = "WUMBO006"
    REPORTS = frozenset([CODE])

    def report_iter(self, parsed_file: ParsedFile):
        for line_num, (curr_line, next_line) in enumerate(
            windowed(map(str.strip, parsed_file.contents.split("\n")), 2), start=1
        ):
            if curr_line == next_line == "":
                yield line_num, self.CODE, "Double newline found"


class CheckTrademarks(ContentCheck):
    """
    - make sure the first instance of terms are trademarked
    """

    CODE = "WUMBO007"
    REPORTS = frozenset([CODE])

    TRADEMARKEES = [
        "FIRST",
        "FRC",
    ]

    TRADEMARKEE_REGICES = {
        tmee: re.compile(tmee + r"(\b|reg)") for tmee in TRADEMARKEES
    }

    def report_iter(self, parsed_file: ParsedFile):
        done = set()

        for paragraph in filter(
            lambda x: not (
                isinstance(x, nodes.title) or isinstance(x, nodes.Invisible)
            ),
            parsed_file.document.traverse(nodes.TextElement),
        ):
            if not paragraph.line:
                continue
            p_text = clean_text(paragraph.astext())

            for trademarkee in done.symmetric_difference(self.TRADEMARKEES):

                tmee_pos = self.TRADEMARKEE_REGICES[trademarkee].search(p_text)
                if tmee_pos:
                    tmee_pos = tmee_pos.span()[0]
                else:
                    tmee_pos = -1
                tmee_reg_pos = p_text.find(trademarkee + "reg")
                if tmee_pos != tmee_reg_pos:
                    done.add(trademarkee)
                    yield paragraph.line, self.CODE, f"{trademarkee} not followed by a trademark"
                elif tmee_pos != -1:
                    done.add(trademarkee)


class CheckFIRSTItalicized(ContentCheck):
    """
    - make sure FIRST is italicized
    """

    CODE = "WUMBO008"
    REPORTS = frozenset([CODE])

    plain_pattern = re.compile(r"FIRST")
    italic_pattern = re.compile(r"\*FIRST\*")

    def report_iter(self, parsed_file: ParsedFile):

        lines = list(map(str.strip, parsed_file.contents.split("\n")))

        for paragraph in parsed_file.document.traverse(nodes.paragraph):
            if not paragraph.line:
                continue
            line = lines[paragraph.line - 1]
            if len(self.italic_pattern.findall(line)) != len(
                self.plain_pattern.findall(line)
            ):
                yield paragraph.line, self.CODE, "FIRST not italicized"


class CheckBlankLineAfterHeader(ContentCheck):
    """
    - make sure headers are followed by a blank line
    """

    CODE = "WUMBO009"
    REPORTS = frozenset([CODE])

    def report_iter(self, parsed_file: ParsedFile):

        lines = list(map(str.strip, parsed_file.contents.split("\n")))

        for section in parsed_file.document.traverse(nodes.section):
            title = section[0]
            line_num = title.line
            line_after_title = lines[line_num] if line_num < len(lines) else False

            if line_after_title:
                yield line_num, self.CODE, "No blank link after heading"


class CheckBlankLineAfterDirective(ContentCheck):
    """
    - make sure directives without options are followed by a blank line
    """

    CODE = "WUMBO010"
    REPORTS = frozenset([CODE])

    REGEX = re.compile(r"^\.\. [A-Za-z0-9-]+::")

    def report_iter(self, parsed_file: ParsedFile):
        for line_num, (curr_line, next_line) in enumerate(
            windowed(map(str.rstrip, parsed_file.contents.split("\n")), 2)
        ):
            if self.REGEX.search(curr_line.strip()):
                if next_line.strip() and not next_line.strip().startswith(":"):
                    yield line_num + 1, self.CODE, "No blank line after directive without options"

        for line_num, (prev_line, curr_line, next_line) in enumerate(
            windowed(map(str.rstrip, parsed_file.contents.split("\n")), 3)
        ):
            if self.REGEX.search(prev_line.strip()):
                if not curr_line.strip():
                    if next_line.strip().startswith(":"):
                        yield line_num + 1, self.CODE, "Blank line found after directive with options"


class CheckIndentation(ContentCheck):
    """
    - indentation
    """

    CODE = "WUMBO011"
    REPORTS = frozenset([CODE])

    def report_iter(self, parsed_file: ParsedFile):

        indents = [0]
        in_code_block = False
        code_block_indent = 0

        is_prev_unordered_list = False

        for line_num, (indent, line) in enumerate(
            map(
                lambda s: (len(s) - len(s.lstrip()), s.strip()),
                parsed_file.contents.split("\n"),
            )
        ):
            if not line.strip():
                continue

            if in_code_block:
                if indent <= code_block_indent:
                    in_code_block = False
                else:
                    continue

            if (
                line.strip().startswith(".. code-block")
                or line.strip().startswith(".. code-tab")
                or line.strip().startswith(".. code")
            ):
                in_code_block = True
                code_block_indent = indent
                continue

            if indent in indents:
                indents = indents[: indents.index(indent) + 1]
                is_prev_unordered_list = line.strip().startswith("- ")
                continue

            if indent == indents[-1] + 3 or (
                indent == indents[-1] + 2 and is_prev_unordered_list
            ):
                indents.append(indent)
                is_prev_unordered_list = line.strip().startswith("- ")
                continue

            yield line_num + 1, self.CODE, "Indent level mismatch"


class CheckInteriorSpaces(ContentCheck):
    """
    - make sure sentences only have 1 space separating them
    """

    CODE = "WUMBO012"
    REPORTS = frozenset([CODE])

    REGEX = re.compile(r".  [A-Za-z0-9]")

    def report_iter(self, parsed_file: ParsedFile):

        lines = list(map(str.strip, parsed_file.contents.split("\n")))

        for paragraph in parsed_file.document.traverse(nodes.paragraph):
            if not paragraph.line:
                continue
            line_num = paragraph.line
            line = lines[line_num - 1]
            if self.REGEX.search(line):
                yield line_num, self.CODE, "Double space found"


class CheckImageAlt(ContentCheck):
    """
    - make sure all images have alt text
    """

    CODE = "WUMBO013"
    REPORTS = frozenset([CODE])

    def report_iter(self, parsed_file: ParsedFile):

        lines = list(map(str.strip, parsed_file.contents.split("\n")))

        for image in parsed_file.document.traverse(nodes.image):
            if "alt" not in image:
                section_line = image.parent.line

                if not section_line:
                    if image.parent.parent:
                        section_line = image.parent.parent.line
                    else:
                        section_line = 0

                for idx, line in enumerate(
                    lines[section_line:], start=section_line + 1
                ):
                    if f".. image:: {image['uri']}" in line:
                        yield idx, self.CODE, "Image does not have alt text"


class CheckSingleLineParagraph(ContentCheck):
    """
    - make sure all paragraphs are on a single line
    """

    CODE = "WUMBO014"
    REPORTS = frozenset([CODE])

    def report_iter(self, parsed_file: ParsedFile):
        lines = list(map(str.strip, parsed_file.contents.split("\n")))
        p_line_nums = set(
            p.line
            for p in parsed_file.document.traverse(nodes.paragraph)
            if p.line != None and not isinstance(p.parent, nodes.Part)
        )

        for p_line_num in p_line_nums:
            if p_line_num + 1 not in p_line_nums:
                if p_line_num < len(lines) and lines[p_line_num]:
                    yield p_line_num, self.CODE, "Multiline paragraph found"
