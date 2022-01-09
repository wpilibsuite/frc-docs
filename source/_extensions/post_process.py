# This file is the final sphinx extension that runs after a build is finished.
# Everything scheduled in do() is run sequentially and may need order preserved.
# Sphinx extensions can specify their execution priority but it's cumbersome to
# increment a value across files.

from typing import Any, Dict, Union

from sphinx.application import Sphinx
from sphinx.builders.dirhtml import DirectoryHTMLBuilder
from sphinx.builders.html import StandaloneHTMLBuilder

from .post_process_tasks.fontawesome import (
    cleanup_fontawesome_css,
    cleanup_fontawesome_font_files,
)

from .post_process_tasks.systemfonts import switch_to_system_fonts

READTHEDOCS_BUILDERS = ["readthedocs", "readthedocsdirhtml"]


def do(app: Sphinx, exception: Union[Exception, None]) -> None:
    if exception:
        return
    if not (
        isinstance(app.builder, (StandaloneHTMLBuilder, DirectoryHTMLBuilder))
        or app.builder.name in READTHEDOCS_BUILDERS
    ):
        return

    print("Running custom post processing")

    # The two fontawesome functions must run in order
    cleanup_fontawesome_css(app)
    cleanup_fontawesome_font_files(app)
    switch_to_system_fonts(app)


def setup(app: Sphinx) -> Dict[str, Any]:
    app.connect("build-finished", do, float("inf"))

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
