import re
from typing import List

from docutils import nodes
from docutils.nodes import Node
from docutils.statemachine import StringList, ViewList

import sphinx
from sphinx import addnodes
from sphinx.directives.other import TocTree

class TocTreeish(TocTree) :

    def run(self) -> List[Node]:
        assert self.options.get("hidden",False) == False

        rootln = nodes.bullet_list()

        delme = []
        for entry in self.content:
            node = addnodes.compact_paragraph()

            if re.search(r"\s", entry):
              if entry.startswith("_ "):
                # Raw syntax: parse...
                tmp = nodes.paragraph()
                self.state.nested_parse(ViewList([entry[2:]]), 0, tmp)

                # ... rip out the parsed thing into a compact paragraph...
                node += tmp.children[0].children

                # ... and prevent the real toctree from seeing it
                delme += [ entry ]
              else:
                assert False, "TocTreeish doesn't understand spaced things"
            elif entry == "self":
                assert False, "TocTreeish doesn't do 'self'"
            else:
                # Single word, must be a doc xref.  Fake one up!
                pxr = addnodes.pending_xref(entry, reftype='doc',
                        refdomain='std', refexplicit=False, reftarget=entry)
                pxr += nodes.inline('', entry, classes="xref std std-doc")
                node += pxr

            rootln.children += nodes.bullet_list('', nodes.list_item('', node))

        for d in delme:
            self.content.remove(d)

        self.options["hidden"] = True
        res = super().run()

        # Push our list into the wrapper that still gets generated despite
        # setting the toctree to hidden.
        wrappernode = res[-1]
        wrappernode.append(rootln)

        return res

def setup(app):
    app.add_directive("toctreeish", TocTreeish)
    return {'version': "1", 'parallel_read_safe': True}
