# Force RTD to build zip with regular html builder, not single html
# The builder is preloaded after all extensions are loaded, so we can
# change the registered class here.

# Also force photofinish off for installer storage reasons

from sphinx.builders.html import StandaloneHTMLBuilder
from sphinx.application import Sphinx
import sphinxext.photofinish as photofinish


class ReadtheDocsBuilderLocalMedia(StandaloneHTMLBuilder):
    name = "readthedocssinglehtmllocalmedia"

    def __init__(self, app: Sphinx, *args, **kwargs) -> None:
        super().__init__(app, *args, **kwargs)

        for listeners in app.events.listeners.values():
            for listener in listeners[:]:
                if listener.handler == photofinish.builder_init:
                    listeners.remove(listener)


def setup(app):
    app.add_builder(ReadtheDocsBuilderLocalMedia, override=True)
