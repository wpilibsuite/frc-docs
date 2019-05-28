.. _contributing:

Contributing to frc-docs
========================

Welcome to the contributiong guidelines for the frc-docs project. If you are unfamiliar to writing in the reStructuredText format, please read up on it `here <https://thomas-cokelaer.info/tutorials/sphinx/rest_syntax.html>`__.

.. important:: Currently we are in the process of migrating documentation from the official screensteps. Please pardon the constant housekeeping. FIRST retains all rights to documentation and images provided. Credit for article will be in the `Github commit history. <https://github.com/wpilibsuite/frc-docs/graphs/commit-activity>`_

Mission Statement
-----------------

The WPILib Mission is to enable FIRST Robotics teams to focus on writing game-specific software rather than focusing on hardware details - "raise the floor, don't lower the ceiling". We work to enable teams with limited programming knowledge and/or mentor experience to be as successful as possible, while not hampering the abilities of teams with more advanced programming capabilities. We support Kit of Parts control system components directly in the library. We also strive to keep parity between major features of each language (Java, C++, and NI's LabVIEW), so that teams aren't at a disadvantage for choosing a specific programming language.

These docs serve to provide a learning ground for all FIRST Robotics Competition teams. Contributions to the project must follow these core principles.

- Community-led documentation. Documentation sources are hosted publicly and the community are able to make contributions
- Structured, well-formatted, clean documentation. Documentation should be clean and easy to read, from both a source and release standpoint
- Relevant. Documentation should be focused on the FIRST Robotics Competition.

Please see :ref:`contributing:Style Guide` for information on styling your documentation. 

Note on New Articles
--------------------
All new articles will undergo a review process before being merged into the repository. This review process will be done by members of the WPILib team. New Articles must be on official FIRST supported Software and Hardware. Documentation on unofficial libraries or sensors *will not* be accepted. This process may take some time to review, please be patient.

Minor revisions and rewrites will be accepted at a more generous rate.

Style Guide
-----------

Filenames
^^^^^^^^^

Use only lowercase alphanumeric characters and ``-`` (minus) symbol.

Suffix filenames with the ``.rst`` extention.

.. note:: If you are having issues editing files with the ``.rst`` extension, the recommended text editor is `Notepad++ <https://notepad-plus-plus.org/>`__. Please make sure that `tabs are replaced with spaces <https://stackoverflow.com/questions/455037/convert-tabs-to-spaces-in-notepad>`__, and the space indentation is set to ``3``.

Page References
^^^^^^^^^^^^^^^

Pages references will be auto-generated based on the page filename and section title. 

For example, given the following file ``contributing.rst`` and a section called ``Page References``, you would reference this by doing ``:ref:`contributing:Page References```
   
Text
^^^^

All text content should be on the same line, if you need readability, use the word-wrap function of your editor.

Use the following case for these terms:

- roboRIO (not RoboRIO, roboRio, or RoboRio)
- LabVIEW (not labview or LabView)

Use the ASCII character set for English text. For special characters (e.g. Greek symbols) use the `standard character entity sets <http://docutils.sourceforge.net/docs/ref/rst/definitions.html#character-entity-sets>`_.

Use ``.. math::`` for standalone equations and ``:math:`` for inline equations.  A useful LaTeX equation cheat sheet can be found `here <https://www.reed.edu/academic_support/pdfs/qskills/latexcheatsheet.pdf>`_.

Use literals for filenames, function, and variable names.

Whitespace
^^^^^^^^^^

Indentation
~~~~~~~~~~~

Indentation should *always* match the previous level of indentation *unless* you are creating a new content block.

Indentation of content directives as new line ``.. toctree::``  should be `3` spaces.

Blank Lines
~~~~~~~~~~~

There should be ``1`` blank lines seperating basic text blocks and section titles. There *should* be ``1`` blank line seperating text blocks *and* content directives.

Interior Whitespace
~~~~~~~~~~~~~~~~~~~

Use one space between sentences.

Headings
^^^^^^^^

Headings should be in the following strucutre

1. ``=`` for document titles. *Do not* use this more than *once* per article.
2. ``-`` for document sections
3. ``^`` for document sub-sections
4. ``~`` for document sub-sub-sections
5. If you need to use any lower levels of structure, you're doing things wrong.

Use title case for headings.

Code blocks
^^^^^^^^^^^

All code blocks should have a language specified.

1. Exception: Content where formatting must be preserved and has no language. Instead use ``none``.

Follow the `WPILib style guide <https://github.com/wpilibsuite/styleguide/>`_ for C++ and Java example code. For example, use two spaces for indentation in C++ and Java.

Links
^^^^^

Links should be in the following format

.. code-block:: none
   
   Hi there, `this is a link <http://example.com>`_ and it's pretty cool!

Images
^^^^^^

Images should be created with ``1`` new line seperating content and directive.

.. code-block:: none
   
   .. image:: images/image-1.png
   
Image Files
~~~~~~~~~~~

Image files should be stored in the document directory, sub-directory of ``images``

They should follow the naming scheme of ``document-title-1.png`` so on and so forth. 

They should be of the ``.png`` or ``.jpg`` image extension. ``.gif`` is acceptable in situations where image motion is required.

Toctree
^^^^^^^

There should be **no** local toctrees in any document. Ever. Additional toctrees are allowed in the following documents when appropriate:

1. ``software.rst``
2. ``hardware.rst``
3. ``networking.rst``
4. ``index.rst`` additions to this are on an approval only basis. 

Examples
^^^^^^^^
   
.. code-block:: none
   
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

FAQ
---

- Why Sphinx?

  - Because Sphinx is a simply, easy-to-use documentation build system with lots of flexibility and extendability. Other documentation systems such as MkDocs don't have the extendability that this project requires.

- Why reStructuredText?

  - reStruturedText is what Sphinx natively supports

- But... Sphinx supports Markdown through extensions

  - Yes, Sphinx does indeed support Markdown through extensions. However, Markdown has over 50 available flavours with multiple cons. See this excellent article for more information.

- Why was my page involving X not accepted?

  - It contains outdated or bad information
  - It involved unofficial FRC software
  - It contains unacceptable language
  - There was likely a comment regarding why on your Pull-Request. Please review it.

