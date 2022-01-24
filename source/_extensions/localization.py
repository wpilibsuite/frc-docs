from typing import Any, Dict

import docutils.nodes as nodes
from sphinx.application import Sphinx


def make_tag(language: str, link: str) -> str:
    return f'<link rel="alternate" hreflang="{language}" href="{link}" />'


def html_page_context(
    app: Sphinx,
    pagename: str,
    templatename: str,
    context: Dict[str, Any],
    doctree: nodes.document,
) -> None:
    if not doctree:
        return
    language = app.config.language or "en"
    localization_languages = app.config.localization_languages

    pageurl: str = context["pageurl"]

    tags = []
    for localization_language in localization_languages:
        local_pageurl = pageurl.replace(
            f"/{language}/", f"/{localization_language}/", 1
        )

        tags.append(make_tag(localization_language.replace("_", "-"), local_pageurl))

        if localization_language == "en":
            tags.append(make_tag("x-default", local_pageurl))

    context["metatags"] += "\n" + "\n".join(tags)


def setup(app: Sphinx) -> Dict[str, Any]:
    app.add_config_value("localization_languages", [], "html")

    app.connect("html-page-context", html_page_context)

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
