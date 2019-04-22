Adding field images to PathWeaver
=================================
The initial release of PathWeaver contained the field image for the FRC 2018 Game. The next update will include FIRST Destination Deep Space. Here are instructions for adding the 2019 game now or adding your own field image for some other application.

Games are loaded from the ``~/PathWeaver/Games`` on Linux and Mac or ``%USERPROFILE%/PathWeaver/Games`` directory on Windows. The files can be in either a game-specific subdirectory, or in a zip file in the Games directory. The ZIP file must follow the same layout as a game directory; the JSON file must be in the root of the ZIP file (cannot be in a subdirectory).

`FIRST Destination Deep Space <https://github.com/wpilibsuite/PathWeaver/files/2730942/DeepSpace.zip>`__ field definition.

File Layout
-----------
.. code-block:: none
   
   ~/PathWeaver
     /Games
       /Custom Game
         custom-game.json
         field-image.png
       OtherGame.zip

JSON Format
-----------
.. code-block:: none

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

The field units are case-insensitive and can be in meters, cm, mm, inches, feet, yards, or miles. Singular, plural, and abbreviations are supported (eg"meter","meters", and"m"are all valid for specifying meters)
