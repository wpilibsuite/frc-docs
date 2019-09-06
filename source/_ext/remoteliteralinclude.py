import codecs
import requests
import sys
import warnings
from difflib import unified_diff

from docutils import nodes
from docutils.parsers.rst import directives
from docutils.statemachine import ViewList
from six import text_type

from sphinx import addnodes
from sphinx.deprecation import RemovedInSphinx40Warning
from sphinx.locale import __
from sphinx.util import logging
from sphinx.util import parselinenos
from sphinx.util.docutils import SphinxDirective
from sphinx.util.nodes import set_source_info
from sphinx.directives.code import dedent_lines
from sphinx.directives.code import CodeBlock
from sphinx.directives.code import logger
from sphinx.directives.code import container_wrapper

from sphinx.domains import Domain

class RemoteLiteralIncludeReader(object):
    INVALID_OPTIONS_PAIR = [
        ('lineno-match', 'lineno-start'),
        ('lineno-match', 'append'),
        ('lineno-match', 'prepend'),
        ('start-after', 'start-at'),
        ('end-before', 'end-at'),
        ('diff', 'pyobject'),
        ('diff', 'lineno-start'),
        ('diff', 'lineno-match'),
        ('diff', 'lines'),
        ('diff', 'start-after'),
        ('diff', 'end-before'),
        ('diff', 'start-at'),
        ('diff', 'end-at'),
    ]

    def __init__(self, url, options, config):
        # type: (unicode, Dict, Config) -> None
        self.url = url
        self.options = options
        self.encoding = options.get('encoding', config.source_encoding)
        self.lineno_start = self.options.get('lineno-start', 1)

        self.parse_options()

    def parse_options(self):
        # type: () -> None
        for option1, option2 in self.INVALID_OPTIONS_PAIR:
            if option1 in self.options and option2 in self.options:
                raise ValueError(__('Cannot use both "%s" and "%s" options') %
                                 (option1, option2))

    def read_file(self, url, location=None):
        # type: (unicode, Any) -> List[unicode]
        # try:
            # with codecs.open(url, 'r', self.encoding, errors='strict') as f:  # type: ignore  # NOQA
            #     text = f.read()  # type: unicode
        text = requests.get(url).text
        if text:
            if 'tab-width' in self.options:
                text = text.expandtabs(self.options['tab-width'])

            return text.splitlines(True)
        else:
            raise IOError(__('Include file %r not found or reading it failed') % url)
        # except (IOError, OSError):
        #     raise IOError(__('Include file %r not found or reading it failed') % url)
        # except UnicodeError:
        #     raise UnicodeError(__('Encoding %r used for reading included file %r seems to '
        #                           'be wrong, try giving an :encoding: option') %
        #                        (self.encoding, url))

    def read(self, location=None):
        # type: (Any) -> Tuple[unicode, int]
        if 'diff' in self.options:
            lines = self.show_diff()
        else:
            filters = [self.pyobject_filter,
                       self.start_filter,
                       self.end_filter,
                       self.lines_filter,
                       self.prepend_filter,
                       self.append_filter,
                       self.dedent_filter]
            lines = self.read_file(self.url, location=location)
            for func in filters:
                lines = func(lines, location=location)

        return ''.join(lines), len(lines)

    def show_diff(self, location=None):
        # type: (Any) -> List[unicode]
        new_lines = self.read_file(self.url)
        old_url = self.options.get('diff')
        old_lines = self.read_file(old_url)
        diff = unified_diff(old_lines, new_lines, old_url, self.url)
        return list(diff)

    def pyobject_filter(self, lines, location=None):
        # type: (List[unicode], Any) -> List[unicode]
        pyobject = self.options.get('pyobject')
        if pyobject:
            from sphinx.pycode import ModuleAnalyzer
            analyzer = ModuleAnalyzer.for_file(self.url, '')
            tags = analyzer.find_tags()
            if pyobject not in tags:
                raise ValueError(__('Object named %r not found in include file %r') %
                                 (pyobject, self.url))
            else:
                start = tags[pyobject][1]
                end = tags[pyobject][2]
                lines = lines[start - 1:end]
                if 'lineno-match' in self.options:
                    self.lineno_start = start

        return lines

    def lines_filter(self, lines, location=None):
        # type: (List[unicode], Any) -> List[unicode]
        linespec = self.options.get('lines')
        if linespec:
            linelist = parselinenos(linespec, len(lines))
            if any(i >= len(lines) for i in linelist):
                logger.warning(__('line number spec is out of range(1-%d): %r') %
                               (len(lines), linespec), location=location)

            if 'lineno-match' in self.options:
                # make sure the line list is not "disjoint".
                first = linelist[0]
                if all(first + i == n for i, n in enumerate(linelist)):
                    self.lineno_start += linelist[0]
                else:
                    raise ValueError(__('Cannot use "lineno-match" with a disjoint '
                                        'set of "lines"'))

            lines = [lines[n] for n in linelist if n < len(lines)]
            if lines == []:
                raise ValueError(__('Line spec %r: no lines pulled from include file %r') %
                                 (linespec, self.url))

        return lines

    def start_filter(self, lines, location=None):
        # type: (List[unicode], Any) -> List[unicode]
        if 'start-at' in self.options:
            start = self.options.get('start-at')
            inclusive = False
        elif 'start-after' in self.options:
            start = self.options.get('start-after')
            inclusive = True
        else:
            start = None

        if start:
            for lineno, line in enumerate(lines):
                if start in line:
                    if inclusive:
                        if 'lineno-match' in self.options:
                            self.lineno_start += lineno + 1

                        return lines[lineno + 1:]
                    else:
                        if 'lineno-match' in self.options:
                            self.lineno_start += lineno

                        return lines[lineno:]

            if inclusive is True:
                raise ValueError('start-after pattern not found: %s' % start)
            else:
                raise ValueError('start-at pattern not found: %s' % start)

        return lines

    def end_filter(self, lines, location=None):
        # type: (List[unicode], Any) -> List[unicode]
        if 'end-at' in self.options:
            end = self.options.get('end-at')
            inclusive = True
        elif 'end-before' in self.options:
            end = self.options.get('end-before')
            inclusive = False
        else:
            end = None

        if end:
            for lineno, line in enumerate(lines):
                if end in line:
                    if inclusive:
                        return lines[:lineno + 1]
                    else:
                        if lineno == 0:
                            return []
                        else:
                            return lines[:lineno]
            if inclusive is True:
                raise ValueError('end-at pattern not found: %s' % end)
            else:
                raise ValueError('end-before pattern not found: %s' % end)

        return lines

    def prepend_filter(self, lines, location=None):
        # type: (List[unicode], Any) -> List[unicode]
        prepend = self.options.get('prepend')
        if prepend:
            lines.insert(0, prepend + '\n')

        return lines

    def append_filter(self, lines, location=None):
        # type: (List[unicode], Any) -> List[unicode]
        append = self.options.get('append')
        if append:
            lines.append(append + '\n')

        return lines

    def dedent_filter(self, lines, location=None):
        # type: (List[unicode], Any) -> List[unicode]
        if 'dedent' in self.options:
            return dedent_lines(lines, self.options.get('dedent'), location=location)
        else:
            return lines


class RemoteLiteralInclude(SphinxDirective):
    """
    Like ``.. include:: :literal:``, but only warns if the include file is
    not found, and does not raise errors.  Also has several options for
    selecting what to include.
    """

    has_content = False
    required_arguments = 1
    optional_arguments = 0
    final_argument_whitespace = True
    option_spec = {
        'dedent': int,
        'linenos': directives.flag,
        'lineno-start': int,
        'lineno-match': directives.flag,
        'tab-width': int,
        'language': directives.unchanged_required,
        'encoding': directives.encoding,
        'pyobject': directives.unchanged_required,
        'lines': directives.unchanged_required,
        'start-after': directives.unchanged_required,
        'end-before': directives.unchanged_required,
        'start-at': directives.unchanged_required,
        'end-at': directives.unchanged_required,
        'prepend': directives.unchanged_required,
        'append': directives.unchanged_required,
        'emphasize-lines': directives.unchanged_required,
        'caption': directives.unchanged,
        'class': directives.class_option,
        'name': directives.unchanged,
        'diff': directives.unchanged_required,
    }

    def run(self):
        # type: () -> List[nodes.Node]
        document = self.state.document
        if not document.settings.file_insertion_enabled:
            return [document.reporter.warning('File insertion disabled',
                                              line=self.lineno)]
        # convert options['diff'] to absolute path
        if 'diff' in self.options:
            _, path = self.env.relfn2path(self.options['diff'])
            self.options['diff'] = path

        try:
            location = self.state_machine.get_source_and_line(self.lineno)
            url = self.arguments[0]

            reader = RemoteLiteralIncludeReader(url, self.options, self.config)
            text, lines = reader.read(location=location)

            retnode = nodes.literal_block(text, text, source=url)
            set_source_info(self, retnode)
            if self.options.get('diff'):  # if diff is set, set udiff
                retnode['language'] = 'udiff'
            elif 'language' in self.options:
                retnode['language'] = self.options['language']
            retnode['linenos'] = ('linenos' in self.options or
                                  'lineno-start' in self.options or
                                  'lineno-match' in self.options)
            retnode['classes'] += self.options.get('class', [])
            extra_args = retnode['highlight_args'] = {}
            if 'emphasize-lines' in self.options:
                hl_lines = parselinenos(self.options['emphasize-lines'], lines)
                if any(i >= lines for i in hl_lines):
                    logger.warning(__('line number spec is out of range(1-%d): %r') %
                                   (lines, self.options['emphasize-lines']),
                                   location=location)
                extra_args['hl_lines'] = [x + 1 for x in hl_lines if x < lines]
            extra_args['linenostart'] = reader.lineno_start

            if 'caption' in self.options:
                caption = self.options['caption'] or self.arguments[0]
                retnode = container_wrapper(self, retnode, caption)

            # retnode will be note_implicit_target that is linked from caption and numref.
            # when options['name'] is provided, it should be primary ID.
            self.add_name(retnode)

            return [retnode]
        except Exception as exc:
            return [document.reporter.warning(text_type(exc), line=self.lineno)]

def setup(app):
    directives.register_directive('remoteliteralinclude', RemoteLiteralInclude)