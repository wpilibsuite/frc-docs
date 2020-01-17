.. include:: <isonum.txt>

Adding field images to PathWeaver
=================================
Here are instructions for adding your own field image using the 2019 game as an example.

Games are loaded from the ``~/PathWeaver/Games`` on Linux and macOS or ``%USERPROFILE%/PathWeaver/Games`` directory on Windows. The files can be in either a game-specific subdirectory, or in a zip file in the Games directory. The ZIP file must follow the same layout as a game directory; the JSON file must be in the root of the ZIP file (cannot be in a subdirectory).

Download the example *FIRST* Destination Deep Space field definition :download:`here <files/DeepSpace.zip>`. Other field definitions are available in the `PathWeaver GitHub repository <https://github.com/wpilibsuite/PathWeaver/tree/master/src/main/resources/edu/wpi/first/pathweaver>`__.

File Layout
-----------
.. code-block:: text

   ~/PathWeaver
     /Games
       /Custom Game
         custom-game.json
         field-image.png
       OtherGame.zip

JSON Format
-----------
.. code-block:: text

   {
     "game": "game name",
     "field-image": "relative/path/to/img.png",
     "field-corners": {
       "top-left": [x, y],
       "bottom-right": [x, y]
     },
     "field-size": [width, length],
     "field-unit": "unit name"
   }

The path to the field image is relative to the JSON file. For simplicity, the image file should be in the same directory as the JSON file.

The field corners are the X and Y coordinates of the top-left and bottom-right pixels defining the rectangular boundary of the playable area in the field image. Non-rectangular playing areas are not supported.

The field size is the width and length of the playable area of the field in the provided units.

The field units are case-insensitive and can be in meters, cm, mm, inches, feet, yards, or miles. Singular, plural, and abbreviations are supported (e.g. "meter","meters", and"m"are all valid for specifying meters)
