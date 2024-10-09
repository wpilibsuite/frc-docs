from doc8 import main, parser
import sys
from pathlib import Path

sys.path.append((Path(__file__).parent / "../source/_extensions").as_posix())

from redown import redown

old_setattr = parser.ParsedFile.__setattr__


def new_setattr(self, name, value):
    if name == "_raw_content" and value is not None:
        value = redown(value.decode("utf-8").replace("\r", "")).encode("utf-8")
        # Path(self.filename).with_suffix(".rd").write_text(value.decode("utf-8"))
    old_setattr(self, name, value)


parser.ParsedFile.__setattr__ = new_setattr

sys.exit(main.main())
