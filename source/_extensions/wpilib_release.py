import textwrap
from datetime import datetime
from typing import Any, Dict, Iterable, List

import markdown2
from docutils import nodes
from docutils.parsers.rst import directives
from docutils.statemachine import StringList
from sphinx.application import Sphinx
from sphinx.errors import ExtensionError
from sphinx.util import requests
from sphinx.util.docutils import SphinxDirective, switch_source_input


class WpilibRelease(SphinxDirective):
    has_content = True
    required_arguments = 1
    optional_arguments = 0
    final_argument_whitespace = True

    def run(self) -> List[nodes.Node]:

        version: str = self.arguments[0]

        release_url = f"https://api.github.com/repos/wpilibsuite/allwpilib/releases/tags/{version}"
        release_json = requests.get(release_url)
        release: Dict = release_json.json()

        win = next(
            (a for a in release["assets"] if "windows" in a["name"].lower()), None
        )
        mac_intel = next(
            (
                a
                for a in release["assets"]
                if "mac" in a["name"].lower() and "intel" in a["name"].lower()
            ),
            None,
        )
        mac_arm = next(
            (
                a
                for a in release["assets"]
                if "mac" in a["name"].lower() and "arm" in a["name"].lower()
            ),
            None,
        )

        # There's something weird going where the hashes are all printed on one line.
        # This works aroung that.
        release_notes = release["body"].replace("\r", "")

        r2 = release_notes.split("```")
        for i in range(1, len(r2), 2):
            r2[i] = r2[i].strip("\n").replace("\n", r"<br>")

        release_notes: str = markdown2.markdown("```".join(r2)).replace(
            "&lt;br&gt;", "<br>"
        )

        generated_rst = f"""
.. card:: {release["name"]} - {datetime.strptime('2023-01-04T17:53:55Z', '%Y-%m-%dT%H:%M:%SZ').strftime('%B %d, %Y')}

   WPILib Installer
   ^^^
   .. button-link:: {release["html_url"]}
      :color: primary
      :shadow:
      :expand:
      :class: wpilibrelease-dl-button

      Downloads

   `Downloads for other platforms <{release["html_url"]}>`_

   .. dropdown:: Release Notes
      
      .. raw:: html

         {textwrap.indent(release_notes, " " * 9, predicate=lambda line: True)}

   .. raw:: html

      <script>
        addEventListener('DOMContentLoaded', async (event) => {{
            let dlbutton = document.getElementsByClassName("wpilibrelease-dl-button")[0];
            let ua = await navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness', 'mobile', 'platform', 'platformVersion']);
            if (ua['platform'] == 'Windows') {{
                dlbutton.href = '{win["browser_download_url"]}';
                dlbutton.text = 'Download for Windows - {win["size"] / 1e9 : .2f} GB';
            }} else if (ua['platform'] == 'macOS') {{
                if (ua['architecture'] == 'x86') {{
                    dlbutton.href = '{mac_intel["browser_download_url"]}';
                    dlbutton.text = 'Download for macOS Intel - {mac_intel["size"] / 1e9 : .2f} GB';
                }} else if (ua['architecture'].includes('arm')) {{
                    dlbutton.href = '{mac_arm["browser_download_url"]}';
                    dlbutton.text = 'Download for macOS Arm | Apple Silicon {mac_arm["size"] / 1e9 : .2f} GB';
                }}
            }}
        }});
      </script>
"""

        sl = StringList()

        for line_num, line in enumerate(generated_rst.splitlines()):
            sl.append(line, "wpilibrelease_auto_generated.rst", line_num)

        with switch_source_input(self.state, sl):
            node = nodes.section(sl)
            self.state.nested_parse(sl, 0, node)
            return node.children


def setup(app: Sphinx) -> Dict[str, Any]:
    directives.register_directive("wpilibrelease", WpilibRelease)

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": False,
    }
