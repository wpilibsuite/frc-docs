.. include:: <isonum.txt>

Style Guide
===========

This document contains the various RST/Sphinx specific guidelines for the frc-docs project. For guidelines related to the various WPILib code projects, see `the WPILib GitHub <https://github.com/wpilibsuite/styleguide>`__

Filenames
---------

Use only lowercase alphanumeric characters and ``-`` (minus) symbol.

For documents that will have an identical software/hardware name, append "Hardware" or "Software" to the end of the document name. IE, ``ultrasonics-hardware.rst``

Suffix filenames with the ``.rst`` extension.

.. note:: If you are having issues editing files with the ``.rst`` extension, the recommended text editor is `Notepad++ <https://notepad-plus-plus.org/>`__. Please make sure that `tabs are replaced with spaces <https://stackoverflow.com/questions/455037/convert-tabs-to-spaces-in-notepad>`__, and the space indentation is set to ``3``.

Page References
---------------

Pages references will be auto-generated based on the page filename and section title.

For example, given the following file ``contributing.rst`` and a section called ``Page References``, you would reference this by doing ``:ref:`contributing:Page References```

.. note:: Please note that document structure is preserved in references, with the root being the location of the ``conf.py`` file. To access documents in sub-folders, simply prepend the folder path before the filename. IE, ``:ref:`docs/software/sensors/ultrasonics-sensors:Ultrasonics - Sensors```

Text
----

All text content should be on the same line, if you need readability, use the word-wrap function of your editor.

Use the following case for these terms:

- roboRIO (not RoboRIO, roboRio, or RoboRio)
- LabVIEW (not labview or LabView)
- Visual Studio Code (VS Code) (not vscode, VScode, vs code, etc)
- macOS (not Mac OS, Mac OSX, Mac OS X, Mac, Mac OS, etc.)
- GitHub (not github, Github, etc)
- PowerShell (not powershell, Powershell, etc)
- Linux (not linux)
- Java (not java)

Use the ASCII character set for English text. For special characters (e.g. Greek symbols) use the `standard character entity sets <https://docutils.sourceforge.io/docs/ref/rst/definitions.html#character-entity-sets>`_.

Use ``.. math::`` for standalone equations and ``:math:`` for inline equations.  A useful LaTeX equation cheat sheet can be found `here <https://www.reed.edu/academic_support/pdfs/qskills/latexcheatsheet.pdf>`_.

Use literals for filenames, function, and variable names.

Use of the registered trademarks *FIRST*\ |reg| and FRC\ |reg| should follow the Policy from `this page <https://www.firstinspires.org/brand>`__. Specifically, where possible (i.e. not nested inside other markup or in a document title), the first use of the trademarks should have the |reg| symbol and all instances of *FIRST* should be italicized. The |reg| symbol can be added by using ``.. include:: <isonum.txt>`` at the top of the document and then using ``*FIRST*\ |reg|`` or ``FRC\ |reg|``.

Whitespace
----------

Indentation
^^^^^^^^^^^

Indentation should *always* match the previous level of indentation *unless* you are creating a new content block.

Indentation of content directives as new line ``.. toctree::``  should be `3` spaces.

Blank Lines
^^^^^^^^^^^

There should be ``1`` blank lines separating basic text blocks and section titles. There *should* be ``1`` blank line separating text blocks *and* content directives.

Interior Whitespace
^^^^^^^^^^^^^^^^^^^

Use one space between sentences.

Headings
--------

Headings should be in the following structure. Heading underlines should match the same number of characters as the heading itself.

1. ``=`` for document titles. *Do not* use this more than *once* per article.
2. ``-`` for document sections
3. ``^`` for document sub-sections
4. ``~`` for document sub-sub-sections
5. If you need to use any lower levels of structure, you're doing things wrong.

Use title case for headings.

Lists
-----

Lists should have a new line in between each indent level. The highest indent should have ``0`` indentation, and subsequent sublists should have an indentation starting at the first character of the previous indentation.

.. code-block:: ReST

   - Block one
   - Block two
   - Block three

     - Sub 1
     - Sub 2

   - Block four

Code blocks
-----------

All code blocks should have a language specified.

1. Exception: Content where formatting must be preserved and has no language. Instead use ``text``.

Follow the `WPILib style guide <https://github.com/wpilibsuite/styleguide/>`_ for C++ and Java example code. For example, use two spaces for indentation in C++ and Java.

Admonitions
-----------

Admonitions (list `here <https://docutils.sourceforge.io/docs/ref/rst/directives.html#admonitions>`__) should have their text on the same line as the admonition itself. There are exceptions to this rule however, when having multiple sections of content inside of admonition. Generally having multiple sections of content inside of an admonition is not recommended.

Use

.. code-block:: ReST

   .. warning:: This is a warning!

NOT

.. code-block:: ReST

   .. warning::
      This is a warning!

Links
-----

It is preferred to format links as anonymous hyperlinks. The important thing to note is the **two** underscores appending the text. In the situation that only one underscore is used, issues may arise when compiling the document.

.. code-block:: ReST

   Hi there, `this is a link <https://example.com>`__ and it's pretty cool!

However, in some cases where the same link must be referenced multiple times, the syntax below is accepted.

.. code-block:: ReST

   Hi there, `this is a link`_ and it's pretty cool!

   ..  _this is a link: https://example.com

Images
------

Images should be created with ``1`` new line separating content and directive.

All images (including vectors) should be less than ``500`` kilobytes in size. Please make use of a smaller resolution and more efficient compression algorithms.

.. code-block:: ReST

   .. image:: images/my-article/my-image.png

Image Files
^^^^^^^^^^^

Image files should be stored in the document directory, sub-directory of ``document-name/images``

They should follow the naming scheme of ``short-description.png``, where the name of the image is a short description of what the image shows. This should be less than ``24`` characters.

They should be of the ``.png`` or ``.jpg`` image extension. ``.gif`` is unacceptable due to storage and accessibility concerns.

.. note:: Accessibility is important! Images should be marked with a ``:alt:`` directive.

          .. code-block:: ReST

             .. images:: images/my-document/my-image.png
                :alt: An example image

Vector Images
^^^^^^^^^^^^^

SVG files are supported through the ``svg2pdfconverter`` Sphinx extension.

Simply use them as you would with any other image.

.. note:: Ensure that any embedded images in the vector do not bloat the vector to exceed the 500KB limit.

.. code-block:: ReST

   .. image:: images/my-document/my-image.svg

Draw.io Diagrams
^^^^^^^^^^^^^^^^

Draw.io (also known as `diagrams.net <https://app.diagrams.net/>`__) diagrams are supported through ``svg`` files with embedded ``.drawio`` metadata, allowing the ``svg`` file to act as a source file of the diagrams, and to be rendered like a normal vector graphics file.

Simply use them like you would any other vector image, or any other image.

.. code-block:: ReST

   .. images:: diagrams/my-document/diagram-1.drawio.svg

Draw.io Files
~~~~~~~~~~~~~

Draw.io files follow almost the same naming scheme as normal images. To keep track of files that have the embedded ``.drawio`` metadata, append a ``.drawio`` to the end of the file name, before the extension, meaning the name of the file should be ``document-title-1.drawio.svg`` and so on. Additionally, diagrams should be stored in the document directory in a sub-folder named ``diagrams``.

For the specifics of saving a diagram as a ``.svg`` with metadata, take a look at :ref:`docs/contributing/frc-docs/drawio-saving-instructions:Draw.io Saving Instructions`.

.. warning:: Make sure you don't modify any file that is in a ``diagrams`` folder, or ends in ``.drawio.svg`` in any program other than draw.io, otherwise you might risk breaking the metadata of the file, making it uneditable.

File Extensions
---------------

File extensions should use code formatting. For example, use:

.. code-block:: text

   ``.png``

instead of:

.. code-block:: text

   .png
   ".png"
   "``.png``"

Table of Contents (TOC)
-----------------------

Each category should contain an ``index.rst``. This index file should contain a ``maxdepth`` of ``1``. Sub-categories are acceptable, with a ``maxdepth`` of 1.

The category ``index.rst`` file can then be added added to the root index file located at ``source/index.rst``.

Examples
--------

.. code-block:: ReST

   Title
   =====
   This is an example article

   .. code-block:: java

      System.out.println("Hello World");

   Section
   -------
   This is a section!

Important Note!
---------------

This list is not exhaustive and administrators reserve the right to make changes. Changes will be reflected in this document.
