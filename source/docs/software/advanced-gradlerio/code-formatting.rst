Using a Code Formatter
======================

Code formatters exist to ensure that the style of code written is consistent throughout the entire codebase. This is used in many major projects; from Android to OpenCV. Teams may wish to add a formatter throughout their robot code to ensure that the codebase maintains readability and consistency throughout.

For this article, we will highlight using `Spotless <https://github.com/diffplug/spotless>`__ for Java teams and `wpiformat <https://github.com/wpilibsuite/styleguide/blob/main/wpiformat/README.rst>`__ for C++ teams.

Spotless
--------

Configuration
^^^^^^^^^^^^^

Necessary ``build.gradle`` changes are required to get Spotless functional. In the ``plugins {}`` block of your ``build.gradle``, add the Spotless plugin so it appears similar to the below.

.. code-block:: groovy

   plugins {
      id "java"
      id "edu.wpi.first.GradleRIO" version "2022.1.1"
      id 'com.diffplug.spotless' version '6.1.0'
   }

Then ensure you add a required ``spotless {}`` block to correctly configure spotless. This can just get placed at the end of your ``build.gradle``.

.. code-block:: groovy

   spotless {
      java {
         target fileTree('.') {
               include '**/*.java'
               exclude '**/build/**', '**/build-*/**'
         }
         toggleOffOn()
         googleJavaFormat()
         removeUnusedImports()
         trimTrailingWhitespace()
         endWithNewline()
      }
      groovyGradle {
         target fileTree('.') {
               include '**/*.gradle'
               exclude '**/build/**', '**/build-*/**'
         }
         greclipse()
         indentWithSpaces(4)
         trimTrailingWhitespace()
         endWithNewline()
      }
      format 'xml', {
         target fileTree('.') {
               include '**/*.xml'
               exclude '**/build/**', '**/build-*/**'
         }
         eclipseWtp('xml')
         trimTrailingWhitespace()
         indentWithSpaces(2)
         endWithNewline()
      }
      format 'misc', {
         target fileTree('.') {
               include '**/*.md', '**/.gitignore'
               exclude '**/build/**', '**/build-*/**'
         }
         trimTrailingWhitespace()
         indentWithSpaces(2)
         endWithNewline()
      }
   }

Running Spotless
^^^^^^^^^^^^^^^^

Spotless can be ran using ``./gradlew spotlessApply`` which will apply all formatting options. You can also specify a specific task by just adding the name of formatter. An example is ``./gradlew spotlessmiscApply``.

Spotless can also be used as a :doc:`CI check <robot-code-ci>`. The check is ran with ``./gradlew spotlessCheck``.

Explanation of Options
^^^^^^^^^^^^^^^^^^^^^^

Each ``format`` section highlights formatting of custom files in the project. The ``java`` and ``groovyGradle`` are natively supported by spotless, so they are defined differently.

Breaking this down, we can split this into multiple parts.

- Formatting Java
- Formatting Gradle files
- Formatting XML files
- Formatting Miscellaneous files

They are all similar, except for some small differences that will be explained. The below example will highlight the ``java {}`` block.

.. code-block:: groovy

   java {
      target fileTree('.') {
         include '**/*.java'
         exclude '**/build/**', '**/build-*/**'
      }
      toggleOffOn()
      googleJavaFormat()
      removeUnusedImports()
      trimTrailingWhitespace()
      endWithNewline()
   }

Let's explain what each of the options mean.

.. code-block:: groovy

   target fileTree('.') {
      include '**/*.java'
      exclude '**/build/**', '**/build-*/**'
   }

The above example tells spotless where our Java classes are and to exclude the ``build`` directory. The rest of the options are fairly self-explanatory.

- ``toggleOffOn()`` adds the ability to have spotless ignore specific portions of a project. The usage looks like the following

.. code-block:: java

   // format:off

   public void myWeirdFunction() {

   }

   // format:on

- ``googleJavaFormat()`` tells spotless to format according to the `Google Style Guide <https://google.github.io/styleguide/javaguide.html>`__
- ``removeUnusedImports()`` will remove any unused imports from any of your Java classes
- ``trimTrailingWhitespace()`` will remove any extra whitespace at the end of your lines
- ``endWithNewline()`` will add a newline character to the end of your classes

In the ``groovyGradle`` block, there is a ``greclipse`` option. This is the formatter that spotless uses to format gradle files.

Additionally, there is a ``eclipseWtp`` option in the ``xml`` block. This stands for "Gradle Web Tools Platform" and is the formatter to format ``xml`` files. Teams not using any XML files may wish to not include this configuration.

.. note:: A full list of configurations is available on the `Spotless README <https://github.com/diffplug/spotless>`__

Issues with Line Endings
^^^^^^^^^^^^^^^^^^^^^^^^

Spotless will attempt to apply line endings per-OS, which means Git diffs will be constantly changing if two users are on different OSes (Unix vs Windows). It's recommended that teams who contribute to the same repository from multiple OSes utilize a ``.gitattributes`` file. The following should suffice for handling line endings.

.. code-block:: text

   *.gradle text eol=lf
   *.java text eol=lf
   *.md text eol=lf
   *.xml text eol=lf

wpiformat
---------

Requirements
^^^^^^^^^^^^

- `Python 3.6 or higher <https://www.python.org/>`__
- clang-format (included with `LLVM <https://releases.llvm.org/download.html>`__)

.. important:: Windows is not currently supported at this time! Installing LLVM with Clang **will** break normal robot builds if installed on Windows.

You can install `wpiformat <https://github.com/wpilibsuite/styleguide/blob/main/wpiformat/README.rst>`__ by typing ``pip3 install wpiformat`` into a terminal or command prompt.

Usage
^^^^^

wpiformat can be ran by typing ``wpiformat`` in a console. This will format with ``clang-format``. Three configuration files are required (``.clang-format``, ``.styleguide``, ``.styleguide-license``). These must exist in the project root.

- ``.clang-format``: :download:`Download <https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/.clang-format>`
- ``.styleguide-license``: :download:`Download <https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/.styleguide-license>`

An example styleguide is shown below:

.. code-block:: text

   cppHeaderFileInclude {
      \.h$
      \.hpp$
      \.inc$
      \.inl$
   }

   cppSrcFileInclude {
      \.cpp$
   }

   modifiableFileExclude {
      gradle/
   }

.. note:: Teams can adapt ``.styleguide`` and ``.styleguide-license`` however they wish. It's important that these are not deleted, as they are required to run wpiformat!

You can turn this into a :doc:`CI check <robot-code-ci>` by running ``git --no-pager diff --exit-code HEAD``. It can be configured with a ``.clang-format`` configuration file. An example configuration file is provided below.

Below is an example GitHub Actions check that uses wpiformat

.. code-block:: yaml

   wpiformat:
    name: "wpiformat"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Fetch all history and metadata
        run: |
          git fetch --prune --unshallow
          git checkout -b pr
          git branch -f main origin/main
      - name: Set up Python 3.8
        uses: actions/setup-python@v2
        with:
          python-version: 3.8
      - name: Install clang-format
        run: sudo apt-get update -q && sudo apt-get install -y clang-format-12
      - name: Install wpiformat
        run: pip3 install wpiformat
      - name: Run
        run: wpiformat -clang 12
      - name: Check Output
        run: git --no-pager diff --exit-code HEAD
