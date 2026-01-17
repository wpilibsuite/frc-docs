.. include:: <isonum.txt>

# Style Guide

This document contains the various MD and RST/Sphinx specific guidelines for the frc-docs project. For guidelines related to the various WPILib code projects, see [the WPILib GitHub](https://github.com/wpilibsuite/styleguide)

## Filenames

Use only lowercase alphanumeric characters and ``-`` (minus) symbol.

For documents that will have an identical software/hardware name, append "Hardware" or "Software" to the end of the document name. IE, ``ultrasonics-hardware.rst``

Suffix filenames with the ``.rst`` extension.

.. note:: If you are having issues editing files with the ``.rst`` extension, the recommended text editor is VS Code with the [reStructuredText extension](https://marketplace.visualstudio.com/items?itemName=lextudio.restructuredtext).

## Text

All text content should be on the same line. If you need readability, use the word-wrap function of your editor.

Use the following case for these terms:

- roboRIO (not RoboRIO, roboRio, or RoboRio)
- LabVIEW (not labview or LabView)
- Visual Studio Code (VS Code) (not vscode, VScode, vs code, etc)
- macOS (not Mac OS, Mac OSX, Mac OS X, Mac, Mac OS, etc.)
- GitHub (not github, Github, etc)
- PowerShell (not powershell, Powershell, etc)
- Linux (not linux)
- Java (not java)

Use the ASCII character set for English text. For special characters (e.g. Greek symbols) use the [standard character entity sets](https://docutils.sourceforge.io/docs/ref/rst/definitions.html#character-entity-sets).

Use ``.. math::`` for standalone equations and ``:math:`` for inline equations.  A useful LaTeX equation cheat sheet can be found [here](https://www.reed.edu/academic_support/pdfs/qskills/latexcheatsheet.pdf).

Use literals for filenames, function, and variable names.

Use of the registered trademarks *FIRST*\ |reg| and FRC\ |reg| should follow the Policy from [this page](https://www.firstinspires.org/about/brand). Specifically, where possible (i.e. not nested inside other markup or in a document title), the first use of the trademarks should have the |reg| symbol and all instances of *FIRST* should be italicized. The |reg| symbol can be added by using ``.. include:: <isonum.txt>`` at the top of the document and then using ``*FIRST*\ |reg|`` or ``FRC\ |reg|``.

Commonly used terms should be added to the :ref:`docs/software/frc-glossary:FRC Glossary`.  You can reference items in the glossary by using ``:term:`deprecated```.

## Whitespace

### Indentation

Indentation should *always* match the previous level of indentation *unless* you are creating a new content block.

Indentation of content directives as new line ``.. toctree::``  should be `3` spaces.

### Blank Lines

There should be ``1`` blank line separating basic text blocks and section titles. There *should* be ``1`` blank line separating text blocks *and* content directives.

### Interior Whitespace

Use one space between sentences.

## Headings

Headings should be in the following structure.

1. ``#`` for document titles. *Do not* use this more than *once* per article.
2. ``##`` for document sections
3. ``###`` for document sub-sections
4. ``####`` for document sub-sub-sections
5. If you need to use any lower levels of structure, you're doing things wrong.

Use title case for headings.

## Lists

Lists should have a new line in between each indent level. The highest indent should have ``0`` indentation, and subsequent sublists should have an indentation starting at the first character of the previous indentation.

```ReST
- Block one
- Block two
- Block three
  - Sub 1
  - Sub 2
- Block four
```

## Code blocks

All code blocks should have a language specified.

````md
```python
print("Hello!")

import antigravity
```
````

1. Exception: Content where formatting must be preserved and has no language. Instead use ``text``.

Follow the [WPILib style guide](https://github.com/wpilibsuite/styleguide/) for C++ and Java example code. For example, use two spaces for indentation in C++ and Java.

## RLI (Remote Literal Include)

When possible, instead of using code blocks, an RLI should be used.  This pulls code lines directly from GitHub, most commonly using the example programs.  This automatically keeps the code up to date with any changes that are made.  The format of an RLI is:

```ReST
.. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
   :language: java
   :lines: 19-25
   :lineno-match:

.. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibcExamples/src/main/cpp/examples/GettingStarted/cpp/Robot.cpp
   :language: c++
   :lines: 50-60
   :lineno-match:

.. remoteliteralinclude:: https://raw.githubusercontent.com/robotpy/examples/242924b3843fdcc6efc2cefa8eac7bfff8b6bc48/GettingStarted/robot.py
   :language: python
   :lines: 12-29
   :lineno-match:
```

Make sure to link to the raw version of the file on GitHub. There is a handy ``Raw`` button in the top right corner of the page.

.. note:: RLIs should use a tag instead of main to ensure the documentation isn't broken the next time there is a change to the RLIed code. If a tag hasn't been created, use the full (40 character) commit hash.

## Tabs
To create code tabs in an article, you can use the ``.. tab-set-code::`` directive.  You can use md style \`\`\` codeblocks and ``rli`` directives inside. The format is:

````ReST
.. tab-set-code::
   .. remoteliteralinclude:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/wpilibjExamples/src/main/java/edu/wpi/first/wpilibj/examples/gettingstarted/Robot.java
      :language: java
      :lines: 19-25
      :lineno-match:
   
   ```c++
   // Start the timer.
   m_timer.Start();
   // Send Field2d to SmartDashboard.
   frc::SmartDashboard::PutData(&m_field);
   // Reset the drivetrain's odometry to the starting pose of the trajectory.
   m_drive.ResetOdometry(m_trajectory.InitialPose());
   // Send our generated trajectory to Field2d.
   m_field.GetObject("traj")->SetTrajectory(m_trajectory);
   ```
````

If you need to use more than one tab per language, multiple RLIs per language, or text tabs, you can use the ``.. tab-set::`` and ``.. tab-item::`` directive.  The format is:

```ReST
.. tab-set::
   .. tab-item:: Title
      :sync: sync-id
         Content
```

This example uses the sync argument to allow all of the tabs with the same key to be synced together.  This means that when you click on a tab, all of the tabs with the same key will open.

If you have a mix of ``tab-set`` and ``tab-set-code`` directives on a page, you can sync them by setting the sync id on the ``tab-item`` directives to ``tabcode-LANGUAGE``. For example, a java tab would have a sync id of ``tabcode-java``.

## Admonitions

Admonitions (list [here](https://docutils.sourceforge.io/docs/ref/rst/directives.html#admonitions)) should have their text on the same line as the admonition itself. There are exceptions to this rule, however, when having multiple sections of content inside of an admonition. Generally having multiple sections of content inside of an admonition is not recommended.

Use

```ReST
.. warning:: This is a warning!
```

NOT

```ReST
.. warning::
   This is a warning!
```

## Links

### Internal Links

Internal Links will be auto-generated based on the ReStructuredText filename and section title.

For example, here are several ways to link to sections and documents.

Use this format to reference a document section. You must use the absolute path of the document. ``:ref:`docs/software/hardware-apis/sensors/ultrasonics-software:Analog ultrasonics``` renders to :ref:`docs/software/hardware-apis/sensors/ultrasonics-software:Analog ultrasonics`.

Use this format to reference a section of the same document. Note the single underscore. ```Images`_`` renders to `Images`_.

Use this format to reference the top-level of a document. You can use relative paths ``:doc:`build-instructions``` renders to :doc:`build-instructions` Or to use absolute paths, put a forward slash at the beginning of the path ``:doc:`/docs/software/hardware-apis/sensors/ultrasonics-software``` renders to :doc:`/docs/software/hardware-apis/sensors/ultrasonics-software`. Note that the text rendered is the main section title of the target page regardless of the target filename.

When using ``:ref:`` or ``:doc:`` you may customize the displayed text by surrounding the actual link with angle brackets ``<>`` and adding the custom text between the first backtick ````` and the first angle bracket ``<``. For example ``:ref:`custom text <docs/software/hardware-apis/sensors/ultrasonics-software:Analog ultrasonics>``` renders to :ref:`custom text <docs/software/hardware-apis/sensors/ultrasonics-software:Analog ultrasonics>`.

### External Links

It is preferred to format external links as md style hyperlinks.

```md
Hi there, [this is a link](https://example.com) and it's pretty cool!
```

However, in some cases where the same link must be referenced multiple times, the syntax below is accepted.

```ReST
Hi there, `this is a link`_ and it's pretty cool!
..  _this is a link: https://example.com
```

### Python API Links

Links to the RobotPY API documentation should use the following sphinx [python syntax](https://www.sphinx-doc.org/en/master/usage/domains/python.html) (example linking to the DriverStation API docs).

```ReST
:py:class:`Python <robotpy:wpilib.DriverStation>`
```

This expands to be equivalent to:

```ReST
[Python](https://robotpy.readthedocs.io/projects/robotpy/en/stable/wpilib/DriverStation.html#wpilib.DriverStation)
```

## Images

Images should be created with ``1`` new line separating content and directive.

All images (including vectors) should be less than ``500`` kilobytes in size. Please make use of a smaller resolution and more efficient compression algorithms.

```ReST
.. image:: images/my-article/my-image.png
   :alt: Always add alt text here describing the image.
```

### Image Files

Image files should be stored in the document directory, sub-directory of ``document-name/images``.

They should follow the naming scheme of ``short-description.png``, where the name of the image is a short description of what the image shows. This should be less than ``24`` characters.

They should be of the ``.png`` or ``.jpg`` image extension. ``.gif`` is unacceptable due to storage and accessibility concerns.

.. note:: Accessibility is important! Images should be marked with a ``:alt:`` directive.

   ```ReST
   .. image:: images/my-document/my-image.png
      :alt: An example image
   ```

### Vector Images

SVG files are supported through the ``svg2pdfconverter`` Sphinx extension.

Simply use them as you would with any other image.

.. note:: Ensure that any embedded images in the vector do not bloat the vector to exceed the 500KB limit.

```ReST
.. image:: images/my-document/my-image.svg
   :alt: Always add alt text here describing the image.
```

### Draw.io Diagrams

Draw.io (also known as [diagrams.net](https://app.diagrams.net/)) diagrams are supported through ``svg`` files with embedded ``.drawio`` metadata, allowing the ``svg`` file to act as a source file of the diagrams, and to be rendered like a normal vector graphics file.

Simply use them like you would any other vector image, or any other image.

```ReST
.. image:: diagrams/my-document/diagram-1.drawio.svg
   :alt: Always add alt text here describing the image.
```

#### Draw.io Files

Draw.io files follow almost the same naming scheme as normal images. To keep track of files that have the embedded ``.drawio`` metadata, append a ``.drawio`` to the end of the file name, before the extension, meaning the name of the file should be ``document-title-1.drawio.svg`` and so on. Additionally, diagrams should be stored in the document directory in a sub-folder named ``diagrams``.

For the specifics of saving a diagram as a ``.svg`` with metadata, take a look at :ref:`docs/contributing/frc-docs/drawio-saving-instructions:Draw.io Saving Instructions`.

.. warning:: Make sure you don't modify any file that is in a ``diagrams`` folder, or ends in ``.drawio.svg`` in any program other than draw.io, otherwise you might risk breaking the metadata of the file, making it uneditable.

## File Extensions

File extensions should use code formatting. For example, use:

```text
``.png``
```

instead of:

```text
.png
".png"
"``.png``"
```

## Table of Contents (TOC)

Each category should contain an ``index.rst``. This index file should contain a ``maxdepth`` of ``1``. Sub-categories are acceptable, with a ``maxdepth`` of 1.

The category ``index.rst`` file can then be added to the root index file located at ``source/index.rst``.

## Examples

````ReST
# Title
This is an example article
```java
System.out.println("Hello World");
```
## Section
This is a section!
````

## Important Note!

This list is not exhaustive and administrators reserve the right to make changes. Changes will be reflected in this document.
