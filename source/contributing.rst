.. _contributing:

Contributing to frc-docs
========================
Welcome to the contributiong guidelines for the frc-docs project. If you are unfamiliar to writing in the reStructuredText format, please read up on it `here <https://thomas-cokelaer.info/tutorials/sphinx/rest_syntax.html>`__.

Filenames
---------
Use only lowercase alphanumeric characters and ``-`` (minus) symbol.

Suffix filenames with the ``.rst`` extention.

.. note:: If you are having issues editing files with the ``.rst`` extension, the recommended text editor is `Notepad++ <https://notepad-plus-plus.org/>`__. Please make sure that `tabs are replaced with spaces <https://stackoverflow.com/questions/455037/convert-tabs-to-spaces-in-notepad>`__, and the space indentation is set to ``3``.

Page References
---------------
Pages must have a reference target title at the top of the page, before **all** content.

Page references must then be added to the ``document-reference-list.txt`` file located at ``source/``

.. code-block:: none
   
   .. _contributing:
   
   This is a title
   ===============
   
Whitespace
----------

Indentation
^^^^^^^^^^^

Indentation should *always* match the previous level of indentation *unless* you are creating a new content block.

Indetation of content directives as new line `.. toctree::``  should be `3` spaces.

Blank Lines
^^^^^^^^^^^
There should be *no* blank lines seperating basic text blocks and section titles. There *should* be ``1`` blank line seperating text blocks *and* content directives.

Headings
--------
Headings should be in the following strucutre

1. ``=`` for document titles. *Do not* use this more than *once* per article.
2. ``-`` for document sections
3. ``^`` for document sub-sections
4. ``~`` for document sub-sub-sections
5. If you need to use any lower levels of structure, you're doing things wrong.

Code blocks
-----------
All code blocks should have a language specified.

1. Exception: Content where formatting must be preserved and has no language. Instead use ``none``.

Links
-----
Links should be in the following format

.. code-block:: none
   
   Hi there, `this is a link <http://example.com>`__ and it's pretty cool!

Images
------
Images should be created with ``1`` new line seperating content and directive.

.. code-block:: none
   
   .. image:: images/image-1.png
   
Image Files
^^^^^^^^^^^
Image files should be stored in the document directory, sub-directory of ``images``

They should follow the naming scheme of ``document-title-1.png`` so on and so forth. 

They should be of the ``.png`` or ``.jpg`` image extension. ``.gif`` is acceptable in situations where image motion is required.

Toctree
-------
There should be **no** local toctrees in any document. Ever. Additional Toctrees are allowed in the following documents when appropriate:

1. ``software.rst``
2. ``hardware.rst``
3. ``networking.rst``
4. ``index.rst`` additions to this are on an approval only basis. 

Examples
--------
   
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
   