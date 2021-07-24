import re
from dataclasses import dataclass
from os import PathLike
from pathlib import Path
from typing import Any, Dict, List

# There's a few ways to support avif:
# 1. imagemagick
# 2. pillow with `avif`
# 3. pillow with `pillow_avif`
## Re 1. I haven't tried imagemagick but it has recently added support for avif. It
# supports avif via libheif not libavif. It has to be compiled with a newer
# libheif and a newer libaom so idk how well supported it is yet. I've seen a
# github issue with some users reporting that they were seeing silent failures
# while encoding avif files so I didn't try imagemagick. If desired, we can
# test it out and switch all image conversion from pillow to imagemagick.
# Later: Imagemagick does work.
## Re 2. `avif` requires users to compile their own libavif + libaom and have it
# available on their system so meh.
## Re 3. `pillow_avif` conveniently packages its own libavif and seems to have
# full wheels for a few OSes so I went for this as my first (and only) try.
import pillow_avif
from bs4 import BeautifulSoup, Tag
from docutils.nodes import Node
from docutils.writers.html5_polyglot import HTMLTranslator
from PIL import Image
from sphinx.application import Sphinx
from sphinx.builders.dirhtml import DirectoryHTMLBuilder
from sphinx.builders.html import StandaloneHTMLBuilder
from sphinx.transforms.post_transforms.images import CRITICAL_PATH_CHAR_RE
from sphinx.util import status_iterator
from sphinx.util.osutil import ensuredir

READTHEDOCS_BUILDERS = ["readthedocs", "readthedocsdirhtml"]


@dataclass
class ImgData:
    src_path: PathLike
    dest_path: PathLike
    width: int
    height: int


def builder_init(app: Sphinx):
    if (
        type(app.builder) not in (StandaloneHTMLBuilder, DirectoryHTMLBuilder)
        and app.builder.name not in READTHEDOCS_BUILDERS
    ):
        return

    # We'll store all the metadata needed to convert images so that we can
    # defer all the work to the copying-images phase of the build and let the
    # write phase run faster
    img_datas: List[ImgData] = []

    # Monkey patch wrap whatever the existing `visit_image`
    translator_cls = app.builder.get_translator_class()
    old_visit_image = translator_cls.visit_image

    def new_visit_image(self: HTMLTranslator, node: Node):
        """
        Wrap the existing `new_visit_image`.
        Let the old one generate an img tag using all of its own logic first.
        Then, we yoink that from the body and replace it with one wrapped in
        a picture tag.

        Example:

            Before (existing docutils translator):
                <img src="...", alt="..." />

            After (monkeypatch - this func):
                <picture>
                    <source type="...", srcset="...", sizes="..." />
                    <source type="...", srcset="...", sizes="..." />
                    <img src="...", alt="..." srcset="...", sizes="...", loading="lazy", decoding="async"/>
                </picture>

        We also add support for lazy loading images and asynchronously them.
        """
        old_visit_image(self, node)

        # todo: restrict this to html builders or split responsive image
        # generation from html manipulation so that pdf/epub builders can
        # benefit from lower resolution images too. That use-case could just
        # be in a separate extension though.

        img_tag_str = self.body[-1]
        img_uri = node["uri"]
        if "://" in img_uri:
            # Check if image is remote. We could take the check from
            # sphinx-contrib/images - it's more robust
            return
        img_ext = Path(img_uri).suffix
        if img_ext not in {".png", ".jpg", ".jpeg"}:
            # We should support svgs too. In that case. svg would be the
            # preferred format while raster versions would be the fallback.
            return
        img_src_path: Path = Path(app.srcdir) / node["candidates"]["*"]
        imagedir = Path(app.builder.outdir) / app.builder.imagedir
        img_dest_path = imagedir / (
            re.sub(CRITICAL_PATH_CHAR_RE, "_", img_src_path.stem) + img_src_path.suffix
        )
        ensuredir(imagedir)

        # __import__('code').interact(local={**locals(), **globals()})

        soup_img: Tag = BeautifulSoup(img_tag_str, features="html.parser").img
        soup_picture: Tag = BeautifulSoup().new_tag("picture")
        # soup.img.wrap(soup.new_tag("picture"))

        # Move height / width to picture. The img tag will hold the actual
        # resolution of the image file and its parent, picture, will hold
        # the desired size constraints.
        if "height" in soup_img.attrs:
            soup_picture.attrs["height"] = soup_img.attrs["height"]
            del soup_img.attrs["height"]

        if "width" in soup_img.attrs:
            soup_picture.attrs["width"] = soup_img.attrs["width"]
            del soup_img.attrs["width"]

        # Lazy + async load by default
        # There is an open docutils feature request
        # (https://sourceforge.net/p/docutils/feature-requests/78/)
        # adding support for lazy loading that will probably target
        # docutils 0.18. lazy loading can probably be removed from
        # here at that point unless we'd like to continue
        # default-enabling it.
        if "loading" not in soup_img.attrs:
            soup_img.attrs["loading"] = "lazy"

        if "decoding" not in soup_img.attrs:
            soup_img.attrs["decoding"] = "async"

        with Image.open(img_src_path) as im:
            im_width, im_height = im.size

        # Set image ratio. Browsers need the aspect ratio of the image for
        # non-janky lazyloading. We can either give it the aspect ratio
        # or the height and width. Height and width is apparently better
        # for better legacy support
        soup_img.attrs["height"] = im_height
        soup_img.attrs["width"] = im_width

        # in order of preference. For us, that is order of performance
        dest_exts = [
            ".avif",
            ".webp",
            img_ext,  # png or jpg/jpeg
        ]

        for dest_ext in dest_exts:
            srcset = []
            widths = list(range(250, min(1000, im_width) + 1, 250))
            if im_width not in widths:
                widths.append(im_width)
            for w in widths:
                h = w * im_height // im_width
                new_dest = img_dest_path.with_name(
                    f"{img_dest_path.stem}-{w}{dest_ext}"
                )

                new_uri = Path(soup_img.attrs["src"]).with_name(
                    f"{img_dest_path.stem}-{w}{dest_ext}"
                )

                img_datas.append(
                    ImgData(
                        src_path=img_src_path, dest_path=new_dest, width=w, height=h
                    )
                )

                srcset.append(f"{new_uri} {w}w")

            srcset = ", ".join(srcset)

            # `sizes` should account for `.wy-nav-content`'s padding but it's very
            # theme and frc-docs customization specifc and is different for
            # the desktop and mobile themes. If this is going to be kept
            # frc-docs specific, then we can hardcode it or (preferably)
            # auto-populate from `frc-rtd.css`. Otherwise, using the
            # max viewport width is a good enough (TM) (overestimate) approach.
            # However, we can make this accurate and fully automated for "all"
            # scenarios with some work:
            # 1. Finish the standard html build as is without any monkeypatching
            # 2. Open every webpage in a headless browser instance
            # 3. Iterate over browser width 1-2000 and note the width of each image
            # 4. Use that mapping to generate the sizes attribute.
            # This would be a pretty robust solution since most documentation
            # changes layout based on viewport width and not on whether the
            # browser is reporting as mobile or desktop.
            if "width" in soup_picture.attrs:
                sizes = f"min({soup_picture.attrs['width']}px, 100vw)"
            elif "height" in soup_picture.attrs:
                sizes = f"{soup_picture.attrs['height'] * im_width // im_height}px"
            else:
                sizes = (
                    f"min(min({im_width}px, 100vw), {app.config.max_viewport_width}px)"
                )

            if dest_ext == img_ext:
                # don't create a source; just append to the existing img
                soup_img.attrs["srcset"] = srcset
                soup_img.attrs["sizes"] = sizes

                # should be the last child
                soup_picture.append(soup_img)
            else:
                # non default filetypes need a source tag
                soup_source = BeautifulSoup().new_tag("source")
                if dest_ext == ".jpg":
                    # todo: dejank this edge case
                    source_type = f"image/jpeg"
                else:
                    source_type = f"image/{dest_ext[1:]}"

                soup_source.attrs["type"] = source_type
                soup_source.attrs["srcset"] = srcset
                soup_source.attrs["sizes"] = sizes

                soup_picture.append(soup_source)

        # __import__('code').interact(local={**locals(), **globals()})

        self.body.pop()
        self.body.append(str(soup_picture))
        # print(self.body[-1])

    translator_cls.visit_image = new_visit_image

    # Monkey patch wrap whatever the existing `copy_image_files` is
    old_copy_image_files = app.builder.copy_image_files

    def new_copy_image_files(*args):
        """
        Wrap the existing `copy_image_files`.
        Let the old one copy all the images then generate all the responsive
        images. This monkeypatch can probably be removed and generating images
        can be deferred properly into its own `finish task` on the html builder
        """
        old_copy_image_files(*args)
        for img_data in status_iterator(
            img_datas,
            "generating responsive images... ",
            "blue",
            len(img_datas),
            app.verbosity,
            stringify_func=lambda i: str(i.dest_path),
        ):
            img_data: ImgData

            with Image.open(img_data.src_path) as im:
                params = {}
                params["optimize"] = True

                ext = img_data.dest_path.suffix
                quality = app.config.minify_image_quality
                # quality = 80
                if ext in {".png", ".jpg", ".jpeg"}:
                    params["quality"] = int(quality)
                elif ext == ".avif":
                    ## x Approximation from jpeg quality to avif quality.
                    ## params["quality"] = int(1.04012**quality + 40.5783)
                    # We can set qmin and qmax separately for better performance.
                    # Squoosh defaults to ~48 so so will we
                    params["quality"] = 50
                    # 0 is slowest and 10 is fastest. Also effects quality
                    # pillow_avif defaults to 8. Google recommends 6 as a good balanced default.
                    # We use 5 because we're cool like that.
                    params["speed"] = int(5)
                elif ext == ".webp":
                    # Approximation from jpeg quality to webp quality
                    params["quality"] = int(
                        0.0025 * quality ** 2 + 0.565 * quality + 20.65
                    )

                im.resize((img_data.width, img_data.height), Image.LANCZOS).save(
                    str(img_data.dest_path), params=params
                )

    app.builder.copy_image_files = new_copy_image_files


def setup(app: Sphinx) -> Dict[str, Any]:
    # app.add_config_value("minify_image_quality", 80, "html")
    app.add_config_value("max_viewport_width", 1000, "html")
    app.connect("builder-inited", builder_init)

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }


# References:
# https://blog.logrocket.com/jank-free-page-loading-with-media-aspect-ratios/
# https://www.stefanjudis.com/snippets/a-picture-element-to-load-correctly-resized-webp-images-in-html/
# https://ericportis.com/posts/2014/srcset-sizes/
# https://css-tricks.com/sometimes-sizes-is-quite-important/
# https://medium.com/@MRWwebDesign/responsive-images-the-sizes-attribute-and-unexpected-image-sizes-882a2eadb6db
# https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture
# https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
# https://www.industrialempathy.com/posts/avif-webp-quality-settings/
