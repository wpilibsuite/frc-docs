import os
from functools import wraps
from typing import Any, Dict

from docutils import nodes
from sphinx import addnodes
from sphinx.application import Sphinx
from sphinx.application import logger
from sphinx.directives.other import TocTree


def NoWarnings(func):
    @wraps(func)
    def wrapped(self, *args, **kwargs):
        stream = self.state.document.reporter.stream
        self.state.document.reporter.stream = None
        ret = func(self, *args, **kwargs)
        self.state.document.reporter.stream = stream
        ret = list(filter(lambda node: not isinstance(node, nodes.system_message), ret))
        return ret

    return wrapped


class NoWarningsToctree(TocTree):
    @NoWarnings
    def run(self):
        return super().run()

    @NoWarnings
    def parse_content(self, toctree: addnodes.toctree):
        return super().parse_content(toctree)


def on_rtd() -> bool:
    return os.getenv("READTHEDOCS") == "True"


def on_pr(html_context: Dict[str, str]) -> bool:
    return (
        html_context["github_version"].startswith(
            os.environ.get("READTHEDOCS_GIT_COMMIT_HASH")[:8]
        )
        or os.getenv("GITHUB_EVENT_NAME") == "pull_request"
    )


def inject_changed_files(html_context: Dict[str, str], app: Sphinx) -> None:
    import requests

    res = requests.get(
        f"https://api.github.com/repos/{html_context['github_user']}/{html_context['github_repo']}/pulls/{os.environ.get('READTHEDOCS_VERSION_NAME')}/files"
    )

    if res.status_code != requests.codes.ok:
        return

    changes_rst = "".join(
        [
            "\n",
            ".. nowarningstoctree::\n",
            "   :maxdepth: 1\n",
            "   :caption: PR CHANGED FILES\n",
            "\n",
        ]
    )

    if app.config.delta_inject_location is None:
        inject_location = "index.rst"
    else:
        inject_location = app.config.delta_inject_location

    for file_context in res.json():
        status: str = file_context["status"]
        filename: str = file_context["filename"]

        if app.config.delta_doc_path is None:
            logger.error("Required option delta_doc_path is not set!")
        if status == "removed":
            continue
        if not filename.startswith(app.config.delta_doc_path):
            continue
        if not filename.endswith(".rst"):
            continue

        rel_path = os.path.relpath(filename, app.config.delta_doc_path)
        if rel_path == inject_location:
            continue
        changes_rst += f"   {rel_path}\n"

    changes_rst += "\n\n.. todolist::\n"

    inject_location = os.path.join(app.srcdir, inject_location)
    with open(inject_location, "a") as f:
        f.write(changes_rst)


def config_inited(app: Sphinx, config: Dict[str, Any]):
    if on_rtd() and on_pr(config["html_context"]):
        inject_changed_files(config["html_context"], app)


def setup(app: Sphinx) -> Dict[str, Any]:
    app.connect("config-inited", config_inited)
    app.add_config_value("delta_doc_path", None, str)
    app.add_config_value("delta_inject_location", None, str)
    app.add_directive("nowarningstoctree", NoWarningsToctree)

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
