import subprocess
import sys
from subprocess import PIPE, CalledProcessError
from typing import Any, Dict

from sphinx.application import Sphinx
from sphinx.errors import ExtensionError
from sphinx.locale import __
from sphinx.transforms.post_transforms.images import ImageConverter
from sphinx.util import logging
from png import FormatError

from PIL import Image

import os
import png

logger = logging.getLogger(__name__)

# Helper method to check if image has LabVIEW metadata
# Credit to VCubed
VI_CHUNK_TYPE = bytes("niVI", "utf-8")


def is_image_a_vi_snippet(image_path):
    with open(image_path, "rb") as image:
        reader = png.Reader(bytes=image.read())
    for chunk_type, chunk_data in reader.chunks():
        if chunk_type == VI_CHUNK_TYPE:
            return True
    return False


class ImageMinifier(ImageConverter):
    conversion_rules = [("image/png", "image/png"), ("image/jpeg", "image/jpeg")]

    def is_available(self) -> bool:
        if self.config.minify_only_rtd:
            if os.getenv("READTHEDOCS"):
                return True
            else:
                logger.info("Minify is disabled on local builds!")
                return False
        else:
            return True

    def convert(self, _from: str, _to: str) -> bool:
        try:
            with Image.open(_from) as image:
                if image.format is "PNG":
                    if is_image_a_vi_snippet(_from):
                        return False

                logger.info("Compressing Image")

                image.save(_to, quality=self.config.minify_image_quality, optimize=True)
                return True
        except OSError:
            logger.warning(__("Unable to convert file %r, " "please verify!"), _from)
            return False
        except FormatError:
            logger.error(__("There was an error processing the file %r"), _from)


def setup(app: Sphinx) -> Dict[str, Any]:
    app.add_config_value("minify_only_rtd", False, "html")
    app.add_config_value("minify_image_quality", 80, "html")
    app.add_post_transform(ImageMinifier)

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": False,
    }
