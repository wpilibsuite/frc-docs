import textwrap
from datetime import datetime
from typing import Any, Dict, Iterable, List

import markdown2
from bs4 import BeautifulSoup
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
        release_json.raise_for_status()
        release: Dict = release_json.json()

        cf_folder = f"https://packages.wpilib.workers.dev/installer/{version}"
        artifactory_folder = (
            f"https://frcmaven.wpi.edu/api/download/installer/{version}"
        )

        def get_url_size(osname):
            release_data = requests.get(f"{cf_folder}/{osname}/")
            release_data.raise_for_status()
            soup = BeautifulSoup(release_data.text, "html.parser")
            file = str(soup.find_all("tr")[-1].contents[0].string)
            size = str(soup.find_all("tr")[-1].contents[2].string)
            url_part = f"/{osname}/{file}"
            return url_part, size

        win_download_url_part, win_size = get_url_size("Win64")
        mac_intel_download_url_part, mac_intel_size = get_url_size("macOS")
        mac_arm_download_url_part, mac_arm_size = get_url_size("macOSArm")

        # There's something weird going where the hashes are all printed on one line.
        # This works around that.
        release_notes = release["body"].replace("\r", "")

        r2 = release_notes.split("```")
        for i in range(1, len(r2), 2):
            r2[i] = r2[i].strip("\n").replace("\n", r"<br>")

        release_notes: str = markdown2.markdown("```".join(r2)).replace(
            "&lt;br&gt;", "<br>"
        )

        generated_rst = f"""
.. card:: {release["name"]} - {datetime.strptime(release['published_at'], '%Y-%m-%dT%H:%M:%SZ').strftime('%B %d, %Y')}

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
            let baseUrl;
            try {{
                await fetch("https://packages.wpilib.workers.dev/", {{ mode: "no-cors" }});
                baseUrl = "{cf_folder}";
            }} catch (e) {{
                baseUrl = "{artifactory_folder}";
            }}
            if (ua['platform'] == 'Windows') {{
                dlbutton.href = `${{baseUrl}}{win_download_url_part}`;
                dlbutton.text = 'Download for Windows - {win_size}';
            }} else if (ua['platform'] == 'macOS') {{
                if (ua['architecture'] == 'x86') {{
                    dlbutton.href = `${{baseUrl}}{mac_intel_download_url_part}`;
                    dlbutton.text = 'Download for macOS Intel - {mac_intel_size}';
                }} else if (ua['architecture'].includes('arm')) {{
                    dlbutton.href = `${{baseUrl}}{mac_arm_download_url_part}`;
                    dlbutton.text = 'Download for macOS Arm | Apple Silicon - {mac_arm_size}';
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
