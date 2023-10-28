from typing import Any, Dict

from docutils import nodes

from sphinx.transforms.post_transforms import SphinxPostTransform
from sphinx.application import Sphinx


class DefaultLaTeXImageSettingsTransform(SphinxPostTransform):
    """
    Set a default image width for images which do not have a width attribute
    manually set. Also center images which are not centered. This only applies
    to LaTeX builds.
    """

    default_priority = 100  # chosen arbitrarily

    def run(self, **kwargs: Any) -> None:
        if not self.app.tags.has("latex"):
            return

        width = self.app.config["default_latex_image_width"]

        for node in self.document.findall(nodes.image):
            if "width" not in node.attributes:
                node.attributes["width"] = width

            if (
                self.app.config["default_latex_image_centered"]
                and "align" not in node.attributes
            ):
                node.attributes["align"] = "center"


def setup(app: Sphinx) -> Dict[str, Any]:
    app.add_config_value("default_latex_image_width", "25em", True)
    app.add_config_value("default_latex_image_centered", True, True)
    app.add_post_transform(DefaultLaTeXImageSettingsTransform)

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
